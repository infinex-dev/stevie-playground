import { LocaleOptions } from "./locale.ts";

export function slugify(input: string, options?: LocaleOptions): string {
  const locale = options?.locale || undefined;
  return input
    .toLocaleLowerCase(locale)
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
