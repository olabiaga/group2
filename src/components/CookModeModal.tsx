import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Flame, 
  Leaf, 
  Clock, 
  Volume2
} from 'lucide-react';
import { Meal } from '../types';

interface CookModeModalProps {
  meal: Meal;
  currency: string;
  onClose: () => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({ meal, currency, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Built-in Kitchen Timer
  const [timerSeconds, setTimerSeconds] = useState(meal.cookTimeMinutes * 60 || 600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play web audio chime if supported
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        // AudioContext not permitted or supported
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const toggleStepCompleted = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSteps = meal.steps.length;
  const isFinished = Object.keys(completedSteps).length === totalSteps;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Cook Mode • {meal.mealType}
            </span>
            <h3 className="font-extrabold text-lg text-white font-['Space_Grotesk'] line-clamp-1">
              {meal.recipeName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Close Cook Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Bar */}
        <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-medium">Stove / Kitchen Timer:</span>
            <span className="text-lg font-mono font-black text-emerald-400">
              {formatTimer(timerSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(meal.cookTimeMinutes * 60 || 600);
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {/* Current Step Big Card */}
          <div className="bg-slate-800/80 rounded-2xl p-5 sm:p-6 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-emerald-400">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <button
                onClick={() => toggleStepCompleted(currentStepIndex)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  completedSteps[currentStepIndex]
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{completedSteps[currentStepIndex] ? 'Done' : 'Mark as Done'}</span>
              </button>
            </div>

            <p className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed font-['Plus_Jakarta_Sans']">
              {meal.steps[currentStepIndex]}
            </p>
          </div>

          {/* Tips for this recipe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {meal.zeroWasteTip && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-200 flex items-start gap-2">
                <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-400 text-[10px] uppercase font-bold">
                    Zero Waste Reminder:
                  </strong>
                  <span>{meal.zeroWasteTip}</span>
                </div>
              </div>
            )}

            {meal.fuelSaverTip && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-200 flex items-start gap-2">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-400 text-[10px] uppercase font-bold">
                    LPG / Fuel Saver:
                  </strong>
                  <span>{meal.fuelSaverTip}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Ingredients Reference Drawer */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2 text-[10px]">
              Ingredients Reference for this meal:
            </span>
            <div className="flex flex-wrap gap-2">
              {meal.ingredientsNeeded.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/80"
                >
                  {ing.name} ({ing.quantity})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {currentStepIndex < totalSteps - 1 ? (
            <button
              onClick={() => {
                toggleStepCompleted(currentStepIndex);
                setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Finish Cooking!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
