import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { ActionDay } from '../data/types';
import { shortCategory, nextDateWithEntries, getActionDaysForDate } from '../data/dataLoader';
import { formatDateNoWeekday, getGermanWeekday } from '../data/dateUtils';
import { cx, BTN_GHOST, BTN_OUTLINE, FOCUS } from '../ui/cls';

interface Props {
  date: Date;
  entries: ActionDay[];
  index: number;
  onIndexChange: (i: number) => void;
  onNavigateDate: (date: Date) => void;
}

const LINK = `inline-flex items-center gap-1 text-sm font-semibold text-red-700 hover:underline rounded ${FOCUS}`;

export const AktionstagCard = ({ date, entries, index, onIndexChange, onNavigateDate }: Props) => {
  if (entries.length === 0) {
    const next = nextDateWithEntries(date);
    const nextEntry = next ? getActionDaysForDate(next)[0] : null;
    return (
      <section
        aria-label="Aktionstag"
        className="rounded-lg border border-gray-300 border-t-4 border-t-gray-300 bg-white p-5 shadow-sm lg:px-8 lg:py-7"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-600">Aktionstag</p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight text-gray-700">Heute kein Aktionstag.</h2>
        {next && nextEntry && (
          <p className="mt-2 text-base text-gray-700">
            Nächster: {getGermanWeekday(next)}, {formatDateNoWeekday(next)} –{' '}
            <button type="button" onClick={() => onNavigateDate(next)} className={LINK}>
              {nextEntry.name}
            </button>
          </p>
        )}
      </section>
    );
  }

  const entry = entries[index];
  const nextEntry = entries[index + 1];
  const stepper = (btn: string) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Vorheriger Aktionstag"
        disabled={index === 0}
        onClick={() => onIndexChange(index - 1)}
        className={btn}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <span className="min-w-10 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {index + 1} / {entries.length}
      </span>
      <button
        type="button"
        aria-label="Nächster Aktionstag"
        disabled={index === entries.length - 1}
        onClick={() => onIndexChange(index + 1)}
        className={btn}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );

  return (
    <section
      aria-label="Aktionstag"
      className="rounded-lg border border-gray-300 border-t-4 border-t-red-600 bg-white p-5 shadow-sm lg:px-8 lg:py-7"
    >
      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-red-700">
              Aktionstag<span className="hidden lg:inline"> · {index + 1} von {entries.length}</span>
            </p>
            <div className="lg:hidden">{stepper(cx('h-11 w-11', BTN_GHOST))}</div>
          </div>

          {/* key forces a remount → 150 ms crossfade per stepper change */}
          <div key={index} className="animate-fade-in motion-reduce:animate-none">
            <h2 className="mt-2 text-3xl font-bold leading-[1.1] tracking-tight text-balance lg:text-[44px] lg:leading-[1.05]">
              {entry.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex h-7 items-center rounded-full bg-gray-200 px-2.5 text-sm font-medium text-gray-700">
                {shortCategory(entry.category)}
              </span>
              <span className="text-sm text-gray-600">{entry.region}</span>
            </div>
            <p className="mt-3 text-base leading-relaxed text-gray-700 text-pretty lg:max-w-[60ch] lg:text-lg">
              {entry.beschreibung}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
            <div className="flex items-center gap-4">
              <a href={entry.quelle} target="_blank" rel="noopener noreferrer" className={LINK}>
                Wikipedia <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
              {entries.length > 1 && <div className="hidden lg:block">{stepper(cx('h-10 w-10', BTN_OUTLINE))}</div>}
            </div>
            {nextEntry && (
              <span className="truncate text-sm text-gray-600 lg:hidden">Weiter: {nextEntry.name}</span>
            )}
          </div>
        </div>

        <aside className="hidden border-l border-gray-200 pl-6 lg:block" aria-label="Alle Aktionstage des Tages">
          <p className="text-sm font-medium text-gray-600">Heute {entries.length} Aktionstage</p>
          <ul className="mt-2 space-y-1">
            {entries.map((e, i) => (
              <li key={e.name}>
                <button
                  type="button"
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => onIndexChange(i)}
                  className={cx(
                    'flex min-h-14 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors motion-reduce:transition-none',
                    i === index ? 'border border-gray-300 bg-gray-100' : 'border border-transparent hover:bg-gray-100',
                    FOCUS
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold">{e.name}</span>
                    <span className="block text-sm text-gray-600">
                      {shortCategory(e.category)} · {e.region}
                    </span>
                  </span>
                  {i === index && <span className="shrink-0 text-sm font-semibold text-red-700">Aktiv</span>}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
};
