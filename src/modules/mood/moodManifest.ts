import manifest from '../../../mood-scales.json';

export const MOOD_SCALE_ENTRIES = manifest;

const modules = import.meta.glob<string>('/mood-scales/*.webp', {
  eager: true,
  import: 'default',
  query: '?url'
});

const urlByFile = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url])
);

export const MOOD_SCALES: Record<string, string> = Object.fromEntries(
  MOOD_SCALE_ENTRIES.filter((e) => urlByFile[e.file]).map((e) => [e.id, urlByFile[e.file]])
);

// Saved moods from before the rename use the original filenames as ids.
export const LEGACY_MOOD_IDS: Record<string, string> = Object.fromEntries(
  MOOD_SCALE_ENTRIES.map((e) => [e.originalFile, e.id])
);
