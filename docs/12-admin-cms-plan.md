# 12 · Admin and Content Management Plan

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 24 November 2026

> **Status: D-12-01 decided 24 November 2026: custom admin on Supabase (option A).** Implementation prompts: `cursor-admin-build-prompts.md`. This file extends documents 05 (schema), 07 (access) and 09 (tickets, Epic 8). Document 11 still overrides 01 to 10. Where this file changes 05 or 07, the change is listed in section 10. Nothing in this file relaxes document 08 (never invent facts, claims register, build gate).

## 1. The goal in one line

ColdEasy's team runs products, stock, prices, orders, leads, milestones, partners, stories, FAQs, banners and translations themselves, safely, without calling a developer. A developer is needed only for new features, new page layouts and legal-page changes.

**What "safely" means here:** nothing reaches the public site without passing the same checks a developer would apply (claims register, partner permission, reviewer approval for a language), every change is logged and can be undone, and a bad edit can be rolled back in under 2 minutes.

## 2. Benchmark: what the best commerce admins do, and what to copy

| Product | What it does well | Copy for ColdEasy | Do not copy |
|---|---|---|---|
| **Shopify admin** | Home screen is a to-do list (orders to fulfil, low stock, items needing action). Index pages with saved filter tabs and bulk edit. A sticky "unsaved changes" bar with Save and Discard. Order timeline mixing system events and staff comments. Products are Active, Draft or Archived, never hard-deleted. Per-variant inventory with an adjustment history. Granular staff permissions. | All of these. They are the single biggest reason non-technical teams cope with Shopify. | App-store sprawl for basic needs. |
| **Shopify Translate & Adapt** | Source and translation side by side. A translation is flagged **outdated** the moment the English source changes. | Side-by-side editor and source-hash staleness detection. | Auto-translate-and-publish. Machine output never publishes here (doc 08). |
| **WooCommerce** | Order notes split into private and customer-visible. Stock is held for a set number of minutes on unpaid orders. Low-stock email. | Private vs customer notes on orders. Stock hold on `pending_payment` with expiry (already in 05 as `expires_at`). | wp-admin clutter, plugins for core behaviour, weak roles. |
| **Medusa** | Order changes run as workflows with compensating steps (if step 3 fails, steps 1 and 2 are undone). Inventory reservations. | Every order status change goes through one server function with an allowed-transitions table, never a free-text status edit. | Its module system and admin are far more than 4 to 7 SKUs need. |
| **Saleor** | Permission groups with fine-grained permissions. A dedicated **Translations** section: every entity listed against every language with a status. | The translations matrix screen (entity × language × status). Permissions as named actions, not raw table access. | GraphQL-everything and channel complexity. |
| **Sanity** | Draft and published are separate documents. Full revision history with one-click restore. Inline validation with field help text. Shareable preview. | Draft vs live separation, history and restore, validation messages written in plain language, help text on every field. | A hosted second system with its own bill and data outside India (see section 3). |
| **Payload CMS** | Schema defined once in code drives the forms, validation and access rules. Drafts, versions, autosave, live preview, field-level localization, field-level access. Hooks after save (used for cache refresh). | Schema-driven forms: one Zod schema per entity generates the form, the server validation and the field help. Hooks after publish trigger page revalidation. | See section 3 for why we take the patterns, not the product. |

**The patterns that matter most, ranked:** (1) to-do home screen, (2) draft → review → publish with preview, (3) archive instead of delete, (4) history and one-click restore, (5) translation staleness, (6) order timeline with allowed transitions, (7) stock adjustment ledger, (8) sticky save bar with plain-language validation.

## 3. Build vs buy: the architecture decision (D-12-01, decided: A)

| | **A. Custom admin on Supabase** (recommended) | **B. Payload CMS inside the Next.js app** | **C. Sanity for content + custom commerce admin** |
|---|---|---|---|
| What it is | Extend the admin already specified in 05/07/09 with a small, shared draft/revision/approval engine and the screens below | Payload 3 mounted at `/admin`, using the same Supabase Postgres (separate `cms` schema). Content in Payload; orders, payments, Zoho sync stay custom | Hosted headless CMS for pages, milestones, partners, stories, translations. Orders, stock, leads in Supabase with a custom admin |
| Licence and running cost | No new licence. Supabase Pro + Vercel Pro already budgeted | MIT, free. Same hosting. Heavier server bundle on Vercel | Free tier may fit; paid plans charge per seat. A second bill and a second account ColdEasy must own |
| Build effort beyond Epic 8 baseline | About 18 to 28 dev-days (section 9) | About 10 to 16 dev-days: content features come free, but auth bridge, schema coexistence and commerce views cost 5 to 8 | About 12 to 18 dev-days plus a sync between Sanity products and Supabase prices and stock |
| Admin users and MFA | One login: Supabase Auth with MFA, as doc 07 requires | Two auth systems unless a custom Payload strategy reads the Supabase session. Payload has no built-in MFA; doc 07 requires MFA for every admin | Two logins (Sanity and site admin). Sanity SSO/MFA depends on plan |
| Data model | One database, one migration history, RLS on every table | Payload generates and migrates its own tables. RLS does not apply to Payload's connection; access rules live in Payload code. Two sources of schema truth in one database | Products split across two systems: copy in Sanity, price and stock in Supabase. Classic split-brain |
| Per-language approval (11:A6) | Built exactly to ColdEasy's rule: each language goes live only after its reviewer approves | Payload localizes fields, but its draft/publish is per document, not per language. The per-reviewer, per-language gate still has to be built | Possible, but built as custom workflow in Sanity Studio |
| Data residency | All in Mumbai | All in Mumbai | Content hosted outside India. Legal for non-personal content, but breaks the doc 02 "all data in India" line we told the client |
| Lock-in | None beyond Supabase (plain Postgres, exportable) | Low licence lock-in, high framework coupling: Payload pins Next.js versions, upgrades are a recurring tax, and a Figma-owned roadmap | Medium: content model and editor live in a vendor's cloud |
| Fit for AI-assisted build in Cursor | Strong: plain Next.js + Supabase + SQL is what coding agents do most reliably | Weaker: Payload 3 APIs changed recently; agents mix up v2 and v3 config | Medium |
| When it is the right call | Small catalogue, small content set, strict compliance gates, one owner | A content-heavy site (blog, many landing pages, many editors) | A marketing team that lives in a CMS and has a separate commerce platform |

**Recommendation: A, custom admin on Supabase, copying the Shopify, Saleor, Sanity and Payload patterns from section 2.**

Why, bluntly:

