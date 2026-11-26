"use client";

import Link from "next/link";
import { useSyncExternalStore, type MouseEvent } from "react";
import { catalogCopy, catalogModelTitle } from "@/content/brochure-copy";
import type { CatalogPhoto } from "@/content/brochures";
import type { Locale } from "@/lib/i18n";
import { BrochureModelAction } from "./BrochureModelAction";

export type BrochureGroup = {
  id: string;
  name: string;
  models: readonly {
    id: string;
    name: string;
    trim?: string;
    photo?: CatalogPhoto;
    brochureHref: string;
    opensPdf: boolean;
    modelHref?: string;
    galleryHref?: string;
  }[];
};

const changeEvent = "sain:query-change";

function subscribe(callback: () => void) {
  const events = ["popstate", "hashchange", changeEvent];
  events.forEach(event => window.addEventListener(event, callback));
  return () => events.forEach(event => window.removeEventListener(event, callback));
}

function locationSnapshot() {
  return window.location.search + window.location.hash;
}

export function BrochureCatalog({ groups, locale }: { groups: BrochureGroup[]; locale: Locale }) {
  const copy = catalogCopy[locale];
  const location = useSyncExternalStore(subscribe, locationSnapshot, () => null);
  const [search, hash = ""] = (location ?? "").split("#", 2);
  const faqActive = hash === "faq";
  const urlBrand = new URLSearchParams(search).get("brand") ?? hash.match(/^brand-([a-z0-9-]+)$/)?.[1] ?? "";
  const brandId = urlBrand === "baw" ? "212" : urlBrand;
  const selectedGroup = groups.find(group => group.id === brandId);
  const results = selectedGroup ? [selectedGroup] : groups;
  const modelCount = results.reduce((count, group) => count + group.models.length, 0);

  function updateLocation(next: URL) {
    window.history.pushState(null, "", next);
    window.dispatchEvent(new Event(changeEvent));
  }

  function selectBrand(id: string) {
    if (id === (selectedGroup?.id ?? "")) return;
    const next = new URL(window.location.href);
    if (id) next.searchParams.set("brand", id);
    else next.searchParams.delete("brand");
    if (next.hash.startsWith("#brand-")) next.hash = "";
    updateLocation(next);
  }

  function selectSection(event: MouseEvent<HTMLAnchorElement>, section: "catalog" | "faq") {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if ((section === "faq") === faqActive) return;
    const next = new URL(window.location.href);
    if (hash.startsWith("brand-") && selectedGroup) next.searchParams.set("brand", selectedGroup.id);
    next.hash = section === "faq" ? "faq" : "";
    updateLocation(next);
  }

  return (
    <div className="brochure-directory">
      <nav className="brochure-section-menu" aria-label={copy.sections}>
        <div className="container">
          <a href="#catalog" aria-current={!faqActive ? "location" : undefined} onClick={event => selectSection(event, "catalog")}>{copy.models}</a>
          <a href="#faq" aria-current={faqActive ? "location" : undefined} onClick={event => selectSection(event, "faq")}>{copy.faqTitle}</a>
        </div>
      </nav>
      <section id="catalog" hidden={faqActive} aria-labelledby="brochure-models-heading">
        <div className="brochure-toolbar">
          <fieldset className="container brochure-filters" disabled={location === null}>
            <legend className="sr-only">{copy.filters}</legend>
            <div className="brochure-filters__options">
              <button type="button" aria-pressed={!selectedGroup} onClick={() => selectBrand("")}>{copy.all}</button>
              {groups.map(group => (
                <button key={group.id} type="button" aria-pressed={selectedGroup?.id === group.id} onClick={() => selectBrand(group.id)}>
                  {group.name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="container brochure-catalog">
          <div className="brochure-catalog__heading">
            <h2 id="brochure-models-heading">{copy.models}</h2>
            <p className="brochure-count" role="status">{copy.count(modelCount)}</p>
          </div>
          {results.map(group => (
            <section className="brochure-group" key={group.id} aria-labelledby={`catalog-${group.id}`}>
              <h3 id={`catalog-${group.id}`} translate="no">{group.name}</h3>
              <ul className="brochure-grid" role="list">
                {group.models.map(model => {
                  const title = catalogModelTitle(group.name, model.name);
                  const fullName = [title, model.trim].filter(Boolean).join(" ");
                  const photo = model.photo ? (
                    <img src={model.photo.src} width={model.photo.width} height={model.photo.height} alt="" loading="lazy" decoding="async" />
                  ) : null;
                  return (
                    <li key={model.id} className="brochure-card">
                      <div className="brochure-card__media">
                        {photo && model.galleryHref ? (
                          <Link className="brochure-card__media-link" href={model.galleryHref} prefetch={false}
                            aria-label={copy.gallery + " · " + fullName} title={copy.gallery}>{photo}</Link>
                        ) : photo}
                      </div>
                      <div className="brochure-card__body">
                        <h4 translate="no">{model.name}</h4>
                        {model.trim && <p translate="no">{model.trim}</p>}
                        <div className="brochure-card__actions">
                          <a className="button button--primary" href={model.brochureHref} target={model.opensPdf ? "_blank" : undefined}
                            rel={model.opensPdf ? "noopener" : undefined} aria-label={copy.viewBrochure + " · " + fullName}>
                            {copy.viewBrochure}
                            {model.opensPdf && <span aria-hidden="true">↗</span>}
                          </a>
                          <BrochureModelAction className="button button--outline brochure-model-link" locale={locale} href={model.modelHref} model={fullName} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <section className="container brochure-faq" id="faq" hidden={location !== null && !faqActive} aria-labelledby="brochure-faq-title">
        <h2 id="brochure-faq-title">{copy.faqTitle}</h2>
        {copy.faq.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
