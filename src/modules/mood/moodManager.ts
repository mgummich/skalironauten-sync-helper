import { MOOD_SCALE_IMAGES } from './moodManifest';
import { MoodRating } from './moodTypes';

const USED_MOOD_SCALES_KEY = 'used_mood_scales';
const MOOD_HISTORY_KEY = 'mood_history';

/**
 * Get list of already used mood scale image filenames from localStorage
 */
export function getUsedMoodScales(): string[] {
  try {
    const raw = localStorage.getItem(USED_MOOD_SCALES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading used_mood_scales from localStorage:', e);
    return [];
  }
}

/**
 * Save list of used mood scale image filenames to localStorage
 */
export function setUsedMoodScales(used: string[]): void {
  try {
    localStorage.setItem(USED_MOOD_SCALES_KEY, JSON.stringify(used));
  } catch (e) {
    console.error('Error saving used_mood_scales to localStorage:', e);
  }
}

/**
 * Select next non-repeating mood scale image filename.
 * If all images in the pool have been used, auto-reset used_mood_scales and pick anew.
 */
export function getNextMoodScaleFilename(): { filename: string; wasReset: boolean } {
  const used = getUsedMoodScales();
  const available = MOOD_SCALE_IMAGES.filter(img => !used.includes(img));

  let wasReset = false;
  let pool = available;

  if (available.length === 0) {
    // Auto-reset when exhausted
    wasReset = true;
    pool = [...MOOD_SCALE_IMAGES];
    setUsedMoodScales([]);
  }

  // Pick random from current pool
  const randomIndex = Math.floor(Math.random() * pool.length);
  const chosenFilename = pool[randomIndex];

  // Update used list
  const newUsed = wasReset ? [chosenFilename] : [...used, chosenFilename];
  setUsedMoodScales(newUsed);

  return { filename: chosenFilename, wasReset };
}

/**
 * Get full URL path for a mood scale filename
 */
export function getMoodScaleUrl(filename: string): string {
  return `/mood-scales/${encodeURIComponent(filename)}`;
}

/**
 * Save user mood rating (1-9) for a date
 */
export function saveMoodRating(dateStr: string, rating: number, scaleImage: string): MoodRating {
  const history = getMoodHistory();
  
  // Replace existing rating for date if present or append
  const existingIdx = history.findIndex(item => item.dateStr === dateStr);
  const newEntry: MoodRating = {
    id: `mood-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    dateStr,
    rating,
    scaleImage,
    timestamp: Date.now()
  };

  if (existingIdx >= 0) {
    history[existingIdx] = newEntry;
  } else {
    history.push(newEntry);
  }

  try {
    localStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving mood rating:', e);
  }

  return newEntry;
}

/**
 * Get all mood history ratings
 */
export function getMoodHistory(): MoodRating[] {
  try {
    const raw = localStorage.getItem(MOOD_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading mood history:', e);
    return [];
  }
}

/**
 * Get mood rating for a specific date (YYYY-MM-DD)
 */
export function getMoodRatingForDate(dateStr: string): MoodRating | null {
  const history = getMoodHistory();
  return history.find(item => item.dateStr === dateStr) || null;
}

/**
 * Reset mood scales pool (used_mood_scales = [])
 */
export function resetMoodPool(): void {
  setUsedMoodScales([]);
}

/**
 * Clear full mood history
 */
export function clearMoodHistory(): void {
  try {
    localStorage.removeItem(MOOD_HISTORY_KEY);
  } catch (e) {
    console.error('Error clearing mood history:', e);
  }
}

/**
 * Get total images count in pool
 */
export function getTotalMoodImagesCount(): number {
  return MOOD_SCALE_IMAGES.length;
}
