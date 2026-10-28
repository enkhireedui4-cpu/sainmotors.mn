import type { Metadata } from "next";
import "@/app/brands.css";
import { BrandPortfolio } from "@/components/BrandPortfolio";
import { experienceCopy } from "@/content/experience";
import { SiteBanner } from "@/components/SiteBanner";
import { SiteInvitation } from "@/components/SiteInvitation";
import { pages, sitePhotos, ui } from "@/content";
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
    <SiteBanner title={page.meta.value[locale].title} lead={experienceCopy.value[locale].portfolioLead} leadDraft locale={locale} photo={sitePhotos.showroomTour.find(photo => photo.key === "showroom-interior") ?? sitePhotos.hero} />
    <section className="brand-directory__content" aria-label={ui.brand.portfolio[locale]}><div className="container">
      <BrandPortfolio locale={locale} />
    </div></section>
    <SiteInvitation locale={locale} />
  </div>;
}
