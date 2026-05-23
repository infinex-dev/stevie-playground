import { describe, expect, test } from "vitest";
import { slugify } from "./slugify.ts";

describe("slugify", () => {
  test("lowercases and hyphenates ASCII", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  test("strips diacritics", () => {
    expect(slugify("café crème")).toBe("cafe-creme");
  });

  test("collapses repeated non-alphanumerics", () => {
    expect(slugify("foo  bar__baz!!quux")).toBe("foo-bar-baz-quux");
  });

  test("trims leading and trailing hyphens", () => {
    expect(slugify("---hello---")).toBe("hello");
  });

  test("applies Turkish lowercasing rules with tr-TR locale", () => {
    // Turkish dotted uppercase İ should lowercase to i (not ı)
    expect(slugify("İSTANBUL", { locale: "tr-TR" })).toBe("istanbul");
  });

  test("default behavior unchanged with empty or unknown locale", () => {
    const input = "Hello World";
    expect(slugify(input, undefined)).toBe("hello-world");
    expect(slugify(input, {})).toBe("hello-world");
    expect(slugify(input, { locale: "" })).toBe("hello-world");
    expect(slugify(input, { locale: "xx-XX" })).toBe("hello-world");
  });
});
