# Active brand material — 2026-10-18

The user confirmed Desktop `brands6` (five brands) and `3brand` (three brands) as the official
supplied material and explicitly requested that its images, marks and information be used.
The eight brands now share their supplied main images between homepage cards and brand pages.
Originals are untouched. Exact paths, dimensions and SHA-256 hashes are in
[brand-material-inventory.json](brand-material-inventory.json).

| Brand | Local main image | Additional images |
|---|---|---|
| 212 | `brands6/212/Photo` mountain scene | — |
| CHERY RELY | `brands6/CHERY RELY/Photos` pickup scene | — |
| FAW BESTUNE | `brands6/FAW BESTUNE/Photo` SUV scene | — |
| FAW HONGQI | `brands6/FAW HONGQI/Photos` city scene | — |
| MAXUS | `brands6/SAIC MAXUS/Photo` commercial trucks | — |
| AITO | `3brand/Aito/M9` Midnight Black | M5 Red, M7 Blue |
| BYD | `3brand/BYD/Atto 3` city image | TI 7, Sealion 6, Shark 6 front/top/side, Atto 3 coast |
| RIDDARA | `3brand/Riddara/RD6` forest scene | — |

All sixteen supplied images appear on the corresponding brand page. Generic team artwork is
captioned with its brand when no model name was supplied. Distributor years, model lists,
showrooms and phones trace to the eight XLSX sheets. AITO M5/M7/M9 and RIDDARA RD6 model lists
are now exposed in the brand facts. No prices, availability or technical specifications were added.

## Previously sourced manufacturer alternatives (archive)

Only SOUEAST below remains active, since it is in neither supplied folder. JETOUR uses the T2 i-DM
campaign image the user supplied on 2026-10-18 (Desktop `484076260_…_n.jpg` →
`assets/photos/brands/jetour-t2-idm.jpg`, cropped below its logo overlay). CHERY uses the blue TIGGO 7 PRO MAX
photograph supplied by the user as Desktop `37620.png` on 2026-10-18. Its original 2643×1501 source is
preserved at `assets/photos/brands/chery-tiggo7-promax.png` (SHA-256
`e463ce5aaf5b7f29726482b41093e9941a4fa6994bcd150e674897ee8e6b3dd0`). The image pipeline extracts
`left: 700, top: 450, width: 1680, height: 1050` to keep the whole vehicle in the 1.6-ratio card,
then produces responsive WebP variants. The model name is visible on the vehicle plate;
no stock or specification claims are inferred. The dedicated CHERY page uses the separate road photograph
supplied as Desktop `37628.png` (3238×1821, SHA-256
`324369bac9c445f2669a234546f687b96652e9fdb237f5dd7747bb7009f03604`), preserved in
`assets/photos/brands/chery-tiggo7-promax-road.png`. Responsive object positioning at `38% 58%`
keeps the full vehicle visible in the existing desktop/mobile 4:3 and tablet 1.6 frames.
The previous TIGGO 8 source remains in the asset archive.
The earlier TIGGO 9 hero was not in the local line-up (TIGGO 2, 4, 7, 8). The other five
alternatives below have been replaced by the local team material at the user's request.

Sources were checked and downloaded on 2026-10-18. Masters are under `assets/photos/brands/`;
`npm run images` creates responsive WebP variants. No model-name overlays are added.

| Master | Model / source page | Exact image |
|---|---|---|
| `soueast-s08-teal.webp` | SOUEAST S08 (now the SOUEAST page image) | Supplied by the user 2026-10-22: Desktop `S08/Ungu songolt 3.tif` (2048×2048 studio render, colour option 3, SHA-256 8713d23fe2e4…), converted to WebP q90 unaltered; the build crops it to 1.3:1 around the car |
| `soueast-s09-kv.jpg` | [SOUEAST S09](https://www.soueast-motor.com/s09/) | https://www.soueast-motor.com/img-page/car/s09/kv.jpg (key visual, downloaded 2026-10-20; the glowing "S09" lettering in its sky was painted out with a fitted sky gradient, nothing else changed; replaced `cib_03.jpg`, a container-yard shot with a passer-by, at the user's request) |
| `chery-tiggo9.webp` | [CHERY TIGGO 9](https://www.cheryinternational.com/pc/models/tiggo/tiggo9/index.shtml) | https://www.cheryinternational.com/data/tms/website/html/images/tiggo9/kv.jpg |
| `riddara-rd6.webp` | [RIDDARA global](https://www.riddara.com/) | https://www.riddara.com/-/media/project/riddara/images/poster/home_s3_01-poster.jpg |
| `bestune-t99.webp` | [BESTUNE Saudi Arabia T99](https://bestune-sa.com/t99/) | https://bestune-sa.com/wp-content/uploads/2022/05/t99-2.jpg |
| `rely-r8.webp` | [Chery Commercial Vehicle RELY R8](https://www.cherycvglobal.com/R8) | https://www.cherycvglobal.com/images/R8/B1.jpg |
| `maxus-t90.webp` | [SAIC MAXUS T90](https://en.saicmaxus.com/car/t90.shtml) | https://en.saicmaxus.com/uploads/month_202409/images/893f44fa219fe1187c0d7d9fb3d23889.jpg |
| `hongqi-hs5.webp` | [HONGQI HS5](https://www.hongqi-auto.com/pages/cartype/cartype_hs5_new.html) | https://www.hongqi-auto.com/images/cartype/hs5-new/kv_pc.jpg |

## Marks on dark cards

Separate `logosOnDark` manifest entries preserve source colour, transparency and proportions.
The only processing is rasterisation, optical sizing and trimming empty margins/variant bands.
CHERY retains the supplied red wordmark. No CSS inversion is applied to coloured marks.

- 212, BESTUNE, RELY, MAXUS, HONGQI: supplied white PNGs from
  `C:/Users/user/OneDrive/Desktop/brands6/<brand>/Logo` (HONGQI uses `LOGO`).
  These are the same brand-team versions held in Drive. Their original source files remain intact.
- BYD, RIDDARA: black and white wordmark bands from the original SVG sheets in Desktop `3brand`.
  The black presentation panels and RIDDARA's small endorsement are excluded by luminance/band masks.
- JETOUR: official header's monochrome CSS mask from https://www.jetourglobal.com/,
  rendered in white as in the manufacturer's dark header; geometry unchanged.
- SOUEAST: https://www.soueast-motor.com/img-page/car/s09/header_logo_w.png (dark surfaces) and
  https://www.soueast-motor.com/img/header_logo.png (light surfaces; the global site's own
  light-header logo, downloaded 2026-10-22, SHA-256 405a9d44…d0ea, used as delivered).
- AITO: black and white wordmark band from `3brand/Aito/Logo/AITO_logo 1.svg`; extracted from
  the emblem sheet at vector resolution, without its black presentation background.

## User-provided local information

The eight XLSX files in Desktop `brands6` and `3brand` were read without modification. Their vehicle
categories, distributor statements, showroom details and contact numbers match the existing
brand-team content already recorded in `content-sources.md`. Homepage copy is a short web-team
summary in MN/EN and remains `draft`; supplied photographs/marks remain `sourced`.

The earlier hold on several Drive illustrations is superseded by the user's explicit source
confirmation. These images are used as supplied brand artwork, without claims about photographic
capture or inferred model names. The user's source files are not altered.
