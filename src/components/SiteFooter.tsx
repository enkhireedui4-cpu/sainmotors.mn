import Link from "next/link";
import { company, sainLogos, socials, ui } from "@/content";
import type { Locale } from "@/lib/i18n";
import { footerPages, pageHref } from "@/lib/routes";
import { Icon } from "./Icon";
import "./site-footer.css";

export function SiteFooter({ locale }: { locale: Locale }) {
  const logo = sainLogos["sain-on-dark"];
  const description = locale === "mn"
    ? "Улаанбаатар, Дархан, Эрдэнэт хотод байрлах манай шоурумуудад ирж брэндүүдтэй маань танилцаарай."
    : "Visit our showrooms in Ulaanbaatar, Darkhan and Erdenet to explore our brands.";
  return <footer className="site-footer orbis-footer on-dark">
    <div className="orbis-footer__inner">
      <div className="orbis-footer__brand">
        <Link href={pageHref(locale, "home")} aria-label={ui.home[locale]}><img src={logo.src} width={logo.width} height={logo.height} alt="" loading="lazy" /></Link>
        <p>{company.distributorClaim.value[locale]} {description}</p>
        <p>{company.officeAddress.value[locale]}</p>
        <Link className="orbis-footer__privacy" href={pageHref(locale, "privacy")}>{ui.footer.privacy[locale]}</Link>
      </div>
      <div className="orbis-footer__right">
        <nav aria-label={ui.footer.explore[locale]}>
          {footerPages.map(page => <Link key={page} href={pageHref(locale, page)}>{ui.nav[page][locale]}</Link>)}
        </nav>
        <div className="orbis-footer__bottom">
          <div className="orbis-footer__socials" aria-label={ui.footer.follow[locale]}>
            {socials.map(social => <a key={social.id} href={social.url} rel="noopener" aria-label={`${social.label} — ${ui.external[locale]}`}><Icon name={social.id} size={19} /></a>)}
          </div>
          <p>2026 © www.sainmotors.mn</p>
          <a className="orbis-footer__top" href="#top">{locale === "mn" ? "Дээшээ" : "Back to top"}<svg width="13" height="9" viewBox="0 0 13 9" fill="none" stroke="currentColor" aria-hidden="true"><path d="m1 7 5.5-5.5L12 7" /></svg></a>
        </div>
      </div>
    </div>
  </footer>;
}
