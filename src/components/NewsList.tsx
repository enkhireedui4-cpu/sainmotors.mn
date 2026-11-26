import Link from "next/link";
import type { NewsArticle } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { newsDate, newsCategoryLabels } from "@/lib/news";
import { newsHref } from "@/lib/routes";
import { Picture } from "./Picture";
import "./news-system.css";

export function NewsList({ articles, locale, headingLevel = "h3" }: { articles: NewsArticle[]; locale: Locale; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return <div className="news-list news-system-grid">{articles.map(article => <article key={article.id} data-news-type={article.category} data-status={article.status === "draft" ? "draft" : undefined}>
    <Link href={newsHref(locale, article.id)} prefetch={false} className="news-card">
      <div className="news-card__media">
        <Picture photo={article.cover} locale={locale} sizes="(min-width: 64rem) 28vw, (min-width: 48rem) 44vw, 90vw" />
        <span className="news-card__category">{newsCategoryLabels[article.category][locale]}</span>
      </div>
      <div className="news-card__body">
        <Heading>{article.title[locale]}</Heading>
        {article.date && <time className="news-card__date" dateTime={article.date.value}>{newsDate(article,locale)}</time>}
      </div>
    </Link>
  </article>)}</div>;
}
