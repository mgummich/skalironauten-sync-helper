import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { getActionDaysForDate } from '../data/dataLoader';
import {
  isWorkday,
  isFirstWorkdayOfWeek,
  isFirstWorkdayOfMonth,
  isToday,
  addDays,
  formatDateToISO,
  formatDateLong,
  formatDateNoWeekday,
  getGermanWeekday
} from '../data/dateUtils';
import { getNotes, saveNotes, hasSavedNotes, getMood, Notes } from '../data/storage';
import { getPendingDraw, getMoodImageUrl, isVideo, drawMoodImage } from '../mood/moodManager';
import { AktionstagCard } from './AktionstagCard';
import { MoodCheckModal } from './MoodCheckModal';
import type { DailyTarget } from '../ui/AppShell';
import { cx, BTN_OUTLINE, BTN_RED, INPUT, FOCUS } from '../ui/cls';

interface Props {
  target: DailyTarget;
  onDateChange: (date: Date) => void;
}

const PILL = 'inline-flex h-7 items-center rounded-full px-2.5 text-sm font-medium';

export const DailyView = ({ target, onDateChange }: Props) => {
  const { date } = target;
  const iso = formatDateToISO(date);
  const entries = getActionDaysForDate(date);
  const workday = isWorkday(date);
  const firstOfWeek = isFirstWorkdayOfWeek(date);
  const firstOfMonth = isFirstWorkdayOfMonth(date);

  const [entryIndex, setEntryIndex] = useState(target.entryIndex);
  const [mood, setMood] = useState(() => getMood(iso));
  const [moodOpen, setMoodOpen] = useState<string | null>(null); // image id while open
  const [notes, setNotes] = useState<Notes>(() => getNotes(iso));
  const [notesSaved, setNotesSaved] = useState(() => hasSavedNotes(iso));
  const [copied, setCopied] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setEntryIndex(Math.min(target.entryIndex, Math.max(0, entries.length - 1)));
    setMood(getMood(iso));
    setNotes(getNotes(iso));
    setNotesSaved(hasSavedNotes(iso));
    setMoodOpen(null);
  }, [iso, target]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateNotes = (patch: Partial<Notes>) => {
    const next = { ...notes, ...patch };
    setNotes(next);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveNotes(iso, next);
      setNotesSaved(true);
    }, 300);
  };

  const copyStandup = async () => {
    const entry = entries[entryIndex];
    const lines = [
      `Standup – ${formatDateLong(date)}`,
      entry && `Aktionstag: ${entry.name} (${entry.category}, ${entry.region})`,
      `Gestern: ${notes.gestern.trim() || '…'}`,
      `Heute: ${notes.heute.trim() || '…'}`,
      `Blocker: ${notes.blocker.trim() || 'Keine'}`
    ].filter(Boolean);
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const openMood = () => setMoodOpen(mood ? drawMoodImage() : getPendingDraw(iso));
  const thumbId = mood?.imageId ?? getPendingDraw(iso);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Date row */}
      <section aria-label="Datum" className="flex flex-col items-center gap-3">
        <div className="flex w-full items-center justify-between gap-3">
          <button type="button" aria-label="Vortag" onClick={() => onDateChange(addDays(date, -1))} className={cx('h-11 w-11', BTN_OUTLINE)}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600 lg:hidden">
              {getGermanWeekday(date)}
              {isToday(date) && ' · Heute'}
            </p>
            <h2 className="text-xl font-semibold tracking-tight tabular-nums lg:text-3xl">
              <span className="hidden lg:inline">{getGermanWeekday(date)}, </span>
              {formatDateNoWeekday(date)}
            </h2>
          </div>
          <button type="button" aria-label="Nächster Tag" onClick={() => onDateChange(addDays(date, 1))} className={cx('h-11 w-11', BTN_OUTLINE)}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {workday ? (
            <span className={cx(PILL, 'bg-emerald-100 text-emerald-700')}>Arbeitstag</span>
          ) : (
            <span className={cx(PILL, 'bg-gray-200 text-gray-700')}>Wochenende / Feiertag</span>
          )}
          {firstOfWeek && <span className={cx(PILL, 'bg-amber-100 text-amber-800')}>1. Arbeitstag der Woche</span>}
          {firstOfMonth && <span className={cx(PILL, 'bg-amber-100 text-amber-800')}>1. Arbeitstag des Monats</span>}
          {!isToday(date) && (
            <button type="button" onClick={() => onDateChange(new Date())} className={cx(PILL, 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100', FOCUS)}>
              Zu heute
            </button>
          )}
        </div>
      </section>

      <AktionstagCard date={date} entries={entries} index={entryIndex} onIndexChange={setEntryIndex} onNavigateDate={onDateChange} />

      <div className="space-y-4 lg:grid lg:grid-cols-[5fr_7fr] lg:gap-6 lg:space-y-0">
        {/* Mood card */}
        <section
          aria-label="Mood Check"
          className={cx('rounded-lg border bg-white p-4', !mood && firstOfWeek ? 'border-amber-500' : 'border-gray-300')}
        >
          {mood ? (
            <div className="flex items-center gap-3">
              <Thumb id={thumbId} size="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold">
                  Stimmung <span className="text-red-700">{mood.value}</span> von 9
                </p>
                <p className="text-sm text-gray-600">
                  Mood Check gespeichert · {new Date(mood.savedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button type="button" onClick={openMood} className={cx('h-11 px-4 font-semibold', BTN_OUTLINE)}>
                Ändern
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Thumb id={thumbId} size={firstOfWeek ? 'h-16 w-16' : 'h-22 w-22'} />
                <div className="min-w-0">
                  <p className="text-lg font-semibold">Mood Check</p>
                  {firstOfWeek ? (
                    <p className="text-sm font-medium text-amber-800">Erster Arbeitstag der Woche – noch offen</p>
                  ) : (
                    <p className="text-sm text-gray-600">Noch keine Stimmung für heute. Ein Bild, eine Zahl von 1 bis 9.</p>
                  )}
                </div>
              </div>
              <button type="button" onClick={openMood} className={cx('mt-3 h-12 w-full', BTN_RED)}>
                Mood Check starten
              </button>
            </>
          )}
        </section>

        {/* Notes */}
        <section aria-label="Standup-Notizen" className="lg:rounded-lg lg:border lg:border-gray-300 lg:bg-white lg:p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-semibold">Standup-Notizen</h3>
            <span className="text-sm text-gray-600">{notesSaved ? 'gespeichert' : 'wird pro Tag gespeichert'}</span>
          </div>
          <div className="mt-3 space-y-3 lg:grid lg:grid-cols-3 lg:gap-3 lg:space-y-0">
            {(
              [
                ['gestern', 'Gestern', 'Was war gestern?'],
                ['heute', 'Heute', 'Was steht heute an?'],
                ['blocker', 'Blocker', 'Keine']
              ] as const
            ).map(([key, label, placeholder]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
                <input
                  type="text"
                  value={notes[key]}
                  placeholder={placeholder}
                  onChange={(e) => updateNotes({ [key]: e.target.value })}
                  onBlur={() => saveNotes(iso, notes)}
                  className={INPUT}
                />
              </label>
            ))}
          </div>
          <div className="mt-4 lg:flex lg:items-center lg:gap-4">
            <button
              type="button"
              onClick={copyStandup}
              className={cx(
                'inline-flex h-12 w-full items-center justify-center gap-2 rounded-md font-semibold text-white transition-colors duration-200 motion-reduce:transition-none lg:h-11 lg:w-auto lg:px-5',
                copied ? 'bg-emerald-700' : 'bg-gray-900 hover:bg-gray-800',
                FOCUS
              )}
            >
              {copied ? <Check className="h-5 w-5" aria-hidden /> : <Copy className="h-5 w-5" aria-hidden />}
              {copied ? 'Kopiert' : 'Standup-Text kopieren'}
            </button>
            <p className="mt-2 text-center text-sm text-gray-600 lg:mt-0 lg:text-left" aria-live="polite">
              {copied ? (
                'Datum, Aktionstag und Notizen sind in der Zwischenablage.'
              ) : (
                <span className="hidden lg:inline">Datum · Aktionstag · Gestern / Heute / Blocker</span>
              )}
            </p>
          </div>
        </section>
      </div>

      {moodOpen && (
        <MoodCheckModal
          date={date}
          iso={iso}
          imageId={moodOpen}
          initialValue={mood?.value}
          onSaved={() => setMood(getMood(iso))}
          onClose={() => setMoodOpen(null)}
        />
      )}
    </div>
  );
};

const Thumb = ({ id, size }: { id: string; size: string }) => {
  const url = getMoodImageUrl(id);
  const cls = cx(size, 'shrink-0 rounded border border-gray-300 object-cover bg-gray-100');
  return isVideo(id) ? <video src={url} muted playsInline className={cls} /> : <img src={url} alt="" className={cls} />;
};

