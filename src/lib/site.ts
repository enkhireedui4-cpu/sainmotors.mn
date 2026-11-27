/**
 * Public origin used for canonical URLs, hreflang, sitemap and social
 * previews. Set NEXT_PUBLIC_SITE_URL for staging builds so a staging copy
 * never claims to be the production site.
 */
const PRODUCTION_HOST = "sainmotors.mn";
const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_ORIGIN).replace(/\/+$/, "");

/**
 * The standalone release build (SITE_RELEASE=1) enforces content approval
 * and disables the optional review overlay.
 */
export const IS_RELEASE = process.env.SITE_RELEASE === "1";

export const IS_PRODUCTION_ORIGIN = SITE_URL === PRODUCTION_ORIGIN;

// Vercel previews can share the live canonical origin. Check the deployment
// environment and the project's production domain before opening crawling.
const vercelEnvironment = process.env.VERCEL_ENV;
const isHostedProduction = vercelEnvironment === "production"
  && process.env.VERCEL_PROJECT_PRODUCTION_URL === PRODUCTION_HOST;
export const IS_INDEXABLE = IS_PRODUCTION_ORIGIN
  && (vercelEnvironment ? isHostedProduction : IS_RELEASE);

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
