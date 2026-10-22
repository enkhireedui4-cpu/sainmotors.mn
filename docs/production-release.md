# Нийтлэх багц, Apache, буцаах ажиллагаа

Энэ нь static export-ыг хянах, багцлах, сервер дээр шалгах заавар. Одоогоор гаднын серверт файл байршуулаагүй. Хостын нэвтрэх эрх, бодит document root, TLS тохиргоо болон бүх агуулгын нийтлэх зөвшөөрөл ирээгүй тул production live гэж үзэхгүй.

## Агуулгыг батлах

`npm run content:checklist` нь `docs/content-checklist.csv`-г нэг нэгдсэн registry-ээс гаргана. Энэ registry-г release gate мөн ашиглана. `Path` нь засах TypeScript талбарыг заана. MN/EN, зураг, provenance, утас, холбоос, showroom, загвар/он зэрэг брэндийн баримтууд хамрагдана. Owner, Approver баганыг эзэмшигч нь бөглөнө; вэб баг эдгээрийг таамгаар оноохгүй.

`src/content/` дахь `status`-ыг зөвхөн тухайн мөрийн нийтлэх батламжийн дараа `approved` болгоно. `Brand.factsReview` нь тухайн брэндийн утас, суваг, загвар, он, showroom баримтыг хамтад нь хянана; байхгүй бол `sourced` хэвээр. Шинэ home/editorial copy, хуучин teaser/cardCopy болон галерейн зураг тус бүр өөрийн төлөвтэй. CSV дээрх нэр, огноо, батламжийн эхийг хадгалж, registry дахь provenance-г шинэчилнэ. CSV-г өөрчлөх нь кодын төлөвийг автоматаар өөрчлөхгүй.

Хэрэглэгч 2026-10-22-нд 11 брэндийн албан ёсны дистрибьютер гэдгийг баталсан. Тэр **нэг баримтыг** `company.distributorClaim` болон түүнийг шууд ашигладаг `hero.text` гэсэн хоёр rendering path-д approved гэж бүртгэсэн. Үүнээс бусад агуулгыг нийтээр баталсан гэж үзээгүй.

## Preview ба release

Node 26, тухайн төслийн lockfile/dependencies ашиглана. PowerShell дээр execution-policy саадтай бол `npm.cmd`, `npx.cmd` гэж ажиллуулж болно.

```powershell
npm.cmd run content:checklist
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run check:export
npm.cmd run package:preview
```

Preview нь default `https://sainmotors.mn` canonical origin-тай байсан ч HTML robots `noindex`, robots.txt `Disallow: /`, Apache `X-Robots-Tag: noindex` байна. Тусдаа staging домэйн ашиглавал build хийхээс өмнө `$env:NEXT_PUBLIC_SITE_URL = 'https://staging.example.mn'` өгнө. Preview-г production release гэж нэрлэж байршуулахгүй.

Бүх агуулга батлагдсаны дараах дараалал:

```powershell
npm.cmd run release:check
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build:release
npm.cmd run package:release
```

`build:release` эхлээд shared release gate-г шалгана. Pending content байвал зураг/build ажиллуулахын өмнө зогсоно. Зөвшөөрөгдвөл genuine production origin, `SITE_RELEASE=1`-ээр export үүсгээд HTML/robots/local destination/h1 шалгана. Release `.htaccess`-г суулгана. `package:release` gate болон export-ыг дахин шалгана. Аль ч командаар батлагдаагүй content-ыг автоматаар approved болгохгүй.

`dist/sainmotors-preview-<timestamp>.zip` эсвэл `sainmotors-release-<timestamp>.zip`, түүнтэй ижил `.zip.sha256`, мөн unpacked folder үүснэ. ZIP-ийн **дотор** hidden `.htaccess` болон файл тус бүрийн `SHA256SUMS.txt` орно. PowerShell/.NET ZIP API ашигладаг тул hidden config алдагдахгүй. ZIP, checksum, review CSV, source snapshot-ыг нэг release нэр/огноогоор хамт хадгална.

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'dist/<exact-package>.zip'
```

Гарсан hash `.zip.sha256`-тай таарна. Серверт задласны дараа SHA256SUMS дахь файлуудыг мөн шалгана. Source `generated/media.json` болон нийлүүлсэн asset originals-ыг release preparation үеэр дур мэдэн шинээр үүсгэхгүй.

## Apache тохиргоо

`public/.htaccess` болон `deployment/apache/preview.htaccess` нь preview. `deployment/apache/production.htaccess` нь зөвхөн approved release багцад суух хувилбар. Хоёул directory listing хааж, /404.html, MIME, security headers, text compression болон cache тохируулна. HTML/XML/TXT дахин шалгагдана; hash-тай `/_next/static/` нэг жил immutable; нэрээ хадгалдаг media/video/font долоо хоног cache-тай.

Production хувилбар HTTP болон `www.sainmotors.mn`-г `https://sainmotors.mn` рүү path/query-г хадгалан 301 шилжүүлнэ. Root `/` нь `/mn/` руу шилжинэ. Энэ template нь **Apache өөрөө TLS дуусгадаг** тохиолдолд зориулагдсан. Hosting/CDN/proxy TLS дуусгадаг бол `%{HTTPS}` нөхцөлийг hosting талын бодит trusted proxy тохиргоонд тааруулж шалгах шаардлагатай; template-ыг шууд тавихад redirect loop үүсч болно. Header-ээс хүссэн `X-Forwarded-Proto`-г сохроор итгэх тохиргоо оруулаагүй.

