# 01 · Product Requirements Document (PRD)

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

## 1. Problem

ColdEasy sells a new category of product (passive evaporative cooling for fresh produce) to buyers who are cost-sensitive, often browse on low-cost Android phones over patchy data, and have never seen the product before. Today there is no simple way for them to understand it, trust it, buy it online or apply to sell it. Every sale and every partner conversation depends on the team's time.

## 2. Goal in one sentence

Build a sales-enabled brand and service platform that makes a first-time visitor believe within a minute that ColdEasy works, lets them buy or enquire without talking to anyone, and gives the ColdEasy team one place to run products, orders and leads.

## 3. Success metrics

Targets are set in Phase 0 against ColdEasy's current numbers. A metric without a baseline is not a target, so we do not invent one here.

| ID | Metric | Target | How measured |
|---|---|---|---|
| M-01 | Online orders per month | [CONFIRM: target, set in Phase 0] | GA4 `purchase` event reconciled weekly with paid orders in the admin |
| M-02 | Qualified leads per month (bulk, FPO, product enquiry) | [CONFIRM: target] | `generate_lead` events plus enquiry records with status "qualified" |
| M-03 | Distributor and partner applications per month | [CONFIRM: target] | Application records in the admin |
| M-04 | WhatsApp conversations started | [CONFIRM: target] | `whatsapp_click` events by page context |
| M-05 | Checkout completion rate (begin checkout to purchase) | [CONFIRM: target] | GA4 funnel |
| M-06 | Mobile performance on product pages | LCP under 2.5 s, CLS under 0.1, INP under 200 ms at the 75th percentile | Vercel Speed Insights field data plus Lighthouse CI |
| M-07 | Content independence | ColdEasy updates price, stock, a story or an FAQ without a developer | Observed in UAT and in the first 30 days |
| M-08 | Lead response time | [CONFIRM: target, for example within one working day] | Time from lead creation to first status change in the admin |

## 4. Personas

| Persona | Device and context | Main job on the site | What wins them |
|---|---|---|---|
| Smallholder farmer | Low-cost Android, 3G/4G, Hindi or regional language first | Understand what the box does for their crop, ask on WhatsApp, maybe buy | Simple words, real farmer stories, price clarity, WhatsApp |
| Street vendor or retailer | Android, busy, buying with their own cash | Compare with a fridge on cost and power, buy directly, reorder | Fridge comparison, honest numbers, EMI if eligible |
| FPO or cooperative lead | Phone and laptop, buying for members or with funding | Send a bulk or deployment enquiry, get a proposal | Deployment stories, structured enquiry, fast follow-up |
| Rural entrepreneur | Android | Apply to become a distributor or affiliate | A clear application path and what happens next |
| Partner, NGO, CSR team, funder, journalist | Laptop | Check whether ColdEasy is credible | Science page, Impact page with methodology, real media links |
| ColdEasy team member | Laptop | Manage products, stock, orders, leads and content | A simple admin that does not need a developer |

## 5. Scope

### In scope (initial launch, per the charter)

- Responsive site: Home, Products, seven product pages (from one template), Science, Impact with customer stories, About, Contact, Partner applications (distributor, partner, affiliate), Cart, Checkout, Order confirmation, four legal pages, 404.
- Sticky signup bar (mobile number only), WhatsApp and Cart always visible.
- Razorpay checkout with server-side payment verification. EMI shown only where Razorpay confirms it applies.
- Supabase database and a lean admin for products, stock, orders, leads, applications and trust content.
- Notifications to the team and confirmations to customers by email. WhatsApp click-to-chat links with page-specific messages.
- Analytics events for every conversion goal, SEO and AEO structure, accessibility, performance, QA and launch.
- **Change request:** Zoho Books integration. Every paid website order (and every WhatsApp Payment Link sale) creates the customer, GST invoice and payment in Zoho Books; refunds create a credit note. One way, website to Zoho Books.
- **Change request:** image and video production for each product, AI-assisted from real product photos, approved by ColdEasy before use (document 04, section 11).

### Out of scope (initial launch)

- Customer accounts and login. Checkout is guest only; order look-up is by a secure link.
- A review collection and moderation system. Ratings are shown only if ColdEasy has a verifiable source.
- Loyalty, coupons, referral codes, subscriptions, marketplace sellers.
- Full regional-language translation. The site is built language-ready; Hindi is the first Phase 2 candidate.
- WhatsApp Business API automation, SMS campaigns, abandoned-cart messaging.
- ERP, warehouse or courier integration, and any accounting integration other than the Zoho Books sync above (for example payroll, purchase bills, two-way stock sync).
- Professional photo or video shoots, 3D modelling, scientific testing, legal drafting, or copywriting beyond editing. AI-assisted product media is in scope only as described in document 04, section 11.
- An AI image or video generator inside the admin (decided against on 18 November 2026; see document 04, section 11).
- A chatbot. See document 08 for why.

