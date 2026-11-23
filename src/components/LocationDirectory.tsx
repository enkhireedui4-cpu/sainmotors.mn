"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { Brand, Location } from "@/content/types";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { getNetworkCities } from "@/lib/dealer-network";
import { filterLocations, getLocationCities, readLocationFilters, updateLocationQuery, type LocationFilters } from "@/lib/locations";
import { Icon } from "./Icon";
import { LocationContact } from "./LocationContact";
import { NetworkBrandMark } from "./NetworkBrandMark";
import { NetworkCountryMap } from "./NetworkCountryMap";
import { NetworkStreetMap } from "./NetworkStreetMap";

const labels = {
  title: { mn: "Дилерийн сүлжээ", en: "Dealer network" },
  home: { mn: "Нүүр хуудас", en: "Home page" },
  filter: { mn: "Байршил хайх", en: "Find a location" },
  brand: { mn: "Брэнд", en: "Brand" },
  allBrands: { mn: "Бүх брэнд", en: "All brands" },
  allDealers: { mn: "Бүх салбар", en: "All dealers" },
  city: { mn: "Хот", en: "City" },
  allCities: { mn: "Бүх хот", en: "All cities" },
  clear: { mn: "Шүүлтүүр арилгах", en: "Clear filters" },
  count: { mn: "байршил", en: "locations" },
  emptyTitle: { mn: "Тохирох байршил олдсонгүй", en: "No matching locations" },
  emptyBody: { mn: "Брэнд эсвэл хотыг өөрчлөх, эсвэл шүүлтүүрийг арилгаж бүх байршлыг харна уу.", en: "Change the brand or city, or clear the filters to see all locations." },
  service: { mn: "Үйлчилгээний төв", en: "Service centre" },
  noScript: { mn: "Бүх байршлыг доор харууллаа. Брэнд, хотоор шүүхийн тулд JavaScript-ийг идэвхжүүлнэ үү.", en: "All locations are listed below. Enable JavaScript to filter by brand and city." },
};

const CHANGE_EVENT = "sain:location-filters";
function subscribeToQuery(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("sain:query-change", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("sain:query-change", onChange);
  };
}
const getQuery = () => window.location.search;
const getServerQuery = () => null;

