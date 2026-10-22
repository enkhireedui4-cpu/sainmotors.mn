import { describe, expect, it } from "vitest";
import { getBrands, getLocations } from "@/content";
import {
  filterLocations,
  getLocationBrands,
  getLocationCities,
  readLocationFilters,
  updateLocationQuery,
} from "@/lib/locations";

const brands = getBrands();
const locations = getLocations();

describe("location directory", () => {
  it("matches a brand's showroom and confirmed service centre without inferring other brands", () => {
    expect(filterLocations(locations, brands, { brand: "jetour", city: "" }).map((location) => location.id))
      .toEqual(["jetour-c1", "service-centre"]);
    expect(filterLocations(locations, brands, { brand: "byd", city: "" }).map((location) => location.id))
      .toEqual(["byd-4s"]);
  });

  it("intersects brand and city literally and keeps a valid empty result", () => {
    expect(filterLocations(locations, brands, { brand: "maxus", city: "darkhan" }).map((location) => location.id))
      .toEqual(["darkhan"]);
    expect(filterLocations(locations, brands, { brand: "jetour", city: "darkhan" })).toEqual([]);
    expect(filterLocations(locations, brands, { brand: "", city: "darkhan" }).map((location) => location.id))
      .toEqual(["darkhan"]);
  });

  it("uses language-independent city values with the supplied translated labels", () => {
    expect(getLocationCities(locations)).toEqual([
      { value: "ulaanbaatar", label: { mn: "Улаанбаатар", en: "Ulaanbaatar" } },
      { value: "darkhan", label: { mn: "Дархан", en: "Darkhan" } },
    ]);
  });

  it("restores valid URL state and ignores unknown values instead of hiding all locations", () => {
    expect(readLocationFilters("?city=darkhan&brand=maxus&review", locations, brands))
      .toEqual({ brand: "maxus", city: "darkhan" });
    expect(readLocationFilters("?city=unknown&brand=JETOUR", locations, brands))
      .toEqual({ brand: "", city: "" });
    expect(filterLocations(locations, brands, readLocationFilters("?city=unknown", locations, brands)))
      .toHaveLength(locations.length);
  });

  it("updates only directory query keys and clears them without losing review or referral state", () => {
    expect(updateLocationQuery("?review=1&city=darkhan&brand=maxus&utm_source=partner", { brand: "jetour", city: "ulaanbaatar" }))
      .toBe("?review=1&city=ulaanbaatar&brand=jetour&utm_source=partner");
    expect(updateLocationQuery("?review=1&city=darkhan&brand=maxus", { brand: "", city: "" }))
      .toBe("?review=1");
    expect(updateLocationQuery("?brand=jetour", { brand: "", city: "" })).toBe("");
  });

  it("lists only published brands at a location and does not mutate supplied data", () => {
    const serviceCentre = locations.find((location) => location.id === "service-centre")!;
    const showroom = locations.find((location) => location.id === "sansar")!;
    expect(getLocationBrands(serviceCentre, brands).map((brand) => brand.slug)).toEqual(["jetour"]);
    expect(getLocationBrands(showroom, brands).map((brand) => brand.slug)).toEqual(["aito", "bestune", "hongqi"]);
    expect(getLocationBrands(serviceCentre, brands.map((brand) => ({ ...brand, published: false })))).toEqual([]);
    const before = JSON.stringify(locations);
    filterLocations(locations, brands, { brand: "maxus", city: "darkhan" });
    expect(JSON.stringify(locations)).toBe(before);
  });
});
