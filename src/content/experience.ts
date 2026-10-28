import type { Block } from "./types";

export const contactPresentation: Block<{
  address: string; showroom: string; phone: string; email: string; social: string;
  requestsTitle: string; requestsBody: string; brandRequest: string; companyRequest: string;
  companyBody: string; careersRequest: string; careersBody: string; map: string; locations: string;
}> = {
  status: "draft",
  source: "2026-10-28 contact redesign from user-supplied Monnis/Namir references; sourced contact facts in company.ts. Editorial labels awaiting review.",
  value: {
    mn: {
      address: "Шоурумын хаяг", showroom: "JETOUR / SOUEAST", phone: "Утас", email: "Имэйл", social: "Биднийг дагаарай",
      requestsTitle: "Танд юугаар туслах вэ?", requestsBody: "Автомашин, үйлчилгээ болон байгууллагын хүсэлтээ тохирох чиглэлээр хүргээрэй.",
      brandRequest: "Автомашин, борлуулалт, үйлчилгээ", companyRequest: "Хамтын ажиллагаа, хэвлэл мэдээлэл",
      companyBody: "Хамтын ажиллагааны санал, хэвлэл мэдээллийн хүсэлтээ ерөнхий имэйлд илгээнэ үү. Холбогдох чиглэл, утасны дугаараа бичээрэй.",
      careersRequest: "Ажлын байр", careersBody: "Ажлын байрны талаар ерөнхий имэйлээр лавлана уу. Сонирхож буй ажлын чиглэлээ тодорхой бичээрэй.",
      map: "Газрын зураг нээх", locations: "Бүх салбарын мэдээлэл",
    },
    en: {
      address: "Showroom address", showroom: "JETOUR / SOUEAST", phone: "Phone", email: "Email", social: "Follow Sain Motors",
      requestsTitle: "How can we help?", requestsBody: "Find the right contact for your car, ownership services or a business enquiry.",
      brandRequest: "Vehicles, sales & service", companyRequest: "Partnerships & media",
      companyBody: "Send partnership proposals and media enquiries to our general email address. Include the topic and a phone number where we can reach you.",
      careersRequest: "Careers", careersBody: "Ask about career opportunities through our general email address. Please mention the area of work that interests you.",
      map: "Open map", locations: "View all locations",
    },
  },
};

/** Discovery labels summarize supplied brand sheets; they do not assert stock availability. */
export const brandSegments = [
  { id: "city", label: { mn: "Хот, гэр бүл", en: "City & family" }, brands: ["soueast", "chery", "bestune", "jetour"], status: "draft", source: "Existing brand summaries and supplied team sheets; editorial grouping" },
  { id: "adventure", label: { mn: "Аялал, бартаат зам", en: "Travel & adventure" }, brands: ["jetour", "212"], status: "draft", source: "Existing JETOUR and 212 descriptions; editorial grouping" },
  { id: "electric", label: { mn: "Цахилгаан, хосолсон", en: "Electric & hybrid" }, brands: ["byd", "aito", "riddara"], status: "draft", source: "Existing BYD, AITO and RIDDARA summaries; editorial grouping, not a model specification" },
  { id: "pickup", label: { mn: "Пикап", en: "Pickups" }, brands: ["riddara", "rely", "maxus"], status: "draft", source: "Existing RIDDARA, RELY and MAXUS supplied brand copy" },
  { id: "premium", label: { mn: "Дээд ангилал", en: "Premium" }, brands: ["hongqi", "aito"], status: "draft", source: "Existing HONGQI and AITO supplied brand copy" },
] as const;

