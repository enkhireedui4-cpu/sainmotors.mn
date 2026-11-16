import type { CSSProperties } from "react";
import { mongoliaOutline, projectMongolia } from "@/content/mongolia";
import type { Locale } from "@/lib/i18n";
import type { NetworkCity } from "@/lib/dealer-network";

// Callouts separate the three nearby cities while leader lines retain true geographic anchors.
const callouts: Record<string, [number, number]> = {
  ulaanbaatar: [845, 390],
  darkhan: [800, 105],
  erdenet: [470, 150],
};

export function NetworkCountryMap({ cities, locale, selectedCity, onCity, ready }: {
  cities: NetworkCity[];
  locale: Locale;
  selectedCity: string;
  onCity: (city: string) => void;
  ready: boolean;
}) {
  return (
    <div className="network-country" aria-label={locale === "mn" ? "Монгол дахь манай байршлууд" : "Our locations in Mongolia"}>
      <div className="network-country__earth" aria-hidden="true" />
      <div className="network-country__canvas">
        <svg viewBox="0 0 1200 600" className="network-country__outline" aria-hidden="true">
          <path d={mongoliaOutline} className="network-country__border" />
          {cities.map(city => {
            const [x, y] = projectMongolia(...city.coordinates);
            const [cx, cy] = callouts[city.value] ?? [x, y];
            return <g key={city.value}><path className="network-country__leader" d={`M${x},${y} L${cx},${cy}`} /><circle cx={x} cy={y} r="4" fill="currentColor" /></g>;
          })}
          <text x="430" y="395" className="network-country__country-name">{locale === "mn" ? "МОНГОЛ УЛС" : "MONGOLIA"}</text>
        </svg>
        {cities.map(city => {
          const [x, y] = callouts[city.value] ?? projectMongolia(...city.coordinates);
          return (
            <button type="button" key={city.value} className="network-city" data-city={city.value} disabled={!ready}
              aria-pressed={selectedCity === city.value} aria-controls="location-results"
              aria-label={`${city.label[locale]}: ${city.count} ${locale === "mn" ? "байршил" : "locations"}`}
              style={{ "--city-x": `${x / 12}%`, "--city-y": `${y / 6}%` } as CSSProperties}
              onClick={() => onCity(city.value)}>
              <span className="network-city__count">{city.count}</span>
              <span className="network-city__name">{city.label[locale]}</span>
            </button>
          );
        })}
      </div>
      <p className="network-country__hint">{locale === "mn" ? "Хот сонгож байршлуудыг үзэх" : "Choose a city to explore our locations"}<span aria-hidden="true">↓</span></p>
    </div>
  );
}