1. **The content set is tiny.** 4 to 7 SKUs, 5 to 8 milestones, perhaps 20 partners, a handful of stories and FAQs, and about 300 to 600 UI strings. A CMS earns its keep at hundreds of documents and many editors. ColdEasy has neither.
2. **The hard rules are ColdEasy-specific, so they are custom work in every option.** "No permission record, no logo", "no claim without an approved register entry", "a language goes live only after its named reviewer approves", "main image must be a real photo". No CMS ships these. In B and C we would build them anyway, on top of someone else's model.
3. **One login, one database, one audit log.** Doc 07 promises MFA on every admin and RLS on every table. B breaks the first unless we bridge auth; C breaks both. Two systems also means two places to remove a leaver's access at handover, which is the risk doc 07 rates "High".
4. **Commerce stays custom regardless.** Orders, payments, refunds and the Zoho queue are custom in all three options. B and C give ColdEasy two admin experiences to learn.

**What A costs that B would not:** about 8 to 12 more dev-days, and we own a small draft/revision engine. The trap is building a bad mini-CMS. The guard is scope: one `content_revisions` table, one approval flow, one generic form renderer, and nothing else generic. If ColdEasy later wants a blog or many landing pages (Phase 2+), revisit Payload; the revision design below maps onto it cleanly.

**Not reopened here:** OD-01 (Shopify for commerce) stays "custom for launch" per doc 02.

## 4. Roles and permissions

Permissions are named actions, checked in one server function (`can(actor, action, resource)`) and mirrored in RLS through a `has_permission()` SQL function. Roles are fixed in code; no role editor (a role editor is how owners lock themselves out).

| Role (doc 11 owner name) | Who | Can do | Cannot do |
|---|---|---|---|
| `owner` (Founder) | 1 to 2 people | Everything, including publish, approve, team, settings, claims, exports of personal data | Delete audit log (nobody can) |
| `operations` (Product / Operations) | Ops lead | Stock, price (within guardrails), product status, orders end to end, pincodes, leads, accounting retry | Publish product copy or claims, change team, export contacts |
| `marketing` (Marketing / Content) | Content owner | Draft and edit product copy, media, stories, FAQs, milestones, partners, banners, UI copy; submit for review | Change price or stock, see orders, publish anything that needs approval |
| `support` | Support staff | Read orders and leads, add notes, update lead status, mark orders packed/dispatched if ColdEasy wants | Edit catalogue, export, refunds |
| `reviewer` (new) | One per language, scoped by `locales[]` | Edit and approve translations for their own language only | Anything else. Cannot see orders, leads or personal data |
| `developer` (new) | Delivery team | Full access on staging. On production: none by default; time-boxed break-glass access granted by owner, auto-expires, fully logged | Hold standing production access after handover |

**Approval rules (keep this list short, or the founder becomes the bottleneck):**

| Change | Who can make it | Goes live |
|---|---|---|
| Stock quantity, Sold Out | operations, owner | Immediately, logged |
| Price within ±10% of current and not below `price_floor_paise` | operations, owner | Immediately, logged |
| Price outside that band, or a new MRP | operations proposes | After owner approval |
| Product copy, specs, highlights, FAQ answers | marketing | After owner approval if any field references a claim, else marketing publishes directly |
| New product, product media | marketing / operations | After owner approval (media also needs provenance per doc 04 §11) |
| Milestones, partners | marketing | After owner approval (proof 11:K2-03, permission 11:K3-05 attached) |
| Stories, media features | marketing | After owner approval (consent reference required) |
| Translations | reviewer for that language | Approved strings go live only once the language is switched on; switching a language on needs owner approval |
| Site banner | operations, marketing, owner | Immediately (it is the outage switch in doc 07 §9) |
| Owner's own edits | owner | Owner may publish directly; the audit log records "self-approved" |

Owner can delegate approval to a named second person when travelling (`approval_delegate_id`, with an end date).

## 5. Data schema

Build on doc 05. New tables and changed columns only. SQL is indicative; the Cursor build writes the real migrations.

### 5.1 Shared publishing columns (every publishable table)

```sql
create type content_status as enum ('draft','in_review','published','archived');
-- added to: products, product_variants (copy fields only), customer_stories, media_features,
-- faqs, milestones, partners, partner_categories, banners
status        content_status not null default 'draft',
is_published  boolean generated always as (status = 'published') stored,  -- keeps doc 05 RLS policies working
published_at  timestamptz,
published_by  uuid references admin_users(id),
updated_by    uuid references admin_users(id),
version       int not null default 1           -- optimistic locking: save fails if someone else saved first
```

Rule: no hard delete on any of these tables. "Delete" in the UI sets `archived`.

### 5.2 Draft, review and history

```sql
create table content_revisions (
  id            bigserial primary key,
  entity_type   text not null,              -- 'product','milestone','partner',...
  entity_id     uuid not null,
  locale        text not null default 'en',
  data          jsonb not null,             -- full proposed state of the editable fields
  base_version  int not null,               -- live version this draft started from
  status        text not null check (status in ('draft','in_review','changes_requested','approved','published','superseded','discarded')),
  created_by    uuid not null references admin_users(id),
  submitted_at  timestamptz,
  reviewed_by   uuid references admin_users(id),
  reviewed_at   timestamptz,
  review_note   text,
  created_at    timestamptz not null default now()
);
create index on content_revisions (entity_type, entity_id, created_at desc);
create index on content_revisions (status) where status = 'in_review';
```

- The live row is always the published state. Editing a published item creates a revision; the public never sees it.
- Approving runs one database function `publish_revision(id)` in a transaction: re-runs every publish check (section 5.6), applies `data` to the live row, bumps `version`, writes the audit log, then calls revalidation.
- Every published revision is kept, so **history and restore** = "publish an old revision again".
- If `base_version` no longer matches the live row (someone else published first), the approve button is blocked and shows both versions.

### 5.3 New content tables

