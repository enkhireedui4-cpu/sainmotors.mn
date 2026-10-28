import type { Metadata } from "next";
import Link from "next/link";
import { ServiceList } from "@/components/ServiceList";
import { LocationCard } from "@/components/LocationCard";
import { SiteBanner } from "@/components/SiteBanner";
import { SiteInvitation } from "@/components/SiteInvitation";
import { Picture } from "@/components/Picture";
import { getLocation, pages, services, sitePhotos, ui } from "@/content";
import { experienceCopy } from "@/content/experience";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.services.meta.value[locale];
  return pageMetadata({ locale, path: "services", title: meta.title, description: meta.description });
}

export default async function ServicesPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const page = pages.services;
  const team = page.team.value[locale];
  const photo = sitePhotos.servicesHeader;

  return (
    <div className="services-design-page">
      <SiteBanner title={page.meta.value[locale].title} lead={page.lead.value[locale]} leadDraft locale={locale} photo={photo} />
        <nav className="container service-jump" aria-label={ui.nav.services[locale]}>{services.map(service => <Link key={service.id} href={`#service-${service.id}`} prefetch={false}>{service.title[locale]}</Link>)}</nav>
      <section className="section services-section">
        <div className="container services-page">
          <div>
            <ServiceList locale={locale} headingLevel="h2" />
            <p className="services-page__note">{ui.services.others[locale]}</p>
          </div>

          {/* The two places that repair and supply parts, with their own hours and lines. */}
          <aside className="services-page__aside" aria-label={ui.services.where[locale]}>
            <h2 className="display-2 service-centres-heading">{experienceCopy.value[locale].serviceLocation}</h2>
            <div className="location-list location-list--centres">
              <LocationCard location={getLocation("service-centre")} locale={locale} />
              <LocationCard location={getLocation("byd-4s")} locale={locale} />
            </div>
          </aside>
        </div>
      </section>

      <section className="services-team" aria-labelledby="team-heading">
        <div className="container section-head section-head--split services-team__head">
          <h2 id="team-heading" className="display-2" data-status={page.team.status === "draft" ? "draft" : undefined}>{team.heading}</h2>
          <p data-status={page.team.status === "draft" ? "draft" : undefined}>{team.body}</p>
        </div>
        <div className="container service-photo-grid">
          {sitePhotos.serviceGallery.map(photo => <figure key={photo.key}>
            <Picture photo={photo} locale={locale} sizes="(min-width: 64rem) 30vw, 45vw" />
            <figcaption>{photo.label?.[locale]}</figcaption>
          </figure>)}
        </div>
      </section>
      <SiteInvitation locale={locale} />
    </div>
  );
}
