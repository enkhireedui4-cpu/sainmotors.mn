import type { Metadata } from "next";
import { sainLogos, ui } from "@/content";
import { inter, zona } from "@/lib/fonts";
import { localePath, locales } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | Sain Motors",
  robots: { index: false, follow: true },
};

/**
 * Served for any unknown URL (out/404.html in the static export). The
 * language of a broken URL is unknown, so the page speaks both.
 */
export default function GlobalNotFound() {
  const logo = sainLogos["sain-color"];
  return (
    <html lang="mn" className={`${zona.variable} ${inter.variable}`}>
      <body>
        <header className="site-header">
          <div className="container site-header__inner">
            <a href={localePath("mn")} className="site-logo" aria-label={ui.home.mn}>
              <img src={logo.src} width={logo.width} height={logo.height} alt="" />
            </a>
          </div>
        </header>
        <main className="container not-found">
          <div className="not-found__pair">
            {locales.map((locale, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <section key={locale} lang={locale}>
                  <Heading>{ui.notFound.title[locale]}</Heading>
                  <p>{ui.notFound.body[locale]}</p>
                  <div className="actions">
                    <a className="button button--primary" href={pageHref(locale, "home")}>
                      {ui.notFound.home[locale]}
                    </a>
                    <a className="button button--outline" href={pageHref(locale, "brands")}>
                      {ui.nav.brands[locale]}
                    </a>
                  </div>
                </section>
              );
            })}
          </div>
        </main>
      </body>
    </html>
  );
}
