import type {Block,Photo} from "./types";

type AboutCopy={
 statement:string;intro:string;brands:string;pause:string;play:string;
 outline:string;philosophyLabel:string;philosophy:string;philosophyBody:string;
 purposeTitle:string;missionTitle:string;missionBody:string;visionTitle:string;visionBody:string;
 valuesTitle:string;values:string[];principlesTitle:string;principlesBody:string;
 diagramLabel:string;diagramQuality:string;diagramResponsibility:string;
 locations:string;services:string;
};

/** User-supplied Mongolian company copy and its English translation. */
export const aboutCopy:Block<AboutCopy>={
 status:"draft",
 source:"Company introduction and motto supplied by management via the user on 2026-11-17, edited for spelling and bilingual consistency. Existing mission, vision, values and development text retained.",
 value:{
  mn:{
   statement:"Бидний тухай",
   intro:"Сайн Моторс ХХК нь Сайн Интернешнл ХХК-ийн охин компани болж 2021 онд байгуулагдсан бөгөөд 2023 онд БНХАУ-ын Jetour брэндтэй хамтын ажиллагаагаа эхлүүлснээр идэвхтэй үйл ажиллагаа явуулж эхэлсэн.\n\nҮүнээс хойш нийт 11 брэндийг Монгол Улсад төлөөлөх албан ёсны эрхийг авч, хэрэглэгчдэд өндөр чанартай бүтээгдэхүүн, үйлчилгээг хүргэн ажиллаж байна.\n\nБид дэлхийд тэргүүлэх брэндүүдийн автомашиныг албан ёсны эрхтэйгээр үйлдвэрээс шууд хэрэглэгчдэд хүргэхээс гадна засвар үйлчилгээ, сэлбэг захиалгын цогц үйлчилгээг нэг дороос санал болгож байна.",
   brands:"Манай брэндүүд",pause:"Дэвсгэр бичлэгийг зогсоох",play:"Дэвсгэр бичлэгийг тоглуулах",
   // The user wants this decorative slogan to remain English in both locales.
   outline:"FORWARD WITH CONFIDENCE",philosophyLabel:"БИДНИЙ УРИА",
   philosophy:"МОНГОЛ ХҮНД ШИНЭ МАШИН",
   philosophyBody:"Сайн Моторс ХХК нь автомашины 11 брэндийн Монгол дахь албан ёсны дистрибьютор юм. Бид шинэ автомашин худалдаалахаас гадна засвар үйлчилгээ, сэлбэг нийлүүлэлт болон мэргэжлийн зөвлөгөөг хэрэглэгчдэдээ тасралтгүй хүргэж байна.",
   purposeTitle:"Бидний баримтлах зарчим",
   missionTitle:"Эрхэм зорилго",
   missionBody:"Хэрэглэгч бүрд хэрэгцээндээ тохирсон автомашин сонгоход нь тусална. Загвар, тоноглол, үйлчилгээний нөхцөлийг ойлгомжтой танилцуулж, автомашинаа ашиглах явцад нь мэргэжлийн зөвлөгөө, засвар үйлчилгээгээр дэмжинэ.",
   visionTitle:"Алсын хараа",
   visionBody:"Борлуулалтын дараах үйлчилгээний чанараар Монголын автомашины салбарт жишиг тогтооно. Хэрэглэгч дараагийн автомашинаа сонгохдоо ч итгэлтэйгээр эргэн ханддаг дистрибьютор байна.",
   valuesTitle:"Бидний үнэт зүйлс",
   values:["Хэрэглэгчээ сонсох","Мэдээллээ ил тод хүргэх","Ажилдаа мэргэжлийн хандах","Амласандаа хүрэх","Үйлчилгээгээ тасралтгүй сайжруулах"],
   principlesTitle:"Хөгжлийн чиглэл",
   principlesBody:"Хэрэглэгчдийн хэрэгцээнд нийцүүлэн автомашины загварын сонголтоо өргөжүүлнэ. Засвар үйлчилгээний багийн ур чадварыг хөгжүүлж, сэлбэгийн хүртээмжийг нэмэгдүүлэн, үйлчилгээ авах үйл явцыг хялбаршуулна.",
   diagramLabel:"SAIN MOTORS: чанар ба хариуцлага",diagramQuality:"ЧАНАР",diagramResponsibility:"ХАРИУЦЛАГА",
   locations:"Салбарууд харах",services:"Үйлчилгээтэй танилцах",
  },
  en:{
   statement:"About us",
   intro:"Sain Motors LLC was founded in 2021 as a subsidiary of Sain International LLC. It became fully active in 2023, when it started working with Jetour, a brand from China.\n\nSince then, Sain Motors has become the official representative of 11 brands in Mongolia. We bring customers high-quality products and services.\n\nAs an official distributor, we deliver vehicles from leading global brands straight from the factory to our customers. We also offer maintenance, repairs and spare parts orders, all in one place.",
   brands:"Our brands",pause:"Pause background video",play:"Play background video",
   outline:"FORWARD WITH CONFIDENCE",philosophyLabel:"OUR MOTTO",
   philosophy:"A NEW CAR FOR MONGOLIANS",
   philosophyBody:"Sain Motors LLC is the official distributor of 11 automotive brands in Mongolia. Along with selling new cars, we provide our customers with ongoing maintenance and repair services, spare parts supply, and expert advice.",
   purposeTitle:"Our guiding principles",
   missionTitle:"Our mission",
   missionBody:"We help every customer choose a vehicle that suits their needs. We clearly explain models, equipment and service terms, and support customers throughout ownership with professional advice, maintenance and repairs.",
   visionTitle:"Our vision",
   visionBody:"We will set the standard for after-sales service quality in Mongolia’s automotive industry. We will be the distributor customers confidently return to when choosing their next vehicle.",
   valuesTitle:"Our values",
   values:["Listen to our customers","Communicate information openly","Work professionally","Keep our promises","Continuously improve our services"],
   principlesTitle:"Our development priorities",
   principlesBody:"We will expand our vehicle range to meet customer needs. We will develop our service team’s skills, increase spare parts availability and make it easier to access our services.",
   diagramLabel:"SAIN MOTORS: quality and accountability",diagramQuality:"QUALITY",diagramResponsibility:"ACCOUNTABILITY",
   locations:"View showrooms",services:"Explore our services",
  },
 },
};

