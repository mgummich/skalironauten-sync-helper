import { Sun, CalendarDays, Images, Sparkles } from 'lucide-react';
import { cx, FOCUS } from './cls';

export type Tab = 'daily' | 'calendar' | 'moods';

const TABS: { id: Tab; label: string; Icon: typeof Sun }[] = [
  { id: 'daily', label: 'Heute', Icon: Sun },
  { id: 'calendar', label: 'Kalender', Icon: CalendarDays },
  { id: 'moods', label: 'Moods', Icon: Images }
];

interface NavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Header = ({ activeTab, onTabChange }: NavProps) => (
  <header className="border-b border-slate-200 bg-white text-slate-900">
    <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 lg:h-16 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white lg:h-9 lg:w-9">
          <Sparkles className="h-[18px] w-[18px] lg:h-5 lg:w-5" aria-hidden />
        </div>
        <h1 className="text-base font-semibold tracking-tight lg:text-lg">Skalironauten Sync Helper</h1>
      </div>

      <nav aria-label="Hauptnavigation" className="hidden self-stretch gap-2 lg:flex">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => onTabChange(id)}
            className={cx(
              'h-full border-b-[3px] px-3 text-base transition-colors motion-reduce:transition-none',
              activeTab === id
                ? 'border-red-600 font-bold text-slate-900'
                : 'border-transparent font-medium text-slate-600 hover:text-slate-900',
              FOCUS,
              'focus-visible:ring-inset'
            )}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  </header>
);

export const BottomTabs = ({ activeTab, onTabChange }: NavProps) => (
  <nav
    aria-label="Hauptnavigation"
    className="fixed inset-x-0 bottom-0 z-10 grid h-16 grid-cols-3 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
  >
    {TABS.map(({ id, label, Icon }) => (
      <button
        key={id}
        type="button"
        aria-current={activeTab === id ? 'page' : undefined}
        onClick={() => onTabChange(id)}
        className={cx(
          '-mt-px flex flex-col items-center justify-center gap-1 border-t-[3px] text-sm',
          activeTab === id ? 'border-red-600 font-semibold text-red-700' : 'border-transparent font-medium text-slate-600',
          FOCUS,
          'focus-visible:ring-inset'
        )}
      >
        <Icon className="h-[22px] w-[22px]" aria-hidden />
        {label}
      </button>
    ))}
  </nav>
);
