"use client";

import { Children, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "./Icon";

interface HeroGalleryProps {
  children: ReactNode;
  labels: { group: string; previous: string; next: string };
}

/**
 * Home hero photographs, switched only by the visitor: the arrows,
 * a horizontal swipe or the arrow keys. Nothing advances on its own. Only the
 * first photo loads with the page; the rest start fetching once it has loaded.
 */
export function HeroGallery({ children, labels }: HeroGalleryProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const frameId = useId();
  const swipeStart = useRef<{ x: number; y: number; pointerId: number } | null>(null);

  useEffect(() => {
    let timer = 0;
    const later = () => { timer = window.setTimeout(() => setLoaded(true), 300); };
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => { window.removeEventListener("load", later); window.clearTimeout(timer); };
  }, []);

  const advance = (delta: number) => {
    setLoaded(true);
    setActive(current => (current + delta + count) % count);
  };
  const show = (index: number) => {
    setLoaded(true);
    setActive((index + count) % count);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const dot = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-photo-index]");
    if (dot) {
      const next = (Number(dot.dataset.photoIndex) + step + count) % count;
      show(next);
      event.currentTarget.querySelector<HTMLButtonElement>(`[data-photo-index="${next}"]`)?.focus();
      return;
    }
    advance(step);
  };

  return (
    <div className="hero-gallery" data-loaded={loaded || undefined} role="group" aria-label={labels.group} onKeyDown={onKeyDown}>
      <div
        id={frameId}
        className="hero-gallery__frame"
        tabIndex={0}
        onPointerDown={(event) => { swipeStart.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId }; }}
        onPointerCancel={() => { swipeStart.current = null; }}
        onPointerUp={(event) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start || start.pointerId !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) advance(dx < 0 ? 1 : -1);
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="hero-gallery__slide" data-active={i === active || undefined} aria-hidden={i !== active || undefined}>
            {slide}
          </div>
        ))}
        <div className="hero-gallery__controls">
          <p className="hero-gallery__position" aria-hidden="true"><span>{String(active + 1).padStart(2, "0")}</span><span>/</span><span>{String(count).padStart(2, "0")}</span></p>
          <div className="hero-gallery__buttons">
            <button type="button" className="hero-gallery__arrow hero-gallery__arrow--previous" aria-label={labels.previous} aria-controls={frameId} onClick={() => advance(-1)}>
              <Icon name="arrowLeft" size={20} />
              <Icon className="hero-gallery__chevron" name="chevronLeft" size={20} />
            </button>
            <button type="button" className="hero-gallery__arrow hero-gallery__arrow--next" aria-label={labels.next} aria-controls={frameId} onClick={() => advance(1)}>
              <Icon name="arrowRight" size={20} />
              <Icon className="hero-gallery__chevron" name="chevronRight" size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="hero-gallery__dots" role="group" aria-label={labels.group}>
        {slides.map((_, index) => (
          <button key={index} type="button" data-photo-index={index} aria-controls={frameId}
            aria-label={`${index + 1} / ${count}`} aria-pressed={index === active} onClick={() => show(index)}>
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{`${labels.group}: ${active + 1} / ${count}`}</p>
    </div>
  );
}