## 6. Product catalogue (as briefed, to be confirmed)

| ID | Product | Launch status | Open question |
|---|---|---|---|
| P-01 | ColdEasy Box | Buy Now | Price: brief shows both ₹4,999 to ₹3,990 and ₹4,200 to ₹3,500 [CONFIRM: price and MRP] |
| P-02 | ColdEasy AutoBox 3 Box (Solar) | Buy Now | Is this the same product as "Solar AutoBox"? Brief shows ₹19,999 to ₹15,490 and ₹17,000 to ₹16,500 [CONFIRM] |
| P-03 | ColdEasy AutoBox 3 Box (AC Grid) | Variant of P-02 | Separate SKU and price [CONFIRM: SKU, price, images] |
| P-04 | ColdEasy AutoBox 2 Box | Visible, always Sold Out, "Notify me" | Confirm it should stay listed while permanently unavailable [CONFIRM] |
| P-05 | ColdEasy Breezey | [CONFIRM: sell, enquire or coming soon] | No content supplied yet |
| P-06 | ColdEasy Mushroom Maker | [CONFIRM] | Content to come from the current coldeasy.in page |
| P-07 | ColdEasy Onion Keeper | [CONFIRM] | Content to come from the current coldeasy.in page |

## 7. Functional requirements

MoSCoW: M = must have for launch, S = should have, C = could have if time allows, W = won't have this release.

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Sticky top bar with "Sign up to LEARN MORE", WhatsApp and Cart. Signup takes a +91 mobile number and a consent tick only. After signup the prompt disappears and only WhatsApp and Cart remain. | M |
| FR-02 | Signup is never required to browse or buy. | M |
| FR-03 | Sticky header with logo and Home, Products, Science, Impact, About Us, Contact Us. It shrinks on scroll. Mobile uses a hamburger menu, and the two sticky bars never cover more than 15% of a phone screen. | M |
| FR-04 | Home page in the briefed order: hero with ColdEasy Box and Buy Now, How ColdEasy Works, Best Sellers, Fridge vs ColdEasy Box, Customer Testimonials, Media Presence, FAQ, Footer. | M |
| FR-05 | "How ColdEasy Works" uses the existing exploded-view video (poster first, lazy-loaded, silent, with a reduced-motion still). True interactive 3D is Phase 2. | M |
| FR-06 | Products page with Main Products and Other ColdEasy Products, 3 columns on desktop, 2 on tablet, 1 or 2 on mobile, hover image swap and "View Product →". | M |
| FR-07 | One product page template used for every product: gallery with thumbnails, name with Share, rating only if verified, MRP and price, Buy Now aligned with the main image, description, large visual, highlights, SEEC section, accordion (Measurements, Features and Specs, Materials and Care). | M |
| FR-08 | AutoBox page has a Solar / AC Grid variant switch. Each variant has its own SKU, price, stock, images and shareable URL. | M |
| FR-09 | Sold Out products stay visible, show a clear Sold Out label, have no active Buy Now, and offer "Notify me". | M |
| FR-10 | Share opens the phone's native share sheet with the product name, price and link, and falls back to copy-link and WhatsApp share. | M |
| FR-11 | Cart drawer and cart page. Checkout collects name, mobile, email (optional), address, landmark, pincode, city, state, and optional GSTIN for a business invoice. | M |
| FR-12 | Pincode check shows whether delivery is available and the delivery estimate before payment. | M |
| FR-13 | Payment through Razorpay Standard Checkout. An order is marked paid only after the server verifies the payment (signature plus webhook). | M |
| FR-14 | Order confirmation page and email with order number, items, total, delivery estimate and a WhatsApp support link. | M |
| FR-15 | EMI line ("EMI from ₹X/month") shown only on products and cart totals that Razorpay confirms as eligible. | S |
| FR-16 | Science page: tomato deterioration hero (plays once), Science of Freshness, crop dashboard (Banana, Tomato, Mango) with Ambient vs ColdEasy toggle, cause-and-effect section, SEEC section with diagram, lab-testing charts. All ColdEasy numbers stay blank until verified. | M (structure), data when supplied |
| FR-17 | Impact page: hero, Impact at a Glance, Why It Matters, Three Pillars, People Behind the Numbers with a separate page per story, How We Measure (methodology link), CTA. | M |
| FR-18 | About page: problem, vision and mission, team, journey timeline, partners by category, CTA. | M |
| FR-19 | Contact page with email, map link, WhatsApp, call (with hours) and a contact form. | M |
| FR-20 | Enquiry and application forms: product or bulk enquiry, distributor, partner, affiliate. Each captures type, region, capacity and intent, and routes to the right team member. | M |
| FR-21 | Footer as briefed: logo, "Effortless Cooling, Everyday.", social icons, "Secure payment by Razorpay" with only the methods actually supported, navigation, contact details, Partner With Us, Legal, WhatsApp CTA. | M |
| FR-22 | Admin: products, variants, prices, stock, Sold Out toggle; orders with status (paid, packed, dispatched, delivered, cancelled, refunded); leads and applications with owner and status; CSV export. | M |
| FR-23 | Admin: testimonials, customer stories, media features, FAQs and homepage banners editable without a developer. | S |
| FR-24 | Admin roles: Owner and Operations at launch; Marketing and Support added when ColdEasy names those users. | M (2 roles), S (4 roles) |
| FR-25 | Email notifications: new order to operations, order confirmation to customer (if email given), new lead or application to its routed owner. | M |
| FR-26 | Context-aware WhatsApp links with a prefilled message naming the page or product. | M |
| FR-27 | Analytics events for every conversion goal (see document 06), no personal data in events. | M |
| FR-28 | SEO: titles, descriptions, Open Graph, canonical URLs, sitemap, robots, structured data (Organization, Product, Offer, FAQPage, BreadcrumbList, Article). | M |
| FR-29 | 301 redirects from every live coldeasy.in URL to its new equivalent. | M |
| FR-30 | Savings calculator ("How much could you save?") with range output. Ships only once ColdEasy supplies verified spoilage-reduction rates. | C |
| FR-31 | Hindi language version. | W (Phase 2) |
| FR-32 | Verified-buyer review collection. | W (Phase 2) |
| FR-33 | Zoho Books sync: on payment capture, find or create the customer in Zoho Books (matched by mobile), create a tax invoice with the correct GST treatment, place of supply and HSN, and record the payment against it. B2B orders carry the customer's GSTIN. | M (change request) |
| FR-34 | Zoho Books refunds: a refund in Razorpay creates a credit note and refund entry against the original invoice. | M (change request) |
| FR-35 | Accounting sync screen in the admin: status of every order's sync, the error in plain words, a retry button, and a daily reconciliation of paid orders vs Zoho Books invoices. The customer's order never waits for, or fails because of, Zoho Books. | M (change request) |
| FR-36 | Customer receives the GST invoice (PDF from Zoho Books) by email or a download link on the order page. | S (change request) |
| FR-37 | Product media set for each product: main packshot, 4 gallery images, hover image, large showcase visual, social share image, and one short product video (15 to 40 s), produced to the specs in document 04. | M (change request) |
| FR-38 | Every product image and video records where it came from (photo, AI-assisted, AI-generated), the tool, and who at ColdEasy approved it. Unapproved media cannot be published. | M (change request) |