```sql
create table media_assets (                -- one library for all non-product images and files
  id            uuid primary key default gen_random_uuid(),
  bucket        text not null check (bucket in ('public','private')),
  storage_path  text not null unique,
  mime          text not null,
  width_px int, height_px int, bytes int,
  alt_text      text,                       -- required before use on a public page
  credit        text,
  provenance    text not null check (provenance in ('photo','photo_retouched','ai_assisted','ai_generated','logo','document')),
  exif_stripped boolean not null default false,  -- GPS and device data removed on upload
  uploaded_by   uuid references admin_users(id),
  created_at    timestamptz not null default now()
);
-- product_media (doc 05) gains: media_asset_id uuid references media_assets(id)

create table milestones (                   -- 11:A3
  id            uuid primary key default gen_random_uuid(),
  year          int not null check (year between 2015 and 2100),
  month         int check (month between 1 and 12),
  label_override text,                      -- e.g. 'Today', only if ColdEasy supplies it
  title         text not null check (array_length(regexp_split_to_array(trim(title), '\s+'), 1) <= 6),
  description   text not null check (array_length(regexp_split_to_array(trim(description), '\s+'), 1) <= 25),
  photo_id      uuid references media_assets(id),
  photo_credit  text,
  proof_ref     text,                       -- 11:K2-03, required if the milestone names an award, grant or funder
  needs_proof   boolean not null default false,
  sort_order    int not null default 0
  -- + shared publishing columns
);
create table milestone_partners (milestone_id uuid references milestones(id) on delete cascade,
                                 partner_id uuid references partners(id), primary key (milestone_id, partner_id));

create type partner_category as enum ('deployment','finance','research','csr','ecosystem');

create table partner_categories (           -- the five buttons, copy per 11:K3-03
  key           partner_category primary key,
  label         text not null,
  blurb         text check (array_length(regexp_split_to_array(trim(blurb), '\s+'), 1) between 40 and 60),
  sort_order    int not null
  -- + shared publishing columns
);

create table partners (                     -- 11:A4
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  category        partner_category not null,
  website_url     text check (website_url is null or website_url ~ '^https://'),
  may_link        boolean not null default false,
  description     text,
  logo_color_id   uuid references media_assets(id),
  logo_mono_id    uuid references media_assets(id),   -- white or single colour for dark backgrounds (11:K3-04)
  permission_ref  text,                     -- 11:K3-05, e.g. email date and sender
  permission_doc_id uuid references media_assets(id), -- the email or letter, private bucket
  is_public_body  boolean not null default false,     -- 11:K3-07: name in text, no emblem, unless formal permission
  formal_permission_ref text,
  do_not_name     boolean not null default false,     -- 11:K3-06: can never be published
  sort_order      int not null default 0,
  -- + shared publishing columns
  check (status <> 'published' or (permission_ref is not null and permission_doc_id is not null and not do_not_name)),
  check (not (is_public_body and logo_color_id is not null and formal_permission_ref is null))
);

create table banners (
  id            uuid primary key default gen_random_uuid(),
  message       text not null check (length(message) <= 140),
  link_url      text,
  tone          text not null default 'info' check (tone in ('info','warning')),
  starts_at     timestamptz, ends_at timestamptz,
  sort_order    int not null default 0
  -- + shared publishing columns
);

create table claims (                       -- doc 08 register moves from content/claims.json to the database
  id            text primary key,           -- 'C-01'
  text          text not null,
  status        text not null check (status in ('unverified','approved','retired')),
  evidence_ref  text,
  approved_by   uuid references admin_users(id),
  approved_at   timestamptz
);
-- product_highlights.claim_id and faqs.claim_id become foreign keys to claims(id)

create table feature_flags (                -- change requests ship dark (11 Part A rule 5)
  key           text primary key,           -- 'partner_ecosystem','dark_home','lang_toggle','zoho_sync'
  enabled       boolean not null default false,
  change_note_ref text,                     -- approved change note; required to enable in production
  updated_by    uuid references admin_users(id),
  updated_at    timestamptz not null default now()
);

create table site_settings (                -- typed singletons: WhatsApp number, support hours, price floor band
  key text primary key, value jsonb not null, updated_by uuid references admin_users(id), updated_at timestamptz default now()
);
```

### 5.4 Translations

```sql
create table locales (
  code          text primary key check (code in ('en','hi','te','kn','ta','mr','bn')),
  english_name  text not null, native_name text not null,
  font_family   text not null,              -- Noto Sans per script (11:K5-08)
  status        text not null default 'hidden' check (status in ('hidden','in_review','live')),
  reviewer_id   uuid references admin_users(id),       -- 11:K5-03
  support_ref   text,                       -- 11:K5-07; null means "do not imply support in this language"
  approved_by   uuid references admin_users(id), approved_at timestamptz,
  launch_rank   int                         -- 11:K5-02
);

create table translation_keys (             -- every UI and page string; mirrors the K5-05 Excel
  key           text primary key,           -- 'home.hero.title'
  namespace     text not null,              -- 'header','home','product','science','contact',...
  source_en     text not null,
  source_hash   text not null,              -- sha256 of source_en; trigger updates on change
  context_note  text,                       -- where it appears, for the reviewer
  max_chars     int,
  claim_id      text references claims(id), -- strings carrying a claim
  updated_at    timestamptz not null default now()
);

create table translations (
  key           text references translation_keys(key) on delete cascade,
  locale        text references locales(code),
  value         text not null,
  status        text not null check (status in ('machine_draft','in_review','approved','stale')),
  source_hash   text not null,              -- hash of the English it was translated from
  translated_by text, reviewed_by uuid references admin_users(id), approved_at timestamptz,
  primary key (key, locale)
);

create table content_translations (         -- translated fields of database content (product name, milestone title, FAQ...)
  entity_type text, entity_id uuid, field text, locale text references locales(code),
  value text not null, status text not null, source_hash text not null,
  reviewed_by uuid references admin_users(id), approved_at timestamptz,
  primary key (entity_type, entity_id, field, locale)
);

create table glossary_terms (               -- 11:K5-04
  term text, locale text references locales(code), value text, keep_in_english boolean not null default false,
  primary key (term, locale)
);
```

Rules:

- When `source_en` changes, a trigger marks every translation of that key `stale`.
- A stale string that carries a claim, a number or a price falls back to English until re-approved. A stale cosmetic string keeps showing its old translation and sits in the reviewer's queue; the reviewer can mark it "still correct".
- A language can be switched to `live` only when 100% of keys in the namespaces chosen under 11:K5-01 are `approved`. No half-translated pages.
- `faqs.locale` from doc 05 is replaced by `content_translations`; one FAQ row, many languages.
- `content/locales/*.json` stops being edited by hand. It becomes a build-time export of approved rows, so the site still serves static strings and works if the database is down.

### 5.5 Commerce additions

```sql
create table stock_movements (              -- ledger: every change to stock_qty has a reason
  id          bigserial primary key,
  variant_id  uuid not null references product_variants(id),
  delta       int not null,
  reason      text not null check (reason in ('opening','manual_adjust','received','sale','cancel_restock','return','damage','correction')),
  order_id    uuid references orders(id),
  note        text,
  actor_id    uuid references admin_users(id),
  created_at  timestamptz not null default now()
);
-- product_variants.stock_qty is only changed by the function adjust_stock(), which writes this ledger.
-- product_variants gains: price_floor_paise int, status_override stock_status (null = derive from qty)

create table order_events (                 -- the order timeline
  id          bigserial primary key,
  order_id    uuid not null references orders(id),
  kind        text not null check (kind in ('status_change','note','customer_note','system','payment','accounting')),
  from_status order_status, to_status order_status,
  body        text,
  visible_to_customer boolean not null default false,
  actor_id    uuid references admin_users(id),
  created_at  timestamptz not null default now()
);

create table order_status_transitions (     -- the only allowed moves
  from_status order_status, to_status order_status, required_permission text not null,
  primary key (from_status, to_status)
);
-- paid->packed, packed->dispatched (needs courier + tracking), dispatched->delivered,
-- paid|packed->cancelled (starts refund), delivered->refunded (owner only). 'paid' is set only by the Razorpay webhook (doc 06).
```

