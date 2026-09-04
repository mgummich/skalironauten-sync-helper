import { useState } from 'react';
import { Header, BottomTabs, Tab } from './Header';
import { DevToolbar } from './DevToolbar';
import { DailyView } from '../daily/DailyView';
import { CalendarView } from '../calendar/CalendarView';
import { MoodsView } from '../mood/MoodsView';
import { setMoodPick } from '../mood/moodManager';
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
  // Incremented when the gallery hands an image over, so the Mood Check reopens with it.
  const [moodRequest, setMoodRequest] = useState(0);

  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab);
    patchUi({ lastRoute: tab });
  };

  const setDate = (date: Date) => setTarget({ date, entryIndex: 0 });

  const chooseMoodImage = (imageId: string) => {
    setMoodPick(formatDateToISO(target.date), imageId);
    setMoodRequest((n) => n + 1);
    setActiveTab('daily');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans text-slate-900">
      {import.meta.env.DEV && (
        <DevToolbar currentDateStr={formatDateToISO(target.date)} onSelectDate={(s) => setDate(parseISODate(s))} />
      )}

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 py-4 pb-24 lg:px-8 lg:py-8 lg:pb-12">
        {activeTab === 'daily' && <DailyView target={target} onDateChange={setDate} openMoodRequest={moodRequest} />}
        {activeTab === 'calendar' && (
          <CalendarView
            onShowInStandup={(date, entryIndex) => {
              setTarget({ date, entryIndex });
              setActiveTab('daily');
            }}
          />
        )}
        {activeTab === 'moods' && <MoodsView onChooseForToday={chooseMoodImage} />}
      </main>

      <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
