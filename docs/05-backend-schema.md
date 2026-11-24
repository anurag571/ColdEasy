# 05 · Backend Schema

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

## 1. Principles

- One Supabase Postgres database in the Mumbai region. Row Level Security is on for every table.
- The public website can read published catalogue and content only. It can never read orders, leads or customers. All writes from the public go through server routes that validate input first.
- Money is stored as whole paise (`integer`), never as decimals.
- Every table has `created_at` and `updated_at`. Admin-edited tables also log changes to `audit_log`.
- Guest checkout only: there is no customer account table at launch.

## 2. What is never stored

| Never stored | Why |
|---|---|
| Card numbers, CVV, UPI PIN, netbanking credentials, bank account numbers | Razorpay handles payment data. We store only Razorpay IDs and status |
| Aadhaar, PAN or any government ID | Not needed for any feature |
| Precise GPS location | Pincode and district are enough |
| Passwords | Admin login uses Supabase Auth with MFA; no password ever reaches our tables |
| Personal data inside analytics events | Events carry product and page data only |
| Real customer data in staging, test or seed data | Synthetic data only |
| Distributor bank details | Collected offline after approval, not through the website |
| Zoho Books passwords or tokens in any table | OAuth credentials live only in Supabase Vault and server environment variables |
| Unapproved or watermarked media in public storage | Drafts stay in a private bucket until approved |

## 3. Tables

