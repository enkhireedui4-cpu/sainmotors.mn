import { describe, expect, it } from "vitest";
import { getBrands, getInternalBrands } from "@/content";
import { brandHref } from "@/lib/routes";

describe("brand destinations", () => {
  it("keeps eleven choices and sends Jetour and Chery directly to their own sites in both languages", () => {
    expect(getBrands()).toHaveLength(11);
    expect(getInternalBrands()).toHaveLength(9);
    expect(getInternalBrands().map(b => b.slug)).not.toContain("jetour");
    expect(getInternalBrands().map(b => b.slug)).not.toContain("chery");
    for (const locale of ["mn", "en"] as const) {
      expect(brandHref(locale, "jetour")).toBe("https://jetour.mn/");
      expect(brandHref(locale, "chery")).toBe("https://chery.mn/");
      for (const brand of getBrands().filter(b => !["jetour", "chery"].includes(b.slug))) {
        expect(brandHref(locale, brand.slug)).toBe(`/${locale}/brands/${brand.slug}/`);
      }
    }
  });

  it("retains only listing and shared contact data for the two external brands", () => {
    const external = getBrands().filter(b => ["jetour", "chery"].includes(b.slug));
    expect(external).toHaveLength(2);
    for (const brand of external) {
      expect(brand.kind).toBe("external");
      for (const field of ["summary", "statement", "teaser", "headline", "models", "gallery", "since", "accent", "photo", "cardCopy"]) {
        expect(brand, `${brand.slug}.${field}`).not.toHaveProperty(field);
      }
    }
  });
});
