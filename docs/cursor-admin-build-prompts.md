# COLDEASY: CURSOR PROMPTS FOR THE ADMIN AND CONTENT BACKEND

Decision D-12-01 (24 November 2026): custom admin on Supabase. These prompts build `docs/12-admin-cms-plan.md`.

## How to use this file

1. Copy every file from `build-docs/` (00 to 12) into the repository's `docs/` folder and commit them before Prompt 0. The agent reads `docs/`, not this project folder.
2. Paste ONE prompt at a time into Cursor (Agent mode, or Claude Code in the Cursor terminal). Start a new chat for each prompt; every prompt restates the rules because the agent forgets them over a long chat.
3. After each prompt, the agent stops and gives you a report. Read the diff yourself, run the app, and only then send the next prompt. If the report lists a conflict or an open question, answer it first.
4. Each prompt works on its own branch, `admin/phase-N`. Merge it yourself after review. The agent never pushes to `main`, never merges, never runs anything against production.
5. Change-request work is marked **[CR]**. Do not send a [CR] prompt until the change note is approved by ColdEasy, or tell the agent to build it behind its feature flag and leave the flag off.

Order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Phases 4, 5 and 6 can swap order; 3 must come before 4, 6 and 7. Prompt 9 (Zoho Books) needs 4 and 5 done, CR-01 approved, the answers to 12:Q-Z1 to Q-Z12, and a Zoho TEST organisation.

---

## THE RULES BLOCK (for reference; it is already included at the top of every prompt below)

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.
```

---

## PROMPT 0: Read, inventory and plan (no code)

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

This phase writes no application code.

1. Read every file in docs/ (00 to 12). Then read the repository: app/, components/, lib/, supabase/migrations/, content/, tests/.
2. Write docs/admin-build-status.md with:
   a. What exists today for the admin and the database, mapped to tickets T-140 to T-148 (doc 09) and the sections of doc 12.
   b. Every table in doc 05 and doc 12 section 5: exists / partly / missing.
   c. Conflicts between docs 05, 07, 11 and 12 you found, with the doc and line.
   d. Open decisions that block a phase: OD-06 (stock master), D-12-02 to D-12-05, 11:K2-04, 11:K5-01, 11:K5-03.
   e. Your proposed order for phases 1 to 8 if anything in the repo changes the plan.
3. Confirm the local Supabase stack runs (`supabase start`, `supabase db reset`) and that `next build` passes on main. Report the result; do not fix unrelated failures, list them.

Stop and report.
```

---

## PROMPT 1: Database foundation for the admin

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/05-backend-schema.md, docs/07-security-access-privacy.md section 2, docs/12-admin-cms-plan.md sections 4, 5.1, 5.2, 5.7.

Build the shared database layer only. No admin screens yet.

1. Migration: add 'reviewer' and 'developer' to admin_role. Add to admin_users: locales text[] (for reviewers), approval_delegate_id, delegate_until, break_glass_until.
2. Migration: create the content_status enum and add the shared publishing columns (doc 12 §5.1) to products, product_variants, customer_stories, media_features, faqs. Keep is_published as a GENERATED column from status so existing RLS policies still work. Add the version column for optimistic locking.
3. Migration: content_revisions (doc 12 §5.2) with its indexes.
4. Migration: role_permissions as a seeded lookup (role, action) built from the doc 12 §4 tables, and SQL function has_permission(action text) that reads auth.uid(), checks admin_users.is_active, and REQUIRES auth.jwt()->>'aal' = 'aal2' (MFA). Write the TypeScript mirror lib/auth/permissions.ts with can(actor, action) generated from the same list, plus a unit test that fails if the two lists differ.
5. Migration: harden audit_log per doc 12 §5.7: actor_role, reason, request_id, before jsonb, after jsonb. A generic trigger function audit_row() attached to every admin-edited table that reads current_setting('app.actor_id', true). Block UPDATE and DELETE on audit_log for every role with a trigger. Add helper lib/db/withActor.ts that wraps a server-side query in a transaction and runs set_config('app.actor_id', ..., true).
6. RLS tests: add tests (pgTAP or Vitest against local Supabase) proving: anon cannot read draft rows or content_revisions; marketing cannot update price_paise; a user without aal2 is denied; audit_log cannot be updated or deleted by owner.
7. Seed: synthetic admin users, one per role, clearly named "Seed Owner", "Seed Ops" and so on. No real people.

