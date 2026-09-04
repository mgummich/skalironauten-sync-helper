import { getActionDaysForDate } from '../data/dataLoader';
import { isWorkday, isFirstWorkdayOfWeek, getGermanMonth } from '../data/dateUtils';

interface MonthGridProps {
  year: number;
  monthIndex: number; // 0-11
  selectedDate?: Date;
  onSelectDay: (date: Date) => void;
}

export const MonthGrid = ({
  year,
  monthIndex,
  selectedDate,
  onSelectDay
}: MonthGridProps) => {
  const monthName = getGermanMonth(monthIndex);

  // Calculate days in month and starting day offset (0 = Mon, 6 = Sun in German calendar)
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Convert JS Sunday-first day (0=Sun, 1=Mon...6=Sat) to German Monday-first (0=Mon...6=Sun)
  let startOffset = firstDayOfMonth.getDay() - 1;
  if (startOffset === -1) startOffset = 6; // Sunday becomes index 6

  const calendarCells = [];
  // Empty offset cells
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(new Date(year, monthIndex, day));
  }

  const weekdaysHeader = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-3 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-sm font-bold text-slate-200">{monthName} {year}</h4>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500">
        {weekdaysHeader.map((w, idx) => (
          <div key={idx} className={idx >= 5 ? 'text-rose-400/70' : ''}>
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {calendarCells.map((dateObj, idx) => {
          if (!dateObj) {
            return <div key={`empty-${idx}`} className="h-9" />;
          }

          const dayNum = dateObj.getDate();
          const workday = isWorkday(dateObj);
          const firstWorkdayWeek = isFirstWorkdayOfWeek(dateObj);
          const actionDaysCount = getActionDaysForDate(dateObj).length;

          const isToday =
            new Date().toDateString() === dateObj.toDateString();
          const isSelected =
            selectedDate && selectedDate.toDateString() === dateObj.toDateString();

          return (
            <button
              key={dayNum}
              onClick={() => onSelectDay(dateObj)}
              className={`h-9 rounded-lg p-0.5 flex flex-col items-center justify-between transition-all duration-150 relative group ${
                isSelected
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 font-bold scale-105 z-10'
                  : isToday
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/50 font-bold'
                  : workday
                  ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  : 'bg-slate-950/40 text-slate-500 border border-slate-900 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between w-full px-1">
                <span className="text-[11px] font-medium leading-none">{dayNum}</span>
                {firstWorkdayWeek && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="1. Arbeitstag der Woche" />
                )}
              </div>

              {actionDaysCount > 0 && (
                <span
                  className={`text-[9px] px-1 rounded-full font-bold leading-tight ${
                    actionDaysCount >= 3
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {actionDaysCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
