"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkItem {
  href: string;
  label: string;
}

const trim = (path: string) => path.replace(/\/+$/, "");

/** True for the page itself and anything below it (a brand page keeps "Brands" active). */
export function isCurrentSection(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const current = trim(pathname);
  const target = trim(href);
  return current === target || current.startsWith(`${target}/`);
}

export function NavLinks({ links, label }: { links: NavLinkItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label={label}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={false}
          className="site-nav__link"
          aria-current={isCurrentSection(pathname, link.href) ? "page" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
