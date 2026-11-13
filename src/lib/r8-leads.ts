import { validateR8Lead, type R8LeadInput } from "../../supabase/functions/_shared/r8-lead-validation.ts";

export { validateR8Lead };
export { r8Cities } from "../../supabase/functions/_shared/r8-lead-validation.ts";
export type { R8LeadInput };

const defaultEndpoint = "https://uzffaelpmhwffcuiqgjq.supabase.co/functions/v1/submit-r8-lead";

export async function submitR8Lead(input: R8LeadInput, options: { endpoint?: string; fetcher?: typeof fetch } = {}): Promise<{ id: string }> {
  const invalid = () => new Error("Unable to submit the test-drive request. Please try again.");
  const validated = validateR8Lead(input);
  if (!validated.ok) throw invalid();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await (options.fetcher ?? fetch)(options.endpoint ?? defaultEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validated.data),
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      signal: controller.signal,
    });
    if (!response.ok) throw invalid();
    const body: unknown = await response.json();
    const id = body !== null && typeof body === "object" && "id" in body ? body.id : undefined;
    if (typeof id !== "string" || !id.trim() || id.length > 128) throw invalid();
    return { id: id.trim() };
  } catch {
    throw invalid();
  } finally {
    clearTimeout(timeout);
  }
}
