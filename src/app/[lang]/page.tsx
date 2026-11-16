import type { Metadata } from "next";
import { HomeOrbitHero } from "@/components/HomeOrbitHero";
import { HomeOrbitSections } from "@/components/HomeOrbitSections";
import { pages } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.home.meta.value[locale];
  return pageMetadata({ locale, path: "", title: meta.title, description: meta.description, absoluteTitle: true });
}

export default async function HomePage({ params }: Props) {
  const locale = (await params).lang as Locale;
  return <div className="corporate-home orbit-home">
    <HomeOrbitHero locale={locale} />
    <HomeOrbitSections locale={locale} />
  </div>;
}
