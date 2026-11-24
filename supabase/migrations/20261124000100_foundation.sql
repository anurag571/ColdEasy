-- 0100 Foundation: private schema for helpers, enums, shared trigger functions.
-- Specs: docs/05 (schema), docs/12 §4-5 (roles, publishing), docs/07 (security).
-- Helpers live in schema "app", which PostgREST does not expose, so they are not callable as RPC.

create schema if not exists app;
grant usage on schema app to anon, authenticated, service_role;

-- Which environment this database is. Defaults to production so a forgotten setting fails
-- safe: the developer role only has standing access outside production (docs/12 §4).
create table app.instance (
  id          boolean primary key default true check (id),
  environment text not null default 'production'
              check (environment in ('local','staging','production'))
);
insert into app.instance default values;

create or replace function app.environment() returns text
language sql stable security definer set search_path = '' as $$
  select environment from app.instance where id
$$;

-- updated_at maintenance
create or replace function app.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- Enums ------------------------------------------------------------------
create type public.admin_role     as enum ('owner','operations','marketing','support','reviewer','developer');
create type public.content_status as enum ('draft','in_review','published','archived');
create type public.stock_status   as enum ('in_stock','low_stock','sold_out','coming_soon','enquire_only');
create type public.lead_type      as enum ('signup','product_enquiry','bulk','distributor','partner','affiliate','contact','notify_me','privacy');
create type public.lead_status    as enum ('new','contacted','qualified','won','lost','spam');
create type public.order_status   as enum ('pending_payment','paid','packed','dispatched','delivered','cancelled','refunded','expired','payment_failed');
create type public.partner_category as enum ('deployment','finance','research','csr','ecosystem');
create type public.media_provenance as enum ('photo','photo_retouched','ai_assisted','ai_generated','logo','document');
