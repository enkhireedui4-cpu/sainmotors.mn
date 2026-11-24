import { Icon } from "@/components/Icon";
import type { Locale } from "@/lib/i18n";

export function BydBladeBattery({ locale }: { locale: Locale }) {
  const mn = locale === "mn";

  return <section className="byd-shell byd-battery" id="byd-blade-battery" aria-labelledby="byd-blade-battery-heading">
    <div className="byd-battery__intro">
      <h2 id="byd-blade-battery-heading" translate="no">BYD Blade Battery</h2>
      <p>{mn
        ? "TI 7-ийн 35.6 кВт·ц батарей нь урт, нарийн хэлбэртэй литийн төмөр фосфатын (LFP) элементүүдээс бүрдэнэ."
        : "The TI 7 uses a 35.6 kWh Blade Battery with long, slim lithium iron phosphate (LFP) cells."}</p>
    </div>
    <picture className="byd-battery__photo">
      <source media="(max-aspect-ratio: 4/5)" srcSet="/byd-ti-7/blade-battery-mobile.webp" width={900} height={506} />
      <img src="/byd-ti-7/blade-battery-desktop.webp" width={1920} height={1080}
        alt={mn ? "Доторх элементүүдийг харуулсан BYD Blade Battery" : "BYD Blade Battery pack with an exposed blade cell"}
        loading="lazy" decoding="async" />
    </picture>
    <details className="byd-battery__more">
      <summary><Icon name="plus" size={17} />{mn ? "Дэлгэрэнгүй үзэх" : "Find out more"}</summary>
      <p>{mn
        ? "Батарейг цэнэглээд өдөр тутам цахилгаан горимоор зорчиж болно. Холын замд 1.5 литрийн турбо хөдөлгүүр цахилгаан хөтлөгчтэй хослон ажиллана."
        : "Charge the battery for everyday electric driving. On longer trips, the 1.5-litre turbo engine works with the electric drive."}</p>
      <dl>
        <div><dt>{mn ? "Батарейн багтаамж" : "Battery capacity"}</dt><dd>{mn ? "35.6 кВт·ц" : "35.6 kWh"}</dd></div>
        <div><dt>{mn ? "Цахилгаанаар туулах зай" : "Electric range"}</dt><dd>{mn ? "130 км" : "130 km"}</dd></div>
      </dl>
    </details>
  </section>;
}
