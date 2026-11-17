# Orbis Auto reference: About, News, Feedback and footer

Sources: `https://www.orbis-auto.kz/en/about/`, `/en/news/`, `/en/contacts/` (the "Feedback" page, added on 2026-11-16 because the user asked for our contact section to follow Orbis) and the shared footer. Inspected on 2026-11-16 with Playwright and system Chrome. Every number below comes from `getComputedStyle` / `getBoundingClientRect` after scrolling the whole page. Viewports: 1440×900 and 390×844, plus 1024×900 and 768×900 to locate breakpoints. Their `/static/css/styles.css` and `/static/js/script.js` were read to confirm rules and behaviour.

Purpose: re-create the look with Sain Motors content, photos and fonts. Orbis copy and imagery are third-party: do not copy them. Their content is described here only in general terms. Reference screenshots were kept outside this public repo, in the local session scratchpad (`orbis-shots/`).

---

## 0. Sizing model (read first)

Orbis sizes everything in `rem`, and the root size follows the viewport width. There is **one** media query.

| Viewport | Root rule | 1rem equals |
|---|---|---|
| ≥ 769px (desktop rules) | `html { font-size: calc(10 / 1920 * 100vw) }` = 100vw / 192 | 1920 → 10px · **1440 → 7.5px** · 1024 → 5.333px |
| ≤ 768px (mobile rules) | `calc(10 / 320 * 100vw)` = 100vw / 32 | 320 → 10px · 375 → 11.72px · **390 → 12.1875px** · 768 → 24px |

Every value = design rem × root. Below, values read "rem → px @1440 / px @390". These stay fixed in px: 1px borders and hairlines, the footer logo (221×42), social icons (11×18 and 19×18), pagination chevrons (11×15), the breadcrumb link's 5px side margin, the 2px checkbox corner, the 10px mobile portrait radius, the 245px mobile textarea cap and the reCAPTCHA widget (304×78).

Implementation hint: to keep these proportions without changing our global `html` size, scope a unit, e.g. `--u: calc(100vw / 192)` (and `calc(100vw / 32)` at ≤768px), and write `font-size: calc(1.8 * var(--u))`. Clamp it for tablets (see §8). Orbis' pure vw scaling makes body text 9.6px at 1024px and the header 144px tall at 768px.

---

## 1. Tokens

### 1.1 Colour

| Token | Value | Used for |
|---|---|---|
| ink | `#000000` | title band, footer, body text, Vision panel, active underlines, rules on white |
| paper | `#FFFFFF` | header, page background, text on dark, active filter chip |
| panel | `#F6F6F6` | light grid panels (About values panel, fallback behind the Mission photo) |
| hairline-on-dark | `rgba(255,255,255,0.45)` | filter chip borders, the vertical rule beside the statement paragraph |
| slash | `#FFFFFF` with `opacity: .45` | footer nav separators |
| overlay | `rgba(0,0,0,0.45)` | flat 45% black over photos and video: statement section, diagram video panel, every news card |
| rule-on-white | `rgba(0,0,0,0.45)` | award column rules (desktop) |
| muted-on-dark | white at `opacity: .45`, renders `#737373` on black | breadcrumb row |
| label | `#8E8E8E` | form labels and their asterisks |
| checkbox-border | `#ADB5BD` | consent box |
| error | `#F52525` | form error text |

Sampled rendered colours worth matching:
- Statement section: top (dark sky under the overlay) ≈ `#0B0F15`, middle ≈ `#0E1319`, mountain mid-tones ≈ `#36414D`.
- News card date ≈ `#8C8C8C`: white text that sits under the 45% overlay.
- Outline slogan: light grey (a black stroke at 15% opacity).

There are no gradients except the textarea's ruled lines, no box-shadows anywhere, and `letter-spacing` is `normal` everywhere.

### 1.2 Fonts and type

**Fonts**
- Family: **Aeroport** only, self-hosted:
  - `Aeroport-Light.woff2` → weight 300
  - `Aeroport.woff` → weight 400
  - `Aeroport-Bold.woff`, registered as **weight 600**. `<strong>` (700) resolves to this face.
- No fallback stack is declared. `swiper-icons` is declared but never loads.
- Weights in use: 300 (the About group statement and the mobile Mission panel), 400 (everything else), 600 (award names only).

**Line height**
- Default is `line-height: normal`. Aeroport's normal line height measures **1.37** (137px at 100px).
- Chrome rounds it per line to: 13.5px → 18px, 14.63 → 20, 17.06 → 23, 18 → 25, 21.94 (h3) → 30, 27 → 37.
- `h1` uses 1.3. With our own font, set these explicit line heights to keep the rhythm.

**Case**
- All `h1`–`h6` are uppercase, except the title-band heading, which keeps the case it is written in. Nothing is letter-spaced.

