# 10 · Deployment, Testing and Runbook

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

## 1. Branch and release flow

| Step | Rule |
|---|---|
| Branches | `main` is production. Work happens on short-lived feature branches named `T-xxx-short-name` |
| Pull requests | Every change goes through a pull request with a Vercel preview link. At least one reviewer approves. CI must pass |
| Staging | Merges to `main` deploy to staging first (staging.coldeasy.in), using the staging database and Razorpay and Zoho Books test settings |
| Production | Promoted from a staging deployment that ColdEasy has seen, by a tagged release (`v1.0.0`, `v1.0.1`). No direct pushes to production |
| Database changes | SQL migrations only, reviewed in the pull request, applied to staging first, then production before the code that needs them |
| Content changes | Admin edits go live through on-demand revalidation. Copy and legal changes in `content/` follow the pull request flow |
| Freeze | No production releases on Friday afternoons, before public holidays, or during a ColdEasy campaign launch without agreement |

## 2. CI checks

| Check | Tool | Blocks merge? |
|---|---|---|
| Type check | TypeScript | Yes |
| Lint and format | ESLint, Prettier | Yes |
| Unit tests | Vitest | Yes |
| End-to-end tests | Playwright on the preview URL | Yes |
| RLS policy tests | SQL tests against a local Supabase | Yes |
| Placeholder gate | Script fails on any `[CONFIRM` in production content | Yes, for production builds |
| Claims gate | Script fails on any unapproved claim id | Yes, for production builds |
| Secret import check | Script fails if a server-only variable is used in client code | Yes |
| Performance budgets | Lighthouse CI on Home and ColdEasy Box page (mobile) | Yes |
| Accessibility | axe on key pages | Yes (serious or critical issues) |
| Broken links | Link checker, including media article URLs | Warn on preview, block on production |
| Dependency audit | `npm audit` (high and critical) | Warn, fixed within 7 days |

## 3. Test cases

### Unit tests

| ID | Test |
|---|---|
| U-01 | Mobile validation accepts `9182968542`, `+91 91829 68542`; rejects `5123456789`, 9 digits, letters |
| U-02 | Pincode validation accepts `560001`; rejects `060001`, 5 digits |
| U-03 | GSTIN format check accepts a valid pattern, rejects a wrong length |
| U-04 | Cart total = sum of line totals + shipping, in paise, no floating-point drift |
| U-05 | `waLink()` produces a correctly encoded URL for every context |
| U-06 | Razorpay signature verification passes a known-good sample and fails a tampered one |
| U-07 | Webhook handler is idempotent: the same event twice changes the order once |
| U-08 | Stock never goes below zero when two payments capture the last unit at the same time |
| U-09 | Zoho Books invoice payload: tax-inclusive line amounts, place of supply from the delivery state, GSTIN treatment, totals equal the order total to the paisa |
| U-10 | Zoho Books sync job retries with backoff and moves to "needs attention" after the final failure |

### End-to-end tests (Playwright, staging, Razorpay test mode)

| ID | Journey | Expected result |
|---|---|---|
| E-01 | Sign up from the top bar | Success toast, bar collapses on every page, contact and consent rows exist |
| E-02 | Browse without signing up and buy a ColdEasy Box with a test UPI success | Order paid by webhook, confirmation page, email sent, stock decremented, Zoho Books test invoice and payment created |
| E-03 | Payment failure | Clear message, order still pending, retry works |
| E-04 | Close Razorpay without paying | Order expires after 30 minutes, stock untouched, nothing sent to Zoho Books |
| E-05 | Non-serviceable pincode | Payment blocked, WhatsApp link with pincode in the message |
| E-06 | Price changed in the admin while the item is in the cart | Checkout shows the new price before payment |
| E-07 | Sold Out product | No purchase control on card, page or cart; Notify me works |
| E-08 | AutoBox variant switch | URL, price, images and SKU change; shared link opens the same variant |
| E-09 | Each enquiry and application form | Lead created with the right type and owner, email sent |
| E-10 | Bot protection | Submissions without a Turnstile token rejected |
| E-11 | Admin roles | Operations cannot edit admin users; Marketing cannot see orders |
| E-12 | Refund in Razorpay test mode | Order marked refunded; Zoho Books credit note and refund recorded |
| E-13 | Business order with GSTIN | Zoho Books invoice uses business GST treatment with the customer's GSTIN |
| E-14 | Zoho Books unavailable (test credentials revoked) | Order still completes for the customer; sync item shows "needs attention" in the admin; alert sent |
| E-15 | Reduced motion on | No autoplay animation; content still complete |
| E-16 | JavaScript off | All content readable; WhatsApp fallback on forms |

## 4. Device and browser matrix

