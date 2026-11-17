import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { brandHref } from "@/lib/routes";
import type { Locale } from "@/lib/i18n";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  locale: Locale;
  slug: string;
  prefetch?: boolean;
};

/** Keep the logo and hover styling for brands whose pages are not ready. */
export function BrandLink({ locale, slug, prefetch = false, tabIndex, ...props }: Props) {
  const href = brandHref(locale, slug);
  if (!href) return <a {...props} />;
  return <Link href={href} prefetch={prefetch} tabIndex={tabIndex} {...props} />;
}
