import { contact, getBrands, getLocations } from "@/content";
import { resolveBrandContact } from "@/lib/enquiries";
import type { Locale } from "@/lib/i18n";
import { EnquiryChooser } from "./EnquiryChooser";

export function ContactJourney({ locale, embedded = false }: { locale: Locale; embedded?: boolean }) {
  const locations = getLocations();
  const publicRoute = (route: ReturnType<typeof resolveBrandContact>) => ({ phone: route.phone, location: route.location ? {
    id: route.location.id, name: route.location.name, city: route.location.city, address: route.location.address,
    landmark: route.location.landmark, map: route.location.map, hours: route.location.hours,
  } : undefined });
  const options = getBrands().map(brand => ({ slug: brand.slug, name: brand.name,
    sales: publicRoute(resolveBrandContact(brand, "sales", locations)), service: publicRoute(resolveBrandContact(brand, "service", locations)),
  }));
  return <EnquiryChooser locale={locale} options={options} general={contact} embedded={embedded} />;
}
