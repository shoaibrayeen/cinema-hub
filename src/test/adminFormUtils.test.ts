import { describe, it, expect } from "vitest";
import { resolveLanguage } from "@/lib/adminFormUtils";

describe("resolveLanguage", () => {
  it("returns the plain language as-is when not 'Other'", () => {
    expect(resolveLanguage("Hindi", undefined)).toBe("Hindi");
  });

  it("returns the trimmed new-language name when 'Other' is selected", () => {
    expect(resolveLanguage("__other__", "  Klingon  ")).toBe("Klingon");
  });

  it("falls back to an empty string when 'Other' is selected but no new name is given", () => {
    expect(resolveLanguage("__other__", undefined)).toBe("");
  });
});
