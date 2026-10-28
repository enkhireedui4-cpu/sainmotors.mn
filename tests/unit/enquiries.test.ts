import { describe, expect, it } from "vitest";
import { getBrand, getLocations, services } from "@/content";
import { enquiryHref, readEnquirySelection, resolveBrandContact } from "@/lib/enquiries";

describe("enquiry journeys", () => {
  it("uses explicit intent and brand in a shareable bilingual destination", () => {
    expect(enquiryHref("mn", "test-drive", "soueast")).toBe("/mn/contact/?intent=test-drive&brand=soueast#enquiry-heading");
    expect(enquiryHref("en", "service", "byd")).toBe("/en/contact/?intent=service&brand=byd#enquiry-heading");
  });
  it("rejects unknown URL values and restores a valid brand and intent", () => {
    expect(readEnquirySelection("?intent=service&brand=byd", ["jetour", "byd"])).toEqual({ intent: "service", brand: "byd" });
    expect(readEnquirySelection("?intent=javascript:bad&brand=unknown", ["jetour", "byd"])).toEqual({ intent: "sales", brand: "" });
  });
  it("routes JETOUR repair enquiries to the confirmed service centre rather than its showroom", () => {
    const result = resolveBrandContact(getBrand("jetour")!, "service", getLocations());
    expect(result.location?.id).toBe("service-centre");
    expect(result.phone.href).toBe("tel:+97670108855");
  });
  it("never invents a SOUEAST workshop from its shared sales showroom", () => {
    const result = resolveBrandContact(getBrand("soueast")!, "service", getLocations());
    expect(result.location).toBeUndefined();
    expect(result.phone.href).toBe("tel:+97672778855");
    expect(resolveBrandContact(getBrand("soueast")!, "sales", getLocations()).location?.id).toBe("jetour-c1");
    expect(services.find(service => service.id === "after-sales")?.brands).toContain("soueast");
  });
  it("keeps BYD's user-supplied exact map and leaves unknown hours unset", () => {
    const byd = resolveBrandContact(getBrand("byd")!, "parts", getLocations());
    expect(byd.location?.id).toBe("byd-4s");
    expect(byd.location?.map.url).toBe("https://maps.app.goo.gl/BkpbhfBnyKxKoxyM8");
    expect(byd.location?.map.precision).toBe("pin");
    expect(byd.location?.hours).toBeUndefined();
  });
});
