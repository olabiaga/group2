import React, { useState } from 'react';
import { 
  Clock, 
  Flame, 
  Leaf, 
  CheckCircle, 
  ChefHat, 
  Coins, 
  Play, 
  ChevronDown, 
  ChevronUp,
  PackageCheck,
  ShoppingBag
} from 'lucide-react';
import { Meal, MealPlanResponse } from '../types';

interface MealPlanSectionProps {
  plan: MealPlanResponse;
  onOpenCookMode: (meal: Meal) => void;
}

export const MealPlanSection: React.FC<MealPlanSectionProps> = ({
  plan,
  onOpenCookMode
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getMealTypeBadge = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('breakfast') || lower.includes('almusal')) {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (lower.includes('lunch') || lower.includes('tanghalian')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
    if (lower.includes('dinner') || lower.includes('hapunan')) {
      return 'bg-indigo-100 text-indigo-900 border-indigo-300';
    }
    return 'bg-teal-100 text-teal-900 border-teal-300';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-emerald-600" />
            1-Day Step-by-Step Recipes
          </h3>
          <p className="text-xs text-slate-500">
            Tailored for minimum LPG/gas consumption, fast prep, and zero food waste.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {plan.meals.length} Meals Planned
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plan.meals.map((meal, index) => {
          const isExpanded = expandedIndex === index || expandedIndex === null; // default expanded

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden hover:border-emerald-300/80 transition-all"
            >
              {/* Meal Card Header */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/60 to-white">
                <div className="flex items-start sm:items-center gap-3">
                  <span
                    className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg border ${getMealTypeBadge(
                      meal.mealType
                    )}`}
                  >
                    {meal.mealType}
                  </span>

                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                      {meal.recipeName}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{meal.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {/* Cost Pill */}
                  <div className="text-right px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-200/60">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block leading-tight">
                      Meal Cost
                    </span>
                    <span className="text-sm font-black text-emerald-900 font-['Space_Grotesk']">
                      {plan.currency}{meal.estimatedCost}
                    </span>
                    <span className="text-[10px] text-emerald-600 block leading-tight">
                      ({plan.currency}{meal.costPerPerson}/person)
                    </span>
                  </div>

                  {/* Cook Mode Trigger */}
                  <button
                    onClick={() => onOpenCookMode(meal)}
                    className="h-10 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    title="Open step-by-step cooking assistant with timer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Cook Mode</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(index)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Toggle recipe details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Meal Card Body */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-5">
                  {/* Meta Badges */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pb-3 border-b border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Prep: <strong className="text-slate-800">{meal.prepTimeMinutes} mins</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      Cook: <strong className="text-slate-800">{meal.cookTimeMinutes} mins</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      Est. Per Serving: <strong className="text-slate-800">{plan.currency}{meal.costPerPerson}</strong>
                    </span>
                  </div>

                  {/* Ingredients Breakdown */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Ingredients &amp; Sourcing</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        {meal.ingredientsNeeded.length} items
                      </span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {meal.ingredientsNeeded.map((ing, iIdx) => (
                        <div
                          key={iIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                            ing.isPantry
                              ? 'bg-slate-50/80 border-slate-200/80 text-slate-700'
                              : 'bg-emerald-50/50 border-emerald-200/70 text-emerald-950'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {ing.isPantry ? (
                              <PackageCheck className="w-4 h-4 text-slate-400 shrink-0" />
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            <div>
                              <span className="font-semibold">{ing.name}</span>
                              <span className="text-slate-500 text-[11px] ml-1.5 font-normal">
                                ({ing.quantity})
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {ing.isPantry ? (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                                In Pantry ($0)
                              </span>
                            ) : (
                              <span className="text-xs font-extrabold text-emerald-800 font-['Space_Grotesk']">
                                {plan.currency}{ing.estimatedPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Simple Cooking Steps
                    </h5>
                    <ol className="space-y-2 text-xs text-slate-700">
                      {meal.steps.map((step, sIdx) => (
                        <li
                          key={sIdx}
                          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips Callout: Zero Waste & Fuel Saver */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {meal.zeroWasteTip && (
                      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
                        <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold text-emerald-900 text-[11px] uppercase tracking-wider mb-0.5">
                            Zero-Waste Leftover Hack:
                          </strong>
                          <span>{meal.zeroWasteTip}</span>
                        </div>
                      </div>
                    )}

                    {meal.fuelSaverTip && (
                      <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-950">
                        <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold text-amber-900 text-[11px] uppercase tracking-wider mb-0.5">
                            LPG / Fuel Saver Tip:
                          </strong>
                          <span>{meal.fuelSaverTip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