/** URL state coordinates both maps and the directory; SSR retains every contact. */
export function LocationDirectory({ locale, locations, brands }: { locale: Locale; locations: Location[]; brands: Brand[] }) {
  const search = useSyncExternalStore<string | null>(subscribeToQuery, getQuery, getServerQuery);
  const [selectedId, setSelectedId] = useState<Location["id"] | null>(null);
  const filters = readLocationFilters(search ?? "", locations, brands);
  const results = useMemo(() => filterLocations(locations, brands, { brand: filters.brand, city: filters.city }), [locations, brands, filters.brand, filters.city]);
  const overviewCities = getNetworkCities(filterLocations(locations, brands, { brand: filters.brand, city: "" }));
  const cities = getLocationCities(locations);
  const published = brands.filter(brand => brand.published);
  const selected = results.find(location => location.id === selectedId);
  const ready = search !== null;

  function changeFilters(next: LocationFilters) {
    const query = updateLocationQuery(window.location.search, next);
    setSelectedId(null);
    if (query === window.location.search) return;
    window.history.pushState(null, "", `${window.location.pathname}${query}${window.location.hash}`);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  function chooseCity(city: string) {
    changeFilters({ ...filters, city });
    document.getElementById("network-directory")?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  const selectFromMap = useCallback((id: Location["id"]) => {
    setSelectedId(id);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "nearest", behavior: "instant" }));
  }, []);
  function cycleBrand(direction: number) {
    const options = ["", ...published.map(brand => brand.slug)];
    const index = options.indexOf(filters.brand);
    changeFilters({ ...filters, brand: options[(index + direction + options.length) % options.length] });
  }

  return <div className="location-directory" aria-label={ui.nav.locations[locale]} data-ready={ready}>
    <section className="network-hero" aria-labelledby="network-title">
      <div className="network-hero__heading"><nav className="network-breadcrumb" aria-label={locale === "mn" ? "Хуудасны зам" : "Breadcrumb"}><Link href={`/${locale}/`}>{labels.home[locale]}</Link><span aria-hidden="true">/</span></nav><h1 id="network-title">{labels.title[locale]}</h1></div>
      <div className="network-brands" role="group" aria-label={locale === "mn" ? "Брэндээр шүүх" : "Filter by brand"}>
        <button type="button" data-brand="" disabled={!ready} aria-pressed={!filters.brand} aria-controls="location-results" onClick={() => changeFilters({ ...filters, brand: "" })}>{labels.allDealers[locale]}</button>
        {published.map(brand => <button type="button" key={brand.slug} data-brand={brand.slug} disabled={!ready} aria-label={brand.name} title={brand.name} aria-pressed={filters.brand === brand.slug} aria-controls="location-results" onClick={() => changeFilters({ ...filters, brand: brand.slug })}><NetworkBrandMark brand={brand} /></button>)}
      </div>
      <div className="network-overview"><NetworkCountryMap cities={overviewCities} locale={locale} selectedCity={filters.city} onCity={chooseCity} ready={ready} />
        <button type="button" className="network-overview__previous" disabled={!ready} aria-label={locale === "mn" ? "Өмнөх брэнд" : "Previous brand"} onClick={() => cycleBrand(-1)}><Icon name="chevronLeft" /></button>
        <button type="button" className="network-overview__next" disabled={!ready} aria-label={locale === "mn" ? "Дараагийн брэнд" : "Next brand"} onClick={() => cycleBrand(1)}><Icon name="chevronRight" /></button>
      </div>
    </section>
    <section className="network-directory" id="network-directory" aria-label={labels.filter[locale]}>
      <div className="location-directory__sidebar">
        <fieldset className="location-directory__filters" data-brand-active={Boolean(filters.brand)} disabled={!ready} aria-label={labels.filter[locale]}>
          <div className="location-directory__field location-directory__field--brand"><label htmlFor="location-brand">{labels.brand[locale]}</label><select id="location-brand" name="brand" value={filters.brand} aria-controls="location-results" onChange={event => changeFilters({ ...filters, brand: event.target.value })}><option value="">{labels.allBrands[locale]}</option>{published.map(brand => <option key={brand.slug} value={brand.slug}>{brand.name}</option>)}</select></div>
          <div className="location-directory__field location-directory__field--city"><label htmlFor="location-city">{labels.city[locale]}</label><select id="location-city" name="city" value={filters.city} aria-controls="location-results" onChange={event => changeFilters({ ...filters, city: event.target.value })}><option value="">{labels.allCities[locale]}</option>{cities.map(city => <option key={city.value} value={city.value}>{city.label[locale]}</option>)}</select></div>
          <div className="location-directory__filter-end"><p className="location-directory__count" role="status" aria-live="polite" aria-atomic="true"><strong>{results.length}</strong> {labels.count[locale]}</p>{(filters.brand || filters.city) && <button className="location-directory__clear" type="button" onClick={() => changeFilters({ brand: "", city: "" })}>{labels.clear[locale]}</button>}</div>
        </fieldset>
        <noscript><p className="location-directory__no-script">{labels.noScript[locale]}</p></noscript>
        <div id="location-results" className="location-directory__results">
          {results.length === 0 ? <div className="location-directory__empty"><h2>{labels.emptyTitle[locale]}</h2><p>{labels.emptyBody[locale]}</p></div> : results.map(location => {
            const expanded = !ready || selected?.id === location.id;
            return <article className="location-directory__row" id={location.id} key={location.id} aria-labelledby={`directory-${location.id}`} data-status={location.status} data-selected={selected?.id === location.id}>
              <h2 id={`directory-${location.id}`}><button type="button" className="location-directory__toggle" disabled={!ready} aria-expanded={expanded} aria-controls={`contact-${location.id}`} onClick={() => setSelectedId(selected?.id === location.id ? null : location.id)}><span className="location-directory__pin" aria-hidden="true"><Icon name="directions" size={24} /></span><span className="location-directory__identity"><span>{location.name[locale]}</span><small>{location.city[locale]}{location.kind === "service" && ` · ${labels.service[locale]}`}</small></span><span className="location-directory__chevron" aria-hidden="true">⌄</span></button></h2>
              <div className="location-directory__detail" id={`contact-${location.id}`} hidden={!expanded}><LocationContact location={location} brands={brands} locale={locale} /></div>
            </article>;
          })}
        </div>
      </div>
      <NetworkStreetMap locations={results} locale={locale} selectedId={selected?.id ?? null} onSelect={selectFromMap} />
    </section>
  </div>;
}
