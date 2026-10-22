import type { Photo } from "./types";

// Section photography outside the brand pages. The jetour.mn showroom photos
// came first; Sain Motors' own web photo set (Desktop sainmotorsWebPhotos,
// 2026-10-20: drone frames, Canon/Sony photographs, Facebook exports) adds the
// company building, showroom life and the first service-centre photographs.
// Provenance: docs/content-sources.md. Alt text describes only what is visible.
export const sitePhotos = {
  /** Contact page: the company's own building with several brands' cars in front; no single brand leads. */
  hero: {
    key: "sain-hq-aerial",
    alt: {
      mn: "Сайн Моторс-ын шоурумын барилга, урд талбайд нь эгнэн зогсох автомашинууд. Дроноор авсан зураг",
      en: "The Sain Motors showroom building with cars lined up in front, seen from a drone",
    },
    status: "sourced",
    focus: "62% 50%",
  },
  /** Home hero: photographs the visitor switches between, led by the company rather than one brand and shown nowhere else. */
  homeHero: [
    {
      key: "sain-front-lineup",
      alt: {
        mn: "Сайн Моторс-ын барилгын өмнө улаан хивсэн дээр эгнэн зогсох шинэ автомашинууд",
        en: "New cars lined up on red carpets in front of the Sain Motors building",
      },
      status: "sourced",
      focus: "50% 60%",
    },
    {
      key: "sain-front-ramp",
      alt: {
        mn: "Сайн Моторс-ын барилгын өмнө налуу тавцан дээр зогсох улбар шар пикап, ард нь эгнэн зогсох автомашинууд",
        en: "An orange pickup on a display ramp in front of the Sain Motors building, with cars lined up behind it",
      },
      status: "sourced",
      focus: "45% 60%",
    },
    {
      key: "sain-event-aerial",
      alt: {
        mn: "Сайн Моторс-ын барилгын өмнөх талбайд цугларсан автомашин, зочид. Дроноор авсан зураг",
        en: "Cars and visitors across the forecourt of the Sain Motors building, seen from a drone",
      },
      status: "sourced",
      focus: "50% 40%",
    },
    {
      key: "test-drive-lineup",
      alt: {
        mn: "TEST DRIVE бичигтэй хар жийп, улбар шар пикап; ард нь SAIN MOTORS × BYD самбар",
        en: "A black off-roader marked TEST DRIVE and an orange pickup, with the SAIN MOTORS × BYD sign behind",
      },
      status: "sourced",
      focus: "45% 55%",
    },
  ],
  story: {
    key: "showroom-lounge",
    alt: {
      mn: "Сайн Моторс-ын шоурумын зөвлөгөөний хэсэг, хоёр давхар оффис",
      en: "Advice desks and the two-storey office inside the Sain Motors showroom",
    },
    status: "sourced",
    focus: "40% 60%",
  },
  /** Home, showroom section: a walk from the street to the driver's seat, shown as a depth gallery. */
  showroomTour: [
    {
      key: "sain-hq-sign",
      label: { mn: "Сайн Моторс", en: "Sain Motors" },
      alt: { mn: "Сайн Моторс-ын барилгын улаан хаяг", en: "Sain Motors signage on the showroom building" },
      status: "sourced",
      focus: "45% 45%",
    },
    {
      key: "showroom-event-212",
      label: { mn: "Шоурумын өмнө", en: "Outside the showroom" },
      alt: {
        mn: "Шоурумын өмнө налуу тавцан дээр зогсох цэнхэр 212-ыг зочид сонирхож буй нь",
        en: "Visitors around a blue 212 on a display ramp outside the showroom",
      },
      status: "sourced",
      focus: "55% 55%",
    },
    {
      key: "showroom-interior",
      label: { mn: "Шоурум", en: "Showroom" },
      alt: {
        mn: "Шоурумын дотоод заал: зөвлөгөөний ширээ, шинэ загваруудын пост, автомашинууд",
        en: "Inside the showroom: advice desks, new-model posters and cars on display",
      },
      status: "sourced",
      focus: "50% 60%",
    },
    {
      key: "showroom-floor",
      label: { mn: "Үзэсгэлэнгийн танхим", en: "Display floor" },
      alt: { mn: "Гэрэлтэй шоурумын танхимд байрлах автомашинууд", en: "Cars on the bright showroom floor" },
      status: "sourced",
      focus: "55% 60%",
    },
    {
      key: "showroom-advice",
      label: { mn: "Зөвлөгөө", en: "Advice" },
      alt: { mn: "Зөвлөгөөний ширээний ард ажиллаж буй шоурумын баг", en: "The showroom team at the advice desk" },
      status: "sourced",
      focus: "50% 45%",
    },
    {
      key: "showroom-up-close",
      label: { mn: "Дэргэдээс нь", en: "Up close" },
      alt: {
        mn: "Зөвлөх улбар шар RELY R8 пикапыг үйлчлүүлэгчдэд танилцуулж буй нь",
        en: "A consultant introducing the orange RELY R8 pickup to visitors",
      },
      status: "sourced",
      focus: "55% 40%",
    },
  ],
  /** Home, services teaser: opens from a framed view to full width as it scrolls in. */
  servicesTeaser: {
    key: "service-workshop",
    alt: {
      mn: "SERVICE гэрэлтэй хаягтай засварын танхимд техникч автомашины капотыг нээж шалгаж буй нь",
      en: "A technician checks a car under the illuminated SERVICE sign in the workshop",
    },
    status: "sourced",
    focus: "50% 45%",
  },
  /** Services page header. */
  servicesHeader: {
    key: "service-team",
    alt: { mn: "Засварын танхимаар алхаж буй сервисийн ажилтнууд", en: "Service staff walking through the workshop" },
    status: "sourced",
    focus: "35% 50%",
  },
  /** Services page: the technical team at work and in training. */
  serviceGallery: [
    {
      key: "service-battery",
      label: { mn: "Батарей", en: "Battery" },
      alt: {
        mn: "Хамгаалалтын бээлийтэй техникчид цахилгаан автомашины батарейтай ажиллаж буй нь",
        en: "Technicians in insulated gloves working on an electric-car battery pack",
      },
      status: "sourced",
      focus: "50% 55%",
    },
    {
      key: "service-lift-hv",
      label: { mn: "Өндөр хүчдэл", en: "High voltage" },
      alt: {
        mn: "Хамгаалалтын малгай, бээлий өмссөн техникч өргүүр дээрх автомашины доор ажиллаж буй нь",
        en: "A technician in a hard hat and insulated gloves working under a car on a lift",
      },
      status: "sourced",
      focus: "55% 45%",
    },
    {
      key: "service-battery-lift",
      label: { mn: "Оношилгоо", en: "Diagnostics" },
      alt: {
        mn: "Батарейг өргөгч төхөөрөмж дээр шалгаж буй техникийн баг",
        en: "The technical team examining a battery pack on a lifting rig",
      },
      status: "sourced",
      focus: "50% 50%",
    },
    {
      key: "service-under-lift",
      label: { mn: "Засвар", en: "Repairs" },
      alt: {
        mn: "Өргүүр дээрх автомашины доод хэсгийг шалгаж буй техникчид",
        en: "Technicians inspecting the underside of a car on a lift",
      },
      status: "sourced",
      focus: "50% 50%",
    },
    {
      key: "service-training-hv",
      label: { mn: "Сургалт", en: "Training" },
      alt: {
        mn: "Техникийн сургалтын үеэр өргүүр дээрх автомашиныг шалгаж буй нь",
        en: "Checking a car on a lift during technical training",
      },
      status: "sourced",
      focus: "50% 40%",
    },
    {
      key: "service-training-group",
      label: { mn: "Гэрчилгээ", en: "Certified" },
      alt: {
        mn: "BYD-ийн техникийн сургалтын гэрчилгээгээ барьсан баг",
        en: "Team members holding their BYD technical training certificates",
      },
      status: "sourced",
      focus: "50% 55%",
    },
  ],
  /** Home, locations: the JETOUR showroom hall (C1 TV building). */
  showroomBand: {
    key: "showroom-hall",
    alt: {
      mn: "JETOUR шоурумын танхим: SAIN MOTORS хаягийн доор эгнэн зогсох шинэ автомашинууд",
      en: "The JETOUR showroom hall: new cars on display beneath the SAIN MOTORS sign",
    },
    status: "sourced",
    focus: "50% 50%",
  },
  aboutHeader: {
    key: "showroom-entrance",
    alt: {
      mn: "Сайн Моторс-ын шоурумд эгнэн зогсох JETOUR автомашинууд",
      en: "JETOUR cars lined up in the Sain Motors showroom",
    },
    status: "sourced",
    focus: "50% 62%",
  },
  aboutDetail: {
    key: "showroom-gallery",
    alt: {
      mn: "Дэлгэц бүхий шоурумын үзэсгэлэнгийн коридор",
      en: "Showroom display corridor with screens",
    },
    status: "sourced",
    focus: "50% 55%",
  },
} satisfies Record<string, Photo | Photo[]>;
