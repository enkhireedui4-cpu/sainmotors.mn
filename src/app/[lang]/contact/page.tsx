import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { Picture } from "@/components/Picture";
import { contact, pages, sitePhotos, socials, ui } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.contact.meta.value[locale];
  return pageMetadata({ locale, path: "contact", title: meta.title, description: meta.description });
}
export default async function ContactPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const page = pages.contact;
  return <>
    <PageHero title={page.meta.value[locale].title} lead={page.lead.value[locale]} leadDraft={page.lead.status === "draft"} />
    <section className="section--contact" aria-labelledby="general-heading"><div className="container contact-more">
      <div className="contact-more__lists"><div><h2 id="general-heading" className="heading-2 mb-4">{ui.contact.general[locale]}</h2>
        <ul><li><a className="text-link" href={contact.phone.href}><Icon name="phone" size={20} />{contact.phone.display}</a></li>
          <li><a className="text-link" href={"mailto:" + contact.email}><Icon name="mail" size={20} />{contact.email}</a></li></ul>
      </div><div><h2 className="heading-3 mb-4">{ui.contact.social[locale]}</h2><ul>{socials.map(social => <li key={social.id}><a className="text-link" href={social.url} rel="noopener"><Icon name={social.id} size={18} />{social.label}<span className="sr-only"> {ui.external[locale]}</span></a></li>)}</ul></div></div>
      <figure className="contact-more__photo"><Picture photo={sitePhotos.hero} locale={locale} sizes="(min-width: 64rem) 45vw, 92vw" priority /></figure>
    </div></section>
    <section className="section"><nav className="container contact-shortcuts" aria-label={ui.mainNav[locale]}>{(["brands","locations","services"] as const).map(key => <Link key={key} href={pageHref(locale,key)} prefetch={false}>{ui.nav[key][locale]}<Icon name="arrowUpRight" size={19} /></Link>)}</nav></section>
  </>;
}
