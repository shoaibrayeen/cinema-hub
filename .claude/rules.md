# CinemaHub — project rules

All rules for working in this repo. The root `CLAUDE.md` imports this file; add new rules here.

## Unit tests required for every change (mandatory)

- **Every code change must add or update unit test cases covering it, in the same commit.** New pages/components need at least a render test; behavior or routing changes need assertion updates; catalog edits must keep the data-integrity suite green.
- **Every source file must be covered by a test suite.** Current mapping (extend it when adding files):

  | Source | Test suite |
  |---|---|
  | `src/data/mediaData.ts` | `src/test/mediaData.test.ts` |
  | `src/App.tsx` (providers + routing) | `src/test/app.test.tsx` |
  | `src/pages/*` (Index, Movies, TVShows, NotFound) | `src/test/pages.test.tsx` |
  | `src/components/*` (Header, Footer, MediaCard, HorizontalCarousel, FilterControls, NavLink) | `src/test/components.test.tsx` |
  | `src/hooks/*` (use-mobile, use-toast) | `src/test/hooks.test.tsx` |
  | `src/lib/utils.ts` | `src/test/utils.test.ts` |

- **Exclusions (by policy):** `src/components/ui/**` (vendored shadcn/ui primitives — generated code, exercised indirectly), `src/main.tsx` (bootstrap), `src/test/**`, `vite-env.d.ts`, CSS files.
- Framework: Vitest + Testing Library + jsdom (`vitest.config.ts`; shared mocks for matchMedia/ResizeObserver/scrollIntoView in `src/test/setup.ts`).
- Run `npm test` before handing work over — all suites must pass. CI runs the suite on every push to `master` and a failure blocks deployment.

## Architecture docs stay in sync (mandatory)

- **Any change** that affects code structure, routing, pages/components, the data model, build, or deployment **must update `architecture.md` in the same commit**.
- If the change alters a flow (build/deploy pipeline, request/deep-link handling, page → component → data relationships), **update `architecture.svg` as well** so the diagram matches the doc.
- New pages, components, or `mediaData.ts` exports are not done until they appear in both files.

## About Me stays in sync with the portfolio (mandatory)

- The "ABOUT ME" card in `src/pages/Index.tsx` must always match the About section of **https://shoaibrayeen.github.io/** — the portfolio is the single source of truth; never edit the portfolio to match this repo.
- **On every session that touches this repo, check whether they still match.** Compare against the portfolio's `About.tsx` (local checkout: `/Users/shoaib.rayeen/my_space/shoaibrayeen.github.io/src/components/About.tsx` on `master_revamp` — verify it matches `origin` first) or the live site's JS bundle.
- If they differ (role/title, years of experience, focus areas, skill chips), update cinema-hub's About Me card: condense to fit the card's two-paragraph + skill-chips layout, but keep it factually identical to the portfolio.

## GitHub Pages constraints (project site at /cinema-hub/)

- Vite `base` is `"/cinema-hub/"` and the router uses `basename={import.meta.env.BASE_URL}` — never remove either; they must stay in sync.
- Internal navigation must use react-router `<Link>` / `useNavigate()`. Never use raw `<a href="/...">` for internal routes — it escapes the base path to the user-site root (NotFound.tsx had this bug once).
- Do not delete or rename `public/404.html`, the decode script in `index.html`, or `public/.nojekyll` — together they implement the spa-github-pages deep-link fallback.
- Static assets go in `public/` and are referenced root-relative (`/file.svg`); Vite rewrites them with the base.

## No Lovable references

This project was migrated away from Lovable. Never (re)introduce `lovable-tagger`, `lovable.dev`/`lovable.app` URLs, or Lovable meta tags — in code, config, lockfiles, or docs.

## Data updates

The entire catalog lives in `src/data/mediaData.ts` (`moviesData` / `tvShowsData`, keyed by language). Follow the `Movie`/`TVShow` interfaces; a new language must be added to `LANGUAGES` first (the data-integrity tests enforce this — an entry keyed under a language not in `LANGUAGES` is invisible in the UI's filters). There is no backend — do not add fetching for catalog data.

## Build, test, deploy

- On this machine node/npm are not on PATH — prefix commands with:
  `export PATH=/Users/shoaib.rayeen/tools/node-v22.22.2-darwin-arm64/bin:$PATH`
- Before any push: `npm test && npm run build` must pass. CI runs both and a failure blocks deployment.
- Every push/merge to `master` deploys to https://shoaibrayeen.github.io/cinema-hub/ via `.github/workflows/deploy.yml`. There is no staging environment.
- Dev server: `npm run dev` → http://localhost:8080/cinema-hub/ (note the base path — the root URL shows Vite's hint page).
- The repo owner commits and pushes; do not commit or push unless explicitly asked.
