# 04 · UI/UX Design Brief

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

## 1. Design intent in one line

Premium, calm and honest: a technology product that a farmer trusts at first glance and can buy on a basic phone.

## 2. Personality

| ColdEasy is | ColdEasy is not |
|---|---|
| Warm, simple, confident | Loud, hyped, "revolutionary" |
| Science explained in plain words | Jargon or vague eco-talk |
| Premium through space and restraint | Premium through effects and gradients |
| Rooted in Indian farms and markets | Generic stock-photo agriculture |
| Honest about what it does not do (meat, fish, dairy) | Claiming to beat a fridge at everything |

Reference feel from the client brief: the product focus and clean staging of Oura's product pages, the hover image swap of On Spot Energy's product grid, the editorial science and About storytelling of Urban Kisaan.

## 3. Brand rules (copied from the ColdEasy brand book, February 2026)

- Primary palette: #251A10 ink, #6FCCDD sky, #487537 leaf, #9FA738 olive, #F0A023 marigold, #EC2727 red, #FFFFFF white, #FCFBF1 off-white.
- Fonts: Montserrat primary (headings), Poppins secondary (body).
- The wordmark is set in "Noir", a paid font. Always use the logo file. Never retype the wordmark.
- Logo tagline: "Product of Temperate". Minimum height 36 px for the horizontal logo and 45 px for the symbol alone.
- Never stretch, rotate, recolour, add shadows to, or reduce the opacity of the logo.
- Variants: colour on light backgrounds; white wordmark on dark #251A10; mono black or white.
- Signature: a thin multi-colour vertical bar beside section headings; rounded corners; two patterns (bold geometric quarter-circles and leaves; minimal rounded-seed grid).
- Contrast: white text fails on sky, olive and marigold. Use ink on those colours.

[CONFIRM: the logo PDF's printed hex labels (#85c9d9, #d83d33, #e4a242, #9fa54b, #52733e, #221911) do not match its own artwork or the brand book. We build to the brand book values above. ColdEasy's brand agency (Orello) to confirm.]

## 4. Design tokens

### Colour

| Token | Hex | Use | Contrast note |
|---|---|---|---|
| ink | #251A10 | Body text, headings, dark footer | 16.4:1 on cream |
| sky | #6FCCDD | Cooling and technology accents, diagrams, airflow lines | Ink text only (9.2:1) |
| leaf | #487537 | Primary buttons, success, ticks | White text 5.4:1 |
| olive | #9FA738 | Tags, secondary accents | Ink text only (6.5:1) |
| marigold | #F0A023 | Sticky signup bar, sale price highlight | Ink text only (7.9:1) |
| chilli | #EC2727 | Crosses in comparison, Sold Out, errors. Use sparingly | White text only at 18 px bold or larger (4.3:1). Not for body text on cream |
| cream | #FCFBF1 | Main page background | |
| sand | #F5F3EC | Alternate section background | |
| white | #FFFFFF | Cards, product panels | |
| sky-light | #E2F5F8 | Product hero circle, info boxes | |
| leaf-light | #E4EDE0 | Success backgrounds | |
| marigold-light | #FFEBB6 | Placeholder pills, highlights | |
| ink-60 | #5E554E | Secondary text | 7.0:1 on cream |
| ink-40 | #A39E98 | Borders and dividers only | 2.6:1, never for text |

### Type scale

| Style | Font | Mobile | Desktop | Weight | Notes |
|---|---|---|---|---|---|
| Display (hero) | Montserrat | 36 px | 64 px | 800 | Tight line height 1.1 |
| H1 | Montserrat | 32 px | 56 px | 700 | |
| H2 (section) | Montserrat | 24 px | 36 px | 700 | Uppercase, +2% tracking, accent bar |
| H3 | Montserrat | 20 px | 24 px | 600 | |
| Price | Montserrat | 28 px | 36 px | 700 | MRP struck through at 60% size in ink-60 |
| Body | Poppins | 16 px | 17 px | 400 | Line height 1.5, max 70 characters |
| Small / caption | Poppins | 13 px | 14 px | 400 | Never below 13 px |
| Button | Montserrat | 16 px | 16 px | 700 | Uppercase for primary CTAs |

Load only the weights used (Montserrat 600, 700, 800; Poppins 400, 500, 600), self-hosted with `font-display: swap`, Latin subset first. Add Noto Sans Devanagari when Hindi launches.

### Spacing and shape

| Token | Value |
|---|---|
| Base unit | 4 px |
| Section padding | 64 px mobile, 120 px desktop |
| Content max width | 1200 px, gutters 16 px mobile and 32 px desktop |
| Card radius | 20 to 24 px |
| Button radius | Full pill |
| Shadow | One soft shadow only: 0 8 px 24 px rgba(37, 26, 16, 0.08) |
| Touch target | At least 48 × 48 px |

## 5. Component specs

