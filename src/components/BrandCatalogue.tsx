"use client";
import type { ReactNode } from "react";
import { matchesBrand, type DiscoverableBrand } from "@/lib/brand-discovery";
import { changeQuery, useQuery } from "@/lib/use-query";

interface Entry extends DiscoverableBrand { content: ReactNode }
interface Props {
  entries: Entry[];
  categories: { id: string; label: string }[];
  labels: { all: string; search: string; searchPlaceholder: string; brandCount: string; empty: string; emptyBody: string; clear: string };
}

/** Every card is server rendered. Native controls progressively filter the same list. */
export function BrandCatalogue({ entries, categories, labels }: Props) {
  const search = useQuery();
  const params = new URLSearchParams(search ?? "");
  const requestedCategory = params.get("category") ?? "";
  const category = categories.some(item => item.id === requestedCategory) ? requestedCategory : "";
  const query = (params.get("q") ?? "").slice(0, 100);
  const results = entries.filter(entry => matchesBrand(entry, category, query));
  return <div className="brand-catalogue" data-ready={search !== null}>
    <div className="discovery-controls">
      <fieldset className="discovery-categories" disabled={search === null}>
        <legend className="sr-only">{labels.all}</legend>
        {[{ id: "", label: labels.all }, ...categories].map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => changeQuery({ category: item.id })}>{item.label}</button>)}
      </fieldset>
      <div className="discovery-search"><label htmlFor="brand-search">{labels.search}</label><input id="brand-search" type="search" maxLength={100} value={query} placeholder={labels.searchPlaceholder} disabled={search === null} onChange={event => changeQuery({ q: event.target.value }, true)} aria-controls="brand-results" /></div>
    </div>
    <div className="discovery-summary"><p role="status" aria-live="polite" aria-atomic="true"><strong>{results.length}</strong> {labels.brandCount}</p>{(category || query) && <button type="button" onClick={() => changeQuery({ category: "", q: "" })}>{labels.clear}</button>}</div>
    {results.length === 0 && <div className="discovery-empty"><h2>{labels.empty}</h2><p>{labels.emptyBody}</p></div>}
    <ul className="discovery-grid" id="brand-results" data-brand-directory>{entries.map(entry => <li key={entry.slug} className="discovery-card" hidden={!matchesBrand(entry, category, query)}>{entry.content}</li>)}</ul>
  </div>;
}
