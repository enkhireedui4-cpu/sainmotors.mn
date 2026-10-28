import "@/app/brands.css";
import Link from "next/link";
import { brandPhone, getBrands, getLocation, getPhoto, liveLinks, ui } from "@/content";
import type { Brand, BrandLink } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { displayHost, pageHref } from "@/lib/routes";
import { draftAttr } from "@/lib/content-status";
import { BrandSectionNav } from "./BrandSectionNav";
import { BrandScrollHero } from "./BrandScrollHero";
import { CorporateBrands } from "./CorporateBrands";
import { BrandMark } from "./BrandMark";
import { BrandActions } from "./BrandActions";
import { JsonLd } from "./JsonLd";
import { breadcrumbGraph } from "@/lib/structured-data";
import { Icon } from "./Icon";
import { LocationCard } from "./LocationCard";
import { Picture } from "./Picture";

function linkLabel(link: BrandLink, locale: Locale): string {
  if (link.kind === "facebook") return ui.brand.facebook[locale];
  const host = displayHost(link.url);
  return locale === "mn" ? `${host} ${ui.brand.visit.mn}` : `${ui.brand.visit.en} ${host}`;
}

function BrandLinks({ links, locale }: { links: BrandLink[]; locale: Locale }) {
  return links.map(link => <a key={link.url} className="brand-link" href={link.url} rel="noopener" data-kind={link.kind}>
    {link.kind === "facebook" && <Icon name="facebook" size={17} />}
    {linkLabel(link, locale)}<Icon name="arrowUpRight" size={17} />
    <span className="sr-only"> {ui.external[locale]}</span>
  </a>);
}

