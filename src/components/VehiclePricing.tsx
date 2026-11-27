import type { Phone } from "@/content/types";
import type { VehiclePrice } from "@/content/vehicle-prices";
import type { Locale } from "@/lib/i18n";
import { Icon } from "./Icon";
import "./vehicle-pricing.css";

type Props = {
  locale: Locale;
  phone: Phone;
  prices?: readonly VehiclePrice[];
  enquiryHref?: string;
};

export function VehiclePricing({ locale, phone, prices = [], enquiryHref }: Props) {
  const mn = locale === "mn";
  const number = new Intl.NumberFormat(mn ? "mn-MN" : "en", { maximumFractionDigits: 0 });

  return (
    <section className="vehicle-pricing" aria-labelledby="vehicle-pricing-heading">
      <div className="container vehicle-pricing__inner">
        <div className="vehicle-pricing__details">
          <h2 id="vehicle-pricing-heading">{mn ? "Үнэ ба бэлэн байдал" : "Price and availability"}</h2>
          {prices.length ? (
            <dl className="vehicle-pricing__prices">
              {prices.map(({ amountMnt, trim, startingAt }) => (
                <div key={trim?.en ?? "base-price"}>
                  <dt>{trim?.[locale] ?? (mn ? "Борлуулах үнэ" : "Sale price")}</dt>
                  <dd>
                    {startingAt && <span>{mn ? "Эхлэх үнэ" : "From"}</span>}
                    <data value={amountMnt}>{number.format(amountMnt)}&nbsp;₮</data>
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p>{mn ? "Одоогийн үнэ, нөөцийг борлуулалтын зөвлөхөөс лавлаарай." : "Ask our sales team for current pricing and stock."}</p>
          )}
        </div>
        <div className="vehicle-pricing__actions">
          <a className="button button--primary" href={enquiryHref ?? phone.href}>
            {mn ? "Үнэ лавлах" : "Enquire about price"}
            <Icon name={enquiryHref ? "arrowRight" : "phone"} size={17} />
          </a>
          {enquiryHref ? (
            <a className="vehicle-pricing__phone" href={phone.href}><Icon name="phone" size={16} />{phone.display}</a>
          ) : <span className="vehicle-pricing__phone">{phone.display}</span>}
        </div>
      </div>
    </section>
  );
}
