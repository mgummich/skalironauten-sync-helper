# Architecture — Skalironauten Sync Helper

Daily standup web app: React 19 + Vite 6 + Tailwind v4 + lucide-react. No backend,
no API, no environment variables at runtime — the build is a static bundle and all
state lives in the browser.

New to the code? Read `README.md` first for what the app does and how to run it.
This file is about boundaries and contracts.

---

## 1. Subsystem layout

Five isolated subsystems under `src/modules/`. Dependencies run one way only:
`ui` → `daily` / `calendar` / `mood` → `data`. The data layer knows nothing about
React.

```
src/
├── main.tsx         # awaits initMoodLibrary(), then renders
└── modules/
    ├── data/        # aktionstage index, holiday/workday rules, storage contracts
    ├── mood/        # image library (built-in + uploads), draw logic, gallery, upload
    ├── daily/       # Heute view: Aktionstag card, mood card, notes, copy
    ├── calendar/    # month grids, filters, region picker, day detail
    └── ui/          # app shell, header/tabs, Sheet dialog, shared class tokens
```

### `data/` — pure logic

Reads `aktionstage.json` (930 items) without mutating it and builds an in-memory
index keyed by month/day (`dataLoader.ts`). `normalizeRegion.ts` cleans up the 227
scraped region names. `dateUtils.ts` owns the calendar rules: a workday is Mon–Fri
minus the bundesweite Feiertage (Easter computed via the anonymous Gregorian
algorithm), and first-workday-of-week / -month derive from that. `storage.ts` is
the only place storage keys are created.

### `mood/` — images and their history

- `moodManifest.ts` — discovers `mood-scales/*.webp` with `import.meta.glob`; Vite
  serves them in dev and copies them hashed into `dist/assets`. The **filename** is
  the stable identity that gets persisted.
- `moodLibrary.ts` — merges built-in images (titled `Mood-Skala 001…`) with uploaded
  ones into a single alphabetical list, and derives usage from the saved `mood:*`
  entries. `initMoodLibrary()` runs once before the first render: it turns the
  uploaded blobs into object URLs and drops orphans, so `getMoodImageUrl(id)` can
  stay synchronous everywhere else.
- `moodBlobs.ts` — a ~30-line IndexedDB wrapper (`sync-helper` / `moodBlobs`).
  Uploaded images are far too large for `localStorage`; only their blobs go here.
- `moodManager.ts` — draws an image per dialog open, preferring never-used ones and
  always avoiding the last five (`moodRecent`); keeps the draw for the day so the
  card thumbnail and the dialog show the same picture. A gallery pick
  (`moodPick:{date}`) overrides the draw.
- `MoodsView.tsx` / `MoodDetailSheet.tsx` / `MoodUploadSheet.tsx` — the gallery, the
  detail sheet with the usage list and re-use warning, and the upload form.
  `MoodsView` doubles as the picker inside the Mood Check via its `pickMode` prop.

### `daily/` — the primary view

Date row with badges, the Aktionstag hero card with its stepper (desktop: all
entries of the day as a list), the mood card (**never** auto-opens the dialog),
three single-line notes and the copy button producing the plain-text format from
the handoff. `MoodCheckModal` holds one image per open — changing the number never
changes the picture, and selecting a number never saves.

### `calendar/` — dates at a glance

Mobile: one month per screen with a month/year jump. Desktop: twelve months for
2026 or 2027. Search, category chips and a searchable region picker; the per-cell
counts respect the active filters. The day detail sheet hands a date plus an entry
index back to the daily view.

### `ui/` — shell and design tokens

Layout in the v4 Bahn-Komposition look (see `design_handoff_sync_helper/README.md`):
white app bar with a red brand mark, desktop tabs with a red underline, mobile bottom
tabs with a red top indicator. `Sheet.tsx` is a native `<dialog>` — bottom sheet on
mobile, centered dialog on desktop — which gives focus trapping, `Esc` and focus
return for free. `cls.ts` holds the shared class fragments (pill buttons, filled
inputs, cards, focus ring) as string constants so Tailwind picks them up.
`DevToolbar.tsx` renders in dev builds only.

---

## 2. State persistence

`storage.ts` exports the single `store` every reader and writer uses:
`localStorage` for local dev and the container build, `sessionStorage` when built
with `VITE_EPHEMERAL_STORAGE=true` (the public GitHub Pages deployment), where
state dies with the tab.

| Key | Type | Description | Default |
|-----|------|-------------|---------|
| `notes:{YYYY-MM-DD}` | `{ gestern, heute, blocker }` | Standup notes per day; debounced while typing, flushed on blur. | — |
| `mood:{YYYY-MM-DD}` | `{ value 1-9, imageId, savedAt }` | Saved Mood Check for that day. | — |
| `moodDraw:{YYYY-MM-DD}` | `string` | Image drawn for a pending (unsaved) check, so thumbnail and dialog match. Cleared on save. | drawn on demand |
| `moodPick:{YYYY-MM-DD}` | `string` | Image chosen from the gallery for that day; overrides the draw. Cleared on save. | — |
| `moodRecent` | `string[]` | Last 5 drawn image ids; new draws avoid them. | `[]` |
| `moodImages` | `{ id, title, sourceUrl?, builtIn, width, height, addedAt }[]` | Metadata of uploaded images. The pixels live as blobs in IndexedDB, linked by `id`. | `[]` |
| `ui` | `{ lastRoute, calendarMonth, filters:{q,category,region} }` | Last tab (`daily` / `calendar` / `moods`), calendar month, filters. | defaults |

**Derived, never stored:** `isWorkday`, `isFirstWorkdayOfWeek`,
`isFirstWorkdayOfMonth`, `entriesForDate(date, filters)`, and image usage
(how often an image was picked and when) — the last one is read back out of the
`mood:*` entries so a second counter cannot drift out of sync.

---

## 3. Budgets and polish

- **Initial load** under 100 ms; the action-day index is built once at import time.
- **60 fps** on dialog opens, stepper changes and selection.
- **No infinite animations.** 150 ms for stepper and selection, 200 ms for dialogs
  and the copy success state, 2 s hold; `motion-reduce` drops every duration to 0.
- **Console stays clean** — zero unhandled warnings or errors through a full flow.
- Gallery images are `loading="lazy"`; the list is not virtualized (273 cards).

---

## 4. Assets

- `aktionstage.json` and `mood-scales/` stay at the repository root.
  `moodManifest.ts` discovers them with `import.meta.glob`; Vite hashes them into
  `dist/assets` on build, while the filename remains the persisted identity.
- Uploaded images never enter the repository: blob in IndexedDB, metadata in the
  store, both per device.
- `vite.config.ts` sets `base: './'` so the build works both under
  `user.github.io/repo/` and on a custom domain.
