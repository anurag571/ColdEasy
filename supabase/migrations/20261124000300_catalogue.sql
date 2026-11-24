-- 0300 Catalogue: claims register, media library, products and variants (docs/05 §3, docs/12 §5).
-- Money is whole paise. Publishable tables carry the shared publishing columns (docs/12 §5.1).

create table public.claims (                    -- docs/08 §D register, moved into the database
  id           text primary key check (id ~ '^C-[0-9]{2,3}$'),
  text         text not null,
  status       text not null default 'unverified' check (status in ('unverified','approved','retired')),
  evidence_ref text,
  approved_by  uuid references public.admin_users(id),
  approved_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (status <> 'approved' or (evidence_ref is not null and approved_by is not null and approved_at is not null))
);
create trigger claims_updated before update on public.claims for each row execute function app.set_updated_at();

-- Public policies need to know whether a claim is approved without granting anon the register.
create or replace function app.claim_ok(claim text) returns boolean
language sql stable security definer set search_path = '' as $$
  select claim is null or exists (select 1 from public.claims c where c.id = claim and c.status = 'approved')
$$;
grant execute on function app.claim_ok(text) to anon, authenticated, service_role;

create table public.media_assets (               -- docs/12 §5.3
  id            uuid primary key default gen_random_uuid(),
  bucket        text not null check (bucket in ('public','private')),
  storage_path  text not null unique,
  mime          text not null,
  width_px      int, height_px int, bytes int,
  alt_text      text,
  credit        text,
  provenance    public.media_provenance not null,
  exif_stripped boolean not null default false,
  approved_by   uuid references public.admin_users(id),
  approved_at   timestamptz,
  uploaded_by   uuid references public.admin_users(id),
  created_at    timestamptz not null default now()
);

create table public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name          text not null,
  range_group   text not null check (range_group in ('main','other')),
  sort_order    int  not null default 0,
  description   text,
  status        public.content_status not null default 'draft',
  is_published  boolean generated always as (status = 'published') stored,
  published_at  timestamptz,
  published_by  uuid references public.admin_users(id),
  updated_by    uuid references public.admin_users(id),
  version       int not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger products_updated before update on public.products for each row execute function app.set_updated_at();

-- Stock status is derived from quantity unless operations sets an override (docs/12 §5.5).
create table public.product_variants (
  id                uuid primary key default gen_random_uuid(),
  product_id        uuid not null references public.products(id) on delete restrict,
  sku               text not null unique,
  variant_key       text not null default 'default',
  variant_label     text,
  mrp_paise         int  not null check (mrp_paise > 0),
  price_paise       int  not null check (price_paise > 0 and price_paise <= mrp_paise),
  price_floor_paise int  check (price_floor_paise is null or price_floor_paise > 0),
  gst_rate_bps      int  not null default 0 check (gst_rate_bps between 0 and 2800),
  hsn_code          text,
  stock_qty         int  not null default 0 check (stock_qty >= 0),
  low_stock_at      int  not null default 0 check (low_stock_at >= 0),
  status_override   public.stock_status,          -- null = derive from stock_qty
  emi_eligible      boolean not null default false,
  weight_g          int check (weight_g is null or weight_g > 0),
  length_mm         int, width_mm int, height_mm int,
  is_default        boolean not null default false,
  is_active         boolean not null default true,
  version           int not null default 1,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (product_id, variant_key)
);
create index on public.product_variants (product_id);
create unique index product_variants_one_default on public.product_variants (product_id) where is_default;
create trigger product_variants_updated before update on public.product_variants for each row execute function app.set_updated_at();

create or replace function public.variant_stock_status(v public.product_variants) returns public.stock_status
language sql stable set search_path = '' as $$
  select coalesce(
    v.status_override,
    case when v.stock_qty = 0 then 'sold_out'::public.stock_status
         when v.stock_qty <= v.low_stock_at then 'low_stock'::public.stock_status
         else 'in_stock'::public.stock_status end)
$$;

create table public.product_media (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  variant_id     uuid references public.product_variants(id) on delete cascade,
  media_asset_id uuid references public.media_assets(id),
  kind           text not null check (kind in ('image','hover','video','poster')),
  storage_path   text not null,
  alt_text       text not null check (length(alt_text) > 0),
  provenance     public.media_provenance not null check (provenance in ('photo','photo_retouched','ai_assisted','ai_generated')),
  tool           text,
  prompt_ref     text,
  status         text not null default 'submitted' check (status in ('submitted','approved','changes_requested','retired')),
  approved_by    uuid references public.admin_users(id),
  approved_at    timestamptz,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  check (status <> 'approved' or approved_by is not null),
  -- The main gallery image must be a real photo (docs/04 §6, docs/05 §8).
  check (kind <> 'image' or sort_order <> 0 or provenance in ('photo','photo_retouched'))
);
create index on public.product_media (product_id, sort_order);

create table public.product_specs (
  id          uuid primary key default gen_random_uuid(),
  variant_id  uuid not null references public.product_variants(id) on delete cascade,
  section     text not null check (section in ('measurements','features_specs','materials_care')),
  label       text not null,
  value       text not null,
  claim_id    text references public.claims(id),
  sort_order  int not null default 0
);

create table public.product_highlights (
  id          uuid primary key default gen_random_uuid(),
  variant_id  uuid not null references public.product_variants(id) on delete cascade,
  row_no      int not null default 1,
  value_text  text not null,
  label       text not null,
  claim_id    text references public.claims(id),
  sort_order  int not null default 0
);

create table public.product_ratings (            -- only with a verifiable source (docs/08 C-01..C-03)
  variant_id    uuid primary key references public.product_variants(id) on delete cascade,
  rating_avg    numeric(3,2) check (rating_avg between 0 and 5),
  review_count  int check (review_count >= 0),
  source        text not null,
  evidence_url  text not null check (evidence_url ~ '^https://'),
  approved_by   uuid references public.admin_users(id),
  approved_at   timestamptz
);
