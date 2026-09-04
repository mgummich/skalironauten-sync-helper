import { getActionDaysForDate } from './dataLoader';

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format a Date object to German DD.MM.YYYY
 */
export function formatDateGerman(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseISODate(isoStr: string): Date {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getGermanWeekday(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'long' });
}

export function getGermanMonth(monthIndex: number): string {
  return new Date(2000, monthIndex, 1).toLocaleDateString('de-DE', { month: 'long' });
}

/**
 * Check if a date is a workday.
 * First checks aktionstage.json data if available for year 2026/2027.
 * Otherwise uses standard Mon-Fri logic.
 */
export function isWorkday(date: Date): boolean {
  const year = date.getFullYear().toString();
  for (const item of getActionDaysForDate(date)) {
    const yearInfo = item[year];
    if (typeof yearInfo === 'object' && yearInfo !== null && 'is_workday' in yearInfo) {
      return yearInfo.is_workday;
    }
  }
  const dayOfWeek = date.getDay();
  return dayOfWeek >= 1 && dayOfWeek <= 5;
}

/**
 * First workday of the week: a workday whose preceding day is not a workday.
 */
export function isFirstWorkdayOfWeek(date: Date): boolean {
  return isWorkday(date) && !isWorkday(addDays(date, -1));
}

/**
 * First workday of the month: a workday with no earlier workday in the same month.
 */
export function isFirstWorkdayOfMonth(date: Date): boolean {
  if (!isWorkday(date)) return false;
  for (let d = 1; d < date.getDate(); d++) {
    if (isWorkday(new Date(date.getFullYear(), date.getMonth(), d))) return false;
  }
  return true;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
}
