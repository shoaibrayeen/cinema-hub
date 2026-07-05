import { webcrypto } from "node:crypto";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  hashCredentials,
  verifyAdminCredentials,
  isAdminAuthed,
  setAdminAuthed,
  clearAdminAuthed,
} from "@/lib/adminAuth";

// jsdom implements crypto.getRandomValues but not crypto.subtle — polyfill with Node's webcrypto.
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
}

describe("hashCredentials", () => {
  it("produces a stable 64-char hex SHA-256 digest", async () => {
    const hash = await hashCredentials("shoaib", "msr1896");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).toBe(await hashCredentials("shoaib", "msr1896"));
  });

  it("changes when either input changes", async () => {
    const base = await hashCredentials("shoaib", "msr1896");
    expect(await hashCredentials("shoaib", "wrong")).not.toBe(base);
    expect(await hashCredentials("other", "msr1896")).not.toBe(base);
  });
});

describe("verifyAdminCredentials", () => {
  it("accepts the correct username/password", async () => {
    expect(await verifyAdminCredentials("shoaib", "msr1896")).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    expect(await verifyAdminCredentials("shoaib", "wrongpass")).toBe(false);
  });

  it("rejects an incorrect username", async () => {
    expect(await verifyAdminCredentials("admin", "msr1896")).toBe(false);
  });
});

describe("admin auth session flag", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is unauthenticated by default", () => {
    expect(isAdminAuthed()).toBe(false);
  });

  it("persists across setAdminAuthed/clearAdminAuthed", () => {
    setAdminAuthed();
    expect(isAdminAuthed()).toBe(true);
    clearAdminAuthed();
    expect(isAdminAuthed()).toBe(false);
  });

  it("fails closed when localStorage throws on read", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(isAdminAuthed()).toBe(false);
    spy.mockRestore();
  });

  it("does not throw when localStorage.setItem fails", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(() => setAdminAuthed()).not.toThrow();
    spy.mockRestore();
  });

  it("does not throw when localStorage.removeItem fails", () => {
    const spy = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(() => clearAdminAuthed()).not.toThrow();
    spy.mockRestore();
  });
});
