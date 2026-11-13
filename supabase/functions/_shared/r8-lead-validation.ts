export const r8Cities = [
  { value: "ulaanbaatar", mn: "Улаанбаатар", en: "Ulaanbaatar" },
  { value: "erdenet", mn: "Эрдэнэт", en: "Erdenet" },
  { value: "darkhan", mn: "Дархан", en: "Darkhan" },
] as const;
export type R8City = typeof r8Cities[number]["value"];

export interface R8LeadInput {
  country: string;
  city?: R8City;
  firstName: string;
  lastName: string;
  phone: string;
  consent: boolean;
  locale: "mn" | "en";
  website?: string;
}

export type R8LeadErrors = Partial<Record<keyof R8LeadInput, "required" | "invalid" | "consent">>;
export type R8LeadValidation = { ok: true; data: R8LeadInput } | { ok: false; errors: R8LeadErrors };

export function validateR8Lead(input: unknown): R8LeadValidation {
  const source: Record<string, unknown> = input !== null && typeof input === "object" && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
  const errors: R8LeadErrors = {};

  function text(field: "country" | "firstName" | "lastName" | "phone", limit: number): string {
    const value = source[field];
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
      errors[field] = "required";
      return "";
    }
    if (typeof value !== "string") {
      errors[field] = "invalid";
      return "";
    }
    const trimmed = value.trim();
    const bounded = field === "phone" ? value : trimmed;
    if (Array.from(bounded).length > limit || /\p{Cc}/u.test(trimmed)) errors[field] = "invalid";
    return trimmed;
  }

  const country = text("country", 100);
  const city = source.city;
  if (city !== undefined && !r8Cities.some(option => option.value === city)) errors.city = "invalid";
  const firstName = text("firstName", 100);
  const lastName = text("lastName", 100);
  const rawPhone = text("phone", 64);
  const compactPhone = rawPhone.replace(/[ ()-]/g, "");
  let phone = compactPhone;
  if (!errors.phone) {
    if (country.toLowerCase() === "mongolia") {
      if (/^[0-9]{8}$/.test(compactPhone)) phone = `+976${compactPhone}`;
      else if (!/^\+976[0-9]{8}$/.test(compactPhone)) errors.phone = "invalid";
    } else if (/^\+?[1-9][0-9]{6,14}$/.test(compactPhone)) {
      phone = compactPhone.startsWith("+") ? compactPhone : `+${compactPhone}`;
    } else {
      errors.phone = "invalid";
    }
  }

  if (source.consent !== true) errors.consent = "consent";
  if (source.locale === undefined || source.locale === null || source.locale === "") errors.locale = "required";
  else if (source.locale !== "mn" && source.locale !== "en") errors.locale = "invalid";

  if (source.website !== undefined && (typeof source.website !== "string" || source.website.length > 200 || source.website.trim() !== "")) {
    errors.website = "invalid";
  }
  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      country, firstName, lastName, phone, consent: true,
      ...(city !== undefined ? { city: city as R8City } : {}),
      locale: source.locale as R8LeadInput["locale"],
      ...(source.website !== undefined ? { website: "" } : {}),
    },
  };
}
