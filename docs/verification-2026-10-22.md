# Шалгалт — 2026-10-22

Шалгасан эх: codex/corporate-production-20261022, d7fa532 суурь. Анхны sainmotors.mn дахь generated/media.json өөрчлөлтийг хуулж хадгалсан; эцсийн SHA256 хоёр хавтаст ижил:694fd389cc11007d7d886a0bee12fbd3974049d29cc89beecd54daedcfa120cd.

## Бодит үр дүн

- npm.cmd run lint —0 error,0 warning.
- npm.cmd run typecheck болон build үеийн TypeScript — pass.
- npm.cmd test —58 unit tests pass.
- node scripts/browser-check.mjs —18 browser tests pass,69.3сек; шинээр асаасан3311 серверийг өөрөө хаасан.
- Next Webpack build —51 static entries; MN/EN home,8section pages,11brand detail,3event detail болон metadata/global404.
- npm.cmd run check:export —609files, дотоод href/src, нэг h1, noindex,robots — pass.
- node scripts/health-check.mjs http://localhost:3310 — bilingual HTML/404/sitemap/asset/indexing pass.
- npm.cmd run package:preview — жинхэнэ ZIP +SHA256 +файл бүрийн checksum үүсгэсэн. dist/SainMotors-preview-20261022.zip, SHA256 307a1f5638bfd3868d5fd1bf34f29f2747beed8f24636f034f26a4d03c12d83d.
- npm.cmd run release:check — зориудаар exit1:154review records,2approved rendering paths,81sourced,71draft;152pending. Хоёр approved нь нэг ижил баталгаатай11brand fact.

## Хамрах хүрээ

MN/EN,360/390/768/1440/1920px, real Chrome. Home→11brand, showroom phone/map/hours, brand/photo routes, native modal menu/Escape/return focus, language routes, location filters/intersection/empty/clear/URL/Back/refresh/hash, JavaScriptгүй салбарын baseline, sourced news identity, explicit-only video playback, reducedmotion, canonical/reciprocal hreflang, no runtime errors/brokenassets/horizontaloverflow.

Final read-only reviewer олсон3асуудлыг зассан: Apache .htaccess UTF8BOM (RED→GREEN encoding test), хэл солиход filter/hash хадгалах (RED→GREEN browser test), хуучин Contact гэж заасан showroom copy.360px brand-strip overflow-ийг хэмжиж minmax(0,1fr)/bounded logo-оор зассан, бүх өргөнд дахин pass.

Turbopack нь тусгаарласан worktree-ийн node_modules junction-ийг root-оос гадна гэж зогсоосон. Next-ийн дэмждэг --webpack build ашиглаж баталсан; үндсэн build/release scripts мөн энэ замтай. Export validation нь OneDrive directory entry-ийн төрөлд найдалгүй lstat-аар жинхэнэ файлыг шалгана; symlink-ийг зөвшөөрөөгүй.

## Хурдны хэмжилтийн хязгаар

Локал static server, uncompressed initial network-idle snapshot (scroll хийгээгүй):390px29resource/844526encoded bytes/461932JSbytes;1440px30resource/902656bytes. Нүүрийн нийт өндөр390px5675px,1440px4231px. Өмнөх локал audit390px~1.765MB/84request/650KBJS, нүүр9332px байсан. Эдгээр нь бодит mobile4G/Lighthouse/CoreWebVitals оноо биш. Apache compression/cache нь template-д байгаа; бодит host response дээр хараахан баталгаажаагүй.

## Үлдсэн бодит ажил

152мөрийн агуулгын publication approval;4showroom hours,5verified pins. Missing hours нь callahead, maps нь Searchmap. Эх хүснэгтүүдээс баталгаагүй мэдээлэл зохиогоогүй. Хэвийн SOUEAST логоны оронд нийлүүлсэн цагаан хувилбарыг бараан plate дээр хэрэглэсэн.

Live sainmotors.mn fetch timeout: certificate эсвэл hosting broken гэж дүгнээгүй. Хостын documentroot/TLS/redirect/compression/cache/rollback/backup schedule, бодит утас, assistive technology болон remote GitHubActions run шалгаагүй. CI config оруулсан; Node24 runner remote execution хараахан болоогүй. CMS/error monitoring account үүсгээгүй; noform/static content workflow хэвээр. Deployment болон live-server backup хийгдээгүй.

Эцсийн full npm.cmd run build pipeline (responsive images → Webpack → segment fix) pass. Phone brand labels-ыг 12px болгосны дараа 51 entry build болон 3 focused browser tests (бүх өргөний overflow/asset checks, brand grid journeys) pass. dist exports-ыг ESLint/TypeScript шалгалтаас хасаж, package гаргасны дараа lint дахин 0 error / 0 warning.

Original Desktop/sainmotors.mn хавтаст 77 өөрчлөгдсөн/шинэ source files-ыг byte-for-byte шалгаж оруулсан. Өмнөх 208 tracked source files ба бүрэн out-ыг Desktop/sainmotors-backup-20261022-1123 дотор нөөцөлсөн. Windows эх out directory-г rename хийхийг EPERM гэж хориглосон тул файлуудыг хуулж шинэчилсэн; хэрэглэгдэхгүй хуучин hashed chunks локал out-д үлдсэн. Цэвэр 609 file export нь dist/preview-files болон preview ZIP дотор. Серверт цэвэр багц ашиглана. Local 3300 health check pass; энэ нь live домэйнд байршуулсан гэсэн үг биш.