Stop and report.
```

---

## PROMPT 2: Admin shell, login, team and the form system

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/04-ui-ux-design-brief.md (tokens and components), docs/07 sections 1, 2 and 8, docs/12 sections 4 and 6.

1. /admin layout with the navigation from doc 12 §6. Each nav item appears only if can() allows it. Unbuilt sections show an empty state "Coming in a later phase", not a broken page.
2. Login with Supabase Auth: email + password or magic link, then mandatory TOTP MFA enrolment on first login. Middleware redirects any /admin route to MFA if the session is not aal2. Session timeout 12 hours. Permission-denied screen uses the doc 07 §8 wording and writes an audit entry.
3. Settings → Team (owner only): invite by email with role and, for reviewers, languages; deactivate (ends sessions immediately); break-glass grant for the developer role with an end time (auto-expires). All actions audited.
4. A schema-driven form system in components/admin/form/: one Zod schema per entity drives the fields, labels, plain-language help text under each field, inline validation messages, word and character counters, and server validation (the same schema runs in the server action). Include field types: text, textarea with word limit, money (rupees in, paise stored), integer, select, toggle, date (year / month-year), media picker (stub until Phase 4), claim picker (stub until Phase 6), sortable list.
5. Sticky save bar: appears on any unsaved change, Save and Discard, warns on leaving the page with unsaved changes. Save sends the row's version; a version mismatch shows "Someone else saved this at HH:MM. Reload to see their changes." and does not overwrite.
6. A generic admin index table component: saved filter tabs, search, sort, pagination, optional bulk actions, empty state. Times in IST.
7. Playwright tests: login without MFA is blocked; each seed role sees only its nav items; version conflict is detected.

Use the brand tokens from doc 04. The admin stays English only. Stop and report.
```

---

## PROMPT 3: Drafts, approvals, preview, history and publishing [CR: publishing workflow]

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/12 sections 4 (approval rules), 5.2, 5.6, 7 (J2, J9, J10), 8 (preview); docs/06 (revalidation endpoint); docs/08 (claims and build gate).

Build the publishing engine once, so every content type in later phases reuses it.

