import type {Metadata} from "next";
import {PageBand} from "@/components/PageBand";
import {ContactJourney} from "@/components/ContactJourney";
import {FeedbackForm} from "@/components/FeedbackForm";
import {company,contact,getLocation,getLocations,pages} from "@/content";
import type {Locale} from "@/lib/i18n";
import {pageMetadata} from "@/lib/seo";
import "@/components/feedback.css";

type Props={params:Promise<{lang:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const locale=(await params).lang as Locale;const meta=pages.contact.meta.value[locale];return pageMetadata({locale,path:"contact",title:meta.title,description:meta.description});}
export default async function ContactPage({params}:Props){
 const locale=(await params).lang as Locale;
 const text=locale==="mn"?{
  heading:"Санал хүсэлт илгээх",
  map:"Салбарын байршил харах",
 }:{heading:"Send us a message",map:"View showroom location"};
 const showroom=getLocation("jetour-c1");
 const showrooms=getLocations().filter(place=>place.kind==="showroom").map(place=>({id:place.id,label:`${place.name[locale]} — ${place.city[locale]}`}));
 return <div className="contact-page feedback-page">
  <PageBand locale={locale} title={pages.contact.meta.value[locale].title} id="contact-title"/>
  <section className="feedback-section" aria-labelledby="feedback-heading">
   <div className="feedback-intro"><h2 id="feedback-heading">{text.heading}</h2><p>{pages.contact.lead.value[locale]}</p><p>{company.officeAddress.value[locale]}</p><div className="feedback-contact-links"><a href={contact.phone.href}>{contact.phone.display}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={showroom.map.url} rel="noopener">{text.map}</a></div></div>
   <FeedbackForm locale={locale} email={contact.email} showrooms={showrooms}><ContactJourney locale={locale}/></FeedbackForm>
  </section>
 </div>;
}
