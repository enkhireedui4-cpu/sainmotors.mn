# Sain Motors Orbis-inspired homepage
Date: 2026-11-15

## Intent and scope
Implement the user's requested homepage redesign directly in the Desktop sainmotors.mn project. Follow the composition at https://www.orbis-auto.kz/en/ using Sain Motors identity. Replace the current video hero, logo marquee and vehicle showcase. The user's follow-up also replaces the old company photo/facts block and after-sales photo/list block with a large centered statement, four automotive photos, network figures and photographic service cards. Keep news, the closing showroom invitation and localized routes.

## Design
Near-black full-viewport opening with a compact dark header, large white single-line SAIN MOTORS wordmark across the middle, left service label, right short brand statement and bottom social links plus a circular S emblem beside the company description. The visual centerpiece is a dimensional crimson S with subtle moving light trails, replacing Orbis's globe. A discreet down control scrolls to the company section. On phones the same hierarchy stacks without horizontal overflow; the description remains readable.

Palette: midnight #05080d; carbon #0c1016; Sain red #e20a17; reflected red #ff514a; warm white #f7f7f5; muted silver #a4a8b0.
Type: after the user's iPhone screenshot, use self-hosted Inter for clean sentence-case headings, body and navigation with weights 400–600, close tracking and a clear size hierarchy. Retain Zona Pro only for the SAIN MOTORS wordmark and decorative S emblem.
Exact EN description: "Our company is the epitome of reliability and high-quality service. Sain Motors is a group of companies that includes 11 different car brands."
MN description translates the supplied statement. Motion honors reduced-motion preferences, pauses offscreen and when the tab is hidden, and has a static SVG fallback. No new dependencies or copied third-party video.
Network figures are 11 brands, 7 showrooms, 2 4S showrooms and 3 cities. The 4S figure was confirmed directly by the user on 2026-11-15; other figures derive from the existing published brand/location registry. Do not add the 4S subset to the showroom total.

## Approaches
1. Reuse the Orbis globe video: closest image, but the user asked to remove the current video and personalize the centerpiece.
2. Build a custom S with native SVG/CSS and a small animation controller: chosen as it keeps the reference composition, fits Sain's brand and avoids a heavy renderer.
3. Add a third-party 3D engine: unnecessary for this bounded first-screen change.

Implementation choices are agent decisions within the user's requested local reversible change. The user's detailed request authorizes implementation; no publication or deployment is included.

## Evidence
The source page HTML and script are saved under .firecrawl/orbis-reference. REA observed page readiness and statically analyzed script.js (3,034 AST nodes; 1 parsed source). Main video loops near its ending; header appearance changes after scrolling beyond the banner; body statement words reveal on scroll. Static analysis is partial and does not establish every runtime behavior.
Firecrawl CLI acquisition failed with network EACCES; a Firecrawl connector suggestion was surfaced. Source capture used browser DOM and fetch, not Firecrawl.

## Validation
Check both languages, desktop and phone layouts, real navigation and down link, single H1, no removed hero/video/marquee/showcase requests, reduced motion, offscreen pause and no page errors. Run lint, TypeScript and relevant unit checks plus a production static build.
