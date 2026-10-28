# Sain Motors shared website design — 2026-10-28

This supersedes `design-system.md`. The user requested the clean contact-page direction throughout MN/EN, then specified a restrained homepage led by “11 брэндийн албан ёсны дистрибьютер”. Sain's own photographs, supplied logos and local Zona Pro / Inter remain the visual foundation.

## Tokens

| Role | Value |
| --- | --- |
| Page / card | #FFFFFF / #F4F5F7 |
| Text / secondary | #172126 / #566169 |
| Border / action / footer | #DFE4E7 / #E20A17 / #192227 |
| Content width | 82rem max; responsive 20–72px gutters |
| Section spacing | clamp(3.5rem, 6vw, 6rem) |
| Photo/card radius | 1.4rem desktop; 1rem mobile |
| Control radius | .5rem |

`site-system.css` connects primitive neutrals to semantic surfaces and component radii, keeping existing CSS variables compatible. Page-specific selectors protect against route stylesheet ordering. No new dependencies. Manufacturer logos retain their original geometry/colours; SOUEAST uses its official light/dark variants.

## Patterns

- Home: small Sain label, confirmed eleven-brand heading with red “11”, one guidance sentence, two actions and a broad rounded manual gallery. A brighter supplied forecourt/ramp photograph leads, with focal points per image. The home brand section contains only eleven clickable logos, without descriptions. Three practical journeys follow; brands, company, services and event reports have distinct, spaced sections.
- About, brands, services, locations and news: shared photographic `SiteBanner`, white title, short lead and breadcrumb. Contact retains the user's approved matching presentation.
- Shared `SiteInvitation`: rounded pale-grey panel with location link and real general phone.
- About: grouped story cards, sourced milestones and derived figures. Seven showrooms in three cities including Erdenet; no invented company statistics.
- Brand directory: searchable photo cards, official logos, concise product focus, categories and shareable query state. Three/two/one columns; all eleven destinations available without JavaScript.
- Brand detail: white title, useful enquiry actions, real vehicle imagery and rounded identity/fact/gallery/location surfaces. Existing scroll-responsive image and sticky section navigation remain; missing models create no empty section.
- Services: four service routes, two confirmed repair centres and actual team photographs. Coverage follows sources; SOUEAST's workshop location is not inferred from its sales showroom.
- Locations: native brand/city selectors and one clear surface per address/contact/hours/map. Exact pins say Directions; searches say Search map. Unknown hours use call-ahead guidance. Erdenet has its supplied phone; no brands assigned pending confirmation.
- Contact: team photo, address/phone/email cards, social/all-location links and native request disclosures. Intent/brand selection reaches real contacts. No invented HR/media inbox, form delivery or response promise.
- News: dated event reports, readable articles and user-played video. Use a date graphic when no photo for that event exists. No past-event registration link.

## Interaction and verification

Gallery uses arrows/dots/swipe/keyboard without autoplay; video has controls and `preload="none"`. Mobile dialog supports Escape/focus containment/return. Focus is visible. Main actions are at least 44px; directory actions 48px. Anchor offsets account for sticky headers.

Homepage intro/photo enter once using opacity and 14px vertical travel, with a restrained stagger. Buttons lift 2px only with a hover-capable pointer. All these effects are inside `prefers-reduced-motion: no-preference`; reduced motion keeps the page static and disables existing brand entrance/transition effects.

Query state survives Back, reload, language switching and same-route navigation. Server HTML includes useful content without JavaScript. `docs/verification-2026-10-28.md` records static-export checks. `FULL_SITE=1 node scripts/visual-review.mjs` writes all-page mobile/desktop captures and local lab observations to `docs/review/2026-10-28-fullsite/`; these are not field Core Web Vitals or real-device testing.

Preview remains noindex. Facts, sourced content and drafts remain distinct in the review CSV. Production hosting/TLS and post-deployment checks use the existing release workflow.

## Supplied homepage reference refinement

The final homepage follows docs/research/home-design-reference.png. Desktop uses a pale photographic split: a small SAIN MOTORS label, bold eleven-brand heading and actions on the left, rounded manual gallery on the right, with centred dots beneath it. The earlier three journey cards are removed. A centred rule-and-heading introduces eleven logo-only links with subtle column dividers and a centred final row. On phones the composition stacks deliberately:36px heading, short lead, full-width actions at small widths (50px height), a4:3 photograph, then three logo columns with the final two centred. Gutters are20px at phone widths. All entrance/hover motion remains opt-in to no-preference; no autoplay.
