import type { Metadata } from "next";
import { NewsList } from "@/components/NewsList";
import { NewsDirectory } from "@/components/NewsDirectory";
import { pages } from "@/content";
import { getNewsArticles } from "@/lib/news";
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
  const articles = getNewsArticles();
  return <NewsDirectory locale={locale} articleCategories={articles.map(article => article.category)}><NewsList articles={articles} locale={locale} headingLevel="h2" /></NewsDirectory>;
}
