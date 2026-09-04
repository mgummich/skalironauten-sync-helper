import { getMoodImages, getMoodUsage, isKnownMoodImage } from './moodLibrary';
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

/** Random image id: prefers never-used images, and always avoids the last 5 drawn. */
export function drawMoodImage(): string {
  const recent = readRecent();
  const usage = getMoodUsage();
  const all = getMoodImages().map((i) => i.id);
  const fresh = all.filter((id) => !recent.includes(id));
  const unused = fresh.filter((id) => !usage.has(id));
  const candidates = unused.length ? unused : fresh.length ? fresh : all;
  const id = candidates[Math.floor(Math.random() * candidates.length)];
  store.setItem(RECENT_KEY, JSON.stringify([...recent, id].slice(-5)));
  return id;
}

/**
 * Image for a date that has no saved mood yet: the one picked in the gallery if there is
 * one, otherwise a random draw that is kept so card thumbnail and dialog show the same picture.
 */
export function getPendingDraw(iso: string): string {
  const picked = store.getItem(`moodPick:${iso}`);
  if (picked && isKnownMoodImage(picked)) return picked;

  const key = `moodDraw:${iso}`;
  let id = store.getItem(key);
  if (!id || !isKnownMoodImage(id)) {
    id = drawMoodImage();
    store.setItem(key, id);
  }
  return id;
}

export const getMoodPick = (iso: string): string | null => store.getItem(`moodPick:${iso}`);

/** Picking from the gallery overrides the random suggestion for that day. */
export function setMoodPick(iso: string, imageId: string): void {
  store.setItem(`moodPick:${iso}`, imageId);
}

export function clearPendingDraw(iso: string): void {
  store.removeItem(`moodDraw:${iso}`);
  store.removeItem(`moodPick:${iso}`);
}

export { getMoodImageUrl } from './moodLibrary';
