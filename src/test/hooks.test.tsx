import { describe, it, expect, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast, toast, reducer } from "@/hooks/use-toast";

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

  it("updates when the matchMedia change listener fires", () => {
    setInnerWidth(1024);
    let changeHandler: (() => void) | undefined;
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (_event: string, handler: () => void) => {
        changeHandler = handler;
      },
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    try {
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);

      setInnerWidth(500);
      act(() => {
        changeHandler?.();
      });
      expect(result.current).toBe(true);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
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

  it("actually removes a toast from state once the remove delay elapses", () => {
    vi.useFakeTimers();
    try {
      const { result } = renderHook(() => useToast());
      let id = "";
      act(() => {
        id = toast({ title: "will be removed" }).id;
      });
      act(() => {
        result.current.dismiss(id);
      });
      expect(result.current.toasts.find((t) => t.id === id)).toBeDefined();

      act(() => {
        vi.advanceTimersByTime(1_000_000);
      });
      expect(result.current.toasts.find((t) => t.id === id)).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it("updates a toast in place via the handle returned from toast()", () => {
    const { result } = renderHook(() => useToast());
    let id = "";
    act(() => {
      const handle = toast({ title: "original" });
      id = handle.id;
      handle.update({ id: handle.id, title: "updated" } as Parameters<typeof handle.update>[0]);
    });
    expect(result.current.toasts.find((t) => t.id === id)?.title).toBe("updated");
  });

  it("dismisses a toast when its onOpenChange callback fires with open=false", () => {
    const { result } = renderHook(() => useToast());
    let id = "";
    act(() => {
      id = toast({ title: "closable" }).id;
    });
    const created = result.current.toasts.find((t) => t.id === id);
    act(() => {
      created?.onOpenChange?.(false);
    });
    expect(result.current.toasts.find((t) => t.id === id)?.open).toBe(false);
  });
});

describe("toast reducer (direct unit tests, bypassing the TOAST_LIMIT=1 hook flow)", () => {
  const makeToast = (id: string, open = true) => ({ id, open }) as Parameters<typeof reducer>[0]["toasts"][number];

  it("UPDATE_TOAST merges fields into the matching toast only", () => {
    const state = { toasts: [makeToast("a"), makeToast("b")] };
    const next = reducer(state, { type: "UPDATE_TOAST", toast: { id: "b", open: false } });
    expect(next.toasts.find((t) => t.id === "b")?.open).toBe(false);
    expect(next.toasts.find((t) => t.id === "a")?.open).toBe(true);
  });

  it("DISMISS_TOAST with an id closes only that toast", () => {
    const state = { toasts: [makeToast("a"), makeToast("b")] };
    const next = reducer(state, { type: "DISMISS_TOAST", toastId: "a" });
    expect(next.toasts.find((t) => t.id === "a")?.open).toBe(false);
    expect(next.toasts.find((t) => t.id === "b")?.open).toBe(true);
  });

  it("DISMISS_TOAST with no id closes every toast", () => {
    const state = { toasts: [makeToast("a"), makeToast("b")] };
    const next = reducer(state, { type: "DISMISS_TOAST", toastId: undefined });
    expect(next.toasts.every((t) => t.open === false)).toBe(true);
  });

  it("REMOVE_TOAST with an id removes just that toast", () => {
    const state = { toasts: [makeToast("a"), makeToast("b")] };
    const next = reducer(state, { type: "REMOVE_TOAST", toastId: "a" });
    expect(next.toasts.map((t) => t.id)).toEqual(["b"]);
  });

  it("REMOVE_TOAST with no id clears all toasts", () => {
    const state = { toasts: [makeToast("a"), makeToast("b")] };
    const next = reducer(state, { type: "REMOVE_TOAST", toastId: undefined });
    expect(next.toasts).toEqual([]);
  });
});
