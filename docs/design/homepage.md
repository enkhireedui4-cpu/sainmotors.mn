# Sain Motors homepage design

The user supplied [this master reference](homepage-reference.png) on 2026-11-10
and asked to retain its design. It is the visual reference for future homepage
changes. Preserve the existing MN/EN content, official wordmarks and real photos.

## Composition

1. White header with the Sain Motors logo, navigation and MN / EN switch.
2. Pale grey split hero: the eleven-brand distributor statement on the left,
   showroom photography on the right, and two direct actions. The photo position
   sits inside the bottom-left corner; round arrow controls sit bottom-right.
3. White band with a centred heading and the existing moving brand wordmarks.
   Desktop uses an open band without rules or separators. The mobile reference
   adds fine rules around the heading and between the moving wordmarks.
4. A complete vehicle studio screen with a left-aligned headline, large faint
   brand lettering, the featured car and faded neighbours. The full brand and
   model name, short tagline, red brand link and the position indicator follow.
   The user's final refinement removes the separate logo above the car. Its
   height is reclaimed by the stage, with the car and lettering lifted slightly
   on desktop and mobile instead of leaving an empty logo row.

At 896px and above, retain the split hero and full header navigation. Smaller
screens stack the hero and retain comfortably sized controls. The studio adapts
to the viewport height below the sticky header; short landscape screens can scroll.

## Mobile reference

The user supplied [the mobile layout](homepage-mobile-reference.png) on 2026-11-10.
Below 768px, preserve this downward flow:

- A compact header following the latest [logo, MN / EN and menu reference](mobile-header-language-reference.png): a 144px Sain Motors logo, visible language selection and a small menu icon with a 44px touch target.
- The red-stroke company label, a large three-line Mongolian heading, short lead,
  and two adjacent actions with at least 44px of touch height.
- A wide showroom photo, round chevron controls at its bottom-right, and four
  working selectors below the image. The current selector is a red pill.
- A single moving wordmark row below a centred heading. All eleven links remain
  reachable by keyboard. Reduced motion uses a static grid.

Desktop retains its photo counter, arrow controls and existing composition.

The earlier [compact header reference](mobile-header-reference.png) is retained
for history; the latest language-switch reference above takes precedence.
The mobile hero uses the reference's pale blue surface (`#f0f4f8`), dark heading
(`#141c20`) and muted copy (`#64717a`, keeping readable text contrast). Show the supplied photo without a dark
counter overlay; the smaller visible arrow circles retain 44px touch targets.

## Mobile vehicle studio

Follow the user's latest [studio reference](brand-studio-mobile-reference.png),
with the separate brand logo omitted as explicitly requested:

- Keep the eyebrow at the left and centre the two-line section heading. Use
  `Таны сонголт` / `Таны брэнд` without full stops on mobile; desktop keeps the
  separating full stop in `Таны сонголт. Таны брэнд` and omits the trailing one.
- Frame the complete vehicle against large, faint brand lettering, with quiet
  glimpses of the adjacent vehicles at the edges.
- Centre the full brand/model name, tagline and red brand link below the car.
- Place the two circular arrow controls below the caption. A progress line sits
  between them, with the current position centred beneath the line.
- Fit the complete studio beneath the 72px sticky header on ordinary portrait
  screens; retain natural scrolling on short landscape screens.

The same pair of controls serves both layouts. Desktop keeps its arrows beside
the vehicle and its inline progress/count row; phone controls form a footer.

## Visual language

| Role | Value |
| --- | --- |
| White surface | `#ffffff` |
| Hero surface | `#f3f6f8` |
| Studio surface | `#f3f6f9` |
| Main text | `#172126` |
| Studio text | `#171719` |
| Accent | Existing Sain red, `#e20a17` |
| Faint brand lettering | `#e1e4e9` |
| Headings | Existing self-hosted Zona Pro, weight 700 |
| Body and controls | Existing self-hosted Inter |

Use generous space, restrained rounding, and the red diagonal stroke already in
the brand. Keep the supplied content hierarchy and section order. Gallery photos
and vehicles change on visitor input; the existing logo loop pauses for hover,
keyboard focus or reduced motion. Keyboard focus stays visible during changes.