| Component | Spec |
|---|---|
| Section heading | H2 with the brand accent bar: a 4 px rounded vertical strip in stacked segments of sky, marigold, chilli and leaf, to the left of the text |
| Primary button | Leaf background, white Montserrat 700, pill, 52 px tall on mobile. Hover darkens 8%. Visible 3 px sky focus ring |
| Secondary button | Ink outline 2 px, ink text, pill |
| WhatsApp button | Leaf with the WhatsApp glyph, label "Connect on WhatsApp" |
| Top bar | Marigold, ink text, 40 px tall on mobile. After signup, slimmer bar with WhatsApp and Cart only |
| Header | Cream, 80 px tall shrinking to 56 px; logo 44 px shrinking to 32 px (above the 36 px minimum only at full size; 32 px is the agreed scrolled exception [CONFIRM WITH COLDEASY]) |
| Product card | White, 24 px radius, square image on sand, name (H3), MRP struck through, price, rating row only if verified, BUY NOW pill and Share icon on one row |
| Sold Out label | Chilli pill with white bold 14 px uppercase "SOLD OUT", image at 85% saturation, button replaced with "Notify me" link |
| Placeholder pill (staging only) | Dashed ink-40 outline on marigold-light, text such as "[X–Y] °C, to be verified". Never reaches production |
| Highlights panel | Number first (Montserrat 800, 40 px desktop), label below (Poppins 14 px), sky line icon. One row on desktop, 2 columns on mobile |
| Comparison | Two products centred with a VS divider, fridge points left, ColdEasy points right, aligned row by row, large tick (leaf) or cross (chilli) icons. Neutral points have no icon |
| Accordion | Full-width rows, ink 600 label, chevron right, subtle ink-40 dividers, table inside |
| Story card | Portrait card, one third of the section on desktop: photo, large quote, name, location, organisation, "Know More →" |
| Media card | Screenshot as the main visual, publication logo overlaid, publication name and short caption, whole card links out |
| Form field | 48 px tall, 12 px radius, label above (never placeholder-only), +91 prefix fixed for mobile numbers, numeric keypad |
| Toast | Ink background, white text, bottom centre, 4 seconds |
| Footer | Ink background, reversed logo, "Effortless Cooling, Everyday.", full-colour social icons, Razorpay badge row, three link columns, WhatsApp CTA |

## 6. Imagery rules

- Real ColdEasy photography of real users, crops and places. No generic agriculture stock photos.
- Product shots on soft plain backgrounds that match the product (sand or sky-light). Never put a pattern behind a product image.
- The product must look exactly like the real product: the confirmed six parts of the ColdEasy Box in the right order (base tray, perforated crate, lock frame, kraft honeycomb cooling pad, water feeder frame, lid). AI-generated imagery that changes the product is not allowed.
- The current exploded-view video has a visible Gemini watermark. It must be re-rendered or cleaned before launch.
- Every image has descriptive alt text. Decorative images use empty alt text.
- Export images as AVIF or WebP with responsive sizes. Hero images under 150 KB on mobile.
- People in photos must have given consent (see document 07).
- The main gallery image of every product is a real photograph (retouching and background clean-up are fine). AI-assisted images follow section 11.

## 7. UX rules

1. Mobile first. Design at 360 px, then scale up.
2. Signup is never a gate. No pop-up on arrival.
3. WhatsApp, Cart and Menu are reachable from every screen.
4. Price, delivery availability and shipping cost are visible before payment. No surprise charges at the last step.
5. One primary action per section.
6. No countdown timers, fake stock warnings or pre-ticked boxes.
7. Every animation respects `prefers-reduced-motion` and never blocks reading.
8. Errors say what happened and what to do, in plain words.
9. Numbers in the design are either verified or clearly placeholder. Never "realistic-looking" sample figures.
10. Use the real product and contact details in the footer: info@coldeasy.in and +91 91829 68542. The brief's footer text has "+91 91829 6854", which is missing a digit [CONFIRM: correct number and calling hours].

## 8. Above-the-fold priorities per page (mobile)

| Page | What must be visible without scrolling |
|---|---|
| Home | Top bar, header, headline "Effortless cooling at your doorstep", ColdEasy Box image, BUY NOW |
| Products | "Best Sellers" heading, tagline, first product card with price and BUY NOW |
| Product page | Main image, name, price, BUY NOW (on mobile the buy panel sits directly under the image) |
| Science | Tomato hero with "The Science of Freshness" and the two CTAs |
| Impact | "Cooling for a Resilient Future", one-line description, first metric (only if verified) |
| About | "Cooling doesn't reach everyone who needs it." and the first paragraph |
| Contact | WhatsApp, Call and Email buttons |
| Checkout | Order total and the first form field |

## 9. Design inspiration links (from the client brief)

| Reference | What to learn from it | What not to copy |
|---|---|---|
| ouraring.com product pages | One product, lots of space, soft background matched to the product | The dark, luxury tone |
| onspotenergy.com/collections/featured-products | Hover swap to a second product image | Dense marketplace layout |
| urbankisaan.com (home) | Germination animation as a model for the one-time tomato sequence | Looping animation |
| urbankisaan.com/about | Editorial story, journey timeline, team blocks | |
| Amazon product share | Native share with title and link text | Amazon's visual style |
| Current coldeasy.in | Existing content for Mushroom Maker, Onion Keeper, stories and resources | The current layout |

