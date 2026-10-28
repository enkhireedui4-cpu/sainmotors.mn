import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { draftAttr } from "@/lib/content-status";
import { Icon } from "@/components/Icon";
import { SiteBanner } from "@/components/SiteBanner";
import { SiteInvitation } from "@/components/SiteInvitation";
import { CompanyFacts } from "@/components/CompanyFacts";
import { Picture } from "@/components/Picture";
import { company, getBrand, pages, sitePhotos, ui } from "@/content";
import type { Locale } from "@/lib/i18n";
import { brandHref, pageHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.about.meta.value[locale];
  return pageMetadata({ locale, path: "about", title: meta.title, description: meta.description });
}

export default async function AboutPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const page = pages.about;
  const photo = sitePhotos.aboutHeader;

  return (
    <div className="about-page">
      <SiteBanner title={page.meta.value[locale].title} lead={page.lead.value[locale]} leadDraft locale={locale} photo={photo} />
      <section className="container company-introduction"><p data-status={company.distributorClaim.status}>{company.distributorClaim.value[locale]}</p><CompanyFacts locale={locale} /></section>

      <section className="section">
        <div className="container prose-grid">
          {page.sections.map((section) => (
            <section key={section.value.en.heading} data-status={draftAttr(section)}>
              <h2 className="heading-2">{section.value[locale].heading}</h2>
              <p>{section.value[locale].body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="milestones-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="milestones-heading" className="heading-2" data-status={draftAttr(page.milestones)}>
              {page.milestones.value[locale].heading}
            </h2>
            <p data-status={draftAttr(page.milestones)}>{page.milestones.value[locale].body}</p>
          </div>
          <ol className="timeline" data-status={draftAttr(company.milestones)}>
            {company.milestones.items.map((item) => (
              <li key={item.year}>
                <p className="timeline__year">{item.year}</p>
                <ul className="timeline__brands">
                  {item.brands.map((slug) => {
                    const brand = getBrand(slug);
                    if (!brand) return null;
                    return (
                      <li key={slug}>
                        <Link href={brandHref(locale, slug)} aria-label={brand.name}>
                          <BrandMark brand={brand} locale={locale} size="small" decorative />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container about-close">
          <figure>
            <Picture photo={sitePhotos.aboutDetail} locale={locale} sizes="(min-width: 60rem) 44rem, 100vw" />
          </figure>
          <div className="about-close__copy" data-status={draftAttr(page.closing)}>
            <h2 className="heading-2">{page.closing.value[locale].heading}</h2>
            <p>{page.closing.value[locale].body}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link className="button button--primary" href={pageHref(locale, "locations")}>
                {ui.nav.locations[locale]}
                <Icon name="chevronRight" size={18} />
              </Link>
              <Link className="button button--outline" href={pageHref(locale, "brands")}>
                {ui.nav.brands[locale]}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteInvitation locale={locale} />
    </div>
  );
}
