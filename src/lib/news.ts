import type { DriveEvent } from "@/content/types";
import type { Locale } from "./i18n";

/** Calendar dates, never converted through the visitor's timezone. */
export function eventDate(event: DriveEvent, locale: Locale): string {
  const format = new Intl.DateTimeFormat(locale === "mn" ? "mn-MN" : "en-GB", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
  const date = (value: string) => format.format(new Date(`${value}T12:00:00Z`));
  return event.days[0] === event.days[1] ? date(event.days[0]) : `${date(event.days[0])} – ${date(event.days[1])}`;
}
export function eventTitle(event: DriveEvent, locale: Locale): string {
  return `MEGA TEST DRIVE ${event.edition}${event.title ? ` · ${event.title[locale]}` : ""}`;
}
