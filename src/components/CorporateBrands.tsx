import Link from "next/link";
import type { Brand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { brandHref } from "@/lib/routes";
import { BrandMark } from "./BrandMark";

/**
 * Every brand list on the site: one white panel of large, centred marks, each
 * one click from its brand page. The mark is the label; the link carries the name.
 */
export function CorporateBrands({ brands, locale, descriptive = false, eager = false }: { brands: Brand[]; locale: Locale; descriptive?: boolean; eager?: boolean }) {
  return <ul className={`brand-panel${descriptive ? " brand-panel--descriptive" : ""}`} data-brand-directory>
    {brands.map(brand => <li key={brand.slug}>
      <Link href={brandHref(locale, brand.slug)} prefetch={false} aria-label={brand.name} title={brand.name}><BrandMark brand={brand} locale={locale} decorative lazy={!eager} />{descriptive && <span className="brand-panel__description" data-status={(brand.cardCopy ?? brand.teaser).status}>{(brand.cardCopy ?? brand.teaser).value[locale].split("\n")[0]}</span>}</Link>
    </li>)}
  </ul>;
}
