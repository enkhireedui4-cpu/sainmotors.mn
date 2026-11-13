import type { R8LeadHandlerOptions } from "./r8-lead-handler.ts";

export function createR8LeadPersistence(options: { supabaseUrl?: string; serviceRoleKey?: string; fetcher?: typeof fetch }): R8LeadHandlerOptions["persist"] {
  return async (record) => {
    const unavailable = () => new Error("Lead storage unavailable");
    const key = options.serviceRoleKey?.trim();
    if (!options.supabaseUrl || !key) throw unavailable();
    try {
      const base = new URL(options.supabaseUrl);
      const local = base.protocol === "http:" && (base.hostname === "localhost" || base.hostname === "127.0.0.1");
      if ((!local && base.protocol !== "https:") || base.username || base.password || base.search || base.hash || base.pathname !== "/") throw unavailable();
      const endpoint = new URL("/rest/v1/r8_leads?select=id", base);
      const response = await (options.fetcher ?? fetch)(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: key,
          authorization: `Bearer ${key}`,
          prefer: "return=representation",
        },
        body: JSON.stringify(record),
        redirect: "error",
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw unavailable();
      const body: unknown = await response.json();
      const id = Array.isArray(body) && body.length === 1 && body[0] !== null && typeof body[0] === "object" ? body[0].id : undefined;
      if (typeof id !== "string" || !id.trim() || id.length > 128) throw unavailable();
      return { id: id.trim() };
    } catch {
      throw unavailable();
    }
  };
}
