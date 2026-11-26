import type { Localized } from "@/lib/i18n";
import type { BydProfileId } from "./byd-profiles";

type BydFeature = {
  id: string;
  title: Localized;
  copy: Localized;
  alt: Localized;
  desktop: [width: number, height: number];
  mobile: [width: number, height: number];
};

type BydQuestion = { question: Localized; answer: Localized };

const text = (mn: string, en: string): Localized => ({ mn, en });

export const bydProfileFeatures: Partial<Record<BydProfileId, {
  stories: readonly BydFeature[];
  questions: readonly BydQuestion[];
}>> = {
  "ti-7": {
    stories: [
      {
        id: "exterior",
        title: text("Хотын замд ч, хотоос гарахад ч", "From city streets to the open road"),
        copy: text(
          "Босоо урд нүүр, өргөн LED гэрэл, дугуйн нуман хамгаалалт нь TI 7-ийн гадна төрхийг тодорхойлно. Бүх дугуйн хөтлөгчтэй. Газраас машины доод талын хамгийн нам цэг хүртэлх зай 190 мм.",
          "An upright front, wide LED lamps and pronounced wheel arches define the TI 7. It pairs all-wheel drive with 190 mm of ground clearance.",
        ),
        alt: text("Хотын гудамжинд яваа ногоон BYD TI 7", "Green BYD TI 7 on a city street"),
        desktop: [1920, 1133],
        mobile: [900, 1800],
      },
      {
        id: "hybrid",
        title: text("Цахилгаан ба хосолмол горим", "Electric and hybrid driving"),
        copy: text(
          "1.5 литрийн турбо хөдөлгүүр цахилгаан хөтлөгчтэй хосолно. 35.6 кВт·ц батарейтай TI 7 зөвхөн цахилгаанаар 130 км, хосолсон горимоор 800 км туулах үзүүлэлттэй.",
          "A 1.5-litre turbo engine works with the electric drive. The 35.6 kWh battery offers 130 km of electric driving range, with 800 km of combined range.",
        ),
        alt: text("Уулын зам дээрх ногоон BYD TI 7", "Green BYD TI 7 on a rocky mountain road"),
        desktop: [1920, 1080],
        mobile: [900, 1800],
      },
      {
        id: "cabin",
        title: text("Салон ба төв дэлгэц", "Cabin and centre display"),
        copy: text(
          "Apple CarPlay болон Android Auto-оор утсаа төв дэлгэцтэй холбоно. Суудлын массаж, түлхүүргүй нэвтрэх систем, OTA шинэчлэлттэй.",
          "Connect your phone to the centre display with Apple CarPlay or Android Auto. Equipment includes seat massage, keyless entry and over-the-air updates.",
        ),
        alt: text("BYD TI 7-ийн жолооны хүрд, төв дэлгэц, урд суудал", "BYD TI 7 steering wheel, centre display and front seats"),
        desktop: [1920, 1133],
        mobile: [900, 1800],
      },
      {
        id: "storage",
        title: text("Аяллын тав тух", "Equipment for longer trips"),
        copy: text(
          "Төв консолын хөргүүр ундааг сэрүүн байлгана. V2L гаралтад тохирох цахилгаан хэрэгслээ залгаад аяллынхаа үеэр ашиглаж болно.",
          "Keep drinks in the cooler box in the centre console. The V2L outlet lets the vehicle power compatible electrical equipment on a trip.",
        ),
        alt: text("BYD TI 7-ийн төв консол дахь хөргүүртэй хайрцаг", "Cooler box in the BYD TI 7 centre console"),
        desktop: [709, 413],
        mobile: [709, 413],
      },
    ],
    questions: [
      {
        question: text("TI 7 зөвхөн цахилгаанаар хэр хол явах вэ?", "How far can the TI 7 drive on electric power?"),
        answer: text("Цахилгаан горимоор 130 км, хосолсон горимоор 800 км туулах үзүүлэлттэй.", "The TI 7 has 130 km of electric driving range and 800 km of combined range."),
      },
      {
        question: text("TI 7 ямар хөтлөгчтэй вэ?", "What drivetrain does the TI 7 use?"),
        answer: text("Бүх дугуйн хөтлөгчтэй (AWD). Хосолмол системийн нийт чадал 480 м.х., мушгих хүч 630 Н·м.", "It has all-wheel drive (AWD). The hybrid system is rated at 480 hp and 630 N·m."),
      },
      {
        question: text("V2L гэж юу вэ?", "What is V2L?"),
        answer: text("Vehicle-to-Load буюу V2L нь машины батарейгаас тохирох гаднын цахилгаан хэрэгсэл тэжээх боломж юм.", "Vehicle-to-Load (V2L) lets the car's battery supply power to compatible external equipment."),
      },
    ],
  },
  "atto-3": {
    stories: [
      {
        id: "exterior",
        title: text("Гадна хийц ба LED гэрэл", "Exterior design and LED lighting"),
        copy: text(
          "Урд талын өргөн гэрлийн шугам, кузовын хажуугийн тод нугалаас нь ATTO 3-ын төрхийг бүрдүүлдэг. LED их гэрэл, панорамик шилэн дээвэртэй.",
          "A wide front light signature and sculpted side panels define the ATTO 3. It has LED headlights and a panoramic glass roof.",
        ),
        alt: text("Цэнхэр BYD ATTO 3-ын урд гэрэл, урд дугуй", "Front lighting and wheel of a blue BYD ATTO 3"),
        desktop: [1920, 1080],
        mobile: [900, 1800],
      },
      {
        id: "cabin",
        title: text("Таван суудалтай салон", "Five-seat cabin"),
        copy: text(
          "12.8 инчийн төв дэлгэцийг босоо, хэвтээ байрлалд ашиглаж болно. 440 литрийн тээшний зай арын суудлыг 60:40 харьцаагаар эвхэхэд 1,340 литр хүртэл нэмэгдэнэ.",
          "Use the 12.8-inch centre display in portrait or landscape. The 440-litre boot expands to 1,340 litres with the 60:40 split rear seats folded.",
        ),
        alt: text("BYD ATTO 3-ын жолоочийн хэсэг, төв дэлгэц, урд суудал", "BYD ATTO 3 dashboard, centre display and front seats"),
        desktop: [1920, 1080],
        mobile: [900, 1800],
      },
      {
        id: "platform",
        title: text("e-Platform 3.0", "e-Platform 3.0"),
        copy: text(
          "BYD-ийн цахилгаан автомашинд зориулсан платформ дээр батарейг шалны доор байрлуулсан. Урд дугуйг хөтлөх цахилгаан мотор 204 м.х. чадал, 310 Н·м мушгих хүчтэй.",
          "BYD's dedicated electric platform places the battery beneath the floor. The front-wheel-drive motor delivers 204 hp and 310 N·m.",
        ),
        alt: text("e-Platform 3.0-ын батарей, мотор, дугуйн байрлал", "Battery, motor and wheel layout on e-Platform 3.0"),
        desktop: [1920, 1080],
        mobile: [900, 1800],
      },
      {
        id: "battery",
        title: text("60.48 кВт·ц Blade Battery", "60.48 kWh Blade Battery"),
        copy: text(
          "Blade Battery нь урт, нарийн хэлбэртэй литийн төмөр фосфатын (LFP) элементүүдтэй. Туулах зай нь WLTP туршилтаар 420 км, NEDC туршилтаар 480 км.",
          "The Blade Battery uses long, slim lithium iron phosphate (LFP) cells. Driving range is 420 km under WLTP and 480 km under NEDC.",
        ),
        alt: text("BYD Blade Battery-ийн хавтгай элементүүдийн бүтэц", "Cutaway showing the flat cells of the BYD Blade Battery"),
        desktop: [1920, 1080],
        mobile: [900, 1800],
      },
      {
        id: "heat-pump",
        title: text("Дулааны насос", "Heat pump"),
        copy: text(
          "Дулааны насос нь салоны халаалт, хөргөлт болон батарейн температурыг удирдах дулааны системийн нэг хэсэг юм.",
          "The heat pump supports the thermal system that heats and cools the cabin and manages battery temperature.",
        ),
        alt: text("ATTO 3-ын дулааны насосны эд ангийн зураг", "ATTO 3 heat-pump components"),
        desktop: [1920, 1080],
        mobile: [900, 1800],
      },
      {
        id: "charging",
        title: text("AC болон DC цэнэглэлт", "AC and DC charging"),
        copy: text(
          "Хувьсах гүйдлийн цэнэглэлтэд Type 2, тогтмол гүйдлийн хурдан цэнэглэлтэд CCS 2 холбогч ашиглана.",
          "Use a Type 2 connector for AC charging or a CCS 2 connector for DC fast charging.",
        ),
        alt: text("Цэнхэр BYD ATTO 3 цэнэглэгчид холбогдсон нь", "Blue BYD ATTO 3 plugged into a charger"),
        desktop: [1180, 665],
        mobile: [900, 507],
      },
      {
        id: "connectivity",
        title: text("Утасны холболт ба жолоодлогын туслах", "Phone connectivity and driving aids"),
        copy: text(
          "Apple CarPlay, Android Auto болон утасгүй цэнэглэгчтэй. 360° камер зогсоолд байрлуулахад тусалж, дасан зохицох хурд баригч, автомат тоормос, сохор бүсийн хяналт жолоочид дэмжлэг үзүүлнэ.",
          "Apple CarPlay, Android Auto and wireless phone charging are included. A 360° camera helps with parking, while adaptive cruise control, automatic emergency braking and blind-spot detection assist the driver.",
        ),
        alt: text("BYD ATTO 3-ын төв дэлгэц дээрх аппууд", "Apps on the BYD ATTO 3 centre display"),
        desktop: [1920, 1080],
        mobile: [900, 1800],
      },
    ],
    questions: [
      {
        question: text("420 км, 480 км хоёрын ялгаа юу вэ?", "Why are 420 km and 480 km both listed?"),
        answer: text("420 км нь WLTP, 480 км нь NEDC туршилтын үзүүлэлт. Бодит туулах зайд цаг агаар, хурд, ачаалал нөлөөлнө.", "420 km is the WLTP figure and 480 km is the NEDC figure. Actual range depends on factors such as weather, speed and load."),
      },
      {
        question: text("ATTO 3 ямар цэнэглэгчид таарах вэ?", "Which chargers are compatible with the ATTO 3?"),
        answer: text("AC цэнэглэлтэд Type 2, DC хурдан цэнэглэлтэд CCS 2 холбогч ашиглана.", "It accepts Type 2 for AC charging and CCS 2 for DC fast charging."),
      },
      {
        question: text("Тээшний зай хэд вэ?", "How much boot space does it have?"),
        answer: text("Арын суудал босоо үед 440 литр, эвхсэн үед 1,340 литр.", "It has 440 litres with the rear seats up and 1,340 litres with them folded."),
      },
    ],
  },
};
