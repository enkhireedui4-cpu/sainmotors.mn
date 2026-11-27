import Link from "next/link";
import { getBrands, getLocation, services, ui } from "@/content";
import { enquiryHref } from "@/lib/enquiries";
import { pageHref } from "@/lib/routes";
import { Icon } from "./Icon";
import type { Locale } from "@/lib/i18n";
import { draftAttr } from "@/lib/content-status";

const actions = {
  sales: { intent: "sales", label: ui.services.salesAction },
  financing: { intent: "finance", label: ui.services.financeAction },
  "after-sales": { intent: "service", label: ui.services.warrantyAction },
  repair: { intent: "service", label: ui.services.serviceAction },
} as const;

/** Service-page coverage by brand and location. */
export function ServiceList({ locale, headingLevel = "h3" }: { locale: Locale; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const brands = getBrands();
  return (
    <ul className="service-list">
      {services.map((service) => {
        const { intent, label } = actions[service.id];
        const actionHref = service.id === "sales" ? pageHref(locale, "brochures") : enquiryHref(locale, intent);
        return (
          <li key={service.id} id={`service-${service.id}`} className="service" data-status={draftAttr(service)}>
            <Heading className="service__title">{service.title[locale]}</Heading>
            <div className="service__detail">
              <p>{service.body[locale]}</p>
              <Link className="text-link service__action" href={actionHref} prefetch={false}>
                {label[locale]}<Icon name="chevronRight" size={18} />
              </Link>
              <dl className="service__facts">
                <div>
                  <dt>{ui.services.brands[locale]}</dt>
                  <dd className="service__brands">
                    {brands.filter(brand => service.brands.includes(brand.slug)).map(brand => (
                      <Link key={brand.slug} href={enquiryHref(locale, intent, brand.slug)} prefetch={false} translate="no">
                        {brand.name}<Icon name="chevronRight" size={13} />
                      </Link>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt>{ui.services.where[locale]}</dt>
                  <dd>{service.locations ? service.locations.map((id, index) => (
                    <span key={id}>
                      {index > 0 && ", "}
                      <Link className="service__place" href={`${pageHref(locale, "locations")}#${id}`} prefetch={false}>
                        {getLocation(id).name[locale]}
                      </Link>
                    </span>
                  )) : ui.services.atShowroom[locale]}</dd>
                </div>
              </dl>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

