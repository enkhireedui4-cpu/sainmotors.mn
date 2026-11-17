"use client";

import {useEffect,useRef} from "react";

/** Scroll-scrubbed word fill; the complete heading stays readable without JS. */
export function AboutPhilosophyStatement({text}:{text:string}){
 const ref=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{
  const heading=ref.current;
  if(!heading)return;
  const words=Array.from(heading.querySelectorAll<HTMLElement>("[data-about-word]"));
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame=0;
  const update=()=>{
   frame=0;
   if(reduced.matches){words.forEach(word=>word.style.removeProperty("opacity"));return;}
   const progress=Math.max(0,Math.min(1,(innerHeight+100-heading.getBoundingClientRect().top)/(innerHeight*.8+100)));
   words.forEach((word,index)=>{word.style.opacity=String(Math.max(.12,Math.min(1,progress*words.length-index)));});
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener("scroll",schedule,{passive:true});
  window.addEventListener("resize",schedule);
  reduced.addEventListener("change",schedule);
  update();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);reduced.removeEventListener("change",schedule);};
 },[text]);
 return <h2 ref={ref} id="about-care-heading" aria-label={text.replace(/\s+/g," ")}>
  {text.split("\n").map((line,lineIndex)=><span className="about-care__line" key={lineIndex} aria-hidden="true">
   {line.split(/\s+/).map((word,index)=><span key={index} data-about-word>{word}{" "}</span>)}
  </span>)}
 </h2>;
}
