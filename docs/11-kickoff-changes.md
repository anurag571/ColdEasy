# 11 · Kickoff Changes (23 November 2026)

ColdEasy Website, E-Commerce and Service Platform · Draft v0.1 · 24 November 2026
Source: `client-docs/ColdEasy_Website_Requirements_from_ColdEasy_v0.1.docx` (converted to Markdown, every row and ID kept)

> **Precedence: this file overrides documents 01 to 10 wherever they conflict.** It records what was agreed with ColdEasy at the 23 November 2026 kickoff call and what the prototype audit found. If a rule here and a rule in 01 to 10 disagree, follow this file and flag the conflict in your PR description. Where this file is silent, 01 to 10 still apply. The guardrails in document 08 (never invent facts, claims register, build gate) are never relaxed by anything here.

## How an AI coding agent uses this file

1. Read this file after `00-index.md` and before starting any ticket from `09-feature-ticket-list.md`.
2. Part A tells you what to build or remove. Part B is the client checklist: it tells you what content ColdEasy still owes and what the prototype shows today ("Now:").
3. Never fill a **[TBC]** yourself. Leave the placeholder, render it as a visibly marked placeholder on staging, and keep the feature hidden or the content removed on production. Treat `[TBC]` exactly like `[CONFIRM` for the build gate in `00-index.md`: production fails while either string remains in published content.
4. Cite rows from this file as `11:<ID>`, for example `11:K3-05`. Some IDs repeat across the pack with a different meaning: `B-01`–`B-11` in `00-index.md` are client blockers, and `C-01`… in document 08 are claims. Here `B-` means brand items and `C-` means contact items.
5. Several kickoff items are change requests (see section 2 of Part B). Build them behind a feature flag and do not switch them on in production until the change note is approved. **[TBC: change note approval]**

## Part A. What to build

### A1. Overrides to documents 01 to 10

| Topic | Old rule (doc) | New rule |
|---|---|---|
| Languages | 01 non-goal "full regional-language translation"; FR-31 Hindi only; 03 §6 English only at launch, switcher hidden until a second language exists | Build a language toggle for English plus Hindi, Telugu, Kannada, Tamil, Marathi and Bangla. A language appears in the toggle only after its reviewer approves it (11:K5-03, K5-05). Launch order is 11:K5-02. |
| Fonts | 04 §4: Montserrat and Poppins, Noto Sans Devanagari when Hindi launches | Add a Noto Sans family per script (Devanagari for Hindi and Marathi, Telugu, Kannada, Tamil, Bengali), subject to 11:K5-08. Load each script's font only on pages in that language. |
| Home page theme | 04 §4 tokens: cream/light backgrounds, ink #251A10 for footer | Home page is dark. Remove the white or light gradient at the bottom of the home page. Dark background is Ink #251A10 unless 11:K4-04 says otherwise. Scope (home only or whole site, default or visitor choice) is 11:K4-01. |
| About page partners | 01 FR-18 and 09 T-167: "partners by category" as labels | Five clickable category buttons plus a scrolling partner logo strip (A4). |
| Journey timeline | 01 FR-18: journey timeline from the original brief | Milestones are client-editable data in the admin, not hard-coded (A3). |
| Science page hero | Drawn tomato animation | Realistic tomato degradation visual (A2). |

### A2. Realistic tomato degradation visual (Science page)

- Replace the drawn tomato animation and the drawn tomato, banana and mango shapes in the Crop Freshness Dashboard.
- Option A (real photo series, 11:K1-02) or option B (illustrative visual, 11:K1-04) is decided by 11:K1-01. Build the component so it accepts either a photo series (Day 0, 2, 4, 6, 8, open air vs ColdEasy Box) or a single image.
- If option B is used, show a visible "Illustrative" label on the image. Never caption an illustrative image as a ColdEasy result.
- The figures "up to 15% water weight lost within 8 days" and "~13% remaining saleable grade" stay hidden until 11:K1-06 supplies a source and the claim is in the document 08 register.

### A3. Client-editable milestones ("Our Journey", About page)

- Store milestones as admin-managed content: date (year, or month and year), title (max 6 words), description (max 25 words), optional photo (4:3, at least 1200 × 900 px) with credit line, sort order, published flag. Add a table to the document 05 schema and an admin screen for the role named in 11:K2-04.
- Show 5 to 8 milestones. Until 11:K2-01 arrives, staging shows marked placeholders and production hides the section.
- Any award, grant, funder or partner named in a milestone needs 11:K2-03 proof and, for named partners, 11:K3-05 permission.

### A4. Partner ecosystem (About page)

