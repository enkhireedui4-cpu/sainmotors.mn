"use client";

import { Children, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "./Icon";

interface HeroGalleryProps {
  children: ReactNode;
  labels: { group: string; previous: string; next: string };
}

/**
 * Home hero photographs, switched only by the visitor: the arrows, the dots,
 * a horizontal swipe or the arrow keys. Nothing advances on its own. Only the
 * first photo loads with the page; the rest start fetching once it has loaded.
 */
export function HeroGallery({ children, labels }: HeroGalleryProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    let timer = 0;
    const later = () => { timer = window.setTimeout(() => setLoaded(true), 300); };
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => { window.removeEventListener("load", later); window.clearTimeout(timer); };
  }, []);

  const show = (index: number) => { setLoaded(true); setActive((index + count) % count); };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + count) % count;
    show(next);
    event.currentTarget.querySelectorAll("button")[next]?.focus();
  };

  return (
    <div className="hero-gallery" data-loaded={loaded || undefined}>
      <div
        className="hero-gallery__frame"
        onPointerDown={(event) => { swipeStart.current = event.clientX; }}
        onPointerCancel={() => { swipeStart.current = null; }}
        onPointerUp={(event) => {
          if (swipeStart.current === null) return;
          const dx = event.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(dx) > 40) show(active + (dx < 0 ? 1 : -1));
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="hero-gallery__slide" data-active={i === active || undefined} aria-hidden={i !== active || undefined}>
            {slide}
          </div>
        ))}
        <button type="button" className="hero-gallery__arrow hero-gallery__arrow--previous" aria-label={labels.previous} onClick={() => show(active - 1)}>
          <Icon name="chevronLeft" size={20} aria-hidden="true" />
        </button>
        <button type="button" className="hero-gallery__arrow hero-gallery__arrow--next" aria-label={labels.next} onClick={() => show(active + 1)}>
          <Icon name="chevronRight" size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="hero-gallery__dots" role="group" aria-label={labels.group} onKeyDown={onKeyDown}>
        {slides.map((_, i) => (
          <button key={i} type="button" aria-label={`${i + 1} / ${count}`} aria-pressed={i === active} onClick={() => show(i)}>
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}
