export interface FeedbackInput {
  name: string;
  phone: string;
  audience: "client" | "employee" | "dealer";
  showroom?: string;
  message?: string;
  consent: true;
  locale: "mn" | "en";
  website: "";
}

export type FeedbackErrors = Partial<Record<keyof FeedbackInput, string>>;
export type FeedbackValidation = { ok: true; data: FeedbackInput } | { ok: false; errors: FeedbackErrors };

export function validateFeedback(input: unknown): FeedbackValidation {
  const source: Record<string, unknown> = input !== null && typeof input === "object" && !Array.isArray(input)
    ? input as Record<string, unknown> : {};
  const errors: FeedbackErrors = {};
  const unsafeSingleLine = /[\p{Cc}\u202a-\u202e\u2066-\u2069]/u;

  let name = "";
  if (typeof source.name !== "string") errors.name = source.name == null ? "required" : "invalid";
  else {
    name = source.name.trim();
    if (!name) errors.name = "required";
    else if (Array.from(name).length < 2 || Array.from(name).length > 80 || unsafeSingleLine.test(source.name)) errors.name = "invalid";
  }

  let phone = "";
  if (typeof source.phone !== "string") errors.phone = source.phone == null ? "required" : "invalid";
  else {
    const compact = source.phone.trim().replace(/[ ()-]/g, "");
    phone = /^[0-9]{8}$/.test(compact) ? `+976${compact}` : compact;
    if (!source.phone.trim()) errors.phone = "required";
    else if (source.phone.length > 64 || unsafeSingleLine.test(source.phone) || !/^\+976[0-9]{8}$/.test(phone)) errors.phone = "invalid";
  }

  const audience = source.audience;
  if (audience !== "client" && audience !== "employee" && audience !== "dealer") errors.audience = audience == null || audience === "" ? "required" : "invalid";

  let showroom: string | undefined;
  if (source.showroom !== undefined) {
    if (typeof source.showroom !== "string") errors.showroom = "invalid";
    else {
      showroom = source.showroom.trim();
      if (Array.from(showroom).length > 80 || unsafeSingleLine.test(source.showroom) || (showroom !== "" && !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(showroom))) errors.showroom = "invalid";
    }
  }

  let message: string | undefined;
  if (source.message !== undefined) {
    if (typeof source.message !== "string") errors.message = "invalid";
    else {
      message = source.message.replace(/\r\n?/g, "\n").trim();
      if (Array.from(message).length > 2000 || /[\u0000-\u0008\u000b-\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(source.message)) errors.message = "invalid";
    }
  }

  if (source.consent !== true) errors.consent = "consent";
  if (source.locale !== "mn" && source.locale !== "en") errors.locale = source.locale == null || source.locale === "" ? "required" : "invalid";
  if (source.website !== "") errors.website = "invalid";
  if (Object.keys(errors).length) return { ok: false, errors };

  return { ok: true, data: {
    name, phone, audience: audience as FeedbackInput["audience"],
    ...(showroom !== undefined ? { showroom } : {}), ...(message !== undefined ? { message } : {}),
    consent: true, locale: source.locale as FeedbackInput["locale"], website: "",
  } };
}
