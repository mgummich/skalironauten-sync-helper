# Architecture - Skalironauten Sync Helper (`skalironauten-sync-helper`)

Production-grade Daily Standup Webapp built with React + Vite + Tailwind CSS + Lucide Icons.

---

## 1. Subsystem Layout

The codebase is strictly modularized into 5 isolated subsystems under `src/modules/`:

```
src/
├── modules/
│   ├── data/        # Data indexing, holiday/workday logic, date utils
│   ├── mood/        # Mood scales manifest, non-repeating localStorage rotation, rating history
│   ├── daily/       # Daily Standup view, 1st-workday Mood Check, Action Day Carousel
│   ├── calendar/    # 365-day calendar viewer, month grid, day inspector, search/filtering
│   └── ui/          # App shell, red header + bottom tabs (Bahn-Look), native <dialog> Sheet, Dev Toolbar
```

### Module Responsibilities & Folder Boundaries
- **`data/`**: Pure logic and data layer. Reads `aktionstage.json` (930 items) without mutating source data. Builds a memory index keyed by month/day, normalizes scraped region names (`normalizeRegion.ts`). Workday = Mon–Fri minus bundesweite Feiertage (computed via Easter, `dateUtils.ts`); 1st workday of ISO week / of month derived from that. `storage.ts` owns all localStorage keys.
- **`mood/`**: Handles the images in `mood-scales/`. Draws a random image per dialog open, avoiding the last 5 (`moodRecent`); keeps a per-day pending draw so the card thumbnail matches the dialog.
- **`daily/`**: Core standup view. Date row with badges, Aktionstag hero card with stepper (desktop: list of all entries), Mood card (never auto-opens the dialog), three single-line standup notes and the copy button (plain-text format from the handoff).
- **`calendar/`**: Mobile: one month per screen with month/year jump; desktop: 12 months for 2026/2027. Search, category chips, searchable region picker; counts per cell respect the filters. Day detail sheet hands a date + entry index to the daily view.
- **`ui/`**: Shell layout in the Bahn-Look design (see `design_handoff_sync_helper/README.md`): red header with desktop segmented nav, mobile bottom tabs, `Sheet` (native `<dialog>`: bottom sheet on mobile, centered dialog on desktop), Dev Toolbar (dev builds only).

---

## 2. State Persistence & LocalStorage Contracts

All persistent application state lives in `localStorage`:

| Key | Type | Description | Fallback / Default |
|-----|------|-------------|--------------------|
| `notes:{YYYY-MM-DD}` | `{ gestern, heute, blocker }` | Standup notes per day (debounced on keystroke, on blur). | none |
| `mood:{YYYY-MM-DD}` | `{ value (1-9), imageId, savedAt }` | Saved Mood Check for that day. | none |
| `moodDraw:{YYYY-MM-DD}` | `string` | Image drawn for a pending (unsaved) Mood Check, so card thumbnail and dialog match. Cleared on save. | drawn on demand |
| `moodRecent` | `string[]` | Last 5 drawn image ids; new draws avoid them. | `[]` |
| `ui` | `{ lastRoute, calendarMonth, filters:{q,category,region} }` | Last tab, mobile calendar month, calendar filters. | defaults |

---

## 3. Performance & Polish Budgets

- **Initial Load Time:** `< 100ms` (Index built lazily or statically pre-grouped by month/day).
- **Frame Rate:** `60fps` transitions on modal opens, card carousel slide changes, and rating clicks.
- **Asset Fallbacks:**
  - If a mood scale image fails to load (404/decode error), fallback to a high-contrast SVG placeholder scale with 1–9 numbered grid.
  - Video format (`.mp4`) in `mood-scales/` is rendered via standard HTML5 `<video autoPlay loop muted playsInline>` or gracefully handled.
- **Zero Error Logs:** Console must maintain 0 unhandled warnings/errors during full E2E flow.

---

## 4. Asset Handling Strategy

- `mood-scales/` and `aktionstage.json` remain at root directory.
- `moodManifest.ts` discovers them with `import.meta.glob`; Vite serves them in dev and copies them (hashed) into `dist/assets` on build. Filenames are the stable identity stored in `localStorage`.

