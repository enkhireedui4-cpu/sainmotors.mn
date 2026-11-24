import type { Localized } from "@/lib/i18n";

type ModelFact = { label: Localized; value: Localized };
type ImageSize = { width: number; height: number };

export type BydProfileId = "ti-7" | "atto-3" | "shark-6";

interface BydProfile {
  id: BydProfileId;
  name: string;
  description: Localized;
  alt: Localized;
  desktop: ImageSize;
  mobile: ImageSize;
  highlights: readonly ModelFact[];
  specifications: readonly ModelFact[];
  equipment: Localized<readonly string[]>;
  colors: readonly (readonly [name: string, swatch: string])[];
}

const text = (mn: string, en: string): Localized => ({ mn, en });
const fact = (mn: string, en: string, mnValue: string, enValue = mnValue): ModelFact => ({
  label: text(mn, en),
  value: text(mnValue, enValue),
});

export function bydProfilePath(id: BydProfileId) {
  return `brands/byd/${id}`;
}

// Model details are from Sain Motors’ TI 7 specification cards, Atto3.pdf and Shark6.pdf.
export const bydProfiles: readonly BydProfile[] = [
  {
    id: "ti-7",
    name: "BYD TI 7",
    description: text(
      "Хот, аялалд зориулсан цэнэглэдэг хосолмол SUV",
      "A plug-in hybrid SUV for city driving and longer journeys",
    ),
    alt: text("Зам дээрх ногоон, саарал хоёр BYD TI 7", "Green and grey BYD TI 7 SUVs on the road"),
    desktop: { width: 1920, height: 960 },
    mobile: { width: 780, height: 1500 },
    highlights: [
      fact("Нийт хүчин чадал", "Combined power", "480 м.х.", "480 hp"),
      fact("Хосолсон горимын туулах зай", "Combined driving range", "800 км", "800 km"),
      fact("0–100 км/ц", "0–100 km/h", "4.8 сек", "4.8 s"),
    ],
    specifications: [
      fact("Хөдөлгүүр", "Engine", "1.5 л турбо", "1.5 L turbo"),
      fact("Хөтлөгч", "Drivetrain", "AWD"),
      fact("Мушгих хүч", "Torque", "630 Н·м", "630 N·m"),
      fact("Батарейн багтаамж", "Battery capacity", "35.6 кВт·ц", "35.6 kWh"),
      fact("Цахилгаанаар туулах зай", "Electric driving range", "130 км", "130 km"),
      fact("Урт × өргөн × өндөр", "Length × width × height", "4,999 × 1,995 × 1,865 мм", "4,999 × 1,995 × 1,865 mm"),
      fact("Тэнхлэг хоорондын зай", "Wheelbase", "2,920 мм", "2,920 mm"),
      fact("Газраас тэнхлэг хүртэлх зай", "Ground clearance", "190 мм", "190 mm"),
    ],
    equipment: {
      mn: ["V2L цахилгаан гаргалт", "Хөргүүртэй хайрцаг", "Apple CarPlay болон Android Auto", "Суудлын массаж", "Бороо мэдрэгч", "Толь болон салхины шилний халаалт", "Түлхүүргүй нэвтрэх", "OTA шинэчлэлт", "Суурин болон зөөврийн цэнэглэгч"],
      en: ["V2L power outlet", "Cooler box", "Apple CarPlay and Android Auto", "Seat massage", "Rain sensor", "Heated mirrors and windscreen", "Keyless entry", "OTA updates", "Fixed and portable chargers"],
    },
    colors: [["Obsidian Black", "#24282d"], ["Titanium Grey", "#616770"], ["Jungle Green", "#365c51"], ["Star & Moon Silver", "#c7cdd1"], ["Atlantis Grey", "#587181"]],
  },
  {
    id: "atto-3",
    name: "BYD ATTO 3",
    description: text(
      "Blade батарейтай бүрэн цахилгаан SUV",
      "A fully electric SUV with a BYD Blade Battery",
    ),
    alt: text("Тоосгон барилгын дэргэдэх цэнхэр BYD ATTO 3", "Blue BYD ATTO 3 beside a brick building"),
    desktop: { width: 2400, height: 1138 },
    mobile: { width: 960, height: 1920 },
    highlights: [
      fact("0–100 км/ц", "0–100 km/h", "7.3 сек", "7.3 s"),
      fact("Туулах зай · WLTP", "WLTP range", "420 км", "420 km"),
      fact("Батарейн багтаамж", "Battery capacity", "60.48 кВт·ц", "60.48 kWh"),
    ],
    specifications: [
      fact("Цахилгаан моторын дээд чадал", "Peak motor power", "204 м.х.", "204 hp"),
      fact("Моторын дээд мушгих хүч", "Peak motor torque", "310 Н·м", "310 N·m"),
      fact("Хөтлөгч", "Drivetrain", "Урд дугуй (FWD)", "Front-wheel drive (FWD)"),
      fact("Туулах зай · NEDC", "NEDC range", "480 км", "480 km"),
      fact("Цахилгаан зарцуулалт", "Energy consumption", "212 Вт·ц/км", "212 Wh/km"),
      fact("Цэнэглэх залгуур", "Charging ports", "AC Type 2 / DC CCS 2"),
      fact("Урт × өргөн × өндөр", "Length × width × height", "4,455 × 1,875 × 1,615 мм", "4,455 × 1,875 × 1,615 mm"),
      fact("Тэнхлэг хоорондын зай", "Wheelbase", "2,720 мм", "2,720 mm"),
      fact("Тээшний багтаамж", "Cargo capacity", "440 / 1,340 л", "440 / 1,340 L"),
      fact("Суудал", "Seats", "5"),
    ],
    equipment: {
      mn: ["12.8 инчийн эргэдэг дэлгэц", "Apple CarPlay болон Android Auto", "360° камер", "Панорамик шилэн дээвэр", "Дулааны насос", "Утасгүй цэнэглэгч", "Түлхүүргүй нэвтрэх"],
      en: ["12.8-inch rotating display", "Apple CarPlay and Android Auto", "360° camera", "Panoramic glass roof", "Heat pump", "Wireless phone charger", "Keyless entry"],
    },
    colors: [["Great White", "#f2f1ee"], ["Mist Grey", "#9a9fa5"], ["Tidal Black", "#22272b"], ["Deep Sea Blue", "#176291"]],
  },
  {
    id: "shark-6",
    name: "BYD SHARK 6",
    description: text("DMO системтэй, бүх дугуйн хөтлөгчтэй цэнэглэдэг хосолмол пикап", "An all-wheel-drive plug-in hybrid pickup with BYD DMO technology"),
    alt: text("Мөнгөлөг BYD SHARK 6 пикапын хажуу талаас харагдах байдал", "Silver BYD SHARK 6 pickup viewed from the side"),
    desktop: { width: 1680, height: 605 },
    mobile: { width: 780, height: 281 },
    highlights: [
      fact("Нийт хүчин чадал", "Combined power", "431 м.х.", "431 hp"),
      fact("Хосолсон туулах зай · WLTP", "Combined WLTP range", "670 км", "670 km"),
      fact("0–100 км/ц", "0–100 km/h", "5.7 сек", "5.7 s"),
    ],
    specifications: [
      fact("Хувилбар", "Trim", "Premium"),
      fact("Хөдөлгүүр", "Engine", "1.5 л турбо · DMO", "1.5 L turbo · DMO"),
      fact("Хөтлөгч", "Drivetrain", "AWD"),
      fact("Системийн мушгих хүч", "Combined torque", "650 Н·м", "650 N·m"),
      fact("Blade Battery багтаамж", "Blade Battery capacity", "29.58 кВт·ц", "29.58 kWh"),
      fact("Цахилгаанаар туулах зай · WLTP", "Electric WLTP range", "85 км", "85 km"),
      fact("Чирэх жин · тоормостой / тоормосгүй", "Towing capacity · braked / unbraked", "2,500 / 750 кг", "2,500 / 750 kg"),
      fact("Тэвшний багтаамж", "Bed capacity", "1,200 л", "1,200 L"),
      fact("Газрын цэвэр зай", "Ground clearance", "230 мм", "230 mm"),
      fact("Урт × өргөн × өндөр", "Length × width × height", "5,457 × 1,971 × 1,925 мм", "5,457 × 1,971 × 1,925 mm"),
      fact("Тэнхлэг хоорондын зай", "Wheelbase", "2,920 мм", "2,920 mm"),
      fact("Суудал", "Seats", "5"),
    ],
    equipment: {
      mn: ["15.6 инчийн эргэдэг дэлгэц", "12 чанга яригчтай Dynaudio систем", "360° камер", "Халаалт, агааржуулалттай урд суудал", "Apple CarPlay болон Android Auto", "V2L цахилгаан гаралт", "AC Type 2 (7 кВт), DC CCS 2 (55 кВт)"],
      en: ["15.6-inch rotating display", "12-speaker Dynaudio audio", "360° camera", "Heated and ventilated front seats", "Apple CarPlay and Android Auto", "V2L power outlet", "AC Type 2 (7 kW), DC CCS 2 (55 kW)"],
    },
    colors: [["Great White", "#f2f1ee"], ["Mist Grey", "#9a9fa5"], ["Tidal Black", "#22272b"], ["Deep Sea Blue", "#176291"]],
  },
];
