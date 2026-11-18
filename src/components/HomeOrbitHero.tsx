import Link from "next/link";
import { company } from "@/content/company";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { CinematicHeroScene } from "./CinematicHeroScene";
import { CinematicWordmark } from "./CinematicWordmark";
import "./home-orbit-hero.css";

const copy = {
  en: {
    motto: "A new car for Mongolians",
    discover: "Discover Sain Motors",
  },
  mn: {
    motto: "Монгол хүнд шинэ машин",
    discover: "Сайн Моторстой танилцах",
  },
};

export function HomeOrbitHero({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <section className="home-orbit-hero" aria-labelledby="home-orbit-title">
      <CinematicHeroScene>
        <div className="home-orbit-hero__foot">
          <div className="home-orbit-hero__identity">
            <h1 id="home-orbit-title" className="home-orbit-hero__title" aria-label={company.name}>
              <CinematicWordmark />
            </h1>
            <p className="home-orbit-hero__motto">{text.motto}</p>
          </div>
          <Link className="home-orbit-hero__discover" href={pageHref(locale, "about")} prefetch={false}>{text.discover}</Link>
        </div>
      </CinematicHeroScene>
    </section>
  );
}