## 10. Design QA checklist

- [ ] Only the token colours are used; no off-palette hex values.
- [ ] Every text and background pair meets 4.5:1 (3:1 for large text).
- [ ] Logo files used as supplied, at or above minimum size, with clear space.
- [ ] Every section heading has the accent bar.
- [ ] Every product page follows the one template; no one-off layouts.
- [ ] Buy Now aligns with the bottom of the main image on desktop and sits under the image on mobile.
- [ ] Sold Out product has no active purchase control anywhere (card, page, cart, structured data).
- [ ] No unverified number appears in any design file sent to ColdEasy for approval without a placeholder pill.
- [ ] Every interactive element has hover, focus, active and disabled states.
- [ ] Tested at 360, 390, 768, 1024, 1280 and 1440 px widths.
- [ ] Reduced-motion version reviewed for every animation.
- [ ] Spelling errors in the brief corrected in the final copy (for example "Eequires" to "Requires", "Cortable" to "Portable").

## 11. Product image and video production

Requested on 18 November 2026 as a change request, and confirmed the same day as an AI-assisted production workflow run by the delivery team, not a generation tool inside the admin (document 02, OD-08).

### Decision

Produce every product's images and video as a controlled production workflow, not as a live feature of the site. Generative tools (Gemini image models and Veo, already used for the exploded-view work) speed up backgrounds, scenes and motion, but they always start from real photos of the real product, and a person checks every asset against the product before ColdEasy approves it.

Why: with seven products, a one-time production run costs far less than building and paying for a generator in the admin, and it keeps brand and product accuracy under one reviewer. The first exploded-view attempt showed the failure mode: the tool turned the kraft pad white, dropped the feeder frame, hinged the lid and morphed the crate.

### Deliverables per product

| Asset | Spec | Source rule |
|---|---|---|
| Main packshot | 1:1, 2000 × 2000 px master, product on sand or sky-light, soft shadow | Real photo, retouched. No AI-generated product |
| Gallery images (4) | 1:1 masters: three angles plus one parts or detail view | Real photos; AI may clean backgrounds only |
| Hover image | 1:1, product in use (vendor stall, farm, home kitchen) | AI-assisted scene allowed if the product is composited from a real photo, unchanged |
| Large showcase visual | 16:9, 2400 px wide | Real photo or AI-assisted scene, same rule |
| Social share (Open Graph) | 1200 × 630, logo file, product, name; no price (prices change) | Built from approved assets |
| Product video | 15 to 40 s, 16:9 and 9:16 cuts, silent, no text burned in except the approved end line; 1080p under 10 MB and 720p under 4 MB; poster frame | AI-assisted (Veo) from reference frames, or real footage. Must show the true parts and how they fit |
| AutoBox variants | Separate packshot and gallery for Solar and AC Grid | Real photos of each variant |

Products without real photos yet (for example Breezey) do not get AI stand-ins. They stay "Coming soon" until ColdEasy supplies reference photos.

### Workflow

| Step | Who | Output |
|---|---|---|
| 1. Shot list and brief per product | Designer | One page per product listing assets, angles and scenes |
| 2. Reference photo shoot (phone photos are enough for reference; packshots need good light) | ColdEasy, with a shot guide from the designer | Every side, parts laid out, scale reference |
| 3. Generation and editing | Designer | Drafts, with the prompt, tool and version logged |
| 4. Internal QA | Designer and project lead | Checked against the parts list, colours and logo rules; watermarks removed or re-rendered |
| 5. ColdEasy approval | Marketing / Content owner | Approved, or changes requested |
| 6. Export and upload | Developer | AVIF and WebP renditions, MP4 and WebM, poster, alt text, provenance recorded in the admin |

### Quality checklist for every asset

- [ ] Product shape, colour, parts and their order match the real product exactly.
- [ ] No visible tool watermark or sparkle. (Invisible watermarks such as Google's SynthID stay in the file; that is fine and should not be stripped.)
- [ ] No invented features: no extra handles, vents, displays, labels or text on the product.
- [ ] No AI-generated people presented as customers, and no AI faces in testimonial or impact sections.
- [ ] Produce looks realistic and is a crop the product is meant for (fruit, vegetables, flowers; never meat, fish or dairy).
- [ ] Logo placed from the logo file, never generated.
- [ ] No performance claim implied by the image (for example a thermometer showing a number) unless it is an Approved claim.
- [ ] File sizes within budget; alt text written.

### Costs and rights (to confirm before production)

- Generation is billed per image or per second of video on the account used. Budget a fixed number of attempts per asset (for example 10 image attempts and 5 video attempts) and stop and review if an asset exceeds it [CONFIRM: generation budget and whose account pays].
- Use only a paid account whose terms allow commercial use of outputs, owned by ColdEasy or transferred to it at handover [CONFIRM with ColdEasy].
- AI-generated material may have limited copyright protection, so competitors could reuse it. Real photos give ColdEasy stronger ownership; another reason the main images are real.
