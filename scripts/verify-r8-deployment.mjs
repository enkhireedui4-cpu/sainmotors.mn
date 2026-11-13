// Run after deployment from the authenticated Windows environment.
// Uses one synthetic request and removes only its acknowledged row.
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const scratch = path.join(root, ".tmp-assets");
const cli = process.argv[2];
const ref = "uzffaelpmhwffcuiqgjq";
const endpoint = `https://${ref}.supabase.co/functions/v1/submit-r8-lead`;
const origin = "https://sainmotors.mn";
if (!cli) throw new Error("Pass the authenticated Supabase CLI executable path.");
await fs.mkdir(scratch, { recursive: true });
const sqlPath = path.join(scratch, "r8-deployment-check.sql");
const receiptPath = path.join(scratch, "r8-deployment-verification.json");
// An old successful receipt must not survive a failed fresh verification.
await fs.rm(receiptPath, { force: true });
const quote = value => `'${value.replaceAll("'", "''")}'`;
async function query(sql) {
  await fs.writeFile(sqlPath, sql);
  execFileSync(cli, ["db", "query", `--remote=${ref}`, "--file", sqlPath, "--yes", "--output-format", "text"], {
    cwd: root, stdio: "inherit", windowsHide: true,
  });
}
const checks = [];
let id;
let removed = false;
let firstName;
try {
  await query(`do $$ begin
    if not exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='r8_leads' and c.relrowsecurity and c.relforcerowsecurity) then raise exception 'R8 row security is not enabled'; end if;
    if has_table_privilege('anon','public.r8_leads','SELECT') or has_table_privilege('anon','public.r8_leads','INSERT') or has_table_privilege('authenticated','public.r8_leads','SELECT') or has_table_privilege('authenticated','public.r8_leads','INSERT') then raise exception 'R8 table has public privileges'; end if;
    if not has_table_privilege('service_role','public.r8_leads','SELECT') or not has_table_privilege('service_role','public.r8_leads','INSERT') then raise exception 'R8 server role lacks required privileges'; end if;
  end $$;`);
  checks.push("private-table-privileges-and-rls");
  const preflight = await fetch(endpoint, { method: "OPTIONS", headers: { Origin: origin, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" }, signal: AbortSignal.timeout(15_000) });
  if (preflight.status !== 204 || preflight.headers.get("access-control-allow-origin") !== origin) throw new Error(`R8 CORS preflight failed (${preflight.status}).`);
  checks.push("cors-preflight");
  const input = { country: "Mongolia", city: "darkhan", firstName: `R8 deployment check ${Date.now()}`, lastName: "Synthetic test", phone: "00000000", consent: true, locale: "en", website: "" };
  const invalid = await fetch(endpoint, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify({ ...input, consent: false }), signal: AbortSignal.timeout(15_000) });
  if (invalid.status !== 400) throw new Error(`R8 consent validation failed (${invalid.status}).`);
  checks.push("consent-rejection");
  const foreign = await fetch(endpoint, { method: "POST", headers: { Origin: "https://unrelated.example", "Content-Type": "application/json" }, body: JSON.stringify(input), signal: AbortSignal.timeout(15_000) });
  if (foreign.status !== 403) throw new Error(`R8 origin rejection failed (${foreign.status}).`);
  checks.push("foreign-origin-rejection");
  const response = await fetch(endpoint, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify(input), signal: AbortSignal.timeout(15_000) });
  const body = await response.json();
  if (response.status !== 201 || typeof body.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.id)) throw new Error(`R8 storage did not acknowledge the synthetic request (${response.status}).`);
  id = body.id;
  firstName = input.firstName;
  await query(`do $$ begin
    if not exists (select 1 from public.r8_leads where id=${quote(id)}::uuid and first_name=${quote(firstName)} and last_name='Synthetic test' and phone='+97600000000' and country='Mongolia' and city='darkhan' and consent=true and consent_version='r8-test-drive-v1' and locale='en' and car_model='R8') then raise exception 'R8 stored request differs from acknowledgement'; end if;
    if (select count(*) from public.r8_leads where first_name=${quote(firstName)} and last_name='Synthetic test') <> 1 then raise exception 'Rejected R8 requests were persisted'; end if;
  end $$;`);
  checks.push("acknowledged-row-and-normalized-data");
} finally {
  if (id && firstName) {
    await query(`do $$ declare removed integer; begin
      delete from public.r8_leads where id=${quote(id)}::uuid and first_name=${quote(firstName)} and last_name='Synthetic test' and phone='+97600000000';
      get diagnostics removed = row_count;
      if removed <> 1 then raise exception 'R8 synthetic row cleanup was not confirmed'; end if;
    end $$;`);
    removed = true;
  }
  await fs.rm(sqlPath, { force: true });
}
if (!removed) throw new Error("R8 synthetic row cleanup was not verified.");
await fs.writeFile(receiptPath, JSON.stringify({ projectRef: ref, endpoint, verifiedAt: new Date().toISOString(), checks, syntheticRowRemoved: true }, null, 2));
console.log(`Verified R8 deployment: ${checks.join(", ")}; synthetic row removed.`);
