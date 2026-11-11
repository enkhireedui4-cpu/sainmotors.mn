import type { Metadata } from "next";
import Link from "next/link";
import { HomeBrandStrip } from "@/components/HomeBrandStrip";
import { HomeBrandShowcase } from "@/components/HomeBrandShowcase";
import "../brand-marquee.css";
import "../brand-spotlight.css";
import "../home-viewport.css";
import { HomeVideoHero } from "@/components/HomeVideoHero";
import { Icon } from "@/components/Icon";
import { NewsList } from "@/components/NewsList";
import { Picture } from "@/components/Picture";
import { CompanyFacts } from "@/components/CompanyFacts";
import { SiteInvitation } from "@/components/SiteInvitation";
import { company, driveEvents, pages, services, sitePhotos } from "@/content";
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
  return <div className="corporate-home">
    <HomeVideoHero locale={locale} title={company.distributorClaim.value[locale]} />
    <section className="section home-brands brand-band" aria-labelledby="brands-heading"><div className="container">
      <div className="section-head section-head--portfolio"><h2 id="brands-heading">{copy.brands}</h2></div>
      <div className="brand-panel-frame"><HomeBrandStrip locale={locale} /></div>
    </div></section>
    <HomeBrandShowcase locale={locale} />
    <section className="section section--alt" aria-labelledby="home-company-heading"><div className="container editorial-split">
      <figure className="editorial-photo"><Picture photo={sitePhotos.story} locale={locale} sizes="(min-width: 64rem) 44vw, 92vw" /></figure>
      <div className="editorial-copy"><h2 id="home-company-heading" className="display-2">{copy.company}</h2>
        <p data-status={company.introduction.status}>{company.introduction.value[locale].split("\n\n")[0]}</p>
        <CompanyFacts locale={locale} />
        <Link className="text-link" href={pageHref(locale, "about")} prefetch={false}>{copy.companyLink}<Icon name="arrowUpRight" size={19} /></Link>
      </div>
    </div></section>
    <section className="section" aria-labelledby="home-services-heading"><div className="container editorial-split editorial-split--service">
      <div className="editorial-copy"><h2 id="home-services-heading" className="display-2">{copy.service}</h2>
        <ul className="home-service-list">{services.map(service => <li key={service.id}><Link href={pageHref(locale, "services") + "#service-" + service.id} prefetch={false}><span>{service.title[locale]}</span><Icon name="arrowUpRight" size={19} /></Link></li>)}</ul>
        <Link className="text-link" href={pageHref(locale, "services")} prefetch={false}>{copy.serviceLink}<Icon name="chevronRight" size={19} /></Link>
      </div><figure className="editorial-photo"><Picture photo={sitePhotos.servicesTeaser} locale={locale} sizes="(min-width: 64rem) 44vw, 92vw" /></figure>
    </div></section>
    <section className="section section--alt" aria-labelledby="home-news-heading"><div className="container">
      <div className="section-head section-head--split"><h2 id="home-news-heading" className="display-2">{copy.news}</h2><Link className="text-link" href={pageHref(locale, "news")} prefetch={false}>{copy.newsLink}<Icon name="arrowUpRight" size={19} /></Link></div>
      <NewsList events={driveEvents} locale={locale} />
    </div></section>
    <SiteInvitation locale={locale} />
  </div>;
}