| Role | rem desktop / mobile | @1440 | @390 | Weight | Line height | Case | Colour |
|---|---|---|---|---|---|---|---|
| Band title (h1) | 7 / 1.8 | 52.5px | 21.94px | 400 | 1.3 → 68.25 / 28.52px | as written | #fff |
| Breadcrumb row | 1.8 / 1.2 | 13.5px | 14.63px | 400 | row 19 / 21px | as written | #fff at .45 |
| Display statement (h1) | 5 / 1.8 | 37.5px | 21.94px | 400 (About group statement: **300**, and 1.6rem = 19.5px on mobile) | 1.3 → 48.75 / 28.52px | UPPER | contextual |
| Section heading (h3) | 3.6 / 1.8 | 27px | 21.94px | 400 | 37 / 30px | UPPER | contextual |
| Body, labels (`text-lg`) | 1.8 / 1.2 | 13.5px | 14.63px | 400 | 18 / 20px | as written | contextual |
| News card title | 2.4 / 1.4 | 18px | 17.06px | 400 | 25 / 23px | as written | #000 |
| News card date | 1.8 / 1.2 | 13.5px | 14.63px | 400 | 18 / 20px | as written | #fff under the overlay |
| Award name / description | 2.4 / 1.2 | 18px | 14.63px | 600 / 400 | 25 / 20px | as written | #000 |
| Filter chip | 1.8 / 1.2 | 13.5px | 14.63px | 400 | 18 / 20px | as written | #fff, or #000 when active |
| Pagination | 2 / 1 | 15px | 12.19px | 400 | normal | none | #000 |
| List counter digit | 1.4 / 1.2 | 10.5px | 14.63px | 400 | none | none | #000 |
| Footer text, all roles | 1.8 / 1.2 | 13.5px | 14.63px | 400 | 18 / 20px | as written | #fff |
| Header nav (context) | 1.8 / 1.4 | 13.5px | 17.06px | 400 | normal | as written | #000 |

### 1.3 Radii

| Token | rem | @1440 | @390 | Where |
|---|---|---|---|---|
| photo | 1.5 | 11.25px | 18.28px | news card image; About portrait and floating photos (desktop) |
| photo-small (mobile) | 1 | none | 12.19px | About mobile photo pair |
| portrait (mobile) | fixed | none | 10px | About portrait on mobile |
| pill | 4.5 | 33.75px | 54.84px | filter chips, company pills (desktop), identity chips, submit button |
| pill (mobile company pills) | 3.5 | none | 42.66px | company pills on mobile |
| circle | 50% | | | list counters, logo video |
| checkbox | fixed | 2px | 2px | consent box |

### 1.4 Spacing and layout constants

| Constant | rem | @1440 | @390 |
|---|---|---|---|
| Page gutter (side padding) | 15.1 / 2 | 113.25px | 24.375px |
| Standard section padding (`.container`) | 9 15.1 / 3.2 2 | 67.5px 113.25px | 39px 24.375px |
| Awards section padding | 12.6 14.945 / 3.2 2 | 94.5px 112.09px | 39px 24.375px |
| Content width | none | 1213.5px | 341.25px |
| Header height | none | 60px (59.94) | 73px |
| Top offset of `main` | 7 / 6 | 52.5px: the band's top 7.5px sit under the header | 73.13px: flush with the header |
| Mission panel | 50% × 80 / 100% × 39.267 | 720×600px | 390×478.56px |
| Footer padding | 11.817 14.9 11.817 14.688 / 3.5 2 4.8 | 88.63 111.75 88.63 110.16px | 42.66 24.375 58.5px |

### 1.5 Motion
- Links: `transition: .1s` (all properties), `opacity: .5` on hover.
- Breadcrumb link: underline (border) fades in `.2s`.
- About statement words: opacity .1 → 1, scrubbed by scroll (GSAP), plus `transition: opacity .3s ease-in-out` on each word.
- Back to top: 600ms animated scroll (jQuery `'slow'`, swing easing).
- The News page has no entrance animations. No image zooms anywhere.

---

## 2. Header above the band (context)

On About, News and Feedback the header is the solid **white** variant (`header.header`). It is fixed at the top, `z-index: 9999`, with no border and no shadow.
- **@1440:** 1440×60px. Padding 15.75px 110.77px 15.75px 113.25px (2.1rem 14.769rem 2.1rem 15.1rem). Flex row, `space-between`, vertically centred.
  - Left: 28.44px circular logo video plus a 162×27px wordmark, gap 7.01px. The wordmark is forced black with `filter: brightness(0)`.
  - Centre: 7 nav links, 13.5px black, gap 36.56px (4.875rem).
  - Right: language switch, 3 codes, gap 7.5px. The active code has a 1px black underline whose bottom edge sits 7.5px (1rem) below the label box.
- **@390:** 73px tall, padding 13.41px 12.19px. Logo circle 46.2px, wordmark 174×30.5px, nav hidden. A black three-line burger icon (21.2×12.2px) sits at the right.
- At 1440, `main` begins 52.5px from the top while the header is 60px tall, so the band slides 7.5px under it. At 390 the band starts exactly at the header's bottom edge.

---

## 3. Shared title band (About, News, Feedback)

A full-bleed `#000` block with white text, laid out as a centred column (`display: flex; flex-direction: column; align-items: center; text-align: center`).

| | @1440 | @390 |
|---|---|---|
| Padding | 57.75px 0 (7.7rem) | 24.375px 0 (2rem) |
| Height, no chips (About, Feedback) | **202.75px** = 57.75 + 19 + 68.25 + 57.75 | **110.45px** |
| Height with filter chips (News) | **264.75px** (adds a 22.5px gap and the 39.5px chip row) | **181.2px** (adds 36.56 + 34.19) |
| Breadcrumb row | 13.5px, 19px row, opacity .45 on the whole row, flex-centred | 14.63px, 21px row, opacity .45, margin-bottom 12.19px |
| Title | 52.5px/68.25px, 400, case as written, directly under the crumbs with no gap | 21.94px/28.52px |

