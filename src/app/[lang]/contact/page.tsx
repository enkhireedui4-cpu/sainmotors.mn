import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ContactJourney } from "@/components/ContactJourney";
import { Picture } from "@/components/Picture";
import { contact, getLocation, pages, sitePhotos, socials, ui } from "@/content";
import { contactPresentation } from "@/content/experience";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import "@/app/contact.css";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.contact.meta.value[locale];
  return pageMetadata({ locale, path: "contact", title: meta.title, description: meta.description });
}
export default async function ContactPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const title = pages.contact.meta.value[locale].title;
  const copy = contactPresentation.value[locale];
  const showroom = getLocation("jetour-c1");
  const teamPhoto = sitePhotos.showroomTour.find(photo => photo.key === "showroom-advice") ?? sitePhotos.story;
  const emailHref = (subject: string) => `mailto:${contact.email}?subject=${encodeURIComponent(`[Sain Motors] ${subject}`)}`;
  return <div className="contact-page">
    <section className="contact-hero" aria-labelledby="contact-title">
      <Picture photo={sitePhotos.hero} locale={locale} sizes="100vw" priority />
      <div className="container contact-hero__content"><h1 id="contact-title">{title}</h1>
        <nav className="contact-hero__breadcrumb" aria-label={ui.breadcrumb[locale]}><Link href={pageHref(locale, "home")} prefetch={false}>Sain Motors</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      </div>
    </section>
    <section className="container contact-overview" data-contact-overview aria-label={ui.contact.general[locale]}>
      <figure className="contact-overview__photo"><Picture photo={teamPhoto} locale={locale} sizes="(min-width: 64rem) 44vw, 92vw" /></figure>
      <div className="contact-overview__cards" data-status={contactPresentation.status}>
        <a className="contact-card contact-card--address" href={showroom.map.url} rel="noopener" aria-labelledby="contact-address-heading" data-status={showroom.status}>
          <span className="contact-card__icon"><Icon name="directions" size={21} /></span>
          <div><h2 id="contact-address-heading">{copy.address}</h2><p className="contact-card__showroom" translate="no">{copy.showroom}</p><address>{showroom.address[locale]}{showroom.landmark && <span>{showroom.landmark[locale]}</span>}</address><span className="contact-card__action">{copy.map}<Icon name="arrowUpRight" size={16} /></span></div>
        </a>
        <a className="contact-card contact-card--phone" href={contact.phone.href} aria-labelledby="contact-phone-heading contact-phone-value"><span className="contact-card__icon"><Icon name="phone" size={21} /></span><div><h2 id="contact-phone-heading">{copy.phone}</h2><p id="contact-phone-value">{locale === "en" ? "+976 " : ""}{contact.phone.display}</p></div></a>
        <a className="contact-card contact-card--email" href={`mailto:${contact.email}`} aria-labelledby="contact-email-heading contact-email-value"><span className="contact-card__icon"><Icon name="mail" size={21} /></span><div><h2 id="contact-email-heading">{copy.email}</h2><p id="contact-email-value">{contact.email}</p></div></a>
      </div>
    </section>
    <div className="container contact-social-row"><p>{copy.social}</p><ul>{socials.map(social => <li key={social.id}><a href={social.url} rel="noopener"><Icon name={social.id} size={18} />{social.label}<span className="sr-only"> {ui.external[locale]}</span></a></li>)}</ul><Link className="text-link" href={pageHref(locale, "locations")} prefetch={false}>{copy.locations}<Icon name="arrowUpRight" size={17} /></Link></div>
    <section className="contact-requests" aria-labelledby="contact-requests-heading" data-status={contactPresentation.status}><div className="container">
      <div className="contact-requests__heading"><h2 id="contact-requests-heading">{copy.requestsTitle}</h2><p>{copy.requestsBody}</p></div>
      <div className="contact-accordions">
        <details open><summary>{copy.brandRequest}<Icon name="chevronRight" size={21} /></summary><div className="contact-accordion__body"><ContactJourney locale={locale} embedded /></div></details>
        <details><summary>{copy.companyRequest}<Icon name="chevronRight" size={21} /></summary><div className="contact-accordion__body contact-accordion__body--text"><p>{copy.companyBody}</p><a className="text-link" href={emailHref(copy.companyRequest)}><Icon name="mail" size={18} />{contact.email}<Icon name="arrowUpRight" size={17} /></a></div></details>
        <details><summary>{copy.careersRequest}<Icon name="chevronRight" size={21} /></summary><div className="contact-accordion__body contact-accordion__body--text"><p>{copy.careersBody}</p><a className="text-link" href={emailHref(copy.careersRequest)}><Icon name="mail" size={18} />{contact.email}<Icon name="arrowUpRight" size={17} /></a></div></details>
      </div>
    </div></section>
  </div>;
}
