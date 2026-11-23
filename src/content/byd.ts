import type { Localized } from "@/lib/i18n";

const text = (mn: string, en: string): Localized => ({ mn, en });

export const sealionAssets = "/byd-sealion-6";

export const sealion = {
  name: "SEALION 6",
  series: "DM-i",
  powertrain: text("Цэнэглэдэг хосолмол (PHEV)", "Plug-in hybrid (PHEV)"),
  description: text(
    "DM-i систем нь 1.5 литрийн бензин хөдөлгүүр, цахилгаан мотор, Blade Battery-г нэгтгэдэг. Та цэнэглээд цахилгаанаар зорчих эсвэл холын замд хосолсон горимоор явах боломжтой.",
    "The DM-i system combines a 1.5-litre petrol engine, an electric motor and a Blade Battery. Charge up for electric driving or use hybrid mode for longer journeys.",
  ),
};

// Technical figures are from Sain Motors' supplied Sealion_6.pdf.
const metric = (mn: string, en: string, value: string, unit = "") => ({ label: text(mn, en), value, unit });
const batteryCapacity = metric("Blade Battery багтаамж", "Blade Battery capacity", "18.3", "kWh");
export const sealionHighlights = [
  metric("0–100 км/ц хурд авах", "0–100 km/h", "8.5", "s"),
  metric("Системийн нийт хүчин чадал", "Combined system power", "300", "hp"),
  batteryCapacity,
];

export const sealionSpecs = [
  { title: text("Хэмжээс ба багтаамж", "Dimensions and capacity"), rows: [
    metric("Урт × өргөн × өндөр", "Length × width × height", "4,775 × 1,890 × 1,670", "mm"),
    metric("Тэнхлэг хоорондын зай", "Wheelbase", "2,765", "mm"),
    metric("Ачааны хэсэг", "Cargo capacity", "425 / 1,440", "L"),
    metric("Суудал", "Seating", "5"),
  ] },
  { title: text("Хөдөлгүүр ба хөтлөгч", "Powertrain and drive"), rows: [
    metric("Бензин хөдөлгүүр", "Petrol engine", "1.5", "L"),
    metric("Системийн нийт хүчин чадал", "Combined system power", "300", "hp"),
    metric("Цахилгаан моторын дээд чадал", "Peak electric motor power", "195", "hp"),
    metric("Цахилгаан моторын дээд мушгих хүч", "Peak electric motor torque", "325", "N·m"),
    metric("Системийн нийт мушгих хүч", "Combined system torque", "460", "N·m"),
    metric("Хосолсон горимын нийт туулах зай", "Combined driving range", "1,100", "km"),
    { label: text("Хөтлөгч", "Drivetrain"), value: text("Урд дугуй", "Front-wheel drive") },
  ] },
  { title: text("Батарей ба цэнэглэлт", "Battery and charging"), rows: [
    batteryCapacity,
    metric("Цахилгаанаар туулах зай · WLTP · SOC 25–100%", "Electric range · WLTP · SOC 25–100%", "80", "km"),
    metric("AC Type 2 / DC CCS 2", "AC Type 2 / DC CCS 2", "7 / 18", "kW"),
  ] },
  { title: text("Аюулгүй байдал", "Safety"), rows: [
    metric("Тойрчны харагдацтай камер", "Surround-view camera", "360°"),
    { label: text("Жолоодлогын туслах системүүд", "Driver assistance"), value: "ACC · AEB · LDW" },
    { label: text("Хүүхдийн суудлын бэхэлгээ", "Child-seat mounting"), value: "ISOFIX" },
  ] },
];

export interface SealionFinish {
  id: string;
  label: Localized;
  swatch: string;
  width: number;
  height: number;
}

export const sealionColors: readonly SealionFinish[] = [
  { id: "white", label: text("Цагаан", "White"), swatch: "#f3f4f4", width: 385, height: 257 },
  { id: "light-grey", label: text("Цайвар саарал", "Stone grey"), swatch: "#a8aaad", width: 385, height: 257 },
  { id: "dark-grey", label: text("Бараан саарал", "Harbour grey"), swatch: "#626a77", width: 385, height: 257 },
  { id: "black", label: text("Хар", "Black"), swatch: "#24272b", width: 385, height: 257 },
  { id: "blue", label: text("Цэнхэр", "Azure blue"), swatch: "#6e9ebb", width: 385, height: 242 },
];

export const sealionCabins: readonly SealionFinish[] = [
  { id: "cabin-grey", label: text("Цайвар", "Light"), swatch: "#ded9d0", width: 1120, height: 630 },
  { id: "cabin-brown", label: text("Хар ба бор", "Black and brown"), swatch: "#93664f", width: 1120, height: 630 },
  { id: "cabin-black", label: text("Хар", "Black"), swatch: "#24272b", width: 1120, height: 630 },
];

export const sealionComfort = [
  {
    title: text("Урд суудлын тохируулга", "Front seat adjustment"),
    description: text(
      "Жолоочийн суудал 8, урд зорчигчийн суудал 4 чиглэлд цахилгаанаар тохирно. Урд хоёр суудал халаалт, агааржуулалттай.",
      "The driver’s seat adjusts electrically in eight directions and the front passenger’s in four. Both front seats are heated and ventilated.",
    ),
  },
  {
    title: text("Арын суудлын тав тух", "Rear passenger comfort"),
    description: text(
      "Арын түшлэгийн өнцгийг гараар тохируулна. Хоёр бүсийн агааржуулагчийн арын үлээлгүүр, USB-C болон USB-A оролттой.",
      "Rear passengers have adjustable backrests, vents supplied by the dual-zone climate system, and USB-C and USB-A ports.",
    ),
  },
  {
    title: text("Дэлгэц ба утасны холболт", "Display and phone connectivity"),
    description: text(
      "15.6 инчийн эргэдэг мэдрэгчтэй дэлгэц Apple CarPlay® болон Android Auto™ дэмжинэ. Хоёр утасгүй цэнэглэгч, 12.3 инчийн жолоочийн дэлгэцтэй.",
      "The 15.6-inch rotating touchscreen supports Apple CarPlay® and Android Auto™. There are two wireless phone chargers and a 12.3-inch driver display.",
    ),
  },
];