## 8. Content and claim rules

These apply to every page, every AI prompt and every content update after launch.

1. No rating, review count, performance figure, test result, deployment number, impact figure or media mention is published until it is in the claims register (document 08) with evidence and a named ColdEasy approver.
2. Ratings are shown only if they come from real buyers and ColdEasy can show the source. "Predefined" ratings are not allowed. Indian consumer law treats fake or seeded reviews as an unfair trade practice.
3. Strikethrough "original" prices must be a price ColdEasy has genuinely charged, and the MRP must be shown as required by Legal Metrology rules. A permanently inflated "was" price is a misleading discount.
4. "Without electricity" applies only to the passive ColdEasy Box. It must never be used for the AutoBox, which has a motor, a timer and (for AC Grid) mains power.
5. "Patented" is used only with a granted patent number on file. Claiming a patent you do not hold is an offence under the Patents Act.
6. Third-party statistics (for example "1.3 billion tonnes of food lost or wasted each year") must cite their source on the page.
7. Customer names, photos, locations and videos are published only with written consent on file.
8. Copy is written in short sentences that a farmer reading in a second language can follow. No hype words (see document 08).

## 9. Client dependencies

| Dependency | Owner at ColdEasy | Phase |
|---|---|---|
| Product list, SKUs, prices, MRP, stock rules | Product / Operations owner | 0 |
| Brand assets and approved copy per page | Marketing / Content owner | 0 to 1 |
| Product photos, alternate hover images, AutoBox and AC Grid images | Marketing / Content owner | 1 to 2 |
| Razorpay account, KYC, methods, EMI | Technical / Payment contact | 2 |
| Shipping partner, pincodes, shipping costs, returns policy | Operations owner | 2 |
| Evidence for claims and impact figures, lab data and charts | Founder | 4 |
| Story consents, photos, video links, separate story URLs | Marketing / Content owner | 4 |
| Media screenshots, logos and exact article URLs | Marketing / Content owner | 1 |
| Legal pages and claim disclaimers | Founder with legal advisor | 5 |
| Admin users and notification recipients | Operations owner | 3 |
| Domain, DNS and email record access | Technical contact | 5 |
| Zoho Books access, item list with SKUs and HSN, tax settings, invoice series, accountant sign-off | Founder with accountant | 2 |
| Real reference photos of each product, and approval of every generated image and video | Marketing / Content owner | 1 to 2 |

