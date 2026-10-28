import type { Block } from "./types";

/** Editorial navigation grounded in existing records, awaiting the same copy review. */
export const corporateHome: Block<{
  brands: string; brandsNote: string; company: string;
  companyLink: string; service: string; serviceLink: string; news: string;
  newsLink: string; contact: string; contactBody: string; locations: string;
  cities: string; showroom: string; read: string; held: string; photos: string; previousPhoto: string; nextPhoto: string;
}> = {
  status: "draft",
  source: "Editorial copy for user-approved 2026-10-22 redesign; existing company, service, location and event records.",
  value: {
    mn: {
      photos: "Зургууд", previousPhoto: "Өмнөх зураг", nextPhoto: "Дараагийн зураг", brands: "Бидний төлөөлж буй брэндүүд",
      brandsNote: "Сонирхсон брэндээ сонгоод загварууд, шоурумын байршил, холбоо барих мэдээллийг үзээрэй.",
      company: "Сонголтоос эхлэх хамтын зам.", companyLink: "Сайн Моторс-ын тухай",
      service: "Худалдан авсны дараа ч хамт.", serviceLink: "Үйлчилгээтэй танилцах",
      news: "Мэдээ, үйл явдал", newsLink: "Бүх мэдээ", contact: "Биечлэн танилцъя.",
      contactBody: "Өөрт ойр салбараа олох эсвэл брэндийн борлуулалтын багтай холбогдоорой.",
      locations: "Салбар олох", cities: "хотод", showroom: "шоурум",
      read: "Дэлгэрэнгүй", held: "Болсон өдөрлөг",
    },
    en: {
      photos: "Photos", previousPhoto: "Previous photo", nextPhoto: "Next photo", brands: "The brands we represent",
      brandsNote: "Choose a brand to see its models, showroom locations and contact details.",
      company: "A shared journey, from your first choice.", companyLink: "About Sain Motors",
      service: "With you long after the sale.", serviceLink: "Explore our services",
      news: "News & events", newsLink: "All news", contact: "Let’s meet in person.",
      contactBody: "Find a location near you or speak directly with your brand’s sales team.",
      locations: "Find a location", cities: "cities", showroom: "showrooms",
      read: "Read more", held: "Past event",
    },
  },
};
