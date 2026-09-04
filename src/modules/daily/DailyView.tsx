import { useState, useEffect, useRef } from 'react';
import { getActionDaysForDate } from '../data/dataLoader';
import {
  isWorkday,
  isFirstWorkdayOfWeek,
  isFirstWorkdayOfMonth,
  addDays,
  formatDateGerman,
  formatDateToISO,
  getGermanWeekday
} from '../data/dateUtils';
import { getMoodRatingForDate, getNextMoodScaleFilename } from '../mood/moodManager';
import { ActionDayCarousel } from './ActionDayCarousel';
import { MoodCheckModal } from './MoodCheckModal';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Smile,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  Briefcase
} from 'lucide-react';

interface DailyViewProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

export const DailyView = ({ currentDate, onDateChange }: DailyViewProps) => {
  const dateStr = formatDateToISO(currentDate);
  const dateFormatted = formatDateGerman(currentDate);
  const weekdayName = getGermanWeekday(currentDate);

  const actionDays = getActionDaysForDate(currentDate);
  const workday = isWorkday(currentDate);
  const firstWorkdayWeek = isFirstWorkdayOfWeek(currentDate);
  const firstWorkdayMonth = isFirstWorkdayOfMonth(currentDate);

  const yesterday = addDays(currentDate, -1);
  const tomorrow = addDays(currentDate, 1);

  // Mood state for date
  const [moodRating, setMoodRating] = useState(getMoodRatingForDate(dateStr));
  const [showMoodModal, setShowMoodModal] = useState<boolean>(false);
  const [currentScaleFile, setCurrentScaleFile] = useState<string>('');

  // Standup checklist state
  const [yesterdayNotes, setYesterdayNotes] = useState<string>('');
  const [todayNotes, setTodayNotes] = useState<string>('');
  const [blockers, setBlockers] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Guards against drawing twice for the same date (React StrictMode re-runs effects in dev).
  const drawnForDate = useRef<string | null>(null);

  // Update mood rating when date changes
  useEffect(() => {
    const existing = getMoodRatingForDate(dateStr);
    setMoodRating(existing);

    // Auto-trigger 1st-workday mood check if not rated yet
    if (firstWorkdayWeek && !existing && drawnForDate.current !== dateStr) {
      drawnForDate.current = dateStr;
      setCurrentScaleFile(getNextMoodScaleFilename().filename);
      setShowMoodModal(true);
    }
  }, [dateStr, firstWorkdayWeek]);

  const handleOpenMoodCheck = () => {
    const drawn = getNextMoodScaleFilename();
    setCurrentScaleFile(drawn.filename);
    setShowMoodModal(true);
  };

  const handleMoodComplete = () => {
    setMoodRating(getMoodRatingForDate(dateStr));
    setShowMoodModal(false);
  };

  const handleCopyStandup = () => {
    const actionDayNames = actionDays.map(a => a.name).join(', ');
    const moodText = moodRating ? ` (Mood: ${moodRating.rating}/9)` : '';
    const text = `🚀 *Daily Standup - ${dateFormatted} (${weekdayName})*${moodText}
${actionDayNames ? `🎉 Aktionstage: ${actionDayNames}\n` : ''}
*Gestern:*
${yesterdayNotes || '- Standard Aufgaben abgearbeitet'}

*Heute:*
${todayNotes || '- Heutige Tasks & Syncs'}

*Blocker:*
${blockers || '- Keine Blocker'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Date Navigation & Badges Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDateChange(yesterday)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-800 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Gestern ({formatDateGerman(yesterday).slice(0, 5)})
          </button>

          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/30 transition-colors"
          >
            Heute
          </button>

          <button
            onClick={() => onDateChange(tomorrow)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-800 transition-colors flex items-center gap-1"
          >
            Morgen ({formatDateGerman(tomorrow).slice(0, 5)}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Date Display & Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-100">{dateFormatted}</div>
            <div className="text-xs text-indigo-400 font-medium">{weekdayName}</div>
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            {workday ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Arbeitstag
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Wochenende / Feiertag
              </span>
            )}

            {firstWorkdayWeek && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1 animate-pulse-subtle">
                <Sparkles className="w-3 h-3" /> 1. Arbeitstag (Woche)
              </span>
            )}

            {firstWorkdayMonth && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                1. Arbeitstag (Monat)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mood Check Banner / Status */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Mood Check Status</h4>
            {moodRating ? (
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Abgegeben: <strong>{moodRating.rating} / 9</strong>
              </p>
            ) : firstWorkdayWeek ? (
              <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> 1. Arbeitstag der Woche — Mood Check ausstehend!
              </p>
            ) : (
              <p className="text-xs text-slate-400">Für diesen Tag wurde noch keine Stimmung erfasst.</p>
            )}
          </div>
        </div>

        <button
          onClick={handleOpenMoodCheck}
          className="px-3.5 py-2 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl transition-all shadow-sm"
        >
          {moodRating ? 'Stimmung ändern' : 'Mood Check starten'}
        </button>
      </div>

      {/* Action Day Card Carousel */}
      <ActionDayCarousel actionDays={actionDays} dateFormatted={dateFormatted} />

      {/* Standup Meeting Helper Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Standup Agenda & Notizen
          </h3>
          <button
            onClick={handleCopyStandup}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Kopiert!' : 'Standup Text kopieren'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Was habe ich gestern getan?</label>
            <textarea
              value={yesterdayNotes}
              onChange={(e) => setYesterdayNotes(e.target.value)}
              placeholder="- Frontend Refactoring&#10;- PR Review #102"
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Was tue ich heute?</label>
            <textarea
              value={todayNotes}
              onChange={(e) => setTodayNotes(e.target.value)}
              placeholder="- E2E Verification&#10;- Daily Sync halten"
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Blocker / Impeditiven?</label>
            <textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="- Keine Blocker"
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Mood Check Modal Overlay */}
      {showMoodModal && (
        <MoodCheckModal
          dateStr={dateStr}
          scaleFilename={currentScaleFile}
          onComplete={handleMoodComplete}
          onDismiss={() => setShowMoodModal(false)}
        />
      )}
    </div>
  );
};
