import { createR8LeadHandler } from "../_shared/r8-lead-handler.ts";
import { createR8LeadPersistence } from "../_shared/r8-lead-persistence.ts";

// Keep the static Next.js typecheck independent of Deno's runtime type package.
declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Promise<Response>): unknown;
};

const configuredOrigins = Deno.env.get("R8_ALLOWED_ORIGINS");
const persist = createR8LeadPersistence({
  supabaseUrl: Deno.env.get("SUPABASE_URL"),
  serviceRoleKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
});

Deno.serve(createR8LeadHandler({
  persist,
  allowedOrigins: configuredOrigins === undefined ? undefined : configuredOrigins.split(",").map((origin) => origin.trim()).filter(Boolean),
}));
