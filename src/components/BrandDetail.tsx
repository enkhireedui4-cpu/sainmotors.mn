import type { CSSProperties } from "react";
import "@/app/brands.css";
import { brandPhone, getBrands, getLocation, liveLinks, ui } from "@/content";
import type { Brand, BrandLink } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { displayHost, pageHref } from "@/lib/routes";
import { CorporateBrands } from "./CorporateBrands";
import { BrandMark } from "./BrandMark";
import { draftAttr } from "@/lib/content-status";
import { Icon } from "./Icon";
import { LocationCard } from "./LocationCard";
import { Breadcrumb } from "./PageHero";
import { Picture } from "./Picture";

function linkLabel(link: BrandLink, locale: Locale): string {
  if (link.kind === "facebook") return ui.brand.facebook[locale];
  const host = displayHost(link.url);
  return locale === "mn" ? `${host} ${ui.brand.visit.mn}` : `${ui.brand.visit.en} ${host}`;
}

/** The brand's own channels: the first (its Mongolian site or Facebook page) is the page's primary action. */
function BrandLinks({ links, locale }: { links: BrandLink[]; locale: Locale }) {
  return links.map((link, i) => (
    <a key={link.url} className={`button ${i === 0 ? "button--primary" : "button--outline"} brand-link`} href={link.url} rel="noopener" data-kind={link.kind}>
      {link.kind === "facebook" && <Icon name="facebook" size={17} />}
      {linkLabel(link, locale)}
      {link.kind === "website" && <Icon name="arrowUpRight" size={17} />}
      <span className="sr-only"> {ui.external[locale]}</span>
    </a>
  ));
}

/** Brand-team imagery, a concise introduction, then the complete source-based information. */
export function BrandDetail({ brand, locale }: { brand: Brand; locale: Locale }) {
  const others = getBrands().filter((b) => b.slug !== brand.slug);
  const location = brand.location ? getLocation(brand.location) : undefined;
  const phone = brandPhone(brand);
  const links = liveLinks(brand);
  const photo = brand.photo ?? brand.cardPhoto;
  const shortCopy = (brand.cardCopy ?? brand.teaser).value[locale];
  const headline = brand.headline?.value[locale] ?? shortCopy.split("\n")[0];
  const lead = brand.headline ? shortCopy : shortCopy.split("\n").slice(1).join(" ");

  return (
    <div className="brand-detail">
      <div className="brand-hero" style={{ "--brand-accent": brand.accent } as CSSProperties}>
        <div className="container">
          <Breadcrumb
            label={ui.breadcrumb[locale]}
            items={[{ href: pageHref(locale, "brands"), label: ui.nav.brands[locale] }]}
            current={brand.name}
          />
          <div className="brand-hero__grid">
            <div className="brand-hero__copy">
              <h1 className="brand-hero__identity">
                <BrandMark brand={brand} locale={locale} size="large" lazy={false} />
              </h1>
              <p className="brand-hero__headline" data-status={draftAttr(brand.headline ?? brand.cardCopy ?? brand.teaser)}>
                {headline}
              </p>
              <p className="brand-hero__lead" data-status={draftAttr(brand.cardCopy ?? brand.teaser)}>{lead}</p>
              <div className="brand-hero__actions">
                <BrandLinks links={links} locale={locale} />
                <a className="button button--outline" href={phone.href}><Icon name="phone" size={17} />{phone.display}</a>
                {location && <a className="text-link" href={`#${location.id}`}>{ui.brand.showroom[locale]}<Icon name="chevronRight" size={17} /></a>}
              </div>
            </div>
            {photo && <figure className="brand-hero__image"><Picture photo={photo} locale={locale} sizes="(min-width: 96rem) 49rem, (min-width: 64rem) 48vw, 92vw" priority /></figure>}
          </div>

          <div className="brand-facts">
            <dl>
              {brand.since && (
                <div>
                  <dt>{ui.brand.rights[locale]}</dt>
                  <dd>{ui.brand.sinceYear[locale].replace("{year}", String(brand.since))}</dd>
                </div>
              )}
              {location && (
                <div>
                  <dt>{ui.brand.showroom[locale]}</dt>
                  <dd>
                    <a href={`#${location.id}`}>{location.name[locale]}</a>
                    <span>{location.city[locale]}</span>
                  </dd>
                </div>
              )}
              <div>
                <dt>{ui.brand.sales[locale]}</dt>
                <dd>
                  <a className="phone-link" href={phone.href}>
                    <Icon name="phone" size={16} />
                    {phone.display}
                  </a>
                </dd>
              </div>
              {brand.models && (
                <div>
                  <dt>{ui.brand.models[locale]}</dt>
                  <dd translate="no">{brand.models.join(", ")}</dd>
                </div>
              )}
            </dl>
            {!location && (
              <div className="brand-facts__aside">
                <p className="brand-facts__note">{ui.brand.noShowroom[locale]}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="brand-story" aria-labelledby="brand-overview-heading">
        <div className="container brand-story__grid">
          <h2 id="brand-overview-heading" className="display-3">{ui.brand.overview[locale]}</h2>
          <div className="brand-story__copy">
            <p data-status={draftAttr(brand.summary)}>{brand.summary.value[locale]}</p>
            {brand.statement && <p className="brand-story__statement" data-status={draftAttr(brand.statement)}>{brand.statement.value[locale]}</p>}
          </div>
        </div>
      </section>

      {brand.gallery && brand.gallery.length > 0 && (
        <section className="brand-gallery" aria-labelledby="brand-gallery-heading">
          <div className="container">
            <h2 id="brand-gallery-heading" className="display-3">{ui.brand.gallery[locale]}</h2>
            <div className="brand-gallery__grid">
              {brand.gallery.map((photo) => (
                <figure key={photo.key}>
                  <Picture photo={photo} locale={locale} sizes="(min-width: 96rem) 30rem, (min-width: 64rem) 30vw, (min-width: 40rem) 44vw, 92vw" />
                  {photo.caption && (
                    <figcaption>
                      <span translate="no">{photo.caption}</span>
                      {photo.view && <span className="brand-gallery__view"> · {photo.view[locale]}</span>}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {location && (
        <section className="section" aria-labelledby="enquiries-heading">
          <div className="container">
            <h2 id="enquiries-heading" className="display-3 section-head">
              {ui.brand.enquiries[locale]}
            </h2>
            <div className="location-list">
              <LocationCard location={location} locale={locale} />
            </div>
          </div>
        </section>
      )}

      <section className="section section--alt" aria-labelledby="others-heading">
        <div className="container">
          <h2 id="others-heading" className="display-3 section-head">
            {ui.brand.others[locale]}
          </h2>
          <nav aria-labelledby="others-heading">
            <CorporateBrands brands={others} locale={locale} />
          </nav>
        </div>
      </section>
    </div>
  );
}
