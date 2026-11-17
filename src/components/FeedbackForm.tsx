"use client";

import {useEffect,useState,type FormEvent,type ReactNode} from "react";
import type {Locale} from "@/lib/i18n";
import {useQuery} from "@/lib/use-query";

const copy={
 en:{client:"Customer",employee:"Employee",dealer:"Dealer or partner",identity:"Who are you?",name:"Name",phone:"Phone number",showroom:"Showroom",chooseShowroom:"Select a showroom",comments:"Your message",placeholder:"Tell us how we can help.",consent:"I agree to the use of my personal information to respond to my request.",submit:"Open email draft",required:"Please complete this field.",phoneError:"Enter an 8-digit Mongolian phone number.",consentError:"Please agree before continuing.",notice:"This opens an email draft. Review it and send it from your email app.",ready:"Your email draft is ready. Send it from your email app to complete your request.",open:"Open email draft",subject:"Feedback"},
 mn:{client:"Харилцагч",employee:"Ажилтан",dealer:"Дилер, түнш",identity:"Та хэн бэ?",name:"Нэр",phone:"Утасны дугаар",showroom:"Борлуулалтын салбар",chooseShowroom:"Салбар сонгох",comments:"Таны хүсэлт",placeholder:"Асуулт, санал хүсэлтээ бичнэ үү.",consent:"Миний хүсэлтийг шийдвэрлэх зорилгоор оруулсан хувийн мэдээллийг ашиглахыг зөвшөөрч байна.",submit:"Имэйлийн ноорог нээх",required:"Энэ талбарыг бөглөнө үү.",phoneError:"Утасны 8 оронтой дугаараа оруулна уу.",consentError:"Үргэлжлүүлэхийн өмнө зөвшөөрнө үү.",notice:"Товчийг дарахад имэйлийн ноорог нээгдэнэ. Нооргоо шалгаад имэйл апп-аасаа илгээнэ үү.",ready:"Имэйл бэлэн боллоо. Хүсэлтээ хүргэхийн тулд имэйл апп-аасаа илгээнэ үү.",open:"Имэйлийн ноорог нээх",subject:"Санал хүсэлт"},
};
type Audience="client"|"employee"|"dealer";
export function FeedbackForm({locale,email,showrooms,children}:{locale:Locale;email:string;showrooms:{id:string;label:string}[];children:ReactNode}){
 const text=copy[locale];
 const [audience,setAudience]=useState<Audience>("client");
 const [errors,setErrors]=useState<Record<string,string>>({});
 const [draft,setDraft]=useState("");
 const search=useQuery();
 const params=new URLSearchParams(search??"");
 const hasRoute=params.has("intent")||params.has("brand");
 useEffect(()=>{if(search&&window.location.hash==="#enquiry-heading") {const frame=requestAnimationFrame(()=>document.getElementById("enquiry-heading")?.scrollIntoView({block:"start"}));return()=>cancelAnimationFrame(frame);}},[search]);
 function prepare(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;const data=new FormData(form);
  const name=String(data.get("name")??"").trim();const phone=String(data.get("phone")??"").replace(/[\s()-]/g,"");
  const invalid:Record<string,string>={};if(name.length<2)invalid.name=text.required;
  if(!/^(?:\+?976)?\d{8}$/.test(phone))invalid.phone=text.phoneError;
  if(data.get("consent")!=="yes")invalid.consent=text.consentError;
  setErrors(invalid);if(Object.keys(invalid).length){setDraft("");(form.elements.namedItem(Object.keys(invalid)[0]) as HTMLElement)?.focus();return;}
  const showroom=showrooms.find(place=>place.id===data.get("showroom"))?.label??"";
  const body=[`${text.identity}: ${text[audience]}`,`${text.name}: ${name}`,`${text.phone}: ${phone}`,`${text.showroom}: ${showroom}`,`${text.comments}:\n${String(data.get("comments")??"").trim()}`,text.consent].join("\n\n");
  const subject=`[Sain Motors] ${text.subject} — ${text[audience]}`;
  const href=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  setDraft(href);
  const link=document.createElement("a");link.href=href;link.hidden=true;
  document.body.append(link);link.click();link.remove();
 }
 return <>
  <form className="feedback-form" noValidate onSubmit={prepare} onChange={()=>setDraft("")}>
   <fieldset className="feedback-identity"><legend className="sr-only">{text.identity}</legend>{(["client","employee","dealer"] as const).map(value=><label key={value} className="feedback-identity__option"><input className="sr-only" type="radio" name="audience" value={value} checked={audience===value} onChange={()=>setAudience(value)}/><span>{text[value]}</span></label>)}</fieldset>
   <div className="feedback-fields">
    <div className="feedback-field"><label htmlFor="feedback-name">{text.name} *</label><input id="feedback-name" name="name" autoComplete="name" maxLength={80} required aria-invalid={!!errors.name} aria-describedby={errors.name?"feedback-name-error":undefined}/>{errors.name&&<p id="feedback-name-error" className="feedback-error">{errors.name}</p>}</div>
    <div className="feedback-field"><label htmlFor="feedback-phone">{text.phone} *</label><input id="feedback-phone" name="phone" type="tel" autoComplete="tel" maxLength={24} required aria-invalid={!!errors.phone} aria-describedby={errors.phone?"feedback-phone-error":undefined}/>{errors.phone&&<p id="feedback-phone-error" className="feedback-error">{errors.phone}</p>}</div>
    <div className="feedback-field"><label htmlFor="feedback-showroom">{text.showroom}</label><select id="feedback-showroom" name="showroom" defaultValue=""><option value="">{text.chooseShowroom}</option>{showrooms.map(place=><option value={place.id} key={place.id}>{place.label}</option>)}</select></div>
   </div>
   <div className="feedback-comments"><label htmlFor="feedback-comment">{text.comments}</label><textarea id="feedback-comment" name="comments" maxLength={2000} placeholder={text.placeholder}/></div>
   <div className="feedback-consent"><label><input id="feedback-consent" name="consent" type="checkbox" value="yes" required aria-invalid={!!errors.consent} aria-describedby={errors.consent?"feedback-consent-error":undefined}/><span>{text.consent}</span></label>{errors.consent&&<p id="feedback-consent-error" className="feedback-error">{errors.consent}</p>}</div>
   <div className="feedback-action"><p id="feedback-email-notice" className="feedback-notice">{text.notice}</p><button type="submit" className="feedback-submit" disabled={search===null} aria-describedby="feedback-email-notice">{text.submit}</button><noscript><p><a href={`mailto:${email}`}>{email}</a></p></noscript>{draft&&<div className="feedback-prepared"><p role="status">{text.ready}</p><a className="feedback-email-draft" href={draft}>{text.open}</a></div>}</div>
  </form>
  <div className="feedback-brand-routing" hidden={!hasRoute}>{children}</div>
 </>;
}
