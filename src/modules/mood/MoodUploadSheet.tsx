import { useRef, useState } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { Sheet, useSheetClose } from '../ui/Sheet';
import { addMoodImage } from './moodLibrary';
import { cx, BTN_DISABLED, BTN_ICON, BTN_PRIMARY, FOCUS, INPUT } from '../ui/cls';

interface Props {
  onAdded: () => void;
  onClose: () => void;
}

interface Picked {
  file: File;
  url: string;
  width: number;
  height: number;
}

export const MoodUploadSheet = (props: Props) => (
  <Sheet label="Mood-Bild hinzufügen" onClose={props.onClose}>
    <Body {...props} />
  </Sheet>
);

const Body = ({ onAdded }: Props) => {
  const close = useSheetClose();
  const fileInput = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const pick = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      setPicked((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { file, url, width: probe.naturalWidth, height: probe.naturalHeight };
      });
    };
    probe.src = url;
  };

  const submit = async () => {
    if (!picked || !title.trim() || busy) return;
    setBusy(true);
    try {
      await addMoodImage(picked.file, {
        title: title.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        width: picked.width,
        height: picked.height
      });
      onAdded();
      close();
    } catch (e) {
      console.error('mood image upload failed', e);
      setBusy(false);
    }
  };

  // Rendered as an <a href> later: only http(s), never javascript: or data:.
  const sourceOk = !sourceUrl.trim() || /^https?:\/\/\S+$/i.test(sourceUrl.trim());
  const ready = Boolean(picked && title.trim()) && sourceOk && !busy;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold lg:text-[22px]">Mood-Bild hinzufügen</h2>
        <button type="button" aria-label="Schließen" onClick={close} className={cx('-mr-2 h-11 w-11 shrink-0', BTN_ICON)}>
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      {picked ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <img src={picked.url} alt="" className="h-full w-full object-contain" />
          <span className="absolute bottom-2 left-2 inline-flex h-7 max-w-[60%] items-center truncate rounded border border-slate-300 bg-white/90 px-2.5 text-sm text-slate-700">
            {picked.file.name} · {picked.width} × {picked.height}
          </span>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className={cx('absolute bottom-2 right-2 h-9 border border-slate-300 bg-white/90 px-3 text-sm hover:bg-white', BTN_ICON)}
          >
            Ersetzen
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className={cx(
            'flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-400 bg-slate-100 text-slate-600 hover:bg-slate-200',
            FOCUS
          )}
        >
          <ImageIcon className="h-7 w-7" aria-hidden />
          <span className="text-base font-semibold">Bild auswählen</span>
        </button>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Titel / Frage</span>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Welcher Remy bist du heute?" className={INPUT} />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">
          Quelle / Link <span className="font-normal text-slate-600">(optional)</span>
        </span>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://…"
          aria-invalid={!sourceOk}
          className={cx(INPUT, !sourceOk && 'border-b-red-600')}
        />
        {!sourceOk && <span className="mt-1 block text-sm text-red-700">Bitte einen Link mit http:// oder https:// angeben.</span>}
      </label>

      <p className="text-sm leading-snug text-slate-600">
        Wird nur auf diesem Gerät gespeichert. Empfohlen: 3×3-Raster, 1000–2400 px breit.
      </p>

      <button type="button" disabled={!ready} onClick={submit} className={cx('h-12 w-full', ready ? BTN_PRIMARY : BTN_DISABLED)}>
        <Plus className="h-5 w-5" aria-hidden /> Hinzufügen
      </button>
    </div>
  );
};
