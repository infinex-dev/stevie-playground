import { LocaleOptions } from "./locale.ts";

export function formatCurrency(amount: number, code: string, options?: LocaleOptions): string {
  const locale = options?.locale;
  
  if (locale === 'de-DE') {
    // German formatting: thousand separator '.', decimal separator ','
    const parts = amount.toFixed(2).split('.');
    const integerPart = parts[0]!;
    const decimalPart = parts[1]!;
    
    // Add thousand separators
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${code.toUpperCase()} ${formattedInteger},${decimalPart}`;
  }
  
  // Default behavior (unchanged)
  return `${code.toUpperCase()} ${amount.toFixed(2)}`;
}

export function parseCurrency(input: string, options?: LocaleOptions): { amount: number; code: string } {
  const locale = options?.locale;
  
  if (locale === 'de-DE') {
    // German format: "EUR 1.234,56" -> thousand separator '.', decimal separator ','
    const match = input.trim().match(/^([A-Za-z]{3})\s+(-?[\d.]+,\d{2})$/);
    if (!match) {
      throw new Error(`invalid currency string: ${input}`);
    }
    // Convert German format to number: remove '.', replace ',' with '.'
    const numStr = match[2]!.replace(/\./g, '').replace(',', '.');
    return { code: match[1]!.toUpperCase(), amount: Number(numStr) };
  }
  
  // Default behavior (unchanged)
  const match = input.trim().match(/^([A-Za-z]{3})\s+(-?\d+(?:\.\d+)?)$/);
  if (!match) {
    throw new Error(`invalid currency string: ${input}`);
  }
  return { code: match[1]!.toUpperCase(), amount: Number(match[2]) };
}
