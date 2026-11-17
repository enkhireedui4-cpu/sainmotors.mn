import { describe, expect, it } from "vitest";
import { getNewsArticles, newsDate } from "@/lib/news";
import type { NewsArticle } from "@/content/types";

describe("news catalogue", () => {
  it("keeps the festival report, withdraws the two removed reports and separates Word topics", () => {
    const articles = getNewsArticles();
    const ids = articles.map(article => article.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("mega-test-drive-6");
    for (const edition of [7,8]) expect(ids).not.toContain(`mega-test-drive-${edition}`);
    expect(ids).toContain("byd-official-distributor-2025");
    expect(new Set(articles.map(article => article.category))).toEqual(new Set(["news","media","csr"]));
    for (const article of articles) for (const locale of ["mn","en"] as const) {
      expect(article.title[locale].trim(), article.id).not.toBe("");
      expect(article.sections.some(section => section.body?.[locale].trim() || section.bullets?.[locale].length),article.id).toBe(true);
    }
  });

  it("never turns an unspecified date or a partial date into a made-up day", () => {
    const article = getNewsArticles()[0];
    const dated = (date: NewsArticle["date"]) => ({...article,date});
    expect(newsDate(dated(undefined),"mn")).toBe("");
    expect(newsDate(dated(undefined),"en")).toBe("");
    expect(newsDate(dated({value:"2022",precision:"year"}),"en")).toBe("2022");
    expect(newsDate(dated({value:"2022",precision:"year"}),"mn")).toBe("2022 он");
    expect(newsDate(dated({value:"2025-06",precision:"month"}),"en")).toBe("June 2025");
    expect(newsDate(dated({value:"2025-06",precision:"month"}),"mn")).toBe("2025 оны 6-р сар");
    expect(newsDate(dated({value:"2026-08-08",end:"2026-08-09",precision:"day"}),"mn")).toBe("2026.08.08–09");
    expect(newsDate(dated({value:"2025-10-01",precision:"day"}),"mn")).toBe("2025.10.01");
  });
});
