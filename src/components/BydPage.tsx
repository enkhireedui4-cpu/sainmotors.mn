import "@/app/byd.css";
import { ui } from "@/content";
import { bydModels } from "@/content/byd";
import type { InternalBrand } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { enquiryHref } from "@/lib/enquiries";
import { breadcrumbGraph } from "@/lib/structured-data";
import { pageHref } from "@/lib/routes";
import { BydContact } from "./BydContact";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

export function BydPage({ brand, locale }: { brand: InternalBrand; locale: Locale }) {
  const brands = pageHref(locale, "brands");
  const mn = locale === "mn";
  const sales = enquiryHref(locale, "sales", brand.slug);
  const modelHeading = mn ? "BYD загварууд" : "BYD models";

  return <div className="byd-page">
    <JsonLd data={breadcrumbGraph([
      { name: "Sain Motors", path: `/${locale}/` },
      { name: ui.nav.brands[locale], path: brands },
      { name: brand.name, path: `${brands}byd/` },
    ])} />
    <section className="byd-lineup" aria-labelledby="byd-lineup-heading">
      <h1 className="sr-only" id="byd-lineup-heading">{modelHeading}</h1>
      {bydModels.map((model, index) => {
        const name = `BYD ${model.name}`;
        const headingId = `${model.id}-heading`;
        const poster = `/byd-lineup/${model.id}`;
        const action = model.detailsLabel?.[locale] ?? (model.details
          ? (mn ? "Загвартай танилцах" : "Explore the model")
          : (mn ? "Мэдээлэл" : "Information"));
        return <section className="byd-model" key={model.id} id={model.id} aria-labelledby={headingId}>
          <picture className="byd-model__media">
            <source media="(max-aspect-ratio: 4/5)" srcSet={`${poster}-mobile.webp`} width={960} height={1920} />
            <img
              src={`${poster}-desktop.webp`}
              width={2400}
              height={1350}
              alt={model.alt[locale]}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              decoding="async"
            />
          </picture>
          <div className="byd-shell byd-model__overlay">
            <h2 className="byd-model__heading" id={headingId} translate="no">{name}</h2>
            <a className="byd-button byd-button--primary" href={model.details ? localePath(locale, model.details) : sales}>
              {action}<span className="sr-only" translate="no"> · {name}</span>
              <Icon name="arrowRight" size={18} />
            </a>
          </div>
        </section>;
      })}
    </section>
    <BydContact brand={brand} locale={locale} />
  </div>;
}
