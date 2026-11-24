import { contact, getBrands, getLocations } from "@/content";
import { resolveBrandContact } from "@/lib/enquiries";
import type { Locale } from "@/lib/i18n";
import { EnquiryContact } from "./EnquiryContact";

export function ContactJourney({ locale }: { locale: Locale }) {
  const locations = getLocations();
  const publicRoute = ({ phone, location }: ReturnType<typeof resolveBrandContact>) => ({
    phone, location: location ? { name: location.name, map: { url: location.map.url } } : undefined,
  });
  const options = getBrands().map(brand => ({
    slug: brand.slug,
    name: brand.name,
    sales: publicRoute(resolveBrandContact(brand, "sales", locations)),
    service: publicRoute(resolveBrandContact(brand, "service", locations)),
  }));
  return <EnquiryContact locale={locale} options={options} general={contact} />;
}
