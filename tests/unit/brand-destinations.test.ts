import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandLink } from "@/components/BrandLink";
import sitemap from "@/app/sitemap";
import { getBrands, getInternalBrands } from "@/content";
import { brandHref } from "@/lib/routes";

describe("brand destinations", () => {
  it("keeps eleven choices while exposing Jetour, Chery, BYD and RELY destinations", () => {
    expect(getBrands()).toHaveLength(11);
    expect(getInternalBrands()).toHaveLength(9);
    expect(getInternalBrands().map(b => b.slug)).not.toContain("jetour");
    expect(getInternalBrands().map(b => b.slug)).not.toContain("chery");
    for (const locale of ["mn", "en"] as const) {
      expect(brandHref(locale, "jetour")).toBe("https://jetour.mn/");
      expect(brandHref(locale, "chery")).toBe("https://chery.mn/");
      expect(brandHref(locale, "rely")).toBe(`/${locale}/brands/rely/`);
      expect(brandHref(locale, "byd")).toBe(`/${locale}/brands/byd/`);
      for (const slug of ["soueast", "riddara", "aito", "212", "bestune", "maxus", "hongqi", "unknown"]) {
        expect(brandHref(locale, slug)).toBeUndefined();
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


describe("brand navigation availability", () => {
  it("retains inactive logo styling and content without link or keyboard navigation", () => {
    const html = renderToStaticMarkup(createElement(BrandLink, {
      locale: "en", slug: "soueast", className: "brand-logo", title: "SOUEAST", tabIndex: 0,
    }, "SOUEAST"));
    expect(html).toBe('<a class="brand-logo" title="SOUEAST">SOUEAST</a>');
  });

  it("renders all eleven brand names with four ready destinations in both languages", () => {
    for (const locale of ["mn", "en"] as const) {
      const html = renderToStaticMarkup(createElement("ul", null, getBrands().map(brand => createElement("li", { key: brand.slug }, createElement(BrandLink, { locale, slug: brand.slug }, brand.name)))));
      expect(html.match(/<li>/g)).toHaveLength(11);
      expect(html.match(/ href=/g)).toHaveLength(4);
      expect(html).toContain('href="https://jetour.mn/"');
      expect(html).toContain('href="https://chery.mn/"');
      expect(html).toMatch(new RegExp(`href="/${locale}/brands/rely/?"`));
      expect(html).toMatch(new RegExp(`href="/${locale}/brands/byd/?"`));
    }
  });

  it("lists the BYD and RELY pages and localized BYD model pages in the sitemap", () => {
    const urls = sitemap().map(entry => entry.url).filter(url => url.includes("/brands/") && !url.endsWith("/brands/"));
    expect(urls.map(url => new URL(url).pathname).sort()).toEqual([
      "/en/brands/byd/", "/en/brands/byd/atto-3/", "/en/brands/byd/sealion-6/", "/en/brands/byd/shark-6/", "/en/brands/byd/ti-7/", "/en/brands/rely/",
      "/mn/brands/byd/", "/mn/brands/byd/atto-3/", "/mn/brands/byd/sealion-6/", "/mn/brands/byd/shark-6/", "/mn/brands/byd/ti-7/", "/mn/brands/rely/",
    ]);
  });
});