Stock status is derived from quantity (`0` = Sold Out, `<= low_stock_at` = Low Stock) unless operations sets `status_override` (for Coming Soon, Enquire Only). This removes the doc 05 ambiguity where `status` and `stock_qty` could disagree.

**Open dependency:** if OD-06 makes Zoho Books the stock master, stock becomes read-only in this admin and `stock_movements` records the sync instead. Do not build both directions.

### 5.6 Publish checks (enforced in `publish_revision`, not just the UI)

| Entity | Blocks publish when |
|---|---|
| Any | Text contains `[CONFIRM` or `[TBC]` |
| Product, FAQ, highlight, translation key | Any referenced `claim_id` is not `approved` |
| Product | No real-photo main image (doc 05 check); price missing or conflicting (11:A7) |
| Media | `alt_text` empty, `exif_stripped` false, provenance AI without approval |
| Partner | No permission record and document; `do_not_name`; public-body emblem without formal permission |
| Milestone | `needs_proof` and no `proof_ref`; links to a partner that is not publishable |
| Story | No `consent_ref` |
| Locale go-live | Under 100% approved for the scoped namespaces; no named reviewer |
| Feature flag on production | No `change_note_ref` |

### 5.7 Audit log (hardened)

Doc 05's `audit_log` gains `actor_role`, `reason`, `request_id` and `before`/`after` (instead of one `diff`). Rules:

- Written by triggers on every admin-edited table. Server functions set `app.actor_id` with `set_config` so writes made with the service role are still attributed to a person.
- Append-only: `insert` only, no `update` or `delete` grant for any role, enforced by trigger.
- Also logs: logins and failed MFA, permission denials (doc 07 §8), every CSV export (who, what, how many rows), break-glass access, feature-flag changes.
- Viewable by owner (all) and operations (catalogue and orders). Kept 8 years for catalogue and price changes (pricing disputes, Legal Metrology), 180 days minimum for security events (CERT-In).

### 5.8 Relationships added

```
media_assets 1--* product_media, milestones.photo, partners.logo_*, partners.permission_doc
content_revisions *--1 (any publishable entity)
milestones *--* partners (milestone_partners)
partner_categories 1--* partners
claims 1--* product_highlights, faqs, translation_keys
translation_keys 1--* translations *--1 locales
locales 1--0..1 admin_users (reviewer)
product_variants 1--* stock_movements *--0..1 orders
orders 1--* order_events
```

## 6. Admin layout

```
Home (to-do)   Orders   Products   Inventory   Leads   Content ▾   Translations   Approvals (n)   Settings ▾
                                                       Milestones                                   Team
                                                       Partners                                     Pincodes
                                                       Stories                                      Claims
                                                       Media features                               Feature flags
                                                       FAQs                                         Accounting sync (CR-01)
                                                       Banners                                      Audit log
                                                       Media library                                Backups
```

Every screen: plain-language help text under each field, a sticky save bar, inline validation, "Preview" and "Submit for review" (or "Publish" where allowed), and a History tab. Times shown in IST. Works on a phone for the two things a founder does on the move: approve and check orders.

**Home to-do** shows only what needs action: paid orders not packed, packed not dispatched over 24 hours, low and zero stock, items waiting for my approval, changes I submitted that came back, stale translations in my language, accounting sync errors, new leads not contacted within the M-08 target.

## 7. User journeys

Each journey ends with an audit entry and, where public content changed, a page refresh confirmed on screen ("Live on the site at 14:32").

**J1. Add a new product (marketing + operations, owner approves)**
1. Products → New product. Enter name, slug (auto-filled, editable), range, description. Saved as Draft; invisible to the public.
2. Add variants: SKU, label, MRP, price, GST rate, HSN, weight and dimensions. Operations fills stock with an "opening" movement.
3. Media tab: upload from the media library. The first image must be tagged as a real photo or publish is blocked. EXIF location is stripped on upload; HEIC is converted.
4. Specs and highlights: each highlight that states a number picks a claim from the register. If the claim is unverified, the field shows "This claim is not approved yet; the product cannot be published with it."
5. Preview: opens the real product page with a yellow "Preview: not live" bar, desktop and phone width. "Copy preview link" makes a signed link valid 72 hours for the founder to open on WhatsApp.
6. Submit for review. Owner sees it in Approvals, opens the preview, approves or sends back with a note.
7. On approval, publish checks run again, the page goes live, sitemap and product listing refresh.

**J2. Edit product copy that is already live (marketing)**
1. Open the product and edit. A draft revision is created; the live page is untouched.
2. The History tab shows "Draft by Priya, based on version 7".
3. No claim fields changed → Publish directly. Claim fields changed → Submit for review (J1 step 6).
4. If someone published version 8 meanwhile, publish is blocked and both versions are shown side by side.

**J3. Update stock (operations)**
1. Inventory screen: one row per variant with current quantity, a +/− adjust box and a reason picker (received, damage, correction...).
2. Save writes a stock movement and updates the quantity. Status changes to Low Stock or Sold Out automatically; product page refreshes within a minute.
3. Bulk: upload a CSV of SKU and counted quantity; the screen shows the differences as movements before applying.
4. Notify-me leads for a variant that goes from 0 to above 0 are listed for follow-up (no automatic messaging at launch).

**J4. Change a price (operations, owner approval outside the band)**
1. Edit price on the variant. Within ±10% and above the floor: save goes live, logged with a reason.
2. Outside the band or a new MRP: becomes a pending price change; owner approves from Approvals.
3. Strike-through MRP is shown only when price < MRP and the MRP has been the live MRP for at least the period ColdEasy sets [CONFIRM: policy], so the site never shows a manipulated discount (doc 07, CCPA dark patterns).
4. Checkout always re-reads price; a customer mid-checkout sees "Price updated" before paying.

**J5. Handle orders (operations / support)**
1. Orders list with tabs: To pack, To dispatch, In transit, Delivered, Cancelled and refunded, Payment issues. Filters: date, state, product. Search by order number or mobile.
2. Open an order: items (snapshotted), customer, address, GSTIN, payment, Zoho invoice status, and the timeline.
3. Mark packed → Mark dispatched (courier and tracking required) → customer gets the update email → Mark delivered.
4. Notes: private by default; "visible to customer" notes appear on the order status page.
5. Cancel: allowed only from paid or packed. It restocks automatically (stock movement) and opens the Razorpay refund (link to the Razorpay dashboard at launch, T-142). The refund webhook sets `refunded` and queues the Zoho credit note.
6. Export CSV: owner and operations only, filtered, logged with row count.
7. Order amounts, items and addresses are never editable after payment. Address changes are a note plus a courier instruction.

**J6. Update milestones (person named in 11:K2-04, owner approves)**
1. Content → Milestones: a list in display order, drag to reorder.
2. Add or edit: year, optional month, title (word counter, max 6), description (max 25), optional photo from the library with credit.
3. Tick "Names an award, grant, funder or partner" → proof reference becomes required; linked partners must be publishable.
4. Preview the About page with the new timeline; submit; owner approves.
5. The section shows on production only when 5 or more milestones are published.