```sql
-- Catalogue -----------------------------------------------------------
create type stock_status as enum ('in_stock','low_stock','sold_out','coming_soon','enquire_only');

create table products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name          text not null,
  range_group   text not null check (range_group in ('main','other')),
  sort_order    int  not null default 0,
  description   text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table product_variants (
  id                uuid primary key default gen_random_uuid(),
  product_id        uuid not null references products(id) on delete restrict,
  sku               text not null unique,
  variant_key       text not null default 'default',      -- e.g. 'solar', 'ac-grid'
  variant_label     text,
  mrp_paise         int  not null check (mrp_paise > 0),
  price_paise       int  not null check (price_paise > 0 and price_paise <= mrp_paise),
  gst_rate_bps      int  not null default 0,               -- basis points, e.g. 1800 = 18% [CONFIRM: HSN and GST rate]
  hsn_code          text,
  stock_qty         int  not null default 0 check (stock_qty >= 0),
  low_stock_at      int  not null default 0,
  status            stock_status not null default 'coming_soon',
  emi_eligible      boolean not null default false,
  weight_g          int,
  length_mm         int,
  width_mm          int,
  height_mm         int,                                   -- used for volumetric shipping weight
  is_default        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (product_id, variant_key)
);
create index on product_variants (product_id);

create table product_media (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  variant_id  uuid references product_variants(id) on delete cascade,
  kind        text not null check (kind in ('image','hover','video','poster')),
  storage_path text not null,
  alt_text    text not null check (length(alt_text) > 0),
  provenance  text not null check (provenance in ('photo','photo_retouched','ai_assisted','ai_generated')),
  tool        text,                        -- e.g. 'Veo 3', 'Gemini image'; null for photos
  prompt_ref  text,                        -- link to the prompt log, never the prompt with personal data
  status      text not null default 'submitted' check (status in ('submitted','approved','changes_requested','retired')),
  approved_by uuid references admin_users(id),
  approved_at timestamptz,
  sort_order  int not null default 0,
  check (status <> 'approved' or approved_by is not null),
  check (kind <> 'image' or sort_order <> 0 or provenance in ('photo','photo_retouched'))  -- main image must be a real photo
);

create table product_specs (            -- accordion rows
  id          uuid primary key default gen_random_uuid(),
  variant_id  uuid not null references product_variants(id) on delete cascade,
  section     text not null check (section in ('measurements','features_specs','materials_care')),
  label       text not null,
  value       text not null,
  sort_order  int not null default 0
);

create table product_highlights (
  id          uuid primary key default gen_random_uuid(),
  variant_id  uuid not null references product_variants(id) on delete cascade,
  row_no      int not null default 1,
  value_text  text not null,              -- e.g. '25 kg'
  label       text not null,              -- e.g. 'Capacity'
  claim_id    text,                        -- must match an approved claim (document 08) to publish
  sort_order  int not null default 0
);

create table product_ratings (            -- only if ColdEasy has a verifiable source
  variant_id     uuid primary key references product_variants(id) on delete cascade,
  rating_avg     numeric(3,2) check (rating_avg between 0 and 5),
  review_count   int check (review_count >= 0),
  source         text not null,            -- e.g. 'Amazon listing ASIN ...', 'verified buyer survey'
  evidence_url   text not null,
  approved_by    uuid references admin_users(id),
  approved_at    timestamptz
);

-- People and leads ----------------------------------------------------
create table contacts (
  id            uuid primary key default gen_random_uuid(),
  mobile_e164   text not null unique check (mobile_e164 ~ '^\+91[6-9][0-9]{9}$'),
  name          text,
  email         text,
  persona       text check (persona in ('farmer','vendor','fpo','business','other')),
  pincode       text check (pincode ~ '^[1-9][0-9]{5}$'),
  gstin         text,                    -- latest business GSTIN given at checkout
  zoho_contact_id text unique,           -- set once the customer exists in Zoho Books
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table consents (
  id            uuid primary key default gen_random_uuid(),
  contact_id    uuid not null references contacts(id) on delete cascade,
  purpose       text not null check (purpose in ('marketing_whatsapp_sms','order_updates','lead_followup')),
  granted       boolean not null,
  notice_version text not null,            -- privacy notice version shown
  source_page   text,
  captured_at   timestamptz not null default now()
);
create index on consents (contact_id, purpose, captured_at desc);

create type lead_type as enum ('signup','product_enquiry','bulk','distributor','partner','affiliate','contact','notify_me');
create type lead_status as enum ('new','contacted','qualified','won','lost','spam');

create table leads (
  id            uuid primary key default gen_random_uuid(),
  contact_id    uuid not null references contacts(id) on delete cascade,
  type          lead_type not null,
  status        lead_status not null default 'new',
  owner_id      uuid references admin_users(id),
  product_id    uuid references products(id),
  state         text,
  district      text,
  quantity      int,
  answers       jsonb not null default '{}'::jsonb,   -- type-specific form answers, validated server-side
  message       text check (length(message) <= 2000),
  utm           jsonb not null default '{}'::jsonb,
  source_page   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on leads (type, status, created_at desc);
create index on leads (owner_id, status);

-- Orders ----------------------------------------------------------------
create type order_status as enum ('pending_payment','paid','packed','dispatched','delivered','cancelled','refunded','expired','payment_failed');

create table orders (
  id              uuid primary key default gen_random_uuid(),
  order_no        text not null unique,             -- human readable, e.g. CE-2027-000123
  public_token    text not null unique,             -- 32+ random chars, for /order/[token]
  contact_id      uuid not null references contacts(id),
  status          order_status not null default 'pending_payment',
  channel         text not null default 'web' check (channel in ('web','whatsapp_link')),
  ship_name       text not null,
  ship_line1      text not null,
  ship_line2      text,
  ship_landmark   text,
  ship_city       text not null,
  ship_state      text not null,
  ship_pincode    text not null check (ship_pincode ~ '^[1-9][0-9]{5}$'),
  gstin           text check (gstin is null or gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  subtotal_paise  int not null check (subtotal_paise >= 0),
  shipping_paise  int not null default 0 check (shipping_paise >= 0),
  total_paise     int not null check (total_paise >= 0),
  razorpay_order_id text unique,
  courier         text,
  tracking_no     text,
  utm             jsonb not null default '{}'::jsonb,
  zoho_invoice_id text unique,
  zoho_invoice_no text,                              -- the legal invoice number, issued by Zoho Books
  zoho_payment_id text unique,
  accounting_status text not null default 'not_due'
                  check (accounting_status in ('not_due','queued','synced','retrying','needs_attention')),
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index on orders (status, created_at desc);

create table order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  variant_id    uuid not null references product_variants(id),
  sku           text not null,                      -- snapshot
  name          text not null,                      -- snapshot
  unit_price_paise int not null,
  qty           int not null check (qty between 1 and 20),
  line_total_paise int not null
);

create table payments (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references orders(id),
  razorpay_payment_id text not null unique,
  status              text not null,                -- captured, failed, refunded
  method              text,                         -- upi, card, netbanking, emi
  amount_paise        int not null,
  raw_event_id        uuid,                         -- link to webhook_events
  created_at          timestamptz not null default now()
);

create table webhook_events (           -- idempotency and audit for Razorpay webhooks
  id            uuid primary key default gen_random_uuid(),
  provider      text not null default 'razorpay',
  event_id      text not null unique,   -- x-razorpay-event-id header
  event_type    text not null,
  payload       jsonb not null,         -- contains no card data by Razorpay design
  processed_at  timestamptz,
  received_at   timestamptz not null default now()
);

create table serviceable_pincodes (
  pincode       text primary key check (pincode ~ '^[1-9][0-9]{5}$'),
  city          text, state text,
  min_days      int, max_days int,
  shipping_paise int,
  active        boolean not null default true
);

-- Accounting (Zoho Books) ---------------------------------------------
create table zoho_item_map (             -- one row per SKU, set up with ColdEasy's accountant
  variant_id     uuid primary key references product_variants(id),
  zoho_item_id   text not null unique,
  zoho_tax_id    text not null,            -- GST tax or tax group in Zoho Books
  hsn_code       text not null,
  verified_by    uuid references admin_users(id),
  verified_at    timestamptz
);

create table accounting_sync (           -- the work queue and its history
  id             bigserial primary key,
  order_id       uuid not null references orders(id),
  action         text not null check (action in ('contact','invoice','payment','credit_note','refund')),
  status         text not null default 'queued' check (status in ('queued','done','retrying','needs_attention')),
  attempts       int not null default 0,
  next_try_at    timestamptz not null default now(),
  zoho_ref       text,                     -- id returned by Zoho Books for this step
  last_error     text,                     -- plain-language error shown in the admin
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (order_id, action)
);
create index on accounting_sync (status, next_try_at);

-- Trust content ---------------------------------------------------------
create table customer_stories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  person_name   text not null,
  location      text not null,
  organisation  text,
  quote         text,
  body          text,
  photo_path    text,
  video_url     text,
  consent_ref   text not null,          -- reference to the signed consent on file
  is_featured   boolean not null default false,
  is_published  boolean not null default false,
  sort_order    int not null default 0
);

create table media_features (
  id            uuid primary key default gen_random_uuid(),
  outlet_name   text not null,
  caption       text not null,
  article_url   text not null check (article_url ~ '^https://'),
  screenshot_path text not null,
  logo_path     text,
  published_on  date,
  is_published  boolean not null default false,
  sort_order    int not null default 0
);

create table faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  claim_id      text,
  locale        text not null default 'en',
  is_published  boolean not null default false,
  sort_order    int not null default 0
);

-- Admin -------------------------------------------------------------------
create type admin_role as enum ('owner','operations','marketing','support');

create table admin_users (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  role          admin_role not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table audit_log (
  id            bigserial primary key,
  actor_id      uuid references admin_users(id),
  table_name    text not null,
  row_id        text not null,
  action        text not null check (action in ('insert','update','delete')),
  diff          jsonb,
  at            timestamptz not null default now()
);
create index on audit_log (table_name, row_id, at desc);
```

