export const locales = ["mn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "mn";

export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "mn" ? "en" : "mn";
}

/** "/mn/" + "brands/byd" → "/mn/brands/byd/" (trailing slash matches the static export). */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

/**
 * The same page in another language. Every route exists in both languages
 * with identical slugs, so only the locale segment changes. Anything that is
 * not a localized path falls back to the target language's home page.
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  const [first, ...rest] = pathname.split("/").filter(Boolean);
  if (!first || !isLocale(first)) return localePath(to);
  return localePath(to, rest.join("/"));
}

export const localeNames: Localized<{ short: string; full: string }> = {
  mn: { short: "MN", full: "Монгол" },
  en: { short: "EN", full: "English" },
};
