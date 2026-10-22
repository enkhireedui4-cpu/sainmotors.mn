import type { Brand, Location } from "@/content/types";
import type { Localized } from "./i18n";

export interface LocationFilters {
  brand: string;
  city: string;
}

export interface LocationCity {
  value: string;
  label: Localized;
}

/** English names give both language routes the same shareable city key. */
function cityValue(location: Location): string {
  return location.city.en.trim().toLowerCase().replace(/\s+/g, "-");
}

export function getLocationCities(locations: readonly Location[]): LocationCity[] {
  const cities = new Map<string, LocationCity>();
  for (const location of locations) {
    const value = cityValue(location);
    if (!cities.has(value)) cities.set(value, { value, label: location.city });
  }
  return [...cities.values()];
}

export function getLocationBrands(location: Location, brands: readonly Brand[]): Brand[] {
  return brands.filter((brand) => brand.published && (
    brand.location === location.id || location.serviceBrands?.includes(brand.slug)
  ));
}

export function filterLocations(locations: readonly Location[], brands: readonly Brand[], filters: LocationFilters): Location[] {
  return locations.filter((location) => (
    (!filters.city || cityValue(location) === filters.city) &&
    (!filters.brand || getLocationBrands(location, brands).some((brand) => brand.slug === filters.brand))
  ));
}

export function readLocationFilters(search: string, locations: readonly Location[], brands: readonly Brand[]): LocationFilters {
  const params = new URLSearchParams(search);
  const brand = params.get("brand") ?? "";
  const city = params.get("city") ?? "";
  return {
    brand: brands.some((item) => item.published && item.slug === brand) ? brand : "",
    city: getLocationCities(locations).some((item) => item.value === city) ? city : "",
  };
}

/** Keep unrelated preview/referral parameters intact when changing filters. */
export function updateLocationQuery(search: string, filters: LocationFilters): string {
  const params = new URLSearchParams(search);
  for (const key of ["brand", "city"] as const) {
    if (filters[key]) params.set(key, filters[key]);
    else params.delete(key);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
