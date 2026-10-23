import type { Localized } from "@/lib/i18n";

/** Interface labels. Reviewed with the rest of the copy, but not release-gated. */
export const ui = {
  nav: {
    locations: { mn: "Салбарууд", en: "Locations" },
    news: { mn: "Мэдээ", en: "News" },
    about: { mn: "Бидний тухай", en: "About" },
    brands: { mn: "Брэндүүд", en: "Brands" },
    services: { mn: "Үйлчилгээ", en: "Services" },
    contact: { mn: "Холбоо барих", en: "Contact" },
  },
  skipToContent: { mn: "Үндсэн агуулга руу шилжих", en: "Skip to main content" },
  home: { mn: "Sain Motors нүүр хуудас", en: "Sain Motors home page" },
  mainNav: { mn: "Үндсэн цэс", en: "Main navigation" },
  breadcrumb: { mn: "Хуудасны зам", en: "Breadcrumb" },
  menu: { mn: "Цэс", en: "Menu" },
  closeMenu: { mn: "Цэс хаах", en: "Close menu" },
  language: { mn: "Хэл", en: "Language" },
  switchTo: { mn: "Англи хэл рүү шилжих", en: "Switch to Mongolian" },
  external: { mn: "(гадаад сайт)", en: "(external site)" },

  carousel: {
    name: { mn: "Онцлох", en: "Highlights" },
    slide: { mn: "слайд", en: "slide" },
    of: { mn: "/", en: "of" },
    pause: { mn: "Автоматаар солихыг зогсоох", en: "Pause slideshow" },
    play: { mn: "Автоматаар солих", en: "Play slideshow" },
    previous: { mn: "Өмнөх слайд", en: "Previous slide" },
    next: { mn: "Дараах слайд", en: "Next slide" },
    choose: { mn: "Слайд сонгох", en: "Choose a slide" },
  },

  brand: {
    sections: { mn: "Брэндийн хуудасны хэсгүүд", en: "Brand page sections" },
    overviewLink: { mn: "Танилцуулга", en: "Overview" },
    visit: { mn: "сайтад зочлох", en: "Visit" },
    enquiries: { mn: "Борлуулалт, лавлагаа", en: "Sales and enquiries" },
    others: { mn: "Бусад брэндүүд", en: "Other brands" },
    allBrands: { mn: "Бүх брэнд", en: "All brands" },
    allBrandsNote: { mn: "Танилцуулга, шоурум, утас", en: "Introductions, showrooms and phones" },
    viewAll: { mn: "Бүх брэндийг харах", en: "View all brands" },
    overview: { mn: "Брэндийн танилцуулга", en: "Brand overview" },
    explore: { mn: "Брэнд үзэх", en: "Explore brand" },
    portfolio: { mn: "Брэндийн багц", en: "Brand portfolio" },
    website: { mn: "Вэбсайт", en: "Website" },
    facebook: { mn: "Facebook хуудас", en: "Facebook page" },
    rights: { mn: "Албан ёсны эрхтэй", en: "Official rights" },
    sinceYear: { mn: "{year} оноос", en: "Since {year}" },
    showroom: { mn: "Шоурум", en: "Showroom" },
    sales: { mn: "Борлуулалтын утас", en: "Sales line" },
    online: { mn: "Холбоос", en: "Online" },
    models: { mn: "Сайн Моторс борлуулдаг загварууд", en: "Models sold by Sain Motors" },
    gallery: { mn: "Загварууд", en: "Models" },
    noShowroom: { mn: "Шоурум, нөхцөлийг ерөнхий утсаар лавлана уу.", en: "Call our general line about showrooms and terms." },
  },

  location: {
    hours: { mn: "Ажлын цаг", en: "Opening hours" },
    callForHours: { mn: "Ажлын цагийг утсаар лавлана уу", en: "Call ahead for opening hours" },
    call: { mn: "Залгах", en: "Call" },
    email: { mn: "И-мэйл", en: "Email" },
    phone: { mn: "Утас", en: "Phone" },
    brands: { mn: "Брэнд", en: "Brands" },
    directions: { mn: "Чиглэл авах", en: "Get directions" },
    viewMap: { mn: "Газрын зураг", en: "View on map" },
  },

  services: {
    brands: { mn: "Хамрах брэнд", en: "Brands covered" },
    where: { mn: "Хаана", en: "Where" },
    atShowroom: { mn: "Брэнд бүрийн шоурумд", en: "At each brand’s showroom" },
    all: { mn: "Бүх үйлчилгээ", en: "All services" },
    others: {
      mn: "Бусад брэндийн үйлчилгээний талаар тухайн брэндийн борлуулалтын утсаар лавлана уу.",
      en: "For other brands, ask on the brand’s sales line.",
    },
  },

  company: {
    factsHeading: { mn: "Сайн Моторс тоогоор", en: "Sain Motors at a glance" },
    factBrands: { mn: "Брэнд", en: "Brands" },
    factShowrooms: { mn: "Үзэсгэлэнгийн танхим", en: "Showrooms" },
    factCities: { mn: "Хот", en: "Cities" },
    factServices: { mn: "Үйлчилгээний чиглэл", en: "Service categories" },
    more: { mn: "Бидний тухай дэлгэрэнгүй", en: "More about us" },
  },

  contact: {
    general: { mn: "Ерөнхий лавлагаа", en: "General enquiries" },
    showrooms: { mn: "Шоурумууд", en: "Showrooms" },
    service: { mn: "Үйлчилгээний төв", en: "Service centre" },
    social: { mn: "Сошиал сүлжээ", en: "Social media" },
  },

  privacy: {
    contact: { mn: "Холбоо барих", en: "Contact" },
    contactBody: { mn: "Нууцлалтай холбоотой асуултаа дараах хаягаар илгээнэ үү:", en: "Send any privacy questions to:" },
  },

  footer: {
    privacy: { mn: "Нууцлалын бодлого", en: "Privacy policy" },
    contact: { mn: "Холбоо барих", en: "Contact" },
    explore: { mn: "Сайтын цэс", en: "Site" },
    follow: { mn: "Биднийг дагах", en: "Follow us" },
  },

  notFound: {
    title: { mn: "Хуудас олдсонгүй", en: "Page not found" },
    body: {
      mn: "Таны хайсан хуудас байхгүй эсвэл өөр хаяг руу шилжсэн байна.",
      en: "The page you are looking for doesn’t exist or has moved.",
    },
    home: { mn: "Нүүр хуудас", en: "Home page" },
  },

  draft: { mn: "Ноорог", en: "Draft" },
  pendingLogo: { mn: "Лого хүлээгдэж байна", en: "Logo pending" },
  updated: { mn: "Шинэчилсэн", en: "Updated" },
} satisfies Record<string, Localized | Record<string, Localized>>;
