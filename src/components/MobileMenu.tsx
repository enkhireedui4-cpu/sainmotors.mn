"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { isCurrentSection, type NavLinkItem } from "./NavLinks";

interface MobileMenuProps {
  locale: Locale;
  links: NavLinkItem[];
  homeHref: string;
  logo: { src: string; width: number; height: number };
  labels: { menu: string; close: string; nav: string; home: string; language: string };
  phone: { display: string; href: string };
  email: string;
}

/**
 * Full-screen navigation for small screens, built on <dialog>: the browser
 * traps focus, closes on Escape and returns focus to the menu button.
 */
export function MobileMenu({ locale, links, homeHref, logo, labels, phone, email }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="menu-button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
      >
        <Icon name="menu" size={22} />
        <span className="sr-only">{labels.menu}</span>
      </button>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        className="mobile-menu"
        aria-label={labels.menu}
        onClose={() => setOpen(false)}
      >
        <div className="container mobile-menu__top">
          <Link href={homeHref} aria-label={labels.home} onClick={close}>
            <img src={logo.src} width={logo.width} height={logo.height} alt="" />
          </Link>
          <button type="button" className="mobile-menu__close" onClick={close}>
            <Icon name="close" size={22} />
            {labels.close}
          </button>
        </div>
        <nav className="container mobile-menu__nav" aria-label={labels.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              aria-current={isCurrentSection(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
              <Icon name="chevronRight" size={22} />
            </Link>
          ))}
        </nav>
        <div className="container mobile-menu__foot">
          <LanguageSwitcher locale={locale} label={labels.language} />
          <a href={phone.href}>{phone.display}</a>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </dialog>
    </>
  );
}
