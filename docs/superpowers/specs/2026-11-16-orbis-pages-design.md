# Orbis-style inner pages, black footer and a shared title band

**Visual reference (measured):** `docs/design/orbis-pages/DESIGN.md`. Reference screenshots are kept outside the repo, in the session scratchpad (`orbis-shots/`).

## User requests (2026-11-16)

1. Make About and News "exactly like" orbis-auto.kz.
2. Make the footer black like Orbis'.
3. Make the other pages match the new home page and the dealer-network page.
4. Contact like Orbis' feedback page. This one was relayed by the research agent and is unverified, so its scope is kept light.

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Keep our fonts: SF Pro/Inter for body text and Zona for display. Do not use Aeroport. | No licence. |
| D2 | Size everything with `clamp()` between the measured 1440px and 390px values. Do not use Orbis' vw-driven root size. | Orbis breaks on tablets (DESIGN §8). |
| D3 | One `PageBand` component (black band, breadcrumb, centred h1, optional chips) replaces `SiteBanner`, `PageHero`, `.contact-hero` and the white `.brand-title` on about, news, news detail, services, brands, brand detail, contact and privacy. RELY keeps its R8 page. | The dealer-network hero is already this black band, so every page now uses the same arrival. |
| D4 | The first breadcrumb is "Нүүр хуудас" / "Home page", underlined with a 1px border. The slash is a span. | DESIGN §3 (News variant). |
| D5 | Remove `SiteInvitation` from about, news, services and brands. The onward route to the dealer network comes from the footer and in-page links. | Orbis pages have no call-to-action panel. |
| D6 | The footer keeps its nav links on mobile, centred and wrapping. It adds Privacy and keeps Brands. It shows phone and email in small text under the description. | Brands is reachable only from the footer now. Contact details are useful on a dealer site. |
| D7 | The News chips are "Бүх мэдээ / All news" and "Видео / Video" (events with a film). They are `<button aria-pressed>` and filter instantly on the client. No pagination while there are 6 items or fewer. | Our events have no categories (types.ts:176), so only real facets are offered. This also fixes Orbis' keyboard-inaccessible chips. |
| D8 | The news card date sits above the overlay in white. | DESIGN §10: Orbis' grey date has poor contrast. |
| D9 | About keeps Orbis' structure but uses only our content and status flags (see the mapping below). There are no Mission/Vision/Awards sections, because no such content exists. | Content gate (types.ts:4-15). Never invent copy. |
| D10 | Contact: the band, plus Orbis typography on the existing overview, cards and accordions. No new form and no new backend. | Static export. The request is unverified. Keep the current tests. |
| D11 | Photo radius is a fixed 12px. | Orbis' larger radius on mobile is a side effect of its vw scaling. |

## About: content mapping

| Orbis slot (DESIGN §4) | Our content |
|---|---|
| Band title | `pages.about.meta.title` ("Бидний тухай" / "About us") |
| 4.1 background | `sitePhotos.hero` (sain-hq-aerial), `filter: grayscale(1)`, under a flat `rgba(0,0,0,.45)` |
| 4.1 uppercase statement (weight 300) | `company.distributorClaim` (approved) |
| 4.1 ruled paragraph | first paragraph of `company.introduction` (draft, marked) |
| 4.1 portrait | `sitePhotos.aboutHeader` |
| 4.1 group wordmark | `sainLogos["sain-on-dark"]` |
| 4.1 pill grid, 2 × 6 | pill 1: white, Sain Motors colour logo. Pills 2–12: the 11 brand marks in white, linking to `brandHref` (JETOUR/CHERY go to their official sites) |
| 4.2 outline slogan | the SVG text "SAIN MOTORS" as a stroke outline at 15% opacity |
| 4.2 eyebrow / statement | `pages.about.sections[0]` heading / body (draft). The statement words fill in on scroll with CSS `animation-timeline: view()`, fully opaque where that is unsupported or motion is reduced |
| 4.2 ruled paragraph | second paragraph of `company.introduction` (draft) |
| 4.2 floating photos | three `sitePhotos` showroom images |
| 4.3 panel 1 (photo, white text at the bottom) | `pages.about.closing` (draft), plus a link to the dealer network |
| 4.3 panel 2 (black) | `pages.about.milestones` heading/body and `company.milestones` years with brand-mark links |
| 4.3 panel 3 (photo under the 45% overlay) | `CompanyFacts` |
| 4.3 panel 4 (#F6F6F6, numbered list) | `pages.about.sections[1]` heading/body and the dealer-network cities with their location counts, from `getLocations()` |
