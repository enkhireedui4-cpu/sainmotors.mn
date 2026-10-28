import type { Brand, Location, Phone } from "@/content/types";
import type { Locale } from "./i18n";

export const enquiryIntents = ["sales", "test-drive", "finance", "service", "parts", "partnership", "careers", "media"] as const;
export type EnquiryIntent = typeof enquiryIntents[number];
export interface EnquirySelection { intent: EnquiryIntent; brand: string }

export function enquiryHref(locale: Locale, intent: EnquiryIntent, brand?: string): string {
  const query = new URLSearchParams({ intent });
  if (brand) query.set("brand", brand);
  return `/${locale}/contact/?${query}#enquiry-heading`;
}

export function readEnquirySelection(search: string, brands: readonly string[]): EnquirySelection {
  const query = new URLSearchParams(search);
  const intent = query.get("intent");
  const brand = query.get("brand") ?? "";
  return {
    intent: enquiryIntents.includes(intent as EnquiryIntent) ? intent as EnquiryIntent : "sales",
    brand: brands.includes(brand) ? brand : "",
  };
}

/** A shared showroom never establishes a shared workshop. */
export function resolveBrandContact(brand: Brand, intent: EnquiryIntent, locations: readonly Location[]): { phone: Phone; location?: Location } {
  const isService = intent === "service" || intent === "parts";
  const location = isService
    ? locations.find(place => place.serviceBrands?.includes(brand.slug))
    : locations.find(place => place.id === brand.location);
  return { phone: location?.phone && isService ? location.phone : brand.phone ?? { display: "7010-8855", href: "tel:+97670108855" }, location };
}
