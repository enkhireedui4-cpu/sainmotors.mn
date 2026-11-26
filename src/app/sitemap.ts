import { isBrandSiteAvailable } from "@/lib/routes";
import type { MetadataRoute } from "next";
import { getInternalBrands } from "@/content";
import { catalogGalleries, catalogModelPath, catalogModels } from "@/content/brochures";
import { sealionPath } from "@/content/byd";
import { bydProfilePath, bydProfiles } from "@/content/byd-profiles";
import { getNewsArticles } from "@/lib/news";
import { localePath, locales } from "@/lib/i18n";
import { pagePaths } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Every page in both languages, each entry listing its language alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.values(pagePaths),
    ...catalogModels.filter(({ id }) => catalogGalleries[id]?.length).map(model => catalogModelPath(model.id)),
    ...getInternalBrands().filter(brand => isBrandSiteAvailable(brand.slug)).map(brand => `brands/${brand.slug}`),
    sealionPath,
    ...bydProfiles.map(profile => bydProfilePath(profile.id)),
    ...getNewsArticles().map(article => `news/${article.id}`),
  ];
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
