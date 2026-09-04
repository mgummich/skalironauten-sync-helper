import { getActionDaysForDate } from './dataLoader';

export const GERMAN_WEEKDAYS = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag'
];

export const GERMAN_MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
];

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
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${d}.${m}.${date.getFullYear()}`;
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseISODate(isoStr: string): Date {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get German weekday name
 */
export function getGermanWeekday(date: Date): string {
  return GERMAN_WEEKDAYS[date.getDay()];
}

/**
 * Get German month name
 */
export function getGermanMonth(date: Date): string {
  return GERMAN_MONTHS[date.getMonth()];
}

/**
 * Check if a date is a workday.
 * First checks aktionstage.json data if available for year 2026/2027.
 * Otherwise uses standard Mon-Fri logic.
 */
export function isWorkday(date: Date): boolean {
  const year = date.getFullYear().toString();
  const actionDays = getActionDaysForDate(date);
  
  // Check if any matching entry in aktionstage.json has explicit is_workday info for this year
  for (const item of actionDays) {
    const yearInfo = item[year];
    if (typeof yearInfo === 'object' && yearInfo !== null && 'is_workday' in yearInfo) {
      return (yearInfo as { is_workday: boolean }).is_workday;
    }
  }
  
  // Standard weekday logic: 1-5 (Mon-Fri) are workdays
  const dayOfWeek = date.getDay();
  return dayOfWeek >= 1 && dayOfWeek <= 5;
}

/**
 * Check if today is the 1st workday of the week (e.g. Monday, or Tuesday if Monday is a non-workday).
 */
export function isFirstWorkdayOfWeek(date: Date): boolean {
  if (!isWorkday(date)) return false;

  // Check preceding day (yesterday)
  const prevDate = new Date(date);
  prevDate.setDate(date.getDate() - 1);

  // If yesterday was NOT a workday (e.g. Sunday or weekend/holiday), today is the 1st workday of the week!
  return !isWorkday(prevDate);
}

/**
 * Check if today is the 1st workday of the month.
 */
export function isFirstWorkdayOfMonth(date: Date): boolean {
  if (!isWorkday(date)) return false;

  const currentDay = date.getDate();
  
  // Check all days in this month prior to today
  for (let d = 1; d < currentDay; d++) {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), d);
    if (isWorkday(checkDate)) {
      return false; // Earlier day in month was already a workday
    }
  }

  return true;
}

/**
 * Get Gestern, Heute, Morgen Date objects
 */
export function getAdjacentDays(currentDate: Date): { yesterday: Date; today: Date; tomorrow: Date } {
  const today = new Date(currentDate);
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return { yesterday, today, tomorrow };
}
