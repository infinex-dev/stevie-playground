/**
 * Options for locale-aware formatting.
 * The locale field accepts BCP 47 language tags (e.g., "en-US", "de-DE").
 */
export interface LocaleOptions {
  /**
   * BCP 47 language tag (e.g., "en-US", "de-DE").
   * When omitted, the system default locale is typically used.
   */
  locale?: string;
}