**Breadcrumb**
- The root link is underlined with a **1px solid `border-bottom` in currentColor**, not `text-decoration`. It has `margin: 0 5px` and `transition: .2s`. A slash follows it.
- Two variants exist:
  - About and Feedback: the slash is a text node right after the link (" /").
  - News: the slash is a `span` with `margin: 0 2rem` (15px @1440, 24.375px @390). Use this one.
- Hover: the underline fades to transparent and the link drops to `opacity: .5`, on top of the row's .45.

---

## 4. About page

Page anatomy (document y, px):

| Section | @1440 | @390 |
|---|---|---|
| Title band | 52.5 – 255.25 (202.75) | 73.13 – 183.58 (110.45) |
| 4.1 Statement and group | 255.25 – 1121.67 (866.42) | 183.58 – 1136.28 (952.70) |
| 4.2 Corporate philosophy | 1121.67 – 1740.17 (618.50) | 1136.28 – 1673.09 (536.81) |
| 4.3 Mission grid | 1740.17 – 2940.17 (1200) | 1673.09 – 3499.72 (1826.63) |
| 4.4 Awards | 2940.17 – 3925.02 (984.84) | 3499.72 – 5008.09 (1508.38) |
| Footer | 3925.02 – 4241.27 (316.25) | 5008.09 – 5393.31 (385.22) |

### 4.1 Statement and group section (dark, with the mountain)

Content: an uppercase statement about the group, a short paragraph beside a thin vertical rule, a small portrait photo, the group wordmark and a grid of the group's company logos in pills.

**Desktop (1440)**
- **Section:** full-bleed, 1440×866.42px, height set by its content, `padding-bottom: 129px` (17.2rem). Text is white.
- **Background:** a large monochrome mountain photo (`object-fit: cover`, fills the section, source ≈3840×2290). It sits **under** the section's own `rgba(0,0,0,.45)` background: the image wrapper is `position: absolute; inset: 0; z-index: -1`, so the translucent section background paints over it. Result: a near-black navy top (`#0B0F15`) fading into a grey snow peak in the lower half. No CSS filter is applied.
- **Inner container:** `max-width: calc(100% - 50.4rem)` = 1062px, centred (189px margins), padding 89.25px 129px 0 (11.9rem 17.2rem 0). This gives a **text measure of 804px** (x 318–1122).
- **Statement:** uppercase 37.5px/48.75px, **weight 300**, centred, white. 4 lines at 1440 (195px tall), top at y 344.5.
- **Paragraph with a vertical rule:** 25.5px (3.4rem) below the statement.
  - 386.25px wide (max 51.5rem), pushed to the right end of the 804px measure with `margin-left: auto` (x 735.75–1122).
  - `border-left: 1px solid rgba(255,255,255,.45)`, padding-left 22.5px (3rem).
  - 13.5px/18px, left-aligned, 4 lines.
- **Small portrait photo:**
  - `position: absolute; top: 103.5px (13.8rem); right: 111.75px (14.9rem)` within the section.
  - 153.75×178.5px (20.5×23.8rem, portrait ratio 0.86:1), radius 11.25px.
  - Uses `object-fit: scale-down` on an image of matching ratio, so it effectively covers the box.
  - It sits right of the statement, outside the 1062px container, aligned to the right page gutter (x 1174.5–1328.25). Its top is 14px below the top of the statement's first line.
- **Group wordmark:** white SVG, 600×87px (80×11.6rem), centred, 77.17px (10.289rem) below the container (y 714–801). It overlaps the mountain peak.
- **Company pill grid (desktop variant):**
  - `margin-top: 43.95px` (5.86rem). The visible gap is about 46px because the wordmark is an inline image.
  - 1014px wide (`calc(100% - 56.8rem)`), centred.
  - **2 rows × 6 pills.** Rows use `justify-content: space-between` (about 21px between pills). Row gap 21.59px (2.879rem).
  - Each pill: 151.5×62px, padding 14.25px 25.5px (1.9rem 3.4rem), radius 33.75px, **no border**, transparent background. It holds a centred white single-colour logo, max 100.5×42.75px (13.4×5.7rem).
  - **The first pill (the current company) is filled `#FFF` with a dark logo.**
  - Reveal: pills start at `opacity: 0` with `blur(10px)` and resolve in random order. This is scrubbed by scroll from the section top reaching the viewport top until 20% of the section has passed.

