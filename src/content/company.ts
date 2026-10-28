import type { Block, ContentStatus, Location, Service } from "./types";

// Sources (details in docs/content-sources.md):
//  - jetour.mn (repo jetour-sain: src/lib/branches.ts), confirmed there 2026-10-05:
//    JETOUR showroom and service centre, hours, general phone and email.
//  - Brand teams' Drive sheets, 2026-10-16: the other showrooms, brand lines,
//    distributor statements and what each brand is offered with.
//  - Sain Motors' own CHERY site (Desktop chery, lib/content.ts `site`), read
//    2026-10-18: CHERY showroom, hours, map point, sales line, warranty, leasing.
const JETOUR_SITE = "jetour.mn — src/lib/branches.ts";
const DRIVE = "Drive brand sheets (2026-10-16)";
const CHERY_SITE = "Sain Motors CHERY site (Desktop chery) — lib/content.ts site";

const mapSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const company = {
  name: "Sain Motors",
  distributorClaim: {
    status: "approved",
    source: "User's explicit confirmation on 2026-10-22: Sain Motors is the official distributor of 11 brands",
    value: {
      mn: "Сайн Моторс нь Монгол Улсад автомашины 11 брэндийн албан ёсны дистрибьютер юм.",
      en: "Sain Motors is the official distributor of 11 automotive brands in Mongolia.",
    },
  } satisfies Block,
  legalName: {
    status: "sourced",
    source: JETOUR_SITE,
    value: { mn: "Сайн Моторс ХХК", en: "Sain Motors LLC" },
  } satisfies Block,
  /** Home page introduction. Facts from the distributor statements; wording by the web team. */
  introduction: {
    status: "draft",
    source: `${DRIVE}; jetour.mn`,
    value: {
      mn: "Сайн Моторс ХХК олон улсын автомашины брэндүүдийг Монголд албан ёсны эрхтэйгээр борлуулдаг.\n\nJETOUR, CHERY, HONGQI, BYD, AITO, RIDDARA, 212, BESTUNE, MAXUS, RELY, SOUEAST брэндийн автомашиныг Улаанбаатар, Дархан, Эрдэнэт хотын шоурумуудаараа санал болгодог. Брэнд бүр өөрийн шоурум, борлуулалтын утастай бөгөөд ихэнх брэнд үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээтэй. Загвар, тоноглолын дэлгэрэнгүйг брэндийн албан ёсны сайтаас үзнэ үү.",
      en: "Sain Motors LLC sells international car brands in Mongolia under official rights from each brand.\n\nWe offer JETOUR, CHERY, HONGQI, BYD, AITO, RIDDARA, 212, BESTUNE, MAXUS, RELY and SOUEAST through our showrooms in Ulaanbaatar, Darkhan and Erdenet. Each brand has its own showroom and sales line, and most come with factory warranty and after-sales service. For full model details, visit each brand’s official website.",
    },
  } satisfies Block,
  /**
   * The year Sain Motors began selling each brand under official rights,
   * from the brand sheets (JETOUR's and SOUEAST's from their own sheets, supplied 2026-10-22). CHERY has no year on record.
   */
  milestones: {
    status: "sourced" as ContentStatus,
    source: DRIVE,
    items: [
      { year: 2023, brands: ["jetour"] },
      { year: 2024, brands: ["hongqi"] },
      { year: 2025, brands: ["byd", "aito", "riddara", "212", "bestune", "maxus"] },
      { year: 2026, brands: ["rely", "soueast"] },
    ],
  },
};

/** General line and email, as published on jetour.mn. */
export const contact = {
  phone: { display: "7010-8855", href: "tel:+97670108855" },
  email: "marketing2@esain.mn",
  status: "sourced" as const,
  source: JETOUR_SITE,
};

export const socials = [
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/Sainmotors.mn" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/sainmotors.mn/" },
  { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@SainMotorsLLC" },
] as const;

const UB = { mn: "Улаанбаатар", en: "Ulaanbaatar" };

