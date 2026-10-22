# sainmotors.mn — байгууллагын вэб

2026-10-22-ны шинэ загвар: цагаан/цайвар саарал суурь, Sain Motors-ын улаан товч, Zona Pro + Inter, компанийн өөрийн зураг. Монгол/англи хоёр хэлтэй. Хэрэглэгч 11 брэндийн албан ёсны дистрибьютер гэдгийг баталсан.

Нүүр → бүх 11 брэнд → брэндийн баг, салбар руу шууд хүрнэ. Салбарын хуудас брэнд/хотоор шүүж, URL-д хадгална; Back, refresh, хэл солиход сонголт үргэлжилнэ. Мэдээ нь өгөгдсөн MEGA TEST DRIVE 6–8 өдөрлөгийн баримтууд. Автомат слайд, background video болон scroll-pinned сцен байхгүй.

## Харах

Энэ компьютерт шалгасан шинэ хувилбар: **http://localhost:3300/mn/** (үндсэн хавтас), http://localhost:3310/mn/ (тусгаарласан шалгах хувилбар). Сервер унтарсан бол төсөл дотроос:

~~~powershell
$env:PORT = '3310'
npm.cmd run preview
~~~

Сайт нь Next.js static export тул **out/index.html-г давхар дарж нээхгүй**. HTTP preview ашиглана. Dev: npm.cmd run dev (3200). Node 24+ болон lockfile dependencies хэрэгтэй; энэ компьютер дээр байгаа Node 26-аар шалгасан. CI нь Windows / Node 24, бодит remote run хараахан хийгдээгүй.

## Шалгах, багцлах

~~~powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run check:export
node scripts/browser-check.mjs
npm.cmd run content:checklist
npm.cmd run package:preview
~~~

Тест суусан Chrome/Edge ашиглана; шаардлагатай бол CHROME_PATH тохируулна. build нь responsive WebP зургуудыг эх файлаас үүсгэж, Next Webpack export, segment fix ажиллуулна. Өөрийн фонт, зураг, бичлэгтэй; CDN/server runtime шаардахгүй.

## Нийтлэх төлөв

Энэ нь **хянах preview**. Production серверт байршуулаагүй. CSV-ийн 154 review мөрөөс 152 нь нийтлэх батламж хүлээж байна; хоёр approved path нь нэг ижил 11-брэндийн баталгааг ашигладаг. Бүрэн CSV нь хуучин 137 блокоос илүү хүрээг хамарна.

Дөрвөн салбарын цаг, таван газрын нарийн pin баталгаажаагүй. UI эдгээрийг утсаар лавлах / газрын зургаас хайх гэж зөв тайлбарлана. Баталгаагүй цаг, координат, үнэ, амлалт зохиож нэмээгүй.

- Агуулга: src/content/, docs/content-checklist.csv, docs/editing-guide.md.
- Дизайн: docs/design-system.md.
- Нийтлэх/SSL/redirect/cache/backup/rollback/health: docs/production-release.md.
- Эх сурвалж, шийдээгүй асуулт: docs/content-sources.md.
- Сайжруулалтын бодит шалгалт: docs/verification-2026-10-22.md.

Агуулгын хариуцагч баталсны дараа npm.cmd run build:release ба npm.cmd run package:release ажиллана. Gate-ийг тойрч нийтлэхгүй. Серверийн document root, TLS, Apache модулиудыг бодит орчинд шалгах шаардлагатай. CMS, гаднын error-monitoring account, автомат сервер backup хараахан суулгаагүй; одоогийн контент нь typed файл, monitoring нь ажиллуулахад бэлэн HTTP checker.
