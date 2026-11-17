import { describe, expect, it } from "vitest";
import { validateFeedback } from "../../supabase/functions/_shared/feedback-validation.ts";
import { createFeedbackHandler, type FeedbackRecord } from "../../supabase/functions/_shared/feedback-handler.ts";
import { createFeedbackPersistence } from "../../supabase/functions/_shared/feedback-persistence.ts";

const validFeedback = {
  name: " Бат ", phone: "99112233", audience: "client", consent: true,
  locale: "mn", website: "",
};

describe("contact feedback validation", () => {
  it("normalizes the phone and name while discarding unknown properties", () => {
    expect(validateFeedback({ ...validFeedback, admin: true })).toEqual({
      ok: true, data: { name: "Бат", phone: "+97699112233", audience: "client", consent: true, locale: "mn", website: "" },
    });
  });

  it.each(["99112233", "+97699112233", "+976 (9911) 2233", " 9911-2233 "])("normalizes Mongolian phone %s", (phone) => {
    const result = validateFeedback({ ...validFeedback, phone });
    expect(result.ok && result.data.phone).toBe("+97699112233");
  });

  it.each(["client", "employee", "dealer"])("accepts audience %s", (audience) => {
    const result = validateFeedback({ ...validFeedback, audience, showroom: "ub-central", message: "First line\r\nSecond\tline" });
    expect(result.ok && result.data).toMatchObject({ audience, showroom: "ub-central", message: "First line\nSecond\tline" });
  });

  it("permits omitted optional text and the exact name/message boundaries", () => {
    expect(validateFeedback({ ...validFeedback, name: "AB", showroom: "", message: "" }).ok).toBe(true);
    expect(validateFeedback({ ...validFeedback, name: "Ө".repeat(80), showroom: "a".repeat(80), message: "Ө".repeat(2000) }).ok).toBe(true);
  });

  it.each([
    ["name", "A"], ["name", "a".repeat(81)], ["name", "A\nB"], ["name", "A\u0000B"], ["name", 10],
    ["phone", "9911223"], ["phone", "991122334"], ["phone", "97699112233"], ["phone", "+12025550123"],
    ["phone", "9911\n2233"], ["phone", 99112233], ["phone", " ".repeat(65) + "99112233"],
    ["audience", "other"], ["audience", null], ["showroom", "UB Central Showroom"], ["showroom", "a".repeat(81)], ["showroom", 2],
    ["message", "a".repeat(2001)], ["message", "Hi\u0000there"], ["message", "Hi\u007fthere"], ["message", "Hi\u202ethere"], ["message", {}],
    ["locale", "fr"], ["consent", "true"], ["consent", false], ["website", "spam"], ["website", " "], ["website", null],
  ])("rejects unsafe or invalid %s (%s)", (field, value) => {
    const result = validateFeedback({ ...validFeedback, [field]: value });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toEqual([field]);
  });

  it.each([null, [], "feedback", 1, {}])("rejects incomplete/nonobject input %s", (input) => {
    const result = validateFeedback(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["audience", "consent", "locale", "name", "phone", "website"]);
  });
});

const storageRecord: FeedbackRecord = {
  name: "Бат", phone: "+97699112233", audience: "client", consent: true,
  consent_version: "contact-feedback-v1", locale: "mn",
};

