# Orbis-style Inner Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every inner page the Orbis arrival: a black title band with a breadcrumb and a centred title. Rebuild About and News to Orbis' layouts using our content, make the footer black like Orbis', and restyle Contact to match.

**Architecture:**
- A single `PageBand` server component and a new `orbis-pages.css` (loaded globally after `site-header.css`) carry the shared tokens.
- About and News are rewritten on top of those pieces. The News filter is a small client component that toggles one `data-filter` attribute.
- The footer is a rewritten `SiteFooter` with a `BackToTop` client button.
- No new dependencies.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, CSS; vitest for unit tests; node:test + playwright-core e2e through `scripts/browser-check.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-16-orbis-pages-design.md` (decisions D1–D11 and the About mapping). The visual values come from `docs/design/orbis-pages/DESIGN.md`.

## Global Constraints

- Use only our own copy, photos and logos. Keep every `data-status` and `draftAttr()` marking on draft or sourced content. Never invent copy.
- Exactly one `h1` per page, and it lives in `.page-band` (check-export.mjs:42).
- The site header stays white on inner pages. The band, the About statement section and the footer are `#000` with white text.
- Values, with `clamp()` between the 390px and 1440px anchors:
  - band padding `clamp(24px, 4.01vw, 57.75px) 0`
  - band title `400 clamp(28px, 3.65vw, 52.5px)/1.3`
  - crumbs `14px` at `opacity:.45`
  - chips `39.5px` tall, `1px solid rgba(255,255,255,.45)`, radius `999px`; the active chip is white with black text
  - overlay `rgba(0,0,0,.45)`, photo radius `12px`
  - page gutter `clamp(24px, 7.86vw, 113.25px)`
- Breakpoint: one layout switch at `768px`. The News grid has 3 columns at 1024px and up, 2 between 640 and 1023px, and 1 below 640px.
- `prefers-reduced-motion: reduce` disables the word fill and gives an instant back-to-top.
- CI must stay green: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run check:export`, `node scripts/browser-check.mjs`. On OneDrive, run `rm -rf .next/server .next/static .next/types .next/diagnostics .next/trace*` before building.

## Review Focus

1. **Mongolian titles and uppercase statements are much longer than English.** They must wrap at 360px with no horizontal scroll. The test is in Task 1: the e2e check loops mn and en at 360px.
2. **MTD8 has no film or image.** Its card must keep the same media box size and still show its date. The test is in Task 4 (equal media heights).
3. **Keyboard users must be able to use the controls.** News chips and back to top must be real buttons. The test is in Task 4 (Enter on a chip filters) and Task 2 (Enter on back to top scrolls).
4. **With reduced motion, the statement words are fully opaque and back to top is instant.** The test is in Task 3 (word opacity is 1) and Task 2 (scrollY is 0 within 100ms).
5. **Draft About copy is still flagged** (`data-status="draft"`). The test is in Task 3.

---

### Task 1: PageBand on every inner page

**Files:**
- Create: `src/components/PageBand.tsx`, `src/app/orbis-pages.css`, `tests/e2e/orbis-pages.test.mjs`
- Modify: `src/app/[lang]/layout.tsx` (import `../orbis-pages.css` after `site-header.css`); `src/content/ui.ts` (`homeCrumb`)
- Modify the pages, replacing the hero and deleting `SiteInvitation`: `src/app/[lang]/about/page.tsx`, `news/page.tsx`, `news/[slug]/page.tsx`, `services/page.tsx` (move `nav.service-jump` inside the band as chips), `brands/page.tsx`, `contact/page.tsx` (replace `.contact-hero`), `privacy/page.tsx` (replace `PageHero`), `src/components/BrandDetail.tsx` (replace `.brand-title`; pass `className="brand-title"`, with the brand actions as children)
- Modify tests: `tests/e2e/site-design.test.mjs:14-24`, `tests/e2e/services-hero.test.mjs:17`

**Interfaces:**
- Produces:
  - `PageBand({ locale, title, crumbs = [], children, className, id = "page-title" }: { locale: Locale; title: string; crumbs?: { href: string; label: string }[]; children?: ReactNode; className?: string; id?: string })`
  - It renders `section.page-band[aria-labelledby=id]` containing:
    - `nav.page-band__crumbs[aria-label=ui.breadcrumb]`: the home link `ui.homeCrumb` → `pageHref(locale,"home")`, then each crumb; every link is followed by `span.page-band__slash` "/"
    - `h1#id.page-band__title`
    - `div.page-band__extra` when children are given
  - CSS classes for later tasks: `.page-band`, `.page-band__extra`, `.ob-chip`, `.ob-chip[aria-pressed=true]`, `.ob-section`, `.ob-ruled`, `.ob-photo`.

