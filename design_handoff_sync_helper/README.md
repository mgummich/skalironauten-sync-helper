# Handoff: Skalironauten Sync Helper (Bahn-Look, v2)

## Overview
Daily-standup companion for a small German dev team. One job, under a minute at 09:00: read today's **Aktionstag** (commemorative day from a 930-entry list), do the **Mood Check** (random meme scale image + 1–9), type three lines (Gestern / Heute / Blocker), copy the formatted standup text. Local-only (localStorage), no accounts, no backend, no team view.

Priority (changed from earlier brief): **Aktionstag and Mood Check are the focus**, standup notes are compact routine.

## About the Design Files
`Skalironauten Sync Helper v2 -Bahn-Look-.dc.html` is a **design reference built in HTML** (static artboards on a pan/zoom canvas), not production code. Recreate it in the target stack: **React + Tailwind v4 + lucide-react**. Every value below maps to a Tailwind utility. `Skalironauten Sync Helper.dc.html` is the superseded v1 (dark theme) — reference only.

## Fidelity
**High-fidelity.** Colors, type, spacing, states and copy are final. Match pixel-close using Tailwind classes; don't port the inline styles literally.

## Visual direction
Rail-signage inspired, deliberately un-"app-store": red top bar, white flat surfaces on light gray, hairline borders, tight radii (4/6/8), tabular-numeric dates, one red CTA per screen. No gradients, no illustrations, no emoji as icons. Not a Deutsche Bahn product: no DB logo, no DB Type font, no copied UI.

## Screens

### 1. Heute (primary) — artboards 1a, 1b (mobile 375), 1c (desktop 1280)
Order top→bottom (mobile) / layout (desktop):

1. **Date row** — prev/next buttons 44×44 (`rounded-md border border-gray-300 text-gray-700`), centered weekday `text-sm text-gray-600` + date `text-xl font-semibold tracking-tight` (desktop: `text-3xl`, one line "Dienstag, 1. September 2026"). Below: badges (28px pills, `text-sm font-medium rounded-full px-2.5`): Arbeitstag `bg-emerald-100 text-emerald-700`; Wochenende `bg-gray-200 text-gray-700`; "1. Arbeitstag der Woche" / "1. Arbeitstag des Monats" `bg-amber-100 text-amber-800`. "Zu heute" outline pill appears only when date ≠ today.
2. **Aktionstag card (hero)** — white, `border border-gray-300 border-t-4 border-t-red-600 rounded-lg shadow-sm p-5` (desktop `px-8 py-7`). Content: label `text-sm font-semibold uppercase tracking-[0.08em] text-red-700` "AKTIONSTAG" (desktop "AKTIONSTAG · 2 VON 3"); name `text-3xl font-bold leading-[1.1] tracking-tight text-balance` (desktop `text-[44px] leading-[1.05]`); chips row: category chip `bg-gray-200 text-gray-700` + region `text-sm text-gray-600`; description `text-base text-gray-700 leading-relaxed text-pretty` (desktop `text-lg max-w-[60ch]`); footer row separated by `border-t border-gray-200 pt-2`: Wikipedia link `text-sm font-semibold text-red-700` with `ExternalLink` 16px, right: "Weiter: {next name}" `text-sm text-gray-600`. Stepper (mobile, in header row): ChevronLeft/Right 44×44 ghost buttons, `1 / 3` `text-sm font-semibold tabular-nums`; prev disabled → `text-gray-400`. Desktop: two-column grid `1fr 320px gap-10`; right column `border-l border-gray-200 pl-6` lists all entries of the day (1–6) as 56px rows (name `text-base font-semibold`, meta `text-sm text-gray-600`); active row `bg-gray-100 border border-gray-300` + "Aktiv" `text-red-700`. Stepper on desktop sits next to the Wikipedia link (40×40 outline buttons).
   **Empty state (1b):** same card with `border-t-gray-300`, label gray-600, title "Heute kein Aktionstag." `text-[22px] font-semibold text-gray-700`, line "Nächster: Montag, 7. September – <link>Tag der Salami</link>".
