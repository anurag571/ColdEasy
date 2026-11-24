# 09 · Feature Ticket List

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

Format: **T-xxx** Title (size S/M/L · owner · depends on). Owners: DEV = developer, DES = designer, PL = project lead, CE = ColdEasy. Phases follow the implementation plan.

## Epic 0 · Accounts and access (Phase 0)

- [ ] **T-001** ColdEasy creates the GitHub organisation, enables 2FA enforcement, invites the delivery team (S · CE · none)
- [ ] **T-002** ColdEasy creates Vercel Pro team account and invites the developer (S · CE · none)
- [ ] **T-003** ColdEasy creates Supabase organisation on a paid plan, Mumbai region, staging and production projects (S · CE · none)
- [ ] **T-004** Razorpay account: KYC complete, test keys shared through a secret manager, webhook access (M · CE · none)
- [ ] **T-005** GA4 property and Search Console verified on coldeasy.in, owned by ColdEasy (S · CE · T-008)
- [ ] **T-006** Resend (or chosen provider) account and sending subdomain (S · CE · T-008)
- [ ] **T-007** Cloudflare account for Turnstile keys (S · CE · none)
- [ ] **T-008** GoDaddy: registrar lock and 2FA on, auto-renew on, full DNS record export shared (S · CE · none)
- [ ] **T-009** Sentry and uptime monitor accounts (S · DEV · T-002)
- [ ] **T-010** Access register created: every system, who has which role, MFA status (S · PL · T-001 to T-009)

## Epic 1 · Client inputs (tracked, not built)

- [ ] **T-020** Final product list, SKU matrix, AutoBox variant structure, prices, MRP, GST rate and HSN codes (M · CE · none)
- [ ] **T-021** Product photos, alternate hover images, AutoBox Solar and AC Grid images, Breezey content (L · CE · T-020)
- [ ] **T-022** Approved copy per page, including corrected FAQ answers (M · CE · none)
- [ ] **T-023** Evidence for every claim in the register, with test conditions (L · CE · none)
- [ ] **T-024** Rating source, or decision to launch without ratings (S · CE · none)
- [ ] **T-025** Shipping partner, serviceable pincodes, delivery times, shipping costs (M · CE · none)
- [ ] **T-026** Legal pages approved by ColdEasy's legal advisor; grievance officer named (M · CE · none)
- [ ] **T-027** Story consents, photos, video links and separate story URLs (M · CE · none)
- [ ] **T-028** Media screenshots, outlet logos and exact URLs (including the missing Network 18 link) (S · CE · none)
- [ ] **T-029** Admin users, roles, lead routing owners and notification recipients (S · CE · none)
- [ ] **T-030** Success metric targets and baselines (S · CE · none)
- [ ] **T-031** Correct phone number and calling hours for the footer (S · CE · none)
- [ ] **T-032** Clean exploded-view video (no watermark), checked against the real six-part product (M · CE / DES · none)

## Epic 2 · Foundation (Phase 1)

- [ ] **T-040** Repository scaffold: Next.js, TypeScript, Tailwind tokens, lint, format, Vitest, Playwright (M · DEV · T-001)
- [ ] **T-041** CI pipeline with build gates: placeholder check, claims check, secret-import check, Lighthouse budgets, axe, link check (M · DEV · T-040)
- [ ] **T-042** Environments: preview, password-protected staging, production; environment variables set (S · DEV · T-002, T-003)
- [ ] **T-043** Supabase migrations for all tables, RLS policies and policy tests (L · DEV · T-003)
- [ ] **T-044** Synthetic seed data for staging (S · DEV · T-043)
- [ ] **T-045** Shared helpers: `track()`, `waLink()`, money formatting, mobile and pincode validation (S · DEV · T-040)
- [ ] **T-046** Security headers and CSP (S · DEV · T-040)

## Epic 3 · Design system and global layout (Phase 1)

- [ ] **T-060** Design system in Figma (or the agreed tool): tokens, type, buttons, cards, forms, accent bar, patterns (L · DES · T-020 brand confirmation)
- [ ] **T-061** Homepage wireframe, then high-fidelity desktop and mobile (L · DES · T-060)
- [ ] **T-062** Top bar with signup, WhatsApp and Cart; signup modal with consent (M · DEV · T-043, T-061)
- [ ] **T-063** Sticky shrinking header and mobile drawer (M · DEV · T-061)
- [ ] **T-064** Footer (M · DEV · T-061, T-031)
- [ ] **T-065** Section heading component with accent bar; placeholder pill (staging only) (S · DEV · T-060)
- [ ] **T-066** Branded 404 (S · DEV · T-060)

## Epic 4 · Home page (Phase 1)

