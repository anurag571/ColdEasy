# 06 · API and Integration Spec

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

## 1. Integration inventory

| Integration | Direction | Purpose | Data sent | Account owner |
|---|---|---|---|---|
| Razorpay Orders API | Out | Create an order before payment | Amount, currency, our order number, notes (order id only) | ColdEasy |
| Razorpay Checkout | Browser | Customer pays | Prefill: name, mobile, email if given | ColdEasy |
| Razorpay Webhooks | In | Confirm payment, failure, refund | Razorpay sends payment and order status | ColdEasy |
| Razorpay Payment Links | Out (admin) | Sell through WhatsApp conversations | Amount, description, customer mobile | ColdEasy |
| Resend (email) | Out | Order confirmation, team alerts | Recipient email, order or lead summary | ColdEasy |
| WhatsApp click-to-chat (wa.me) | Browser link | Start a conversation | Prefilled message text only, no personal data | ColdEasy (number +91 91829 68542 [CONFIRM]) |
| Cloudflare Turnstile | In / out | Bot check on forms | Browser challenge token | ColdEasy |
| Google Analytics 4 | Out | Conversion and funnel measurement | Event names, product ids, values; no personal data | ColdEasy |
| YouTube / Instagram embeds | Browser | Testimonial videos | Loaded only when the visitor taps play | ColdEasy channels |
| Google Maps link | Browser link | Address on Contact page | None | n/a |
| Sentry | Out | Error reporting | Error stack, URL; PII scrubbed | ColdEasy |
| Vercel on-demand revalidation | In | Refresh static pages after admin edits | Path and secret | ColdEasy |
| Zoho Books API (India DC) | Out | Customer, GST invoice, payment, credit note and refund for every paid order | Customer name, mobile, email, billing and delivery address, GSTIN (B2B), line items, amounts, Razorpay payment id | ColdEasy |
| Zoho Books API (read) | In | Invoice PDF for the customer; stock levels only if Zoho Books is the stock master (OD-06) | None sent beyond ids | ColdEasy |
| Gemini image models / Veo | Offline (not called by the site) | Product image and video production | Reference product photos and prompts; never customer data | ColdEasy [CONFIRM] |

Not integrated at launch: WhatsApp Business API, SMS gateway, Zoho CRM, any CRM, courier APIs. Zoho Books is integrated (section 7). Each is a Phase 2 item (document 09).

## 2. Common rules for every endpoint

- JSON in, JSON out, UTF-8. Mobile numbers are normalised to `+91XXXXXXXXXX`.
- Input validated with one shared schema (Zod) on the server, even if the browser already checked it.
- Public form endpoints require a valid Turnstile token and are rate limited to 5 requests per minute per IP and 20 per hour per mobile number.
- Responses never echo back internal ids except the public order token.
- Every request gets a request id, returned in the `x-request-id` header and logged.

| Code | Meaning |
|---|---|
| 200 / 201 | Success |
| 400 | Validation failed; body lists field errors |
| 403 | Bot check failed |
| 409 | Conflict (price or stock changed, duplicate) |
| 422 | Valid request that cannot be fulfilled (pincode not serviceable, product sold out) |
| 429 | Rate limited |
| 500 | Server error; logged with request id |

## 3. Endpoints

### POST /api/signup

| Field | Rule |
|---|---|
| mobile | Required. 10 digits, starts with 6 to 9 |
| consent_marketing | Required, must be `true` |
| persona | Optional: farmer, vendor, fpo, business, other |
| pincode | Optional, 6 digits, not starting with 0 |
| source_page, utm | Optional, captured automatically |
| turnstile_token | Required |

Processing order: verify Turnstile → validate → upsert contact → insert consent row with notice version → insert lead (type signup) unless one exists in the last 30 days → return 201 (or 200 with `already_signed_up: true`). Analytics: `sign_up`.

### POST /api/enquiry

Used by product enquiry, bulk / FPO, distributor, partner, affiliate, contact and notify-me forms.

| Field | Rule |
|---|---|
| type | Required: product_enquiry, bulk, distributor, partner, affiliate, contact, notify_me |
| name | Required except notify_me; 2 to 80 characters |
| mobile | Required |
| email | Optional, valid format |
| organisation | Required for bulk and partner |
| state, district | Required for bulk, distributor, partner |
| product_slug | Optional; required for notify_me |
| quantity | Optional integer 1 to 10,000 |
| answers | Type-specific object, schema per type |
| message | Optional, up to 2,000 characters |
| consent_followup | Required `true` (consent to be contacted about this enquiry) |
| consent_marketing | Optional |
| turnstile_token | Required |

Processing order: Turnstile → validate → upsert contact → consents → insert lead with owner from the routing table → database webhook fires the notification function → return 201 with a reference number. Analytics: `generate_lead` with `form_type`.

