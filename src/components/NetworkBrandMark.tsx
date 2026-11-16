import type { CSSProperties } from "react";
import { getLogo } from "@/content";
import type { Brand } from "@/content/types";

const wordmarks: Record<string, { x: number; y: number; width: number; height: number } | undefined> = {
  bestune: { x: 113, y: 48, width: 525, height: 52 },
  maxus: { x: 188, y: 30, width: 454, height: 46 },
  hongqi: { x: 110, y: 52, width: 517, height: 56 },
};

export function NetworkBrandMark({ brand }: { brand: Brand }) {
  const logo = getLogo(brand.slug);
  if (!logo) return <span translate="no">{brand.name}</span>;
  const bounds = wordmarks[brand.slug] ?? { x: 0, y: 0, width: logo.width, height: logo.height };
  const style = {
    "--network-mark-aspect": bounds.width / bounds.height,
    "--network-source-width": `${logo.width / bounds.width * 100}%`,
    "--network-source-height": `${logo.height / bounds.height * 100}%`,
    "--network-mark-x": `${-bounds.x / bounds.width * 100}%`,
    "--network-mark-y": `${-bounds.y / bounds.height * 100}%`,
  } as CSSProperties;
  return <span className="network-brand-mark" style={style}><img src={logo.src} width={logo.width} height={logo.height} alt="" decoding="async" /></span>;
}