Note: `product_ratings` references `admin_users`, so the admin table is created first in the real migration order.

## 4. Row Level Security summary

| Table | Public (anon) | Owner | Operations | Marketing | Support |
|---|---|---|---|---|---|
| products, variants, media, specs, highlights | Read where published | All | Edit price, stock, status | Edit copy and media | Read |
| product_ratings | Read where approved | All | Read | Propose | Read |
| contacts, consents | None | All | Read | Read (consented marketing only) | Read |
| leads | None (insert via server only) | All | All | Read and update own | Read and update own |
| orders, order_items, payments | None (order page reads one order by token via server) | All | All | None | Read |
| webhook_events | None | Read | Read | None | None |
| customer_stories, media_features, faqs | Read where published | All | Read | All | Read |
| serviceable_pincodes | Read active rows | All | All | None | Read |
| zoho_item_map, accounting_sync | None | All | Read, retry | None | Read |
| admin_users | None | All | Read self | Read self | Read self |
| audit_log | None | Read | Read | None | None |

## 5. Data rules

| Rule | Detail |
|---|---|
| Minimisation | Signup collects mobile and consent only; persona and pincode are optional. Email is optional at checkout |
| Retention: orders and invoices | 8 years, for GST and accounting records [CONFIRM with ColdEasy's accountant] |
| Retention: leads that never convert | 24 months after last contact, then deleted [CONFIRM] |
| Retention: marketing consent | Until withdrawn, plus proof of consent kept for 3 years after withdrawal |
| Retention: webhook payloads | 13 months |
| Retention: accounting_sync history | 8 years with the order it belongs to |
| Source of truth | Website: products, prices, orders, leads, content. Zoho Books: invoices, tax, payments received, the books. Stock: per document 02, OD-06 |
| Retention: security logs | 180 days minimum (CERT-In) |
| Erasure | On request, delete the contact, leads and consents; orders are kept but anonymised where tax law allows |
| Ownership | All data belongs to ColdEasy. The delivery team accesses it only to build and support, under the access matrix in document 07 |
| Backups | Supabase daily backups with point-in-time recovery on the paid plan; a restore is tested before launch |

## 6. Content files (versioned in the repository)

| File | Contents |
|---|---|
| `content/pages/*.md` | Long-form copy for Home, Science, Impact, About |
| `content/claims.json` | The claims register (document 08): id, text, status, evidence, approver |
| `content/legal/*.md` | Terms, Privacy, Refunds, Shipping, with version and effective date |
| `content/redirects.json` | Old coldeasy.in URL to new URL map |
| `content/locales/en.json` | Every UI string (buttons, labels, errors, toasts) |
| `content/locales/hi.json` | Added in Phase 2 |

## 7. Entity relationships

```
products 1--* product_variants 1--* product_specs
products 1--* product_media      product_variants 1--* product_highlights
product_variants 1--0..1 product_ratings
contacts 1--* consents
contacts 1--* leads *--0..1 admin_users (owner)
contacts 1--* orders 1--* order_items *--1 product_variants
orders 1--* payments
orders 1--* accounting_sync      product_variants 1--0..1 zoho_item_map
contacts 0..1--1 Zoho Books contact (by zoho_contact_id)
webhook_events 1--0..1 payments
admin_users 1--* audit_log
```

## 8. Risks people usually miss

- Upserting contacts by mobile number means anyone can submit someone else's number. Consent is therefore logged per submission, and the first WhatsApp message asks the person to confirm before any marketing.
- Product names and prices are snapshotted on order items. Without this, editing a product rewrites past orders and invoices.
- Stock is decremented when the payment is captured, not when the cart is created, with a re-check when the order is created. Otherwise abandoned carts lock stock.
- The GSTIN format check catches typos only; it does not prove the GSTIN is real. Zoho Books may reject an invalid GSTIN, which shows up as a sync error to fix, not a lost order.
- Prices are stored GST-inclusive. Splitting tax out line by line can differ from the order total by a paisa through rounding; the sync compares totals and holds any mismatch for review rather than posting a wrong invoice.
- A main product image that is AI-generated is blocked by a database check, not just by a guideline.
