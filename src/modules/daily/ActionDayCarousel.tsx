import React, { useState, useEffect } from 'react';
import { ActionDay } from '../data';
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, Tag, MapPin, Sparkles, BookOpen } from 'lucide-react';

interface ActionDayCarouselProps {
  actionDays: ActionDay[];
  dateFormatted: string;
}

export const ActionDayCarousel: React.FC<ActionDayCarouselProps> = ({ actionDays, dateFormatted }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Reset index when actionDays array changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [actionDays]);

  if (!actionDays || actionDays.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500 border border-slate-800">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-300">Kein spezieller Aktionstag</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Für den {dateFormatted} sind in der Datenbank keine eingetragenen Gedenk- oder Aktionstage hinterlegt.
        </p>
      </div>
    );
  }

  const currentItem = actionDays[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? actionDays.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === actionDays.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-slate-700/60 shadow-xl">
      {/* Top Header info */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Aktionstage am {dateFormatted}
            </span>
            <div className="text-xs text-slate-500">
              Eintrag {currentIndex + 1} von {actionDays.length}
            </div>
          </div>
        </div>

        {/* Carousel Navigation buttons if > 1 items */}
        {actionDays.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
              title="Vorheriger Aktionstag"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
              title="Nächster Aktionstag"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Action Day Card Content */}
      <div className="space-y-4 animate-fadeIn">
        <div className="flex flex-wrap items-center gap-2">
          {currentItem.category && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
              <Tag className="w-3 h-3" /> {currentItem.category}
            </span>
          )}
          {currentItem.charakter && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
              {currentItem.charakter}
            </span>
          )}
          {currentItem.region && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              <MapPin className="w-3 h-3 text-rose-400" /> {currentItem.region}
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 leading-tight">
          {currentItem.name}
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          {currentItem.beschreibung || 'Gedenk- und Aktionstag.'}
        </p>

        {currentItem.quelle && (
          <div className="pt-2">
            <a
              href={currentItem.quelle}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Wikipedia Quelle öffnen <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Indicator dots */}
      {actionDays.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {actionDays.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-indigo-500'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              title={`Zu Karte ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
