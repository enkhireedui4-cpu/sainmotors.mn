"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";
import "./home-video-hero.css";

const PHONE_MEDIA = "(max-width: 767px)";
const START_TIME = 1;
const HOLD_FRAME_TIME = 38;
const HOLD_DURATION = 3000;
const MEDIA_ROOT = "/video/hero/sain-motors-hero";

function HeroScrollCue({ locale }: { locale: Locale }) {
  const cancelScroll = useRef<(() => void) | null>(null);
  useEffect(() => () => cancelScroll.current?.(), []);

  const scrollToBrands = (event: MouseEvent<HTMLAnchorElement>) => {
    const heading = document.getElementById("brand-spotlight-heading");
    if (!heading) return;
    event.preventDefault();
    cancelScroll.current?.();
    const section = heading.closest("#home-brand-showcase") ?? heading;
    const brandRow = document.querySelector(".home-brands");
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
    const destination = (element: Element) => Math.max(0, element.getBoundingClientRect().top + window.scrollY - headerHeight);
    const focusDestination = () => {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: destination(section), behavior: "instant" });
      focusDestination();
      return;
    }

    let frame = 0;
    let dwell: number | undefined;
    const stop = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(dwell);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", onKey);
      cancelScroll.current = null;
    };
    const onKey = (key: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(key.key)) stop();
    };
    const travel = (target: Element, arrived: () => void) => {
      const from = window.scrollY;
      const to = destination(target);
      const started = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - started) / 650);
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        window.scrollTo({ top: from + (to - from) * eased, behavior: "instant" });
        if (progress < 1) frame = requestAnimationFrame(step);
        else arrived();
      };
      frame = requestAnimationFrame(step);
    };
    const finish = () => { stop(); focusDestination(); };
    const enterStudio = () => travel(section, finish);
    cancelScroll.current = stop;
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    if (brandRow) travel(brandRow, () => { dwell = window.setTimeout(enterStudio, 1200); });
    else enterStudio();
  };

  return <a
    className="home-video-hero__scroll"
    href="#home-brand-showcase"
    onClick={scrollToBrands}
    aria-label={locale === "mn" ? "Брэндүүд рүү доош гүйлгэх" : "Scroll down to our brands"}
  ><Icon name="arrowRight" size={23} /></a>;
}

