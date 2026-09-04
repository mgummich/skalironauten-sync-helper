import { useState } from 'react';
import { X, ZoomIn, ExternalLink, TriangleAlert } from 'lucide-react';
import { Sheet, useSheetClose } from '../ui/Sheet';
import { Lightbox } from '../ui/Lightbox';
import { getMoodImageUrl, MoodImage, MoodUsage } from './moodLibrary';
import { formatDateLong, parseISODate } from '../data/dateUtils';
import { cx, BTN_ICON, BTN_PRIMARY, BTN_SECONDARY, FOCUS } from '../ui/cls';

interface Props {
  image: MoodImage;
  usage: MoodUsage[];
  onChoose: () => void;
  onClose: () => void;
}

export const MoodDetailSheet = (props: Props) => (
  <Sheet label={props.image.title} onClose={props.onClose}>
    <Body {...props} />
  </Sheet>
);

const Body = ({ image, usage, onChoose }: Props) => {
  const close = useSheetClose();
  const [lightbox, setLightbox] = useState(false);
  const url = getMoodImageUrl(image.id);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold lg:text-[22px]">{image.title}</h2>
          {image.sourceUrl && (
            <a
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cx('inline-flex min-h-6 items-center gap-1.5 rounded text-sm font-semibold text-red-700 hover:underline', FOCUS)}
            >
              Quelle <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>
        <button type="button" aria-label="Schließen" onClick={close} className={cx('-mr-2 -mt-1 h-11 w-11 shrink-0', BTN_ICON)}>
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        <img src={url} alt={image.title} className="h-full w-full object-contain" />
        <button
          type="button"
          aria-label="Bild vergrößern"
          onClick={() => setLightbox(true)}
          className={cx('absolute bottom-2 right-2 h-11 w-11 border border-slate-300 bg-white/90 text-slate-700 hover:bg-white', BTN_ICON)}
        >
          <ZoomIn className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div>
        <p className="text-sm font-medium uppercase tracking-[0.06em] text-slate-600">
          {usage.length === 0 ? 'Noch nicht genutzt' : `${usage.length} ${usage.length === 1 ? 'Nutzung' : 'Nutzungen'}`}
        </p>
        <ul>
          {usage.map(({ iso, value }) => (
            <li key={iso} className="flex min-h-11 items-center justify-between gap-3 border-b border-slate-200">
              <span className="text-base">{formatDateLong(parseISODate(iso))}</span>
              <span className="shrink-0 text-sm text-slate-600">Stimmung {value}</span>
            </li>
          ))}
        </ul>
      </div>

      {usage.length > 0 && (
        <div role="status" className="flex items-start gap-2.5 rounded-lg bg-amber-100 p-3 text-amber-800">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p className="text-sm font-medium leading-snug">
            Dieses Bild wurde schon {usage.length}× genutzt. Du kannst es trotzdem für heute wählen.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <button type="button" onClick={onChoose} className={cx('h-12 w-full', BTN_PRIMARY)}>
          {usage.length > 0 ? 'Trotzdem für heute wählen' : 'Für heute wählen'}
        </button>
        <button type="button" onClick={close} className={cx('h-11 w-full text-base', BTN_SECONDARY)}>
          Schließen
        </button>
      </div>

      {lightbox && <Lightbox url={url} onClose={() => setLightbox(false)} />}
    </div>
  );
};
