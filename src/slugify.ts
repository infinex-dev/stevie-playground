import { LocaleOptions } from "./locale.ts";

export function slugify(input: string, options?: LocaleOptions): string {
  const locale = options?.locale;
  const lowercased = locale === "tr-TR" 
    ? input.toLocaleLowerCase("tr-TR") 
    : input.toLowerCase();
  
  return lowercased
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
