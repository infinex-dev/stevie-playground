import { describe, expect, test } from "vitest";
import { formatBytes, parseBytes } from "./bytes.ts";

describe("formatBytes", () => {
  test("formats sub-1000 as raw B", () => {
    expect(formatBytes(500)).toBe("500 B");
  });

  test("formats decimal MB at 1.5x", () => {
    expect(formatBytes(1_500_000)).toBe("1.5 MB");
  });

  test("scales up to GB", () => {
    expect(formatBytes(2_000_000_000)).toBe("2 GB");
  });

  test("throws on negative input", () => {
    expect(() => formatBytes(-1)).toThrow();
  });
});

describe("parseBytes", () => {
  test("round-trips MB", () => {
    expect(parseBytes("1.5 MB")).toBe(1_500_000);
  });

  test("round-trips bare bytes", () => {
    expect(parseBytes("500 B")).toBe(500);
  });

  test("throws on malformed input", () => {
    expect(() => parseBytes("foo")).toThrow();
  });
});

describe("German locale (de-DE)", () => {
  test("formatBytes uses comma as decimal separator for de-DE", () => {
    expect(formatBytes(1_500_000, { locale: "de-DE" })).toBe("1,5 MB");
  });

  test("parseBytes is locale-tolerant and parses comma decimal", () => {
    // Both comma and dot decimal separators should parse to the same value
    expect(parseBytes("1,5 MB")).toBe(1_500_000);
    expect(parseBytes("1.5 MB")).toBe(1_500_000);
    expect(parseBytes("1,5 MB", { locale: "de-DE" })).toBe(1_500_000);
    expect(parseBytes("1.5 MB", { locale: "de-DE" })).toBe(1_500_000);
  });

  test("formatBytes differs between default and de-DE locale", () => {
    const defaultFormatted = formatBytes(1_500_000);
    const germanFormatted = formatBytes(1_500_000, { locale: "de-DE" });
    expect(defaultFormatted).toBe("1.5 MB");
    expect(germanFormatted).toBe("1,5 MB");
    expect(defaultFormatted).not.toBe(germanFormatted);
  });
});