export const locations: Location[] = [
  {
    id: "jetour-c1",
    kind: "showroom",
    name: { mn: "JETOUR шоурум", en: "JETOUR showroom" },
    city: UB,
    address: {
      mn: "Чингэлтэй дүүрэг, 5-р хороо, хуучнаар ХИД-1, C1 ТВ-ийн байр",
      en: "C1 TV building (former KhID-1), 5th khoroo, Chingeltei district",
    },
    landmark: { mn: "Holiday Inn зочид буудлын урд", en: "In front of the Holiday Inn hotel" },
    hours: [
      { days: { mn: "Даваа – Баасан", en: "Monday – Friday" }, time: { mn: "10:30 – 19:30", en: "10:30 – 19:30" } },
      { days: { mn: "Бямба", en: "Saturday" }, time: { mn: "13:00 – 18:00", en: "13:00 – 18:00" } },
      { days: { mn: "Ням", en: "Sunday" }, time: { mn: "Амарна", en: "Closed" } },
    ],
    phone: { display: "7010-8855", href: "tel:+97670108855" },
    email: "marketing2@esain.mn",
    map: { url: "https://maps.app.goo.gl/qh4YXME6ZKwLokRQ8", precision: "pin" },
    photo: {
      key: "showroom-exterior",
      alt: {
        mn: "JETOUR болон Sain Motors-ын хаягтай шоурумын барилга",
        en: "Showroom building with JETOUR and Sain Motors signage",
      },
      status: "sourced",
      note: "Confirm this exterior is the showroom, not the service centre",
    },
    status: "sourced",
    source: `${JETOUR_SITE}; user-confirmed JETOUR map, 2026-10-28: WWC2+CJ2 J.Sambuu Street, CHD-5, Ulaanbaatar 15171`,
  },
  {
    id: "dolgoon-nuur",
    kind: "showroom",
    name: { mn: "Дөлгөөн нуур шоурум", en: "Dolgoon Nuur showroom" },
    city: UB,
    address: { mn: "Чингэлтэй дүүрэг, Дөлгөөн нуур", en: "Dolgoon Nuur, Chingeltei district" },
    landmark: { mn: "Computer Mall-ын чанх урд", en: "Directly opposite Computer Mall" },
    map: { url: mapSearch("Computer Mall, Dolgoon Nuur, Ulaanbaatar"), precision: "search" },
    status: "sourced",
    source: `${DRIVE}: 212, CHERY RELY, Riddara`,
  },
  {
    id: "sansar",
    kind: "showroom",
    name: { mn: "Сансар шоурум", en: "Sansar showroom" },
    city: UB,
    address: {
      mn: "Баянзүрх дүүрэг, 1-р хороо, 12-р хороолол",
      en: "12th microdistrict, 1st khoroo, Bayanzürkh district",
    },
    landmark: {
      mn: "Сансарын Петровис шатахуун түгээх станцын баруун талд",
      en: "West of the Petrovis filling station in Sansar",
    },
    map: { url: mapSearch("Petrovis, Sansar, Ulaanbaatar"), precision: "search" },
    status: "sourced",
    source: `${DRIVE}: FAW HONGQI, FAW BESTUNE, AITO`,
  },
  {
    id: "byd-4s",
    kind: "showroom",
    name: { mn: "BYD 4S шоурум", en: "BYD 4S showroom" },
    city: UB,
    address: { mn: "Баянгол дүүрэг, Москвагийн гудамж", en: "Moscow Street, Bayangol district" },
    landmark: { mn: "Цамбагарав төвийн баруун урд", en: "South-west of the Tsambagarav centre" },
    map: { url: "https://maps.app.goo.gl/BkpbhfBnyKxKoxyM8", precision: "pin" },
    serviceBrands: ["byd"],
    status: "sourced",
    source: `${DRIVE}: BYD; user-confirmed BYD 4S map, 2026-10-28`,
  },
  {
    id: "chery-narny",
    kind: "showroom",
    name: { mn: "CHERY шоурум", en: "CHERY showroom" },
    city: UB,
    address: { mn: "Баянгол дүүрэг, 26-р хороо, Нарны хороолол", en: "Narny Khoroolol, 26th khoroo, Bayangol district" },
    landmark: { mn: "Parko Riveria", en: "Parko Riveria" },
    // The CHERY site's contact page and footer agree on these hours (its dealer page differs on Saturday).
    hours: [
      { days: { mn: "Даваа – Баасан", en: "Monday – Friday" }, time: { mn: "09:00 – 21:00", en: "09:00 – 21:00" } },
      { days: { mn: "Бямба", en: "Saturday" }, time: { mn: "09:00 – 19:00", en: "09:00 – 19:00" } },
      { days: { mn: "Ням", en: "Sunday" }, time: { mn: "Амарна", en: "Closed" } },
    ],
    map: { url: "https://www.google.com/maps/dir/?api=1&destination=47.904448%2C106.902714", precision: "pin" },
    status: "sourced",
    source: CHERY_SITE,
  },
  {
    id: "darkhan",
    kind: "showroom",
    name: { mn: "Дархан шоурум", en: "Darkhan showroom" },
    city: { mn: "Дархан", en: "Darkhan" },
    address: { mn: "Дархан плазагаас Шинэ Дархан явах замд", en: "On the road from Darkhan Plaza to New Darkhan" },
    phone: { display: "8808-5595", href: "tel:+97688085595" },
    email: "marketing2@esain.mn",
    map: { url: mapSearch("Сайн Моторс Дархан шоурум, Дархан плаза, Дархан, Монгол"), precision: "search" },
    status: "sourced",
    source: `${DRIVE}: 212 team sheet, tab MAXUS; user's Sain Motors Darkhan Facebook screenshot, 2026-10-28 (phone, email, address). Supplied directions URL targets 0,0 and is not used as a pin.`,
  },
  {
    id: "erdenet",
    kind: "showroom",
    name: { mn: "Эрдэнэт шоурум", en: "Erdenet showroom" },
    city: { mn: "Эрдэнэт", en: "Erdenet" },
    address: { mn: "Орхон молл дэлгүүр, Sain Electronics", en: "Sain Electronics, Orkhon Mall" },
    phone: { display: "9909-6347", href: "tel:+97699096347" },
    map: { url: mapSearch("Орхон молл Sain Electronics, Эрдэнэт, Монгол"), precision: "search" },
    status: "sourced",
    source: "User-supplied Erdenet showroom announcement, 2026-10-28: Orkhon Mall, Sain Electronics; 99096347. Brand coverage, opening hours and precise map pin not supplied.",
  },
  {
    id: "service-centre",
    kind: "service",
    name: { mn: "JETOUR үйлчилгээний төв", en: "JETOUR service centre" },
    city: UB,
    address: {
      mn: "Хан-Уул дүүрэг, ТЭЦ-4-ийн баруун хойно",
      en: "North-west of Thermal Power Plant No. 4, Khan-Uul district",
    },
    landmark: { mn: "Sandvik Customer Service Center-ийн ард", en: "Behind the Sandvik Customer Service Center" },
    hours: [
      { days: { mn: "Даваа – Баасан", en: "Monday – Friday" }, time: { mn: "09:00 – 18:00", en: "09:00 – 18:00" } },
      { days: { mn: "Бямба", en: "Saturday" }, time: { mn: "10:00 – 15:00", en: "10:00 – 15:00" } },
      { days: { mn: "Ням", en: "Sunday" }, time: { mn: "Амарна", en: "Closed" } },
    ],
    phone: { display: "7010-8855", href: "tel:+97670108855" },
    email: "marketing2@esain.mn",
    map: { url: "https://www.google.com/maps/dir/?api=1&destination=47.897841%2C106.796819", precision: "pin" },
    serviceBrands: ["jetour"],
    status: "sourced",
    source: JETOUR_SITE,
  },
];