**Mobile (390)**
- **Section:** a flex column (`align-items: flex-start`), 952.7px tall, `padding-bottom: 67.03px` (5.5rem). Same photo and 45% overlay.
- **Container:** padding 39px 24.375px, giving a 341.25px measure.
- **Statement:** 19.5px/25.35px, weight 300, centred, 5 lines.
- **Paragraph:** full width (341.25px), 41.44px (3.4rem) below the statement. Rule `1px rgba(255,255,255,.45)`, padding-left 24.375px, 14.63px/20px, 5 lines.
- **Wordmark:** block, full content width (341.25×50.27px), margin 36.56px auto 12.19px.
- **Portrait:** in the normal flow, right-aligned (margin 48.75px 24.375px 48.75px auto). It becomes a **121.61×99.25px landscape crop** (9.979×8.144rem) with `object-fit: cover`, `object-position: top` and a 10px radius.
- **Pills:** `flex-wrap`, centred, gap 24.375px, padding 0 24.375px. That gives **3 per row** (4 rows).
  - Pill height 42.66px (3.5rem), logo max-width 97.5px (8rem).
  - Only the first, white pill has padding (9.75px 11.33px) and a 42.66px radius.

### 4.2 Corporate philosophy section (white)

Content: a full-width outline slogan, an uppercase eyebrow, an uppercase 3-line philosophy statement that fills in word by word, a paragraph beside a rule, and three car photos.

**Desktop (1440)**
- **Section:** white, `padding-top: 60px` (8rem), 618.5px tall.
- **Outline slogan band:** a full-bleed SVG at 100% width (1440×65.25px, artwork 1920×87).
  - It shows oversized display capitals as outlines only: a black stroke of 10 units clipped to the inside of the letters, with group opacity 0.15, so the outline reads light grey.
  - It starts 60px below the section top.
- **Container:** padding 39px 113.25px 67.5px (5.2rem 15.1rem 9rem).
- **Text block:** side padding 202.5px (27rem), giving an **808.5px measure**. Centred, uppercase, `margin-bottom: 75px` (10rem).
  - **Eyebrow label:** 13.5px uppercase, black, centred, `margin-bottom: 15px` (2rem).
  - **Statement:** 37.5px/48.75px, 400, uppercase, centred, black, 3 lines.
    - Each word is a span that starts at **opacity .1**. The words fill to 1 one at a time as you scroll (scrub 1).
    - The fill begins when the statement's top is 100px below the bottom of the viewport. It ends when the statement's top reaches 20% of the viewport height.
  - **Paragraph with a rule:** a right-aligned block (`margin-left: auto`, x 738–1124.25), 386.25px wide, 40.5px (5.4rem) below the statement.
    - `border-left: 1px solid #000`, padding-left 22.5px.
    - 13.5px/18px, left-aligned, sentence case, 5 lines.
- **Three floating photos:** `position: absolute`, `object-fit: cover`, radius 11.25px, each **202.5×127.5px** (27×17rem, 1.59:1).
  1. Flush to the **left viewport edge** (`left: 0`), `top: 211.5px` (28.2rem) from the section top. It sits beside the statement's first line.
  2. `left: 418.5px` (55.8rem), `bottom: 127.5px` (17rem). It sits below the statement, left of the paragraph.
  3. Flush to the **right viewport edge** (`right: 0`), `top: 211.5px`.

**Mobile (390)**
- **Section:** `padding-top: 24.375px`, flex column, 536.81px tall. The slogan image is 390×17.67px.
- **Container:** padding 0 24.375px 39px.
- **Eyebrow:** 14.63px, `margin-bottom: 9.75px` (0.8rem).
- **Statement:** 21.94px/28.52px, uppercase, centred, 4 lines. The text block has `margin-bottom: 24.375px`.
- **Paragraph:** full width, rule `1px #000`, padding-left 23.16px (1.9rem), margin 26.81px 0 20.72px (2.2rem 0 1.7rem), 14.63px/20px.
- **Photos:** the floating photos are replaced by an in-flow **2-column grid** holding the first two photos.
  - Columns 168.27px, gap 4.73px (0.388rem), padding 0 24.375px, `margin-bottom: 48.75px` (4rem).
  - Images are 92.02px tall (7.55rem), `object-fit: cover`, radius 12.19px (1rem).

### 4.3 Mission, Vision, diagram and values grid

**Desktop (1440)**
- **Grid:** CSS grid, 2×2, no gaps. Each panel is **720×600px** (50% × 80rem).
- **Panel padding:** 69.75px 112.5px (9.3rem 15rem), leaving 495px for content. Panels are `display: flex; flex-direction: column`.
- **Text group:** a column with a 20.25px gap (2.7rem): an h3 (27px/37px, uppercase, 400) and a paragraph (13.5px/18px, 4 lines).
- The four panels:
  1. **Top-left, Mission:** a full-bleed photo (`cover`) with no overlay. White text group **anchored to the bottom** (`justify-content: flex-end`); the text top is 401px into the panel. Fallback background `#F6F6F6`.
  2. **Top-right, Vision:** solid `#000`.
     - At the top: a product image at 100% width (495px), `contain`. It is a 600×316 animated GIF shown at 495×260.7px, 69.75px from the panel top.
     - At the bottom: the white text group (`justify-content: space-between`).
  3. **Bottom-left:** an autoplaying, muted, looping background video (`cover`) under `rgba(0,0,0,.45)`.
     - Centred on it: a white line-art diagram (SVG 495×375px). It shows two overlapping outline circles at 25% white, a lens shape at 45% white where they intersect, a small logo above and two short labels.
     - This panel has no text group.
  4. **Bottom-right, values:** `#F6F6F6` background, black text, vertically centred. Order: h3; an ordered list of 5 values; a second h3 (2 lines) 20.25px below; a paragraph.
     - List items: 13.5px, flex, `align-items: flex-start`, `margin-bottom: 15px` (2rem).
     - Counter badge (`li::before`, CSS counter): an 18.75px circle (2.5rem), `1px solid #000`, the digit 10.5px and centred, `margin-right: 14.25px` (1.9rem).

