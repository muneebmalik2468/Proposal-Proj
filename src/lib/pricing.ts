export const PRO_PRICE_USD = 1.5;

export function pkrMonthlyPriceFromRate(pkrPerUsd: number) {
  return Math.round(PRO_PRICE_USD * pkrPerUsd);
}

