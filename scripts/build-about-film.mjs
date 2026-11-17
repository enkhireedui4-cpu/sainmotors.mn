// Usage: node scripts/build-about-film.mjs "C:/path/to/source.mp4"
// Browser-native decode/encode avoids depending on a system FFmpeg install.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium} from 'playwright-core';

const source=path.resolve(process.argv[2]??'');
if(!process.argv[2]||!fs.statSync(source).isFile())throw new Error('Supply the local HONGQI showroom MP4');
const output=path.resolve(import.meta.dirname,'../public/video/about');
fs.mkdirSync(output,{recursive:true});
const shots=[
 {start:1.7,end:6.45,center:960}, // facade, sign, illuminated entrance
 {start:7.05,end:8.8,center:1000}, // chrome grille
 {start:50.25,end:53.25,center:1020}, // full front of the unveiled car
 {start:55.15,end:56.55,center:1000}, // rear lamp
 {start:59.15,end:61.35,center:1060}, // cabin and steering wheel
 {start:78.4,end:80.65,center:1080}, // front detail
];
const server=http.createServer((request,response)=>{
 if(request.url!=='/source.mp4'){
  response.writeHead(200,{'Content-Type':'text/html'});
  return response.end('<!doctype html><video muted playsinline src="/source.mp4"></video>');
 }
 const size=fs.statSync(source).size;
 const range=/^bytes=(\d+)-(\d*)$/.exec(request.headers.range??'');
 const start=range?Number(range[1]):0,end=range&&range[2]?Math.min(Number(range[2]),size-1):size-1;
 response.writeHead(range?206:200,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':end-start+1,...(range?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});
 fs.createReadStream(source,{start,end}).pipe(response);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage();
 await page.goto(`http://127.0.0.1:${server.address().port}/`);
 for(const variant of [{name:'desktop',width:1280,height:720,bitrate:2200000},{name:'mobile',width:540,height:960,bitrate:1200000}]){
  console.log(`Encoding ${variant.name}: ${shots.reduce((sum,s)=>sum+s.end-s.start,0).toFixed(2)} seconds`);
  const encoded=await page.evaluate(async({shots,variant})=>{
   const video=document.querySelector('video');
   if(video.readyState<1)await new Promise((resolve,reject)=>{video.onloadedmetadata=resolve;video.onerror=reject;});
   const mime='video/mp4;codecs=avc1.42001E';
   if(!MediaRecorder.isTypeSupported(mime))throw new Error('This Chrome build cannot encode H.264 MP4');
   const canvas=document.createElement('canvas');canvas.width=variant.width;canvas.height=variant.height;
   const context=canvas.getContext('2d',{alpha:false});
   // The source has baked-in black bars. Only the image between y=196 and y=882 is used.
   const sourceHeight=686,sourceWidth=sourceHeight*variant.width/variant.height;
   const seek=async time=>{video.currentTime=time;await new Promise(resolve=>video.addEventListener('seeked',resolve,{once:true}));};
   const draw=(center,fade=1)=>{
    context.globalAlpha=1;context.fillStyle='#000';context.fillRect(0,0,canvas.width,canvas.height);
    context.globalAlpha=fade;context.filter='saturate(.72)';
    context.drawImage(video,Math.max(0,Math.min(1920-sourceWidth,center-sourceWidth/2)),196,sourceWidth,sourceHeight,0,0,canvas.width,canvas.height);
    context.globalAlpha=1;context.filter='none';
   };
   await seek(3);draw(960);
   const poster=canvas.toDataURL('image/webp',.9).split(',')[1];
   await seek(shots[0].start);draw(shots[0].center);
   const stream=canvas.captureStream(30),chunks=[];
   const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:variant.bitrate});
   const stopped=new Promise((resolve,reject)=>{recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onstop=resolve;recorder.onerror=reject;});
   recorder.start();
   for(const shot of shots){
    if(Math.abs(video.currentTime-shot.start)>.05)await seek(shot.start);
    draw(shot.center,0);await video.play();
    await new Promise(resolve=>{
     const frame=()=>{
      const t=video.currentTime;
      // Short, restrained dips keep the montage comfortable behind the copy.
      const fade=Math.max(0,Math.min(1,(t-shot.start)/.18,(shot.end-t)/.18));
      draw(shot.center,fade);
      if(t>=shot.end){video.pause();resolve();}else video.requestVideoFrameCallback(frame);
     };video.requestVideoFrameCallback(frame);
    });
   }
   recorder.stop();await stopped;stream.getTracks().forEach(track=>track.stop());
   const blob=new Blob(chunks,{type:mime});
   const film=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(blob);});
   return {film,poster};
  },{shots,variant});
  fs.writeFileSync(path.join(output,`showroom-${variant.name}.mp4`),Buffer.from(encoded.film,'base64'));
  fs.writeFileSync(path.join(output,`showroom-${variant.name}-poster.webp`),Buffer.from(encoded.poster,'base64'));
  console.log(`Saved ${variant.name}`);
 }
}finally{
 await browser?.close();await new Promise(resolve=>server.close(resolve));
}
