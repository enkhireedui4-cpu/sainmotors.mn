import { validateFeedback, type FeedbackInput } from "./feedback-validation.ts";

export interface FeedbackRecord {
  name: string;
  phone: string;
  audience: FeedbackInput["audience"];
  showroom?: string;
  message?: string;
  consent: true;
  consent_version: "contact-feedback-v1";
  locale: FeedbackInput["locale"];
}

export interface FeedbackHandlerOptions {
  persist: (record: FeedbackRecord) => Promise<{ id: string }>;
  allowedOrigins?: readonly string[];
}

const defaultOrigins = ["https://sainmotors.mn", "https://www.sainmotors.mn"];
const maxBodyBytes = 16 * 1024;
class BodyTooLarge extends Error {}

async function readJsonBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maxBodyBytes) throw new BodyTooLarge();
  if (!request.body) throw new Error("Missing body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > maxBodyBytes) {
        // Cancellation failure must not disguise the body-size rejection.
        try { await reader.cancel(); } catch { /* Already rejected. */ }
        throw new BodyTooLarge();
      }
      chunks.push(chunk.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

export function createFeedbackHandler(options: FeedbackHandlerOptions): (request: Request) => Promise<Response> {
  const origins = new Set((options.allowedOrigins ?? defaultOrigins).filter((origin) => {
    try {
      const url = new URL(origin);
      return (url.protocol === "https:" || url.protocol === "http:") && url.origin === origin;
    } catch {
      return false;
    }
  }));

  return async (request) => {
    const origin = request.headers.get("origin");
    const originAllowed = origin !== null && origins.has(origin);
    const headers = new Headers({ "cache-control": "no-store", vary: "Origin" });
    if (originAllowed) headers.set("access-control-allow-origin", origin);
    const error = (status: number, message = "Invalid request.") => Response.json({ error: message }, { status, headers });

    if (request.method !== "POST" && request.method !== "OPTIONS") {
      headers.set("allow", "POST, OPTIONS");
      return error(405);
    }
    if (!originAllowed) return error(403);

    if (request.method === "OPTIONS") {
      const method = request.headers.get("access-control-request-method");
      if (method !== null && method !== "POST") {
        headers.set("allow", "POST, OPTIONS");
        return error(405);
      }
      const requestedHeaders = request.headers.get("access-control-request-headers");
      if (requestedHeaders && requestedHeaders.split(",").some((header) => header.trim().toLowerCase() !== "content-type")) return error(403);
      headers.set("access-control-allow-methods", "POST, OPTIONS");
      headers.set("access-control-allow-headers", "content-type");
      headers.set("access-control-max-age", "600");
      return new Response(null, { status: 204, headers });
    }

    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return error(415);
    let input: unknown;
    try {
      input = await readJsonBody(request);
    } catch (cause) {
      return error(cause instanceof BodyTooLarge ? 413 : 400);
    }
    const result = validateFeedback(input);
    if (!result.ok) return Response.json({ error: "Invalid request.", errors: result.errors }, { status: 400, headers });

    const { name, phone, audience, showroom, message, locale } = result.data;
    try {
      const saved = await options.persist({
        name, phone, audience, locale,
        ...(showroom ? { showroom } : {}), ...(message ? { message } : {}),
        consent: true, consent_version: "contact-feedback-v1",
      });
      if (typeof saved?.id !== "string" || !saved.id.trim() || saved.id.length > 128 || /\p{Cc}/u.test(saved.id)) throw new Error("Missing acknowledgement");
      return Response.json({ id: saved.id.trim() }, { status: 201, headers });
    } catch {
      return error(503, "Unable to submit the request. Please try again.");
    }
  };
}
