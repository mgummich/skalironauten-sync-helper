import React from 'react';
import { Sparkles, Check, AlertCircle, Info, ShieldCheck, Sun, Calendar, RefreshCw } from 'lucide-react';

export const UIShowcase: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          UI & Design System Subsystem Showcase
        </h2>
        <p className="text-sm text-slate-400">
          Raycast/Linear Dark Design Tokens, Glassmorphic Panels & AAA Micro-Interactions
        </p>
      </div>

      {/* Buttons & Badges */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Buttons & Badges
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all">
            Secondary Button
          </button>
          <button className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 transition-all">
            Amber Action
          </button>
          <button className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs rounded-xl border border-rose-500/30 transition-all">
            Destructive Action
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Arbeitstag
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            1. Arbeitstag (Woche)
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Kultur & Gesellschaft
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Wochenende
          </span>
        </div>
      </div>

      {/* Glassmorphic Cards & Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <h4 className="font-bold text-slate-100 text-base">Glassmorphic Card</h4>
          <p className="text-xs text-slate-400">
            High contrast backdrop blur effect with subtle hover borders for Linear-like polish.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-2">
          <h4 className="font-bold text-slate-100 text-base">Glassmorphic Panel</h4>
          <p className="text-xs text-slate-400">
            Heavy frosted glass container for primary app views and forms.
          </p>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl flex items-center gap-3 text-xs">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span><strong>Success Alert:</strong> All 5 modules verified with zero console errors!</span>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span><strong>Warning Alert:</strong> Mood scale pool exhausted — auto-reset triggered.</span>
        </div>
      </div>
    </div>
  );
};
