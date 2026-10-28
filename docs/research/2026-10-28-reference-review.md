# Reference review — 28 October 2026

The user requested REA reverse engineering of six public sites to inform Sain Motors' design and user journeys. These observations describe the captured pages, not a full audit of the companies or their systems. No competitor code, artwork or commercial text is reused.

## Captured evidence

REA `capture_browser_scenario`, installed Chrome 156.0.8078.48, owned temporary profiles, 1440 × 1000, light theme, reduced motion. Each launch reported completed navigation and confirmed owned-process cleanup. Captures retained screenshots and accessibility trees. MSM also retained DOM. Evidence remains in the REA session.

| Reference | Evidence ID | Observation and decision |
| --- | --- | --- |
| [MSM Ford Expedition](https://www.msmgroup.mn/en/automotive/Car-detail/ford-expedition) | ev_91ed8fb15a05ce807cbeebbe5d624b051ea7256a25f4add13a88b8079335647a | Product information has distinct test-drive, finance and quote links. Apply purpose-specific enquiries beside brand content. Its captured test-drive and quote URLs contain null product parameters, so build and test Sain's own typed deep links rather than copying the implementation. The initial captured image area was blank; do not infer loading speed from this single frame. |
| [Monnis Motors](https://en.monnis.com/org-monnis-motors) | ev_fa22cba1ca22d5b07955f589027ef6946c48ebc7e8a027b26da807b85c9974f1 | Corporate story, service content, contact and explicit outbound brand-site/brochure links serve distinct purposes. Keep Sain's corporate site as an introduction and route detailed commercial questions to its own brand channels. Use Sain's real photographs and derived location counts. |
| [Namir contacts](https://namir.mn/contacts/) | ev_f6c9ae32b46e066472248d2cbdb07867c4d8ca582c7260e39b014509fc25b7c3 | General, media and careers contacts are separated. A second REA scenario clicked Media successfully and exposed its email (ev_164f7d8e79c9be9ed467c3e28cbfef2e464dd04cbdba7e10078fd5d2fcc0eec3). Apply intent routing with real available contacts. Its embedded map showed a configuration error in this run; use dependable outbound map links, avoiding an API-key dependency. |
| [Inchcape OEM partners](https://www.inchcape.com/en/our-company/our-oem-partners) | ev_85e5c01b0860486d1f082a898a9a8d8e39d1e3b5ebd4d3e64e55725494a20d2e | Brand identities are contextualized with product focus and market information. Add concise existing brand descriptions and a searchable photographic portfolio. Do not borrow its stock-market banner, multinational statistics or large navigation structure. |
| [Al-Futtaim Automotive](https://www.alfuttaim.com/en/divisions/automotive/) | ev_a7672001c4523eb92a4f61cb994bf3e0f102eb1f74d314c4fcdd8f761dea1af7 | Prominent photography, portfolio links and need-based mobility segments clarify the group's role. Use a strong image-led Sain introduction and distinct purchase, ownership and location routes. Search-indexed and browser-rendered subsegment content differed in this capture; do not claim every indexed section was interactive. |
| [Sime Motors dealer finder](https://simemotors.com/find-a-dealer) | ev_43924d7ba977339e02d6f72095dc5d5ada66c90b9b1423051b4b30d0fc8590d0 | Location, represented brands and contact details are grouped under country/brand selectors. Strengthen Sain's existing brand/city directory and deep-link it from services. Keep native controls, live result counts, explicit empty states and shareable URLs. |

Sain's initial exported home was captured separately: ev_6367919275f77d926c941531192a8622373379617c11b351f430603e099a6188. The existing white split hero and logo-only grid established the before state.

## Design direction

Use the company's own showroom photography as the dominant visual; clean white sections, graphite #172126, slate #566169, pale steel #f3f5f6, Sain red #e20a17 and deep automotive blue #10242d. Zona Pro carries large Mongolian/English headings, Inter supports clear reading. Keep left-aligned copy, generous but purposeful spacing and legible line lengths. The logo's angled stroke is a restrained motif, not repeated decoration. No automatic motion or identical floating-card stack.

Homepage: panoramic photographic introduction → three practical journeys → eleven brands with useful descriptors → company context → ownership services → real event reports → contact invitation. Brand directory: searchable photographs and product-focus categories, with ordinary links present in static HTML. Brand pages: existing model imagery plus clearly worded sales/test-drive/service enquiries. Contact: intent and brand → actual phone, relevant location and supplied channel, with corporate email fallback clearly identified.

## Complete-site follow-up

The user requested the same clean presentation throughout the site and specifically rejected the heavy dark split homepage. Three further REA scenarios inspected content below the fold with explicit PageDown actions:

| Reference | Evidence ID | Applied lesson |
| --- | --- | --- |
| [Al-Futtaim automotive](https://www.alfuttaim.com/en/divisions/automotive/) | ev_4aa1b17f4b67ebf32e899788761693a353ed5c284cf7b56b434695741dcf36e9 | Photographic highlights and clear portfolio destinations; applied to Sain's own image cards and onward routes. |
| [Monnis about](https://en.monnis.com/about-us) | ev_1b51cc1ab026d406d3b2c55792f811fbb37d8ff5c51afcd7792057e363684f83 | Story, timeline and grouped company facts; Sain uses only its existing milestones and counts derived from published records. |
| [Namir automotive](https://namir.mn/ourbusiness/automotive/) | ev_bc15d98ace8e679808313bfecab00d56abed4bc15575b5643252894336271b1d | Explain each brand, then provide a direct next step. No manufacturer claims or third-party copy transferred. |

The final homepage uses a white introduction above a broad rounded manual gallery. About, brands, services, locations and news share the contact page's photographic banner and pale-grey content surfaces. Brand detail retains its working section navigation and scroll-responsive image. This follow-up did not submit competitor forms or establish their mobile performance.

## Content and operational boundaries

### Follow-up references supplied by the user

The user supplied screenshots of Monnis/Namir contacts, requested a cleaner contact presentation, and explicitly reauthorized photographs in Desktop/sainmotorsWebPhotos/WEB Photos. A further REA pass captured the requested current pages at 1440 × 1000:

- MSM automotive homepage: ev_5f7c7115c2175748a5dea00061e1cf9da25d863efd76e86fb7ae2a582f185209. Clear model/brand/service paths remain useful; an undefined model link and a visible server-error message occurred in this run, so these are not copied.
- Monnis contact page: ev_e04ddc67d9795262682ae6b710472d7463bff949c95ed52ec56cd5f5481f5518. Adopt its readable image/contact-card composition with Sain's photographs and facts. Do not borrow its office address or response-time promise.
- Namir homepage: ev_cec27a8cff4cebac8d923006dd3e49e308fcf1248a5eb61059f13c83a6162127. Concise strategic entry points and a restrained heading hierarchy reinforce the choice to keep Sain's main journeys explicit.
- Al-Futtaim homepage: ev_fcbea869f5bfd66b3085cb8d2e0ae0073d5c0762e73f80b7f59641cb8685b894. Bold scale, photography, portfolio links and company context inform the visual hierarchy; its multinational scope, numbers and video are not reused.

The resulting contact page has a photographic banner, own team image, clearly labelled JETOUR/SOUEAST showroom address, general phone/email, social links, a link to all locations and native request disclosures. Brand routing remains functional within the first disclosure. Separate HR/media contacts have not been invented. Existing derivative photos are reused; no external photo dependency was added.

User supplied BYD 4S map https://maps.app.goo.gl/BkpbhfBnyKxKoxyM8 and JETOUR map https://maps.app.goo.gl/qh4YXME6ZKwLokRQ8 with address WWC2+CJ2 J.Sambuu Street, CHD - 5 khoroo, Ulaanbaatar 15171. These are user-confirmed links; no coordinates are inferred from short URLs. Other missing pins/hours remain explicit call/search fallbacks.

SOUEAST's supplied brand statement already confirms warranty, after-sales, repairs and parts. The shared service coverage omitted it; reconcile both languages and avoid assigning a workshop without a confirmed location.

No competitor forms were submitted. The Sime filter and Inchcape search were observed as controls, not exhaustively exercised. Mobile performance, service delivery, form backends and live inventory were not established by these captures. Sain's own mobile, keyboard, filtering and deep-link behavior will be verified locally. Live sainmotors.mn could not be fetched through the web reader in this session; local export checks cannot establish remote deployment state.