**J7. Add a partner (marketing, owner approves)**
1. Content → Partners → New. Name, category (one of five), website, "logo may link" toggle.
2. Upload colour and mono logos. Upload the permission email or letter (private bucket, never public) and type its reference.
3. The form refuses to publish without permission, and shows why. "Do not name" partners (11:K3-06) can be stored for internal tracking but never published.
4. Preview the About page: category buttons, panel copy and the logo strip on dark.
5. Withdrawal: if a partner withdraws permission, Archive removes them from the site within a minute; the permission record is kept.

**J8. Publish a translation (reviewer, owner switches the language on)**
1. Translations: a matrix of namespaces × languages with % approved, and a filter for Stale.
2. The reviewer opens their language: English on the left, translation on the right, context note and glossary hints beside each string, character limit shown.
3. Edit, then mark Approved per string, or "Approve all in this namespace" after reading.
4. Bulk path (the agreed K5-05 Excel): Export Excel → reviewer edits offline → Import. Import shows a diff and only changes `value` and `status` for that reviewer's language.
5. Preview any page in that language from the editor.
6. When the scoped namespaces reach 100%, owner sees "Hindi is ready to go live" and switches it on. The toggle shows Hindi from then on, with `hreflang` and the font for that script.
7. English changes later → affected strings turn Stale and appear in the reviewer's to-do.

**J9. Approve drafts (owner, usually on a phone)**
1. Approvals (n) badge, also an email digest twice a day. One list: what changed, who, when, and a link to preview.
2. Each item shows a before/after diff of the fields that changed and the publish-check results (all green, or which rule fails).
3. Approve → goes live. Send back → note to the author. Nothing auto-approves on a timer.

**J10. Undo a mistake (owner, marketing for own content)**
1. Any item → History → pick a version → "Restore this version". It goes through the same approval rules as a new edit.
2. Wrong price or wrong claim live: Archive or Unpublish from the item (doc 07 §9); page refreshes within a minute. For a broken site, roll back the Vercel deployment (under 2 minutes, developer or owner).

**J11. Checkout is down (anyone on duty)**
1. Banners → turn on "Order on WhatsApp while we fix checkout". Live immediately, no approval.

**J12. Add or remove a team member (owner)**
1. Settings → Team → Invite: email, name, role, languages (reviewers). They must set up MFA before the first screen loads.
2. Remove: deactivates immediately and ends sessions. Quarterly access review reminder on the owner's to-do.

## 8. Preview, backup and recovery

**Preview before publish**
- Next.js Draft Mode. `/api/preview` checks an admin session (or a signed, expiring preview token), sets the draft cookie and renders the page from the draft revision instead of the live row.
- A fixed "Preview: not live" bar with Exit preview and the revision number. Preview pages are `noindex` and never cached.
- Language and device switch inside preview.

**Backups**

| Layer | What protects it | Note people miss |
|---|---|---|
| Database | Supabase Pro daily backups (7-day retention on Pro) | Point-in-time recovery is a paid add-on, not part of Pro. Doc 05 §5 currently implies it is included; correct that. Decide whether ColdEasy pays for PITR [CONFIRM] |
| Off-platform copy | Nightly GitHub Action: `pg_dump`, encrypted, to a ColdEasy-owned bucket in India, kept 30 days plus monthly copies for 12 months | Without this, losing the Supabase account loses everything. The dump holds personal data: encrypt it and limit who holds the key |
| Files (images, logos, permission letters) | Nightly sync of Supabase Storage buckets to the same off-platform bucket | **Supabase database backups do not include Storage files.** A deleted bucket is gone without this |
| Content mistakes | `content_revisions` history and restore (J10) | Faster than any backup restore for a bad edit |
| Code and deploys | GitHub, Vercel instant rollback | |
| Restore drill | Before launch, then quarterly: restore the latest dump into a throwaway project, check row counts, delete it | Never restore production into staging. Staging must stay synthetic (doc 05 §2) |

**Exit and ownership:** Settings → Backups → "Export all content" gives ColdEasy an Excel workbook of catalogue, content and translations at any time, so they never depend on us to get their data out.

## 9. Scope: what is in the signed scope and what is a change request

The signed SOW is still a draft with [CONFIRM] prices, so the line below is drawn against the charter and PRD (FR-22 to FR-24, Epic 8). Anurag must check it against the signed version before quoting.

| Item | Status | Rough effort (dev-days) |
|---|---|---|
| Admin login, MFA, 2 roles (owner, operations); products, variants, price, stock, Sold Out; orders with status; leads; CSV export; trust content (stories, media, FAQs, banners); pincodes; audit log view; revalidation | **In scope** (FR-22, FR-23, FR-24 Must, T-140 to T-148) | Baseline |
| Marketing and Support roles | In scope as a "Should" (FR-24) | 1 |
| Milestones admin (11:A3) | **In scope** per doc 11 ("content update"), but the admin screen and table are new work. Treat as in scope; it is small | 1.5 to 2 |
| Draft → review → approve, preview links, version history and restore for all content | **Change request.** Not in FR-22/23. This is the main "no developer needed" upgrade | 5 to 7 |
| Reviewer role, translations module (keys, matrix, side-by-side editor, Excel import/export, staleness, locale go-live) | **Change request**, part of the language-toggle CR (11 Part B §2 item 5) | 5 to 7 |
| Partners admin with permission records (11:A4) | **Change request**, part of the partner-ecosystem CR (item 3) | 2 to 3 |
| Media library with EXIF stripping and HEIC conversion | Partly in scope (product media, T-249 is CR-02). General library is a **change request** | 2 |
| Stock ledger, price guardrails, order timeline and transitions | Mostly in scope as good practice inside T-141/T-142. Price-approval band is a small **change request** | 1 to 2 |
| Claims register moved to the database and editable by owner | **Change request** (doc 02 §5 keeps it in the repo) | 1 |
| Feature flags screen, site settings | In scope as build hygiene (doc 11 rule 5 requires flags) | 0.5 |
| Home to-do screen | **Change request** (nice to have; strongly recommended) | 1.5 |
| Hardened audit log (append-only, exports, logins, break-glass) | In scope (doc 05, 07); hardening is small | 1 |
| Off-platform backups, Storage sync, restore drill | In scope as launch hygiene (doc 05 §5, doc 10) | 1.5 |
| Page copy (home, product, science sections) editable in the admin via translation keys | **Change request.** Doc 02 §5 keeps page copy in the repo behind a pull request. Moving it to the admin is what makes "no developer for basic copy" true | Included in translations module |
| Zoho Books integration, including the accounting sync screen, item mapping and connection screen (section 13) | Already **change request CR-01** (Epic 11, T-220 to T-232) | Already quoted; section 13 adds the dispatch-needs-invoice rule, the API budget guard and the two tax ids (about 1 to 2 more days) |
| Legal pages editable in the admin | **Not recommended.** Lawyer-reviewed text stays in the repo | — |

