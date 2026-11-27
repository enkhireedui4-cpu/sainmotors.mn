import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { VehiclePricing } from "@/components/VehiclePricing";

vi.mock("@/components/vehicle-pricing.css", () => ({}));

describe("vehicle pricing", () => {
  it("shows quoted figures in tögrög and labels a starting price", () => {
    const html = renderToStaticMarkup(createElement(VehiclePricing, {
      locale: "mn",
      phone: { href: "tel:+97670000000", display: "7000-0000" },
      enquiryHref: "#byd-enquiry",
      prices: [
        { trim: { mn: "Суурь тоноглол", en: "Base trim" }, amountMnt: 98765432, startingAt: true },
        { trim: { mn: "Нэмэлт тоноглол", en: "Upgraded trim" }, amountMnt: 123456789 },
      ],
    }));

    expect(html).toContain("Суурь тоноглол");
    expect(html).toContain("Эхлэх үнэ");
    expect(html).toContain("98,765,432");
    expect(html).toContain("123,456,789");
    expect(html).toContain("₮");
    expect(html).toContain('href="#byd-enquiry"');
  });
});
