import type { Metadata } from "next";
import { LocationDirectory } from "@/components/LocationDirectory";
import { getBrands, getLocations, pages } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { locationGraph } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import "../../locations.css";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.locations.meta.value[locale];
  return pageMetadata({ locale, path: "locations", title: meta.title, description: meta.description });
}

export default async function LocationsPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  return (
    <>
      <JsonLd data={locationGraph(locale)} />
      <LocationDirectory locale={locale} locations={getLocations()} brands={getBrands()} />
    </>
  );
}
