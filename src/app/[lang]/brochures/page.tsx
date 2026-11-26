import type { Metadata } from "next";
import { BrochureCatalog, type BrochureGroup } from "@/components/BrochureCatalog";
import { PageBand } from "@/components/PageBand";
import { getBrands } from "@/content";
import { brochureDocuments, catalogBrochureHref, catalogGalleries, catalogModelHref, catalogModelPath, catalogModels, catalogVehiclePhoto } from "@/content/brochures";
import { catalogCopy } from "@/content/brochure-copy";
import { localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "./brochures.css";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const copy = catalogCopy[lang];
  return pageMetadata({ locale: lang, path: "brochures", title: copy.title, description: copy.intro });
}

export default async function BrochuresPage({ params }: Props) {
  const { lang } = await params;
  const copy = catalogCopy[lang];
  const brandNames = new Map(getBrands().map(brand => [brand.slug, brand.name]));
  const groups = new Map<string, BrochureGroup>();
  for (const model of catalogModels) {
    const group = groups.get(model.brand) ?? { id: model.brand, name: brandNames.get(model.brand) ?? model.brand, models: [] };
    const card = {
      id: model.id, name: model.name, trim: model.trim, photo: catalogVehiclePhoto(model.id),
      brochureHref: catalogBrochureHref(lang, model.id),
      opensPdf: Boolean(brochureDocuments[model.id]),
      modelHref: catalogModelHref(lang, model),
      galleryHref: catalogGalleries[model.id]?.length ? localePath(lang, catalogModelPath(model.id)) : undefined,
    };
    groups.set(model.brand, { ...group, models: [...group.models, card] });
  }
  return (
    <>
      <PageBand locale={lang} title={copy.title} className="brochure-hero">
        <p>{copy.intro}</p>
      </PageBand>
      <BrochureCatalog groups={[...groups.values()]} locale={lang} />
    </>
  );
}
