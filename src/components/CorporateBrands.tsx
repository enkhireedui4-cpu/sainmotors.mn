import Link from "next/link";
import { comingSoonMark } from "@/content";
import type { Brand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { brandHref } from "@/lib/routes";
import { BrandMark } from "./BrandMark";

/**
 * Every brand list on the site: one white panel of large, centred marks, each
 * one click from its brand page. The mark is the label; the link carries the name.
 * `comingSoon` fills the panel's last cell with Sain Motors' teaser (not a link).
 */
export function CorporateBrands({ brands, locale, comingSoon = false }: { brands: Brand[]; locale: Locale; comingSoon?: boolean }) {
  return <ul className="brand-panel" data-brand-directory>
    {brands.map(brand => <li key={brand.slug}>
      <Link href={brandHref(locale, brand.slug)} prefetch={false} aria-label={brand.name}><BrandMark brand={brand} locale={locale} decorative /></Link>
    </li>)}
    {comingSoon && <li className="brand-panel__soon">
      <img src={comingSoonMark.src} width={comingSoonMark.width} height={comingSoonMark.height} alt="COMING SOON" loading="lazy" decoding="async" />
      {/* The graphic's Mongolian line, set as text so it stays legible at cell size. */}
      <span lang="mn">ТУН УДАХГҮЙ</span>
    </li>}
  </ul>;
}
