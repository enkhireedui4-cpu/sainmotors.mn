"use client";

import "@/app/scroll-image.css";
import { useEffect, useRef, type ReactNode } from "react";

/** Ordinary page scroll scales the image and keeps its visible height in the document flow. */
export function BrandScrollHero({ children, aspectRatio }: { children: ReactNode; aspectRatio: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const space = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pending = 0;
    let fragmentFrame = 0;
    let disposed = false;
    const update = () => {
      pending = 0;
      if (!stage.current || !space.current || !frame.current) return;
      if (preference.matches) {
        frame.current.style.removeProperty("transform");
        stage.current.style.removeProperty("height");
        return;
      }
      const bounds = stage.current.getBoundingClientRect();
      const finalBounds = space.current.getBoundingClientRect();
      const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
      const finish = Math.max(160, bounds.top + window.scrollY - headerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / finish));
      const endScale = Math.min(1, finalBounds.width / bounds.width);
      const scale = 1 - (1 - endScale) * progress;
      const height = bounds.width * (finalBounds.height / finalBounds.width) * scale;
      frame.current.style.transform = `scale(${scale})`;
      stage.current.style.height = `${height}px`;
    };
    const schedule = () => { if (!pending) pending = window.requestAnimationFrame(update); };
    const settleFragment = () => {
      window.cancelAnimationFrame(fragmentFrame);
      fragmentFrame = window.requestAnimationFrame(() => {
        let id: string;
        try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
        const destination = id ? document.getElementById(id) : null;
        if (!destination) return;
        // Native fragments may position before the hero contracts. Size it at
        // the destination, then align once more before this frame is painted.
        destination.scrollIntoView({ block: "start", behavior: "instant" });
        update();
        destination.scrollIntoView({ block: "start", behavior: "instant" });
      });
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", settleFragment);
    preference.addEventListener("change", schedule);
    void document.fonts.ready.then(() => { if (!disposed) settleFragment(); });
    const resize = new ResizeObserver(schedule);
    if (space.current) resize.observe(space.current);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(pending);
      window.cancelAnimationFrame(fragmentFrame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", settleFragment);
      preference.removeEventListener("change", schedule);
      resize.disconnect();
    };
  }, []);

  return <div className="brand-scroll-hero" ref={stage} style={{ aspectRatio }}>
    <div className="container brand-scroll-hero__space" ref={space} aria-hidden="true" style={{ aspectRatio }} />
    <div className="brand-scroll-hero__frame" ref={frame}>{children}</div>
    <noscript><style>{`.brand-scroll-hero{height:auto!important;aspect-ratio:auto!important}.brand-scroll-hero__space{display:none}.brand-scroll-hero__frame{position:relative;width:min(100% - 2 * var(--gutter),var(--max));margin-inline:auto;transform:none}`}</style></noscript>
  </div>;
}
