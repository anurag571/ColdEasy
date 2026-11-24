# 03 · App Flow

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

## 1. Sitemap and URLs

| Page | URL | Notes |
|---|---|---|
| Home | `/` | |
| Products | `/products` | Main Products and Other ColdEasy Products |
| ColdEasy Box | `/products/coldeasy-box` | |
| AutoBox 3 Box | `/products/autobox-3` | Variant switch: `?variant=solar` (default) or `?variant=ac-grid`. Canonical is the base URL |
| AutoBox 2 Box | `/products/autobox-2` | Always Sold Out |
| Breezey | `/products/breezey` | Status [CONFIRM] |
| Mushroom Maker | `/products/mushroom-maker` | Same slug as the current site, so no redirect needed |
| Onion Keeper | `/products/onion-keeper` | Redirect from `/products/coldeasy-onion` |
| Science | `/science` | Anchors: `#freshness`, `#crop-dashboard`, `#seec`, `#lab-testing` |
| Impact | `/impact` | Anchor `#resources` (footer "Resources" link) |
| Customer story | `/impact/stories/[slug]` | One page per customer, as the brief requires |
| About Us | `/about` | |
| Contact Us | `/contact` | |
| Become a Distributor | `/partner/distributor` | |
| Become a Partner | `/partner/partner` | |
| Become an Affiliate Partner | `/partner/affiliate` | |
| Bulk / FPO enquiry | `/enquiry` | Also opened from product pages with the product preselected |
| Savings calculator | `/calculator` | Could-have; only after verified data |
| Cart | `/cart` | Also a slide-in drawer on every page |
| Checkout | `/checkout` | |
| Order confirmation | `/order/[token]` | Unguessable token, no login |
| Legal | `/legal/terms`, `/legal/privacy`, `/legal/refunds`, `/legal/shipping` | |
| Admin | `/admin` | noindex, login required |
| Not found | any unknown URL | Custom 404 |

**Main navigation (header):** Home · Products · Science · Impact · About Us · Contact Us. The brief uses both "Science" and "Technology" for the same page. We use "Science" everywhere.

**Footer navigation:** Home, Products, Science, Impact, Resources (to `/impact#resources`), About Us, Contact Us; Partner With Us (three links); Legal (four links).

## 2. Primary user journeys

### J-1 Buy a ColdEasy Box (farmer or vendor, phone)

1. Arrives on Home from search, Instagram or a shared WhatsApp link.
2. Sees the hero ("Effortless cooling at your doorstep") and taps BUY NOW, or scrolls through How ColdEasy Works and the Fridge comparison first.
3. Product page: swipes the gallery, reads highlights, checks the price, taps BUY NOW.
4. Cart drawer opens with the item. Taps Checkout.
5. Checkout: enters mobile, name and address; pincode check confirms delivery and estimate.
6. Reviews total (product, shipping, GST shown). Taps Pay.
7. Razorpay Checkout opens (UPI, cards, netbanking, EMI where eligible). Pays.
8. Lands on the order confirmation page. Receives email (if given) and can tap WhatsApp for support.
9. In the background, the order is invoiced in Zoho Books. The GST invoice PDF is emailed or offered on the order page once it exists.

### J-2 Ask before buying (most likely real path)

1. On any page, taps WhatsApp in the top bar or on a product page.
2. WhatsApp opens with a prefilled message, for example "Hi ColdEasy, I'm interested in the ColdEasy Box (from your website)".
3. If they buy in chat, the team sends a Razorpay Payment Link created from the admin, and the order is recorded with source "whatsapp".

### J-3 Bulk or FPO enquiry

1. From a product page ("Buying for a group?") or the Impact CTA ("Deploy ColdEasy").
2. Enquiry form: organisation type, name, mobile, state and district, products, quantity, timeline, message.
3. Confirmation screen with what happens next and a response time [CONFIRM: promised response time].
4. The lead appears in the admin with type "bulk", routed to its owner, and an email alert is sent.

