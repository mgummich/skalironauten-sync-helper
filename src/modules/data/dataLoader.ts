import rawData from '../../../aktionstage.json';
import { addDays } from './dateUtils';
import { normalizeRegion } from './normalizeRegion';

export interface ActionDay {
  name: string;
  category: string;
  region: string;
  month: number; // 1-12
  day: number; // 1-31
  beschreibung: string;
  quelle: string;
}

const rawActionDays = (rawData as ActionDay[]).map((item) => ({ ...item, region: normalizeRegion(item.region) }));

const monthDayIndex = new Map<string, ActionDay[]>();

rawActionDays.forEach((item) => {
  const key = `${item.month}-${item.day}`;
  const existing = monthDayIndex.get(key);
  if (existing) existing.push(item);
  else monthDayIndex.set(key, [item]);
});

export interface Filters {
  q: string;
  category: string; // '' = all
  region: string; // '' = all
}

export function getActionDaysForDate(date: Date): ActionDay[] {
  return monthDayIndex.get(`${date.getMonth() + 1}-${date.getDate()}`) || [];
}

export function entriesForDate(date: Date, filters: Filters): ActionDay[] {
  const q = filters.q.trim().toLowerCase();
  return getActionDaysForDate(date).filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.region && item.region !== filters.region) return false;
    if (q && !item.name.toLowerCase().includes(q) && !item.beschreibung.toLowerCase().includes(q)) return false;
    return true;
  });
}

/** Next date (after `date`) that has at least one entry, within a year. */
export function nextDateWithEntries(date: Date): Date | null {
  for (let i = 1; i <= 366; i++) {
    const d = addDays(date, i);
    if (getActionDaysForDate(d).length > 0) return d;
  }
  return null;
}

export const CATEGORIES: string[] = [...new Set(rawActionDays.map((i) => i.category))].sort();
export const REGIONS: string[] = [...new Set(rawActionDays.map((i) => i.region))].sort((a, b) => a.localeCompare(b, 'de'));

const SHORT_CATEGORY: Record<string, string> = {
  'Kultur & Gesellschaft': 'Kultur',
  'Fun & Kuriose Tage': 'Kurioses',
  'Tiere & Natur': 'Natur'
};

export function shortCategory(category: string): string {
  return SHORT_CATEGORY[category] ?? category;
}
