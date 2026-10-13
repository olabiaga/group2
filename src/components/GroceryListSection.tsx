import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Store, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  RotateCcw, 
  Info,
  DollarSign
} from 'lucide-react';
import { GroceryItem, MealPlanResponse } from '../types';

interface GroceryListSectionProps {
  plan: MealPlanResponse;
}

export const GroceryListSection: React.FC<GroceryListSectionProps> = ({ plan }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleCheck = (name: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSelectAll = (select: boolean) => {
    const updated: Record<string, boolean> = {};
    plan.groceryShoppingList.forEach((item) => {
      updated[item.name] = select;
    });
    setCheckedItems(updated);
  };

  // Group items by category
  const categories = Array.from(
    new Set(plan.groceryShoppingList.map((item) => item.category || 'General Market Items'))
  );

  // Running sum of checked items
  const checkedTotal = plan.groceryShoppingList.reduce((sum, item) => {
    return checkedItems[item.name] ? sum + item.estimatedCost : sum;
  }, 0);

  const totalGroceryCost = plan.groceryShoppingList.reduce(
    (sum, item) => sum + item.estimatedCost,
    0
  );

  const checkedCount = plan.groceryShoppingList.filter((item) => checkedItems[item.name]).length;

  const handleCopyMarketSlip = () => {
    let slip = `🛒 TIPIDKUSINA MARKET SHOPPING SLIP\n`;
    slip += `Total Budget: ${plan.currency}${plan.totalEstimatedCost}\n`;
    slip += `------------------------------------\n`;

    categories.forEach((cat) => {
      const itemsInCat = plan.groceryShoppingList.filter((i) => (i.category || 'General Market Items') === cat);
      if (itemsInCat.length > 0) {
        slip += `\n📍 ${cat.toUpperCase()}:\n`;
        itemsInCat.forEach((item) => {
          slip += `• ${item.name} (${item.quantity}) - ~${plan.currency}${item.estimatedCost} [${item.targetStore}]\n`;
          if (item.notesOrAlternatives) {
            slip += `  Tip: ${item.notesOrAlternatives}\n`;
          }
        });
      }
    });

    slip += `\n------------------------------------\n`;
    slip += `Estimated Total: ${plan.currency}${totalGroceryCost}\n`;
    slip += `Generated via TipidKusina Budget Planner\n`;

    navigator.clipboard.writeText(slip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 to-teal-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                <ShoppingBag className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                Local Palengke &amp; Grocery Shopping List
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Check off items as you buy them at the market or neighborhood sari-sari store.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarketSlip}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Market Slip</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Shopping Progress Pill */}
        <div className="mt-4 pt-3 border-t border-emerald-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">
              Basket: {checkedCount} / {plan.groceryShoppingList.length} items checked
            </span>
            <div className="h-4 w-px bg-slate-300"></div>
            <span className="font-bold text-emerald-800">
              Spent so far: {plan.currency}{checkedTotal} of {plan.currency}{totalGroceryCost}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectAll(true)}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              Check All
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => handleSelectAll(false)}
              className="text-[11px] text-slate-500 hover:underline font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Categorized List */}
      <div className="p-5 space-y-6">
        {categories.map((category) => {
          const items = plan.groceryShoppingList.filter(
            (i) => (i.category || 'General Market Items') === category
          );

          return (
            <div key={category} className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                {category}
                <span className="text-[10px] text-slate-400 font-semibold lowercase">
                  ({items.length} items)
                </span>
              </h4>

              <div className="space-y-2">
                {items.map((item, idx) => {
                  const isChecked = !!checkedItems[item.name];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(item.name)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        isChecked
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white hover:bg-emerald-50/30 border-slate-200/90 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          className="mt-0.5 text-emerald-600 hover:text-emerald-700 shrink-0"
                          aria-label={`Toggle ${item.name}`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {item.quantity}
                            </span>
                          </div>

                          {/* Notes and alternatives */}
                          {item.notesOrAlternatives && (
                            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <Info className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{item.notesOrAlternatives}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-7 sm:pl-0">
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.targetStore}
                        </span>

                        <span
                          className={`text-sm font-black font-['Space_Grotesk'] ${
                            isChecked ? 'line-through text-slate-400' : 'text-emerald-800'
                          }`}
                        >
                          {plan.currency}{item.estimatedCost}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
