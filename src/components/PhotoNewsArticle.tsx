import Link from "next/link";
import type { NewsArticle } from "@/content/types";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { newsDate, newsCategoryLabels } from "@/lib/news";
import { pageHref } from "@/lib/routes";
import { Picture, fallbackSrc } from "./Picture";
import { NewsList } from "./NewsList";
import "./news-system.css";

export function PhotoNewsArticle({ article, related, locale }: { article: NewsArticle; related: NewsArticle[]; locale: Locale }) {
  const text = locale === "mn" ? {credit:"Зураг: Сайн Моторс",film:"Өдөрлөгийн бичлэг",other:"Бусад мэдээ",back:"Бүх мэдээ"} : {credit:"Photos: Sain Motors",film:"Event film",other:"Other news",back:"All news"};
  return <article className="news-feature" data-news-id={article.id}>
    <header className="news-feature__header"><div className="news-feature__column">
      <nav className="news-feature__crumbs" aria-label={ui.breadcrumb[locale]}><Link href={pageHref(locale,"home")} prefetch={false}>{ui.homeCrumb[locale]}</Link><span aria-hidden="true">/</span><Link href={pageHref(locale,"news")} prefetch={false}>{ui.nav.news[locale]}</Link><span aria-hidden="true">/</span></nav>
      <h1>{article.title[locale]}</h1>
      {(article.date || article.category !== "news") && <div className="news-feature__meta">{article.date && <time dateTime={article.date.value}>{newsDate(article,locale)}</time>}{article.category !== "news" && <span>{newsCategoryLabels[article.category][locale]}</span>}</div>}
      <figure className="news-feature__cover"><Picture photo={article.cover} locale={locale} sizes="(min-width: 68rem) 55vw, (min-width: 48rem) 78vw, 90vw" priority /><figcaption><span aria-hidden="true">✳</span>{article.coverNote?.[locale] ?? text.credit}</figcaption></figure>
    </div></header>
    <div className="news-feature__body news-feature__column">
      {article.sections.map((section,index) => <section className="news-feature__section" key={index}>
        {section.heading && <h2>{section.heading[locale]}</h2>}
        {section.body?.[locale].split("\n\n").filter(Boolean).map((paragraph,i) => <p key={i}>{paragraph}</p>)}
        {section.bullets && <ul>{section.bullets[locale].map(item => <li key={item}>{item}</li>)}</ul>}
        {section.photos?.map(photo => <figure className="news-feature__photo" key={photo.key}><Picture photo={photo} locale={locale} sizes="(min-width: 68rem) 55vw, (min-width: 48rem) 78vw, 90vw" /></figure>)}
      </section>)}
      {article.film && <section className="news-feature__film" aria-labelledby="news-film-heading"><h2 id="news-film-heading">{text.film}</h2><video controls playsInline preload="none" poster={fallbackSrc(article.film.poster.key)} aria-label={article.title[locale]}><source src={article.film.full} type="video/mp4" /></video></section>}
      <Link className="news-feature__back" href={pageHref(locale,"news")} prefetch={false}>← {text.back}</Link>
    </div>
    {related.length > 0 && <section className="news-related" aria-labelledby="other-news-heading"><div className="news-related__inner"><h2 id="other-news-heading">{text.other}</h2><NewsList articles={related} locale={locale} /></div></section>}
  </article>;
}
