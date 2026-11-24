-- 1000 Row Level Security on every table, and explicit grants (docs/05 §4, docs/07 §1).
--
-- Defence in depth:
-- 1. Grants: anon and authenticated start with nothing; each table gets only the verbs it needs.
--    No role but the service role can DELETE anything (no hard deletes, docs/12 §5.1).
-- 2. RLS: on for every table. Only the service role and migrations bypass it.
-- 3. Triggers (0500, 0900): column-level rules RLS cannot express (price band, stock ledger,
--    publishing, order transitions).
-- A CI test fails if any public table lacks RLS or has a grant not listed here.

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
grant execute on function public.variant_stock_status(public.product_variants) to anon, authenticated;
grant execute on function public.adjust_stock(uuid, int, text, text, uuid) to authenticated;

do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Helper: shorthand for "admin with permission p".
-- Policies call app.has_permission(), which also requires an MFA (aal2) session.

-------------------------------------------------------------------------------
-- Public catalogue and content (anon + authenticated may SELECT published rows)
-------------------------------------------------------------------------------
grant select on public.products, public.product_variants, public.product_media, public.product_specs,
  public.product_highlights, public.product_ratings, public.media_assets, public.customer_stories,
  public.media_features, public.faqs, public.partner_categories, public.partners, public.milestones,
  public.milestone_partners, public.banners, public.feature_flags, public.site_settings,
  public.serviceable_pincodes, public.locales, public.translation_keys, public.translations,
  public.content_translations
  to anon, authenticated;

create policy products_public on public.products for select using (is_published);
create policy variants_public on public.product_variants for select
  using (is_active and exists (select 1 from public.products p where p.id = product_id and p.is_published));
create policy product_media_public on public.product_media for select
  using (status = 'approved' and exists (select 1 from public.products p where p.id = product_id and p.is_published));
create policy specs_public on public.product_specs for select using (
  exists (select 1 from public.product_variants v join public.products p on p.id = v.product_id
          where v.id = variant_id and v.is_active and p.is_published)
  and app.claim_ok(claim_id));
create policy highlights_public on public.product_highlights for select using (
  exists (select 1 from public.product_variants v join public.products p on p.id = v.product_id
          where v.id = variant_id and v.is_active and p.is_published)
  and app.claim_ok(claim_id));
create policy ratings_public on public.product_ratings for select using (
  approved_at is not null and exists (select 1 from public.product_variants v join public.products p on p.id = v.product_id
                                      where v.id = variant_id and p.is_published));
create policy media_assets_public on public.media_assets for select
  using (bucket = 'public' and alt_text is not null and exif_stripped and approved_at is not null);
create policy stories_public on public.customer_stories for select using (is_published);
create policy media_features_public on public.media_features for select using (is_published);
create policy faqs_public on public.faqs for select using (
  is_published and app.claim_ok(claim_id));
create policy partner_categories_public on public.partner_categories for select using (is_published);
create policy partners_public on public.partners for select using (is_published and not do_not_name);
create policy milestones_public on public.milestones for select using (is_published);
create policy milestone_partners_public on public.milestone_partners for select using (
  exists (select 1 from public.milestones m where m.id = milestone_id and m.is_published)
  and exists (select 1 from public.partners pa where pa.id = partner_id and pa.is_published));
create policy banners_public on public.banners for select using (
  is_published and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()));
create policy flags_public on public.feature_flags for select using (true);
create policy settings_public on public.site_settings for select using (is_public);
create policy pincodes_public on public.serviceable_pincodes for select using (active);
create policy locales_public on public.locales for select using (status = 'live');
create policy translation_keys_public on public.translation_keys for select using (true);
create policy translations_public on public.translations for select using (
  status = 'approved' and exists (select 1 from public.locales l where l.code = locale and l.status = 'live'));
create policy content_translations_public on public.content_translations for select using (
  status = 'approved' and exists (select 1 from public.locales l where l.code = locale and l.status = 'live'));

