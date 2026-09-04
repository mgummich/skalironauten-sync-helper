// Shared class fragments (kept as string constants so Tailwind picks them up).
export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white';
export const FOCUS_ON_RED =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-600';
export const BTN_OUTLINE = `inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors motion-reduce:transition-none disabled:text-gray-400 disabled:hover:bg-white ${FOCUS}`;
export const BTN_GHOST = `inline-flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 transition-colors motion-reduce:transition-none disabled:text-gray-400 disabled:hover:bg-transparent ${FOCUS}`;
export const BTN_RED = `inline-flex items-center justify-center gap-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors motion-reduce:transition-none ${FOCUS}`;
export const INPUT = `h-11 w-full text-base text-gray-900 bg-white border border-gray-300 rounded px-3 placeholder:text-gray-500 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-white`;

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
