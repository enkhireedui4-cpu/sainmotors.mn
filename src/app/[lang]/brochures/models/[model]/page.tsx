import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBand } from "@/components/PageBand";
import { brandPhone, getBrand, ui } from "@/content";
import { brochureDocuments, catalogBrochureHref, catalogGalleries, catalogModelPath, catalogModels, catalogVehiclePhoto } from "@/content/brochures";
import { catalogCopy, catalogModelTitle } from "@/content/brochure-copy";
import type { Locale } from "@/lib/i18n";
import { brandHref, pageHref } from "@/lib/routes";
import { brandLinkLabel } from "@/lib/brand-sites";
import { pageMetadata } from "@/lib/seo";
import "../../brochures.css";

type Props = { params: Promise<{ lang: Locale; model: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogModels.filter(({ id }) => catalogGalleries[id]?.length).map(({ id }) => ({ model: id }));
}

function getPageData(id: string) {
  const model = catalogModels.find(entry => entry.id === id);
  const brand = model && getBrand(model.brand);
  const gallery = catalogGalleries[id];
  if (!model || !brand || !gallery?.length) notFound();
  const title = catalogModelTitle(brand.name, model.name);
  return { model, brand, title, photo: catalogVehiclePhoto(id), gallery };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, model: id } = await params;
  const { title, model } = getPageData(id);
  return pageMetadata({
    locale: lang,
    path: catalogModelPath(id),
    title: [title, model.trim].filter(Boolean).join(" "),
    description: model.overview?.[lang] ?? title + " · " + catalogCopy[lang].sales,
  });
}

export default async function CatalogModelPage({ params }: Props) {
  const { lang, model: id } = await params;
  const { model, brand, title, photo, gallery } = getPageData(id);
  const copy = catalogCopy[lang];
  const index = pageHref(lang, "brochures");
  const phone = brandPhone(brand);
  const brandSite = brandHref(lang, brand.slug);
  const destination = brand.location ? pageHref(lang, "locations") + "#" + brand.location : pageHref(lang, "locations");
  const opensPdf = Boolean(brochureDocuments[id]);

  return (
    <>
      <PageBand locale={lang} title={title} translate="no" crumbs={[{ href: index, label: ui.nav.brochures[lang] }]}>
        {model.trim && <p className="brochure-model-trim" translate="no">{model.trim}</p>}
      </PageBand>
      <section className="container brochure-model" aria-label={title}>
        {photo && (
          <div className="brochure-model__photo">
            <img src={photo.src} width={photo.width} height={photo.height} alt={title} />
          </div>
        )}
        <div className="brochure-model__info">
          {model.overview && <p className="brochure-model__overview">{model.overview[lang]}</p>}
          <h2>{copy.sales}</h2>
          <a className="brochure-model__phone" href={phone.href}>{phone.display}</a>
          <Link className="brochure-model-link" href={destination}>{copy.showroom}</Link>
          {brandSite && <a className="brochure-model-link" href={brandSite}>{brandLinkLabel(lang, brand.slug)}</a>}
          <a className="button button--primary" href={catalogBrochureHref(lang, id)} target={opensPdf ? "_blank" : undefined}
            rel={opensPdf ? "noopener" : undefined}>
            {copy.viewBrochure}
            {opensPdf && <span aria-hidden="true">↗</span>}
          </a>
        </div>
      </section>
      <section className="container brochure-gallery" aria-labelledby="model-gallery">
        <h2 id="model-gallery">{copy.gallery}</h2>
        <ul role="list">
          {gallery.map((image, index) => (
            <li key={image.src}>
              <a href={image.src} target="_blank" rel="noopener">
                <img src={image.src} width={image.width} height={image.height}
                  alt={title + " · " + copy.photo(index + 1)} loading="lazy" decoding="async" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