- Five category buttons: Deployment, Finance, Research, CSR, Ecosystem. They must be real buttons (keyboard and screen-reader accessible).
- What a button opens is 11:K3-01. Default build: a short panel with 2 to 3 lines of copy (11:K3-03) and that category's logos, which also filters the strip.
- Logo marquee that scrolls left to right, looping. Pause on hover and focus, and stop moving for `prefers-reduced-motion`. Use the white or single-colour logo variant on dark backgrounds (11:K3-04).
- Partners are admin-managed data: name, category (one of five), website URL, may-link flag, logo files, permission record reference, published flag.
- **Hard rule: no permission record, no logo and no name** (11:K3-05). Never show partners listed under 11:K3-06. Government or public bodies are named in text, not shown as emblems, unless 11:K3-07 provides formal permission.

### A5. Dark-mode home page

- Redesign the home page on a dark background and delete the white gradient at the bottom.
- Product images on dark use transparent cut-outs (11:K4-03, P-01). Do not place beige studio shots on dark; they render as boxes.
- Keep the contrast rules from document 04 (WCAG AA minimum) in dark mode. Use the reversed logo `design/logo/coldeasy-logo-horizontal-reversed-for-dark-bg.png` on dark.
- The design needs written approval (11:K4-02) before production.

### A6. Language toggle (6 languages)

- Languages: Hindi, Telugu, Kannada, Tamil, Marathi, Bangla, plus English. URL scheme follows document 03 §6 (`/hi/...` etc.), choice is remembered, every translated page has `hreflang` links.
- Strings come from a key-based translation file that matches the Excel in 11:K5-05 (key, English, one column per language). No hard-coded copy in components.
- Translate the pages in 11:K5-01. Default suggestion: header, footer, home, product pages, Science and Contact. Checkout, legal pages and admin stay in English.
- Glossary terms (11:K5-04) such as ColdEasy, SEEC, AutoBox and product names follow the keep-in-English column.
- Machine translation is a first draft only. A language is never published without its named reviewer's approval. The current prototype Hindi text is an unreviewed draft and must not ship.
- Where a language has no support contact (11:K5-07), do not imply support in that language.

### A7. Prototype audit gaps: remove or fix before launch

The Google AI Studio prototype contains placeholder and invented content. None of it may be carried into the new build as fact.

| Gap | What to do | Rows |
|---|---|---|
| Wrong product galleries. ColdEasy Box gallery includes an image of the Breezy unit; most product galleries are AI-made; Breezy images are posters with text | Remove the wrong image. Mark every AI image as a placeholder until replaced by real photos or approved per file | PR-01 to PR-05, P-01 to P-03 |
| Onion Keeper has no images at all | Show a neutral "photo coming soon" state, never an AI-invented product | PR-06 |
| Invented star ratings and review counts (4.9, 4.87, 4.85 with "(XX)") | Remove ratings entirely until a real source exists | H-06, document 08 C-01 to C-03 |
| Invented partner benefits and commissions ("regional distributor margins", "affiliate commission per order", "instant payout cycle") | Remove from all forms until approved | F-01 |
| Unsourced impact figures (900+ units, 400+ households, 900+ tonnes, ₹480 lakh) | Hide until an "as of" date, source and method are provided | I-01 |
| Unsourced performance and science figures (15% water loss, 13% saleable grade, 65% to 80% shelf life, 100% food safe, 1.3 billion tonnes) | Hide each until its source arrives | K1-06, S-01, S-04 |
| Conflicting prices (two price sets in the brief) | Use no price on production until confirmed | PR-01, PR-02, P-06 |
| Sample shipping, returns and refund terms | Placeholder on staging only | F-04 to F-06, L-03 |
| Broken or placeholder links: LinkedIn search links for team, story links to old coldeasy.in, empty media links, empty social links | Replace with exact URLs or remove | A-02, I-04, H-08, B-06 |
| AI images with text printed on them (hero, fridge comparison) | Rebuild as image plus editable text | H-01, H-05 |
| Exploded-view video with tool watermark | Use only the approved re-render | H-03 |

## Part B. Client checklist (from the requirements document)

Prepared for ColdEasy team [TBC: legal entity name] · Prepared by Anurag Saha · Kickoff call 23 November 2026 · Version v0.1, draft for review.
Basis: end-to-end review of the current website prototype, the project charter, the website build pack and the kickoff call.

Anything marked [TBC] is not known yet. Please fill it in, or tell us who will. We have not guessed any facts, figures, names or dates.

### 1. How to use this document

This is a checklist of everything the website needs from ColdEasy. Each section of the site has its own table. Every row is one thing to send or approve, with the format we need, who at ColdEasy owns it, and when it is due.