-------------------------------------------------------------------------------
-- Admin access (authenticated + MFA + named permission)
-------------------------------------------------------------------------------
grant insert, update on public.products, public.product_variants, public.product_media, public.product_specs,
  public.product_highlights, public.product_ratings, public.media_assets, public.customer_stories,
  public.media_features, public.faqs, public.partner_categories, public.partners, public.milestones,
  public.milestone_partners, public.banners, public.feature_flags, public.site_settings,
  public.serviceable_pincodes, public.locales, public.translation_keys, public.translations,
  public.content_translations, public.glossary_terms, public.claims, public.leads, public.orders,
  public.accounting_sync, public.admin_users, public.content_revisions, public.zoho_item_map
  to authenticated;
grant select on public.claims, public.glossary_terms, public.contacts, public.consents, public.leads,
  public.orders, public.order_items, public.payments, public.webhook_events, public.order_events,
  public.order_status_transitions, public.stock_movements, public.zoho_item_map, public.accounting_sync,
  public.zoho_connection, public.zoho_api_usage, public.admin_users, public.audit_log,
  public.content_revisions
  to authenticated;
grant insert on public.order_events to authenticated;
grant usage on sequence public.order_events_id_seq, public.content_revisions_id_seq to authenticated;

-- Catalogue
create policy products_admin_read on public.products for select to authenticated using (app.has_permission('catalogue.read'));
create policy products_admin_insert on public.products for insert to authenticated with check (app.has_permission('catalogue.edit_copy'));
create policy products_admin_update on public.products for update to authenticated
  using (app.has_permission('catalogue.edit_copy') or app.has_permission('catalogue.publish'))
  with check (app.has_permission('catalogue.edit_copy') or app.has_permission('catalogue.publish'));

create policy variants_admin_read on public.product_variants for select to authenticated using (app.has_permission('catalogue.read'));
create policy variants_admin_insert on public.product_variants for insert to authenticated with check (app.has_permission('price.approve'));
create policy variants_admin_update on public.product_variants for update to authenticated
  using (app.has_permission('catalogue.edit_price') or app.has_permission('catalogue.edit_stock')
      or app.has_permission('catalogue.edit_status') or app.has_permission('catalogue.edit_copy'))
  with check (true); -- column rules are in app.guard_variant()

create policy product_media_admin_read on public.product_media for select to authenticated using (app.has_permission('catalogue.read'));
create policy product_media_admin_write on public.product_media for insert to authenticated with check (app.has_permission('media.edit') and status <> 'approved');
create policy product_media_admin_update on public.product_media for update to authenticated
  using (app.has_permission('media.edit') or app.has_permission('catalogue.publish'))
  with check (status <> 'approved' or app.has_permission('catalogue.publish'));

create policy media_assets_admin_read on public.media_assets for select to authenticated using (app.has_permission('content.read') or app.has_permission('catalogue.read'));
create policy media_assets_admin_insert on public.media_assets for insert to authenticated with check (app.has_permission('media.edit') and approved_at is null);
create policy media_assets_admin_update on public.media_assets for update to authenticated
  using (app.has_permission('media.edit') or app.has_permission('content.publish'))
  with check (approved_at is null or app.has_permission('content.publish'));

create policy specs_admin_read on public.product_specs for select to authenticated using (app.has_permission('catalogue.read'));
create policy specs_admin_insert on public.product_specs for insert to authenticated with check (app.has_permission('catalogue.edit_copy'));
create policy specs_admin_update on public.product_specs for update to authenticated using (app.has_permission('catalogue.edit_copy')) with check (true);
create policy highlights_admin_read on public.product_highlights for select to authenticated using (app.has_permission('catalogue.read'));
create policy highlights_admin_insert on public.product_highlights for insert to authenticated with check (app.has_permission('catalogue.edit_copy'));
create policy highlights_admin_update on public.product_highlights for update to authenticated using (app.has_permission('catalogue.edit_copy')) with check (true);
create policy ratings_admin_read on public.product_ratings for select to authenticated using (app.has_permission('catalogue.read'));
create policy ratings_admin_insert on public.product_ratings for insert to authenticated with check (app.has_permission('catalogue.publish'));
create policy ratings_admin_update on public.product_ratings for update to authenticated using (app.has_permission('catalogue.publish')) with check (true);

