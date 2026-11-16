import { describe, expect, it } from "vitest";
import { getBrands, getLocations } from "@/content";
import { getNetworkCities, getNetworkMapPoints } from "@/lib/dealer-network";
import { filterLocations } from "@/lib/locations";

const locations = getLocations();
const brands = getBrands();

describe("dealer network geography", () => {
  it("counts locations by city, including the service centre, without inferring brand coverage", () => {
    expect(getNetworkCities(locations).map(city => [city.value, city.count])).toEqual([
      ["ulaanbaatar", 6], ["darkhan", 1], ["erdenet", 1],
    ]);
    const maxus = filterLocations(locations, brands, { brand: "maxus", city: "" });
    expect(getNetworkCities(maxus).map(city => [city.value, city.count])).toEqual([["darkhan", 1]]);
    expect(getNetworkCities([])).toEqual([]);
  });

  it("plots only the four confirmed dealer pins and accounts for all remaining records as city areas", () => {
    const points = getNetworkMapPoints(locations);
    expect(points.filter(point => point.precision === "pin").map(point => point.locationIds[0]).sort())
      .toEqual(["byd-4s", "chery-narny", "jetour-c1", "service-centre"]);
    expect(points.filter(point => point.precision === "city").map(point => point.locationIds))
      .toEqual([["dolgoon-nuur", "sansar"], ["darkhan"], ["erdenet"]]);
    expect(points.flatMap(point => point.locationIds).sort()).toEqual(locations.map(location => location.id).sort());
    const byd = points.find(point => point.id === "byd-4s")!;
    expect(byd.coordinates).toEqual([47.9112692, 106.8434391]);
    expect(getNetworkMapPoints([])).toEqual([]);
  });
});
