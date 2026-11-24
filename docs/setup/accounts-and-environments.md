# Accounts and environments (B1-01, B1-04)

Who does what to get Phase 1 onto a password-protected staging link, and what each later
phase needs. Every account is created **by ColdEasy, in ColdEasy's name, on ColdEasy's card**,
with MFA on, and the delivery team is invited (docs/07 §2). Nobody shares a password.

## What is needed for the Phase 1 staging link (only Vercel)

Phase 1 pages do not read the database yet, so staging can go live with Vercel alone.

| # | Step | Who | Time |
|---|---|---|---|
| 1 | Create a Vercel **Pro** team in ColdEasy's name (Hobby forbids commercial use, docs/02 §9). Invite the developer as Member. | ColdEasy (technical contact) | 10 min |
| 2 | In Vercel: Add New → Project → import the GitHub repo. Framework: Next.js. Node 22. Leave build command as `npm run build`. | Developer | 5 min |
| 3 | Settings → Environments: set **Production branch** to `production` (create it from `main` when the first release is tagged). `main` then deploys as a normal branch. | Developer | 2 min |
| 4 | Settings → Environment Variables, **Preview** scope: `NEXT_PUBLIC_APP_ENV=preview`, `STAGING_BASIC_AUTH=coldeasy:<a 20+ character random password>`. | Developer | 3 min |
| 5 | Add a domain `staging.coldeasy.in` assigned to the `main` branch, with `NEXT_PUBLIC_APP_ENV=staging` and `NEXT_PUBLIC_SITE_URL=https://staging.coldeasy.in` for that branch. Until DNS is ready, use the `*.vercel.app` URL. | Developer, DNS record by ColdEasy | 10 min |
| 6 | **Before any DNS change:** export every existing coldeasy.in record (MX, SPF, DKIM, TXT) from GoDaddy, so email is never broken (docs/02 §9, 11:X-01). Then add `staging` as a CNAME to `cname.vercel-dns.com`. | ColdEasy technical contact | 15 min |
| 7 | **Production** scope: `NEXT_PUBLIC_APP_ENV=production`, `NEXT_PUBLIC_SITE_URL=https://coldeasy.in`. **Never** set `STAGING_BASIC_AUTH` there. | Developer | 2 min |

Why basic auth in our own code and not Vercel's Password Protection: Vercel sells that as a paid
add-on on Pro. Our `proxy.ts` does the same for preview and staging at no extra cost, sends
`noindex`, and is covered by tests. Static files (images, video) are not behind the password;
nothing secret lives there.

Production builds run the gates in strict mode: **a production build fails while any `[TBC]`
remains in published content.** That is intended (docs/11 rule 3).

## Later phases

| Account | Needed by | What ColdEasy does | What goes into Vercel |
|---|---|---|---|
| **Supabase** (11:X-06) | Phase 3 (products from the database). Local Docker works until then. | Create an organisation on the **Pro** plan. Create two projects, `coldeasy-staging` and `coldeasy-prod`, both in **Mumbai (ap-south-1)**: the region can never be changed later. Invite the developer (Developer role). In each project: Authentication → disable public sign-ups; enable MFA (TOTP). | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public by design), `SUPABASE_SERVICE_ROLE_KEY` (secret) per environment |
| Supabase, after creation | Phase 3 | Developer runs `npx supabase link` then `npx supabase db push` on **staging first**. On staging only: `update app.instance set environment = 'staging';` and load `supabase/seed.sql`. Production keeps the default `production`, which switches off the developer role. | |
| **Razorpay** (11:X-04) | Phase 4 | Finish KYC. Add the developer as a team member with the Developer role. Generate **test** keys inside the account (never email them). | `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (test values on preview/staging) |
| **Cloudflare Turnstile** | Phase 5 (forms) | Create a Cloudflare account and a Turnstile widget for `coldeasy.in` and `staging.coldeasy.in`. | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| **Email (Resend or existing)** (11:X-02, OD-03) | Phase 4 | Decide provider. Add the DNS records we send for a sending subdomain. | `RESEND_API_KEY` (Supabase functions) |
| **GA4 + Search Console** (11:X-07) | Phase 8 | Create the GA4 property under ColdEasy's Google account; add the developer as Editor. Verify coldeasy.in in Search Console. | `NEXT_PUBLIC_GA4_ID` (production only) |
| **Sentry** | Phase 2 | Create an organisation and a Next.js project with "Prevent storing IP addresses" and data scrubbing on. Invite the developer. | `NEXT_PUBLIC_SENTRY_DSN` |
| **Zoho Books** (CR-01, 11:X-05) | Change request | A separate Zoho Books **test** organisation first (docs/12 §13.11). | Supabase Vault only |
| **GitHub** (T-001) | At handover | Create a GitHub organisation with 2FA required; we transfer the repo. Protect `main`: pull request + 1 review + CI checks `quality`, `database`, `build-e2e` required. | |

Record each account in [`docs/access-register.md`](../access-register.md) the day it is created.
