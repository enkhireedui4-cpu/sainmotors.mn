# Brand experience implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task.

**Goal:** Give the brand directory and all eleven brand pages the spacious, contemporary presentation requested using the Al-Futtaim BYD page as a visual reference.

**Architecture:** Keep page content server rendered and statically exportable. Reuse the existing content, responsive images, official marks and contact records. A small client island provides active section navigation; native anchors remain usable without JavaScript.

**Tech stack:** Existing Next.js 16, React 19, TypeScript and CSS. No new dependencies.

**Spec:** User's screenshot and request, 2026-10-23. Adapt the large dark title band, full-width automotive photography and spacious company information to Sain Motors. Scope is the brand directory and brand detail pages; shared navigation and the homepage retain their identity.

## Design decisions

- Palette: paper #ffffff, mist #f3f5f6, deep ink #10242d, ink #172126, signal red #e20a17, muted #566169.
- Typography: existing Zona Pro for large brand names and headings; Inter for navigation and body copy. Left aligned, measured text, generous separation.
- Directory: dark introduction followed by an editorial grid of eleven real vehicle photographs, original logos and concise existing descriptions. Preserve the noninteractive coming-soon teaser.
- Detail: breadcrumb and oversized brand name in a dark title band; edge-to-edge vehicle image; sticky section links and sales phone; two-column overview and original logo; verified facts; available model imagery; showroom and other brands.
- Motion: one restrained title/image entrance, image response to deliberate hover/focus, and optional smooth anchor navigation. Reduced motion removes animations and smooth scrolling. Content is visible without animation or JavaScript.

## Global constraints

- Preserve all MN/EN routes, reciprocal metadata and preview noindex behavior.
- Preserve source content, review statuses, model names, phone destinations and map URLs.
- Do not introduce prices, warranty terms or services absent from the existing records.
- Use existing official assets; no copied Al-Futtaim photography, branding or copy.
- Support 360, 390, 768, 1440 and 1920 CSS px; do not crop vehicles out of supplied photographs.
- Work in the requested running checkout so changes are visible at localhost:3200. Leave changes uncommitted for review.

## Review focus

- Sticky section links must land below the main header and section navigation.
- Brands without gallery/model records must not link to nonexistent sections.
- Square studio assets must retain the full vehicle on narrow screens.
- The brand journey and contact information must work without JavaScript.
- Reduced motion must retain content and remove motion.

## Tasks

- [x] Add browser coverage for section navigation, real destinations, no-JavaScript fallback and reduced motion. Run it against the current site and confirm missing-feature failures.
- [x] Build the image-led directory and detail layout in `BrandPortfolio.tsx`, `BrandDetail.tsx`, the brands route and scoped `brands.css`. Add `BrandSectionNav.tsx` with native anchors and progressive active-section tracking.
- [x] Run new and existing browser coverage, typecheck, lint, unit tests and a static export build. Inspect desktop/mobile screenshots of the directory and representative brand pages.
- [x] Review the resulting diff, correct material issues, update design documentation and report the preview links and verification results.

## Execution record

- Baseline: clean main checkout; existing nine targeted browser tests passed before this request.
- Ruling: use the active checkout, because the user asked to update the running Desktop project. No deployment or content approvals are part of this change.
- Ruling: the separately named motion-design skill is not installed; use frontend-design and ui-ux-pro-max motion guidance. Python is unavailable, so use its supplied quick-reference guidance without installing software.
- Verification: both new tests failed for missing navigation before implementation, then passed. Fixed the document scroll-padding and section scroll-margin being counted twice; keyboard navigation now lands below both sticky bars.
- Verification: typecheck, lint and all 59 unit tests passed. Desktop/mobile screenshots inspected for BYD, SOUEAST, HONGQI and the directory; source images remain fully visible.
- Review: independent read-only reviewer found no actionable issues, including representative pages at 360/390/768/1440/1920px.
- Verification note: do not overlap image regeneration with browser asset checks. The first broad browser pass had one asset timeout while the existing build script removed and regenerated public/media; rerun after build completes.
- Final verification: optimized static build passed; export validation passed for 646 files; all 20 browser tests passed against the completed static export, including 360/390/768/1440/1920px layout checks in both languages. All 319 expected media files are present. The running dev directory and BYD page both return HTTP 200.
- Delivery: changes remain in the requested checkout, uncommitted. Preview at http://localhost:3200/mn/brands/ and http://localhost:3200/mn/brands/byd/.

## Follow-up: image contraction and simpler brand heading

The user supplied three scroll positions from the reference. All brand detail title bands now need only the breadcrumb and brand name; duplicated descriptive copy is removed. The photo begins at viewport width and contracts to the existing 82rem content column while scrolling, with no pinned scroll scene. Below it, a square logo panel sits left of the headline, introduction and contact information. All source content and the previous removal of two BYD gallery images remain in effect. Remove the coming-soon teaser from the homepage and directory.

- [x] Verify a failing browser test for full-width → centered contracted image → full-width on return.
- [x] Add a small transform-only scroll image island with static reduced-motion/no-JavaScript fallbacks; simplify the overview layout and remove the requested text/teaser.
- [x] Verify motion, narrow screens, keyboard links, no-JavaScript reading order, unit tests, typecheck and lint. Build using existing image variants, then validate the completed export separately from browser checks.

Follow-up verification: all 59 unit tests and 24 browser tests passed. Browser checks ran against a completed static export built from a separate temporary copy, with matching hashes for the current hero component, detail component and CSS. Build/typecheck, lint and validation of all 646 export files passed. Existing image variants were reused. Regression tests cover the image returning to full width, avoiding overview overlap throughout scroll, tall mobile imagery and full-column logo sizing, direct fragment positioning, keyboard navigation and no-JavaScript links. The active dev server runs on port 3200.

Review fixes: the image stage reserves its displayed height so a larger initial image cannot cover the introduction on tall screens. Native fragment positioning is stabilized after sizing. Mobile hero images use 4:5 cover framing, logo panels use 5:3, and responsive image sizes account for the cover crop. Both were verified against the user's mobile reference. The earlier two BYD Shark 6 gallery removals remain in effect.

Final directory refinement: the user requested the homepage logo grid on the brands directory too. Both routes now reuse CorporateBrands; photographic cards and their unused component/styles were removed. The user explicitly requested committing and pushing this final version to enkhireedui4-cpu/sainmotors.mn.
