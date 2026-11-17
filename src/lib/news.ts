import type { DriveEvent, NewsArticle } from "@/content/types";
import { driveEvents } from "@/content/events";
import { newsArticles } from "@/content/news-articles";
import { sitePhotos } from "@/content/photos";
import { eventDays } from "./events";
import type { Locale } from "./i18n";

/** Calendar dates, never converted through the visitor's timezone: "2026.10.09–10" in Mongolian as on the posters, "9–10 Oct 2026" in English. */
export function eventDate(event: DriveEvent, locale: Locale): string {
  if (locale === "mn") return eventDays(event);
  const format = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
  const [first, last] = event.days.map((value) => new Date(`${value}T12:00:00Z`));
  return event.days[0] === event.days[1] ? format.format(first) : format.formatRange(first, last);
}
export function eventTitle(event: DriveEvent, locale: Locale): string {
  return event.headline?.value[locale] ?? `MEGA TEST DRIVE ${event.edition}${event.title ? ` · ${event.title[locale]}` : ""}`;
}

export const newsCategoryLabels = {
  news: { mn: "Мэдээ", en: "News" },
  media: { mn: "Бидний тухай хэвлэлд", en: "Mass media about us" },
  csr: { mn: "Нийгмийн хариуцлага", en: "Corporate and social responsibility" },
};

/** General articles and event reports share a template, preserving all existing event URLs. */
export function getNewsArticles(): NewsArticle[] {
  const events: NewsArticle[] = driveEvents.filter(event => event.published !== false).map(event => {
    const paragraphs = { mn: event.story?.value.mn.split("\n\n") ?? [], en: event.story?.value.en.split("\n\n") ?? [] };
    return {
      id: event.id, category: event.category ?? "news", title: { mn: eventTitle(event,"mn"), en: eventTitle(event,"en") },
      date: { value: event.days[0], end: event.days[1], precision: "day" }, location: event.venue,
      cover: event.cover ?? event.film?.poster ?? sitePhotos.hero,
      coverNote: !event.cover && !event.film ? { mn: "Танилцуулгын зураг", en: "Illustrative photo" } : undefined,
      sections: paragraphs.mn.map((paragraph,index) => ({ body: { mn: paragraph, en: paragraphs.en[index] ?? "" }, photos: event.gallery?.filter(item => item.afterParagraph === index).map(item => item.photo) })),
      film: event.film, source: event.source, status: event.story?.status ?? event.status,
    };
  });
  return [...newsArticles, ...events].sort((a,b) => (b.date?.value ?? "").localeCompare(a.date?.value ?? ""));
}

export function newsDate(article: NewsArticle, locale: Locale): string {
  const date = article.date;
  if (!date) return "";
  if (date.precision === "year") return locale === "mn" ? `${date.value} он` : date.value;
  const first = new Date(`${date.value}${date.precision === "month" ? "-01" : ""}T12:00:00Z`);
  if (date.precision === "month") return locale === "mn" ? `${date.value.slice(0,4)} оны ${Number(date.value.slice(5))}-р сар` : new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"long",timeZone:"UTC"}).format(first);
  if (locale === "mn") {
    const start = date.value.replaceAll("-", ".");
    if (!date.end || date.end === date.value) return start;
    return start.slice(0,8) === date.end.replaceAll("-", ".").slice(0,8) ? `${start}–${date.end.slice(8)}` : `${start}–${date.end.replaceAll("-", ".")}`;
  }
  const format = new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"short",day:"numeric",timeZone:"UTC"});
  return date.end && date.end !== date.value ? format.formatRange(first,new Date(`${date.end}T12:00:00Z`)) : format.format(first);
}
