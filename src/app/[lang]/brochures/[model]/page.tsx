import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBand } from "@/components/PageBand";
import { BrochureModelAction } from "@/components/BrochureModelAction";
import { brandPhone, getBrand, ui } from "@/content";
import { brochureDocuments, brochurePath, catalogModelHref, catalogModels } from "@/content/brochures";
import { catalogCopy, catalogModelTitle } from "@/content/brochure-copy";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import "../brochures.css";

type Props = { params: Promise<{ lang: Locale; model: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogModels.filter(({ id }) => !brochureDocuments[id]).map(({ id }) => ({ model: id }));
}

function getPageData(id: string, locale: Locale) {
  const model = catalogModels.find(entry => entry.id === id);
  const brand = model && getBrand(model.brand);
  if (!model || !brand || brochureDocuments[id]) notFound();
  const name = catalogModelTitle(brand.name, model.name);
  const title = [name, model.trim].filter(Boolean).join(" ");
  return { model, title, brand, copy: catalogCopy[locale] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, model: id } = await params;
  const { title, copy } = getPageData(id, lang);
  return {
    ...pageMetadata({ locale: lang, path: brochurePath(id), title: title + " · " + copy.brochure, description: copy.pending }),
    robots: { index: false, follow: true },
  };
}

export default async function BrochurePage({ params }: Props) {
  const { lang, model: id } = await params;
  const { model, title, brand, copy } = getPageData(id, lang);
  const index = pageHref(lang, "brochures");
  const phone = brandPhone(brand);

  return (
    <>
      <PageBand locale={lang} title={title} translate="no" crumbs={[{ href: index, label: ui.nav.brochures[lang] }]} />
      <section className="brochure-reader" aria-label={copy.brochure}>
        <div className="container brochure-reader__bar">
          <Link href={index + "?brand=" + model.brand} className="brochure-back">{copy.back}</Link>
          <BrochureModelAction href={catalogModelHref(lang, model)} locale={lang} className="button button--outline brochure-model-link" />
        </div>
        <div className="container brochure-reader__pending">
          <p>{copy.pending}</p>
          <a className="brochure-model-link" href={phone.href}>{copy.sales} · {phone.display}</a>
        </div>
      </section>
    </>
  );
}
