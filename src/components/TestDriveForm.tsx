"use client";

import "@/app/rely-r8.css";
import { useRef, useState, type FormEvent } from "react";
import type { Phone } from "@/content/types";
import { r8LeadCopy } from "@/content/rely-r8";
import type { Locale } from "@/lib/i18n";
import { r8Cities, submitR8Lead, validateR8Lead } from "@/lib/r8-leads";
import { submitFeedback } from "@/lib/feedback";

type Field = "city" | "firstName" | "lastName" | "phone" | "consent";
type FormState = "idle" | "pending" | "error" | "success";

type Vehicle = { src: string; width: number; height: number; alt: string };
type Props = { locale: Locale } & (
  | { model?: never; salesPhone?: never; purpose?: never }
  | { model: { name: string; vehicle?: Vehicle }; salesPhone: Phone; purpose?: "sales" | "test-drive" }
);

function bydLeadCopy(locale: Locale, name: string, phone: string, sales: boolean) {
  const mn = locale === "mn";
  const intent = mn
    ? (sales ? "мэдээлэл авах" : "туршилтын жолоодлогын")
    : (sales ? "information" : "test-drive");
  return {
    title: sales ? (mn ? "Мэдээлэл авах" : "Request information") : (mn ? "Туршилтын жолоодлого" : "Book a test drive"),
    intro: sales
      ? (mn ? "Асуултаа үлдээгээрэй. BYD-ийн борлуулалтын зөвлөх тантай эргэн холбогдоно." : "Leave your question and a BYD sales advisor will get back to you.")
      : (mn ? "Мэдээллээ үлдээгээрэй. BYD-ийн борлуулалтын зөвлөх тантай холбогдож, туршилтын жолоодлогын цагийг тохирно." : "Leave your details and a BYD sales advisor will call to arrange your test drive."),
    consent: mn
      ? "Sain Motors миний " + name + " загварын " + intent + " хүсэлттэй холбогдуулан дээрх мэдээллийг ашиглаж, надтай холбоо барихыг зөвшөөрч байна."
      : "I agree that Sain Motors may use these details to contact me about my " + name + " " + intent + " request.",
    failure: mn
      ? "Хүсэлт хүлээн авсныг баталгаажуулж чадсангүй. Дахин оролдох эсвэл " + phone + " дугаарт залгана уу."
      : "Your request could not be confirmed. Please try again or call " + phone + ".",
    contact: mn ? "BYD борлуулалт" : "BYD sales",
  };
}

