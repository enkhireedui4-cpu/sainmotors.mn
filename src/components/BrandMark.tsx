import type { CSSProperties } from "react";
import { getLogo, ui } from "@/content";
import type { Brand } from "@/content/types";
import type { Locale } from "@/lib/i18n";

/**
 * Optical size factor for a wordmark. Long, light marks read smaller than
 * short, dense ones at the same height, so height scales with the inverse
 * square root of the aspect ratio and slightly with ink density.
 * Reference: a 5:1 mark at 45% ink coverage renders at the base height.
 */
export function opticalScale(width: number, height: number, density: number): number {
  const aspect = width / height;
  return Math.sqrt(5 / aspect) * Math.pow(0.45 / Math.max(density, 0.05), 0.3);
}

interface BrandMarkProps {
  brand: Brand;
  locale: Locale;
  size?: "small" | "tile" | "large";
  /** Set when the brand name is already visible next to the mark. */
  decorative?: boolean;
  lazy?: boolean;
  /** Use a sourced dark-background variant when one is available. */
  onDark?: boolean;
}

/** The supplied logo, or the brand name set in type while a brand's logo is pending. */
export function BrandMark({ brand, locale, size = "tile", decorative = false, lazy = true, onDark = false }: BrandMarkProps) {
  const regularLogo = getLogo(brand.slug, onDark);
  const logo = regularLogo ?? getLogo(brand.slug, true);
  const sizeClass = size === "tile" ? "brand-mark" : `brand-mark brand-mark--${size}`;

  if (!logo) {
    return (
      <span className={`${sizeClass} brand-wordmark`} data-status="draft" translate="no" aria-hidden={decorative || undefined}>
        {brand.name}
        <span className="review-badge">{ui.pendingLogo[locale]}</span>
      </span>
    );
  }

  const scale = opticalScale(logo.width, logo.height, logo.density) * logo.optical;
  const style = { "--mark-scale": scale.toFixed(3) } as CSSProperties;
  const mark = (
    <img
      className={sizeClass}
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={decorative ? "" : brand.name}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      style={style}
    />
  );
  return !regularLogo && logo ? <span className="brand-mark-plate">{mark}</span> : mark;
}
