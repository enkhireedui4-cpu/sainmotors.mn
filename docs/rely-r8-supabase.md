# R8 lead receiver

The static site submits to:

`https://uzffaelpmhwffcuiqgjq.supabase.co/functions/v1/submit-r8-lead`

The browser has no database credential. `src/lib/r8-leads.ts` validates and normalizes the input, sends JSON, and resolves only when a successful HTTP response includes a nonempty stored id. Requests time out after 15 seconds, with no automatic retry. A failure leaves the form responsible for preserving the visitor's input and offering the local sales contact.

## Stored data and access

`20261113090000_create_r8_leads.sql` adds `public.r8_leads`; it does not alter existing tables. Each row contains a generated UUID, creation and consent timestamps, country, first/last name, normalized phone, literal consent, `consent_version = r8-test-drive-v1`, locale (`mn` or `en`), and fixed model `R8`. The consent version identifies permission to use the contact details to follow up on the R8 test-drive enquiry. Review this version when changing the form's consent purpose.

`20261113100000_add_r8_lead_city.sql` adds the selected city to this table. The form defaults to Ulaanbaatar and offers Erdenet and Darkhan, using the stored values `ulaanbaatar`, `erdenet`, and `darkhan`. Country remains Mongolia. Supplied cities are validated against these three values; earlier country-only requests remain supported with a null city.

Names and country are trimmed, limited to 100 characters, and cannot contain control characters. Phones are normalized to `+` and 7–15 digits. Mongolia accepts exactly 8 local digits or `+976` followed by 8 digits; local numbers gain `+976`. A filled honeypot (`website`) is rejected with HTTP 400 and never receives a fabricated success acknowledgement. Unknown fields are discarded. IP addresses, user agents, and the honeypot value are not stored.

RLS is enabled and forced, with no public policies. Table privileges are revoked from `PUBLIC`, `anon`, and `authenticated`; anonymous clients cannot directly read or write leads. The Edge Function uses its server-only service role for `INSERT` and the `SELECT` needed to return the inserted id. There is no lead-reading HTTP route. A privileged database administrator can review and remove leads through Supabase SQL tools.

## Runtime configuration

The receiver uses native Fetch APIs and relative TypeScript imports; it needs no third-party runtime package. Hosted Edge Functions must provide these server environment values:

| Value | Purpose |
| --- | --- |
| `SUPABASE_URL` | This project's Supabase URL, normally supplied by the hosted runtime. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server role key, normally supplied by the hosted runtime. Keep it out of source files, the static export, and browser configuration. |
| `R8_ALLOWED_ORIGINS` | Optional comma-separated complete list of exact allowed origins. |

Without `R8_ALLOWED_ORIGINS`, only `https://sainmotors.mn` and `https://www.sainmotors.mn` are allowed. The receiver requires an `Origin` header and matches exact origins. It never grants a wildcard. An explicitly configured list replaces the defaults; an empty or invalid list fails closed.

For local previews, configure this value in the Edge Function's server environment when needed:

```text
https://sainmotors.mn,https://www.sainmotors.mn,http://localhost:3200,http://127.0.0.1:3200,http://localhost:3300,http://127.0.0.1:3300
```

Include any deployed preview origin explicitly. Production does not need the local entries. No client API key or Authorization header is required: the function is public and `verify_jwt = false` must be configured for this function. Origin checks control browser access; this is a public intake endpoint rather than user authentication.

Allowed JSON preflights receive HTTP 204. Other methods receive 405, unapproved origins 403, non-JSON bodies 415, invalid input or malformed JSON 400, and bodies over 4096 bytes 413. Actual streamed bytes are counted, so Content-Length cannot bypass the limit. A persistence or server-configuration failure receives a generic 503 with no database diagnostic. Only a completed insert returning exactly one id produces HTTP 201. Allowed origins receive CORS headers on error responses too.

## Deploy to the selected project

