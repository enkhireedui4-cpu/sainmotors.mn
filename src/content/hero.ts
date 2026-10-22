import type { Hero } from "./types";

// The user confirmed the eleven-brand distributor fact on 2026-10-22 and wrote the hero
// copy the same day. The kicker states that confirmed fact in the user's own words; the
// heading and lead are new editorial copy and stay draft until the content owner signs off.
export const hero: Hero = {
  kicker: {
    status: "approved",
    source: "User's own wording, 2026-10-22, of the confirmed eleven-brand distributor fact (company.distributorClaim)",
    value: { mn: "11 брэндийн албан ёсны дистрибьютер", en: "Official distributor of 11 brands" },
  },
  title: {
    status: "draft",
    source: "User-supplied hero copy (MN), 2026-10-22; EN translated by the web team",
    value: { mn: "Олон сонголтоос\nөөрийнхөө машиныг.", en: "From many choices,\nthe car that’s yours." },
  },
  text: {
    status: "draft",
    source: "User-supplied hero copy (MN), 2026-10-22; EN translated by the web team",
    value: {
      mn: "Хотод унах, гэр бүлээрээ аялах, ажил хэрэгтээ ашиглах — танд ямар автомашин хэрэгтэй вэ? Манай брэндүүдтэй танилцаж, өөрт тохирох загвараа сонгоорой.",
      en: "Driving in the city, travelling with family, putting it to work — what kind of car do you need? Explore our brands and choose the model that suits you.",
    },
  },
  cta: { label: { mn: "Брэндүүд үзэх", en: "Explore brands" }, href: "brands" },
  secondaryCta: { label: { mn: "Салбар олох", en: "Find a location" }, href: "locations" },
};
