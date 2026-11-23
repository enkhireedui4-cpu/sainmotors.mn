import Link from "next/link";
import { getBrands } from "@/content";
import type { Locale } from "@/lib/i18n";
import { brandHref, isExternal } from "@/lib/routes";
import { BrandWordmark } from "./BrandWordmark";
import { Icon } from "./Icon";

const actions = {
  mn: { website: "Албан ёсны сайт", details: "Дэлгэрэнгүй үзэх" },
  en: { website: "Official website", details: "View details" },
};

export function BrandPortfolio({ locale }: { locale: Locale }) {
  const labels = actions[locale];
  return (
    <ul className="discovery-grid" id="brand-results" data-brand-directory>
      {getBrands().map(brand => {
        const description = brand.directoryIntro ?? brand.teaser;
        const href = brandHref(locale, brand.slug);
        const external = href !== undefined && isExternal(href);
        const nameId = `discover-${brand.slug}-name`;
        const actionId = `discover-${brand.slug}-action`;
        const introduction = <>
          <div className="discovery-card__identity">
            <BrandWordmark brand={brand} locale={locale} />
          </div>
          <h2 id={nameId} translate="no">{brand.name}</h2>
          {description && <p data-status={description.status}>{description.value[locale]}</p>}
        </>;
        return (
          <li className="discovery-card" key={brand.slug}>
            {href ? (
              <Link className="discovery-card__body" href={href} prefetch={false} aria-labelledby={`${nameId} ${actionId}`}>
                {introduction}
                <span id={actionId} className="discovery-card__action">
                  {external ? labels.website : labels.details}
                  <Icon name={external ? "arrowUpRight" : "arrowRight"} size={17} />
                </span>
              </Link>
            ) : <div className="discovery-card__body">{introduction}</div>}
          </li>
        );
      })}
    </ul>
  );
}
