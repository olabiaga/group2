/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BudgetInputForm } from './components/BudgetInputForm';
import { BudgetSummaryCard } from './components/BudgetSummaryCard';
import { MealPlanSection } from './components/MealPlanSection';
import { GroceryListSection } from './components/GroceryListSection';
import { ZeroWasteSection } from './components/ZeroWasteSection';
import { CookModeModal } from './components/CookModeModal';
import { SavedPlansModal } from './components/SavedPlansModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { COMMUNITY_PRESETS, PresetScenario } from './data/presets';
import { Meal, MealPlanResponse, PlanRequestParams, SavedPlan } from './types';
import { 
  Sparkles, 
  ChefHat, 
  ShoppingBag, 
  Recycle, 
  Check, 
  AlertCircle,
  HelpCircle,
  Coins
} from 'lucide-react';

const DEFAULT_PARAMS: PlanRequestParams = COMMUNITY_PRESETS[0].params;

export default function App() {
  const [params, setParams] = useState<PlanRequestParams>(DEFAULT_PARAMS);
  const [plan, setPlan] = useState<MealPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'recipes' | 'groceries' | 'zerowaste'>('all');
  const [cookModeMeal, setCookModeMeal] = useState<Meal | null>(null);
  const [isSavedPlansOpen, setIsSavedPlansOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved plans from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tipidkusina_saved_plans');
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to read saved plans from storage', e);
    }
  }, []);

  // Save to localStorage when savedPlans changes
  const updateSavedPlans = (newPlans: SavedPlan[]) => {
    setSavedPlans(newPlans);
    try {
      localStorage.setItem('tipidkusina_saved_plans', JSON.stringify(newPlans));
    } catch (e) {
      console.error('Failed to save plans to storage', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate Plan via Server API
  const handleGeneratePlan = async (customParams?: PlanRequestParams) => {
    const targetParams = customParams || params;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetParams)
      });

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setPlan(json.data);
        if (json.warning) {
          showToast(json.warning);
        } else {
          showToast('1-Day Budget Plan generated successfully!');
        }
      } else {
        throw new Error(json.error || 'Failed to generate plan.');
      }
    } catch (err: any) {
      console.error('Error generating plan:', err);
      setError('Could not generate plan. Please verify budget details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate default plan on first render so user lands on a complete experience
  useEffect(() => {
    handleGeneratePlan(DEFAULT_PARAMS);
  }, []);

  const handleSelectPreset = (preset: PresetScenario) => {
    setParams(preset.params);
    handleGeneratePlan(preset.params);
  };

  const handleParamChange = (updated: Partial<PlanRequestParams>) => {
    setParams((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    handleGeneratePlan(DEFAULT_PARAMS);
  };

  // Check if current plan is saved
  const isCurrentPlanSaved = !!(
    plan && savedPlans.some((sp) => sp.data.summary === plan.summary)
  );

  const handleSaveCurrentPlan = () => {
    if (!plan) return;
    if (isCurrentPlanSaved) {
      // Remove
      const filtered = savedPlans.filter((sp) => sp.data.summary !== plan.summary);
      updateSavedPlans(filtered);
      showToast('Plan removed from saved list.');
    } else {
      // Add
      const newSaved: SavedPlan = {
        id: `plan-${Date.now()}`,
        title: `${plan.currency}${plan.totalEstimatedCost} • ${params.people}p • ${plan.meals.map((m) => m.mealType).join('/')}`,
        createdAt: new Date().toISOString(),
        params: { ...params },
        data: plan
      };
      updateSavedPlans([newSaved, ...savedPlans]);
      showToast('Plan saved to your collection!');
    }
  };

  const handleLoadSavedPlan = (saved: SavedPlan) => {
    setParams(saved.params);
    setPlan(saved.data);
    setIsSavedPlansOpen(false);
    showToast(`Loaded saved plan: ${saved.title}`);
  };

  const handleDeleteSavedPlan = (id: string) => {
    const filtered = savedPlans.filter((sp) => sp.id !== id);
    updateSavedPlans(filtered);
    showToast('Plan deleted.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!plan) return;
    let shareText = `🍲 TipidKusina Meal Plan (${plan.currency}${plan.totalEstimatedCost} for ${params.people} people)\n`;
    shareText += `------------------------------------\n`;
    plan.meals.forEach((m) => {
      shareText += `• ${m.mealType}: ${m.recipeName} (${plan.currency}${m.estimatedCost})\n`;
    });
    shareText += `\n🛒 Grocery Items to Buy (${plan.groceryShoppingList.length} items):\n`;
    plan.groceryShoppingList.forEach((g) => {
      shareText += `- ${g.name} (${g.quantity}) ~${plan.currency}${g.estimatedCost}\n`;
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      showToast('Full meal plan copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        onOpenSavedPlans={() => setIsSavedPlansOpen(true)}
        savedPlansCount={savedPlans.length}
        onToggleHelp={() => setIsHelpOpen(true)}
        currentParams={params}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error message */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleGeneratePlan()}
              className="text-xs font-bold underline text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Input Form */}
        <BudgetInputForm
          params={params}
          onChange={handleParamChange}
          onSubmit={() => handleGeneratePlan()}
          isLoading={isLoading}
          onReset={handleReset}
        />

        {/* Loading Skeleton if generating */}
        {isLoading && !plan && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-base font-['Space_Grotesk']">
              Optimizing recipes and checking market prices...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Calculating essential protein, pairing zero-waste leftovers, and ensuring the grocery basket stays under {params.currency}{params.budget}.
            </p>
          </div>
        )}

        {/* Results Area */}
        {plan && (
          <div className="space-y-6">
            {/* Budget & Health Summary Meter */}
            <BudgetSummaryCard
              plan={plan}
              params={params}
              onSavePlan={handleSaveCurrentPlan}
              isSaved={isCurrentPlanSaved}
              onPrint={handlePrint}
              onShare={handleShare}
            />

            {/* Navigation Tabs for Easy Focus */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'all'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>All Sections</span>
                </button>

                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'recipes'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Recipes ({plan.meals.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('groceries')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'groceries'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Grocery Market List ({plan.groceryShoppingList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('zerowaste')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'zerowaste'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <Recycle className="w-3.5 h-3.5" />
                  <span>Zero Waste &amp; Hacks</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>Total: {plan.currency}{plan.totalEstimatedCost}</span>
              </div>
            </div>

            {/* Tab Contents */}
            {(activeTab === 'all' || activeTab === 'recipes') && (
              <section>
                <MealPlanSection
                  plan={plan}
                  onOpenCookMode={(m) => setCookModeMeal(m)}
                />
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'groceries') && (
              <section>
                <GroceryListSection plan={plan} />
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'zerowaste') && (
              <section>
                <ZeroWasteSection plan={plan} />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            TipidKusina • Dedicated to budget-conscious households, students, and community resilience.
          </p>
          <p className="text-[11px] text-slate-400">
            Market rates are estimates based on local palengke, talipapa, and discount grocery averages. Zero food waste means zero money wasted.
          </p>
        </div>
      </footer>

      {/* Interactive Cook Mode Modal */}
      {cookModeMeal && (
        <CookModeModal
          meal={cookModeMeal}
          currency={plan?.currency || '₱'}
          onClose={() => setCookModeMeal(null)}
        />
      )}

      {/* Saved Plans Modal */}
      {isSavedPlansOpen && (
        <SavedPlansModal
          savedPlans={savedPlans}
          onLoadPlan={handleLoadSavedPlan}
          onDeletePlan={handleDeleteSavedPlan}
          onClose={() => setIsSavedPlansOpen(false)}
        />
      )}

      {/* How It Works Modal */}
      {isHelpOpen && (
        <HowItWorksModal onClose={() => setIsHelpOpen(false)} />
      )}
    </div>
  );
}
