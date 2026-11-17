import type { Metadata } from "next";
import "@/app/brands.css";
import { BrandPortfolio } from "@/components/BrandPortfolio";
import { PageBand } from "@/components/PageBand";
import { pages, ui } from "@/content";
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
  return <div className="brand-directory">
    <PageBand locale={locale} title={page.meta.value[locale].title} />
    <section className="brand-directory__content" aria-label={ui.brand.portfolio[locale]}><div className="container">
      <BrandPortfolio locale={locale} />
    </div></section>
  </div>;
}
