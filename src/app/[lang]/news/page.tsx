import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { NewsList } from "@/components/NewsList";
import { driveEvents, pages } from "@/content";
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
  return <><PageHero title={pages.news.meta.value[locale].title} lead={pages.news.lead.value[locale]} leadDraft /><section className="container news-page"><NewsList events={driveEvents} locale={locale} /></section></>;
}
