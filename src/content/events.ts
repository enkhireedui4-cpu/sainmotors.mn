import type { Block, DriveEvent } from "./types";

const MTD_REPO = "MEGA TEST DRIVE registration sites, github.com/Enhireedui/mega-test-drive";
const NEWS_COPY = "News copy supplied by the user, 2026-10-22; EN by the web team";

/**
 * MEGA TEST DRIVE editions, newest first. Dates and venues come from the
 * registration sites built for each edition (README at the commit noted) and
 * the ikon.mn report of 2026-06-23; none of these has a registration link,
 * because every listed edition is over. Provenance: docs/content-sources.md.
 */
export const driveEvents: DriveEvent[] = [
  {
    id: "mega-test-drive-8",
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
        mn: "MEGA TEST DRIVE 8 өдөрлөг Дархан хотын Сайн Моторс шоурумд зохион байгуулагдлаа.\n\nХоёр өдрийн турш зочид бензин, дизель, хосолсон болон бүрэн цахилгаан хөдөлгүүртэй автомашинуудтай танилцаж, сонирхсон загвараа туршин жолоодох боломжтой байв. Мөн автомашинуудыг харьцуулан үзэж, борлуулалтын зөвлөхүүдээс мэдээлэл авах нөхцөлийг бүрдүүлсэн юм.\n\nӨдөрлөг Дархан плазагаас Шинэ Дархан руу явах замд байрлах Сайн Моторс шоурумд болсон.",
        en: "MEGA TEST DRIVE 8 was held at the Sain Motors showroom in Darkhan.\n\nOver two days, visitors explored petrol, diesel, hybrid and fully electric cars and could test-drive the models that interested them. They could also compare cars side by side and get information from our sales consultants.\n\nThe event took place at the Sain Motors showroom on the road from Darkhan Plaza to New Darkhan.",
      },
    },
  },
  {
    id: "mega-test-drive-7",
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
    edition: 6,
    days: ["2026-08-08", "2026-08-09"],
    venue: { mn: "Сүхбаатар аймаг, Төв цэнгэлдэх хүрээлэн", en: "Central Stadium, Sükhbaatar province" },
    status: "sourced",
    source: `${MTD_REPO} @c476715 (2026-08-04): held within the festival, Sain Motors as general sponsor; venue from the user's news copy and festival film supplied by the user (2026-10-22)`,
    headline: { status: "draft", source: NEWS_COPY, value: { mn: "MEGA TEST DRIVE 6 — Шилийн Богд Moto Festival", en: "MEGA TEST DRIVE 6 — Shiliin Bogd Moto Festival" } },
    story: {
      status: "draft",
      source: NEWS_COPY,
      value: {
        mn: "Сайн Моторс MEGA TEST DRIVE 6 өдөрлөгөө Шилийн Богд Moto Festival-ийн хүрээнд зарласан юм.\n\nФестивалийн зочдод автомашины шинэ загваруудтай танилцаж, сонирхсон автомашинаа туршин жолоодох хөтөлбөрийг санал болгосон. Арга хэмжээний байршил нь Сүхбаатар аймгийн Төв цэнгэлдэх хүрээлэн байв.\n\nФестивалийн зарласан хөтөлбөрт авто, мото үзэсгэлэн, туршилтын жолоодлого, дрифт үзүүлбэр, амьд хөгжмийн тоглолт, галын шоу болон гэр бүлийн үйл ажиллагаанууд багтсан.",
        en: "Sain Motors announced MEGA TEST DRIVE 6 as part of the Shiliin Bogd Moto Festival.\n\nFestival guests were offered a programme to see new car models and test-drive the cars that interested them. The event was located at the Central Stadium of Sükhbaatar province.\n\nThe festival’s announced programme included a car and motorbike show, test drives, drift demonstrations, live music, a fire show and family activities.",
      },
    },
    film: {
      poster: {
        key: "mtd6-sain-flags",
        alt: {
          mn: "Шилийн Богд Moto Festival: Сайн Моторс-ын далбааны дэргэдэх үзэсгэлэнгийн автомашинууд",
          en: "Shiliin Bogd Moto Festival: display cars beside Sain Motors flags",
        },
        status: "sourced",
        focus: "55% 55%",
      },
      full: "/video/mtd6-full.mp4",
      duration: "1:38",
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