Most of the current prototype uses placeholders: AI-generated or edited images, sample copy, sample numbers and empty links. These are there to show the layout. None of them can go live until ColdEasy replaces or approves them. The "Now:" line in each row says what the prototype shows today.

#### Owners

Please name one person for each role. One person can hold more than one role. The Owner column in each table uses these roles.

| Role | Responsible for |
|---|---|
| Founder [TBC: name] | Final sign-off on claims, impact figures, prices, legal pages and partner permissions |
| Marketing / Content owner [TBC: name] | Photos, videos, copy, stories, consents, media links, translations review |
| Product / Operations owner [TBC: name] | Product list, specs, prices, stock, shipping, returns, order handling |
| Technical contact [TBC: name] | Domain, email, payment, accounting and analytics access |
| Anurag (consultant) | Briefs, specs, drafts, AI-assisted visuals for approval, build and integration |

#### How to send things

- One shared folder for all files: [TBC: Google Drive or other link]. One sub-folder per section of this document, named with the row number, for example "H-03".
- Send original files. Photos and videos forwarded on WhatsApp are compressed and lose quality. Please share them from the phone gallery or camera through the shared folder.
- Never send passwords by email or WhatsApp. For any account, please invite us as a user, or share through a password manager. See section 12.
- Due dates are [TBC] and will be set against the phase plan. Please give each approval within [TBC: number] working days so the build is not held up.

#### General file specs

| Asset | Minimum spec |
|---|---|
| Product photos | JPEG or PNG, at least 2400 px on the long side, 4:3 landscape. Plain light background, even light, no text or stickers on the image. |
| Field and deployment photos | JPEG, at least 2000 px on the long side, landscape. Real place, real people, with written consent for anyone recognisable. |
| Portraits (stories, team) | JPEG, at least 1200 × 1500 px (4:5), face clearly visible, plain or natural background. |
| Videos | MP4 (H.264), 1080p or higher, original file. Vertical 9:16 for reels, 16:9 for anything else. |
| Logos (partners, media) | SVG, AI or EPS preferred. Otherwise PNG with a transparent background, at least 1000 px wide. A full-colour version and a white or single-colour version for dark backgrounds. |
| Documents | PDF for anything we link to for download. Word or Google Docs for copy we will edit. |
| Data | Excel or CSV, one row per reading, with units and dates. |

### 2. Changes agreed at the kickoff call

These five changes came out of the kickoff call. Each one has its own table in section 3. Some of them add work beyond the agreed scope. We will confirm the effort and cost for those in a separate change note before we start on them.

| Change | What we will do | What we need from ColdEasy | Scope |
|---|---|---|---|
| 1. Realistic tomato degradation visual | Replace the drawn tomato animation on the Science page with a realistic visual. | Real photos (preferred), or approval of a realistic visual we produce. | In scope if ColdEasy supplies photos. An AI-produced version falls under the product media change request. |
| 2. Milestones section | Rebuild the "Our Journey" timeline with ColdEasy's updated milestones. | The full milestone content. | In scope (content update). |
| 3. Partner ecosystem | Add five clickable category buttons and a left-to-right scrolling partner logo strip. | Partner list, logos, written permission to use each logo, copy for each category. | Change request: new interactive section. |
| 4. Dark-mode home page | Move the home page to a dark design and remove the white gradient at the bottom of the page. | Approval of the dark design, and product photos that work on a dark background. | Change request: new visual direction from the approved design brief. |
| 5. Language toggle (6 languages) | Add a language switch for Hindi, Telugu, Kannada, Tamil, Marathi and Bangla. | A named reviewer for each language, approved translations, and support in that language. | Change request: the agreed scope covers a language-ready build, with Hindi as the first language in Phase 2. |

### 3. Kickoff items in detail

#### 3.1 Tomato degradation visual (Science page)
Now: the Science page opens with a computer-drawn tomato that turns from red to brown over "8 days". The Crop Freshness Dashboard below it uses drawn shapes for tomato, banana and mango. These look like cartoons and weaken the science message.

Our recommendation: real photos. A real side-by-side series (open air vs inside the ColdEasy Box) is the strongest proof on the site. A realistic AI image can show the idea, but it cannot be presented as a ColdEasy result and must be labelled "illustrative".

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| K1-01 | Decision: real photo series (option A) or a realistic illustrative visual produced by us (option B) | Written choice | Founder | [TBC] |
| K1-02 | Option A: tomato photo series, open air vs ColdEasy Box, same batch <br>One photo each on Day 0, 2, 4, 6 and 8 | JPEG, at least 2000 px. Same camera position, same plain background and light for every shot. Date and time in the file name. Include a ruler or grid card if possible. | Marketing / Content | [TBC] |
| K1-03 | Option A: test conditions for the series | Short note: dates, location, ambient temperature and humidity, how the box was used | Founder / R&D | [TBC] |
| K1-04 | Option B: approval of the realistic visual we produce | We share a draft. ColdEasy approves in writing. It will be labelled "Illustrative". | Anurag drafts, Founder approves | [TBC] |
| K1-05 | Same decision for banana and mango in the Crop Freshness Dashboard | As K1-02 or K1-04, per crop | Marketing / Content | [TBC] |
| K1-06 | Source for "up to 15% water weight lost within 8 days" and "~13% remaining saleable grade" shown next to the visual <br>Now: shown on the page without a source | Report, paper or internal test data (PDF or Excel). Otherwise we remove the figures. | Founder | [TBC] |

