import { describe, it, expect } from "vitest";
import { parseYear } from "@/lib/tvShowUtils";

describe("parseYear", () => {
  it("extracts the leading 4-digit year", () => {
    expect(parseYear("2021-Present")).toBe(2021);
    expect(parseYear("2019-2020")).toBe(2019);
  });

  it("falls back to 0 when there's no leading 4-digit year", () => {
    expect(parseYear("Present")).toBe(0);
  });
});
