// Run only after deployment from the authenticated Windows environment.
// Creates one explicitly synthetic request, then removes only its acknowledged row.
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const scratch = path.join(root, ".tmp-assets");
const cli = process.argv[2];
const ref = "uzffaelpmhwffcuiqgjq";
const endpoint = `https://${ref}.supabase.co/functions/v1/submit-feedback`;
const origin = "https://sainmotors.mn";
if (!cli) throw new Error("Pass the authenticated Supabase CLI executable path.");
await fs.mkdir(scratch, { recursive: true });
const sqlPath = path.join(scratch, `feedback-deployment-check-${randomUUID()}.sql`);
const receiptPath = path.join(scratch, "feedback-deployment-verification.json");
// A failed fresh verification must not leave an earlier success receipt behind.
await fs.rm(receiptPath, { force: true });
const quote = value => `'${value.replaceAll("'", "''")}'`;
async function query(sql) {
  await fs.writeFile(sqlPath, sql);
  try {
    execFileSync(cli, ["db", "query", `--remote=${ref}`, "--file", sqlPath, "--yes", "--output-format", "text"], {
      cwd: root, stdio: ["ignore", "pipe", "pipe"], windowsHide: true, timeout: 45_000,
    });
  } catch {
    // Do not print CLI output, database contents, credentials, or SQL values.
    throw new Error("Feedback deployment database verification failed.");
  }
}
async function request(method, requestOrigin = origin, input) {
  try {
    return await fetch(endpoint, {
      method, headers: method === "OPTIONS" ? {
        Origin: requestOrigin, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type",
      } : { Origin: requestOrigin, "Content-Type": "application/json" },
      ...(input === undefined ? {} : { body: JSON.stringify(input) }),
      redirect: "error", credentials: "omit", signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new Error("Feedback deployment HTTP verification failed.");
  }
}
async function json(response) {
  try { return await response.json(); } catch { throw new Error("Feedback deployment returned invalid JSON."); }
}
const checks = [];
let id;
let syntheticName;
let removed = false;
try {
  await query(`do $$ begin
    if not exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='feedback_requests' and c.relrowsecurity and c.relforcerowsecurity) then raise exception 'Feedback row security is not enabled'; end if;
    if exists (select 1 from pg_policies where schemaname='public' and tablename='feedback_requests') then raise exception 'Feedback table has unexpected row policies'; end if;
    if exists (select 1 from unnest(array['anon','authenticated']) as r(role_name) cross join unnest(array['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) as p(privilege_name) where has_table_privilege(r.role_name::name,'public.feedback_requests',p.privilege_name)) then raise exception 'Feedback table has public privileges'; end if;
    if exists (select 1 from unnest(array['anon','authenticated']) as r(role_name) cross join unnest(array['SELECT','INSERT','UPDATE','REFERENCES']) as p(privilege_name) where has_any_column_privilege(r.role_name::name,'public.feedback_requests',p.privilege_name)) then raise exception 'Feedback columns have public privileges'; end if;
    if not has_table_privilege('service_role','public.feedback_requests','SELECT') or not has_table_privilege('service_role','public.feedback_requests','INSERT') then raise exception 'Feedback server role lacks required privileges'; end if;
    if exists (select 1 from unnest(array['UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) as p(privilege_name) where has_table_privilege('service_role','public.feedback_requests',p.privilege_name)) then raise exception 'Feedback server role has excess table privileges'; end if;
  end $$;`);
  checks.push("private-table-privileges-and-rls");

  const preflight = await request("OPTIONS");
  const allowedMethods = preflight.headers.get("access-control-allow-methods")?.split(",").map(value => value.trim());
  if (preflight.status !== 204 || preflight.headers.get("access-control-allow-origin") !== origin
    || preflight.headers.has("access-control-allow-credentials")
    || !allowedMethods?.includes("POST") || !allowedMethods.includes("OPTIONS")
    || preflight.headers.get("access-control-allow-headers")?.toLowerCase() !== "content-type"
    || !preflight.headers.get("vary")?.split(",").some(value => value.trim().toLowerCase() === "origin")) {
    throw new Error(`Feedback CORS preflight failed (${preflight.status}).`);
  }
  checks.push("cors-preflight");

  const input = {
    name: `Feedback deployment synthetic ${randomUUID()}`, phone: "00000000", audience: "client",
    showroom: "deployment-check", message: "Synthetic contact deployment verification.\nNo customer data.",
    consent: true, locale: "en", website: "",
  };
  const invalid = await request("POST", origin, { ...input, consent: false });
  const invalidBody = await json(invalid);
  if (invalid.status !== 400 || invalidBody?.errors?.consent !== "consent" || invalid.headers.get("access-control-allow-origin") !== origin) throw new Error(`Feedback consent validation failed (${invalid.status}).`);
  checks.push("consent-rejection");

  const foreign = await request("POST", "https://unrelated.example", input);
  if (foreign.status !== 403 || foreign.headers.has("access-control-allow-origin")) throw new Error(`Feedback origin rejection failed (${foreign.status}).`);
  checks.push("foreign-origin-rejection");

  const response = await request("POST", origin, input);
  const body = await json(response);
  if (response.status !== 201 || typeof body?.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.id)) throw new Error(`Feedback storage did not acknowledge the synthetic request (${response.status}).`);
  id = body.id;
  syntheticName = input.name;
  if (response.headers.get("access-control-allow-origin") !== origin || response.headers.has("access-control-allow-credentials")) throw new Error("Feedback success response has invalid CORS headers.");
  await query(`do $$ begin
    if not exists (select 1 from public.feedback_requests where id=${quote(id)}::uuid and name=${quote(syntheticName)} and phone='+97600000000' and audience='client' and showroom='deployment-check' and message=${quote(input.message)} and consent=true and consent_version='contact-feedback-v1' and locale='en' and created_at is not null and consent_at is not null) then raise exception 'Feedback stored request differs from acknowledgement'; end if;
    if (select count(*) from public.feedback_requests where name=${quote(syntheticName)} and phone='+97600000000') <> 1 then raise exception 'Rejected feedback requests were persisted'; end if;
  end $$;`);
  checks.push("acknowledged-row-and-normalized-data");
} finally {
  try {
    if (id && syntheticName) {
      await query(`do $$ declare removed integer; begin
        delete from public.feedback_requests where id=${quote(id)}::uuid and name=${quote(syntheticName)} and phone='+97600000000';
        get diagnostics removed = row_count;
        if removed <> 1 then raise exception 'Feedback synthetic row cleanup was not confirmed'; end if;
      end $$;`);
      removed = true;
    }
  } finally {
    await fs.rm(sqlPath, { force: true });
  }
}
if (!removed) throw new Error("Feedback synthetic row cleanup was not verified.");
await fs.writeFile(receiptPath, JSON.stringify({ projectRef: ref, endpoint, verifiedAt: new Date().toISOString(), checks, syntheticRowRemoved: true }, null, 2));
console.log(`Verified feedback deployment: ${checks.join(", ")}; synthetic row removed.`);
