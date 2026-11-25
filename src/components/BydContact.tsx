import { brandPhone, getLocation } from "@/content";
import type { InternalBrand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { enquiryHref } from "@/lib/enquiries";
import { BrandActions } from "./BrandActions";
import { Icon } from "./Icon";

export function BydContact({ brand, locale, modelRequests = false, salesLabel }: { brand: InternalBrand; locale: Locale; modelRequests?: boolean; salesLabel?: string }) {
  const location = brand.location ? getLocation(brand.location) : undefined;
  const phone = brandPhone(brand);
  const enquiry = modelRequests ? "#byd-test-drive" : enquiryHref(locale, "test-drive", brand.slug);
  const mn = locale === "mn";

  return <section className="byd-contact" id="byd-contact" aria-labelledby="byd-contact-heading">
      <div className="byd-shell byd-contact__inner">
        <div>
          <h2 id="byd-contact-heading">{location?.name[locale] ?? "BYD × Sain Motors"}</h2>
          {location && <p>{location.address[locale]}{location.landmark && `, ${location.landmark[locale]}`}</p>}
          <p>{mn ? "Борлуулалт, үйлдвэрийн баталгаа, засвар, сэлбэг" : "Sales, factory warranty, service and spare parts"}</p>
        </div>
        <div>
          <BrandActions brand={brand} locale={locale} testDriveHref={enquiry} salesHref={modelRequests ? enquiry : undefined} salesLabel={salesLabel} />
          <div className="byd-actions">
            <a className="byd-button byd-button--outline" href={phone.href}><Icon name="phone" size={18} />{mn ? phone.display : `+976 ${phone.display}`}</a>
            {location && <a className="byd-map" href={location.map.url}>{mn ? "Газрын зураг" : "Directions"}<Icon name="arrowUpRight" size={17} /></a>}
          </div>
        </div>
      </div>
    </section>;
}
