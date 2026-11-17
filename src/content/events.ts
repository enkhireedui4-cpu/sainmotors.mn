import type { Block, DriveEvent } from "./types";
import { festivalNewsPhotos } from "./news-photos.ts";

const MTD_REPO = "MEGA TEST DRIVE registration sites, github.com/Enhireedui/mega-test-drive";
const NEWS_COPY = "News copy supplied by the user, 2026-10-22; EN by the web team";
const MTD6_COPY = "MEGA TEST DRIVE 6 report supplied by the user on 2026-11-17; Mongolian copy edited and translated into English by the web team";

/**
 * MEGA TEST DRIVE editions, newest first. Dates and venues come from the
 * registration sites built for each edition (README at the commit noted) and
 * the ikon.mn report of 2026-06-23; none of these has a registration link,
 * because every listed edition is over. Provenance: docs/content-sources.md.
 */
export const driveEvents: DriveEvent[] = [
  {
    id: "mega-test-drive-8",
    published: false,
    edition: 8,
    days: ["2026-10-09", "2026-10-10"],
    hours: "10:00–19:00",
    venue: { mn: "Сайн Моторс Дархан шоурум", en: "Sain Motors Darkhan showroom" },
    status: "sourced",
    source: `${MTD_REPO} @b7c5045 (2026-10-02; moved from 10.01–02); venue and report from the user's news copy (2026-10-22)`,
    headline: { status: "draft", source: NEWS_COPY, value: { mn: "MEGA TEST DRIVE 8 Дархан хотод", en: "MEGA TEST DRIVE 8 in Darkhan" } },
    story: {
      status: "draft",
      source: NEWS_COPY,
      value: {
        mn: "MEGA TEST DRIVE 8 өдөрлөг 2026 оны 10 дугаар сарын 9–10-нд Дархан хотын Сайн Моторс шоурумд зохион байгуулагдлаа. Өдөрлөг Дархан плазагаас Шинэ Дархан руу явах замд байрлах шоурумд болсон юм.\n\nХоёр өдрийн турш зочид бензин, дизель, хосолсон болон бүрэн цахилгаан хөдөлгүүртэй автомашинуудтай танилцаж, сонирхсон загвараа туршин жолоодлоо. Мөн тусгайлан бэлтгэсэн бартаат замын талбайд автомашины туулах чадварыг туршиж, загваруудыг харьцуулан үзэх боломжтой байв.\n\nУрьдчилан бүртгүүлсэн зочид азын хүрд эргүүлж, шатахууны эрхийн бичиг болон бусад шагналын эзэд боллоо. Гэр бүлээрээ ирсэн оролцогчдод хөнгөн зууш, уух зүйлсээр үйлчилж, худалдан авалт, лизингийн нөхцөлийн талаар газар дээр нь зөвлөгөө өгсөн юм.",
        en: "MEGA TEST DRIVE 8 took place on 9–10 October 2026 at the Sain Motors showroom in Darkhan, on the road from Darkhan Plaza towards New Darkhan.\n\nOver two days, visitors explored petrol, diesel, hybrid and fully electric vehicles and test-drove the models that interested them. Local drivers also tested vehicle capabilities on specially prepared off-road courses and compared models side by side.\n\nPre-registered guests spun the Lucky Wheel for fuel vouchers and other prizes. Families enjoyed refreshments, while the team provided on-site advice about purchasing and leasing arrangements.",
      },
    },
  },
  {
    id: "mega-test-drive-7",
    published: false,
    edition: 7,
    title: { mn: "Off-road", en: "Off-road edition" },
    days: ["2026-08-22", "2026-08-22"],
    hours: "11:00–19:00",
    venue: { mn: "Морингийн даваа", en: "Moringiin Davaa pass" },
    status: "sourced",
    source: `${MTD_REPO} @31cbce4 (2026-08-18); event film supplied by the user (Facebook video 1366867448896240)`,
    headline: { status: "draft", source: NEWS_COPY, value: { mn: "MEGA TEST DRIVE 7: Морингийн даваан дахь туршилтын жолоодлого", en: "MEGA TEST DRIVE 7: off-road test drive at the Moringiin Davaa pass" } },
    story: {
      status: "draft",
      source: NEWS_COPY,
      value: {
        mn: "MEGA TEST DRIVE 7 өдөрлөг Морингийн даваанд бартаат замын туршилтын жолоодлого хэлбэрээр зохион байгуулагдлаа.\n\nӨдөрлөгийн хөтөлбөрт JETOUR T2 PHEV, 212 Highland, Riddara, Rely зэрэг автомашиныг танилцуулсан. Оролцогчдод сонирхсон загварынхаа туулах чадварыг бодит орчинд турших, автомашинуудыг харьцуулах, мэргэжлийн зөвлөгөө авах боломж олгосон юм.\n\nЭнэ удаагийн туршилтын замд эгц өгсүүр, бартаат болон шороон зам, шавар, ус гэсэн таван төрлийн саадыг багтаажээ.",
        en: "MEGA TEST DRIVE 7 was held as an off-road test drive at the Moringiin Davaa pass.\n\nThe programme featured cars including the JETOUR T2 PHEV, 212 Highland, Riddara and Rely. Participants could test the off-road ability of the models that interested them in real conditions, compare the cars and get expert advice.\n\nThis edition’s test route included five kinds of obstacle: steep climbs, rough ground, dirt tracks, mud and water.",
      },
    },
    film: {
      poster: {
        key: "mtd7-river-crossing",
        alt: {
          mn: "MEGA TEST DRIVE 7: 212 автомашин голыг гатлан давхиж буй нь",
          en: "MEGA TEST DRIVE 7: a 212 fording a river",
        },
        status: "sourced",
        focus: "50% 60%",
      },
      teaser: "/video/mtd7-teaser.mp4",
      full: "/video/mtd7-full.mp4",
      duration: "1:27",
    },
  },
  {
    id: "mega-test-drive-6",
    cover: festivalNewsPhotos[0],
    gallery: [
      { photo: festivalNewsPhotos[5], afterParagraph: 0 },
      { photo: festivalNewsPhotos[3], afterParagraph: 1 },
      { photo: festivalNewsPhotos[4], afterParagraph: 2 },
    ],
    edition: 6,
    days: ["2026-08-08", "2026-08-09"],
    venue: { mn: "Сүхбаатар аймаг, Баруун-Урт хот", en: "Baruun-Urt, Sukhbaatar province" },
    status: "sourced",
    source: `${MTD_REPO} @c476715 (2026-08-04): dates and festival context; Baruun-Urt location and event report supplied by the user on 2026-11-17; festival film supplied by the user on 2026-10-22`,
    headline: { status: "draft", source: MTD6_COPY, value: { mn: "MEGA TEST DRIVE 6 × ШИЛИЙН БОГД ФЕСТИВАЛЬ 2026", en: "MEGA TEST DRIVE 6 × SHILIIN BOGD FESTIVAL 2026" } },
    story: {
      status: "draft",
      source: MTD6_COPY,
      value: {
        mn: "Сайн Моторс компани MEGA TEST DRIVE 6 өдөрлөгөө Сүхбаатар аймгийн Баруун-Урт хотод зохион байгуулж, Шилийн Богд Фестиваль 2026-ийн нэгэн өдрийг автомашин сонирхогчидтойгоо хамт өнгөрүүллээ.\n\nӨдөрлөгийн үеэр хүрэлцэн ирсэн зочид Сайн Моторсын албан ёсны эрхтэйгээр борлуулдаг дэлхийн тэргүүлэгч 11 брэндийн 20 гаруй загварын автомашинтай нэг дор танилцаж, сонирхсон загваруудаа биечлэн туршин жолоодож, бодитоор мэдрэх боломжтой байлаа.\n\nГэр бүл, найз нөхдөөрөө хүрэлцэн ирж, бидэнтэй хамт нэг өдрийг дурсамжтай өнгөрүүлсэн нийт оролцогчид болон Шилийн Богд Фестиваль 2026-ийн зохион байгуулагчдад баярлалаа.",
        en: "Sain Motors held MEGA TEST DRIVE 6 in Baruun-Urt, Sukhbaatar province, spending a day of Shiliin Bogd Festival 2026 with car enthusiasts.\n\nDuring the event, visitors explored more than 20 vehicle models from 11 leading global brands officially distributed by Sain Motors, all in one place. They also had the opportunity to test-drive the models that interested them and experience the cars firsthand.\n\nThank you to everyone who joined us with family and friends for a memorable day, and to the organisers of Shiliin Bogd Festival 2026.",
      },
    },
  },
];

/** Homepage test-drive feature over the edition 7 film. */
export const testDrive: Block<{ heading: string; body: string; watch: string; request: string; events: string; past: string; editions: string }> = {
  status: "draft",
  source: "ikon.mn 2026-06-23 (MEGA TEST DRIVE: 11 brands, 20+ models to drive); edition numbering of the registration sites",
  value: {
    mn: {
      heading: "Жолоодож мэдэр.",
      body: "MEGA TEST DRIVE өдөрлөгөөр Сайн Моторс-ын брэндүүдийн автомашиныг өөрөө жолоодож туршина. Долоо дахь өдөрлөг Морингийн даваагаар off-road замд гарсан.",
      watch: "Бичлэг үзэх",
      request: "Тест драйв хүсэх",
      events: "Сүүлийн өдөрлөгүүд",
      past: "Болсон",
      editions: "удаагийн өдөрлөг",
    },
    en: {
      heading: "Feel it behind the wheel.",
      body: "At MEGA TEST DRIVE events you drive the cars of Sain Motors’ brands yourself. The seventh edition went off-road over the Moringiin Davaa pass.",
      watch: "Watch the film",
      request: "Request a test drive",
      events: "Recent events",
      past: "Held",
      editions: "editions so far",
    },
  },
};
