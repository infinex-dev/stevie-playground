import { describe, expect, test } from "vitest";
import { ratesRequest } from "./rates.ts";

const config = { url: "https://rates.test", api_key: "super-secret-key" };

describe("ratesRequest", () => {
  test("builds the rates URL for an uppercased code", () => {
    expect(ratesRequest(config, "usd").url).toBe("https://rates.test/rates/USD");
  });

  test("sends the key as a bearer token", () => {
    expect(ratesRequest(config, "usd").headers.get("authorization")).toBe("Bearer super-secret-key");
  });
});
