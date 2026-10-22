import type { Metadata } from "next";
import Link from "next/link";
import { CorporateBrands } from "@/components/CorporateBrands";
import { HeroGallery } from "@/components/HeroGallery";
import { Icon } from "@/components/Icon";
import { NewsList } from "@/components/NewsList";
import { Picture } from "@/components/Picture";
import { company, contact, driveEvents, getBrands, getLocations, hero, pages, services, sitePhotos } from "@/content";
import { corporateHome } from "@/content/corporate";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.home.meta.value[locale];
  return pageMetadata({ locale, path: "", title: meta.title, description: meta.description, absoluteTitle: true });
}

export default async function HomePage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const copy = corporateHome.value[locale];
  const locations = getLocations().filter(location => location.kind === "showroom");
  return <div className="corporate-home">
    <section className="corporate-hero container" aria-labelledby="home-title">
      <div className="corporate-hero__copy">
        <p className="corporate-hero__kicker" data-status={hero.kicker.status}><strong translate="no">SAIN MOTORS</strong><span className="corporate-hero__rule" aria-hidden="true" />{hero.kicker.value[locale]}</p>
        <h1 id="home-title" data-status={hero.title.status}>{hero.title.value[locale].split("\n").map((line, i, lines) => <span key={i}>{line}{i < lines.length - 1 ? " " : ""}</span>)}</h1>
        <p className="corporate-hero__lead" data-status={hero.text.status}>{hero.text.value[locale]}</p>
        <div className="actions"><Link className="button button--primary" href={pageHref(locale, "brands")} prefetch={false}>{hero.cta.label[locale]}<Icon name="arrowUpRight" size={19} /></Link>
          <Link className="button button--outline" href={pageHref(locale, "locations")} prefetch={false}>{hero.secondaryCta.label[locale]}</Link></div>
      </div>
      <figure className="corporate-hero__media"><HeroGallery labels={{ group: copy.photos, previous: copy.previousPhoto, next: copy.nextPhoto }}>
        {sitePhotos.homeHero.map((photo, i) => <Picture key={photo.key} photo={photo} locale={locale} sizes="(min-width: 84rem) 46rem, (min-width: 64rem) 55vw, 92vw" priority={i === 0} />)}
      </HeroGallery></figure>
    </section>
    <section className="section home-brands brand-band" aria-labelledby="brands-heading"><div className="container">
      <div className="section-head section-head--split"><h2 id="brands-heading" className="display-2">{copy.brands}</h2><p>{copy.brandsNote}</p></div>
      <div className="brand-panel-frame"><CorporateBrands brands={getBrands()} locale={locale} /></div>
    </div></section>
    <section className="section section--alt" aria-labelledby="home-company-heading"><div className="container editorial-split">
      <figure className="editorial-photo"><Picture photo={sitePhotos.story} locale={locale} sizes="(min-width: 64rem) 44vw, 92vw" /></figure>
      <div className="editorial-copy"><p className="eyebrow">SAIN MOTORS</p><h2 id="home-company-heading" className="display-2">{copy.company}</h2>
        <p data-status={company.introduction.status}>{company.introduction.value[locale].split("\n\n")[0]}</p>
        <dl className="company-numbers"><div><dt>{copy.showroom}</dt><dd>{locations.length.toString().padStart(2, "0")}</dd></div><div><dt>{copy.cities}</dt><dd>{new Set(locations.map(l => l.city.en)).size.toString().padStart(2, "0")}</dd></div></dl>
        <Link className="text-link" href={pageHref(locale, "about")} prefetch={false}>{copy.companyLink}<Icon name="arrowUpRight" size={19} /></Link>
      </div>
    </div></section>
    <section className="section" aria-labelledby="home-services-heading"><div className="container editorial-split editorial-split--service">
      <div className="editorial-copy"><p className="eyebrow">{locale === "mn" ? "ҮЙЛЧИЛГЭЭ" : "OUR SERVICES"}</p><h2 id="home-services-heading" className="display-2">{copy.service}</h2>
        <ul className="home-service-list">{services.map(service => <li key={service.id}><Link href={pageHref(locale, "services") + "#service-" + service.id} prefetch={false}><span>{service.title[locale]}</span><Icon name="arrowUpRight" size={19} /></Link></li>)}</ul>
        <Link className="text-link" href={pageHref(locale, "services")} prefetch={false}>{copy.serviceLink}<Icon name="chevronRight" size={19} /></Link>
      </div><figure className="editorial-photo"><Picture photo={sitePhotos.servicesTeaser} locale={locale} sizes="(min-width: 64rem) 44vw, 92vw" /></figure>
    </div></section>
    <section className="section section--alt" aria-labelledby="home-news-heading"><div className="container">
      <div className="section-head section-head--split"><h2 id="home-news-heading" className="display-2">{copy.news}</h2><Link className="text-link" href={pageHref(locale, "news")} prefetch={false}>{copy.newsLink}<Icon name="arrowUpRight" size={19} /></Link></div>
      <NewsList events={driveEvents} locale={locale} />
    </div></section>
    <section className="section contact-invitation" aria-labelledby="home-contact-heading"><div className="container"><div><h2 id="home-contact-heading" className="display-2">{copy.contact}</h2><p>{copy.contactBody}</p></div><div className="actions"><Link className="button button--primary" href={pageHref(locale, "locations")} prefetch={false}>{copy.locations}<Icon name="directions" size={19} /></Link><a className="button button--outline" href={contact.phone.href}><Icon name="phone" size={18} />{contact.phone.display}</a></div></div></section>
  </div>;
}
