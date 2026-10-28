import type { Hero } from "./types";

// The user explicitly requested the already-confirmed eleven-brand distributor
// statement as the main homepage heading on 2026-10-28. The short supporting lead
// remains editorial copy for publication review.
export const hero: Hero = {
  kicker: {
    status: "sourced",
    source: "Company name on the supplied Sain Motors wordmark",
    value: { mn: "SAIN MOTORS", en: "SAIN MOTORS" },
  },
  title: {
    status: "approved",
    source: "User requested the confirmed eleven-brand distributor statement as the main homepage heading, 2026-10-28; same MN/EN fact approved on 2026-10-22 (company.distributorClaim)",
    value: { mn: "11 брэндийн албан ёсны дистрибьютер", en: "Official distributor of 11 brands" },
  },
  text: {
    status: "draft",
    source: "Condensed web-team guidance for the user's requested uncluttered homepage, 2026-10-28",
    value: {
      mn: "Өөрт тохирох автомашинаа сонгоорой.",
      en: "Choose the car that suits you.",
    },
  },
  cta: { label: { mn: "Брэндүүдтэй танилцах", en: "Explore brands" }, href: "brands" },
  secondaryCta: { label: { mn: "Шоурум олох", en: "Find a showroom" }, href: "locations" },
};
