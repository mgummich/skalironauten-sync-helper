import { RefreshCw, Terminal } from 'lucide-react';
import { resetMoodPool, clearMoodHistory } from '../mood/moodManager';

const DATE_PRESETS = [
  { date: '2026-01-05', label: 'Mon 05.01 (1. Arbeitstag)' },
  { date: '2026-01-07', label: 'Mi 07.01 (Mid-Week)' },
  { date: '2026-01-10', label: 'Sa 10.01 (Wochenende)' }
];

interface DevToolbarProps {
  currentDateStr: string;
  onSelectDatePreset: (dateStr: string) => void;
}

export const DevToolbar = ({ currentDateStr, onSelectDatePreset }: DevToolbarProps) => {
  const handleResetStorage = () => {
    resetMoodPool();
    clearMoodHistory();
    window.location.reload();
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5" /> Date Presets:
        </span>
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          {DATE_PRESETS.map(({ date, label }) => (
            <button
              key={date}
              onClick={() => onSelectDatePreset(date)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                currentDateStr === date
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
          <input
            type="date"
            value={currentDateStr}
            onChange={(e) => onSelectDatePreset(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleResetStorage}
        className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg border border-rose-500/30 text-[11px] font-medium transition-colors"
        title="Reset localStorage state"
      >
        <RefreshCw className="w-3 h-3" /> Reset Storage
      </button>
    </div>
  );
};
