"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Notify static-HTML query stores when Next navigates within the same route. */
export function QueryNavigationSync() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  useEffect(() => { window.dispatchEvent(new Event("sain:query-change")); }, [pathname, query]);
  return null;
}
