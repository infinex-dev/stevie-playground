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
