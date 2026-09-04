import { entriesForDate, Filters } from '../data/dataLoader';
import { isWorkday, isFirstWorkdayOfWeek, isToday, isSameDay, getGermanMonth } from '../data/dateUtils';
import { cx, FOCUS } from '../ui/cls';

interface Props {
  year: number;
  monthIndex: number; // 0-11
  filters: Filters;
  selectedDate: Date | null;
  size: 'mobile' | 'desktop';
  showTitle?: boolean;
  onSelectDay: (date: Date) => void;
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export const MonthGrid = ({ year, monthIndex, filters, selectedDate, size, showTitle, onSelectDay }: Props) => {
  const startOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, monthIndex, i + 1))
  ];
  const cellH = size === 'mobile' ? 'h-14' : 'h-12';

  return (
    <div>
      {showTitle && <h3 className="mb-2 text-base font-semibold">{getGermanMonth(monthIndex)}</h3>}
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600" aria-hidden>
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} className={cellH} />;
          const count = entriesForDate(d, filters).length;
          const selected = selectedDate ? isSameDay(d, selectedDate) : false;
          const today = isToday(d);
          return (
            <button
              key={d.getDate()}
              type="button"
              aria-label={`${d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}, ${count} Aktionstage`}
              aria-pressed={selected}
              onClick={() => onSelectDay(d)}
              className={cx(
                cellH,
                'flex flex-col items-center justify-center gap-0.5 rounded-lg text-sm transition-colors motion-reduce:transition-none',
                selected
                  ? 'border border-red-600 bg-red-600 text-white'
                  : isWorkday(d)
                    ? 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                    : 'border border-gray-100 bg-gray-100 text-gray-600 hover:bg-gray-200',
                today && !selected && 'border-2 border-gray-900',
                today ? 'font-bold' : 'font-medium',
                FOCUS
              )}
            >
              <span className="tabular-nums leading-none">{d.getDate()}</span>
              <span className="flex h-3.5 items-center gap-1 leading-none">
                {isFirstWorkdayOfWeek(d) && (
                  <span className={cx('h-1.5 w-1.5 rounded-full', selected ? 'bg-white' : 'bg-amber-600')} aria-hidden />
                )}
                {count > 0 && <span className={cx('text-sm', selected ? 'text-white' : 'text-gray-600')}>{count}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
