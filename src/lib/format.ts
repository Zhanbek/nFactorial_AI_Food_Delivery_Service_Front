export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export const PRICE_LEVEL_LABEL: Record<1 | 2 | 3, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
};
