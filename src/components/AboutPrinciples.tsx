import {aboutCopy} from "@/content/about";
import type {Locale} from "@/lib/i18n";
import "./about-principles.css";

function PrincipleSymbol({kind}:{kind:"mission"|"vision"|"values"|"development"}) {
 return <svg className="about-principles__symbol" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" focusable="false">
  {kind==="mission" && <><circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="2"/><path d="M24 6v8m18 10h-8M24 42v-8M6 24h8"/></>}
  {kind==="vision" && <><circle cx="24" cy="24" r="18"/><path d="m30 15-3 12-12 6 6-12 9-6Z"/><path d="m21 21 6 6"/></>}
  {kind==="values" && <><circle cx="18" cy="24" r="13"/><circle cx="30" cy="24" r="13"/><path d="m19 24 4 4 7-8"/></>}
  {kind==="development" && <><path d="M8 39V9m0 30h32M15 31l9-10 7 5 10-14M31 12h10v10"/><circle cx="15" cy="31" r="2"/></>}
 </svg>;
}

/** Photo-free purpose cards; all company copy is shared by the two locales. */
export function AboutPrinciples({locale}:{locale:Locale}) {
 const text=aboutCopy.value[locale];
 return <section className="about-principles" aria-labelledby="about-principles-heading">
  <svg className="about-principles__route" viewBox="0 0 1440 1200" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
   <path d="M-100 165h420c190 0 340 80 340 250S495 650 340 650 80 730 80 900s210 230 420 230h1040"/>
   <path d="M-100 181h420c180 0 324 72 324 234S489 634 340 634 64 724 64 900s216 246 436 246h1040"/>
   <path d="M1560 40h-280c-180 0-270 130-270 300v180c0 180 110 270 290 270h260"/>
  </svg>
  <div className="about-principles__grid">
   <header className="about-principles__intro"><h2 id="about-principles-heading">{text.purposeTitle}</h2><span className="about-principles__accent" aria-hidden="true"/></header>
   <article className="about-principles__card about-principles__mission" aria-labelledby="about-mission-heading">
    <div className="about-principles__card-head"><h3 id="about-mission-heading">{text.missionTitle}</h3><PrincipleSymbol kind="mission"/></div>
    <p>{text.missionBody}</p>
   </article>
   <article className="about-principles__card about-principles__vision" aria-labelledby="about-vision-heading">
    <div className="about-principles__card-head"><h3 id="about-vision-heading">{text.visionTitle}</h3><PrincipleSymbol kind="vision"/></div>
    <p>{text.visionBody}</p>
   </article>
   <article className="about-principles__card about-principles__values" aria-labelledby="about-values-heading">
    <div className="about-principles__card-head"><h3 id="about-values-heading">{text.valuesTitle}</h3><PrincipleSymbol kind="values"/></div>
    <ul>{text.values.map(value=><li key={value}>{value}</li>)}</ul>
   </article>
   <article className="about-principles__card about-principles__development" aria-labelledby="about-development-heading">
    <div className="about-principles__card-head"><h3 id="about-development-heading">{text.principlesTitle}</h3><PrincipleSymbol kind="development"/></div>
    <p>{text.principlesBody}</p>
   </article>
  </div>
 </section>;
}
