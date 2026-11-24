"use client";

import { experienceCopy } from "@/content/experience";
import type { Phone } from "@/content/types";
import { readEnquirySelection } from "@/lib/enquiries";
import type { Locale } from "@/lib/i18n";
import { useQuery } from "@/lib/use-query";
import { Icon } from "./Icon";

type Route = { phone: Phone; location?: { name: Record<Locale, string>; map: { url: string } } };
export type EnquiryOption = { slug: string; name: string; sales: Route; service: Route };

const labelKeys = {
  sales: "sales", "test-drive": "testDrive", finance: "finance", service: "service",
  parts: "parts", partnership: "partnership", careers: "careers", media: "media",
} as const;

export function EnquiryContact({ locale, options, general }: {
  locale: Locale;
  options: readonly EnquiryOption[];
  general: { phone: Phone; email: string };
}) {
  const search = useQuery();
  const { intent, brand } = readEnquirySelection(search ?? "", options.map(option => option.slug));
  const copy = experienceCopy.value[locale];
  const corporate = intent === "partnership" || intent === "careers" || intent === "media";
  const selected = corporate ? undefined : options.find(option => option.slug === brand);
  const route = selected?.[intent === "service" || intent === "parts" ? "service" : "sales"];
  const phone = route?.phone ?? general.phone;
  const location = route?.location;
  const label = copy[labelKeys[intent]];

  return <section className="feedback-route" data-enquiry-contact aria-labelledby="enquiry-heading">
    <h3 id="enquiry-heading">
      {selected && <><span translate="no">{selected.name}</span> · </>}{label}
    </h3>
    <div className="feedback-route__links">
      <a href={phone.href}><Icon name="phone" size={16} />{locale === "en" ? "+976 " : ""}{phone.display}</a>
      {location && <a href={location.map.url}><Icon name="directions" size={16} />{location.name[locale]}</a>}
      {corporate && <a href={"mailto:" + general.email + "?subject=" + encodeURIComponent("[Sain Motors] " + label)}>
        <Icon name="mail" size={16} />{copy.email}
      </a>}
    </div>
  </section>;
}
