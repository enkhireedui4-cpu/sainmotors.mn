import type { Brand, BrandLink } from "./types";

// Eleven brands: the ten on the company's own brand banner (2026-10-15) in its
// order, plus HONGQI, which has a full brand sheet and distributor statement
// on Drive. Facts come from the brand teams' Drive sheets (2026-10-16); see
// docs/content-sources.md for file IDs and the conflicts still open.
//
// Status: sheet text is "sourced" (received, not approved). Where the web team
// condensed a statement or translated it into English, the block is "draft".

const GRAPHITE = "#1F2125";
const CHECKED = "2026-10-17";

const DRIVE_212 = "Desktop brands6 / supplied brand-team sheets (also held in Drive: 212 team)";
const DRIVE_BYD = "Desktop 3brand / supplied brand-team sheets (also held in Drive: BYD team)";

/** Mongolian Facebook pages confirmed by name ("… Mongolia - Sain Motors") through Facebook's public page plugin. */
const PAGES_CHECKED = "2026-10-20";

const site = (url: string, live = true): BrandLink => ({ kind: "website", url, live, checked: CHECKED });
const facebook = (url: string, checked = CHECKED): BrandLink => ({ kind: "facebook", url, live: true, checked });
const phone = (digits: string) => ({ display: `${digits.slice(0, 4)}-${digits.slice(4)}`, href: `tel:+976${digits}` });