3. **Mood card** — white `border rounded-lg p-4`.
   - *Pending, first workday of week (1a):* border `border-amber-500`; row: 64px thumbnail of today's mood image (`rounded border border-gray-300`, object-cover) + "Mood Check" `text-lg font-semibold` + "Erster Arbeitstag der Woche – noch offen" `text-sm font-medium text-amber-800`; full-width button 48px `bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md` "Mood Check starten". **Never auto-open.**
   - *Pending, normal day (1c):* border gray-300, thumbnail 88px, copy "Noch keine Stimmung für heute. Ein Bild, eine Zahl von 1 bis 9.", same red button.
   - *Saved (1b):* single row: thumbnail 56px, "Stimmung **7** von 9" (`text-lg font-semibold`, number `text-red-700`), "Mood Check gespeichert · 09:02" `text-sm text-gray-600`, "Ändern" 44px outline button.
4. **Standup-Notizen** — no card on mobile (section on page bg); desktop: white card `p-5`. Header row: "Standup-Notizen" `text-base font-semibold` + status `text-sm text-gray-600` ("wird pro Tag gespeichert" / "gespeichert"). Three **single-line inputs** 44px, `text-base text-gray-900 bg-white border border-gray-300 rounded px-3`, labels `text-sm font-medium text-gray-700` (Gestern / Heute / Blocker; placeholders "Was war gestern?", "Was steht heute an?", "Keine"). Desktop: 3-column grid. Focus: `border-gray-900 ring-2 ring-gray-900 ring-offset-2 ring-offset-white`. Auto-grow to textarea on overflow is acceptable.
   **Copy button** 48px (desktop 44px, inline) `bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-md` with `Copy` icon, "Standup-Text kopieren". **Success:** `bg-emerald-700 text-white`, `Check` icon, "Kopiert", helper line below `text-sm text-gray-600 text-center` "Datum, Aktionstag und Notizen sind in der Zwischenablage." Reverts after 2 s. Desktop hint next to button: "Datum · Aktionstag · Gestern / Heute / Blocker".

Desktop grid under hero: `grid-cols-[5fr_7fr] gap-6` → Mood | Notizen. Content width 1120 centered, `py-8`.

**Header (all screens):** mobile 56px / desktop 64px, `bg-red-600 text-white px-4/px-8`; brand mark = 32/36px `bg-white rounded-md text-red-600` with lucide `Sparkles` 18/20px; name `text-base/text-lg font-semibold tracking-tight`. Desktop nav: segmented pill `bg-white/15 border border-white/30 rounded-md p-1`, active `bg-white text-gray-900`, inactive `text-white`. **Mobile: bottom tab bar** 64px `bg-white border-t border-gray-200`, two tabs (Sun "Heute", CalendarDays "Kalender"), 22px icon + `text-sm`, active `text-red-700 font-semibold`, inactive `text-gray-600`.

### 2. Mood Check — artboards 2a (loading), 2b (selected), 2c (desktop saved)
**Pattern:** bottom sheet on mobile (`rounded-t-xl`, handle 40×4 gray-300, `p-4 pb-6`), centered dialog 640px on desktop (`rounded-lg p-6`). Backdrop `bg-gray-900/55`. `role=dialog aria-modal`, focus trapped, Escape/backdrop/X close, focus returns to trigger.
- Header: "Mood Check" `text-xl font-semibold` (desktop `text-[22px]`), date `text-sm text-gray-600`, X button 44×44 ghost.
- **Image area:** fixed `aspect-[4/3]` (mobile) / `aspect-[16/10]` (desktop), `bg-gray-100 border border-gray-200 rounded-md overflow-hidden`; image `object-contain` (source images 1000–2400px wide, wild ratios — never crop, never let height jump). Loading: `ImageIcon` 28px + "Bild wird geladen …" `text-sm text-gray-600`; zoom button disabled `text-gray-400`. Loaded: caption chip bottom-left (`bg-white/90 border rounded text-sm`, e.g. "Welcher Remy bist du heute?"), zoom button 44×44 bottom-right (`ZoomIn`) opens full-size lightbox. **Image is drawn once per open and never changes while the user changes the number.**
- **Selector:** label "Welches Feld bist du heute? (1–9)" `text-sm font-medium`. Mobile: **3×3 grid** (mirrors the meme grid), buttons 48px `bg-gray-100 border border-gray-300 rounded-md text-lg font-semibold`; desktop: one row of 9. Selected: `bg-red-600 border-red-700 text-white font-bold` (+ focus ring when focused). `role=radiogroup`, arrow-key navigation.
- **Save:** 48px button. No selection → `bg-gray-200 text-gray-600` disabled "Stimmung speichern"; selected → `bg-red-600 text-white` "Stimmung 7 speichern". **Selecting a number never saves.** After save: status row `text-emerald-700 font-semibold` with Check "Gespeichert: 7 von 9" + "Schließen" 44px `bg-gray-100 border` button; selector stays visible (re-pick + save again allowed).

