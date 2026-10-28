import type { Block } from "./types";

type Meta = Block<{ title: string; description: string }>;
type Section = Block<{ heading: string; body: string }>;

// Page copy by the web team over sourced facts (docs/content-sources.md).
// Everything here is a draft until the content team approves or replaces it.
export const pages = {
  home: {
    meta: {
      status: "draft",
      value: {
        mn: {
          title: "Сайн Моторс — олон улсын автомашины брэндүүд Монголд",
          description:
            "Сайн Моторс JETOUR, HONGQI, BYD, AITO, RIDDARA, 212, BESTUNE, MAXUS, RELY брэндийн автомашиныг Монголд албан ёсны эрхтэйгээр борлуулдаг.",
        },
        en: {
          title: "Sain Motors — international car brands in Mongolia",
          description:
            "Sain Motors sells JETOUR, HONGQI, BYD, AITO, RIDDARA, 212, BESTUNE, MAXUS and RELY in Mongolia under official rights. Showrooms, sales lines, service.",
        },
      },
    } satisfies Meta,
    brands: {
      status: "draft",
      value: {
        mn: { heading: "Брэндүүд", body: "Брэнд бүрийн танилцуулга, шоурум, борлуулалтын утас." },
        en: { heading: "Our brands", body: "Each brand’s introduction, showroom and sales line." },
      },
    } satisfies Section,
    company: {
      status: "draft",
      value: {
        mn: { heading: "Сайн Моторс-ын тухай", body: "" },
        en: { heading: "About Sain Motors", body: "" },
      },
    } satisfies Section,
    /** Facts from the distributor statements (years per brand sheet); wording by the web team. */
    story: {
      status: "draft",
      source: "Drive brand sheets: distributor statements",
      value: {
        mn: {
          heading: "2024 оноос хойш нэмэгдсэн брэндүүд",
          body: "Сайн Моторс 2024 онд HONGQI-ийн албан ёсны борлуулалтыг эхлүүлж, 2025 онд BYD, AITO, RIDDARA, 212, BESTUNE, MAXUS, 2026 онд CHERY RELY брэндийг багцдаа нэмсэн. Брэнд бүрийг өөрийн шоурумд нь танилцуулж, борлуулалтын утсаар нь зөвлөгөө өгдөг.",
        },
        en: {
          heading: "Brands added since 2024",
          body: "Sain Motors began official sales of HONGQI in 2024, added BYD, AITO, RIDDARA, 212, BESTUNE and MAXUS in 2025, and CHERY RELY in 2026. Each of these brands is presented at its own showroom and has its own sales line.",
        },
      },
    } satisfies Section,
    locations: {
      status: "draft",
      value: {
        mn: {
          heading: "Шоурумууд",
          body: "Брэнд бүр тодорхой шоурумд байрладаг. Очихоосоо өмнө брэндийн утсаар залгаж лавлана уу.",
        },
        en: {
          heading: "Showrooms",
          body: "Each brand is sold at a specific showroom. Call the brand’s line before you visit.",
        },
      },
    } satisfies Section,
  },

  about: {
    meta: {
      status: "draft",
      value: {
        mn: {
          title: "Бидний тухай",
          description:
            "Сайн Моторс ХХК олон улсын автомашины брэндүүдийг Монголд албан ёсны эрхтэйгээр борлуулж, борлуулалтын дараах үйлчилгээ үзүүлдэг.",
        },
        en: {
          title: "About us",
          description:
            "Sain Motors LLC sells international car brands in Mongolia under official rights and provides after-sales service.",
        },
      },
    } satisfies Meta,
    lead: {
      status: "draft",
      value: {
        mn: "Сайн Моторс ХХК олон улсын автомашины брэндүүдийг Монголд албан ёсны эрхтэйгээр борлуулж, борлуулалтын дараах үйлчилгээ үзүүлдэг.",
        en: "Sain Motors LLC sells international car brands in Mongolia under official rights and provides after-sales service.",
      },
    } satisfies Block,
    sections: [
      {
        status: "draft",
        value: {
          mn: {
            heading: "Бид юу хийдэг вэ",
            body: "Брэнд бүрийг өөрийн шоурумд нь танилцуулж, борлуулалтын утсаар нь зөвлөгөө өгдөг. Ихэнх брэндийн автомашин үйлдвэрийн баталгаа, борлуулалтын дараах үйлчилгээтэй. JETOUR-ын засвар үйлчилгээг үйлчилгээний төв, BYD-ийн засвар, сэлбэгийг BYD 4S шоурум хариуцдаг.",
          },
          en: {
            heading: "What we do",
            body: "We present each brand at its own showroom and advise customers on its sales line. Most of our brands come with factory warranty and after-sales service. The JETOUR service centre maintains JETOUR vehicles, and the BYD 4S showroom handles BYD repairs and parts.",
          },
        },
      },
      {
        status: "draft",
        value: {
          mn: {
            heading: "Хаана байрладаг вэ",
            body: "Улаанбаатар, Дархан, Эрдэнэт хотод шоурумтай бөгөөд Улаанбаатарт JETOUR-ын үйлчилгээний төвтэй. Брэнд бүрийн шоурум, утсыг салбарын хуудаснаас харна уу.",
          },
          en: {
            heading: "Where we are",
            body: "We have showrooms in Ulaanbaatar, Darkhan and Erdenet, and a JETOUR service centre in Ulaanbaatar. Each brand’s showroom and phone number are on the locations page.",
          },
        },
      },
    ] satisfies Section[],
    closing: {
      status: "draft",
      value: {
        mn: { heading: "Шоурумд уулзъя", body: "Брэнд бүрийн шоурум, борлуулалтын утас салбарын хуудсанд байна." },
        en: { heading: "Visit a showroom", body: "Every brand’s showroom and sales line is on the locations page." },
      },
    } satisfies Section,
    milestones: {
      status: "draft",
      value: {
        mn: { heading: "Албан ёсны борлуулалт эхэлсэн он", body: "Брэнд бүрийн мэдээллийн хуудсанд дурдсан оноор." },
        en: { heading: "When official sales began", body: "As stated in each brand’s fact sheet." },
      },
    } satisfies Section,
  },

  brands: {
    meta: {
      status: "draft",
      value: {
        mn: {
          title: "Брэндүүд",
          description:
            "Сайн Моторс-ын албан ёсны эрхтэй борлуулдаг автомашины брэндүүд: танилцуулга, шоурум, борлуулалтын утас, албан ёсны холбоос.",
        },
        en: {
          title: "Brands",
          description:
            "The car brands Sain Motors sells in Mongolia, with each brand’s introduction, showroom, sales line and official links.",
        },
      },
    } satisfies Meta,
    lead: {
      status: "draft",
      value: {
        mn: "Брэнд бүрийн товч танилцуулга, шоурум, борлуулалтын утас. Шинэ мэдээллийг брэнд бүрийн Facebook хуудаснаас аваарай.",
        en: "A short introduction to each brand, with its showroom and sales line. Follow each brand’s Facebook page for the latest news.",
      },
    } satisfies Block,
  },

  services: {
    meta: {
      status: "draft",
      value: {
        mn: {
          title: "Үйлчилгээ",
          description:
            "Шинэ автомашин, санхүүжилтийн зөвлөгөө, үйлдвэрийн баталгаа, засвар, сэлбэг: аль брэндэд, хаана үзүүлдэг вэ.",
        },
        en: {
          title: "Services",
          description: "New cars, financing advice, factory warranty, repairs and parts: which brands each covers, and where.",
        },
      },
    } satisfies Meta,
    lead: {
      status: "draft",
      value: {
        mn: "Үйлчилгээ брэнд, байршлаас хамаарч өөр. Тодорхой асуултаа брэндийн борлуулалтын утсаар лавлана уу.",
        en: "Services differ by brand and location. For specific questions, call the brand’s sales line.",
      },
    } satisfies Block,
    team: {
      status: "draft",
      source: "Supplied service-centre and BYD training photographs (2026-10-20), incl. BYD technical training certificates",
      value: {
        mn: {
          heading: "Мэргэшсэн техникийн баг",
          body: "Манай техникчид BYD-ийн техникийн мэргэшлийн сургалтад хамрагдсан бөгөөд цахилгаан автомашины өндөр хүчдэлийн систем дээр хамгаалалтын хэрэгсэлтэйгээр ажилладаг.",
        },
        en: {
          heading: "A trained technical team",
          body: "Our technicians have completed BYD’s specialised technical training and work on electric-vehicle high-voltage systems with full protective equipment.",
        },
      },
    } satisfies Section,
  },

  contact: {
    meta: {
      status: "draft",
      value: {
        mn: {
          title: "Холбоо барих",
          description: "Сайн Моторс-ын шоурумууд, үйлчилгээний төвийн хаяг, брэнд бүрийн борлуулалтын утас, ерөнхий лавлагаа.",
        },
        en: {
          title: "Contact",
          description: "Showroom and service centre addresses, each brand’s sales line and general enquiries for Sain Motors.",
        },
      },
    } satisfies Meta,
    lead: {
      status: "draft",
      value: {
        mn: "Брэнд бүр өөрийн шоурум, борлуулалтын утастай. Очихоосоо өмнө залгаж лавлана уу.",
        en: "Each brand has its own showroom and sales line. Call before you visit.",
      },
    } satisfies Block,
  },

  locations: {
    meta: {
      status: "draft",
      source: "Existing company.ts location records; web-team directory description, 2026-10-22",
      value: {
        mn: { title: "Байршлууд", description: "Сайн Моторс-ын шоурум, үйлчилгээний төвийг брэнд, хотоор хайж, хаяг, утас, ажиллах цагтай танилцаарай." },
        en: { title: "Locations", description: "Find Sain Motors showrooms and service locations by brand and city, with addresses, phone numbers and available opening hours." },
      },
    } satisfies Meta,
    lead: {
      status: "draft",
      source: "Existing company.ts location records; web-team directory introduction, 2026-10-22",
      value: {
        mn: "Шоурум, үйлчилгээний төвийг брэнд болон хотоор хайгаарай. Очихоосоо өмнө хаяг, холбоо барих мэдээлэл, ажиллах цагийг шалгана уу.",
        en: "Find a showroom or service centre by brand and city. Check the address, contact details and opening hours before you visit.",
      },
    } satisfies Block,
  },

  news: {
    meta: {
      status: "draft",
      source: "Existing events.ts MEGA TEST DRIVE edition records; web-team editorial description, 2026-10-22",
      value: {
        mn: { title: "Мэдээ, арга хэмжээ", description: "Сайн Моторс-ын MEGA TEST DRIVE арга хэмжээний огноо, байршил болон долоо дахь удаагийн off-road бичлэгтэй танилцаарай." },
        en: { title: "News and events", description: "Read Sain Motors MEGA TEST DRIVE edition dates and locations, and watch the supplied film of the seventh off-road edition." },
      },
    } satisfies Meta,
    lead: {
      status: "draft",
      source: "Existing events.ts edition dates/venues and supplied edition 7 film; no new attendance or outcome claims",
      value: {
        mn: "MEGA TEST DRIVE арга хэмжээний мэдээлэл, огноо болон бичлэг.",
        en: "Dates, locations and film from the MEGA TEST DRIVE editions.",
      },
    } satisfies Block,
  },

  privacy: {
    meta: {
      status: "draft",
      value: {
        mn: { title: "Нууцлалын бодлого", description: "Sain Motors-ын вэбсайт ямар мэдээлэл цуглуулдаг, хэрхэн ашигладаг тухай." },
        en: { title: "Privacy policy", description: "What information the Sain Motors website collects and how it is used." },
      },
    } satisfies Meta,
    /** Reflects the site as built: no forms, accounts, cookies or analytics. */
    sections: [
      {
        status: "draft",
        value: {
          mn: {
            heading: "Бид ямар мэдээлэл цуглуулдаг вэ",
            body: "Энэ сайтад маягт, бүртгэл байхгүй бөгөөд хувийн мэдээлэл цуглуулдаггүй. Сайт күүки болон зочдыг хянах аналитик хэрэгсэл ашигладаггүй.",
          },
          en: {
            heading: "What we collect",
            body: "This site has no forms or accounts and does not collect personal information. It does not use cookies or visitor-tracking analytics.",
          },
        },
      },
      {
        status: "draft",
        value: {
          mn: {
            heading: "Серверийн бүртгэл",
            body: "Сайтыг байршуулж буй хостинг үйлчилгээ нь аюулгүй байдал, алдаа илрүүлэх зорилгоор IP хаяг, хөтчийн төрөл, хандсан хуудас зэрэг техникийн бүртгэлийг автоматаар хадгалж болно.",
          },
          en: {
            heading: "Server logs",
            body: "Our hosting provider may automatically keep technical logs, such as IP address, browser type and the pages requested, for security and troubleshooting.",
          },
        },
      },
      {
        status: "draft",
        value: {
          mn: {
            heading: "Гадны холбоос",
            body: "Брэндийн сайт, Google Maps, сошиал сүлжээ рүү орох холбоосууд нь тухайн байгууллагын өөрийн нууцлалын бодлогоор зохицуулагдана.",
          },
          en: {
            heading: "Links to other sites",
            body: "Links to brand websites, Google Maps and social networks lead to services governed by those organisations’ own privacy policies.",
          },
        },
      },
    ] satisfies Section[],
    review: {
      status: "draft",
      value: {
        mn: "Энэ хуудас хуулийн хяналт хүлээж буй ноорог.",
        en: "This page is a draft awaiting legal review.",
      },
    } satisfies Block,
  },
};
