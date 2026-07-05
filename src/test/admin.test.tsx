import { webcrypto } from "node:crypto";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/components/admin/LoginForm";
import AddMediaForm from "@/components/admin/AddMediaForm";
import Admin from "@/pages/Admin";
import { isAdminAuthed } from "@/lib/adminAuth";
import { isGithubConnected, getGithubToken, saveGithubToken } from "@/lib/githubWorkflow";
import * as githubWorkflow from "@/lib/githubWorkflow";

// jsdom implements crypto.getRandomValues but not crypto.subtle — polyfill with Node's webcrypto,
// needed since LoginForm/Admin drive the real hash-based verifyAdminCredentials flow.
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
}

vi.mock("@/lib/githubWorkflow", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/githubWorkflow")>();
  return { ...actual, triggerAddMediaWorkflow: vi.fn() };
});

const mockedTrigger = vi.mocked(githubWorkflow.triggerAddMediaWorkflow);

// Radix Tabs' trigger activation relies on onPointerDown, not onClick — a bare fireEvent.click
// doesn't switch tabs in jsdom, so drive the full pointer/mouse/click sequence a real browser sends.
const clickTab = (element: HTMLElement) => {
  fireEvent.pointerDown(element, { button: 0, pointerId: 1 });
  fireEvent.mouseDown(element, { button: 0 });
  fireEvent.pointerUp(element, { button: 0, pointerId: 1 });
  fireEvent.mouseUp(element, { button: 0 });
  fireEvent.click(element);
};

beforeEach(() => {
  localStorage.clear();
  mockedTrigger.mockReset();
});

