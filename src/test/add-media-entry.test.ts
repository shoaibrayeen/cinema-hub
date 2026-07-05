import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it, expect, vi } from "vitest";
import {
  MEDIA_DATA_PATH,
  escapeRegExp,
  isValidIdentifier,
  parseGenre,
  serializeMovieLine,
  serializeTVShowLine,
  insertEntryIntoSource,
  buildUpdatedSource,
  main,
} from "../../scripts/add-media-entry.mjs";

const SCRIPT_PATH = resolve(process.cwd(), "scripts/add-media-entry.mjs");

describe("escapeRegExp / isValidIdentifier", () => {
  it("escapes regex special characters", () => {
    expect(escapeRegExp("Sci-Fi+")).toBe("Sci-Fi\\+");
    expect(escapeRegExp("A.B*C?")).toBe("A\\.B\\*C\\?");
  });

  it("treats plain words as valid identifiers", () => {
    expect(isValidIdentifier("Hindi")).toBe(true);
    expect(isValidIdentifier("Hong Kong")).toBe(false);
    expect(isValidIdentifier("2Fast")).toBe(false);
  });
});

describe("parseGenre", () => {
  it("splits, trims, and drops empty segments", () => {
    expect(parseGenre("Action, Drama ,  , Thriller")).toEqual(["Action", "Drama", "Thriller"]);
  });

  it("throws when nothing usable remains", () => {
    expect(() => parseGenre(" , ,")).toThrow(/at least one/);
  });
});

describe("serializeMovieLine / serializeTVShowLine", () => {
  it("builds a single-line movie entry with quoted strings and a trailing comma", () => {
    const line = serializeMovieLine({
      name: "Test Movie",
      genre: ["Action", "Drama"],
      year: 2026,
      playtime: "2h 00m",
      language: "Hindi",
      platform: "Netflix",
      status: "Watched",
    });
    expect(line).toBe(
      '    { name: "Test Movie", genre: ["Action", "Drama"], year: 2026, playtime: "2h 00m", language: "Hindi", platform: "Netflix", status: "Watched" },',
    );
  });

  it("omits platform/status when not provided", () => {
    const line = serializeMovieLine({
      name: "Test Movie",
      genre: ["Drama"],
      year: 2026,
      playtime: "2h 00m",
      language: "Hindi",
    });
    expect(line).not.toContain("platform");
    expect(line).not.toContain("status");
  });

  it("safely handles quotes inside a title", () => {
    const line = serializeMovieLine({
      name: 'He said "hi"',
      genre: ["Drama"],
      year: 2026,
      playtime: "2h 00m",
      language: "Hindi",
    });
    expect(line).toContain(JSON.stringify('He said "hi"'));
  });

  it("builds a single-line TV show entry", () => {
    const line = serializeTVShowLine({
      name: "Test Show",
      genre: ["Drama"],
      yearRange: "2024-Present",
      seasons: 2,
      language: "English",
    });
    expect(line).toBe('    { name: "Test Show", genre: ["Drama"], yearRange: "2024-Present", seasons: 2, language: "English" },');
  });

  it("includes platform/status in a TV show entry when provided", () => {
    const line = serializeTVShowLine({
      name: "Test Show",
      genre: ["Drama"],
      yearRange: "2024-Present",
      seasons: 2,
      language: "English",
      platform: "Netflix",
      status: "Watching",
    });
    expect(line).toContain('platform: "Netflix"');
    expect(line).toContain('status: "Watching"');
  });
});

