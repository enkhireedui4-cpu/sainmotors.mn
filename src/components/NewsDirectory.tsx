"use client";

import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { PageBand } from "./PageBand";

const categories = ["all", "news", "media", "csr"] as const;
type Category = (typeof categories)[number];
const copy = {
  en: { title: "News", filters: "News categories", all: "All news", news: "News", media: "Mass media about us", csr: "Corporate and social responsibility", empty: "There are no articles in this category yet.", count: "articles" },
  mn: { title: "Мэдээ", filters: "Мэдээний ангилал", all: "Бүх мэдээ", news: "Мэдээ", media: "Бидний тухай хэвлэлд", csr: "Компанийн нийгмийн хариуцлага", empty: "Энэ ангилалд одоогоор мэдээ байхгүй байна.", count: "мэдээ" },
};

export function NewsDirectory({ locale, articleCategories, children }: { locale: Locale; articleCategories: string[]; children: ReactNode }) {
  const [category, setCategory] = useState<Category>("all");
  const text = copy[locale];
  const count = articleCategories.filter(value => category === "all" || value === category).length;
  return <div className="news-design-page news-directory" data-category={category}>
    <PageBand locale={locale} title={text.title} className="news-directory__band">
      <div className="ob-chips news-directory__filters" role="group" aria-label={text.filters}>
        {categories.map(value => <button key={value} className="ob-chip" type="button" data-news-category={value} aria-pressed={category === value} aria-controls="news-results" onClick={() => setCategory(value)}>{text[value]}</button>)}
      </div>
    </PageBand>
    <section id="news-results" className="container news-page" aria-label={text.title}>
      <p className="sr-only" role="status" aria-live="polite">{count} {text.count}</p>
      {count === 0 && <p className="news-directory__empty">{text.empty}</p>}
      {children}
    </section>
  </div>;
}
