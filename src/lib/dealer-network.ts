import type { Location } from "@/content/types";
import type { LocationCity } from "./locations";
import { getLocationCities } from "./locations";

export type Coordinates = [latitude: number, longitude: number];

// Natural Earth 10m populated places simple. These are city centers, never dealer pins.
// https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_populated_places_simple.geojson
export const networkCityCenters: Record<string, Coordinates | undefined> = {
  ulaanbaatar: [47.918619, 106.914670],
  darkhan: [49.462392, 105.972544],
  erdenet: [49.053297, 104.118337],
};

export interface NetworkCity extends LocationCity {
  coordinates: Coordinates;
  count: number;
}

export interface NetworkMapPoint {
  id: string;
  coordinates: Coordinates;
  precision: "pin" | "city";
  locationIds: Location["id"][];
  city: Location["city"];
}

export function getNetworkCities(locations: readonly Location[]): NetworkCity[] {
  return getLocationCities(locations).flatMap(city => {
    const coordinates = networkCityCenters[city.value];
    return coordinates ? [{ ...city, coordinates, count: locations.filter(location => location.city.en === city.label.en).length }] : [];
  });
}

/** Preserve every record while keeping city areas distinct from verified dealer pins. */
export function getNetworkMapPoints(locations: readonly Location[]): NetworkMapPoint[] {
  const exact = locations.flatMap(location => location.map.precision === "pin" && location.map.coordinates ? [{
    id: location.id,
    coordinates: location.map.coordinates,
    precision: "pin" as const,
    locationIds: [location.id],
    city: location.city,
  }] : []);
  const unresolved = locations.filter(location => !exact.some(point => point.id === location.id));
  const areas = getNetworkCities(unresolved).map(city => ({
    id: `city-${city.value}`,
    coordinates: city.coordinates,
    precision: "city" as const,
    locationIds: unresolved.filter(location => location.city.en === city.label.en).map(location => location.id),
    city: city.label,
  }));
  return [...exact, ...areas];
}