**Mobile (390)**
- **Grid:** a single column. Panel heights are **478.56 / 478.56 / 333.38 / 536.13px**.
- **Panel padding:** 39px 24.375px 31.69px (3.2rem 2rem 2.6rem), `min-height: 390px`.
- **Type:** h3 21.94px/30px, paragraph 14.63px/20px, text gap 12.19px. Panel 1's text is **weight 300**.
- Panel 2's image is 341.25×179.72px.
- Panel 3 is 333.38px tall (27.355rem); its diagram is 341.25×262.69px.
- Panel 4: padding 63.38px 24.375px (5.2rem 2rem), top-aligned.
  - Badges are 30.47px circles (2.5rem) with 14.63px digits and a 23.16px right margin.
  - Items are vertically centred, `margin-bottom: 12.19px`.

### 4.4 Awards

Content: a one-word uppercase heading and two short sentences on the left, and six award cards (index, award image, bold award name, description or a bullet list) on the right.

**Desktop (1440)**
- **Section:** white, padding 94.5px 112.09px (12.6rem 14.945rem), flex row, `align-items: flex-start`.
- **Left intro:** 337.5px wide (max 45rem), `margin-right: 102px` (13.6rem).
  - A heading at 37.5px/48.75px, uppercase.
  - Two 13.5px paragraphs separated by a 10px line break.
- **Right:** a grid of **3 equal columns (238.78px)**, column gap 30px (4rem), row gap 37.5px (5rem). 6 cards in 2 rows; each row is as tall as its tallest card.
- **Card:** `border-left: 1px solid rgba(0,0,0,.45)`, `padding-left: 27.75px` (3.7rem). Column flex, `align-items: flex-start`. Contents in order:
  1. Index label (for example "001"), 13.5px.
  2. Award image at a **fixed height of 112.5px** (`min-height: 15rem`), auto width, `contain`. Margin 28.5px top and 35.18px bottom (3.8rem / 4.69rem).
  3. Award name in bold 18px (the 600 face), `margin-bottom: 7.5px`.
  4. Description at 18px/25px, regular. Some cards have a bullet list instead: 18px, `li` padding-left 15px, a "•" absolutely positioned at left 0, `li` `margin-bottom: 7.5px`.

**Mobile (390)**
- **Section:** padding 39px 24.375px. Column flex, gap 24.375px.
- **Intro:** heading 21.94px/28.52px with a 12.19px margin below; paragraphs 14.63px/20px.
- **Cards:** the desktop grid is hidden. A mobile list (a column with a 48.75px gap, 4rem) shows each award as a row with `align-items: center`:
  - The image: max 94.6×134px (7.762×11rem), `contain`, `margin-right: 26.81px`.
  - A text column with a **`1px solid #000`** left rule, `padding-left: 30.47px` (2.5rem), gap 14.41px (1.182rem). It holds the index, the bold name and the description, all at 14.63px; the description has `max-width: 136.24px`.

### 4.5 Image slots (for preparing our own photos)

| Slot | Desktop box | Mobile box | Fit |
|---|---|---|---|
| Statement background | full-bleed 1440×866 (1.66:1) | 390×953 (0.41:1) | `cover`. Needs dark sky at the top and the subject low and centred, under a 45% black overlay |
| Portrait | 153.75×178.5 (0.86:1) | 121.6×99.3 (1.23:1), anchored to the top | `cover` |
| Floating photos | 202.5×127.5 (1.59:1) ×3 | 168.3×92 (1.83:1) ×2 | `cover` |
| Mission photo | 720×600 (1.2:1) | 390×479 (0.82:1) | `cover`. Keep the lower area calm for white text |
| Vision image | 495×261 (1.9:1) on black | 341×180 | `contain` |
| Diagram panel video | 720×600 | 390×333 | `cover` under a 45% overlay, with a centred line-art SVG |
| Award images | 112.5px tall, any width | max 94.6×134 | `contain`. Line art on white |
| Company logos | max 100.5×42.75 in a 151.5×62 pill | max 97.5 wide, 42.66 tall | white single-colour; the first one dark on a white pill |

---

## 5. News page

Page anatomy:
- **@1440:** band 52.5–317.25; card section 317.25–1244.25 (padding 67.5 + two rows totalling 792 + 67.5); pagination 1244.25–1280.25, then a 52.5px margin; footer 1332.75–1649.
- **@390:** band 73.13–254.33; card section 254.33–2481.08; pagination 2481.08–2510.27, then an 85.31px margin; footer 2595.58–2980.8.

### 5.1 Filter chips (inside the title band)