export const experienceCopy: Block<{
  journeys: string; purchase: string; purchaseBody: string; ownership: string; ownershipBody: string;
  visit: string; visitBody: string; portfolioLead: string; all: string; search: string; searchPlaceholder: string;
  brandCount: string; empty: string; emptyBody: string; clear: string; availability: string;
  contactHeading: string; contactBody: string; intent: string; brand: string; chooseBrand: string;
  general: string; call: string; map: string; showroom: string; serviceLocation: string;
  referral: string; serviceReferral: string; financeNote: string; testDriveNote: string;
  email: string; emailNote: string; destination: string; brandChannel: string;
  sales: string; testDrive: string; finance: string; service: string; parts: string;
  partnership: string; careers: string; media: string; serviceAction: string;
}> = {
  status: "draft",
  source: "2026-10-28 research-led editorial UI copy; existing company/brand/service/location records. Awaiting user content review.",
  value: {
    mn: {
      journeys: "Таны дараагийн алхам", purchase: "Автомашинаа сонгох", purchaseBody: "11 брэндийн онцлог, загвар, борлуулалтын багтай танилцаарай.",
      ownership: "Үйлчилгээ авах", ownershipBody: "Баталгаа, засвар, сэлбэгийн талаар зөв багтай холбогдоорой.",
      visit: "Шоурумд зочлох", visitBody: "Салбарын хаяг, утас, ажиллах цагийг нэг дороос олоорой.",
      portfolioLead: "Өдөр тутмын замаас дараагийн аялал хүртэл. Өөрийн хэрэгцээнд нийцэх брэндтэй танилцаж, загварын дэлгэрэнгүйг тухайн брэндийн багаас аваарай.",
      all: "Бүх брэнд", search: "Брэнд, загвараар хайх", searchPlaceholder: "Жишээ нь JETOUR, S08…", brandCount: "брэнд",
      empty: "Тохирох брэнд олдсонгүй", emptyBody: "Өөр нэрээр хайх эсвэл ангиллаа сольж үзээрэй.", clear: "Шүүлтүүр арилгах",
      availability: "Зураг нь брэндийн танилцуулга болно. Загвар, тоноглол, үнэ, бэлэн байгаа эсэхийг брэндийн багаас лавлана уу.",
      contactHeading: "Зөв багтайгаа холбогдоорой.", contactBody: "Юу сонирхож байгаагаа, дараа нь брэндээ сонгоно уу. Танд хэрэгтэй утас, байршлыг харуулъя.",
      intent: "Танд юугаар туслах вэ?", brand: "Сонирхож буй брэнд", chooseBrand: "Брэнд сонгох", general: "Ерөнхий холбоо барих",
      call: "Утсаар холбогдох", map: "Газрын зураг нээх", showroom: "Брэндийн шоурум", serviceLocation: "Үйлчилгээний байршил",
      referral: "Брэндээ сонговол тухайн багийн шууд утас, шоурумын мэдээллийг харуулна.",
      serviceReferral: "Брэндийн багтай холбогдож, үйлчилгээний нөхцөл, үйлчлүүлэх байршил болон цагийг тодруулаарай.",
      financeNote: "Боломжит санхүүжилт, шалгуур, шаардлагатай материалыг брэндийн багаас лавлана уу. Нөхцөл нь загвар болон санхүүжүүлэгчээс хамаарна.",
      testDriveNote: "Туршилтын автомашин, тохирох өдөр, цагийг брэндийн багтай утсаар тохироорой.",
      email: "Имэйл бичих", emailNote: "Ерөнхий имэйл рүү хүсэлтийн сэдвийг бэлдэж нээнэ. Илгээхээсээ өмнө мэдээллээ нэмж бичээрэй.",
      destination: "Салбарын мэдээлэл үзэх", brandChannel: "Брэндийн суваг", sales: "Загвар, үнэ лавлах", testDrive: "Туршилтын жолоодлого лавлах",
      finance: "Санхүүжилт лавлах", service: "Засвар, үйлчилгээ", parts: "Сэлбэг лавлах", partnership: "Байгууллагын хамтын ажиллагаа", careers: "Ажлын байр", media: "Хэвлэл, мэдээлэл",
      serviceAction: "Брэндээр үйлчилгээ лавлах",
    },
    en: {
      journeys: "Your next step", purchase: "Find your next car", purchaseBody: "Explore eleven brands, their models and the teams who know them.",
      ownership: "Care for your car", ownershipBody: "Reach the right team for warranty, maintenance and parts enquiries.",
      visit: "Visit a showroom", visitBody: "Find location details, phone numbers and opening hours in one place.",
      portfolioLead: "From your everyday drive to your next adventure. Discover a brand that fits your life, then speak with its team about the details.",
      all: "All brands", search: "Search brands and models", searchPlaceholder: "Try JETOUR, S08…", brandCount: "brands",
      empty: "No matching brands", emptyBody: "Try another name or change the category.", clear: "Clear filters",
      availability: "Images introduce the brands. Ask the brand team about models, specifications, prices and current availability.",
      contactHeading: "A direct line to the right team.", contactBody: "Choose what you need, then a brand. Find the relevant phone number and location below.",
      intent: "How can we help?", brand: "Brand of interest", chooseBrand: "Choose a brand", general: "General contact",
      call: "Call the team", map: "Open map", showroom: "Brand showroom", serviceLocation: "Service location",
      referral: "Choose a brand for its direct phone number and showroom details.",
      serviceReferral: "Speak with the brand team to confirm service coverage, the location and an appointment time.",
      financeNote: "Ask the brand team about available finance, eligibility and required documents. Terms depend on the model and finance provider.",
      testDriveNote: "Call the brand team to check test-car availability and arrange a suitable day and time.",
      email: "Write an email", emailNote: "Opens your email app with a subject for our general contact address. Add your details before sending.",
      destination: "View location details", brandChannel: "Brand channel", sales: "Models & pricing", testDrive: "Ask about a test drive",
      finance: "Ask about finance", service: "Maintenance & repair", parts: "Parts enquiry", partnership: "Business partnerships", careers: "Careers", media: "Media enquiries",
      serviceAction: "Find your brand's service contact",
    },
  },
};
