import Link from "next/link";
import type { DriveEvent } from "@/content/types";
import { corporateHome } from "@/content/corporate";
import type { Locale } from "@/lib/i18n";
import { eventDate, eventTitle } from "@/lib/news";
import { newsHref } from "@/lib/routes";
import { Icon } from "./Icon";
import { Picture } from "./Picture";

export function NewsList({ events, locale }: { events: DriveEvent[]; locale: Locale }) {
  const copy = corporateHome.value[locale];
  return <div className="news-list">{events.map(event => <article key={event.id} data-status={event.status === "draft" ? "draft" : undefined}>
    <Link href={newsHref(locale, event.id)} prefetch={false} className="news-card">
      <div className={`news-card__media${event.film ? "" : " news-card__media--date"}`}>
        {event.film ? <Picture photo={event.film.poster} locale={locale} sizes="(min-width: 64rem) 30vw, 90vw" /> : <><span>MEGA<br />TEST DRIVE</span><span className="news-card__edition">{String(event.edition).padStart(2, "0")}</span></>}
      </div>
      <div className="news-card__body"><p className="news-card__date"><time dateTime={event.days[0]}>{eventDate(event, locale)}</time></p>
        <h3>{eventTitle(event, locale)}</h3><p>{event.venue[locale]}</p>
        <span className="text-link">{copy.read}<Icon name="arrowUpRight" size={17} /></span>
      </div>
    </Link>
  </article>)}</div>;
}
