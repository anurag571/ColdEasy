-- 0200 Admin users, roles and named permissions (docs/12 §4).
-- Roles are fixed in code: there is no role editor. Permissions are checked in one SQL
-- function, app.has_permission(), which RLS policies call. Every admin action also needs
-- an MFA session (aal2), per docs/07 §2.

create table public.admin_users (
  id                   uuid primary key references auth.users(id) on delete cascade,
  full_name            text not null,
  role                 public.admin_role not null,
  locales              text[] not null default '{}',   -- reviewer scope, e.g. {hi}
  is_active            boolean not null default true,
  approval_delegate_id uuid references public.admin_users(id),
  delegate_until       timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  check (role <> 'reviewer' or cardinality(locales) > 0)
);
create trigger admin_users_updated before update on public.admin_users
  for each row execute function app.set_updated_at();

create table app.role_permissions (
  role       public.admin_role not null,
  permission text not null,
  primary key (role, permission)
);

insert into app.role_permissions (role, permission)
select 'owner'::public.admin_role, p from unnest(array[
  'catalogue.read','catalogue.edit_copy','catalogue.edit_price','catalogue.edit_stock','catalogue.edit_status',
  'catalogue.publish','price.approve','media.edit','content.read','content.edit','content.publish',
  'banners.manage','claims.manage','leads.read','leads.manage','contacts.read','contacts.export',
  'orders.read','orders.manage','orders.refund','pincodes.manage','accounting.read','accounting.retry',
  'webhooks.read','audit.read','team.manage','settings.manage','flags.manage','translations.edit',
  'locales.manage'
]) p
union all
select 'operations'::public.admin_role, p from unnest(array[
  'catalogue.read','catalogue.edit_price','catalogue.edit_stock','catalogue.edit_status','content.read',
  'banners.manage','leads.read','leads.manage','contacts.read','orders.read','orders.manage',
  'pincodes.manage','accounting.read','accounting.retry','webhooks.read','audit.read'
]) p
union all
select 'marketing'::public.admin_role, p from unnest(array[
  'catalogue.read','catalogue.edit_copy','media.edit','content.read','content.edit','banners.manage',
  'leads.read_own','contacts.read_marketing'
]) p
union all
select 'support'::public.admin_role, p from unnest(array[
  'catalogue.read','content.read','leads.read_own','contacts.read','orders.read','pincodes.read'
]) p
union all
select 'reviewer'::public.admin_role, p from unnest(array['translations.edit']) p
;

-- developer mirrors owner, but only outside production (enforced in has_permission).
insert into app.role_permissions (role, permission)
select 'developer', permission from app.role_permissions where role = 'owner';

-- Session helpers -----------------------------------------------------------
create or replace function app.uid() returns uuid
language sql stable set search_path = '' as $$
  select nullif(coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb ->> 'sub', '')::uuid
$$;

-- MFA: Supabase sets aal = 'aal2' after a verified second factor.
create or replace function app.mfa_ok() returns boolean
language sql stable set search_path = '' as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb ->> 'aal' = 'aal2'
$$;

-- Service role and migrations bypass RLS; triggers use this to allow system writes.
-- It reads the "role" setting, not current_user: inside a SECURITY DEFINER trigger
-- current_user is the function owner, but the role set by PostgREST ("set local role
-- authenticated") is still visible here. 'none' means no SET ROLE: a migration or job.
create or replace function app.is_system() returns boolean
language sql stable set search_path = '' as $$
  select coalesce(nullif(current_setting('role', true), ''), 'none') in ('none','service_role','postgres','supabase_admin')
$$;

create or replace function app.admin_role() returns public.admin_role
language sql stable security definer set search_path = '' as $$
  select au.role from public.admin_users au
  where au.id = app.uid() and au.is_active
    and (au.role <> 'developer' or app.environment() <> 'production')
$$;

create or replace function app.has_permission(p text) returns boolean
language sql stable security definer set search_path = '' as $$
  select app.mfa_ok() and exists (
    select 1
    from public.admin_users au
    join app.role_permissions rp on rp.role = au.role
    where au.id = app.uid()
      and au.is_active
      and rp.permission = p
      and (au.role <> 'developer' or app.environment() <> 'production')
  )
$$;

-- Reviewer scope: may edit translations only for their own languages.
create or replace function app.can_edit_locale(loc text) returns boolean
language sql stable security definer set search_path = '' as $$
  select app.has_permission('translations.edit') and exists (
    select 1 from public.admin_users au
    where au.id = app.uid() and (au.role <> 'reviewer' or loc = any(au.locales))
  )
$$;

revoke all on function app.has_permission(text), app.admin_role(), app.can_edit_locale(text), app.environment() from public;
grant execute on function app.uid(), app.mfa_ok(), app.is_system(), app.has_permission(text),
  app.admin_role(), app.can_edit_locale(text), app.environment(), app.set_updated_at()
  to anon, authenticated, service_role;
