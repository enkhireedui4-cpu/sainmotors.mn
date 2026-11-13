"use client";

import { useRef, useState, type FormEvent } from "react";
import { r8LeadCopy } from "@/content/rely-r8";
import type { Locale } from "@/lib/i18n";
import { r8Cities, submitR8Lead, validateR8Lead } from "@/lib/r8-leads";

type Field = "city" | "firstName" | "lastName" | "phone" | "consent";
type FormState = "idle" | "pending" | "error" | "success";

export function R8LeadForm({ locale }: { locale: Locale }) {
  const copy = r8LeadCopy[locale];
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<FormState>("idle");
  const locked = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

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
    if (!result.ok) {
      const nextErrors: Partial<Record<Field, string>> = {};
      for (const field of ["city", "firstName", "lastName", "phone", "consent"] as const) {
        const code = result.errors[field];
        if (code) nextErrors[field] = errorMessage(field, code);
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
      const acknowledgement = await submitR8Lead(result.data);
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

  return <section className="r8-lead" id="r8-test-drive" aria-labelledby="r8-lead-heading">
    <div className="r8-lead__vehicle"><img src="/rely-r8/lead-vehicle.webp" alt={locale === "mn" ? "Алтан шар RELY R8 пикапын хажуугийн харагдац" : "Gold RELY R8 pickup, side view"} loading="lazy" width="692" height="305" /></div>
    <div className="r8-lead__body">
      <h2 id="r8-lead-heading">{copy.title}</h2>
      <form ref={formRef} noValidate onSubmit={handleSubmit} data-state={state} aria-busy={state === "pending"}>
        <div className="r8-field">
          <label htmlFor="r8-city">{copy.city}</label>
          <select id="r8-city" name="city" defaultValue="ulaanbaatar" autoComplete="address-level2" required disabled={state === "pending" || state === "success"}
            aria-invalid={Boolean(errors.city) || undefined} aria-describedby={errors.city ? "r8-city-error" : undefined} onChange={() => clearError("city")}>
            {r8Cities.map(city => <option value={city.value} key={city.value}>{city[locale]}</option>)}
          </select>
          {errors.city && <p className="r8-field__error" id="r8-city-error">{errors.city}</p>}
        </div>
        <div className="r8-lead__names">
          {(["firstName", "lastName"] as const).map(field => <div className="r8-field" key={field}>
            <label htmlFor={`r8-${field}`}>{copy[field]}</label>
            <input id={`r8-${field}`} name={field} autoComplete={field === "firstName" ? "given-name" : "family-name"} required maxLength={100} disabled={state === "pending" || state === "success"}
              aria-invalid={Boolean(errors[field]) || undefined} aria-describedby={errors[field] ? `r8-${field}-error` : undefined} onChange={() => clearError(field)} />
            {errors[field] && <p className="r8-field__error" id={`r8-${field}-error`}>{errors[field]}</p>}
          </div>)}
        </div>
        <div className="r8-field">
          <label htmlFor="r8-phone">{copy.phone}</label>
          <input id="r8-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} disabled={state === "pending" || state === "success"}
            aria-invalid={Boolean(errors.phone) || undefined} aria-describedby={errors.phone ? "r8-phone-error" : undefined} onChange={() => clearError("phone")} />
          {errors.phone && <p className="r8-field__error" id="r8-phone-error">{errors.phone}</p>}
        </div>
        <div className="r8-lead__honeypot" aria-hidden="true"><label htmlFor="r8-website">Website</label><input id="r8-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <div className="r8-lead__consent">
          <label><input type="checkbox" name="consent" required disabled={state === "pending" || state === "success"} aria-invalid={Boolean(errors.consent) || undefined} aria-describedby={errors.consent ? "r8-consent-error" : undefined} onChange={() => clearError("consent")} /><span>{copy.consent}</span></label>
          <a href={`/${locale}/privacy/`}>{copy.privacy}</a>
          {errors.consent && <p className="r8-field__error" id="r8-consent-error">{errors.consent}</p>}
        </div>
        <button type="submit" className="r8-lead__submit" disabled={state === "pending" || state === "success"}>{state === "pending" ? copy.pending : copy.send}</button>
        <div className="r8-lead__feedback" aria-live="polite" aria-atomic="true">
          {state === "error" && <p data-state="error" role="alert">{copy.failure}</p>}
          {state === "success" && <p data-state="success" role="status">{copy.success}</p>}
        </div>
      </form>
      <p className="r8-lead__contact">{copy.contact}: <a href="tel:+97672228855">7222-8855</a></p>
    </div>
  </section>;
}
