import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandDetail } from "@/components/BrandDetail";
import { getInternalBrand, getInternalBrands, getPhoto } from "@/content";
import type { InternalBrand } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { excerpt, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getInternalBrands().map((brand) => ({ slug: brand.slug }));
}

/** The brand photo as social preview when one exists; otherwise the site default. */
function socialImage(brand: InternalBrand, locale: Locale) {
  if (brand.slug === "rely") return { src: "/rely-r8/hero-1.webp", width: 2560, height: 1440, alt: "RELY R8" };
  if (!brand.photo) return undefined;
  const asset = getPhoto(brand.photo.key);
  const [width, src] = asset.srcset.filter(([w]) => w <= 1440).at(-1) ?? asset.srcset[0];
  return { src, width, height: Math.round((width * asset.height) / asset.width), alt: brand.photo.alt[locale] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const brand = getInternalBrand(slug);
  if (!brand) return {};
  return pageMetadata({
    locale,
    path: `brands/${brand.slug}`,
    title: brand.slug === "rely" ? "RELY R8" : brand.name,
    description: brand.slug === "rely"
      ? (locale === "mn" ? "RELY R8 пикапын хийц, хүчин чадал, ухаалаг технологитой танилцаж, Сайн Моторс-т туршилтын жолоодлогын хүсэлт илгээгээрэй." : "Explore the RELY R8 pickup, its design, capability and intelligent technology, and request a test drive with Sain Motors.")
      : excerpt(brand.summary.value[locale]),
    image: socialImage(brand, locale),
  });
}

export default async function BrandPage({ params }: Props) {
  const { lang, slug } = await params;
  const brand = getInternalBrand(slug);
  if (!brand) notFound();
  return <BrandDetail brand={brand} locale={lang as Locale} />;
}
