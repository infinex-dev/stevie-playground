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
});
