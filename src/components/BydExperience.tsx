"use client";

import { useState } from "react";
import { sealion, sealionAssets, sealionCabins, sealionColors, sealionComfort, sealionHighlights, sealionSpecs, type SealionFinish } from "@/content/byd";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";

const sections = {
  mn: { overview: "Тойм", design: "Дизайн", technical: "Техникийн мэдээлэл", contact: "Холбоо барих" },
  en: { overview: "Overview", design: "Design", technical: "Technical information", contact: "Contact" },
};

const localUnits: Record<string, string> = { hp: "м.х", "N·m": "Н·м", s: "сек", km: "км", kWh: "кВт·ц", kW: "кВт", mm: "мм", L: "л" };

function displayUnit(unit: string, locale: Locale) {
  return locale === "mn" ? localUnits[unit] ?? unit : unit;
}

function FinishSelector({ locale, title, finishes, interior = false }: {
  locale: Locale;
  title: string;
  finishes: readonly SealionFinish[];
  interior?: boolean;
}) {
  const [color, setColor] = useState(finishes[0]);
  return <div className={`byd-design__colors${interior ? " byd-design__colors--interior" : ""}`}>
      <div className="byd-design__picker">
        <h3>{title}</h3>
        <div className="byd-swatches" role="group" aria-label={title}>
          {finishes.map(option => <button key={option.id} type="button" aria-label={option.label[locale]} aria-pressed={color.id === option.id}
            title={option.label[locale]} onClick={() => setColor(option)}>
            <span style={{ backgroundColor: option.swatch }} />
          </button>)}
        </div>
        <p aria-live="polite">{color.label[locale]}</p>
      </div>
      <img src={`${sealionAssets}/${color.id}.webp`} width={color.width} height={color.height} alt={`${title} · ${color.label[locale]}`} loading="lazy" />
  </div>;
}

function SealionDesign({ locale }: { locale: Locale }) {
  const mn = locale === "mn";
  return <>
    <div className="byd-design__details">
      <figure>
        <img src={`${sealionAssets}/exterior.webp`} width="1060" height="596" alt={mn ? "BYD SEALION 6-ийн гадна хийц" : "BYD SEALION 6 exterior"} loading="lazy" />
        <figcaption><h3>{mn ? "Гадна хийц" : "Exterior"}</h3><p>{mn ? "19 инчийн хайлшин обуд, LED их гэрэл, шилэн дээвэр." : "19-inch alloy wheels, LED headlights and a glass roof."}</p></figcaption>
      </figure>
      <figure>
        <img src={`${sealionAssets}/cabin.webp`} width="366" height="242" alt={mn ? "BYD SEALION 6-ийн салон, жолооны хүрд, төв дэлгэц" : "SEALION 6 cabin, steering wheel and centre display"} loading="lazy" />
        <figcaption><h3>{mn ? "Салон ба төв дэлгэц" : "Cabin and centre display"}</h3><p>{mn ? "15.6 инчийн эргэдэг дэлгэц, халаалттай болон агааржуулалттай урд суудал." : "A 15.6-inch rotating display and heated, ventilated front seats."}</p></figcaption>
      </figure>
      <figure>
        <img src={`${sealionAssets}/digital-key.webp`} width="366" height="218" alt={mn ? "Утсаа хажуугийн толинд ойртуулж түгжээ тайлж буй нь" : "Unlocking the car with a phone at the side mirror"} loading="lazy" />
        <figcaption><h3>{mn ? "Түлхүүргүй нэвтрэх" : "Keyless entry"}</h3><p>{mn ? "Түлхүүрээ гаргалгүй хаалгаа онгойлгож, машинаа асаана." : "Unlock and start the car without taking out the key."}</p></figcaption>
      </figure>
    </div>
    <FinishSelector locale={locale} title={mn ? "Кузовын өнгө" : "Exterior colours"} finishes={sealionColors} />
    <FinishSelector locale={locale} title={mn ? "Салоны өнгө" : "Interior colours"} finishes={sealionCabins} interior />
    <div className="byd-comfort">
      <h2>{mn ? "Салоны тав тух" : "Cabin comfort"}</h2>
      <div>
        {sealionComfort.map(({ title, description }) => <details key={title.en}>
          <summary>{title[locale]}<Icon name="chevronRight" size={20} /></summary>
          <p>{description[locale]}</p>
        </details>)}
      </div>
    </div>
  </>;
}

