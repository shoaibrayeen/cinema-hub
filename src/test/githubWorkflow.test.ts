import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  isGithubConnected,
  getGithubToken,
  saveGithubToken,
  clearGithubToken,
  triggerAddMediaWorkflow,
  getKnownLanguageKeys,
  findDuplicateEntry,
} from "@/lib/githubWorkflow";
import { LANGUAGES } from "@/data/mediaData";

describe("github token storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is disconnected by default", () => {
    expect(isGithubConnected()).toBe(false);
    expect(getGithubToken()).toBeNull();
  });

  it("persists across save/clear", () => {
    saveGithubToken("test-token");
    expect(isGithubConnected()).toBe(true);
    expect(getGithubToken()).toBe("test-token");
    clearGithubToken();
    expect(isGithubConnected()).toBe(false);
    expect(getGithubToken()).toBeNull();
  });

  it("fails closed when localStorage.getItem throws", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(isGithubConnected()).toBe(false);
    expect(getGithubToken()).toBeNull();
    spy.mockRestore();
  });

  it("does not throw when localStorage.setItem fails", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(() => saveGithubToken("x")).not.toThrow();
    spy.mockRestore();
  });

  it("does not throw when localStorage.removeItem fails", () => {
    const spy = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(() => clearGithubToken()).not.toThrow();
    spy.mockRestore();
  });
});

describe("getKnownLanguageKeys", () => {
  it("includes every LANGUAGES entry", () => {
    const keys = getKnownLanguageKeys("moviesData");
    for (const lang of LANGUAGES) {
      expect(keys).toContain(lang);
    }
  });

  it("dedupes and includes ad-hoc catalog keys not in LANGUAGES", () => {
    const keys = getKnownLanguageKeys("moviesData");
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("also works against tvShowsData", () => {
    const keys = getKnownLanguageKeys("tvShowsData");
    for (const lang of LANGUAGES) {
      expect(keys).toContain(lang);
    }
  });
});

describe("findDuplicateEntry", () => {
  it("finds a known movie under its language, case-insensitively", () => {
    expect(findDuplicateEntry("moviesData", "Hindi", "pathaan")).toBe(true);
  });

  it("returns false for a name that doesn't exist", () => {
    expect(findDuplicateEntry("moviesData", "Hindi", "Not A Real Movie Title")).toBe(false);
  });

  it("returns false for a language with no catalog entries", () => {
    expect(findDuplicateEntry("tvShowsData", "Norwegian", "Anything")).toBe(false);
  });

  it("finds a known TV show under its language", () => {
    expect(findDuplicateEntry("tvShowsData", "English", "Breaking Bad")).toBe(true);
  });
});

describe("triggerAddMediaWorkflow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts to the correct workflow_dispatch endpoint with expected headers/body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 204 });
    vi.stubGlobal("fetch", fetchMock);

    await triggerAddMediaWorkflow("test-token", { mediaType: "movie", name: "Test" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/shoaibrayeen/cinema-hub/actions/workflows/add-media.yml/dispatches",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        }),
        body: JSON.stringify({ ref: "master", inputs: { mediaType: "movie", name: "Test" } }),
      }),
    );
  });

  it("throws with the response status and message on a non-204 response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 401,
      json: async () => ({ message: "Bad credentials" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(triggerAddMediaWorkflow("bad-token", { mediaType: "movie" })).rejects.toThrow(
      "GitHub workflow trigger failed (401): Bad credentials",
    );
  });

  it("still throws a useful error when the response body isn't JSON", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 500,
      json: async () => {
        throw new Error("not json");
      },
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(triggerAddMediaWorkflow("token", { mediaType: "movie" })).rejects.toThrow(
      "GitHub workflow trigger failed (500)",
    );
  });
});
