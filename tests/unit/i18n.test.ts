import { describe, expect, it } from "vitest";
import { localePath, switchLocalePath } from "@/lib/i18n";
import { contentHref, displayHost } from "@/lib/routes";

describe("switchLocalePath", () => {
  it("keeps the page when switching language", () => {
    expect(switchLocalePath("/mn/brands/byd/", "en")).toBe("/en/brands/byd/");
    expect(switchLocalePath("/en/contact", "mn")).toBe("/mn/contact/");
    expect(switchLocalePath("/mn/", "en")).toBe("/en/");
    expect(switchLocalePath("/mn", "en")).toBe("/en/");
  });

  it("falls back to the target language's home for anything else", () => {
    expect(switchLocalePath("/", "en")).toBe("/en/");
    expect(switchLocalePath("/fr/about/", "mn")).toBe("/mn/");
  });
});

describe("paths", () => {
  it("always ends in a slash to match the static export", () => {
    expect(localePath("mn")).toBe("/mn/");
    expect(localePath("en", "/brands/byd")).toBe("/en/brands/byd/");
  });

  it("resolves page keys and leaves absolute URLs alone", () => {
    expect(contentHref("mn", "brands")).toBe("/mn/brands/");
    expect(contentHref("en", "https://jetour.mn/")).toBe("https://jetour.mn/");
  });

  it("shows a bare host for external sites", () => {
    expect(displayHost("https://www.jetour.mn/")).toBe("jetour.mn");
  });
});
