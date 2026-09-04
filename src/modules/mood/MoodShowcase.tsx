import React, { useState, useEffect } from 'react';
import {
  getNextMoodScaleFilename,
  getUsedMoodScales,
  resetMoodPool,
  getMoodScaleUrl,
  getTotalMoodImagesCount,
  getMoodHistory,
  clearMoodHistory,
  saveMoodRating
} from './moodManager';
import { MoodRating } from './moodTypes';
import { Smile, RefreshCw, Trash2, CheckCircle2, Image as ImageIcon, Flame } from 'lucide-react';

export const MoodShowcase: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [wasReset, setWasReset] = useState<boolean>(false);
  const [usedList, setUsedList] = useState<string[]>([]);
  const [history, setHistory] = useState<MoodRating[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const totalCount = getTotalMoodImagesCount();

  const refreshState = () => {
    setUsedList(getUsedMoodScales());
    setHistory(getMoodHistory());
  };

  useEffect(() => {
    refreshState();
    // Pick initial image for showcase
    const result = getNextMoodScaleFilename();
    setCurrentImage(result.filename);
    setWasReset(result.wasReset);
    setUsedList(getUsedMoodScales());
  }, []);

  const handleNextImage = () => {
    const result = getNextMoodScaleFilename();
    setCurrentImage(result.filename);
    setWasReset(result.wasReset);
    setSelectedRating(null);
    refreshState();
  };

  const handleResetPool = () => {
    resetMoodPool();
    setWasReset(false);
    handleNextImage();
  };

  const handleClearHistory = () => {
    clearMoodHistory();
    refreshState();
  };

  const handleSelectRating = (r: number) => {
    setSelectedRating(r);
    saveMoodRating('showcase-demo-date', r, currentImage);
    refreshState();
  };

  const isVideo = currentImage.endsWith('.mp4');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Smile className="w-5 h-5 text-amber-400" />
            Mood Subsystem Showcase
          </h2>
          <p className="text-sm text-slate-400">
            Non-repeating pool rotation ({usedList.length} / {totalCount} used) & 1–9 Rating System
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetPool}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Pool
          </button>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        </div>
      </div>

      {wasReset && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <Flame className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Mood scale pool was exhausted and auto-reset! All images are now available again.</span>
        </div>
      )}

      {/* Main Image Showcase Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-400" /> Current Mood Scale Image
              </span>
              <span className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]" title={currentImage}>
                {currentImage}
              </span>
            </div>

            {/* Media viewer with error fallback */}
            <div className="relative aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
              {isVideo ? (
                <video
                  src={getMoodScaleUrl(currentImage)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={getMoodScaleUrl(currentImage)}
                  alt="Mood scale"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback visual
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>

          <button
            onClick={handleNextImage}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            <RefreshCw className="w-4 h-4" /> Draw Next Random Non-Repeating Image
          </button>
        </div>

        {/* 1-9 Rating Selector */}
        <div className="glass-panel p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Interactive 1–9 Rating Picker</h3>
            <p className="text-xs text-slate-400 mb-4">Click a number below to submit today's mood rating (1 = lowest, 9 = highest)</p>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const isSelected = selectedRating === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleSelectRating(num)}
                    className={`h-16 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-105 border-2 border-indigo-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-500 hover:scale-[1.02]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedRating && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-lg flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Saved rating: <strong>{selectedRating} / 9</strong> to localStorage!</span>
            </div>
          )}
        </div>
      </div>

      {/* LocalStorage Status Matrix */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          LocalStorage Persistence Audit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block mb-1">Key: used_mood_scales</span>
            <span className="font-mono text-slate-200">{usedList.length} images logged as used</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block mb-1">Key: mood_history</span>
            <span className="font-mono text-slate-200">{history.length} rating submissions</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block mb-1">Remaining Available Pool</span>
            <span className="font-mono text-emerald-400">{totalCount - usedList.length} images remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
};