- [ ] **T-080** Hero with ColdEasy Box and once-only zoom (S · DEV · T-061)
- [ ] **T-081** How ColdEasy Works: video section, step captions, reduced-motion fallback (M · DEV · T-032)
- [ ] **T-082** Best Sellers row (M · DEV · T-100)
- [ ] **T-083** Fridge vs ColdEasy Box comparison (M · DEV · T-023 for C-15)
- [ ] **T-084** Customer Testimonials: story card and video strip (L · DEV · T-027)
- [ ] **T-085** Media Presence cards (M · DEV · T-028)
- [ ] **T-086** FAQ section with FAQPage schema (S · DEV · T-022)

## Epic 5 · Catalogue and product pages (Phase 2)

- [ ] **T-100** Product card component with hover swap, Share, Sold Out state (M · DEV · T-060)
- [ ] **T-101** Products page with Main and Other sections (M · DEV · T-100)
- [ ] **T-102** Product page template: gallery, buy panel, description, large visual, highlights, SEEC section, accordion (L · DEV · T-060)
- [ ] **T-103** AutoBox variant switch with shareable URLs (M · DEV · T-102, T-020)
- [ ] **T-104** Native share with fallbacks and Open Graph images per product (S · DEV · T-102)
- [ ] **T-105** Notify-me flow for Sold Out and Coming Soon (S · DEV · T-120)
- [ ] **T-106** Populate all approved products (M · DEV · T-020, T-021)
- [ ] **T-107** Product structured data (Product, Offer, availability) (S · DEV · T-102)

## Epic 6 · Cart, checkout and payments (Phase 2)

- [ ] **T-110** Cart context, drawer and page (M · DEV · T-100)
- [ ] **T-111** Checkout form with pincode check and GSTIN option (M · DEV · T-025)
- [ ] **T-112** `/api/checkout`: server pricing, stock check, Razorpay order creation (M · DEV · T-004, T-043)
- [ ] **T-113** Razorpay Checkout integration and `/api/checkout/verify` (M · DEV · T-112)
- [ ] **T-114** Webhook handler with signature check, idempotency, stock decrement (L · DEV · T-112)
- [ ] **T-115** Scheduled job: delayed-webhook status fetch and order expiry (S · DEV · T-114)
- [ ] **T-116** Order confirmation page by token and confirmation email (M · DEV · T-114, T-006)
- [ ] **T-117** EMI messaging on eligible products and totals (S · DEV · T-004 EMI confirmation)
- [ ] **T-118** Server-side GA4 `purchase` event (S · DEV · T-114, T-005)

## Epic 7 · Leads and partner flows (Phase 3)

- [ ] **T-120** `/api/enquiry` with Turnstile, rate limits, routing (M · DEV · T-043, T-007)
- [ ] **T-121** Bulk / FPO enquiry form (M · DEV · T-120)
- [ ] **T-122** Distributor, Partner and Affiliate application forms with type-specific questions (M · DEV · T-120)
- [ ] **T-123** Contact page and form (S · DEV · T-120)
- [ ] **T-124** Lead notification emails through database webhook and Edge Function (M · DEV · T-006, T-029)

## Epic 8 · Admin (Phase 3)

- [ ] **T-140** Admin login with MFA, role guard, session timeout (M · DEV · T-043)
- [ ] **T-141** Products and variants: edit price, stock, status, media, specs, highlights (L · DEV · T-140)
- [ ] **T-142** Orders: list, filter, status changes, courier and tracking, refund link to Razorpay, CSV export (L · DEV · T-140)
- [ ] **T-143** Leads and applications: list, owner, status, notes, CSV export (M · DEV · T-140)
- [ ] **T-144** Razorpay Payment Link creation for WhatsApp sales (M · DEV · T-142)
- [ ] **T-145** Trust content: stories, media features, FAQs, site banner (M · DEV · T-140)
- [ ] **T-146** Pincode table management (S · DEV · T-140)
- [ ] **T-147** Audit log view (S · DEV · T-140)
- [ ] **T-148** On-demand revalidation after edits (S · DEV · T-141)

## Epic 9 · Science, Impact, About (Phase 4)

- [ ] **T-160** Science hero with one-time tomato sequence (M · DEV / DES · tomato assets)
- [ ] **T-161** Science of Freshness and cause-and-effect sections (M · DEV · T-022)
- [ ] **T-162** Crop dashboard with Banana, Tomato, Mango and Ambient / ColdEasy toggle (L · DEV · T-023)
- [ ] **T-163** SEEC section with diagram and airflow animation (M · DEV / DES · SEEC diagram)
- [ ] **T-164** Lab-testing charts (M · DEV · T-023 lab data)
- [ ] **T-165** Impact page sections and methodology link (M · DEV · T-023)
- [ ] **T-166** Customer story pages, one per person (M · DEV · T-027)
- [ ] **T-167** About page with timeline and partner categories (M · DEV · T-022)

## Epic 10 · Legal, SEO, analytics, launch (Phase 5)

