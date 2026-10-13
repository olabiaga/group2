import React from 'react';
import { X, Trash2, ArrowRight, Bookmark, Calendar, Coins, Users } from 'lucide-react';
import { SavedPlan } from '../types';

interface SavedPlansModalProps {
  savedPlans: SavedPlan[];
  onLoadPlan: (plan: SavedPlan) => void;
  onDeletePlan: (id: string) => void;
  onClose: () => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  savedPlans,
  onLoadPlan,
  onDeletePlan,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Space_Grotesk']">
                Saved Meal &amp; Grocery Plans
              </h3>
              <p className="text-xs text-slate-500">
                {savedPlans.length} {savedPlans.length === 1 ? 'plan' : 'plans'} stored locally
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
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No saved plans yet.</p>
              <p className="text-xs text-slate-500">
                Click &quot;Save Plan&quot; on any generated meal plan to bookmark it for later!
              </p>
            </div>
          ) : (
            savedPlans.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 font-['Space_Grotesk']">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <Coins className="w-3 h-3" />
                      {item.data.currency}{item.data.totalEstimatedCost} / {item.data.currency}{item.params.budget}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {item.params.people} people
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => onDeletePlan(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete saved plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onLoadPlan(item)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
