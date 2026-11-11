import Link from "next/link";
import { ui } from "@/content";
import type { Brand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { brandLinkLabel } from "@/lib/brand-sites";
import { brandHref } from "@/lib/routes";
import { BrandCarousel } from "./BrandCarousel";
import { BrandMark } from "./BrandMark";
import { Picture } from "./Picture";
import { draftAttr } from "./HomeSections";
import { Icon } from "./Icon";

/**
 * One brand card: a single link (no nested controls). On pointer devices the
 * stone plate shows the logo and name, and hover or keyboard focus wipes in a
 * dark panel with the brand's introduction; on touch screens that panel is
 * simply shown below the logo, so nothing depends on hover.
 */
function BrandCard({ brand, locale, copy }: { brand: Brand; locale: Locale; copy: boolean }) {
  const descId = copy ? undefined : `brand-card-${brand.slug}`;
  return (
    <Link
      href={brandHref(locale, brand.slug)}
      className="bcard"
      aria-label={`${brand.name}: ${ui.brand.overview[locale]}`}
      aria-describedby={descId}
    >
      <span className="bcard__plate">
        <BrandMark brand={brand} locale={locale} decorative lazy={false} />
      </span>
      <span className="bcard__name" translate="no">
        {brand.name}
      </span>
      <span className="bcard__reveal">
        <span className="bcard__title" translate="no">
          {brand.name}
        </span>
        <span className="bcard__desc" id={descId} data-status={brand.teaser ? draftAttr(brand.teaser) : undefined}>
          {brand.teaser?.value[locale] ?? brandLinkLabel(locale, brand.slug)}
        </span>
        <span className="bcard__cta" aria-hidden="true">
          {ui.brand.overview[locale]}
          <Icon name="chevronRight" size={16} />
        </span>
      </span>
    </Link>
  );
}

/** The home page portfolio: every published brand in a one-card-at-a-time carousel. */
export function BrandPortfolio({ brands, locale }: { brands: Brand[]; locale: Locale }) {
  return (
    <BrandCarousel
      slides={brands.map((b) => (
        <BrandCard key={b.slug} brand={b} locale={locale} copy={false} />
      ))}
      copies={brands.map((b) => (
        <BrandCard key={b.slug} brand={b} locale={locale} copy />
      ))}
      names={brands.map((b) => b.name)}
      labels={{
        region: ui.brand.portfolio[locale],
        slide: ui.carousel.slide[locale],
        previous: ui.carousel.previous[locale],
        next: ui.carousel.next[locale],
        pause: ui.carousel.pause[locale],
        play: ui.carousel.play[locale],
      }}
    />
  );
}

/** All brands remain one click away, without making visitors page through a carousel. */
export function BrandChooser({ brands, locale }: { brands: Brand[]; locale: Locale }) {
  return (
    <nav className="brand-chooser" aria-label={locale === "mn" ? "Брэндээ сонгох" : "Choose your brand"}>
      <div className="container">
        <ul>{brands.map((brand) => (
          <li key={brand.slug}>
            <Link href={brandHref(locale, brand.slug)} aria-label={brand.name}>
              <BrandMark brand={brand} locale={locale} size="small" decorative />
            </Link>
          </li>
        ))}</ul>
      </div>
    </nav>
  );
}

/** Equal treatment: original photography, original mark, approved copy and one link. */
function PortfolioCard({ brand, locale, copy: loopCopy = false }: { brand: Brand; locale: Locale; copy?: boolean }) {
  const photo = (brand.cardPhoto ?? brand.photo)!;
  const copy = brand.cardCopy ?? brand.teaser;
  return (
    <Link className="portfolio-card" href={brandHref(locale, brand.slug)} tabIndex={loopCopy ? -1 : undefined} aria-label={`${brand.name}: ${ui.brand.explore[locale]}`}>
      <div className="portfolio-card__media" data-photo={photo.key}>
        <Picture photo={{ ...photo, focus: `var(--portfolio-image-position, ${photo.focus ?? "50% 50%"})` }} locale={locale} sizes="(min-width: 1745px) 490px, (min-width: 1024px) 28vw, (min-width: 640px) 43vw, 85vw" />
      </div>
      <div className="portfolio-card__body">
        <h3 className="portfolio-card__mark" translate="no">
          <BrandMark brand={brand} locale={locale} decorative onDark />
          <span className="sr-only">{brand.name}</span>
        </h3>
        <p className="portfolio-card__copy" data-status={copy ? draftAttr(copy) : undefined}>{copy?.value[locale] ?? brandLinkLabel(locale, brand.slug)}</p>
        <span className="portfolio-card__cta">{ui.brand.explore[locale]}<Icon name="chevronRight" size={18} /></span>
      </div>
    </Link>
  );
}

/** Every brand uses its existing photo, approved copy, original mark and route. */
export function BrandShowroom({ brands, locale }: { brands: Brand[]; locale: Locale }) {
  return (
    <BrandCarousel
      slides={brands.map(b => <PortfolioCard key={b.slug} brand={b} locale={locale} />)}
      copies={brands.map(b => <PortfolioCard key={b.slug} brand={b} locale={locale} copy />)}
      names={brands.map(b => b.name)}
      interval={5500}
      resumeAfterInteraction
      showPosition={false}
      showPlaybackControl={false}
      labels={{
        region: ui.brand.portfolio[locale],
        slide: ui.carousel.slide[locale],
        previous: ui.carousel.previous[locale],
        next: ui.carousel.next[locale],
        pause: ui.carousel.pause[locale],
        play: ui.carousel.play[locale],
      }}
    />
  );
}

/** Compact logo row for "other brands" on a brand page. */
export function BrandStrip({ brands, locale }: { brands: Brand[]; locale: Locale }) {
  return (
    <ul className="brand-strip">
      {brands.map((brand) => (
        <li key={brand.slug}>
          <Link href={brandHref(locale, brand.slug)} aria-label={brand.name}>
            <BrandMark brand={brand} locale={locale} size="small" decorative />
          </Link>
        </li>
      ))}
    </ul>
  );
}
