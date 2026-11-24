-- 0700 Languages and translations (docs/11 A6, docs/12 §5.4).
-- A language is live only when its reviewer has approved every key in scope and the owner
-- switches it on. English is the source and is always live.

create table public.locales (
  code         text primary key check (code in ('en','hi','te','kn','ta','mr','bn')),
  english_name text not null,
  native_name  text not null,
  font_family  text not null,
  status       text not null default 'hidden' check (status in ('hidden','in_review','live')),
  reviewer_id  uuid references public.admin_users(id),
  support_ref  text,                         -- null = do not imply support in this language (11:K5-07)
  approved_by  uuid references public.admin_users(id),
  approved_at  timestamptz,
  launch_rank  int,
  check (code = 'en' or status <> 'live' or (reviewer_id is not null and approved_by is not null))
);
insert into public.locales (code, english_name, native_name, font_family, status) values
  ('en','English','English','Poppins','live'),
  ('hi','Hindi','हिन्दी','Noto Sans Devanagari','hidden'),
  ('te','Telugu','తెలుగు','Noto Sans Telugu','hidden'),
  ('kn','Kannada','ಕನ್ನಡ','Noto Sans Kannada','hidden'),
  ('ta','Tamil','தமிழ்','Noto Sans Tamil','hidden'),
  ('mr','Marathi','मराठी','Noto Sans Devanagari','hidden'),
  ('bn','Bangla','বাংলা','Noto Sans Bengali','hidden');

create table public.translation_keys (
  key          text primary key check (key ~ '^[a-z0-9_]+(\.[a-z0-9_]+)+$'),
  namespace    text not null,
  source_en    text not null,
  source_hash  text not null default '',
  context_note text,
  max_chars    int,
  claim_id     text references public.claims(id),
  updated_at   timestamptz not null default now()
);

create table public.translations (
  key           text not null references public.translation_keys(key) on delete cascade,
  locale        text not null references public.locales(code),
  value         text not null,
  status        text not null check (status in ('machine_draft','in_review','approved','stale')),
  source_hash   text not null,
  translated_by text,
  reviewed_by   uuid references public.admin_users(id),
  approved_at   timestamptz,
  primary key (key, locale),
  check (locale <> 'en')
);

create table public.content_translations (
  entity_type text not null,
  entity_id   uuid not null,
  field       text not null,
  locale      text not null references public.locales(code),
  value       text not null,
  status      text not null check (status in ('machine_draft','in_review','approved','stale')),
  source_hash text not null,
  reviewed_by uuid references public.admin_users(id),
  approved_at timestamptz,
  primary key (entity_type, entity_id, field, locale)
);

create table public.glossary_terms (                -- 11:K5-04
  term            text not null,
  locale          text not null references public.locales(code),
  value           text,
  keep_in_english boolean not null default false,
  primary key (term, locale)
);

-- Hash the English source; when it changes, every translation of that key goes stale.
create or replace function app.translation_source_changed() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.source_hash := encode(sha256(convert_to(new.source_en, 'UTF8')), 'hex');
  new.updated_at := now();
  if tg_op = 'UPDATE' and new.source_hash is distinct from old.source_hash then
    update public.translations set status = 'stale' where key = new.key and status <> 'stale';
  end if;
  return new;
end $$;
create trigger translation_keys_hash before insert or update of source_en on public.translation_keys
  for each row execute function app.translation_source_changed();
