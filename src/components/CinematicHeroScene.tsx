"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import "./home-cinematic-hero.css";

const EARTH_FILM = "/video/hero/sain-earth.mp4";
const EARTH_POSTER = "/video/hero/sain-earth-poster.webp";

/** One controller keeps the film and the opening sequence on the same pause boundary. */
export function CinematicHeroScene({ children, labels }: { children: ReactNode; labels: { pause: string; play: string } }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let fontsReady = false;
    let disposed = false;

    const sync = () => {
      if (disposed) return;
      if (reducedMotion.matches) root.dataset.intro = "complete";
      const moving = !reducedMotion.matches && !paused && visible && !document.hidden && fontsReady;
      root.dataset.motion = reducedMotion.matches ? "reduced" : !fontsReady ? "static" : moving ? "running" : "paused";
      if (toggleRef.current) toggleRef.current.hidden = reducedMotion.matches;
      for (const animation of root.getAnimations({ subtree: true })) {
        if (moving && animation.playState === "paused") animation.play();
        else if (!moving && animation.playState === "running") animation.pause();
      }
      if (!moving) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) {
        video.src = EARTH_FILM;
        video.load();
      }
      if (video.paused) void video.play().catch(() => {
        // A real frame remains visible when a device restricts automatic playback.
      });
    };
    const ready = () => { root.dataset.media = "ready"; sync(); };
    const failed = () => { root.dataset.media = "fallback"; };
    const finish = (event: AnimationEvent) => {
      if (event.animationName === "cinematic-letter-in" && (event.target as Element).hasAttribute("data-last-letter")) {
        root.dataset.intro = "complete";
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .05;
      sync();
    }, { threshold: .05, rootMargin: "-" + (document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0) + "px 0px 0px 0px" });
    observer.observe(root.closest("section") ?? root);
    video.addEventListener("loadeddata", ready);
    video.addEventListener("error", failed);
    root.addEventListener("animationend", finish);
    reducedMotion.addEventListener("change", sync);
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
      video.removeEventListener("loadeddata", ready);
      video.removeEventListener("error", failed);
      root.removeEventListener("animationend", finish);
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);

  return (
    <div ref={rootRef} className="cinematic-hero" data-motion="static" data-intro="playing" data-media="poster">
      <div className="cinematic-hero__media" aria-hidden="true">
        <img src={EARTH_POSTER} width={1920} height={1080} alt="" fetchPriority="high" />
        <video ref={videoRef} className="cinematic-hero__video" width={1920} height={1080}
          poster={EARTH_POSTER} preload="none" muted playsInline loop disablePictureInPicture tabIndex={-1} />
      </div>
      <svg className="cinematic-hero__orbits" viewBox="0 0 1600 1000" fill="none" aria-hidden="true">
        <defs><linearGradient id="cinematic-orbit-light" x1="100" y1="800" x2="1500" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d8be87" stopOpacity="0" /><stop offset=".4" stopColor="#d8be87" stopOpacity=".18" />
          <stop offset=".65" stopColor="#fff1ce" stopOpacity=".6" /><stop offset="1" stopColor="#d8be87" stopOpacity="0" />
        </linearGradient></defs>
        {[0, 1, 2].map(i => <ellipse key={i} cx="800" cy="510" rx={680 + i * 9} ry={235 + i * 28}
          transform={"rotate(" + (-21 + i * 2) + " 800 510)"} stroke="url(#cinematic-orbit-light)" strokeWidth={i === 1 ? 1.2 : .6} />)}
        <ellipse className="cinematic-hero__orbit-light" cx="800" cy="510" rx="689" ry="263" transform="rotate(-19 800 510)"
          stroke="#e3c791" strokeWidth="1.5" strokeDasharray="90 2600" pathLength="2690" opacity=".65" />
      </svg>
      {children}
      <button ref={toggleRef} className="home-orbit-hero__motion" type="button" aria-pressed={paused}
        aria-label={paused ? labels.play : labels.pause} onClick={() => setPaused(value => !value)}>
        <Icon name={paused ? "play" : "pause"} size={14} />
      </button>
      <noscript><style>{".cinematic-hero *{animation:none!important}.cinematic-hero__video,.home-orbit-hero__motion{display:none!important}body:has(.orbit-home) .site-header{background:#030710}"}</style></noscript>
    </div>
  );
}
