import { createServer } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { submitR8Lead, validateR8Lead } from "@/lib/r8-leads";
import { createR8LeadHandler, type R8LeadRecord } from "../../supabase/functions/_shared/r8-lead-handler.ts";
import { createR8LeadPersistence } from "../../supabase/functions/_shared/r8-lead-persistence.ts";

const validLead = {
  country: "Mongolia",
  firstName: "Бат",
  lastName: "Дорж",
  phone: "99112233",
  consent: true,
  locale: "mn" as const,
};

describe("R8 lead validation", () => {
  it.each(["ulaanbaatar", "erdenet", "darkhan"])("preserves the selected city %s", (city) => {
    const result = validateR8Lead({ ...validLead, city });
    expect(result.ok && result.data).toMatchObject({ city });
  });

  it.each(["", "other-city", 42, null])("rejects an unsupported supplied city %s", (city) => {
    expect(validateR8Lead({ ...validLead, city })).toEqual({ ok: false, errors: { city: "invalid" } });
  });

  it("trims names and converts a Mongolian local number to its international form", () => {
    expect(validateR8Lead({
      ...validLead,
      country: " Mongolia ",
      firstName: " Бат ",
      lastName: " Дорж ",
      phone: " 9911-2233 ",
      website: "  ",
      car_model: "Other car",
    })).toEqual({
      ok: true,
      data: {
        country: "Mongolia", firstName: "Бат", lastName: "Дорж",
        phone: "+97699112233", consent: true, locale: "mn", website: "",
      },
    });
  });

  it.each([
    ["Mongolia", "+976 (9911) 2233", "+97699112233"],
    ["United States", "+1 (202) 555-0123", "+12025550123"],
    ["United Kingdom", "441234567890", "+441234567890"],
    ["Other", "+1234567", "+1234567"],
    ["Other", "+123456789012345", "+123456789012345"],
  ])("accepts a complete phone number for %s", (country, phone, normalized) => {
    const result = validateR8Lead({ ...validLead, country, phone });
    expect(result.ok && result.data.phone).toBe(normalized);
  });

  it("reports required whitespace-only fields and literal consent", () => {
    expect(validateR8Lead({ country: " ", firstName: "\t", lastName: "", phone: " ", consent: false })).toEqual({
      ok: false,
      errors: { country: "required", firstName: "required", lastName: "required", phone: "required", consent: "consent", locale: "required" },
    });
  });

  it("applies name bounds to the trimmed value", () => {
    const result = validateR8Lead({ ...validLead, firstName: ` ${"A".repeat(100)} ` });
    expect(result.ok && result.data.firstName).toBe("A".repeat(100));
  });

  it.each([false, "true", 1, null, undefined])("does not accept %s in place of consent", (consent) => {
    expect(validateR8Lead({ ...validLead, consent })).toEqual({ ok: false, errors: { consent: "consent" } });
  });

  it.each([
    ["Mongolia", "9911223"],
    ["Mongolia", "991122334"],
    ["Mongolia", "+9769911223"],
    ["Mongolia", "97699112233"],
    ["Other", "+123456"],
    ["Other", "+1234567890123456"],
    ["Other", "+1-202-CALL-NOW"],
    ["Other", "++12025550123"],
    ["Other", "+12025550123 ext 2"],
    ["Other", "+1202\n5550123"],
  ])("rejects an incomplete or malformed phone for %s", (country, phone) => {
    expect(validateR8Lead({ ...validLead, country, phone })).toEqual({ ok: false, errors: { phone: "invalid" } });
  });

  it.each([
    ["country", 42],
    ["firstName", []],
    ["lastName", {}],
    ["phone", 99112233],
    ["locale", "fr"],
    ["website", "https://spam.example"],
    ["website", true],
    ["firstName", "A\u0000B"],
    ["country", "A".repeat(101)],
    ["firstName", "A".repeat(101)],
    ["lastName", "B".repeat(101)],
    ["phone", " ".repeat(60) + "99112233"],
  ])("rejects invalid or overlong %s", (field, value) => {
    expect(validateR8Lead({ ...validLead, [field]: value })).toEqual({ ok: false, errors: { [field]: "invalid" } });
  });

  it.each([null, [], 1, "lead"])("rejects non-object input %s", (input) => {
    const result = validateR8Lead(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual({
        country: "required", firstName: "required", lastName: "required",
        phone: "required", consent: "consent", locale: "required",
      });
    }
  });
});

