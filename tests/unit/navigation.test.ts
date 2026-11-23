import { describe, expect, it } from "vitest";
import { footerPages, headerPages } from "@/lib/routes";

describe("site navigation", () => {
  it("places Brands between About and Dealer network in the main menu", () => {
    expect(headerPages).toEqual(["about", "brands", "locations", "services", "news", "contact"]);
  });

  it("replaces the removed Brands footer menu with Dealer network", () => {
    expect(footerPages).toEqual(["about", "locations", "contact"]);
    expect(footerPages).not.toContain("brands");
  });
});
