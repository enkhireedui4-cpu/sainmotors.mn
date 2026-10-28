"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { localeNames, locales, localePath, switchLocalePath, type Locale } from "@/lib/i18n";

function subscribeToUrl(onChange: () => void) {
  const events = ["popstate", "hashchange", "sain:location-filters", "sain:query-change"];
  events.forEach(event => window.addEventListener(event, onChange));
  return () => events.forEach(event => window.removeEventListener(event, onChange));
}
const getUrlSuffix = () => window.location.search + window.location.hash;
const getServerSuffix = () => "";

/**
 * MN / EN. Links to the same page in the other language. A plain <a> (full
 * page load) so <html lang>, metadata and hreflang always match the language.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? localePath(locale);
  const suffix = useSyncExternalStore(subscribeToUrl, getUrlSuffix, getServerSuffix);
  return (
    <div className="lang-switch" role="group" aria-label={label}>
      {locales.map((l, i) => [
        i > 0 && (
          <span key={`sep-${l}`} className="lang-switch__sep" aria-hidden="true">
            /
          </span>
        ),
        l === locale ? (
          <span key={l} className="lang-switch__item" aria-current="true" lang={l}>
            <span aria-hidden="true">{localeNames[l].short}</span>
            <span className="sr-only">{localeNames[l].full}</span>
          </span>
        ) : (
          <a key={l} className="lang-switch__item" href={switchLocalePath(pathname, l) + suffix} hrefLang={l} lang={l}>
            <span aria-hidden="true">{localeNames[l].short}</span>
            <span className="sr-only">{localeNames[l].full}</span>
          </a>
        ),
      ])}
    </div>
  );
}
