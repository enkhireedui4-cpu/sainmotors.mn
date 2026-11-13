# RELY R8 implementation verification — 2026-11-13

## Implemented locally

- Existing MN/EN CHERY RELY routes now render the reference-based R8 experience:
  one vehicle banner, mission/values, four terrain views, four technical detail panels,
  accessories, powertrains, local brochure dialog and test-drive form.
- The user-requested blue RELY banner and CHERY RELY title/action section are removed.
  Showroom, related brands, corporate header/footer and homepage gold R8 remain.
- The test-drive form now asks for city: Ulaanbaatar is selected by default,
  with Erdenet and Darkhan available in both languages. The selected value is
  validated and included in the lead record; country remains Mongolia.
- RELY × Sain Motors now sits directly before the lead form on one shared gray
  background. Identity/phone and brand copy use two columns on desktop and stack
  on mobile. Repeated manufacturer/global-market notes are removed.
- The supplied two-page brochure replaces the dialog's reference image. Both
  optimized pages display inline; opening/downloading uses the unchanged PDF.
  The browser download's SHA-256 matched the local original, and the preview
  server returned the PDF MIME type and correct partial-content response.
- Desktop/mobile hero advertising text is removed from two derived images.
  `RELY R8` is the visible HTML h1; Mongolian tagline is native HTML text,
  `Дэлхийг ухаалагжуулна`. The English route retains its English tagline.
  Built-in imagegen supplied the reconstructed sky. Glyph masks and boundary
  matching remove source compression halos without rectangular patch edges;
  every decoded pixel outside the text bounds remains identical. Dimensions
  stay2560×1440 and1125×2433. Source assets are unchanged. Rebuild command,
  final paths, hashes and prompt are recorded alongside the source patches.
- 44 optimized source images total 6.94 MiB. Source hashes, output hashes,
  dimensions and origins are in `rely-r8-assets.json`; original ratios are
  preserved without enlargement.
- New Supabase intake validates, stores privately, and acknowledges only a
  completed insert. The browser contains no database credential. The migration,
  Edge Function and deployment instructions are ready.

## Fresh checks

| Check | Result |
| --- | --- |
| Full unit suite |188/188 pass,11 files;94 R8-specific tests |
| Full ESLint | Pass |
| TypeScript | Pass |
| Earlier dev browser integration |18/18 pass: R8, homepage showcase and other brand experiences |
| Production build | Pass,47 static pages |
| Static export checker | Pass,679 files; local links/assets/headings and preview indexing |
| Current export browser integration |5/5 R8 tests pass in both languages, including city selection/payload and removed sections |
| Current static mobile/desktop sweep |1920,1440,768,390,375px: joined introduction/form; both brochure pages load; removed notes absent; no overflow or page errors |
| Localized hero sweep |1920×1080,1440×900,768×1024,390×844,375×667: native heading/tagline, correct responsive asset, no overflow or page errors |
| Earlier static viewport sweep |1920×1080,1366×768,375×667: no overflow, broken displayed images or page errors |
| Asset manifest |44 output files verified against source dimensions and hashes |
| Secret boundary | No `SUPABASE_SERVICE_ROLE_KEY` reference in static browser chunks |
| Independent reviews | Backend and final frontend/integration reviews approved without material findings |

Lead tests use controlled local HTTP or intercept only the chosen Supabase
endpoint. They exercise failed/malformed acknowledgement, delayed persistence,
input retention, consent, validation and duplicate-submit prevention. No live
visitor lead or manufacturer submission was sent during these local tests.

Production screenshots (gitignored) are at
`docs/review/rely-r8/refined-1920-enquiry.png`, `refined-390-enquiry.png`,
`refined-1920-brochure.png` and `refined-390-brochure.png`. Earlier top-of-page
captures remain at `latest-desktop-top.png` and `latest-mobile-top.png`.
Latest native-text hero captures are `localized-hero-1920.png` and
`localized-hero-390.png`.

## Live deployment remains pending

The local link cache identifies `uzffaelpmhwffcuiqgjq`. The agent environment
cannot read the authenticated CLI token, and a Supabase plugin connection has
not been confirmed. No live migration, function deployment, or production lead
storage is claimed by the checks above.

`scripts/deploy-r8-leads.cmd` is ready to run in the user's authenticated Windows
environment. It previews/applies only the two prepared R8 migrations, configures
exact origins, deploys only this function, and runs
`scripts/verify-r8-deployment.mjs`. The verifier checks database privileges/RLS,
CORS, rejected consent/origin, and one uniquely named synthetic request; it
confirms saved values and removes the acknowledged synthetic record.

A successful run writes the ignored
`.tmp-assets/r8-deployment-verification.json`. It is currently absent.
If the verifier loses the acknowledgement after an insert, a marked synthetic
row can remain and the helper reports failure rather than claiming cleanup;
inspect only that deployment-check marker before removing any such test row.
The normal cleanup includes UUID, synthetic identity and the test-only phone.

Local built preview: http://localhost:3300/mn/brands/rely/
