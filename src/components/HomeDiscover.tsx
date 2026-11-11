import Link from "next/link";
import { getBrand, homeDiscover, sitePhotos } from "@/content";
import type { Locale } from "@/lib/i18n";
import { brandHref, pageHref } from "@/lib/routes";
import { FeatureTabs } from "./FeatureTabs";
import { Icon } from "./Icon";
import { Picture } from "./Picture";

export function HomeDiscover({ locale }: { locale: Locale }) {
  const copy = homeDiscover.value[locale];
  const electric = getBrand("byd")?.gallery?.find(photo => photo.key === "brand-byd-atto3-coast");
  const adventure = getBrand("jetour")?.cardPhoto;
  if (!electric || !adventure) throw new Error("Homepage editorial photography is missing from the brand records.");
  const features = [
    { id: "electric", photo: electric, href: brandHref(locale, "byd") },
    { id: "adventure", photo: adventure, href: brandHref(locale, "jetour") },
    { id: "guidance", photo: sitePhotos.showroomBand, href: pageHref(locale, "contact") },
  ];

  return (
    <section className="section home-discover" aria-labelledby="discover-heading" data-status={homeDiscover.status}>
      <div className="container">
        <h2 id="discover-heading" className="display-2">{copy.heading}</h2>
        <FeatureTabs
          label={copy.tabsLabel}
          items={features.map((feature, index) => {
            const topic = copy.topics[index];
            return {
              id: feature.id,
              label: topic.tab,
              align: index === 1 ? "start" : "end",
              content: (
                <>
                  <figure className="feature-tabs__photo" data-photo={feature.photo.key}>
                    <Picture photo={{ ...feature.photo, focus: `var(--feature-image-position, ${feature.photo.focus ?? "50% 50%"})` }} locale={locale} sizes="(min-width: 1746px) 1536px, (max-width: 640px) calc(100vw - 40px), 88vw" />
                  </figure>
                  <div className="feature-tabs__copy">
                    <h3>{topic.title}</h3>
                    <p>{topic.body}</p>
                    <Link className="feature-tabs__link" href={feature.href}>
                      {topic.cta}<Icon name="arrowUpRight" size={18} />
                    </Link>
                  </div>
                </>
              ),
            };
          })}
        />
      </div>
    </section>
  );
}
