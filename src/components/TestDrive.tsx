import Link from "next/link";
import { driveEvents, testDrive } from "@/content";
import type { Locale } from "@/lib/i18n";
import { eventDays, eventState, registrationOpen } from "@/lib/events";
import { pageHref } from "@/lib/routes";
import { draftAttr } from "./HomeSections";
import { Icon } from "./Icon";
import { MediaViewfinder } from "./MediaViewfinder";
import { Picture, fallbackSrc } from "./Picture";
import { Reveal } from "./Reveal";
import { TeaserToggle, TeaserVideo } from "./TeaserVideo";
import { VideoDialog } from "./VideoDialog";

/**
 * The homepage's one expanding media moment: the MEGA TEST DRIVE 7 off-road
 * film as a muted loop that opens to full bleed, the full cut on request, and
 * the latest editions beneath it. Past editions never offer registration.
 */
export function TestDrive({ locale }: { locale: Locale }) {
  const copy = testDrive.value[locale];
  const featured = driveEvents.find((event) => event.film?.teaser);
  if (!featured?.film?.teaser) throw new Error("The test-drive feature needs an edition with a film teaser.");
  const film = featured.film;
  const teaser = featured.film.teaser;
  const poster = fallbackSrc(film.poster.key);
  const filmTitle = `MEGA TEST DRIVE ${featured.edition}${featured.title ? ` — ${featured.title[locale]}` : ""}`;
  const latest = driveEvents.reduce((max, event) => Math.max(max, event.edition), 0);

  return (
    <>
      <MediaViewfinder
        media={
          <>
            {/* A lazy, responsive poster: <video poster> would be fetched with the first screen. */}
            <Picture photo={film.poster} locale={locale} sizes="(max-width: 48rem) 360vw, 120vw" className="teaser-poster" />
            <TeaserVideo id={`${featured.id}-teaser`} src={teaser} label={film.poster.alt[locale]} />
          </>
        }
      >
        <div className="container viewfinder__inner test-drive" data-status={draftAttr(testDrive)}>
          <p className="test-drive__event">
            <span>{filmTitle}</span>
            <span>{eventDays(featured)} · {featured.venue[locale]}</span>
          </p>
          <h2 id="test-drive-heading" className="display-2">{copy.heading}</h2>
          <p>{copy.body}</p>
          <div className="test-drive__actions">
            <VideoDialog
              src={film.full}
              poster={poster}
              title={filmTitle}
              closeLabel={locale === "mn" ? "Бичлэгийг хаах" : "Close the film"}
              className="button button--primary test-drive__watch"
            >
              <Icon name="play" size={18} />
              {copy.watch}
              <span className="test-drive__duration">{film.duration}</span>
            </VideoDialog>
            <Link className="test-drive__request" href={pageHref(locale, "contact")}>
              {copy.request}<Icon name="chevronRight" size={16} />
            </Link>
            <TeaserToggle
              target={`${featured.id}-teaser`}
              pauseLabel={locale === "mn" ? "Видеог зогсоох" : "Pause video"}
              playLabel={locale === "mn" ? "Видеог тоглуулах" : "Play video"}
            />
          </div>
        </div>
      </MediaViewfinder>

      <div className="container drive-events">
        <Reveal className="drive-events__head">
          <h3>{copy.events}</h3>
          <p><strong>{latest}</strong> {copy.editions}</p>
        </Reveal>
        <ol className="drive-events__list">
          {driveEvents.map((event) => {
            const state = eventState(event);
            return (
              <li key={event.id} className="drive-event" data-state={state}>
                <span className="drive-event__edition" aria-hidden="true">{String(event.edition).padStart(2, "0")}</span>
                <div className="drive-event__body">
                  <p className="drive-event__name">
                    MEGA TEST DRIVE {event.edition}
                    {event.title && <span> · {event.title[locale]}</span>}
                  </p>
                  <p className="drive-event__meta">
                    <time dateTime={event.days[0]}>{eventDays(event)}</time>
                    {event.hours && <> · {event.hours}</>} · {event.venue[locale]}
                  </p>
                </div>
                {registrationOpen(event) ? (
                  <a className="button button--primary" href={event.registrationUrl}>{locale === "mn" ? "Бүртгүүлэх" : "Register"}</a>
                ) : (
                  state === "completed" && <span className="drive-event__state">{copy.past}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