describe("LoginForm", () => {
  it("renders username and password fields", () => {
    render(<LoginForm onSuccess={() => {}} />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("does not call onSuccess and clears the password on wrong credentials", async () => {
    const onSuccess = vi.fn();
    render(<LoginForm onSuccess={onSuccess} />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "shoaib" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(screen.getByLabelText("Password")).toHaveValue(""));
    expect(onSuccess).not.toHaveBeenCalled();
    expect(isAdminAuthed()).toBe(false);
  });

  it("calls onSuccess and persists the session on correct credentials", async () => {
    const onSuccess = vi.fn();
    render(<LoginForm onSuccess={onSuccess} />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "shoaib" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "msr1896" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(isAdminAuthed()).toBe(true);
  });
});

describe("Admin page", () => {
  it("shows the login form when not authenticated", () => {
    render(<Admin />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("advances to the Connect GitHub step after a successful login", async () => {
    render(<Admin />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "shoaib" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "msr1896" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByLabelText("GitHub token")).toBeInTheDocument();
  });

  it("ignores a whitespace-only GitHub token submission", () => {
    localStorage.setItem("cinema-hub-admin-auth", "true");
    render(<Admin />);
    // A native "required" input already blocks a truly empty submit; use whitespace to reach
    // the trim() guard in ConnectGithubStep's own handler instead.
    fireEvent.change(screen.getByLabelText("GitHub token"), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: /connect github/i }));
    expect(isGithubConnected()).toBe(false);
    expect(screen.getByLabelText("GitHub token")).toBeInTheDocument();
  });

  it("saves the token and advances to the add-media form once connected", () => {
    localStorage.setItem("cinema-hub-admin-auth", "true");
    render(<Admin />);
    fireEvent.change(screen.getByLabelText("GitHub token"), { target: { value: "test-token" } });
    fireEvent.click(screen.getByRole("button", { name: /connect github/i }));

    expect(isGithubConnected()).toBe(true);
    expect(getGithubToken()).toBe("test-token");
    expect(screen.getByRole("tab", { name: "Movie" })).toBeInTheDocument();
  });

  it("resumes directly into the add-media form when already authed and connected", () => {
    localStorage.setItem("cinema-hub-admin-auth", "true");
    saveGithubToken("existing-token");
    render(<Admin />);
    expect(screen.getByRole("tab", { name: "Movie" })).toBeInTheDocument();
  });

  it("disconnects GitHub without logging out", () => {
    localStorage.setItem("cinema-hub-admin-auth", "true");
    saveGithubToken("existing-token");
    render(<Admin />);
    fireEvent.click(screen.getByRole("button", { name: /disconnect github/i }));
    expect(isGithubConnected()).toBe(false);
    expect(isAdminAuthed()).toBe(true);
    expect(screen.getByLabelText("GitHub token")).toBeInTheDocument();
  });

  it("logs out back to the login screen", () => {
    localStorage.setItem("cinema-hub-admin-auth", "true");
    saveGithubToken("existing-token");
    render(<Admin />);
    fireEvent.click(screen.getByRole("button", { name: /^log out$/i }));
    expect(isAdminAuthed()).toBe(false);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });
});

describe("AddMediaForm", () => {
  it("renders the Movie tab by default with defaulted status", () => {
    render(<AddMediaForm token="test-token" />);
    expect(screen.getByRole("tab", { name: "Movie", selected: true })).toBeInTheDocument();
    expect(screen.getAllByText("Watched").length).toBeGreaterThanOrEqual(1);
  });

  it("shows validation errors when submitting an empty movie form", async () => {
    render(<AddMediaForm token="test-token" />);
    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("At least one genre is required")).toBeInTheDocument();
    expect(screen.getByText("Playtime is required")).toBeInTheDocument();
    expect(screen.getByText("Language is required")).toBeInTheDocument();
    expect(mockedTrigger).not.toHaveBeenCalled();
  });

  it("requires a new-language name when 'Other' is selected", async () => {
    render(<AddMediaForm token="test-token" />);
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "Other (type new)" }));
    expect(screen.getByLabelText("New language name")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));
    expect(await screen.findByText("Enter the new language name")).toBeInTheDocument();
  });

  it("shows a non-blocking duplicate warning for an existing movie", async () => {
    render(<AddMediaForm token="test-token" />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Pathaan" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "Hindi" }));

    expect(await screen.findByText(/already exists under this language/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add movie/i })).not.toBeDisabled();
  });

  it("submits a valid movie, triggers the workflow, and resets the form", async () => {
    mockedTrigger.mockResolvedValueOnce(undefined);
    render(<AddMediaForm token="test-token" />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Admin Movie" } });
    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Action, Test" } });
    fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2026" } });
    fireEvent.change(screen.getByLabelText("Playtime"), { target: { value: "1h 30m" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "Hindi" }));
    fireEvent.click(screen.getByRole("combobox", { name: /platform/i }));
    fireEvent.click(screen.getByRole("option", { name: "Netflix" }));

    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() =>
      expect(mockedTrigger).toHaveBeenCalledWith("test-token", {
        mediaType: "movie",
        name: "Test Admin Movie",
        genre: "Action, Test",
        language: "Hindi",
        year: "2026",
        playtime: "1h 30m",
        platform: "Netflix",
        status: "Watched",
      }),
    );
    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue(""));
  });

  it("submits a movie under a brand-new 'Other' language", async () => {
    mockedTrigger.mockResolvedValueOnce(undefined);
    render(<AddMediaForm token="test-token" />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New Lang Movie" } });
    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Drama" } });
    fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2026" } });
    fireEvent.change(screen.getByLabelText("Playtime"), { target: { value: "2h 00m" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "Other (type new)" }));
    fireEvent.change(screen.getByLabelText("New language name"), { target: { value: "Klingon" } });

    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() =>
      expect(mockedTrigger).toHaveBeenCalledWith(
        "test-token",
        expect.objectContaining({ language: "Klingon", name: "New Lang Movie" }),
      ),
    );
  });

  it("shows a destructive error and preserves the form when the workflow trigger fails", async () => {
    mockedTrigger.mockRejectedValueOnce(new Error("bad token"));
    render(<AddMediaForm token="test-token" />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Failing Movie" } });
    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Drama" } });
    fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2026" } });
    fireEvent.change(screen.getByLabelText("Playtime"), { target: { value: "2h 00m" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "Hindi" }));

    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() => expect(mockedTrigger).toHaveBeenCalled());
    expect(screen.getByLabelText("Name")).toHaveValue("Failing Movie");
  });

  it("shows a destructive error for a failing TV show submission", async () => {
    mockedTrigger.mockRejectedValueOnce(new Error("bad token"));
    render(<AddMediaForm token="test-token" />);

    clickTab(screen.getByRole("tab", { name: "TV Show" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Failing Show" } });
    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Drama" } });
    fireEvent.change(screen.getByLabelText("Year range"), { target: { value: "2024" } });
    fireEvent.change(screen.getByLabelText("Seasons"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "English" }));

    fireEvent.click(screen.getByRole("button", { name: /add tv show/i }));

    await waitFor(() => expect(mockedTrigger).toHaveBeenCalled());
    expect(screen.getByLabelText("Name")).toHaveValue("Failing Show");
  });

  it("switches to the TV Show tab, validates, and submits successfully", async () => {
    mockedTrigger.mockResolvedValueOnce(undefined);
    render(<AddMediaForm token="test-token" />);

    clickTab(screen.getByRole("tab", { name: "TV Show" }));
    fireEvent.click(screen.getByRole("button", { name: /add tv show/i }));
    expect(await screen.findByText("Year range is required")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Admin Show" } });
    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Drama, Test" } });
    fireEvent.change(screen.getByLabelText("Year range"), { target: { value: "2024-Present" } });
    fireEvent.change(screen.getByLabelText("Seasons"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "English" }));
    fireEvent.click(screen.getByRole("combobox", { name: /platform/i }));
    fireEvent.click(screen.getByRole("option", { name: "Hotstar" }));

    fireEvent.click(screen.getByRole("button", { name: /add tv show/i }));

    await waitFor(() =>
      expect(mockedTrigger).toHaveBeenCalledWith("test-token", {
        mediaType: "tvshow",
        name: "Test Admin Show",
        genre: "Drama, Test",
        language: "English",
        yearRange: "2024-Present",
        seasons: "2",
        platform: "Hotstar",
        status: "Watched",
      }),
    );
  });

  it("shows a duplicate warning for an existing TV show", async () => {
    render(<AddMediaForm token="test-token" />);
    clickTab(screen.getByRole("tab", { name: "TV Show" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Breaking Bad" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "English" }));

    expect(await screen.findByText(/already exists under this language/i)).toBeInTheDocument();
  });

  it("requires a new-language name for a TV show when 'Other' is selected", async () => {
    render(<AddMediaForm token="test-token" />);
    clickTab(screen.getByRole("tab", { name: "TV Show" }));
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "Other (type new)" }));

    fireEvent.click(screen.getByRole("button", { name: /add tv show/i }));
    expect(await screen.findByText("Enter the new language name")).toBeInTheDocument();
  });

  it("shows a generic error message when a non-Error value is thrown (movie)", async () => {
    mockedTrigger.mockRejectedValueOnce("network exploded");
    render(<AddMediaForm token="test-token" />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Odd Rejection Movie" } });
    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Drama" } });
    fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2026" } });
    fireEvent.change(screen.getByLabelText("Playtime"), { target: { value: "2h 00m" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "Hindi" }));

    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));
    await waitFor(() => expect(mockedTrigger).toHaveBeenCalled());
  });

  it("shows a generic error message when a non-Error value is thrown (tv show)", async () => {
    mockedTrigger.mockRejectedValueOnce("network exploded");
    render(<AddMediaForm token="test-token" />);
    clickTab(screen.getByRole("tab", { name: "TV Show" }));

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Odd Rejection Show" } });
    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Drama" } });
    fireEvent.change(screen.getByLabelText("Year range"), { target: { value: "2024" } });
    fireEvent.change(screen.getByLabelText("Seasons"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("combobox", { name: /language/i }));
    fireEvent.click(screen.getByRole("option", { name: "English" }));

    fireEvent.click(screen.getByRole("button", { name: /add tv show/i }));
    await waitFor(() => expect(mockedTrigger).toHaveBeenCalled());
  });
});