| | @1440 | @390 |
|---|---|---|
| Row | centred, `margin-top: 22.5px` (3rem), gap 22.5px (3rem), 697.4px wide | full width, left-aligned, padding 0 24.375px, gap 12.19px, `margin-top: 36.56px` |
| Overflow | none | **horizontal scroll** with a hidden scrollbar (`overflow-x: scroll; scrollbar-width: none`; content 669px wide in a 390px row). Chips never shrink |
| Chip | 13.5px, padding 9px 22.5px 10.5px (1.2rem 3rem 1.4rem), **39.5px tall**, radius 33.75px | 14.63px, padding 6.09px 12.19px (0.5rem 1rem), **34.19px tall**, radius 54.84px |
| Inactive | transparent, `1px solid rgba(255,255,255,.45)`, white text | same |
| Active | `#FFF` background and border, black text | same |

There are 4 chips: all, news, media coverage, CSR. Chips have no hover style and no transition; they are anchors without an `href`, with `cursor: pointer`.

### 5.2 Grid
- **Section:** padding 67.5px 113.25px (9rem 15.1rem).
- **Desktop:** 3 equal columns of 404px, `column-gap: 0.75px` (0.1rem), `row-gap: 60px` (8rem).
  - Each image box is 402px wide (2px narrower than its column, left-aligned), so neighbouring images are only **2.75px apart**.
  - A row is 255px of image plus the tallest title: 86px for 2 lines, 111px for 3. That makes a 366px row.
- **1024:** still 3 columns (287.3px). Every value is scaled by 0.711.
- **≤768:** 1 column at full content width (341.25px @390), `row-gap: 24.375px` (2rem). Section padding 39px 24.375px.

### 5.3 Card
- **Image link:** **402×255px** @1440 (53.6×34rem, 1.576:1); at 390 it is full width × 243.75px (20rem, 1.40:1).
  - Radius 11.25px / 18.28px. The image uses `object-fit: cover` (sources are about 625×417).
  - Over the whole image sits a `::before` overlay of `rgba(0,0,0,.45)` with the same radius (`z-index: 1`). The overlay is flat: **no gradient**.
- **Date:** `position: absolute`, left 22.5px (3rem), bottom 18.75px (2.5rem). 13.5px/18px, weight 400, white.
  - It is painted **underneath** the overlay, so it reads as grey `#8C8C8C`.
  - Format "DD Month YYYY"; the year is dropped for the current year.
  - @390: 14.63px, left 12.19px, bottom 18.28px (1.5rem).
- A category chip exists in the image markup but is hidden (`display: none`).
- **Title:** below the image. 18px/25px, weight 400, black, padding 18px 15px (2.4rem 2rem), so the first line starts 18px under the image and 15px in from its left edge.
  - Wraps freely over 2–3 lines; no line clamp.
  - @390: 17.06px/23px, padding 18.28px 12.19px.
- There is no excerpt, no read-more link and no visible category label.

To replicate the date contrast without the z-order trick, place the date above the overlay with `color: rgba(255,255,255,.55)`. Better for readability: white above the overlay.

### 5.4 Pagination
- A centred flex row below the grid, outside the tab panels. Gap 15px (2rem), font 15px (2rem), `margin-bottom: 52.5px` (7rem).
- **Items:** previous chevron, page numbers, next chevron.
  - Each link has padding 7.5px 15px (1rem 2rem) and black text. Number boxes are about 36–39px wide and 36px tall.
- **Active page:** a 1px black underline (`::after`) spans the full link box width at the bottom edge of the 36px box, 7.5px below the text line.
- **Chevrons:** inline SVGs, 11×15px, `fill: currentColor`, fixed size, in 41×30px link boxes. On the first and last page the disabled arrow gets a class but **no visual change**.
- **@390:** 12.19px font, link padding 6.09px, gap 24.375px, `margin-bottom: 85.31px`.

---

## 6. Contact / Feedback page

Added on 2026-11-16 at the user's request ("build our contact section like Orbis'"). Their accompanying screenshot was not available during inspection, so this section documents Orbis' "Feedback" page (`/en/contacts/`), which is the page their header and footer link to as contact.

Page anatomy:
- **@1440:** band without chips 52.5–255.25; form section 255.25–826.25 (571px); footer 826.25–1142.5.
- **@390:** band 73.13–183.58; form section 183.58–1429.11; footer ends at 1814.

Content: an uppercase 3-line invitation heading with a short paragraph; a segmented "who are you" choice of 3 options; Name and Phone (required); a dealer select; a comments box; a captcha; a consent checkbox; a submit button.

**Desktop (1440)**
- **Section:** white, padding 67.5px 113.25px, holding a flex row.
- **Left intro column:** 307.5px wide (max 41rem), `margin-right: 103.5px` (13.8rem). Column flex, gap 30px (4rem).
  - Uppercase heading at 27px/37px, 3 lines.
  - Paragraph at 13.5px/18px with one blank line inside.
- **Form:** pushed right with `margin-left: auto`, 802.5px wide. It is a **CSS grid of 2 columns × 367.88px, `column-gap: 66.75px` (8.9rem), `row-gap: 30px` (4rem)**.
  - **Row 1, spanning both columns:** the segmented identity choice. Three radio "chips" with **no gap** between them.
    - Selected: a black pill (`#000` background, white 13.5px text, padding 7.5px 15px, radius 33.75px, 39.5px tall).
    - Unselected: plain black text, padding 9px 22.5px 10.5px. Their 45%-white border is invisible on white.
  - **Left column:** Name\*, Phone\*, Dealer (a select), the consent checkbox.
  - **Right column:** Comments (spanning rows 2–4) with the reCAPTCHA under it, then the submit button, level with the checkbox.
