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
