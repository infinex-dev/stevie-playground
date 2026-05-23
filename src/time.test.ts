import { describe, expect, test } from "vitest";
import { formatTimestamp, relativeTime } from "./time.ts";

describe("formatTimestamp", () => {
  test("produces an ISO 8601 string", () => {
    expect(formatTimestamp(new Date("2026-05-23T12:00:00Z"))).toBe("2026-05-23T12:00:00.000Z");
  });
});

describe("relativeTime", () => {
  const now = new Date("2026-05-23T12:00:00Z");

  test("returns 'just now' for sub-minute deltas", () => {
    expect(relativeTime(new Date(now.getTime() - 10_000), now)).toBe("just now");
  });

  test("returns minutes for sub-hour deltas", () => {
    expect(relativeTime(new Date(now.getTime() - 5 * 60_000), now)).toBe("5 minutes ago");
  });

  test("returns hours for sub-day deltas", () => {
    expect(relativeTime(new Date(now.getTime() - 3 * 60 * 60_000), now)).toBe("3 hours ago");
  });

  test("returns days for longer deltas", () => {
    expect(relativeTime(new Date(now.getTime() - 2 * 24 * 60 * 60_000), now)).toBe("2 days ago");
  });
});
