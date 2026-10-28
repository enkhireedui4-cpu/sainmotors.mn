# Complete-site visual consistency implementation plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation; continue the existing feature branch and preserve the user's checkout.

**Goal:** Apply the user's approved clean contact-page direction to the complete MN/EN website, with a lighter, cleaner homepage explicitly requested in the latest screenshot.

**Architecture:** Reuse the typed content and local media, add shared server-rendered page banners/invitations and one compact token stylesheet. Keep the tested brand/location/enquiry behaviors, native disclosures, metadata and release gate.

**Stack:** Existing Next.js 16.4.1 / React 19.3.1 / CSS / Vitest / Playwright / REA. No new dependencies.

## Binding design decisions

- Homepage: follow the subsequently supplied reference image: light desktop split with copy left/photo right, no duplicate kicker claim; independent stacked phone layout and logo-only portfolio.
- Supporting pages: the contact page's photographic title banner, consistent typography, white space and pale-grey rounded content cards. Brand pages keep their own photography and working gallery/section navigation.
- Palette: existing Sain red #e20a17, ink #172126, muted #566169, pale grey #f4f5f7, white. Zona Pro + Inter remain unchanged.
- Shared media/card radii: 1.4rem desktop, 1rem mobile. Semantic CSS variables connect component styles to this small token system.
- No new factual claims, stock assertions, prices, hours, coordinates, corporate statistics, response-time promises or third-party imagery.
- Preserve all eleven brand destinations, service coverage, precise-vs-search map labels, query/history/language persistence, real contact links and static/no-JS fallbacks.

## Research evidence

The earlier ten REA captures are documented in docs/research/2026-10-28-reference-review.md. A focused follow-up inspected content below the fold using declared PageDown actions:

- Al-Futtaim automotive: ev_4aa1b17f4b67ebf32e899788761693a353ed5c284cf7b56b434695741dcf36e9 — clear image-led highlights and portfolio links.
- Monnis corporate/about: ev_1b51cc1ab026d406d3b2c55792f811fbb37d8ff5c51afcd7792057e363684f83 — portrait/story relationships, corporate timeline, grouped facts.
- Namir automotive: ev_bc15d98ace8e679808313bfecab00d56abed4bc15575b5643252894336271b1d — each brand has a short explanation and a direct onward route.

These are observed desktop structures, not claims that form delivery or mobile performance were verified. Copy, assets and business claims are not copied.

## Tasks

- [x] 1. Introduce shared tokens, SiteBanner and SiteInvitation; adopt them on about, services, locations, brands index and news index. Keep contact's approved presentation.
- [x] 2. Recompose the homepage into the light photographic arrival and refine logo/journey/company/service/news sections.
- [x] 3. Refine brand detail, location rows, service cards, news articles, privacy and shared navigation/footer surfaces to the same visual system.
- [x] 4. Verify complete MN/EN route coverage, links, filtering, keyboard, narrow/zoom-equivalent layouts, reduced motion and no-JS fallback. Replace only obsolete service-hero motion assertions with useful new banner/navigation checks.
- [x] 5. Run types/lint/unit/build/export/E2E, inspect screenshots for every main page, record verification and obtain independent code review as required by the review skill.

## Ledger

- Starting state: prior redesign has 68 passing unit tests and 32 passing static-export browser tests. Working tree changes are intentional prior work, not discarded or overwritten.
- User delegates visual decisions and explicitly asks for whole-site execution; no intermediate approval round is needed.
- Style-only changes use screenshot/layout verification; new navigation or behavior receives meaningful regression coverage.

- Completed:35 exported browser tests and68 unit tests pass; build, lint, types, export/health and23 visual captures verified. Independent review reported no Important issue.
- Latest user refinements: approved eleven-brand fact promoted to homepage h1; shorter lead, brighter own photo, reduced-motion-safe entrance, and logo-only home portfolio. Erdenet address/phone added, with unknown coverage/hours/pin retained as unknown.

- The later supplied image supersedes the earlier above-photo home layout. Final matching layout verified with35 browser tests (desktop split, phone36px heading, stacked actions,4:3 photograph),68 unit tests, lint/types/build/export/health and refreshed23-page visual captures.