### 3. Kalender — 3a (mobile), 3b (desktop)
- **Filters:** search input 44px (`Search` icon, placeholder "Aktionstag suchen …", 16px text); category chips 36px pills (Alle / Essen & Trinken / Kultur / Gesundheit / Kurioses), selected `bg-red-600 text-white`, others outline; **Region** = 44px button "Region: Alle" opening a **searchable picker** (227 values — combobox with type-ahead, not a plain select). Desktop toolbar: year segmented 2026|2027 (`bg-gray-200 p-1`, active white + `shadow-sm`), search 320px, Kategorie dropdown, Region picker, spacer, "Heute".
- **Mobile navigation:** one month per screen: prev/next 44px, month title 44px button `text-lg font-semibold` with ChevronDown (opens month/year jump), "Zu heute springen" 44px outline button below grid. No stacked 12 months.
- **Grid:** Monday-first, weekday header Mo–So `text-sm text-gray-600`. Cells: mobile 56px tall, desktop mini 48px; `rounded-lg`, `flex-col items-center justify-center gap-0.5`. Workday `bg-white border border-gray-200 text-gray-900 text-sm font-medium`; weekend/holiday `bg-gray-100 text-gray-600`; today `border-2 border-gray-900 font-bold`; selected `bg-red-600 border-red-600 text-white`. Bottom row of each cell: amber dot 6px (`bg-amber-600`) if first workday of week, then Aktionstag count `text-sm text-gray-600` (omit if 0). Desktop: 12 months in `grid-cols-4 gap-x-5 gap-y-6`, month title `text-base font-semibold`.
- Legend `text-sm text-gray-600`: Arbeitstag / Wochenende·Feiertag / • 1. Arbeitstag der Woche / Heute / "Zahl = Aktionstage".
- Holidays: bundesweite Feiertage (2026: 01.01, 03.04, 06.04, 01.05, 14.05, 25.05, 03.10, 25.12, 26.12; compute 2027). First-workday-of-week = workday where all earlier days Mon..(d-1) of that ISO week are weekend/holiday.

### 4. Tag-Detail — 3c
Same sheet pattern as Mood Check (popover/dialog on desktop). Header: weekday `text-sm text-gray-600`, date `text-[22px] font-semibold`, badges, X. Section label "3 AKTIONSTAGE" `text-sm font-medium uppercase tracking-[0.06em] text-gray-600`. Rows 56px min: name `text-base font-semibold`, meta "Kategorie · Region" `text-sm text-gray-600`, ChevronRight; first row highlighted `bg-gray-100 border border-gray-300`, others `hover:bg-gray-100`. CTA 48px `bg-red-600` "Im Standup anzeigen" + ArrowRight → navigates to Heute for that date with the tapped entry active.

## Interactions & Behavior
- **Standup text format** (clipboard, plain text):
  ```
  Standup – Montag, 7. September 2026
  Aktionstag: Tag der Salami (Essen & Trinken, USA)
  Gestern: …
  Heute: …
  Blocker: … (or "Keine")
  ```
  Include the *active* Aktionstag only; omit line if none.
- Notes persist per ISO date key on blur/keystroke (debounced).
- Aktionstag stepper wraps not; prev disabled at 1, next disabled at n. Change = 150ms crossfade.
- Mood: image chosen randomly per dialog open (avoid repeating last 5); saved value `{date, value, imageId, time}`.
- Copy success: 200ms color transition, hold 2s, 200ms back. `aria-live=polite` on status text.
- Sheet/dialog open: 200ms ease-out, backdrop fade + 16px slide-up (dialog: fade + scale 0.98→1). Close 150ms.
- **No infinite animations.** `motion-reduce:` → all durations 0.
- Focus ring on every interactive element: `focus-visible:ring-2 ring-gray-900 ring-offset-2 ring-offset-white` (on red header: `ring-white`).
- Touch targets ≥44×44 mobile, ≥40 desktop; ≥8px between targets.
- Responsive: single column <768px with bottom tabs; ≥1024px desktop layout with header tabs.