- **Field row:** `min-height: 41.25px` (5.5rem), `margin-bottom: 7.5px`.
  - Label above the field: 13.5px `#8E8E8E`; the asterisk uses the same colour.
  - Input: 13.5px black, no box, only `border-bottom: 1px solid #000`, `padding-bottom: 10.09px` (1.345rem), about 29px tall, full column width.
  - Focus: no outline and no visual change.
- **Select:** the same underline treatment, with the browser's native chevron at the right.
- **Comments, a "ruled paper" textarea:**
  - `background: repeating-linear-gradient(to bottom, transparent, transparent 4.7rem, #000 4.8rem)`, sized `100% 4.8rem`.
  - `line-height: 4.8rem` (36px @1440). Height 165px (max 22rem), which shows 4 ruled lines.
  - The lines render grey because each is a sub-pixel band of black.
  - No border, `resize: none`, `margin-bottom: 15px`.
- **Consent:** the native checkbox is hidden.
  - A `label::before` draws the box: a 19.5px square (2.6rem), `1px solid #ADB5BD`, radius 2px, `margin-right: 15px` (2rem).
  - When checked: a `#000` fill with a white tick. The text is 13.5px over 2 lines.
- **Submit:** a black pill, 200×41.5px, padding 11.25px 42.96px (1.5rem 5.728rem), radius 33.75px, white 13.5px label.
  - Orbis' `<button>` does not inherit the font, so it renders in Arial. Use our own font.
  - It keeps the browser's default 2px outset border, which is invisible on black. There is no hover state.
- **Errors:** `#F52525` at 1rem, which is 7.5px @1440 (too small; use at least 12px).

**Mobile (390)**
- **Order:** a single column: intro, chips, Name, Phone, Comments (with the captcha), Dealer, consent, submit.
- **Section:** padding 39px 24.375px.
- **Intro:** heading 21.94px/30px; paragraph 14.63px/20px; gap 24.375px; `margin-bottom: 39px`.
- **Form:** flex column, gap 24.375px.
- **Chips:** 14.63px. Selected padding 12.19px 24.375px; the others 6.09px 12.19px.
  - At 390 the chip labels wrap onto 2 lines, making the chips 66px tall. In our build, use `white-space: nowrap`.
- **Labels:** 13.41px with a 9.75px gap below.
- **Inputs:** 14.63px, `padding-bottom: 8.53px`.
- **Textarea:** up to 245px tall, with a ruled line every 36.56px (3rem).
- **Checkbox:** 19.5px.
- **Submit:** full width (341.25×58.56px), 15.84px, padding 18.28px 24.375px, radius 54.84px.

---

## 7. Footer (the same on all three pages)

**Desktop (1440)**
- **Footer:** `#000`, white text at 13.5px/18px, weight 400. Padding **88.63px 111.75px 88.63px 110.16px** (11.817 / 14.9 / 11.817 / 14.688rem). 316.25px tall, flex row. No top border and no dividers.
- **Column 1** (max-width 405px, 54rem):
  - Logo: a white SVG at a fixed **221×42px**; it does not scale.
  - The logo's link block has `margin-bottom: 21px` (2.8rem) and is 46px tall, because the image is inline. So the description starts 67px below the top of the logo.
  - Description: a company blurb at 13.5px/18px, 4 lines, about a 400px measure.
- **Column 2:** `margin-left: auto; min-width: 50%`, which makes it 609px wide, starting at x 719.2.
  - **Nav row:** its top aligns with the top of the logo. Flex, gap 20.25px (2.7rem). Each item has `padding-right: 37.5px` (5rem) and `position: relative`.
  - **The slash separators are CSS pseudo-elements, not text glyphs:**
    ```css
    .footer .nav__link::before {
      content: ""; position: absolute; top: 0; right: 0;
      width: 1px; height: 100%;            /* 18px */
      background: #fff; opacity: .45;
      transform: skew(-45deg); transform-origin: top left;
    }
    ```
    Each draws a 1px line at 45°, shaped like "/". Its top sits at the item's right edge and its foot 18px further left. There is one after **every** item, including the last.
  - Slash spacing: about 19.5px from the text to the slash's foot, 37.5px from the text to the slash's top, and 20.25px from the slash's top to the next link.
  - **Bottom row:** `margin-top: 72px` (9.6rem). Flex, `justify-content: space-between`, `align-items: center`, 609px wide. It holds three items:
    - Social icons: flex, gap 24.17px (3.223rem). White SVG icons at fixed sizes: Facebook 11×18px and Instagram 19×18px, in 22px-tall links.
    - Copyright: "YYYY © domain", 13.5px, starting at about x 935.
    - Back to top: a label plus an up-chevron. The chevron is an `::after` showing a 14×9 white SVG at 10.13×5.97px (1.352×0.796rem), with a 7.5px gap (1rem). The control is right-aligned at the column end (x 1263–1328). Clicking it scrolls to the top in a 600ms animation.

