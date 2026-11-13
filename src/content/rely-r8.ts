import type { Locale } from "@/lib/i18n";

export type R8Metric = { label: string; value: string; unit?: string };
export type R8Detail = { title: string; text?: string; image: number; metrics?: R8Metric[]; points?: string[] };
export type R8Feature = { key: string; name: string; translation: string; details: R8Detail[] };
type R8Copy = {
  label: string; heroAlt: string; heroTagline: string;
  missionTitle: string; mission: string; values: { title: string; text: string }[];
  terrainsTitle: string; terrains: string[]; featuresTitle: string; explore: string; close: string;
  features: R8Feature[];
  accessoriesTitle: string; accessoriesText: string; accessories: string[];
  powertrainsTitle: string; configuration: string; specifications: string; brochureNote: string; openPdf: string; download: string; page: string;
};

// Manufacturer's global R8 presentation. This is not a Mongolian stock or equipment list.
export const r8Content: Record<Locale, R8Copy> = {
  en: {
    label: "RELY R8", heroAlt: "Gold RELY R8 pickup — boundless possibilities", heroTagline: "INTELLIGENTIZE\nTHE WORLD",
    missionTitle: "THE NEW MISSION OF RELY",
    mission: "To become a global benchmark for new energy and intelligent pickups, sharing the unique value of Chinese pickups with the world.",
    values: [{ title: "RELIABLE", text: "Strict quality control and trust" }, { title: "REACHABLE", text: "Global accessibility" }, { title: "REWARDING", text: "Creating and sharing value" }],
    terrainsTitle: "BOUNDLESS POSSIBILITIES", terrains: ["SEASIDE", "MOUNTAINOUS REGION", "HIGHWAY", "FOREST"],
    featuresTitle: "EXPLORE R8", explore: "Explore", close: "Close details",
    features: [
      { key: "tough", name: "TOUGH", translation: "Built for the journey", details: [
        { title: "RELY R8 COMPACT PICKUP TRUCK", image: 5, metrics: [{ label: "Wheelbase", value: "3230", unit: "mm" }, { label: "Gross vehicle weight", value: "2905", unit: "kg" }, { label: "Anchor points", value: "30+" }] },
        { title: "POWERFUL PASSABILITY", text: "The global R8 range combines off-road geometry with electronically controlled differential locks and available winch equipment. Configuration depends on the version and market.", image: 6, metrics: [{ label: "Full-load approach angle", value: "32", unit: "°" }, { label: "Full-load departure angle", value: "23", unit: "°" }] },
      ] },
      { key: "strong", name: "STRONG", translation: "Power with purpose", details: [
        { title: "MOUNTAIN-SHAKING MOMENTUM", text: "The manufacturer’s 2.3T and 8-speed automatic powertrain delivers up to 420 Nm of torque.", image: 1, metrics: [{ label: "Engine", value: "2.3", unit: "T" }, { label: "Transmission", value: "8", unit: "AT" }, { label: "Maximum torque", value: "420", unit: "Nm" }] },
        { title: "STRONG LOAD-BEARING", text: "A 3+2+1 leaf-spring arrangement is designed to support carrying loads across a broad range of use.", image: 2 },
        { title: "SUPER TORSION RESISTANCE", text: "The manufacturer describes a cargo-box structure with 1,053 high-density welding points and reinforcement in four transverse and two longitudinal directions.", image: 3 },
        { title: "ALL-TERRAIN CONTROL", text: "Selectable terrain modes and a solid chassis support changing road conditions and long-distance travel.", image: 4 },
      ] },
      { key: "reliable", name: "RELIABLE", translation: "Confidence at the core", details: [
        { title: "STAR-CLASS CRASH FRAME", text: "The manufacturer reports more than 80% high-strength steel in the body structure, with a frame designed for strength and occupant protection.", image: 7, metrics: [{ label: "High-strength steel", value: ">80", unit: "%" }] },
        { title: "GLOBAL ENDURANCE TESTING", text: "The manufacturer’s validation programme includes extreme environments, cold-start development and whole-vehicle endurance testing.", image: 8, metrics: [{ label: "Validation time", value: "11,000", unit: "h" }, { label: "Whole-vehicle testing", value: "300,000", unit: "km" }, { label: "User scenario simulation", value: "200,000", unit: "km" }] },
        { title: "SIX AIRBAGS", text: "The global presentation includes front airbags, front side airbags and side curtain airbags. Ask the sales team to confirm the safety equipment of your chosen version.", image: 9 },
      ] },
      { key: "intelligent", name: "INTELLIGENT", translation: "Connected to the road", details: [
        { title: "INTELLIGENT DRIVING CONTROL", text: "The global model presentation includes driver assistance for longer journeys. The driver remains responsible for control and attention.", image: 10, points: ["Smart cruise control", "Lane assistance", "Emergency braking assistance"] },
        { title: "A MORE CONNECTED CABIN", text: "A large central screen and panoramic camera views form part of the manufacturer’s intelligent cabin presentation. Features depend on the version.", image: 11, points: ["15.6-inch central touchscreen", "Driver assistance technology", "High-performance computing", "360° panoramic camera and transparent chassis view"] },
      ] },
    ],
    accessoriesTitle: "UNLIMITED EXPANSION,\nORIGINAL FACTORY UPGRADE",
    accessoriesText: "The manufacturer’s accessory programme presents 15 upgrades for the chassis, cargo system and beyond.",
    accessories: ["Heavy-duty carrier rack", "Auxiliary fuel tank", "Off-road fender flares", "Front winch", "Cargo box", "Rear winch", "Reinforced arms / rods", "Underbody protection panel", "Fog lights", "Styled hood", "Rims / all-terrain tyres", "Nitrogen / oil shock absorbers", "Roof rack", "Metal rear bumper", "High roof cover / slide-out storage box"],
    powertrainsTitle: "PARAMETER CONFIGURATION", configuration: "View brochure", specifications: "RELY R8 brochure", brochureNote: "Sain Motors’ RELY R8 brochure (Mongolian). Open the PDF to zoom or download a copy.", openPdf: "Open PDF", download: "Download brochure", page: "Page",
  },
  mn: {
    label: "RELY R8", heroAlt: "Алтан шар RELY R8 пикап — хязгааргүй боломж", heroTagline: "Дэлхийг\nухаалагжуулна",
    missionTitle: "RELY-ИЙН ШИНЭ ЗОРИЛГО",
    mission: "Шинэ эрчим хүч, ухаалаг пикапын дэлхийн жишиг болж, Хятадын пикап автомашины үнэ цэнийг дэлхийд таниулах.",
    values: [{ title: "НАЙДВАРТАЙ", text: "Чанарын хатуу хяналт, итгэлцэл" }, { title: "ХҮРТЭЭМЖТЭЙ", text: "Дэлхий даяарх хүртээмж" }, { title: "ҮР ӨГӨӨЖТЭЙ", text: "Үнэ цэнийг хамт бүтээж, хуваалцах" }],
    terrainsTitle: "ХЯЗГААРГҮЙ БОЛОМЖ", terrains: ["ДАЛАЙН ЭРЭГ", "УУЛЫН БҮС", "ЗАСМАЛ ЗАМ", "ОЙ"],
    featuresTitle: "R8-ИЙГ ТАНИХ", explore: "Дэлгэрэнгүй", close: "Дэлгэрэнгүйг хаах",
    features: [
      { key: "tough", name: "TOUGH", translation: "Аялалд бэлэн", details: [
        { title: "RELY R8 ПИКАП", image: 5, metrics: [{ label: "Тэнхлэг хоорондын зай", value: "3230", unit: "мм" }, { label: "Бүх жин", value: "2905", unit: "кг" }, { label: "Бэхэлгээний цэг", value: "30+" }] },
        { title: "БАРТАА ТУУЛАХ ЧАДВАР", text: "Үйлдвэрлэгчийн R8 загварын хүрээнд бартаат замын хийц, электрон удирдлагатай дифференциалын түгжээ, лебёдканы сонголтыг танилцуулсан. Тоноглол нь хувилбар, зах зээлээс хамаарна.", image: 6, metrics: [{ label: "Бүрэн ачаатай орох өнцөг", value: "32", unit: "°" }, { label: "Бүрэн ачаатай гарах өнцөг", value: "23", unit: "°" }] },
      ] },
      { key: "strong", name: "STRONG", translation: "Хүчирхэг гүйцэтгэл", details: [
        { title: "УУЛЫГ ТУУЛАХ ХҮЧ", text: "Үйлдвэрлэгчийн 2.3T хөдөлгүүр, 8 шатлалт автомат хурдны хайрцгийн хослол нь 420 Нм хүртэл мушгих хүчтэй.", image: 1, metrics: [{ label: "Хөдөлгүүр", value: "2.3", unit: "T" }, { label: "Хурдны хайрцаг", value: "8", unit: "AT" }, { label: "Дээд мушгих хүч", value: "420", unit: "Нм" }] },
        { title: "АЧААЛАЛ ДААХ ХИЙЦ", text: "3+2+1 бүтэцтэй нуман пүрш нь олон төрлийн хэрэглээний ачааллыг даахад зориулагдсан.", image: 2 },
        { title: "МУШГИРАЛТАД ТЭСВЭРТЭЙ", text: "Үйлдвэрлэгчийн мэдээллээр тэвш нь 1,053 өндөр нягтралтай гагнаас, хөндлөн дөрөв, тууш хоёр чиглэлийн бэхэлгээтэй.", image: 3 },
        { title: "ОЛОН ТӨРЛИЙН ЗАМЫН УДИРДЛАГА", text: "Сонгох боломжтой замын горимууд, бат бөх явах эд анги нь өөрчлөгдөх замын нөхцөл, холын аялалд зориулагдсан.", image: 4 },
      ] },
      { key: "reliable", name: "RELIABLE", translation: "Найдвартай бүтцээс эхэлнэ", details: [
        { title: "БАТ БӨХ ХАМГААЛАЛТЫН БҮТЭЦ", text: "Үйлдвэрлэгчийн мэдээллээр их биеийн бүтцийн 80 гаруй хувь нь өндөр бат бэх ган бөгөөд зорчигчийн хамгаалалтад чиглэсэн рамтай.", image: 7, metrics: [{ label: "Өндөр бат бэх ган", value: ">80", unit: "%" }] },
        { title: "ТЭСВЭРИЙН ТУРШИЛТ", text: "Үйлдвэрлэгчийн баталгаажуулалтын хөтөлбөрт эрс тэс орчин, хүйтэн асаалт болон автомашины тэсвэрийн туршилт багтдаг.", image: 8, metrics: [{ label: "Баталгаажуулалтын хугацаа", value: "11,000", unit: "цаг" }, { label: "Автомашины туршилт", value: "300,000", unit: "км" }, { label: "Хэрэглээний нөхцөлийн туршилт", value: "200,000", unit: "км" }] },
        { title: "ЗУРГААН АЮУЛГҮЙН ДЭР", text: "Дэлхийн загварын танилцуулгад урд, урд хажуу болон хөшгөн аюулгүйн дэр багтсан. Сонгосон хувилбарын аюулгүй байдлын тоноглолыг борлуулалтын багаас тодруулна уу.", image: 9 },
      ] },
      { key: "intelligent", name: "INTELLIGENT", translation: "Ухаалаг жолоодлого", details: [
        { title: "ЖОЛООЧИД ТУСЛАХ УХААЛАГ СИСТЕМ", text: "Үйлдвэрлэгчийн дэлхийн загварын танилцуулгад холын аялалд дэмжлэг үзүүлэх системүүд багтсан. Жолооч анхаарал, удирдлагаа бүрэн хариуцна.", image: 10, points: ["Ухаалаг хурд баригч", "Эгнээнд барих туслах", "Яаралтай тоормослох туслах"] },
        { title: "УХААЛАГ САЛОН", text: "Том төв дэлгэц, эргэн тойрны камер нь үйлдвэрлэгчийн ухаалаг салоны танилцуулгын нэг хэсэг. Боломжууд нь хувилбараас хамаарна.", image: 11, points: ["15.6 инчийн төв дэлгэц", "Жолоочид туслах технологи", "Өндөр хүчин чадлын тооцоолол", "360° панорам камер, явах эд ангийн харагдац"] },
      ] },
    ],
    accessoriesTitle: "ХЯЗГААРГҮЙ ӨРГӨТГӨЛ,\nҮЙЛДВЭРИЙН НЭМЭЛТ ТОНОГЛОЛ",
    accessoriesText: "Үйлдвэрлэгчийн нэмэлт тоноглолын хөтөлбөрт явах эд анги, тэвш болон бусад хэсгийн 15 шинэчлэлийг танилцуулсан.",
    accessories: ["Даацын ачааны бэхэлгээ", "Нэмэлт түлшний сав", "Бартаат замын арк", "Урд лебёдка", "Тэвшний хайрцаг", "Арын лебёдка", "Бэхжүүлсэн татуурга", "Доод хамгаалалт", "Манангийн гэрэл", "Загварчилсан капот", "Обуд / бүх замын дугуй", "Хийн / тосон амортизатор", "Дээврийн ачаа", "Төмөр арын гупер", "Өндөр тэвшний бүрхүүл / гүйдэг хайрцаг"],
    powertrainsTitle: "ТЕХНИКИЙН ХУВИЛБАРУУД", configuration: "Брошюр үзэх", specifications: "RELY R8 брошюр", brochureNote: "Sain Motors-ийн RELY R8 брошюр. PDF-ийг нээж томруулан үзэх эсвэл татаж авна уу.", openPdf: "PDF нээх", download: "Брошюр татах", page: "Хуудас",
  },
};

