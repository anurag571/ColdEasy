-- 0500 Orders, payments, webhooks, pincodes, stock ledger, order timeline (docs/05, docs/12 §5.5).
-- 'paid' is set only by the Razorpay webhook running as the service role (docs/06).

create table public.serviceable_pincodes (
  pincode        text primary key check (pincode ~ '^[1-9][0-9]{5}$'),
  city           text,
  state          text,
  min_days       int check (min_days is null or min_days >= 0),
  max_days       int check (max_days is null or max_days >= min_days),
  shipping_paise int check (shipping_paise is null or shipping_paise >= 0),
  active         boolean not null default true,
  updated_at     timestamptz not null default now()
);
create trigger serviceable_pincodes_updated before update on public.serviceable_pincodes for each row execute function app.set_updated_at();

create table public.orders (
  id                   uuid primary key default gen_random_uuid(),
  order_no             text not null unique check (order_no ~ '^CE-[0-9]{4}-[0-9]{6}$'),
  public_token         text not null unique check (length(public_token) >= 32),
  contact_id           uuid not null references public.contacts(id),
  status               public.order_status not null default 'pending_payment',
  channel              text not null default 'web' check (channel in ('web','whatsapp_link')),
  ship_name            text not null,
  ship_line1           text not null,
  ship_line2           text,
  ship_landmark        text,
  ship_city            text not null,
  ship_state           text not null,
  ship_pincode         text not null check (ship_pincode ~ '^[1-9][0-9]{5}$'),
  gstin                text check (gstin is null or gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  subtotal_paise       int not null check (subtotal_paise >= 0),
  shipping_paise       int not null default 0 check (shipping_paise >= 0),
  total_paise          int not null check (total_paise >= 0),
  razorpay_order_id    text unique,
  courier              text,
  tracking_no          text,
  utm                  jsonb not null default '{}'::jsonb,
  zoho_invoice_id      text unique,
  zoho_invoice_no      text,
  zoho_payment_id      text unique,
  accounting_status    text not null default 'not_due'
                       check (accounting_status in ('not_due','queued','synced','retrying','needs_attention')),
  invoice_override_ref text,
  invoice_override_by  uuid references public.admin_users(id),
  expires_at           timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  check (total_paise = subtotal_paise + shipping_paise),
  check (status <> 'dispatched' or (courier is not null and tracking_no is not null))
);
create index on public.orders (status, created_at desc);
create trigger orders_updated before update on public.orders for each row execute function app.set_updated_at();

create table public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  variant_id       uuid not null references public.product_variants(id),
  sku              text not null,          -- snapshot
  name             text not null,          -- snapshot
  unit_price_paise int not null check (unit_price_paise > 0),
  qty              int not null check (qty between 1 and 20),
  line_total_paise int not null,
  check (line_total_paise = unit_price_paise * qty)
);
create index on public.order_items (order_id);

create table public.webhook_events (
  id           uuid primary key default gen_random_uuid(),
  provider     text not null default 'razorpay',
  event_id     text not null unique,
  event_type   text not null,
  payload      jsonb not null,
  processed_at timestamptz,
  received_at  timestamptz not null default now()
);

create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders(id),
  razorpay_payment_id text not null unique,
  status              text not null check (status in ('captured','failed','refunded','authorized')),
  method              text,
  amount_paise        int not null check (amount_paise >= 0),
  raw_event_id        uuid references public.webhook_events(id),
  created_at          timestamptz not null default now()
);
create index on public.payments (order_id);

-- The only allowed order moves (docs/12 §5.5). 'paid' is never a manual move.
create table public.order_status_transitions (
  from_status         public.order_status not null,
  to_status           public.order_status not null,
  required_permission text not null,
  primary key (from_status, to_status)
);
insert into public.order_status_transitions values
  ('paid','packed','orders.manage'),
  ('packed','dispatched','orders.manage'),
  ('dispatched','delivered','orders.manage'),
  ('paid','cancelled','orders.manage'),
  ('packed','cancelled','orders.manage'),
  ('delivered','refunded','orders.refund');

create table public.order_events (
  id                  bigserial primary key,
  order_id            uuid not null references public.orders(id),
  kind                text not null check (kind in ('status_change','note','customer_note','system','payment','accounting')),
  from_status         public.order_status,
  to_status           public.order_status,
  body                text,
  visible_to_customer boolean not null default false,
  actor_id            uuid references public.admin_users(id),
  created_at          timestamptz not null default now()
);
create index on public.order_events (order_id, created_at);

create or replace function app.guard_order_status() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  needed text;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;
  if not app.is_system() then
    select t.required_permission into needed
    from public.order_status_transitions t
    where t.from_status = old.status and t.to_status = new.status;
    if needed is null then
      raise exception 'Order status cannot move from % to %', old.status, new.status using errcode = '42501';
    end if;
    if not app.has_permission(needed) then
      raise exception 'Permission % needed to move an order to %', needed, new.status using errcode = '42501';
    end if;
  end if;
  insert into public.order_events (order_id, kind, from_status, to_status, actor_id)
  values (new.id, 'status_change', old.status, new.status, app.uid());
  return new;
end $$;
create trigger orders_status_guard before update of status on public.orders
  for each row execute function app.guard_order_status();

-- Stock ledger: every change to stock_qty has a reason (docs/12 §5.5).
create table public.stock_movements (
  id          bigserial primary key,
  variant_id  uuid not null references public.product_variants(id),
  delta       int not null check (delta <> 0),
  reason      text not null check (reason in ('opening','manual_adjust','received','sale','cancel_restock','return','damage','correction','zoho_sync')),
  order_id    uuid references public.orders(id),
  note        text,
  actor_id    uuid references public.admin_users(id),
  created_at  timestamptz not null default now()
);
create index on public.stock_movements (variant_id, created_at desc);

-- The only way to change stock. Direct updates to stock_qty are rejected by a trigger.
create or replace function public.adjust_stock(p_variant uuid, p_delta int, p_reason text, p_note text default null, p_order uuid default null)
returns int
language plpgsql security definer set search_path = '' as $$
declare
  new_qty int;
begin
  if not app.is_system() and not app.has_permission('catalogue.edit_stock') then
    raise exception 'Permission catalogue.edit_stock needed' using errcode = '42501';
  end if;
  if p_reason = 'sale' and not app.is_system() then
    raise exception 'Sales are recorded by the payment webhook only' using errcode = '42501';
  end if;
  perform set_config('app.stock_change', 'on', true);
  update public.product_variants set stock_qty = stock_qty + p_delta
  where id = p_variant returning stock_qty into new_qty;
  if new_qty is null then
    raise exception 'Unknown variant %', p_variant;
  end if;
  insert into public.stock_movements (variant_id, delta, reason, order_id, note, actor_id)
  values (p_variant, p_delta, p_reason, p_order, p_note, app.uid());
  perform set_config('app.stock_change', 'off', true);
  return new_qty;
end $$;
revoke all on function public.adjust_stock(uuid, int, text, text, uuid) from public, anon;
grant execute on function public.adjust_stock(uuid, int, text, text, uuid) to authenticated, service_role;
