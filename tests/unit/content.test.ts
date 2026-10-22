import { describe, expect, it } from "vitest";
import {
  brandsAt,
  collectStatuses,
  company,
  getBrands,
  getLocations,
  getLogo,
  getPhoto,
  hero,
  liveLinks,
  pages,
  services,
  sitePhotos,
  ui,
} from "@/content";
import { releaseProblems } from "@/lib/release";
import { excerpt } from "@/lib/seo";

const filled = (value: { mn: string; en: string }) => value.mn.trim().length > 0 && value.en.trim().length > 0;
const TEL = /^tel:\+976\d{8}$/;

describe("brands", () => {
  const brands = getBrands();

  it("are the eleven brands of the reconciled list, in banner order with HONGQI last", () => {
    expect(brands.map((b) => b.slug)).toEqual([
      "jetour", "soueast", "chery", "byd", "riddara", "aito", "212", "bestune", "rely", "maxus", "hongqi",
    ]);
  });

  it("have unique, URL-safe slugs", () => {
    const slugs = brands.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("have a summary in both languages, and statement and headline in both when present", () => {
    for (const brand of brands) {
      expect(filled(brand.summary.value), brand.slug).toBe(true);
      if (brand.statement) expect(filled(brand.statement.value), brand.slug).toBe(true);
      if (brand.headline) expect(filled(brand.headline.value), brand.slug).toBe(true);
    }
  });

  it("link only to https destinations, and only render the ones verified live", () => {
    for (const brand of brands) {
      for (const link of brand.links) {
        expect(link.url, brand.slug).toMatch(/^https:\/\//);
        expect(link.checked, brand.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
    // chery.mn has no DNS yet: only the brand's Facebook page is shown.
    expect(liveLinks(brands.find((b) => b.slug === "chery")!).map((l) => l.kind)).toEqual(["facebook"]);
  });

  it("send every brand with a Mongolian Facebook page there first, and JETOUR to jetour.mn", () => {
    const first = (slug: string) => liveLinks(brands.find((b) => b.slug === slug)!)[0];
    expect(first("jetour").url).toBe("https://jetour.mn/");
    expect(liveLinks(brands.find((b) => b.slug === "jetour")!).map((l) => l.kind)).toEqual(["website", "facebook"]);
    // International manufacturer sites are not linked: only Mongolian channels.
    for (const brand of brands) {
      for (const link of liveLinks(brand)) {
        if (link.kind === "website") expect(link.url, brand.slug).toMatch(/^https:\/\/[a-z0-9-]+\.mn\//);
      }
    }
    for (const slug of ["soueast", "chery", "byd", "riddara", "aito", "212", "bestune", "rely", "maxus", "hongqi"]) {
      expect(first(slug).kind, slug).toBe("facebook");
      expect(first(slug).url, slug).toMatch(/^https:\/\/www\.facebook\.com\//);
    }
  });

  it("place each brand at an existing showroom with a dialable sales line", () => {
    const ids = getLocations().map((l) => l.id);
    for (const brand of brands) {
      if (brand.location) expect(ids, brand.slug).toContain(brand.location);
      if (brand.phone) expect(brand.phone.href, brand.slug).toMatch(TEL);
    }
  });

  it("place SOUEAST in the JETOUR showroom with the line and models from its brand sheet", () => {
    const soueast = brands.find((b) => b.slug === "soueast")!;
    expect(soueast.location).toBe("jetour-c1");
    expect(soueast.phone?.display).toBe("7277-8855");
    expect(soueast.models).toEqual(["S06", "S07", "S08"]);
    expect(soueast.since).toBe(2026);
    expect(soueast.summary.status).toBe("sourced");
    // The sheet supersedes the Facebook intro's separate showroom entry.
    expect(getLocations().map((l) => l.id)).not.toContain("soueast");
  });

  it("say when official sales began only with a year from the sheets, matching the milestones", () => {
    const fromMilestones = new Map(company.milestones.items.flatMap((m) => m.brands.map((slug) => [slug, m.year])));
    for (const brand of brands) {
      expect(brand.since, brand.slug).toBe(fromMilestones.get(brand.slug));
    }
  });

  it("caption gallery photography with the brand's own name", () => {
    for (const brand of brands) {
      for (const photo of [brand.photo, ...(brand.gallery ?? [])]) {
        if (photo?.caption) expect(photo.caption.startsWith(brand.name), `${brand.slug}: ${photo.caption}`).toBe(true);
      }
    }
  });

  it("tells repeated gallery models apart by camera view in both languages", () => {
    for (const brand of brands) {
      const gallery = brand.gallery ?? [];
      for (const photo of gallery) {
        if (gallery.filter((p) => p.caption === photo.caption).length < 2) continue;
        expect(photo.view !== undefined && filled(photo.view), `${brand.slug}: ${photo.key}`).toBe(true);
      }
      const labels = gallery.map((p) => `${p.caption} ${p.view?.en ?? ""}`);
      expect(new Set(labels).size, brand.slug).toBe(labels.length);
    }
  });

  it("sells CHERY's TIGGO line-up from its own showroom, as Sain Motors' CHERY site states", () => {
    const chery = brands.find((b) => b.slug === "chery")!;
    expect(chery.location).toBe("chery-narny");
    expect(chery.phone?.href).toBe("tel:+97672558855");
    expect(chery.models).toEqual(["TIGGO 2", "TIGGO 4", "TIGGO 7", "TIGGO 8"]);
    expect(chery.statement?.status).toBe("sourced");
  });

  it("uses the eight locally supplied main images on brand pages and homepage cards", () => {
    const expected = { "212": "brand-212", rely: "brand-rely", bestune: "brand-bestune", hongqi: "brand-hongqi", maxus: "brand-maxus", aito: "brand-aito-m9", byd: "brand-byd-atto3", riddara: "brand-riddara-rd6" };
    for (const [slug, key] of Object.entries(expected)) {
      const brand = brands.find((b) => b.slug === slug)!;
      expect(brand.photo?.key, slug).toBe(key);
      expect(brand.cardPhoto, slug).toBeUndefined();
      expect(brand.photo?.note, slug).toMatch(/Desktop (brands6|3brand)/);
    }
    expect(brands.find((b) => b.slug === "byd")!.gallery).toHaveLength(6);
    expect(brands.find((b) => b.slug === "aito")!.gallery).toHaveLength(2);
  });

  it("shows JETOUR with the T2 i-DM photograph the user supplied", () => {
    const jetour = brands.find((b) => b.slug === "jetour")!;
    expect(jetour.photo?.key).toBe("jetour-t2-idm");
    expect(jetour.photo?.caption).toBe("JETOUR T2 i-DM");
    expect(jetour.photo?.note).toMatch(/484076260_/);
  });

  it("extracts white wordmarks from supplied sheets without black presentation panels", () => {
    for (const slug of ["byd", "riddara", "aito"]) {
      const mark = getLogo(slug, true)!;
      expect(mark.width, slug).toBeGreaterThanOrEqual(600);
      expect(mark.width / mark.height, slug).toBeGreaterThan(4);
      expect(mark.density, slug).toBeLessThan(0.7);
      const channels = mark.color.slice(1).match(/../g)!.map((c) => parseInt(c, 16));
      expect(Math.min(...channels), slug).toBeGreaterThan(245);
    }
  });
});

describe("hero", () => {
  it("has a kicker, statement, description and brand action in both languages", () => {
    expect(filled(hero.kicker.value)).toBe(true);
    expect(filled(hero.title.value)).toBe(true);
    expect(filled(hero.text.value)).toBe(true);
    expect(filled(hero.cta.label)).toBe(true);
    expect(hero.cta.href).toBe("brands");
    expect(filled(hero.secondaryCta.label)).toBe(true);
    expect(hero.secondaryCta.href).toBe("locations");
  });

  it("keeps the confirmed eleven-brand fact in the kicker, separate from draft editorial wording", () => {
    expect(hero.kicker.status).toBe("approved");
    expect(company.distributorClaim.status).toBe("approved");
    expect(hero.title.status).toBe("draft");
    expect(hero.text.status).toBe("draft");
    for (const value of Object.values(hero.kicker.value)) expect(value).toContain("11");
    expect(getBrands()).toHaveLength(11);
    expect(hero).not.toHaveProperty("photo");
  });
  it("provides concise bilingual copy for every published brand", () => {
    for (const brand of getBrands()) {
      expect(brand.cardCopy, brand.slug).toBeDefined();
      expect(filled(brand.cardCopy!.value), brand.slug).toBe(true);
      for (const copy of Object.values(brand.cardCopy!.value)) {
        expect(copy.length, brand.slug).toBeLessThanOrEqual(90);
        expect(copy.split("\n"), brand.slug).toHaveLength(2);
      }
    }
  });

  it("every homepage brand has built vehicle photography and a dark-context mark", () => {
    for (const brand of getBrands()) {
      const photo = brand.cardPhoto ?? brand.photo;
      expect(photo, brand.slug).toBeDefined();
      expect(photo!.status, brand.slug).toBe("sourced");
      expect(getPhoto(photo!.key).srcset.length, brand.slug).toBeGreaterThan(0);
      expect(filled(photo!.alt), brand.slug).toBe(true);
      expect(getLogo(brand.slug, true), brand.slug).toBeDefined();
    }
  });
});

describe("locations and services", () => {
  it("use dialable phones, valid emails and https map links where given", () => {
    for (const location of getLocations()) {
      if (location.phone) expect(location.phone.href, location.id).toMatch(TEL);
      if (location.email) expect(location.email, location.id).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
      expect(location.map.url, location.id).toMatch(/^https:\/\/www\.google\.com\/maps\//);
      expect(filled(location.address) && filled(location.name) && filled(location.city), location.id).toBe(true);
    }
  });

  it("every location lists at least one brand, and every listed brand can be called", () => {
    for (const location of getLocations()) {
      const brands = brandsAt(location);
      expect(brands.length, location.id).toBeGreaterThan(0);
      if (!location.phone) for (const brand of brands) expect(brand.phone, `${location.id}/${brand.slug}`).toBeDefined();
    }
  });

  it("services point at existing locations and brands", () => {
    const locationIds = getLocations().map((l) => l.id);
    const brandSlugs = getBrands().map((b) => b.slug);
    for (const service of services) {
      for (const id of service.locations ?? []) expect(locationIds).toContain(id);
      for (const slug of service.brands) expect(brandSlugs).toContain(slug);
    }
  });

  it("claim warranty and after-sales service only for brands whose statements say so", () => {
    const afterSales = services.find((s) => s.id === "after-sales")!;
    for (const slug of ["bestune", "maxus", "soueast"]) expect(afterSales.brands).not.toContain(slug);
    // CHERY: "3 years or 100,000 km" factory warranty, stated on Sain Motors' own CHERY site.
    expect(afterSales.brands).toContain("chery");
    const repair = services.find((s) => s.id === "repair")!;
    expect([...repair.brands].sort()).toEqual(["byd", "jetour"]);
  });
});

describe("copy", () => {
  it("every interface label exists in both languages", () => {
    const walk = (node: unknown, path: string) => {
      if (!node || typeof node !== "object") return;
      const record = node as Record<string, unknown>;
      if ("mn" in record && "en" in record) {
        expect(filled(record as { mn: string; en: string }), path).toBe(true);
        return;
      }
      for (const [key, child] of Object.entries(record)) walk(child, `${path}.${key}`);
    };
    walk(ui, "ui");
  });

  it("page descriptions fit in search results", () => {
    for (const [name, page] of Object.entries(pages)) {
      for (const locale of ["mn", "en"] as const) {
        const { title, description } = page.meta.value[locale];
        expect(title.length, `${name}.${locale} title`).toBeLessThanOrEqual(70);
        expect(description.length, `${name}.${locale} description`).toBeGreaterThanOrEqual(50);
        expect(description.length, `${name}.${locale} description`).toBeLessThanOrEqual(170);
      }
    }
  });

  it("brand descriptions are cut to whole sentences for search results", () => {
    for (const brand of getBrands()) {
      for (const locale of ["mn", "en"] as const) {
        const text = excerpt(brand.summary.value[locale]);
        expect(text.length, `${brand.slug}.${locale}`).toBeLessThanOrEqual(160);
        expect(text.length, `${brand.slug}.${locale}`).toBeGreaterThanOrEqual(50);
      }
    }
  });

  it("section photography is built and described in both languages", () => {
    for (const photo of Object.values(sitePhotos).flat()) {
      expect(getPhoto(photo.key).srcset.length, photo.key).toBeGreaterThan(0);
      expect(filled(photo.alt), photo.key).toBe(true);
    }
  });
});

describe("release gate", () => {
  it("lists every item that is not approved", () => {
    const pending = collectStatuses().filter((s) => s.status !== "approved");
    const problems = releaseProblems();
    for (const item of pending) expect(problems).toContain(`${item.path}: ${item.status}`);
  });

  it("gives SOUEAST its official light-background logo alongside the dark variant", () => {
    expect(getLogo("soueast")?.src).toBe("/media/brand-soueast.png");
    expect(getLogo("soueast", true)?.src).toBe("/media/brand-soueast-on-dark.png");
    expect(releaseProblems()).not.toContain("brands.soueast: logo missing");
  });
});
