import React, { useState } from 'react';
import { DailyView } from './DailyView';
import { parseISODate } from '../data';
import { Sun, Calendar as CalendarIcon } from 'lucide-react';

export const DailyShowcase: React.FC = () => {
  const [demoDate, setDemoDate] = useState<Date>(parseISODate('2026-01-05')); // Monday 1st workday

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            Daily Subsystem Showcase
          </h2>
          <p className="text-sm text-slate-400">
            Main Standup View, 1st-Workday Mood Check Modal & Action Day Carousel
          </p>
        </div>
      </div>

      <DailyView currentDate={demoDate} onDateChange={(newDate) => setDemoDate(newDate)} />
    </div>
  );
};
