import Link from "next/link";
import { contact } from "@/content/company";
import { corporateHome } from "@/content/corporate";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Icon } from "./Icon";

export function SiteInvitation({ locale }: { locale: Locale }) {
  const copy = corporateHome.value[locale];
  return <section className="site-invitation section" aria-labelledby="visit-heading" data-status={corporateHome.status}><div className="container site-invitation__panel">
    <div><h2 id="visit-heading">{copy.contact}</h2><p>{copy.contactBody}</p></div>
    <div className="actions"><Link className="button button--primary" href={pageHref(locale, "locations")} prefetch={false}>{copy.locations}<Icon name="directions" size={18} /></Link><a className="button button--outline" href={contact.phone.href}><Icon name="phone" size={18} />{contact.phone.display}</a></div>
  </div></section>;
}
