"use client";

import {useEffect,useRef} from "react";

const MEDIA="/video/about/showroom";

/** Optional motion behind the server-rendered About copy and brand links. */
export function AboutShowroomFilm(){
 const rootRef=useRef<HTMLDivElement>(null);
 const videoRef=useRef<HTMLVideoElement>(null);

 useEffect(()=>{
  const root=rootRef.current,video=videoRef.current;
  if(!root||!video)return;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile=window.matchMedia("(max-width: 767px)");
  const connection=(navigator as Navigator&{connection?:EventTarget&{saveData?:boolean}}).connection;
  let visible=false,failed=false,disposed=false;
  const sync=()=>{
   if(disposed)return;
   const still=reduced.matches||connection?.saveData;
   const moving=!still&&!failed&&visible&&!document.hidden;
   root.dataset.motion=still?"reduced":failed?"static":moving?"running":"paused";
   if(!moving){video.pause();return;}
   const source=`${MEDIA}-${mobile.matches?"mobile":"desktop"}.mp4`;
   if(video.getAttribute("src")!==source){
    root.dataset.media="poster";
    video.src=source;video.load();
   }
   if(video.paused)void video.play().catch(()=>{/* Keep the poster if autoplay is unavailable. */});
  };
  const ready=()=>{root.dataset.media="ready";};
  const error=()=>{failed=true;root.dataset.media="fallback";sync();};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:0});
  observer.observe(root);
  video.addEventListener("loadeddata",ready);
  video.addEventListener("error",error);
  reduced.addEventListener("change",sync);
  mobile.addEventListener("change",sync);
  connection?.addEventListener("change",sync);
  document.addEventListener("visibilitychange",sync);
  sync();
  return()=>{
   disposed=true;observer.disconnect();video.pause();
   video.removeEventListener("loadeddata",ready);video.removeEventListener("error",error);
   reduced.removeEventListener("change",sync);mobile.removeEventListener("change",sync);
   connection?.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync);
  };
 },[]);

 return <div ref={rootRef} className="about-film" data-motion="static" data-media="poster">
  <picture>
   <source media="(max-width: 767px)" srcSet={`${MEDIA}-mobile-poster.webp`} width={540} height={960}/>
   <img className="about-film__poster" src={`${MEDIA}-desktop-poster.webp`} width={1280} height={720} alt="" fetchPriority="high"/>
  </picture>
  <video ref={videoRef} className="about-film__video" preload="none" muted playsInline loop disablePictureInPicture tabIndex={-1} aria-hidden="true"/>
 </div>;
}
