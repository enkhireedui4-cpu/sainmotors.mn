import "@/app/byd.css";
import "@/app/byd-profile.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BydBladeBattery } from "@/components/BydBladeBattery";
import { BydContact } from "@/components/BydContact";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { TestDriveForm } from "@/components/TestDriveForm";
import { brandPhone, getInternalBrand, ui } from "@/content";
import { bydProfileFeatures } from "@/content/byd-profile-features";
import { bydProfilePath, bydProfiles } from "@/content/byd-profiles";
import { enquiryHref } from "@/lib/enquiries";
import { isLocale, localePath } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbGraph } from "@/lib/structured-data";

type Props = { params: Promise<{ lang: string; model: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return bydProfiles.map(({ id }) => ({ model: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, model } = await params;
  const profile = bydProfiles.find(item => item.id === model);
  if (!isLocale(lang) || !profile) return {};
  return pageMetadata({
    locale: lang,
    path: bydProfilePath(profile.id),
    title: profile.name,
    description: profile.description[lang],
    image: { src: `/byd-${profile.id}/hero-desktop.webp`, ...profile.desktop, alt: profile.alt[lang] },
  });
}

export default async function BydModelPage({ params }: Props) {
  const { lang, model } = await params;
  const profile = bydProfiles.find(item => item.id === model);
  const brand = getInternalBrand("byd");
  if (!isLocale(lang) || !profile || !brand) notFound();

  const mn = lang === "mn";
  const informationLabel = mn ? "Мэдээлэл" : "Information";
  const lineup = localePath(lang, "brands/byd");
  const assetPath = `/byd-${profile.id}`;
  const features = bydProfileFeatures[profile.id];
  const salesPhone = brandPhone(brand);
  const requestModel = {
    name: profile.name,
    vehicle: profile.id === "ti-7" ? undefined : { src: assetPath + "/hero-desktop.webp", ...profile.desktop, alt: profile.alt[lang] },
  };

  return <div className="byd-page">
    <JsonLd data={breadcrumbGraph([
      { name: "Sain Motors", path: pageHref(lang, "home") },
      { name: ui.nav.brands[lang], path: pageHref(lang, "brands") },
      { name: brand.name, path: lineup },
      { name: profile.name, path: localePath(lang, bydProfilePath(profile.id)) },
    ])} />
    <section className="byd-profile" aria-labelledby="byd-profile-heading">
      <div className="byd-profile__visual" data-model={profile.id}>
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet={`${assetPath}/hero-mobile.webp`} {...profile.mobile} />
          <img src={`${assetPath}/hero-desktop.webp`} {...profile.desktop} alt={profile.alt[lang]} fetchPriority="high" decoding="async" />
        </picture>
        <div className="byd-shell byd-profile__copy">
          <a className="byd-profile__back" href={`${lineup}#${profile.id}`}><Icon name="arrowLeft" size={17} />{mn ? "BYD загварууд" : "BYD models"}</a>
          <h1 id="byd-profile-heading" translate="no">{profile.name}</h1>
          <p>{profile.description[lang]}</p>
        </div>
      </div>
      <div className="byd-profile__summary">
        <div className="byd-shell byd-profile__summary-inner">
          <dl className="byd-profile__highlights">
            {profile.highlights.map(item => <div key={item.label.en}>
              <dt>{item.label[lang]}</dt>
              <dd>{item.value[lang]}</dd>
            </div>)}
          </dl>
          <div className="byd-actions">
            <a className="byd-button byd-button--primary" href="#byd-enquiry">
              {informationLabel}<Icon name="arrowRight" size={17} />
            </a>
            <a className="byd-button byd-button--outline" href="#byd-test-drive">
              {mn ? "Туршилтын жолоодлого" : "Test drive"}
            </a>
          </div>
        </div>
      </div>
    </section>

    {features && <>
      <nav className="byd-profile__nav byd-subnav" aria-label={mn ? "Загварын хэсгүүд" : "Model sections"}>
        <div className="byd-shell">
          <span className="byd-subnav__model" translate="no">{profile.name}</span>
          <div className="byd-subnav__links">
            <a href="#byd-explore">{mn ? "Онцлох тоноглол" : "Highlights"}</a>
            <a href="#byd-technical">{mn ? "Үзүүлэлт" : "Specifications"}</a>
            <a href="#byd-faq">{mn ? "Асуулт, хариулт" : "FAQ"}</a>
            <a href="#byd-contact">{mn ? "Холбоо барих" : "Contact"}</a>
          </div>
        </div>
      </nav>
      <section className="byd-shell byd-profile__stories" id="byd-explore" aria-labelledby="byd-explore-heading">
        <h2 id="byd-explore-heading">{mn ? "Дизайн ба технологи" : "Design and technology"}</h2>
        {features.stories.map(({ id, title, copy, alt, desktop, mobile }) => {
          const photo = assetPath + "/" + id;
          return <article key={id} id={"byd-feature-" + id} className="byd-profile__story">
            <picture>
              <source media="(max-aspect-ratio: 4/5)" srcSet={photo + "-mobile.webp"} width={mobile[0]} height={mobile[1]} />
              <img src={photo + "-desktop.webp"} width={desktop[0]} height={desktop[1]} alt={alt[lang]} loading="lazy" decoding="async" />
            </picture>
            <div>
              <h3>{title[lang]}</h3>
              <p>{copy[lang]}</p>
            </div>
          </article>;
        })}
      </section>
    </>}

    {profile.id === "ti-7" && <BydBladeBattery locale={lang} />}

    <section className="byd-shell byd-profile__details" id="byd-technical" aria-labelledby="byd-profile-details">
      <h2 id="byd-profile-details">{mn ? "Техникийн үзүүлэлт" : "Technical specifications"}</h2>
      <dl className="byd-profile__specs">
        {profile.specifications.map(item => <div key={item.label.en}>
          <dt>{item.label[lang]}</dt>
          <dd>{item.value[lang]}</dd>
        </div>)}
      </dl>
      <div className="byd-profile__equipment">
        <div className="byd-profile__kit">
          <h3>{mn ? "Тоноглол" : "Equipment"}</h3>
          <ul className="byd-profile__equipment-list" role="list">
            {profile.equipment[lang].map(item => <li key={item}><Icon name="check" size={16} />{item}</li>)}
          </ul>
        </div>
        <div className="byd-profile__paint">
          <h3>{mn ? "Кузовын өнгө" : "Exterior colours"}</h3>
          <ul className="byd-profile__colours" role="list" translate="no">
            {profile.colors.map(([name, colour]) => <li key={name}>
              <span className="byd-profile__swatch" style={{ backgroundColor: colour }} aria-hidden="true" />
              {name}
            </li>)}
          </ul>
        </div>
      </div>
    </section>
    {features && <section className="byd-profile__faq" id="byd-faq" aria-labelledby="byd-faq-heading">
      <div className="byd-shell byd-profile__faq-inner">
        <div>
          <h2 id="byd-faq-heading">{mn ? "Түгээмэл асуултууд" : "Frequently asked questions"}</h2>
          <a className="byd-button byd-button--outline" href={enquiryHref(lang, "finance", brand.slug)}>
            {mn ? "Санхүүжилт лавлах" : "Ask about financing"}<Icon name="arrowRight" size={17} />
          </a>
        </div>
        <div>
          {features.questions.map(({ question, answer }) => <details key={question.en}>
            <summary>{question[lang]}<Icon name="chevronRight" size={18} /></summary>
            <p>{answer[lang]}</p>
          </details>)}
        </div>
      </div>
    </section>}
    <div className="byd-model-requests">
      <TestDriveForm locale={lang} model={requestModel} salesPhone={salesPhone} purpose="test-drive" />
      <TestDriveForm locale={lang} model={requestModel} salesPhone={salesPhone} purpose="sales" />
    </div>
    <BydContact brand={brand} locale={lang} modelRequests salesLabel={informationLabel} />
  </div>;
}
