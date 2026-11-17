import type {Metadata} from "next";
import Link from "next/link";
import {AboutShowroomFilm} from "@/components/AboutShowroomFilm";
import {BrandWordmark} from "@/components/BrandWordmark";
import {Icon} from "@/components/Icon";
import {PageBand} from "@/components/PageBand";
import {Picture} from "@/components/Picture";
import {getBrands,pages,sitePhotos} from "@/content";
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
 const text=locale==="mn"?{
  statement:"SAIN Motors нь 11 автомашины брэндийг нэгтгэсэн групп компани юм.",
  intro:"Бид автомашины борлуулалт, борлуулалтын дараах үйлчилгээг брэндийн салбаруудаараа дамжуулан хүргэдэг. Манай салбаруудаас загварын мэдээлэл, худалдан авалтын зөвлөгөө болон засвар үйлчилгээний мэдээлэл авах боломжтой.",
  brands:"Манай брэндүүд",
  service:"Автомашин сонгохоос эхлээд засвар үйлчилгээ хүртэл бид танд тусална.",
  serviceBody:"Манай салбаруудаар зочилж загваруудтай биечлэн танилцаарай. Худалдан авалт болон борлуулалтын дараах үйлчилгээний талаар манай багаас зөвлөгөө авах боломжтой.",
  locations:"Салбарууд харах",services:"Үйлчилгээтэй танилцах",
  pause:"Дэвсгэр бичлэгийг зогсоох",play:"Дэвсгэр бичлэгийг тоглуулах",care:"Борлуулалт ба үйлчилгээ",outline:"АВТОМАШИН · БОРЛУУЛАЛТ · ҮЙЛЧИЛГЭЭ",
 }:{
  statement:"SAIN Motors is a group company bringing together 11 automotive brands.",
  intro:"We provide vehicle sales and after-sales service through our brand showrooms. Visit our locations for model information, advice on purchasing, and information about maintenance and repairs.",
  brands:"Our brands",
  service:"From choosing your car to taking care of it, we are here to help.",
  serviceBody:"Visit our showrooms to explore the models in person. Our team can advise you on purchasing and after-sales service.",
  locations:"View showrooms",services:"Explore our services",
  pause:"Pause background video",play:"Play background video",care:"Sales and service",outline:"AUTOMOTIVE SALES & SERVICE",
 };
 const brands=getBrands();
 const sales=sitePhotos.showroomTour.find(photo=>photo.key==="showroom-up-close")!;
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
   <div className="about-care__outline" aria-hidden="true">{text.outline}</div>
   <div className="about-care__inner">
    <p className="about-care__label">{text.care}</p>
    <h2 id="about-care-heading">{text.service}</h2>
    <figure className="about-care__sales"><Picture photo={sales} locale={locale} sizes="(min-width: 768px) 45vw, 80vw"/></figure>
    <figure className="about-care__service"><Picture photo={{...sitePhotos.servicesTeaser,focus:"32% 55%"}} locale={locale} sizes="(min-width: 768px) 45vw, 80vw"/></figure>
    <div className="about-care__copy"><p>{text.serviceBody}</p><div className="about-care__links">
     <Link href={pageHref(locale,"locations")} prefetch={false}>{text.locations}<Icon name="arrowUpRight" size={18}/></Link>
     <Link href={pageHref(locale,"services")} prefetch={false}>{text.services}<Icon name="arrowUpRight" size={18}/></Link>
    </div></div>
   </div>
  </section>
 </div>;
}
