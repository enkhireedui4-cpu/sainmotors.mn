import Link from "next/link";
import type { Brand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { brandHref } from "@/lib/routes";
import { BrandMark } from "./BrandMark";

/**
 * Every brand list on the site: one white panel of large, centred marks, each
 * one click from its brand page. The mark is the label; the link carries the name.
 */
export function CorporateBrands({ brands, locale }: { brands: Brand[]; locale: Locale }) {
  return <ul className="brand-panel" data-brand-directory>
    {brands.map(brand => <li key={brand.slug}>
      <Link href={brandHref(locale, brand.slug)} prefetch={false} aria-label={brand.name}><BrandMark brand={brand} locale={locale} decorative /></Link>
    </li>)}
  </ul>;
}
