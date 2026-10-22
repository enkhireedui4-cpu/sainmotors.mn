import { getBrands, getLocation, services, ui } from "@/content";
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
              <dd translate="no">{coverage(service, locale)}</dd>
            </div>
            <div>
              <dt>{ui.services.where[locale]}</dt>
              <dd>{where(service, locale)}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