- [ ] **T-180** Legal pages: Terms, Privacy, Refunds, Shipping, with version and date (S · DEV · T-026)
- [ ] **T-181** SEO: metadata, canonical, sitemap, robots, Organization and Breadcrumb schema (M · DEV · all pages)
- [ ] **T-182** Analytics events wired and verified in GA4 DebugView (M · DEV · T-005)
- [ ] **T-183** Redirect map from the current coldeasy.in (S · DEV · current URL crawl)
- [ ] **T-184** Performance pass on real low-end Android (M · DEV · all pages)
- [ ] **T-185** Accessibility audit and fixes (M · DEV · all pages)
- [ ] **T-186** Full UAT with ColdEasy (M · PL / CE · all)
- [ ] **T-187** Launch cutover (document 10) (M · DEV / CE · T-186)
- [ ] **T-188** Handover pack and access removal (S · PL · T-187)

## Epic 11 · Zoho Books integration (change request, Phases 2 to 3)

- [ ] **T-220** ColdEasy shares Zoho Books plan, organisation, GST settings, invoice series and an admin for set-up (S · CE · CR approved)
- [ ] **T-221** Items in Zoho Books for every SKU with HSN and tax; mapping table signed off by ColdEasy's accountant (M · CE / DEV · T-020, T-220)
- [ ] **T-222** Decide the stock master (OD-06) and the Razorpay clearing account treatment (S · CE · T-220)
- [ ] **T-223** Register the OAuth client (India DC), store the refresh token in Vault, token refresh with alert on failure (S · DEV · T-220)
- [ ] **T-224** `accounting_sync` queue, worker and retries (M · DEV · T-043, T-114)
- [ ] **T-225** Contact find-or-create by mobile, with B2B GSTIN treatment (M · DEV · T-224)
- [ ] **T-226** Invoice creation with tax-inclusive lines, place of supply, shipping, total check (L · DEV · T-221, T-225)
- [ ] **T-227** Payment recording against the invoice (S · DEV · T-226)
- [ ] **T-228** Credit note and refund on Razorpay refunds (M · DEV · T-227)
- [ ] **T-229** Invoice PDF to the customer (email or order page) (S · DEV · T-226)
- [ ] **T-230** Admin accounting sync screen with retry; nightly three-way reconciliation email (M · DEV · T-224, T-140)
- [ ] **T-231** Stock read from Zoho Books, only if it is the stock master (M · DEV · T-222)
- [ ] **T-232** Accountant UAT on test-organisation invoices, including a B2B order and a refund (M · CE · T-226 to T-228)

## Epic 12 · Product images and video (change request, Phases 1 to 2)

- [x] **T-240** Confirm the meaning of the request: production workflow, not an admin feature (OD-08, decided 18 November 2026) (S · CE · none)
- [ ] **T-241** Generation account with commercial-use terms, owned by ColdEasy; budget per asset agreed (S · CE · T-240)
- [ ] **T-242** Shot list and brief for each product (M · DES · T-020)
- [ ] **T-243** Reference photo shoot of every real product, all variants (M · CE · T-242)
- [ ] **T-244** Packshots and gallery images for each product (L · DES · T-243)
- [ ] **T-245** Hover and showcase scenes (M · DES · T-243)
- [ ] **T-246** Product video for each product; re-render the exploded-view video without the watermark (L · DES · T-243, T-032)
- [ ] **T-247** Social share image per product (S · DES · T-244)
- [ ] **T-248** Internal QA against the parts list and checklist; ColdEasy approval of every asset (M · PL / CE · T-244 to T-247)
- [ ] **T-249** Provenance fields and approval in the admin media screen; private bucket for drafts (M · DEV · T-141)
- [ ] **T-250** Export renditions (AVIF, WebP, MP4, WebM, posters) and upload with alt text (S · DEV · T-248, T-249)

## Epic 13 · Post-launch, first 30 days (Phase 6)

- [ ] **T-200** Weekly analytics and conversion review (S · PL · T-187)
- [ ] **T-201** Priority bug fixes (M · DEV · T-187)
- [ ] **T-202** Content updates and conversion experiments as agreed (M · DEV / CE · T-187)

## Phase 2 and later (each needs a change request or new SOW)

- [ ] **T-300** Interactive 3D "How ColdEasy Works" (needs a CAD model)
- [ ] **T-301** Savings calculator (needs verified spoilage-reduction rates)
- [ ] **T-302** Hindi language version, then other regional languages
- [ ] **T-303** Verified-buyer review collection and moderation
- [ ] **T-304** WhatsApp Business API: order updates, consented campaigns, reorder reminders
- [ ] **T-305** SMS (needs DLT registration)
- [ ] **T-306** Abandoned-checkout follow-up (consent required)
- [ ] **T-307** Affiliate tracking links and commission records
- [ ] **T-308** Distributor portal with its own logins
- [ ] **T-309** CRM integration (for example Zoho CRM) for leads
- [ ] **T-310** Courier API integration for live tracking
- [ ] **T-311** Campaign landing page builder
- [ ] **T-312** Services model: rental or pay-per-use cooling, local operator network
- [ ] **T-313** Coupons, referral codes, loyalty