const leadId = "11d2a1cc-360b-456b-afd2-58cd4da15d60";
const productionOrigin = "https://sainmotors.mn";

function leadRequest(body: unknown = validLead, headers: Record<string, string> = {}): Request {
  return new Request("https://receiver.example/submit-r8-lead", {
    method: "POST",
    headers: { origin: productionOrigin, "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function leadStore() {
  const records: R8LeadRecord[] = [];
  return {
    records,
    persist: async (record: R8LeadRecord) => {
      records.push(record);
      return { id: leadId };
    },
  };
}

describe("R8 lead HTTP receiver", () => {
  it("sends the chosen city to storage alongside the normalized phone", async () => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(leadRequest({ ...validLead, city: "darkhan" }));
    expect(response.status).toBe(201);
    expect(store.records).toEqual([{
      country: "Mongolia", city: "darkhan", first_name: "Бат", last_name: "Дорж", phone: "+97699112233",
      consent: true, consent_version: "r8-test-drive-v1", locale: "mn", car_model: "R8",
    }]);
  });

  it("stores a normalized R8 record and only returns the stored id", async () => {
    const store = leadStore();
    const handler = createR8LeadHandler(store);
    const response = await handler(leadRequest({ ...validLead, firstName: " Бат ", car_model: "Other", id: "untrusted" }));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: leadId });
    expect(store.records).toEqual([{
      country: "Mongolia", first_name: "Бат", last_name: "Дорж", phone: "+97699112233",
      consent: true, consent_version: "r8-test-drive-v1", locale: "mn", car_model: "R8",
    }]);
    expect(response.headers.get("access-control-allow-origin")).toBe(productionOrigin);
    expect(response.headers.get("vary")).toBe("Origin");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("does not acknowledge a lead while storage is still pending", async () => {
    let finish!: (result: { id: string }) => void;
    const stored = new Promise<{ id: string }>((resolve) => { finish = resolve; });
    const handler = createR8LeadHandler({ persist: async () => stored });
    let settled = false;
    const pending = handler(leadRequest()).then((response) => { settled = true; return response; });
    await new Promise<void>((resolve) => setImmediate(resolve));
    expect(settled).toBe(false);
    finish({ id: leadId });
    expect((await pending).status).toBe(201);
  });

  it.each([
    { firstName: " " }, { lastName: "\t" }, { phone: "call me" },
    { consent: "true" }, { locale: "fr" }, { website: "spam" },
  ])("rejects invalid input before storing anything: %j", async (changes) => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(leadRequest({ ...validLead, ...changes }));
    expect(response.status).toBe(400);
    expect(await response.json()).not.toHaveProperty("id");
    expect(store.records).toEqual([]);
  });

  it.each(["GET", "PUT", "DELETE", "PATCH"])("only allows POST and OPTIONS, rejecting %s", async (method) => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(new Request("https://receiver.example", { method, headers: { origin: productionOrigin } }));
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST, OPTIONS");
    expect(store.records).toEqual([]);
  });

  it("answers an allowed JSON preflight without storing a lead", async () => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(new Request("https://receiver.example", {
      method: "OPTIONS",
      headers: { origin: "https://www.sainmotors.mn", "access-control-request-method": "POST", "access-control-request-headers": "Content-Type" },
    }));
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(response.headers.get("access-control-allow-origin")).toBe("https://www.sainmotors.mn");
    expect(response.headers.get("access-control-allow-methods")).toBe("POST, OPTIONS");
    expect(response.headers.get("access-control-allow-headers")).toBe("content-type");
    expect(store.records).toEqual([]);
  });

  it.each(["https://sainmotors.mn.evil.example", "https://evil.example", "null", "http://localhost:3200"])("rejects an unapproved origin %s", async (origin) => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(leadRequest(validLead, { origin }));
    expect(response.status).toBe(403);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(store.records).toEqual([]);
  });

  it("rejects missing Origin rather than granting a wildcard", async () => {
    const store = leadStore();
    const request = leadRequest();
    request.headers.delete("origin");
    const response = await createR8LeadHandler(store)(request);
    expect(response.status).toBe(403);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(store.records).toEqual([]);
  });

  it("allows a local preview only when explicitly configured", async () => {
    const store = leadStore();
    const response = await createR8LeadHandler({ ...store, allowedOrigins: ["http://localhost:3200"] })(leadRequest(validLead, { origin: "http://localhost:3200" }));
    expect(response.status).toBe(201);
    expect(store.records).toHaveLength(1);
    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:3200");
  });

  it("does not approve a preflight for an unrelated request header", async () => {
    const response = await createR8LeadHandler(leadStore())(new Request("https://receiver.example", {
      method: "OPTIONS",
      headers: { origin: productionOrigin, "access-control-request-method": "POST", "access-control-request-headers": "content-type, x-unapproved" },
    }));
    expect(response.status).toBe(403);
  });

  it("rejects malformed JSON before storage", async () => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(new Request("https://receiver.example", {
      method: "POST", headers: { origin: productionOrigin, "content-type": "application/json; charset=utf-8" }, body: "{",
    }));
    expect(response.status).toBe(400);
    expect(store.records).toEqual([]);
  });

  it("requires JSON rather than accepting a cross-site form post", async () => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(leadRequest(validLead, { "content-type": "text/plain" }));
    expect(response.status).toBe(415);
    expect(store.records).toEqual([]);
  });

  it("bounds the actual body bytes without trusting Content-Length", async () => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(leadRequest({ ...validLead, ignored: "Б".repeat(2100) }));
    expect(response.status).toBe(413);
    expect(store.records).toEqual([]);
  });

  it("rejects a declared oversized body before parsing", async () => {
    const store = leadStore();
    const response = await createR8LeadHandler(store)(leadRequest(validLead, { "content-length": "999999" }));
    expect(response.status).toBe(413);
    expect(store.records).toEqual([]);
  });

  it("returns a generic retriable failure when storage rejects", async () => {
    const response = await createR8LeadHandler({ persist: async () => { throw new Error("secret database connection credential"); } })(leadRequest());
    expect(response.status).toBe(503);
    const body = await response.text();
    expect(body).not.toContain("secret");
    expect(JSON.parse(body)).not.toHaveProperty("id");
    expect(response.headers.get("access-control-allow-origin")).toBe(productionOrigin);
  });

  it("cannot turn an empty storage acknowledgement into success", async () => {
    const response = await createR8LeadHandler({ persist: async () => ({ id: "" }) })(leadRequest());
    expect(response.status).toBe(503);
    expect(await response.json()).not.toHaveProperty("id");
  });
});

