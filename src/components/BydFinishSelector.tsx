"use client";

import { useState } from "react";
import type { Locale, Localized } from "@/lib/i18n";

type Finish = { id: string; label: Localized; swatch: string; width: number; height: number };

export function BydFinishSelector({ locale, title, finishes, assetPath, interior = false }: {
  locale: Locale;
  title: string;
  finishes: readonly Finish[];
  assetPath: string;
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
    <img src={`${assetPath}/${color.id}.webp`} width={color.width} height={color.height} alt={`${title} · ${color.label[locale]}`} loading="lazy" decoding="async" />
  </div>;
}
