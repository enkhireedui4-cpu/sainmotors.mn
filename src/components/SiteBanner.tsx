import Link from "next/link";
import type { Photo } from "@/content/types";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Picture } from "./Picture";

/** Shared photographic introduction for the corporate information pages. */
export function SiteBanner({ title, lead, photo, locale, leadDraft = false }: { title: string; lead?: string; photo: Photo; locale: Locale; leadDraft?: boolean }) {
  return <section className="site-banner" aria-labelledby="page-title">
    <Picture photo={photo} locale={locale} sizes="100vw" priority />
    <div className="container site-banner__content"><div><h1 id="page-title">{title}</h1>{lead && <p className="site-banner__lead" data-status={leadDraft ? "draft" : undefined}>{lead}</p>}</div>
      <nav className="site-banner__breadcrumb" aria-label={ui.breadcrumb[locale]}><Link href={pageHref(locale, "home")} prefetch={false}>Sain Motors</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
    </div>
  </section>;
}
