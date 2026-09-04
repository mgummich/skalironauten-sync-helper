import React from 'react';
import { Sun, Calendar, Sparkles, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  activeTab: 'daily' | 'calendar' | 'showcase';
  onTabChange: (tab: 'daily' | 'calendar' | 'showcase') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-9 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          <div>
            <h1 className="text-base font-bold text-slate-100 leading-none flex items-center gap-2">
              Skalironauten Sync Helper
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                v1.0 AAA
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Daily Standup & Aktionstage Assistant</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('daily')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'daily'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Daily Standup
          </button>

          <button
            onClick={() => onTabChange('calendar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> 365-Tage Kalender
          </button>

          <button
            onClick={() => onTabChange('showcase')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'showcase'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Subsystem Demos
          </button>
        </nav>
      </div>
    </header>
  );
};
