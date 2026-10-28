import { getBrands, getLocations } from "@/content";
import { corporateHome } from "@/content/corporate";
import { experienceCopy } from "@/content/experience";
import type { Locale } from "@/lib/i18n";

export function CompanyFacts({ locale }: { locale: Locale }) {
  const showrooms = getLocations().filter(location => location.kind === "showroom");
  const copy = corporateHome.value[locale];
  const facts = [
    { label: experienceCopy.value[locale].brandCount, value: getBrands().length },
    { label: copy.showroom, value: showrooms.length },
    { label: copy.cities, value: new Set(showrooms.map(location => location.city.en)).size },
  ];
  return <dl className="company-facts-grid">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>;
}