- [ ] **Step 1: Write `tests/e2e/orbis-pages.test.mjs` (failing)**

```js
const ROUTES = ["about","news","services","brands","contact","privacy","news/mega-test-drive-7","brands/byd"];
test("every inner page arrives through the black Orbis title band", async () => {
  for (const locale of ["mn","en"]) for (const route of ROUTES) {
    await page.goto(`${base}/${locale}/${route}/`);
    assert.equal(await page.locator("h1").count(), 1, route);
    assert.equal(await page.locator(".page-band h1").count(), 1, route);
    assert.equal(await page.locator(`.page-band__crumbs a[href='/${locale}/']`).count(), 1, route);
    assert.equal(await page.locator(".page-band").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(0, 0, 0)");
    assert.equal(await page.locator(".site-header").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
  }
});
test("long Mongolian titles wrap at 360px without sideways scroll", async () => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const locale of ["mn","en"]) for (const route of ROUTES) {
    await page.goto(`${base}/${locale}/${route}/`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}/${route}`);
  }
});
```
Use the same browser bootstrap as `site-design.test.mjs:1-10`.

- [ ] **Step 2: Build and run it to see it fail**

Run: `npm run build && node scripts/browser-check.mjs`
Expected: `orbis-pages` fails, because `.page-band` is missing.

- [ ] **Step 3: Implement `PageBand`, `orbis-pages.css` and the page swaps listed under Files**

- Add `ui.homeCrumb = { mn: "Нүүр хуудас", en: "Home page" }`.
- Breadcrumbs:
  - Brand detail: Brands → `/l/brands/`.
  - News detail: News → `/l/news/`.
  - Every other page has only the home crumb.
- The services chips are the existing `service-jump` links with the class `ob-chip`.
- Delete the now-unused `SiteBanner.tsx` and `PageHero.tsx`. Keep `Breadcrumb` only if it is still imported somewhere; otherwise delete it too.

- [ ] **Step 4: Update the old tests to the new design**

`site-design.test.mjs`:
- Change the arrival selector to `'.page-band'` for the non-location routes.
- Replace the `.site-banner img` and `.site-invitation` asserts with `assert.ok(await page.locator(\`a[href='/${locale}/locations/']\`).count() > 0)`.

`services-hero.test.mjs:17`: change `.site-banner` to `.page-band`, and assert that `.page-band .service-jump a` has a count greater than 0.

- [ ] **Step 5: Run the full checks**

Run: `npm run lint && npm run typecheck && npm test && npm run build && npm run check:export && node scripts/browser-check.mjs`
Expected: everything passes, including the two new e2e tests.

- [ ] **Step 6: Commit** `feat(site): shared black PageBand arrival on every inner page`

---

### Task 2: Black Orbis footer

**Files:**
- Modify: `src/components/SiteFooter.tsx` (rewrite), `src/lib/routes.ts`, `src/content/ui.ts`, `src/app/globals.css:65-70,178,191` and `src/app/site-system.css:148-149` (delete the old footer rules)
- Create: `src/components/BackToTop.tsx`
- Test: `tests/unit/navigation.test.ts`, `tests/e2e/orbis-pages.test.mjs`

**Interfaces:**
- Produces:
  - `footerPages = [...navPages, "privacy"] as const` in `routes.ts`
  - `BackToTop({ label }: { label: string })`, a `"use client"` `<button type="button" class="site-footer__top">` that calls `window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })`
  - `ui.backToTop = { mn: "Дээш", en: "Back to top" }`

- [ ] **Step 1: Write the failing tests**

Unit test in `navigation.test.ts`:
```ts
it("lists every page plus Privacy in the footer", () => { expect(footerPages).toEqual([...navPages, "privacy"]); });
```

E2E test in `orbis-pages.test.mjs`:
```js
test("the footer is black with slash-separated links, socials, copyright and a working back-to-top", async () => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/en/about/`);
  const footer = page.locator(".site-footer");
  assert.equal(await footer.evaluate(el => getComputedStyle(el).backgroundColor), "rgb(0, 0, 0)");
  assert.deepEqual((await footer.locator(".site-footer__nav a").allInnerTexts()).map(t => t.trim()), ["About","Brands","Services","Dealer network","News","Contact","Privacy"]);
  assert.equal(await footer.locator(".site-footer__nav a").first().evaluate(el => getComputedStyle(el, "::before").transform !== "none"), true);
  assert.equal(await footer.locator('a[href*="facebook.com"], a[href*="instagram.com"], a[href*="youtube.com"]').count(), 3);
  assert.match(await footer.innerText(), new RegExp(`${new Date().getFullYear()} © www\\.sainmotors\\.mn`));
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await footer.locator(".site-footer__top").focus(); await page.keyboard.press("Enter");
  await page.waitForFunction(() => scrollY === 0, null, { timeout: 2000 });
  const reduced = await browser.newPage({ reducedMotion: "reduce" }); await reduced.goto(`${base}/en/about/`);
  await reduced.evaluate(() => scrollTo(0, document.body.scrollHeight)); await reduced.locator(".site-footer__top").click();
  await reduced.waitForFunction(() => scrollY === 0, null, { timeout: 100 }); await reduced.close();
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `npx vitest run --configLoader runner tests/unit/navigation.test.ts`
Expected: FAIL, because `footerPages` is not exported.

- [ ] **Step 3: Implement the footer** (DESIGN §7)

Desktop:
- Column 1:
  - `sain-on-dark` logo, 221px wide.
  - `company.distributorClaim`, approved, as the description.
  - A small line `contact.phone · contact.email`.
- Column 2:
  - `nav.site-footer__nav` with the `footerPages` links. Each link has a `::before` skewed 1px slash at `rgba(255,255,255,.45)`, `transform: skew(-45deg)`.
  - A bottom row 72px below the nav, with `space-between`: the three social icons from `socials`, `"{year} © www.sainmotors.mn"`, and `BackToTop`.

Mobile (≤768px): a centred column. The nav stays visible and wraps (D6).

- [ ] **Step 4: Run the full checks** (the Task 1 Step 5 command). Expected: PASS. The footer "Brands" link tests in `corporate.test.mjs:19` and `journeys.test.mjs:54` still pass.

- [ ] **Step 5: Commit** `feat(site): black Orbis footer with back-to-top`

---

### Task 3: About page in the Orbis structure

**Files:**
- Modify: `src/app/[lang]/about/page.tsx`, `src/app/orbis-pages.css`
- Test: `tests/e2e/orbis-pages.test.mjs`
- Check: `tests/e2e/brand-destinations.test.mjs:36-43` (jetour.mn link) still passes

**Interfaces:**
- Consumes `PageBand` and the classes from Task 1.
- Produces the sections `section.about-statement`, `section.about-philosophy` and `section.about-grid`, as in the spec's mapping table.

- [ ] **Step 1: Write the failing e2e test**

```js
test("about follows the Orbis statement, philosophy and grid structure with our own content", async () => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/en/about/`);
  const statement = page.locator(".about-statement__claim");
  assert.equal(await statement.innerText(), "SAIN MOTORS IS THE OFFICIAL DISTRIBUTOR OF 11 AUTOMOTIVE BRANDS IN MONGOLIA.");
  assert.equal(await statement.evaluate(el => getComputedStyle(el).fontWeight), "300");
  assert.equal(await page.locator(".about-statement__pills > *").count(), 12);
  assert.equal(await page.locator(".about-statement__pills > *").first().evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
  assert.ok(await page.locator('.about-statement [data-status="draft"]').count() > 0);
  assert.ok(await page.locator('a[href="https://jetour.mn/"]').count() > 0);
  assert.equal(await page.locator(".about-grid > *").count(), 4);
  const reduced = await browser.newPage({ reducedMotion: "reduce" }); await reduced.goto(`${base}/en/about/`);
  assert.equal(await reduced.locator(".about-philosophy__statement span").first().evaluate(el => getComputedStyle(el).opacity), "1");
  await reduced.close();
});
```
`innerText` of an uppercase-transformed element returns the uppercased text in Chromium.

- [ ] **Step 2: Build, run it and see it fail**

Run: `npm run build && node scripts/browser-check.mjs`
Expected: `about follows…` fails.

- [ ] **Step 3: Implement the three sections** (spec mapping; DESIGN §4.1–4.3 values, clamped)

Statement section:
- Background `sitePhotos.hero` with `grayscale(1)` under `rgba(0,0,0,.45)`.
- Claim: uppercase `300 clamp(19.5px,2.6vw,37.5px)/1.3`, with an 804px measure.
- `.ob-ruled` paragraph, 386px wide and pushed right.
- Absolute portrait, 153.75×178.5px, at the right gutter. On mobile it is in flow at 121.6×99.3px.
- Wordmark, then pills as two rows of six, each 151.5×62px. On mobile they wrap three per row.

Philosophy section:
- Outline `<svg><text>SAIN MOTORS</text></svg>`, stroke black at 15% opacity.
- Eyebrow, then the statement split into `<span>` words.
- CSS inside `@supports (animation-timeline: view()) and (prefers-reduced-motion: no-preference)`: `span { animation: ob-word linear both; animation-timeline: view(); animation-range: entry 10% cover 45% }`, where `@keyframes ob-word { from { opacity:.1 } to { opacity:1 } }`.
- Three floating photos, 202.5×127.5px. On mobile there are two, in a 2-column strip.

Grid section:
- A 2×2 grid of 720×600px panels, single column on mobile, with panels 1–4 as in the spec.
- The dealer-network link button goes in panel 1.
- Panel 4 cities: group `getLocations()` by `city[locale]` and show `n` locations each.

- [ ] **Step 4: Run the full checks.** Expected: PASS.

- [ ] **Step 5: Commit** `feat(about): Orbis statement, philosophy and grid layout`

---

### Task 4: News chips and the Orbis card grid

**Files:**
- Create: `src/lib/news-filters.ts`, `src/components/NewsFilterBar.tsx`, `tests/unit/news-filters.test.ts`
- Modify: `src/components/NewsList.tsx` (rewrite the card), `src/app/[lang]/news/page.tsx`, `src/content/ui.ts`, `src/app/orbis-pages.css`
- Test: `tests/e2e/orbis-pages.test.mjs`. `tests/e2e/experience.test.mjs:10` (`.news-card[href]`) must still pass.

**Interfaces:**
- Produces:
  - `type NewsFilterId = "all" | "video"`
  - `newsFilterIds(events: DriveEvent[]): NewsFilterId[]`. It returns `["all","video"]` only when at least one event has a film and at least one does not; otherwise `["all"]`.
  - `matchesNewsFilter(event: DriveEvent, id: NewsFilterId): boolean`
  - `NewsFilterBar({ ids, labels, target }: { ids: NewsFilterId[]; labels: Record<NewsFilterId,string>; target: string })`, a client component. It renders `button.ob-chip[aria-pressed]` and sets `document.getElementById(target).dataset.filter`.
  - Each card is `a.news-card[data-video="true"|"false"]` inside `div#news-grid.news-grid[data-filter="all"]`.
  - CSS rule: `#news-grid[data-filter=video] [data-video=false] { display:none }`.
  - `ui.newsFilters = { all: {mn:"Бүх мэдээ",en:"All news"}, video: {mn:"Видео",en:"Video"} }`.

