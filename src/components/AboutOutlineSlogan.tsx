// Geometric display lettering for the decorative About band. Vector contours
// keep the squared forms consistent without downloading another typeface.
const letters:Record<string,{width:number;path:string}>={
 A:{width:90,path:"M0 80 34 0H56L90 80H72L65 63H25L18 80ZM31 49H59L45 16Z"},
 C:{width:90,path:"M90 0V14H25Q16 14 16 24V56Q16 66 25 66H90V80H23Q0 80 0 57V23Q0 0 23 0Z"},
 D:{width:90,path:"M0 0H65Q90 0 90 25V55Q90 80 65 80H0ZM16 14V66H63Q74 66 74 54V26Q74 14 63 14Z"},
 E:{width:86,path:"M0 0H86V14H16V33H76V47H16V66H86V80H0Z"},
 F:{width:86,path:"M0 0H86V14H16V33H76V47H16V80H0Z"},
 H:{width:90,path:"M0 0H16V33H74V0H90V80H74V47H16V80H0Z"},
 I:{width:16,path:"M0 0H16V80H0Z"},
 N:{width:90,path:"M0 80V0H18L74 57V0H90V80H72L16 23V80Z"},
 O:{width:90,path:"M24 0H66Q90 0 90 24V56Q90 80 66 80H24Q0 80 0 56V24Q0 0 24 0ZM26 14Q16 14 16 25V55Q16 66 26 66H64Q74 66 74 55V25Q74 14 64 14Z"},
 R:{width:90,path:"M0 80V0H66Q90 0 90 23V27Q90 45 71 48L90 80H71L53 49H16V80ZM16 14V35H64Q74 35 74 26V23Q74 14 64 14Z"},
 T:{width:90,path:"M0 0H90V14H53V80H37V14H0Z"},
 W:{width:124,path:"M0 0H18L39 61 54 0H70L85 61 106 0H124L96 80H76L62 24 48 80H28Z"},
};

export function AboutOutlineSlogan({text}:{text:string}){
 let cursor=2;
 const glyphs:{x:number;path:string}[]=[];
 for(const char of text){
  if(char===" "){cursor+=44;continue;}
  const letter=letters[char];
  glyphs.push({x:cursor,path:letter.path});
  cursor+=letter.width+14;
 }
 const width=cursor-12;
 return <svg className="about-care__outline" viewBox="0 0 1920 87" aria-hidden="true" data-slogan={text}>
  <g transform={`translate(0 3.5) scale(${1920/width} 1)`}>
   {glyphs.map((glyph,index)=><path key={index} d={glyph.path} transform={`translate(${glyph.x} 0)`}/>)}
  </g>
 </svg>;
}
