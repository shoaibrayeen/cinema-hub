import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (class merge helper)", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    const inactive = false;
    expect(cn("a", inactive && "b", undefined, null, "c")).toBe("a c");
  });

  it("lets the last conflicting tailwind class win", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional objects and arrays", () => {
    expect(cn(["a", { b: true, c: false }])).toBe("a b");
  });
});
