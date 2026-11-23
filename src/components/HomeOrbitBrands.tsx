import Link from "next/link";
import { BrandLink } from "./BrandLink";
import type { Brand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { BrandWordmark } from "./BrandWordmark";
import { Icon } from "./Icon";

export function HomeOrbitBrands({ brands, locale }: { brands: Brand[]; locale: Locale }) {
  const heading = locale === "mn"
    ? `Бид дараах ${brands.length} автомашины брэндтэй хамтран ажилладаг.`
    : `We work with the following ${brands.length} automotive brands.`;

  return (
    <section id="home-brands" className="orbit-brands" aria-labelledby="orbit-brands-heading">
      <div className="orbit-brands__inner">
        <h2 id="orbit-brands-heading">{heading}</h2>
        <ul className="orbit-brands__list">
          {brands.map(brand => (
              <li key={brand.slug}>
                <BrandLink locale={locale} slug={brand.slug} prefetch={false} aria-label={brand.name} title={brand.name}>
                  <BrandWordmark brand={brand} locale={locale} className="orbit-brands__mark"/>
                  <span className="orbit-brands__name" translate="no">{brand.name}</span>
                </BrandLink>
              </li>
          ))}
        </ul>
        <Link className="button button--primary orbit-brands__all" href={pageHref(locale, "brands")} prefetch={false}>
          {locale === "mn" ? "Бүх брэнд харах" : "View all brands"}
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </section>
  );
}
