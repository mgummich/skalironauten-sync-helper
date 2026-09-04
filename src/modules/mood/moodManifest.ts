// filename -> served URL. Vite serves these in dev and hashes/copies them on build.
// Filenames (not URLs) are the stable identity persisted in the store.
const modules = import.meta.glob('/mood-scales/*.webp', {
  eager: true,
  import: 'default',
  query: '?url'
}) as Record<string, string>;

export const MOOD_SCALES: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url])
);

export const MOOD_SCALE_IMAGES: string[] = Object.keys(MOOD_SCALES);
