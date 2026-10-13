import React from 'react';
import { 
  PiggyBank, 
  CheckCircle2, 
  HeartPulse, 
  ShieldCheck, 
  Share2, 
  BookmarkCheck, 
  Bookmark,
  Printer
} from 'lucide-react';
import { MealPlanResponse, PlanRequestParams } from '../types';

interface BudgetSummaryCardProps {
  plan: MealPlanResponse;
  params: PlanRequestParams;
  onSavePlan: () => void;
  isSaved: boolean;
  onPrint: () => void;
  onShare: () => void;
}

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  plan,
  params,
  onSavePlan,
  isSaved,
  onPrint,
  onShare
}) => {
  const targetBudget = Number(params.budget) || 1;
  const spent = plan.totalEstimatedCost;
  const savings = Math.max(0, targetBudget - spent);
  const percentUsed = Math.min(100, Math.round((spent / targetBudget) * 100));
  const isUnderBudget = spent <= targetBudget;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                1-Day Meal Plan &amp; Grocery Breakdown
              </span>
              <span className="text-xs text-slate-300">
                for {params.people} {params.people === 1 ? 'person' : 'people'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] tracking-tight">
              {plan.summary}
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={onSavePlan}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Save Plan
                </>
              )}
            </button>

            <button
              onClick={onPrint}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition-colors"
              title="Print or save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onShare}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition-colors"
              title="Copy share link or text"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Financial Meters Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">
              Daily Budget Limit
            </span>
            <span className="text-2xl font-black font-['Space_Grotesk'] text-white">
              {plan.currency}{targetBudget}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">
              Est. Grocery Cost
            </span>
            <span className={`text-2xl font-black font-['Space_Grotesk'] ${
              isUnderBudget ? 'text-emerald-400' : 'text-amber-300'
            }`}>
              {plan.currency}{spent}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold flex items-center gap-1">
              <PiggyBank className="w-3.5 h-3.5 text-emerald-300" />
              Remaining Pocket Money
            </span>
            <span className="text-2xl font-black font-['Space_Grotesk'] text-emerald-300">
              +{plan.currency}{savings}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">
              Cost / Person / Meal
            </span>
            <span className="text-2xl font-black font-['Space_Grotesk'] text-cyan-300">
              {plan.currency}{(spent / (params.people * 3)).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span>Budget Utilization: {percentUsed}% of {plan.currency}{targetBudget}</span>
            <span>{isUnderBudget ? '✓ Strictly Under Budget' : 'Slight Variance'}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentUsed <= 95 ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nutrition Overview Box */}
      <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              Nutritional Quality &amp; Sustenance Check
            </h3>
            <p className="text-xs text-slate-500">
              Validated to ensure zero empty calorie traps while respecting strict pocket limits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Protein: {plan.nutritionOverview?.proteinScore || 'Balanced'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-semibold">
              Fiber: {plan.nutritionOverview?.fiberScore || 'High'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 font-semibold">
              Energy: {plan.nutritionOverview?.calorieAdequacy || 'Sustained'}
            </span>
          </div>
        </div>

        {/* Nutrition Highlights Bullet points */}
        {plan.nutritionOverview?.highlights && plan.nutritionOverview.highlights.length > 0 && (
          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {plan.nutritionOverview.highlights.map((h, i) => (
              <div
                key={i}
                className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-slate-700 flex items-start gap-2 shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
