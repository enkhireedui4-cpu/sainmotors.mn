import { brands } from "./brands.ts";
import { company, contact, locations, services, socials } from "./company.ts";
import { driveEvents, testDrive } from "./events.ts";
import { hero } from "./hero.ts";
import * as home from "./home.ts";
import { pages } from "./pages.ts";
import { sitePhotos } from "./photos.ts";
import { corporateHome } from "./corporate.ts";
import type { ContentStatus } from "./types";

export interface ContentReviewRecord {
  path: string;
  status: ContentStatus;
  source: string;
  note: string;
  mn: string;
  en: string;
  asset: string;
  owner: string;
  approver: string;
}

/** Shared by the release gate and CSV: no separately maintained review list. */
export const contentRegistry = {
  company, contact: { ...contact, socials }, locations, services, hero, ...home, corporateHome, pages, sitePhotos,
  driveEvents, testDrive,
  brands: brands.filter((brand) => brand.published).sort((a, b) => a.order - b.order).map((brand) => ({
    ...brand,
    status: brand.factsReview?.status ?? "sourced" as ContentStatus,
    source: brand.factsReview?.source ?? brand.statement?.source ?? brand.summary.source ?? "Brand-team sheet; docs/content-sources.md",
  })),
};

const display = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value)) return value.map(display).filter(Boolean).join(" / ");
  return Object.entries(value).map(([key, child]) => `${key}: ${display(child)}`).join("; ");
};

export function collectContentReview(): ContentReviewRecord[] {
  const records: ContentReviewRecord[] = [];
  const walk = (node: unknown, path: string, inheritedSource = "") => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, `${path}[${i}]`, inheritedSource));
      return;
    }
    const item = node as Record<string, unknown>;
    const source = typeof item.source === "string" ? item.source : inheritedSource;
    if (typeof item.status === "string") {
      const localized = (item.value ?? item.alt) as { mn?: unknown; en?: unknown } | undefined;
      const localeText = (locale: "mn" | "en") => localized
        ? display(localized[locale])
        : Object.entries(item)
            .filter(([key, value]) => !["status", "source", "note", "factsReview", "photo", "gallery", "film"].includes(key) && !(value && typeof value === "object" && "status" in value))
            .map(([key, value]) => `${key}: ${display(value && typeof value === "object" && locale in value ? (value as Record<string, unknown>)[locale] : value)}`)
            .join("; ");
      records.push({
        path, status: item.status as ContentStatus,
        source: source || (typeof item.note === "string" ? item.note : "Provenance: docs/content-sources.md; exact source needs review"),
        note: [typeof item.note === "string" ? item.note : "", "map" in item && !item.hours ? "Opening hours unconfirmed: call before visiting" : "", item.map && typeof item.map === "object" && "precision" in item.map && item.map.precision === "search" ? "Map is a landmark search; verified pin still needed" : ""].filter(Boolean).join("; "),
        mn: localeText("mn"), en: localeText("en"),
        asset: typeof item.key === "string" ? item.key : "",
        owner: "", approver: "",
      });
    }
    for (const [key, value] of Object.entries(item)) {
      // factsReview controls the parent brand record, not a second visible item.
      if (key !== "factsReview") walk(value, path ? `${path}.${key}` : key, source);
    }
  };
  walk(contentRegistry, "");
  return records;
}

