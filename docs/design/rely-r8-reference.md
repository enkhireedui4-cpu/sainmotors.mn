# RELY R8 reference system

Reference: https://cherycvglobal.com/R8, captured 2026-11-13. This records
observed source choices separately from the Sain Motors integration proposal.
Implementation scope: [R8 design](../superpowers/specs/2026-11-13-rely-r8-design.md).

## Evidence and collection

Firecrawl CLI acquisition was blocked by the environment's npm network policy
(`EACCES`). Browser downloads retained HTML, four injected stylesheets, fourteen
initial scripts, the additional configuration-page script, screenshots, and
54 image/font/data files in `.firecrawl/r8-reference/`. No reference lead was
submitted. This is browser collection rather than a successful Firecrawl run.

REA analyzed the selected R8 and test-drive chunks as inert JavaScript.
Parent evidence: `ev_3448a0be100ae529924d2ee1f6696a5b03497f5ff2d676d40cde1e241c45b977`.
Dynamic calls and unselected vendor code remain outside established coverage.
The saved summary preserves the analysis limitations.

## Extracted visual choices

- Main product surface: `#1e1e1e`; white headings; secondary copy `#d0d0d0`.
- R8 accent: `#e68237`; subdued borders and inactive tab labels use grey.
- Source typefaces: Poppins Regular, Poppins Light, Poppins Bold, supplied as
  OTF. The observed computed family starts with `regular` and has system fallbacks.
- Source scaling: its rem utility makes 1rem approximately 75px at a 1440px
  desktop viewport; mobile uses a separate 750-unit design basis. These values
  belong to the reference, not Sain Motors' global root font.
- Desktop hero occupies the viewport and overlays the source's corporate
  navigation. Two photographic banners include their own English lettering.
- Mission, scenery, features, accessories and powertrain sections span the
  viewport with dark image backgrounds and substantial spacing.
- Desktop feature categories form four tall columns. Selecting a category
  leaves its image beside a scrollable detail area and a close control.
- At 768px and below, categories stack as wide image tiles and details use a
  full-screen panel. Mobile-specific banner and section backgrounds are supplied.
- Test-drive area uses a pale grey photographic background, a yellow R8 side
  view on the left and a narrow form on the right. Mobile stacks these elements.
- Form inputs have underlines rather than boxed borders; consent is a square
  checkbox and the wide dark SEND button sits below it.

## Observed behavior

- Hero: two slides, arrows, pagination, 800ms transition and 8-second autoplay.
- Terrain selector: four scenery images and labels; mobile includes swipe.
- Feature selection: TOUGH, STRONG, RELIABLE, INTELLIGENT; scroll position resets
  when a panel opens. Source title reveals use GSAP/ScrollTrigger.
- CONFIGURATION goes to `/R8detail`, whose component displays the same long
  `R8detailmb.jpg` specification image for desktop and mobile.
- Test-drive fields: country, first name, last name, mobile and consent.
  Country data is a local JSON feed with 192 records; Mongolia is index 112.
- Source submission is POST `/api/userInformation/save`, with car model R8,
  language, country, combined name, phone number and type 2. This receiver
  belongs to the reference site and is not the Sain Motors destination.
- Source validation only checks truthiness and does not expose a form-specific
  transport failure state. Its privacy modal names SOUEAST rather than RELY.

## Proposed Sain Motors adaptations

- Retain the existing CHERY RELY title, corporate header/footer, true local
  contact/location records and MN/EN routes. Replace its generic product
  presentation with the R8 experience, avoiding duplicate full page sections.
- Scope product CSS and its viewport-based sizing; leave the global rem scale
  intact. Use Cyrillic-capable existing fonts for Mongolian text.
- Rebuild interactions in React rather than executing copied Nuxt, analytics,
  jQuery, GSAP or third-party form code. Preserve the observed section order,
  imagery, palette, typography hierarchy and responsive composition.
- Add keyboard/focus handling, reduced-motion behavior, explicit input errors,
  duplicate-submit protection and truthful transport states.
- Present manufacturer specifications as global model information, separate
  from any confirmed Mongolian stock/equipment. Add no invented price or availability.
- A local accessible configuration dialog may show the downloaded specification
  image with an open/download link, instead of navigating to the manufacturer's site.
- Final lead storage/delivery depends on the user's nominated Sain Motors
  recipient or service. Static export cannot host a Next POST route.

## Reference screenshots

Local, ignored captures under `.firecrawl/r8-reference/`:

- `desktop-top-clean.png`: 1440×900 hero after rejecting source cookies.
- `desktop-feature.png`: expanded source feature behavior.
- `desktop-lead.png`: desktop lead composition.
- `mobile-top.png`, `mobile-lead.png`: 390×844 source layouts.

Source screenshots and source CSS establish the reference. Pixel equality for
the new implementation has not been measured because implementation awaits
approval of the design and the lead recipient remains undecided.