#### 3.2 Milestones ("Our Journey", About page)

Now: five milestones from the original brief (2019–20 to "Today"). ColdEasy will replace them.

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| K2-01 | Full list of milestones, in order | Per milestone: year or month and year, title (up to 6 words), one line description (up to 25 words). Word or Google Docs. Suggested 5 to 8 milestones. | Marketing / Content, approved by Founder | [TBC] |
| K2-02 | Optional photo for each milestone | JPEG, at least 1200 × 900 px (4:3). Credit line if not your own. | Marketing / Content | [TBC] |
| K2-03 | Proof for any award, grant, funding or partnership named in a milestone | Link or document we keep on file. Names of funders and partners need their permission (see 3.3). | Founder | [TBC] |
| K2-04 | Who updates milestones after launch | Name of the person who will edit this in the admin | Founder | [TBC] |

#### 3.3 Partner ecosystem

Now: the About page shows five plain labels (Deployment, Finance, Research, CSR, Ecosystem) and no logos. We will turn the labels into clickable buttons and add a logo strip that scrolls left to right.

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| K3-01 | What each button opens <br>For example: filters the logo strip to that category, opens a short panel, or goes to a page | Written choice. We recommend a short panel with 2 to 3 lines of copy and that category's logos. | Founder | [TBC] |
| K3-02 | Partner list | Excel: partner name, category (one of the five), website link, short description (optional), whether the logo may link to their site | Marketing / Content | [TBC] |
| K3-03 | Category copy for Deployment, Finance, Research, CSR and Ecosystem | 40 to 60 words each, plain language | Marketing / Content | [TBC] |
| K3-04 | Partner logo files | SVG or transparent PNG at least 1000 px wide. Full-colour plus a white or single-colour version for the dark home page. | Marketing / Content | [TBC] |
| K3-05 | Written permission from each partner to show their logo and name | Email or letter from someone at the partner who can approve it. We keep it on file. No permission, no logo. | Founder | [TBC] |
| K3-06 | Confirmation of any partner that must not be named <br>For example, partners under an NDA or ongoing CSR discussions | List | Founder | [TBC] |
| K3-07 | Government, ministry or public body logos, if any | Formal written permission is required. Government emblems have legal restrictions on use. We recommend naming the body in text instead. | Founder | [TBC] |

#### 3.4 Dark-mode home page

Now: the home page uses light cream backgrounds, with a light gradient fading into the bottom of the page. The prototype has a light/dark switch that follows the visitor's phone setting, but the dark version was not designed in detail.

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| K4-01 | Scope of dark mode: home page only, or the whole site; dark as the default, or a choice for the visitor | Written choice | Founder | [TBC] |
| K4-02 | Approval of the dark home page design | We share a design for review. Written approval. | Marketing / Content / Founder | [TBC] |
| K4-03 | Product photos that work on a dark background <br>Now: the product images sit on beige studio backgrounds that will show as boxes on dark | Same shots as section 5, on a plain, evenly lit background so we can cut them out cleanly. Or PNG cut-outs with transparent backgrounds. | Marketing / Content | [TBC] |
| K4-04 | Confirmation of the dark background colour from the brand book | The brand book shows the white logo on Ink #251A10. Confirm we use that, or name another. | Marketing / Content (with Orello, your brand agency, if needed) | [TBC] |

#### 3.5 Language toggle

Now: the prototype has a partial English/Hindi switch. Only the header, home sections, cart and FAQ are set up for it, and the Hindi text is an unreviewed draft. Nothing exists yet for Telugu, Kannada, Tamil, Marathi or Bangla.

Translation for farmers has to be checked by people who speak the language and know the crops. Machine translation alone gets farming words, product terms and safety notes wrong. This is who we propose does what:

