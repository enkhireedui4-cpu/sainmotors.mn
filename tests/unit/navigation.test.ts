import { describe, expect, it } from "vitest";
import { headerPages, navPages } from "@/lib/routes";

describe("site navigation", () => {
  it("puts Dealer network where Brands used to be in the top menu", () => {
    expect(headerPages).toEqual(["about", "locations", "services", "news", "contact"]);
    expect(headerPages).not.toContain("brands");
  });

  it("keeps Brands reachable from the footer list", () => {
    expect(navPages).toContain("brands");
  });
});
