import Link from "next/link";
import { getBrands, getLocation, services, ui } from "@/content";
import { experienceCopy } from "@/content/experience";
import { enquiryHref } from "@/lib/enquiries";
import { pageHref } from "@/lib/routes";
import { Icon } from "./Icon";
import type { Service } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { draftAttr } from "@/lib/content-status";
/** Brand coverage in words: "All brands" when it is every published brand. */
function coverage(service: Service, locale: Locale): string {
  const published = getBrands();
  if (published.every((b) => service.brands.includes(b.slug))) return ui.brand.allBrands[locale];
  return published.filter((b) => service.brands.includes(b.slug)).map((b) => b.name).join(", ");
}

function where(service: Service, locale: Locale): string {
  if (!service.locations) return ui.services.atShowroom[locale];
  return service.locations.map((id) => getLocation(id).name[locale]).join(", ");
}

/** Service-page coverage by brand and location. */
export function ServiceList({ locale, headingLevel = "h3" }: { locale: Locale; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="service-list">
      {services.map((service) => (
        <li key={service.id} id={`service-${service.id}`} className="service" data-status={draftAttr(service)}>
          <Heading className="service__title">{service.title[locale]}</Heading>
          <p>{service.body[locale]}</p>
          <dl className="service__facts">
            <div>
              <dt>{ui.services.brands[locale]}</dt>
              <dd className="service__brands" aria-label={coverage(service, locale)}>{getBrands().filter(brand => service.brands.includes(brand.slug)).map(brand => <Link key={brand.slug} href={enquiryHref(locale, service.id === "sales" ? "sales" : service.id === "financing" ? "finance" : "service", brand.slug)} prefetch={false} translate="no">{brand.name}<Icon name="chevronRight" size={13} /></Link>)}</dd>
            </div>
            <div>
              <dt>{ui.services.where[locale]}</dt>
              <dd>{service.locations ? service.locations.map((id, index) => <span key={id}>{index > 0 && ", "}<Link className="service__place" href={`${pageHref(locale, "locations")}#${id}`} prefetch={false}>{getLocation(id).name[locale]}</Link></span>) : where(service, locale)}</dd>
            </div>
          </dl>
          <Link className="text-link service__action" href={enquiryHref(locale, service.id === "financing" ? "finance" : service.id === "sales" ? "sales" : "service")} prefetch={false}>{service.id === "financing" ? experienceCopy.value[locale].finance : service.id === "sales" ? experienceCopy.value[locale].sales : experienceCopy.value[locale].serviceAction}<Icon name="arrowUpRight" size={18} /></Link>
        </li>
      ))}
    </ul>
  );
}

