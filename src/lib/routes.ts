import { localePath, type Locale } from "./i18n";
import { officialBrandSite } from "./brand-sites";

/** Page keys and their path segment; identical in both languages. */
export const pagePaths = {
  home: "",
  about: "about",
  brands: "brands",
  services: "services",
  locations: "locations",
  news: "news",
  contact: "contact",
  privacy: "privacy",
} as const;

export type PageKey = keyof typeof pagePaths;

/** The main menu offers both brand discovery and showroom locations. */
export const headerPages = ["about", "brands", "locations", "services", "news", "contact"] as const satisfies readonly PageKey[];
export const footerPages = ["about", "locations", "contact"] as const satisfies readonly PageKey[];

export function pageHref(locale: Locale, page: PageKey): string {
  return localePath(locale, pagePaths[page]);
}

/** Only these brands have a public destination ready for visitors. */
export function isBrandSiteAvailable(slug: string): boolean {
  return slug === "rely" || slug === "byd" || Boolean(officialBrandSite(slug));
}

export function brandHref(locale: Locale, slug: string): string | undefined {
  if (!isBrandSiteAvailable(slug)) return undefined;
  return officialBrandSite(slug)?.url ?? localePath(locale, `brands/${slug}`);
}

export function newsHref(locale: Locale, slug: string): string {
  return localePath(locale, `news/${slug}`);
}

/** Resolves a content link: a page key ("brands") or an absolute URL. */
export function contentHref(locale: Locale, href: string): string {
  if (/^https?:\/\//.test(href) || href.startsWith("#")) return href;
  if (href in pagePaths) return pageHref(locale, href as PageKey);
  return localePath(locale, href);
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** Display form of a URL: "https://jetour.mn/" → "jetour.mn". */
export function displayHost(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}
