import React, { useState } from 'react';
import {
  getActionDaysForDate,
  getTotalActionDaysCount,
  getAllCategories,
  getAllRegions
} from './dataLoader';
import {
  isWorkday,
  isFirstWorkdayOfWeek,
  isFirstWorkdayOfMonth,
  formatDateGerman,
  formatDateToISO,
  parseISODate,
  getGermanWeekday
} from './dateUtils';
import { Calendar, CheckCircle, XCircle, Tag, MapPin, Database } from 'lucide-react';

export const DataShowcase: React.FC = () => {
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-01-05'); // Monday 1st workday
  const currentDate = parseISODate(selectedDateStr);

  const actionDays = getActionDaysForDate(currentDate);
  const workday = isWorkday(currentDate);
  const firstWorkdayWeek = isFirstWorkdayOfWeek(currentDate);
  const firstWorkdayMonth = isFirstWorkdayOfMonth(currentDate);
  const totalCount = getTotalActionDaysCount();
  const categories = getAllCategories();
  const regions = getAllRegions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Data Subsystem Showcase
          </h2>
          <p className="text-sm text-slate-400">
            Indexing {totalCount} Action Days & German Workday Logic Engine
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <span>{categories.length} Categories</span>
          <span className="text-slate-600">•</span>
          <span>{regions.length} Regions</span>
        </div>
      </div>

      {/* Interactive Date Controls */}
      <div className="glass-panel p-4 rounded-xl space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Select Date to Inspect Logic
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => setSelectedDateStr(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDateStr('2026-01-05')}
              className="px-3 py-1.5 text-xs bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 rounded-lg border border-indigo-500/30 transition-colors"
            >
              Mon 05.01.2026 (1st Workday)
            </button>
            <button
              onClick={() => setSelectedDateStr('2026-01-07')}
              className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              Wed 07.01.2026 (Mid-Week)
            </button>
            <button
              onClick={() => setSelectedDateStr('2026-01-10')}
              className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              Sat 10.01.2026 (Weekend)
            </button>
          </div>
        </div>
      </div>

      {/* Date Logic Results Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Formatted Date</span>
          <div className="text-lg font-bold text-slate-100">{formatDateGerman(currentDate)}</div>
          <div className="text-xs text-indigo-400">{getGermanWeekday(currentDate)}</div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Is Workday?</span>
          <div className="flex items-center gap-2">
            {workday ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" /> Yes (Arbeitstag)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold text-sm">
                <XCircle className="w-4 h-4" /> No (Wochenende/Feiertag)
              </span>
            )}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">1st Workday of Week?</span>
          <div className="flex items-center gap-2">
            {firstWorkdayWeek ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" /> Yes (Mood Check Active)
              </span>
            ) : (
              <span className="text-slate-400 text-sm">No</span>
            )}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">1st Workday of Month?</span>
          <div className="flex items-center gap-2">
            {firstWorkdayMonth ? (
              <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" /> Yes (Erster Arbeitstag)
              </span>
            ) : (
              <span className="text-slate-400 text-sm">No</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Days list */}
      <div className="glass-panel p-5 rounded-xl space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between">
          <span>Action Days on {formatDateGerman(currentDate)}</span>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/30">
            {actionDays.length} Action Days found
          </span>
        </h3>

        {actionDays.length === 0 ? (
          <p className="text-slate-500 text-sm italic py-4 text-center">No action days for this date.</p>
        ) : (
          <div className="space-y-3">
            {actionDays.map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-slate-100 text-sm">{item.name}</h4>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {item.charakter || 'Gedenktag'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{item.beschreibung}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Tag className="w-3 h-3 text-indigo-400" /> {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 text-amber-400" /> {item.region}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
