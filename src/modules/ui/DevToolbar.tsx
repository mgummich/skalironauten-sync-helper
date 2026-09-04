import React from 'react';
import { Calendar, RefreshCw, Layers, ShieldCheck, Terminal } from 'lucide-react';
import { resetMoodPool, clearMoodHistory } from '../mood';

interface DevToolbarProps {
  currentDateStr: string;
  onSelectDatePreset: (dateStr: string) => void;
  activeShowcase: string | null; // null = Main App, or 'data' | 'mood' | 'daily' | 'calendar' | 'ui'
  onSelectShowcase: (showcase: string | null) => void;
}

export const DevToolbar: React.FC<DevToolbarProps> = ({
  currentDateStr,
  onSelectDatePreset,
  activeShowcase,
  onSelectShowcase
}) => {
  const handleResetStorage = () => {
    resetMoodPool();
    clearMoodHistory();
    alert('localStorage state (used_mood_scales & mood_history) reset successfully!');
    window.location.reload();
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300 z-40 sticky top-0">
      {/* Date Presets */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5" /> Date Presets:
        </span>
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onSelectDatePreset('2026-01-05')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              currentDateStr === '2026-01-05'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            Mon 05.01 (1. Arbeitstag)
          </button>

          <button
            onClick={() => onSelectDatePreset('2026-01-07')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              currentDateStr === '2026-01-07'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            Mi 07.01 (Mid-Week)
          </button>

          <button
            onClick={() => onSelectDatePreset('2026-01-10')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              currentDateStr === '2026-01-10'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            Sa 10.01 (Wochenende)
          </button>

          <input
            type="date"
            value={currentDateStr}
            onChange={(e) => onSelectDatePreset(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Module Showcase Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Standalone Showcases:
        </span>
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onSelectShowcase(null)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeShowcase === null
                ? 'bg-slate-800 text-slate-100 font-bold border border-slate-700'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            Main App
          </button>
          <button
            onClick={() => onSelectShowcase('data')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeShowcase === 'data'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            data
          </button>
          <button
            onClick={() => onSelectShowcase('mood')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeShowcase === 'mood'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            mood
          </button>
          <button
            onClick={() => onSelectShowcase('daily')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeShowcase === 'daily'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            daily
          </button>
          <button
            onClick={() => onSelectShowcase('calendar')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeShowcase === 'calendar'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            calendar
          </button>
          <button
            onClick={() => onSelectShowcase('ui')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeShowcase === 'ui'
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            ui
          </button>
        </div>

        <button
          onClick={handleResetStorage}
          className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg border border-rose-500/30 text-[11px] font-medium transition-colors ml-2"
          title="Reset localStorage state"
        >
          <RefreshCw className="w-3 h-3" /> Reset Storage
        </button>
      </div>
    </div>
  );
};