describe("insertEntryIntoSource against the real mediaData.ts", () => {
  const rawSource = readFileSync(MEDIA_DATA_PATH, "utf8");

  it("inserts a new movie as the first element of an existing language array, changing nothing else", () => {
    const entryLine = serializeMovieLine({
      name: "Splice Test Movie",
      genre: ["Action"],
      year: 2026,
      playtime: "1h 30m",
      language: "Hindi",
    });
    const updated = insertEntryIntoSource(rawSource, "moviesData", "Hindi", entryLine);

    const before = rawSource.split("\n");
    const after = updated.split("\n");
    expect(after.length).toBe(before.length + 1);
    expect(after).toContain(entryLine);
    // Every other line is untouched, including the hand-written section comments.
    expect(updated).toContain("// --- Social Drama & Classics ---");
    const withoutInserted = after.filter((line) => line !== entryLine).join("\n");
    expect(withoutInserted).toBe(rawSource);
  });

  it("creates a brand-new language block before the object's closing brace when the key doesn't exist", () => {
    const entryLine = serializeMovieLine({
      name: "New Language Movie",
      genre: ["Drama"],
      year: 2025,
      playtime: "2h 00m",
      language: "Klingon",
    });
    const updated = insertEntryIntoSource(rawSource, "moviesData", "Klingon", entryLine);
    expect(updated).toContain("Klingon: [\n" + entryLine + "\n  ],");
  });

  it("inserts a comma after the previously-last key when it didn't already end with one", () => {
    // Regression test: the file's existing last key doesn't always have a trailing
    // comma before the closing "};" — a new key must not get concatenated onto it
    // without a separating comma (that produced a real syntax error once).
    const noTrailingComma = 'export const moviesData = {\n  Hindi: [\n    { name: "X" }\n  ]\n};\n\nexport const tvShowsData';
    const entryLine = serializeMovieLine({ name: "New Movie", genre: ["Drama"], year: 2025, playtime: "2h 00m", language: "Klingon" });
    const updated = insertEntryIntoSource(noTrailingComma, "moviesData", "Klingon", entryLine);
    expect(updated).toContain('  ],\n  Klingon: [');
    expect(updated).not.toMatch(/\]\s*\n\s*Klingon/); // the old buggy shape: "]" directly followed by the new key, no comma
  });

  it("does not duplicate the comma when the previously-last key already ends with one", () => {
    const withTrailingComma = 'export const moviesData = {\n  Hindi: [\n    { name: "X" }\n  ],\n};\n\nexport const tvShowsData';
    const entryLine = serializeMovieLine({ name: "New Movie", genre: ["Drama"], year: 2025, playtime: "2h 00m", language: "Klingon" });
    const updated = insertEntryIntoSource(withTrailingComma, "moviesData", "Klingon", entryLine);
    expect(updated).not.toContain(",,");
    expect(updated).toContain('  ],\n  Klingon: [');
  });

  it("quotes a new language key that isn't a valid bare identifier", () => {
    const entryLine = serializeMovieLine({
      name: "Multi Word Lang Movie",
      genre: ["Drama"],
      year: 2025,
      playtime: "2h 00m",
      language: "Hong Kong",
    });
    const updated = insertEntryIntoSource(rawSource, "moviesData", "Hong Kong", entryLine);
    expect(updated).toContain('"Hong Kong": [');
  });

  it("splices into tvShowsData independently of moviesData", () => {
    const entryLine = serializeTVShowLine({
      name: "Splice Test Show",
      genre: ["Drama"],
      yearRange: "2026",
      seasons: 1,
      language: "English",
    });
    const updated = insertEntryIntoSource(rawSource, "tvShowsData", "English", entryLine);
    expect(updated).toContain(entryLine);
    expect(updated).toContain("export const moviesData"); // moviesData block still present, unmodified
  });

  it("throws a descriptive error when the target object's start marker is missing", () => {
    expect(() => insertEntryIntoSource("no markers here", "moviesData", "Hindi", "x")).toThrow(/could not locate/);
  });

  it("throws a descriptive error when the end marker is missing", () => {
    const truncated = "export const moviesData = {\n  Hindi: [\n  ]\n};\n"; // no "export const tvShowsData" after it
    expect(() => insertEntryIntoSource(truncated, "moviesData", "Hindi", "x")).toThrow(/could not locate "export const tvShowsData"/);
  });

  it("throws a descriptive error when a new-language block has no closing brace to insert before", () => {
    const noClosingBrace = "export const moviesData = {\n  Hindi: [\n  ]\nexport const tvShowsData = {};\n// Helper functions\n";
    expect(() => insertEntryIntoSource(noClosingBrace, "moviesData", "NewLang", "x")).toThrow(/could not locate closing/);
  });
});

describe("buildUpdatedSource", () => {
  const rawSource = readFileSync(MEDIA_DATA_PATH, "utf8");

  it("builds a movie entry end-to-end from env-shaped input", () => {
    const { updatedSource, dataObjectName, name } = buildUpdatedSource(rawSource, {
      MEDIA_TYPE: "movie",
      MEDIA_NAME: "Env Test Movie",
      MEDIA_GENRE: "Action, Test",
      MEDIA_LANGUAGE: "Hindi",
      MEDIA_YEAR: "2026",
      MEDIA_PLAYTIME: "1h 30m",
      MEDIA_PLATFORM: "Netflix",
      MEDIA_STATUS: "Watched",
    });
    expect(dataObjectName).toBe("moviesData");
    expect(name).toBe("Env Test Movie");
    expect(updatedSource).toContain('"Env Test Movie"');
  });

  it("builds a TV show entry end-to-end from env-shaped input", () => {
    const { updatedSource, dataObjectName, name } = buildUpdatedSource(rawSource, {
      MEDIA_TYPE: "tvshow",
      MEDIA_NAME: "Env Test Show",
      MEDIA_GENRE: "Drama",
      MEDIA_LANGUAGE: "English",
      MEDIA_YEAR_RANGE: "2026",
      MEDIA_SEASONS: "1",
    });
    expect(dataObjectName).toBe("tvShowsData");
    expect(name).toBe("Env Test Show");
    expect(updatedSource).toContain('"Env Test Show"');
  });

  it("rejects a movie missing year/playtime", () => {
    expect(() =>
      buildUpdatedSource(rawSource, {
        MEDIA_TYPE: "movie",
        MEDIA_NAME: "Bad Movie",
        MEDIA_GENRE: "Drama",
        MEDIA_LANGUAGE: "Hindi",
      }),
    ).toThrow(/requires numeric year/);
  });

  it("rejects a tvshow missing seasons/yearRange", () => {
    expect(() =>
      buildUpdatedSource(rawSource, {
        MEDIA_TYPE: "tvshow",
        MEDIA_NAME: "Bad Show",
        MEDIA_GENRE: "Drama",
        MEDIA_LANGUAGE: "English",
      }),
    ).toThrow(/requires numeric seasons/);
  });

  it("rejects an unknown mediaType", () => {
    expect(() =>
      buildUpdatedSource(rawSource, {
        MEDIA_TYPE: "documentary",
        MEDIA_NAME: "X",
        MEDIA_GENRE: "Drama",
        MEDIA_LANGUAGE: "Hindi",
      }),
    ).toThrow(/unknown mediaType/);
  });

  it("rejects missing required fields", () => {
    expect(() => buildUpdatedSource(rawSource, { MEDIA_TYPE: "movie" })).toThrow(/are required/);
  });
});

