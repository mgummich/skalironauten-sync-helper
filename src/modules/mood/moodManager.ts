import { getMoodImages, getMoodUsage, isKnownMoodImage } from './moodLibrary';
import { store, readList } from '../data/storage';

const RECENT_KEY = 'moodRecent'; // last 5 image ids, newest last

/** Random image id: prefers never-used images, and always avoids the last 5 drawn. */
export function drawMoodImage(): string {
  const recent = readList<string>(RECENT_KEY);
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

/** "Zufällig wählen": replaces the day's suggestion (and any gallery pick) with a fresh draw. */
export function rerollDraw(iso: string): string {
  store.removeItem(`moodPick:${iso}`);
  const id = drawMoodImage();
  store.setItem(`moodDraw:${iso}`, id);
  return id;
}

export const getMoodPick = (iso: string): string | null => store.getItem(`moodPick:${iso}`);

export function setMoodPick(iso: string, imageId: string): void {
  store.setItem(`moodPick:${iso}`, imageId);
}

export function clearPendingDraw(iso: string): void {
  store.removeItem(`moodDraw:${iso}`);
  store.removeItem(`moodPick:${iso}`);
}
