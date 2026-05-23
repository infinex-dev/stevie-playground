import { describe, expect, test } from "vitest";
import { formatCurrency, parseCurrency } from "./currency.ts";

describe("formatCurrency", () => {
  test("formats amount with two decimal places", () => {
    expect(formatCurrency(1234.56, "USD")).toBe("USD 1234.56");
  });

  test("uppercases the code", () => {
    expect(formatCurrency(10, "eur")).toBe("EUR 10.00");
  });
});

describe("parseCurrency", () => {
  test("round-trips a formatted currency", () => {
    expect(parseCurrency("USD 1234.56")).toEqual({ amount: 1234.56, code: "USD" });
  });

  test("throws on malformed input", () => {
    expect(() => parseCurrency("not a currency")).toThrow();
  });
});

describe("German locale (de-DE)", () => {
  const deOptions = { locale: 'de-DE' };

  test("formatCurrency uses German number formatting", () => {
    expect(formatCurrency(1234.56, "EUR", deOptions)).toBe("EUR 1.234,56");
  });

  test("formatCurrency differs from default for same input", () => {
    const amount = 1234.56;
    const code = "EUR";
    const defaultFormatted = formatCurrency(amount, code);
    const germanFormatted = formatCurrency(amount, code, deOptions);
    expect(defaultFormatted).not.toBe(germanFormatted);
  });

  test("round-trip with German locale", () => {
    const amount = 1234.56;
    const code = "EUR";
    const formatted = formatCurrency(amount, code, deOptions);
    const parsed = parseCurrency(formatted, deOptions);
    expect(parsed.amount).toBe(amount);
    expect(parsed.code).toBe(code);
  });

  test("round-trip with larger numbers", () => {
    const amount = 1234567.89;
    const code = "EUR";
    const formatted = formatCurrency(amount, code, deOptions);
    expect(formatted).toBe("EUR 1.234.567,89");
    const parsed = parseCurrency(formatted, deOptions);
    expect(parsed.amount).toBe(amount);
  });
});
