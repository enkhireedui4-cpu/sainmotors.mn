# SAIN Motors About page

Implement the supplied three-part composition in MN/EN. Palette: black #000, white #fff, supporting gray #b6b6b6, subtle white borders #ffffff66. Use existing sans typography, large regular-weight statements and generous space, with Sain's sourced photography.

- [x] Inspect current content, image assets, links and Next CSS guidance.
- [x] Build black introduction with a large statement, portrait crop of the showroom team and the supplied paragraph.
- [x] Build a full-width showroom photograph with a dark overlay, SAIN logo and 11 linked white wordmarks in the approved order. Desktop 6+5; mobile two columns.
- [x] Build a white sales/service composition with two photographs, the supplied statement and paragraph, and showroom/service links.
- [x] Verify both locales, responsive layout, image loading, keyboard focus and brand destinations; run lint and production build.

Use the existing daytime exterior honestly with a CSS overlay; do not invent a dusk photograph. No key handover image or unsupported company statistics. Keep the shared header, title band and footer. Preserve unrelated pending changes. No deployment requested.

Verification: lint and isolated Next production export passed (47 pages, TypeScript included). All four focused production browser tests passed on port 3306: About at MN/EN 320/390/768/1024/1920 with linked order, 6+5 desktop rows, tablet and mobile layouts, loaded images, keyboard focus and no-JavaScript links; shared inner-page title bands and reduced-motion homepage regression. Inspected desktop/mobile screenshots in `.tmp-assets/about-*.png`. Independent source review reported no blocking findings. Existing homepage crop logic now lives in a shared BrandWordmark component.
