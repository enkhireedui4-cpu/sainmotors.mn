import Link from "next/link";
import { contact, sainLogos, ui } from "@/content";
import type { Locale } from "@/lib/i18n";
import { navPages, pageHref } from "@/lib/routes";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function SiteHeader({ locale }: { locale: Locale }) {
  const logo = sainLogos["sain-color"];
  const homeHref = pageHref(locale, "home");
  const links = navPages.map((page) => ({ href: pageHref(locale, page), label: ui.nav[page][locale] }));

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href={homeHref} className="site-logo" aria-label={ui.home[locale]}>
          <img src={logo.src} width={logo.width} height={logo.height} alt="" />
        </Link>
        <NavLinks links={links} label={ui.mainNav[locale]} />
        <LanguageSwitcher locale={locale} label={ui.language[locale]} />
        <MobileMenu
          locale={locale}
          links={links}
          homeHref={homeHref}
          logo={logo}
          phone={contact.phone}
          email={contact.email}
          labels={{
            menu: ui.menu[locale],
            close: ui.closeMenu[locale],
            nav: ui.mainNav[locale],
            home: ui.home[locale],
            language: ui.language[locale],
          }}
        />
      </div>
    </header>
  );
}
