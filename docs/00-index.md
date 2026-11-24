# 00 · Build Pack Index

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

## What this pack is

This pack turns the approved ColdEasy brief (Project Charter, Phased Implementation Plan and the client Website Document) into the ten documents a designer, developer or AI builder needs before any production code is written. It does not replace the charter. Where the two differ, the charter governs scope and commercials, and this pack governs how the work is built.

Scope check: the website, e-commerce, admin, automations and launch are inside the charter's agreed scope. Two additions requested on 18 November 2026 are included in this pack but sit outside the charter as signed, so each needs a written change request before work starts:

- **Zoho Books integration.** The charter excludes "complex ERP, accounting … integrations beyond agreed requirements". This pack specifies a one-way order-to-accounting sync (invoices, GST, payments, refunds) and treats it as a launch requirement.
- **Image and video generation for each product.** The charter excludes "creation of new product photography, videos". This pack specifies an AI-assisted production workflow run by the delivery team, with ColdEasy approving every asset. Confirmed on 18 November 2026 as a production workflow, not a feature inside the admin (document 04, section 11).

Items marked Phase 2 or later also need a separate change request or SOW.

Pack choice: this is the full pack, not the lite one. The site has more than five pages, takes payments, stores customer and order data, and has an admin with logins, so every document is needed.

## The ten documents

| # | Document | What it answers | Main reader |
|---|---|---|---|
| 01 | Product Requirements (PRD) | What are we building, for whom, and how will we know it worked? | ColdEasy founder, project lead |
| 02 | Technical Requirements | Which stack, which hosting, which standards, and why? | Developer, ColdEasy technical contact |
| 03 | App Flow | How does a visitor move through the site, and what happens in every form state? | Designer, developer, QA |
| 04 | UI/UX Design Brief | What does it look and feel like, down to colour tokens, component specs and how product images and videos are produced? | Designer, AI builder |
| 05 | Backend Schema | What data is stored, for how long, and what is never stored? | Developer |
| 06 | API and Integration Spec | What talks to what (Razorpay, Zoho Books, email, WhatsApp, analytics) and how? | Developer |
| 07 | Security, Access and Privacy | Who can see what, which laws apply, what happens when something breaks? | ColdEasy founder, legal advisor, developer |
| 08 | AI Guardrails and Claims Register | What may the site claim, and what rules bind any AI tool used to build it? | ColdEasy marketing, project lead |
| 09 | Feature Ticket List | The PRD as a build checklist, grouped by epic | Project lead, developer |
| 10 | Deployment, Testing and Runbook | How we test, launch, roll back and hand over | Developer, QA, ColdEasy operations |
| 11 | Kickoff Changes (23 Nov 2026) | What changed at the kickoff call, what the prototype audit found, and what ColdEasy still owes, row by row. Overrides 01 to 10 where they conflict. | AI coding agent, developer, project lead |
| 12 | Admin and Content Management Plan (D-12-01 decided: custom admin on Supabase) | How does the ColdEasy team run products, stock, orders, milestones, partners and translations without a developer, with roles, approvals, preview, audit and backup? | ColdEasy founder, operations, developer |

## Placeholder convention

Anything not yet confirmed by ColdEasy is written as **[CONFIRM: what is needed]**. Features we believe exist but have not been confirmed are written as **[CONFIRM WITH COLDEASY: ...]**. These match the [TBC] items in the Project Charter v2.0.

> Build gate: the production build fails automatically while any [CONFIRM placeholder remains in published content, product data or legal pages. Staging builds may show placeholders, clearly marked. This is how we guarantee no unverified number reaches the public site.

## Top blockers ColdEasy owns

These items stop specific parts of the build. Each is a dated client dependency in the project plan.

| # | Blocker | Blocks | Needed by |
|---|---|---|---|
| B-01 | Final product list, SKU structure (is "AutoBox 3 Box" the same product as "Solar AutoBox"?), prices and MRP. The brief contains two different price sets for the same products. | Product pages, cart, checkout | End of Phase 0 [CONFIRM: date] |
| B-02 | Ratings and review counts: source data showing they come from real buyers. The brief gives three different ratings for the ColdEasy Box (4.9, 4.85 and 4.95), so these cannot be shown until verified. | Product cards, product pages | Phase 2 start [CONFIRM: date] |
| B-03 | Evidence for every performance claim (12°C vs 10–15°C cooling, 2× shelf life, 3.5× faster cooling, 90% RH, 80% lower weight loss) and every impact figure (900+ units, 400+ households, 900+ tonnes, ₹480 lakh). See the claims register in document 08. | Product highlights, Science page, Impact page | Phase 4 start [CONFIRM: date] |
| B-04 | Razorpay account with KYC complete, GST details, and confirmation of which payment methods and EMI options are live. | Checkout launch | Phase 2 start [CONFIRM: date] |
| B-05 | Legal pages written or approved by ColdEasy's legal advisor: Terms, Privacy, Refund and Cancellation, Shipping and Delivery. Razorpay will not activate a live account without them. | Checkout launch, go-live | Phase 5 start [CONFIRM: date] |
| B-06 | Shipping partner, serviceable pincodes and shipping cost rules. The AutoBox ships at a courier volumetric weight of roughly 68 kg, so shipping cost decides whether online sales make money. | Checkout, pricing | Phase 2 start [CONFIRM: date] |
| B-07 | Domain and DNS access (GoDaddy), and a list of the existing coldeasy.in email records so email is not broken at cutover. | Launch | Phase 5 start [CONFIRM: date] |
| B-08 | Customer story consents, photos and separate story URLs (Gunja Devi and Sobha Devi currently link to the same page). | Testimonials, Impact page | Phase 4 start [CONFIRM: date] |
| B-09 | Named owners: decision-maker, content owner, operations owner, technical/payment contact. | All approvals | Phase 0 |
| B-10 | Zoho Books: organisation access for integration set-up, the Zoho plan in use, GSTIN and tax settings, item list with SKUs and HSN codes, invoice series, and sign-off from ColdEasy's accountant on how online sales are booked. | Accounting sync, launch | Phase 2 start [CONFIRM: date] |
| B-11 | Reference photos of every real product (all sides, parts laid out) and a decision on which product images may be AI-assisted. AI tools cannot produce an accurate product they have never seen. | Product galleries, videos | Phase 1 [CONFIRM: date] |

## How to use this pack

1. ColdEasy reviews documents 01, 04, 07 and 08 first. Those contain the decisions that change what the public sees.
2. The developer works from 02, 03, 05, 06, 09 and 10.
3. Every AI builder prompt (Google AI Studio or any coding assistant) starts with the rules block in document 08, section A.
4. Changes to this pack after sign-off go through the charter's change-control process.
