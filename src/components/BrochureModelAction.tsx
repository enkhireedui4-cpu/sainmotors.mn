"use client";

import Link from "next/link";
import { useState } from "react";
import { catalogCopy } from "@/content/brochure-copy";
import type { Locale } from "@/lib/i18n";

export function BrochureModelAction({ locale, href, model, className }: {
  locale: Locale;
  href?: string;
  model?: string;
  className: string;
}) {
  const [showComing, setShowComing] = useState(false);
  const copy = catalogCopy[locale];
  const label = model ? copy.viewModel + " · " + model : undefined;

  if (href) {
    return <Link className={className} href={href} prefetch={false} aria-label={label}>{copy.viewModel}</Link>;
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setShowComing(true)} aria-label={label}>
        {copy.viewModel}
      </button>
      <span className={showComing ? "brochure-model-status" : "sr-only"} role="status">
        {showComing ? copy.modelComing : ""}
      </span>
    </>
  );
}
