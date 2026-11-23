import "@/app/byd.css";
import { brandPhone, getLocation, ui } from "@/content";
import type { InternalBrand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { enquiryHref } from "@/lib/enquiries";
import { breadcrumbGraph } from "@/lib/structured-data";
import { pageHref } from "@/lib/routes";
import { BrandActions } from "./BrandActions";
import { BydExperience } from "./BydExperience";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

export function BydPage({ brand, locale }: { brand: InternalBrand; locale: Locale }) {
  const location = brand.location ? getLocation(brand.location) : undefined;
  const phone = brandPhone(brand);
  const enquiry = enquiryHref(locale, "test-drive", brand.slug);
  const brands = pageHref(locale, "brands");
  const mn = locale === "mn";

  return <div className="byd-page">
    <JsonLd data={breadcrumbGraph([
      { name: "Sain Motors", path: `/${locale}/` },
      { name: ui.nav.brands[locale], path: brands },
      { name: brand.name, path: `${brands}byd/` },
    ])} />
    <BydExperience locale={locale} enquiry={enquiry}
      back={<a className="byd-back" href={brands}><Icon name="arrowLeft" size={17} />{ui.nav.brands[locale]}</a>}
    />
    <section className="byd-contact" id="byd-contact" aria-labelledby="byd-contact-heading">
      <div className="byd-shell byd-contact__inner">
        <div>
          <h2 id="byd-contact-heading">{location?.name[locale] ?? "BYD × Sain Motors"}</h2>
          {location && <p>{location.address[locale]}{location.landmark && `, ${location.landmark[locale]}`}</p>}
          <p>{mn ? "Борлуулалт, үйлдвэрийн баталгаа, засвар, сэлбэг" : "Sales, factory warranty, service and spare parts"}</p>
        </div>
        <div>
          <BrandActions brand={brand} locale={locale} testDriveHref={enquiry} />
          <div className="byd-actions">
            <a className="byd-button byd-button--outline" href={phone.href}><Icon name="phone" size={18} />{mn ? phone.display : `+976 ${phone.display}`}</a>
            {location && <a className="byd-map" href={location.map.url}>{mn ? "Газрын зураг" : "Directions"}<Icon name="arrowUpRight" size={17} /></a>}
          </div>
        </div>
      </div>
    </section>
  </div>;
}