export function TestDriveForm({ locale, model, salesPhone, purpose }: Props) {
  const mn = locale === "mn";
  const isSales = purpose === "sales";
  const prefix = isSales ? "byd-enquiry" : model ? "byd" : "r8";
  const sectionId = isSales ? prefix : prefix + "-test-drive";
  const contact = salesPhone ?? { href: "tel:+97672228855", display: "7222-8855" };
  const bydCopy = model ? bydLeadCopy(locale, model.name, contact.display, isSales) : undefined;
  const copy = bydCopy ? { ...r8LeadCopy[locale], ...bydCopy } : r8LeadCopy[locale];
  const vehicle = model ? model.vehicle : {
    src: "/rely-r8/lead-vehicle.webp", width: 692, height: 305,
    alt: mn ? "Алтан шар RELY R8 пикапын хажуугийн харагдац" : "Gold RELY R8 pickup, side view",
  };
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<FormState>("idle");
  const locked = useRef(false);

  function errorMessage(field: Field, code: string) {
    if (field === "consent") return copy.consentError;
    if (field === "phone" && code === "invalid") return copy.invalidPhone;
    return code === "required" ? copy.required : copy.invalid;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const input = {
      country: "Mongolia", city: String(fields.get("city") ?? ""), firstName: String(fields.get("firstName") ?? ""),
      lastName: String(fields.get("lastName") ?? ""), phone: String(fields.get("phone") ?? ""),
      consent: fields.get("consent") === "on", locale, website: String(fields.get("website") ?? ""),
    };
    const result = validateR8Lead(input);
    const fullName = result.ok ? `${result.data.firstName} ${result.data.lastName}` : "";
    const nameTooLong = model && Array.from(fullName).length > 80;
    if (!result.ok || nameTooLong) {
      const nextErrors: Partial<Record<Field, string>> = {};
      if (result.ok) nextErrors.lastName = mn ? "Нэр, овог нийлээд 80 тэмдэгтээс хэтрэхгүй байна." : "First and last name together must be 80 characters or fewer.";
      else {
        for (const field of ["city", "firstName", "lastName", "phone", "consent"] as const) {
          const code = result.errors[field];
          if (code) nextErrors[field] = errorMessage(field, code);
        }
      }
      setErrors(nextErrors);
      setState("idle");
      const first = Object.keys(nextErrors)[0];
      const element = first ? form.elements.namedItem(first) : null;
      if (element instanceof HTMLElement) requestAnimationFrame(() => element.focus());
      return;
    }
    locked.current = true;
    setErrors({});
    setState("pending");
    try {
      const city = r8Cities.find(option => option.value === result.data.city);
      const question = isSales ? String(fields.get("question") ?? "").trim() : "";
      const reason = isSales ? "Sales enquiry" : "Test drive";
      const lines = [reason + ": " + model?.name];
      if (city) lines.push("City: " + city.en);
      if (question) lines.push("", question);
      const acknowledgement = model ? await submitFeedback({
        name: fullName, phone: result.data.phone, audience: "client", showroom: "byd-4s",
        message: lines.join("\n"), consent: true, locale, website: "",
      }) : await submitR8Lead(result.data);
      if (!acknowledgement.id) throw new Error("Missing acknowledgement");
      setState("success");
    } catch {
      locked.current = false;
      setState("error");
    }
  }

  function clearError(field: Field) {
    setErrors(previous => previous[field] ? { ...previous, [field]: undefined } : previous);
  }

  const sectionClasses = ["r8-lead", model && "byd-lead", purpose && "byd-lead--" + purpose].filter(Boolean).join(" ");

  return <section className={sectionClasses} id={sectionId} aria-labelledby={prefix + "-lead-heading"}>
    {vehicle && <div className="r8-lead__vehicle"><img src={vehicle.src} width={vehicle.width} height={vehicle.height} alt={vehicle.alt} loading="lazy" decoding="async" /></div>}
    <div className="r8-lead__body">
      {bydCopy ? <div className="byd-lead__head">
        <h2 id={prefix + "-lead-heading"}>{copy.title}</h2>
        <p className="byd-lead__intro">{bydCopy.intro}</p>
        <p className="r8-lead__contact">{copy.contact} <a href={contact.href}>{contact.display}</a></p>
      </div> : <h2 id={prefix + "-lead-heading"}>{copy.title}</h2>}
      <form method="post" noValidate onSubmit={handleSubmit} data-state={state} aria-busy={state === "pending"}>
        <div className="r8-field">
          <label htmlFor={`${prefix}-city`}>{copy.city}</label>
          <select id={`${prefix}-city`} name="city" defaultValue="ulaanbaatar" autoComplete="address-level2" required disabled={state === "pending" || state === "success"}
            aria-invalid={Boolean(errors.city) || undefined} aria-describedby={errors.city ? `${prefix}-city-error` : undefined} onChange={() => clearError("city")}>
            {r8Cities.map(city => <option value={city.value} key={city.value}>{city[locale]}</option>)}
          </select>
          {errors.city && <p className="r8-field__error" id={`${prefix}-city-error`}>{errors.city}</p>}
        </div>
        <div className="r8-lead__names">
          {(["firstName", "lastName"] as const).map(field => <div className="r8-field" key={field}>
            <label htmlFor={`${prefix}-${field}`}>{copy[field]}</label>
            <input id={`${prefix}-${field}`} name={field} autoComplete={field === "firstName" ? "given-name" : "family-name"} required maxLength={100} disabled={state === "pending" || state === "success"}
              aria-invalid={Boolean(errors[field]) || undefined} aria-describedby={errors[field] ? `${prefix}-${field}-error` : undefined} onChange={() => clearError(field)} />
            {errors[field] && <p className="r8-field__error" id={`${prefix}-${field}-error`}>{errors[field]}</p>}
          </div>)}
        </div>
        <div className="r8-field">
          <label htmlFor={`${prefix}-phone`}>{copy.phone}</label>
          <input id={`${prefix}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} disabled={state === "pending" || state === "success"}
            aria-invalid={Boolean(errors.phone) || undefined} aria-describedby={errors.phone ? `${prefix}-phone-error` : undefined} onChange={() => clearError("phone")} />
          {errors.phone && <p className="r8-field__error" id={`${prefix}-phone-error`}>{errors.phone}</p>}
        </div>
        {isSales && <div className="r8-field byd-lead__question">
          <label htmlFor="byd-enquiry-question">{mn ? "Таны асуулт (заавал биш)" : "Your question (optional)"}</label>
          <textarea id="byd-enquiry-question" name="question" rows={3} maxLength={400} disabled={state === "pending" || state === "success"} />
        </div>}
        <div className="r8-lead__honeypot" aria-hidden="true"><label htmlFor={`${prefix}-website`}>Website</label><input id={`${prefix}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
        <div className="r8-lead__consent">
          <label><input type="checkbox" name="consent" required disabled={state === "pending" || state === "success"} aria-invalid={Boolean(errors.consent) || undefined} aria-describedby={errors.consent ? `${prefix}-consent-error` : undefined} onChange={() => clearError("consent")} /><span>{copy.consent}</span></label>
          <a href={`/${locale}/privacy/`}>{copy.privacy}</a>
          {errors.consent && <p className="r8-field__error" id={`${prefix}-consent-error`}>{errors.consent}</p>}
        </div>
        <button type="submit" className="r8-lead__submit" disabled={state === "pending" || state === "success"}>{state === "pending" ? copy.pending : copy.send}</button>
        <div className="r8-lead__feedback" aria-live="polite" aria-atomic="true">
          {state === "error" && <p data-state="error" role="alert">{copy.failure}</p>}
          {state === "success" && <p data-state="success" role="status">{copy.success}</p>}
        </div>
      </form>
      {!bydCopy && <p className="r8-lead__contact">{copy.contact}: <a href={contact.href}>{contact.display}</a></p>}
    </div>
  </section>;
}
