# About showroom film implementation plan

**Goal:** Finish the requested Orbis-style About composition with SAIN Motors content and the supplied HONGQI showroom film; remove the team portrait.

**Architecture:** Keep the existing static Next.js page and shared title band. Combine the introduction and eleven-brand network over one full-bleed background, then use a white sales/service composition. A small client component controls optional background playback; all copy and links remain server-rendered.

**Tech stack:** Next.js 16, React, scoped CSS, Playwright, browser-native MP4 encoding.

## Reference and design

Observed live with reverse-engineer-anything / REA on 2026-11-17: `https://www.orbis-auto.kz/en/about/`. Evidence `ev_5eb9f349e76daaffbfb7f4cddc576aa95e1521bddf9bdf974c12b9476a0b82e4`: controlled launch, 1440×1200 DOM and screenshot; owned browser terminated. Reference has a centered light uppercase statement, right-aligned ruled paragraph, large centered group wordmark and two rows of company marks over one mountain image. White section uses outline typography and floating landscape car photos. Earlier exact measurements remain in `docs/design/orbis-pages/DESIGN.md`.

User-requested differences: own Mongolian/English copy; no portrait; HONGQI showroom film replaces mountain; eleven clickable brands (6+5 desktop, two columns mobile). Follow-up: remove the oversized SAIN Motors logo from the video section. Preserve existing brand destinations and service/showroom routes. No new company claims or awards.

Palette: black #000, white #fff, quiet gray #c7c7c7, outline #dedede, translucent white rules #ffffff73. Existing sans type; centered uppercase statements with regular/light weight. Keep the footage as the main visual; avoid extra decorative effects. Use rounded landscape photos around the white statement and a narrow right-aligned body paragraph.

## Tasks

- [x] Extend `tests/e2e/about-corporate.test.mjs`: portrait absent, intro and brands share the film section, reduced-motion/no-JS poster fallback; playback, pause, resume, visibility, failed-video fallback and no horizontal overflow. Initial test failed on the existing portrait before implementation.
- [x] Add `scripts/build-about-film.mjs` to cut only facade, entrance and vehicle shots from the user-supplied local video. Crop encoded letterbox bars, create desktop/mobile MP4s and matching WebP posters; record source times in `public/video/about/README.md`.
- [x] Add `src/components/AboutShowroomFilm.tsx`, merge introduction/network in `src/app/[lang]/about/page.tsx`, and update `about.css`. Keep all eleven links and both onward routes accessible with JS disabled. Remove oversized logo per follow-up.
- [x] Verify MN/EN at 320/390/768/1024/1440/1920, real playback controls and failures, lint and production build; inspect desktop/mobile screenshots and exported pages.

## Verification

Lint passed. `SAIN_EXPORT_DIR=.next-about-film-review npm run build` compiled TypeScript and generated 47 static pages. The custom destination itself contains the export; ran `fix-export-segments.mjs --source .next-about-film-review` (42 segments) and served that directory on port 3318. All six About, Orbis shared-page and refinement browser tests passed against the actual production export. Desktop/mobile MP4s decoded at 1280×720 / 540×960, about 16 seconds, no audio tracks. Final desktop/mobile screenshots inspected under `.tmp-assets/about-film-final-*`.

One dev image check timed out while the image build regenerated assets; a clean 12-case inspection and production tests passed. An initial preview check used the pre-existing `out/` directory; corrected the server to the verified custom export above. Neither required an application change.

## Review focus

- Reduced motion, save-data, no JS, media error: retain the real exterior poster and readable content.
- Narrow screens and Mongolian headings: no clipping or side scroll; links remain at least 44px tall.
- Offscreen / hidden document: pause decoding, and preserve manual pause choice.
- Deployment: local MP4/WebP paths included in static export; no runtime encoding or external media dependency.
- Existing uncommitted work: edit only About-related files; preserve homepage and other routes.