**Total beyond the in-scope baseline: about 18 to 28 dev-days**, most of it in two buckets (publishing workflow, translations). If ColdEasy wants to cut cost, cut the home to-do and the price band first; never cut preview or history, which are what stop a bad edit going live.

## 10. Changes this file makes to documents 02, 05, 07 and 09

| Doc | Change |
|---|---|
| 02 §5 | Page copy and UI strings move from hand-edited `content/` files to the database, edited in the admin with approval; `content/locales/*.json` become build-time exports. Legal text stays in the repo |
| 05 §3 | Add tables in sections 5.2 to 5.5. Replace `is_published` booleans with `status` (keep `is_published` as a generated column). Add `media_asset_id` to `product_media`. Replace `faqs.locale` with `content_translations`. Move `content/claims.json` to the `claims` table. Add `reviewer` and `developer` to `admin_role` |
| 05 §5 | Correct the backup line: PITR is an add-on; Storage is not in database backups; add off-platform copies |
| 07 §2 | Add reviewer and developer (break-glass) roles to the access matrix |
| 05 §3 | `zoho_item_map`: two tax ids instead of one; add `zoho_connection`, `zoho_api_usage` (section 13.10) |
| 06 §7 | Section 13 adds contact match order, sales-order option, the dispatch rule, API budget, search-before-create and the test-organisation rule |
| 09 Epic 8 | Add tickets for the change requests above once approved |

## 11. Risks people usually miss

| Risk | Decision |
|---|---|
| The founder becomes the approval bottleneck and nothing gets published | Approval only where a rule demands it (section 4). Owner can delegate. Twice-daily digest. Nothing auto-approves |
| A mini-CMS that grows forever | One revisions table, one approval flow, one form renderer. New content types need a change request |
| "Manage everything without a developer" is infinitely expandable | The admin is defined by the screen list in section 6. Anything else is a change request (strategy note, line 138) |
| Stale pages after an edit (revalidation silently fails) | The admin shows "Live on the site at hh:mm" only after the revalidate call succeeds, otherwise a red retry. Nightly full rebuild as a safety net |
| Hard deletes break past orders and invoices | No hard delete anywhere; archive only; foreign keys `restrict` |
| Stock quantity overwritten with no explanation | All changes go through `adjust_stock()` with a reason; the ledger reconciles to the quantity |
| Phone photos leak farmers' GPS location in EXIF | Strip EXIF on every upload, block publish until stripped |
| Mixed-language pages from string-level fallback | A language goes live only at 100% approved for its scoped pages |
| Outdated translations still showing an old price or claim | Stale claim-bearing strings fall back to English until re-approved |
| CSV export is the easiest way to leak every customer's phone number | Owner and operations only, logged with row count, contacts export owner only |
| Writes through the service role show up in the audit log as "nobody" | `set_config('app.actor_id')` in every server function |
| Backups exist but have never been restored | Quarterly drill into a throwaway project |
| Delivery team keeps production access after handover | Developer role is staging-only; production access is break-glass, time-boxed, logged |
| Nobody at ColdEasy is trained, so they phone the developer anyway | Field help text, 1-page SOP per journey, and a recorded walkthrough; launch gate: Ops completes J3 and J5 alone (PRD acceptance) |

## 12. Open decisions

| ID | Decision | Recommendation |
|---|---|---|
| D-12-01 | Admin architecture: custom on Supabase, Payload, or Sanity + custom | **Decided 24 Nov 2026: custom on Supabase** |
| D-12-02 | Price change band without approval | ±10% and above floor [CONFIRM with ColdEasy] |
| D-12-03 | Can Support mark orders packed and dispatched? | Yes, if Ops is a single person [CONFIRM] |
| D-12-04 | Pay for Supabase PITR | Yes once orders go live; daily backups alone can lose up to 24 hours of orders [CONFIRM] |
| D-12-05 | Who approves when the founder is away | Named delegate with an end date [CONFIRM: name] |
| OD-06 | Stock master (doc 02) | Still open; decides whether stock is editable here. See section 13.4 and Q-Z3, Q-Z5 |
| Q-Z1 to Q-Z12 | Zoho Books questions for ColdEasy | Section 13.12 |

## 13. Zoho Books integration (change request CR-01)

> **Change request.** Zoho Books was added on 18 November 2026 as CR-01 (doc 09 Epic 11, tickets T-220 to T-232). Nothing in this section is built until CR-01 is approved. ColdEasy **already uses Zoho Books**, so we connect to a live set of books with existing items, customers, invoice series and accounts. That raises the stakes compared with a fresh set-up. This section sits on top of doc 06 §7 and changes it where they differ.

### 13.1 Who owns what

**Rule:** Zoho Books is the financial system of record. Supabase is the system of record for website content and for orders as they happen online. Each field has one owner, and a field is never written from both sides.

| Data | Owner | Direction | Notes |
|---|---|---|---|
| Item identity, HSN code, GST tax rates, income account | **Zoho Books** | Zoho → website (read) | The website links each SKU to an existing Zoho item in `zoho_item_map`. It never creates or edits items in Zoho |
| Product name, copy, media, specs, display price, MRP | **Website** | None | The invoice line carries the website price explicitly, so the Zoho item rate is not used. The nightly report flags any difference from the Zoho rate as information only |
| Stock | **Open, OD-06** | One way only (see 13.4) | Never synced in both directions |
| Customers (contacts) | **Zoho Books** for accounting; website `contacts` for order handling | Website → Zoho (find or create) | Edits made in Zoho never flow back. Match order: GSTIN (B2B), then mobile, then email, so the sync never creates a duplicate of a customer ColdEasy already has |
| Orders | **Website** | Website → Zoho (as invoice, or sales order then invoice, see 13.3) | |
| Sales orders | Zoho, **only if ColdEasy uses Zoho Inventory or sales orders today** | Website → Zoho | Not created otherwise. They add calls and steps for no gain |
| Invoices and invoice numbers | **Zoho Books** | Website → Zoho (create), Zoho → website (number and PDF) | Zoho issues the only GST invoice and its number (OD-07). The website shows only `CE-` order numbers |
| Payments received | **Zoho Books** (recorded from Razorpay data) | Website → Zoho | Reference = Razorpay payment id |
| Refunds and credit notes | **Zoho Books** | Website → Zoho | Triggered by the Razorpay refund webhook |
| Razorpay fees, settlements, bank reconciliation | **Zoho Books** (accountant) | None | Not posted by the sync [CONFIRM with accountant] |
| Leads, enquiries, partners, content | **Website** | None | Never sent to Zoho |

### 13.2 Connection and security

