import { localePath, type Locale } from "./i18n";

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

export const navPages = ["about", "brands", "services", "locations", "news", "contact"] as const satisfies readonly PageKey[];

export function pageHref(locale: Locale, page: PageKey): string {
  return localePath(locale, pagePaths[page]);
}

export function brandHref(locale: Locale, slug: string): string {
  return localePath(locale, `brands/${slug}`);
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