On this Windows checkout, `scripts/deploy-r8-leads.cmd` runs the prepared CLI 3.1.0:
it previews and applies the two prepared R8 migrations, configures exact production and
local-preview origins, deploys only `submit-r8-lead`, and runs the real verification
script below. It stops if an unrelated local migration appears. Run it from the normal
authenticated Windows environment; no access token goes into the file. The helper
uses the same ignored CLI state directory as the earlier connection helper.
Set `SAIN_R8_ALLOWED_ORIGINS` beforehand to replace its default list if needed.

These commands use the installed Supabase CLI **3.1.0**. Run them from the repository using the authenticated environment linked to `uzffaelpmhwffcuiqgjq`. CLI v3 targets the local database by default, so the explicit `--remote` is necessary. Inspect all pending local migrations before the database push.

```powershell
supabase --version
supabase db push --remote=uzffaelpmhwffcuiqgjq --skip-vault
supabase functions deploy submit-r8-lead --remote=uzffaelpmhwffcuiqgjq --use-api --no-verify-jwt
```

The prepared function configuration must contain:

```toml
[functions.submit-r8-lead]
verify_jwt = false
```

Set optional origins through the project's Edge Function server secrets/environment controls before testing previews. Do not add a service role key to any `NEXT_PUBLIC_` variable. If built-in credentials are missing or the table is not deployed, the form receives a failure rather than a success message.

## Verify the deployed receiver

Use one clearly marked synthetic lead. The following request intentionally uses a test-only name and all-zero local digits; it does not contact a real visitor or the manufacturer's API.

```powershell
$r8VerificationBody = @{
  country = 'Mongolia'
  city = 'darkhan'
  firstName = 'R8 deployment check'
  lastName = 'Synthetic test'
  phone = '00000000'
  consent = $true
  locale = 'en'
  website = ''
} | ConvertTo-Json
$r8VerificationResult = Invoke-RestMethod -Method Post `
  -Uri 'https://uzffaelpmhwffcuiqgjq.supabase.co/functions/v1/submit-r8-lead' `
  -Headers @{ Origin = 'https://sainmotors.mn' } `
  -ContentType 'application/json' -Body $r8VerificationBody
$r8VerificationLeadId = $r8VerificationResult.id
```

In the authenticated database SQL tools, find exactly that returned UUID and confirm its city (`darkhan`), normalized phone (`+97600000000`), consent, locale, and fixed `R8` model. Remove only that known test row after verification:

```sql
select id, country, city, first_name, last_name, phone, consent, consent_at, consent_version, locale, car_model
from public.r8_leads
where id = '<returned synthetic UUID>'::uuid;

delete from public.r8_leads
where id = '<returned synthetic UUID>'::uuid
  and first_name = 'R8 deployment check'
  and last_name = 'Synthetic test'
  and phone = '+97600000000';
```

Also verify an allowed OPTIONS preflight, a rejected request with false consent, a rejected foreign origin, and anonymous direct-table read/write rejection using the project's public client credentials. Confirm the invalid requests create no rows. In the browser, verify the local form preserves input on a rejected request and shows success only after the acknowledged response.

## Local evidence and deployment status

Run `npm.cmd test -- tests/unit/r8-leads.test.ts` for normalization, literal validation cases, real Request/Response handling, CORS and body bounds, pending and failed persistence, the transport through a controlled local HTTP receiver, and the PostgREST request through a controlled local HTTP server. Run the full `npm.cmd test` suite before integration.

These tests do not prove the remote migration, credentials, privileges, or deployment. The backend implementation task did not mutate the live project. Live readiness requires the deployment and database checks above; record the actual result in the integration report.

`node scripts/verify-r8-deployment.mjs <supabase-executable>` automates the remote
checks with one uniquely named synthetic lead, confirms database privileges and
the saved values, and removes only its acknowledged test row. Successful runs
write `.tmp-assets/r8-deployment-verification.json`; failed runs do not leave an
old success receipt. The file contains verification status, not credentials.
