"use client";

import Link from "next/link";
import { useId, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "./Icon";

export interface ShowcaseVehicle {
  slug: string;
  name: string;
  model: string;
  tagline: string;
  href: string;
  linkLabel: string;
  external: boolean;
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  position?: string;
  studio: boolean;
  blend?: boolean;
  softShadow?: boolean;
}

interface Props {
  vehicles: ShowcaseVehicle[];
  labels: { region: string; previous: string; next: string; slide: string; help: string };
}

const subscribe = () => () => {};
const pad = (number: number) => String(number).padStart(2, "0");

/** A visitor-controlled showroom: no timers, automatic movement or focus changes. */
export function VehicleShowcase({ vehicles, labels }: Props) {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const gesture = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const galleryId = useId();
  const helpId = useId();
  const total = vehicles.length;
  const vehicle = vehicles[active];
  const previous = (active + total - 1) % total;
  const next = (active + 1) % total;

  function step(delta: number) {
    setDirection(delta);
    setActive(current => (current + delta + total) % total);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    gesture.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || event.pointerId !== start.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  }

  return (
    <div className="brand-spotlight__gallery" role="group" aria-roledescription="carousel" aria-label={labels.region}
      data-ready={ready || undefined} data-current={active} onKeyDown={onKeyDown}>
      <p id={helpId} className="sr-only">{labels.help}</p>
      <div id={galleryId} className="brand-spotlight__stage" tabIndex={ready ? 0 : undefined} aria-describedby={helpId}
        aria-label={`${vehicle.model}, ${active + 1} / ${total}`}
        onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { gesture.current = null; }}>
        <span key={`backdrop-${vehicle.slug}`} className="brand-spotlight__backdrop" aria-hidden="true" translate="no">{vehicle.name.replace("FAW ", "")}</span>
        {vehicles.map((item, index) => {
          const position = index === active ? "active" : index === previous ? "previous" : index === next ? "next" : "hidden";
          return (
            <div key={item.slug} className="brand-spotlight__vehicle" data-position={position} data-studio={item.studio || undefined}
              data-blend={item.blend || undefined} data-soft-shadow={item.softShadow || undefined}
              aria-hidden={index !== active || undefined} inert={index !== active}>
              <img src={item.src} srcSet={item.srcSet} sizes="(min-width: 90rem) 54vw, (min-width: 48rem) 62vw, 94vw"
                width={item.width} height={item.height} alt={item.model} loading="lazy" decoding="async" draggable={false}
                style={{ objectPosition: item.position }} />
            </div>
          );
        })}
      </div>
      <div className="brand-spotlight__information" style={{ "--arrival-direction": direction } as CSSProperties}>
        <h3 translate="no">{vehicle.model}</h3>
        <p>{vehicle.tagline}</p>
        <Link href={vehicle.href} className="brand-spotlight__link" rel={vehicle.external ? "external" : undefined} prefetch={false}>
          {vehicle.linkLabel}<Icon name={vehicle.external ? "arrowUpRight" : "arrowRight"} size={24} />
        </Link>
      </div>
      <div className="brand-spotlight__controls">
        <button className="brand-spotlight__arrow brand-spotlight__arrow--previous" type="button" onClick={() => step(-1)}
          aria-label={labels.previous} aria-controls={galleryId}>
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" /></svg>
        </button>
        <div className="brand-spotlight__pagination">
          <div className="brand-spotlight__progress" aria-hidden="true"><span style={{ transform: `scaleX(${(active + 1) / total})` }} /></div>
          <p className="brand-spotlight__count" aria-hidden="true"><span>{pad(active + 1)}</span><span>/</span><span>{pad(total)}</span></p>
        </div>
        <button className="brand-spotlight__arrow brand-spotlight__arrow--next" type="button" onClick={() => step(1)}
          aria-label={labels.next} aria-controls={galleryId}>
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{`${vehicle.model}, ${labels.slide} ${active + 1} / ${total}`}</p>
      <noscript><style>{".brand-spotlight__arrow{display:none}"}</style></noscript>
    </div>
  );
}
