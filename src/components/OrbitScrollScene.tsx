"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** One passive scroll subscription for the statement, photo ribbon and header transition. */
export function OrbitScrollScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 64;
      const hero = document.querySelector(".home-orbit-hero");
      document.body.dataset.orbitScrolled = String((hero?.getBoundingClientRect().bottom ?? 0) <= header + 1);
      const rect = root.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * .85 - rect.top) / (innerHeight * .65)));
      root.style.setProperty("--statement-stop", reduce.matches ? "100%" : (progress * 100).toFixed(1) + "%");
      const shift = reduce.matches ? 0 : Math.max(-1, Math.min(1, (innerHeight * .5 - rect.top) / innerHeight)) * 24;
      root.style.setProperty("--photo-shift", shift.toFixed(1) + "px");
      root.dataset.enhanced = "true";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduce.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduce.removeEventListener("change", schedule);
      delete document.body.dataset.orbitScrolled;
    };
  }, []);
  return <div ref={rootRef} className="orbit-scroll-scene">{children}</div>;
}
