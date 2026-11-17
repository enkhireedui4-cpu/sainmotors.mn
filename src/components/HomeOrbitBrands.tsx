import Link from "next/link";
import type { Brand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { brandHref } from "@/lib/routes";
import { BrandWordmark } from "./BrandWordmark";

export function HomeOrbitBrands({ brands, locale }: { brands: Brand[]; locale: Locale }) {
  const heading = locale === "mn"
    ? `Бид дэлхийн ${brands.length} автомашины брэндтэй хамтран ажилладаг.`
    : `We work with ${brands.length} global automotive brands.`;
  const description = locale === "mn"
    ? "Sain Motors-той хамт та зүгээр нэг автомашин сонгохгүй — амьдрал, аяллынхаа төгс ханьтай учирна!"
    : "With Sain Motors, you don’t just choose a car — you find your ideal car companion for life and travel!";

  return (
    <section id="home-brands" className="orbit-brands" aria-labelledby="orbit-brands-heading">
      <div className="orbit-brands__inner">
        <h2 id="orbit-brands-heading">{heading}</h2>
        <p className="orbit-brands__description">{description}</p>
        <ul className="orbit-brands__list">
          {brands.map(brand => (
              <li key={brand.slug}>
                <Link href={brandHref(locale, brand.slug)} prefetch={false} aria-label={brand.name} title={brand.name}>
                  <BrandWordmark brand={brand} locale={locale} className="orbit-brands__mark"/>
                  <span className="orbit-brands__name" translate="no">{brand.name}</span>
                </Link>
              </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
