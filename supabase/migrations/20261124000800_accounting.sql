-- 0800 Zoho Books sync tables (docs/06 §7, docs/12 §13.10). Change request CR-01:
-- the tables exist so the schema is stable; the sync stays behind the zoho_sync flag.
-- No secret ever lives in a table: the refresh token is in Supabase Vault.

create table public.zoho_item_map (
  variant_id         uuid primary key references public.product_variants(id),
  zoho_item_id       text not null unique,
  intra_state_tax_id text not null,
  inter_state_tax_id text not null,
  hsn_code           text not null,
  zoho_item_name     text,
  zoho_rate_paise    int,
  verified_by        uuid references public.admin_users(id),
  verified_at        timestamptz
);

create table public.accounting_sync (
  id          bigserial primary key,
  order_id    uuid not null references public.orders(id),
  action      text not null check (action in ('contact','sales_order','invoice','payment','credit_note','refund')),
  status      text not null default 'queued' check (status in ('queued','done','retrying','needs_attention')),
  attempts    int not null default 0,
  next_try_at timestamptz not null default now(),
  zoho_ref    text,
  last_error  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (order_id, action)
);
create index on public.accounting_sync (status, next_try_at);
create trigger accounting_sync_updated before update on public.accounting_sync for each row execute function app.set_updated_at();

create table public.zoho_connection (
  id                      boolean primary key default true check (id),
  organization_id         text not null,
  data_centre             text not null default 'in',
  org_state_code          text not null check (org_state_code ~ '^[0-9]{2}$'),
  connected_by            uuid references public.admin_users(id),
  connected_at            timestamptz,
  access_token_expires_at timestamptz,
  paused                  boolean not null default false,
  last_error              text
);

create table public.zoho_api_usage (
  day   date primary key,
  calls int not null default 0 check (calls >= 0),
  cap   int not null check (cap > 0)
);
