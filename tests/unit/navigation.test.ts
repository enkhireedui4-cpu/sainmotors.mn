import { describe, expect, it } from "vitest";
import { footerPages, headerPages } from "@/lib/routes";

describe("site navigation", () => {
  it("places Brochures next to Brands in the main menu", () => {
    expect(headerPages).toEqual(["about", "brands", "brochures", "locations", "services", "news", "contact"]);
  });

  it("replaces the removed Brands footer menu with Dealer network", () => {
    expect(footerPages).toEqual(["about", "locations", "contact"]);
    expect(footerPages).not.toContain("brands");
  });
});
