import React from 'react';
import { CalendarView } from './CalendarView';
import { Calendar } from 'lucide-react';

export const CalendarShowcase: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Calendar Subsystem Showcase
          </h2>
          <p className="text-sm text-slate-400">
            365-Day Calendar Grid, Workday Logic & Action Day Filter Engine
          </p>
        </div>
      </div>

      <CalendarView onSelectDateForStandup={(date) => alert(`Selected date for standup: ${date.toLocaleDateString()}`)} />
    </div>
  );
};
