# sainmotors.mn — байгууллагын вэб

2026-10-28-ны шинэ загвар: REA судалгаанд тулгуурлан холбоо барих хэсгийн цэвэрхэн дизайныг бүх MN/EN хуудсанд нэгтгэсэн. Нүүр нь “11 брэндийн албан ёсны дистрибьютер” том гарчиг, нэг өгүүлбэр, хоёр үйлдэл, өргөн зурагтай. Цагаан/цайвар саарал суурь, зөөлөн булантай карт, Sain Motors-ын улаан, Zona Pro + Inter болон компанийн өөрийн зургуудыг ашиглана.

Нүүр → бүх 11 брэнд → брэндийн баг, салбар руу шууд хүрнэ. Салбарын хуудас брэнд/хотоор шүүж, URL-д хадгална; Back, refresh, хэл солиход сонголт үргэлжилнэ. Мэдээ нь өгөгдсөн MEGA TEST DRIVE 6–8 өдөрлөгийн баримтууд. Автомат слайд, background video болон scroll-pinned сцен байхгүй.

Судалгаа: `docs/research/2026-10-28-reference-review.md`. Шалгалт: `docs/verification-2026-10-28.md`. Бүх хуудасны харагдац, локал хэмжилт: `docs/review/2026-10-28-fullsite/`. Брэндийн enquiry холбоос нь сонгосон багийн мэдээлэлд шууд хүрнэ; энгийн Contact цэс хаяг, утас, имэйлийн нүүр хэсэгт нээнэ.

## Харах

Dev сервер: **http://localhost:3200/mn/**. Экспортын preview: **http://localhost:3320/mn/**. Сервер унтарсан бол төсөл дотроос:

~~~powershell
$env:PORT = '3320'
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

Энэ нь **хянах preview**. Production серверт байршуулаагүй. CSV-ийн 173 review мөрөөс 171 нь нийтлэх батламж хүлээж байна; хоёр approved path нь нэг ижил 11-брэндийн баталгааг ашигладаг. Шинэ харагдацын текст, брэндийн ангилал мөн нэг checklist-д багтана.

Дөлгөөн нуур, Сансар, Дархан, Эрдэнэт салбарын нарийн pin, таван салбарын ажиллах цаг баталгаажаагүй. UI эдгээрийг утсаар лавлах / газрын зургаас хайх гэж тайлбарлана. BYD 4S, JETOUR-ын хэрэглэгчийн өгсөн pin, Дарханы 8808-5595, Эрдэнэт хотын Орхон молл / Sain Electronics дахь шоурумын 9909-6347 дугаарыг нэмсэн. Одоо 7 шоурум, 3 хот. Эрдэнэтэд ямар брэндүүд байрлах нь тодорхойгүй; баталгаагүй цаг, координат, үнэ, амлалт зохиож нэмээгүй.

- Агуулга: src/content/, docs/content-checklist.csv, docs/editing-guide.md.
- Дизайн: docs/site-design-2026-10-28.md.
- Нийтлэх/SSL/redirect/cache/backup/rollback/health: docs/production-release.md.
- Эх сурвалж, шийдээгүй асуулт: docs/content-sources.md.
- Сайжруулалтын бодит шалгалт: docs/verification-2026-10-22.md.

Агуулгын хариуцагч баталсны дараа npm.cmd run build:release ба npm.cmd run package:release ажиллана. Gate-ийг тойрч нийтлэхгүй. Серверийн document root, TLS, Apache модулиудыг бодит орчинд шалгах шаардлагатай. CMS, гаднын error-monitoring account, автомат сервер backup хараахан суулгаагүй; одоогийн контент нь typed файл, monitoring нь ажиллуулахад бэлэн HTTP checker.
