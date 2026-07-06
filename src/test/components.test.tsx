import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("shows the left scroll button and scrolls both directions once scrolled away from the start", () => {
    const scrollBySpy = vi.spyOn(window.HTMLElement.prototype, "scrollBy").mockImplementation(() => {});
    const { container } = render(
      <HorizontalCarousel title="WATCHED" itemCount={2}>
        <div>child-a</div>
        <div>child-b</div>
      </HorizontalCarousel>
    );
    const track = container.querySelector(".overflow-x-auto") as HTMLDivElement;
    Object.defineProperties(track, {
      scrollLeft: { value: 50, configurable: true },
      scrollWidth: { value: 1000, configurable: true },
      clientWidth: { value: 500, configurable: true },
    });
    fireEvent.scroll(track);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2); // canScrollLeft is now true, so both arrows render

    fireEvent.click(buttons[0]);
    expect(scrollBySpy).toHaveBeenCalledWith({ left: -600, behavior: "smooth" });

    fireEvent.click(buttons[1]);
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 600, behavior: "smooth" });

    scrollBySpy.mockRestore();
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

  it("defaults the status selector to 'all' when selectedStatus is omitted", () => {
    render(<FilterControls {...baseProps} onStatusChange={noop} />);
    expect(screen.getByText("All Status")).toBeInTheDocument();
  });

  it("invokes onLanguageChange with the selected language", () => {
    const onLanguageChange = vi.fn();
    render(<FilterControls {...baseProps} onLanguageChange={onLanguageChange} />);
    fireEvent.click(screen.getAllByRole("combobox")[0]);
    fireEvent.click(screen.getByRole("option", { name: "Hindi" }));
    expect(onLanguageChange).toHaveBeenCalledWith("Hindi");
  });

  it("invokes onSortChange with the selected sort key", () => {
    const onSortChange = vi.fn();
    render(<FilterControls {...baseProps} onSortChange={onSortChange} />);
    const comboboxes = screen.getAllByRole("combobox");
    fireEvent.click(comboboxes[comboboxes.length - 1]);
    fireEvent.click(screen.getByRole("option", { name: "Name (A-Z)" }));
    expect(onSortChange).toHaveBeenCalledWith("name");
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
