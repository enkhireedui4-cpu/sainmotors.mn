# Homepage showroom originals

Imported at the user's request on 2026-11-10. Original files are preserved here;
the homepage uses trimmed, optimized WebP derivatives in `public/brand-showcase/`.
Vehicle geometry and colours are unchanged. No image is upscaled.

| Model | Original | Source | Dimensions | Background |
| --- | --- | --- | --- | --- |
| SOUEAST S08 | `soueast-s08-azure-grey.webp` | [Official S08 configurator](https://www.soueast-motor.com/s08/), [Azure Grey frame 33](https://www.soueast-motor.com/img-page/car/s08/azure-grey1/33.webp) | 1980 × 1114 | Transparent, original shadow |
| AITO 9 | `aito9-cosmos-blue.webp` | [Official AITO 9](https://www.aitoauto.com/en/aito9), [Cosmos Blue (2 Tones)](https://www.aitoauto.com/website-resources/global/images/aito9/outer/Cosmos%20Blue%20%282%20Tones%29.webp) | 3841 × 1793 | Transparent |
| 212 | `212-green.webp` | [Official BAW 212](https://bawauto.com/212-off-road-vehicle/), [Green image](https://bawauto.com/wp-content/uploads/2025/10/%E7%BB%BF.png.webp) | 1080 × 531 | Transparent, original shadow |
| BYD ATTO 3 | `bydAtto3.png` | User-supplied Desktop file | 1080 × 563 | Transparent |
| RIDDARA RD6 | `RIDDARA RD6.png` | User-supplied Desktop file | 1920 × 1080 | White, opaque |
| BESTUNE T99 | `BestuneT99.jpg` | User-supplied Desktop file | 870 × 568 | White, opaque |
| RELY R8 | `R8.png` | User-supplied Downloads file, replaced 2026-11-13 | 476 × 280 | Transparent |
| MAXUS C100 | `maxusC100.jpg` | User-supplied Desktop file | 2560 × 1706 | White, opaque |
| HONGQI HS3 | `Hongi.png` | User-supplied Desktop file; model name visible on the plate | 1046 × 532 | Transparent |

SOUEAST uses a 1260 × 648 crop at (300, 326), retaining the whole vehicle, to
balance its unusually wide original floor shadow; CSS softens the shadow edges.
White RIDDARA, BESTUNE and MAXUS backgrounds blend through CSS;
their image files have not had backgrounds removed.

RELY R8 now uses the gold pickup supplied as `Downloads/R8.png` on 2026-11-13.
Only fully transparent margins are removed: the 408 × 190 crop at (50, 57)
is saved losslessly as `public/brand-showcase/rely-r8-gold.webp`, preserving
the original colours, transparency and proportions. The previous black pickup
master, `aRELY-R8-negro-1024x480.webp`, remains here for provenance.

The three official downloads are also saved as full-resolution PNGs in the user's
Desktop `SainMotors-Brand-Images` folder, retaining original transparency.
Firecrawl CLI installation was unavailable in this environment; these original
assets were retrieved from the official pages through browser tooling instead.
