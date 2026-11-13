import { validateR8Lead, type R8City } from "./r8-lead-validation.ts";

export interface R8LeadRecord {
  country: string;
  city?: R8City;
  first_name: string;
  last_name: string;
  phone: string;
  consent: true;
  consent_version: "r8-test-drive-v1";
  locale: "mn" | "en";
  car_model: "R8";
}

export interface R8LeadHandlerOptions {
  persist: (record: R8LeadRecord) => Promise<{ id: string }>;
  allowedOrigins?: readonly string[];
}

const defaultOrigins = ["https://sainmotors.mn", "https://www.sainmotors.mn"];
const maxBodyBytes = 4096;

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
        await reader.cancel();
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

export function createR8LeadHandler(options: R8LeadHandlerOptions): (request: Request) => Promise<Response> {
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
    const result = validateR8Lead(input);
    if (!result.ok) return Response.json({ error: "Invalid request.", errors: result.errors }, { status: 400, headers });

    const { country, city, firstName, lastName, phone, locale } = result.data;
    try {
      const saved = await options.persist({
        country, first_name: firstName, last_name: lastName, phone, locale,
        ...(city !== undefined ? { city } : {}),
        consent: true, consent_version: "r8-test-drive-v1", car_model: "R8",
      });
      if (typeof saved?.id !== "string" || !saved.id.trim() || saved.id.length > 128) throw new Error("Missing acknowledgement");
      return Response.json({ id: saved.id.trim() }, { status: 201, headers });
    } catch {
      return error(503, "Unable to submit the request. Please try again.");
    }
  };
}
