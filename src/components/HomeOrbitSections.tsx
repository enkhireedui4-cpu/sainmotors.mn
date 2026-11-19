import Link from "next/link";
import { company, getBrands, getLocations, services, sitePhotos } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Icon } from "./Icon";
import { HomeOrbitBrands } from "./HomeOrbitBrands";
import { OrbitScrollScene } from "./OrbitScrollScene";
import { Picture } from "./Picture";
import "./home-orbit-sections.css";

const copy = {
  mn: {
    who: "Бид хэн бэ",
    about: "Бидний тухай",
    numbers: "Тоогоор харахад",
    numbersText: "Бид дараах 11 автомашины брэндтэй хамтран ажилладаг.",
    brands: "Автомашины брэнд", showrooms: "Албан ёсны шоурум", fourS: "4S шоурум", cities: "Үйл ажиллагаа явуулдаг хот",
    service: "Таны автомашинд зориулсан үйлчилгээ",
    serviceText: "Шинэ автомашин сонгохоос эхлээд санхүүжилтийн зөвлөгөө, үйлдвэрийн баталгаа, засвар үйлчилгээ хүртэл бүх шатанд мэргэжлийн үйлчилгээ үзүүлнэ.",
    allServices: "Бүх үйлчилгээ",
    serviceLabels: ["Шинэ автомашин", "Төлбөрийн боломжууд", "Үйлдвэрийн баталгаа", "Засвар, сэлбэг"],
  },
  en: {
    who: "Who are we",
    about: "About us",
    numbers: "At a glance",
    numbersText: "We work with the following 11 automotive brands.",
    brands: "Automotive brands", showrooms: "Official showrooms", fourS: "4S showrooms", cities: "Cities in our network",
    service: "Car care services",
    serviceText: "Professional service at every stage — from choosing your new car to financing advice, factory warranty and maintenance.",
    allServices: "All services",
    serviceLabels: ["New cars", "Financing", "Factory warranty", "Service and parts"],
  },
};

export function HomeOrbitSections({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const brands = getBrands();
  const showrooms = getLocations().filter(location => location.kind === "showroom");
  const photographs = sitePhotos.homeCompany;
  const facts = [
    { value: brands.length, label: text.brands },
    { value: showrooms.length, label: text.showrooms },
    { value: Number(company.fourSShowrooms.value[locale]), label: text.fourS },
    { value: new Set(showrooms.map(location => location.city.en)).size, label: text.cities },
  ];
  const servicePhotos = [...sitePhotos.homeServiceCards, sitePhotos.serviceGallery[1]];
  return (
    <OrbitScrollScene>
      <section id="home-company" className="orbit-company" aria-labelledby="orbit-company-heading">
        <svg className="orbit-company__road" viewBox="0 0 1600 1000" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M-70 1010C100 800 285 940 400 750S640 690 738 532S965 485 1030 315S1320 265 1420 118S1555 80 1690-20" />
          <circle cx="738" cy="532" r="7" />
        </svg>
        <div className="orbit-section-container">
          <div className="orbit-company__introduction">
            <div className="orbit-company__mountains" aria-hidden="true" />
            <h2 id="orbit-company-heading" className="orbit-company__eyebrow">{text.who}</h2>
            <div className="orbit-statement">
              <p>{company.introduction.value[locale]}</p>
            </div>
            <Link className="orbit-company__about" href={pageHref(locale, "about")} prefetch={false}>{text.about}<Icon name="arrowUpRight" size={17} /></Link>
          </div>
          <div className="orbit-photo-strip" aria-label={locale === "mn" ? "Сайн Моторсын автомашинууд" : "Cars from Sain Motors"}>
            {photographs.map(photo => <figure key={photo.key}><Picture photo={photo} locale={locale} sizes="(max-width: 47.99rem) 44vw, 22vw" /></figure>)}
          </div>
          <div className="orbit-numbers">
            <div className="orbit-numbers__intro"><h2>{text.numbers}</h2><p>{text.numbersText}</p></div>
            <dl className="orbit-facts">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
          </div>
        </div>
      </section>
      <HomeOrbitBrands brands={brands} locale={locale} />
      <section className="orbit-services" aria-labelledby="orbit-services-heading">
        <div className="orbit-services__intro">
          <h2 id="orbit-services-heading">{text.service}</h2>
          <p className="orbit-services__description">{text.serviceText}</p>
        </div>
        <div className="orbit-services__grid">
          {services.map((service, index) => (
            <Link key={service.id} className="orbit-service-card" href={pageHref(locale, "services") + "#service-" + service.id} prefetch={false}>
              <Picture photo={servicePhotos[index]} locale={locale} sizes="(max-width: 63.99rem) 50vw, 25vw" />
              <div className="orbit-service-card__label"><h3>{text.serviceLabels[index]}</h3></div>
            </Link>
          ))}
        </div>
        <div className="orbit-services__more"><Link href={pageHref(locale, "services")} prefetch={false}>{text.allServices}<Icon name="arrowUpRight" size={17} /></Link></div>
      </section>
    </OrbitScrollScene>
  );
}
