import { socials } from "@/content/company";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";
import { CinematicHeroScene } from "./CinematicHeroScene";
import { CinematicWordmark } from "./CinematicWordmark";
import "./home-orbit-hero.css";

const copy = {
  en: {
    service: ["Car sales and", "service"],
    promise: "A new car for Mongolians",
    discover: "Discover Sain Motors",
  },
  mn: {
    service: ["Автомашины худалдаа,", "үйлчилгээ"],
    promise: "Монгол хүнд шинэ машин",
    discover: "Сайн Моторстой танилцах",
  },
};

export function HomeOrbitHero({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <section className="home-orbit-hero" aria-labelledby="home-orbit-title">
      <CinematicHeroScene>
        <div className="home-orbit-hero__service">{text.service[0]}<br />{text.service[1]}</div>
        <CinematicWordmark />
        <p className="home-orbit-hero__promise">{text.promise}</p>
        <div className="home-orbit-hero__foot">
          <div className="home-orbit-hero__socials">
            {socials.slice(0, 2).map(social => (
              <a key={social.id} href={social.url} aria-label={social.label} target="_blank" rel="noreferrer">
                <Icon name={social.id} size={23} />
              </a>
            ))}
          </div>
          <a className="home-orbit-hero__discover" href="#home-company" aria-label={text.discover}>
            <span aria-hidden="true">S</span>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v15m-6-6 6 6 6-6" /></svg>
          </a>
        </div>
      </CinematicHeroScene>
    </section>
  );
}
