"use client";

import { useState } from "react";
import { sharkCabin, sharkPaints } from "@/content/byd-profiles";
import type { Locale } from "@/lib/i18n";

type View = "exterior" | "interior";
type Angle = "front" | "side";

const views = ["exterior", "interior"] as const;
const angles = ["front", "side"] as const;
const copy = {
  mn: {
    title: "SHARK 6-ийн гадна болон салоны харагдац", view: "Харагдац", exterior: "Гадна", interior: "Салон",
    colour: "Кузовын өнгө", angle: "Зургийн өнцөг", front: "Урд", side: "Хажуу",
    cabinAlt: "BYD SHARK 6-ийн зүүн хүрдтэй салон, жолооны хүрд ба төв дэлгэц",
  },
  en: {
    title: "SHARK 6 exterior and cabin", view: "View", exterior: "Exterior", interior: "Interior",
    colour: "Exterior colours", angle: "Viewing angle", front: "Front", side: "Side",
    cabinAlt: "Left-hand-drive BYD SHARK 6 cabin with steering wheel and centre display",
  },
};

export function BydSharkViewer({ locale }: { locale: Locale }) {
  const [view, setView] = useState<View>("exterior");
  const [angle, setAngle] = useState<Angle>("front");
  const [paint, setPaint] = useState<(typeof sharkPaints)[number]>(sharkPaints[0]);
  const [paintId, paintName] = paint;
  const labels = copy[locale];
  const exterior = view === "exterior";
  const photo = exterior
    ? { src: `/byd-shark-6/${paintId}${angle === "side" ? "-side" : ""}.webp`, width: 1600, height: 1144 }
    : sharkCabin;

  return <section className="byd-shark-viewer" aria-label={labels.title}>
    <div className="byd-shark-viewer__views" role="group" aria-label={labels.view}>
      {views.map(option => <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)}>{labels[option]}</button>)}
    </div>
    <div className="byd-shark-viewer__scene" data-view={view}>
      <img {...photo} alt={exterior ? `BYD SHARK 6 · ${paintName} · ${labels[angle]}` : labels.cabinAlt} loading="lazy" decoding="async" />
    </div>
    {exterior && <div className="byd-shark-viewer__controls">
      <div className="byd-shark-viewer__colours">
        <div className="byd-swatches" role="group" aria-label={labels.colour}>
          {sharkPaints.map(option => <button key={option[0]} type="button" aria-pressed={paintId === option[0]}
            aria-label={option[1]} title={option[1]} onClick={() => setPaint(option)}>
            <span style={{ backgroundColor: option[2] }} />
          </button>)}
        </div>
        <p aria-live="polite">{paintName}</p>
      </div>
      <div className="byd-shark-viewer__angles" role="group" aria-label={labels.angle}>
        {angles.map(option => <button key={option} type="button" aria-pressed={angle === option} onClick={() => setAngle(option)}>{labels[option]}</button>)}
      </div>
    </div>}
  </section>;
}
