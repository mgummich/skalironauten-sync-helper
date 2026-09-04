import React from 'react';
import {
  getActionDaysForDate,
  isWorkday,
  isFirstWorkdayOfWeek,
  isFirstWorkdayOfMonth,
  formatDateGerman,
  getGermanWeekday
} from '../data';
import { X, Calendar, Tag, MapPin, ExternalLink, Briefcase, Sparkles } from 'lucide-react';

interface DayDetailModalProps {
  date: Date;
  onClose: () => void;
  onSelectDateForStandup: (date: Date) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  date,
  onClose,
  onSelectDateForStandup
}) => {
  const dateFormatted = formatDateGerman(date);
  const weekdayName = getGermanWeekday(date);
  const actionDays = getActionDaysForDate(date);
  const workday = isWorkday(date);
  const firstWorkdayWeek = isFirstWorkdayOfWeek(date);
  const firstWorkdayMonth = isFirstWorkdayOfMonth(date);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">{dateFormatted}</h3>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {weekdayName}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {workday ? (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Arbeitstag
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Wochenende / Feiertag</span>
              )}
              {firstWorkdayWeek && (
                <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 1. Arbeitstag der Woche
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Aktionstage ({actionDays.length})
            </span>
            <button
              onClick={() => {
                onSelectDateForStandup(date);
                onClose();
              }}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              Im Standup anzeigen
            </button>
          </div>

          {actionDays.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Keine eingetragenen Aktionstage für dieses Datum.
            </div>
          ) : (
            <div className="space-y-3">
              {actionDays.map((item, idx) => (
                <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-100 text-sm">{item.name}</h4>
                    {item.charakter && (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                        {item.charakter}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.beschreibung}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-400" /> {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" /> {item.region}
                    </span>
                    {item.quelle && (
                      <a
                        href={item.quelle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        Wiki <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
