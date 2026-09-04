import { Sun, CalendarDays, Sparkles } from 'lucide-react';
import { cx, FOCUS, FOCUS_ON_RED } from './cls';

export type Tab = 'daily' | 'calendar';

const TABS: { id: Tab; label: string; Icon: typeof Sun }[] = [
  { id: 'daily', label: 'Heute', Icon: Sun },
  { id: 'calendar', label: 'Kalender', Icon: CalendarDays }
];

interface NavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Header = ({ activeTab, onTabChange }: NavProps) => (
  <header className="bg-red-600 text-white">
    <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 lg:h-16 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-red-600 lg:h-9 lg:w-9">
          <Sparkles className="h-[18px] w-[18px] lg:h-5 lg:w-5" aria-hidden />
        </div>
        <h1 className="text-base font-semibold tracking-tight lg:text-lg">Skalironauten Sync Helper</h1>
      </div>

      <nav aria-label="Hauptnavigation" className="hidden rounded-md border border-white/30 bg-white/15 p-1 lg:flex">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => onTabChange(id)}
            className={cx(
              'h-9 min-w-24 rounded px-4 text-base font-semibold transition-colors motion-reduce:transition-none',
              activeTab === id ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10',
              FOCUS_ON_RED
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
    className="fixed inset-x-0 bottom-0 z-10 flex h-16 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
  >
    {TABS.map(({ id, label, Icon }) => (
      <button
        key={id}
        type="button"
        aria-current={activeTab === id ? 'page' : undefined}
        onClick={() => onTabChange(id)}
        className={cx(
          'flex flex-1 flex-col items-center justify-center gap-0.5 text-sm',
          activeTab === id ? 'font-semibold text-red-700' : 'text-gray-600',
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
