import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import FilterControls from "@/components/FilterControls";
import { NavLink } from "@/components/NavLink";

const withRouter = (ui: React.ReactElement, initialPath = "/") =>
  render(<MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>);

describe("Header", () => {
  it("renders the brand and all nav links", () => {
    withRouter(<Header />);
    expect(screen.getByText("CINEMAHUB")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /movies/i })).toHaveAttribute("href", "/movies");
    expect(screen.getByRole("link", { name: /tv shows/i })).toHaveAttribute("href", "/tv-shows");
  });

  it("highlights the active route", () => {
    withRouter(<Header />, "/movies");
    expect(screen.getByRole("link", { name: /movies/i }).className).toContain("bg-primary");
    expect(screen.getByRole("link", { name: /home/i }).className).not.toContain("bg-primary ");
  });
});

describe("Footer", () => {
  it("renders the copyright and the portfolio link", () => {
    withRouter(<Footer />);
    expect(screen.getByText(/© 2020-Present by Shoaib/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /portfolio/i })).toHaveAttribute(
      "href",
      "https://shoaibrayeen.github.io/"
    );
  });
});

describe("MediaCard", () => {
  it("renders a movie card with platform, status, genres, and year", () => {
    render(
      <MediaCard
        name="Test Movie"
        genre={["Drama", "Thriller", "Mystery"]}
        year={2024}
        platform="Netflix"
        status="Watched"
        index={0}
      />
    );
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Watched")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
    expect(screen.getByText("Thriller")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument(); // third genre collapses into +N
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders a TV card with a seasons badge and no optional fields", () => {
    render(<MediaCard name="Test Show" genre={["Drama"]} year="2020-2022" seasons={3} index={1} />);
    expect(screen.getByText("Test Show")).toBeInTheDocument();
    expect(screen.getByText("3S")).toBeInTheDocument();
    expect(screen.queryByText("Watched")).not.toBeInTheDocument();
  });
});

describe("HorizontalCarousel", () => {
  it("renders the title, item count, and children", () => {
    render(
      <HorizontalCarousel title="WATCHED" itemCount={2}>
        <div>child-a</div>
        <div>child-b</div>
      </HorizontalCarousel>
    );
    expect(screen.getByText("WATCHED")).toBeInTheDocument();
    expect(screen.getByText("(2)")).toBeInTheDocument();
    expect(screen.getByText("child-a")).toBeInTheDocument();
  });

  it("renders nothing when there are no items", () => {
    const { container } = render(
      <HorizontalCarousel title="EMPTY" itemCount={0}>
        <div>never shown</div>
      </HorizontalCarousel>
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("FilterControls", () => {
  const noop = () => {};
  const baseProps = {
    selectedLanguage: "English" as const,
    onLanguageChange: noop,
    sortBy: "year-desc" as const,
    onSortChange: noop,
    selectedGenre: "all",
    onGenreChange: noop,
    genres: ["Drama", "Thriller"],
  };

  it("renders language, genre, and sort selectors", () => {
    render(<FilterControls {...baseProps} />);
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
  });

  it("adds the status selector when onStatusChange is provided", () => {
    render(<FilterControls {...baseProps} selectedStatus="all" onStatusChange={noop} />);
    expect(screen.getAllByRole("combobox")).toHaveLength(4);
  });
});

describe("NavLink", () => {
  it("applies activeClassName only on the active route", () => {
    withRouter(
      <>
        <NavLink to="/here" className="base" activeClassName="is-active">
          Active Link
        </NavLink>
        <NavLink to="/elsewhere" className="base" activeClassName="is-active">
          Inactive Link
        </NavLink>
      </>,
      "/here"
    );
    expect(screen.getByRole("link", { name: "Active Link" }).className).toBe("base is-active");
    expect(screen.getByRole("link", { name: "Inactive Link" }).className).toBe("base");
  });
});
