import type { Photo } from "./types";

/** User-supplied Shiliin Bogd festival photographs from Downloads, 2026-11-17. */
export const festivalNewsPhotos = ([
  { key: "news-mtd6-lineup", alt: { mn: "Шилийн Богд фестиваль дахь Сайн Моторсын автомашины эгнээ", en: "Sain Motors vehicle lineup at Shiliin Bogd Festival" }, source: "772840129_1735155377410942_5145022850392146152_n.jfif" },
  { key: "news-mtd6-visitors", alt: { mn: "Цэнгэлдэх хүрээлэнгийн талбайд автомашинуудтай танилцаж буй зочид", en: "Visitors exploring the cars on the stadium field" }, source: "771802336_2510379949447675_1282391979658893687_n.jfif" },
  { key: "news-mtd6-models", alt: { mn: "Сайн Моторсын далбааны дэргэд эгнэн байрлуулсан автомашинууд", en: "Cars displayed beside Sain Motors flags" }, source: "774196635_1043998401352155_3682138529123328086_n.jfif" },
  { key: "news-mtd6-offroad", alt: { mn: "Фестивалийн зочин хар 212 автомашины дэргэд", en: "A festival visitor beside a black 212 vehicle" }, source: "772676771_1755962102403619_5628647561986001816_n.jfif" },
  { key: "news-mtd6-festival", alt: { mn: "Үлгэрийн баатруудын хувцастай оролцогчид автомашинуудын дэргэд", en: "Costumed festival participants beside the displayed vehicles" }, source: "772586151_1062130672976281_3914114549503223686_n.jfif" },
  { key: "news-mtd6-family", alt: { mn: "Сайн Моторсын асрын дэргэд улаан бөмбөлөгтэй хүүхдээ тэвэрсэн зочин", en: "A visitor holding a child with a red balloon beside the Sain Motors tent" }, source: "772894554_1859926628315104_5946511268652467523_n.jfif" },
  { key: "news-mtd6-evening", alt: { mn: "Оройн гэрэлд ассан автомашины эгнээ, Сайн Моторсын далбаа", en: "Vehicle lineup with headlights on beside Sain Motors flags in the evening" }, source: "774512756_1568004118042029_90348171259213790_n.jfif" },
] as const).map(photo => ({ ...photo, status: "sourced" as const, focus: "50% 50%" })) satisfies Photo[];
