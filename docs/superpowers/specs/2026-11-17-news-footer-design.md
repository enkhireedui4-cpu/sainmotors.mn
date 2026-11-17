# News and footer reference refinement

User supplied two Orbis screenshots and explicitly requested implementation with Reverse Engineer Anything and Superpowers. Reuse the captured source evidence and measurements in `docs/design/orbis-pages/DESIGN.md` and `.firecrawl/orbis-reference/rea-analysis.json`.

- News: black band, centered Home page / breadcrumb, regular 70px title at 1920px, then four outlined category pills (54px high / 30px gap at 1920px). Active pill white with black text. Scale down to the reference's 1440px measurements; keep phone buttons at least 44px and horizontally scrollable.
- Categories: All news, News, Mass media about us, Corporate and social responsibility, localized to Mongolian. Existing events are news; unsupported categories show an honest empty state. Preserve story routes and content. Future events may explicitly choose a category.
- Footer: pure black, white Sain logo and a short sourced company description at left. About, Brands and Contact links at upper right with skewed hairline separators. Social icons, copyright and back-to-top link share the lower right row. Keep a privacy link under the description. Stack on phones with no overflow.
- Preserve the existing system/Inter typeface and Sain assets. Do not invent Career or press/CSR articles. No copied Orbis text or logo.
- Implement with the existing PageBand, a small client-side filter wrapper and scoped footer CSS. No new dependency. Work in the dirty active branch, preserving all earlier page changes.

Verification: functional categories, empty states, localized footer routes, keyboard controls, back-to-top and overflow at 320/390/768/1440/1920; existing news navigation; lint, typecheck and production export. No publishing requested.