| Language | First draft | Review and corrections | Final approval |
|---|---|---|---|
| Hindi | Anurag: machine-assisted draft from the approved English copy | ColdEasy native-speaker reviewer [TBC: name] | Founder |
| Telugu | Anurag: machine-assisted draft | ColdEasy native-speaker reviewer [TBC: name] | Founder |
| Kannada | Anurag: machine-assisted draft | ColdEasy native-speaker reviewer [TBC: name] | Founder |
| Tamil | Anurag: machine-assisted draft | ColdEasy native-speaker reviewer [TBC: name] | Founder |
| Marathi | Anurag: machine-assisted draft | ColdEasy native-speaker reviewer [TBC: name] | Founder |
| Bangla | Anurag: machine-assisted draft | ColdEasy native-speaker reviewer [TBC: name] | Founder |

If ColdEasy prefers professional translators, ColdEasy appoints and pays them, and they replace the "first draft" column. Either way, the reviewer named by ColdEasy approves each language before it goes live.

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| K5-01 | Which pages are translated <br>Our suggestion: header, footer, home, product pages, Science and Contact first. Checkout, legal pages and the admin stay in English. | Written choice | Founder | [TBC] |
| K5-02 | Launch order of the six languages <br>We recommend one or two at a time, starting with the regions where ColdEasy sells most | Ranked list | Founder | [TBC] |
| K5-03 | Named reviewer for each language | Name, contact, and the time they can give per week | Marketing / Content | [TBC] |
| K5-04 | Glossary: words that stay in English and agreed local words <br>For example: ColdEasy, SEEC, AutoBox, product names, crop names | Excel: English term, each language, keep-in-English yes/no | Anurag drafts, reviewers complete | [TBC] |
| K5-05 | Approved translation of every text item | Excel we supply: key, English, one column per language. Reviewer edits in place. | Reviewers, approved by founder | [TBC] |
| K5-06 | Translated customer stories and video subtitles, if wanted | Subtitles as SRT files, or text we turn into subtitles | Marketing / Content | [TBC] |
| K5-07 | Support in each language: who answers WhatsApp and phone enquiries in that language | Names and hours. A visitor who reads Tamil and then gets a reply in English drops off. | Product / Ops | [TBC] |
| K5-08 | Font approval for Telugu, Kannada, Tamil and Bangla scripts <br>The brand fonts (Montserrat, Poppins) do not cover these scripts | We propose a matching Noto Sans font for each script. Written approval. | Marketing / Content | [TBC] |
| K5-09 | Who keeps translations up to date when English copy changes | Name and turnaround time | Founder | [TBC] |

### 4. Brand and site-wide items

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| B-01 | Confirmation of brand colour codes <br>The logo colour sheet prints hex codes that do not match its own artwork or the brand book. We are using the brand book values. | Confirmation from ColdEasy or Orello | Marketing / Content | [TBC] |
| B-02 | Logo files <br>Now: we have the colour, reversed (for dark) and symbol PNGs | Vector master files (SVG, AI or EPS) for all variants, and the favicon | Marketing / Content | [TBC] |
| B-03 | Site name, tagline and footer line <br>Now: "Effortless Cooling, Everyday." and "Product of Temperate" | Approved wording | Marketing / Content | [TBC] |
| B-04 | Main navigation <br>Now: Home, Products, Science, Impact, About Us, Contact Us. The original brief listed two different menus. | Approved menu | Marketing / Content | [TBC] |
| B-05 | Top bar message and sign-up offer <br>Now: "Sign up to LEARN MORE" and "Let your harvest wait for the right price." | Approved wording, and what a sign-up gets (updates, offers, nothing) | Marketing / Content | [TBC] |
| B-06 | Social media links <br>Now: Instagram @coldeasyglobal is set. LinkedIn, Facebook and YouTube links are empty. | Exact URLs, or confirm which channels to leave out | Marketing / Content | [TBC] |
| B-07 | WhatsApp Business number for all "Chat on WhatsApp" buttons <br>Now: +91 91829 68542 is used everywhere | Confirm the number, and that it is a WhatsApp Business account someone answers | Product / Ops | [TBC] |

