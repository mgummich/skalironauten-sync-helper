// The built-in mood scales: pixels in mood-scales/*.webp, metadata in mood-scales.json.
// The json `id` (= filename without extension) is the stable identity persisted in the
// store; `originalFile` maps the pre-rename filenames so old saved ids can be migrated.
import manifest from '../../../mood-scales.json';

export interface MoodScaleEntry {
  id: string;
  file: string;
  title: string;
  category: string;
  width: number;
  height: number;
  originalFile: string;
}

export const MOOD_SCALE_ENTRIES: MoodScaleEntry[] = manifest;

// filename -> served URL. Vite serves these in dev and hashes/copies them on build.
const modules = import.meta.glob('/mood-scales/*.webp', {
  eager: true,
  import: 'default',
  query: '?url'
}) as Record<string, string>;

const urlByFile = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url])
);

/** id -> served URL. */
export const MOOD_SCALES: Record<string, string> = Object.fromEntries(
  MOOD_SCALE_ENTRIES.filter((e) => urlByFile[e.file]).map((e) => [e.id, urlByFile[e.file]])
);

/** Pre-rename filename -> id, for migrating stored ids once. */
export const LEGACY_MOOD_IDS: Record<string, string> = Object.fromEntries(
  MOOD_SCALE_ENTRIES.map((e) => [e.originalFile, e.id])
);
