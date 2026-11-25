import { sharkCabin } from "@/content/byd-profiles";
import type { Locale } from "@/lib/i18n";
import { BydSharkViewer } from "./BydSharkViewer";

const assets = "/byd-shark-6";

export function BydSharkDetails({ locale }: { locale: Locale }) {
  const mn = locale === "mn";

  return <>
    <nav className="byd-profile__nav byd-subnav" aria-label={mn ? "Загварын хэсгүүд" : "Model sections"}>
      <div className="byd-shell">
        <span className="byd-subnav__model" translate="no">BYD SHARK 6</span>
        <div className="byd-subnav__links">
          <a href="#byd-overview">{mn ? "Тойм" : "Overview"}</a>
          <a href="#byd-design">{mn ? "Дизайн" : "Design"}</a>
          <a href="#byd-technical">{mn ? "Үзүүлэлт" : "Specifications"}</a>
          <a href="#byd-contact">{mn ? "Холбоо барих" : "Contact"}</a>
        </div>
      </div>
    </nav>
    <section className="byd-overview byd-shell byd-section byd-shark-overview" id="byd-overview" aria-labelledby="byd-overview-heading">
      <figure className="byd-road-scene">
        <picture>
          <source media="(max-width: 48rem)" srcSet={`${assets}/family-mobile.webp`} width={780} height={347} />
          <img src={`${assets}/family.webp`} width={1500} height={667} loading="lazy" decoding="async"
            alt={mn ? "Далайн эрэг дээрх гурван BYD SHARK 6 пикап" : "Three BYD SHARK 6 pickups on a coastal headland"} />
        </picture>
      </figure>
      <div className="byd-intro">
        <h2 id="byd-overview-heading" translate="no"><span>BYD SHARK 6</span> Premium</h2>
        <p>{mn
          ? "1.5 литрийн турбо хөдөлгүүр, урд болон хойд цахилгаан мотортой цэнэглэдэг хосолмол пикап. 1,200 литрийн тэвштэй бөгөөд 2,500 кг хүртэлх тоормостой чиргүүл чирнэ."
          : "A plug-in hybrid pickup with a 1.5-litre turbo petrol engine and a motor on each axle. It has a 1,200-litre bed and can tow a braked trailer weighing up to 2,500 kg."}</p>
      </div>
      <div className="byd-hybrid-photos">
        <img src={`${assets}/exterior.webp`} width={1000} height={700} loading="lazy" decoding="async"
          alt={mn ? "Цэнхэр SHARK 6 Premium-ийн урд болон хажуу тал" : "Blue SHARK 6 Premium from the front three-quarter angle"} />
        <img src={`${assets}/outdoor.webp`} width={1500} height={544} loading="lazy" decoding="async"
          alt={mn ? "Нар жаргах үеэр шороон замаар явж буй SHARK 6" : "SHARK 6 travelling down a dirt road at sunset"} />
      </div>
      <div className="byd-feature">
        <h2>{mn ? "Хөдөлгүүр ба жолоодлого" : "Powertrain and driving"}</h2>
        <div className="byd-feature__grid">
          <figure className="byd-shark-architecture">
            <img src={`${assets}/architecture.webp`} width={900} height={450} loading="lazy" decoding="async"
              alt={mn ? "Явах эд ангид байрлах Blade Battery" : "Blade Battery integrated into the SHARK 6 chassis"} />
            <figcaption>
              <h3>{mn ? "DMO хосолмол систем" : "DMO hybrid system"}</h3>
              <p>{mn
                ? "29.58 кВт·ц Blade Battery-тай. Цахилгаан горимын туулах зай WLTP хэмжилтээр 85 км."
                : "The 29.58 kWh Blade Battery provides up to 85 km of electric range on the WLTP cycle."}</p>
            </figcaption>
          </figure>
          <figure>
            <img src={`${assets}/terrain.webp`} width={1200} height={435} loading="lazy" decoding="async"
              alt={mn ? "Чулуурхаг голын эрэг дээрх SHARK 6" : "SHARK 6 on a rocky riverbank"} />
            <figcaption>
              <h3>{mn ? "Бартаат замын горим" : "Off-road driving modes"}</h3>
              <p>{mn
                ? "Шавар, элс, цасанд тохирсон жолоодлогын горимтой. Уруу буух туслах систем хурдыг хянахад дэмжинэ."
                : "Choose a driving mode for mud, sand or snow. Hill descent control helps maintain a steady speed on steep descents."}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
    <section className="byd-design byd-shell byd-section byd-shark-design" id="byd-design" aria-labelledby="byd-design-heading">
      <h2 id="byd-design-heading">{mn ? "Дизайн ба тоноглол" : "Design and equipment"}</h2>
      <BydSharkViewer locale={locale} />
      <div className="byd-feature__grid">
        <figure>
          <img {...sharkCabin} loading="lazy" decoding="async"
            alt={mn ? "SHARK 6-ийн жолооны хүрд, төв дэлгэц, урд салон" : "SHARK 6 steering wheel, central display and front cabin"} />
          <figcaption>
            <h3>{mn ? "Салон ба төв дэлгэц" : "Cabin and centre display"}</h3>
            <p>{mn ? "15.6 инчийн эргэдэг дэлгэц, 12 чанга яригчтай Dynaudio систем, халаалт болон агааржуулалттай урд суудал." : "A 15.6-inch rotating display, 12-speaker Dynaudio audio, and heated and ventilated front seats."}</p>
          </figcaption>
        </figure>
        <figure>
          <img src={`${assets}/v2l.webp`} width={900} height={357} loading="lazy" decoding="async"
            alt={mn ? "SHARK 6 болон зөөврийн сууцтай аяллын буудал" : "A campsite with SHARK 6 and a camper trailer"} />
          <figcaption>
            <h3>{mn ? "V2L цахилгаан гаралт" : "V2L power outlet"}</h3>
            <p>{mn ? "Аяллаар явахдаа цахилгаан хэрэгслээ машины 220 В-ын залгуурт холбоод ашиглаж болно." : "The 220 V vehicle-to-load outlet can power compatible equipment at a campsite."}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  </>;
}
