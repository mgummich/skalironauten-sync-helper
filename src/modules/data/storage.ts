// localStorage contracts (see design handoff):
//   notes:{YYYY-MM-DD} -> { gestern, heute, blocker }
//   mood:{YYYY-MM-DD}  -> { value 1-9, imageId, savedAt }
//   ui                 -> { lastRoute, calendarMonth, filters }
import type { Filters } from './dataLoader';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`localStorage write failed for ${key}`, e);
  }
}

export interface Notes {
  gestern: string;
  heute: string;
  blocker: string;
}
export const EMPTY_NOTES: Notes = { gestern: '', heute: '', blocker: '' };

export const getNotes = (iso: string): Notes => read(`notes:${iso}`, EMPTY_NOTES);
export const saveNotes = (iso: string, notes: Notes): void => write(`notes:${iso}`, notes);
export const hasSavedNotes = (iso: string): boolean => localStorage.getItem(`notes:${iso}`) !== null;

export interface Mood {
  value: number;
  imageId: string;
  savedAt: number;
}

export const getMood = (iso: string): Mood | null => read<Mood | null>(`mood:${iso}`, null);
export const saveMood = (iso: string, mood: Mood): void => write(`mood:${iso}`, mood);

export interface UiState {
  lastRoute: 'daily' | 'calendar';
  calendarMonth: string; // YYYY-MM
  filters: Filters;
}

const DEFAULT_UI: UiState = {
  lastRoute: 'daily',
  calendarMonth: '',
  filters: { q: '', category: '', region: '' }
};

export const getUi = (): UiState => read('ui', DEFAULT_UI);
export const patchUi = (patch: Partial<UiState>): void => write('ui', { ...getUi(), ...patch });