### J-4 Apply to become a distributor, partner or affiliate

1. From the footer's Partner With Us, the About CTA or the Impact CTA.
2. Application form with type-specific questions (region, current business, storage or retail capacity, reach).
3. Confirmation screen. Admin record with status "new". Email to the partnerships owner.

### J-5 Check credibility (partner, funder, journalist)

Home → Science (SEEC, lab testing) → Impact (metrics, methodology link, stories) → About (team, journey, partners) → Contact.

### J-6 Sign up for updates

Taps "Sign up" on the top bar → modal asks for +91 mobile, consent tick, optional "I am a" and pincode → success toast → top bar collapses to WhatsApp and Cart on every page from then on.

## 3. Entry points and deep links

| Entry point | Lands on | Must work |
|---|---|---|
| Shared product link (native share or WhatsApp) | Product page with the variant preserved | Open Graph image, title and price show in the WhatsApp preview |
| Instagram bio or post link | Home or a product page with UTM parameters | UTM saved with any lead or order from that session |
| QR code on packaging or at events [CONFIRM WITH COLDEASY] | `/products/[slug]` or a campaign URL | Short, stable URL |
| Footer "Resources" | `/impact#resources` | Scrolls to the section, focus moves to its heading |
| Testimonial "Know More →" | `/impact/stories/[slug]` for that exact customer | Never the general Impact page |
| Media card | The exact article or post URL, in a new tab | Never the publication's homepage |
| Science "Get Started" | `/products/coldeasy-box` | As the brief specifies |
| Product "Learn more" (SEEC) | `/science#seec` | |
| Old coldeasy.in URLs | 301 to the new equivalent | Redirect map in document 10 |

## 4. State machines

Every form uses the same states. Each state has a defined screen.

| State | What the user sees | What the system does |
|---|---|---|
| idle | Empty or prefilled form, primary button enabled | Nothing |
| editing | Inline validation after a field loses focus | Validates locally |
| invalid | Field-level message in plain words, focus moves to the first error | Blocks submit |
| submitting | Button shows a spinner and "Sending…", disabled | Turnstile check, server validation, write to database |
| success | Confirmation message with next step and a WhatsApp link | Fires analytics event, triggers notification |
| error_network | "No connection. Your details are saved, tap to try again." | Keeps the form data in session storage |
| error_server | "Something went wrong on our side. Try again or message us on WhatsApp." | Logs to Sentry, no data lost |
| error_rate_limited | "Too many attempts. Please wait a minute." | Returns 429 |
| duplicate | Signup: "You're already signed up." Enquiry: treated as a new enquiry, linked to the same contact | Upsert by mobile number |

### Checkout and payment

```
cart_empty -> cart_ready -> details_entered -> pincode_checked
   pincode_checked --(not serviceable)--> blocked_pincode (WhatsApp CTA, no payment)
   pincode_checked --(serviceable)--> review
review -> order_created (server creates Razorpay order, stock re-checked, price re-read)
   order_created --(price or stock changed)--> review (with a message explaining the change)
order_created -> payment_open (Razorpay modal)
   payment_open --(user closes modal)--> payment_abandoned (order stays pending 30 min, then expires)
   payment_open --(failure)--> payment_failed (retry or WhatsApp; order stays pending)
   payment_open --(success handler)--> verifying (server checks signature)
verifying --(webhook payment.captured)--> paid -> confirmation page + emails
verifying --(no webhook in 60 s)--> pending_confirmation ("We're confirming your payment. You'll get a message shortly.")
paid -> packed -> dispatched -> delivered
paid -> cancelled -> refunded
```

Rule: the browser's success callback never marks an order paid. Only the verified webhook (or a server-side payment fetch when the webhook is late) does.

### Signup bar

`not_signed_up` → `modal_open` → `submitting` → `signed_up` (stored on the device, prompt hidden on every page) or back to `modal_open` with an error. Clearing browser storage shows the prompt again; the server treats a repeat signup as a duplicate.

