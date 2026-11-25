import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";

type HeroImage = { src: string; width: number; height: number; alt: string };

export function BydModelActions({ locale }: { locale: Locale }) {
  const mn = locale === "mn";
  return <div className="byd-actions">
    <a className="byd-button byd-button--primary" href="#byd-test-drive">
      {mn ? "Мэдээлэл" : "Information"}<Icon name="arrowRight" size={17} />
    </a>
    <a className="byd-button byd-button--outline" href="#byd-test-drive">
      {mn ? "Туршилтын жолоодлого" : "Test drive"}
    </a>
  </div>;
}

type StudioProps = {
  locale: Locale;
  backHref: string;
  headingId: string;
  name: string;
  subtitle: string;
  image: HeroImage;
  mobileImage?: Omit<HeroImage, "alt">;
};

export function BydStudioHero({ locale, backHref, headingId, name, subtitle, image, mobileImage }: StudioProps) {
  const photo = <img src={image.src} width={image.width} height={image.height} alt={image.alt} fetchPriority="high" decoding="async" />;
  return <div className="byd-shell">
    <a className="byd-profile__back" href={backHref}>
      <Icon name="arrowLeft" size={17} />{locale === "mn" ? "BYD загварууд" : "BYD models"}
    </a>
    <div className="byd-studio__heading">
      <h1 id={headingId} translate="no">{name}</h1>
      <p>{subtitle}</p>
    </div>
    {mobileImage ? <picture>
      <source media="(max-aspect-ratio: 4/5)" srcSet={mobileImage.src} width={mobileImage.width} height={mobileImage.height} />
      {photo}
    </picture> : photo}
    <BydModelActions locale={locale} />
  </div>;
}
