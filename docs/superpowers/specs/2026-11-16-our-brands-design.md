# Our brands design

## Intent and authorization
The user requested a completed redesign using Superpowers planning and design skills, with a short "Our brands" heading and well-centered logos. Their final supplied Bada Car screenshot defines the result: a spacious white brand grid, large logos and a brand name beneath each, with no visible button frames. This is a bounded refinement of the current local homepage.

## Approaches
1. Outlined logo cards: clear individual boxes, but they differ from the user's final borderless reference.
2. Open logo-and-name grid: chosen to match the reference's white space, larger marks, four desktop columns and names beneath the logos.

## Design
- English heading: "Our brands". Mongolian heading: "Манай брэндүүд".
- A short centered heading replaces the long promotional heading; one concise supporting line follows it, as in the reference.
- White #ffffff base and near-black #111317 heading and labels. Existing logo colors remain; no visible borders, shadows or contour artwork.
- Keep the native SF / local Inter stack: 600-weight heading, 36px maximum desktop and 24px mobile, close tracking. Supporting line: 16px desktop, 13px mobile.
- Desktop geometry follows the supplied 1916px reference: a 1408px maximum list gives four evenly spaced 352px columns; logo centers and captions repeat on an approximately 297px row pitch.
- Four equal columns at >=1024px, three at 768–1023px, two below 768px. Flex wrapping centers incomplete rows automatically.
- Each rectangular click target contains a centered logo area above a centered brand name. Logo area height: 200px desktop/tablet, 80px phone. No visible frame.
- Gaps between columns: zero desktop, 24px tablet, 20px phone. Row gaps: 44px desktop/tablet, 24px phone. Logo-to-name gaps: 32px / 12px.
- Wordmarks: up to 48px desktop / 32px mobile and at most 256px wide, scaled proportionally. The visible crop is centered within the logo area. Labels: 14px/400 desktop and 13px/400 mobile.
- Keep all 11 registry brands, their ordering, existing links, accessible names and the established BESTUNE/MAXUS/HONGQI wordmark crops.
- Hover changes the label color and focus outlines the full link without moving it; reduced motion disables transitions.

## Scope and constraints
Keep the section above services. Preserve the existing homepage hero, company/photos/facts, services and footer; the removed news/invitation sections stay absent. Use current assets, no new dependencies or client JavaScript. Apply the bounded changes in the user's active Desktop checkout, preserving its existing uncommitted work. Leave the result locally reviewable; no commit, push or deployment is requested.

## Acceptance
Verify MN/EN at 320, 355, 390, 430, 768, 1024, 1440 and 1920px. All logos and names appear; link dimensions match per breakpoint; each logo's visible center differs from its logo-area center by under 1px; proportions remain correct; no overlap or horizontal overflow occurs. Check keyboard focus, internal brand navigation, external hrefs and final production screenshots.