Routing table (editable in the admin):

| Lead type | Default owner |
|---|---|
| product_enquiry, notify_me, contact | Support [CONFIRM: name] |
| bulk | Sales lead [CONFIRM: name] |
| distributor, affiliate | Partnerships owner [CONFIRM: name] |
| partner | Founder [CONFIRM: name] |

### GET /api/pincode?code=XXXXXX

Returns `{ serviceable, city, state, min_days, max_days, shipping_paise }` from `serviceable_pincodes`. Not serviceable returns 422 with a WhatsApp link context. Analytics: `pincode_check` with `serviceable`.

### POST /api/checkout

| Field | Rule |
|---|---|
| items | Array of `{ sku, qty }`, 1 to 10 lines, qty 1 to 20 |
| contact | name, mobile, email (optional) |
| address | line1, line2 (optional), landmark (optional), city, state, pincode |
| gstin | Optional, format check |
| consent_order_updates | Required `true` |
| utm | Optional |
| turnstile_token | Required |

Processing order:

1. Turnstile and validation.
2. Re-read every price and stock level from the database. If anything changed, return 409 with the new values.
3. Check the pincode is serviceable; if not, return 422.
4. Calculate subtotal, shipping and total on the server. Never trust totals from the browser.
5. Create the order (status `pending_payment`, `expires_at` in 30 minutes) and order items.
6. Call the Razorpay Orders API with the amount in paise and our order number as the receipt.
7. Return `{ razorpay_order_id, key_id, amount, order_token }` for the browser to open Razorpay Checkout.

### POST /api/checkout/verify

Called by the browser's Razorpay success handler with `razorpay_order_id`, `razorpay_payment_id` and `razorpay_signature`. The server checks the HMAC-SHA256 signature with the key secret. A valid signature moves the order to "verifying" and returns the confirmation URL. It does not mark the order paid; the webhook does that.

### POST /api/razorpay/webhook

| Step | Action |
|---|---|
| 1 | Read the raw body. Verify `x-razorpay-signature` with the webhook secret. Invalid returns 400 |
| 2 | Insert into `webhook_events` using `x-razorpay-event-id`. If it already exists, return 200 (idempotent) |
| 3 | `payment.captured` / `order.paid`: check amount equals the order total, mark order paid, insert payment, decrement stock, trigger confirmation emails |
| 4 | `payment.failed`: mark payment failed; order stays pending until it expires |
| 5 | `refund.processed`: mark order refunded |
| 6 | Mark event processed. Return 200 within 5 seconds; heavy work goes to a background function |

Events to subscribe: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.

A scheduled job every 10 minutes fetches the status from Razorpay for any order in "verifying" for more than 2 minutes, in case a webhook is delayed, and expires unpaid orders after 30 minutes.

### GET /order/[token]

Server-rendered page. Looks up the order by its unguessable token, shows status, items, total, delivery estimate and support links. Shows no full address, only city and pincode.

### POST /api/revalidate

Called by the Supabase function after admin edits, with `REVALIDATE_SECRET`. Rebuilds the affected product or content page.

## 4. Response headers (all routes)

`Cache-Control: no-store` on every API route and the order page; `Content-Type: application/json; charset=utf-8`; `x-request-id`; plus the site-wide security headers in document 07.

## 5. Outbound notifications

| Trigger | Recipient | Channel | Content |
|---|---|---|---|
| Order paid | Customer (if email given) | Email | Order number, items, total, delivery estimate, support WhatsApp link |
| Order paid | Operations [CONFIRM: address] | Email | Order summary with admin link |
| Order dispatched (admin action) | Customer | Email | Courier and tracking number |
| New lead or application | Routed owner | Email | Type, name, region, admin link (no full message in email subject) |
| Payment failed 3 times on one order | Operations | Email | For follow-up by WhatsApp |

Retries: email sends retry 3 times with exponential backoff (1, 5 and 25 minutes). After that the failure is visible in the admin. Webhook processing is retried by Razorpay itself; our handler is idempotent.

## 6. WhatsApp links

One helper, `waLink(context)`, builds `https://wa.me/919182968542?text=...` with a URL-encoded message per context:

| Context | Prefilled message |
|---|---|
| top_bar, footer | "Hi ColdEasy, I'd like to know more." |
| product | "Hi ColdEasy, I'm interested in the [product name]. (from your website)" |
| sold_out | "Hi ColdEasy, please tell me when the [product name] is back." |
| pincode_blocked | "Hi ColdEasy, can you deliver to pincode [pincode]?" |
| checkout_help | "Hi ColdEasy, I need help with my order." |
| payment_failed | "Hi ColdEasy, my payment didn't go through for order [order no]." |

## 7. Zoho Books sync

