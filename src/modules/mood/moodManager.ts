import { MOOD_SCALES, MOOD_SCALE_IMAGES } from './moodManifest';
import { store } from '../data/storage';

const RECENT_KEY = 'moodRecent'; // last 5 image ids, newest last

function readRecent(): string[] {
  try {
    const parsed = JSON.parse(store.getItem(RECENT_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Random image id, avoiding the last 5 drawn. */
export function drawMoodImage(): string {
  const recent = readRecent();
  const pool = MOOD_SCALE_IMAGES.filter((id) => !recent.includes(id));
  const candidates = pool.length ? pool : MOOD_SCALE_IMAGES;
  const id = candidates[Math.floor(Math.random() * candidates.length)];
  store.setItem(RECENT_KEY, JSON.stringify([...recent, id].slice(-5)));
  return id;
}

/** Pending (drawn but unsaved) image for a date, so card thumbnail and dialog show the same picture. */
export function getPendingDraw(iso: string): string {
  const key = `moodDraw:${iso}`;
  let id = store.getItem(key);
  if (!id || !MOOD_SCALES[id]) {
    id = drawMoodImage();
    store.setItem(key, id);
  }
  return id;
}

export function clearPendingDraw(iso: string): void {
  store.removeItem(`moodDraw:${iso}`);
}

export function getMoodImageUrl(id: string): string {
  return MOOD_SCALES[id] ?? '';
}

export function isVideo(id: string): boolean {
  return id.endsWith('.mp4');
}
