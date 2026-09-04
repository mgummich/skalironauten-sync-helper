import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { MonthGrid } from './MonthGrid';
import { DayDetailModal } from './DayDetailModal';
import { RegionPicker } from './RegionPicker';
import { CATEGORIES, shortCategory, Filters } from '../data/dataLoader';
import { getGermanMonth } from '../data/dateUtils';
import { getUi, patchUi } from '../data/storage';
import { cx, BTN_TERTIARY, INPUT, FOCUS } from '../ui/cls';

interface Props {
  onShowInStandup: (date: Date, entryIndex: number) => void;
}

const YEARS = [2026, 2027];
const MONTHS = YEARS.flatMap((y) => Array.from({ length: 12 }, (_, m) => `${y}-${String(m + 1).padStart(2, '0')}`));

const thisMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const CalendarView = ({ onShowInStandup }: Props) => {
  const [filters, setFiltersState] = useState<Filters>(() => getUi().filters);
  const [month, setMonthState] = useState(() => {
    const saved = getUi().calendarMonth;
    return MONTHS.includes(saved) ? saved : MONTHS.includes(thisMonth()) ? thisMonth() : MONTHS[0];
  });
  const [year, setYear] = useState(() => Number(month.slice(0, 4)));
  const [inspect, setInspect] = useState<Date | null>(null);
  const [regionOpen, setRegionOpen] = useState(false);

  const setFilters = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setFiltersState(next);
    patchUi({ filters: next });
  };
  const setMonth = (m: string) => {
    setMonthState(m);
    patchUi({ calendarMonth: m });
  };
  const monthIdx = MONTHS.indexOf(month);
  const [mY, mM] = month.split('-').map(Number);
  const jumpToday = () => {
    const t = thisMonth();
    if (MONTHS.includes(t)) {
      setMonth(t);
      setYear(Number(t.slice(0, 4)));
    }
  };

  const categoryChip = (value: string, label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={filters.category === value}
      onClick={() => setFilters({ category: value })}
      className={cx(
        'h-9 shrink-0 rounded-full px-3.5 text-sm transition-colors motion-reduce:transition-none',
        filters.category === value
          ? 'border border-red-600 bg-red-600 font-semibold text-white'
          : 'border border-slate-400 font-medium text-slate-900 hover:bg-slate-100',
        FOCUS
      )}
    >
      {label}
    </button>
  );

  const search = (width: string) => (
    <div className={cx('relative', width)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden />
      <input
        type="search"
        aria-label="Aktionstag suchen"
        value={filters.q}
        onChange={(e) => setFilters({ q: e.target.value })}
        placeholder="Aktionstag suchen …"
        className={cx(INPUT, 'pl-9 lg:bg-white')}
      />
    </div>
  );

  const regionButton = (
    <button type="button" onClick={() => setRegionOpen(true)} className={cx('h-11 w-full px-4 text-base lg:w-auto', BTN_TERTIARY)}>
      Region:&nbsp;<span className="font-semibold">{filters.region || 'Alle'}</span>
      <ChevronDown className="ml-1 h-4 w-4" aria-hidden />
    </button>
  );

  const gridProps = { filters, selectedDate: inspect, onSelectDay: setInspect };

  return (
    <div>
      {/* Mobile */}
      <div className="lg:hidden">
        <h2 className="text-xl font-semibold">Kalender</h2>
        <div className="mt-3 space-y-3">
          {search('w-full')}
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
            {categoryChip('', 'Alle')}
            {CATEGORIES.map((c) => categoryChip(c, shortCategory(c)))}
          </div>
          {regionButton}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button type="button" aria-label="Vormonat" disabled={monthIdx === 0} onClick={() => setMonth(MONTHS[monthIdx - 1])} className={cx('h-11 w-11', BTN_TERTIARY)}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="relative">
            <span className="inline-flex h-11 items-center gap-1 px-3 text-lg font-semibold" aria-hidden>
              {getGermanMonth(mM - 1)} {mY} <ChevronDown className="h-5 w-5" />
            </span>
            <select
              aria-label="Monat und Jahr wählen"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={cx('absolute inset-0 h-full w-full cursor-pointer opacity-0', FOCUS)}
            >
              {MONTHS.map((m) => {
                const [y, mm] = m.split('-').map(Number);
                return (
                  <option key={m} value={m}>
                    {getGermanMonth(mm - 1)} {y}
                  </option>
                );
              })}
            </select>
          </div>
          <button type="button" aria-label="Nächster Monat" disabled={monthIdx === MONTHS.length - 1} onClick={() => setMonth(MONTHS[monthIdx + 1])} className={cx('h-11 w-11', BTN_TERTIARY)}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-3">
          <MonthGrid year={mY} monthIndex={mM - 1} size="mobile" {...gridProps} />
        </div>
        <Legend compact />
        <button type="button" onClick={jumpToday} className={cx('mt-4 h-11 w-full font-semibold', BTN_TERTIARY)}>
          Zu heute springen
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Jahr" className="flex rounded-md bg-slate-200 p-1">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                aria-pressed={year === y}
                onClick={() => setYear(y)}
                className={cx('h-9 rounded px-4 text-base font-semibold tabular-nums', year === y ? 'bg-white shadow-sm' : 'text-slate-700', FOCUS)}
              >
                {y}
              </button>
            ))}
          </div>
          {search('w-80')}
          <label className="relative">
            <span className="sr-only">Kategorie</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
              className={cx(INPUT, 'w-auto appearance-none bg-white pr-9')}
            >
              <option value="">Kategorie: Alle</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden />
          </label>
          {regionButton}
          <div className="flex-1" />
          <button type="button" onClick={jumpToday} className={cx('h-11 px-4 font-semibold', BTN_TERTIARY)}>
            Heute
          </button>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-x-5 gap-y-6">
          {Array.from({ length: 12 }, (_, m) => (
            <MonthGrid key={`${year}-${m}`} year={year} monthIndex={m} size="desktop" showTitle {...gridProps} />
          ))}
        </div>
        <Legend />
      </div>

      {inspect && <DayDetailModal date={inspect} onClose={() => setInspect(null)} onShowInStandup={onShowInStandup} />}
      {regionOpen && <RegionPicker value={filters.region} onChange={(region) => setFilters({ region })} onClose={() => setRegionOpen(false)} />}
    </div>
  );
};

const Legend = ({ compact }: { compact?: boolean }) => (
  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600" aria-label="Legende">
    {!compact && (
      <li className="flex items-center gap-1.5">
        <span className="h-3.5 w-3.5 rounded border border-slate-200 bg-white" aria-hidden /> Arbeitstag
      </li>
    )}
    <li className="flex items-center gap-1.5">
      <span className="h-3.5 w-3.5 rounded bg-slate-200" aria-hidden /> Wochenende / Feiertag
    </li>
    <li className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden /> 1. Arbeitstag der Woche
    </li>
    {!compact && (
      <li className="flex items-center gap-1.5">
        <span className="h-3.5 w-3.5 rounded border-2 border-slate-900" aria-hidden /> Heute
      </li>
    )}
    <li>Zahl = Aktionstage{compact ? '' : ' am Tag'}</li>
  </ul>
);
