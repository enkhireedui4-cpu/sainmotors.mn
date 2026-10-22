import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/PageHero";
import { Icon } from "@/components/Icon";
import { fallbackSrc } from "@/components/Picture";
import { contact, driveEvents, testDrive, ui } from "@/content";
import { corporateHome } from "@/content/corporate";
import type { Locale } from "@/lib/i18n";
import { eventDate, eventTitle } from "@/lib/news";
import { pageHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ lang: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return driveEvents.map(event => ({ slug: event.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const event = driveEvents.find(event => event.id === slug);
  if (!event) notFound();
  const locale = lang as Locale;
  return pageMetadata({ locale, path: "news/" + slug, title: eventTitle(event, locale), description: eventDate(event, locale) + " · " + event.venue[locale] });
}
export default async function NewsDetail({ params }: Props) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const event = driveEvents.find(event => event.id === slug);
  if (!event) notFound();
  const copy = corporateHome.value[locale];
  return <article className="container news-detail">
    <Breadcrumb label={ui.breadcrumb[locale]} items={[{ href: pageHref(locale,"news"), label: ui.nav.news[locale] }]} current={eventTitle(event,locale)} />
    <p className="eyebrow">{copy.held}</p><h1>{eventTitle(event,locale)}</h1>
    <div className="news-detail__meta"><time dateTime={event.days[0]}>{eventDate(event,locale)}</time><span>{event.venue[locale]}</span></div>
    {event.film && <video controls playsInline preload="none" poster={fallbackSrc(event.film.poster.key)} aria-label={eventTitle(event,locale)}><source src={event.film.full} type="video/mp4" /></video>}
    {event.story
      ? <div className="news-detail__story" data-status={event.story.status}>{event.story.value[locale].split("\n\n").map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
      : event.film && <p data-status={testDrive.status}>{testDrive.value[locale].body}</p>}
    <dl className="news-detail__facts"><div><dt>{locale === "mn" ? "Огноо" : "Date"}</dt><dd>{eventDate(event,locale)}</dd></div><div><dt>{locale === "mn" ? "Байршил" : "Location"}</dt><dd>{event.venue[locale]}</dd></div>{event.hours && <div><dt>{ui.location.hours[locale]}</dt><dd>{event.hours}</dd></div>}</dl>
    <div className="actions"><Link href={pageHref(locale,"news")} className="button button--outline" prefetch={false}>{copy.newsLink}</Link><a href={contact.phone.href} className="text-link"><Icon name="phone" size={18} />{contact.phone.display}</a></div>
  </article>;
}
