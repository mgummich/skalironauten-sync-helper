import { useState } from 'react';
import { Header, BottomTabs, Tab } from './Header';
import { DevToolbar } from './DevToolbar';
import { DailyView } from '../daily/DailyView';
import { CalendarView } from '../calendar/CalendarView';
import { parseISODate, formatDateToISO } from '../data/dateUtils';
import { getUi, patchUi } from '../data/storage';

export interface DailyTarget {
  date: Date;
  entryIndex: number;
}

export const AppShell = () => {
  const dateParam = new URLSearchParams(window.location.search).get('date');
  const [target, setTarget] = useState<DailyTarget>({
    date: dateParam ? parseISODate(dateParam) : new Date(),
    entryIndex: 0
  });
  const [activeTab, setActiveTabState] = useState<Tab>(() => getUi().lastRoute);

  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab);
    patchUi({ lastRoute: tab });
  };

  const setDate = (date: Date) => setTarget({ date, entryIndex: 0 });

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-sans text-gray-900">
      {import.meta.env.DEV && (
        <DevToolbar currentDateStr={formatDateToISO(target.date)} onSelectDate={(s) => setDate(parseISODate(s))} />
      )}

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 py-4 pb-24 lg:px-8 lg:py-8 lg:pb-8">
        {activeTab === 'daily' ? (
          <DailyView target={target} onDateChange={setDate} />
        ) : (
          <CalendarView
            onShowInStandup={(date, entryIndex) => {
              setTarget({ date, entryIndex });
              setActiveTab('daily');
            }}
          />
        )}
      </main>

      <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