create policy claims_admin_read on public.claims for select to authenticated using (app.has_permission('content.read') or app.has_permission('catalogue.read'));
create policy claims_admin_insert on public.claims for insert to authenticated with check (app.has_permission('claims.manage'));
create policy claims_admin_update on public.claims for update to authenticated using (app.has_permission('claims.manage')) with check (true);

create policy stock_movements_admin_read on public.stock_movements for select to authenticated using (app.has_permission('catalogue.read'));

-- Content tables share one shape: read with content.read, write with content.edit;
-- app.guard_publish() decides who may publish.
do $$
declare t text;
begin
  foreach t in array array['customer_stories','media_features','faqs','partner_categories','partners','milestones']
  loop
    execute format('create policy %I on public.%I for select to authenticated using (app.has_permission(''content.read''))', t || '_admin_read', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (app.has_permission(''content.edit''))', t || '_admin_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (app.has_permission(''content.edit'') or app.has_permission(''content.publish'')) with check (true)', t || '_admin_update', t);
  end loop;
end $$;
create policy milestone_partners_admin_read on public.milestone_partners for select to authenticated using (app.has_permission('content.read'));
create policy milestone_partners_admin_insert on public.milestone_partners for insert to authenticated with check (app.has_permission('content.edit'));

create policy banners_admin_read on public.banners for select to authenticated using (app.has_permission('banners.manage'));
create policy banners_admin_insert on public.banners for insert to authenticated with check (app.has_permission('banners.manage'));
create policy banners_admin_update on public.banners for update to authenticated using (app.has_permission('banners.manage')) with check (true);

create policy flags_admin_update on public.feature_flags for update to authenticated using (app.has_permission('flags.manage')) with check (true);
create policy flags_admin_insert on public.feature_flags for insert to authenticated with check (app.has_permission('flags.manage'));
create policy settings_admin_read on public.site_settings for select to authenticated using (app.has_permission('settings.manage'));
create policy settings_admin_insert on public.site_settings for insert to authenticated with check (app.has_permission('settings.manage'));
create policy settings_admin_update on public.site_settings for update to authenticated using (app.has_permission('settings.manage')) with check (true);

create policy revisions_admin_read on public.content_revisions for select to authenticated using (app.has_permission('content.read'));
create policy revisions_admin_insert on public.content_revisions for insert to authenticated
  with check (app.has_permission('content.edit') and created_by = app.uid() and status in ('draft','in_review'));
create policy revisions_admin_update on public.content_revisions for update to authenticated
  using ((created_by = app.uid() and status in ('draft','in_review','changes_requested')) or app.has_permission('content.publish'))
  with check (app.has_permission('content.publish') or status in ('draft','in_review','discarded'));

-- Languages
create policy locales_admin_read on public.locales for select to authenticated using (app.has_permission('translations.edit') or app.has_permission('content.read'));
create policy locales_admin_update on public.locales for update to authenticated using (app.has_permission('locales.manage')) with check (true);
create policy translation_keys_admin_insert on public.translation_keys for insert to authenticated with check (app.has_permission('content.edit'));
create policy translation_keys_admin_update on public.translation_keys for update to authenticated using (app.has_permission('content.edit')) with check (true);
create policy translations_admin_read on public.translations for select to authenticated using (app.can_edit_locale(locale) or app.has_permission('content.read'));
create policy translations_admin_insert on public.translations for insert to authenticated with check (app.can_edit_locale(locale));
create policy translations_admin_update on public.translations for update to authenticated using (app.can_edit_locale(locale)) with check (app.can_edit_locale(locale));
create policy content_translations_admin_read on public.content_translations for select to authenticated using (app.can_edit_locale(locale) or app.has_permission('content.read'));
create policy content_translations_admin_insert on public.content_translations for insert to authenticated with check (app.can_edit_locale(locale));
create policy content_translations_admin_update on public.content_translations for update to authenticated using (app.can_edit_locale(locale)) with check (app.can_edit_locale(locale));
create policy glossary_admin_read on public.glossary_terms for select to authenticated using (app.can_edit_locale(locale) or app.has_permission('content.read'));
create policy glossary_admin_insert on public.glossary_terms for insert to authenticated with check (app.can_edit_locale(locale));
create policy glossary_admin_update on public.glossary_terms for update to authenticated using (app.can_edit_locale(locale)) with check (app.can_edit_locale(locale));

-- People and leads (never public)
create policy contacts_admin_read on public.contacts for select to authenticated using (
  app.has_permission('contacts.read')
  or (app.has_permission('contacts.read_marketing') and app.has_marketing_consent(id)));
create policy consents_admin_read on public.consents for select to authenticated using (app.has_permission('contacts.read'));
create policy leads_admin_read on public.leads for select to authenticated using (
  app.has_permission('leads.read') or (app.has_permission('leads.read_own') and owner_id = app.uid()));
create policy leads_admin_update on public.leads for update to authenticated
  using (app.has_permission('leads.manage') or (app.has_permission('leads.read_own') and owner_id = app.uid()))
  with check (app.has_permission('leads.manage') or owner_id = app.uid());

-- Orders
create policy orders_admin_read on public.orders for select to authenticated using (app.has_permission('orders.read'));
create policy orders_admin_update on public.orders for update to authenticated using (app.has_permission('orders.manage')) with check (true);
create policy order_items_admin_read on public.order_items for select to authenticated using (app.has_permission('orders.read'));
create policy payments_admin_read on public.payments for select to authenticated using (app.has_permission('orders.read'));
create policy order_events_admin_read on public.order_events for select to authenticated using (app.has_permission('orders.read'));
create policy order_events_admin_note on public.order_events for insert to authenticated
  with check (app.has_permission('orders.manage') and kind in ('note','customer_note') and actor_id = app.uid());
create policy transitions_admin_read on public.order_status_transitions for select to authenticated using (app.has_permission('orders.read'));
create policy webhook_events_admin_read on public.webhook_events for select to authenticated using (app.has_permission('webhooks.read'));
create policy pincodes_admin_read on public.serviceable_pincodes for select to authenticated using (app.has_permission('pincodes.manage') or app.has_permission('pincodes.read'));
create policy pincodes_admin_insert on public.serviceable_pincodes for insert to authenticated with check (app.has_permission('pincodes.manage'));
create policy pincodes_admin_update on public.serviceable_pincodes for update to authenticated using (app.has_permission('pincodes.manage')) with check (true);

-- Accounting
create policy zoho_map_admin_read on public.zoho_item_map for select to authenticated using (app.has_permission('accounting.read'));
create policy zoho_map_admin_insert on public.zoho_item_map for insert to authenticated with check (app.has_permission('settings.manage'));
create policy zoho_map_admin_update on public.zoho_item_map for update to authenticated using (app.has_permission('settings.manage')) with check (true);
create policy accounting_sync_admin_read on public.accounting_sync for select to authenticated using (app.has_permission('accounting.read'));
create policy accounting_sync_admin_retry on public.accounting_sync for update to authenticated using (app.has_permission('accounting.retry')) with check (status in ('queued','retrying'));
create policy zoho_connection_admin_read on public.zoho_connection for select to authenticated using (app.has_permission('accounting.read'));
create policy zoho_usage_admin_read on public.zoho_api_usage for select to authenticated using (app.has_permission('accounting.read'));

-- Team and audit
create policy admin_users_self on public.admin_users for select to authenticated using (id = app.uid() or app.has_permission('team.manage'));
create policy admin_users_insert on public.admin_users for insert to authenticated with check (app.has_permission('team.manage'));
create policy admin_users_update on public.admin_users for update to authenticated using (app.has_permission('team.manage')) with check (true);
create policy audit_owner on public.audit_log for select to authenticated using (
  app.has_permission('team.manage')
  or (app.has_permission('audit.read') and table_name in ('products','product_variants','product_media','orders','serviceable_pincodes','banners')));
