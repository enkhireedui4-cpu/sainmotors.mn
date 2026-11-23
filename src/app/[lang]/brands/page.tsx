import type { Metadata } from "next";
import "@/app/brands.css";
import { BrandPortfolio } from "@/components/BrandPortfolio";
import { pages, ui } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ lang: string }> };

const titles = {
  mn: "Манай брэндүүд",
  en: "Our brands",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.brands.meta.value[locale];
  return pageMetadata({ locale, path: "brands", title: meta.title, description: meta.description });
}
export default async function BrandsPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  return (
    <div className="brand-directory">
      <header className="brand-directory__hero">
        <div className="container">
          <h1>{titles[locale]}</h1>
        </div>
      </header>
      <section className="brand-directory__content" aria-label={ui.brand.portfolio[locale]}>
        <div className="container">
          <BrandPortfolio locale={locale} />
        </div>
      </section>
    </div>
  );
}
