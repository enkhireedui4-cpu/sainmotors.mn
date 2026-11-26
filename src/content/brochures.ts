import { bydModels } from "./byd";
import documents from "./generated/brochure-documents.json";
import galleries from "./generated/brochure-galleries.json";
import photographs from "./generated/brochure-vehicles.json";
import { officialBrandSite } from "@/lib/brand-sites";
import type { Locale, Localized } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

export type CatalogPhoto = {
  src: string;
  width: number;
  height: number;
  layout: "cutout" | "photo";
  view?: "front-left";
};

export type CatalogModel = {
  id: string;
  brand: string;
  name: string;
  trim?: string;
  details?: string;
  officialModel?: string;
  overview?: Localized;
};

// The QR catalogue supplies the named trims. The lineup supplements it with
// models listed in our brand records, brand sites and supplied brochures.
export const catalogModels: readonly CatalogModel[] = [
  {
    id: "chery-tiggo-4", brand: "chery", name: "TIGGO 4", trim: "Luxury", officialModel: "tiggo-4",
    overview: { mn: "1.5L CVT болон 1.5T 6DCT хөдөлгүүр, хурдны хайрцгийн сонголттой.", en: "Available in 1.5L CVT and 1.5T 6DCT engine and transmission configurations." },
  },
  {
    id: "chery-tiggo-7", brand: "chery", name: "TIGGO 7", trim: "Luxury", officialModel: "tiggo-7",
    overview: { mn: "12.3 инчийн хос дэлгэц, панорам дээвэр, агаар ионжуулагчтай.", en: "Dual 12.3-inch screens, a panoramic roof and a cabin air ioniser." },
  },
  ...bydModels.map(({ id, name, details }) => ({ id: "byd-" + id, brand: "byd", name, details })),
  { id: "jetour-t2", brand: "jetour", name: "T2", trim: "Luxury", officialModel: "t2" },
  { id: "jetour-t1", brand: "jetour", name: "T1", trim: "Comfort", officialModel: "t1" },
  { id: "jetour-x50", brand: "jetour", name: "X50", trim: "Comfort", officialModel: "x50" },
  { id: "jetour-t1-phev", brand: "jetour", name: "T1 PHEV", officialModel: "t1-phev" },
  { id: "jetour-t2-phev", brand: "jetour", name: "T2 PHEV", officialModel: "t2-phev" },
  { id: "jetour-g700", brand: "jetour", name: "G700", officialModel: "g700" },
  { id: "rely-r8", brand: "rely", name: "R8", details: "brands/rely" },
  { id: "soueast-s06", brand: "soueast", name: "S06" },
  { id: "soueast-s07", brand: "soueast", name: "S07" },
  { id: "soueast-s08", brand: "soueast", name: "S08" },
  {
    id: "riddara-rd6-2wd", brand: "riddara", name: "RD6", trim: "2WD",
    overview: { mn: "Бүрэн цахилгаан пикап. Дөлгөөн нуурын шоурумд танилцаж болно.", en: "An all-electric pickup on display at the Dolgoon Nuur showroom." },
  },
  { id: "riddara-rd6-4wd", brand: "riddara", name: "RD6", trim: "4WD" },
  { id: "riddara-rd6-econ", brand: "riddara", name: "RD6", trim: "Econ" },
  { id: "aito-m5", brand: "aito", name: "AITO 5" },
  { id: "aito-m7", brand: "aito", name: "AITO 7" },
  { id: "aito-m9", brand: "aito", name: "AITO 9" },
  { id: "212-standard", brand: "212", name: "212", trim: "Longwind Standard" },
  { id: "212-full", brand: "212", name: "212", trim: "Longwind Full" },
  { id: "212-adventurer", brand: "212", name: "Adventurer" },
  { id: "212-t01-diesel", brand: "212", name: "T01", trim: "Diesel" },
  { id: "212-pickup-diesel", brand: "212", name: "Pickup", trim: "Diesel" },
  {
    id: "212-highland", brand: "212", name: "Highland",
    overview: { mn: "Дөлгөөн нуурын шоурумд танилцуулдаг бартаат замын загвар.", en: "An off-road model on display at the Dolgoon Nuur showroom." },
  },
  { id: "bestune-t77", brand: "bestune", name: "T77", trim: "Luxury" },
  { id: "bestune-t90", brand: "bestune", name: "T90" },
  { id: "bestune-t99", brand: "bestune", name: "T99" },
  { id: "maxus-s80", brand: "maxus", name: "S80" },
  { id: "maxus-s100-28d5", brand: "maxus", name: "S100-28D5" },
  { id: "maxus-s100", brand: "maxus", name: "S100" },
  { id: "maxus-c100", brand: "maxus", name: "C100" },
  { id: "maxus-c300", brand: "maxus", name: "C300" },
];

export const brochureDocuments: Partial<Record<string, string>> = documents;
export const catalogGalleries: Partial<Record<string, readonly { src: string; width: number; height: number }[]>> = galleries;
export const catalogPhotographs: Partial<Record<string, CatalogPhoto>> =
  photographs as Record<string, CatalogPhoto>;

export function catalogVehiclePhoto(id: string) {
  const photo = catalogPhotographs[id];
  return photo?.view === "front-left" && photo.layout === "cutout" ? photo : undefined;
}

export const brochurePath = (id: string) => "brochures/" + id;
export const catalogModelPath = (id: string) => "brochures/models/" + id;
export function catalogModelHref(locale: Locale, model: CatalogModel): string | undefined {
  if (model.details) return localePath(locale, model.details);
  const official = model.officialModel && officialBrandSite(model.brand);
  if (!official) return undefined;
  const prefix = model.brand === "chery" && locale === "en" ? "en/" : "";
  return new URL(prefix + "models/" + model.officialModel, official.url).href;
}

export function catalogBrochureHref(locale: Locale, id: string) {
  return brochureDocuments[id] ?? localePath(locale, brochurePath(id));
}
