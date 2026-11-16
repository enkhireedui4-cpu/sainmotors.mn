# Homepage brand section

Source: [Orbis Auto brands](https://www.orbis-auto.kz/en/#brands), inspected 2026-11-16, and the user's two screenshots. Reference HTML, CSS observations, artwork and retained REA evidence are in `.firecrawl/orbis-reference/`. The supplied Orbis screenshot is the visual authority for this section.

| Role | Observed reference value | Sain implementation |
|---|---|---|
| Base / text | Black / white | `#000` / `#fff` |
| Pill border | 1px white at 45% | `#ffffff73` |
| Heading | Aeroport 400, 50px/65px | Existing system/Inter 400, 50px/65px |
| Supporting text | 18px, 32px below title | 18px/1.4, 32px gap |
| Grid spacing | 58.6px above, 10px columns, 28.79px rows | 58.6px, 10px, 28.8px |
| Pills | 65px height, 45px radius | Same desktop geometry |
| Wordmarks | Up to 134px wide / 25px high | White supplied wordmarks, same limits |
| Artwork | `/static/img/brands__bg.jpg`, 1920×1080, cover | Local WebP conversion, 1920×1080, cover |

The original image URL is `https://www.orbis-auto.kz/static/img/brands__bg.jpg`. `public/art/orbis-brands-bg.webp` preserves the reference artwork and removes metadata during conversion. Logos are Sain Motors' existing supplied assets, not Orbis' brand portfolio.

Adaptations: the count follows Sain's 11 published brands, rows use 4–4–3 with a 65px second-row offset, then 3/2 responsive columns. Every pill contains a complete wordmark, so repeated visible captions are unnecessary; accessible names remain. The original reference's pinning/blur animation is outside the requested visual change. No extra client JavaScript is added.

Keyboard focus uses a white 2px outline; hover raises border contrast and adds an 7%-white fill. Reduced motion disables the transitions. At phone widths the heading is 28px, supporting text 14px, pills 56px and wrapping remains centered.

Verification screenshots: `docs/review/orbis-brands/`. Detailed viewport results: `.tmp-assets/orbis-brands-review/verification.json`.
