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
│   └── ui/          # App shell, Raycast/Linear dark theme, Dev Toolbar, Showcase mode
```

### Module Responsibilities & Folder Boundaries
- **`data/`**: Pure logic and data layer. Reads `aktionstage.json` (930 items) without mutating source data. Builds fast memory index keyed by `MM-DD` and `YYYY-MM-DD`. Calculates workday status (`is_workday`), 1st-workday of week, and 1st-workday of month.
- **`mood/`**: Handles the ~307 images in `mood-scales/`. Tracks used image paths in `localStorage` (`used_mood_scales`), guarantees non-repeating selection, auto-resets when all images are used, stores 1–9 rating history (`mood_history`).
- **`daily/`**: Core standup view. Shows the 1st-workday Mood Check modal when applicable, and renders an interactive Action Day card carousel with category badges, character info, region, description, and Wikipedia links.
- **`calendar/`**: Full year 365-day inspector. Month grid visualization, workday/weekend distinction, action day density indicators, keyword & category search.
- **`ui/`**: Shell layout, Raycast/Linear dark design system, 60fps micro-interactions, responsive navigation, Dev Toolbar for date overrides, and Standalone Module Showcase runner.

---

## 2. State Persistence & LocalStorage Contracts

All persistent application state lives in `localStorage`:

| Key | Type | Description | Fallback / Default |
|-----|------|-------------|--------------------|
| `used_mood_scales` | `string[]` | Array of image filenames in `mood-scales/` already displayed. | `[]` (auto-resets on exhaustion) |
| `mood_history` | `MoodRating[]` | Historical mood check submissions `{ id, dateStr, rating (1-9), scaleImage, timestamp }`. | `[]` |
| `date_override` | `string \| null` | YYYY-MM-DD preset date override for testing date logic. | `null` (uses real system date) |
| `app_theme` | `'dark' \| 'light'` | App color scheme preference. | `'dark'` |

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
- `vite.config.ts` configures Vite dev server static middleware to serve `./mood-scales` directly under `/mood-scales/*` without duplicating files on disk.
- All image references use canonical path format `/mood-scales/{filename}`.

---

## 5. Standalone Showcase Mode

Every module exports a dedicated showcase component:
- `DataShowcase`: Live date query & 1st-workday tester.
- `MoodShowcase`: Live scale picker, non-repeat test, reset pool button.
- `DailyShowcase`: Standalone standup daily view & carousel tester.
- `CalendarShowcase`: Standalone 365-day calendar viewer.
- `UIShowcase`: Design system tokens, buttons, badges, modals showcase.

Accessible directly via the Dev Toolbar in the main UI shell.
