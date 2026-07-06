import { describe, it, expect } from "vitest";
import {
  LANGUAGES,
  moviesData,
  tvShowsData,
  getStats,
  getAllGenres,
  getPlatformColor,
  type Platform,
  type WatchStatus,
} from "@/data/mediaData";

const VALID_STATUSES: WatchStatus[] = ["Watched", "Watching", "Planned"];
const ALL_PLATFORMS: Platform[] = [
  "Netflix",
  "Prime",
  "Disney+",
  "HBO",
  "Apple TV+",
  "Hotstar",
  "YouTube",
  "Theater",
  "Other",
];

describe("catalog integrity", () => {
  it("has movies and TV shows", () => {
    expect(Object.values(moviesData).flat().length).toBeGreaterThan(0);
    expect(Object.values(tvShowsData).flat().length).toBeGreaterThan(0);
  });

  it("every catalog key is a known language", () => {
    for (const key of Object.keys(moviesData)) {
      expect(LANGUAGES).toContain(key);
    }
    for (const key of Object.keys(tvShowsData)) {
      expect(LANGUAGES).toContain(key);
    }
  });

  it("every movie is well-formed and filed under its own language", () => {
    for (const [lang, movies] of Object.entries(moviesData)) {
      for (const movie of movies) {
        expect(movie.name, `movie in ${lang}`).toBeTruthy();
        expect(movie.genre.length, movie.name).toBeGreaterThan(0);
        expect(movie.year, movie.name).toBeGreaterThan(1900);
        expect(movie.year, movie.name).toBeLessThan(2100);
        expect(movie.language, movie.name).toBe(lang);
        if (movie.status) expect(VALID_STATUSES, movie.name).toContain(movie.status);
        if (movie.platform) expect(ALL_PLATFORMS, movie.name).toContain(movie.platform);
      }
    }
  });

  it("every TV show is well-formed and filed under its own language", () => {
    for (const [lang, shows] of Object.entries(tvShowsData)) {
      for (const show of shows) {
        expect(show.name, `show in ${lang}`).toBeTruthy();
        expect(show.genre.length, show.name).toBeGreaterThan(0);
        expect(show.seasons, show.name).toBeGreaterThanOrEqual(1);
        expect(show.language, show.name).toBe(lang);
        if (show.status) expect(VALID_STATUSES, show.name).toContain(show.status);
        if (show.platform) expect(ALL_PLATFORMS, show.name).toContain(show.platform);
      }
    }
  });

  it("has no duplicate movie names within a language", () => {
    for (const [lang, movies] of Object.entries(moviesData)) {
      const names = movies.map((m) => m.name);
      expect(new Set(names).size, `duplicates in ${lang}`).toBe(names.length);
    }
  });

  it("has no duplicate TV show names within a language", () => {
    for (const [lang, shows] of Object.entries(tvShowsData)) {
      const names = shows.map((s) => s.name);
      expect(new Set(names).size, `duplicates in ${lang}`).toBe(names.length);
    }
  });

  it("has no movie catalogued under more than one language", () => {
    const seen = new Map<string, string>();
    for (const [lang, movies] of Object.entries(moviesData)) {
      for (const movie of movies) {
        const previousLang = seen.get(movie.name);
        expect(previousLang, `"${movie.name}" appears in both ${previousLang} and ${lang}`).toBeUndefined();
        seen.set(movie.name, lang);
      }
    }
  });

  it("has no TV show catalogued under more than one language", () => {
    const seen = new Map<string, string>();
    for (const [lang, shows] of Object.entries(tvShowsData)) {
      for (const show of shows) {
        const previousLang = seen.get(show.name);
        expect(previousLang, `"${show.name}" appears in both ${previousLang} and ${lang}`).toBeUndefined();
        seen.set(show.name, lang);
      }
    }
  });
});

describe("helpers", () => {
  it("getStats totals match the catalogs", () => {
    const stats = getStats();
    expect(stats.movies).toBe(Object.values(moviesData).flat().length);
    expect(stats.tvShows).toBe(Object.values(tvShowsData).flat().length);
    expect(stats.languages).toBe(LANGUAGES.length);
    expect(stats.genres).toBeGreaterThan(0);
  });

  it("getAllGenres returns a sorted, de-duplicated, non-empty list", () => {
    for (const type of ["movie", "tvshow"] as const) {
      const genres = getAllGenres(type);
      expect(genres.length).toBeGreaterThan(0);
      expect(genres).toEqual([...new Set(genres)].sort());
    }
  });

  it("getPlatformColor maps every platform to a platform-* class", () => {
    for (const platform of ALL_PLATFORMS) {
      expect(getPlatformColor(platform)).toMatch(/^platform-/);
    }
  });
});
