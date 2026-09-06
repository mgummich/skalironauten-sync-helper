# Skalironauten Sync Helper

Daily-standup companion for a small German dev team. It does one job, in under a
minute at 09:00: read today's **Aktionstag** (German commemorative day), do the
**Mood Check** (a 3×3 meme grid and a number from 1 to 9), drop the image into
the team chat.

React 19 + Vite 8 + Tailwind v4, **no backend** — everything lives in the
browser's own storage. No accounts, no server, no sync between devices, and no
third-party requests: the font is self-hosted and production builds ship a strict
Content-Security-Policy.

- **Live:** https://mgummich.github.io/skalironauten-sync-helper/
- **Docs:** https://mgummich.github.io/skalironauten-sync-helper/docs/ — a German
  handbook covering how to use the app, the architecture, the storage contracts
  and the design system.

---

## Using the app

Three tabs, and the middle of the screen tells you where you are.

### Heute

The morning routine, top to bottom:

1. **Date row** — arrows step one day; the badges say whether it is a workday and
   whether it is the first workday of the week or month. `Zu heute` appears only
   when you have navigated away from today.
2. **Aktionstag card** — name, category, region, description and a Wikipedia link.
   Days with several entries get a stepper (`1 / 3`); on desktop all of them are
   listed on the right.
3. **Mood card** — `Mood Check starten` opens a random meme grid. Tap a field 1–9,
   then `Stimmung N speichern`. **Tapping a number never saves**, and the dialog
   never opens on its own. `Zufällig wählen` draws a different image; `Ändern`
   re-opens a saved check.
4. **`Herunterladen` / `Bild kopieren`** — the image goes into the Teams chat:
   copy puts it on the clipboard as PNG (falling back to a download where the
   clipboard API is unavailable), download saves the original file.

### Kalender

One month per screen on mobile, all twelve on desktop, switchable between 2026 and
2027. Each cell shows how many Aktionstage fall on that day, plus an amber dot for
the first workday of the week. Search, category chips and a type-ahead region
picker (227 regions) filter the counts as well. Tapping a day opens its list, and
`Im Standup anzeigen` jumps back to Heute with that entry active.

### Moods

The image library, sorted alphabetically, filtered by *Alle / Ungenutzt / Genutzt /
Eigene* with counts. Opening an image shows it large along with every day it was
picked; if it has been used before, an amber note says so — using it again is still
allowed. `Für heute wählen` sets it as today's Mood Check image and opens the check.
`Hochladen` adds your own image (title required, source link optional); it stays on
this device.

### Keyboard and accessibility

`Tab` reaches every control with a visible focus ring, arrow keys move within the
1–9 selector, `Esc` closes any dialog and focus returns to the button that opened
it. Reduced-motion settings switch every transition off.

> **Where does my data live?** Only in this browser, on this device. The public
> GitHub Pages build keeps it in `sessionStorage`, so it is gone when the tab
> closes; a local build keeps `localStorage`, so it survives a restart.

---

## Development

Requires **Node 24** — the version CI and the Pages deployment build with.

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm test         # vitest, unit tests for the date and region logic
npm run build    # tsc + vite build -> dist/
npm run preview  # serve the built dist/
```

Dev builds show a thin **DEV** bar at the top: jump to any date, or wipe the local
store — handy for reproducing the first workday of a week or an empty state.

Tests live next to the code they cover (`*.test.ts`). Only the pure logic in
`src/modules/data/` is covered: German holiday and workday rules in `dateUtils.ts`,
and the scraped-region cleanup in `normalizeRegion.ts`. There are no component tests.

### Where things are

```
src/modules/
├── data/      # aktionstage.json index, holiday/workday rules, storage contracts
├── mood/      # image library (built-in + uploads), draw logic, gallery, upload
├── daily/     # the Heute view: Aktionstag card, mood card, Mood Check dialog
├── calendar/  # month grids, filters, region picker, day detail
└── ui/        # app shell, header/tabs, Sheet dialog, shared class tokens
```

`ARCHITECTURE.md` has the module boundaries and the full storage key table.

---

## Data and assets

- `aktionstage.json` — 930 action days, imported directly by
  `src/modules/data/dataLoader.ts`.
- `mood-scales/` — 273 mood scale images, picked up by `import.meta.glob` in
  `src/modules/mood/moodManifest.ts`. The filename is the stable id that gets
  persisted. All WebP, capped at 1200px wide. Add new ones in the same format:

  ```bash
  magick input.jpg -resize '1200>' -strip -quality 78 mood-scales/name.webp
  ```

- Uploaded images are **not** part of the repository: the blob goes into IndexedDB
  and the metadata into the normal store, both per device.
- `design_handoff_sync_helper/` — the design source. **v4 (Bahn-Komposition)** is
  binding; v3, v2 and the dark v1 are reference only. The README there describes
  every screen, state and string.

## Storage

`src/modules/data/storage.ts` is the single backing store for everything persisted.
Local dev uses `localStorage`; the public GitHub Pages build sets
`VITE_EPHEMERAL_STORAGE=true` and uses `sessionStorage` instead. Image usage
counts are never stored — they are derived from the saved `mood:*` entries, so a
second counter cannot drift. Leftover `notes:*` keys from the removed
Standup-Notizen are deleted once at startup. Key layout is in `ARCHITECTURE.md`.

## Deployment

Pushing to `main` runs `.github/workflows/pages.yml`: it builds with ephemeral
storage, copies `docs/` into the output, and publishes to GitHub Pages. Enable Pages
with source "GitHub Actions" in the repository settings once, then it is automatic.
`.github/workflows/ci.yml` runs the tests and the build on every pull request, and
Dependabot keeps npm packages and pinned GitHub Actions current with one grouped
weekly PR.

Production builds inject a `Content-Security-Policy` meta tag
(`default-src 'self'`, images additionally from `blob:` for uploads) via a small
plugin in `vite.config.ts`; the dev server skips it because HMR needs inline
scripts.
