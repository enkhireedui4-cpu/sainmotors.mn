import { createFeedbackHandler } from "../_shared/feedback-handler.ts";
import { createFeedbackPersistence } from "../_shared/feedback-persistence.ts";

// Keep the static Next.js typecheck independent of Deno's runtime type package.
declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Promise<Response>): unknown;
};

const configuredOrigins = Deno.env.get("FEEDBACK_ALLOWED_ORIGINS");
const persist = createFeedbackPersistence({
  supabaseUrl: Deno.env.get("SUPABASE_URL"),
  serviceRoleKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
});

Deno.serve(createFeedbackHandler({
  persist,
  allowedOrigins: configuredOrigins === undefined ? undefined : configuredOrigins.split(",").map((origin) => origin.trim()).filter(Boolean),
}));