| Device | Browser | Network | Priority |
|---|---|---|---|
| Low-end Android (2 GB RAM, for example a Redmi A-series or Samsung Galaxy A0x) [CONFIRM: device ColdEasy's customers commonly use] | Chrome | Throttled 3G and real 4G | Must pass |
| Mid-range Android | Chrome, Samsung Internet | 4G | Must pass |
| iPhone (iOS 16 or later) | Safari | 4G | Must pass |
| Android tablet or iPad | Chrome, Safari | Wi-Fi | Should pass |
| Windows laptop | Chrome, Edge | Wi-Fi | Must pass |
| MacBook | Safari, Chrome | Wi-Fi | Must pass |
| Any desktop | Firefox | Wi-Fi | Should pass |

## 5. Content QA

- [ ] Every page proofread against the approved copy. Corrected spelling from the brief carried through.
- [ ] Every number traced to an Approved claim in the register.
- [ ] Prices, MRP, GST wording and shipping match the confirmed price list and the Zoho Books item list.
- [ ] Every story has consent on file and its own URL.
- [ ] Every media card opens the exact article or post.
- [ ] Contact details are correct everywhere (phone number, email, address, hours).
- [ ] Legal pages show version and effective date, and match what ColdEasy's legal advisor approved.
- [ ] Alt text on every meaningful image.
- [ ] Open Graph previews checked in WhatsApp for Home and each product.

## 6. Pre-launch checklist

- [ ] Production build passes all gates with zero placeholders.
- [ ] All production accounts owned by ColdEasy, MFA on, access register up to date.
- [ ] Razorpay live mode activated; live keys and live webhook secret set; webhook URL registered.
- [ ] Zoho Books production connection authorised by a ColdEasy admin; item and tax mapping verified; invoice series confirmed with ColdEasy's accountant.
- [ ] Database backups on, and one restore tested.
- [ ] Redirect map loaded and tested for every live coldeasy.in URL.
- [ ] Full DNS export of the current zone saved; email records (MX, SPF, DKIM, DMARC) identified.
- [ ] DNS TTL lowered to 300 seconds at least 48 hours before cutover.
- [ ] Sitemap, robots and Search Console ready.
- [ ] GA4 events verified in DebugView.
- [ ] Uptime monitor and Sentry alerts going to the right people.
- [ ] ColdEasy operations owner trained on orders, leads, stock and the accounting sync screen.
- [ ] Go / no-go meeting held; ColdEasy decision-maker approves in writing.

## 7. Launch-day cutover

| Time | Step | Owner | Rollback if it fails |
|---|---|---|---|
| T-60 min | Final production deploy from the approved release; smoke test on the Vercel production URL | DEV | Do not proceed |
| T-30 min | Freeze admin edits on the old site; export any form submissions from it | CE | |
| T-0 | Add coldeasy.in and www to Vercel; update GoDaddy A and CNAME records only. Leave MX and email TXT records untouched | DEV with CE | Restore the previous A and CNAME values (TTL is 5 minutes) |
| T+10 min | SSL certificate issued; https and www redirect checked | DEV | Same as above |
| T+15 min | Live ₹1 test order (a test SKU, hidden from the catalogue) paid by real UPI: webhook received, order paid, email sent, Zoho Books invoice and payment created. Then refund it and confirm the credit note | DEV, CE | Switch checkout to the WhatsApp-only banner; keep the site live |
| T+30 min | Send a test email to info@coldeasy.in from outside to prove email still works | CE | Restore email records from the export |
| T+45 min | Check 20 top old URLs redirect correctly | DEV | Fix the redirect map and redeploy |
| T+60 min | Submit the sitemap in Search Console; announce launch | CE | |
| T+24 h | Review errors, payments, sync status and analytics | DEV, PL | |

Rollback for the application itself: Vercel instant rollback to the previous production deployment (under 2 minutes). Keep the old site's hosting paid and reachable for 30 days after launch so DNS can point back if needed [CONFIRM WITH COLDEASY: where the current site is hosted].

## 8. Monitoring cadence

| What | How | When | Who |
|---|---|---|---|
| Uptime of Home, a product page and `/api/health` | Uptime monitor | Every minute, alerts immediately | DEV, CE owner |
| Errors | Sentry | Alerts on new error types | DEV |
| Payments vs orders | Admin report: Razorpay captured payments vs paid orders | Daily for 30 days, then weekly | CE operations |
| Orders vs accounting | Admin report: paid orders vs Zoho Books invoices and payments | Daily for 30 days, then weekly | CE operations / accountant |
| Leads not touched | Admin view: new leads older than the response target | Daily | CE owner |
| Performance | Vercel Speed Insights | Weekly | DEV |
| Conversions | GA4 funnel report | Weekly for 4 weeks, then monthly | PL, CE |
| Dependencies and security patches | Dependabot | Weekly | DEV |
| Access review | Access register | Every quarter | CE owner |

## 9. Incident playbooks

| Incident | First 15 minutes | Then |
|---|---|---|
| Site down | Check Vercel status; roll back the last deploy if it is the cause | Post a status message on WhatsApp and social if over 30 minutes |
| Checkout failing | Turn on the WhatsApp-only checkout banner in the admin | Check Razorpay status, keys and webhook logs |
| Payments captured but orders not marked paid | Run the status-fetch job by hand | Check webhook secret and logs; reconcile from the Razorpay dashboard |
| Zoho Books sync failing | Orders keep flowing; check the sync screen for the error (expired authorisation, missing item, tax mismatch) | Fix the cause and retry from the admin. If authorisation expired, a ColdEasy Zoho admin re-authorises. Accounting entries are caught up the same day |
| Wrong price live | Unpublish or correct in the admin | Decide on affected orders (document 07) |
| Suspected breach | Follow document 07, section 9 (CERT-In 6-hour clock starts) | Post-incident report within 7 days |
| Spam flood on forms | Raise Turnstile to a stricter mode; tighten rate limits | Clean spam leads in bulk (status "spam") |

## 10. Handover pack

- [ ] Repository with README: how to run, test, deploy, roll back.
- [ ] This build pack, updated to match what was actually built.
- [ ] Access register showing ColdEasy as owner of every system, and delivery-team access removed or moved to retainer roles.
- [ ] Admin user guide (orders, stock, leads, content, payment links, accounting sync) with short screen recordings.
- [ ] Zoho Books integration note: what syncs, the mapping tables, how to re-authorise, how to read the daily reconciliation.
- [ ] Runbook (this document) with ColdEasy's contact names filled in.
- [ ] Environment variable list (names only) and where each secret is stored.
- [ ] List of open issues and the agreed Phase 2 backlog.
- [ ] Final claims register with evidence links.
- [ ] Signed acceptance from ColdEasy; IP transfer on final payment, as per the contract.
