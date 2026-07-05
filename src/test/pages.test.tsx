import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Movies from "@/pages/Movies";
import TVShows from "@/pages/TVShows";
import NotFound from "@/pages/NotFound";
import { moviesData, tvShowsData } from "@/data/mediaData";

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
