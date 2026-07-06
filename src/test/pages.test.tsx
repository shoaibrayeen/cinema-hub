import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Movies from "@/pages/Movies";
import TVShows from "@/pages/TVShows";
import NotFound from "@/pages/NotFound";
import { moviesData, tvShowsData, LANGUAGES } from "@/data/mediaData";

const renderPage = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Index page", () => {
  it("renders the hero with browse links", () => {
    renderPage(<Index />);
    expect(screen.getByRole("heading", { level: 1, name: /cinema\s*hub/i })).toBeInTheDocument();
    expect(screen.getByText(/my personal watchlist/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse movies/i })).toHaveAttribute("href", "/movies");
    expect(screen.getByRole("link", { name: /explore tv shows/i })).toHaveAttribute("href", "/tv-shows");
  });

  it("renders the About Me card synced from the portfolio", () => {
    renderPage(<Index />);
    expect(screen.getByText(/technical lead with 6\+ years/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view my portfolio/i })).toHaveAttribute(
      "href",
      "https://shoaibrayeen.github.io/"
    );
  });

  it("renders the hobbies card", () => {
    renderPage(<Index />);
    expect(screen.getByText(/hobbies/i)).toBeInTheDocument();
    expect(screen.getByText(/world cinema/i)).toBeInTheDocument();
  });
});

describe("Movies page", () => {
  it("renders the heading and filter controls", () => {
    renderPage(<Movies />);
    expect(screen.getByRole("heading", { level: 1, name: /movies/i })).toBeInTheDocument();
    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(3);
  });

  it("shows movies from the default (English) catalog", () => {
    renderPage(<Movies />);
    // Pick a real entry so the test survives catalog edits.
    const withStatus = (moviesData.English ?? []).find((m) => m.status);
    expect(withStatus, "English catalog needs at least one movie with a status").toBeTruthy();
    expect(screen.getAllByText(withStatus!.name).length).toBeGreaterThanOrEqual(1);
  });

  it("filters movies by genre", () => {
    renderPage(<Movies />);
    const englishMovies = moviesData.English ?? [];
    const genreCounts = new Map<string, number>();
    englishMovies.forEach((m) => m.genre.forEach((g) => genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1)));
    const partialGenre = [...genreCounts.entries()].find(([, c]) => c > 0 && c < englishMovies.length)?.[0];
    expect(partialGenre, "English catalog needs a genre shared by only some movies").toBeTruthy();

    fireEvent.click(screen.getAllByRole("combobox")[2]);
    fireEvent.click(screen.getByRole("option", { name: partialGenre! }));

    const expectedCount = englishMovies.filter((m) => m.genre.includes(partialGenre!)).length;
    expect(screen.getByText(new RegExp(`^${expectedCount} of `))).toBeInTheDocument();
  });

  it("filters movies by status and switches to the flat grid view", () => {
    renderPage(<Movies />);
    fireEvent.click(screen.getAllByRole("combobox")[1]);
    fireEvent.click(screen.getByRole("option", { name: "Watched" }));

    const expectedCount = (moviesData.English ?? []).filter((m) => m.status === "Watched").length;
    expect(screen.getByText(new RegExp(`^${expectedCount} of `))).toBeInTheDocument();
  });

  it("sorts movies by oldest year and by name", () => {
    renderPage(<Movies />);
    fireEvent.click(screen.getAllByRole("combobox")[1]);
    fireEvent.click(screen.getByRole("option", { name: "Watched" }));

    const englishWatched = (moviesData.English ?? []).filter((m) => m.status === "Watched");
    const sortCombobox = screen.getAllByRole("combobox")[3];

    fireEvent.click(sortCombobox);
    fireEvent.click(screen.getByRole("option", { name: "Year (Oldest)" }));
    const byYearAsc = [...englishWatched].sort((a, b) => a.year - b.year).map((m) => m.name);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(byYearAsc);

    fireEvent.click(sortCombobox);
    fireEvent.click(screen.getByRole("option", { name: "Name (A-Z)" }));
    const byName = [...englishWatched].sort((a, b) => a.name.localeCompare(b.name)).map((m) => m.name);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(byName);
  });
});

