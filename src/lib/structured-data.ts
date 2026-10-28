import { company, contact, getBrands, getLocations, sainLogos, socials } from "@/content";
import type { Locale } from "./i18n";
import { absoluteUrl } from "./site";

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export function organizationGraph() {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": absoluteUrl("/#organization"), name: company.name, legalName: company.legalName.value.en,
      url: absoluteUrl("/"), logo: absoluteUrl(sainLogos["sain-color"].src), telephone: contact.phone.href.slice(4), email: contact.email,
      sameAs: socials.map(social => social.url), areaServed: { "@type": "Country", name: "Mongolia" },
      brand: getBrands().map(brand => ({ "@type": "Brand", name: brand.name })),
    },
    { "@type": "WebSite", "@id": absoluteUrl("/#website"), url: absoluteUrl("/"), name: company.name, inLanguage: ["mn", "en"], publisher: { "@id": absoluteUrl("/#organization") } },
  ] };
}

export function locationGraph(locale: Locale) {
  return { "@context": "https://schema.org", "@type": "ItemList", itemListElement: getLocations().map((location, index) => ({
    "@type": "ListItem", position: index + 1,
    item: { "@type": location.kind === "service" ? "AutoRepair" : "AutoDealer", "@id": absoluteUrl(`/${locale}/locations/#${location.id}`),
      name: location.name[locale], url: absoluteUrl(`/${locale}/locations/#${location.id}`),
      address: { "@type": "PostalAddress", streetAddress: location.address[locale], addressLocality: location.city[locale], addressCountry: "MN" },
      ...(location.phone ? { telephone: location.phone.href.slice(4) } : {}), hasMap: location.map.url,
      parentOrganization: { "@id": absoluteUrl("/#organization") },
    },
  })) };
}

export function breadcrumbGraph(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })) };
}
