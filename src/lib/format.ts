const localeByCurrency: Record<string, string> = {
  IDR: "id-ID",
  USD: "en-US",
  EUR: "en-GB",
};

export function formatPrice(minor: bigint, currency: string): string {
  const locale = localeByCurrency[currency] ?? "en-US";
  const value = Number(minor);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(value);
}
