import { isBrandSiteAvailable } from "@/lib/routes";
import type { MetadataRoute } from "next";
import { getInternalBrands } from "@/content";
import { getNewsArticles } from "@/lib/news";
import { localePath, locales } from "@/lib/i18n";
import { pagePaths } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Every page in both languages, each entry listing its language alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...Object.values(pagePaths), ...getInternalBrands().filter(brand => isBrandSiteAvailable(brand.slug)).map((b) => `brands/${b.slug}`), ...getNewsArticles().map(article => `news/${article.id}`)];
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
