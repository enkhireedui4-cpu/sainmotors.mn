"use client";
import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
const motionQuery="(min-width: 48rem) and (prefers-reduced-motion: no-preference)";
const subscribe=(listener:()=>void)=>{const media=window.matchMedia(motionQuery);media.addEventListener("change",listener);return()=>media.removeEventListener("change",listener);};
const clientMotion=()=>window.matchMedia(motionQuery).matches;
const serverMotion=()=>false;
export function BrandMarquee({children,count,labels}:{children:ReactNode;count:number;labels:{region:string;help:string}}) {
 const ready=useSyncExternalStore(subscribe,clientMotion,serverMotion);
 const [paused,setPaused]=useState(false);
 return <div className="brand-marquee" data-ready={ready} data-paused={paused} style={{"--brand-count":count} as CSSProperties}>
  <div id="home-brand-strip" className="brand-marquee__viewport" role="region" aria-label={labels.region} aria-describedby={ready?"brand-motion-help":undefined} aria-keyshortcuts={ready?"Space":undefined} tabIndex={ready?0:undefined}
   onFocusCapture={event=>{const target=event.target as HTMLElement;if(ready&&target.closest("a"))requestAnimationFrame(()=>{if(target.matches(":focus-visible"))target.scrollIntoView({block:"nearest",inline:"nearest",behavior:"instant"});});}}
   onKeyDown={event=>{if(ready&&event.target===event.currentTarget&&event.key===" "){event.preventDefault();setPaused(value=>!value);}}}
   onPointerDown={event=>{if(ready&&event.pointerType==="touch")setPaused(value=>!value);}}
   onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))event.currentTarget.scrollLeft=0;}}>
   <div className="brand-marquee__track">{children}</div>
  </div>
  {ready&&<p className="sr-only" id="brand-motion-help">{labels.help}</p>}
 </div>;
}