**Model:** one way, website to Zoho Books, after payment. The website owns orders; Zoho Books owns invoices, tax and the books. Leads and enquiries are not sent to Zoho Books.

**Connection:** a server-based OAuth 2.0 client registered in the Zoho API Console (India, `accounts.zoho.in`), authorised once by a ColdEasy Zoho Books admin. Scopes limited to what the sync needs: contacts, invoices, customer payments, credit notes (create and read), items and settings (read). Every call sends the `organization_id`. Access tokens last one hour and are refreshed from the stored refresh token.

| Step | Trigger | Zoho Books call | Key fields |
|---|---|---|---|
| 1. Contact | Order paid | Search contacts by mobile; create if missing | Name, mobile, email, billing and shipping address, place of contact (state), GST treatment: `consumer` or `business_gst` with GSTIN |
| 2. Invoice | Step 1 done | Create invoice, marked as sent | Zoho item id and tax id per line from `zoho_item_map`, quantity, rate, `is_inclusive_tax: true`, place of supply = delivery state code, shipping charge, reference number = our order number, invoice series per ColdEasy's settings |
| 3. Payment | Step 2 done | Record a customer payment against the invoice | Amount, date, payment mode (UPI, card, netbanking, EMI from Razorpay), reference = Razorpay payment id, deposit account = Razorpay clearing account [CONFIRM with accountant] |
| 4. Credit note | Refund processed in Razorpay | Create a credit note against the invoice | Refunded lines or amount, reason |
| 5. Refund | Step 4 done | Record a refund from the credit note | Amount, mode, Razorpay refund id |
| Invoice PDF | Step 2 done | Fetch invoice PDF | Emailed to the customer or offered on the order page |

Rules:

- Before posting, compare Zoho Books' computed invoice total with the order total. Any difference holds the invoice (`needs_attention`).
- Every step is idempotent: the stored Zoho id is checked before creating anything, and the order number is the invoice reference, so a retry never duplicates.
- Retries at 1, 5, 25 and 120 minutes, then `needs_attention` with the Zoho error in plain words and a retry button in the admin.
- A nightly job reconciles the day's paid orders, Zoho Books invoices and Razorpay captured payments, and emails any differences to operations.
- Razorpay fees and settlements are booked by ColdEasy's accountant from the Razorpay settlement report or bank feed in Zoho Books. The sync does not post fees [CONFIRM with accountant].
- E-invoicing (IRN) and e-way bills: if ColdEasy's turnover requires e-invoicing, Zoho Books generates the IRN for B2B invoices; e-way bills are needed for consignments over ₹50,000. Both are handled in Zoho Books, triggered by ColdEasy's team or Zoho's settings, not by the website [CONFIRM with accountant].
- If Zoho Books is the stock master (OD-06), a 15-minute job reads stock for mapped items into `product_variants.stock_qty`. Otherwise the sync never touches stock.

## 8. Analytics events (no personal data)

| Event | When | Parameters |
|---|---|---|
| view_item | Product page view | item_id (SKU), item_name, price, currency INR |
| add_to_cart / remove_from_cart | Cart change | items array, value |
| view_cart | Cart opened | items, value |
| begin_checkout | Checkout page opened | items, value |
| add_shipping_info | Address submitted | shipping_tier (serviceable or not) |
| add_payment_info | Razorpay opened | payment_type left blank (we do not know yet) |
| purchase | Order marked paid (sent server-side via the GA4 Measurement Protocol) | transaction_id (order number), value, items |
| payment_failed | Razorpay failure | order number only |
| sign_up | Signup success | method: mobile |
| whatsapp_click | Any WhatsApp link | context |
| share_product | Share used | item_id, share_method |
| notify_me | Notify-me success | item_id |
| generate_lead | Any enquiry success | form_type |
| faq_open | FAQ expanded | question id |
| pincode_check | Pincode checked | serviceable true or false |

Never send mobile numbers, names, emails, addresses, pincodes or free text to analytics.

## 9. Risks people usually miss

- Marking an order paid from the browser callback lets anyone fake a payment. Only the verified webhook or a server-side status fetch can mark it paid.
- Without idempotency, a retried webhook double-decrements stock and sends two emails.
- The `purchase` event fired from the browser is undercounted (people close the tab). It is sent from the server.
- Instagram embeds load heavy scripts and set cookies. They load only on tap.
- Zoho Books item and tax set-up is accounting work, not code. If items, HSN codes or tax groups are wrong in Zoho Books, every invoice is wrong. ColdEasy's accountant signs off the mapping table before launch.
- Customer personal data now flows to a second processor (Zoho). The privacy notice must say so.
- Razorpay requires the website to show contact details, pricing, and terms, privacy, refund and shipping policies before it activates live payments. Missing pages delay launch.
