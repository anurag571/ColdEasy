-- 0400 Contacts, consent records and leads (docs/05 §3, docs/07 §4).
-- The public never reads these. Public forms insert through server routes (service role)
-- after Turnstile, rate limiting and validation.

create table public.contacts (
  id              uuid primary key default gen_random_uuid(),
  mobile_e164     text not null unique check (mobile_e164 ~ '^\+91[6-9][0-9]{9}$'),
  name            text,
  email           text check (email is null or email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  persona         text check (persona in ('farmer','vendor','fpo','business','other')),
  pincode         text check (pincode ~ '^[1-9][0-9]{5}$'),
  gstin           text,
  zoho_contact_id text unique,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger contacts_updated before update on public.contacts for each row execute function app.set_updated_at();

-- One row per submission: proof of what was agreed, when, under which notice version.
create table public.consents (
  id             uuid primary key default gen_random_uuid(),
  contact_id     uuid not null references public.contacts(id) on delete cascade,
  purpose        text not null check (purpose in ('marketing_whatsapp_sms','order_updates','lead_followup')),
  granted        boolean not null,
  notice_version text not null,
  source_page    text,
  captured_at    timestamptz not null default now()
);
create index on public.consents (contact_id, purpose, captured_at desc);

create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  contact_id   uuid not null references public.contacts(id) on delete cascade,
  type         public.lead_type not null,
  status       public.lead_status not null default 'new',
  owner_id     uuid references public.admin_users(id),
  product_id   uuid references public.products(id),
  state        text,
  district     text,
  quantity     int check (quantity is null or quantity > 0),
  answers      jsonb not null default '{}'::jsonb,
  message      text check (length(message) <= 2000),
  utm          jsonb not null default '{}'::jsonb,
  source_page  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index on public.leads (type, status, created_at desc);
create index on public.leads (owner_id, status);
create trigger leads_updated before update on public.leads for each row execute function app.set_updated_at();

-- True when the contact's latest marketing consent is a yes (marketing may see only these).
create or replace function app.has_marketing_consent(p_contact uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((
    select c.granted from public.consents c
    where c.contact_id = p_contact and c.purpose = 'marketing_whatsapp_sms'
    order by c.captured_at desc, c.id desc limit 1), false)
$$;
grant execute on function app.has_marketing_consent(uuid) to authenticated, service_role;
