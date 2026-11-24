# 07 · Security, Access and Privacy

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

This document is a build specification, not legal advice. ColdEasy's legal advisor must review the legal sections and approve the final privacy notice and policies before launch.

## 1. Threat model

| Threat | Likely? | Impact | Control |
|---|---|---|---|
| Fake payment confirmation (tampered browser callback) | Medium | Goods shipped unpaid | Server signature check plus webhook-only "paid" status (document 06) |
| Spam and bot form submissions | High | Polluted leads, wasted team time | Turnstile, rate limits, honeypot field, server validation |
| Someone signs up another person's number | Medium | Unwanted messages, consent breach | Consent logged per submission; first WhatsApp message asks for confirmation; easy opt-out |
| Admin account takeover | Medium | Price changes, data theft, defacement | MFA for every admin, no shared logins, least-privilege roles, session timeout 12 hours |
| Exposed service-role key | Low | Full database access | Key only in server environments; CI check blocks client imports; rotate on any suspicion |
| RLS misconfiguration | Medium | Leads or orders readable by the public | RLS on every table, automated policy tests in CI |
| Price manipulation in cart | Medium | Underpaid orders | Server recalculates every total from the database |
| Third-party script compromise | Low | Card skimming, defacement | No third-party scripts on checkout except Razorpay; strict CSP; Subresource Integrity where possible |
| Vendor access left after handover | High | Ongoing risk | Access review and removal is a handover checklist item |
| Defacement through a compromised GitHub account | Low | Public damage | Branch protection, required reviews, 2FA enforced on the GitHub organisation |
| DNS hijack or expiry | Low | Site and email down | Domain auto-renew, registrar lock, 2FA on GoDaddy, owned by ColdEasy |
| Zoho Books refresh token leaked | Low | Someone could create or read invoices and customer records | Token only in Supabase Vault; narrowest scopes; revoke and reissue from the Zoho API Console on any suspicion |
| Wrong invoices posted at scale (bad item or tax mapping) | Medium | GST errors, rework for the accountant | Accountant signs off the mapping; totals compared before posting; mismatches held |
| Generated media that misrepresents the product | Medium | Misleading listing, refunds | Real main photo, part-by-part QA, approval recorded per asset |

## 2. Roles and access matrix

| System | ColdEasy Owner | ColdEasy Operations | ColdEasy Marketing | ColdEasy Support | Delivery team (during build) | Delivery team (after handover) |
|---|---|---|---|---|---|---|
| Domain and DNS (GoDaddy) | Owner | None | None | None | DNS editor, temporary | None |
| Vercel | Owner | None | None | None | Member | None, or retainer member |
| Supabase | Owner | None | None | None | Developer | None, or retainer member |
| Razorpay | Owner | Ops (refunds, payment links) | None | View | Developer (test mode only) | None |
| GitHub | Owner | None | None | None | Maintainer | Read, or retainer maintainer |
| GA4 and Search Console | Owner | Viewer | Editor | None | Editor | Viewer, or none |
| Site admin | Owner role | Operations role | Marketing role | Support role | Owner role on staging only | None |
| Email provider | Owner | None | None | None | Developer | None |
| Zoho Books | Owner / accountant | As ColdEasy decides | None | None | Integration set-up only, then none (the API client is authorised by a ColdEasy admin) | None |
| Google account for image and video generation | Owner | None | Member | None | Member during production | None |

Rules:

- MFA is required on every account listed above. No shared logins.
- ColdEasy creates every account in its own name and invites the delivery team. The delivery team never owns a production account.
- Access is reviewed at each phase gate and removed at handover. Intellectual property transfers on final payment, as set out in the contract.

## 3. Security headers

