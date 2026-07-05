# CinemaHub

A personal catalog of movies and TV shows — browse by genre, language, platform, and watch status.

**Live:** https://shoaibrayeen.github.io/cinema-hub/

## Tech Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router 6
- Vitest + Testing Library

## Development

Requires Node.js 20+.

```sh
npm install
npm run dev        # serves at http://localhost:8080/cinema-hub/
npm test           # run the test suite once
npm run build      # production build to dist/
npm run preview    # preview the build at http://localhost:4173/cinema-hub/
```

Note: the app is configured with the base path `/cinema-hub/` (see `vite.config.ts`), so the dev and preview servers serve it under that path rather than at the root.

## Deployment

Every push to `master` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which installs dependencies, runs the tests, builds the app, and publishes `dist/` to GitHub Pages as a project site under `/cinema-hub/`.

Client-side routing on GitHub Pages uses the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) pattern: `public/404.html` redirects unknown deep links (e.g. a hard refresh on `/cinema-hub/movies`) back to `index.html` with the path encoded in the query string, and a small script in `index.html` restores the original URL before React Router takes over.

## Project Structure

- `src/pages/` — `Index`, `Movies`, `TVShows`, `NotFound`
- `src/components/` — layout and UI components (shadcn/ui under `src/components/ui/`)
- `src/data/mediaData.ts` — the movie and TV show catalog data

## Architecture

See [architecture.md](architecture.md) for the full architecture and [architecture.svg](architecture.svg) for the flow diagram. Both are kept in sync with every change (see [CLAUDE.md](CLAUDE.md)).
