"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from "react";
import { r8Content, type R8Feature } from "@/content/rely-r8";
import type { Locale } from "@/lib/i18n";
import { R8LeadForm } from "./R8LeadForm";
import "@/app/rely-r8.css";

function R8Image({ name, alt = "", className, eager = false }: { name: string; alt?: string; className?: string; eager?: boolean }) {
  return <picture className={className}>
    <source media="(max-width: 768px)" srcSet={`/rely-r8/${name}-mobile.webp`} />
    <img src={`/rely-r8/${name}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} draggable={false} />
  </picture>;
}

function FeatureDetails({ feature }: { feature: R8Feature }) {
  return <div className="r8-feature-panel__content">
    {feature.details.map(detail => <article className="r8-detail" key={detail.image}>
      <h3>{detail.title}</h3>
      {detail.text && <p>{detail.text}</p>}
      {detail.metrics && <dl className="r8-detail__metrics">{detail.metrics.map(metric => <div key={metric.label}>
        <dt>{metric.label}</dt><dd>{metric.value}{metric.unit && <span>{metric.unit}</span>}</dd>
      </div>)}</dl>}
      {detail.points && <ul className="r8-detail__points">{detail.points.map(point => <li key={point}>{point}</li>)}</ul>}
      <img src={`/rely-r8/detail-${detail.image}.webp`} alt={detail.title} loading="lazy" />
    </article>)}
  </div>;
}

export function RelyR8Experience({ locale, children }: { locale: Locale; children?: ReactNode }) {
  const copy = r8Content[locale];
  const [terrain, setTerrain] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const featureDialog = useRef<HTMLDialogElement>(null);
  const specifications = useRef<HTMLDialogElement>(null);
  const featureButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const terrainButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const dialog = featureDialog.current;
    if (!dialog || selectedFeature === null) return;
    const mobile = window.matchMedia("(max-width: 768px)");
    function showDetails() {
      if (!dialog) return;
      if (dialog.open) dialog.close();
      if (mobile.matches) dialog.showModal(); else dialog.show();
      dialog.scrollTop = 0;
      dialog.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    }
    showDetails();
    mobile.addEventListener("change", showDetails);
    return () => { mobile.removeEventListener("change", showDetails); if (dialog.open) dialog.close(); };
  }, [selectedFeature]);

  function startSwipe(event: TouchEvent) {
    const touch = event.changedTouches[0];
    if (touch) swipeStart.current = { x: touch.clientX, y: touch.clientY };
  }
  function finishSwipe(event: TouchEvent, action: (direction: number) => void) {
    const start = swipeStart.current;
    const touch = event.changedTouches[0];
    swipeStart.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) action(dx < 0 ? 1 : -1);
  }
  function terrainKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % 4;
    else if (event.key === "ArrowLeft") next = (index + 3) % 4;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 3;
    else return;
    event.preventDefault(); setTerrain(next); terrainButtons.current[next]?.focus();
  }
  function closeFeature() {
    const previous = selectedFeature;
    featureDialog.current?.close();
    setSelectedFeature(null);
    if (previous !== null) requestAnimationFrame(() => featureButtons.current[previous]?.focus({ preventScroll: true }));
  }

  return <div className="r8-experience" lang={locale}>
    <section className="r8-hero" aria-label={copy.label}>
      <R8Image name="hero-1-clean" alt={copy.heroAlt} eager />
      <div className="r8-hero__copy"><h1 className="r8-hero__brand" translate="no">RELY R8</h1><p className="r8-hero__tagline">{copy.heroTagline}</p></div>
    </section>

    <section className="r8-mission" aria-labelledby="r8-mission-heading">
      <R8Image name="mission-mark" alt="RELY" className="r8-mission__mark" />
      <div className="r8-mission__copy"><h2 id="r8-mission-heading">{copy.missionTitle}</h2><p>{copy.mission}</p></div>
      <div className="r8-mission__values">{copy.values.map(value => <div key={value.title}><h3>{value.title}</h3><p>{value.text}</p></div>)}</div>
    </section>

    <section className="r8-terrain" aria-labelledby="r8-terrain-heading">
      <h2 className="sr-only" id="r8-terrain-heading">{copy.terrainsTitle}</h2>
      <div className="r8-terrain__photo" role="tabpanel" id="r8-terrain-panel" aria-labelledby={`r8-terrain-tab-${terrain}`} onTouchStart={startSwipe}
        onTouchEnd={event => finishSwipe(event, direction => setTerrain(previous => (previous + direction + 4) % 4))}>
        <R8Image name={`terrain-${terrain + 1}`} alt={`${copy.label} — ${copy.terrains[terrain]}`} />
        <img className="r8-terrain__wordmark" src="/rely-r8/terrain-mark.webp" alt="RELY R8" width="472" height="110" loading="lazy" />
      </div>
      <p className="r8-terrain__caption" aria-hidden="true">{copy.terrains[terrain]}</p>
      <div className="r8-terrain__tabs" role="tablist" aria-label={copy.terrainsTitle}>{copy.terrains.map((name, index) => <button role="tab" type="button" key={name}
        id={`r8-terrain-tab-${index}`} aria-controls="r8-terrain-panel" aria-selected={terrain === index} tabIndex={terrain === index ? 0 : -1}
        ref={element => { terrainButtons.current[index] = element; }} onClick={() => setTerrain(index)} onKeyDown={event => terrainKey(event, index)}>{name}</button>)}</div>
    </section>

    <section className="r8-features" aria-labelledby="r8-features-heading" data-expanded={selectedFeature !== null}>
      <h2 id="r8-features-heading" className="sr-only">{copy.featuresTitle}</h2>
      {copy.features.map((feature, index) => <div className="r8-feature" key={feature.key} data-selected={selectedFeature === index}>
        <button type="button" className="r8-feature__trigger" ref={element => { featureButtons.current[index] = element; }}
          aria-label={`${feature.name}: ${copy.explore}`} aria-expanded={selectedFeature === index} aria-controls="r8-feature-panel"
          onClick={() => selectedFeature === index ? closeFeature() : setSelectedFeature(index)}>
          <R8Image name={`feature-${feature.key}`} />
          <span className="r8-feature__name" translate="no">{feature.name}</span>
          <span className="r8-feature__explore"><span aria-hidden="true">+</span><span>{copy.explore}</span></span>
        </button>
      </div>)}
      <dialog ref={featureDialog} id="r8-feature-panel" className="r8-feature-panel r8-dialog" aria-labelledby="r8-feature-panel-heading"
        onCancel={event => { event.preventDefault(); closeFeature(); }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); closeFeature(); } }}>
        <div className="r8-feature-panel__top"><h2 id="r8-feature-panel-heading" translate="no">{selectedFeature === null ? "" : copy.features[selectedFeature].name}</h2>
          <button className="r8-feature-panel__close r8-close" type="button" aria-label={copy.close} onClick={closeFeature}><span aria-hidden="true">×</span></button></div>
        {selectedFeature !== null && <FeatureDetails feature={copy.features[selectedFeature]} />}
      </dialog>
    </section>

    <section className="r8-accessories" aria-labelledby="r8-accessories-heading">
      <h2 id="r8-accessories-heading">{copy.accessoriesTitle}</h2><p className="r8-accessories__intro">{copy.accessoriesText}</p>
      <ul>{copy.accessories.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className="r8-powertrains" aria-labelledby="r8-powertrains-heading">
      <div className="r8-powertrains__content"><h2 id="r8-powertrains-heading">{copy.powertrainsTitle}</h2>
        <div className="r8-powertrains__options">{[{ engine: "2.3", type: "T", gears: "6", box: "MT" }, { engine: "2.3", type: "T", gears: "8", box: "AT" }, { engine: "2.4", type: "L", gears: "5", box: "MT" }].map(option => <div key={option.box + option.engine}>
          <p translate="no"><strong>{option.engine}</strong><span>{option.type}</span><strong>{option.gears}</strong><span>{option.box}</span></p><span translate="no">2WD / 4WD</span>
        </div>)}</div>
        <button type="button" className="r8-configuration" onClick={() => specifications.current?.showModal()}>{copy.configuration}</button>
      </div>
    </section>
    <dialog ref={specifications} id="r8-specifications" className="r8-specifications r8-dialog" aria-labelledby="r8-specifications-heading">
      <div className="r8-specifications__top"><h2 id="r8-specifications-heading">{copy.specifications}</h2><button type="button" className="r8-close" aria-label={copy.close} onClick={() => specifications.current?.close()}><span aria-hidden="true">×</span></button></div>
      <div className="r8-specifications__body"><p>{copy.brochureNote}</p><div className="r8-specifications__links"><a href="/rely-r8/RELY-R8-brochure.pdf" target="_blank" rel="noopener">{copy.openPdf} ↗</a><a href="/rely-r8/RELY-R8-brochure.pdf" download="RELY-R8-brochure.pdf">{copy.download} ↓</a></div>
        <div className="r8-brochure-pages">{[1, 2].map(page => <figure key={page}>
          <a href={`/rely-r8/RELY-R8-brochure.pdf#page=${page}`} target="_blank" rel="noopener" aria-label={`${copy.openPdf}: ${copy.page} ${page}`}>
            <img src={`/rely-r8/brochure-page-${page}.webp`} alt={`${copy.specifications} — ${copy.page} ${page}`} width="1800" height="2546" loading="lazy" />
          </a><figcaption>{copy.page} {page} / 2</figcaption>
        </figure>)}</div>
      </div>
    </dialog>
    <div className="r8-enquiry">{children}<R8LeadForm locale={locale} /></div>
  </div>;
}
