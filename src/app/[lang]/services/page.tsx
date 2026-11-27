import type { Metadata } from "next";
import { ServiceList } from "@/components/ServiceList";
import { LocationCard } from "@/components/LocationCard";
import { PageBand } from "@/components/PageBand";
import { Picture } from "@/components/Picture";
import { getLocation, pages, sitePhotos, ui } from "@/content";
import { experienceCopy } from "@/content/experience";
import { draftAttr } from "@/lib/content-status";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "./services.css";

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

  return (
    <div className="services-design-page">
      <PageBand locale={locale} title={page.meta.value[locale].title} className="services-intro">
        <p className="services-intro__lead" data-status={draftAttr(page.lead)}>{page.lead.value[locale]}</p>
        <Picture
          photo={sitePhotos.servicesHeader}
          locale={locale}
          className="services-intro__photo"
          sizes="(min-width: 106rem) 49rem, (min-width: 48rem) 48vw, 86vw"
          priority
        />
      </PageBand>

      <div className="services-page">
        <section className="container services-section" aria-label={ui.nav.services[locale]}>
          <ServiceList locale={locale} headingLevel="h2" />
          <p className="services-page__note">{ui.services.others[locale]}</p>
        </section>

        <section className="services-centres" aria-labelledby="service-centres-heading">
          <div className="container">
            <h2 id="service-centres-heading" className="display-2 service-centres-heading">{experienceCopy.value[locale].serviceLocation}</h2>
            <div className="location-list location-list--centres">
              <LocationCard location={getLocation("service-centre")} locale={locale} />
              <LocationCard location={getLocation("byd-4s")} locale={locale} />
            </div>
          </div>
        </section>
      </div>

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
    </div>
  );
}