const closeFixtures: Array<() => Promise<void>> = [];
afterEach(async () => {
  await Promise.all(closeFixtures.splice(0).map((close) => close()));
});

async function serveFixture(handle: (request: Request) => Promise<Response> | Response): Promise<string> {
  const server = createServer(async (incoming, outgoing) => {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of incoming) chunks.push(Buffer.from(chunk));
      const headers = new Headers();
      for (let index = 0; index < incoming.rawHeaders.length; index += 2) headers.append(incoming.rawHeaders[index], incoming.rawHeaders[index + 1]);
      const request = new Request(`http://127.0.0.1${incoming.url}`, {
        method: incoming.method, headers,
        ...(incoming.method === "GET" || incoming.method === "HEAD" ? {} : { body: Buffer.concat(chunks).toString("utf8") }),
      });
      const response = await handle(request);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      outgoing.writeHead(500);
      outgoing.end();
    }
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  closeFixtures.push(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No test HTTP address");
  return `http://127.0.0.1:${address.port}`;
}

describe("R8 lead browser transport", () => {
  it("sends normalized JSON to the actual HTTP receiver and returns the stored id", async () => {
    const store = leadStore();
    const handler = createR8LeadHandler(store);
    const endpoint = await serveFixture(handler);
    const browserFetch: typeof fetch = (input, init) => {
      const headers = new Headers(init?.headers);
      // Browsers add Origin automatically; Node's fetch does not.
      headers.set("origin", productionOrigin);
      return fetch(input, { ...init, headers });
    };
    expect(await submitR8Lead({ ...validLead, firstName: " Бат " }, { endpoint, fetcher: browserFetch })).toEqual({ id: leadId });
    expect(store.records).toEqual([{
      country: "Mongolia", first_name: "Бат", last_name: "Дорж", phone: "+97699112233",
      consent: true, consent_version: "r8-test-drive-v1", locale: "mn", car_model: "R8",
    }]);
  });

  it("uses the selected Supabase endpoint without exposing an API key", async () => {
    let received: Request | undefined;
    const fetcher: typeof fetch = async (input, init) => {
      received = new Request(input, init);
      return Response.json({ id: leadId }, { status: 201 });
    };
    await submitR8Lead(validLead, { fetcher });
    expect(received?.url).toBe("https://uzffaelpmhwffcuiqgjq.supabase.co/functions/v1/submit-r8-lead");
    expect(received?.method).toBe("POST");
    expect(received?.headers.get("authorization")).toBeNull();
    expect(received?.headers.get("apikey")).toBeNull();
    expect(received?.credentials).toBe("omit");
    expect(received?.redirect).toBe("error");
    expect(await received?.json()).toEqual({
      country: "Mongolia", firstName: "Бат", lastName: "Дорж", phone: "+97699112233", consent: true, locale: "mn",
    });
  });

  it.each([
    [503, { error: "service unavailable" }],
    [400, { id: leadId }],
    [201, {}],
    [201, { id: " " }],
    [201, { id: 42 }],
    [200, { ok: true }],
    [201, [{ id: leadId }]],
    [201, null],
  ])("rejects HTTP %i without a valid acknowledged id: %j", async (status, body) => {
    let requests = 0;
    const endpoint = await serveFixture(() => { requests += 1; return Response.json(body, { status }); });
    await expect(submitR8Lead(validLead, { endpoint })).rejects.toThrow();
    expect(requests).toBe(1);
  });

  it("rejects an HTML error page instead of showing success", async () => {
    let requests = 0;
    const endpoint = await serveFixture(() => { requests += 1; return new Response("<html>Unavailable</html>", { status: 200 }); });
    await expect(submitR8Lead(validLead, { endpoint })).rejects.toThrow();
    expect(requests).toBe(1);
  });

  it("does not send invalid input to the receiver", async () => {
    let requests = 0;
    const endpoint = await serveFixture(() => { requests += 1; return Response.json({ id: leadId }); });
    await expect(submitR8Lead({ ...validLead, firstName: " " }, { endpoint })).rejects.toThrow();
    expect(requests).toBe(0);
  });

  it("surfaces a network rejection as a generic submission failure", async () => {
    const fetcher: typeof fetch = async () => { throw new Error("private network diagnostic"); };
    await expect(submitR8Lead(validLead, { fetcher })).rejects.toThrow("Unable to submit");
  });
});

describe("R8 lead PostgREST persistence", () => {
  it("inserts a server-validated record using the server key and requests only its id", async () => {
    let received: Request | undefined;
    const supabaseUrl = await serveFixture((request) => {
      received = request;
      return Response.json([{ id: leadId }], { status: 201 });
    });
    const persist = createR8LeadPersistence({ supabaseUrl, serviceRoleKey: "test-server-key" });
    const response = await createR8LeadHandler({ persist })(leadRequest());
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: leadId });
    expect(new URL(received!.url).pathname + new URL(received!.url).search).toBe("/rest/v1/r8_leads?select=id");
    expect(received?.method).toBe("POST");
    expect(received?.headers.get("authorization")).toBe("Bearer test-server-key");
    expect(received?.headers.get("apikey")).toBe("test-server-key");
    expect(received?.headers.get("prefer")).toBe("return=representation");
    expect(await received?.json()).toEqual({
      country: "Mongolia", first_name: "Бат", last_name: "Дорж", phone: "+97699112233",
      consent: true, consent_version: "r8-test-drive-v1", locale: "mn", car_model: "R8",
    });
  });

  it.each([
    [500, { message: "private database error" }],
    [201, []],
    [201, [{}]],
    [201, [{ id: "" }]],
    [201, { id: leadId }],
    [201, [{ id: leadId }, { id: "unexpected-second-row" }]],
  ])("fails the HTTP request when storage HTTP %i does not acknowledge one row", async (status, body) => {
    let requests = 0;
    const supabaseUrl = await serveFixture(() => { requests += 1; return Response.json(body, { status }); });
    const response = await createR8LeadHandler({ persist: createR8LeadPersistence({ supabaseUrl, serviceRoleKey: "test-server-key" }) })(leadRequest());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private");
    expect(requests).toBe(1);
  });

  it("keeps preflight working but rejects submission when server credentials are unconfigured", async () => {
    const handler = createR8LeadHandler({ persist: createR8LeadPersistence({}) });
    const preflight = await handler(new Request("https://receiver.example", { method: "OPTIONS", headers: { origin: productionOrigin } }));
    expect(preflight.status).toBe(204);
    const response = await handler(leadRequest());
    expect(response.status).toBe(503);
    expect(await response.json()).not.toHaveProperty("id");
  });
});