describe("contact feedback persistence", () => {
  it("inserts to the private feedback table and confirms one returned id", async () => {
    const requests: Request[] = [];
    const persist = createFeedbackPersistence({
      supabaseUrl: "https://project.supabase.co", serviceRoleKey: "server-test-key",
      fetcher: async (input, init) => {
        requests.push(new Request(input, init));
        return Response.json([{ id: receiptId }], { status: 201 });
      },
    });
    expect(await persist(storageRecord)).toEqual({ id: receiptId });
    expect(requests).toHaveLength(1);
    const sent = requests[0];
    expect(sent.url).toBe("https://project.supabase.co/rest/v1/feedback_requests?select=id");
    expect(sent.method).toBe("POST");
    expect(sent.headers.get("authorization")).toBe("Bearer server-test-key");
    expect(sent.headers.get("apikey")).toBe("server-test-key");
    expect(sent.headers.get("prefer")).toBe("return=representation");
    expect(sent.redirect).toBe("error");
    expect(await sent.json()).toEqual({
      name: "Бат", phone: "+97699112233", audience: "client", consent: true,
      consent_version: "contact-feedback-v1", locale: "mn",
    });
  });

  it.each([
    { supabaseUrl: undefined, serviceRoleKey: "test" },
    { supabaseUrl: "https://project.supabase.co", serviceRoleKey: undefined },
    { supabaseUrl: "https://project.supabase.co", serviceRoleKey: " " },
    { supabaseUrl: "http://project.supabase.co", serviceRoleKey: "test" },
    { supabaseUrl: "https://test:secret@project.supabase.co", serviceRoleKey: "test" },
    { supabaseUrl: "https://project.supabase.co/path", serviceRoleKey: "test" },
    { supabaseUrl: "https://project.supabase.co?key=secret", serviceRoleKey: "test" },
    { supabaseUrl: "https://project.supabase.co#fragment", serviceRoleKey: "test" },
    { supabaseUrl: "invalid", serviceRoleKey: "test" },
  ])("fails closed before fetch for invalid storage configuration $supabaseUrl", async (config) => {
    let fetched = false;
    await expect(createFeedbackPersistence({ ...config, fetcher: async () => { fetched = true; return Response.json([{ id: receiptId }]); } })(storageRecord)).rejects.toThrow("Feedback storage unavailable");
    expect(fetched).toBe(false);
  });

  it.each([[], [{ id: receiptId }, { id: receiptId }], {}, { id: receiptId }, [null], [{}], [{ id: "" }], [{ id: " " }], [{ id: "x".repeat(129) }], [{ id: "bad\nid" }], [{ id: 3 }]].map((body) => ({ body })))("rejects malformed acknowledgement $body", async ({ body }) => {
    const persist = createFeedbackPersistence({ supabaseUrl: "https://project.supabase.co", serviceRoleKey: "test", fetcher: async () => Response.json(body) });
    await expect(persist(storageRecord)).rejects.toThrow("Feedback storage unavailable");
  });

  it.each([400, 401, 403, 409, 500])("rejects a storage HTTP %s even with an id-shaped response", async (status) => {
    const persist = createFeedbackPersistence({ supabaseUrl: "https://project.supabase.co", serviceRoleKey: "test", fetcher: async () => Response.json([{ id: receiptId }], { status }) });
    await expect(persist(storageRecord)).rejects.toThrow("Feedback storage unavailable");
  });

  it("hides malformed JSON and transport failures", async () => {
    for (const fetcher of [
      async () => new Response("not json"),
      async () => { throw new Error("99112233 secret-key"); },
    ]) {
      await expect(createFeedbackPersistence({ supabaseUrl: "https://project.supabase.co", serviceRoleKey: "test", fetcher })(storageRecord)).rejects.toThrow(/^Feedback storage unavailable$/);
    }
  });

  it("allows an explicitly configured local Supabase URL with a stubbed transport", async () => {
    const persist = createFeedbackPersistence({ supabaseUrl: "http://127.0.0.1:54321", serviceRoleKey: "test", fetcher: async () => Response.json([{ id: receiptId }]) });
    expect(await persist(storageRecord)).toEqual({ id: receiptId });
  });
});

const receiptId = "073870f7-2850-4e74-b847-619c466253e7";
const origin = "https://sainmotors.mn";
function feedbackRequest(body: unknown = validFeedback, headers: Record<string, string> = {}) {
  return new Request("https://receiver.example/submit-feedback", {
    method: "POST", headers: { origin, "content-type": "application/json", ...headers }, body: JSON.stringify(body),
  });
}

