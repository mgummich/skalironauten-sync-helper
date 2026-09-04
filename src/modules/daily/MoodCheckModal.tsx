import { useState, KeyboardEvent } from 'react';
import { X, ZoomIn, Image as ImageIcon, Check } from 'lucide-react';
import { Sheet, useSheetClose } from '../ui/Sheet';
import { Lightbox } from '../ui/Lightbox';
import { MoodsView } from '../mood/MoodsView';
import { getMoodImage, getMoodImageUrl, getMoodUsage } from '../mood/moodLibrary';
import { clearPendingDraw, getMoodPick, setMoodPick } from '../mood/moodManager';
import { saveMood } from '../data/storage';
import { formatDateLong } from '../data/dateUtils';
import { cx, BTN_DISABLED, BTN_ICON, BTN_PRIMARY, BTN_SECONDARY, BTN_TERTIARY, FOCUS } from '../ui/cls';

interface Props {
  date: Date;
  iso: string;
  imageId: string;
  initialValue?: number;
  onImageChange: (imageId: string) => void;
  onSaved: () => void;
  onClose: () => void;
}

const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const MoodCheckModal = (props: Props) => (
  <Sheet label="Mood Check" onClose={props.onClose}>
    <MoodCheckBody {...props} />
  </Sheet>
);

const MoodCheckBody = ({ date, iso, imageId, initialValue, onImageChange, onSaved }: Props) => {
  const close = useSheetClose();
  const [selected, setSelected] = useState<number | null>(initialValue ?? null);
  const [saved, setSaved] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [picker, setPicker] = useState(false);
  const picked = getMoodPick(iso) === imageId;
  const url = getMoodImageUrl(imageId);
  const image = getMoodImage(imageId);
  const usage = getMoodUsage().get(imageId) ?? [];
  const lastUse = usage[0] && `${usage[0].iso.slice(8, 10)}.${usage[0].iso.slice(5, 7)}.`;

  const save = () => {
    if (selected === null) return;
    saveMood(iso, { value: selected, imageId, savedAt: Date.now() });
    clearPendingDraw(iso);
    setSaved(selected);
    onSaved();
  };

  const pick = (id: string) => {
    setMoodPick(iso, id);
    onImageChange(id);
    setLoaded(false);
    setPicker(false);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 3, ArrowLeft: -1, ArrowUp: -3 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = Math.min(9, Math.max(1, (selected ?? 1) + step));
    setSelected(next);
    (e.currentTarget.querySelector(`[data-value="${next}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold lg:text-[22px]">Mood Check</h2>
          <p className="text-sm text-slate-600">{formatDateLong(date)}</p>
        </div>
        <button type="button" aria-label="Schließen" onClick={close} className={cx('-mr-2 -mt-1 h-11 w-11 shrink-0', BTN_ICON)}>
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-slate-100 lg:aspect-[16/10]">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-600">
            <ImageIcon className="h-7 w-7" aria-hidden />
            <span className="text-sm">Bild wird geladen …</span>
          </div>
        )}
        <img
          key={imageId}
          src={url}
          alt="Mood-Skala, Raster aus 9 Feldern"
          onLoad={() => setLoaded(true)}
          className={cx('h-full w-full object-contain', !loaded && 'invisible')}
        />
        {loaded && image && (
          <span className="absolute bottom-2 left-2 inline-flex h-7 max-w-[60%] items-center truncate rounded border border-slate-300 bg-white/90 px-2.5 text-sm text-slate-700">
            {image.title}
          </span>
        )}
        <button
          type="button"
          aria-label="Bild vergrößern"
          disabled={!loaded}
          onClick={() => setLightbox(true)}
          className={cx('absolute bottom-2 right-2 h-11 w-11 border border-slate-300 bg-white/90 text-slate-700 hover:bg-white', BTN_ICON)}
        >
          <ZoomIn className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-sm text-slate-600">
          {picked ? 'Selbst gewählt' : 'Zufallsvorschlag'}
          {usage.length ? ` · ${usage.length}× genutzt (${lastUse})` : ' · noch ungenutzt'}
        </span>
        <button type="button" onClick={() => setPicker(true)} className={cx('h-9 shrink-0 px-3.5 text-sm', BTN_SECONDARY)}>
          Anderes Bild wählen
        </button>
      </div>

      <p id="mood-label" className="mt-4 text-sm font-medium text-slate-700">
        Welches Feld bist du heute? (1–9)
      </p>
      <div role="radiogroup" aria-labelledby="mood-label" onKeyDown={onKey} className="mt-2 grid grid-cols-3 gap-2 lg:grid-cols-9">
        {VALUES.map((v) => {
          const on = selected === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={on}
              data-value={v}
              tabIndex={on || (selected === null && v === 1) ? 0 : -1}
              onClick={() => setSelected(v)}
              className={cx(
                'h-12 rounded-md border text-lg transition-colors duration-150 motion-reduce:transition-none',
                on ? 'border-red-700 bg-red-600 font-bold text-white' : 'border-slate-300 bg-slate-100 font-semibold hover:bg-slate-200',
                FOCUS
              )}
            >
              {v}
            </button>
          );
        })}
      </div>

      {saved !== null && (
        <div className="mt-4 flex items-center justify-between gap-3" aria-live="polite">
          <span className="inline-flex items-center gap-2 font-semibold text-emerald-700">
            <Check className="h-5 w-5" aria-hidden /> Gespeichert: {saved} von 9
          </span>
          <button type="button" onClick={close} className={cx('h-11 px-4 text-base', BTN_TERTIARY)}>
            Schließen
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={selected === null || selected === saved}
        onClick={save}
        className={cx('mt-4 h-12 w-full text-base', selected === null || selected === saved ? BTN_DISABLED : BTN_PRIMARY)}
      >
        {selected === null ? 'Stimmung speichern' : `Stimmung ${selected} speichern`}
      </button>

      {lightbox && <Lightbox url={url} onClose={() => setLightbox(false)} />}
      {picker && (
        <Sheet label="Mood-Bild wählen" onClose={() => setPicker(false)}>
          <MoodsView pickMode onChooseForToday={pick} />
        </Sheet>
      )}
    </div>
  );
};