- **India data centre only:** auth at `https://accounts.zoho.in`, API at `https://www.zohoapis.in/books/v3`. ColdEasy's organisation must be on the India DC; a token from `.com` will not work [CONFIRM: DC].
- **Server-based OAuth 2.0 client**, registered in the Zoho API Console by a ColdEasy Zoho admin (not a personal delivery-team login). Narrowest scopes: `ZohoBooks.contacts.CREATE,READ,UPDATE`, `ZohoBooks.invoices.CREATE,READ`, `ZohoBooks.customerpayments.CREATE,READ`, `ZohoBooks.creditnotes.CREATE,READ`, `ZohoBooks.settings.READ`, `ZohoBooks.items.READ`, plus `ZohoBooks.salesorders.CREATE,READ` only if 13.3 says so.
- **Refresh token** lives only in Supabase Vault. The client id and secret are server environment variables (doc 02 §7). Nothing Zoho-related ever reaches the browser.
- **One access token, shared and cached.** Access tokens last one hour. Zoho limits how many access tokens a refresh token can mint in a short window, and caps refresh tokens per user and client (the oldest is revoked silently when the cap is passed). So the worker stores the current access token with its expiry, refreshes under a database lock (`pg_advisory_xact_lock`), and never refreshes per request. **People miss this one:** each new "authorise again" during testing creates a refresh token, and it can quietly revoke the one production uses.
- **Alerts:** a failed refresh, or a 401 after a refresh, raises an owner and operations alert within the hour and pauses the queue. It does not keep retrying with a dead token.
- **Revocation runbook:** on any suspicion, revoke in the API Console, re-authorise, and store the new token. Orders queue up meanwhile and nothing is lost.

### 13.3 Flow per order

```
Razorpay webhook: payment.captured ──> order = paid (website)        <- the customer is never kept waiting on Zoho
        │
        └─> accounting_sync rows queued: contact → [sales_order] → invoice → payment
                 worker (pg_cron every minute → Edge Function), one order at a time per row lock
                 │
                 ├─ contact:      find by GSTIN / mobile / email, else create
                 ├─ sales_order:  ONLY if ColdEasy uses sales orders or Zoho Inventory (Q-Z3)
                 ├─ invoice:      reference_number = order_no; lines from zoho_item_map; tax inclusive;
                 │                place_of_supply = delivery state; total check before marking sent
                 ├─ payment:      against the invoice, reference = Razorpay payment id, deposit = clearing account
                 └─ invoice PDF:  fetched, emailed to the customer / shown on the order page
Razorpay webhook: refund.processed ──> credit_note → refund (same queue)
```

**Default (no Zoho Inventory):** invoice directly, no sales order. **If ColdEasy uses Zoho Inventory** (it shares items with Books): create a sales order on payment, convert it to an invoice, and let Zoho Inventory own stock and packages. That makes Zoho the stock master (13.4, option 2).

### 13.4 Stock (OD-06), pick exactly one

| Option | When | How it works | Risk |
|---|---|---|---|
| 1. Website is the stock master | ColdEasy sells these SKUs only through the website and WhatsApp links, and Zoho items are not stock-tracked | `adjust_stock()` and `stock_movements` (§5.5) as planned. Zoho is never asked for stock | Offline or B2B sales recorded only in Zoho will not reduce website stock. Ops must enter them as movements |
| 2. Zoho is the stock master | ColdEasy tracks inventory in Zoho Books or Zoho Inventory, or sells the same SKUs offline or B2B | Every 15 minutes, one paged `items` read updates `stock_qty` with reason `zoho_sync`. The website still holds stock for unpaid orders locally. The Inventory screen becomes read-only with "Managed in Zoho" | Up to 15 minutes of oversell risk on the last unit. Mitigation: show Low Stock at a safety margin, and re-check against Zoho at checkout when stock is at or below `low_stock_at` |

Never both. A two-way stock sync is the most common cause of phantom stock and overselling.

### 13.5 GST fields that must be right