Нэвтрэх эрх авсны дараа админ document root, Apache 2.4, AllowOverride болон mod_rewrite/mod_headers/mod_deflate дэмжлэгийг батална. Root ба www hostname хоёуланд хүчинтэй TLS certificate хэрэгтэй: HTTPS www хүсэлт certificate шалгалтаа давсны дараа redirect хийдэг. Серверийн бодит syntax/TLS/redirect-г энд локалаар баталгаажуулах боломжгүй. Тохиргооны үндэс: [Apache HTTPS/canonical redirects](https://httpd.apache.org/docs/2.4/rewrite/remapping.html), [compression](https://httpd.apache.org/docs/2.4/mod/mod_deflate.html), [headers](https://httpd.apache.org/docs/2.4/mod/mod_headers.html).

## Байршуулах, backup, rollback

1. Нийтлэх хүн content approval, яг ZIP-ийн hash, target domain/document root болон upload workflow-г нэг release record-д тэмдэглэнэ. Нууц үгийг repo/doc-д бичихгүй.
2. Одоогийн серверийн **бүх document root**, hidden `.htaccess`, хостын redirect/TLS тохиргоог timestamp-тай archive болгон backup хийнэ. Backup татагдсан, нээгдэж байгаа, checksum нь бичигдсэн эсэхийг шалгана. Хоосон backup дээр үргэлжлүүлэхгүй.
3. Шинэ release-ыг тусдаа sibling directory руу бүрэн задлана. Файлын checksum, hidden `.htaccess`, MN/EN хуудас, local media байгаа эсэхийг шалгана. Хост боломжтой бол document root/symlink-ийг шинэ хавтас руу нэг удаа солино. Зөвхөн FTP боломжтой бол maintenance window-д бүрэн folder swap хийнэ; live folder дээр хуучин/шинэ hashed asset-ыг хэсэгчлэн холихгүй.
4. Доорх health check болон browser journey-г хийнэ. Алдаа гарвал хуучин folder/document-root pointer болон хуучин `.htaccess`-г сэргээж, health check-г дахин хийнэ. Backup-ыг шинэ хувилбар баталгаажтал устгахгүй.
5. MN/EN home → brands → brand detail → location filter → map/phone → news detail → contact урсгалыг desktop/mobile browser-оор шалгана. Hosting талын cache/CDN байгаа бол зөвхөн холбогдох файлуудыг цэвэрлэнэ.

## HTTP smoke check

```powershell
npm.cmd run health:check -- https://staging.example.mn
npm.cmd run health:check -- https://sainmotors.mn --release
```

Read-only checker нь MN/EN HTTP200/lang/h1/robots, sitemap, бодит404, нэг media asset-ыг шалгана. Release үед HTTP/root+www redirect болон хүчинтэй TLS-г Node fetch-ээр шалгана. TLS шалгалтыг алгасах `-k`/insecure горим байхгүй. Үүнээс гадна админ response headers дээр `Content-Encoding: gzip`, cache болон security headers-ыг шалгана; `npm run preview` local server нь Apache directives-г хэрэгжүүлдэггүй.

2026-10-22-ны read-only web tool шалгалт: `jetour.mn` хүрч, үндсэн утас/ажлын цаг харагдсан. `sainmotors.mn` fetch timeout, `chery.mn` tool inaccessible. Эдгээр нь TLS certificate, DNS эсвэл hosting эрхийг баталсан үр дүн биш. Бодит target ба нэвтрэх эрхгүйгээр deployment/rollback/Apache runtime health test хийгдээгүй.