## 10. Risks people usually miss

| Risk | Why it matters | Decision |
|---|---|---|
| Shipping cost kills online margin | The AutoBox is 65 × 45 × 115.5 cm. Couriers charge by volumetric weight (about 68 kg here, versus 26.5 kg actual). The ColdEasy Box is charged at about 26 kg, not 6.7 kg. | Get real courier quotes in Phase 0. If shipping eats the margin, AutoBox becomes "Buy via WhatsApp / payment link" rather than cart checkout. |
| WhatsApp, not checkout, is the real sales channel | For this audience most purchases may close in chat. A site judged only on online orders will look like a failure. | Track WhatsApp clicks by context as a primary conversion, and give the team Razorpay Payment Links from the admin so chat sales are recorded too. |
| Rural delivery failures get blamed on the website | A Buy Now button on a pincode nobody delivers to creates refunds and bad word of mouth. | Pincode check before payment. Non-serviceable pincodes go to WhatsApp, not checkout. |
| Nobody runs the admin after launch | Leads go cold, stock goes wrong, and the site looks abandoned. | Name an operations owner before Phase 3. Lead response time is a tracked metric. |
| Placeholders become permanent | Trust content usually arrives late or never. | The build gate blocks production while any placeholder remains, so missing content becomes a visible decision, not a silent gap. |
| The AI-made exploded video is not the real product | The current video has a Gemini watermark, and the brief names parts (lid, box, water tank) that differ from the real six-part stack. | Re-render without the watermark and check it against the confirmed parts list before launch. |
| Two invoice numbers for one sale | If the website and Zoho Books both number invoices, GST records and customer copies disagree. | Zoho Books issues the only tax invoice and owns the invoice series. The website shows an order number, never an invoice number of its own. |
| Accounting sync becomes a single point of failure | If checkout waits for Zoho Books, a Zoho outage or an expired authorisation stops sales. | Sync runs after payment, in the background, with retries and a daily reconciliation. |
| Online stock and offline stock drift | If ColdEasy also sells B2B through Zoho Books, the website does not see those sales. | Decide one stock master in Phase 0 (document 02, OD-06). No two-way stock sync at launch. |
| AI product images misrepresent the product | Consumer law requires the listing to show what the buyer receives. An AI "improved" box that differs from the real one is a misleading listing and a refund risk. | The main gallery image is a real photo (retouched is fine). AI work starts from real reference photos and is checked part by part before approval. |
| Discount display breaks consumer law | Inflated strikethrough prices and fake urgency are named dark patterns under the CCPA 2023 guidelines. | Only real previous prices, no countdown timers, no "only 2 left" unless stock really says so. |

## 11. Definition of done (for launch)

- Every M requirement passes its test in document 10 on staging and on production.
- Zero [CONFIRM placeholders in production content (enforced by the build gate).
- A real live ₹1 test transaction has been paid, verified by webhook, recorded in the admin, invoiced in Zoho Books, and refunded with a matching credit note.
- Every published product image and video is approved by ColdEasy, with no tool watermark, and the main image of each product is a real photo.
- Legal pages are live and approved in writing by ColdEasy.
- Every claim on the site is in the claims register with status "Approved".
- Lighthouse mobile scores of at least 85 for Performance and at least 95 for Accessibility, SEO and Best Practices on Home and the ColdEasy Box page.
- ColdEasy has owner access to the domain, Vercel, Supabase, Razorpay, GA4, Search Console and the code repository, and the delivery team's access is scoped.
- ColdEasy's operations owner has completed one order and one lead end to end in the admin without help.
