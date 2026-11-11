import type { Locale } from "./i18n";

/** Brands whose model information is maintained on their own Mongolian sites. */
const officialSites: Record<string, { name: string; url: string } | undefined> = {
  jetour: { name: "Jetour", url: "https://jetour.mn/" },
  chery: { name: "Chery", url: "https://chery.mn/" },
};

export const officialBrandSite = (slug: string) => officialSites[slug];

export function brandLinkLabel(locale: Locale, slug: string): string {
  const site = officialBrandSite(slug);
  if (site) return locale === "mn" ? `${site.name}-ийн сайт руу` : `Visit ${site.name} website`;
  return locale === "mn" ? "Брэндтэй танилцах" : "Explore the brand";
}
