# 02 · Technical Requirements Document (TRD)

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

## 1. Architecture decision

**Decision:** a Next.js site on Vercel, with Supabase (Postgres, Auth, Storage, Edge Functions) as the single back end and Razorpay for payments. Product and content pages are statically generated and refreshed when the admin changes them. Only cart, checkout, forms and the admin run server code.

**Why:** this is the stack in the approved implementation plan, and it is the simplest one that meets the brief. Static pages are fast on low-end phones and cheap to host. One database holds products, orders, leads and content, so ColdEasy owns one system instead of four. Payment verification happens on the server, never in the browser.

**What we rejected and why:**

| Option | Why not (for launch) |
|---|---|
| WordPress + WooCommerce | Plugin sprawl, frequent security patching, slow on low-end Android, weaker admin for leads and partners |
| A separate headless CMS (Sanity, Contentful) | A second system and a second bill for a small content set. The Supabase admin covers it |
| n8n for automations at launch | Another server to run and secure. Supabase database webhooks and Edge Functions cover the launch notifications. Revisit in Phase 2 if workflows grow |
| A chatbot | See document 08. WhatsApp click-to-chat is the conversational channel |
| Shopify for commerce (Option B) | Kept as an open decision, see section 10 |

```
Visitor (phone / laptop)
      |
      v
Vercel edge + CDN  --->  Static pages (Home, Products, Science, Impact, About, Legal)
      |                       ^  rebuilt on content change (on-demand revalidation)
      v                       |
Next.js server routes  ------+
  /api/signup  /api/enquiry  /api/checkout  /api/pincode  /api/notify-me
      |                 |                      |
      v                 v                      v
 Supabase Postgres   Cloudflare Turnstile   Razorpay Orders API
 (RLS on every table)  (bot check)            |
      ^                                        v
      |                               Razorpay Checkout (hosted)
      |                                        |
      +---- /api/razorpay/webhook  <-----------+  (payment.captured, payment.failed, refund.processed)
      |
 Database webhooks -> Edge Function -> Email (Resend) to team and customer
      |
      +-> accounting_sync queue -> Edge Function -> Zoho Books API (India DC)
              contact, invoice, payment, credit note        (one way, after payment)
      |
 Supabase Storage <- approved product images and video (produced offline, see document 04)
      |
 Admin (/admin, Supabase Auth + MFA, role checks)
```

## 2. Stack

