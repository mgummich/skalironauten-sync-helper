import { store } from '../data/storage';

interface DevToolbarProps {
  currentDateStr: string;
  onSelectDate: (dateStr: string) => void;
}

/** Dev-only: jump to any date, wipe local state. */
export const DevToolbar = ({ currentDateStr, onSelectDate }: DevToolbarProps) => (
  <div className="flex items-center gap-3 border-b border-gray-300 bg-gray-200 px-4 py-1 text-sm text-gray-700">
    <span className="font-semibold">DEV</span>
    <input
      type="date"
      value={currentDateStr}
      onChange={(e) => e.target.value && onSelectDate(e.target.value)}
      className="rounded border border-gray-300 bg-white px-2 py-0.5"
    />
    <button
      type="button"
      onClick={() => {
        store.clear();
        window.location.reload();
      }}
      className="rounded border border-gray-300 bg-white px-2 py-0.5 hover:bg-gray-100"
    >
      Storage leeren
    </button>
  </div>
);
