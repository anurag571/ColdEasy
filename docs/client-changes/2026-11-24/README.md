# Client UI changes, 24 November 2026

ColdEasy sent eight change notes after reviewing the prototype. The screenshots in them are of the
**AI Studio prototype**, not of the Phase 1 build. This brief turns them into build rows. Mockups
and screenshots are in `reference/` (file names match the sections below).

**Read with:** `CLAUDE.md`, `docs/04-ui-ux-design-brief.md`, `docs/08-ai-guardrails.md` §D,
`docs/11-kickoff-changes.md`. Where this brief conflicts with docs 01-12 it is listed under
"Conflicts"; everything else here adds to those docs. Cite rows as `UI-xx`.

## Ground rules that override the mockups

1. **Mockups are layout, not content.** Every name, quote, rating, price, day count, percentage,
   temperature and outlet headline in `reference/` came from AI-generated or prototype material.
   Copy none of it. Text goes through `en.json`; unconfirmed facts are `[TBC: ..., row id]`.
2. **Ratings:** a rating renders only when its claim (C-01 to C-03) is approved with a source and a
   count. Until then the rating slot renders nothing in production and a placeholder on staging.
   The "(XX)" counts are gone for good.
3. **Prices and struck-through MRPs** are C-04 / 11:P-06. No confirmed price list exists, so prices
   render as placeholders. A "Save ₹…" label exists only when the MRP is proven (C-04 approved).
4. **Temperature:** the client's "8 °C to 12 °C below ambient" is a third figure next to C-05's
   "10-15 °C" and "12 °C". It is new claim **C-32**, unverified. Render through the claims mechanism,
   never as literal copy.
5. **Day labels on tomato images** are only allowed on a real, dated photo series (11:K1-02). They are
   never put on the generated clip (C-06, C-27).
6. **No new runtime dependencies for motion.** CSS transitions, `@keyframes`, `IntersectionObserver`.
   No Framer Motion, GSAP, Lottie, Swiper or carousel libraries.
7. **Motion rules for every row:** respects `prefers-reduced-motion`; hover effects only under
   `@media (hover: hover) and (pointer: fine)`; the same effect on `:focus-visible`; nothing snaps or
   bounces; easing `cubic-bezier(0.22, 1, 0.36, 1)`.
8. **Performance:** home LCP is already over budget (2.5-3.3 s vs 2.5 s, mobile). No row may make home
   or /science LCP, CLS, TBT or script size worse than the baseline measured before work starts.
   Anything with opacity 0 at load is not an LCP candidate until it becomes visible, so the LCP
   element (hero image, first product tile) must never fade in.

## Design-system rows (apply site-wide)

| Row | Change |
| --- | --- |
| UI-01 | **Fewer boxes and lines.** Cards lose borders; use one soft shadow token. Remove hairline dividers between sections and inside cards; use spacing instead. |
| UI-02 | **Universal section blend.** One utility that blends a section's background into the next over a tall, eased gradient (many stops, not a hard 2-stop fade). Remove the line above Best Sellers. Works on the light site and the dark home. Not a fade to white on the dark home (11:A5). |
| UI-03 | **One accent per section: leaf green.** Progress bars, active states, tags, icons and controls use leaf. Brand colours stay for brand elements only. Check AA contrast for every text use. |
| UI-04 | **Product tile.** One soft beige tile token for every product photo, the same size and aspect ratio for all products, a soft floor shadow under the product. Works on light and dark. No white inner box. |
| UI-05 | **Buttons.** New `outline` variant: light leaf outline, fills leaf with white text on hover/focus. "View product →" is a plain text link. Touch: pressed state only. |
| UI-06 | **Rating.** Five stars plus "x.x / 5" as plain text, stars slightly stronger, no outline box. Renders only when the claim is approved (rule 2). |
| UI-07 | **Quiet status label.** One small label style for "Out of stock" and (when allowed) "Save ₹…". Replaces the yellow and red badges. |
| UI-08 | **Sold out.** Photo stays in colour, slightly faded (opacity about 0.6-0.7, no grayscale), "Notify me" button. The card keeps the same hover so it still belongs to the row. |
| UI-09 | **Asset slots.** Images and video are produced outside the code (AI placeholders and real photography). Code reads every image from fixed slot paths in `lib/media/slots.ts` and shows a same-size placeholder while a file is missing, so dropping a file in is enough. Product images are transparent cut-outs; the beige tile, floor shadow and sold-out fade are CSS. Slots marked illustrative always show the "Illustrative" label. People, testimonials and press logos are real-only slots. |