/**
 * What each brand is offered with differs, so every service lists only the
 * brands its sources confirm. Wording by the web team.
 */
export const services: Service[] = [
  {
    id: "sales",
    title: { mn: "Шинэ автомашин", en: "New cars" },
    body: {
      mn: "Брэнд бүрийн загварыг тухайн брэндийн шоурумаас биечлэн үзэж, худалдан авалтын нөхцөлөө брэндийн борлуулалтын утсаар лавлана.",
      en: "See each brand’s models at its showroom, and ask about buying terms on the brand’s sales line.",
    },
    brands: ["jetour", "soueast", "chery", "byd", "riddara", "aito", "212", "bestune", "rely", "maxus", "hongqi"],
    status: "draft",
    source: `${DRIVE}; company brand banner`,
  },
  {
    id: "financing",
    title: { mn: "Санхүүжилтийн зөвлөгөө", en: "Financing advice" },
    body: {
      mn: "Банкны санхүүжилт, зээлийн нөхцөлийг тайлбарлаж, шаардлагатай материалыг бүрдүүлэхэд тусална.",
      en: "We explain bank financing and loan terms and help you prepare the documents.",
    },
    brands: ["jetour", "chery"],
    locations: ["jetour-c1", "chery-narny"],
    status: "draft",
    source: `${JETOUR_SITE} (showroom services); ${CHERY_SITE}.finance (leasing from 10% down, up to 96 months)`,
  },
  {
    id: "after-sales",
    title: { mn: "Үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээ", en: "Factory warranty and after-sales service" },
    body: {
      mn: "Эдгээр брэндийн автомашин үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээ, мэргэжлийн зөвлөгөөтэй. Нөхцөлийг брэндийн шоурумаас лавлана уу.",
      en: "These brands come with factory warranty, after-sales service and expert advice. Ask the brand’s showroom for the terms.",
    },
    brands: ["jetour", "chery", "hongqi", "byd", "aito", "riddara", "212", "rely", "soueast"],
    status: "draft",
    source: `${DRIVE} (distributor statements); SOUEAST BRAND sheet supplied 2026-10-22 (warranty and after-sales); ${JETOUR_SITE} (warranty repairs); ${CHERY_SITE}.warranty (3 years or 100,000 km)`,
  },
  {
    id: "repair",
    title: { mn: "Засвар, сэлбэг", en: "Repairs and parts" },
    body: {
      mn: "JETOUR-ын засвар үйлчилгээ, оношилгоо, оригинал сэлбэгийг үйлчилгээний төв, BYD-ийн засвар, сэлбэгийг BYD 4S шоурум хариуцна. SOUEAST-ийн мэргэжлийн засвар, сэлбэгийн талаар брэндийн багтай холбогдож, үйлчлүүлэх байршлаа тодруулна уу.",
      en: "The JETOUR service centre handles JETOUR maintenance, diagnostics and genuine parts; the BYD 4S showroom handles BYD repairs and parts. For SOUEAST professional repairs and parts, contact the brand team to confirm the service location.",
    },
    brands: ["jetour", "byd", "soueast"],
    locations: ["service-centre", "byd-4s"],
    status: "draft",
    source: `${JETOUR_SITE}; ${DRIVE}: BYD; SOUEAST BRAND sheet supplied 2026-10-22 (repair and parts support, workshop not specified)`,
  },
];

