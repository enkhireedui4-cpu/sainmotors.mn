# Content sources and asset provenance

Reviewed 2026-10-17 by the web team (Enkh-Ireedui). Read-only access; no Drive file, folder or
sharing setting was changed. Drive links are kept here, never in page markup.

**Status rule.** Everything taken from the Drive sheets is *received from the brand teams*, not
*approved for publication*: it is `sourced` in `src/content/`. Web-team wording and translations are
`draft`. Only the content lead (Dashnyam) moves anything to `approved`.

## 1. Folders reviewed

| Folder (owner) | Drive ID | Contents |
|---|---|---|
| 212 team (m.monkhitgel) | `1Za5YjBNyjGyOcXiD2pwGmcjqjltFAtdC` | 212, CHERY RELY, FAW BESTUNE, FAW HONGQI, SAIC MAXUS; **Chery team folder is empty** |
| BYD team (tuguldur.esain) | `1salTROyzZM60McS5STiJCQAH0tn5LMOc` | Aito, BYD, Riddara |

Each brand folder holds one fact sheet (MN/EN columns: official name, short introduction,
distributor statement, official web link, sales phone, hero headline), a Logo folder and photos.

## 2. Brand facts

| Brand (public name) | Sheet (Drive ID) | Sain Motors relationship, per sheet | Showroom, per sheet | Sales line | Links verified 2026-10-17 |
|---|---|---|---|---|---|
| JETOUR | — (no Drive folder) | Official distributor (jetour.mn page title) | C1 TV building, Chingeltei (jetour.mn) | 7010-8855 (jetour.mn) | jetour.mn ✓ |
| JETOUR | Desktop `jetourMedeelel/JETOUR_BRAND123.xlsx` (supplied by the user, 2026-10-22) | Sheet: official distributor since 2023; introduction and distributor statement (MN/EN); hero title "JETOUR — Beyond the Horizon"; official link jetourglobal.com (not linked: brand pages link only Mongolian channels) | Showroom in front of the Holiday Inn (C1 building); service centre north-west of TPP-4, Khan-Uul | Sales 7277 8855 (sheet); showroom 7010-8855 | jetour.mn, Facebook ✓ |
| SOUEAST | SOUEAST BRAND sheet (screenshot supplied by the user, 2026-10-22) | Sheet: founded 1995 in Fuzhou, Fujian; official distributor since 2026; models S06, S07, S08 | JETOUR showroom (sheet) | 7277-8855 (sheet; supersedes the Facebook intro's 7299-8866) | Facebook page ✓ |
| CHERY | — (Chery team folder empty). Read 2026-10-18 from Sain Motors' own CHERY site project, Desktop `chery` (`lib/content.ts` `site`, `PRODUCT.md`, `messages/mn.json`) | Official distributor (`site.role`); TIGGO 2, 4, 7, 8; factory warranty 3 years or 100,000 km; leasing from 10% down, up to 96 months | Narny Khoroolol, Parko Riveria, 26th khoroo, Bayangol (map pin 47.904448, 106.902714); Mon–Fri 09:00–21:00, Sat 09:00–19:00 | 7255-8855 | chery.mn ✗ (no DNS on 10-17 and 10-18) |
| BYD | Мэдээлэл BYD `1ROO7xP1…` | Official distributor **since 2025**; TI 7, Shark 6, Sealion 6, Atto 3 with factory warranty, after-sales service, professional repair and parts | BYD 4S showroom, Moscow Street, Bayangol (SW of Tsambagarav centre) | 7250 8855 | byd.com/en ✓ |
| RIDDARA | Мэдээлэл Riddara `1OFghaed…` | Official distributor **since 2025**; warranty, after-sales service, advice | Dolgoon Nuur, opposite Computer Mall, Chingeltei | 7270 8855 | riddara.com ✓ |
| AITO | Мэдээлэл AITO `1ZE7T1Bz…` | Official distributor **since 2025**; warranty, after-sales service, advice | Sansar, west of the Petrovis station, 12th microdistrict, Bayanzürkh | 7211 8855 | aitoauto.com/en ✓ |
| 212 | 212 Мэдээлэл `1aFdIXlF…` (sheet "212") | Official distributor **since 2025**; warranty, after-sales service, advice | Dolgoon Nuur, opposite Computer Mall | 7222 8855 | Facebook "BAW 212 Mongolia – Sain Motors" ✓ |
| BESTUNE | FAW BESTUNE мэдээлэл `1baHpfb6…` | Official sales **since 2025**: B70, T77, T90, T99, NAT PRO | Sansar, west of the Petrovis station (Bestune showroom) | 7299 8855 | Facebook FAWBestuneMongolia ✓, BestuneSainmotors ✓ |
| RELY | CHERY RELY Мэдээлэл `11FhDgHS…` | Official distributor **since 2026**; pickup, warranty, after-sales service, advice | Dolgoon Nuur, opposite Computer Mall | 7222 8855 | Facebook chery.rely.mongolia.sainmotors ✓; cherycvglobal.com ✓ |
| MAXUS | SAIC MAXUS мэдээлэл `1-dNY02G…` | Official distributor **since 2025** | Darkhan: on the road from Darkhan Plaza to New Darkhan (212 team sheet "MAXUS" only) | 7299 8855 | en.saicmaxus.com ✓ |
| HONGQI | FAW HONGQI Мэдээлэл `1lsnBH29…` | Official distributor **since 2024**; luxury sedans and SUVs with warranty, after-sales service, advice | Sansar, west of the Petrovis station | 7200 8855 | Facebook HongqiMongolia1 ✓ |

**Brand count.** Eleven: the ten on the company banner plus HONGQI, which has a complete sheet,
logo and distributor statement. HONGQI is the "eleventh brand" in the brief.

### Conflicts kept for the content lead (not silently resolved)

1. **RELY**: the brand file calls it "CHERY RELY", relaunched 2025 under Chery Group; an older sheet
   says "Rely" under Chery Commercial Vehicle with phone 7299 8855. The site follows the dedicated
   brand file (CHERY RELY, 7222 8855) and shows the brand as **RELY** in listings (its logo).
2. **BESTUNE**: two introductions (with/without "70-year FAW history"); site uses the dedicated file.
   Web link: faw.com (older sheet, certificate expired 2026-10-17) vs two Facebook pages (dedicated
   file). Site links FAWBestuneMongolia.
3. **MAXUS**: showroom (Darkhan) appears only in the 212 team's shared sheet, not in the MAXUS file.
4. **JETOUR phone**: 7010-8855 (jetour.mn contact data) vs 7277-8855 (jetour.mn news posts).
5. **Showroom-3 exterior** (garage doors, gravel yard) is labelled the JETOUR showroom since the
   jetour.mn build; confirm it is not the service centre.
6. **Dolgoon Nuur vs C1 TV building**: both are in Chingeltei; confirm they are separate showrooms.
7. **RIDDARA intro** says it is "the export name of Riddara" (probably Geely Radar): reworded to "a Geely
   Holding brand"; please confirm the intended wording.
8. **RIDDARA statement** calls it a "luxury electric" brand (same words as the AITO statement); left out as a
   likely copy-over. The site keeps the distributor fact and year only.
9. **CHERY Saturday hours**: the CHERY site's contact page and footer say 09:00–19:00, its dealer page
   09:00–21:00. The site follows the two that agree.
10. **Shared sales lines**: 7299 8855 is given for both BESTUNE (Sansar) and MAXUS (Darkhan), and 7222 8855
   for both 212 and RELY (Dolgoon Nuur). Both match their sheets; confirm they are intended.

### Brand channels (2026-10-20)

Each brand links only to its Mongolian channel run by Sain Motors: its Facebook page, plus jetour.mn for
JETOUR. International manufacturer sites are no longer linked (user's instruction, 2026-10-20). Pages
were identified by name through Facebook's public page plugin (`/plugins/page.php?href=…`), since
facebook.com refuses anonymous requests.

| Brand | Channel | Page name / evidence |
|---|---|---|
| JETOUR | jetour.mn; facebook.com/Sainmotors.mn | "Sain Motors - Сайн Моторс ХХК", where JETOUR news is posted (user's instruction, 2026-10-20); jetour.mn links the same page. The brand pages "Jetour Mongolia - Sain Motors" (id 100093386917379, 19K) and its 110-follower namesake are not used |
| CHERY | facebook.com/CheryMongolia | "Chery Mongolia - Sain Motors"; chery.mn still hidden (no DNS) |
| BYD | facebook.com/profile.php?id=61579315933755 | "BYD Mongolia - Sain Motors Authorized Distributor": the hyperlink behind the BYD sheet's web-link cell. facebook.com/bydmongolia belongs to another distributor |
| MAXUS | facebook.com/profile.php?id=61572688311986 | "SAIC Maxus Mongolia - Sain Motors": the MAXUS sheet's "Facebook" hyperlink |
| 212 | facebook.com/profile.php?id=61574822528259 | "BAW 212 Mongolia - Sain Motors" |
| RELY | facebook.com/chery.rely.mongolia.sainmotors | "Chery Rely Mongolia - Sain Motors" |
| BESTUNE | facebook.com/BestuneSainmotors | "Bestune Mongolia - Sain Motors", 18K followers, the dedicated sheet's hyperlink; replaces FAWBestuneMongolia ("FAW Bestune Mongolia - Sain Motors") |
| HONGQI | facebook.com/HongqiMongolia1 | "Hongqi Mongolia - Sain motors" (the sheet's hyperlink points at the 212 page; its text is right) |
| RIDDARA | facebook.com/p/Riddara-Mongolia-Sain-Motors-61572981115327 | "Riddara Mongolia - Sain Motors", 4.8K followers; address supplied by the user (the RIDDARA sheet carries BYD's hyperlink) |
| AITO | facebook.com/p/AITO-Mongolia-Sain-Motors-61575759152945 | "AITO Mongolia - Sain Motors", 3.1K followers; address supplied by the user; the page's phone 7211 8855 matches AITO's sales line |
| SOUEAST | facebook.com/people/SOUEAST-Mongolia-Sain-Motors/61584232004745 | "SOUEAST Mongolia - Sain Motors", 2.1K followers; address supplied by the user. Its intro lists the showroom in front of the Holiday Inn, Chingeltei (the JETOUR C1 address), hours Mon–Fri 10:00–19:00, Sat 13:00–18:00, and phone 7299 8866; on the site 2026-10-20 to 2026-10-22 as a separate `soueast` location; since 2026-10-22 the brand sheet places SOUEAST in the JETOUR showroom with 7277-8855, so that location and the Facebook hours/phone were removed |

## 3. Images

| Source file (Drive ID) | Brand / subject | Used for | Derivative key | Crop / focus | Status |
|---|---|---|---|---|---|
| repo `showroom-6.webp` (jetour.mn) | Sain Motors showroom, SAIN sign | Home locations band | `showroom-hall` | 2:1, y 300 | sourced |
| AITO 7 Blue.jpg `1QjnIVvv…` (6531×4596, camera, Photoshop) | AITO M7 | AITO page gallery | `brand-aito-m7` | source image | sourced |
| БРЭНДИЙН ҮНДСЭН АВТОМАШИНЫ ЗУРАГ `1kn4i_tq…` (5504×3072) | 212 | Home vehicle collection; 212 page | `brand-212` | source image | sourced |
| repo `showroom-1.webp` (jetour.mn) | showroom floor and lounge | Retained source; previous photographic hero removed | — | — | sourced |
| repo `showroom-5.webp` | advice desks, two-storey office | Home company intro | `showroom-lounge` | — | sourced |
| repo `showroom-2.webp` | JETOUR line-up | About header | `showroom-entrance` | — | sourced |
| repo `showroom-4.webp` | display corridor | About | `showroom-gallery` | — | sourced |
| repo `showroom-3.webp` | building exterior | JETOUR showroom card | `showroom-exterior` | — | sourced (see conflict 5) |
| Desktop `484076260_1048089224014777_7683491303160709584_n.jpg` (supplied by the user 2026-10-18; Facebook export, 1920×1080, SHA-256 `99ec66f6c29d…`) | JETOUR T2 i-DM campaign image | Home vehicle collection; JETOUR page | `jetour-t2-idm` | 1.6 crop below the "JETOUR Drive Your Future" overlay | sourced |
| repo `jetour-journey.webp` (jetour.mn) | JETOUR T2 | Replaced 2026-10-18; kept in `assets/_superseded/` | — | — | — |
| AITO 9 Midnight Black `1P5r0Xw6…` | AITO M9 | Home vehicle collection; AITO page | `brand-aito-m9` | focus 58 % 65 % | sourced |
| AITO 5 Red.webp `1txZ9eRc…` | AITO M5 | AITO page | `brand-aito-m5` | — | sourced |
| BYD_atto3_kv4 `1MFYo8LQ…` (Canon, Capture One) | BYD Atto 3 | Home vehicle collection; BYD page | `brand-byd-atto3` | focus 60 % 60 % | sourced |
| 20230522宋PLUSDMI基础图右车侧 `1A2AwGQD…` | BYD Sealion 6 (press image) | BYD page | `brand-byd-sealion6` | — | sourced |
| Exterior-Front 45° `1NKZsQid…` (Sony ILCE-7RM5) | BYD Shark 6 | BYD page gallery | `brand-byd-shark6` | source image | sourced |

Masters in `assets/photos/brands/` are WebP q90 at ≤4096 px from these originals; derivatives are
built by `npm run images`. Local team copies are now the active sources; BYD's coast,
top/left and TI 7 images are also included in its model gallery.

### Earlier image review (superseded by the user's source confirmation on 2026-10-18)

The following were previously held back while sourcing manufacturer alternatives. The user has
now explicitly identified Desktop `brands6` and `3brand` as the official supplied material and
instructed us to use their images. They are used as supplied brand artwork, without claims about
photographic capture, added specifications, or inferred model names. The source files are untouched.
See [brand-material-inventory.json](brand-material-inventory.json).

| File (Drive ID) | Evidence |
|---|---|
| Riddara RD6 `1kvKp9xm…` | PNG text chunk `hf-job-id` (Higgsfield); reflection does not match the car |
| BYD TI 7 `hf_20261016_…png` `1oIp2NXv…` | Higgsfield file name; garbled text beside the headlamp |
| hongqi.png `105AtbwdbbcL…` | plate reads "HONGOI HS5" |
| rely.png, Bestune.png, Maxus.png | same 2752×1536 generator size as hongqi.png, no camera metadata, placard-style model plates |

The eight supplied brands now use the local team images on the homepage and their brand pages.
SOUEAST retains a manufacturer image, since it is in neither supplied folder: since 2026-10-20 the clean S09 key visual; CHERY's homepage card uses
the blue TIGGO 7 PRO MAX image supplied by the user as Desktop `37620.png` on 2026-10-18.
Its full vehicle is preserved in a 1.6-ratio crop. Details are in [homepage-card-assets.md](homepage-card-assets.md).

### Sain Motors web photo set (Desktop `sainmotorsWebPhotos`, supplied 2026-10-20)

The company's own folder "WEB Photos": folders 1 (home company hero), 2 (home services hero) and
6 (services), plus loose files, logos (8) and the brand guideline (9). Canon EOS R5 II and Sony ILCE-7RM2
photographs, drone frames saved as screenshots, and Facebook exports. All are real photographs (camera EXIF
or recognisable video frames); none shows generator traces. Masters: `assets/photos/site/*.webp` (q90, ≤4096 px);
sources untouched. Alt text describes only what is visible; no location is claimed where the frame does not show it.

| Derivative key | Source (folder / file) | SHA-256 | Used for | Status |
|---|---|---|---|---|
| `sain-hq-aerial` | 1 / Screenshot 2026-10-16 114805.png (3366×1480, drone) | `a75ead75ca90` | Home hero | sourced |
| `sain-hq-sign` | 1 / Screenshot 2026-10-16 114716.png | `99f9dd920f4d` | Home showroom walk, 01 | sourced |
| `byd-4s-aerial` | 1 / Screenshot 2026-10-16 111828.png | `20c0509591e8` | Built, not placed | sourced |
| `showroom-event-212` | 6 / DSC05320.jpg (Lightroom) | `1734bfb127a3` | Showroom walk, 02 | sourced |
| `showroom-interior` | 6 / 5I5A0461.JPG | `ce3eb499dd75` | Showroom walk, 03 | sourced |
| `showroom-floor` | 6 / Screenshot 2026-10-16 115251.png | `f55a313a63e2` | Showroom walk, 04 | sourced |
| `showroom-advice` | DSC03842.JPG | `8d01dc8289d0` | Showroom walk, 05 | sourced |
| `showroom-up-close` | DSC05325.jpg (Lightroom) | `90f6b43d53dc` | Showroom walk, 06 (replaced DSC05068 on 2026-10-20) | sourced |
| `service-workshop` | 6 / Screenshot 2026-10-16 115155.png (SERVICE sign) | `94d7a532bbee` | Home services | sourced |
| `service-team` | 6 / Screenshot 2026-10-16 115038.png | `b0c673b4ab73` | Services page header | sourced |
| `service-battery`, `service-battery-lift` | 6 / Screenshot 115514.png, 115430.png | `430dd391f943`, `1148a520fe9a` | Services team strip | sourced |
| `service-lift-hv`, `service-training-hv`, `service-under-lift` | 6 / 571564337…, 572171793…, 574567167… (Facebook) | `4c3239dac05b`, `7bb92e9eb948`, `8424a36b9184` | Services team strip | sourced |
| `service-training-group` | 6 / 571424480… (BYD training certificates) | `d4a03c9ead22` | Services team strip | sourced |

Not used: the two participation-certificate scans (708155250…, 708155742…) show individuals' names; the
`SAIN | BYD` group banner (708919196…) is a designed graphic. Folder 2 repeats most of folder 1.

### MEGA TEST DRIVE film and events (2026-10-20)

- **Film:** Desktop `SnapSave_App_1366867448896240_1080p.mp4` (supplied by the user; Facebook video
  1366867448896240; 86.6 s, 1920×1080, 25 fps). The burned-in title reads "MEGA Event TEST DRIVE 7 —
  OFF-ROAD EDITION", so it is the seventh edition, not the eighth. Derivatives in `public/video/`:
  `mtd7-teaser.mp4` (muted 15 s loop of 0:54–0:59.5, 0:22–0:25, 0:32–0:35, 1:02.5–1:06; 1280 px, 2.1 MB)
  and `mtd7-full.mp4` (the whole film, 1280 px, AAC, 17 MB). Posters: frames at 0:54 (`mtd7-river-crossing`)
  and 0:24 (`mtd7-212-mud`, built, not placed).
- **Editions** (`src/content/events.ts`, all `sourced`), from the registration sites in
  github.com/Enhireedui/mega-test-drive (README at the commit given) and ikon.mn (2026-06-23):

| Edition | Days | Venue | Source |
|---|---|---|---|
| 8 | 2026-10-09 – 10-10, 10:00–19:00 | Darkhan | README @b7c5045; first announced for 10-01 – 10-02 (@b7a09a0) |
| 7, off-road | 2026-08-22, 11:00–19:00 | Морингийн даваа (Наадамчдын зам); coaches from the BYD 4S showroom | README @31cbce4 |
| 6 | 2026-08-08 – 08-09 | Within the Шилийн Богд Moto Festival; Sain Motors general sponsor | README @c476715 |
| 5 | 2026-08-01 | not stated | README @5868efc (not listed on the site) |
| 3 | 2026-06-27 | BYD 4S showroom yard, Tsambagarav | ikon.mn/n/3ogh (not listed on the site) |

These are the dates the registration sites published, i.e. as planned. Edition 7 is confirmed held by
its film; please confirm 6 and 8 took place as listed. "8 editions" is read from the numbering.
No edition has a registration link: all are over (`src/lib/events.ts`, Asia/Ulaanbaatar).

## 4. Logos

| Brand | File used | Source |
|---|---|---|
| 212, RELY, BESTUNE, HONGQI, MAXUS | `* black.png` (as supplied) | Drive Logo folders |
| BYD, RIDDARA | variant 2 (black) / variant 1 wordmark of the supplied SVG sheet | Drive Logo folders |
| JETOUR, CHERY | banner-derived files | company brand banner, 2026-10-15 |
| AITO | black/white wordmark band from its SVG sheet | Desktop `3brand/Aito/Logo/AITO_logo 1.svg` |
| Sain Motors | `sain-color.svg` (black/red), `sain-on-dark.svg` (white/red), `sain-white.svg`, as supplied | Company folder `sainmotorsWebPhotos/WEB Photos/8. Сайн Моторс үндсэн лого`, 2026-10-22; replaces earlier PNGs with a ® mark and a different MOTORS line (kept in `assets/_superseded`) |
| SOUEAST | Official black wordmark on light surfaces (`brand-soueast.png`); official white wordmark on dark surfaces | SOUEAST global site header: `img/header_logo.png` (its light-header logo) and S09 `header_logo_w.png`, 2026-10-22 |

Dark-context marks use the supplied white variants. Five PNG pairs were copied from Desktop
`brands6`; BYD, RIDDARA and AITO are extracted from Desktop `3brand` presentation sheets with
their background panels excluded. Original geometry and colours are preserved.

## 5. Still needed

- Written publication approval for everything above (status → `approved`).
- SOUEAST: publication approval of the 2026-10-22 brand sheet details (introduction, S06/S07/S08, JETOUR showroom, 7277-8855); whether the Facebook page's 7299-8866 should be retired.
- CHERY: approval of the introduction and showroom details. The homepage card uses the user-supplied
  TIGGO 7 PRO MAX image (`37620.png`); the dedicated brand page uses the separately supplied
  TIGGO 7 PRO MAX road photograph (`37628.png`). Both originals are preserved; the prior TIGGO 8 source is archived.
- A valid TLS certificate for sainmotors.mn (it serves an expired `*.webhost.mn` certificate; checked 2026-10-18).
- Whether marketing2@esain.mn is the intended public address, or a general one such as info@.
- Service-centre photographs: supplied 2026-10-20 (above). Confirm which site the workshop frames show
  before captions name a place.
- MEGA TEST DRIVE: confirm editions 6 and 8 as held; photographs or a film of other editions, if wanted on the site.
- Opening hours and map pins for the Dolgoon Nuur, Sansar, BYD 4S and Darkhan showrooms.
- English review of web-team translations of the distributor statements (`draft`).
