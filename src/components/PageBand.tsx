import Link from "next/link";
import type { ReactNode } from "react";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";

type Crumb = { href: string; label: string };

/** Orbis-style arrival shared by every inner page: a black band with breadcrumb, centred h1 and optional chips. */
export function PageBand({ locale, title, crumbs = [], children, className, id = "page-title", translate }: {
  locale: Locale;
  title: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  className?: string;
  id?: string;
  translate?: "no";
}) {
  const trail = [{ href: pageHref(locale, "home"), label: ui.homeCrumb[locale] }, ...crumbs];
  return (
    <section className={className ? `page-band ${className}` : "page-band"} aria-labelledby={id}>
      <nav className="page-band__crumbs" aria-label={ui.breadcrumb[locale]}>
        {trail.map((crumb) => (
          <span key={crumb.href} className="page-band__crumb">
            <Link href={crumb.href} prefetch={false}>{crumb.label}</Link>
            <span className="page-band__slash" aria-hidden="true">/</span>
          </span>
        ))}
      </nav>
      <h1 id={id} className="page-band__title" translate={translate}>{title}</h1>
      {children && <div className="page-band__extra">{children}</div>}
    </section>
  );
}
