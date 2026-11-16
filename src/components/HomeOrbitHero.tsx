import { socials } from "@/content/company";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";
import { CinematicHeroScene } from "./CinematicHeroScene";
import { CinematicWordmark } from "./CinematicWordmark";
import "./home-orbit-hero.css";

const copy = {
  en: {
    service: ["Car sales and", "service"],
    promise: "Driven by trust",
    description: "Our company is the epitome of reliability and high-quality service. Sain Motors is a group of companies that includes 11 different car brands.",
    discover: "Discover Sain Motors",
    pause: "Pause animation",
    play: "Play animation",
  },
  mn: {
    service: ["Автомашины худалдаа,", "үйлчилгээ"],
    promise: "Итгэлээр хөтлөгдөнө",
    description: "Манай компани бол найдвартай байдал, өндөр чанартай үйлчилгээний илэрхийлэл юм. Сайн Моторс нь автомашины 11 өөр брэндийг нэгтгэсэн групп компани юм.",
    discover: "Сайн Моторстой танилцах",
    pause: "Хөдөлгөөнийг зогсоох",
    play: "Хөдөлгөөнийг тоглуулах",
  },
};

export function HomeOrbitHero({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <section className="home-orbit-hero" aria-labelledby="home-orbit-title">
      <CinematicHeroScene labels={{ pause: text.pause, play: text.play }}>
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
        <div className="home-orbit-hero__intro">
          <a className="home-orbit-hero__discover" href="#home-company" aria-label={text.discover}>
            <span aria-hidden="true">S</span>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v15m-6-6 6 6 6-6" /></svg>
          </a>
          <p className="home-orbit-hero__description">{text.description}</p>
        </div>
      </div>
      </CinematicHeroScene>
    </section>
  );
}