| Field | Source | Rule |
|---|---|---|
| `gst_treatment` | Checkout | `business_gst` when a valid-format GSTIN is given, else `consumer` |
| `gst_no` | Checkout | Format-checked (doc 05). Zoho may reject an invalid one, which becomes a `needs_attention` item, never a lost order |
| `place_of_supply` | Delivery state | Two-letter Zoho state code from the delivery address, not the billing address |
| HSN code | Zoho item | Read from Zoho; never typed on the website |
| Tax per line | `zoho_item_map` | Store **both** `intra_state_tax_id` (CGST + SGST group) and `inter_state_tax_id` (IGST). Choose one by comparing the place of supply with ColdEasy's registered state. This replaces doc 05's single `zoho_tax_id` |
| Price | Order item snapshot | `is_inclusive_tax: true`; the rate is the GST-inclusive website price |
| Shipping charge | Order | Taxed the same way the accountant decides (shipping on goods usually follows the goods' rate as a composite supply) [CONFIRM with accountant] |
| Totals | Both | Zoho's computed total must equal `orders.total_paise` to the paisa, or the invoice stays in draft with status `needs_attention` |
| Invoice series | Zoho settings | A dedicated series for website orders (for example `WEB/`) is strongly recommended, so the accountant can tell them apart [CONFIRM] |
| E-invoice (IRN), e-way bill | Zoho / ColdEasy team | Not done by the website. B2B invoices may need an IRN if turnover requires it; consignments over ₹50,000 need an e-way bill [CONFIRM with accountant] |

**Compliance gap people miss:** a GST tax invoice for goods has to be issued no later than when the goods are removed for delivery. So **an order cannot move to `dispatched` until its invoice is `synced`.** The owner can override by typing an invoice number raised by hand in Zoho, and the override is audited. Add this check to `change_order_status` (Prompt 5) behind the `zoho_sync` flag.

### 13.6 Rate limits and the API budget

Zoho Books limits API calls **per minute per organisation**, **per day per organisation by plan** (the daily cap grows from the Free plan upwards), and **concurrent calls**. Check the current numbers on Zoho's API documentation against ColdEasy's plan before launch [CONFIRM: plan tier]. The daily cap is shared with every other integration ColdEasy already runs on the same organisation, such as a bank feed, payment gateway apps or Zoho CRM.

| Use | Calls |
|---|---|
| One paid order (contact find, maybe create, invoice, payment, PDF) | About 4 to 6 |
| One refund (credit note, refund) | 2 |
| Stock read every 15 minutes (option 2 only), paged at 200 items | About 96 a day |
| Nightly reconciliation | About 5 to 20 |

Guards:
- The worker counts calls in `zoho_api_usage` (date, count) and reads the rate-limit response headers.
- At 80% of the daily cap, it pauses non-essential calls (stock polling, PDFs, reconciliation). Invoices and payments keep going. At 95% it queues everything until midnight IST and alerts the owner.
- At most 2 concurrent calls and a per-minute pacing well under the limit. A `429` response backs off and retries; it never fails an order.

### 13.7 Idempotency and the retry queue

- `accounting_sync` (doc 05) has one row per order and action, `unique (order_id, action)`. The worker claims rows with `FOR UPDATE SKIP LOCKED`, so two workers never post the same step.
- Before any create, the worker checks the stored Zoho id. If that is empty, it **searches Zoho** (invoice by `reference_number = order_no`, payment by Razorpay id, contact by GSTIN, mobile or email). A timeout after Zoho already created the record cannot produce a duplicate.
- Each step depends on the previous one. An invoice never posts before its contact exists, and a payment never posts before its invoice.
- Retries at 1, 5, 25 and 120 minutes, then every 6 hours for 3 days, then `needs_attention`. Errors are stored in plain language ("GSTIN rejected by Zoho: check the number with the customer").
- Validation errors (4xx other than 429) go straight to `needs_attention`. Retrying a bad GSTIN 10 times wastes the budget.
- Admin: Settings → Accounting sync (T-230) shows the queue with filters, the error and a Retry button. Operations can retry; only the owner can "Mark as handled in Zoho manually", with the Zoho number typed and audited.

### 13.8 When Zoho is down or disconnected

| Situation | Customer | Website | Team |
|---|---|---|---|
| Zoho slow or down | Pays and gets the order confirmation as normal. The email says "Your GST invoice will follow by email" | The queue holds the steps and retries. No order is ever blocked or failed because of Zoho | Admin home shows "Accounting sync delayed: N orders". Dispatch is blocked for unsynced orders (13.5) unless the owner overrides |
| Token revoked or expired | No change | The queue pauses | Owner alert within the hour, with a "Reconnect Zoho" button for the owner |
| Daily cap reached | No change | Essential steps queue until midnight IST | Owner alert. If this happens more than once, upgrade the plan or cut polling |
| Zoho down for over 24 hours | Invoice arrives late | Queue keeps everything | Accountant can raise invoices by hand in Zoho and the owner links them with "handled manually", so nothing is posted twice |

### 13.9 Admin screens added (Settings → Zoho Books)

1. **Connection** (owner): organisation name and id, data centre, connected by whom and when, last token refresh, today's API calls against the cap, Pause/Resume sync, Reconnect.
2. **Item mapping** (owner, operations reads): every website SKU beside a picker of existing Zoho items (read from Zoho), with HSN and both tax ids shown from Zoho. "Verified by accountant" tick with name and date. Publishing a purchasable variant is blocked while `zoho_sync` is on and the variant has no verified mapping.
3. **Sync queue** (T-230): as described in 13.7.
4. **Reconciliation** (owner, operations): the nightly three-way check (paid orders, Zoho invoices, Razorpay captures), with differences listed and emailed.

### 13.10 Schema changes

```sql
alter table zoho_item_map
  drop column zoho_tax_id,
  add column intra_state_tax_id text not null,
  add column inter_state_tax_id text not null,
  add column zoho_item_name text,          -- cached for display
  add column zoho_rate_paise int;           -- cached; informational only
create table zoho_connection (              -- singleton, no secrets (the refresh token is in Vault)
  id boolean primary key default true check (id),
  organization_id text not null, data_centre text not null default 'in',
  org_state_code text not null,             -- ColdEasy's registered GST state, for intra vs inter-state tax
  connected_by uuid references admin_users(id), connected_at timestamptz,
  access_token_expires_at timestamptz, paused boolean not null default false, last_error text
);
create table zoho_api_usage (day date primary key, calls int not null default 0, cap int not null);
-- orders gain: invoice_override_ref text (owner's manual invoice number), invoice_override_by uuid
-- accounting_sync.action gains 'sales_order' (only used if Q-Z3 = yes)
-- stock_movements.reason gains 'zoho_sync'
```

### 13.11 Testing against ColdEasy's live books: don't

- Build and test against a **separate Zoho Books test organisation** (Zoho's sandbox where the plan offers one, otherwise a free or trial organisation set up with the same GST settings and copies of the relevant items). Never test against the live organisation.
- **Why it matters:** a GST invoice number, once issued, cannot be quietly removed. Deleted or voided test invoices leave gaps and cancellations in ColdEasy's real GST series that their accountant then has to explain.
- Go-live: re-map items to live ids, authorise the live client once, run one real ₹1 order end to end (doc 01 acceptance), and refund it with a credit note.

### 13.12 Questions ColdEasy must answer before CR-01 is built

| # | Question | Why it matters |
|---|---|---|
| Q-Z1 | Which Zoho Books plan is the organisation on, and is it on the India data centre? | API daily cap, sandbox availability, `zohoapis.in` |
| Q-Z2 | What other apps or integrations already use this Zoho organisation (bank feeds, Zoho CRM, Razorpay app, others)? | They share the same daily API cap. An existing Razorpay–Zoho app could post payments twice |
| Q-Z3 | Do you use Zoho Inventory, or sales orders or packages in Zoho Books today? | Decides invoice-only versus sales order then invoice, and the stock master |
| Q-Z4 | Who owns the item master and HSN and tax set-up (accountant, ops)? Are all website SKUs already items in Zoho? | Every invoice is only as right as the item mapping |
| Q-Z5 | Are these SKUs sold offline, B2B or through other channels and recorded in Zoho? | If yes, Zoho must be the stock master (OD-06) |
| Q-Z6 | Which invoice series should website orders use? | A separate series keeps GST records clean |
| Q-Z7 | How should Razorpay receipts be booked: clearing account name, fees, settlements? | Payment step deposit account; the accountant's reconciliation |
| Q-Z8 | Is ColdEasy required to issue e-invoices (IRN)? Who raises e-way bills? | B2B invoices may need an IRN before dispatch |
| Q-Z9 | How is shipping charged and taxed? | Invoice line and tax treatment |
| Q-Z10 | Who is the Zoho admin who will authorise the API client, and who is the accountant who signs off the mapping and does UAT (T-232)? | Ownership and sign-off |
| Q-Z11 | Can we have a test organisation (or sandbox) with copies of the items? | Testing without touching the live books (13.11) |
| Q-Z12 | Should existing Zoho customers be matched to website buyers (by GSTIN or mobile), or should website buyers always be new contacts? | Prevents duplicate customers in the books |

### 13.13 Risks people usually miss

- An existing Razorpay-to-Zoho app, or the accountant importing Razorpay settlements, **double-posts payments** alongside our sync. Q-Z2 must be answered first.
- Re-authorising during testing silently revokes the production refresh token (13.2).
- Invoice numbers from test runs against live books cannot be removed cleanly (13.11).
- Dispatching before the invoice exists breaks GST timing rules (13.5).
- One wrong HSN or tax mapping makes every invoice for that SKU wrong. The accountant signs off the mapping, and publishing stays blocked until they do.
- Personal data now goes to a second processor (Zoho). The privacy notice must name it (doc 06 §9).
