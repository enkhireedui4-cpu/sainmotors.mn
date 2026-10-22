import type { DriveEvent } from "@/content/types";
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
