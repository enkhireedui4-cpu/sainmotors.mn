"use client";
import { useSyncExternalStore } from "react";

const EVENT = "sain:query-change";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(EVENT, callback);
  return () => { window.removeEventListener("popstate", callback); window.removeEventListener(EVENT, callback); };
}
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => null;
export function useQuery() { return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot); }
export function changeQuery(values: Record<string, string>, replace = false) {
  const query = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(values)) { if (value) query.set(key, value); else query.delete(key); }
  const suffix = query.toString();
  const url = `${window.location.pathname}${suffix ? `?${suffix}` : ""}${window.location.hash}`;
  window.history[replace ? "replaceState" : "pushState"](null, "", url);
  window.dispatchEvent(new Event(EVENT));
}
