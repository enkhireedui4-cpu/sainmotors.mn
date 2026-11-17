# Contact feedback receiver

The static contact form submits JSON to the separate `submit-feedback` Supabase Edge Function. It stores requests in the private `public.feedback_requests` table. Existing R8 lead intake is independent.

## Deployment prerequisites

The code and migration are prepared locally. This change does not apply migrations, deploy functions, create production records, or send email.

1. Apply `supabase/migrations/20261117120000_create_feedback_requests.sql` to the intended Supabase project using the normal migration process.
2. Deploy `submit-feedback` with gateway JWT verification disabled for this public form (`[functions.submit-feedback] verify_jwt = false` in `supabase/config.toml`). The handler still validates origins, fields, consent, content type, and body size.
3. Provide server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` through the Edge Function environment. Supabase-hosted functions normally provide these. Never expose the service-role key to the frontend or any `NEXT_PUBLIC_*` variable.
4. Set the frontend's `NEXT_PUBLIC_FEEDBACK_ENDPOINT` to `https://<project-ref>.supabase.co/functions/v1/submit-feedback` before building the static site.
5. Default allowed origins are exactly `https://sainmotors.mn` and `https://www.sainmotors.mn`. An optional comma-separated `FEEDBACK_ALLOWED_ORIGINS` replaces the defaults. Use explicit origins with scheme and port where needed; no paths, trailing slash, wildcard, or credentials. An empty configured value denies every origin. Add preview/local origins only in the environment that needs them.
6. Verify an allowed-origin preflight and one consented test request in the target environment; confirm its returned ID corresponds to a stored row through an authorized administrative connection. Arrange the team's existing private review and retention process before accepting public requests. The function does not send notifications.

## Request and response

`POST` accepts `application/json` and at most 16 KiB of UTF-8 bytes, including streamed requests without a trustworthy `Content-Length`.

```json
{
  "name": "Бат",
  "phone": "99112233",
  "audience": "client",
  "showroom": "ub-central",
  "message": "Please call me about a showroom visit.",
  "consent": true,
  "locale": "mn",
  "website": ""
}
```

`name` is trimmed and must contain 2–80 Unicode code points. `phone` must be an eight-digit Mongolian number or `+976` plus eight digits; spaces, parentheses, and hyphens are accepted and the stored value is normalized to `+976`. `audience` is `client`, `employee`, or `dealer`. Optional `showroom` is a lowercase ID token of up to 80 characters, with hyphen/underscore separators; it is not a display label. Optional `message` is trimmed, accepts up to 2,000 Unicode code points, and preserves multiline content with normalized LF line endings. Tabs and newlines are allowed; unsafe control characters and bidi overrides are rejected. Empty optional text is omitted from storage. `consent` must be the boolean `true`, `locale` must be `mn` or `en`, and the honeypot `website` must be the literal empty string. Unknown fields are discarded.

Only a confirmed insert with exactly one bounded, nonempty returned ID produces HTTP `201` with `{ "id": "..." }`. Field failures return `400` with field-keyed `errors`; unsupported types return `415`, excessive bodies `413`, disallowed origins `403`, and unsupported methods `405`. Storage configuration failures, transport failures, HTTP errors, and malformed insert acknowledgements return a generic `503`, without a success receipt. A lost acknowledgement can follow a committed insert; the endpoint does not claim deduplication or automatic retries.

Allowed responses include exact-origin CORS headers and `Cache-Control: no-store`; preflight supports `POST` and `Content-Type` only. The handler writes no PII logs and does not collect IP addresses or user agents. Browser CORS is not authentication or abuse protection; configure the deployment's normal rate limits/monitoring as needed.

The table forces row-level security, has no public policies, revokes all table privileges from public, anon, and authenticated roles, and grants the service role INSERT and SELECT only. Consent is stored with a server timestamp and version `contact-feedback-v1`.

## Local verification

```powershell
npm.cmd test -- tests/unit/feedback.test.ts
npm.cmd test
```

Unit tests exercise validation, streamed body limits, origin/preflight behavior, delayed persistence acknowledgements, and failure-closed storage. Storage HTTP is stubbed; no real Supabase requests are sent.
