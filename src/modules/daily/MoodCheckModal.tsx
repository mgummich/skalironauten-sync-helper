import React, { useState } from 'react';
import { getMoodScaleUrl, saveMoodRating } from '../mood';
import { Smile, Sparkles, X, Check, Eye } from 'lucide-react';

interface MoodCheckModalProps {
  dateStr: string;              // YYYY-MM-DD
  scaleFilename: string;
  onComplete: (rating: number) => void;
  onDismiss?: () => void;
}

export const MoodCheckModal: React.FC<MoodCheckModalProps> = ({
  dateStr,
  scaleFilename,
  onComplete,
  onDismiss
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const isVideo = scaleFilename.endsWith('.mp4');
  const imageUrl = getMoodScaleUrl(scaleFilename);

  const handleRatingSubmit = (rating: number) => {
    setSelectedRating(rating);
    saveMoodRating(dateStr, rating, scaleFilename);
    setTimeout(() => {
      onComplete(rating);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                1st-Workday Mood Check
              </h2>
              <p className="text-xs text-slate-400">
                Wie fühlst du dich heute zum Start der Arbeitswoche? (1–9)
              </p>
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Überspringen"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Mood Scale Image Display */}
          <div className="relative group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[220px] max-h-[340px]">
            {isVideo ? (
              <video
                src={imageUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain max-h-[340px]"
              />
            ) : (
              <img
                src={imageUrl}
                alt="Mood scale overview"
                className="w-full h-full object-contain max-h-[340px] transition-transform duration-300 group-hover:scale-[1.02]"
              />
            )}

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-3 right-3 p-2 bg-slate-950/80 hover:bg-slate-900 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 backdrop-blur-sm border border-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> {isZoomed ? 'Verkleinern' : 'Vergrößern'}
            </button>
          </div>

          {/* Expanded Image Modal if zoomed */}
          {isZoomed && (
            <div
              className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
              onClick={() => setIsZoomed(false)}
            >
              <img
                src={imageUrl}
                alt="Zoomed scale"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          )}

          {/* 1-9 Rating Selector Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>1 = Ganz schlecht 😫</span>
              <span>5 = Neutral 😐</span>
              <span>9 = Großartig! 🚀</span>
            </div>

            <div className="grid grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => {
                const isSelected = selectedRating === rating;
                return (
                  <button
                    key={rating}
                    onClick={() => handleRatingSubmit(rating)}
                    className={`h-12 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/40 scale-110 shadow-lg'
                        : 'bg-slate-900 hover:bg-indigo-600/30 text-slate-200 border border-slate-700 hover:border-indigo-400 hover:scale-105'
                    }`}
                  >
                    {isSelected ? <Check className="w-5 h-5" /> : rating}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-center text-xs text-slate-500">
          Deine Stimmung wird lokal in <code>localStorage</code> gespeichert und fließt in die Team-Sync Übersicht ein.
        </div>
      </div>
    </div>
  );
};
