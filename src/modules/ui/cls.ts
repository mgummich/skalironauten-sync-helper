// Shared class fragments (kept as string constants so Tailwind picks them up).
export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

const BTN_BASE = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors motion-reduce:transition-none';

// At most one primary action per screen.
export const BTN_PRIMARY = `${BTN_BASE} bg-red-600 hover:bg-red-700 text-white ${FOCUS}`;
export const BTN_SECONDARY = `${BTN_BASE} bg-white border-[1.5px] border-red-700 text-red-700 hover:bg-red-50 ${FOCUS}`;
export const BTN_TERTIARY = `${BTN_BASE} bg-transparent border border-slate-400 text-slate-900 hover:bg-slate-100 disabled:text-slate-400 disabled:hover:bg-transparent ${FOCUS}`;
export const BTN_ICON = `${BTN_BASE} rounded-full text-slate-900 hover:bg-slate-100 disabled:text-slate-400 disabled:hover:bg-transparent ${FOCUS}`;
export const BTN_DISABLED = `${BTN_BASE} bg-slate-200 text-slate-600 ${FOCUS}`;

export const INPUT = `h-11 w-full rounded-t border border-slate-300 border-b-2 border-b-slate-500 bg-slate-100 px-3 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-b-red-600`;

export const CARD = 'rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,.08)]';
export const CARD_RAISED = 'rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,.12)]';

export const PILL = 'inline-flex h-7 items-center rounded-full px-2.5 text-sm font-medium';
export const BADGE_AMBER = 'inline-flex h-6 items-center rounded px-2 text-sm font-semibold bg-amber-100 text-amber-800';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
