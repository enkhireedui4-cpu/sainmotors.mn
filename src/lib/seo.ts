import type { Metadata } from "next";
import { socialImage } from "@/content";
import { localePath, locales, type Locale } from "./i18n";
import { absoluteUrl } from "./site";

const OG_LOCALE: Record<Locale, string> = { mn: "mn_MN", en: "en_US" };

interface PageMetaInput {
  locale: Locale;
  /** Path below the locale, e.g. "brands/byd". Empty for the home page. */
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of applying the "| Sain Motors" template. */
  absoluteTitle?: boolean;
  image?: { src: string; width: number; height: number; alt: string };
}

/**
 * Self-referencing canonical plus reciprocal hreflang for both languages.
 * English pages canonicalise to English, never to the Mongolian version.
 */
export function pageMetadata({ locale, path, title, description, absoluteTitle, image }: PageMetaInput): Metadata {
  const url = absoluteUrl(localePath(locale, path));
  const languages = Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l, path))]));
  const ogImage = image ?? { ...socialImage, alt: title };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": absoluteUrl(localePath("mn", path)) },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Sain Motors",
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      title,
      description,
      images: [{ url: absoluteUrl(ogImage.src), width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(ogImage.src)] },
  };
}

/**
 * Shortens copy for a search-result description: whole sentences up to
 * `max` characters, otherwise whole words with an ellipsis.
 */
export function excerpt(text: string, max = 160): string {
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [];
  let out = "";
  for (const sentence of sentences) {
    if ((out + sentence).trim().length > max) break;
    out += sentence;
  }
  if (out.trim().length >= 50) return out.trim();
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
