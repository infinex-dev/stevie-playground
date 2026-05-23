import type { LocaleOptions } from "./locale.ts";

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
  const locale = options?.locale;
  if (locale === "de-DE") {
    // German locale: use comma as decimal separator
    const formatted = rounded.toString().replace(".", ",");
    return `${formatted} ${UNITS[i]}`;
  }
  return `${rounded} ${UNITS[i]}`;
}

export function parseBytes(input: string, options?: LocaleOptions): number {
  // Locale-tolerant: accept both '.' and ',' as decimal separators
  const normalized = input.trim().replace(",", ".");
  const match = normalized.match(/^(\d+(?:\.\d+)?)\s*([KMGTP]?B)$/i);
  if (!match) {
    throw new Error(`invalid bytes string: ${input}`);
  }
  const value = Number(match[1]);
  const unit = match[2]!.toUpperCase() as (typeof UNITS)[number];
  const power = UNITS.indexOf(unit);
  return Math.round(value * Math.pow(1000, power));
}
