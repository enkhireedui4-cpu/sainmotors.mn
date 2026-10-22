/**
 * Public origin used for canonical URLs, hreflang, sitemap and social
 * previews. Set NEXT_PUBLIC_SITE_URL for staging builds so a staging copy
 * never claims to be the production site.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sainmotors.mn").replace(/\/+$/, "");

/**
 * A release build (SITE_RELEASE=1) refuses to render anything that is not
 * approved and hides the review markers. Every other build is a preview:
 * draft content is shown with a visible marker so reviewers can tell it apart.
 */
export const IS_RELEASE = process.env.SITE_RELEASE === "1";

/** Origin alone does not authorize indexing: review builds always say noindex. */
export const IS_PRODUCTION_ORIGIN = SITE_URL === "https://sainmotors.mn";
export const IS_INDEXABLE = IS_RELEASE && IS_PRODUCTION_ORIGIN;

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
