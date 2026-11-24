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
            "Сайн Моторс ХХК нь автомашины 11 брэндийн Монгол дахь албан ёсны дистрибьютор юм. Улаанбаатар, Дархан, Эрдэнэт хот дахь манай шоурумуудад зочлоорой.",
        },
        en: {
          title: "Sain Motors — international car brands in Mongolia",
          description:
            "Sain Motors LLC is the official distributor of 11 automotive brands in Mongolia. Visit our showrooms in Ulaanbaatar, Darkhan and Erdenet.",
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
            "Сайн Моторс ХХК нь 2021 онд Сайн Интернешнл ХХК-ийн охин компани болж байгуулагдсан бөгөөд автомашины 11 брэндийг Монгол Улсад албан ёсны эрхтэйгээр төлөөлдөг.",
        },
        en: {
          title: "About us",
          description:
            "Founded in 2021 as a subsidiary of Sain International LLC, Sain Motors LLC is the official representative of 11 automotive brands in Mongolia.",
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
            body: "Улаанбаатар, Дархан, Эрдэнэт хотод шоурумтай бөгөөд Улаанбаатарт JETOUR-ын үйлчилгээний төвтэй. Брэнд бүрийн шоурум, утсыг дилерийн сүлжээний хуудаснаас харна уу.",
          },
          en: {
            heading: "Where we are",
            body: "We have showrooms in Ulaanbaatar, Darkhan and Erdenet, and a JETOUR service centre in Ulaanbaatar. Each brand’s showroom and phone number are on the dealer network page.",
          },
        },
      },
    ] satisfies Section[],
    closing: {
      status: "draft",
      value: {
        mn: { heading: "Шоурумд уулзъя", body: "Брэнд бүрийн шоурум, борлуулалтын утас дилерийн сүлжээний хуудсанд байна." },
        en: { heading: "Visit a showroom", body: "Every brand’s showroom and sales line is on the dealer network page." },
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
      source: "Technical team description supplied by management via the user on 2026-11-17",
      value: {
        mn: {
          heading: "Мэргэшсэн техникийн баг",
          body: "Сайн Моторс ХХК-ийн засвар, техникийн баг нь өндөр ур чадвартай мэргэжилтнүүдээс бүрддэг бөгөөд брэнд тус бүрийн автомашины засварын сургалтад амжилттай хамрагдсан. Бид таны автомашиныг үйлдвэрийн албан ёсны оношилгооны төхөөрөмж, компьютерээр оношилж, баталгаат сэлбэгээр түргэн шуурхай засварлана.",
        },
        en: {
          heading: "A trained technical team",
          body: "The repair and technical team at Sain Motors LLC is made up of highly skilled specialists who have completed repair training for each of our brands. We check your car with the brand’s official diagnostic tools and repair it quickly using genuine parts.",
        },
      },
    } satisfies Section,
  },

  contact: {
    meta: {
      status: "draft",
      value: {
        mn: {
          title: "Бидэнтэй холбогдох",
          description: "Сайн Моторс-ын шоурумууд, үйлчилгээний төвийн хаяг, брэнд бүрийн борлуулалтын утас, ерөнхий лавлагаа.",
        },
        en: {
          title: "Contact Us",
          description: "Showroom and service centre addresses, each brand’s sales line and general enquiries for Sain Motors.",
        },
      },
    } satisfies Meta,
    lead: {
      status: "draft",
      value: {
        mn: "Автомашины загвар, үнэ, худалдан авалт болон борлуулалтын дараах үйлчилгээний талаар асуух зүйл байвал бидэнтэй холбогдоорой. Мөн санал хүсэлт, хамтын ажиллагааны саналаа энэ хуудсаар дамжуулан илгээх боломжтой.",
        en: "Have a question about our car models, prices, buying a car or after-sales service? Get in touch with us. You can also send us your feedback or partnership proposals through this page.",
      },
    } satisfies Block,
  },

  locations: {
    meta: {
      status: "draft",
      source: "Existing company.ts location records; web-team directory description, 2026-10-22",
      value: {
        mn: { title: "Дилерийн сүлжээ", description: "Сайн Моторс-ын шоурум, үйлчилгээний төвийг брэнд, хотоор хайж, хаяг, утас, ажиллах цагтай танилцаарай." },
        en: { title: "Dealer network", description: "Find Sain Motors showrooms and service locations by brand and city, with addresses, phone numbers and available opening hours." },
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
        mn: { title: "Мэдээ, арга хэмжээ", description: "Сайн Моторсын брэндийн хамтын ажиллагаа, MEGA TEST DRIVE өдөрлөг, салбарууд, хэвлэл мэдээлэл болон нийгмийн хариуцлагын мэдээ." },
        en: { title: "News and events", description: "Sain Motors news: brand partnerships, MEGA TEST DRIVE events, showrooms, media coverage and community initiatives." },
      },
    } satisfies Meta,
    lead: {
      status: "draft",
      source: "Existing events.ts edition dates/venues and supplied edition 7 film; no new attendance or outcome claims",
      value: {
        mn: "Брэндийн хамтын ажиллагаа, өдөрлөгүүд болон Сайн Моторсын сүүлийн мэдээ.",
        en: "Brand partnerships, events and news from Sain Motors.",
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
    /** Describes the test-drive forms and the site's external links. */
    sections: [
      {
        status: "draft",
        value: {
          mn: {
            heading: "Бид ямар мэдээлэл цуглуулдаг вэ",
            body: "RELY R8 эсвэл BYD SEALION 6-ийн туршилтын жолоодлогын хүсэлт илгээхэд таны сонгосон хот, нэр, овог, утас болон зөвшөөрлийн мэдээллийг авна. Энэ мэдээллийг Сайн Моторс-ийн тухайн брэндийн борлуулалтын баг таны хүсэлтийн дагуу холбогдох, цаг товлоход ашиглана. Сайт хэрэглэгчийн бүртгэл, зочдыг хянах аналитик хэрэгсэл ашигладаггүй.",
          },
          en: {
            heading: "What we collect",
            body: "When you submit a RELY R8 or BYD SEALION 6 test-drive request, we collect your selected city, first and last name, phone number and consent information. The Sain Motors sales team uses these details to contact you about your request and arrange a visit. The site does not provide visitor accounts or use visitor-tracking analytics.",
          },
        },
      },
      {
        status: "draft",
        value: {
          mn: {
            heading: "Хүсэлтийн мэдээллийг хадгалах",
            body: "Хүсэлтийн мэдээллийг Сайн Моторс-ийн Supabase үйлчилгээнд байрласан өгөгдлийн санд хадгалж, зөвхөн эрх бүхий баг ашиглана. Таны мэдээллийг автомашин үйлдвэрлэгчийн вэбсайт руу илгээхгүй. Хүсэлтийн мэдээллээ засуулах, устгуулах эсвэл зөвшөөрлөө цуцлах бол RELY багтай 7222-8855, BYD багтай 7250-8855 дугаараар холбогдоно уу.",
          },
          en: {
            heading: "Storing your request",
            body: "Requests are stored in Sain Motors' database hosted on Supabase and used by the authorized team. Your details are not sent to the vehicle manufacturer's website. To correct or delete your request or withdraw consent, call RELY on +976 7222-8855 or BYD on +976 7250-8855.",
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
