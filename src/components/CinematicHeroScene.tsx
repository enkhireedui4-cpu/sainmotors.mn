"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";
import "./home-cinematic-hero.css";

const mobileQuery = "(max-width: 47.99rem), (max-width: 63.99rem) and (max-height: 32rem)";
const playbackLabels = {
  en: {
    pause: { text: "Pause", name: "Pause video" },
    play: { text: "Play", name: "Play video" },
  },
  mn: {
    pause: { text: "Түр зогсоох", name: "Видеог түр зогсоох" },
    play: { text: "Тоглуулах", name: "Видеог тоглуулах" },
  },
};

export function CinematicHeroScene({ children, locale }: { children: ReactNode; locale: Locale }) {
  const filmId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const togglePlayback = useRef<(() => void) | null>(null);
  const [filmControl, setFilmControl] = useState<"pause" | "play" | null>(null);

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
    let manuallyPaused = false;

    const showPoster = () => {
      root.dataset.film = "poster";
      setFilmControl(null);
    };
    const sync = () => {
      if (disposed) return;
      if (reducedMotion.matches || connection?.saveData) {
        root.dataset.motion = "reduced";
        showPoster();
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
      if (manuallyPaused) {
        setFilmControl("play");
        return;
      }
      const filmSource = mobile.matches ? "/video/hero/ayud-tower-mobile.mp4" : "/video/hero/ayud-tower.mp4";
      if (video.getAttribute("src") !== filmSource) {
        root.dataset.film = "poster";
        video.src = filmSource;
      }
      if (video.paused) void video.play().catch((error: DOMException) => {
        if (!disposed && video.paused && error.name === "NotAllowedError" && video.getAttribute("src") === filmSource) {
          setFilmControl("play");
        }
      });
    };
    const showFilm = () => {
      root.dataset.film = "ready";
      if (!video.paused) setFilmControl("pause");
    };
    const onFilmPause = () => {
      if (video.paused) setFilmControl((control) => control && "play");
    };
    togglePlayback.current = () => {
      manuallyPaused = !video.paused;
      if (manuallyPaused) video.pause();
      else sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .05;
      sync();
    }, { threshold: .05, rootMargin: "-" + (document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0) + "px 0px 0px 0px" });
    observer.observe(root.closest("section") ?? root);
    video.addEventListener("playing", showFilm);
    video.addEventListener("pause", onFilmPause);
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
      togglePlayback.current = null;
      observer.disconnect();
      video.removeEventListener("playing", showFilm);
      video.removeEventListener("pause", onFilmPause);
      video.removeEventListener("error", showPoster);
      video.pause();
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
        <video ref={videoRef} id={filmId} className="cinematic-hero__film" preload="none" muted playsInline loop
          disablePictureInPicture tabIndex={-1} />
      </div>
      {children}
      {filmControl && (
        <button
          type="button"
          className="cinematic-hero__playback"
          aria-controls={filmId}
          aria-label={playbackLabels[locale][filmControl].name}
          onClick={() => togglePlayback.current?.()}
        >
          <Icon name={filmControl} size={16} />
          {playbackLabels[locale][filmControl].text}
        </button>
      )}
      <noscript><style>{"body:has(.orbit-home) .site-header{background:var(--sm-black)}"}</style></noscript>
    </div>
  );
}
