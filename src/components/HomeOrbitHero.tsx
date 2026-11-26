import Link from "next/link";
import { company } from "@/content/company";
import { hero } from "@/content/hero";
import type { Locale } from "@/lib/i18n";
import { contentHref } from "@/lib/routes";
import { CinematicHeroScene } from "./CinematicHeroScene";
import { CinematicWordmark } from "./CinematicWordmark";
import "./home-orbit-hero.css";

const motto = {
  en: "A new car for Mongolians",
  mn: "Монгол хүнд шинэ машин",
};

export function HomeOrbitHero({ locale }: { locale: Locale }) {
  return (
    <section className="home-orbit-hero" aria-labelledby="home-orbit-title">
      <CinematicHeroScene locale={locale}>
        <div className="home-orbit-hero__foot">
          <div className="home-orbit-hero__identity">
            <h1 id="home-orbit-title" className="home-orbit-hero__title" aria-label={company.name}>
              <CinematicWordmark />
            </h1>
            <p className="home-orbit-hero__motto">{motto[locale]}</p>
          </div>
          <Link className="home-orbit-hero__discover" href={contentHref(locale, hero.cta.href)} prefetch={false}>
            {hero.cta.label[locale]}
          </Link>
        </div>
      </CinematicHeroScene>
    </section>
  );
}
