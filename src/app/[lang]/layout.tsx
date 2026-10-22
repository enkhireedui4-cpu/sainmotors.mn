import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ui } from "@/content";
import { inter, zona } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n";
import { assertReleasable } from "@/lib/release";
import { IS_INDEXABLE, IS_RELEASE, SITE_URL } from "@/lib/site";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Sain Motors", template: "%s | Sain Motors" },
  applicationName: "Sain Motors",
  formatDetection: { telephone: false, email: false, address: false },
  ...(IS_INDEXABLE ? {} : { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

// Review mode for staging: open any page with ?review to outline draft
// content (dashed) until the tab is closed. Never shipped in release builds.
const REVIEW_SCRIPT =
  "try{var s=sessionStorage,k='sm-review';if(/[?&]review\\b/.test(location.search))s.setItem(k,'1');if(s.getItem(k)==='1')document.documentElement.setAttribute('data-review','')}catch(e){}";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (IS_RELEASE) assertReleasable();

  return (
    <html lang={lang} className={`${zona.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>{!IS_RELEASE && <script dangerouslySetInnerHTML={{ __html: REVIEW_SCRIPT }} />}</head>
      <body>
        <a className="skip-link" href="#main">
          {ui.skipToContent[lang]}
        </a>
        <SiteHeader locale={lang} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter locale={lang} />
      </body>
    </html>
  );
}

