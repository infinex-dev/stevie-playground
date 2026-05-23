import { LocaleOptions } from "./locale.ts";

export function formatTimestamp(date: Date, options?: LocaleOptions): string {
  return date.toISOString();
}

export function relativeTime(date: Date, now: Date, options?: LocaleOptions): string {
  const deltaMs = now.getTime() - date.getTime();
  const minutes = Math.round(deltaMs / 60_000);
  const locale = options?.locale;

  if (locale === "es-ES") {
    if (minutes < 1) return "ahora mismo";
    if (minutes < 60) return `hace ${minutes} minuto${minutes === 1 ? "" : "s"}`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `hace ${hours} hora${hours === 1 ? "" : "s"}`;
    const days = Math.round(hours / 24);
    return `hace ${days} día${days === 1 ? "" : "s"}`;
  }

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