**Mobile (≤768, measured at 390)**
- **Footer:** flex column, **centred text**. Padding 42.66px 24.375px 58.5px (3.5 / 2 / 4.8rem). Text 14.63px/20px. 385.22px tall.
- **Logo:** centred, still 221×42px, with a 34.13px (2.8rem) margin below.
- **Description:** centred, 4 lines.
- **Nav links are hidden.**
- **Bottom row:** stacked in a column with a 12.19px gap and `margin-top: 36.56px` (3rem). Order: social icons (gap 39.28px), copyright, then back to top (chevron 16.47×9.69px, 12.19px gap).

---

## 8. Responsive behaviour

| | 390 (mobile rules) | Tablet | 1440 (desktop rules) |
|---|---|---|---|
| Rules | ≤768px | **No dedicated tablet layout.** 769–1439px is the desktop layout scaled down; 391–768px is the mobile layout scaled up | ≥769px |
| Root | 12.1875px | 768: 24px (mobile ×1.97) · 1024: 5.333px (desktop ×0.711) | 7.5px |
| Header | 73px, burger | 768: 144px tall · 1024: 42.6px | 60px |
| Title band | 110.45px / 181.2px with chips | 768: 216px · 1024: 144.6px | 202.75px / 264.75px |
| Body text | 14.63px | 768: 28.8px · 1024: 9.6px | 13.5px |
| About statement | 19.5px, 5 lines | 1024: 26.7px | 37.5px, 4 lines |
| About company pills | wrap, 3 per row | 1024: 2 × 6 | 2 × 6 |
| About philosophy photos | 2-photo strip | 1024: 3 floating | 3 floating |
| Mission grid | 1 column | 1024: 2×2 (512×426.7) | 2×2 (720×600) |
| Awards | image-plus-text rows | 1024: 3 columns (169.8px) | 3 columns |
| News grid | 1 column, 243.75px images | 768: 1 column (672×480 images) · 1024: 3 columns (285.9×181.3) | 3 columns, 402×255 |
| Filter chips | scrolling row | 768: scrolling row (1311px of chips in 768) · 1024: centred row | centred row |
| Feedback form | stacked | 1024: 2-column grid | 2-column grid |
| Footer | stacked, centred, no nav | 768: stacked (703px tall) | 2 columns |

Recommendation for our build: use the 1440 and 390 values as anchors and clamp between them. For example, body text `clamp(13.5px, …, 15px)` and the band title `clamp(28px, 3.65vw, 52.5px)`. Between about 640 and 1024px, give the News grid 2 columns. Orbis' pure vw scaling looks visibly broken on tablets.

---

## 9. Interactions

**Hover**
- **Links:** every `<a href>` gets `opacity: .5` with `transition: .1s`. This covers the header nav, the breadcrumb, card titles, pagination, footer nav and social icons.
- **Exceptions:**
  - News image link: `opacity: .9`, with the same 0.1s timing (its 0.3s rule is overridden).
  - Filter chips: no hover.
  - Back to top: no hover.
- Nothing gains an underline on hover, and no image zooms or scales.
- **Breadcrumb link:** its underline (the border) fades to transparent over .2s.

**News filter (client-side tabs)**
- The server renders 4 panels into the HTML:
  - `#all_news`: the 6 cards of the current page.
  - One panel per category with the full list: 25, 8 and 7 cards.
- Clicking a chip runs a jQuery handler. It removes `.active` from every chip and every panel, then adds it to the clicked chip and to the panel whose id matches the chip's `data-target`. CSS shows only `.container.active`.
- **No URL change, no reload, no scrolling and no animation:** the swap is instant.
- Category panels are long, unpaginated grids. The global pagination stays visible under them but always pages through "all".

**Pagination**
- Plain links to `?page=N`, so each click is a full page reload. 6 cards per page, 4 pages; the last page has 2 cards.
- After the reload the tab resets to "all".
- "Previous" on page 1 links to `?page=0`, and "next" on the last page to `?page=5`. Neither looks disabled.

**Media-coverage cards** mostly link straight to external articles, opening in the same tab; a few open internal pages.

**About scroll effects** (GSAP ScrollTrigger, scrubbed)
- Statement words fade from .1 to 1 in sequence.
- Company pills clear their blur (10px → 0) and fade in, in random order, over the first 20% of the section.
- Nothing else animates; the Mission video and the Vision GIF loop continuously.

**Back to top:** clicking runs `$('html,body').animate({scrollTop: 0}, 'slow')`, a 600ms swing. Measured: from 749px to 0 in about 600ms.

**Feedback form:** the identity chips are radio inputs, styled through `.chip:has(input:checked)`. No transitions; fields have no focus styling. The form was not submitted during inspection.

---

## 10. Orbis quirks not to copy, and what was not measured

**Quirks**
- The English pages show the footer description and the back-to-top label in Russian.
- The About breadcrumb link has an empty `href`.
- Pagination still shows under the category tabs, and its disabled arrows have no styling.
- Filter chips are `<a>` elements without an `href`, so they are not keyboard-accessible.
- The submit button falls back to Arial.
- Error text is 7.5px.
- The news date sits under the dark overlay, which gives low contrast.
- Sizes are extreme on tablets (see §8).

**Not measured**
- Submit, validation and success states: no form was submitted and nothing was logged into.
- The inside of the reCAPTCHA widget.
- The open state of the mobile burger menu (out of scope).
- Intermediate frames of the scroll-scrubbed animations; only their start and end states were captured.
- The frames of the looping video and GIF (third-party content).
