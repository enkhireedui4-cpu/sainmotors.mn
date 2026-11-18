"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./home-cinematic-hero.css";

const portraitQuery = "(max-aspect-ratio: 1/1)";

export function CinematicHeroScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const portrait = window.matchMedia(portraitQuery);
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let visible = false;
    let fontsReady = false;
    let disposed = false;

    const sync = () => {
      if (disposed) return;
      if (reducedMotion.matches || connection?.saveData) {
        root.dataset.intro = "complete";
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
      const source = portrait.matches ? "/video/hero/altai-road-mobile.mp4" : "/video/hero/altai-road.mp4";
      if (video.getAttribute("src") !== source) {
        root.dataset.film = "poster";
        video.src = source;
      }
      if (video.paused) void video.play().catch(() => {
        // The picture remains visible when the browser restricts autoplay.
      });
    };
    const showFilm = () => { root.dataset.film = "ready"; };
    const showPoster = () => { root.dataset.film = "poster"; };
    const finish = (event: AnimationEvent) => {
      if (event.animationName === "cinematic-logo-in") root.dataset.intro = "complete";
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .05;
      sync();
    }, { threshold: .05, rootMargin: "-" + (document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0) + "px 0px 0px 0px" });
    observer.observe(root.closest("section") ?? root);
    video.addEventListener("playing", showFilm);
    video.addEventListener("error", showPoster);
    root.addEventListener("animationend", finish);
    reducedMotion.addEventListener("change", sync);
    portrait.addEventListener("change", sync);
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
      root.removeEventListener("animationend", finish);
      reducedMotion.removeEventListener("change", sync);
      portrait.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={rootRef} className="cinematic-hero" data-motion="static" data-intro="playing" data-film="poster">
      <div className="cinematic-hero__media" aria-hidden="true">
        <picture>
          <source media={portraitQuery} srcSet="/art/altai-road-mobile.webp" width={941} height={1672} />
          <img src="/art/altai-road.webp" width={1672} height={941} alt="" fetchPriority="high" />
        </picture>
        <video ref={videoRef} className="cinematic-hero__film" preload="none" muted playsInline loop
          disablePictureInPicture tabIndex={-1} />
      </div>
      {children}
      <noscript><style>{".cinematic-hero *{animation:none!important}body:has(.orbit-home) .site-header{background:var(--sm-black)}"}</style></noscript>
    </div>
  );
}
