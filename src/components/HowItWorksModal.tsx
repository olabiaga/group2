import React from 'react';
import { X, Coins, Sparkles, Recycle, Store, HeartHandshake } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Space_Grotesk']">
                How TipidKusina Works
              </h3>
              <p className="text-xs text-slate-600">
                A compassionate culinary guide for tight budgets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-0.5">1. Strict Budget Calibration</h4>
              <p className="text-slate-600">
                Whether you have ₱150, ₱200, or $10, every recipe ingredient is priced realistically using wet market (palengke), talipapa, and sari-sari store rates. The total shopping sum will not exceed your budget.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-lg shrink-0 mt-0.5">
              <Recycle className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-0.5">2. Zero Food Waste &amp; Carryover</h4>
              <p className="text-slate-600">
                Ingredients bought in the morning are repurposed across lunch and dinner. For instance, half a cabbage or vegetable stalks become dinner soup, and cold morning rice becomes fragrant garlic sinangag.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
              <Store className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-0.5">3. Local Sourcing &amp; &apos;Tingi&apos; Savvy</h4>
              <p className="text-slate-600">
                The planner recognizes small portion purchases (tingi) like single eggs, small piles of garlic/onions, and dry monggo beans that need no refrigeration.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-800 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-0.5">4. Fuel &amp; LPG Saving Techniques</h4>
              <p className="text-slate-600">
                Gas is expensive. Recipes incorporate residual heat cooking, one-pot boiling sequences, and pre-soaking shortcuts to keep your utility bills low.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors"
          >
            Got it, let&apos;s cook!
          </button>
        </div>
      </div>
    </div>
  );
};
