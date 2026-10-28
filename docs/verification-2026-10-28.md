# Verification — 28 October 2026

Implemented the user's research-led Sain Motors redesign in the Desktop checkout on `feat/research-led-experience`. The final contact page follows the user's Monnis/Namir references with Sain's own photographs, real address/phone/email cards, social links and native request disclosures.

## Verified result

| Check | Result |
| --- | --- |
| `npm test` | 8 files, 68 tests passed |
| `npm run lint` | Passed, no warnings |
| `npm run typecheck` and production build TypeScript phase | Passed |
| `npm run build` | Passed, including all 319 image derivatives and 11 brand marks |
| Final `node node_modules/next/dist/bin/next build --webpack` + segment fix | Passed after all source changes; 51 static pages generated |
| `npm run check:export` | Passed; 649 files, preview indexing, links/assets and one h1 |
| `BASE_URL=http://localhost:3320 node --test --test-concurrency=1 tests/e2e/` | 35 tests passed, 0 failed |
| `npm run health:check -- http://localhost:3320` | Passed; MN/EN HTML, noindex, sitemap, image and genuine 404 |
| `git diff --check` | Passed |
| Release preflight | Correctly blocked: 173 reviewed-content records, 171 awaiting approval |

All final browser tests target the exported site, rather than relying on dev-only behavior. They cover both languages; 360, 390, 768, 1440 and 1920px layouts; broken assets/runtime errors; keyboard mobile menu; native contact disclosures; no-JavaScript brand and location listings; filtering/empty-state recovery; query/history/language persistence; same-route navigation reset; and brand-specific enquiry arrival with its phone visible on mobile and desktop. 720 CSS-pixel contact checks provide a 200% desktop viewport equivalent, not a claim about every browser's native zoom behavior.

The RED→GREEN regressions include SOUEAST service coverage, exact user-provided map URLs, safe enquiry selection, confirmed workshop routing, JSON-LD escaping and the missing direct-enquiry anchor. Independent code review verified the query reset fix and identified the enquiry-arrival issue before its final regression fix.

## Visual and performance evidence

`scripts/visual-review.mjs` writes desktop/mobile viewport and full-page screenshots plus `docs/review/2026-10-28-fullsite/lab-baseline.json`. Offscreen images are visited before full-page captures so native lazy loading does not leave false grey placeholders. LCP/CLS and initial resource totals are sampled before programmatic scrolling.

These are unthrottled localhost lab observations. They do not establish production-network performance, field Core Web Vitals or INP. No external monitoring account or alert destination has been configured; the existing HTTP health checker is ready for post-deployment checks.

## Publication and factual review

The website remains a preview and is not uploaded. Preview robots and HTML intentionally disallow indexing. The content owner still needs to review 89 sourced and 82 draft records in `docs/content-checklist.csv`; the two approved records represent the existing user-confirmed eleven-brand distributor fact. No approval state was manufactured.

BYD 4S and JETOUR use the user's exact Maps short links. Darkhan uses the screenshot's 8808-5595 and marketing2@esain.mn. Its supplied directions URL targeted 0,0, so it retains a labelled map search. Dolgoon Nuur, Sansar, Darkhan and Erdenet still need precise pins; five locations still need confirmed hours. No inventory, price, finance rate or workshop affiliation was invented.

Live `https://sainmotors.mn` could not be fetched in this environment (`fetch failed`); local validation does not establish its current remote deployment, TLS or indexing state. Release preflight remains active. Once content is approved and the release package is uploaded, run the production HTTP checks described in `docs/production-release.md`.

## Review links

- Dev: http://localhost:3200/mn/contact/
- Static export: http://localhost:3320/mn/contact/
- Research and REA evidence IDs: `docs/research/2026-10-28-reference-review.md`
- Source of supplied assets/facts: `docs/content-sources.md`

## Complete-site follow-up

The final MN/EN site applies the clean contact-page direction to home, about, brands, services, locations, news and articles. Shared SiteBanner, SiteInvitation, CompanyFacts and semantic CSS tokens unify the layout. The homepage leads with the user-requested eleven-brand statement, one guidance sentence, two actions and a brighter supplied photograph. The brand section contains only eleven clickable logos with centred final rows and no descriptive text. Restrained entrance/hover effects respect reduced-motion preference.

Erdenet was added from the user announcement: Sain Electronics, Orkhon Mall, 9909-6347. Totals now derive seven showrooms in three cities. No Erdenet brand, precise pin or hours were inferred. MN/EN company copy and location structured data include the new record.

Final verification: 68 unit tests, 35 static-export browser tests, lint, types, production build, export/health checks all passed. All 23 final visual captures returned200 with no runtime errors or horizontal overflow. The obsolete service-photo scroll assertion was replaced with service shortcut and centre-layout checks; a discovered legacy grid collision was corrected. Independent review found no Important issue; its last screenshot review confirmed the brighter photo and title spacing. Windows runner1909 interruptions delayed writes; existing preview stayed available.

Preview remains noindex and has not been uploaded. The checklist contains173 records:2 approved,89 sourced,82 draft;171 need publication review. The approved hero heading reuses the existing confirmed eleven-brand fact as explicitly requested by the user, without approving unrelated text.

## Final supplied-image homepage

Applied the user-supplied home-design-reference.png after the complete-site pass. The final desktop layout places headline/actions on the left and the showroom photograph on the right against a pale surface. The small label contains only SAIN MOTORS. The three journey cards were removed so the logo-only portfolio follows directly, with six desktop columns and three phone columns; final rows are centred. Phones have a36px title,50px stacked actions on small screens and a4:3 photograph.

Fresh verification after this refinement:68 unit tests,35 exported browser tests, lint, types, production build, export and HTTP health checks passed. Visual captures were refreshed for all23 views. The new home layout contract checks both languages at360/720/1440/1920, real actions, no overflow, the desktop split and the specific phone composition.

## Latest brand-strip refinement and commit preflight
Desktop logos now flow on a 40-second cycle, with native brand-name hover titles and eleven real links. Mobile retains the approved static three-column layout. No visible playback button. Hover, touch and Space on the focusable desktop strip pause motion; reduced motion remains static. Independent review found clipped sequential keyboard focus; requestAnimationFrame plus explicit nearest scroll fixed it. The regression was observed failing before the fix and passed afterwards.
The fresh production export is `.next-verify`, served on port3340. Next.js `distDir` selects the export destination in static-export mode; the final targeted checks explicitly used this new output rather than the older `out/`. Build, three targeted browser tests (motion, sequential Tab and corporate navigation), export validation and HTTP health checks passed on this fresh output. The latest full 37-test run used the stale `out/` and failed its new focus check; it was not repeated against the new destination after the user's explicit request to finish quickly. The existing 68 unit tests, lint and types passed. No live deployment or email delivery was performed.
The requested test-drive form is still pending the chosen intake channel. Al Tayer reference structure was researched, but no form submission or new collection backend was added in this commit.