- [ ] **Step 1: Write the failing unit test**

```ts
import { driveEvents } from "@/content";
import { newsFilterIds, matchesNewsFilter } from "@/lib/news-filters";
it("offers All and Video only when both kinds of events exist", () => {
  expect(newsFilterIds(driveEvents)).toEqual(["all", "video"]);
  expect(newsFilterIds(driveEvents.filter(e => e.film))).toEqual(["all"]);
});
it("matches video events only for the Video chip", () => {
  expect(driveEvents.filter(e => matchesNewsFilter(e, "video")).map(e => e.edition).sort()).toEqual([6, 7]);
  expect(driveEvents.filter(e => matchesNewsFilter(e, "all"))).toHaveLength(driveEvents.length);
});
```

Add the e2e test:
```js
test("news chips filter instantly by keyboard and every card keeps the Orbis media box", async () => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto(`${base}/en/news/`);
  assert.equal(await page.locator(".page-band .ob-chip").count(), 2);
  const heights = await page.locator(".news-card__media").evaluateAll(els => els.map(e => Math.round(e.getBoundingClientRect().height)));
  assert.equal(new Set(heights).size, 1);
  assert.equal(await page.locator(".news-card__date").count(), 3);
  await page.locator(".ob-chip", { hasText: "Video" }).focus(); await page.keyboard.press("Enter");
  assert.equal(await page.locator(".news-card:visible").count(), 2);
  assert.equal(await page.locator('.ob-chip[aria-pressed="true"]').innerText(), "Video");
  await page.locator(".ob-chip", { hasText: "All news" }).click();
  assert.equal(await page.locator(".news-card:visible").count(), 3);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `npx vitest run --configLoader runner tests/unit/news-filters.test.ts`
Expected: FAIL, because the module is missing.

- [ ] **Step 3: Implement the filters, the chip bar inside `PageBand`, and the card** (DESIGN §5.3)

- Media box: 1.576:1, 12px radius, `::before` overlay `rgba(0,0,0,.45)`.
- Date: white, above the overlay, `left:22.5px; bottom:18.75px`.
- Title below the image: `18px/25px`, `padding:18px 15px`, using `eventTitle`.
- MTD8: a black typographic media box of the same size.

- [ ] **Step 4: Run the full checks.** Expected: PASS.

- [ ] **Step 5: Commit** `feat(news): Orbis chips and card grid`

---

### Task 5: Contact in Orbis typography, verification and release

**Files:**
- Modify: `src/app/contact.css` and `src/app/[lang]/contact/page.tsx` (styling only; keep `[data-contact-overview]`, the three `.contact-card` and `.contact-accordions`)
- Test: the existing `tests/e2e/contact.test.mjs`, which must pass unchanged

- [ ] **Step 1: Apply Orbis' contact typography** (DESIGN §6) **to the existing blocks**

- Section headings: uppercase `400 clamp(21.94px,1.9vw,27px)`.
- Contact rows: a label in `#8E8E8E`, the value with a `1px solid #000` bottom rule.
- The accordion summaries become black pills, Orbis' selected-chip style.
- No structural change (D10).

- [ ] **Step 2: Run the full checks.** Expected: PASS.

- [ ] **Step 3: Compare screenshots by eye**

Take screenshots at 1440 and 390 of about, news, contact and the footer. Compare them by eye with `scratchpad/orbis-shots/*`: the band height, the card proportions and the footer row positions. Record any mismatch you keep as a ruling.

- [ ] **Step 4: Commit and release**

Commit `style(contact): Orbis typography`. Push the branch `site/orbis-pages` and wait for the Vercel preview status to be `success`. Then fast-forward `main`, push, and check the live page `https://sainmotors-mn-three.vercel.app/en/about/` for `.page-band`.