describe("TVShows page", () => {
  it("renders the heading and filter controls", () => {
    renderPage(<TVShows />);
    expect(screen.getByRole("heading", { level: 1, name: /tv shows/i })).toBeInTheDocument();
    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(3);
  });

  it("shows TV shows from the default (Korean) catalog", () => {
    renderPage(<TVShows />);
    // The TVShows page defaults selectedLanguage to "Korean" (TVShows.tsx:11).
    const withStatus = (tvShowsData.Korean ?? []).find((s) => s.status);
    expect(withStatus, "Korean catalog needs at least one show with a status").toBeTruthy();
    expect(screen.getAllByText(withStatus!.name).length).toBeGreaterThanOrEqual(1);
  });

  it("filters TV shows by genre", () => {
    renderPage(<TVShows />);
    const koreanShows = tvShowsData.Korean ?? [];
    const genreCounts = new Map<string, number>();
    koreanShows.forEach((s) => s.genre.forEach((g) => genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1)));
    const partialGenre = [...genreCounts.entries()].find(([, c]) => c > 0 && c < koreanShows.length)?.[0];
    expect(partialGenre, "Korean catalog needs a genre shared by only some shows").toBeTruthy();

    fireEvent.click(screen.getAllByRole("combobox")[2]);
    fireEvent.click(screen.getByRole("option", { name: partialGenre! }));

    const expectedCount = koreanShows.filter((s) => s.genre.includes(partialGenre!)).length;
    expect(screen.getByText(new RegExp(`^${expectedCount} of `))).toBeInTheDocument();
  });

  it("filters TV shows by status and switches to the flat grid view", () => {
    renderPage(<TVShows />);
    fireEvent.click(screen.getAllByRole("combobox")[1]);
    fireEvent.click(screen.getByRole("option", { name: "Watched" }));
    const expectedCount = (tvShowsData.Korean ?? []).filter((s) => s.status === "Watched").length;
    expect(screen.getByText(new RegExp(`^${expectedCount} of `))).toBeInTheDocument();
  });

  it("sorts TV shows by oldest year and by name", () => {
    renderPage(<TVShows />);
    fireEvent.click(screen.getAllByRole("combobox")[1]);
    fireEvent.click(screen.getByRole("option", { name: "Watched" }));

    const koreanWatched = (tvShowsData.Korean ?? []).filter((s) => s.status === "Watched");
    const sortCombobox = screen.getAllByRole("combobox")[3];
    const parseYear = (yr: string) => parseInt(yr.match(/^\d{4}/)?.[0] ?? "0");

    fireEvent.click(sortCombobox);
    fireEvent.click(screen.getByRole("option", { name: "Year (Oldest)" }));
    const byYearAsc = [...koreanWatched].sort((a, b) => parseYear(a.yearRange) - parseYear(b.yearRange)).map((s) => s.name);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(byYearAsc);

    fireEvent.click(sortCombobox);
    fireEvent.click(screen.getByRole("option", { name: "Name (A-Z)" }));
    const byName = [...koreanWatched].sort((a, b) => a.name.localeCompare(b.name)).map((s) => s.name);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(byName);
  });

  it("shows the empty state for a language with no TV shows in the catalog", () => {
    renderPage(<TVShows />);
    const emptyLanguage = LANGUAGES.find((l) => !tvShowsData[l]);
    expect(emptyLanguage, "expected at least one language with no TV show catalog entries").toBeTruthy();

    fireEvent.click(screen.getAllByRole("combobox")[0]);
    fireEvent.click(screen.getByRole("option", { name: emptyLanguage! }));
    expect(screen.getByText(/no tv shows found/i)).toBeInTheDocument();
  });
});

describe("NotFound page", () => {
  it("renders the cinematic clapperboard 404", () => {
    renderPage(<NotFound />);
    expect(screen.getByRole("heading", { level: 1, name: /4\s*0\s*4/ })).toBeInTheDocument();
    expect(screen.getByText(/cutting room floor/i)).toBeInTheDocument();
    expect(screen.getByText("NOT FOUND")).toBeInTheDocument();
    expect(screen.getByText("React Router")).toBeInTheDocument();
  });

  it("offers in-app escape links", () => {
    renderPage(<NotFound />);
    expect(screen.getByRole("link", { name: /return to home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /browse movies/i })).toHaveAttribute("href", "/movies");
  });
});