export const r8LeadCopy = {
  en: {
    title: "BOOKING A TEST DRIVE", city: "City", firstName: "First name", lastName: "Last name", phone: "Mobile number",
    consent: "I agree that Sain Motors may use these details to contact me about my R8 test-drive request.", privacy: "Privacy policy", send: "Send request", pending: "Sending…",
    success: "Your request has been received. The Sain Motors team will contact you to arrange the next step.",
    failure: "Your request could not be confirmed. Please try again or call 7222-8855.", contact: "RELY sales", required: "Please complete this field.", invalid: "Please check this field.", invalidPhone: "Enter a valid mobile number (8–15 digits).", consentError: "Please agree to the use of your details before sending.",
  },
  mn: {
    title: "ТУРШИЛТЫН ЖОЛООДЛОГО", city: "Хот", firstName: "Нэр", lastName: "Овог", phone: "Утасны дугаар",
    consent: "Sain Motors миний R8 туршилтын жолоодлогын хүсэлттэй холбогдуулан дээрх мэдээллийг ашиглаж, надтай холбоо барихыг зөвшөөрч байна.", privacy: "Нууцлалын бодлого", send: "Хүсэлт илгээх", pending: "Илгээж байна…",
    success: "Таны хүсэлтийг хүлээн авлаа. Sain Motors-ийн баг дараагийн алхмыг тохиролцохоор тантай холбогдоно.",
    failure: "Хүсэлт хүлээн авсныг баталгаажуулж чадсангүй. Дахин оролдох эсвэл 7222-8855 дугаарт залгана уу.", contact: "RELY борлуулалт", required: "Энэ талбарыг бөглөнө үү.", invalid: "Мэдээллээ шалгана уу.", invalidPhone: "Зөв утасны дугаар оруулна уу (8–15 орон).", consentError: "Илгээхийн өмнө мэдээлэл ашиглахыг зөвшөөрнө үү.",
  },
} satisfies Record<Locale, Record<string, string>>;
