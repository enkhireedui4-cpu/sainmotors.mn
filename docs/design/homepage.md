# Sain Motors homepage
Latest direction: 2026-11-16. This supersedes the former split hero, video hero, moving wordmark band and vehicle studio.

The user requested the composition of [Orbis Auto](https://www.orbis-auto.kz/en/) with Sain Motors identity, then asked to replace the old company and after-sales blocks too. Their iPhone reference guides clean typography, Jetour guides the transparent header, and their final Monnis reference guides the company introduction.

## Composition
1. Fixed transparent header over a full-screen Earth film. Following the user's Jetour reference, it gains a white background and dark logo/menu once the film scrolls away.
2. Large white SAIN MOTORS wordmark: its centered S is traced in champagne gold, fills white and moves left; AIN MOTORS follows one letter at a time. The sequence settles in about 3.5 seconds over subtle orbit trails.
3. Left service label, right brand promise, bottom social links and company introduction. The circular S scrolls to the company section; a small pause control stops motion.
4. A pure-white company introduction with faint monochrome mountains, a small red label, SAIN MOTORS title, a concise factual paragraph and an About us pill. The desktop four-photo ribbon and divided network figures follow below.
5. An Orbis-style dark brand section above services, following the user's latest screenshot: black contour artwork, a large centered count heading, supporting copy and white wordmarks inside thin outlined pills. Desktop rows contain 4–4–3 marks, with the second row offset slightly; tablets use three columns and phones use two. Counts, order and destinations come from the published brand registry.
6. Four photographic service links in a single desktop row and a 2-by-2 phone grid, adapted from the reference's image-led service section.
7. Footer directly after services. The user removed the homepage news/events and showroom invitation blocks on 2026-11-16; their separate pages and shared components remain available.

## Content
The English hero description is exactly:
> Our company is the epitome of reliability and high-quality service. Sain Motors is a group of companies that includes 11 different car brands.

The Mongolian version translates the same statement. The facts show 11 automotive brands, 7 showrooms, 2 4S showrooms and 3 cities. The 4S count was confirmed by the user; its approval/source is stored in company.fourSShowrooms. Other counts come from published brand and location records.

Navigation, footer and the directory page use Dealer network / Дилерийн сүлжээ. The existing /locations/ URLs and directory behavior remain. The homepage brands use the exact Orbis contour background, saved locally as `public/art/orbis-brands-bg.webp`. The desktop title is 50px/400 with 1.3 line height; supporting copy is 18px with a 32px top gap. The 896px logo list starts 58.6px below the copy, with 10px column gaps and 28.8px row gaps. Links are 65px tall with 1px 45%-white borders and 45px radii. Transparent wordmarks are rendered white with a section-scoped CSS filter, including CHERY; BESTUNE, MAXUS and HONGQI retain their lettering-only crops. Phones use a 28px heading and 56px pills. Brand names remain available to assistive technology. The component is server rendered with no additional client script.

## Typography and color
The user's latest Apple/iPhone screenshot guides a native San Francisco / self-hosted Inter stack for headings, navigation and body text. Apple platforms use their native system face; Windows and other platforms use the existing local Inter with full Mongolian coverage. Headings use weight 600, body and controls use 400, and close tracking plus a 1.5 body line-height keep text clean. Zona Pro remains limited to the wordmark and decorative S.

Midnight #030710, white #f7f7f5, champagne #d8be87 and the film's reflected blue/city lights form the hero. Sain red remains in brand and supporting controls. Following sections use white, dark text and muted gray descriptions. The transparent overlay header becomes white with dark text after the opening scrolls out. The mobile dialog remains white with a dark visible focus ring.

## Behavior and maintenance
The hero uses the user's supplied 1920x1080 Earth MP4, copied locally as public/video/hero/sain-earth.mp4, with a decoded WebP poster. Video is muted, inline and looping. It is not requested under initial reduced-motion preferences. SVG/CSS supplies the single wordmark sequence without an external motion/3D dependency. Motion pauses offscreen, when hidden, on user choice and under reduced-motion preferences; a completed intro does not replay on resume. No-JS users receive the complete wordmark, poster and solid readable header with the inactive pause control hidden. Scroll effects share one passive subscription, throttled to requestAnimationFrame. Mobile figures use a 2-by-2 arrangement and service cards stay in two columns.

Homepage composition: src/app/[lang]/page.tsx. Hero: HomeOrbitHero / CinematicHeroScene / CinematicWordmark. Following sections: HomeOrbitSections / HomeOrbitBrands / OrbitScrollScene. Section styles are scoped to orbit-home; the shared typography also applies to supporting pages.

On phones, the film uses an 18% horizontal focal position to show the blue Earth limb and sunrise. The same S-to-name sequence and transparent-to-white header behavior are retained. Small portrait layouts and short landscape layouts fit the opening screen with readable copy, 44px controls and safe-area spacing. The compact company intro uses a 24px title and 12.5px body, measuring about 268–326px at 320–390px widths; photos and facts stay in 2-by-2 grids.

The user's 2026-11-16 desktop and mobile Orbis screenshots guide the photo ribbon, network figures and service cards. The desktop ribbon uses a wider 86.25% container, 1.9:1 photos and 16px corners. The figures have a one-third introduction and four equal columns, 48px maximum headings/numbers, dark uppercase labels and equal-height dividers. On phones, 2:1 photos sit above a 20px heading, 14px description and 2-by-2 figures with 22px numbers and a divider on every item. Services use a centered regular-weight title and description, four landscape cards across on desktop, and two portrait columns on phones with 16px corners and compact white labels. The four existing services and localized destinations are retained; the all-services link follows the cards.

Superseded video/marquee/showcase browser suites were retired; directory, navigation and destination coverage were retained in the current suites. Tests for this composition live in tests/e2e/home-orbit-hero.test.mjs.

Reference HTML, JavaScript and REA evidence are retained under .firecrawl/orbis-reference. Firecrawl CLI acquisition was blocked by network EACCES; source capture used browser DOM/fetch and REA instead.
