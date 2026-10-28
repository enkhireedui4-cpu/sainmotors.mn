import Link from "next/link";
import type { Brand } from "@/content/types";
import { experienceCopy } from "@/content/experience";
import { enquiryHref } from "@/lib/enquiries";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";

export function BrandActions({ brand, locale }: { brand: Brand; locale: Locale }) {
  const copy = experienceCopy.value[locale];
  return <nav className="brand-actions" data-brand-actions aria-label={locale === "mn" ? `${brand.name} — лавлах` : `${brand.name} enquiries`} data-status={experienceCopy.status}>
    <Link className="button button--primary" href={enquiryHref(locale, "sales", brand.slug)} prefetch={false}>{copy.sales}<Icon name="arrowUpRight" size={18} /></Link>
    <Link className="button button--outline" href={enquiryHref(locale, "test-drive", brand.slug)} prefetch={false}>{copy.testDrive}</Link>
    <Link className="text-link" href={enquiryHref(locale, "service", brand.slug)} prefetch={false}>{copy.service}<Icon name="chevronRight" size={17} /></Link>
  </nav>;
}
