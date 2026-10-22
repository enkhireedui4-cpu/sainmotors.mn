# Sain Motors — corporate design system, 2026-10-22

Энэ баримт өмнөх харанхуй editorial чиглэлийг орлоно. Хэрэглэгчийн баталсан шинэ чиглэл: цагаан, цайвар саарал, хар саарал бичвэр; улаан өнгийг гол үйлдэл ба сонгосон хэсэгт хэрэглэнэ.

## Суурь

| Үүрэг | Утга |
|---|---|
| Суурь | #FFFFFF |
| Хоёрдогч гадаргуу | #F3F5F6 |
| Бичвэр | #172126 |
| Туслах бичвэр | #566169 |
| Хүрээ | #DFE4E7 |
| Гол үйлдэл | #E20A17 |
| Footer | #192227 |

Эдгээр нь вэбийн дизайн сонголт; үйлдвэрлэгчдийн албан палетт гэсэн баталгаа биш. Logo-ны эх өнгийг өөрчлөхгүй. SOUEAST цайвар дэвсгэр дээр үйлдвэрлэгчийн албан сайтын хар логог (`img/header_logo.png`), бараан дэвсгэр дээр цагаан хувилбарыг ашиглана. Шинэ лого зохиохгүй.

Гарчиг: нийлүүлсэн Zona Pro. Биеийн бичвэр/товч: Inter. Локал WOFF2, Cyrillic Ө ө Ү ү glyph. Үндсэн body 16px, line-height1.65; гарчгууд clamp-аар дасан зохицно. Гарын үсэгтэй typeface-ийн түгээх эрхийг нийтлэх баг батална.

## Зохион байгуулалт

82rem max-width, дэлгэцийн өргөнөөс хамаарах20–72px gutter. Нүүрийн split hero нь компанийн барилга, богино гарчиг, хоёр үйлдэлтэй. Улаан налуу тэмдэг нь Sain Motors-ын логоны урагш чиглэсэн хэлбэртэй холбоотой жижиг деталь.

Брэндүүд hover/click carousel хүлээлгүй бүгд харагдана: desktop6 багана, tablet4, phone3. Брэндийн индекс фото3/2/1 багана. Дэлгэрэнгүй дээр зураг contain; автомашиныг таслахгүй. Footer-ээс бусад дэлгэц цайвар.

Үйлчилгээний coverage нь эх мэдээлэлд байгаа брэндээр хязгаарлагдана. Салбарын товч48px-аас доошгүй; баталгаатай pin-ийг Directions, landmark хайлтыг Search map гэж ялгана. Цаг дутуу бол call-ahead. Мэдээний зураг нь зөвхөн тухайн үйл явдлын эх зураг; өөр өдөрлөгийн зураг ашиглаж төөрөгдүүлэхгүй.

## Хөдөлгөөн ба хүртээмж

Хөдөлгөөн зөвхөн hover/focus/press-д:140–220ms өнгө, хүрээ, сумны2px шилжилт. Авто carousel/background video/pinned scroll/3D canvas байхгүй. Video зөвхөн хэрэглэгчийн play-аар, preload none.

prefers-reduced-motion: reduce үед transition/animation унтарна. Native dialog нь Escape/focus trap/return focus-той. URL state бүхий filter нь Back/reload/language switch-д хадгалагдана. Серверийн HTML бүх салбарыг харуулна; JavaScriptгүй үед энэ baseline ашиглагдана.

## Хэрэгжүүлэлт ба шалгалт

globals.css нь shared tokens, үндсэн layout; brands.css ба locations.css нь scoped page rules. Server components үндсэн агуулгыг гаргана. Client islands: native mobile menu, active nav, language suffix, location filters.

Хамрах хүрээ: MN/EN,360/390/768/1440/1920px; нэг h1, canonical/hreflang, хагарсан asset/overflow/runtime error, keyboard/menu/filter/real route checks. Эдгээр нь бодит утасны network/assistive technology шалгалтыг орлохгүй. Preview noindex; зөвхөн батлагдсан release индексжих эрхтэй.
