// The one place pages read content from. Swapping the typed files below for a
// CMS later only changes this module.
import { brands } from "./brands";
import { company, contact, locations, services, socials } from "./company";
import { driveEvents, testDrive } from "./events";
import { hero } from "./hero";
import { homeDiscover, homeExperience, homeServices } from "./home";
import { pages } from "./pages";
import { sitePhotos } from "./photos";
import media from "./generated/media.json";
import type { Brand, BrandLink, Location, Phone, PhotoKey } from "./types";
import { collectContentReview } from "./registry";

export { company, contact, socials, services, hero, homeDiscover, homeExperience, homeServices, pages, sitePhotos, driveEvents, testDrive };
export { ui } from "./ui";
export { collectContentReview, contentRegistry } from "./registry";

export function getBrands(): Brand[] {
  return brands.filter((b) => b.published).sort((a, b) => a.order - b.order);
}

export function getBrand(slug: string): Brand | undefined {
  return getBrands().find((b) => b.slug === slug);
}

export function getLocations(): Location[] {
  return locations;
}

/** Published brands the brand sheets place at this location, plus brands serviced there. */
export function brandsAt(location: Location): Brand[] {
  return getBrands().filter((b) => b.location === location.id || location.serviceBrands?.includes(b.slug));
}

/** The brand's own sales line, or the company line when none was supplied. */
export function brandPhone(brand: Brand): Phone {
  return brand.phone ?? contact.phone;
}

/** Links that were reachable at the last check. */
export function liveLinks(brand: Brand): BrandLink[] {
  return brand.links.filter((l) => l.live);
}

export function getLocation(id: Location["id"]): Location {
  const found = locations.find((l) => l.id === id);
  if (!found) throw new Error(`Unknown location: ${id}`);
  return found;
}

export interface PhotoAsset {
  width: number;
  height: number;
  /** Average colour, shown while the image loads. */
  color: string;
  /** [width, url] pairs, ascending. */
  srcset: [number, string][];
}
export type LogoAsset = { src: string; width: number; height: number; density: number; optical: number; color: string };

export function getPhoto(key: PhotoKey): PhotoAsset {
  return media.photos[key] as PhotoAsset;
}

export function getLogo(slug: string, onDark = false): LogoAsset | undefined {
  if (onDark) {
    const variant = (media.logosOnDark as Record<string, LogoAsset>)[slug];
    if (variant) return variant;
  }
  return (media.logos as Record<string, LogoAsset>)[slug];
}

export const sainLogos = media.sain;
export const socialImage = media.social;

/**
 * Every status-bearing item that ends up on a page, for the release gate and
 * the content checklist. A "status-bearing item" is any object with a
 * `status` field.
 */
export function collectStatuses() {
  return collectContentReview().map(({ path, status }) => ({ path, status }));
}