| Header | Value |
|---|---|
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload |
| Content-Security-Policy | default-src 'self'; script-src 'self' https://checkout.razorpay.com https://www.googletagmanager.com https://challenges.cloudflare.com; frame-src https://api.razorpay.com https://checkout.razorpay.com https://challenges.cloudflare.com https://www.youtube-nocookie.com https://www.instagram.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://*.sentry.io; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://api.razorpay.com |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com") |
| X-Frame-Options | DENY (backup for older browsers) |
| Cross-Origin-Opener-Policy | same-origin-allow-popups (Razorpay needs popups) |

The CSP is tested against Razorpay's current domain list before launch, because Razorpay changes it from time to time.

## 4. Data collected and never collected

| Collected | Purpose | Required? |
|---|---|---|
| Mobile number | Signup, enquiries, orders, delivery | Yes for those features |
| Name | Orders, enquiries | Yes for those features |
| Email | Order confirmation | Optional |
| Delivery address and pincode | Delivery | Yes for orders |
| GSTIN | Business invoice | Optional |
| Organisation, region, capacity answers | Qualifying partner and bulk leads | Yes for those forms |
| Persona ("I am a") | Tailoring follow-up | Optional |
| UTM and source page | Knowing which channels work | Automatic, not personal on its own |
| Consent records | Proof of consent | Automatic |

Never collected: payment card or bank data, government IDs, precise location, date of birth, caste, religion, health data, children's data, contacts or photos from the device.

## 5. Laws that apply (market: India only)

ColdEasy sells and delivers only within India, so Indian law applies. The site does not target the EU, so GDPR is not designed for. If ColdEasy starts selling abroad or targeting EU visitors, this section must be revisited before launch in that market.

| Law or rule | What it requires of this website |
|---|---|
| Digital Personal Data Protection Act 2023 and DPDP Rules 2025 (notified November 2025, most duties phase in by about May 2027) [CONFIRM dates with legal advisor] | Clear notice in plain language (with an option for Indian languages), free and specific consent for marketing, easy withdrawal, purpose limitation, reasonable security, breach notice to the Data Protection Board and affected people, a contact for data questions, deletion once the purpose ends. We build to these now so the site does not need rework later |
| IT Act 2000, section 43A and the SPDI Rules 2011 | Reasonable security practices and a privacy policy, until fully replaced by DPDP |
| CERT-In Directions, April 2022 | Report specified cyber incidents to CERT-In within 6 hours; keep system logs for 180 days; sync clocks to an accurate time source |
| Consumer Protection Act 2019 and Consumer Protection (E-Commerce) Rules 2020 | Show seller name, address and contact; a grievance officer with name and contact; acknowledge complaints within 48 hours and resolve within one month; show total price including all charges; clear return, refund, exchange, warranty, delivery and shipment information; country of origin; no manipulated prices or fake reviews |
| CCPA Guidelines for Prevention and Regulation of Dark Patterns 2023 | No false urgency, basket sneaking, drip pricing, confirm-shaming, forced action, or disguised ads |
| CCPA Guidelines on Misleading Advertisements 2022 | Claims must be truthful and substantiated; disclaimers cannot contradict the main claim |
| Legal Metrology (Packaged Commodities) Rules 2011 | E-commerce listings must show the mandatory declarations: manufacturer or packer name and address, country of origin, generic name, net quantity, MRP, consumer care details [CONFIRM: declarations per product] |
| TRAI TCCCPR 2018 | Commercial SMS needs DLT registration of the sender and templates. Relevant only when SMS is added |
| WhatsApp Business policy | Opt-in required before business-initiated messages; approved templates for the Business API (Phase 2) |
| GST law | Tax invoice for every sale (issued from Zoho Books); GSTIN on B2B invoices; e-invoicing (IRN) if ColdEasy's turnover crosses the threshold; e-way bill for consignments over ₹50,000; record retention [CONFIRM with ColdEasy's accountant] |
| Patents Act 1970, section 120 | Do not describe a product as patented without a granted patent |

## 6. Privacy notice contents

