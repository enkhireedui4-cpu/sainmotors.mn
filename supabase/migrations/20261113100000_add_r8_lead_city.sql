-- Keep earlier country-only requests intact; new website requests include a city.
alter table public.r8_leads
  add column city text,
  add constraint r8_leads_city_valid check (city in ('ulaanbaatar', 'erdenet', 'darkhan'));

comment on column public.r8_leads.city is 'Selected Mongolian city: ulaanbaatar, erdenet or darkhan; null for legacy requests.';
