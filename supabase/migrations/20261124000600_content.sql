-- 0600 Trust and site content, partners, milestones, banners, flags, settings, revisions
-- (docs/05 §3, docs/11 A3-A4, docs/12 §5.2-5.3). No hard deletes: "delete" archives.

create table public.customer_stories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]+$'),
  person_name  text not null,
  location     text not null,
  organisation text,
  quote        text,
  body         text,
  photo_id     uuid references public.media_assets(id),
  video_url    text check (video_url is null or video_url ~ '^https://(www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)/'),
  consent_ref  text not null,                   -- signed consent on file (docs/08 C-29)
  is_featured  boolean not null default false,
  sort_order   int not null default 0,
  status       public.content_status not null default 'draft',
  is_published boolean generated always as (status = 'published') stored,
  published_at timestamptz, published_by uuid references public.admin_users(id),
  updated_by   uuid references public.admin_users(id), version int not null default 1,
  created_at   timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.media_features (
  id              uuid primary key default gen_random_uuid(),
  outlet_name     text not null,
  caption         text not null,
  article_url     text not null check (article_url ~ '^https://'),
  screenshot_id   uuid references public.media_assets(id),
  logo_id         uuid references public.media_assets(id),
  published_on    date,
  sort_order      int not null default 0,
  status          public.content_status not null default 'draft',
  is_published    boolean generated always as (status = 'published') stored,
  published_at timestamptz, published_by uuid references public.admin_users(id),
  updated_by   uuid references public.admin_users(id), version int not null default 1,
  created_at   timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.faqs (                         -- one row, many languages via content_translations
  id           uuid primary key default gen_random_uuid(),
  question     text not null,
  answer       text not null,
  claim_id     text references public.claims(id),
  sort_order   int not null default 0,
  status       public.content_status not null default 'draft',
  is_published boolean generated always as (status = 'published') stored,
  published_at timestamptz, published_by uuid references public.admin_users(id),
  updated_by   uuid references public.admin_users(id), version int not null default 1,
  created_at   timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.partner_categories (           -- the five buttons (11:A4, K3-03)
  key          public.partner_category primary key,
  label        text not null,
  blurb        text,
  sort_order   int not null,
  status       public.content_status not null default 'draft',
  is_published boolean generated always as (status = 'published') stored,
  published_at timestamptz, published_by uuid references public.admin_users(id),
  updated_by   uuid references public.admin_users(id), version int not null default 1,
  created_at   timestamptz not null default now(), updated_at timestamptz not null default now()
);
insert into public.partner_categories (key, label, sort_order) values
  ('deployment','Deployment',1), ('finance','Finance',2), ('research','Research',3),
  ('csr','CSR',4), ('ecosystem','Ecosystem',5);

create table public.partners (                     -- 11:A4. No permission record, no logo and no name.
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  category              public.partner_category not null references public.partner_categories(key),
  website_url           text check (website_url is null or website_url ~ '^https://'),
  may_link              boolean not null default false,
  description           text,
  logo_color_id         uuid references public.media_assets(id),
  logo_mono_id          uuid references public.media_assets(id),
  permission_ref        text,
  permission_doc_id     uuid references public.media_assets(id),
  is_public_body        boolean not null default false,
  formal_permission_ref text,
  do_not_name           boolean not null default false,
  sort_order            int not null default 0,
  status                public.content_status not null default 'draft',
  is_published          boolean generated always as (status = 'published') stored,
  published_at timestamptz, published_by uuid references public.admin_users(id),
  updated_by   uuid references public.admin_users(id), version int not null default 1,
  created_at   timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (status <> 'published' or (permission_ref is not null and permission_doc_id is not null and not do_not_name)),
  check (not (is_public_body and logo_color_id is not null and formal_permission_ref is null))
);

create table public.milestones (                   -- 11:A3, client-editable "Our Journey"
  id             uuid primary key default gen_random_uuid(),
  year           int not null check (year between 2015 and 2100),
  month          int check (month between 1 and 12),
  label_override text,
  title          text not null check (array_length(regexp_split_to_array(trim(title), '\s+'), 1) <= 6),
  description    text not null check (array_length(regexp_split_to_array(trim(description), '\s+'), 1) <= 25),
  photo_id       uuid references public.media_assets(id),
  photo_credit   text,
  proof_ref      text,
  needs_proof    boolean not null default false,
  sort_order     int not null default 0,
  status         public.content_status not null default 'draft',
  is_published   boolean generated always as (status = 'published') stored,
  published_at timestamptz, published_by uuid references public.admin_users(id),
  updated_by   uuid references public.admin_users(id), version int not null default 1,
  created_at   timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (status <> 'published' or not needs_proof or proof_ref is not null)
);

create table public.milestone_partners (
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  partner_id   uuid not null references public.partners(id),
  primary key (milestone_id, partner_id)
);

create table public.banners (                      -- also the outage switch (docs/07 §9)
  id           uuid primary key default gen_random_uuid(),
  message      text not null check (length(message) <= 140),
  link_url     text,
  tone         text not null default 'info' check (tone in ('info','warning')),
  starts_at    timestamptz,
  ends_at      timestamptz check (ends_at is null or starts_at is null or ends_at > starts_at),
  sort_order   int not null default 0,
  status       public.content_status not null default 'draft',
  is_published boolean generated always as (status = 'published') stored,
  published_at timestamptz, published_by uuid references public.admin_users(id),
  updated_by   uuid references public.admin_users(id), version int not null default 1,
  created_at   timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.feature_flags (                -- change requests ship dark (11 Part A rule 5)
  key             text primary key,
  enabled         boolean not null default false,
  change_note_ref text,
  updated_by      uuid references public.admin_users(id),
  updated_at      timestamptz not null default now()
);
insert into public.feature_flags (key) values ('dark_home'), ('lang_toggle'), ('partner_ecosystem'), ('zoho_sync');

create table public.site_settings (                -- typed singletons: WhatsApp number, hours, price band
  key        text primary key,
  value      jsonb not null,
  is_public  boolean not null default false,
  updated_by uuid references public.admin_users(id),
  updated_at timestamptz not null default now()
);

create table public.content_revisions (            -- docs/12 §5.2: drafts, review, history
  id           bigserial primary key,
  entity_type  text not null,
  entity_id    uuid not null,
  locale       text not null default 'en',
  data         jsonb not null,
  base_version int not null,
  status       text not null check (status in ('draft','in_review','changes_requested','approved','published','superseded','discarded')),
  created_by   uuid not null references public.admin_users(id),
  submitted_at timestamptz,
  reviewed_by  uuid references public.admin_users(id),
  reviewed_at  timestamptz,
  review_note  text,
  created_at   timestamptz not null default now()
);
create index on public.content_revisions (entity_type, entity_id, created_at desc);
create index on public.content_revisions (status) where status = 'in_review';

do $$
declare t text;
begin
  foreach t in array array['customer_stories','media_features','faqs','partner_categories','partners','milestones','banners','feature_flags','site_settings']
  loop
    execute format('create trigger %I before update on public.%I for each row execute function app.set_updated_at()', t || '_updated', t);
  end loop;
end $$;