/** SAIN-supplied photography, kept beside the replaceable copy. */
export const aboutPhotos={
 left:{key:"brand-hongqi",status:"sourced",focus:"50% 56%",alt:{mn:"Хотын замаар явж буй HONGQI HS5",en:"HONGQI HS5 on a city road"}},
 right:{key:"brand-aito-m9",status:"sourced",focus:"50% 62%",alt:{mn:"Гэрэлтсэн барилгын дэргэд зогсох AITO 9",en:"AITO 9 beside an illuminated building"}},
 lower:{key:"brand-byd-shark6-top",status:"sourced",focus:"50% 50%",alt:{mn:"Дээрээс нь авсан BYD Shark 6 пикап",en:"BYD Shark 6 pickup viewed from above"}},
} satisfies Record<string,Photo>;

/** User-supplied replacements from Downloads, 2026-11-17; already optimized WebP originals. */
export const aboutPurposeImages={
 mission:{
  src:"/about/design-hero.webp",width:1920,height:1080,focus:"50% 50%",status:"sourced",
  source:"User-supplied Downloads/design-hero.webp, requested for the About mission panel on 2026-11-17.",
  alt:{mn:"Студид байрлуулсан цагаан CHERY TIGGO 4",en:"White CHERY TIGGO 4 in a studio"},
 },
 vision:{
  src:"/about/design-2.webp",width:1920,height:960,focus:"50% 50%",status:"sourced",
  source:"User-supplied Downloads/design-2.webp, requested for the About vision panel on 2026-11-17.",
  alt:{mn:"Барилгын дэргэд зогсох улаан болон цэнхэр ногоон CHERY автомашинууд",en:"Red and teal CHERY vehicles beside a building"},
 },
} satisfies Record<string,Omit<Photo,"key">&{src:string;width:number;height:number}>;