### 5. Home page

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| H-01 | Hero image <br>Now: an AI-made composite of a farmer with the box and text printed on the image. It has to be replaced or approved. | Real photo of the ColdEasy Box in use, 2400 × 1600 px or larger, with space on one side for text. Or written approval of an AI-assisted image (labelled where needed). | Marketing / Content | [TBC] |
| H-02 | Hero copy <br>Now: "Effortless cooling at your door step" / "Freshness Reimagined, made for everyday" | Approved headline, sub-headline and one short paragraph | Marketing / Content | [TBC] |
| H-03 | How It Works video (exploded view) <br>Now: AI-made animation with a tool watermark, re-rendered to the real six-part stack | Approval of the final video, or a real assembly video (MP4, 1080p) we can use instead | Marketing / Content / Founder | [TBC] |
| H-04 | Best sellers: which three products to show <br>Now: ColdEasy Box, AutoBox 3 Box, AutoBox 2 Box (shown as sold out) | Written choice | Product / Ops | [TBC] |
| H-05 | Fridge vs ColdEasy Box comparison graphic <br>Now: an AI infographic with claims printed on it ("low operating cost", "maintains cooler, high-humidity freshness") | Approval of each claim, or a real side-by-side photo. We will rebuild it as text plus photo so claims can be edited. | Founder | [TBC] |
| H-06 | Star ratings and review counts <br>Now: 4.9, 4.87 and 4.85 stars with "(XX)" reviews | Source of real reviews (marketplace, Google), or we remove ratings until real reviews exist | Product / Ops | [TBC] |
| H-07 | Testimonial video tiles (5) <br>Now: 3 with sample posters (one is broken), 2 empty | YouTube links for each video (we embed from YouTube), the person's name, place and one-line caption, and their written consent | Marketing / Content | [TBC] |
| H-08 | Media coverage cards <br>Now: Times of India, The Better India, Plate India, Ahmedabad Mirror and Network18 with sample headlines, "MEDIA LOGO" placeholders and empty links | For each article: exact URL, real headline, publication date, outlet logo (or screenshot of the article). Confirm the outlet list. | Marketing / Content | [TBC] |
| H-09 | FAQs (8) <br>Now: taken from the brief | Approved questions and answers. Confirm the EMI and distributor answers. | Marketing / Content / Product / Ops | [TBC] |

### 6. Products

Each product page needs the same set of items. The second table lists what is missing for each product today.

#### 6.1 Needed for every product

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| P-01 | Main product photo (real, not AI) | Front view, plain light background, 2400 × 1800 px (4:3) or larger. Also one cut-out version on transparent background for the dark home page. | Marketing / Content | [TBC] |
| P-02 | Hover photo and 3 to 4 gallery photos | Angles, open/inside view, a close-up of the cooling pad or water system, and one photo in use at a farm, shop or stall | Marketing / Content | [TBC] |
| P-03 | Approval of any AI-assisted product image or video | Written approval per file. The main photo must be a real photo. | Founder | [TBC] |
| P-04 | Product name, short description and highlights | Word or Google Docs. Up to 60 words for the description, 3 to 5 highlights. | Marketing / Content | [TBC] |
| P-05 | Measurements, specs, materials and care | Capacity (litres and kg of produce), outer size (cm), empty weight, water use per day, materials, cleaning, warranty | Product / Ops | [TBC] |
| P-06 | Price, MRP and SKU <br>Only a real previous selling price may be shown struck through | Excel: SKU, price incl. GST, MRP, HSN code, GST rate | Product / Ops / Founder | [TBC] |
| P-07 | Stock and selling mode | Buy online, enquire only, sold out with "notify me", or coming soon | Product / Ops | [TBC] |
| P-08 | Packed size and weight for shipping | Carton L × W × H (cm) and gross weight (kg). Couriers charge by size, so this decides shipping cost. | Product / Ops | [TBC] |
| P-09 | EMI eligibility | Confirmed by Razorpay for your account. We show EMI only where Razorpay confirms it. | Technical contact | [TBC] |

#### 6.2 Gaps found per product

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| PR-01 | ColdEasy Box <br>Now: price ₹3,990 / MRP ₹4,999 (the brief also shows ₹3,500 / ₹4,200). Gallery images are AI-made. One gallery image actually shows the Breezy unit, not the Box. | Confirm price and MRP. Real photos per P-01 and P-02. | Product / Ops / Marketing / Content | [TBC] |
| PR-02 | AutoBox 3 Box, Solar and AC Grid <br>Now: ₹15,490 / ₹19,999 (the brief also shows ₹16,500 / ₹17,000). Images are AI-made. AC Grid price and SKU unknown. Specs say "Details to be added". | Confirm if Solar and AC Grid are one product with two variants. Price, SKU, specs and real photos for each variant. | Product / Ops / Marketing / Content | [TBC] |
| PR-03 | AutoBox 2 Box <br>Now: always shown as sold out. Images are AI-made. Specs say "Details to be added". | Confirm it stays listed while unavailable. Specs and real photos. | Product / Ops | [TBC] |
| PR-04 | Breezy <br>Now: price "coming soon". Images are marketing posters with text on them. Spelling differs ("Breezy" / "Breezey"). | Confirm spelling and selling mode. Full specs and real photos. | Product / Ops / Marketing / Content | [TBC] |
| PR-05 | Mushroom Maker <br>Now: price "coming soon". Images are AI-made. Specs say "Details coming soon". | Selling mode, specs and real photos | Product / Ops / Marketing / Content | [TBC] |
| PR-06 | Onion Keeper <br>Now: no images at all. Specs say "Details coming soon". | Selling mode, specs and real photos | Product / Ops / Marketing / Content | [TBC] |
| PR-07 | Product finder answers ("What do you store?") <br>Now: crops mapped to products by us | Confirm which product suits which crop and volume | Product / Ops | [TBC] |

