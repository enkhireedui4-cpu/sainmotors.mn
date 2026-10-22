import Link from "next/link";
import { brandPhone, brandsAt, ui } from "@/content";
import type { Location } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { brandHref } from "@/lib/routes";
import { Icon } from "./Icon";

interface LocationCardProps {
  location: Location;
  locale: Locale;
  headingLevel?: "h2" | "h3";
}

/**
 * One location as a scannable row: where it is, which brands are there and
 * how to reach each, when it is open, and how to get there. Locations with
 * their own line show it once; showrooms without one list each brand's line.
 */
export function LocationCard({ location, locale, headingLevel = "h3" }: LocationCardProps) {
  const Heading = headingLevel;
  const brands = brandsAt(location);
  const mapLabel = location.map.precision === "pin" ? ui.location.directions[locale] : ui.location.viewMap[locale];

  return (
    <article className="location" id={location.id} aria-labelledby={`location-${location.id}-name`}>
      <div className="location__name">
        <Heading id={`location-${location.id}-name`} className="heading-3">
          {location.name[locale]}
        </Heading>
        <p>{location.city[locale]}</p>
      </div>

      <address className="location__address">
        {location.address[locale]}
        {location.landmark && <small>{location.landmark[locale]}</small>}
      </address>

      <div className="location__reach">
        {location.phone ? (
          <>
            {brands.length > 0 && (
              <p className="location__brands">
                <span className="sr-only">{ui.location.brands[locale]}: </span>
                {brands.map((brand, i) => (
                  <span key={brand.slug}>
                    <Link href={brandHref(locale, brand.slug)} translate="no">
                      {brand.name}
                    </Link>
                    {/* The comma closes this item; the flex gap supplies the space after it. */}
                    {i < brands.length - 1 && ","}
                  </span>
                ))}
              </p>
            )}
            <a className="phone-link" href={location.phone.href}>
              <Icon name="phone" size={16} />
              <span className="sr-only">{ui.location.call[locale]}: </span>
              {location.phone.display}
            </a>
            {location.email && (
              <a className="phone-link" href={`mailto:${location.email}`}>
                <Icon name="mail" size={16} />
                {location.email}
              </a>
            )}
          </>
        ) : (
          <dl className="brand-lines">
            {brands.map((brand) => {
              const phone = brandPhone(brand);
              return (
                <div key={brand.slug}>
                  <dt>
                    <Link href={brandHref(locale, brand.slug)} translate="no">
                      {brand.name}
                    </Link>
                  </dt>
                  <dd>
                    <a className="phone-link" href={phone.href}>
                      <Icon name="phone" size={16} />
                      <span className="sr-only">{ui.location.call[locale]}: </span>
                      {phone.display}
                    </a>
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>

      <div className="location__hours">
        {location.hours ? (
          <dl className="hours" aria-label={ui.location.hours[locale]}>
            {location.hours.map((row) => (
              <div key={row.days.en} className="contents">
                <dt>{row.days[locale]}</dt>
                <dd>{row.time[locale]}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="location__note">{ui.location.callForHours[locale]}</p>
        )}
      </div>

      <div className="location__actions">
        <a className="button button--outline button--compact" href={location.map.url} rel="noopener">
          <Icon name="directions" size={18} />
          {mapLabel}
          <span className="sr-only"> {ui.external[locale]}</span>
        </a>
      </div>
    </article>
  );
}
