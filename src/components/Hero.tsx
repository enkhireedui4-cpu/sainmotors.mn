import { BrandLink } from "./BrandLink";
﻿import Link from "next/link";
import type { CSSProperties } from "react";
import { getBrands, hero, sitePhotos } from "@/content";
import type { Locale } from "@/lib/i18n";
import { contentHref } from "@/lib/routes";
import { BrandMark } from "./BrandMark";
import { draftAttr } from "./HomeSections";
import { Icon } from "./Icon";
import { Picture } from "./Picture";
import { ScrollHero } from "./ScrollHero";

/**
 * Corporate statement over the company's own building: the number of brands
 * Sain Motors represents, then every one of their marks as a way in. One
 * load sequence (CSS, home.css): the photograph settles, the two lines rise
 * out of their masks, the copy follows and the marks arrive one by one.
 */
export function Hero({ locale }: { locale: Locale }) {
  const brands = getBrands();
  const count = String(brands.length);
  const lines = hero.title.value[locale].replace("{count}", count).split("\n");
  return (
    <ScrollHero labelledBy="hero-title" media={<Picture photo={sitePhotos.hero} locale={locale} sizes="(max-width: 40rem) 280vw, (max-width: 64rem) 220vw, 130vw" priority />}>
      <div className="container corporate-hero__inner">
        <h1 id="hero-title" data-status={draftAttr(hero.title)}>
          {lines.map((line, i) => (
            <span key={line} className="corporate-hero__line" style={{ "--line": i } as CSSProperties}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className="corporate-hero__description" data-status={draftAttr(hero.text)}>{hero.text.value[locale].replace("{count}", count)}</p>
        <div className="corporate-hero__actions">
          <Link className="button button--outline corporate-hero__cta" href="#brands-heading">
            {hero.cta.label[locale]}<Icon name="chevronRight" size={18} />
          </Link>
          <Link className="corporate-hero__secondary" href={contentHref(locale, hero.secondaryCta.href)}>
            {hero.secondaryCta.label[locale]}<Icon name="chevronRight" size={16} />
          </Link>
        </div>
        <ul className="corporate-hero__brands" aria-label={locale === "mn" ? `${count} брэнд` : `${count} brands`}>
          {brands.map((brand, i) => (
            <li key={brand.slug} style={{ "--i": i } as CSSProperties}>
              <BrandLink locale={locale} slug={brand.slug} aria-label={brand.name}>
                <BrandMark brand={brand} locale={locale} size="small" decorative onDark lazy={false} />
              </BrandLink>
            </li>
          ))}
        </ul>
      </div>
    </ScrollHero>
  );
}
