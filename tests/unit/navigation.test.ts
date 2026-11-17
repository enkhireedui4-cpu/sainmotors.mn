import { describe, expect, it } from "vitest";
import { footerPages, headerPages } from "@/lib/routes";

describe("site navigation", () => {
  it("puts Dealer network where Brands used to be in the top menu", () => {
    expect(headerPages).toEqual(["about", "locations", "services", "news", "contact"]);
    expect(headerPages).not.toContain("brands");
  });

  it("replaces the removed Brands footer menu with Dealer network", () => {
    expect(footerPages).toEqual(["about", "locations", "contact"]);
    expect(footerPages).not.toContain("brands");
  });
});