## State Management (localStorage)
- `notes:{YYYY-MM-DD}` → `{gestern, heute, blocker}`
- `mood:{YYYY-MM-DD}` → `{value:1-9, imageId, savedAt}`
- `aktionstagIndex:{YYYY-MM-DD}` → active entry index (optional, resets daily)
- `ui` → `{lastRoute, calendarMonth, filters:{q, category, region}}`
- Derived: isWorkday, isFirstWorkdayOfWeek, isFirstWorkdayOfMonth, entriesForDate(date, filters).
- Data: `aktionstage.json` (930 entries: name, date rule, category ∈ 4, region ∈ 227, description, wikipediaUrl), `moodImages.json` (id, url, caption, width, height).

## Design Tokens (Tailwind v4)
**Colors** (contrast on white / on gray-100):
- Page `gray-100 #f3f4f6`; surfaces `white`; borders `gray-300 #d1d5db` (primary), `gray-200 #e5e7eb` (hairline)
- Text `gray-900 #111827` 17.7 / 16.1 · `gray-700 #374151` 10.3 / 9.4 · `gray-600 #4b5563` 7.6 / 6.9 (lightest allowed text)
- Accent `red-600 #dc2626` (header, CTA, selected; white text 4.8:1) · `red-700 #b91c1c` (links, active tab, hover; 6.5:1)
- Amber `amber-100 #fef3c7` + text `amber-800 #92400e` (6.4:1), dot `amber-600 #d97706`, pending border `amber-500 #f59e0b`
- Emerald `emerald-100 #d1fae5` + text `emerald-700 #047857` (4.8:1); success button `emerald-700` + white (5.5:1)
- Chip `gray-200` + `gray-700` (8.3:1). Focus ring `gray-900`. Backdrop `gray-900/55`.

**Type** — `Source Sans 3` (Google Fonts; swap in your sans if you have one), weights 400/500/600/700, `font-sans` stack after it.
44px/700 hero desktop · 30px/600 date desktop, 30px/700 hero mobile · 22px/600 dialog titles · 20px/600 date mobile · 18px/600 card titles · 16px body, inputs, buttons · **14px minimum** (labels, badges, meta). Line-height 1.5 body, 1.1–1.2 titles.

**Spacing** — 4px base: 8 / 12 / 16 / 24 / 32. Page padding 16 (mobile) / 32 (desktop). Card padding 16–20 (mobile) / 20–32 (desktop). Gap between cards 16 / 24.

**Radius** — cards `rounded-lg` 8 · buttons/inputs `rounded-md` 6 / `rounded` 4 · badges/chips `rounded-full` · sheet top 12 · phone artboard 28 (design only).

**Shadow** — hero card only: `shadow-sm` (0 1px 3px rgba(0,0,0,.08)). Dialog: `0 24px 60px rgba(0,0,0,.3)`.

**Motion** — 150ms (stepper, selection), 200ms (dialog open, copy success), 2s hold on success; `motion-reduce` → 0.

## Assets
- Icons: lucide-react only — Sparkles, ChevronLeft, ChevronRight, ChevronDown, Copy, Check, ExternalLink, Sun, CalendarDays, Search, X, ZoomIn, Image, ArrowRight, Smile.
- Brand mark: Sparkles in a rounded square (white square with red icon on the red header). Original brief specified a gradient square — restored gradient (`from-red-600 to-red-800`) is acceptable if the mark is shown on white.
- Mood images: team-provided meme grids (3×3), 1000–2400px wide, arbitrary aspect ratios — placeholders in the design.
- Aktionstag data: team-provided 930-entry list.

## Files
- `Skalironauten Sync Helper v2 -Bahn-Look-.dc.html` — current design (artboards 1a–1c Heute, 2a–2c Mood Check, 3a–3c Kalender/Tag-Detail, 4a tokens + decisions, in German).
- `Skalironauten Sync Helper.dc.html` — v1 dark theme, superseded.
- `support.js` — preview runtime for the .dc.html files; not part of the product.
