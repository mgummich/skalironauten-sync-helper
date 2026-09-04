import { useState } from 'react';
import { MonthGrid } from './MonthGrid';
import { DayDetailModal } from './DayDetailModal';
import { getAllCategories, getAllRegions, searchActionDays, getTotalActionDaysCount } from '../data/dataLoader';
import { Calendar as CalendarIcon, Search, Filter, Database, CheckCircle, Sparkles } from 'lucide-react';

interface CalendarViewProps {
  onSelectDateForStandup: (date: Date) => void;
}

export const CalendarView = ({ onSelectDateForStandup }: CalendarViewProps) => {
  const [year, setYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [inspectDate, setInspectDate] = useState<Date | null>(null);

  const categories = getAllCategories();
  const regions = getAllRegions();
  const searchResults = searchQuery || selectedCategory || selectedRegion
    ? searchActionDays(searchQuery, selectedCategory || undefined, selectedRegion || undefined)
    : null;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
              365-Tage Kalender & Aktionstage Inspector
            </h2>
            <p className="text-sm text-slate-400">
              Übersicht aller {getTotalActionDaysCount()} Gedenk- und Aktionstage für das Jahr {year}
            </p>
          </div>

          {/* Year Switcher */}
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setYear(2026)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                year === 2026
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Jahr 2026
            </button>
            <button
              onClick={() => setYear(2027)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                year === 2027
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Jahr 2027
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Aktionstag suchen..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none"
            >
              <option value="">Alle Kategorien ({categories.length})</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none"
            >
              <option value="">Alle Regionen ({regions.length})</option>
              {regions.map((reg, idx) => (
                <option key={idx} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Results Drawer if searching */}
      {searchResults && (
        <div className="glass-panel p-5 rounded-2xl space-y-3 border border-indigo-500/30">
          <h3 className="text-sm font-semibold text-indigo-300 flex items-center justify-between">
            <span>Suchergebnisse ({searchResults.length} Treffer)</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedRegion('');
              }}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Filter zurücksetzen
            </button>
          </h3>

          {searchResults.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">Keine Aktionstage zu deinen Filtern gefunden.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {searchResults.slice(0, 30).map((item, idx) => {
                const targetDate = new Date(year, item.month - 1, item.day);
                return (
                  <div
                    key={idx}
                    onClick={() => setInspectDate(targetDate)}
                    className="p-3 bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-100">{item.name}</span>
                      <span className="text-indigo-400 font-mono">{item.day_str}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.beschreibung}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 12-Month Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthIdx) => (
          <MonthGrid
            key={monthIdx}
            year={year}
            monthIndex={monthIdx}
            onSelectDay={(date) => setInspectDate(date)}
          />
        ))}
      </div>

      {/* Day Inspector Modal */}
      {inspectDate && (
        <DayDetailModal
          date={inspectDate}
          onClose={() => setInspectDate(null)}
          onSelectDateForStandup={onSelectDateForStandup}
        />
      )}
    </div>
  );
};
