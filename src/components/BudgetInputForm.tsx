import React, { useState } from 'react';
import { 
  Coins, 
  Users, 
  Flame, 
  PackageCheck, 
  Plus, 
  X, 
  Wand2, 
  Store, 
  Sparkles,
  ChefHat,
  RotateCcw
} from 'lucide-react';
import { PlanRequestParams } from '../types';
import { COMMON_PANTRY_STAPLES, QUICK_LEFTOVER_SUGGESTIONS } from '../data/presets';

interface BudgetInputFormProps {
  params: PlanRequestParams;
  onChange: (updated: Partial<PlanRequestParams>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onReset: () => void;
}

const CURRENCIES = ['₱', '$', '₹', '£', '€'];

const HOUSEHOLD_TYPES = [
  'Family with Kids',
  'College Student (Dorm)',
  'Working Housemates',
  'Big Family (5+ members)',
  'Solo Budget Saver'
];

const COOKING_EQUIPMENT = [
  'Standard 1-2 burner stove',
  'Rice cooker only (dorm hack)',
  'Single electric induction plate',
  'Microwave & kettle only',
  'Full stove & oven'
];

const MARKET_CONTEXTS = [
  'Philippines / Local Palengke & Sari-sari stores',
  'Discount Supermarket / Budget Grocer',
  'Talipapa & neighborhood vegetable carts',
  'Corner convenience & small store'
];

const PRIORITY_OPTIONS = [
  'High Protein',
  'Zero Waste',
  'Save Fuel/LPG',
  'Quick Prep (<20m)',
  'Kid Friendly Taste',
  'Rich Broth / Soup'
];

export const BudgetInputForm: React.FC<BudgetInputFormProps> = ({
  params,
  onChange,
  onSubmit,
  isLoading,
  onReset
}) => {
  const [customPantryInput, setCustomPantryInput] = useState('');
  const [customLeftoverInput, setCustomLeftoverInput] = useState('');

  // Math breakdown
  const dailyBudget = Number(params.budget) || 0;
  const numPeople = Math.max(1, Number(params.people) || 1);
  const perPersonDay = dailyBudget > 0 ? (dailyBudget / numPeople).toFixed(1) : '0';
  const perPersonMeal = dailyBudget > 0 ? (dailyBudget / (numPeople * 3)).toFixed(1) : '0';

  const handleTogglePantryItem = (item: string) => {
    if (params.pantryItems.includes(item)) {
      onChange({ pantryItems: params.pantryItems.filter((i) => i !== item) });
    } else {
      onChange({ pantryItems: [...params.pantryItems, item] });
    }
  };

  const handleAddCustomPantry = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customPantryInput.trim();
    if (clean && !params.pantryItems.includes(clean)) {
      onChange({ pantryItems: [...params.pantryItems, clean] });
      setCustomPantryInput('');
    }
  };

  const handleAddLeftoverSuggestion = (suggestion: string) => {
    const current = params.existingIngredients ? params.existingIngredients.trim() : '';
    if (!current) {
      onChange({ existingIngredients: suggestion });
    } else if (!current.toLowerCase().includes(suggestion.toLowerCase())) {
      onChange({ existingIngredients: `${current}, ${suggestion}` });
    }
  };

