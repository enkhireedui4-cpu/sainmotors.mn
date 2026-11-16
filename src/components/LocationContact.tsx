import Link from "next/link";
import { contact } from "@/content/company";
import type { Brand, Location } from "@/content/types";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { getLocationBrands } from "@/lib/locations";
import { brandHref } from "@/lib/routes";
import { Icon } from "./Icon";

/** Sourced contact details stay in the static HTML, including when the map is unavailable. */
export function LocationContact({ location, brands, locale }: { location: Location; brands: Brand[]; locale: Locale }) {
  const locationBrands = getLocationBrands(location, brands);
  const mapLabel = location.map.precision === "pin" ? ui.location.directions[locale] : locale === "mn" ? "Газрын зургаас хайх" : "Search map";
  return (
    <>
      <address>{location.address[locale]}{location.landmark && <small>{location.landmark[locale]}</small>}</address>
      <div className="location-directory__contacts">
        {location.phone ? (
          <>
            <div className="location-directory__brand-links">{locationBrands.map(brand => <Link key={brand.slug} href={brandHref(locale, brand.slug)} translate="no">{brand.name}</Link>)}</div>
            <a className="location-directory__phone" href={location.phone.href}><Icon name="phone" size={17} /><span className="sr-only">{ui.location.call[locale]}: </span>{location.phone.display}</a>
          </>
        ) : (
          <dl className="location-directory__brand-lines">{locationBrands.map(brand => {
            const phone = brand.phone ?? contact.phone;
            return <div key={brand.slug}><dt><Link href={brandHref(locale, brand.slug)} translate="no">{brand.name}</Link></dt><dd><a className="location-directory__phone" href={phone.href}><span className="sr-only">{ui.location.call[locale]}: </span>{phone.display}</a></dd></div>;
          })}</dl>
        )}
        {!location.phone && locationBrands.length === 0 && <a className="location-directory__phone" href={contact.phone.href}><Icon name="phone" size={17} /><span className="sr-only">{ui.location.call[locale]}: </span>{contact.phone.display}</a>}
        {location.email && <a className="location-directory__email" href={`mailto:${location.email}`}>{location.email}</a>}
      </div>
      <div className="location-directory__hours">
        {location.hours?.length ? <dl aria-label={ui.location.hours[locale]}>{location.hours.map(row => <div key={row.days.en}><dt>{row.days[locale]}</dt><dd>{row.time[locale]}</dd></div>)}</dl> : <p>{ui.location.callForHours[locale]}</p>}
      </div>
      <a className="location-directory__map" href={location.map.url} rel="noopener"><Icon name="directions" size={18} />{mapLabel}<span className="sr-only"> {ui.external[locale]}</span><Icon name="arrowUpRight" size={16} /></a>
    </>
  );
}
