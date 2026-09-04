// Storage contracts (see design handoff):
//   notes:{YYYY-MM-DD} -> { gestern, heute, blocker }
//   mood:{YYYY-MM-DD}  -> { value 1-9, imageId, savedAt }
//   moodPick:{YYYY-MM-DD} -> image id chosen from the gallery for that day
//   moodImages         -> metadata of the uploaded images (blobs live in IndexedDB)
//   moodPick:{YYYY-MM-DD} -> image id chosen from the gallery for that day
//   moodImages         -> metadata of the uploaded images (blobs live in IndexedDB)
//   ui                 -> { lastRoute, calendarMonth, filters }
import type { Filters } from './dataLoader';

// Every persisted value in the app goes through this one backing store.
// Public deployments (GitHub Pages) build with VITE_EPHEMERAL_STORAGE=true, so
// notes and moods live only as long as the browser tab. Local dev and the
// container build keep localStorage, where they survive a restart.
export const store: Storage =
  import.meta.env.VITE_EPHEMERAL_STORAGE === 'true' ? sessionStorage : localStorage;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = store.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`storage write failed for ${key}`, e);
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
export const hasSavedNotes = (iso: string): boolean => store.getItem(`notes:${iso}`) !== null;

export interface Mood {
  value: number;
  imageId: string;
  savedAt: number;
}

export const getMood = (iso: string): Mood | null => read<Mood | null>(`mood:${iso}`, null);
export const saveMood = (iso: string, mood: Mood): void => write(`mood:${iso}`, mood);

/** Every saved mood, in no particular order — the source for image usage counts. */
export function readMoodEntries(): { iso: string; mood: Mood }[] {
  const entries: { iso: string; mood: Mood }[] = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    if (!key?.startsWith('mood:')) continue;
    const mood = read<Mood | null>(key, null);
    if (mood?.imageId) entries.push({ iso: key.slice('mood:'.length), mood });
  }
  return entries;
}

export interface UiState {
  lastRoute: 'daily' | 'calendar' | 'moods';
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
