import React, { useState } from 'react';
import { DataShowcase } from '../data';
import { MoodShowcase } from '../mood';
import { DailyShowcase } from '../daily';
import { CalendarShowcase } from '../calendar';
import { UIShowcase } from './UIShowcase';
import { Database, Smile, Sun, Calendar, LayoutGrid } from 'lucide-react';

interface ShowcaseViewProps {
  initialModule?: string | null;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ initialModule }) => {
  const [activeModule, setActiveModule] = useState<string>(initialModule || 'daily');

  return (
    <div className="space-y-6">
      {/* Module Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveModule('daily')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeModule === 'daily'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sun className="w-4 h-4" /> daily Module
        </button>

        <button
          onClick={() => setActiveModule('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeModule === 'calendar'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> calendar Module
        </button>

        <button
          onClick={() => setActiveModule('mood')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeModule === 'mood'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Smile className="w-4 h-4" /> mood Module
        </button>

        <button
          onClick={() => setActiveModule('data')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeModule === 'data'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4" /> data Module
        </button>

        <button
          onClick={() => setActiveModule('ui')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeModule === 'ui'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> ui Design System
        </button>
      </div>

      {/* Render active module showcase */}
      <div className="pt-2">
        {activeModule === 'data' && <DataShowcase />}
        {activeModule === 'mood' && <MoodShowcase />}
        {activeModule === 'daily' && <DailyShowcase />}
        {activeModule === 'calendar' && <CalendarShowcase />}
        {activeModule === 'ui' && <UIShowcase />}
      </div>
    </div>
  );
};
