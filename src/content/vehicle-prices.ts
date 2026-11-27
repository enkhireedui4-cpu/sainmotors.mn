import type { Localized } from "@/lib/i18n";

type VehiclePriceModel = "ti-7" | "atto-3" | "shark-6" | "sealion-6" | "rely-r8";

export type VehiclePrice = {
  amountMnt: number;
  trim?: Localized;
  startingAt?: boolean;
};

// Sain Motors sales price list supplied for the developed model pages.
export const vehiclePrices: Partial<Record<VehiclePriceModel, readonly VehiclePrice[]>> = {
  "ti-7": [{ amountMnt: 159_900_000, trim: { mn: "DMO", en: "DMO" } }],
  "atto-3": [{ amountMnt: 128_900_000, trim: { mn: "DiLink", en: "DiLink" } }],
  "shark-6": [{ amountMnt: 159_900_000, trim: { mn: "DMO", en: "DMO" } }],
  "sealion-6": [{ amountMnt: 127_900_000, trim: { mn: "SONG Plus DM-i", en: "SONG Plus DM-i" } }],
  "rely-r8": [
    { amountMnt: 69_900_000, trim: { mn: "2WD бензин", en: "2WD petrol" } },
    { amountMnt: 74_900_000, trim: { mn: "4WD бензин", en: "4WD petrol" } },
    { amountMnt: 84_900_000, trim: { mn: "2WD дизель", en: "2WD diesel" } },
    { amountMnt: 89_900_000, trim: { mn: "4WD дизель", en: "4WD diesel" } },
  ],
};