  const handleTogglePriority = (priority: string) => {
    if (params.priorities.includes(priority)) {
      onChange({ priorities: params.priorities.filter((p) => p !== priority) });
    } else {
      onChange({ priorities: [...params.priorities, priority] });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Coins className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Space_Grotesk'] leading-tight">
                Plan Your 1-Day Budget Meals
              </h2>
              <p className="text-xs text-emerald-100">
                Input your daily budget and available kitchen items to calculate recipes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="text-xs text-emerald-100 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Default
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* ROW 1: Daily Budget & Household Size */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Budget Field */}
          <div className="md:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" />
              Daily Food Budget Limit
            </label>

            <div className="flex items-center gap-2">
              {/* Currency selector */}
              <div className="relative">
                <select
                  value={params.currency}
                  onChange={(e) => onChange({ currency: e.target.value })}
                  aria-label="Currency"
                  className="w-16 h-12 bg-white border border-slate-300 rounded-lg text-base font-bold text-slate-800 px-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount input */}
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  step="1"
                  value={params.budget}
                  onChange={(e) => onChange({ budget: Math.max(1, Number(e.target.value) || 0) })}
                  className="w-full h-12 bg-white border border-slate-300 rounded-lg text-2xl font-black text-slate-900 px-3.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-['Space_Grotesk']"
                  placeholder="200"
                />
              </div>
            </div>

            {/* Quick adjustment buttons */}
            <div className="flex items-center gap-1.5 mt-2.5 text-xs">
              <span className="text-slate-400 font-medium">Quick:</span>
              {[100, 150, 200, 250, 300, 400].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onChange({ budget: val })}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                    params.budget === val
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {params.currency}{val}
                </button>
              ))}
            </div>
          </div>

          {/* Household Size & Type */}
          <div className="md:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                Household Size
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {params.people} {params.people === 1 ? 'person' : 'people'}
              </span>
            </label>

            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-white border border-slate-300 rounded-lg h-12 px-1">
                <button
                  type="button"
                  onClick={() => onChange({ people: Math.max(1, params.people - 1) })}
                  disabled={params.people <= 1}
                  className="w-9 h-9 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-bold text-lg"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-lg text-slate-900">
                  {params.people}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ people: params.people + 1 })}
                  className="w-9 h-9 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-lg"
                >
                  +
                </button>
              </div>

              {/* Household category dropdown */}
              <div className="flex-1">
                <select
                  value={params.householdType}
                  onChange={(e) => onChange({ householdType: e.target.value })}
                  aria-label="Household Type"
                  className="w-full h-12 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {HOUSEHOLD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Household context note */}
            <p className="text-[11px] text-slate-500 mt-2.5">
              Tailors portions, seasoning scale, and kid or roommate cooking styles.
            </p>
          </div>
        </div>

        {/* Live Budget Breakdown Callout Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              💡
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Budget Target Reality Check:
              </p>
              <p className="text-xs text-emerald-800">
                {params.currency}{dailyBudget} allocated for {params.people} people across 3 meals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-end text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                Per Person / Day
              </span>
              <span className="text-sm font-extrabold text-emerald-900 font-['Space_Grotesk']">
                {params.currency}{perPersonDay}
              </span>
            </div>
            <div className="h-6 w-px bg-emerald-200"></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                Per Person / Meal
              </span>
              <span className="text-sm font-extrabold text-emerald-900 font-['Space_Grotesk']">
                {params.currency}{perPersonMeal}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Kitchen Pantry Inventory (Already at home - $0 cost!) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                Kitchen Pantry Staples You Already Have
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  $0 Added Cost
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Tap items already in your kitchen so the planner doesn&apos;t waste your budget buying them again.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const allSelected = COMMON_PANTRY_STAPLES.every((s) => params.pantryItems.includes(s));
                if (allSelected) {
                  onChange({ pantryItems: [] });
                } else {
                  onChange({ pantryItems: [...COMMON_PANTRY_STAPLES] });
                }
              }}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline"
            >
              {COMMON_PANTRY_STAPLES.every((s) => params.pantryItems.includes(s))
                ? 'Deselect All'
                : 'Select Standard Staples'}
            </button>
          </div>

          {/* Toggle Chips */}
          <div className="flex flex-wrap gap-1.5">
            {COMMON_PANTRY_STAPLES.map((staple) => {
              const isSelected = params.pantryItems.includes(staple);
              return (
                <button
                  key={staple}
                  type="button"
                  onClick={() => handleTogglePantryItem(staple)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <span>{isSelected ? '✓' : '+'}</span>
                  <span>{staple}</span>
                </button>
              );
            })}
          </div>

          {/* Custom pantry tag adder */}
          <form onSubmit={handleAddCustomPantry} className="flex items-center gap-2 max-w-sm pt-1">
            <input
              type="text"
              value={customPantryInput}
              onChange={(e) => setCustomPantryInput(e.target.value)}
              placeholder="Add another pantry item (e.g. Flour, Oat...)"
              className="flex-1 h-8 text-xs border border-slate-300 rounded-lg px-2.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="h-8 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </form>

          {/* Custom added pantry items */}
          {params.pantryItems.filter((i) => !COMMON_PANTRY_STAPLES.includes(i)).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {params.pantryItems
                .filter((i) => !COMMON_PANTRY_STAPLES.includes(i))
                .map((customItem) => (
                  <span
                    key={customItem}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    <span>{customItem}</span>
                    <button
                      type="button"
                      onClick={() => handleTogglePantryItem(customItem)}
                      className="text-emerald-700 hover:text-emerald-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* SECTION 3: Fresh Leftovers / Items To Repurpose (Zero Food Waste) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-emerald-600" />
              Fresh Leftovers &amp; Perishables In Kitchen To Use Up
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Zero Food Waste
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Got half a cabbage, 2 eggs, or yesterday&apos;s cooked rice? The AI will repurpose them seamlessly into today&apos;s meals.
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              rows={2}
              value={params.existingIngredients}
              onChange={(e) => onChange({ existingIngredients: e.target.value })}
              placeholder="e.g., 2 eggs, cold morning rice, 1/2 head of cabbage, 1 can sardines, backyard malunggay..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
            />

            {/* Quick suggestion pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Quick tap to add:</span>
              {QUICK_LEFTOVER_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleAddLeftoverSuggestion(sug)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600 text-[11px] font-medium rounded border border-slate-200 transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: Cooking Setup & Market Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {/* Cooking Equipment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Cooking Equipment &amp; Fuel
            </label>
            <select
              value={params.cookingEquipment}
              onChange={(e) => onChange({ cookingEquipment: e.target.value })}
              className="w-full h-10 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {COOKING_EQUIPMENT.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Ensures recipes fit dorm rice cooker cooking or single burner stove limitations.
            </p>
          </div>

          {/* Market / Grocery Context */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              Shopping / Market Source
            </label>
            <select
              value={params.regionContext}
              onChange={(e) => onChange({ regionContext: e.target.value })}
              className="w-full h-10 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {MARKET_CONTEXTS.map((ctx) => (
                <option key={ctx} value={ctx}>
                  {ctx}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Calibrates pricing for wet market bundles (tumpok) &amp; sari-sari store &apos;tingi&apos; portions.
            </p>
          </div>
        </div>

        {/* SECTION 5: Priorities & Dietary Preferences */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Planner Priorities
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRIORITY_OPTIONS.map((priority) => {
              const isSelected = params.priorities.includes(priority);
              return (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handleTogglePriority(priority)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {priority}
                </button>
              );
            })}
          </div>

          {/* Optional notes */}
          <div className="pt-1">
            <input
              type="text"
              value={params.dietaryNotes || ''}
              onChange={(e) => onChange({ dietaryNotes: e.target.value })}
              placeholder="Optional: Any allergies, dislikes, or kid food requests (e.g., no spicy, easy to chew)..."
              className="w-full text-xs h-9 px-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer font-['Space_Grotesk']"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Optimizing Ingredients &amp; Calculating Market Prices...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>
                  Generate 1-Day Plan &amp; Grocery List under {params.currency}{params.budget}
                </span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Calculates nutritious ingredient pairings, market shopping costs, and zero-waste leftover usage.
          </p>
        </div>
      </div>
    </div>
  );
};
