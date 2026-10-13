import React from 'react';
import { UtensilsCrossed, Bookmark, Sparkles, HelpCircle } from 'lucide-react';
import { COMMUNITY_PRESETS, PresetScenario } from '../data/presets';
import { PlanRequestParams } from '../types';

interface NavbarProps {
  onSelectPreset: (preset: PresetScenario) => void;
  onOpenSavedPlans: () => void;
  savedPlansCount: number;
  onToggleHelp: () => void;
  currentParams: PlanRequestParams;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPreset,
  onOpenSavedPlans,
  savedPlansCount,
  onToggleHelp,
  currentParams
}) => {
  return (
    <header className="border-b border-emerald-900/10 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Space_Grotesk']">
                  Tipid<span className="text-emerald-600">Kusina</span>
                </span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Zero Waste Planner
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Budget Family Meals &amp; Local Palengke Grocery Optimizer
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleHelp}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="How this planner works"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">How It Works</span>
            </button>

            <button
              onClick={onOpenSavedPlans}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors relative"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved Plans</span>
              {savedPlansCount > 0 && (
                <span className="w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {savedPlansCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick Scenarios:
          </span>
          {COMMUNITY_PRESETS.map((p) => {
            const isMatch = currentParams.budget === p.params.budget && currentParams.people === p.params.people;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isMatch
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border-slate-200'
                }`}
              >
                <span>{p.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isMatch ? 'bg-emerald-700 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
