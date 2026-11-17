# Orbis news detail reference

Inspected 2026-11-17: https://www.orbis-auto.kz/en/news/ and https://www.orbis-auto.kz/en/news/novosti/50/ at 1440×1000 and 390×844. Local captures: `.firecrawl/orbis-news-desktop.png`, `.firecrawl/orbis-news-mobile.png`. These are reference-only images, not site assets.

REA controlled navigation evidence: `ev_152eba013aa236a63df15c371714b3eb11e9705531d0f2414649bb33b0dc70cf`, saved in `.firecrawl/orbis-news-rea-evidence.json`. REA waited for the first visible news card, clicked it and observed the detail image on `/en/news/novosti/58/`. All steps completed and the owned browser terminated. This establishes the card-to-detail journey, not visual equality or any backend behaviour. The earlier locator for an older hidden card timed out; it is not evidence of successful navigation.

## Observed visual system

- Black #000 header; white #fff title and article; related-news area #f6f6f6.
- Desktop content column measured 792px at 1440px, centered. Breadcrumb, headline, thin rule, date/category row, large rounded photograph and photo credit all align left to that column.
- Headline 37.5px, weight 400, line-height 48.75px at 1440px. Article body 13.5px/22.95px. Reference uses Aeroport; retain Sain Motors' existing Inter font.
- Header/body padding 68.25px vertically at 1440px. Article photographs have 11.25px corners and span the body column. Paragraph-to-photo gap approximately 24px.
- Mobile capture measured 24.375px side padding, 21.9375px/28.5187px title, 14.625px/24.8625px body, and 18.2812px photo corners at 390px. The reference scales too aggressively on tablets; use readable clamped values instead.
- Still images are interspersed with the story in one column. They are not a slider or lightbox. Related stories appear in a light-gray section above the shared footer.

## Implementation choices

Use the same article structure for event reports and other supplied news. Preserve source date precision (day/month/year/unknown), published event routes and films. Consolidate overlapping Word sections into distinct stories. New content remains draft in the existing review registry. Use Sain assets only. Show an illustrative-photo note where existing assets do not depict the actual historic event. The user subsequently withdrew the MTD7 and MTD8 reports: remove them from the catalogue, related cards, sitemap and generated routes while retaining the source archive.

```
black: breadcrumbs → headline → rule → date/category → cover → credit
white: supplied story → event photographs → story → photographs → film when available
gray: other news cards
black: existing Sain footer
```

Alternative considered: keep the existing centered title band and add a gallery beneath it. Rejected because the user's requested Orbis detail treatment puts the cover inside the left-aligned black introduction and places images between paragraphs.

Source-photo selection was refined after the user's request to avoid similar repeated frames. Shiliin Bogd uses a lineup cover, a family moment, an off-road vehicle with a visitor and festival performers. BYD uses a handshake cover, one signing moment, the 4S exterior and the workshop. Other illustrated stories use one cover plus one or two clearly different photographs placed beside the relevant text. Retain original files, but do not display every available frame or present photographs as a different event.

On 2026-11-17 the user explicitly assigned the child-drawing photograph (`news-imported-mega-03`) to the SAIN photo-contest article. Use it for that article's cover and listing card in both languages. Replace its previous MEGA TEST DRIVE placement with the live-band photograph (`news-imported-mega-04`).