### Product availability

`in_stock` (Buy Now) · `low_stock` (Buy Now, no urgency message unless real stock is under the threshold set in the admin) · `sold_out` (no Buy Now, "Notify me") · `coming_soon` (no price, "Notify me") · `enquire_only` (no cart, enquiry form).

### Accounting sync (per order, Zoho Books)

```
order paid -> sync_queued
sync_queued -> contact_ready (found by mobile, or created; GSTIN added for B2B)
contact_ready -> invoice_created (tax-inclusive lines, place of supply = delivery state)
   invoice_created --(Zoho total differs from order total)--> needs_attention (held, owner alerted)
invoice_created -> payment_recorded (Razorpay payment id as reference) -> synced
any step --(Zoho error or timeout)--> retrying (1, 5, 25, 120 minutes) --> needs_attention after the last try
synced --(refund in Razorpay)--> credit_note_created -> refund_recorded -> synced
needs_attention --(fixed, retry from admin)--> resumes at the failed step
```

Rules: the customer's order page, emails and delivery never wait for this flow. Each step stores the Zoho id it created, so a retry never creates a duplicate contact, invoice or payment.

### Product media (per asset)

`requested` → `in_production` → `internal_qa` (part-by-part check against the real product) → `submitted` → `approved` by ColdEasy (published) or `changes_requested` (back to production) → `retired` when replaced. Only `approved` assets can be attached to a published product.

## 5. Interactive components

| Component | Behaviour | Reduced motion / no JS |
|---|---|---|
| Header shrink | Shrinks after 40 px of scroll over 250 ms | Instant change |
| Hero product zoom | Zooms to 1.04 and back once when in view | Static |
| How ColdEasy Works | Exploded-view video, plays when in view, muted, with captions for each step and the end line "Cooling without electricity." | Poster image plus a numbered step list |
| Best Sellers and product cards | Image zoom 1.03 to 1.05, card lift 3 to 5 px, alternate image on hover, "View Product →" | No hover on touch; tap opens the product |
| Fridge vs ColdEasy | Static two-sided layout with large ticks and crosses | Same |
| Testimonials | Swipeable story card (one third width) plus slow right-to-left video strip that pauses on hover, focus or touch | Strip becomes a manually scrollable row |
| Media cards | Horizontal scroll, whole card is a link | Same |
| Product gallery | Tap thumbnail to swap, swipe on mobile, pinch zoom | Thumbnails are links to full images |
| Product video | Poster first; plays muted and inline when in view on desktop, tap to play on mobile; captions for any on-screen text | Poster image with a link to the video file |
| Accordion | One section open at a time on mobile, independent on desktop | Content visible without JS |
| Crop dashboard | Crop selector, Day 0 to Day 8 transition, Ambient / ColdEasy toggle | Final Day 8 states shown side by side |
| Tomato hero | Plays once per page load, never loops | Final frame only |
| Video testimonials | Load the YouTube or Instagram embed only when tapped (thumbnail first) | Link to the video |

## 6. Language switching

English only at launch. The switcher is not shown until a second language exists. When Hindi launches it lives at `/hi/...`, the choice is remembered, and each page links to its translation with `hreflang`. Machine translation is never published without human review.

## 7. Edge and error routes

| Case | Behaviour |
|---|---|
| 404 | Branded page with search-free links to Home, Products and WhatsApp |
| Product removed | 301 to `/products`, never a 404 for a page that was shared |
| Offline or very slow network | Pages are static and cached; forms keep data and retry; checkout warns before payment |
| JavaScript off | All content readable, links work, forms show "Message us on WhatsApp" as the fallback |
| Razorpay down | Checkout shows "Payments are temporarily unavailable. Order on WhatsApp." with a context link |
| Cart item goes out of stock | Cart flags it, removes it from the total and offers "Notify me" |
| Price changed since added to cart | Cart and checkout show the current price with a short note |
| Admin session expired | Redirect to login, then back to the same admin page |
