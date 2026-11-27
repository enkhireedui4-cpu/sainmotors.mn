import type { Localized } from "@/lib/i18n";

export type VehiclePrice = {
  amountMnt: number;
  trim?: Localized;
  startingAt?: boolean;
};

export const relyR8Prices: readonly VehiclePrice[] = [
  { amountMnt: 69_900_000, trim: { mn: "2WD бензин", en: "2WD petrol" } },
  { amountMnt: 74_900_000, trim: { mn: "4WD бензин", en: "4WD petrol" } },
  { amountMnt: 84_900_000, trim: { mn: "2WD дизель", en: "2WD diesel" } },
  { amountMnt: 89_900_000, trim: { mn: "4WD дизель", en: "4WD diesel" } },
];