describe("contact feedback HTTP receiver", () => {
  it("returns a receipt only after normalized feedback is persisted", async () => {
    const records: FeedbackRecord[] = [];
    let acknowledge!: (value: { id: string }) => void;
    const pending = createFeedbackHandler({ persist: (record) => {
      records.push(record);
      return new Promise((resolve) => { acknowledge = resolve; });
    } })(feedbackRequest({ ...validFeedback, showroom: "ub-central", message: "Call me\nplease", spoofed: "discard" }));
    let completed = false;
    void pending.then(() => { completed = true; });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(completed).toBe(false);
    expect(records).toEqual([{
      name: "Бат", phone: "+97699112233", audience: "client", showroom: "ub-central", message: "Call me\nplease",
      consent: true, consent_version: "contact-feedback-v1", locale: "mn",
    }]);
    acknowledge({ id: receiptId });
    const response = await pending;
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: receiptId });
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
    expect(response.headers.get("access-control-allow-credentials")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it.each(["https://evil.example", "https://sainmotors.mn.evil.example", "http://localhost:3200", "null"])("rejects nonproduction origin %s without reflecting it", async (untrusted) => {
    const response = await createFeedbackHandler({ persist: async () => { throw new Error("must not persist"); } })(feedbackRequest(validFeedback, { origin: untrusted }));
    expect(response.status).toBe(403);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("rejects requests without an Origin header", async () => {
    const request = feedbackRequest();
    request.headers.delete("origin");
    expect((await createFeedbackHandler({ persist: async () => ({ id: receiptId }) })(request)).status).toBe(403);
  });

  it("allows explicitly configured exact development origins", async () => {
    const response = await createFeedbackHandler({ allowedOrigins: ["http://localhost:3200"], persist: async () => ({ id: receiptId }) })(feedbackRequest(validFeedback, { origin: "http://localhost:3200" }));
    expect(response.status).toBe(201);
    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:3200");
  });

  it.each([[], ["*"], ["https://sainmotors.mn/path"], ["https://sainmotors.mn/"]].map((allowedOrigins) => ({ allowedOrigins })))("fails closed for an empty/invalid origin configuration $allowedOrigins", async ({ allowedOrigins }) => {
    expect((await createFeedbackHandler({ allowedOrigins, persist: async () => ({ id: receiptId }) })(feedbackRequest())).status).toBe(403);
  });

  it("answers allowed JSON preflights", async () => {
    const response = await createFeedbackHandler({ persist: async () => { throw new Error("must not persist"); } })(new Request("https://receiver.example", {
      method: "OPTIONS", headers: { origin, "access-control-request-method": "POST", "access-control-request-headers": "Content-Type" },
    }));
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
    expect(response.headers.get("access-control-allow-methods")).toBe("POST, OPTIONS");
    expect(response.headers.get("access-control-allow-headers")).toBe("content-type");
    expect(response.headers.get("vary")).toContain("Origin");
  });

  it.each([["PUT", "content-type", 405], ["POST", "authorization", 403]])("rejects unsupported preflight %s/%s", async (method, header, status) => {
    const response = await createFeedbackHandler({ persist: async () => ({ id: receiptId }) })(new Request("https://receiver.example", {
      method: "OPTIONS", headers: { origin, "access-control-request-method": method as string, "access-control-request-headers": header as string },
    }));
    expect(response.status).toBe(status);
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
  });

  it("rejects GET with an Allow header", async () => {
    const response = await createFeedbackHandler({ persist: async () => ({ id: receiptId }) })(new Request("https://receiver.example", { headers: { origin } }));
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST, OPTIONS");
  });

  it("returns field errors without persisting invalid data", async () => {
    const response = await createFeedbackHandler({ persist: async () => { throw new Error("must not persist"); } })(feedbackRequest({ ...validFeedback, consent: false }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid request.", errors: { consent: "consent" } });
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
  });

  it("rejects non-JSON content types", async () => {
    expect((await createFeedbackHandler({ persist: async () => ({ id: receiptId }) })(feedbackRequest(validFeedback, { "content-type": "text/plain" }))).status).toBe(415);
  });

  it("rejects malformed JSON and invalid UTF-8", async () => {
    const handler = createFeedbackHandler({ persist: async () => ({ id: receiptId }) });
    for (const body of ["{", new Uint8Array([0xff])]) {
      expect((await handler(new Request("https://receiver.example", { method: "POST", headers: { origin, "content-type": "application/json" }, body }))).status).toBe(400);
    }
  });

  it("rejects excessive declared body lengths before reading", async () => {
    const response = await createFeedbackHandler({ persist: async () => ({ id: receiptId }) })(feedbackRequest(validFeedback, { "content-length": "16385" }));
    expect(response.status).toBe(413);
  });

  it("bounds streamed bytes without trusting Content-Length and cancels overflow", async () => {
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) { controller.enqueue(new Uint8Array(8192)); controller.enqueue(new Uint8Array(8193)); },
      cancel() { cancelled = true; },
    });
    const request = new Request("https://receiver.example", {
      method: "POST", headers: { origin, "content-type": "application/json", "content-length": "1" }, body: stream, duplex: "half",
    } as RequestInit & { duplex: string });
    const response = await createFeedbackHandler({ persist: async () => { throw new Error("must not persist"); } })(request);
    expect(response.status).toBe(413);
    expect(cancelled).toBe(true);
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
  });

  it.each([null, {}, { id: "" }, { id: " " }, { id: "x".repeat(129) }, { id: "bad\nid" }, { id: 1 }])("never returns a receipt for malformed storage acknowledgement %s", async (saved) => {
    const response = await createFeedbackHandler({ persist: async () => saved as { id: string } })(feedbackRequest());
    expect(response.status).toBe(503);
    expect(await response.json()).not.toHaveProperty("id");
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
  });

  it("does not expose persistence errors containing personal data or credentials", async () => {
    const response = await createFeedbackHandler({ persist: async () => { throw new Error("99112233 secret-key"); } })(feedbackRequest());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toMatch(/99112233|secret-key/);
  });
});
