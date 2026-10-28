import Link from "next/link";
import { getBrands, getLocation } from "@/content";
import { brandSegments, experienceCopy } from "@/content/experience";
import type { Locale } from "@/lib/i18n";
import { brandHref } from "@/lib/routes";
import { BrandCatalogue } from "./BrandCatalogue";
import { BrandMark } from "./BrandMark";
import { Icon } from "./Icon";
import { Picture } from "./Picture";

export function BrandPortfolio({ locale }: { locale: Locale }) {
  const copy = experienceCopy.value[locale];
  const entries = getBrands().map(brand => {
    const photo = brand.cardPhoto ?? brand.photo;
    const description = brand.cardCopy ?? brand.teaser;
    const location = brand.location ? getLocation(brand.location) : undefined;
    return {
      slug: brand.slug,
      search: [brand.name, brand.summary.value[locale], ...(brand.models ?? []), ...(brand.gallery ?? []).map(item => item.caption ?? "")].join(" "),
      categories: brandSegments.filter(segment => (segment.brands as readonly string[]).includes(brand.slug)).map(segment => segment.id),
      content: <Link href={brandHref(locale, brand.slug)} prefetch={false} aria-label={brand.name} aria-describedby={`discover-${brand.slug}-description`}>
        <div className="discovery-card__image">{photo && <Picture photo={photo} locale={locale} sizes="(min-width: 90rem) 26rem, (min-width: 64rem) 30vw, (min-width: 40rem) 44vw, 90vw" />}</div>
        <div className="discovery-card__body"><div className="discovery-card__identity"><BrandMark brand={brand} locale={locale} decorative /><Icon name="arrowUpRight" size={23} /></div>
          <h2 className="sr-only" translate="no">{brand.name}</h2><p id={`discover-${brand.slug}-description`} data-status={description.status}>{description.value[locale].replace(/\n/g, " ")}</p>
          {brand.models?.length ? <span className="discovery-card__meta" translate="no">{brand.models.join(" / ")}</span> : location && <span className="discovery-card__meta">{location.name[locale]}</span>}
        </div>
      </Link>,
    };
  });
  return <div data-status={experienceCopy.status}>
    <BrandCatalogue entries={entries} categories={brandSegments.map(segment => ({ id: segment.id, label: segment.label[locale] }))} labels={copy} />
    <p className="discovery-note">{copy.availability}</p>
  </div>;
}