/** One playback surface, with the supplied composition selected by the browser. */
export function HomeVideoHero({ locale, title }: { locale: Locale; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const phone = window.matchMedia(PHONE_MEDIA);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let positioned = false;
    let intentionallyPaused = false;
    let explicitlyStarted = false;
    let seekAttempts = 0;
    let holding = false;
    let holdFrameReady = false;
    let holdRemaining = HOLD_DURATION;
    let holdStarted = 0;
    let holdTimer: number | undefined;
    const header = document.querySelector(".site-header");
    const headerHeight = () => header?.getBoundingClientRect().height ?? 0;
    const bounds = video.getBoundingClientRect();
    let inView = bounds.bottom > headerHeight() && bounds.top < window.innerHeight;

    const canRun = () => inView && !document.hidden && !intentionallyPaused && (!reducedMotion.matches || explicitlyStarted);
    const pauseHold = () => {
      if (holdTimer === undefined) return;
      window.clearTimeout(holdTimer);
      holdTimer = undefined;
      holdRemaining = Math.max(0, holdRemaining - (performance.now() - holdStarted));
    };
    const continueHold = () => {
      if (!holding || !holdFrameReady || !canRun() || holdTimer !== undefined) return;
      holdStarted = performance.now();
      holdTimer = window.setTimeout(() => {
        holdTimer = undefined;
        holdRemaining = 0;
        if (canRun()) restart();
      }, holdRemaining);
    };
    const play = () => {
      if (holding || !positioned || !canRun()) return;
      setReady(true);
      void video.play().catch(() => {
        // The post-start poster remains available when autoplay is restricted.
      });
    };

    const seekToStart = () => {
      video.pause();
      positioned = false;
      if (video.readyState < 1 || (reducedMotion.matches && !explicitlyStarted)) return;
      if (video.seeking) return;
      if (Math.abs(video.currentTime - START_TIME) > .02) {
        // Keep the poster if a host cannot seek; never spin on seeked at zero.
        if (seekAttempts >= 2) return;
        seekAttempts++;
        video.currentTime = START_TIME;
      }
      else if (video.readyState >= 2) {
        positioned = true;
        setReady(true);
        play();
      }
    };

    const acceptFrame = () => {
      if (video.seeking || (reducedMotion.matches && !explicitlyStarted)) return;
      if (holding) {
        if (video.readyState >= 2 && Math.abs(video.currentTime - HOLD_FRAME_TIME) < .08) {
          holdFrameReady = true;
          setReady(true);
          continueHold();
        }
        return;
      }
      if (video.currentTime < START_TIME - .02) {
        if (video.readyState >= 2) seekToStart();
        return;
      }
      if (video.readyState < 2) return;
      positioned = true;
      setReady(true);
      play();
    };

    const restart = () => {
      pauseHold();
      holding = false;
      holdFrameReady = false;
      holdRemaining = HOLD_DURATION;
      seekAttempts = 0;
      seekToStart();
    };
    // The supplied clip ends on drifting. Return to the chosen lineup shot.
    const showLineup = () => {
      pauseHold();
      holding = true;
      holdFrameReady = false;
      holdRemaining = HOLD_DURATION;
      video.pause();
      if (Math.abs(video.currentTime - HOLD_FRAME_TIME) > .02) video.currentTime = HOLD_FRAME_TIME;
      else acceptFrame();
    };
    const resume = () => {
      if (holding) {
        if (holdFrameReady && canRun()) setReady(true);
        continueHold();
      } else if (positioned) play();
      else seekToStart();
    };
    const suspend = () => { pauseHold(); video.pause(); };
    const toggle = () => {
      if (holding) {
        intentionallyPaused = false;
        explicitlyStarted = true;
        restart();
      } else if (!video.paused) {
        intentionallyPaused = true;
        video.pause();
      } else {
        intentionallyPaused = false;
        explicitlyStarted = true;
        if (positioned) play();
        else {
          seekAttempts = 0;
          seekToStart();
        }
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        toggle();
      } else if (event.key === "Escape") {
        intentionallyPaused = true;
        suspend();
      }
    };
    const onVisibility = () => {
      if (document.hidden) suspend();
      else resume();
    };
    const onMotionChange = () => {
      explicitlyStarted = false;
      if (reducedMotion.matches) {
        suspend();
        setReady(false);
      } else resume();
    };
    const onSourceChange = () => {
      video.pause();
      pauseHold();
      holding = false;
      holdFrameReady = false;
      positioned = false;
      seekAttempts = 0;
      setReady(false);
      // Re-evaluate source media queries without downloading both MP4s.
      video.load();
    };
    const onError = () => {
      video.pause();
      pauseHold();
      holding = false;
      holdFrameReady = false;
      positioned = false;
      setReady(false);
    };
    let observer: IntersectionObserver;
    const observeVisibleArea = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= .01;
        if (!inView) suspend();
        else resume();
      }, {
        // The sticky header conceals this strip, including after ordinary scrolling.
        rootMargin: `-${headerHeight()}px 0px 0px 0px`,
        threshold: .01,
      });
      observer.observe(video);
    };
    const headerResize = new ResizeObserver(observeVisibleArea);
    if (header) headerResize.observe(header);

    video.muted = true;
    video.addEventListener("loadedmetadata", seekToStart);
    video.addEventListener("loadeddata", acceptFrame);
    video.addEventListener("canplay", acceptFrame);
    video.addEventListener("seeked", acceptFrame);
    video.addEventListener("ended", showLineup);
    video.addEventListener("error", onError);
    video.addEventListener("click", toggle);
    video.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    phone.addEventListener("change", onSourceChange);
    reducedMotion.addEventListener("change", onMotionChange);
    observeVisibleArea();
    const initialFrame = requestAnimationFrame(seekToStart);

    return () => {
      cancelAnimationFrame(initialFrame);
      observer.disconnect();
      headerResize.disconnect();
      pauseHold();
      video.pause();
      video.removeEventListener("loadedmetadata", seekToStart);
      video.removeEventListener("loadeddata", acceptFrame);
      video.removeEventListener("canplay", acceptFrame);
      video.removeEventListener("seeked", acceptFrame);
      video.removeEventListener("ended", showLineup);
      video.removeEventListener("error", onError);
      video.removeEventListener("click", toggle);
      video.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      phone.removeEventListener("change", onSourceChange);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <section className="home-video-hero" aria-labelledby="home-title" data-ready={ready}>
      <h1 id="home-title" className="sr-only">{title}</h1>
      <picture className="home-video-hero__poster">
        <source media={PHONE_MEDIA} srcSet={`${MEDIA_ROOT}-mobile-poster.webp`} />
        <img src={`${MEDIA_ROOT}-desktop-poster.webp`} width={1152} height={648} alt="" fetchPriority="high" />
      </picture>
      <video
        ref={videoRef}
        className="home-video-hero__video"
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        tabIndex={0}
        aria-label={locale === "mn"
          ? "SAIN Motors-ийн танилцуулга бичлэг. Дарж эсвэл Space, Enter товчоор түр зогсоох, үргэлжлүүлэх. Төгсгөлийн кадр дээр дарвал эхнээс тоглоно. Escape товчоор зогсоох."
          : "SAIN Motors introduction video. Click or press Space or Enter to pause or resume. On the ending still, restart from the beginning. Press Escape to pause."}
      >
        <source media={PHONE_MEDIA} src={`${MEDIA_ROOT}-mobile.mp4`} type="video/mp4" />
        <source src={`${MEDIA_ROOT}-desktop.mp4`} type="video/mp4" />
      </video>
      <HeroScrollCue locale={locale} />
    </section>
  );
}
