import type { Metadata } from "next";
import "@/app/brands.css";
import { CorporateBrands } from "@/components/CorporateBrands";
import { Breadcrumb } from "@/components/PageHero";
import { getBrands, pages, ui } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
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
    <div className="brand-title"><div className="container">
      <Breadcrumb label={ui.breadcrumb[locale]} items={[{ href: pageHref(locale, "home"), label: "Sain Motors" }]} current={ui.nav.brands[locale]} />
      <div className="brand-title__row"><h1>{page.meta.value[locale].title}</h1><p data-status={page.lead.status === "draft" ? "draft" : undefined}>{page.lead.value[locale]}</p></div>
    </div></div>
    <section className="brand-directory__content" aria-label={ui.brand.portfolio[locale]}><div className="container">
      <CorporateBrands brands={getBrands()} locale={locale} />
    </div></section>
  </div>;
}
