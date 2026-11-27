import "@/app/byd.css";
import "@/app/byd-profile.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BydContact } from "@/components/BydContact";
import { BydExperience } from "@/components/BydExperience";
import { BydStudioHero } from "@/components/BydStudioHero";
import { JsonLd } from "@/components/JsonLd";
import { TestDriveForm } from "@/components/TestDriveForm";
import { VehiclePricing } from "@/components/VehiclePricing";
import { brandPhone, getInternalBrand, ui } from "@/content";
import { sealion, sealionAssets, sealionPath } from "@/content/byd";
import { vehiclePrices } from "@/content/vehicle-prices";
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
  const studioImage = { src: sealionAssets + "/hero.webp", width: 1920, height: 691,
    alt: mn ? "Мөнгөлөг BYD SEALION 6-ийн хажуугийн харагдац" : "Silver BYD SEALION 6 viewed from the side" };

  return <div className="byd-page">
    <JsonLd data={breadcrumbGraph([
      { name: "Sain Motors", path: pageHref(lang, "home") },
      { name: ui.nav.brands[lang], path: brandsPath },
      { name: brand.name, path: lineupPath },
      { name: modelName, path: localePath(lang, sealionPath) },
    ])} />
    <section className="byd-studio" aria-labelledby="sealion-studio-heading">
      <BydStudioHero locale={lang} backHref={lineupPath + "#sealion-6"} headingId="sealion-studio-heading"
        name={modelName} subtitle={sealion.powertrain[lang]} image={studioImage} />
    </section>
    <VehiclePricing locale={lang} phone={brandPhone(brand)} prices={vehiclePrices["sealion-6"]} />
    <BydExperience locale={lang} />
    <TestDriveForm locale={lang} salesPhone={brandPhone(brand)} model={{
      name: modelName,
      vehicle: studioImage,
    }} />
    <BydContact brand={brand} locale={lang} modelRequests salesLabel={informationLabel} />
  </div>;
}
