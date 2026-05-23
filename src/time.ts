import { LocaleOptions } from "./locale.ts";

export function formatTimestamp(date: Date, options?: LocaleOptions): string {
  return date.toISOString();
}

export function relativeTime(date: Date, now: Date, options?: LocaleOptions): string {
  const deltaMs = now.getTime() - date.getTime();
  const minutes = Math.round(deltaMs / 60_000);
  
  const isSpanish = options?.locale === "es-ES";
  
  if (minutes < 1) {
    return isSpanish ? "ahora mismo" : "just now";
  }
  if (minutes < 60) {
    if (isSpanish) {
      return `hace ${minutes} minuto${minutes === 1 ? "" : "s"}`;
    }
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    if (isSpanish) {
      return `hace ${hours} hora${hours === 1 ? "" : "s"}`;
    }
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.round(hours / 24);
  if (isSpanish) {
    return `hace ${days} día${days === 1 ? "" : "s"}`;
  }
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
