import { MOOD_SCALES, MOOD_SCALE_IMAGES } from './moodManifest';
import { MoodRating } from './moodTypes';

const USED_MOOD_SCALES_KEY = 'used_mood_scales';
const MOOD_HISTORY_KEY = 'mood_history';

function readArray<T>(key: string): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return [];
  }
}

function writeArray(key: string, value: unknown[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export function getUsedMoodScales(): string[] {
  return readArray<string>(USED_MOOD_SCALES_KEY);
}

/**
 * Select next non-repeating mood scale image filename.
 * If all images in the pool have been used, auto-reset used_mood_scales and pick anew.
 */
export function getNextMoodScaleFilename(): { filename: string; wasReset: boolean } {
  let used = getUsedMoodScales();
  let pool = MOOD_SCALE_IMAGES.filter((img) => !used.includes(img));
  const wasReset = pool.length === 0;
  if (wasReset) {
    used = [];
    pool = MOOD_SCALE_IMAGES;
  }

  const filename = pool[Math.floor(Math.random() * pool.length)];
  writeArray(USED_MOOD_SCALES_KEY, [...used, filename]);
  return { filename, wasReset };
}

export function getMoodScaleUrl(filename: string): string {
  return MOOD_SCALES[filename] ?? '';
}

/**
 * Save user mood rating (1-9) for a date, replacing any existing rating for that date.
 */
export function saveMoodRating(dateStr: string, rating: number, scaleImage: string): MoodRating {
  const entry: MoodRating = { dateStr, rating, scaleImage, timestamp: Date.now() };
  const history = readArray<MoodRating>(MOOD_HISTORY_KEY).filter((item) => item.dateStr !== dateStr);
  writeArray(MOOD_HISTORY_KEY, [...history, entry]);
  return entry;
}

export function getMoodRatingForDate(dateStr: string): MoodRating | null {
  return readArray<MoodRating>(MOOD_HISTORY_KEY).find((item) => item.dateStr === dateStr) || null;
}

export function resetMoodPool(): void {
  writeArray(USED_MOOD_SCALES_KEY, []);
}

export function clearMoodHistory(): void {
  try {
    localStorage.removeItem(MOOD_HISTORY_KEY);
  } catch (e) {
    console.error('Error clearing mood history:', e);
  }
}
