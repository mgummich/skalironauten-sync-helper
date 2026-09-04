import { useState, KeyboardEvent } from 'react';
import { X, ZoomIn, Image as ImageIcon, Check } from 'lucide-react';
import { Sheet, useSheetClose } from '../ui/Sheet';
import { getMoodImageUrl, clearPendingDraw } from '../mood/moodManager';
import { saveMood } from '../data/storage';
import { formatDateLong } from '../data/dateUtils';
import { cx, BTN_GHOST, BTN_RED, FOCUS } from '../ui/cls';

interface Props {
  date: Date;
  iso: string;
  imageId: string;
  initialValue?: number;
  onSaved: () => void;
  onClose: () => void;
}

const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const MoodCheckModal = (props: Props) => (
  <Sheet label="Mood Check" onClose={props.onClose}>
    <MoodCheckBody {...props} />
  </Sheet>
);

const MoodCheckBody = ({ date, iso, imageId, initialValue, onSaved }: Props) => {
  const close = useSheetClose();
  const [selected, setSelected] = useState<number | null>(initialValue ?? null);
  const [saved, setSaved] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const url = getMoodImageUrl(imageId);

  const save = () => {
    if (selected === null) return;
    saveMood(iso, { value: selected, imageId, savedAt: Date.now() });
    clearPendingDraw(iso);
    setSaved(selected);
    onSaved();
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
          <p className="text-sm text-gray-600">{formatDateLong(date)}</p>
        </div>
        <button type="button" aria-label="Schließen" onClick={close} className={cx('h-11 w-11 -mr-2 -mt-1', BTN_GHOST)}>
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-md border border-gray-200 bg-gray-100 lg:aspect-[16/10]">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600">
            <ImageIcon className="h-7 w-7" aria-hidden />
            <span className="text-sm">Bild wird geladen …</span>
          </div>
        )}
        <img
          src={url}
          alt="Mood-Skala, Raster aus 9 Feldern"
          onLoad={() => setLoaded(true)}
          className={cx('h-full w-full object-contain', !loaded && 'invisible')}
        />
        <button
          type="button"
          aria-label="Bild vergrößern"
          disabled={!loaded}
          onClick={() => setLightbox(true)}
          className={cx('absolute bottom-2 right-2 h-11 w-11 border border-gray-300 bg-white/90', BTN_GHOST)}
        >
          <ZoomIn className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <p id="mood-label" className="mt-4 text-sm font-medium text-gray-700">
        Welches Feld bist du heute? (1–9)
      </p>
      <div
        role="radiogroup"
        aria-labelledby="mood-label"
        onKeyDown={onKey}
        className="mt-2 grid grid-cols-3 gap-2 lg:grid-cols-9"
      >
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
                on ? 'border-red-700 bg-red-600 font-bold text-white' : 'border-gray-300 bg-gray-100 font-semibold hover:bg-gray-200',
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
          <button
            type="button"
            onClick={close}
            className={cx('h-11 rounded-md border border-gray-300 bg-gray-100 px-4 font-semibold hover:bg-gray-200', FOCUS)}
          >
            Schließen
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={selected === null || selected === saved}
        onClick={save}
        className={cx(
          'mt-4 h-12 w-full',
          selected === null || selected === saved
            ? `inline-flex items-center justify-center rounded-md bg-gray-200 font-semibold text-gray-600 ${FOCUS}`
            : BTN_RED
        )}
      >
        {selected === null ? 'Stimmung speichern' : `Stimmung ${selected} speichern`}
      </button>

      {lightbox && (
        <Sheet label="Bild in Originalgröße" variant="lightbox" onClose={() => setLightbox(false)}>
          <Lightbox url={url} />
        </Sheet>
      )}
    </div>
  );
};

const Lightbox = ({ url }: { url: string }) => {
  const close = useSheetClose();
  return (
    <div className="flex h-full w-full items-center justify-center p-4" onClick={close}>
      <img src={url} alt="Mood-Skala in Originalgröße" className="max-h-full max-w-full object-contain" />
      <button type="button" aria-label="Schließen" onClick={close} className={cx('absolute right-4 top-4 h-11 w-11 bg-white', BTN_GHOST)}>
        <X className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
};
