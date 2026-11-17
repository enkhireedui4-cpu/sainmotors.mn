import type {CSSProperties} from "react";
import {getLogo} from "@/content";
import type {Brand} from "@/content/types";
import type {Locale} from "@/lib/i18n";
import {BrandMark} from "./BrandMark";
import "./brand-wordmark.css";

// Crop the supplied combined emblem/wordmark assets to their wordmarks.
const bounds:Record<string,{x:number;y:number;width:number;height:number}|undefined>={
 bestune:{x:113,y:48,width:525,height:52},
 maxus:{x:188,y:30,width:454,height:46},
 hongqi:{x:110,y:52,width:517,height:56},
};
const scale:Record<string,number|undefined>={"212":.72,rely:.9,soueast:1.12,hongqi:1.06};

export function BrandWordmark({brand,locale,className=""}:{brand:Brand;locale:Locale;className?:string}){
 const logo=getLogo(brand.slug);
 const crop=logo?(bounds[brand.slug]??{x:0,y:0,width:logo.width,height:logo.height}):undefined;
 const style=logo&&crop?{
  "--wordmark-aspect":crop.width/crop.height,
  "--wordmark-scale":scale[brand.slug]??1,
  "--wordmark-source-width":`${logo.width/crop.width*100}%`,
  "--wordmark-source-height":`${logo.height/crop.height*100}%`,
  "--wordmark-offset-x":`${-crop.x/crop.width*100}%`,
  "--wordmark-offset-y":`${-crop.y/crop.height*100}%`,
 } as CSSProperties:undefined;
 return <span className={`wordmark-crop ${className}`} style={style}><BrandMark brand={brand} locale={locale} decorative/></span>;
}
