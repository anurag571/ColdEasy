# 08 · AI Guardrails and Claims Register

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 18 November 2026

AI tools (Google AI Studio for design mock-ups, coding assistants for the build, video generators for animation) speed this project up. They also invent numbers, redraw logos and "improve" products that should not change. This document sets the rules.

## A. Rules block for every AI builder prompt

Paste this block, unchanged, at the top of every prompt sent to any AI tool working on ColdEasy.

```
COLDEASY BUILD RULES (do not break any of these)
1. Never invent facts. No ratings, review counts, prices, temperatures, shelf-life
   figures, test results, deployment or impact numbers, customer names, quotes,
   media mentions, certifications, patents or partner names unless they appear in
   the approved claims register supplied with this prompt. Use a placeholder
   written as [CONFIRM: what is needed] instead.
2. Never redraw, retype, recolour, stretch, rotate or add effects to the ColdEasy
   logo. Use the supplied logo files only. The wordmark font is not available.
3. Use only these colours: ink #251A10, sky #6FCCDD, leaf #487537, olive #9FA738,
   marigold #F0A023, chilli #EC2727, cream #FCFBF1, sand #F5F3EC, white #FFFFFF.
   Headings Montserrat, body Poppins. Text on sky, olive and marigold is ink, never white.
4. The ColdEasy Box works without electricity. The AutoBox does not (it has a motor,
   a timer and solar or mains power). Never say the AutoBox works without electricity.
5. The ColdEasy Box is not for meat, fish or dairy. Never imply it replaces a fridge
   for everything.
6. Do not change what the product looks like. The ColdEasy Box has six parts, bottom
   to top: base tray, perforated crate, lock frame, brown kraft honeycomb cooling pad,
   white water feeder frame, flat lid (lifts off, not hinged).
7. No countdown timers, fake scarcity, pre-ticked consent boxes or hidden charges.
8. Signup is optional. Never block browsing or buying behind it.
9. Never put real personal data (names, phone numbers, addresses, photos of real
   people) into code, seed data, tests or mock-ups. Use synthetic data.
10. Never put secret keys in front-end code. Payment success is decided by the
    server webhook only.
11. Keep pages fast on a low-cost Android phone: no heavy libraries, lazy-load video,
    respect prefers-reduced-motion.
12. Product images and videos start from the supplied real photos. Never generate
    the product from a text description alone. The main gallery image is always a
    real photo. Never generate people presented as ColdEasy customers.
13. If a requirement is unclear or conflicts with these rules, stop and list the
    question instead of guessing.
```

## B. Content rules

### Claims

| Allowed | Never |
|---|---|
| Claims in the register with status Approved, worded exactly as approved | Any number not in the register |
| Physics explanations in general terms ("evaporation absorbs heat") | "Guaranteed", "100%", "best in India", "world's first" |
| "Designed for fruits, vegetables and flowers" | "Keeps everything fresh" |
| Third-party statistics with a visible source | Statistics without a source |
| "Patented" with a granted patent number on file | "Patented" or "patent-pending" without documents |
| Ratings from a named, verifiable source | Predefined, estimated or rounded-up ratings |

Every performance claim carries a short footnote with the test conditions (crop, ambient temperature, humidity, duration, who tested) once ColdEasy supplies them.

### Reviews and testimonials

- Only real customers, real words, written consent on file, and the consent reference stored with the story.
- Edits for length or clarity only, approved by the customer. No rewriting meaning.
- No paid or incentivised review without a visible disclosure.
- Each story has its own page; two customers must not share one story link.

### Banned words

Revolutionary, game-changing, world's best, world-class, magic, miracle, guaranteed, zero maintenance, unbreakable, 100% natural (unless certified), eco-friendly (unless specified how), cures, chemical-free, India's No. 1.

### Translation

Machine translation may draft, never publish. A fluent human reviewer approves every translated page, and numbers and claims are re-checked against the register after translation.

### Images, video and voice

- Product media follows the production workflow in document 04, section 11. Every asset records its provenance (photo, AI-assisted, AI-generated) and its ColdEasy approver.
- AI may build backgrounds, scenes, motion and explainer diagrams around a real photo of the product. It may not invent or alter the product, generate the main gallery image, create "customers", or stage "real" field scenes presented as deployments.
- Product animation must match the real six-part product, and any watermark from the generating tool must be removed or the video re-rendered with rights to commercial use.
- No AI-generated or cloned voices of real people.

## C. Chatbot decision

**Recommendation: do not build a chatbot for launch.**

Why: the audience already uses WhatsApp, the team can answer there, and the brief does not ask for one. A chatbot on a product with unverified performance claims is a liability: it will be asked "how many days will my tomatoes last?" and it will make up an answer. If ColdEasy wants one later, it must meet all of these before going live:

| Area | Rule |
|---|---|
| Scope | Answers only from the published FAQ, product specs and approved claims |
| Refusals | Declines medical, legal, financial, agronomic advice, and anything about meat, fish or dairy storage |
| Data | Does not ask for or store personal data; no chat logs with phone numbers |
| Hand-off | One tap to WhatsApp with a human, always visible |
| Disclosure | States clearly that it is an automated assistant |
| Red-team | Tested with at least 50 adversarial questions (prices, discounts, claims, competitors) before launch |
| Kill switch | Admin toggle turns it off site-wide instantly |

## D. Claims register

Status values: Approved, Needs evidence, Reword, Remove. Nothing below is Approved yet. Every row needs ColdEasy's evidence and a named approver before it can appear on the public site.

