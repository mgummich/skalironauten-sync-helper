import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { cx } from './cls';

const CloseCtx = createContext<() => void>(() => {});
/** Closes the enclosing Sheet via the native dialog, so focus returns to the trigger. */
export const useSheetClose = () => useContext(CloseCtx);

interface SheetProps {
  label: string;
  onClose: () => void;
  children: ReactNode;
  /** 'sheet': bottom sheet on mobile, 640px dialog on desktop. 'lightbox': full-screen image viewer. */
  variant?: 'sheet' | 'lightbox';
}

/**
 * Native <dialog> modal: focus trap, Escape, top layer and focus return come for free.
 * Mount it to open; it calls onClose (unmount it) after the dialog closed.
 */
export const Sheet = ({ label, onClose, children, variant = 'sheet' }: SheetProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  // Don't rely on the native `close` event (not delivered in every embedded browser):
  // close the element (restores focus to the trigger) and unmount right away.
  const close = () => {
    ref.current?.close();
    onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          close();
        }
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
      className={cx(
        'fixed m-0 p-0 max-w-none max-h-none bg-transparent text-slate-900 motion-reduce:animate-none',
        variant === 'sheet' &&
          'inset-x-0 bottom-0 top-auto w-full open:animate-sheet-in lg:inset-0 lg:top-0 lg:m-auto lg:w-[640px] lg:h-fit lg:open:animate-dialog-in',
        variant === 'lightbox' && 'inset-0 w-full h-full open:animate-fade-in'
      )}
    >
      <CloseCtx.Provider value={close}>
        {variant === 'sheet' ? (
          <div className="bg-white rounded-t-xl p-4 pb-6 max-h-[90dvh] overflow-y-auto lg:rounded-lg lg:p-6 shadow-[0_-12px_40px_rgba(0,0,0,.25)] lg:shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 lg:hidden" aria-hidden />
            {children}
          </div>
        ) : (
          children
        )}
      </CloseCtx.Provider>
    </dialog>
  );
};
