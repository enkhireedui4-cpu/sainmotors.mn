# Editing the site

All copy, links, phones and image choices live in `src/content/` as plain TypeScript objects with a
Mongolian (`mn`) and English (`en`) value side by side. Layout code never holds text. After editing,
run `npm run dev` and check http://localhost:3200/mn/ and /en/.

| To change | Edit | Notes |
|---|---|---|
| Corporate hero (title, statement, navigation) | `src/content/hero.ts` | Hero image comes from `sitePhotos.hero`; approved distributor statement references `company.distributorClaim`. |
| Company introduction, brand-history years | `src/content/company.ts` → `company` | `milestones` must match each brand's `since`. |
| Showrooms, service centre, hours, phones, maps | `src/content/company.ts` → `locations` | Omit `hours` if unconfirmed: the site then asks visitors to call. `map.precision: "pin"` only for verified coordinates. |
| Services and which brands they cover | `src/content/company.ts` → `services` | List only brands the sources confirm. |
| A brand's text, headline, year, phone, showroom, links, photos | `src/content/brands.ts` | A link shows only with `live: true` (check it opens first). |
| Section headings and page introductions, SEO titles/descriptions | `src/content/pages.ts` | Descriptions: 50–170 characters (a test checks this). |
| Buttons, labels, menu words | `src/content/ui.ts` | |
| Section photos (story, about) | `src/content/photos.ts` | |

## Adding or replacing images and logos

1. Put the original in `assets/photos/` (or `assets/photos/brands/`) or `assets/logos/brand-<slug>.(svg|png)`.
2. Register it in `scripts/build-images.mjs` (`PHOTOS` or `LOGOS`), then run `npm run images`.
3. Reference the key from the content file and write an honest `alt` in both languages.
4. Record the source in `docs/content-sources.md`. Do not use AI-generated pictures as brand photography.

## Approval status

Every block has `status`: `draft` (web team), `sourced` (from Sain Motors' own material, not yet
approved for this site) or `approved` (content lead). Open any page with `?review` to outline drafts.
`npm run build:release` refuses to build until all registry records are `approved` and every brand has a usable supplied logo variant;
`npm run content:checklist` exports the review table to `docs/content-checklist.csv`.

The review table and release gate share `src/content/registry.ts`; new status-bearing nested content belongs in that registry. Do not maintain a second CSV list. The registry automatically includes all exports from `home.ts`; register any new content modules explicitly. Brand channels/phones/models/years/showroom facts are reviewed through `Brand.factsReview` (defaults to sourced until an explicit review is recorded). The CSV Owner and Approver columns are deliberately blank. Only an actual publication approval changes a typed source status; editing CSV alone does not change the site.

Use [the release workflow](production-release.md) for preview/release indexing, Apache templates, ZIP/checksums, backup and rollback. Current source gaps are recorded in [the 2026-10-22 review](content-review-2026-10-22.md).