## Home (Phase 2 rows, built now)

| Row | Section | Change |
| --- | --- | --- |
| UI-10 | Hero (T-080) `01-home-hero` | No frame or border around the product. Product image background equals the page background, so there are no edges. Feather the image edge that meets the text (CSS mask). Product larger: on `lg` and up it bleeds off the right edge; on phones it stacks under the text, full width, no bleed. Needs a cut-out photo (11:K4-03); until then use the placeholder with the mask. Keep `priority`, correct `sizes`, AVIF/WebP. |
| UI-11 | How ColdEasy Works (T-081) `03-how-it-works` | **Option B (client's alternative, chosen):** remove the step pills, step counter and the bordered caption box. Keep: caption, sub-title, "Measured temperature drop" line (C-32 placeholder), and "Cooling without electricity" with the sparkle icon, bold and always visible (not only after the video ends; C-12). Video background matches the page (wrapper colour plus edge mask until the re-render arrives). Small, see-through pause button. No footer divider. Softer or no card. |
| UI-12 | How ColdEasy Works video playback | Loops on desktop (`min-width: 1024px`, hover-capable pointer, no Save-Data). On phones it plays once, then shows the end frame and a replay button. Pauses when scrolled out of view. Reduced motion: poster plus play button, no autoplay. Loads nothing until near the viewport. One constant holds the video paths so the re-render can be swapped in. |
| UI-13 | Video asset (not code) | The current clip shows holes on a crate side the client says the real Box does not have (which side: to confirm from a photo), and has a tool watermark. Fix is a Flow re-render from new keyframes, or a real assembly video (11:H-03). The "ColdEasy Box" end title is HTML over the last frame, not part of the video. Code only needs the swap point from UI-12. |
| UI-14 | Best Sellers (T-082) `02-best-sellers` | Shared `ProductCard` using UI-01, UI-04 to UI-08. Price smaller, old price lighter, product name dominant. Works on the dark home: the beige tile is the stage; no beige box floating on dark. Which three products: 11:H-04. |
| UI-15 | Best Sellers: Buy Now | For the **ColdEasy Box only**, Buy Now goes straight to checkout with quantity 1. Every other product, including AutoBox 3 Box, goes to its product page. Behind flag `buy_now_direct`. Checkout is Phase 4, so until `/checkout` exists the link falls back to the product page. |
| UI-16 | Customer Testimonials (T-084) `05-testimonials` | Keep the heading. Big photo card on the left with the quote on the photo. Three video tiles (not five), bigger, sitting directly on the page. Remove the "Customer Reviews" row. No shadows, borders or extra boxes. No "Watch on Instagram" or "Watch on YouTube" link. Tile grows slightly on hover. Videos: YouTube no-cookie facade, loads the player only on tap; own poster images, not YouTube thumbnails. All people, quotes and videos are placeholders (C-29, 11:H-07). |
| UI-17 | Media Presence (T-085) `06-media-presence` | Cards drift slowly in a row (client asked left to right; make direction a prop). Smooth hover. Pause on hover and focus, plus a visible pause button (WCAG 2.2.2). Reduced motion: a static row that scrolls by hand with scroll-snap. Duplicated items for the loop are `aria-hidden` and not focusable. CSS animation only. Reuse the same component for the partner logo strip later (11:K3). Behind flag `media_marquee`; flag off shows the static row. Outlets, headlines, dates, links, logos: placeholders (C-28, 11:H-08). |

## Products page (Phase 3 listing, built now; product detail pages stay stubs)

| Row | Change |
| --- | --- |
| UI-20 | `04-products-page`: "Main products" grid per the mockup using `ProductCard`. Remove the share button from the card (native share stays on the product page, Phase 3). Name, description (two lines max, clamped), price, rating as plain text. Outline Buy Now, "View product →" text link. EMI line kept as a placeholder (C-17, Phase 4 B4-08). |
| UI-21 | Card hover: card rises about 6 px (0.5 s), image scales about 1.05 (0.8 s), soft shadow appears under the photo tile and the tile darkens slightly, Buy Now fills. Same on keyboard focus within the card. Off for reduced motion and touch. |
| UI-22 | Cards fade up one after another on load, very subtle (about 12 px, 60-80 ms stagger). Off for reduced motion. The first card in the viewport does not fade (rule 8); animate only cards below it, or animate transform only. |

## Science (Phase 7 rows, built now)

| Row | Change |
| --- | --- |
| UI-30 | `07-science-tomato`: a day-by-day tomato sequence that plays on its own: five frames with a timeline underneath (day markers, short stage names), cross-fading from fresh to over-ripe. Plays once when in view. Reduced motion: the five frames side by side (which is what the reference shows). First frame preloaded, the rest lazy. **Day labels, stage text and the "loses x% water" caption come only from the real photo series (11:K1-02).** Until it arrives, the page keeps the current Illustrative clip; the new component is built and shown on `/design-system` with placeholder frames. |
| UI-31 | `08-crop-freshness`: Crop Freshness Dashboard v2. Dark green stage, crop photo in a ring with three annotation call-outs, metric cards on the right (freshness days, marketability, weight loss, pH, firmness bar), crop tabs (banana, tomato, mango), and a clear, attractive toggle between "Ambient" and "In a ColdEasy Box" that cross-fades photo and values. Accessible: tabs are a `tablist`, the toggle is a two-option control with `aria-pressed` or a `radiogroup`, values announce politely. Every value comes from a typed data file with claim ids; all are placeholders until 11:S-02 (C-27 and others). Behind flag `crop_dashboard_v2`. |

## Conflicts with the specs (decided here, listed in the PR)

| # | Conflict | Decision for the build |
| --- | --- | --- |
| X-1 | The hero and blend mockups are light; kickoff made the home dark (11:K4-01, flag `dark_home`). | Build every row with semantic tokens so it works on both. Production theme stays as decided in the dark-home change note. Client to confirm. |
| X-2 | T-081 specifies step captions; the client offered Option B without steps. | Option B. Steps can return later from the same data. |
| X-3 | "Measured temperature drop 8-12 °C" vs C-05 (10-15 °C, 12 °C). | New claim C-32, placeholder until one tested figure with conditions. |
| X-4 | Day-by-day tomato labels vs PR #1's removal of the day counter (C-06, C-27). | Allowed only on the real dated photo series (UI-30). |
| X-5 | Ratings and "4.9 / 5" in the mockups vs C-01 to C-03. | Hidden until approved (rule 2). |
| X-6 | Buy Now direct to checkout skips the product page; checkout is Phase 4. | Flag `buy_now_direct`, product-page fallback (UI-15). |
| X-7 | Animated media row vs WCAG 2.2.2 and reduced motion. | Pause control, static fallback (UI-17). |
| X-8 | Transparent video background (asked as an option). | Not done: alpha video needs two encodes (WebM and HEVC) and is heavy. The re-render bakes in the page colour instead. |

## What ColdEasy still owes for these rows

| Row | Needed |
| --- | --- |
| UI-10, UI-14 | Real product photos as cut-outs (transparent PNG, at least 2000 px) or shot on one beige backdrop, same angle and light (11:K4-03, P-01). |
| UI-14, UI-20 | Which three best sellers (H-04); price list with MRP proof (P-06, PR-01, PR-02); rating source and count, or "leave ratings out" (C-01 to C-03). |
| UI-11, UI-13 | Approval of the re-render or a real assembly video (H-03); photo of the real crate side; one tested temperature figure with conditions (C-32). |
| UI-16 | One customer photo with quote, name and place; three YouTube links with name, place and caption; written consent from each person (H-07, X-08). |
| UI-17 | Per article: URL, headline, date, outlet logo (H-08). |
| UI-30 | Tomato photo series, same batch, Day 0-8, open air and in the Box (K1-02). |
| UI-31 | Dashboard data per crop and condition (S-02), crop photos per condition (K1-05). |
| All | Written sign-off on the rows marked as change requests in the change note. |
