"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { contact } from "@/content/company";
import type { Brand, Location } from "@/content/types";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import {
  filterLocations,
  getLocationBrands,
  getLocationCities,
  readLocationFilters,
  updateLocationQuery,
  type LocationFilters,
} from "@/lib/locations";
import { brandHref } from "@/lib/routes";
import { Icon } from "./Icon";

const labels = {
  filter: { mn: "Байршил хайх", en: "Find a location" },
  brand: { mn: "Брэнд", en: "Brand" },
  allBrands: { mn: "Бүх брэнд", en: "All brands" },
  city: { mn: "Хот", en: "City" },
  allCities: { mn: "Бүх хот", en: "All cities" },
  clear: { mn: "Шүүлтүүр арилгах", en: "Clear filters" },
  results: { mn: "Байршлууд", en: "Locations" },
  count: { mn: "байршил", en: "locations" },
  emptyTitle: { mn: "Тохирох байршил олдсонгүй", en: "No matching locations" },
  emptyBody: { mn: "Брэнд эсвэл хотыг өөрчлөх, эсвэл шүүлтүүрийг арилгаж бүх байршлыг харна уу.", en: "Change the brand or city, or clear the filters to see all locations." },
  searchMap: { mn: "Газрын зургаас хайх", en: "Search map" },
  showroom: { mn: "Шоурум", en: "Showroom" },
  service: { mn: "Үйлчилгээний төв", en: "Service centre" },
  noScript: { mn: "Бүх байршлыг доор харууллаа. Брэнд, хотоор шүүхийн тулд JavaScript-ийг идэвхжүүлнэ үү.", en: "All locations are listed below. Enable JavaScript to filter by brand and city." },
};

const CHANGE_EVENT = "sain:location-filters";

function subscribeToQuery(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getQuery = () => window.location.search;
const getServerQuery = () => null;

interface LocationDirectoryProps {
  locale: Locale;
  locations: Location[];
  brands: Brand[];
}

/** Static HTML contains every row; the URL becomes the filter state after hydration. */
export function LocationDirectory({ locale, locations, brands }: LocationDirectoryProps) {
  const search = useSyncExternalStore<string | null>(subscribeToQuery, getQuery, getServerQuery);
  const filters = readLocationFilters(search ?? "", locations, brands);
  const results = filterLocations(locations, brands, filters);
  const cities = getLocationCities(locations);
  const hasFilters = Boolean(filters.brand || filters.city);

  function changeFilters(next: LocationFilters) {
    const query = updateLocationQuery(window.location.search, next);
    if (query === window.location.search) return;
    window.history.pushState(null, "", `${window.location.pathname}${query}${window.location.hash}`);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <section className="container location-directory" aria-label={labels.results[locale]} data-ready={search !== null}>
      <fieldset className="location-directory__filters" disabled={search === null} aria-label={labels.filter[locale]}>
        <div className="location-directory__field">
          <label htmlFor="location-brand">{labels.brand[locale]}</label>
          <select id="location-brand" name="brand" value={filters.brand} aria-controls="location-results" onChange={(event) => changeFilters({ ...filters, brand: event.target.value })}>
            <option value="">{labels.allBrands[locale]}</option>
            {brands.filter((brand) => brand.published).map((brand) => <option key={brand.slug} value={brand.slug}>{brand.name}</option>)}
          </select>
        </div>
        <div className="location-directory__field">
          <label htmlFor="location-city">{labels.city[locale]}</label>
          <select id="location-city" name="city" value={filters.city} aria-controls="location-results" onChange={(event) => changeFilters({ ...filters, city: event.target.value })}>
            <option value="">{labels.allCities[locale]}</option>
            {cities.map((city) => <option key={city.value} value={city.value}>{city.label[locale]}</option>)}
          </select>
        </div>
        <div className="location-directory__filter-end">
          <p className="location-directory__count" role="status" aria-live="polite" aria-atomic="true">
            <strong>{results.length}</strong> {labels.count[locale]}
          </p>
          {hasFilters && <button className="location-directory__clear" type="button" onClick={() => changeFilters({ brand: "", city: "" })}>{labels.clear[locale]}</button>}
        </div>
      </fieldset>

      <noscript><p className="location-directory__no-script">{labels.noScript[locale]}</p></noscript>

      <div id="location-results" className="location-directory__results">
        {results.length === 0 ? (
          <div className="location-directory__empty">
            <h2>{labels.emptyTitle[locale]}</h2>
            <p>{labels.emptyBody[locale]}</p>
          </div>
        ) : results.map((location) => {
          const locationBrands = getLocationBrands(location, brands);
          const mapLabel = location.map.precision === "pin" ? ui.location.directions[locale] : labels.searchMap[locale];
          return (
            <article className="location-directory__row" id={location.id} key={location.id} aria-labelledby={`directory-${location.id}`} data-status={location.status}>
              <div className="location-directory__place">
                <p className="location-directory__city">{location.city[locale]} <span aria-hidden="true">/</span> {labels[location.kind][locale]}</p>
                <h2 id={`directory-${location.id}`}>{location.name[locale]}</h2>
                <address>{location.address[locale]}{location.landmark && <small>{location.landmark[locale]}</small>}</address>
              </div>

              <div className="location-directory__contacts">
                {location.phone ? (
                  <>
                    <div className="location-directory__brand-links">
                      {locationBrands.map((brand) => <Link key={brand.slug} href={brandHref(locale, brand.slug)} translate="no">{brand.name}</Link>)}
                    </div>
                    <a className="location-directory__phone" href={location.phone.href}><Icon name="phone" size={17} /><span className="sr-only">{ui.location.call[locale]}: </span>{location.phone.display}</a>
                  </>
                ) : (
                  <dl className="location-directory__brand-lines">
                    {locationBrands.map((brand) => {
                      const phone = brand.phone ?? contact.phone;
                      return <div key={brand.slug}><dt><Link href={brandHref(locale, brand.slug)} translate="no">{brand.name}</Link></dt><dd><a className="location-directory__phone" href={phone.href}><span className="sr-only">{ui.location.call[locale]}: </span>{phone.display}</a></dd></div>;
                    })}
                  </dl>
                )}
                {!location.phone && locationBrands.length === 0 && <a className="location-directory__phone" href={contact.phone.href}><Icon name="phone" size={17} /><span className="sr-only">{ui.location.call[locale]}: </span>{contact.phone.display}</a>}
                {location.email && <a className="location-directory__email" href={`mailto:${location.email}`}>{location.email}</a>}
              </div>

              <div className="location-directory__visit">
                <div className="location-directory__hours">
                  {location.hours?.length ? (
                    <dl aria-label={ui.location.hours[locale]}>{location.hours.map((row) => <div key={row.days.en}><dt>{row.days[locale]}</dt><dd>{row.time[locale]}</dd></div>)}</dl>
                  ) : <p>{ui.location.callForHours[locale]}</p>}
                </div>
                <a className="location-directory__map" href={location.map.url} rel="noopener"><Icon name="directions" size={18} />{mapLabel}<span className="sr-only"> {ui.external[locale]}</span></a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
