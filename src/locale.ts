/**
 * Shared locale options for formatting utilities.
 * Used across all domain modules for locale-aware behavior.
 */
export interface LocaleOptions {
  /**
   * BCP 47 language tag (e.g., "en-US", "de-DE").
   * When not provided, the default locale of the runtime environment is used.
   */
  locale?: string;
}
