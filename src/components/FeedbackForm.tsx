"use client";
import {useEffect,useRef,useState,type FormEvent,type ReactNode} from "react";
import type {Locale} from "@/lib/i18n";
import {submitFeedback,validateFeedback} from "@/lib/feedback";
import {useQuery} from "@/lib/use-query";
import {Icon} from "./Icon";

const copy={
 en:{client:"Customer",employee:"Employee",dealer:"Dealer or partner",identity:"Who are you?",details:"Contact details",name:"Name",phone:"Phone number",showroom:"Showroom",chooseShowroom:"Select a showroom",comments:"Your message",placeholder:"Tell us how we can help.",consent:"I agree to the use of my personal information to respond to my request.",submit:"Send",sending:"Sending…",required:"Please complete this field.",phoneError:"Enter an 8-digit Mongolian phone number.",consentError:"Please agree before sending.",invalid:"Please check this field.",failed:"We couldn’t send your request. Please try again or contact us by email.",email:"Contact us by email",success:"Thank you for getting in touch",received:"We’ve received your request. Our team will contact you using the phone number you provided.",another:"Send another message"},
 mn:{client:"Харилцагч",employee:"Ажилтан",dealer:"Дилер, түнш",identity:"Та хэн бэ?",details:"Холбоо барих мэдээлэл",name:"Нэр",phone:"Утасны дугаар",showroom:"Борлуулалтын салбар",chooseShowroom:"Салбар сонгох",comments:"Таны хүсэлт",placeholder:"Асуулт, санал хүсэлтээ бичнэ үү.",consent:"Миний хүсэлтийг шийдвэрлэх зорилгоор оруулсан хувийн мэдээллийг ашиглахыг зөвшөөрч байна.",submit:"Илгээх",sending:"Илгээж байна…",required:"Энэ талбарыг бөглөнө үү.",phoneError:"Утасны 8 оронтой дугаараа оруулна уу.",consentError:"Илгээхийн өмнө зөвшөөрнө үү.",invalid:"Энэ талбарыг шалгана уу.",failed:"Хүсэлтийг илгээж чадсангүй. Дахин оролдох эсвэл имэйлээр холбогдоно уу.",email:"Имэйлээр холбогдох",success:"Холбогдсонд баярлалаа",received:"Таны хүсэлтийг хүлээн авлаа. Бид таны оруулсан утасны дугаараар эргэн холбогдоно.",another:"Шинэ хүсэлт илгээх"},
};
type Audience="client"|"employee"|"dealer";
type State="idle"|"sending"|"success"|"error";
export function FeedbackForm({locale,email,showrooms,children}:{locale:Locale;email:string;showrooms:{id:string;label:string}[];children:ReactNode}){
 const text=copy[locale];
 const [audience,setAudience]=useState<Audience>("client");
 const [errors,setErrors]=useState<Record<string,string>>({});
 const [state,setState]=useState<State>("idle");
 const successRef=useRef<HTMLHeadingElement>(null);const inFlight=useRef(false);
 const search=useQuery();const params=new URLSearchParams(search??"");const hasRoute=params.has("intent")||params.has("brand");
 useEffect(()=>{if(search&&window.location.hash==="#enquiry-heading"){const frame=requestAnimationFrame(()=>document.getElementById("enquiry-heading")?.scrollIntoView({block:"start"}));return()=>cancelAnimationFrame(frame);}},[search]);
 useEffect(()=>{if(state==="success")successRef.current?.focus();},[state]);
 async function send(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(inFlight.current)return;
  const form=event.currentTarget;const data=new FormData(form);
  const result=validateFeedback({audience,name:String(data.get("name")??""),phone:String(data.get("phone")??""),showroom:String(data.get("showroom")??""),message:String(data.get("comments")??""),consent:data.get("consent")==="yes",locale,website:String(data.get("website")??"")});
  if(!result.ok){
   const localized=Object.fromEntries(Object.keys(result.errors).map(key=>[key,key==="name"?text.required:key==="phone"?text.phoneError:key==="consent"?text.consentError:text.invalid]));
   setErrors(localized);setState("idle");const first=Object.keys(localized)[0];
   (form.elements.namedItem(first==="message"?"comments":first) as HTMLElement)?.focus();return;
  }
  setErrors({});setState("sending");inFlight.current=true;
  try{await submitFeedback(result.data);setState("success");}catch{setState("error");}finally{inFlight.current=false;}
 }
 return <>
  {state==="success"?<section className="feedback-success" aria-labelledby="feedback-success-heading">
   <span className="feedback-success__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m5 12 4 4L19 6"/></svg></span>
   <h3 id="feedback-success-heading" tabIndex={-1} ref={successRef}>{text.success}</h3><p role="status">{text.received}</p>
   <button type="button" className="feedback-again" onClick={()=>{setState("idle");setAudience("client");setErrors({});requestAnimationFrame(()=>document.getElementById("feedback-name")?.focus());}}>{text.another}<Icon name="arrowUpRight" size={18}/></button>
  </section>:<form className="feedback-form" noValidate onSubmit={send} aria-busy={state==="sending"} data-state={state}>
   <div className="sr-only" aria-hidden="true"><label htmlFor="feedback-website">Website</label><input id="feedback-website" name="website" tabIndex={-1} autoComplete="off"/></div>
   <fieldset className="feedback-identity" disabled={state==="sending"}><legend className="sr-only">{text.identity}</legend>{(["client","employee","dealer"] as const).map(value=><label key={value} className="feedback-identity__option"><input className="sr-only" type="radio" name="audience" value={value} checked={audience===value} onChange={()=>setAudience(value)}/><span>{text[value]}</span></label>)}</fieldset>
   <fieldset className="feedback-fields" disabled={state==="sending"}><legend className="sr-only">{text.details}</legend>
    <div className="feedback-field"><label htmlFor="feedback-name">{text.name} <span className="feedback-required" aria-hidden="true">*</span></label><input id="feedback-name" name="name" autoComplete="name" maxLength={80} required aria-invalid={!!errors.name} aria-describedby={errors.name?"feedback-name-error":undefined}/>{errors.name&&<p id="feedback-name-error" className="feedback-error">{errors.name}</p>}</div>
    <div className="feedback-field"><label htmlFor="feedback-phone">{text.phone} <span className="feedback-required" aria-hidden="true">*</span></label><input id="feedback-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={24} required aria-invalid={!!errors.phone} aria-describedby={errors.phone?"feedback-phone-error":undefined}/>{errors.phone&&<p id="feedback-phone-error" className="feedback-error">{errors.phone}</p>}</div>
    <div className="feedback-field"><label htmlFor="feedback-showroom">{text.showroom}</label><select id="feedback-showroom" name="showroom" defaultValue=""><option value="">{text.chooseShowroom}</option>{showrooms.map(place=><option value={place.id} key={place.id}>{place.label}</option>)}</select></div>
   </fieldset>
   <div className="feedback-comments"><label htmlFor="feedback-comment">{text.comments}</label><textarea id="feedback-comment" name="comments" maxLength={2000} placeholder={text.placeholder} disabled={state==="sending"} aria-invalid={!!errors.message} aria-describedby={errors.message?"feedback-message-error":undefined}/>{errors.message&&<p id="feedback-message-error" className="feedback-error">{errors.message}</p>}</div>
   <div className="feedback-consent"><label><input id="feedback-consent" name="consent" type="checkbox" value="yes" required disabled={state==="sending"} aria-invalid={!!errors.consent} aria-describedby={errors.consent?"feedback-consent-error":undefined}/><span>{text.consent}</span></label>{errors.consent&&<p id="feedback-consent-error" className="feedback-error">{errors.consent}</p>}</div>
   <div className="feedback-action"><button type="submit" className="feedback-submit" disabled={search===null||state==="sending"}><span>{state==="sending"?text.sending:text.submit}</span>{state==="sending"?<span className="feedback-spinner" aria-hidden="true"/>:<Icon name="arrowUpRight" size={20}/>}</button>
    {state==="error"&&<div className="feedback-send-error" role="alert"><p>{text.failed}</p><a href={`mailto:${email}`}>{text.email}<Icon name="arrowUpRight" size={16}/></a></div>}
    <noscript><p><a href={`mailto:${email}`}>{text.email}: {email}</a></p></noscript>
   </div>
  </form>}
  <div className="feedback-brand-routing" hidden={!hasRoute}>{children}</div>
 </>;
}
