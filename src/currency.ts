import { LocaleOptions } from "./locale.ts";

export function formatCurrency(amount: number, code: string, options?: LocaleOptions): string {
  const locale = options?.locale;
  
  if (locale === 'de-DE') {
    // German format: thousand separator '.', decimal separator ','
    const fixed = amount.toFixed(2);
    const [intPart, decPart] = fixed.split('.');
    // Add thousand separators (.)
    const formattedInt = intPart!.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${code.toUpperCase()} ${formattedInt},${decPart}`;
  }
  
  // Default behavior
  return `${code.toUpperCase()} ${amount.toFixed(2)}`;
}

export function parseCurrency(input: string, options?: LocaleOptions): { amount: number; code: string } {
  const locale = options?.locale;
  
  if (locale === 'de-DE') {
    // German format: thousand separator '.', decimal separator ','
    const match = input.trim().match(/^([A-Za-z]{3})\s+(-?[\d.]+,\d{2})$/);
    if (!match) {
      throw new Error(`invalid currency string: ${input}`);
    }
    // Convert German format to number: remove '.', replace ',' with '.'
    const amountStr = match[2]!.replace(/\./g, '').replace(',', '.');
    return { code: match[1]!.toUpperCase(), amount: Number(amountStr) };
  }
  
  // Default behavior
  const match = input.trim().match(/^([A-Za-z]{3})\s+(-?\d+(?:\.\d+)?)$/);
  if (!match) {
    throw new Error(`invalid currency string: ${input}`);
  }
  return { code: match[1]!.toUpperCase(), amount: Number(match[2]) };
}
