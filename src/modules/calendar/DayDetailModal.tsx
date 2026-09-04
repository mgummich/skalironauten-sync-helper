import { X, ChevronRight, ArrowRight } from 'lucide-react';
import { Sheet, useSheetClose } from '../ui/Sheet';
import { getActionDaysForDate, shortCategory } from '../data/dataLoader';
import { isWorkday, isFirstWorkdayOfWeek, isFirstWorkdayOfMonth, formatDateNoWeekday, getGermanWeekday } from '../data/dateUtils';
import { cx, BTN_GHOST, BTN_RED, FOCUS } from '../ui/cls';

interface Props {
  date: Date;
  onClose: () => void;
  onShowInStandup: (date: Date, entryIndex: number) => void;
}

const PILL = 'inline-flex h-7 items-center rounded-full px-2.5 text-sm font-medium';

export const DayDetailModal = (props: Props) => (
  <Sheet label={`Details für ${formatDateNoWeekday(props.date)}`} onClose={props.onClose}>
    <Body {...props} />
  </Sheet>
);

const Body = ({ date, onShowInStandup }: Props) => {
  const close = useSheetClose();
  const entries = getActionDaysForDate(date);
  const go = (i: number) => {
    onShowInStandup(date, i);
    close();
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-600">{getGermanWeekday(date)}</p>
          <h2 className="text-[22px] font-semibold tabular-nums">{formatDateNoWeekday(date)}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {isWorkday(date) ? (
              <span className={cx(PILL, 'bg-emerald-100 text-emerald-700')}>Arbeitstag</span>
            ) : (
              <span className={cx(PILL, 'bg-gray-200 text-gray-700')}>Wochenende / Feiertag</span>
            )}
            {isFirstWorkdayOfWeek(date) && <span className={cx(PILL, 'bg-amber-100 text-amber-800')}>1. Arbeitstag der Woche</span>}
            {isFirstWorkdayOfMonth(date) && <span className={cx(PILL, 'bg-amber-100 text-amber-800')}>1. Arbeitstag des Monats</span>}
          </div>
        </div>
        <button type="button" aria-label="Schließen" onClick={close} className={cx('h-11 w-11 -mr-2 -mt-1', BTN_GHOST)}>
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <p className="mt-5 text-sm font-medium uppercase tracking-[0.06em] text-gray-600">
        {entries.length === 0 ? 'Kein Aktionstag' : `${entries.length} Aktionstag${entries.length > 1 ? 'e' : ''}`}
      </p>
      {entries.length > 0 && (
        <ul className="mt-2 space-y-1">
          {entries.map((e, i) => (
            <li key={e.name}>
              <button
                type="button"
                onClick={() => go(i)}
                className={cx(
                  'flex min-h-14 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors motion-reduce:transition-none',
                  i === 0 ? 'border border-gray-300 bg-gray-100' : 'border border-transparent hover:bg-gray-100',
                  FOCUS
                )}
              >
                <span className="min-w-0">
                  <span className="block text-base font-semibold">{e.name}</span>
                  <span className="block text-sm text-gray-600">
                    {shortCategory(e.category)} · {e.region}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-600" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" onClick={() => go(0)} className={cx('mt-5 h-12 w-full', BTN_RED)}>
        Im Standup anzeigen <ArrowRight className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
};
