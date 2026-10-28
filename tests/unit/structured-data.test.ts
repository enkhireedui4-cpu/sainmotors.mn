import { describe, expect, it } from "vitest";
import { serializeJsonLd, organizationGraph, locationGraph } from "@/lib/structured-data";
import { matchesBrand } from "@/lib/brand-discovery";
import { getLocations } from "@/content";

describe("structured data", () => {
  it("escapes HTML-sensitive input without changing the parsed data", () => {
    const source = { name: '</script><script>alert("x")</script>' };
    const json = serializeJsonLd(source);
    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual(source);
  });
  it("uses the actual organization and complete bilingual website without commercial inventions", () => {
    const graph = organizationGraph();
    expect(graph["@graph"][0]).toMatchObject({ "@type": "Organization", name: "Sain Motors", telephone: "+97670108855" });
    expect(graph["@graph"][1]).toMatchObject({ "@type": "WebSite", inLanguage: ["mn", "en"] });
    expect(JSON.stringify(graph)).not.toMatch(/aggregateRating|priceRange|foundingDate|Offer/);
  });
  it("describes locations with supplied maps, never inferred coordinates or hours", () => {
    const graph = locationGraph("en");
    expect(graph.itemListElement).toHaveLength(getLocations().length);
    const byd = graph.itemListElement.find(item => item.item.name === "BYD 4S showroom")!;
    expect(byd.item.hasMap).toBe("https://maps.app.goo.gl/BkpbhfBnyKxKoxyM8");
    expect(byd.item).not.toHaveProperty("geo");
    expect(byd.item).not.toHaveProperty("openingHours");
  });
});

describe("brand discovery", () => {
  const brand = { slug: "soueast", search: "SOUEAST Хотын SUV S06 S07 S08", categories: ["city"] };
  it("matches case-insensitive multiword queries and intersects the category", () => {
    expect(matchesBrand(brand, "city", "  soueast  S08 ")).toBe(true);
    expect(matchesBrand(brand, "city", "ХОТЫН")).toBe(true);
    expect(matchesBrand(brand, "pickup", "S08")).toBe(false);
    expect(matchesBrand(brand, "", "S09")).toBe(false);
    expect(matchesBrand(brand, "", "")).toBe(true);
  });
});
