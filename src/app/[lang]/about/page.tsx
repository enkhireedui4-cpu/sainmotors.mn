import { BrandLink } from "@/components/BrandLink";
﻿import type {Metadata} from "next";
import {AboutShowroomFilm} from "@/components/AboutShowroomFilm";
import {AboutPrinciples} from "@/components/AboutPrinciples";
import {BrandWordmark} from "@/components/BrandWordmark";
import {PageBand} from "@/components/PageBand";
import {getBrands,pages} from "@/content";
import {aboutCopy} from "@/content/about";
import type {Locale} from "@/lib/i18n";
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
  <section className="about-network" aria-labelledby="page-title">
   <AboutShowroomFilm/>
   <div className="about-story__inner">
    <div className="about-story__body">{text.intro.split("\n\n").map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div>
   </div>
   <div className="about-network__inner">
    <h2 id="about-brands-heading">{text.brands}</h2>
    <ul className="about-network__brands">{brands.map(brand=><li key={brand.slug}>
     <BrandLink locale={locale} slug={brand.slug} prefetch={false} aria-label={brand.name} title={brand.name}><BrandWordmark brand={brand} locale={locale}/></BrandLink>
    </li>)}</ul>
   </div>
  </section>
  <AboutPrinciples locale={locale}/>
 </div>;
}