### 7. Science page

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| S-01 | Source for "1.3 billion tonnes of food lost or wasted each year" | Name and link of the report | Founder | [TBC] |
| S-02 | Crop Freshness Dashboard data for tomato, banana and mango, open air vs ColdEasy Box <br>Now: "Data to be added" on the ColdEasy side | Excel: days to spoilage, weight loss %, firmness, pH, saleable grade, per crop, both conditions | Founder / R&D | [TBC] |
| S-03 | Lab charts: temperature curve, humidity, firmness <br>Now: three empty chart placeholders | Excel or CSV, one row per reading, with time, unit and test conditions. If not ready, we hide the charts at launch. | Founder / R&D | [TBC] |
| S-04 | Proof for performance claims used across the site <br>For example: temperature drop, "65% to 80% shelf-life extension", "100% food safe", water use | Test report or field data for each claim. Claims without proof are removed. | Founder | [TBC] |
| S-05 | Savings calculator inputs <br>Now: spoilage reduction ranges (for example tomato 35% to 55%) and crop prices per kg are placeholders | Excel: per crop, low and high spoilage reduction from your data, and a typical price per kg with its source | Founder | [TBC] |
| S-06 | SEEC explanation and airflow animation | Approval of the copy and the animation | Founder / R&D | [TBC] |

### 8. Impact page and customer stories

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| I-01 | Impact figures with an "as of" date and source <br>Now: 900+ units, 400+ households, 900+ tonnes food waste avoided, ₹480 lakh income protected | Figures, date, and how each was measured (survey, sales data, estimate) | Founder | [TBC] |
| I-02 | Field deployment photo for "Food loss is income loss" <br>Now: empty placeholder | Real photo of a vendor stall or farm with the box, 2000 px or larger, with consent | Marketing / Content | [TBC] |
| I-03 | Field photo gallery for the deployment section <br>Now: text only (Bihar, Maharashtra, Karnataka, Andhra Pradesh) | 6 to 12 real photos across regions, with place and date. Confirm the list of states. | Marketing / Content | [TBC] |
| I-04 | Four customer stories: Gunja Devi, Sobha Devi, Lathabhai Jadhav, Vannama & Lakshmi <br>Now: no photos; links point to the old coldeasy.in site | Portrait photo each (4:5, 1200 × 1500 px), full story text (150 to 300 words), video link if any, confirmed quote | Marketing / Content | [TBC] |
| I-05 | Written consent from every person whose name, photo, place or video is shown | Signed consent form (we supply a template, in their language). Kept on file by ColdEasy. | Marketing / Content | [TBC] |
| I-06 | Methodology and Impact Thesis document <br>Now: button opens an empty modal | PDF | Founder | [TBC] |
| I-07 | Three resource downloads: SEEC Thermodynamic Overview, Mandi Vendor Freshness Baseline, FPO Decentralised Cold Chain Guide <br>Now: titles only, no files | PDF for each, or confirm which to remove | Founder | [TBC] |

### 9. About page

Milestones and the partner ecosystem are in section 3.

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| A-01 | Hero copy and vision and mission <br>Now: from the brief | Approved wording | Marketing / Content | [TBC] |
| A-02 | Team: 11 people with photos and roles <br>Now: photos are in place. LinkedIn buttons open a LinkedIn search, not the person's profile. | Confirm names, roles and who to show. Exact LinkedIn profile URLs. Each person's consent to appear. | Marketing / Content | [TBC] |

### 10. Contact page and footer

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| C-01 | Email addresses <br>Now: info@coldeasy.in, privacy@coldeasy.in and grievance@coldeasy.in | Confirm each mailbox exists and who reads it | Technical contact | [TBC] |
| C-02 | Phone number for calls | Number and hours | Product / Ops | [TBC] |
| C-03 | Office and lab addresses <br>Now: "Temperate Technologies, Bangalore & Hyderabad, India" | Full postal addresses, and which one is the registered office | Product / Ops | [TBC] |
| C-04 | Map <br>Now: grey placeholder and a short Google link | Google Maps link for each location you want shown | Product / Ops | [TBC] |
| C-05 | Who receives contact-form messages | Name and email per enquiry type (customer, bulk, partner, media) | Product / Ops | [TBC] |
| C-06 | Payment methods shown in the footer | The methods actually enabled on your Razorpay account | Technical contact | [TBC] |

