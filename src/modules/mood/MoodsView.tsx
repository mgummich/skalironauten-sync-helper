import { useMemo, useState } from 'react';
import { Search, Upload } from 'lucide-react';
import { getMoodImages, getMoodImageUrl, getMoodUsage, MoodImage, MoodUsage } from './moodLibrary';
import { MoodDetailSheet } from './MoodDetailSheet';
import { MoodUploadSheet } from './MoodUploadSheet';
import { cx, BADGE_AMBER, BTN_PRIMARY, BTN_SECONDARY, CARD, FOCUS, INPUT } from '../ui/cls';

type Filter = 'all' | 'unused' | 'used' | 'own';

interface Props {
  onChooseForToday: (imageId: string) => void;
}

const FILTERS: { id: Filter; label: string; match: (i: MoodImage, used: number) => boolean }[] = [
  { id: 'all', label: 'Alle', match: () => true },
  { id: 'unused', label: 'Ungenutzt', match: (_i, used) => used === 0 },
  { id: 'used', label: 'Genutzt', match: (_i, used) => used > 0 },
  { id: 'own', label: 'Eigene', match: (i) => !i.builtIn }
];

const shortDate = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}.`;

const usageLabel = (usage: MoodUsage[] | undefined) =>
  !usage?.length
    ? null
    : usage.length === 1
      ? `1× · ${shortDate(usage[0].iso)}`
      : `${usage.length}× · zuletzt ${shortDate(usage[0].iso)}`;

export const MoodsView = ({ onChooseForToday }: Props) => {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [detail, setDetail] = useState<MoodImage | null>(null);
  const [upload, setUpload] = useState(false);
  // Bumped after an upload so the gallery re-reads the library.
  const [revision, setRevision] = useState(0);

  const { images, usage } = useMemo(
    () => ({ images: getMoodImages(), usage: getMoodUsage() }),
    [revision]
  );

  const counts = Object.fromEntries(
    FILTERS.map((f) => [f.id, images.filter((i) => f.match(i, usage.get(i.id)?.length ?? 0)).length])
  );

  const active = FILTERS.find((f) => f.id === filter)!;
  const needle = q.trim().toLowerCase();
  const shown = images.filter(
    (i) => active.match(i, usage.get(i.id)?.length ?? 0) && (!needle || i.title.toLowerCase().includes(needle))
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      <h2 className="text-xl font-semibold lg:sr-only">Moods</h2>

      <div className="space-y-3 lg:flex lg:items-center lg:gap-3 lg:space-y-0">
        <div className="relative lg:w-80 lg:shrink-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden />
          <input
            type="search"
            aria-label="Mood-Bild suchen"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Mood-Bild suchen …"
            className={cx(INPUT, 'pl-9 lg:bg-white')}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-4 px-4 lg:mx-0 lg:px-0">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={cx(
                'h-9 shrink-0 rounded-full px-3.5 text-sm transition-colors motion-reduce:transition-none',
                filter === id
                  ? 'border border-red-600 bg-red-600 font-semibold text-white'
                  : 'border border-slate-400 font-medium text-slate-900 hover:bg-slate-100',
                FOCUS
              )}
            >
              {label} · {counts[id]}
            </button>
          ))}
        </div>

        <div className="hidden flex-1 lg:block" />
        <button type="button" onClick={() => setUpload(true)} className={cx('h-10 px-3.5 text-sm lg:hidden', BTN_SECONDARY)}>
          <Upload className="h-4 w-4" aria-hidden /> Hochladen
        </button>
        <button type="button" onClick={() => setUpload(true)} className={cx('hidden h-11 px-[18px] lg:inline-flex', BTN_PRIMARY)}>
          <Upload className="h-5 w-5" aria-hidden /> Hochladen
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          {shown.length} {shown.length === 1 ? 'Bild' : 'Bilder'} · A–Z
        </span>
        <span className="hidden lg:inline">Klick öffnet Großansicht mit Nutzungen</span>
      </div>

      {shown.length === 0 ? (
        <p className="text-base text-slate-700">Kein Bild gefunden.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {shown.map((image) => {
            const label = usageLabel(usage.get(image.id));
            return (
              <li key={image.id}>
                <button
                  type="button"
                  onClick={() => setDetail(image)}
                  className={cx('flex w-full flex-col overflow-hidden text-left', CARD, FOCUS)}
                >
                  <img
                    src={getMoodImageUrl(image.id)}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full bg-slate-100 object-cover"
                  />
                  <span className="flex w-full flex-col items-start gap-1.5 p-3">
                    <span className="text-base font-semibold leading-tight">{image.title}</span>
                    {label ? <span className="text-sm text-slate-600">{label}</span> : <span className={BADGE_AMBER}>Ungenutzt</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {detail && (
        <MoodDetailSheet
          image={detail}
          usage={usage.get(detail.id) ?? []}
          onChoose={() => onChooseForToday(detail.id)}
          onClose={() => setDetail(null)}
        />
      )}
      {upload && (
        <MoodUploadSheet
          onAdded={() => setRevision((r) => r + 1)}
          onClose={() => setUpload(false)}
        />
      )}
    </div>
  );
};
