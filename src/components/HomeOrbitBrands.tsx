import Link from "next/link";
import type { CSSProperties } from "react";
import { getLogo } from "@/content";
import type { Brand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { brandHref } from "@/lib/routes";
import { BrandMark } from "./BrandMark";

// Wordmark bounds within the supplied logos; the emblem stays outside the viewport.
const wordmarkBounds: Record<string, { x: number; y: number; width: number; height: number } | undefined> = {
  bestune: { x: 113, y: 48, width: 525, height: 52 },
  maxus: { x: 188, y: 30, width: 454, height: 46 },
  hongqi: { x: 110, y: 52, width: 517, height: 56 },
};

// Optical correction so heavy/narrow wordmarks read the same size as thin/wide ones.
const markScale: Record<string, number | undefined> = {
  "212": 0.72,
  rely: 0.9,
  soueast: 1.12,
  hongqi: 1.06,
};

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
          {brands.map(brand => {
            const logo = getLogo(brand.slug);
            const bounds = logo ? wordmarkBounds[brand.slug] ?? { x: 0, y: 0, width: logo.width, height: logo.height } : undefined;
            const style = logo && bounds ? {
              "--wordmark-aspect": bounds.width / bounds.height,
              "--mark-scale": markScale[brand.slug] ?? 1,
              "--wordmark-source-width": `${logo.width / bounds.width * 100}%`,
              "--wordmark-source-height": `${logo.height / bounds.height * 100}%`,
              "--wordmark-offset-x": `${-bounds.x / bounds.width * 100}%`,
              "--wordmark-offset-y": `${-bounds.y / bounds.height * 100}%`,
            } as CSSProperties : undefined;
            return (
              <li key={brand.slug}>
                <Link href={brandHref(locale, brand.slug)} prefetch={false} aria-label={brand.name} title={brand.name}>
                  <span className="orbit-brands__mark" style={style}><BrandMark brand={brand} locale={locale} decorative /></span>
                  <span className="orbit-brands__name" translate="no">{brand.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
