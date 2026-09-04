export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(isoStr: string): Date {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "Dienstag, 1. September 2026" */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/** "1. September 2026" */
export function formatDateNoWeekday(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getGermanWeekday(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'long' });
}

export function getGermanMonth(monthIndex: number): string {
  return new Date(2000, monthIndex, 1).toLocaleDateString('de-DE', { month: 'long' });
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/** Anonymous Gregorian algorithm. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const holidayCache = new Map<number, Set<string>>();

/** Bundesweite Feiertage (Germany-wide). */
function holidaysForYear(year: number): Set<string> {
  let set = holidayCache.get(year);
  if (set) return set;
  const easter = easterSunday(year);
  set = new Set(
    [
      new Date(year, 0, 1),
      addDays(easter, -2), // Karfreitag
      addDays(easter, 1), // Ostermontag
      new Date(year, 4, 1),
      addDays(easter, 39), // Christi Himmelfahrt
      addDays(easter, 50), // Pfingstmontag
      new Date(year, 9, 3),
      new Date(year, 11, 25),
      new Date(year, 11, 26)
    ].map(formatDateToISO)
  );
  holidayCache.set(year, set);
  return set;
}

export function isHoliday(date: Date): boolean {
  return holidaysForYear(date.getFullYear()).has(formatDateToISO(date));
}

export function isWorkday(date: Date): boolean {
  const dow = date.getDay();
  return dow >= 1 && dow <= 5 && !isHoliday(date);
}

/** Workday where every earlier day Mon..(d-1) of the same ISO week is weekend/holiday. */
export function isFirstWorkdayOfWeek(date: Date): boolean {
  if (!isWorkday(date)) return false;
  const dow = (date.getDay() + 6) % 7; // 0 = Monday
  for (let i = 1; i <= dow; i++) {
    if (isWorkday(addDays(date, -i))) return false;
  }
  return true;
}

export function isFirstWorkdayOfMonth(date: Date): boolean {
  if (!isWorkday(date)) return false;
  for (let d = 1; d < date.getDate(); d++) {
    if (isWorkday(new Date(date.getFullYear(), date.getMonth(), d))) return false;
  }
  return true;
}