### 11. Partner forms, orders and delivery

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| F-01 | Benefits shown on the Distributor, Partner, Affiliate and Bulk forms <br>Now: sample text we wrote, such as "regional distributor margins", "affiliate commission per order" and "instant payout cycle". These are promises ColdEasy has not made. | Approved benefits for each form, or confirm we remove them | Founder | [TBC] |
| F-02 | Questions you want each form to ask | List per form | Product / Ops | [TBC] |
| F-03 | Who follows up each form, and how fast | Name, email and target response time per form | Product / Ops | [TBC] |
| F-04 | Shipping partner, serviceable pincodes and delivery times <br>Now: sample pincodes and "3 to 5 days" estimates | Courier name, pincode list (Excel), delivery days by zone | Product / Ops | [TBC] |
| F-05 | Shipping charges and free-shipping threshold <br>Now: free above ₹5,000, flat charge below | Rates per product or zone, and the threshold if any | Product / Ops | [TBC] |
| F-06 | Returns, cancellation and refund rules <br>Now: sample "7 business days" return window and "5 to 7 working days" refund | Your actual rules, for the legal pages | Product / Ops / Founder | [TBC] |
| F-07 | Who receives order notifications, and who packs and ships | Names and emails | Product / Ops | [TBC] |
| F-08 | Setup video for the order confirmation page <br>Now: empty tile | YouTube link, or MP4 we upload to YouTube | Marketing / Content | [TBC] |
| F-09 | GST invoicing through Zoho Books | Item list with SKU and HSN, tax settings, invoice series, and your accountant's sign-off | Founder with accountant | [TBC] |

### 12. Legal and compliance

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| L-01 | Legal entity details | Full company name, CIN, GSTIN, registered office address | Founder | [TBC] |
| L-02 | Grievance officer <br>Required on the site by Indian consumer and IT rules | Name, designation, email, phone | Founder | [TBC] |
| L-03 | Legal pages: Terms, Privacy, Refunds and Cancellation, Shipping <br>Now: sample text | Reviewed and approved by your legal adviser. We supply drafts. | Founder with legal adviser | [TBC] |
| L-04 | Sign-off on the claims list <br>Every number and performance claim on the site, with its source | Signed list (we compile it from sections 5 to 8) | Founder | [TBC] |
| L-05 | Consent and permission records kept on file | Customer, team and partner consents (I-05, A-02, K3-05) | Marketing / Content | [TBC] |

### 13. Accounts, access and credentials

All accounts should be owned by ColdEasy and billed to ColdEasy. We need user access, not your passwords. Please invite us with the role shown, and remove access after handover.

| # | Item (and what is there now) | Format / spec | Owner | Due |
|---|---|---|---|---|
| X-01 | Domain registrar and DNS for coldeasy.in | Invite as a user, or a DNS admin who can add records on request | Technical contact | [TBC] |
| X-02 | Email provider (for sending order and form emails from @coldeasy.in) | Admin who can add the email records we specify | Technical contact | [TBC] |
| X-03 | Current coldeasy.in website | Login or an export of the page list, so we can redirect old links (customer story links point there today) | Technical contact | [TBC] |
| X-04 | Razorpay account, KYC complete, EMI and payment methods enabled | Team member access with developer role. Test and live keys are created inside the account, not sent to us. | Technical contact | [TBC] |
| X-05 | Zoho Books | User access for the integration | Founder / accountant | [TBC] |
| X-06 | Hosting and database accounts (Vercel, Supabase) in ColdEasy's name | Create the accounts with a ColdEasy email and invite us. Billing card on ColdEasy's side. | Technical contact | [TBC] |
| X-07 | Google Analytics 4 and Google Search Console | Admin access, or we create them and transfer ownership | Technical contact | [TBC] |
| X-08 | YouTube channel for testimonial and setup videos | Manager access, or the video links | Marketing / Content | [TBC] |
| X-09 | WhatsApp Business account | Confirm the number and who manages it (see B-07) | Product / Ops | [TBC] |
| X-10 | Admin users for the website | Name, email and role for each person who will manage orders, leads and content | Product / Ops | [TBC] |

### 14. Next steps

- ColdEasy names the owners in section 1 and shares the upload folder.
- ColdEasy makes the decisions in K1-01, K3-01, K4-01, K5-01 and K5-02. These affect design and cost, so we need them first.
- We send a change note for the partner ecosystem, dark mode and language items, with effort and cost, for your approval before we start them.
- We agree due dates for every row against the phase plan, and review this list together every [TBC: frequency].
- Anything still marked [TBC] at the content freeze date ([TBC]) is either removed from the launch site or moves to a later phase.

