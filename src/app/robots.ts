import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** Only an approved release built for the genuine production origin is indexable. */
export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
