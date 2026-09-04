import rawData from '../../../aktionstage.json';
import { ActionDay } from './types';

const rawActionDays = rawData as ActionDay[];

// O(1) Lookup Maps
const monthDayIndex = new Map<string, ActionDay[]>();

// Initialize indices once on module load
rawActionDays.forEach((item) => {
  const key = `${item.month}-${item.day}`;
  const existing = monthDayIndex.get(key);
  if (existing) {
    existing.push(item);
  } else {
    monthDayIndex.set(key, [item]);
  }
});

/**
 * Get all action days for a given month (1-12) and day (1-31)
 */
export function getActionDays(month: number, day: number): ActionDay[] {
  const key = `${month}-${day}`;
  return monthDayIndex.get(key) || [];
}

/**
 * Get all action days for a given Date object
 */
export function getActionDaysForDate(date: Date): ActionDay[] {
  return getActionDays(date.getMonth() + 1, date.getDate());
}

/**
 * Get total action days count
 */
export function getTotalActionDaysCount(): number {
  return rawActionDays.length;
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const set = new Set<string>();
  rawActionDays.forEach(item => {
    if (item.category) set.add(item.category);
  });
  return Array.from(set).sort();
}

/**
 * Get all unique regions
 */
export function getAllRegions(): string[] {
  const set = new Set<string>();
  rawActionDays.forEach(item => {
    if (item.region) set.add(item.region);
  });
  return Array.from(set).sort();
}

/**
 * Search action days by keyword, category, or region
 */
export function searchActionDays(query: string, categoryFilter?: string, regionFilter?: string): ActionDay[] {
  const q = query.toLowerCase().trim();
  return rawActionDays.filter(item => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (regionFilter && item.region !== regionFilter) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.beschreibung.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q) ||
      item.charakter.toLowerCase().includes(q)
    );
  });
}
