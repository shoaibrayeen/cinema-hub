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
  | `src/components/admin/*` (LoginForm, AddMediaForm) + `src/pages/Admin.tsx` | `src/test/admin.test.tsx` |
  | `src/hooks/*` (use-mobile, use-toast) | `src/test/hooks.test.tsx` |
  | `src/lib/utils.ts` | `src/test/utils.test.ts` |
  | `src/lib/adminAuth.ts` | `src/test/adminAuth.test.ts` |
  | `src/lib/githubWorkflow.ts` | `src/test/githubWorkflow.test.ts` |
  | `src/lib/adminFormUtils.ts` | `src/test/adminFormUtils.test.ts` |
  | `src/lib/tvShowUtils.ts` | `src/test/tvShowUtils.test.ts` |
  | `scripts/add-media-entry.mjs` | `src/test/add-media-entry.test.ts` |

- **Exclusions (by policy):** `src/components/ui/**` (vendored shadcn/ui primitives — generated code, exercised indirectly), `src/main.tsx` (bootstrap), `src/test/**`, `vite-env.d.ts`, CSS files.
- **Coverage must stay at 100%** (lines/branches/functions/statements), enforced by the `thresholds` block in `vitest.config.ts` — `npm test` (which runs `vitest run --coverage`) fails the moment any of the four metrics drops below 100% for any included file. The `coverage.include`/`coverage.exclude` lists in `vitest.config.ts` mirror the mapping table and exclusions above (plus `scripts/**/*.mjs`).
  - **`/* v8 ignore next */` (or `next N` / `start`…`stop`) is allowed only for code that is genuinely unreachable through the app's real behavior** — e.g. a fallback branch made impossible by an exhaustive `Record<Platform, string>`, or a `React Router` render-prop field (`isPending`) that can't be `true` without a data router this app doesn't use. Every ignore comment must carry a one-line reason directly above it. Do not reach for it to avoid writing a reasonably achievable test — prefer exporting a private helper and unit-testing it directly, spawning a real subprocess, or using fake timers/mocked `fetch`/`localStorage` before ignoring.
- **Lint must stay clean:** `npm run lint` reports zero problems as of 2026-07-05 — keep it that way. The only exemption is `react-refresh/only-export-components` for `src/components/ui/**` (vendored files export variants alongside components by design; scoped off in `eslint.config.js`).
- Framework: Vitest + Testing Library + jsdom (`vitest.config.ts`; shared mocks for matchMedia/ResizeObserver/scrollIntoView/scrollBy in `src/test/setup.ts`). Radix `Tabs` triggers activate on `onPointerDown`, not `onClick` — a bare `fireEvent.click` won't switch tabs in jsdom; fire `pointerDown`/`mouseDown`/`pointerUp`/`mouseUp`/`click` in sequence (see the `clickTab` helper in `admin.test.tsx`). Radix `Select` does respond to a plain `fireEvent.click` on the trigger and then the option.
- Run `npm test` before handing work over — all suites must pass **and** coverage must report 100%. CI runs the suite on every push to `master` and a failure (test or coverage) blocks deployment.

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

## Admin add-media flow constraints (mandatory)

- **Never commit the plaintext admin password anywhere** — not in this file, not in commit messages, not in code comments.
- **The browser must never hold a repo-content-write credential.** The GitHub PAT pasted into the admin page's "Connect GitHub" step must be a fine-grained token scoped to **Actions: Read and write only** on this one repo — it exists only to call `workflow_dispatch`. The token that actually writes `mediaData.ts` and opens the PR is GitHub's own auto-issued `GITHUB_TOKEN` inside `.github/workflows/add-media.yml`, which never leaves that workflow run. Do not "simplify" this by having the browser call GitHub's Contents API directly with a stronger token.
- **`scripts/add-media-entry.mjs`'s splice logic is coupled to `mediaData.ts`'s current shape** — the two-marker approach (`export const moviesData` → `export const tvShowsData` → `// Helper functions`) assumes those exact, unique strings exist in that order. If `mediaData.ts` is restructured, update the script (and its tests) in the same commit.
- `/admin` must stay unlinked from `Header.tsx` and any other nav — it's reachable only by typing the URL.

## Data updates

The entire catalog lives in `src/data/mediaData.ts` (`moviesData` / `tvShowsData`, keyed by language). Follow the `Movie`/`TVShow` interfaces; a new language must be added to `LANGUAGES` first (the data-integrity tests enforce this — an entry keyed under a language not in `LANGUAGES` is invisible in the UI's filters). There is no backend — do not add fetching for catalog data.

## Build, test, deploy

- On this machine node/npm are not on PATH — prefix commands with:
  `export PATH=/Users/shoaib.rayeen/tools/node-v22.22.2-darwin-arm64/bin:$PATH`
- Before any push: `npm test && npm run build && npm run lint` must all pass clean (`npm test` runs with `--coverage` and enforces the 100% thresholds). CI runs test + build and a failure blocks deployment.
- Every push/merge to `master` deploys to https://shoaibrayeen.github.io/cinema-hub/ via `.github/workflows/deploy.yml`. There is no staging environment.
- Dev server: `npm run dev` → http://localhost:8080/cinema-hub/ (note the base path — the root URL shows Vite's hint page).
- The repo owner commits and pushes; do not commit or push unless explicitly asked.
