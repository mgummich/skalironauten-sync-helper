import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { DevToolbar } from './DevToolbar';
import { ShowcaseView } from './ShowcaseView';
import { DailyView } from '../daily';
import { CalendarView } from '../calendar';
import { parseISODate, formatDateToISO } from '../data';
import { Heart, Sparkles, Code2 } from 'lucide-react';

export const AppShell: React.FC = () => {
  // Read initial date from URL query parameter or default to Monday 1st Workday (2026-01-05) or today
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get('date');
  const showcaseParam = urlParams.get('showcase');

  const initialDate = dateParam ? parseISODate(dateParam) : parseISODate('2026-01-05');
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [activeTab, setActiveTab] = useState<'daily' | 'calendar' | 'showcase'>(
    showcaseParam ? 'showcase' : 'daily'
  );
  const [activeShowcaseModule, setActiveShowcaseModule] = useState<string | null>(
    showcaseParam || null
  );

  const currentDateStr = formatDateToISO(currentDate);

  const handleSelectDatePreset = (dateStr: string) => {
    setCurrentDate(parseISODate(dateStr));
  };

  const handleSelectShowcase = (showcase: string | null) => {
    setActiveShowcaseModule(showcase);
    if (showcase !== null) {
      setActiveTab('showcase');
    } else {
      setActiveTab('daily');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dev Toolbar */}
      <DevToolbar
        currentDateStr={currentDateStr}
        onSelectDatePreset={handleSelectDatePreset}
        activeShowcase={activeShowcaseModule}
        onSelectShowcase={handleSelectShowcase}
      />

      {/* App Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'daily' && (
          <DailyView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            onSelectDateForStandup={(date) => {
              setCurrentDate(date);
              setActiveTab('daily');
            }}
          />
        )}

        {activeTab === 'showcase' && (
          <ShowcaseView initialModule={activeShowcaseModule || 'daily'} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Skalironauten Sync Helper</span>
            <span className="text-slate-600">•</span>
            <span>Production Grade AAA</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>930 Action Days Indexed</span>
            <span>•</span>
            <span>307 Mood Scales Managed</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">60fps Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
