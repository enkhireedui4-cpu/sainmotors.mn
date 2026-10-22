import { describe, expect, it } from "vitest";
import { driveEvents, testDrive } from "@/content";
import { eventDays, eventState, registrationOpen } from "@/lib/events";

const darkhan = { days: ["2026-10-09", "2026-10-10"] as [string, string] };

describe("event state in Ulaanbaatar time", () => {
  it("is upcoming before the first day starts there", () => {
    expect(eventState(darkhan, new Date("2026-10-08T15:59:59Z"))).toBe("upcoming");
  });

  it("is live from midnight on the first day to the end of the last day", () => {
    expect(eventState(darkhan, new Date("2026-10-08T16:00:00Z"))).toBe("live");
    expect(eventState(darkhan, new Date("2026-10-10T15:59:59Z"))).toBe("live");
  });

  it("is completed once the last day has ended in Ulaanbaatar, even while it is still that day in UTC", () => {
    expect(eventState(darkhan, new Date("2026-10-10T16:00:00Z"))).toBe("completed");
  });

  it("never offers registration for a completed event, even with a link", () => {
    const withLink = { ...darkhan, registrationUrl: "https://example.org/register" };
    expect(registrationOpen(withLink, new Date("2026-10-01T00:00:00Z"))).toBe(true);
    expect(registrationOpen(withLink, new Date("2026-10-20T00:00:00Z"))).toBe(false);
    expect(registrationOpen(darkhan, new Date("2026-10-01T00:00:00Z"))).toBe(false);
  });

  it("writes days in the posters' style", () => {
    expect(eventDays(darkhan)).toBe("2026.10.09–10");
    expect(eventDays({ days: ["2026-08-22", "2026-08-22"] })).toBe("2026.08.22");
    expect(eventDays({ days: ["2026-08-31", "2026-09-01"] })).toBe("2026.08.31–2026.09.01");
  });
});

describe("MEGA TEST DRIVE content", () => {
  it("lists editions newest first, each with valid days and a venue in both languages", () => {
    const editions = driveEvents.map((event) => event.edition);
    expect(editions).toEqual([...editions].sort((a, b) => b - a));
    for (const event of driveEvents) {
      expect(event.days[0] <= event.days[1], event.id).toBe(true);
      expect(Number.isNaN(Date.parse(event.days[0])), event.id).toBe(false);
      expect(event.venue.mn && event.venue.en, event.id).toBeTruthy();
      expect(event.source, event.id).toBeTruthy();
    }
  });

  it("self-hosts every film, with one teaser loop for the featured edition", () => {
    const films = driveEvents.filter((event) => event.film);
    expect(films.map((event) => event.edition)).toEqual([7, 6]);
    for (const event of films) expect(event.film!.full, event.id).toMatch(/^\/video\/.+\.mp4$/);
    const teasers = films.filter((event) => event.film!.teaser);
    expect(teasers).toHaveLength(1);
    expect(teasers[0].film!.teaser).toMatch(/^\/video\/.+\.mp4$/);
  });

  it("gives every edition a written heading and story, kept as draft until sign-off", () => {
    for (const event of driveEvents) {
      expect(event.headline?.value.mn, event.id).toMatch(new RegExp(`^MEGA TEST DRIVE ${event.edition}`));
      expect(event.story?.value.mn.split("\n\n").length, event.id).toBeGreaterThan(1);
      expect(event.story?.status, event.id).toBe("draft");
    }
  });

  it("keeps its copy unapproved until the content team signs it off", () => {
    expect(testDrive.status).not.toBe("approved");
  });
});
