import type { MetadataRoute } from "next";
import { driveEvents, getBrands } from "@/content";
import { localePath, locales } from "@/lib/i18n";
import { pagePaths } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Every page in both languages, each entry listing its language alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...Object.values(pagePaths), ...getBrands().map((b) => `brands/${b.slug}`), ...driveEvents.map(e => `news/${e.id}`)];
  return paths.flatMap((path) => {
    const languages = {
      ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l, path))])),
      "x-default": absoluteUrl(localePath("mn", path)),
    };
    return locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      alternates: { languages },
    }));
  });
}
