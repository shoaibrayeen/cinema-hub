// Splices one new Movie/TVShow entry into src/data/mediaData.ts.
//
// Runs inside the "Add Media" GitHub Actions workflow (triggered via workflow_dispatch
// from the site's hidden /admin page) — never in the browser. Reads its input from
// MEDIA_* env vars and rewrites the checked-out file on disk; peter-evans/create-pull-request
// then diffs the working tree and opens a PR.
//
// This does a surgical text splice rather than re-serializing the whole moviesData/tvShowsData
// object, specifically to preserve the hand-written "// --- Section --- " organizational
// comments inside mediaData.ts. The two-marker block-boundary approach below is coupled to
// the current file shape (unique "export const moviesData" / "export const tvShowsData" /
// "// Helper functions" markers) — if that structure changes, this needs revisiting.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const MEDIA_DATA_PATH = resolve(process.cwd(), "src/data/mediaData.ts");

export function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isValidIdentifier(str) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(str);
}

export function parseGenre(genreInput) {
  const genres = genreInput
    .split(",")
    .map((g) => g.trim())
    .filter((g) => g.length > 0);
  if (genres.length === 0) throw new Error("genre must contain at least one non-empty value");
  return genres;
}

export function serializeMovieLine({ name, genre, year, playtime, language, platform, status }) {
  const parts = [
    `name: ${JSON.stringify(name)}`,
    `genre: [${genre.map((g) => JSON.stringify(g)).join(", ")}]`,
    `year: ${year}`,
    `playtime: ${JSON.stringify(playtime)}`,
    `language: ${JSON.stringify(language)}`,
  ];
  if (platform) parts.push(`platform: ${JSON.stringify(platform)}`);
  if (status) parts.push(`status: ${JSON.stringify(status)}`);
  return `    { ${parts.join(", ")} },`;
}

export function serializeTVShowLine({ name, genre, yearRange, seasons, language, platform, status }) {
  const parts = [
    `name: ${JSON.stringify(name)}`,
    `genre: [${genre.map((g) => JSON.stringify(g)).join(", ")}]`,
    `yearRange: ${JSON.stringify(yearRange)}`,
    `seasons: ${seasons}`,
    `language: ${JSON.stringify(language)}`,
  ];
  if (platform) parts.push(`platform: ${JSON.stringify(platform)}`);
  if (status) parts.push(`status: ${JSON.stringify(status)}`);
  return `    { ${parts.join(", ")} },`;
}

export function locateBlock(rawSource, dataObjectName) {
  const startMarker = `export const ${dataObjectName}`;
  const start = rawSource.indexOf(startMarker);
  if (start === -1) throw new Error(`could not locate "${startMarker}" in mediaData.ts`);

  const endMarker = dataObjectName === "moviesData" ? "export const tvShowsData" : "// Helper functions";
  const end = rawSource.indexOf(endMarker, start);
  if (end === -1) throw new Error(`could not locate "${endMarker}" after ${startMarker} in mediaData.ts`);

  return { start, end };
}

export function insertEntryIntoSource(rawSource, dataObjectName, language, entryLine) {
  const { start, end } = locateBlock(rawSource, dataObjectName);
  const block = rawSource.slice(start, end);

  const keyPattern = new RegExp(`^  ${escapeRegExp(language)}: \\[`, "m");
  const match = block.match(keyPattern);

  if (match && match.index !== undefined) {
    const insertPos = start + match.index + match[0].length;
    return rawSource.slice(0, insertPos) + "\n" + entryLine + rawSource.slice(insertPos);
  }

  // Language key doesn't exist yet in this data object — add a brand new block
  // right before the object's closing "};".
  const closingPos = rawSource.lastIndexOf("\n};", end);
  if (closingPos === -1) throw new Error(`could not locate closing "};" for ${dataObjectName}`);

  // The previously-last key's closing "]" may or may not already have a trailing
  // comma (the file is inconsistent about this) — add one if it's missing, so the
  // new key doesn't get concatenated onto it without a separator.
  const beforeClosing = rawSource.slice(0, closingPos);
  const needsComma = !/,\s*$/.test(beforeClosing);

  const key = isValidIdentifier(language) ? language : JSON.stringify(language);
  const newBlock = `${needsComma ? "," : ""}\n  ${key}: [\n${entryLine}\n  ],`;
  return beforeClosing + newBlock + rawSource.slice(closingPos);
}

export function buildUpdatedSource(rawSource, env) {
  const mediaType = env.MEDIA_TYPE;
  const name = env.MEDIA_NAME;
  const language = env.MEDIA_LANGUAGE;
  const genreInput = env.MEDIA_GENRE;
  const platform = env.MEDIA_PLATFORM || undefined;
  const status = env.MEDIA_STATUS || undefined;

  if (!mediaType || !name || !language || !genreInput) {
    throw new Error("mediaType, name, language, and genre are required");
  }

  const genre = parseGenre(genreInput);

  let dataObjectName;
  let entryLine;

  if (mediaType === "movie") {
    const year = Number(env.MEDIA_YEAR);
    const playtime = env.MEDIA_PLAYTIME;
    if (!Number.isInteger(year) || !playtime) throw new Error("movie requires numeric year and playtime");
    dataObjectName = "moviesData";
    entryLine = serializeMovieLine({ name, genre, year, playtime, language, platform, status });
  } else if (mediaType === "tvshow") {
    const seasons = Number(env.MEDIA_SEASONS);
    const yearRange = env.MEDIA_YEAR_RANGE;
    if (!Number.isInteger(seasons) || !yearRange) throw new Error("tvshow requires numeric seasons and yearRange");
    dataObjectName = "tvShowsData";
    entryLine = serializeTVShowLine({ name, genre, yearRange, seasons, language, platform, status });
  } else {
    throw new Error(`unknown mediaType "${mediaType}" — expected "movie" or "tvshow"`);
  }

  return { updatedSource: insertEntryIntoSource(rawSource, dataObjectName, language, entryLine), dataObjectName, name };
}

export function main(mediaDataPath = MEDIA_DATA_PATH, env = process.env) {
  try {
    const rawSource = readFileSync(mediaDataPath, "utf8");
    const { updatedSource, dataObjectName, name } = buildUpdatedSource(rawSource, env);
    writeFileSync(mediaDataPath, updatedSource);
    console.log(`add-media-entry: inserted "${name}" into ${dataObjectName}.${env.MEDIA_LANGUAGE}`);
  } catch (error) {
    console.error(`add-media-entry: ${error.message}`);
    process.exit(1);
  }
}

// Only run the CLI entry point when this file is executed directly (not when imported for tests).
// The condition itself can only be exercised by actually spawning the script as a process
// (covered by the subprocess test in add-media-entry.test.ts) — same-process unit tests call
// main() directly instead, which is why this line is excluded from coverage.
/* v8 ignore next 3 */
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
