import type { CSSProperties } from "react";

// Advances measured from the project's own Zona Pro at 180px, with optical spacing.
const letters = [
  { value: "A", x: 115.86 }, { value: "I", x: 246.04 }, { value: "N", x: 294.14 },
  { value: "M", x: 477.54 }, { value: "O", x: 630.22 }, { value: "T", x: 777.32 },
  { value: "O", x: 888.24 }, { value: "R", x: 1035.34 }, { value: "S", x: 1153.28 },
];

export function CinematicWordmark() {
  return (
    <h1 id="home-orbit-title" className="home-orbit-hero__wordmark" aria-label="SAIN MOTORS">
      <svg className="cinematic-wordmark" viewBox="0 0 1296 230" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="cinematic-name-white" x1="0" y1="45" x2="0" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" /><stop offset=".6" stopColor="#f7f8fb" /><stop offset="1" stopColor="#e2e9f2" />
          </linearGradient>
          <linearGradient id="cinematic-s-red" x1="0" y1="30" x2="130" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff1f2" /><stop offset=".45" stopColor="var(--sm-red)" /><stop offset="1" stopColor="var(--sm-red-hover)" />
          </linearGradient>
        </defs>
        <g className="cinematic-wordmark__initial">
          <text className="cinematic-wordmark__trace" x="8" y="180" stroke="url(#cinematic-s-red)" strokeWidth="1.35"
            strokeDasharray="1200" strokeDashoffset="1200" fill="none">S</text>
          <text className="cinematic-wordmark__initial-fill" x="8" y="180" fill="url(#cinematic-name-white)">S</text>
        </g>
        {letters.map((letter, i) => (
          <g className="cinematic-wordmark__letter" key={i} data-last-letter={i === letters.length - 1 ? "" : undefined}
            style={{ "--letter-delay": (1550 + i * 110 + (i >= 3 ? 120 : 0)) + "ms" } as CSSProperties}>
            <text x={letter.x} y="180" fill="url(#cinematic-name-white)">{letter.value}</text>
          </g>
        ))}
      </svg>
    </h1>
  );
}
