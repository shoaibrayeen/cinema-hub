import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";

// In tests import.meta.env.BASE_URL is "/", so the router basename is "/"
// and routes resolve directly against the pushed path.
const renderAt = (path: string) => {
  window.history.pushState({}, "", path);
  return render(<App />);
};

describe("routing", () => {
  it("renders the home page at /", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1, name: /cinema\s*hub/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse movies/i })).toBeInTheDocument();
  });

  it("renders the movies page at /movies", () => {
    renderAt("/movies");
    expect(screen.getByRole("heading", { level: 1, name: /movies/i })).toBeInTheDocument();
  });

  it("renders the TV shows page at /tv-shows", () => {
    renderAt("/tv-shows");
    expect(screen.getByRole("heading", { level: 1, name: /tv shows/i })).toBeInTheDocument();
  });

  it("renders the hidden admin page at /admin (not linked from the nav)", () => {
    renderAt("/admin");
    expect(screen.getByRole("heading", { level: 1, name: /admin/i })).toBeInTheDocument();
    renderAt("/");
    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
  });
});

describe("404 fallback", () => {
  it("renders the clapperboard 404 page for unknown routes", () => {
    renderAt("/this-scene-does-not-exist");
    expect(screen.getByRole("heading", { level: 1, name: /4\s*0\s*4/ })).toBeInTheDocument();
    expect(screen.getByText(/cutting room floor/i)).toBeInTheDocument();
  });

  it("keeps the escape links inside the app (router links, not raw anchors)", () => {
    renderAt("/another-missing-scene");
    const home = screen.getByRole("link", { name: /return to home/i });
    const movies = screen.getByRole("link", { name: /browse movies/i });
    expect(home).toHaveAttribute("href", "/");
    expect(movies).toHaveAttribute("href", "/movies");
  });
});

describe("home page content", () => {
  it("shows the About Me card synced from the portfolio", () => {
    renderAt("/");
    expect(screen.getByText(/technical lead with 6\+ years/i)).toBeInTheDocument();
    const portfolio = screen.getAllByRole("link", { name: /portfolio/i })[0];
    expect(portfolio).toHaveAttribute("href", "https://shoaibrayeen.github.io/");
  });
});
