-- 0900 Append-only audit log and data guards (docs/12 §5.6-5.7, docs/05 §8).

create table public.audit_log (
  id         bigserial primary key,
  actor_id   uuid,
  actor_role text,
  table_name text not null,
  row_id     text not null,
  action     text not null check (action in ('insert','update','delete','login','mfa_failed','denied','export','break_glass','flag_change')),
  reason     text,
  request_id text,
  before     jsonb,
  after      jsonb,
  at         timestamptz not null default now()
);
create index on public.audit_log (table_name, row_id, at desc);
create index on public.audit_log (actor_id, at desc);

-- Nobody updates or deletes the audit log, not even the owner (docs/12 §4).
-- Retention clean-up runs as postgres through a reviewed migration or scheduled job.
create or replace function app.audit_append_only() returns trigger
language plpgsql set search_path = '' as $$
begin
  if current_user = 'postgres' and current_setting('app.audit_retention', true) = 'on' then
    return old;
  end if;
  raise exception 'audit_log is append-only' using errcode = '42501';
end $$;
create trigger audit_log_no_update before update or delete on public.audit_log
  for each row execute function app.audit_append_only();
create trigger audit_log_no_truncate before truncate on public.audit_log
  for each statement execute function app.audit_append_only();

create or replace function app.audit_row() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  rid text;
begin
  rid := coalesce(
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'id',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'key',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'variant_id',
    '?');
  insert into public.audit_log (actor_id, actor_role, table_name, row_id, action, request_id, before, after)
  values (
    app.uid(),
    coalesce(app.admin_role()::text, current_user),
    tg_table_name,
    rid,
    lower(tg_op),
    nullif(current_setting('app.request_id', true), ''),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end
  );
  return null;
end $$;

do $$
declare t text;
begin
  foreach t in array array[
    'admin_users','claims','media_assets','products','product_variants','product_media','product_specs',
    'product_highlights','product_ratings','leads','orders','serviceable_pincodes','customer_stories',
    'media_features','faqs','partner_categories','partners','milestones','banners','feature_flags',
    'site_settings','locales','translations','zoho_item_map','zoho_connection']
  loop
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function app.audit_row()', t || '_audit', t);
  end loop;
end $$;

-- Publishing guard (docs/12 §5.6, docs/11 rule 3) -------------------------------------
-- Publishing needs content.publish (owner), and nothing publishes while any text field
-- holds a [TBC] or [CONFIRM placeholder or references an unapproved claim.
create or replace function app.guard_publish() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  row_json   jsonb := to_jsonb(new);
  claim      text := row_json ->> 'claim_id';
  becoming   boolean := new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published');
  was_live   boolean := tg_op = 'UPDATE' and old.status = 'published';
begin
  if app.is_system() then
    null; -- service role and migrations still go through the content checks below
  elsif tg_table_name = 'banners' and app.has_permission('banners.manage') then
    null; -- the site banner is the outage switch: operations and marketing publish it directly (docs/12 §4)
  elsif (becoming or was_live) and not app.has_permission('content.publish') then
    -- Live rows change only by publishing a reviewed revision (docs/12 §5.2).
    raise exception 'Only the owner can publish or change live content' using errcode = '42501';
  end if;
  if new.status <> 'published' then
    return new;
  end if;
  if exists (select 1 from jsonb_each_text(row_json) kv where kv.value ~ '\[(TBC|CONFIRM)') then
    raise exception 'Cannot publish: a field still holds a [TBC] or [CONFIRM] placeholder' using errcode = '23514';
  end if;
  if claim is not null and not exists (select 1 from public.claims c where c.id = claim and c.status = 'approved') then
    raise exception 'Cannot publish: claim % is not approved', claim using errcode = '23514';
  end if;
  if becoming then
    new.published_at := now();
    new.published_by := app.uid();
  end if;
  if tg_op = 'UPDATE' then
    new.version := old.version + 1;
  end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['products','customer_stories','media_features','faqs','partner_categories','partners','milestones','banners']
  loop
    execute format('create trigger %I before insert or update on public.%I for each row execute function app.guard_publish()', t || '_publish_guard', t);
  end loop;
end $$;

-- Product variant guard: who may change which columns, and the price band (docs/12 §4).
create or replace function app.guard_variant() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if app.is_system() then
    return new;
  end if;
  if new.stock_qty is distinct from old.stock_qty and coalesce(current_setting('app.stock_change', true), 'off') <> 'on' then
    raise exception 'Change stock with adjust_stock() so the ledger records why' using errcode = '42501';
  end if;
  if (new.price_paise, new.mrp_paise, new.price_floor_paise) is distinct from (old.price_paise, old.mrp_paise, old.price_floor_paise) then
    if not app.has_permission('catalogue.edit_price') then
      raise exception 'Permission catalogue.edit_price needed' using errcode = '42501';
    end if;
    if not app.has_permission('price.approve') and (
         new.mrp_paise is distinct from old.mrp_paise
      or new.price_floor_paise is distinct from old.price_floor_paise
      or abs(new.price_paise - old.price_paise) * 10 > old.price_paise
      or (old.price_floor_paise is not null and new.price_paise < old.price_floor_paise)
    ) then
      raise exception 'Price change outside ±10%% or below the floor needs owner approval' using errcode = '42501';
    end if;
  end if;
  if new.status_override is distinct from old.status_override and not app.has_permission('catalogue.edit_status') then
    raise exception 'Permission catalogue.edit_status needed' using errcode = '42501';
  end if;
  if (new.variant_label, new.weight_g, new.length_mm, new.width_mm, new.height_mm, new.hsn_code, new.gst_rate_bps, new.emi_eligible)
     is distinct from
     (old.variant_label, old.weight_g, old.length_mm, old.width_mm, old.height_mm, old.hsn_code, old.gst_rate_bps, old.emi_eligible)
     and not app.has_permission('catalogue.edit_copy') then
    raise exception 'Permission catalogue.edit_copy needed' using errcode = '42501';
  end if;
  new.version := old.version + 1;
  return new;
end $$;
create trigger product_variants_guard before update on public.product_variants
  for each row execute function app.guard_variant();

-- Feature flags: turning one on in production needs an approved change note.
create or replace function app.guard_flag() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.enabled and app.environment() = 'production' and coalesce(new.change_note_ref, '') = '' then
    raise exception 'Flag % needs change_note_ref before it can be enabled in production', new.key using errcode = '23514';
  end if;
  new.updated_by := app.uid();
  return new;
end $$;
create trigger feature_flags_guard before insert or update on public.feature_flags
  for each row execute function app.guard_flag();
