import type { Metadata } from "next";
import { draftAttr } from "@/lib/content-status";
import { PageHero } from "@/components/PageHero";
import { contact, pages, ui } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

const UPDATED = "2026-10-15";
const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "mn" ? "mn-MN" : "en-GB", { dateStyle: "long", timeZone: "Asia/Ulaanbaatar" }).format(
    new Date(`${iso}T12:00:00+08:00`),
  );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const meta = pages.privacy.meta.value[locale];
  return pageMetadata({ locale, path: "privacy", title: meta.title, description: meta.description });
}

export default async function PrivacyPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const page = pages.privacy;

  return (
    <>
      <PageHero title={page.meta.value[locale].title}>
        <p className="mt-4 text-sm muted">
          {ui.updated[locale]}: <time dateTime={UPDATED}>{formatDate(UPDATED, locale)}</time>
        </p>
      </PageHero>

      <div className="container">
        <p className="notice measure" data-status={draftAttr(page.review)}>
          {page.review.value[locale]}
        </p>
      </div>

      <section className="section">
        <div className="container prose-grid">
          {page.sections.map((section) => (
            <section key={section.value.en.heading} data-status={draftAttr(section)}>
              <h2 className="heading-3">{section.value[locale].heading}</h2>
              <p>{section.value[locale].body}</p>
            </section>
          ))}
          <section>
            <h2 className="heading-3">{ui.privacy.contact[locale]}</h2>
            <p>
              {ui.privacy.contactBody[locale]}{" "}
              <a className="text-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
