import { BrandLink } from "./BrandLink";
import type { CSSProperties } from "react";
import { getBrands } from "@/content";
import type { Locale } from "@/lib/i18n";
import { BrandMark } from "./BrandMark";
import { BrandMarquee } from "./BrandMarquee";
export function HomeBrandStrip({locale}:{locale:Locale}) {
 const brands=getBrands();
 return <BrandMarquee count={brands.length} labels={locale==="mn"?{region:"Манай брэндүүд",help:"Энэ мөрөн дээр Space дарж хөдөлгөөнийг түр зогсоох эсвэл үргэлжлүүлнэ. Брэнд рүү орохын тулд Tab, Enter ашиглана."}:{region:"Our brands",help:"Press Space on this strip to pause or resume motion. Use Tab and Enter to visit a brand."}}>
  <ul className="brand-panel" data-brand-directory>{brands.map((brand,index)=><li key={brand.slug} style={{"--brand-index":index} as CSSProperties}>
   <BrandLink locale={locale} slug={brand.slug} prefetch={false} aria-label={brand.name} title={brand.name}><BrandMark brand={brand} locale={locale} decorative lazy={false}/></BrandLink>
  </li>)}</ul>
 </BrandMarquee>;
}
