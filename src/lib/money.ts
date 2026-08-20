/**
 * Paddle stores money as an integer in the currency's minor unit — 10000 is
 * $100.00, 999 is $9.99. Not every currency has two decimal places, though:
 * JPY, KRW and CLP are zero-decimal, so 1000 is ¥1000, not ¥10.00. Dividing
 * by 100 unconditionally would be wrong for those.
 *
 * Intl knows each currency's exponent, so we ask it rather than hardcoding.
 */
export function formatMoney(minorUnits: string | number, currencyCode: string): string {
  const value = Number(minorUnits);
  if (!Number.isFinite(value)) return String(minorUnits);

  let formatter: Intl.NumberFormat;
  try {
    formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode });
  } catch {
    // Unknown currency code — better to show the raw number than to throw
    // inside a webhook and lose the notification.
    return String(minorUnits);
  }

  const decimals = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return formatter.format(value / 10 ** decimals);
}
