import { useState } from 'react';
import { Header, Tab } from './Header';
import { DevToolbar } from './DevToolbar';
import { DailyView } from '../daily/DailyView';
import { CalendarView } from '../calendar/CalendarView';
import { parseISODate, formatDateToISO } from '../data/dateUtils';
import { Sparkles } from 'lucide-react';

export const AppShell = () => {
  // Read initial date from URL query parameter, default to today
  const dateParam = new URLSearchParams(window.location.search).get('date');
  const [currentDate, setCurrentDate] = useState<Date>(dateParam ? parseISODate(dateParam) : new Date());
  const [activeTab, setActiveTab] = useState<Tab>('daily');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {import.meta.env.DEV && (
        <DevToolbar
          currentDateStr={formatDateToISO(currentDate)}
          onSelectDatePreset={(dateStr) => setCurrentDate(parseISODate(dateStr))}
        />
      )}

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'daily' && <DailyView currentDate={currentDate} onDateChange={setCurrentDate} />}

        {activeTab === 'calendar' && (
          <CalendarView
            onSelectDateForStandup={(date) => {
              setCurrentDate(date);
              setActiveTab('daily');
            }}
          />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-1.5 text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Skalironauten Sync Helper</span>
        </div>
      </footer>
    </div>
  );
};
