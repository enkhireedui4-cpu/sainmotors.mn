# Dealer network design

User-approved reference: Orbis Auto `/en/dealers/`, three screenshots supplied 2026-11-16. Build directly in the existing Sain Motors project, preserve earlier homepage work.

## Appearance

White existing site header followed by a black hero, centered breadcrumb and Dealer network / Дилерийн сүлжээ heading. Desktop title 64–72px, mobile 36–40px; retain the site's system/Inter typography. Eleven evenly sized outlined logo filters plus All dealers, white selected state. White logo wordmarks on black, proportional and optically centered; omit the emblem from BESTUNE, MAXUS and HONGQI as requested earlier.

Dark Earth atmosphere behind a real Mongolia outline. Three city counts at their geographic anchors, with leader lines and separate labels where needed; markers must remain legible on phones. Counts describe all eight locations (seven showrooms plus one service centre), filtered by brand. City actions select the city and scroll to the directory. Previous/next controls cycle brands and update all views.

Below: white directory with a roughly one-third-width accordion list and two-thirds-width interactive street map at desktop widths. City and brand selects remain accessible and use the existing shareable URL state. On phones, stack the map and list without horizontal overflow; retain 48px touch controls. Marker, accordion and selected state stay synchronized. Preserve every supplied phone, map URL, address, hours and brand relationship.

## Data and resilience

Eight records across Ulaanbaatar (6), Darkhan (1), Erdenet (1). Only verified coordinates produce exact dealer pins. Four search-only records use explicitly identified city-area markers; retain Search map links. Unknown hours and Erdenet brand coverage stay unknown. All contact details are server rendered and readable without JavaScript. Map failure leaves contacts and outbound map links usable. Keyboard focus, reduced motion, URL refresh/Back and language switching must work.

Use a locally hosted Leaflet 1.9.4 build (BSD-2-Clause), browser-loaded only when the map approaches the viewport. Street tiles use the documented OpenStreetMap URL, visible attribution, normal browser caching/referrer, no offline prefetch. Natural Earth country/city data is public domain. The country overview reuses our existing Earth artwork. No API keys or copied Orbis dealer data/assets in the product.

## Reference evidence

Firecrawl skill consulted; CLI absent and package cache unavailable, network acquisition blocked. Browser fallback captured HTML/CSS/JS into `.firecrawl/orbis-dealers-reference`. REA static analysis parent evidence `ev_84b913d44e50878b1a1e711ed23c0cf35a68e6b5fcfaa48b88bba2fcc2f6a05b`: two scripts parsed, static candidates only, dynamic behavior remains partial. Browser interaction observed 84 dealer rows becoming 6 after selecting Toyota. Orbis uses Yandex Maps, coordinated chip/city filtering, single-open accordions, map centering. Reimplement these interactions with Sain's own data.

JETOUR supplied short pin resolved to 47.9210074,106.9015123; BYD supplied short pin resolved to 47.9112692,106.8434391. CHERY 47.904448,106.902714 and service 47.897841,106.796819 are already explicit in company data. City centers from Natural Earth 10m populated places simple: Ulaanbaatar 47.918619,106.914670; Darkhan 49.462392,105.972544; Erdenet 49.053297,104.118337. Country outline from Natural Earth 110m admin 0 countries, MNG.

Sources: https://www.orbis-auto.kz/en/dealers/ ; https://www.naturalearthdata.com/about/terms-of-use/ ; https://github.com/nvkelso/natural-earth-vector ; https://leafletjs.com/ ; https://operations.osmfoundation.org/policies/tiles/

## User refinements during implementation

All routes share the homepage header geometry (64px desktop, 72px phone, same logo/inner width/menu/language styling); the homepage retains its existing hero overlay colors. Mobile reference shows unframed compact logo rows and a small 22px page heading. The country overview leads directly to the city/brand controls and accordion list. The optional street map follows the list behind a View street map control, so it does not interrupt that reference composition or load tiles before requested on phones.

Impeccable 4.9.2 installed separately at the user's explicit request in `.agents/skills/impeccable` (69 upstream files verified against Git blob hashes, pinned commit d41d9860b0094dcb68030657da63461212835aaa). OpenDesign installation canceled before any install. Skill launcher/hooks were not invoked or configured.