/** Large automotive imagery leads; source records remain the authority for every fact. */
export function BrandDetail({ brand, locale }: { brand: Brand; locale: Locale }) {
  const others = getBrands().filter(b => b.slug !== brand.slug);
  const location = brand.location ? getLocation(brand.location) : undefined;
  const salesPhone = brandPhone(brand);
  const phone = { ...salesPhone, display: locale === "en" ? `+976 ${salesPhone.display}` : salesPhone.display };
  const photo = brand.photo ?? brand.cardPhoto;
  const asset = photo ? getPhoto(photo.key) : undefined;
  const shortCopy = brand.cardCopy ?? brand.teaser;
  const headline = brand.headline?.value[locale] ?? shortCopy.value[locale].split("\n")[0];
  const gallery = brand.gallery ?? [];
  const hasModels = gallery.length > 0 || Boolean(brand.models?.length);
  const sections = [
    { id: "brand-overview", label: ui.brand.overviewLink[locale] },
    ...(hasModels ? [{ id: "brand-models", label: ui.brand.gallery[locale] }] : []),
    ...(location ? [{ id: "brand-showroom", label: ui.brand.showroom[locale] }] : []),
  ];

  return <div className="brand-detail">
    <JsonLd data={breadcrumbGraph([{ name: "Sain Motors", path: `/${locale}/` }, { name: ui.nav.brands[locale], path: `/${locale}/brands/` }, { name: brand.name, path: `/${locale}/brands/${brand.slug}/` }])} />
    <div className="brand-hero">
      <div className="brand-title"><div className="container">
        <nav aria-label={ui.breadcrumb[locale]}><ol className="breadcrumb"><li><Link href={pageHref(locale, "brands")}>{ui.nav.brands[locale]}</Link><span aria-hidden="true">/</span></li></ol></nav>
        <div className="brand-title__row"><h1 translate="no">{brand.name}</h1><BrandActions brand={brand} locale={locale} /></div>
      </div></div>
      {photo && asset && <BrandScrollHero aspectRatio={`${asset.width} / ${asset.height}`}><figure className="brand-hero__image" style={{ backgroundColor: asset.color, aspectRatio: `${asset.width} / ${asset.height}` }}>
        <Picture photo={photo} locale={locale} sizes={`(max-width: 639px) ${Math.max(100, Math.ceil(asset.width / asset.height * 125))}vw, 100vw`} priority />
      </figure></BrandScrollHero>}
    </div>

    <section className="brand-overview" id="brand-overview" aria-labelledby="brand-overview-heading"><div className="container">
      <div className="brand-overview__grid">
        <div className="brand-overview__identity">
          <div className="brand-hero__identity"><BrandMark brand={brand} locale={locale} size="large" lazy={false} /></div>
        </div>
        <div className="brand-story__copy">
          <h2 id="brand-overview-heading" data-status={draftAttr(brand.headline ?? shortCopy)}>{headline}</h2>
          <p data-status={draftAttr(brand.summary)}>{brand.summary.value[locale]}</p>
          {brand.statement && <details className="brand-story__disclosure"><summary><span translate="no">{brand.name} × Sain Motors</span><Icon name="chevronRight" size={18} /></summary><p data-status={draftAttr(brand.statement)}>{brand.statement.value[locale]}</p></details>}
          <dl className="brand-contact-grid">
            {location && <div><dt>{ui.brand.showroom[locale]}</dt><dd><a href="#brand-showroom">{location.name[locale]}</a><span>{location.city[locale]}</span></dd></div>}
            {brand.since && <div><dt>{ui.brand.rights[locale]}</dt><dd>{ui.brand.sinceYear[locale].replace("{year}", String(brand.since))}</dd></div>}
            <div><dt>{ui.brand.online[locale]}</dt><dd className="brand-overview__channels"><BrandLinks links={liveLinks(brand)} locale={locale} /></dd></div>
            <div><dt>{ui.brand.sales[locale]}</dt><dd><a href={phone.href}><Icon name="phone" size={16} />{phone.display}</a></dd></div>
          </dl>
          {!location && <p className="brand-facts__note">{ui.brand.noShowroom[locale]}</p>}
        </div>
      </div>

    </div></section>

    <BrandSectionNav items={sections} label={ui.brand.sections[locale]} phone={phone} phoneLabel={ui.brand.sales[locale]} />

    {hasModels && <section className="brand-gallery" id="brand-models" aria-labelledby="brand-gallery-heading"><div className="container">
      <div className="brand-section-heading"><h2 id="brand-gallery-heading">{ui.brand.gallery[locale]}</h2><a className="text-link" href={phone.href}>{ui.brand.sales[locale]}<Icon name="arrowUpRight" size={18} /></a></div>
      {gallery.length > 0 ? <div className="brand-gallery__grid">{gallery.map(photo => <figure key={photo.key}>
        <div className="brand-gallery__image"><Picture photo={photo} locale={locale} sizes="(min-width: 90rem) 40rem, (min-width: 40rem) 44vw, 92vw" /></div>
        {photo.caption && <figcaption><span translate="no">{photo.caption}</span>{photo.view && <span className="brand-gallery__view">{photo.view[locale]}</span>}</figcaption>}
      </figure>)}</div> : <ul className="brand-model-list">{brand.models?.map(model => <li key={model}><span translate="no">{model}</span></li>)}</ul>}
    </div></section>}

    {location && <section className="brand-enquiries" id="brand-showroom" aria-labelledby="enquiries-heading"><div className="container">
      <div className="brand-section-heading"><h2 id="enquiries-heading">{ui.brand.enquiries[locale]}</h2><Icon name="directions" size={30} /></div>
      <LocationCard location={location} locale={locale} />
    </div></section>}

    <section className="brand-related" aria-labelledby="others-heading"><div className="container">
      <div className="brand-section-heading"><h2 id="others-heading">{ui.brand.others[locale]}</h2><a className="text-link" href={pageHref(locale, "brands")}>{ui.brand.viewAll[locale]}<Icon name="arrowUpRight" size={18} /></a></div>
      <nav aria-labelledby="others-heading"><CorporateBrands brands={others} locale={locale} /></nav>
    </div></section>
  </div>;
}
