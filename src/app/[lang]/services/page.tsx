import type { Metadata } from "next";
import { ServiceList } from "@/components/ServiceList";
import { LocationCard } from "@/components/LocationCard";
import { PageHero } from "@/components/PageHero";
import { Picture } from "@/components/Picture";
import { BrandScrollHero } from "@/components/BrandScrollHero";
import { getLocation, getPhoto, pages, sitePhotos, ui } from "@/content";
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
  const asset = getPhoto(photo.key);
  const aspectRatio = `${asset.width} / ${asset.height}`;

  return (
    <>
      <div className="photo-page-hero">
        <PageHero title={page.meta.value[locale].title} />
        <BrandScrollHero aspectRatio={aspectRatio}>
          <figure className="services-header brand-hero__image" style={{ backgroundColor: asset.color, aspectRatio }}>
            <Picture photo={photo} locale={locale} sizes={`(max-width: 639px) ${Math.max(100, Math.ceil(asset.width / asset.height * 125))}vw, 100vw`} priority />
          </figure>
        </BrandScrollHero>
      </div>
      <section className="section services-section">
        <div className="container services-page">
          <div>
            <ServiceList locale={locale} headingLevel="h2" />
            <p className="services-page__note">{ui.services.others[locale]}</p>
          </div>

          {/* The two places that repair and supply parts, with their own hours and lines. */}
          <aside className="services-page__aside" aria-label={ui.services.where[locale]}>
            <div className="location-list location-list--stacked">
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
    </>
  );
}
