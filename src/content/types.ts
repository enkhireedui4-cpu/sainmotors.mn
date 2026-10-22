import type { Localized } from "@/lib/i18n";
import type media from "./generated/media.json";

/**
 * Where a piece of content stands. The content team (Dashnyam) owns the move
 * to "approved"; the web team never sets it on its own.
 *
 *  approved — confirmed for publication on sainmotors.mn.
 *  sourced  — real information from Sain Motors itself: the brand teams'
 *             Drive sheets (2026-10-16) or jetour.mn. Received, not yet
 *             approved for this site. Sources: docs/content-sources.md.
 *  draft    — written or translated by the web team. A release build
 *             refuses to ship it.
 */
export type ContentStatus = "approved" | "sourced" | "draft";

export interface Block<T = string> {
  status: ContentStatus;
  /** Where the content came from, for the review checklist. */
  source?: string;
  value: Localized<T>;
}

export type PhotoKey = keyof typeof media.photos;

export interface Photo {
  key: PhotoKey;
  alt: Localized;
  status: ContentStatus;
  /** Exact supplied file, official URL or source inventory reference, when recorded. */
  source?: string;
  note?: string;
  /** CSS object-position for frames that crop the image, e.g. "60% 55%". */
  focus?: string;
  /** Visible caption, e.g. a model name. */
  caption?: string;
  /** Camera view, shown after the caption where a gallery repeats a model. */
  view?: Localized;
  /** Short visible label on a photo card, e.g. "Showroom". */
  label?: Localized;
}

export interface Link {
  label: Localized;
  /** Internal page key path such as "brands" or an absolute https URL. */
  href: string;
}

/** Corporate statement with a supporting decorative ribbon, shared by MN/EN. */
export interface Hero {
  /** Short line above the heading. */
  kicker: Block;
  title: Block;
  text: Block;
  cta: Link;
  secondaryCta: Link;
}

export interface Phone {
  display: string;
  href: string;
}

export interface BrandLink {
  kind: "website" | "facebook";
  url: string;
  /** Rendered only when the destination was reachable at the last check. */
  live: boolean;
  checked: string;
}

export type LocationId = "dolgoon-nuur" | "sansar" | "byd-4s" | "chery-narny" | "jetour-c1" | "darkhan" | "service-centre";

export interface Brand {
  slug: string;
  /** Review of the non-copy facts: channels, phone, showroom, models and year. */
  factsReview?: { status: ContentStatus; source: string };
  /** The brand's own spelling, used for alt text and captions. */
  name: string;
  /** Unpublished brands are left out of every listing, route and sitemap. */
  published: boolean;
  order: number;
  /**
   * Accent for the brand's own page only. A design choice, never presented
   * as an official colour.
   */
  accent: string;
  summary: Block;
  /** 25–45 words for the home page carousel, condensed from the brand sheet. */
  teaser: Block;
  /** Short, customer-facing copy for homepage vehicle cards. */
  cardCopy?: Block;
  /** Manufacturer illustration for the homepage; does not assert local model availability. */
  cardPhoto?: Photo;
  /** Sain Motors' relationship to the brand, as the brand team worded it. */
  statement?: Block;
  /** Year Sain Motors began selling the brand under official rights, per the brand sheet. */
  since?: number;
  /** The brand's own headline from its sheet. */
  headline?: Block;
  /** Models the brand sheet says Sain Motors sells. */
  models?: string[];
  links: BrandLink[];
  /** Showroom the brand sheet names. */
  location?: LocationId;
  /** Sales line from the brand sheet; falls back to the company line. */
  phone?: Phone;
  photo?: Photo;
  /** Further supplied brand imagery, captioned with the source's model name. */
  gallery?: Photo[];
}

export interface OpeningHours {
  days: Localized;
  time: Localized;
}

export interface Location {
  id: LocationId;
  kind: "showroom" | "service";
  name: Localized;
  city: Localized;
  address: Localized;
  landmark?: Localized;
  /** Only where confirmed; otherwise visitors are asked to call. */
  hours?: OpeningHours[];
  /** The location's own line. Showrooms without one list each brand's sales line. */
  phone?: Phone;
  email?: string;
  /** `pin`: a verified map point. `search`: a map search for the landmark. */
  map: { url: string; precision: "pin" | "search" };
  /** Brands serviced here. Showroom brands come from each brand's `location`. */
  serviceBrands?: string[];
  photo?: Photo;
  status: ContentStatus;
  source: string;
}

export interface Service {
  id: "sales" | "financing" | "after-sales" | "repair";
  title: Localized;
  body: Localized;
  /** Brands the sources confirm for this service. */
  brands: string[];
  /** Where it is delivered; omitted when it is each brand's own showroom. */
  locations?: LocationId[];
  status: ContentStatus;
  source: string;
}

/**
 * A MEGA TEST DRIVE edition. Days are calendar dates in Asia/Ulaanbaatar
 * (UTC+8, no daylight saving); an event is over once its last day has ended
 * there (src/lib/events.ts). A registration link is shown only while an event
 * is still ahead and the content team has supplied a verified URL.
 */
export interface DriveEvent {
  id: string;
  edition: number;
  /** Edition subtitle, e.g. "Off-road edition". */
  title?: Localized;
  /** First and last day, "YYYY-MM-DD". */
  days: [string, string];
  /** Opening hours as published, e.g. "11:00–19:00". */
  hours?: string;
  venue: Localized;
  status: ContentStatus;
  source: string;
  registrationUrl?: string;
  /** The news article's heading as written, e.g. "MEGA TEST DRIVE 8 Дархан хотод". */
  headline?: Block;
  /** The news article's text; paragraphs are separated by blank lines. */
  story?: Block;
  /** Self-hosted film under /public/video: the full cut and, for the homepage feature, a short muted loop. */
  film?: { poster: Photo; teaser?: string; full: string; duration: string };
}
