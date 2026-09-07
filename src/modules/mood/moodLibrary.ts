// The mood library: the images shipped with the app plus the ones the team uploaded
// on this device. Usage (how often an image was picked, and when) is derived from the
// saved `mood:{date}` entries — it is never stored twice.
import { MOOD_SCALES, MOOD_SCALE_ENTRIES, LEGACY_MOOD_IDS } from './moodManifest';
import { allBlobKeys, allBlobs, deleteBlob, putBlob } from './moodBlobs';
import { store, readList, readMoodEntries } from '../data/storage';

export interface MoodImage {
  id: string;
  title: string;
  category?: string;
  sourceUrl?: string;
  builtIn: boolean;
  width?: number;
  height?: number;
  addedAt?: number;
}

export interface MoodUsage {
  iso: string;
  value: number;
}

const CUSTOM_KEY = 'moodImages';

const readCustom = () => readList<MoodImage>(CUSTOM_KEY);

const writeCustom = (images: MoodImage[]): void => {
  store.setItem(CUSTOM_KEY, JSON.stringify(images));
  sorted = null;
};

// id -> object URL for uploaded images, filled once by initMoodLibrary().
const customUrls = new Map<string, string>();

const BUILT_INS: MoodImage[] = MOOD_SCALE_ENTRIES.map((e) => ({
  id: e.id,
  title: e.title,
  category: e.category,
  width: e.width,
  height: e.height,
  builtIn: true
}));

// The built-in files were renamed from scraped names to mood-NNN.webp; stored ids
// still using the old filenames are rewritten once here.
function migrateLegacyIds(): void {
  const fix = (id: string | null) => (id && LEGACY_MOOD_IDS[id]) || null;
  for (let i = store.length - 1; i >= 0; i--) {
    const key = store.key(i)!;
    if (key.startsWith('moodPick:') || key.startsWith('moodDraw:')) {
      const next = fix(store.getItem(key));
      if (next) store.setItem(key, next);
    } else if (key.startsWith('mood:')) {
      try {
        const mood = JSON.parse(store.getItem(key) || '');
        const next = fix(mood?.imageId);
        if (next) store.setItem(key, JSON.stringify({ ...mood, imageId: next }));
      } catch {
        /* malformed entry: leave it alone */
      }
    }
  }
  const recent = readList<string>('moodRecent').map((id) => LEGACY_MOOD_IDS[id] ?? id);
  if (recent.length) store.setItem('moodRecent', JSON.stringify(recent));
}

/**
 * Reads the uploaded blobs into object URLs and drops orphans (blobs whose metadata is
 * gone, e.g. after the session-only build cleared it). Call once before rendering.
 */
export async function initMoodLibrary(): Promise<void> {
  migrateLegacyIds();
  const custom = readCustom();
  try {
    const [keys, blobs] = await Promise.all([allBlobKeys(), allBlobs()]);
    keys.forEach((key, i) => {
      const id = String(key);
      if (custom.some((c) => c.id === id)) customUrls.set(id, URL.createObjectURL(blobs[i]));
      else void deleteBlob(id);
    });
  } catch (e) {
    console.error('mood image store unavailable', e);
  }
  // Metadata without a blob is useless too.
  const usable = custom.filter((c) => customUrls.has(c.id));
  if (usable.length !== custom.length) writeCustom(usable);
}

// Built once and reused: the list only changes when an image is added or dropped,
// and both paths go through writeCustom().
let sorted: MoodImage[] | null = null;
let byId: Map<string, MoodImage> | null = null;

/** All images, alphabetically by title — the order the gallery shows. */
export function getMoodImages(): MoodImage[] {
  if (!sorted) {
    sorted = [...BUILT_INS, ...readCustom()].sort((a, b) => a.title.localeCompare(b.title, 'de'));
    byId = new Map(sorted.map((i) => [i.id, i]));
  }
  return sorted;
}

export const getMoodImage = (id: string): MoodImage | undefined => {
  getMoodImages();
  return byId!.get(id);
};

export function getMoodImageUrl(id: string): string {
  return MOOD_SCALES[id] ?? customUrls.get(id) ?? '';
}

export const isKnownMoodImage = (id: string): boolean => getMoodImageUrl(id) !== '';

/** image id -> the days it was saved on, newest first. */
export function getMoodUsage(): Map<string, MoodUsage[]> {
  const usage = new Map<string, MoodUsage[]>();
  for (const { iso, mood } of readMoodEntries()) {
    const list = usage.get(mood.imageId);
    if (list) list.push({ iso, value: mood.value });
    else usage.set(mood.imageId, [{ iso, value: mood.value }]);
  }
  usage.forEach((list) => list.sort((a, b) => b.iso.localeCompare(a.iso)));
  return usage;
}

export async function addMoodImage(
  file: Blob,
  meta: { title: string; sourceUrl?: string; width: number; height: number }
): Promise<MoodImage> {
  const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await putBlob(id, file);
  customUrls.set(id, URL.createObjectURL(file));
  const image: MoodImage = { id, builtIn: false, addedAt: Date.now(), ...meta };
  writeCustom([...readCustom(), image]);
  return image;
}