| Layer | Choice | Version policy | Account owner |
|---|---|---|---|
| Framework | Next.js (App Router), React, TypeScript | Current LTS-supported major at build start, pinned | ColdEasy repo |
| Styling | Tailwind CSS with ColdEasy tokens (document 04) | Pinned | |
| Hosting | Vercel Pro (Hobby plan does not permit commercial use) | | ColdEasy |
| Database, Auth, Storage | Supabase Pro, region Mumbai (ap-south-1) | Pro needed for daily backups and no auto-pause | ColdEasy |
| Payments | Razorpay Standard Checkout + Orders API + Webhooks | | ColdEasy |
| Transactional email | Resend, sending from a verified coldeasy.in subdomain | | ColdEasy [CONFIRM: or existing provider] |
| Bot protection | Cloudflare Turnstile on every public form | | ColdEasy |
| Analytics | Google Analytics 4 (direct gtag, no Tag Manager at launch) | | ColdEasy |
| Search | Google Search Console, Bing Webmaster Tools | | ColdEasy |
| Error monitoring | Sentry (free tier), PII scrubbing on | | ColdEasy |
| Uptime | Better Stack or UptimeRobot free tier | | ColdEasy |
| Domain and DNS | GoDaddy (existing coldeasy.in) | | ColdEasy |
| Code | GitHub organisation owned by ColdEasy | | ColdEasy |
| Accounting | Zoho Books (India data centre, `zohoapis.in`), REST API v3 with OAuth 2.0 | Plan must allow API access and enough daily API calls [CONFIRM: ColdEasy's Zoho Books plan] | ColdEasy |
| Product media production | Google AI Studio / Gemini image models and Veo (through Flow or the Gemini API) on a paid Google account with commercial-use terms; editing in standard tools | Offline workflow, not part of the running site | ColdEasy [CONFIRM: account owner] |
| Video delivery | MP4 (H.264) and WebM from Supabase Storage behind the Vercel CDN, poster images, no autoplay with sound | | ColdEasy |

## 3. Non-functional requirements

| Area | Requirement | How verified |
|---|---|---|
| Performance | LCP under 2.5 s, INP under 200 ms, CLS under 0.1 at p75 on mobile. Home page JavaScript under 200 KB compressed. Hero image under 150 KB. Video never blocks first paint. | Lighthouse CI budgets in every pull request, Vercel Speed Insights after launch |
| Low-end devices | Usable on a 2 GB RAM Android phone on throttled 3G (Slow 4G profile in Lighthouse) | Real-device test, document 10 |
| Availability | 99.9% monthly for public pages (Vercel). Checkout depends on Razorpay; if Razorpay is down, show a WhatsApp fallback | Uptime monitor |
| Accessibility | WCAG 2.2 AA. Keyboard navigation, visible focus, alt text, form labels, 4.5:1 text contrast, reduced-motion support for every animation | axe in CI plus manual check |
| SEO | Server-rendered HTML for all public pages, unique titles and descriptions, canonical URLs, XML sitemap, structured data | Search Console, Rich Results Test |
| AEO / GEO | Question-led headings, answer-first paragraphs, FAQPage schema, facts in plain HTML (not only inside images or video) | Content review |
| Internationalisation | English at launch. All UI strings in locale files; URLs ready for a `/hi/` prefix; fonts include Devanagari fallback | Code review |
| Browsers | Last two versions of Chrome, Edge, Firefox, Safari; Chrome Android; Samsung Internet; iOS Safari 16 and later | Device matrix, document 10 |
| Security | OWASP ASVS level 1 baseline, security headers (document 07), RLS on every table, secrets only on the server | CI checks, pre-launch review |
| Privacy | India DPDP Act 2023 and Rules; data minimisation; consent logged; no PII in analytics | Document 07 |
| Data residency | Database and file storage in India (Mumbai region) | Supabase settings |
| Logs | Security-relevant logs kept 180 days, in line with CERT-In directions | Log retention settings |

## 4. Repository structure

```
coldeasy-web/
  app/                    # Next.js routes (public pages, /admin, /api)
    (site)/               # Home, products, science, impact, about, contact, legal
    (commerce)/           # cart, checkout, order/[token]
    admin/                # admin pages (auth required)
    api/                  # signup, enquiry, checkout, pincode, notify-me, razorpay/webhook
  components/             # UI components (document 04)
  content/                # copy, FAQs, claims register, locale files (en.json)
  lib/                    # supabase clients, razorpay, track(), waLink(), validation
  supabase/
    migrations/           # SQL migrations (document 05)
    functions/            # Edge Functions for notifications
    seed/                 # synthetic seed data only
  public/                 # logos, icons, posters, video
  tests/                  # unit (Vitest) and end-to-end (Playwright)
  scripts/                # build gates: placeholder check, claims check, link check
  docs/                   # this build pack
```

## 5. Content management decision

**Decision:** no separate CMS. Content that changes often (products, prices, stock, testimonials, stories, media features, FAQs, banners) lives in Supabase and is edited in the admin. Content that changes rarely (page copy, legal text, science narrative) lives in versioned files in `content/` and changes through a reviewed pull request.

**Why:** the team gets self-service where it matters (stock, price, stories) without paying for or learning a second tool, and long-form claims stay under review so nobody publishes an unverified number by accident.

## 6. Environments

| Environment | URL | Data | Payments | Who can see it |
|---|---|---|---|---|
| Local | localhost | Synthetic seed | Razorpay test keys | Developers |
| Preview | Per pull request on Vercel | Staging database | Test keys | Delivery team, password protected |
| Staging | staging.coldeasy.in | Staging database, synthetic data | Test keys | ColdEasy and delivery team, password protected, noindex |
| Production | coldeasy.in | Production database | Live keys | Public |

## 7. Secrets (names only, never values)

| Name | Where it lives | Server only |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Vercel | No (public by design) |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Vercel | No (public, protected by RLS) |
| SUPABASE_SERVICE_ROLE_KEY | Vercel, Supabase functions | Yes |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Vercel | No |
| RAZORPAY_KEY_SECRET | Vercel | Yes |
| RAZORPAY_WEBHOOK_SECRET | Vercel | Yes |
| RESEND_API_KEY | Supabase functions | Yes |
| TURNSTILE_SECRET_KEY | Vercel | Yes |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Vercel | No |
| NEXT_PUBLIC_GA4_ID | Vercel | No |
| SENTRY_DSN | Vercel | No |
| REVALIDATE_SECRET | Vercel, Supabase functions | Yes |
| STAGING_BASIC_AUTH | Vercel (staging only) | Yes |
| ZOHO_CLIENT_ID | Supabase functions | Yes |
| ZOHO_CLIENT_SECRET | Supabase functions | Yes |
| ZOHO_REFRESH_TOKEN | Supabase functions (Vault) | Yes |
| ZOHO_ORGANIZATION_ID | Supabase functions | Yes |
| ZOHO_API_BASE (`https://www.zohoapis.in/books/v3`) | Supabase functions | Yes |

Rule: any variable without the `NEXT_PUBLIC_` prefix must never be imported by client code. A CI check fails the build if it is.

## 8. Build gates

The production build fails if any of these is true:

1. Any `[CONFIRM` string appears in `content/`, product data exported from the database, or legal pages.
2. Any claim on a page is not in the claims register with status Approved (document 08).
3. TypeScript, lint, unit or end-to-end tests fail.
4. Lighthouse budgets are exceeded on Home or the ColdEasy Box page.
5. An axe accessibility check finds a serious or critical issue.
6. A server-only secret is referenced from client code.
7. An internal link is broken, or an external media link returns an error.

## 9. Risks people usually miss

| Risk | Decision |
|---|---|
| Vercel Hobby or Supabase Free used "just for now" | Not allowed for production. Hobby forbids commercial use; Supabase Free pauses idle projects and lacks proper backups. Both accounts are created on paid plans in ColdEasy's name. |
| Changing DNS breaks info@coldeasy.in | Export every existing DNS record (MX, SPF, DKIM, TXT) before cutover and recreate them first. See document 10. |
| Video and animation sink mobile performance | Poster image first, video loads only when in view, 720p for mobile, still image for reduced motion. |
| Supabase anon key mistaken for a secret, or RLS left off | The anon key is public by design. Safety comes from RLS on every table, tested in CI. |
| Zoho Books authorisation silently expires or its owner leaves | The refresh token is issued by a ColdEasy Zoho admin account (not a personal delivery-team login), stored in Supabase Vault, and a failed refresh raises an alert the same hour. |
| Zoho Books API limits | Zoho caps API calls per organisation per day by plan. One order uses about 3 to 5 calls; reconciliation is batched. Fine at launch volumes, but checked against the plan [CONFIRM]. |
| Large product videos hurt mobile speed | Each video has a 720p mobile encode under 4 MB and a 1080p desktop encode under 10 MB, loads only when in view, and starts from a poster image. |
| Static pages show stale prices or stock | Every price or stock change in the admin triggers on-demand revalidation; checkout always re-reads price and stock from the database. |

## 10. Open decisions (with recommendation)

| ID | Decision | Recommendation |
|---|---|---|
| OD-01 | Custom commerce (this plan) or Shopify for cart and checkout (Option B in the charter) | Stay custom for launch. With 4 to 7 SKUs, guest checkout and Razorpay, the custom cart is small, and keeping orders beside leads in one database is worth more than Shopify's tooling. Switch to Option B only if Phase 0 shows ColdEasy needs multi-warehouse fulfilment, discount codes or marketplace syncing at launch. |
| OD-02 | Cash on delivery | No COD at launch. COD on bulky goods brings high return-to-origin costs. Offer a Razorpay Payment Link through WhatsApp to buyers who hesitate. |
| OD-03 | Email provider | Resend, unless ColdEasy already pays for Google Workspace or Zoho Mail sending that we can reuse [CONFIRM WITH COLDEASY] |
| OD-04 | Lead destination beyond the admin (Google Sheets, Zoho, CRM) | Admin plus CSV export at launch. Add a one-way Google Sheet sync only if the team already works in Sheets [CONFIRM WITH COLDEASY] |
| OD-05 | Interactive 3D "How ColdEasy Works" | Launch with the existing exploded-view video. Quote true 3D separately once a CAD model exists. |
| OD-06 | Stock master: website database or Zoho Books | If ColdEasy only sells these products online and through WhatsApp links, the website is the stock master and Zoho Books items are not stock-tracked. If ColdEasy also tracks inventory in Zoho Books for B2B or offline sales, Zoho Books becomes the stock master and the website reads stock from it every 15 minutes. Never both directions at once [CONFIRM WITH COLDEASY]. |
| OD-07 | Where Zoho Books invoices are numbered | Zoho Books, always. The website shows only an order number. |
| OD-08 | Product image and video generation: offline production workflow or a feature inside the admin | Decided (18 November 2026): offline production workflow run by the delivery team, with ColdEasy approving each asset. No generator inside the admin. |
