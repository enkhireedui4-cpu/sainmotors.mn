-- Public HTTP intake is handled by the Edge Function. The table itself is private.
create table public.r8_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  country text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  consent boolean not null,
  consent_at timestamptz not null default now(),
  consent_version text not null,
  locale text not null,
  car_model text not null default 'R8',

  constraint r8_leads_country_valid check (
    char_length(country) between 1 and 100
    and country = btrim(country)
    and country !~ '[[:cntrl:]]'
  ),
  constraint r8_leads_first_name_valid check (
    char_length(first_name) between 1 and 100
    and first_name = btrim(first_name)
    and first_name !~ '[[:cntrl:]]'
  ),
  constraint r8_leads_last_name_valid check (
    char_length(last_name) between 1 and 100
    and last_name = btrim(last_name)
    and last_name !~ '[[:cntrl:]]'
  ),
  constraint r8_leads_phone_valid check (phone ~ '^\+[1-9][0-9]{6,14}$'),
  constraint r8_leads_mongolia_phone_valid check (
    lower(country) <> 'mongolia' or phone ~ '^\+976[0-9]{8}$'
  ),
  constraint r8_leads_consent_required check (consent = true),
  constraint r8_leads_consent_version_valid check (consent_version = 'r8-test-drive-v1'),
  constraint r8_leads_locale_valid check (locale in ('mn', 'en')),
  constraint r8_leads_model_valid check (car_model = 'R8')
);

alter table public.r8_leads enable row level security;
alter table public.r8_leads force row level security;

-- No anon/authenticated policies exist. Revoke default public-schema grants too.
revoke all on table public.r8_leads from public, anon, authenticated, service_role;
-- SELECT is required for PostgREST's returning id acknowledgement.
grant insert, select on table public.r8_leads to service_role;

comment on table public.r8_leads is 'Private Sain Motors R8 test-drive enquiries; intake via submit-r8-lead only.';
comment on column public.r8_leads.consent_version is 'r8-test-drive-v1: consent to use contact details to follow up on an R8 test-drive enquiry.';
