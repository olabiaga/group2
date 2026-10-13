import React from 'react';
import { 
  Recycle, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { MealPlanResponse } from '../types';

interface ZeroWasteSectionProps {
  plan: MealPlanResponse;
}

export const ZeroWasteSection: React.FC<ZeroWasteSectionProps> = ({ plan }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Leftover Repurposing Guide */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Recycle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
              Zero-Waste Leftover Repurposing
            </h3>
            <p className="text-xs text-slate-500">
              Never throw away edible scraps or extra portions.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {plan.leftoverRepurposingGuide.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5"
            >
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>If you have: {item.leftover}</span>
              </div>
              <p className="text-slate-600 pl-5 leading-relaxed">
                <ArrowRight className="w-3 h-3 inline text-slate-400 mr-1" />
                {item.howToReuse}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Community Budget Saving Hacks */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
              Community Money-Saving Hacks
            </h3>
            <p className="text-xs text-slate-500">
              Tested strategies to cut costs at local stalls &amp; kitchens.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {plan.budgetSavingHacks.map((hack, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs text-slate-700 flex items-start gap-2.5"
            >
              <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{hack}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
