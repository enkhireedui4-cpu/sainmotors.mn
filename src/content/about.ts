import type {Block,Photo} from "./types";

type AboutCopy={
 statement:string;intro:string;brands:string;pause:string;play:string;
 outline:string;philosophyLabel:string;philosophy:string;philosophyBody:string;
 missionTitle:string;missionBody:string;visionTitle:string;visionBody:string;
 valuesTitle:string;values:string[];principlesTitle:string;principlesBody:string;
 diagramLabel:string;diagramQuality:string;diagramResponsibility:string;
 locations:string;services:string;
};

/** User-supplied Mongolian company copy and its English translation. */
export const aboutCopy:Block<AboutCopy>={
 status:"draft",
 source:"Mongolian principles, mission, vision, values and development text supplied by the user on 2026-11-17; English translation by the web team. Introduction retained from the supplied page brief. Translation awaits review.",
 value:{
  mn:{
   statement:"SAIN Motors нь 11 автомашины брэндийг нэгтгэсэн групп компани юм.",
   intro:"Бид автомашины борлуулалт, борлуулалтын дараах үйлчилгээг брэндийн салбаруудаараа дамжуулан хүргэдэг. Манай салбаруудаас загварын мэдээлэл, худалдан авалтын зөвлөгөө болон засвар үйлчилгээний мэдээлэл авах боломжтой.",
   brands:"Манай брэндүүд",pause:"Дэвсгэр бичлэгийг зогсоох",play:"Дэвсгэр бичлэгийг тоглуулах",
   outline:"ИТГЭЛТЭЙ УРАГШ",philosophyLabel:"БИДНИЙ ЗАРЧИМ",
   philosophy:"БИД ДЭЛХИЙН АВТОМАШИНЫ БРЭНДҮҮДИЙГ\nМОНГОЛД ХҮРГЭЖ, ҮЙЛЧИЛГЭЭ БҮРЭЭРЭЭ\nХЭРЭГЛЭГЧИЙН ИТГЭЛИЙГ БАТАТГАНА.",
   philosophyBody:"SAIN MOTORS нь автомашины 11 брэндийн Монгол дахь албан ёсны дистрибьютер. Бид автомашины борлуулалт, засвар үйлчилгээ, сэлбэгийн нийлүүлэлтийг хариуцдаг.",
   missionTitle:"ЭРХЭМ ЗОРИЛГО",
   missionBody:"Хэрэглэгч бүрд хэрэгцээндээ тохирсон автомашин сонгоход нь тусална. Загвар, тоноглол, үйлчилгээний нөхцөлийг ойлгомжтой танилцуулж, автомашинаа ашиглах явцад нь мэргэжлийн зөвлөгөө, засвар үйлчилгээгээр дэмжинэ.",
   visionTitle:"АЛСЫН ХАРАА",
   visionBody:"Борлуулалтын дараах үйлчилгээний чанараар Монголын автомашины салбарт жишиг тогтооно. Хэрэглэгч дараагийн автомашинаа сонгохдоо ч итгэлтэйгээр эргэн ханддаг дистрибьютер байна.",
   valuesTitle:"БИДНИЙ ҮНЭТ ЗҮЙЛС",
   values:["Хэрэглэгчээ сонсох","Мэдээллээ ил тод хүргэх","Ажилдаа мэргэжлийн хандах","Амласандаа хүрэх","Үйлчилгээгээ тасралтгүй сайжруулах"],
   principlesTitle:"ХӨГЖЛИЙН ЧИГЛЭЛ",
   principlesBody:"Хэрэглэгчдийн хэрэгцээнд нийцүүлэн автомашины загварын сонголтоо өргөжүүлнэ. Засвар үйлчилгээний багийн ур чадварыг хөгжүүлж, сэлбэгийн хүртээмжийг нэмэгдүүлэн, үйлчилгээ авах үйл явцыг хялбаршуулна.",
   diagramLabel:"SAIN MOTORS: чанар ба хариуцлага",diagramQuality:"ЧАНАР",diagramResponsibility:"ХАРИУЦЛАГА",
   locations:"Салбарууд харах",services:"Үйлчилгээтэй танилцах",
  },
  en:{
   statement:"SAIN Motors is a group company bringing together 11 automotive brands.",
   intro:"We provide vehicle sales and after-sales service through our brand showrooms. Visit our locations for model information, advice on purchasing, and information about maintenance and repairs.",
   brands:"Our brands",pause:"Pause background video",play:"Play background video",
   outline:"FORWARD WITH CONFIDENCE",philosophyLabel:"OUR PRINCIPLES",
   philosophy:"WE BRING THE WORLD’S AUTOMOTIVE BRANDS\nTO MONGOLIA, STRENGTHENING CUSTOMER TRUST\nTHROUGH EVERY SERVICE WE PROVIDE.",
   philosophyBody:"SAIN MOTORS is the official distributor of 11 automotive brands in Mongolia. We handle vehicle sales, maintenance and repairs, and spare parts supply.",
   missionTitle:"OUR MISSION",
   missionBody:"We help every customer choose a vehicle that suits their needs. We clearly explain models, equipment and service terms, and support customers throughout ownership with professional advice, maintenance and repairs.",
   visionTitle:"OUR VISION",
   visionBody:"We will set the standard for after-sales service quality in Mongolia’s automotive industry. We will be the distributor customers confidently return to when choosing their next vehicle.",
   valuesTitle:"OUR VALUES",
   values:["Listen to our customers","Communicate information openly","Work professionally","Keep our promises","Continuously improve our services"],
   principlesTitle:"OUR DEVELOPMENT PRIORITIES",
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
