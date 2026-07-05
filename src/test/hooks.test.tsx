import { describe, it, expect, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast, toast } from "@/hooks/use-toast";

const setInnerWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe("useIsMobile", () => {
  afterEach(() => setInnerWidth(1024));

  it("returns false on desktop widths", () => {
    setInnerWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true below the 768px breakpoint", () => {
    setInnerWidth(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});

describe("useToast", () => {
  it("adds a toast and exposes it in state", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      toast({ title: "Saved to watchlist" });
    });
    expect(result.current.toasts.some((t) => t.title === "Saved to watchlist")).toBe(true);
  });

  it("enforces the toast limit of one visible toast", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      toast({ title: "first" });
      toast({ title: "second" });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("second");
  });

  it("dismisses a toast (marks it closed)", () => {
    const { result } = renderHook(() => useToast());
    let id = "";
    act(() => {
      id = toast({ title: "to dismiss" }).id;
    });
    act(() => {
      result.current.dismiss(id);
    });
    const dismissed = result.current.toasts.find((t) => t.id === id);
    expect(dismissed?.open).toBe(false);
  });
});
