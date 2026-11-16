import localFont from "next/font/local";

// Self-hosted subsets (Latin, Cyrillic incl. Ө ө Ү ү, №, punctuation). Glyph
// coverage was checked in these exact files and in Chrome's rendered output;
// see docs/fonts.md. Licences: src/fonts/OFL-Inter.txt; Zona Pro is the
// typeface named in Sain Motors' brand guideline (supplied files, 2026-10-20).

/** Sain Motors wordmark and decorative brand lettering. Interface headings use the system/Inter stack. */
export const zona = localFont({
  src: [
    { path: "../fonts/zona-pro-semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/zona-pro-bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-zona",
  adjustFontFallback: "Arial",
  fallback: ["Arial", "sans-serif"],
});

/** Text and interface face: Inter (text optical size), weight axis 400–600. */
export const inter = localFont({
  src: "../fonts/inter-text.woff2",
  weight: "400 600",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  adjustFontFallback: "Arial",
  fallback: ["Arial", "sans-serif"],
});