1. lib/publishing/: functions saveDraft(entity, id, data), submitForReview, requestChanges(note), approve, publishDirect (only where doc 12 §4 allows it), discard. Rules for "needs approval or not" live in one file, lib/publishing/rules.ts, copied from the doc 12 §4 table. The owner's own edits may publish directly and are recorded as self-approved.
2. Database function publish_revision(revision_id) in a migration: runs inside one transaction, checks the caller's permission, checks base_version equals the live version (else raises a clear error), runs the publish checks, applies data to the live row, bumps version, sets published_at/published_by, marks the revision published and older ones superseded.
3. Publish checks (doc 12 §5.6) as a SQL function publish_checks(entity_type, data) returning a list of failures in plain language, plus the same list shown in the UI before the button is pressed. Implement the checks that apply to existing tables now ([CONFIRM / [TBC] text, claim status, main image is a real photo, alt text, story consent). Leave clearly named stubs for partner, milestone and locale checks; later phases fill them.
4. Approvals screen (/admin/approvals) with a count badge in the nav: list of in-review revisions, each with who, when, a before/after diff of only the changed fields, the publish-check results, and Approve / Send back with note. Works well on a 360 px phone.
5. History tab on every publishable entity: list of published revisions; "Restore this version" creates a new draft from it, which then follows the normal approval rules.
6. Preview: /api/preview enables Next.js Draft Mode after checking an admin session OR a signed preview token (HMAC with a new server secret PREVIEW_TOKEN_SECRET, expires in 72 hours, bound to one revision). Public pages, when in draft mode, read the revision data instead of the live row. Fixed "Preview: not live" bar with revision number and Exit. Preview responses are noindex and no-store. "Copy preview link" button in the editor.
7. Revalidation: after publish, call /api/revalidate for the affected paths. The editor shows "Live on the site at HH:MM" only after a successful response; on failure, a red "Not refreshed yet, retry" button. Add a nightly full revalidation as a scheduled job.
8. Tests: draft is invisible to anon; publish with a stale base_version fails; a claim-bearing field with an unverified claim cannot be published; a preview token for one revision cannot open another; restore creates a draft, not a live change.

Wire this to customer_stories, media_features and faqs as the first users. Stop and report.
```

---

## PROMPT 4: Products, media library, inventory and price

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/05 (catalogue tables), docs/04 section 11 (media provenance), docs/11 A7 (prototype gaps), docs/12 sections 5.3 (media_assets), 5.5 (stock_movements), 7 (J1, J3, J4). Check docs/admin-build-status.md for the OD-06 answer. If OD-06 says Zoho Books is the stock master, STOP after step 2 and ask me.

1. Migration: media_assets; add media_asset_id to product_media; stock_movements; price_floor_paise and status_override on product_variants. Function adjust_stock(variant_id, delta, reason, note, order_id) as the ONLY way stock_qty changes (revoke direct UPDATE of stock_qty from admin roles). Stock status is derived from quantity unless status_override is set.
2. Media library (/admin/media): upload to the private bucket first. On upload: convert HEIC to JPEG, strip EXIF (including GPS), record width, height and bytes, set exif_stripped = true. Require alt text and provenance before an asset can be attached to a public page. Approving moves the file to the public bucket. Image provenance and approval follow doc 04 section 11 and ticket T-249.
3. Products (/admin/products): index with tabs Active, Draft, Archived. Product editor with tabs: Details, Variants, Media, Specs, Highlights, History. Uses the Phase 2 form system and the Phase 3 publishing engine. Highlights that state a figure must pick a claim id (the claim picker reads content/claims.json until Phase 6 moves it to the database).
4. Inventory (/admin/inventory): one row per variant with quantity, status, a +/- adjust box and a reason picker; movement history per variant. CSV import of SKU and counted quantity shows the differences as proposed movements and applies them only after confirmation.
5. Price: editing price within the band in site_settings (default ±10% and not below price_floor_paise; the band value itself is [TBC] D-12-02, seed it as a setting) goes live immediately with a reason. Outside the band, or any MRP change, becomes a revision that needs owner approval. Strike-through MRP shows only when the rule in doc 12 J4 step 3 is met; the period is a [TBC] setting.
6. Do NOT migrate prototype product data, images, prices or ratings. Seed synthetic products named "Seed Product A/B" with [TBC] prices. Ratings stay removed (11 A7).
7. Tests: stock cannot be changed except through adjust_stock; a movement is written for every change; marketing cannot change price; a price change outside the band lands in Approvals; an image with EXIF GPS is stripped; AI-generated media cannot be the main image.

Stop and report.
```

---

## PROMPT 5: Orders and leads

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/03 (order states), docs/06 (Razorpay webhook, Zoho queue), docs/07 (export and PII rules), docs/12 sections 5.5 (order_events, transitions), 7 (J5).

1. Migration: order_events; order_status_transitions seeded from doc 12 §5.5; function change_order_status(order_id, to_status, note, courier, tracking_no) that checks the transitions table and the caller's permission, requires courier and tracking for dispatched, writes an order_event, and on cancel calls adjust_stock with reason cancel_restock. 'paid' can only be set by the Razorpay webhook path, never from the admin.
2. Orders (/admin/orders): tabs To pack, To dispatch, In transit, Delivered, Cancelled and refunded, Payment issues. Search by order number or mobile; filters by date, state and product.
3. Order detail: snapshotted items, totals, customer, address, GSTIN, payment rows, Zoho accounting status (read-only here), timeline of order_events. Add note (private by default; "visible to customer" shows on /order/[token]). Order amounts, items and addresses are read-only after payment.
4. Cancel and refund: cancel opens the Razorpay dashboard refund for that payment in a new tab (T-142). The refund webhook sets refunded. No in-admin refund API call in this phase.
5. CSV export of orders: owner and operations only, uses current filters, writes an audit entry with the row count. Support sees orders read-only and, only if site_settings allows it (D-12-03), can mark packed and dispatched.
6. Leads (/admin/leads, T-143): tabs by type and status, owner assignment, status changes, notes, CSV export (owner only for contact details), audited.
7. Tests: an illegal transition is rejected; dispatched without tracking is rejected; cancel restocks; marketing cannot open orders; every export is audited.

Use synthetic orders only. Stop and report.
```

---

## PROMPT 6: Milestones, partners, banners, claims, flags and settings [CR: partners, claims in database]

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/11 A3 and A4 and rows K2-01 to K2-04, K3-01 to K3-07; docs/08 (claims register); docs/12 sections 5.3, 5.6, 7 (J6, J7, J11).

1. Migration: milestones, milestone_partners, partner_category enum, partner_categories (seed the five keys with label only, blurb [TBC]), partners with the two CHECK constraints from doc 12 §5.3, banners, claims, feature_flags (seed partner_ecosystem, dark_home, lang_toggle, zoho_sync, all false), site_settings. Change product_highlights.claim_id and faqs.claim_id to foreign keys on claims(id).
2. Import content/claims.json into the claims table with a one-off script, keeping every id and status exactly as they are. After this, the build gate (scripts/) reads claims from the database export, not the JSON. Do not change any claim's status.
3. Fill the Phase 3 publish-check stubs for partners (permission_ref and permission document required, never do_not_name, public-body emblem needs formal permission), milestones (word limits, proof if needs_proof, linked partners must be publishable) and feature flags (enabling in production needs change_note_ref).
4. Screens: Milestones (drag to reorder, word counters, "names an award, grant, funder or partner" toggle that makes proof required). Partners (category, website, may-link, colour and mono logo, permission document upload to the PRIVATE bucket only, do-not-name flag). Partner categories (blurb 40 to 60 words). Banners (live immediately, start and end time). Claims (owner only). Feature flags (owner only). Site settings (owner only, typed fields).
5. Public site wiring: About page milestones read published rows and render only when 5 or more are published (11 A3). Partner buttons and the logo strip read published partners and render only when the partner_ecosystem flag is on. Do not change the approved visual design; if no design exists yet for these sections, render the data in the existing components and say so in the report.
6. Seed: synthetic milestones and partners clearly marked "Seed", none published. Never use a real partner name or logo.
7. Tests: a partner without a permission record cannot be published even by the owner calling the database directly; do_not_name partners never appear in the public query; a milestone with 7 title words is rejected; the section hides with 4 milestones.

Stop and report.
```

---

## PROMPT 7: Translations and language go-live [CR: language toggle]

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/11 A1 (languages row), A6, rows K5-01 to K5-09; docs/08 (machine translation may draft, never publish); docs/12 sections 5.4, 7 (J8).

1. Migration: locales (seed en as live; hi, te, kn, ta, mr, bn as hidden with their Noto Sans font names), translation_keys, translations, content_translations, glossary_terms. Trigger: when translation_keys.source_en changes, recompute source_hash and mark every translation of that key 'stale'. Same for content_translations when the English field changes.
2. Import: one-off script that loads every key in content/locales/en.json into translation_keys with namespace and source_en. Do NOT import the prototype Hindi text as approved; if you import it at all, import it as 'machine_draft' and say so in the report (11 A6).
3. Move hard-coded copy in public components into translation keys for the namespaces in 11:K5-01 (default: header, footer, home, product, science, contact). Checkout, legal and admin stay English. List every string you moved.
4. Translations screen: matrix of namespace × language with % approved and a Stale filter. Reviewer editor: English left, translation right, context note, glossary hints, character limit, Approve per string, "Approve all in this namespace". Reviewers only see and edit their own languages.
5. Excel round trip in the K5-05 format (key, English, one column per language): export, and import that shows a diff and only changes value and status for the importing reviewer's language.
6. Locale go-live: owner can switch a language to live only when 100% of keys in the scoped namespaces are approved and a reviewer is named; the switch is a revision through the Phase 3 engine. A language with no support_ref must not show any "support in this language" text.
7. Runtime: at build, export approved translations to content/locales/<code>.json (generated, git-ignored or clearly marked generated). Fallback rules from doc 12 §5.4: a stale string carrying a claim, number or price falls back to English; a stale cosmetic string keeps the old translation. Locale routes /hi/... etc., remembered choice, hreflang links, script font loaded only on that language's pages. All of this behind the lang_toggle flag.
8. Tests: a stale claim string falls back to English; a language cannot go live at 99%; a Hindi reviewer cannot edit Tamil; Excel import from one reviewer does not change another language.

Do not write any translation yourself. Stop and report.
```

---

## PROMPT 8: Home to-do, digest, backups, export and handover

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/05 section 5 (retention, backups), docs/10 (runbook), docs/12 sections 6 (home to-do), 8 (backups), 11 (risks).

1. Admin home (/admin): the to-do list from doc 12 §6, each item a count with a link to the filtered list, shown only for items the user's role can act on.
2. Approval digest email twice a day (times in IST, configurable in site_settings) to owners and the delegate, through the existing email provider. No email if nothing is waiting.
3. Backups: a GitHub Actions workflow (scheduled nightly) that runs pg_dump of production, encrypts it with age using a public key stored as a repository secret, and uploads it to an off-platform bucket named in a secret; and syncs both Supabase Storage buckets to the same place. Retention: 30 daily plus 12 monthly. Add BACKUP_* secret names to the doc 02 secrets list. Do not run it against production; test it against local or staging only.
4. scripts/restore-drill.md and scripts/restore-drill.sh: restore the latest dump into a throwaway Supabase project, compare row counts, then delete the project. Never restore into staging.
5. Settings → Backups: shows the last successful backup time (read from a status row the workflow writes) and an "Export all content" button that downloads an Excel workbook of catalogue, content and translations (no personal data).
6. Help: every admin screen gets a one-line purpose at the top and help text on every field (check none are missing). Write docs/admin-sops.md with one short SOP per journey J1 to J12 in doc 12, written for a non-technical ColdEasy team member.
7. Final check across the whole admin: run the full test suite, the RLS tests, axe on admin pages, and next build. Update docs/admin-build-status.md to show every doc 12 item as done, partly done or not done, and every [TBC] still open.

Stop and report.
```

---

## PROMPT 9: Zoho Books integration [CR-01]

Send this only after: CR-01 is approved; ColdEasy has answered Q-Z1 to Q-Z12 (doc 12 §13.12) and you have written the answers into docs/admin-build-status.md; a Zoho Books TEST organisation exists on the India data centre; OD-06 is decided.

```
RULES (apply to this whole task):
- Read before you write: docs/00-index.md, docs/11-kickoff-changes.md, docs/12-admin-cms-plan.md, plus the docs this prompt names. Doc 11 overrides docs 01-10. Doc 12 is the spec for the admin. Where they conflict, follow 11, then 12, and list the conflict in your report.
- Do ONLY this phase. Do not start the next phase, refactor unrelated code, or restyle the public site.
- Never invent content. No product facts, prices, specs, claims, partner names, milestone text, translations, people or numbers. Use synthetic seed data marked as such, or a visible [TBC] placeholder. Seed data never uses a real person's name or phone number.
- Database changes go in NEW files under supabase/migrations/. Never edit a migration that already exists. RLS on every new table, with policies, in the same migration.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY and anything without NEXT_PUBLIC_) are never imported by client code.
- Every admin write goes through a server action or database function that checks permission with can() / has_permission() and sets app.actor_id so the audit log records the person.
- Money is integer paise. Times are stored UTC and shown in IST (Asia/Kolkata).
- No hard deletes on content or catalogue tables: archive.
- Work on branch admin/phase-N (N = this phase). Commit in small steps with clear messages. Do not push, merge or touch production.
- When done, run: typecheck, lint, unit tests, Playwright tests for this phase, `supabase db reset` on local, and `next build`. Fix failures before reporting.
- Then STOP and report: (1) what you built, (2) `git diff --stat` against main, (3) migrations added, (4) tests added and their result, (5) anything you could not do, (6) conflicts with the docs, (7) [TBC] items you left. Wait for my go-ahead.

Also read: docs/06-api-integration-spec.md section 7, docs/05 (orders, accounting_sync, zoho_item_map), docs/09 Epic 11 (T-220 to T-232), docs/12 section 13 in full (it overrides doc 06 §7 where they differ), and the Q-Z answers in docs/admin-build-status.md. If any Q-Z answer or OD-06 is missing, STOP and list what is missing.

Hard limits for this phase:
- Use ONLY the Zoho TEST organisation. Never call the live organisation, never put live credentials in any file, and never run the worker against production.
- Base URLs are https://accounts.zoho.in and https://www.zohoapis.in/books/v3. Do not use .com endpoints.
- Never create or edit Zoho ITEMS. Items are read only.
- Do not invent HSN codes, tax ids, account names or invoice series. They come from the test organisation or are [TBC].
- Everything is behind the zoho_sync feature flag, off by default.

1. Migration (doc 12 §13.10): zoho_item_map gets intra_state_tax_id and inter_state_tax_id in place of zoho_tax_id; zoho_connection singleton; zoho_api_usage; orders.invoice_override_ref and invoice_override_by; 'sales_order' added to accounting_sync.action; 'zoho_sync' added to stock_movements.reason. RLS: owner all, operations read plus retry, others none.
2. lib/zoho/client.ts (server only): OAuth token handling per §13.2. The refresh token is read from Supabase Vault. The access token is cached with its expiry and refreshed under pg_advisory_xact_lock, never per request. Every call sends organization_id, counts in zoho_api_usage, reads rate-limit headers, paces calls, allows at most 2 concurrent, and backs off on 429. 401 after refresh pauses the queue and raises an owner alert.
3. Worker: a Supabase Edge Function triggered every minute by pg_cron. It claims accounting_sync rows with FOR UPDATE SKIP LOCKED and runs the steps in §13.3: contact (match GSTIN, then mobile, then email, per the Q-Z12 answer), sales_order only if Q-Z3 says so, invoice (reference_number = order_no, tax-inclusive lines from zoho_item_map, place_of_supply = delivery state, intra- or inter-state tax id chosen against zoho_connection.org_state_code, shipping per the Q-Z9 answer), totals checked to the paisa, payment (reference = Razorpay payment id, deposit account per Q-Z7), invoice PDF. Refund webhook queues credit_note then refund.
4. Idempotency per §13.7: check the stored id, then SEARCH Zoho before every create. Retry schedule 1, 5, 25, 120 minutes, then every 6 hours for 3 days, then needs_attention. Validation errors go straight to needs_attention with a plain-language message.
5. API budget per §13.6: pause non-essential calls at 80% of the daily cap, queue everything at 95% until midnight IST, and alert the owner.
6. Stock: implement ONLY the OD-06 option that was chosen (§13.4). If Zoho is the stock master: a 15-minute paged items read writing stock_movements with reason zoho_sync, the Inventory screen made read-only with "Managed in Zoho", and a checkout re-check when stock is at or below low_stock_at. If the website is the stock master: write no stock code against Zoho.
7. Dispatch rule (§13.5): with zoho_sync on, change_order_status refuses 'dispatched' until the invoice step is done, unless the owner records invoice_override_ref. The override is audited.
8. Admin, Settings → Zoho Books (§13.9): Connection (owner: status, org, DC, last refresh, today's calls against the cap, Pause/Resume, Reconnect through the OAuth flow), Item mapping (picker of Zoho items, HSN and both tax ids shown, accountant-verified tick; publishing a purchasable variant is blocked without a verified mapping while the flag is on), Sync queue with Retry and owner-only "Handled manually in Zoho", and the Reconciliation report plus the nightly three-way email.
9. Customer-facing: order confirmation says "Your GST invoice will follow by email" when the invoice is not ready yet. The invoice PDF is emailed or shown on /order/[token] once synced.
10. Tests: use recorded or mocked Zoho responses in CI (no live calls in CI). Cover: a retry after a timeout does not duplicate an invoice; a 4xx validation error goes to needs_attention without retrying; a 429 backs off; the inter- vs intra-state tax choice; a total mismatch holds the invoice; dispatch is blocked without an invoice; the budget guard pauses polling at 80%. Then one manual end-to-end run on the TEST organisation (B2C order, B2B order with GSTIN, refund). Report the Zoho test document numbers.

Stop and report. Include the list of scopes the OAuth client needs, for the ColdEasy Zoho admin.
```
