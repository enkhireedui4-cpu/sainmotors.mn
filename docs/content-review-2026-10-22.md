# 2026-10-22 content/source review

The review CSV and release gate now consume `src/content/registry.ts`. All status-bearing nested objects are included: home blocks, corporateHome, brand summaries/statements/headlines, teasers, cardCopy/cardPhoto, primary and gallery photos, event film poster, sections and SEO. Brand fact parents additionally review phone, models, year, location and channel URLs under `Brand.factsReview` (defaults to sourced). This prevents those facts disappearing from the content sign-off process. Owners/approvers remain blank pending the responsible person's entry.

The only newly approved fact is the user's explicit confirmation on 2026-10-22 that Sain Motors is the official distributor of 11 brands. `hero.text` references `company.distributorClaim`; the registry has two rendering paths for this one approved fact. Company introduction now includes SOUEAST and remains draft. Editorial labels, translations and historical supplied records retain their existing review states.

## Supplied material investigated

- Read all eight local `.xlsx` fact sheets in Desktop `brands6` (212, CHERY RELY, FAW BESTUNE, FAW HONGQI, SAIC MAXUS) and `3brand` (AITO, BYD, Riddara), including shared-string text and workbook hyperlink relationship targets. No opening hours for Dolgoon Nuur, Sansar, BYD4S or Darkhan were found; no Google Maps/pin hyperlink targets were present. Addresses remain the sheets' landmarks, not inferred coordinates.
- Re-read Desktop `chery/lib/content.ts` site record: Monday–Friday09:00–21:00, Saturday09:00–19:00, Sunday closed;47.904448,106.902714. Existing values are preserved. Its documented Saturday dealer-page conflict remains for the content owner.
- Rechecked `docs/content-sources.md` source references, the supplied `sainmotorsWebPhotos/WEB Photos` logo folder, Desktop `S08`, `brands6`/`3brand` filenames, and existing repository logo inventory. No supplied SOUEAST normal/light-background logo variant was found. The existing official white variant from [SOUEAST S09](https://www.soueast-motor.com/s09/) is usable on a dark plate; no logo was drawn or recoloured. A future light-background variant must have an exact official/supplied source. Later the same day that source was found: the SOUEAST global site's own light-header logo, `https://www.soueast-motor.com/img/header_logo.png`, is now the regular mark (`assets/logos/brand-soueast.png`, used as delivered), so the homepage brand panel no longer needs a dark plate.
- Read-only [JETOUR live site](https://jetour.mn/) on2026-10-22 still showed7010-8855, weekday10:30–19:30, Saturday13:00–18:00 and Sunday closed. This does not approve the copy for this site.

## Outstanding factual gaps

Four showrooms lack verified hours: `dolgoon-nuur`, `sansar`, `byd-4s`, `darkhan`. These must keep the call-to-confirm message. Five location records use a labelled map search rather than a verified pin: those four plus SOUEAST. SOUEAST's landmark match with JETOUR is not sufficient evidence to promote its map search to a pin. Supplied photos still need publication approval and any disputed location captions remain unresolved.

The broader conflicts and requests in `docs/content-sources.md` remain open, including CHERY Saturday hours conflict, shared sales lines, showroom exterior identification, MAXUS's Darkhan source, contact email choice, English review, and whether MEGA TEST DRIVE6/8 took place as announced. News uses existing edition dates/venues; no new event images, attendance counts or outcomes were fabricated.

Read-only web tool attempts on2026-10-22: `https://sainmotors.mn/` timed out and `https://chery.mn/` was inaccessible via the tool. This is not a conclusive DNS/TLS diagnosis. The old expired-certificate note from2026-10-18 has not been reconfirmed. No credentials, external deployment, server configuration or production health test was performed. See [production release instructions](production-release.md).
