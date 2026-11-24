import "@/app/byd.css";
import "@/app/byd-profile.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BydContact } from "@/components/BydContact";
import { BydExperience } from "@/components/BydExperience";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";
import { TestDriveForm } from "@/components/TestDriveForm";
import { brandPhone, getInternalBrand, ui } from "@/content";
import { sealion, sealionAssets, sealionPath } from "@/content/byd";
import { enquiryHref } from "@/lib/enquiries";
import { isLocale, localePath } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { excerpt, pageMetadata } from "@/lib/seo";
import { breadcrumbGraph } from "@/lib/structured-data";

type Props = { params: Promise<{ lang: string }> };
const modelName = `BYD ${sealion.name}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata({
    locale: lang,
    path: sealionPath,
    title: modelName,
    description: excerpt(sealion.description[lang]),
    image: { src: "/byd-lineup/sealion-6-desktop.webp", width: 2400, height: 1350, alt: modelName },
  });
}

export default async function SealionPage({ params }: Props) {
  const { lang } = await params;
  const brand = getInternalBrand("byd");
  if (!isLocale(lang) || !brand) notFound();
  const mn = lang === "mn";
  const informationLabel = mn ? "Мэдээлэл" : "Information";
  const brandsPath = pageHref(lang, "brands");
  const lineupPath = localePath(lang, "brands/byd");

  return <div className="byd-page">
    <JsonLd data={breadcrumbGraph([
      { name: "Sain Motors", path: pageHref(lang, "home") },
      { name: ui.nav.brands[lang], path: brandsPath },
      { name: brand.name, path: lineupPath },
      { name: modelName, path: localePath(lang, sealionPath) },
    ])} />
    <section className="byd-studio" aria-labelledby="sealion-studio-heading">
      <div className="byd-shell">
        <a className="byd-profile__back" href={lineupPath + "#sealion-6"}><Icon name="arrowLeft" size={17} />{mn ? "BYD загварууд" : "BYD models"}</a>
        <div className="byd-studio__heading">
          <h1 id="sealion-studio-heading" translate="no">{modelName}</h1>
          <p>{sealion.powertrain[lang]}</p>
        </div>
        <img src={sealionAssets + "/hero.webp"} width={1920} height={691}
          alt={mn ? "Мөнгөлөг BYD SEALION 6-ийн хажуугийн харагдац" : "Silver BYD SEALION 6 viewed from the side"}
          fetchPriority="high" decoding="async" />
        <div className="byd-actions">
          <a className="byd-button byd-button--primary" href={enquiryHref(lang, "sales", brand.slug)}>
            {informationLabel}<Icon name="arrowRight" size={17} />
          </a>
          <a className="byd-button byd-button--outline" href="#byd-test-drive">
            {mn ? "Туршилтын жолоодлого" : "Test drive"}
          </a>
        </div>
      </div>
    </section>
    <BydExperience locale={lang} />
    <TestDriveForm locale={lang} salesPhone={brandPhone(brand)} model={{
      name: modelName,
      vehicle: { src: sealionAssets + "/hero.webp", width: 1920, height: 691,
        alt: mn ? "Цагаан BYD SEALION 6-ийн хажуугийн харагдац" : "White BYD SEALION 6, side view" },
    }} />
    <BydContact brand={brand} locale={lang} salesLabel={informationLabel} />
  </div>;
}
