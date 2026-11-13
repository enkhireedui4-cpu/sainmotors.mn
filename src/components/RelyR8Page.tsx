import { brandPhone, getBrands, getLocation, ui } from "@/content";
import type { InternalBrand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { breadcrumbGraph } from "@/lib/structured-data";
import { CorporateBrands } from "./CorporateBrands";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";
import { LocationCard } from "./LocationCard";
import { RelyR8Experience } from "./RelyR8Experience";

export function RelyR8Page({ brand, locale }: { brand: InternalBrand; locale: Locale }) {
  const location = brand.location ? getLocation(brand.location) : undefined;
  const phone = brandPhone(brand);
  return <div className="brand-detail brand-detail--rely">
    <JsonLd data={breadcrumbGraph([
      { name: "Sain Motors", path: `/${locale}/` },
      { name: ui.nav.brands[locale], path: `/${locale}/brands/` },
      { name: brand.name, path: `/${locale}/brands/rely/` },
    ])} />
    <div id="brand-models"><RelyR8Experience locale={locale}>
      <section className="r8-intro" id="brand-overview" aria-labelledby="rely-local-heading">
        <div className="r8-intro__grid">
          <div className="r8-intro__identity"><h2 id="rely-local-heading" translate="no">RELY × Sain Motors</h2><a className="r8-intro__phone" href={phone.href}><Icon name="phone" size={18} />{locale === "en" ? "+976 " : ""}{phone.display}</a></div>
          <div className="r8-intro__copy"><p>{brand.summary.value[locale]}</p>{brand.statement && <p>{brand.statement.value[locale]}</p>}</div>
        </div>
      </section>
    </RelyR8Experience></div>

    {location && <section className="brand-enquiries" id="brand-showroom" aria-labelledby="enquiries-heading"><div className="container">
      <div className="brand-section-heading"><h2 id="enquiries-heading">{ui.brand.enquiries[locale]}</h2><Icon name="directions" size={30} /></div>
      <LocationCard location={location} locale={locale} />
    </div></section>}

    <section className="brand-related" aria-labelledby="others-heading"><div className="container">
      <div className="brand-section-heading"><h2 id="others-heading">{ui.brand.others[locale]}</h2><a className="text-link" href={pageHref(locale, "brands")}>{ui.brand.viewAll[locale]}<Icon name="arrowUpRight" size={18} /></a></div>
      <nav aria-labelledby="others-heading"><CorporateBrands brands={getBrands().filter(item => item.slug !== brand.slug)} locale={locale} /></nav>
    </div></section>
  </div>;
}
