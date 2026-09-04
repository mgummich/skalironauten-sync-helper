import { X } from 'lucide-react';
import { Sheet, useSheetClose } from './Sheet';
import { cx, BTN_ICON } from './cls';

/** Full-size view of a mood image; any click closes it. */
export const Lightbox = ({ url, onClose }: { url: string; onClose: () => void }) => (
  <Sheet label="Bild in Originalgröße" variant="lightbox" onClose={onClose}>
    <Body url={url} />
  </Sheet>
);

const Body = ({ url }: { url: string }) => {
  const close = useSheetClose();
  return (
    <div className="flex h-full w-full items-center justify-center p-4" onClick={close}>
      <img src={url} alt="Mood-Skala in Originalgröße" className="max-h-full max-w-full object-contain" />
      <button type="button" aria-label="Schließen" onClick={close} className={cx('absolute right-4 top-4 h-11 w-11 bg-white', BTN_ICON)}>
        <X className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
};