describe("main() (in-process, for coverage of the CLI wrapper's try/catch)", () => {
  const makeFixturePath = () => {
    const dir = mkdtempSync(join(tmpdir(), "add-media-main-"));
    mkdirSync(join(dir, "src", "data"), { recursive: true });
    const path = join(dir, "src", "data", "mediaData.ts");
    writeFileSync(
      path,
      "export const moviesData = {\n  Hindi: [\n  ]\n};\n\nexport const tvShowsData = {\n};\n\n// Helper functions\n",
    );
    return { dir, path };
  };

  it("writes the file and logs success on valid input", () => {
    const { dir, path } = makeFixturePath();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      main(path, {
        MEDIA_TYPE: "movie",
        MEDIA_NAME: "In-Process Test Movie",
        MEDIA_GENRE: "Drama",
        MEDIA_LANGUAGE: "Hindi",
        MEDIA_YEAR: "2026",
        MEDIA_PLAYTIME: "1h 30m",
      });
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('inserted "In-Process Test Movie"'));
      expect(readFileSync(path, "utf8")).toContain("In-Process Test Movie");
    } finally {
      logSpy.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("logs an error and exits 1 on invalid input, without writing the file", () => {
    const { dir, path } = makeFixturePath();
    const original = readFileSync(path, "utf8");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    try {
      main(path, { MEDIA_TYPE: "movie" });
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("are required"));
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSync(path, "utf8")).toBe(original);
    } finally {
      errorSpy.mockRestore();
      exitSpy.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("CLI entry point (scripts/add-media-entry.mjs run directly)", () => {
  const makeFixtureDir = () => {
    const dir = mkdtempSync(join(tmpdir(), "add-media-cli-"));
    mkdirSync(join(dir, "src", "data"), { recursive: true });
    writeFileSync(
      join(dir, "src", "data", "mediaData.ts"),
      "export const moviesData = {\n  Hindi: [\n  ]\n};\n\nexport const tvShowsData = {\n};\n\n// Helper functions\n",
    );
    return dir;
  };

  it("writes the updated file and logs success when run as a script", () => {
    const dir = makeFixtureDir();
    try {
      const output = execFileSync(process.execPath, [SCRIPT_PATH], {
        cwd: dir,
        env: {
          ...process.env,
          MEDIA_TYPE: "movie",
          MEDIA_NAME: "CLI Test Movie",
          MEDIA_GENRE: "Drama",
          MEDIA_LANGUAGE: "Hindi",
          MEDIA_YEAR: "2026",
          MEDIA_PLAYTIME: "1h 30m",
        },
        encoding: "utf8",
      });
      expect(output).toContain('inserted "CLI Test Movie" into moviesData.Hindi');
      const updated = readFileSync(join(dir, "src", "data", "mediaData.ts"), "utf8");
      expect(updated).toContain("CLI Test Movie");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("exits non-zero and prints an error when required fields are missing", () => {
    const dir = makeFixtureDir();
    try {
      let caught: { status?: number; stderr?: string } | undefined;
      try {
        execFileSync(process.execPath, [SCRIPT_PATH], {
          cwd: dir,
          env: { ...process.env, MEDIA_TYPE: "movie" },
          encoding: "utf8",
        });
      } catch (error) {
        caught = error as { status?: number; stderr?: string };
      }
      expect(caught).toBeDefined();
      expect(caught?.status).toBe(1);
      expect(caught?.stderr).toContain("are required");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
