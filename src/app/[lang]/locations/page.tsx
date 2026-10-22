import type { Metadata } from "next";
import { LocationDirectory } from "@/components/LocationDirectory";
import { PageHero } from "@/components/PageHero";
import { getBrands, getLocations, pages } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "../../locations.css";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.locations.meta.value[locale];
  return pageMetadata({ locale, path: "locations", title: meta.title, description: meta.description });
}

export default async function LocationsPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const page = pages.locations;
  return (
    <>
      <PageHero title={page.meta.value[locale].title} lead={page.lead.value[locale]} leadDraft={page.lead.status === "draft"} />
      <LocationDirectory locale={locale} locations={getLocations()} brands={getBrands()} />
    </>
  );
}