| ID | Claim (as in the brief) | Where used | Status | Evidence needed | Approver |
|---|---|---|---|---|---|
| C-01 | ColdEasy Box rating 4.9 / 4.85 / 4.95 (66 reviews) | Cards, product page | Needs evidence | Three different values appear in the brief. Source of ratings (platform, date, count) | [CONFIRM] |
| C-02 | AutoBox 3 Box rating 4.87 / 4.85; Solar AutoBox 4.88 (28) | Cards, product page | Needs evidence | Same as C-01 | [CONFIRM] |
| C-03 | AutoBox 2 Box rating 4.85 | Cards | Needs evidence | Same as C-01 | [CONFIRM] |
| C-04 | Prices and strikethrough MRPs (two different sets in the brief) | Cards, product pages | Needs evidence | Confirmed price list, and proof each "was" price was genuinely charged | [CONFIRM] |
| C-05 | Temperature drop "10–15°C" (FAQ, SEEC) vs "Cooling Delta 12°C" (product highlights) | FAQ, Science, product | Reword | One tested figure with conditions | [CONFIRM] |
| C-06 | Tomatoes fresh for 8–10 days; spinach 2–3 days | Product highlights | Needs evidence | Test data, versus what baseline | [CONFIRM] |
| C-07 | Shelf life up to 2× | Product, AutoBox description | Needs evidence | Test data per crop | [CONFIRM] |
| C-08 | 3.5× faster cooling | Product highlights | Needs evidence | What is compared, test method | [CONFIRM] |
| C-09 | Relative humidity 90% | Product highlights | Needs evidence | Logged RH data | [CONFIRM] |
| C-10 | Capacity 25 kg; 47 litres; dimensions and weights in the accordions | Product specs | Needs evidence | Product spec sheet (low risk, but must match the box label) | [CONFIRM] |
| C-11 | 80% lower weight loss | Science (SEEC) | Needs evidence | Lab data and charts | [CONFIRM] |
| C-12 | "Cooling without electricity, motor or fan" | How ColdEasy Works | Reword | True for the ColdEasy Box only. Must not appear near AutoBox | [CONFIRM] |
| C-13 | AutoBox "ensuring consistent performance without electricity" (AC Grid description) | AC Grid page | Remove | Contradicts "Grid Powered, runs on electricity" on the same page | [CONFIRM] |
| C-14 | Constant airflow prevents pest and fungal infestation | FAQ | Reword | "Prevents" is absolute. Evidence or soften to "helps reduce" | [CONFIRM] |
| C-15 | Fridge: ethylene accumulates and accelerates ripening; ColdEasy lets ethylene escape | Comparison | Needs evidence | Citation for the general science, plus ColdEasy airflow data | [CONFIRM] |
| C-16 | Well suited for transportation (FAQ answer is cut off mid-sentence in the brief) | FAQ | Needs evidence | Complete answer and conditions | [CONFIRM] |
| C-17 | EMI options available at checkout | FAQ, cards | Reword | Razorpay confirmation of which products and banks; say "on eligible orders, subject to bank eligibility" | [CONFIRM] |
| C-18 | Food safe material | Materials and care | Needs evidence | Material certificate or supplier declaration | [CONFIRM] |
| C-19 | 900+ units deployed | Impact | Needs evidence | Deployment records and methodology | [CONFIRM] |
| C-20 | 400+ households | Impact | Needs evidence | Same | [CONFIRM] |
| C-21 | 900+ tonnes of food waste avoided | Impact | Needs evidence | Calculation method and assumptions | [CONFIRM] |
| C-22 | ₹480 lakh income protected or generated | Impact | Needs evidence | Calculation method; likely the most challenged number on the site | [CONFIRM] |
| C-23 | "Our patented, refrigerant-free technology" | Impact pillars | Needs evidence | Granted patent number. Otherwise remove "patented" | [CONFIRM] |
| C-24 | "Proprietary" SEEC technology | Science | Needs evidence | Low risk if no patent is claimed; confirm wording | [CONFIRM] |
| C-25 | 1.3 billion tonnes of food lost or wasted each year | Science | Needs evidence | Cite source on page (commonly attributed to FAO, 2011; ColdEasy to confirm the source it wants to use) | [CONFIRM] |
| C-26 | Majority of loss occurs in the first 24 to 48 hours after harvest | Science | Needs evidence | A source. As written, this is a strong claim | [CONFIRM] |
| C-27 | Marketability ~13% at Day 8 (ambient tomato) | Crop dashboard | Needs evidence | Study reference and method | [CONFIRM] |
| C-28 | Media coverage: Times of India, The Better India, The Plate (Instagram), Ahmedabad Mirror, Network 18 | Media Presence | Needs evidence | Exact URLs (four supplied; Network 18 link missing) and screenshots | [CONFIRM] |
| C-29 | Customer stories: Gunja Devi, Sobha Devi, Lathabhai Jadhav, Vannama and Lakshmi | Impact, testimonials | Needs evidence | Signed consent for name, photo, location and video; separate story URLs | [CONFIRM] |
| C-30 | Women's drudgery reduced (Agency and Equity pillar) | Impact | Reword | Keep as an aim ("our design aims to") unless evidence exists | [CONFIRM] |
| C-31 | Journey timeline dates (2019–20 to today) | About | Needs evidence | Founder confirmation (low risk) | [CONFIRM] |

Production gate: a page that references a claim id without status Approved fails the build (document 02, section 8).
