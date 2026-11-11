import { getBrands, getPhoto } from "@/content";
import type { Locale } from "@/lib/i18n";
import { brandHref } from "@/lib/routes";
import { VehicleShowcase, type ShowcaseVehicle } from "./VehicleShowcase";

const introductions: Record<string, { model: string; mn: string; en: string }> = {
  jetour: { model: "JETOUR T2", mn: "Алсыг зорих эрх чөлөө", en: "A new possibility in every journey" },
  soueast: { model: "SOUEAST S08", mn: "Хамтдаа өнгөрүүлэх мөч бүрд", en: "Discover the everyday, together" },
  chery: { model: "CHERY TIGGO 7", mn: "Өдөр бүрийн үнэ цэнтэй сонголт", en: "Made for your pace of life" },
  byd: { model: "BYD ATTO 3", mn: "Шинэ эрчээр урагшил", en: "Discover the future of mobility" },
  riddara: { model: "RIDDARA RD6", mn: "Хүссэн зүгтээ шинэ эрчээр", en: "New roads. New possibilities." },
  aito: { model: "AITO 9", mn: "Тав тухыг дараагийн түвшинд", en: "A new perspective on every journey" },
  "212": { model: "212", mn: "Бартаа бүрийн цаана эрх чөлөө", en: "Adventure starts here" },
  bestune: { model: "BESTUNE T99", mn: "Өөрийн өнгөөр урагшил", en: "Move to your own rhythm" },
  rely: { model: "RELY R8", mn: "Ажилд хүч, аялалд түшиг", en: "A companion for work and adventure" },
  maxus: { model: "MAXUS C100", mn: "Таны бизнесийн хөдөлгөгч хүч", en: "Keep your business moving" },
  hongqi: { model: "HONGQI HS3", mn: "Эрхэмсэг оршихуйн илэрхийлэл", en: "Make every journey an occasion" },
};

const studioImages: Record<string, Pick<ShowcaseVehicle, "src" | "width" | "height" | "blend" | "softShadow">> = {
  jetour: { src: "/brand-showcase/jetour.webp", width: 666, height: 351 },
  soueast: { src: "/brand-showcase/soueast.webp", width: 1260, height: 648, softShadow: true },
  chery: { src: "/brand-showcase/chery.webp", width: 753, height: 442 },
  byd: { src: "/brand-showcase/byd.webp", width: 588, height: 296 },
  riddara: { src: "/brand-showcase/riddara.webp", width: 1121, height: 646, blend: true },
  aito: { src: "/brand-showcase/aito.webp", width: 1920, height: 815 },
  "212": { src: "/brand-showcase/212.webp", width: 1016, height: 521 },
  bestune: { src: "/brand-showcase/bestune.webp", width: 855, height: 421, blend: true },
  rely: { src: "/brand-showcase/rely.webp", width: 578, height: 387 },
  maxus: { src: "/brand-showcase/maxus.webp", width: 1920, height: 1231, blend: true },
  hongqi: { src: "/brand-showcase/hongqi.webp", width: 1046, height: 532 },
};

/** Vehicle content stays on the server; only the gallery is interactive. */
export function HomeBrandShowcase({ locale }: { locale: Locale }) {
  const brands = getBrands();
  const vehicles: ShowcaseVehicle[] = brands.map(brand => {
    const introduction = introductions[brand.slug];
    const photo = brand.cardPhoto ?? brand.photo;
    const asset = photo ? getPhoto(photo.key) : undefined;
    const studioImage = studioImages[brand.slug];
    const source = asset?.srcset.find(([width]) => width >= 1440) ?? asset?.srcset.at(-1);
    return {
      slug: brand.slug,
      name: brand.name,
      model: introduction.model,
      tagline: introduction[locale],
      href: brandHref(locale, brand.slug),
      src: studioImage?.src ?? source![1],
      srcSet: studioImage ? undefined : asset?.srcset.map(([width, url]) => `${url} ${width}w`).join(", "),
      width: studioImage?.width ?? asset!.width,
      height: studioImage?.height ?? asset!.height,
      position: studioImage ? "50% 100%" : photo?.focus,
      studio: Boolean(studioImage),
      blend: studioImage?.blend,
      softShadow: studioImage?.softShadow,
    };
  });

  return (
    <section id="home-brand-showcase" className="brand-spotlight" aria-labelledby="brand-spotlight-heading">
      <div className="container brand-spotlight__heading">
        <p className="brand-spotlight__eyebrow">{locale === "mn" ? "Манай брэндүүд" : "Our brands"}</p>
        <h2 id="brand-spotlight-heading">
          <span>{locale === "mn" ? "Таны сонголт" : "Your choice"}<span className="brand-spotlight__heading-stop">.</span></span>{" "}
          <span className="brand-spotlight__heading-second">{locale === "mn" ? "Таны брэнд" : "Your brand"}</span>
        </h2>
      </div>
      <VehicleShowcase
        vehicles={vehicles}
        labels={locale === "mn"
          ? { region: "Автомашины брэндүүд", previous: "Өмнөх брэнд", next: "Дараагийн брэнд", explore: "Брэндтэй танилцах", slide: "брэнд", help: "Брэнд солихдоо зүүн, баруун сумтай товчлуурыг ашиглана уу." }
          : { region: "Explore our automotive brands", previous: "Previous brand", next: "Next brand", explore: "Explore the brand", slide: "brand", help: "Use the left and right arrow keys to explore the brands." }}
      />
    </section>
  );
}
