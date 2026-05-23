import { LocaleOptions } from "./locale.ts";

const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

export function formatBytes(bytes: number, options?: LocaleOptions): string {
  if (bytes < 0) {
    throw new Error("bytes must be non-negative");
  }
  if (bytes < 1000) {
    return `${bytes} B`;
  }
  let value = bytes;
  let i = 0;
  while (value >= 1000 && i < UNITS.length - 1) {
    value /= 1000;
    i += 1;
  }
  const rounded = Math.round(value * 10) / 10;
  
  // Use German decimal separator (comma) for de-DE locale
  const useGermanLocale = options?.locale === "de-DE";
  const formattedValue = useGermanLocale
    ? String(rounded).replace(".", ",")
    : String(rounded);
  
  return `${formattedValue} ${UNITS[i]}`;
}

export function parseBytes(input: string, options?: LocaleOptions): number {
  // Normalize the input: replace comma with dot to handle both decimal separators
  const normalizedInput = input.trim().replace(",", ".");
  
  const match = normalizedInput.match(/^(\d+(?:\.\d+)?)\s*([KMGTP]?B)$/i);
  if (!match) {
    throw new Error(`invalid bytes string: ${input}`);
  }
  const value = Number(match[1]);
  const unit = match[2]!.toUpperCase() as (typeof UNITS)[number];
  const power = UNITS.indexOf(unit);
  return Math.round(value * Math.pow(1000, power));
}
