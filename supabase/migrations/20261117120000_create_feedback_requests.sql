-- General contact intake is separate from R8 test-drive enquiries.
create table public.feedback_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  audience text not null,
  showroom text,
  message text,
  consent boolean not null,
  consent_at timestamptz not null default now(),
  consent_version text not null,
  locale text not null,

  constraint feedback_requests_name_valid check (
    char_length(name) between 2 and 80 and name = btrim(name)
    and name !~ '[[:cntrl:]]'
    and name !~ U&'[\202A-\202E\2066-\2069]'
  ),
  constraint feedback_requests_phone_valid check (phone ~ '^\+976[0-9]{8}$'),
  constraint feedback_requests_audience_valid check (audience in ('client', 'employee', 'dealer')),
  constraint feedback_requests_showroom_valid check (
    showroom is null or (
      char_length(showroom) between 1 and 80 and showroom ~ '^[a-z0-9]+([-_][a-z0-9]+)*$'
    )
  ),
  constraint feedback_requests_message_valid check (
    message is null or (
      char_length(message) between 1 and 2000
      -- Tabs and newlines are allowed; all remaining controls are rejected.
      and translate(message, E'\t\n', '') !~ '[[:cntrl:]]'
      and message !~ U&'[\202A-\202E\2066-\2069]'
    )
  ),
  constraint feedback_requests_consent_required check (consent = true),
  constraint feedback_requests_consent_version_valid check (consent_version = 'contact-feedback-v1'),
  constraint feedback_requests_locale_valid check (locale in ('mn', 'en'))
);

alter table public.feedback_requests enable row level security;
alter table public.feedback_requests force row level security;

-- No public/anon/authenticated policies or table permissions are provided.
revoke all on table public.feedback_requests from public, anon, authenticated, service_role;
-- PostgREST requires SELECT for the returning-id acknowledgement.
grant insert, select on table public.feedback_requests to service_role;

comment on table public.feedback_requests is 'Private Sain Motors general contact feedback; intake via submit-feedback only.';
comment on column public.feedback_requests.showroom is 'Optional showroom ID; never the translated display label.';
comment on column public.feedback_requests.consent_version is 'contact-feedback-v1: consent to use contact details to respond to this contact request.';
