import type { Metadata } from "next";
import { SiteBanner } from "@/components/SiteBanner";
import { SiteInvitation } from "@/components/SiteInvitation";
import { NewsList } from "@/components/NewsList";
import { driveEvents, pages, sitePhotos } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.news.meta.value[locale];
  return pageMetadata({ locale, path: "news", title: meta.title, description: meta.description });
}
export default async function NewsPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  return <div className="news-design-page"><SiteBanner title={pages.news.meta.value[locale].title} lead={pages.news.lead.value[locale]} leadDraft locale={locale} photo={driveEvents.find(event => event.edition === 7)?.film?.poster ?? sitePhotos.hero} /><section className="container news-page"><NewsList events={driveEvents} locale={locale} headingLevel="h2" /></section><SiteInvitation locale={locale} /></div>;
}
