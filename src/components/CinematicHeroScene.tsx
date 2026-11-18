"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./home-cinematic-hero.css";

const mobileQuery = "(max-width: 47.99rem), (max-width: 63.99rem) and (max-height: 32rem)";

export function CinematicHeroScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia(mobileQuery);
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let visible = false;
    let fontsReady = false;
    let disposed = false;

    const sync = () => {
      if (disposed) return;
      if (reducedMotion.matches || connection?.saveData) {
        root.dataset.motion = "reduced";
        root.dataset.film = "poster";
        if (video.hasAttribute("src")) {
          video.removeAttribute("src");
          video.load();
        }
        return;
      }
      if (!visible || document.hidden || !fontsReady) {
        root.dataset.motion = fontsReady ? "paused" : "static";
        video.pause();
        return;
      }
      root.dataset.motion = "running";
      const filmSource = mobile.matches ? "/video/hero/ayud-tower-mobile.mp4" : "/video/hero/ayud-tower.mp4";
      if (video.getAttribute("src") !== filmSource) {
        root.dataset.film = "poster";
        video.src = filmSource;
      }
      if (video.paused) void video.play().catch(() => {
        // The picture remains visible when the browser restricts autoplay.
      });
    };
    const showFilm = () => { root.dataset.film = "ready"; };
    const showPoster = () => { root.dataset.film = "poster"; };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .05;
      sync();
    }, { threshold: .05, rootMargin: "-" + (document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0) + "px 0px 0px 0px" });
    observer.observe(root.closest("section") ?? root);
    video.addEventListener("playing", showFilm);
    video.addEventListener("error", showPoster);
    reducedMotion.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    void document.fonts.ready.then(() => {
      fontsReady = true;
      sync();
    });
    sync();
    return () => {
      disposed = true;
      observer.disconnect();
      video.pause();
      video.removeEventListener("playing", showFilm);
      video.removeEventListener("error", showPoster);
      reducedMotion.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={rootRef} className="cinematic-hero" data-motion="static" data-film="poster">
      <div className="cinematic-hero__media" aria-hidden="true">
        <img src="/art/ayud-tower.webp" width={1600} height={900} alt="" fetchPriority="high" />
        <video ref={videoRef} className="cinematic-hero__film" preload="none" muted playsInline loop
          disablePictureInPicture tabIndex={-1} />
      </div>
      {children}
      <noscript><style>{"body:has(.orbit-home) .site-header{background:var(--sm-black)}"}</style></noscript>
    </div>
  );
}
