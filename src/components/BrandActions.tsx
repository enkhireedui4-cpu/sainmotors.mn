import Link from "next/link";
import type { ReactNode } from "react";
import type { Brand } from "@/content/types";
import { experienceCopy } from "@/content/experience";
import { enquiryHref } from "@/lib/enquiries";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";

function BrandActionLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (href.startsWith("#")) return <a href={href} className={className}>{children}</a>;
  return <Link href={href} className={className} prefetch={false}>{children}</Link>;
}

export function BrandActions({ brand, locale, testDriveHref, salesHref, salesLabel }: { brand: Brand; locale: Locale; testDriveHref?: string; salesHref?: string; salesLabel?: string }) {
  const copy = experienceCopy.value[locale];
  return <nav className="brand-actions" data-brand-actions aria-label={locale === "mn" ? `${brand.name} — лавлах` : `${brand.name} enquiries`} data-status={experienceCopy.status}>
    <BrandActionLink className="button button--primary" href={salesHref ?? enquiryHref(locale, "sales", brand.slug)}>{salesLabel ?? copy.sales}<Icon name="arrowUpRight" size={18} /></BrandActionLink>
    <BrandActionLink className="button button--outline" href={testDriveHref ?? enquiryHref(locale, "test-drive", brand.slug)}>{copy.testDrive}</BrandActionLink>
    <Link className="text-link" href={enquiryHref(locale, "service", brand.slug)} prefetch={false}>{copy.service}<Icon name="chevronRight" size={17} /></Link>
  </nav>;
}