export function BydExperience({ locale }: { locale: Locale }) {
  const mn = locale === "mn";
  const labels = sections[locale];
  const modelName = `BYD ${sealion.name}`;

  return (
    <div className="byd-details">
      <nav className="byd-subnav" aria-label={mn ? "Загварын хэсгүүд" : "Model sections"}>
        <div className="byd-shell">
          <span className="byd-subnav__model" translate="no">{modelName}</span>
          <div className="byd-subnav__links">
            {Object.entries(labels).map(([id, label]) => <a key={id} href={`#byd-${id}`}>{label}</a>)}
          </div>
        </div>
      </nav>
      <section className="byd-overview byd-shell byd-section" id="byd-overview" aria-labelledby="byd-overview-heading">
        <div className="byd-highlight">
          <div className="byd-highlight__facts">
            <dl className="byd-metrics">
              {sealionHighlights.map(({ label, value, unit }) => <div key={label.en}>
                <dt>{label[locale]}</dt>
                <dd>{value}<small>{displayUnit(unit, locale)}</small></dd>
              </div>)}
            </dl>
            <a className="byd-button byd-button--outline" href="#byd-technical">{labels.technical}<Icon name="arrowRight" size={17} /></a>
          </div>
          <img src={`${sealionAssets}/specifications.webp`} width="900" height="443" alt={mn ? "Цагаан BYD SEALION 6-ийн урд талын харагдац" : "White BYD SEALION 6 from the front three-quarter angle"} loading="lazy" />
        </div>
        <figure className="byd-road-scene">
          <img src={`${sealionAssets}/road-scene.webp`} width="1500" height="667"
            alt={mn ? "Уулын замаар явж буй мөнгөлөг BYD SEALION 6" : "Silver BYD SEALION 6 driving along a mountain road"} loading="lazy" />
        </figure>
        <div className="byd-intro">
          <h2 id="byd-overview-heading" translate="no">BYD {sealion.series}</h2>
          <p>{sealion.description[locale]}</p>
        </div>
        <div className="byd-hybrid-photos">
          <img src={`${sealionAssets}/hybrid-landscape.webp`} width="1500" height="962"
            alt={mn ? "Зам дээрх BYD SEALION 6" : "BYD SEALION 6 on the road"} loading="lazy" />
          <img src={`${sealionAssets}/hybrid-detail.webp`} width="900" height="1172"
            alt={mn ? "BYD SEALION 6-ийн гадна хийц" : "Exterior of the BYD SEALION 6"} loading="lazy" />
        </div>
        <div className="byd-feature">
          <h2>{mn ? "Хөдөлгүүр ба жолоодлого" : "Powertrain and driving"}</h2>
          <div className="byd-feature__grid">
            <figure>
              <img src={`${sealionAssets}/feature-hybrid.webp`} width="1400" height="1081" alt="" loading="lazy" />
              <figcaption><h3>{mn ? "Цахилгаан ба хосолмол горим" : "Electric and hybrid driving"}</h3>
                <p>{mn ? "Цахилгаан горимд батарей моторыг тэжээнэ. Холын замд DM-i систем бензин хөдөлгүүр, цахилгаан моторын ажиллагааг уялдуулна." : "The battery powers the motor in EV mode. On longer trips, DM-i coordinates the petrol engine and electric motor."}</p></figcaption>
            </figure>
            <figure>
              <img src={`${sealionAssets}/feature-drive.webp`} width="1400" height="1081" alt="" loading="lazy" />
              <figcaption><h3>{mn ? "Урд дугуйн хөтлөгч" : "Front-wheel drive"}</h3>
                <p>{mn ? "1.5 литрийн бензин хөдөлгүүртэй систем 300 м.х хүчин чадалтай. Жолоодлогын горимд Eco, Normal, Sport, Snow багтана." : "The 1.5-litre plug-in hybrid system produces 300 hp. Drive modes include Eco, Normal, Sport and Snow."}</p></figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="byd-design byd-shell byd-section" id="byd-design" aria-labelledby="byd-design-heading">
        <h2 id="byd-design-heading">{labels.design}</h2>
        <SealionDesign locale={locale} />
      </section>
      <section className="byd-technical byd-shell byd-section" id="byd-technical" aria-labelledby="byd-technical-heading">
        <h2 id="byd-technical-heading">{labels.technical}</h2>
        {sealionSpecs.map(({ title, rows }, index) => <details key={title.en} open={index === 0}>
          <summary>{title[locale]}<Icon name="chevronRight" size={20} /></summary>
          <dl>
            {rows.map(row => <div key={row.label.en}>
              <dt>{row.label[locale]}</dt>
              <dd>{typeof row.value === "string" ? row.value : row.value[locale]}{"unit" in row && row.unit ? ` ${displayUnit(row.unit, locale)}` : ""}</dd>
            </div>)}
          </dl>
        </details>)}
      </section>
    </div>
  );
}
