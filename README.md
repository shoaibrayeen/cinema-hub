# 🎬 CinemaHub

[![Deploy to GitHub Pages](https://github.com/shoaibrayeen/cinema-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/shoaibrayeen/cinema-hub/actions/workflows/deploy.yml)

A personal catalog of movies and TV shows from around the world — browse by language, genre, platform, and watch status.

**🔗 Live:** https://shoaibrayeen.github.io/cinema-hub/

## Features

- **Movies & TV Shows catalogs** — spanning 17 languages (English, Hindi, French, Korean, Chinese, Turkish, Spanish, Tamil, Telugu, Malayalam, and more)
- **Filtering & sorting** — by language, genre, and watch status; sort by year (newest/oldest) or name
- **Watch-status carousels** — Currently Watching / Watched / Watchlist rows, switching to a grid when a specific status is selected
- **Live catalog stats** — languages, titles, and genre counts computed from the data and shown in the footer
- **Cinematic 404 page** — an animated clapperboard ("SCENE: NOT FOUND · TAKE 404") with in-app escape links
- **About Me card** — kept in sync with the [portfolio site](https://shoaibrayeen.github.io/) (the portfolio is the source of truth)
- Dark, Netflix-inspired UI with the Bebas Neue display font and a red gradient brand

## Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite 5 (`base: /cinema-hub/`) |
| UI | React 18 + TypeScript |
| Routing | React Router 6 (`BrowserRouter` with `basename`) |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives), lucide-react icons |
| Testing | Vitest 3 + Testing Library + jsdom |
| CI/CD | GitHub Actions → GitHub Pages (project site) |

There is **no backend** — the entire catalog is TypeScript data ([src/data/mediaData.ts](src/data/mediaData.ts)) compiled into the bundle.

## Architecture

See **[architecture.md](architecture.md)** for the full architecture and **[architecture.svg](architecture.svg)** for the flow diagram (build/deploy pipeline, SPA request flow, and application structure). Both are kept in sync with every change — see the project rules.

## Project Structure

```
├── index.html                     # Meta tags + SPA-redirect decode script
├── vite.config.ts                 # base "/cinema-hub/", @ → src alias
├── vitest.config.ts               # jsdom test environment, 100% coverage thresholds
├── scripts/add-media-entry.mjs    # CI-only script: splices a new entry into mediaData.ts
├── .github/workflows/
│   ├── deploy.yml                 # CI/CD: test → build → deploy to Pages
│   └── add-media.yml              # workflow_dispatch: runs add-media-entry.mjs, opens a PR
├── .claude/rules.md               # project rules (imported by CLAUDE.md)
├── public/
│   ├── 404.html                   # spa-github-pages redirect (pathSegmentsToKeep = 1)
│   ├── .nojekyll                  # disable Jekyll on Pages
│   └── favicon.svg                # red play-button logo
└── src/
    ├── App.tsx                    # providers + router (/, /movies, /tv-shows, /admin, *)
    ├── pages/                     # Index, Movies, TVShows, Admin (unlinked from nav), NotFound
    ├── components/                # Header, Footer, FilterControls, MediaCard,
    │   ├── admin/                 #   LoginForm, AddMediaForm (password-gated add-media UI)
    │   └── ui/                    #   HorizontalCarousel, NavLink + shadcn primitives
    ├── data/mediaData.ts          # ★ the catalog — all movies/shows + helpers
    ├── hooks/                     # use-mobile, use-toast
    ├── lib/                       # utils, adminAuth, githubWorkflow, adminFormUtils, tvShowUtils
    └── test/                      # vitest suites (see Testing)
```

## Getting Started

Requires **Node.js 20+**.

```sh
npm install
npm run dev        # dev server → http://localhost:8080/cinema-hub/
npm test           # run the test suite once (CI mode)
npm run test:watch # tests in watch mode
npm run build      # production build to dist/
npm run preview    # preview the build → http://localhost:4173/cinema-hub/
npm run lint       # eslint (kept at zero problems)
```

> **Note:** the app is configured with the base path `/cinema-hub/` (project site), so dev and preview servers serve under that path — the root URL shows Vite's hint page. All internal navigation must use React Router `<Link>`, never raw `<a href="/...">`.

### Editing the catalog

All content lives in [src/data/mediaData.ts](src/data/mediaData.ts) as `moviesData` / `tvShowsData`, keyed by language. Follow the `Movie` / `TVShow` interfaces; **a new language must be added to `LANGUAGES` first**, otherwise its entries are invisible in the UI filters — the data-integrity tests enforce this.

## Testing

Vitest + Testing Library + jsdom. **Every change must ship with tests, every source file is covered, and coverage must stay at 100%** (lines/branches/functions/statements, enforced by `vitest.config.ts` — mapping and exclusion policy in [.claude/rules.md](.claude/rules.md)):

| Suite | Covers |
|---|---|
| `src/test/mediaData.test.ts` | Catalog integrity (valid languages/statuses/platforms/years, no duplicates) + helper contracts |
| `src/test/app.test.tsx` | Providers + routing for all routes (including `/admin`), 404 fallback, About Me sync |
| `src/test/pages.test.tsx` | Per-page rendering: Index, Movies (English default), TVShows (Korean default), NotFound |
| `src/test/components.test.tsx` | Header, Footer, MediaCard, HorizontalCarousel, FilterControls, NavLink |
| `src/test/admin.test.tsx` | Admin page flow: LoginForm, AddMediaForm (Movie + TV Show tabs) |
| `src/test/adminAuth.test.ts` | Password hashing + verification, auth session storage |
| `src/test/githubWorkflow.test.ts` | `workflow_dispatch` trigger, token storage |
| `src/test/adminFormUtils.test.ts` | Add-media form field helpers |
| `src/test/tvShowUtils.test.ts` | TV show helper utilities |
| `src/test/add-media-entry.test.ts` | `scripts/add-media-entry.mjs` splice logic (movies, TV shows, new-language blocks) |
| `src/test/hooks.test.tsx` | useIsMobile breakpoint, useToast add/limit/dismiss |
| `src/test/utils.test.ts` | `cn()` class merging |

## Deployment

Every push/merge to **`master`** triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

```
npm ci → npm test → npm run build → upload dist/ → deploy to GitHub Pages
```

A failing test suite **blocks the deploy**. The site publishes as a GitHub Pages **project site** under `/cinema-hub/`.

Client-side routing on Pages uses the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) pattern: `public/404.html` redirects unknown deep links (e.g. a hard refresh on `/cinema-hub/movies`) back to `index.html` with the path encoded in the query string, and a script in `index.html` restores the original URL before React Router takes over.

## Project Rules

All contributor/agent rules live in **[.claude/rules.md](.claude/rules.md)** (auto-loaded via [CLAUDE.md](CLAUDE.md)). The load-bearing ones:

1. **Unit tests for every change** — same commit, every source file covered, coverage stays at 100%; `npm test && npm run build && npm run lint` must pass before pushing.
2. **Architecture docs stay in sync** — structural/flow changes must update `architecture.md` (and `architecture.svg` for flow changes) in the same commit.
3. **About Me syncs from the portfolio** — https://shoaibrayeen.github.io/ is the single source of truth for the About Me card; sync flows one way only.
4. **GitHub Pages constraints** — never remove the Vite `base`, router `basename`, `public/404.html`, the decode script, or `.nojekyll`.
