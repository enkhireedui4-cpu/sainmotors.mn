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
    value: { mn: "Өөрт тохирох автомашинаа сонгоорой.", en: "Choose the car that suits you." },
  },
  text: {
    status: "draft",
    source: "User-supplied hero copy (MN), 2026-10-22; EN translated by the web team",
    value: {
      mn: "Хотын өдөр тутмын хэрэглээ, гэр бүлийн аялал, ажил хэрэгт зориулсан автомашинуудтай танилцаарай. Сонголтоо хийхэд тань бид зөвлөж, тусална.",
      en: "Explore cars for everyday city driving, family trips and work. We’ll advise and help you as you make your choice.",
    },
  },
  cta: { label: { mn: "Брэндүүд үзэх", en: "Explore brands" }, href: "brands" },
  secondaryCta: { label: { mn: "Салбар олох", en: "Find a location" }, href: "locations" },
};
