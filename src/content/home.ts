import type { Block } from "./types";

/** Homepage showroom walk: a heading for assistive technology and the one visible action. */
export const homeExperience: Block<{ heading: string; cta: string }> = {
  status: "draft",
  source: "Showroom records; the hero's \"Шоурум\" link scrolls here and this action leads on to the contact page",
  value: {
    mn: { heading: "Загваруудтай шоурумд танилцаарай.", cta: "Шоурум, байршил" },
    en: { heading: "See the cars at a showroom.", cta: "Find a showroom" },
  },
};

/** Editorial invitations grounded in the existing BYD/JETOUR and showroom records. */
export const homeDiscover: Block<{
  heading: string;
  tabsLabel: string;
  topics: { tab: string; title: string; body: string; cta: string }[];
}> = {
  status: "draft",
  source: "Existing BYD and JETOUR brand sheets; showroom and service records. Condensed by the web team.",
  value: {
    mn: {
      heading: "Таны хэрэгцээнд нийцэх сонголт.",
      tabsLabel: "Автомашины сонголт, зөвлөгөө",
      topics: [
        {
          tab: "Цахилгаан хөдөлгөөн",
          title: "Цахилгаан, хосолсон хөдөлгүүртэй загварууд.",
          body: "BYD-ийн цахилгаан болон plug-in hybrid автомашинуудтай танилцаарай. Загвар, худалдан авалтын нөхцөлийг BYD 4S үзэсгэлэнгийн танхимаас лавлах боломжтой.",
          cta: "BYD-тэй танилцах",
        },
        {
          tab: "Аялал, адал явдал",
          title: "Аялалд зориулсан SUV загварууд.",
          body: "JETOUR-ийн аялал, адал явдалд зориулсан SUV загваруудыг сонирхоорой. Тоноглол, загварын дэлгэрэнгүй мэдээллийг брэндийн хуудаснаас үзнэ үү.",
          cta: "JETOUR-тай танилцах",
        },
        {
          tab: "Мэргэжлийн зөвлөгөө",
          title: "Загвар, нөхцөлийн талаар лавлаарай.",
          body: "Автомашинуудыг дэргэдээс нь харьцуулж, тухайн брэндийн багтай ярилцаарай. Загвар, худалдан авалтын нөхцөл, борлуулалтын дараах үйлчилгээний талаар зөвлөгөө аваарай.",
          cta: "Холбоо барих",
        },
      ],
    },
    en: {
      heading: "A choice that fits your life.",
      tabsLabel: "Explore cars and advice",
      topics: [
        {
          tab: "Electric mobility",
          title: "Electric and plug-in hybrid cars.",
          body: "Explore BYD’s electric and plug-in hybrid cars. Visit the BYD 4S showroom for guidance on models and purchase options.",
          cta: "Explore BYD",
        },
        {
          tab: "Travel and adventure",
          title: "SUVs for travel.",
          body: "Discover JETOUR’s SUVs for travel and adventure. Visit the brand page for model details, equipment and more about the range.",
          cta: "Explore JETOUR",
        },
        {
          tab: "Personal guidance",
          title: "Ask about models and buying options.",
          body: "Compare the cars in person and speak with the brand’s team. Get advice on models, purchase options and the after-sales services available for your brand.",
          cta: "Contact us",
        },
      ],
    },
  },
};

/** Homepage services teaser over the workshop photograph; the service titles come from `services`. */
export const homeServices: Block<{ heading: string; body: string; cta: string }> = {
  status: "draft",
  source: "Existing service records (company.ts services); supplied service-centre photographs, 2026-10-20",
  value: {
    mn: {
      heading: "Борлуулалтын дараах үйлчилгээ",
      body: "Үйлдвэрийн баталгаа, засвар, оношилгоо, оригинал сэлбэг. Брэнд бүрийн үйлчилгээг тухайн шоурум, үйлчилгээний төв хариуцна.",
      cta: "Үйлчилгээтэй танилцах",
    },
    en: {
      heading: "After-sales service",
      body: "Factory warranty, repairs, diagnostics and genuine parts, provided through each brand’s showroom and service centre.",
      cta: "Explore our services",
    },
  },
};
