# Orbis-style homepage brands

The user's latest screenshots replace the previous white logo grid with the Orbis brands section. Implement this bounded change directly in the active Desktop checkout.

## Reference and design
- Reference: https://www.orbis-auto.kz/en/#brands, inspected on 2026-11-16. Source HTML and prior REA evidence are in `.firecrawl/orbis-reference/`; the current background is `/static/img/brands__bg.jpg`.
- Observed reference values: white on black, 50px/65px regular heading, 18px supporting text, 32px heading-to-copy gap, 58.6px copy-to-grid gap, 65px pills, 10px column gap, 28.79px row gap, 1px rgba(255,255,255,.45) borders and 45px radii. Background: 1920x1080, object-fit cover.
- Use the existing system/Inter font stack. Adapt the heading and supporting copy to Sain Motors in MN and EN; derive the displayed brand count from the supplied array.
- Show the existing 11 brand wordmarks in white, centered within the outlined pills, without repeating their names below. Retain accessible link names and destinations.
- Adapt the reference's staggered rows to 4–4–3 on desktop, 3 columns on tablets and 2 on phones. Slightly offset the second desktop row; remove that offset at narrower widths. Center incomplete rows.
- Retain the supplied wordmark crops and render their transparent pixels white using a section-scoped CSS filter. This also covers CHERY, which has no white registry variant.
- Responsive heading: 50px desktop / 28px phone. Pills: 65px desktop / 56px phone. Visible keyboard focus; reduced-motion support; no horizontal overflow at 320px.

## Approach
Use the exact reference background locally and restyle the existing server component. A generated approximation would lose the contour artwork; importing reference JavaScript would add unrelated scroll behavior. No new dependency or client code is needed.

## Verification and scope
Check both languages, every logo/destination, desktop/tablet/mobile geometry, keyboard focus, hover and reduced motion. Run lint, type checking, an isolated production export, and existing homepage/destination browser coverage. Preserve unrelated uncommitted work and leave the change locally reviewable.
