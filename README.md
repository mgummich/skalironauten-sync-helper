# Skalironauten Sync Helper

Daily standup web app: standup notes, a mood check, and the German "Aktionstage"
(action days) for any date. React + Vite + Tailwind, no backend — all state lives
in web storage in the browser.

Live: https://<user>.github.io/skalironauten-sync-helper/
Docs: `/docs` on the deployed site.

## Requirements

Node 22 (the version CI and the Pages deployment build with).

## Development

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm test         # vitest, unit tests for the date and region logic
npm run build    # tsc + vite build -> dist/
npm run preview  # serve the built dist/
```

Tests live next to the code they cover (`*.test.ts`). Only the pure logic in
`src/modules/data/` is covered: German holiday and workday rules in `dateUtils.ts`,
and the scraped-region cleanup in `normalizeRegion.ts`. There are no component tests.

## Docker

```bash
docker compose up --build   # http://localhost:8080
```

Builds the app and serves `dist/` with nginx (`Dockerfile`, `nginx.conf`).

## Storage

`src/modules/data/storage.ts` is the single backing store for everything
persisted. Local dev and the container build use `localStorage`, so notes and
moods survive a restart. The public GitHub Pages build sets
`VITE_EPHEMERAL_STORAGE=true` and uses `sessionStorage` instead, so state on the
public site dies with the browser tab. Key layout is documented in
`ARCHITECTURE.md`.

## Data

- `aktionstage.json` — the action days, imported directly by `src/modules/data/dataLoader.ts`.
- `mood-scales/` — mood scale images and clips, picked up by `import.meta.glob` in
  `src/modules/mood/moodManifest.ts`. The filename is the stable id that gets persisted.

## Deployment

Pushing to `main` runs `.github/workflows/pages.yml`: it builds with ephemeral
storage, copies `docs/` into the output, and publishes to GitHub Pages. Enable
Pages with source "GitHub Actions" in the repository settings once, then it is
automatic. `.github/workflows/ci.yml` runs the tests and the build on every pull request.

## Layout

See `ARCHITECTURE.md` for the module boundaries and the storage contracts.