The privacy notice (written or approved by ColdEasy's legal advisor) must cover:

1. Who ColdEasy is: legal entity name, registered address, contact [CONFIRM: legal entity name and address].
2. What data is collected, from which forms, and why (table in section 4).
3. The lawful basis: consent for marketing; the contract for orders; legitimate uses allowed under DPDP where applicable.
4. Who it is shared with: Razorpay, the courier, Zoho Books (accounting and invoicing), the email provider, hosting and database providers, analytics (no personal data).
5. Where it is stored (India) and how long (retention table in document 05).
6. How to withdraw consent, access, correct or delete data, and how fast we respond.
7. Grievance officer and data contact: name, email, phone [CONFIRM: name and contact].
8. How to complain to the Data Protection Board of India.
9. Cookies and analytics used, and how to opt out.
10. Version number and effective date.

## 7. Data subject request process

| Step | Action | Target time |
|---|---|---|
| 1 | Request arrives by the privacy email, WhatsApp or the contact form | |
| 2 | Support logs it in the admin as a "privacy" lead | Same working day |
| 3 | Verify identity by a code sent to the mobile number on record | 2 working days |
| 4 | Fulfil: export, correct, withdraw consent, or delete (orders anonymised where law allows) | Within 30 days [CONFIRM with legal advisor] |
| 5 | Reply to the person and record the outcome | |

Consent withdrawal for marketing takes effect immediately on "STOP" in WhatsApp or the unsubscribe action, and is logged in `consents`.

## 8. Error boundaries

| Failure | What the user sees | What the system does |
|---|---|---|
| Form server error | "Something went wrong on our side. Try again or message us on WhatsApp." Form data kept | Logs to Sentry with request id |
| Payment failed | "Payment didn't go through. No money was taken. Try again or pay on WhatsApp." | Order stays pending; event logged |
| Payment taken but webhook late | "We're confirming your payment. You'll get a message shortly." | Scheduled status fetch from Razorpay |
| Amount mismatch on webhook | Customer sees "confirming" | Order flagged for manual review, owner alerted, never auto-marked paid |
| Database unavailable | Static pages still load; forms show the WhatsApp fallback | Uptime alert to the delivery team and owner |
| Admin permission denied | "You don't have access to this. Ask the owner." | Attempt logged in audit log |
| Unknown route | Branded 404 | Logged if it was a former coldeasy.in URL (to add a redirect) |

## 9. Failure protocols

### Personal data breach

1. Contain: rotate keys, revoke sessions, block the access path. (Delivery team or retainer, immediately.)
2. Assess what data and how many people. (Within 2 hours.)
3. Report to CERT-In within 6 hours of noticing, if the incident is a reportable type.
4. Notify the Data Protection Board and affected people as DPDP requires: initial notice without delay, detailed report within 72 hours [CONFIRM with legal advisor].
5. Fix, test and write a post-incident report for ColdEasy within 7 days.

### Defacement or unauthorised content change

Roll back to the last good Vercel deployment (one click, under 2 minutes), revoke the compromised account, review the audit log, then restore content from the database backup if needed.

### Outage

Public pages are static and served from the CDN, so a full outage is unlikely. If checkout is down, switch the site-wide banner on from the admin ("Order on WhatsApp while we fix checkout") and alert operations.

### Wrong claim, price or product published

Owner or marketing unpublishes it from the admin immediately (pages refresh within a minute). Record what was live, for how long, and who saw it. If customers bought at a wrong price, ColdEasy decides whether to honour it; the contract and refund policy set the default [CONFIRM: policy for pricing errors].

## 10. Risks people usually miss

- "Free" plans and personal accounts. A production system on a developer's personal Vercel or Supabase account means ColdEasy does not own its own site.
- Consent bundled into terms. Marketing consent must be a separate, unticked checkbox, not a line in the terms.
- Real customer data in screenshots. Design reviews, decks and bug reports use synthetic data only.
- The grievance officer is a legal requirement for e-commerce, not a nice-to-have. Name a real person before launch.
- Old site data. If the current coldeasy.in collects form submissions, export them and delete them from the old platform at cutover, or the old system keeps personal data nobody is looking after.
