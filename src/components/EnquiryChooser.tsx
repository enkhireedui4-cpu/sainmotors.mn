"use client";
import Link from "next/link";
import { experienceCopy } from "@/content/experience";
import type { Location, Phone } from "@/content/types";
import { enquiryIntents, readEnquirySelection, type EnquiryIntent } from "@/lib/enquiries";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { changeQuery, useQuery } from "@/lib/use-query";
import { Icon } from "./Icon";

type Place = Pick<Location, "id" | "name" | "city" | "address" | "landmark" | "map" | "hours">;
export interface EnquiryOption { slug: string; name: string; sales: { phone: Phone; location?: Place }; service: { phone: Phone; location?: Place } }
interface Props { locale: Locale; options: EnquiryOption[]; general: { phone: Phone; email: string }; embedded?: boolean }
const labelKeys = { sales: "sales", "test-drive": "testDrive", finance: "finance", service: "service", parts: "parts", partnership: "partnership", careers: "careers", media: "media" } as const;

export function EnquiryChooser({ locale, options, general, embedded = false }: Props) {
  const search = useQuery();
  const { intent, brand } = readEnquirySelection(search ?? "", options.map(option => option.slug));
  const copy = experienceCopy.value[locale];
  const corporate = ["partnership", "careers", "media"].includes(intent);
  const selected = !corporate ? options.find(option => option.slug === brand) : undefined;
  const isService = intent === "service" || intent === "parts";
  const route = selected ? selected[isService ? "service" : "sales"] : undefined;
  const phone = route?.phone ?? general.phone;
  const location = route?.location;
  const title = selected?.name ?? copy.general;
  const intentLabel = copy[labelKeys[intent]];
  const subject = `[Sain Motors] ${intentLabel}${selected ? ` — ${selected.name}` : ""}`;
  return <section className={`enquiry-journey${embedded ? " enquiry-journey--embedded" : " container"}`} aria-labelledby="enquiry-heading" data-status={experienceCopy.status} data-ready={search !== null}>
    <div className={embedded ? "sr-only" : "enquiry-journey__intro"}><h2 id="enquiry-heading">{copy.contactHeading}</h2><p>{copy.contactBody}</p></div>
    <div className="enquiry-journey__panel">
      <div className="enquiry-fields">
        <div><label htmlFor="enquiry-intent">{copy.intent}</label><select id="enquiry-intent" value={intent} disabled={search === null} onChange={event => changeQuery({ intent: event.target.value as EnquiryIntent })} aria-controls="enquiry-result">{enquiryIntents.map(id => <option key={id} value={id}>{copy[labelKeys[id]]}</option>)}</select></div>
        {!corporate && <div><label htmlFor="enquiry-brand">{copy.brand}</label><select id="enquiry-brand" value={brand} disabled={search === null} onChange={event => changeQuery({ brand: event.target.value })} aria-controls="enquiry-result"><option value="">{copy.chooseBrand}</option>{options.map(option => <option key={option.slug} value={option.slug}>{option.name}</option>)}</select></div>}
        <noscript><p>{copy.referral} <a href={pageHref(locale, "brands")}>{copy.all}</a></p></noscript>
      </div>
      <div className="enquiry-result" id="enquiry-result" data-enquiry-result>
        <p className="enquiry-result__intent">{intentLabel}</p><h3 translate={selected ? "no" : undefined}>{title}</h3>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{title}: {intentLabel}</p>
        {(!selected && !corporate) && <p>{copy.referral}</p>}
        {isService && selected && <p>{copy.serviceReferral}</p>}
        {intent === "finance" && <p>{copy.financeNote}</p>}
        {intent === "test-drive" && <p>{copy.testDriveNote}</p>}
        <a className="enquiry-result__phone" href={phone.href}><Icon name="phone" size={22} /><span><small>{copy.call}</small>{locale === "en" ? "+976 " : ""}{phone.display}</span></a>
        {location && <div className="enquiry-result__place"><p>{isService ? copy.serviceLocation : copy.showroom}</p><h4>{location.name[locale]}</h4><address>{location.address[locale]}{location.landmark && <span>{location.landmark[locale]}</span>}</address>
          <div className="enquiry-result__links"><a className="text-link" href={location.map.url} rel="noopener"><Icon name="directions" size={18} />{copy.map}</a><Link className="text-link" href={`${pageHref(locale, "locations")}#${location.id}`} prefetch={false}>{copy.destination}<Icon name="chevronRight" size={17} /></Link></div>
        </div>}
        {corporate && <><a className="text-link enquiry-result__email" href={`mailto:${general.email}?subject=${encodeURIComponent(subject)}`}><Icon name="mail" size={18} />{copy.email}</a><p className="enquiry-result__note">{copy.emailNote}</p></>}
      </div>
    </div>
  </section>;
}
