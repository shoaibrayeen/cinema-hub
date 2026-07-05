# CinemaHub — Architecture

> **Rule:** this document and [architecture.svg](architecture.svg) must be updated in the same commit as any change that affects structure, routing, data, build, or deployment. See [CLAUDE.md](CLAUDE.md).

![Architecture flow diagram](architecture.svg)

## Overview

CinemaHub is a fully static single-page application: a personal movie/TV catalog rendered entirely client-side from data compiled into the bundle. There is no backend, no API calls, and no persistence — the whole catalog ships as TypeScript data. It deploys as a **GitHub Pages project site** served under the `/cinema-hub/` path of `https://shoaibrayeen.github.io/`.

**Stack:** Vite 5 · React 18 · TypeScript · React Router 6 · Tailwind CSS + shadcn/ui (Radix) · Vitest.

## Directory layout

```
├── index.html                  # Entry: meta tags + SPA-redirect decode script
├── vite.config.ts              # base: "/cinema-hub/", @ → src alias, port 8080
├── vitest.config.ts            # jsdom environment, src/test/setup.ts
├── .github/workflows/deploy.yml  # CI/CD: test → build → deploy to Pages
├── public/
│   ├── 404.html                # spa-github-pages redirect (pathSegmentsToKeep = 1)
│   ├── .nojekyll               # disable Jekyll processing on Pages
│   └── favicon.svg             # red play-button logo
└── src/
    ├── main.tsx                # mounts <App /> into #root
    ├── App.tsx                 # providers + router + route table
    ├── pages/                  # one component per route
    │   ├── Index.tsx           #   /            landing, about, portfolio link
    │   ├── Movies.tsx          #   /movies      filterable movie catalog
    │   ├── TVShows.tsx         #   /tv-shows    filterable TV catalog
    │   └── NotFound.tsx        #   *            cinematic 404: animated clapperboard (SMIL SVG), Header + router <Link>s
    ├── components/             # shared app components
    │   ├── Header.tsx          #   sticky nav (Home / Movies / TV Shows)
    │   ├── Footer.tsx          #   copyright + portfolio link
    │   ├── FilterControls.tsx  #   language / sort / genre / status selectors
    │   ├── MediaCard.tsx       #   one catalog entry (platform badge, genres, status)
    │   ├── HorizontalCarousel.tsx  # scrollable card row
    │   ├── NavLink.tsx         #   styled router link
    │   └── ui/                 #   ~49 shadcn/ui primitives (generated, rarely edited)
    ├── data/
    │   └── mediaData.ts        # THE data layer — entire catalog + helpers
    ├── hooks/                  # use-mobile, use-toast
    ├── lib/utils.ts            # cn() class merge helper
    └── test/                   # vitest setup + tests
```

## Data layer (`src/data/mediaData.ts`)

The single source of truth for all content. No fetching — pages import it directly.

- `LANGUAGES` (15 languages) → `Language` union type
- `Platform` — Netflix | Prime | Disney+ | HBO | Apple TV+ | Hotstar | YouTube | Theater | Other
- `WatchStatus` — Watched | Watching | Planned
- `Movie` / `TVShow` interfaces
- `moviesData: Record<string, Movie[]>` and `tvShowsData: Record<Language, TVShow[]>` — catalogs keyed by language
- Helpers: `getStats()`, `getAllGenres(type)`, `getPlatformColor(platform)`

**Data flow:** `Movies.tsx` / `TVShows.tsx` hold local UI state (`useState`: selected language, genre, status, sort) → derive the visible list with `useMemo` filters over the imported catalog → group by watch status → render `HorizontalCarousel` rows of `MediaCard`s. No global state; `QueryClientProvider` is mounted but unused (no remote data).

## Routing

`App.tsx` wires providers and the route table:

```
QueryClientProvider → TooltipProvider → Toaster/Sonner →
  BrowserRouter basename={import.meta.env.BASE_URL}
    "/"          → Index
    "/movies"    → Movies
    "/tv-shows"  → TVShows
    "*"          → NotFound
```

The `basename` comes from Vite's `base: "/cinema-hub/"`, so dev, preview, and production all serve under `/cinema-hub/`. **Internal navigation must use router `<Link>`/`useNavigate()`** — a raw `<a href="/">` escapes the base path to the user-site root.

### Deep links on GitHub Pages (spa-github-pages pattern)

GitHub Pages has no SPA rewrite support, so a hard load of `/cinema-hub/movies` would 404. Two files cooperate to recover:

1. `public/404.html` — Pages serves it for any unknown path. Its script keeps the first path segment (`pathSegmentsToKeep = 1` → `/cinema-hub`) and redirects to `/cinema-hub/?/movies`.
2. `index.html` decode script — sees the `?/` query, restores the real URL with `history.replaceState` → `/cinema-hub/movies` — before React mounts; React Router then matches the route normally.

## Build & deployment

Push/merge to `master` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

```
checkout → setup-node 22 (npm cache) → npm ci → npm test → npm run build
        → configure-pages (enablement: true) → upload dist/ → deploy-pages
```

- Tests gate the deploy — a red test suite blocks publishing.
- Vite writes `dist/` with all asset URLs prefixed `/cinema-hub/`; `404.html`, `.nojekyll`, and `favicon.svg` are copied from `public/`.
- The Pages site is deployed from the workflow artifact (source: GitHub Actions), not from a branch.
- Live URL: https://shoaibrayeen.github.io/cinema-hub/

## Testing

Vitest + jsdom + Testing Library (`vitest.config.ts`, `src/test/setup.ts`). `npm test` runs once (CI mode); `npm run test:watch` for development.
