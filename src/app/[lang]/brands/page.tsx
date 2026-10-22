import type { Metadata } from "next";
import { CorporateBrands } from "@/components/CorporateBrands";
import { PageHero } from "@/components/PageHero";
import { getBrands, pages } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.brands.meta.value[locale];
  return pageMetadata({ locale, path: "brands", title: meta.title, description: meta.description });
}
export default async function BrandsPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const page = pages.brands;
  return <><PageHero title={page.meta.value[locale].title} lead={page.lead.value[locale]} leadDraft={page.lead.status === "draft"} /><section className="brands-page brand-band"><div className="container"><div className="brand-panel-frame"><CorporateBrands brands={getBrands()} locale={locale} comingSoon /></div></div></section></>;
}