export const brands: Brand[] = [
  {
    slug: "jetour",
    cardCopy: {
      status: "draft", source: "Condensed from existing JETOUR summary",
      value: { mn: "Аялал, адал явдлын SUV.\nХотын замаас шинэ аялал руу.", en: "Travel and adventure SUVs.\nFor the city and the open road." },
    },
    name: "JETOUR",
    published: true,
    order: 1,
    accent: GRAPHITE,
    summary: {
      status: "draft",
      value: {
        mn: "JETOUR нь аялал, адал явдалд зориулсан SUV загваруудаараа танигдсан брэнд. Загвар бүрийн дэлгэрэнгүй, тоноглолыг Сайн Моторс-ын хөтөлдөг jetour.mn сайтаас үзнэ үү.",
        en: "JETOUR is known for SUVs built around travel and adventure. Full model details and specifications are on jetour.mn, which Sain Motors runs.",
      },
    },
    statement: {
      status: "sourced",
      source: "jetour.mn page title: «JETOUR — Албан ёсны дистрибьютор SAIN MOTORS»",
      value: {
        mn: "Сайн Моторс нь JETOUR брэндийн Монгол дахь албан ёсны дистрибьютор.",
        en: "Sain Motors is the official distributor of JETOUR in Mongolia.",
      },
    },
    teaser: {
      status: "draft",
      source: "Condensed by the web team from jetour.mn; company.ts locations",
      value: {
        mn: "JETOUR нь аялал, адал явдалд зориулсан SUV загваруудаараа танигдсан брэнд. Сайн Моторс нь түүний Монгол дахь албан ёсны дистрибьютор бөгөөд Улаанбаатарт тусгай шоурум, үйлчилгээний төвтэй. Загварын дэлгэрэнгүйг jetour.mn-ээс үзнэ үү.",
        en: "JETOUR builds SUVs for travel and adventure. Sain Motors is its official distributor in Mongolia, with a dedicated showroom and service centre in Ulaanbaatar. Full model details are on jetour.mn.",
      },
    },
    // JETOUR news is posted on Sain Motors' main page ("Sain Motors - Сайн Моторс ХХК"), which jetour.mn also links.
    links: [site("https://jetour.mn/"), facebook("https://www.facebook.com/Sainmotors.mn", PAGES_CHECKED)],
    location: "jetour-c1",
    phone: phone("70108855"),
    photo: {
      key: "jetour-t2-idm",
      alt: { mn: "Ойн шороон замаар явж буй JETOUR T2 i-DM", en: "JETOUR T2 i-DM on a forest track" },
      status: "sourced",
      caption: "JETOUR T2 i-DM",
      focus: "62% 60%",
      note: "JETOUR campaign image supplied by the user on 2026-10-18 (Desktop 484076260_1048089224014777_7683491303160709584_n.jpg, a Facebook export); replaces the jetour.mn T2 image.",
    },
  },
  {
    slug: "soueast",
    cardPhoto: {
      key: "brand-soueast-s08", status: "sourced", caption: "SOUEAST S08", focus: "50% 55%",
      alt: { mn: "Студид зогсож буй цэнхэр ногоон өнгийн SOUEAST S08", en: "A teal SOUEAST S08 in a studio" },
      note: "Studio render of the S08 in colour option 3, supplied by the user on 2026-10-22 (Desktop S08/Ungu songolt 3.tif, 2048×2048); replaces the S09 key visual at the user's request.",
    },
    cardCopy: {
      status: "draft", source: "Vehicle category from https://www.soueast-motor.com/s09/; web-team translation",
      value: { mn: "Хот, гэр бүлийн хэрэглээний SUV.\nӨдөр тутмын аяллын сонголт.", en: "SUVs for city and family life.\nSpace for everyday journeys." },
    },
    name: "SOUEAST",
    published: true,
    order: 2,
    accent: GRAPHITE,
    summary: {
      status: "draft",
      value: {
        mn: "SOUEAST брэндийн загвар, худалдан авалтын нөхцөлийг Holiday Inn зочид буудлын урдах SOUEAST шоурумаас эсвэл борлуулалтын утсаар лавлана уу.",
        en: "Ask about SOUEAST models and buying options at the SOUEAST showroom in front of the Holiday Inn, or call its sales line.",
      },
    },
    teaser: {
      status: "draft",
      source: "Condensed by the web team from the company brand banner and the SOUEAST Facebook page intro (2026-10-20)",
      value: {
        mn: "SOUEAST нь Сайн Моторс-ын брэндийн багцад багтдаг. Шоурум нь Чингэлтэй дүүрэгт, Holiday Inn зочид буудлын урд байрладаг. Загвар, бэлэн байдал, худалдан авалтын нөхцөлийг шоурумаас эсвэл борлуулалтын утсаар лавлана уу.",
        en: "SOUEAST is part of the Sain Motors portfolio. Its showroom is in Chingeltei, in front of the Holiday Inn. Ask there or call its sales line about models, availability and buying options.",
      },
    },
    // "SOUEAST Mongolia - Sain Motors", address supplied by the user (2026-10-20).
    links: [facebook("https://www.facebook.com/people/SOUEAST-Mongolia-Sain-Motors/61584232004745/", PAGES_CHECKED)],
    // Showroom and line from the same page's intro.
    location: "soueast",
    phone: phone("72998866"),
  },
  {
    slug: "chery",
    photo: {
      key: "brand-chery-tiggo7-promax-road", status: "sourced", caption: "CHERY TIGGO 7 PRO MAX", focus: "38% 58%",
      alt: { mn: "Гүүрэн дээгүүр явж буй цэнхэр CHERY TIGGO 7 PRO MAX", en: "Blue CHERY TIGGO 7 PRO MAX driving across a bridge" },
      note: "Supplied by the user on 2026-10-18 (Desktop 37628.png) for the dedicated brand page; model name is visible on the vehicle plate. Full source preserved, with responsive object positioning keeping the entire vehicle in frame.",
    },
    cardPhoto: {
      key: "brand-chery-tiggo7-promax", status: "sourced", caption: "CHERY TIGGO 7 PRO MAX", focus: "50% 50%",
      alt: { mn: "Орчин үеийн барилгын өмнө зогсох цэнхэр CHERY TIGGO 7 PRO MAX", en: "Blue CHERY TIGGO 7 PRO MAX outside a modern building" },
      note: "Supplied by the user on 2026-10-18 (Desktop 37620.png); model name is visible on the vehicle plate. Homepage card replacement, with a 1680 by 1050 crop preserving the whole vehicle.",
    },
    cardCopy: {
      status: "draft", source: "SUV category from CHERY International TIGGO range; web-team translation",
      value: { mn: "Гэр бүл, өдөр тутмын SUV.\nХотын хэмнэлд тохирох сонголт.", en: "SUVs for family and daily life.\nExplore the TIGGO range." },
    },
    name: "CHERY",
    published: true,
    order: 3,
    accent: "#E9011A",
    summary: {
      status: "draft",
      source: "Web team, from Sain Motors' CHERY site (Desktop chery: PRODUCT.md models, messages warranty)",
      value: {
        mn: "CHERY нь TIGGO цувралын SUV-аараа танигдсан брэнд. Сайн Моторс TIGGO 2, TIGGO 4, TIGGO 7, TIGGO 8 загваруудыг Нарны хороолол дахь CHERY шоурумдаа 3 жил буюу 100,000 км-ийн үйлдвэрийн баталгаатай санал болгодог.",
        en: "CHERY is known for its TIGGO range of SUVs. Sain Motors offers the TIGGO 2, TIGGO 4, TIGGO 7 and TIGGO 8 at its CHERY showroom in Narny Khoroolol, with a factory warranty of 3 years or 100,000 km.",
      },
    },
    statement: {
      status: "sourced",
      source: "Sain Motors CHERY site (Desktop chery) — lib/content.ts site.legal + site.role",
      value: {
        mn: "Сайн Моторс ХХК нь Chery брэндийн Монгол дахь албан ёсны дистрибьютор.",
        en: "Sain Motors LLC is the official distributor of Chery in Mongolia.",
      },
    },
    models: ["TIGGO 2", "TIGGO 4", "TIGGO 7", "TIGGO 8"],
    // chery.mn did not resolve on 2026-10-17 or 2026-10-18; it is linked once it is live.
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Sain Motors' CHERY site (Desktop chery)",
      value: {
        mn: "TIGGO цувралын SUV-аараа танигдсан CHERY-гийн Монгол дахь албан ёсны дистрибьютор нь Сайн Моторс. TIGGO 2, TIGGO 4, TIGGO 7, TIGGO 8 загваруудыг Нарны хороолол дахь CHERY шоурумаас үзнэ үү.",
        en: "Sain Motors is the official distributor in Mongolia of CHERY, known for its TIGGO SUVs. See the TIGGO 2, TIGGO 4, TIGGO 7 and TIGGO 8 at the CHERY showroom in Narny Khoroolol.",
      },
    },
    links: [facebook("https://www.facebook.com/CheryMongolia", PAGES_CHECKED), site("https://chery.mn/", false)],
    location: "chery-narny",
    phone: phone("72558855"),
  },
  {
    slug: "byd",
    cardCopy: {
      status: "draft", source: "Condensed from Drive BYD team summary and distributor statement",
      value: { mn: "Цахилгаан ба plug-in hybrid.\nӨдөр тутмын шинэ сонголт.", en: "Electric and plug-in hybrid cars.\nA new choice for daily journeys." },
    },
    name: "BYD",
    published: true,
    order: 4,
    accent: GRAPHITE,
    summary: {
      status: "sourced",
      source: `${DRIVE_BYD} / Мэдээлэл BYD (subject "BYD" added to the first sentence)`,
      value: {
        mn: "BYD нь 1995 онд Хятадын Шэньчжэнь хотод Ван Чуаньфүгийн үүсгэн байгуулсан компани. Анх батерейн үйлдвэрлэлээр эхэлж, 2003 оноос автомашины чиглэлд орсон. Цэвэр цахилгаан (BEV) болон plug-in hybrid (PHEV) машины дэлхийн томоохон үйлдвэрлэгчдийн нэг. Өөрийн Blade батерей, DM-i hybrid технологи, e-Platform зэрэг бүх гол системээ өөрсдөө хөгжүүлдэг нь гол давуу тал.",
        en: "BYD was founded in 1995 in Shenzhen, China, by Wang Chuanfu. It started as a battery maker and entered automobiles in 2003, and is one of the world’s largest makers of battery-electric (BEV) and plug-in hybrid (PHEV) vehicles. Its main strength is vertical integration: it develops its own Blade Battery, DM-i hybrid technology and e-Platform.",
      },
    },
    statement: {
      status: "draft",
      source: `MN condensed from ${DRIVE_BYD} / Мэдээлэл BYD; EN by the web team`,
      value: {
        mn: "Сайн Моторс ХХК нь 2025 оноос эхлэн BYD брэндийн Монгол дахь албан ёсны дистрибьютороор ажиллаж байна. TI 7, Shark 6, Sealion 6, Atto 3 загваруудыг үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээ, мэргэжлийн засвар, сэлбэгийн хамт санал болгодог.",
        en: "Sain Motors has been the official distributor of BYD in Mongolia since 2025. We offer the TI 7, Shark 6, Sealion 6 and Atto 3 with factory warranty, after-sales service, professional repairs and spare parts.",
      },
    },
    since: 2025,
    models: ["TI 7", "Shark 6", "Sealion 6", "Atto 3"],
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Drive BYD team / Мэдээлэл BYD",
      value: {
        mn: "1995 онд Шэньчжэнь хотод үүсгэн байгуулагдсан BYD нь цахилгаан болон plug-in hybrid автомашины дэлхийн томоохон үйлдвэрлэгчдийн нэг. Сайн Моторс 2025 оноос албан ёсны дистрибьютор бөгөөд BYD 4S шоурумд засвар, сэлбэгийн үйлчилгээ үзүүлдэг.",
        en: "Founded in Shenzhen in 1995, BYD is one of the world’s largest makers of electric and plug-in hybrid vehicles. Sain Motors has been its official distributor since 2025, with repairs and parts at the BYD 4S showroom.",
      },
    },
    links: [facebook("https://www.facebook.com/profile.php?id=61579315933755", PAGES_CHECKED)],
    location: "byd-4s",
    phone: phone("72508855"),
    photo: {
      key: "brand-byd-atto3",
      alt: { mn: "Хотын гудамжаар явж буй BYD Atto 3", en: "BYD Atto 3 on a city street" },
      status: "sourced",
      caption: "BYD Atto 3",
      focus: "62% 62%",
      note: "Desktop 3brand/BYD/Atto 3/BYD_atto3_kv4_城市路跑 拷贝.jpg",
    },
    gallery: [
      {
        key: "brand-byd-ti7", status: "sourced", caption: "BYD TI 7", focus: "52% 58%",
        alt: { mn: "Брэндийн багаас өгсөн TI 7 загварын зураг", en: "TI 7 model image supplied by the brand team" },
        note: "Desktop 3brand/BYD/TI 7; supplied image used at the user's explicit request.",
      },
      {
        key: "brand-byd-sealion6",
        alt: { mn: "Студид авсан BYD Sealion 6", en: "BYD Sealion 6 in the studio" },
        status: "sourced",
        caption: "BYD Sealion 6",
        focus: "52% 58%",
      },
      {
        key: "brand-byd-atto3-coast", status: "sourced", caption: "BYD Atto 3", focus: "48% 57%",
        alt: { mn: "Далайн эргийн замаар явж буй BYD Atto 3", en: "BYD Atto 3 on a coastal road" },
        note: "Desktop 3brand/BYD/Atto 3",
      },
      // The three Shark 6 views share the second row; views follow the source file names.
      {
        key: "brand-byd-shark6",
        alt: { mn: "Студид авсан BYD Shark 6 пикап", en: "BYD Shark 6 pickup in the studio" },
        status: "sourced",
        caption: "BYD Shark 6",
        view: { mn: "урдаас", en: "front" },
        focus: "48% 52%",
        note: "Desktop 3brand/BYD/Shark 6/Exterior-Front 45°.jpg",
      },
      {
        key: "brand-byd-shark6-top", status: "sourced", caption: "BYD Shark 6", focus: "50% 53%",
        view: { mn: "дээрээс", en: "top" },
        alt: { mn: "BYD Shark 6 загварыг дээрээс харуулсан зураг", en: "BYD Shark 6 viewed from above" },
        note: "Desktop 3brand/BYD/Shark 6/Exterior-Top View 45° Front.jpg",
      },
      {
        key: "brand-byd-shark6-side", status: "sourced", caption: "BYD Shark 6", focus: "50% 50%",
        view: { mn: "хажуугаас", en: "side" },
        alt: { mn: "Хажуу талаас харуулсан цэнхэр BYD Shark 6", en: "Blue BYD Shark 6 viewed from the side" },
        note: "Desktop 3brand/BYD/Shark 6/Left 45° blue.png",
      },
    ],
  },
  {
    slug: "riddara",
    models: ["RD6"],
    photo: {
      key: "brand-riddara-rd6", status: "sourced", caption: "RIDDARA RD6", focus: "53% 55%",
      alt: { mn: "Ойн дунд зогсож буй ногоон RIDDARA RD6 пикап", en: "Green RIDDARA RD6 pickup in a forest setting" },
      note: "Desktop 3brand/Riddara/RD6/Riddara RD6.png; brand-team supplied material confirmed by the user.",
    },
    cardCopy: {
      status: "draft", source: "Condensed from Drive BYD team RIDDARA summary",
      value: { mn: "Цэвэр цахилгаан пикап.\nАжил, өдөр тутам, аялалд.", en: "Fully electric pickups.\nFor work, daily life and leisure." },
    },
    name: "RIDDARA",
    published: true,
    order: 5,
    accent: GRAPHITE,
    summary: {
      status: "sourced",
      source: `${DRIVE_BYD} / Мэдээлэл Riddara (first sentence reworded: the sheet calls Riddara "the export name of Riddara")`,
      value: {
        mn: "RIDDARA нь Geely Holding группийн цахилгаан пикапад төвлөрсөн брэнд бөгөөд гол загвар нь RD6. Ажил хэрэг, өдөр тутмын болон аяллын хэрэглээнд зориулсан цэвэр цахилгаан пикап гэдгээрээ ялгардаг.",
        en: "RIDDARA is a Geely Holding brand focused on electric pickups, with the RD6 as its key model. It stands out as a fully electric pickup for work, daily use and leisure.",
      },
    },
    statement: {
      status: "draft",
      source: `MN condensed from ${DRIVE_BYD} / Мэдээлэл Riddara; EN by the web team`,
      value: {
        mn: "Сайн Моторс ХХК нь 2025 оноос эхлэн RIDDARA брэндийн Монгол дахь албан ёсны дистрибьютороор ажиллаж, үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээ, мэргэжлийн зөвлөгөөний хамт санал болгож байна.",
        en: "Sain Motors has been the official distributor of RIDDARA in Mongolia since 2025, offering factory warranty, after-sales service and expert advice.",
      },
    },
    since: 2025,
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Drive BYD team / Мэдээлэл Riddara",
      value: {
        mn: "RIDDARA нь Geely Holding группийн цэвэр цахилгаан пикапад төвлөрсөн брэнд бөгөөд гол загвар нь RD6 — ажил, өдөр тутам, аялалд зориулагдсан. Сайн Моторс 2025 оноос Монгол дахь албан ёсны дистрибьютор нь.",
        en: "RIDDARA is a Geely Holding brand dedicated to fully electric pickups, led by the RD6 for work, daily driving and leisure. Sain Motors has been its official distributor in Mongolia since 2025.",
      },
    },
    // "Riddara Mongolia - Sain Motors", address supplied by the user (2026-10-20).
    links: [facebook("https://www.facebook.com/p/Riddara-Mongolia-Sain-Motors-61572981115327/", PAGES_CHECKED)],
    location: "dolgoon-nuur",
    phone: phone("72708855"),
  },
  {
    slug: "aito",
    models: ["M5", "M7", "M9"],
    cardCopy: {
      status: "draft", source: "Condensed from Drive BYD team AITO summary and showroom record",
      value: { mn: "Ухаалаг технологитой SUV.\nТав тухыг эрхэмлэх сонголт.", en: "SUVs with intelligent technology.\nDesigned around your comfort." },
    },
    name: "AITO",
    published: true,
    order: 6,
    accent: GRAPHITE,
    summary: {
      status: "sourced",
      source: `${DRIVE_BYD} / Мэдээлэл AITO (subject "AITO" added)`,
      value: {
        mn: "AITO нь Хятадын Seres компани болон Huawei-н хамтарсан брэнд. Huawei-н ухаалаг кокпит (HarmonyOS), ухаалаг жолоодлогын систем, цахилгаан эрчим хүчний технологийг ашигладаг. Гол загварууд нь M5, M7, M9; зарим загвар нь өргөтгөсөн хүрээт (EREV) системтэй. Технологи, тав тух, дэвшилтэт ухаалаг функцээрээ онцлог.",
        en: "AITO is a brand from China’s Seres in partnership with Huawei. It uses Huawei’s HarmonyOS smart cockpit, intelligent driving system and electric powertrain technology. Key models are the M5, M7 and M9, and some use extended-range (EREV) systems. It is known for technology, comfort and advanced smart features.",
      },
    },
    statement: {
      status: "draft",
      source: `MN condensed from ${DRIVE_BYD} / Мэдээлэл AITO; EN by the web team`,
      value: {
        mn: "Сайн Моторс ХХК нь 2025 оноос эхлэн AITO брэндийн Монгол дахь албан ёсны дистрибьютороор ажиллаж, үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээ, мэргэжлийн зөвлөгөөний хамт санал болгож байна.",
        en: "Sain Motors has been the official distributor of AITO in Mongolia since 2025, offering factory warranty, after-sales service and expert advice.",
      },
    },
    since: 2025,
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Drive BYD team / Мэдээлэл AITO",
      value: {
        mn: "AITO нь Seres болон Huawei-н хамтарсан брэнд бөгөөд HarmonyOS ухаалаг кокпит, ухаалаг жолоодлого, цахилгаан хөдөлгүүрийг M5, M7, M9 загвартаа хослуулдаг. Сайн Моторс 2025 оноос албан ёсны дистрибьютор нь.",
        en: "AITO, from Seres in partnership with Huawei, pairs HarmonyOS smart cockpits and intelligent driving with electrified powertrains across the M5, M7 and M9. Sain Motors has been its official distributor since 2025.",
      },
    },
    // "AITO Mongolia - Sain Motors", address supplied by the user (2026-10-20); its listed phone matches AITO's sales line.
    links: [facebook("https://www.facebook.com/p/AITO-Mongolia-Sain-Motors-61575759152945/", PAGES_CHECKED)],
    location: "sansar",
    phone: phone("72118855"),
    photo: {
      key: "brand-aito-m9",
      alt: { mn: "Шөнийн гэрэлтэй барилгын өмнө зогсох AITO M9", en: "AITO M9 outside a lit building at night" },
      status: "sourced",
      caption: "AITO M9",
      focus: "58% 66%",
      note: "Desktop 3brand/Aito/M9/AITO 9 Midnight Black (Dual-Tone)(1).jpg",
    },
    gallery: [
      {
        key: "brand-aito-m5",
        alt: { mn: "Уулын замаар явж буй улаан AITO M5", en: "Red AITO M5 on a mountain road" },
        status: "sourced",
        caption: "AITO M5",
        focus: "52% 55%",
      },
      {
        key: "brand-aito-m7",
        alt: { mn: "Нар жаргах үеийн тольдсон гадаргуу дээр AITO M7", en: "AITO M7 on a mirror-like surface at sunset" },
        status: "sourced",
        caption: "AITO M7",
        focus: "46% 56%",
      },
    ],
  },
  {
    slug: "212",
    cardCopy: {
      status: "draft", source: "Condensed from Drive 212 team summary and headline",
      value: { mn: "Бартаат замын автомашин.\nШинэ зам, шинэ адал явдалд.", en: "Off-road vehicles for adventure.\nClassic design, rugged character." },
    },
    name: "212",
    published: true,
    order: 7,
    accent: GRAPHITE,
    summary: {
      status: "sourced",
      source: `${DRIVE_212} / 212 Мэдээлэл`,
      value: {
        mn: "212 нь 1965 оноос эхлэлтэй, БНХАУ-ын бартаат замын автомашины салбарын түүхэн өвийг хадгалсан брэнд юм. Сонгодог загвар, бат бөх бүтэц, бартаат зам туулах чадвараараа онцлог 212 нь 2024 онд бие даасан брэнд болон шинэчлэгдэж, уламжлал ба инновацыг хослуулан хөгжиж байна.",
        en: "212 is a Chinese off-road vehicle brand with a heritage dating back to 1965. Known for its classic design, rugged construction and off-road capability, 212 was relaunched as an independent brand in 2024, combining tradition with modern innovation.",
      },
    },
    statement: {
      status: "draft",
      source: `MN condensed from ${DRIVE_212} / 212 Мэдээлэл; EN by the web team`,
      value: {
        mn: "Сайн Моторс ХХК нь 2025 оноос эхлэн 212 брэндийн Монгол дахь албан ёсны дистрибьютороор ажиллаж, үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээ, мэргэжлийн зөвлөгөөний хамт санал болгож байна.",
        en: "Sain Motors has been the official distributor of 212 in Mongolia since 2025, offering factory warranty, after-sales service and expert advice.",
      },
    },
    headline: {
      status: "sourced",
      source: `${DRIVE_212} / 212 Мэдээлэл`,
      value: { mn: "Адал явдалд зориулагдсан", en: "Built for adventure" },
    },
    since: 2025,
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Drive 212 team / 212 Мэдээлэл",
      value: {
        mn: "1965 оноос эхэлсэн бартаат замын өвтэй 212 нь 2024 онд бие даасан брэнд болон шинэчлэгдэж, сонгодог загвар, бат бөх инженерчлэлийг хослуулсан. Сайн Моторс 2025 оноос албан ёсны дистрибьютор нь.",
        en: "With an off-road heritage dating back to 1965, 212 was relaunched as an independent brand in 2024, pairing classic design with rugged engineering. Sain Motors has been its official distributor since 2025.",
      },
    },
    links: [facebook("https://www.facebook.com/profile.php?id=61574822528259")],
    location: "dolgoon-nuur",
    phone: phone("72228855"),
    photo: {
      key: "brand-212",
      alt: { mn: "Уулсын бэлд зогсох 212 бартаат замын автомашин", en: "212 off-road vehicle at the foot of the mountains" },
      status: "sourced",
      focus: "45% 62%",
      note: "Desktop brands6/212/Photo/БРЭНДИЙН ҮНДСЭН АВТОМАШИНЫ ЗУРАГ.jpg",
    },
  },
  {
    slug: "bestune",
    photo: {
      key: "brand-bestune", status: "sourced", caption: "FAW BESTUNE", focus: "54% 55%",
      alt: { mn: "Орчин үеийн барилгын өмнө зогсох хар BESTUNE SUV", en: "Black BESTUNE SUV outside a contemporary building" },
      note: "Desktop brands6/FAW BESTUNE/Photo/Bestune.png; no unconfirmed model name is inferred from the image.",
    },
    cardCopy: {
      status: "draft", source: "Condensed from Drive 212 team BESTUNE summary",
      value: { mn: "Седан болон SUV загварууд.\nХот, гэр бүлийн хэрэглээнд.", en: "Contemporary sedans and SUVs.\nFor city driving and family life." },
    },
    name: "FAW BESTUNE",
    published: true,
    order: 8,
    accent: GRAPHITE,
    summary: {
      status: "sourced",
      source: `${DRIVE_212} / FAW BESTUNE мэдээлэл`,
      value: {
        mn: "Bestune нь БНХАУ-ын томоохон автомашин үйлдвэрлэгчдийн нэг болох 70 жилийн үүх түүхтэй FAW Group-ийн автомашины брэнд юм. Тус брэнд нь орчин үеийн загвар, дэвшилтэт технологи, тав тухтай салон, өрсөлдөхүйц үнээрээ онцлог седан болон SUV загваруудыг санал болгодог.",
        en: "Bestune is an automotive brand under FAW Group, one of China’s leading automobile manufacturers with a 70-year history. The brand offers sedans and SUVs with modern design, advanced technology, comfortable interiors and competitive pricing.",
      },
    },
    statement: {
      status: "draft",
      source: `MN from ${DRIVE_212} / FAW BESTUNE мэдээлэл; EN by the web team`,
      value: {
        mn: "2025 оноос эхлэн Сайн Моторс ХХК албан ёсны эрхтэйгээр BESTUNE брэндийн B70, T77, T90, T99, NAT PRO загваруудыг борлуулж байна.",
        en: "Since 2025, Sain Motors has sold BESTUNE’s B70, T77, T90, T99 and NAT PRO under official rights.",
      },
    },
    headline: {
      status: "sourced",
      source: `${DRIVE_212} / FAW BESTUNE мэдээлэл`,
      value: { mn: "Үнэ чанарын төгс хослол", en: "The perfect balance of price and quality" },
    },
    since: 2025,
    models: ["B70", "T77", "T90", "T99", "NAT PRO"],
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Drive 212 team / FAW BESTUNE мэдээлэл",
      value: {
        mn: "Bestune нь FAW группийн орчин үеийн загвар, дэвшилтэт технологи, өрсөлдөхүйц үнэтэй седан, SUV санал болгодог брэнд. Сайн Моторс 2025 оноос B70, T77, T90, T99, NAT PRO загваруудыг албан ёсны эрхтэйгээр борлуулж байна.",
        en: "Bestune is a FAW Group brand offering sedans and SUVs with modern design, advanced technology and competitive pricing. Since 2025, Sain Motors has sold the B70, T77, T90, T99 and NAT PRO under official rights.",
      },
    },
    links: [facebook("https://www.facebook.com/BestuneSainmotors", PAGES_CHECKED)],
    location: "sansar",
    phone: phone("72998855"),
  },
  {
    slug: "rely",
    photo: {
      key: "brand-rely", status: "sourced", caption: "CHERY RELY", focus: "50% 57%",
      alt: { mn: "Хадархаг газрын дунд зогсох RELY пикап", en: "RELY pickup in a rocky landscape" },
      note: "Desktop brands6/CHERY RELY/Photos/rely.png; brand-team supplied material confirmed by the user.",
    },
    cardCopy: {
      status: "draft", source: "Condensed from Drive 212 team CHERY RELY summary",
      value: { mn: "Пикап автомашины сонголт.\nАжил, аяллыг хослуулахад.", en: "Pickups for work and adventure.\nFor everyday use and open roads." },
    },
    name: "CHERY RELY",
    published: true,
    order: 9,
    accent: GRAPHITE,
    summary: {
      status: "sourced",
      source: `${DRIVE_212} / CHERY RELY Мэдээлэл`,
      value: {
        mn: "RELY нь БНХАУ-ын автомашин үйлдвэрлэгч Chery группийн харьяа, Pickup төрлийн автомашинаар дагнан хөгжиж буй брэнд юм. 2025 онд дэлхийн зах зээлд шинэчлэгдэн танилцуулагдсан тус брэнд нь орчин үеийн ухаалаг технологи, шинэлэг инженерчлэл, олон талын хэрэглээг хослуулсан автомашинуудыг хөгжүүлдэг.",
        en: "RELY is a pickup truck brand under Chery Group, one of China’s leading automotive manufacturers. Relaunched in 2025, the brand develops versatile pickups that combine advanced engineering, smart technology and modern design.",
      },
    },
    statement: {
      status: "draft",
      source: `MN condensed from ${DRIVE_212} / CHERY RELY Мэдээлэл; EN by the web team`,
      value: {
        mn: "Сайн Моторс ХХК нь 2026 оноос эхлэн Chery группийн RELY брэндийн Монгол дахь албан ёсны дистрибьютороор ажиллаж, Pickup загварыг үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээ, мэргэжлийн зөвлөгөөний хамт санал болгож байна.",
        en: "Sain Motors has been the official distributor of Chery Group’s RELY brand in Mongolia since 2026, offering its pickup with factory warranty, after-sales service and expert advice.",
      },
    },
    headline: {
      status: "sourced",
      source: `${DRIVE_212} / CHERY RELY Мэдээлэл`,
      value: { mn: "Хүчирхэг хийц. Найдвартай сонголт.", en: "Robust design. Reliable performance." },
    },
    since: 2026,
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Drive 212 team / CHERY RELY Мэдээлэл",
      value: {
        mn: "RELY нь 2025 онд шинэчлэгдэн танилцуулагдсан Chery группийн пикап брэнд бөгөөд ажил, өдөр тутам, бартаат замын аялалд зориулан ухаалаг технологи, бат бөх хийцийг хослуулдаг. Сайн Моторс 2026 оноос албан ёсны дистрибьютор нь.",
        en: "RELY is Chery Group’s pickup brand, relaunched in 2025, combining smart technology with rugged engineering for work, everyday use and off-road travel. Sain Motors has been its official distributor since 2026.",
      },
    },
    links: [facebook("https://www.facebook.com/chery.rely.mongolia.sainmotors")],
    location: "dolgoon-nuur",
    phone: phone("72228855"),
  },
  {
    slug: "maxus",
    photo: {
      key: "brand-maxus", status: "sourced", caption: "MAXUS", focus: "50% 57%",
      alt: { mn: "Зам дээр зэрэгцэн байрласан MAXUS ачааны автомашинууд", en: "MAXUS commercial trucks lined up on a road" },
      note: "Desktop brands6/SAIC MAXUS/Photo/Maxus.png; no unconfirmed model name is inferred from the image.",
    },
    cardCopy: {
      status: "draft", source: "Condensed from Drive 212 team MAXUS summary and showroom record",
      value: { mn: "Пикап, MPV, ачааны загварууд.\nАжил, өдөр тутмын хэрэглээнд.", en: "Pickups, MPVs, commercial vans.\nFor business and daily life." },
    },
    name: "MAXUS",
    published: true,
    order: 10,
    accent: GRAPHITE,
    summary: {
      status: "sourced",
      source: `${DRIVE_212} / SAIC MAXUS мэдээлэл`,
      value: {
        mn: "MAXUS нь БНХАУ-ын томоохон автомашин үйлдвэрлэгч SAIC Motor компанийн эзэмшдэг олон улсын автомашины брэнд юм. Тус брэнд нь арилжааны зориулалттай автомашин, пикап, SUV болон MPV загваруудад төвлөрдөг.",
        en: "MAXUS is an international automotive brand owned by SAIC Motor, one of China’s largest automotive manufacturers. The brand specialises in commercial vehicles, pickup trucks, SUVs and MPVs.",
      },
    },
    statement: {
      status: "draft",
      source: `MN from ${DRIVE_212} / SAIC MAXUS мэдээлэл; EN by the web team`,
      value: {
        mn: "Сайн Моторс ХХК нь 2025 оноос эхлэн SAIC группийн MAXUS брэндийн Монгол дахь албан ёсны дистрибьютороор ажиллаж байна.",
        en: "Sain Motors has been the official distributor of SAIC’s MAXUS brand in Mongolia since 2025.",
      },
    },
    headline: {
      status: "sourced",
      source: `${DRIVE_212} / SAIC MAXUS мэдээлэл`,
      value: { mn: "Ажил нугалах ачааны машин", en: "A hardworking truck that gets the job done" },
    },
    since: 2025,
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Drive 212 team / SAIC MAXUS мэдээлэл; Darkhan from the 212 team sheet",
      value: {
        mn: "SAIC Motor-ын эзэмшдэг MAXUS нь хувь хүн, бизнесийн хэрэгцээнд зориулсан арилжааны автомашин, пикап, SUV, MPV загваруудад төвлөрдөг. Сайн Моторс 2025 оноос албан ёсны дистрибьютор бөгөөд Дархан хотод шоурумтай.",
        en: "MAXUS, owned by SAIC Motor, specialises in commercial vehicles, pickups, SUVs and MPVs for personal and business use. Sain Motors has been its official distributor since 2025, with a showroom in Darkhan.",
      },
    },
    links: [facebook("https://www.facebook.com/profile.php?id=61572688311986", PAGES_CHECKED)],
    location: "darkhan",
    phone: phone("72998855"),
  },
  {
    slug: "hongqi",
    photo: {
      key: "brand-hongqi", status: "sourced", caption: "FAW HONGQI", focus: "52% 56%",
      alt: { mn: "Хотын гудамжинд дүрслэгдсэн хар HONGQI SUV", en: "Black HONGQI SUV on a city street" },
      note: "Desktop brands6/FAW HONGQI/Photos/hongqi.png; brand-team supplied material confirmed by the user.",
    },
    cardCopy: {
      status: "draft", source: "Condensed from Drive 212 team HONGQI summary and showroom record",
      value: { mn: "Тансаг зэрэглэлийн седан, SUV.\nЗагвар, тав тухын хослол.", en: "Luxury sedans and SUVs.\nA focus on design and comfort." },
    },
    name: "FAW HONGQI",
    published: true,
    order: 11,
    accent: GRAPHITE,
    summary: {
      status: "sourced",
      source: `${DRIVE_212} / FAW HONGQI Мэдээлэл`,
      value: {
        mn: "HONGQI нь 1958 онд үүсгэн байгуулагдсан, БНХАУ-ын автомашин үйлдвэрлэгч FAW группийн тансаг зэрэглэлийн автомашины брэнд юм. Хятадын төрийн дээд хэмжээний арга хэмжээ, хүндэт зочдын албан ёсны автомашин гэдгээрээ түүхэнд танигдсан тус брэнд нь өдгөө тансаг зэрэглэлийн седан, SUV болон цахилгаан автомашинуудыг дэлхийн зах зээлд санал болгож байна.",
        en: "HONGQI is a Chinese luxury automotive brand established in 1958 under FAW Group. Historically known for official vehicles at Chinese state ceremonies and for distinguished guests, it now offers luxury sedans, SUVs and electric vehicles to customers worldwide.",
      },
    },
    statement: {
      status: "draft",
      source: `MN condensed from ${DRIVE_212} / FAW HONGQI Мэдээлэл; EN by the web team`,
      value: {
        mn: "Сайн Моторс ХХК нь 2024 оноос эхлэн FAW группийн HONGQI брэндийн Монгол дахь албан ёсны дистрибьютороор ажиллаж, тансаг зэрэглэлийн седан, SUV автомашинуудыг үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээ, мэргэжлийн зөвлөгөөний хамт санал болгож байна.",
        en: "Sain Motors has been the official distributor of FAW Group’s HONGQI brand in Mongolia since 2024, offering its luxury sedans and SUVs with factory warranty, after-sales service and expert advice.",
      },
    },
    headline: {
      status: "sourced",
      source: `${DRIVE_212} / FAW HONGQI Мэдээлэл`,
      value: { mn: "Дээд зэрэглэлийн тансаг автомашин", en: "The epitome of automotive luxury" },
    },
    since: 2024,
    teaser: {
      status: "draft",
      source: "Condensed by the web team from Drive 212 team / FAW HONGQI Мэдээлэл",
      value: {
        mn: "1958 онд FAW группийн дэргэд үүсгэн байгуулагдсан HONGQI нь төрийн ёслолын автомашинаараа алдаршсан тансаг зэрэглэлийн брэнд бөгөөд өдгөө седан, SUV, цахилгаан автомашин санал болгодог. Сайн Моторс 2024 оноос албан ёсны дистрибьютор нь.",
        en: "Founded in 1958 under FAW Group, HONGQI is the luxury marque known for China’s state-ceremony cars, now offering luxury sedans, SUVs and electric vehicles. Sain Motors has been its official distributor since 2024.",
      },
    },
    links: [facebook("https://www.facebook.com/HongqiMongolia1")],
    location: "sansar",
    phone: phone("72008855"),
  },
];
