import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoNewsArticle } from "@/components/PhotoNewsArticle";
import { fallbackSrc } from "@/components/Picture";
import { getPhoto } from "@/content";
import type { Locale } from "@/lib/i18n";
import { getNewsArticles } from "@/lib/news";
import { excerpt, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getNewsArticles().map(article => ({ slug: article.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = getNewsArticles().find(item => item.id === slug);
  if (!article) notFound();
  const locale = lang as Locale;
  const photo = getPhoto(article.cover.key);
  const width = photo.srcset.find(([size]) => size >= 1080)?.[0] ?? photo.srcset.at(-1)![0];
  return pageMetadata({ locale, path: "news/" + slug, title: article.title[locale], description: excerpt(article.sections.find(section => section.body)?.body?.[locale] ?? article.title[locale]), image: { src: fallbackSrc(article.cover.key), width, height: Math.round(width*photo.height/photo.width), alt: article.cover.alt[locale] } });
}
export default async function NewsDetail({ params }: Props) {
  const { lang, slug } = await params;
  const articles = getNewsArticles();
  const article = articles.find(item => item.id === slug);
  if (!article) notFound();
  return <PhotoNewsArticle article={article} related={articles.filter(item => item.id !== slug).slice(0,3)} locale={lang as Locale} />;
}
