import { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import { Sheet, useSheetClose } from '../ui/Sheet';
import { REGIONS } from '../data/dataLoader';
import { cx, BTN_GHOST, INPUT, FOCUS } from '../ui/cls';

interface Props {
  value: string;
  onChange: (region: string) => void;
  onClose: () => void;
}

export const RegionPicker = (props: Props) => (
  <Sheet label="Region wählen" onClose={props.onClose}>
    <Body {...props} />
  </Sheet>
);

const Body = ({ value, onChange }: Props) => {
  const close = useSheetClose();
  const [q, setQ] = useState('');
  const options = ['', ...REGIONS.filter((r) => r.toLowerCase().includes(q.trim().toLowerCase()))];
  const pick = (r: string) => {
    onChange(r);
    close();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold lg:text-[22px]">Region</h2>
        <button type="button" aria-label="Schließen" onClick={close} className={cx('h-11 w-11 -mr-2', BTN_GHOST)}>
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls="region-list"
          aria-autocomplete="list"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && options[1] && pick(options[1])}
          placeholder="Region suchen …"
          className={cx(INPUT, 'pl-9')}
        />
      </div>
      <ul id="region-list" role="listbox" className="mt-3 max-h-[50dvh] overflow-y-auto">
        {options.map((r) => (
          <li key={r || '__all'} role="option" aria-selected={r === value}>
            <button
              type="button"
              onClick={() => pick(r)}
              className={cx(
                'flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-base hover:bg-gray-100',
                r === value && 'font-semibold',
                FOCUS
              )}
            >
              {r || 'Alle Regionen'}
              {r === value && <Check className="h-4 w-4 text-red-700" aria-hidden />}
            </button>
          </li>
        ))}
        {options.length === 1 && <li className="px-3 py-2 text-sm text-gray-600">Keine Region gefunden.</li>}
      </ul>
    </div>
  );
};
