import type {Metadata} from "next";
import Link from "next/link";
import {AboutShowroomFilm} from "@/components/AboutShowroomFilm";
import {AboutPhilosophyStatement} from "@/components/AboutPhilosophyStatement";
import {BrandWordmark} from "@/components/BrandWordmark";
import {Icon} from "@/components/Icon";
import {PageBand} from "@/components/PageBand";
import {Picture} from "@/components/Picture";
import {getBrands,pages} from "@/content";
import {aboutCopy,aboutPhotos,aboutPurposeImages} from "@/content/about";
import type {Locale} from "@/lib/i18n";
import {brandHref,pageHref} from "@/lib/routes";
import {pageMetadata} from "@/lib/seo";
import "./about.css";

type Props={params:Promise<{lang:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const locale=(await params).lang as Locale;
 const meta=pages.about.meta.value[locale];
 return pageMetadata({locale,path:"about",title:meta.title,description:meta.description});
}

export default async function AboutPage({params}:Props){
 const locale=(await params).lang as Locale;
 const text=aboutCopy.value[locale];
 const brands=getBrands();
 return <div className="about-page corporate-about">
  <PageBand locale={locale} title={pages.about.meta.value[locale].title}/>
  <section className="about-network" aria-labelledby="about-statement">
   <AboutShowroomFilm labels={{pause:text.pause,play:text.play}}/>
   <div className="about-story__inner">
    <h2 id="about-statement">{text.statement}</h2>
    <p className="about-story__body">{text.intro}</p>
   </div>
   <div className="about-network__inner">
    <h2 id="about-brands-heading">{text.brands}</h2>
    <ul className="about-network__brands">{brands.map(brand=><li key={brand.slug}>
     <Link href={brandHref(locale,brand.slug)} prefetch={false} aria-label={brand.name} title={brand.name}><BrandWordmark brand={brand} locale={locale}/></Link>
    </li>)}</ul>
   </div>
  </section>
  <section className="about-care" aria-labelledby="about-care-heading">
   <svg className="about-care__outline" viewBox="0 0 1920 87" aria-hidden="true"><text x="0" y="82" textLength="1920" lengthAdjust="spacingAndGlyphs">{text.outline}</text></svg>
   <div className="about-care__inner">
    <p className="about-care__label">{text.philosophyLabel}</p>
    <AboutPhilosophyStatement text={text.philosophy}/>
    <figure className="about-care__sales"><Picture photo={aboutPhotos.left} locale={locale} sizes="(min-width: 768px) 14vw, 45vw"/></figure>
    <figure className="about-care__service"><Picture photo={aboutPhotos.right} locale={locale} sizes="(min-width: 768px) 14vw, 45vw"/></figure>
    <figure className="about-care__lower"><Picture photo={aboutPhotos.lower} locale={locale} sizes="(min-width: 768px) 14vw, 45vw"/></figure>
    <div className="about-care__copy"><p>{text.philosophyBody}</p><div className="about-care__links">
     <Link href={pageHref(locale,"locations")} prefetch={false}>{text.locations}<Icon name="arrowUpRight" size={18}/></Link>
     <Link href={pageHref(locale,"services")} prefetch={false}>{text.services}<Icon name="arrowUpRight" size={18}/></Link>
    </div></div>
   </div>
  </section>
  <section className="about-purpose" aria-label={text.philosophyLabel}>
   <article className="about-purpose__panel about-mission" aria-labelledby="about-mission-heading">
    <img className="about-mission__photo" src={aboutPurposeImages.mission.src} width={aboutPurposeImages.mission.width} height={aboutPurposeImages.mission.height} alt={aboutPurposeImages.mission.alt[locale]} loading="lazy" decoding="async" style={{objectPosition:aboutPurposeImages.mission.focus}}/>
    <div className="about-purpose__copy"><h2 id="about-mission-heading">{text.missionTitle}</h2><p>{text.missionBody}</p></div>
   </article>
   <article className="about-purpose__panel about-vision" aria-labelledby="about-vision-heading">
    <img className="about-vision__car" src={aboutPurposeImages.vision.src} width={aboutPurposeImages.vision.width} height={aboutPurposeImages.vision.height} alt={aboutPurposeImages.vision.alt[locale]} loading="lazy" decoding="async"/>
    <div className="about-purpose__copy"><h2 id="about-vision-heading">{text.visionTitle}</h2><p>{text.visionBody}</p></div>
   </article>
   <div className="about-purpose__panel about-diagram">
    <AboutShowroomFilm labels={{pause:text.pause,play:text.play}}/>
    <h2 className="sr-only">{text.diagramLabel}</h2>
    <svg viewBox="0 0 660 500" role="img" aria-label={text.diagramLabel} className="about-diagram__drawing">
     <text x="330" y="70" textAnchor="middle" className="about-diagram__company">SAIN MOTORS</text>
     <path d="M330 142a160 160 0 0 1 0 276 160 160 0 0 1 0-276Z" fill="#fff" opacity=".12"/>
     <circle cx="250" cy="280" r="160" fill="none" stroke="#fff" strokeOpacity=".5"/>
     <circle cx="410" cy="280" r="160" fill="none" stroke="#fff" strokeOpacity=".5"/>
     <text x="220" y="285" textAnchor="middle">{text.diagramQuality}</text>
     <text x="440" y="285" textAnchor="middle">{text.diagramResponsibility}</text>
    </svg>
   </div>
   <article className="about-purpose__panel about-purpose__values" aria-labelledby="about-values-heading">
    <div className="about-purpose__copy"><h2 id="about-values-heading">{text.valuesTitle}</h2>
     <ol>{text.values.map(value=><li key={value}>{value}</li>)}</ol>
     <h3>{text.principlesTitle}</h3><p>{text.principlesBody}</p>
    </div>
   </article>
  </section>
 </div>;
}
