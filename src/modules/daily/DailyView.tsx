import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActionDaysForDate } from '../data/dataLoader';
import {
  isWorkday,
  isFirstWorkdayOfWeek,
  isFirstWorkdayOfMonth,
  isToday,
  addDays,
  formatDateToISO,
  formatDateNoWeekday,
  getGermanWeekday
} from '../data/dateUtils';
import { getMood } from '../data/storage';
import { getPendingDraw, drawMoodImage } from '../mood/moodManager';
import { getMoodImageUrl } from '../mood/moodLibrary';
import { AktionstagCard } from './AktionstagCard';
import { MoodCheckModal } from './MoodCheckModal';
import type { DailyTarget } from '../ui/AppShell';
import { cx, BADGE_AMBER, BTN_PRIMARY, BTN_TERTIARY, CARD, CARD_RAISED, PILL, FOCUS } from '../ui/cls';

interface Props {
  target: DailyTarget;
  onDateChange: (date: Date) => void;
  /** Changes when the Moods gallery handed over an image; reopens the Mood Check. */
  openMoodRequest: number;
}

export const DailyView = ({ target, onDateChange, openMoodRequest }: Props) => {
  const { date } = target;
  const iso = formatDateToISO(date);
  const entries = getActionDaysForDate(date);
  const workday = isWorkday(date);
  const firstOfWeek = isFirstWorkdayOfWeek(date);
  const firstOfMonth = isFirstWorkdayOfMonth(date);

  const [entryIndex, setEntryIndex] = useState(target.entryIndex);
  const [mood, setMood] = useState(() => getMood(iso));
  const [moodOpen, setMoodOpen] = useState<string | null>(null); // image id while open

  useEffect(() => {
    setEntryIndex(Math.min(target.entryIndex, Math.max(0, entries.length - 1)));
    setMood(getMood(iso));
    setMoodOpen(null);
  }, [iso, target]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (openMoodRequest > 0) setMoodOpen(getPendingDraw(iso));
  }, [openMoodRequest]); // eslint-disable-line react-hooks/exhaustive-deps

  const openMood = () => setMoodOpen(mood ? drawMoodImage() : getPendingDraw(iso));
  const thumbId = mood?.imageId ?? getPendingDraw(iso);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Date row */}
      <section aria-label="Datum" className="flex flex-col items-center gap-2.5">
        <div className="flex w-full items-center justify-between gap-2">
          <button type="button" aria-label="Vortag" onClick={() => onDateChange(addDays(date, -1))} className={cx('h-11 w-11 shrink-0', BTN_TERTIARY)}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="text-center">
            <p className="text-sm text-slate-600 lg:hidden">
              {getGermanWeekday(date)}
              {isToday(date) && ' · Heute'}
            </p>
            <h2 className="text-xl font-semibold tracking-tight tabular-nums lg:text-3xl">
              <span className="hidden lg:inline">{getGermanWeekday(date)}, </span>
              {formatDateNoWeekday(date)}
            </h2>
          </div>
          <button type="button" aria-label="Nächster Tag" onClick={() => onDateChange(addDays(date, 1))} className={cx('h-11 w-11 shrink-0', BTN_TERTIARY)}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {workday ? (
            <span className={cx(PILL, 'bg-emerald-100 text-emerald-700')}>Arbeitstag</span>
          ) : (
            <span className={cx(PILL, 'bg-slate-200 text-slate-700')}>Wochenende / Feiertag</span>
          )}
          {firstOfWeek && <span className={cx(PILL, 'bg-amber-100 text-amber-800')}>1. Arbeitstag der Woche</span>}
          {firstOfMonth && <span className={cx(PILL, 'bg-amber-100 text-amber-800')}>1. Arbeitstag des Monats</span>}
          {!isToday(date) && (
            <button type="button" onClick={() => onDateChange(new Date())} className={cx(PILL, 'border border-slate-300 text-slate-700 hover:bg-slate-200', FOCUS)}>
              Zu heute
            </button>
          )}
        </div>
      </section>

      <AktionstagCard date={date} entries={entries} index={entryIndex} onIndexChange={setEntryIndex} onNavigateDate={onDateChange} />

      {/* Mood card */}
      <section aria-label="Mood Check" className={cx('p-4 lg:mx-auto lg:max-w-[560px]', mood ? CARD : CARD_RAISED)}>
          {mood ? (
            <div className="flex items-center gap-3">
              <Thumb id={thumbId} size="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold">
                  Stimmung <span className="text-red-700">{mood.value}</span> von 9
                </p>
                <p className="text-sm text-slate-600">
                  Mood Check gespeichert · {new Date(mood.savedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button type="button" onClick={openMood} className={cx('h-11 shrink-0 px-4 text-base', BTN_TERTIARY)}>
                Ändern
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3.5">
                <Thumb id={thumbId} size={firstOfWeek ? 'h-16 w-16' : 'h-[88px] w-[88px]'} />
                <div className="min-w-0">
                  <p className="text-lg font-semibold">Mood Check</p>
                  {firstOfWeek ? (
                    <span className={cx('mt-1', BADGE_AMBER)}>Erster Arbeitstag der Woche · offen</span>
                  ) : (
                    <p className="text-sm text-slate-600">Noch keine Stimmung für heute. Ein Bild, eine Zahl von 1 bis 9.</p>
                  )}
                </div>
              </div>
              <button type="button" onClick={openMood} className={cx('mt-3.5 h-12 w-full text-base', BTN_PRIMARY)}>
                Mood Check starten
              </button>
            </>
          )}
      </section>

      {moodOpen && (
        <MoodCheckModal
          date={date}
          iso={iso}
          imageId={moodOpen}
          initialValue={mood?.value}
          onImageChange={setMoodOpen}
          onSaved={() => setMood(getMood(iso))}
          onClose={() => setMoodOpen(null)}
        />
      )}
    </div>
  );
};

const Thumb = ({ id, size }: { id: string; size: string }) => (
  <img src={getMoodImageUrl(id)} alt="" className={cx(size, 'shrink-0 rounded border border-slate-300 bg-slate-100 object-cover')} />
);
