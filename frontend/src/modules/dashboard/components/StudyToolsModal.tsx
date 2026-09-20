import React, { useState, useEffect } from 'react';
import { X, Calculator, Timer, Layers, StickyNote, Play, Pause, RefreshCw, Plus, Trash2, CheckCircle, Sparkles } from 'lucide-react';

interface StudyToolsModalProps {
  isOpen: boolean;
  activeTool: 'calculator' | 'timer' | 'flashcards' | 'notes' | null;
  onClose: () => void;
}

export const StudyToolsModal: React.FC<StudyToolsModalProps> = ({
  isOpen,
  activeTool,
  onClose
}) => {
  const [currentTool, setCurrentTool] = useState<'calculator' | 'timer' | 'flashcards' | 'notes'>('calculator');

  // Pomodoro State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');

  // Flashcards State
  const [flashcards, setFlashcards] = useState([
    { id: 'f1', question: 'Speed of Light (c)', answer: '3 × 10⁸ m/s' },
    { id: 'f2', question: 'First Prime Minister of Bangladesh', answer: 'Tajuddin Ahmad (1971)' },
    { id: 'f3', question: 'Planck\'s Constant (h)', answer: '6.626 × 10⁻³⁴ J·s' },
    { id: 'f4', question: 'Formula for Integration of xⁿ', answer: '(xⁿ⁺¹)/(n+1) + C' },
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quick Notes State
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('takeuup_quick_notes');
    return saved || '• Physics formula revision:\n• E = mc²\n• F = ma\n• Keep revising general knowledge timeline!';
  });

  useEffect(() => {
    if (activeTool) {
      setCurrentTool(activeTool);
    }
  }, [activeTool]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      alert(timerMode === 'work' ? '🎉 Focus session finished! Take a 5-minute break.' : '⏰ Break finished! Ready to focus?');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  if (!isOpen) return null;

  // Calculator Button Handler
  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      try {
        // Safe math evaluation
        const sanitized = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcDisplay(String(res));
      } catch (e) {
        setCalcDisplay('Error');
      }
    } else {
      if (calcDisplay === '0' || calcDisplay === 'Error') {
        setCalcDisplay(val);
      } else {
        setCalcDisplay(prev => prev + val);
      }
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Tool Header Navigation */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[
              { id: 'calculator', label: 'Calculator', icon: Calculator },
              { id: 'timer', label: 'Pomodoro', icon: Timer },
              { id: 'flashcards', label: 'Flashcards', icon: Layers },
              { id: 'notes', label: 'Quick Notes', icon: StickyNote },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setCurrentTool(t.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentTool === t.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tool Content Body */}
        <div className="p-8 overflow-y-auto min-h-[380px] flex flex-col justify-center">
          {/* CALCULATOR */}
          {currentTool === 'calculator' && (
            <div className="max-w-xs mx-auto w-full bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 text-right">
                <span className="text-2xl font-mono font-bold text-cyan-400 block tracking-wider overflow-x-auto">
                  {calcDisplay}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcClick(btn)}
                    className={`py-3.5 rounded-xl font-bold text-sm transition-all ${
                      btn === '='
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 col-span-1'
                        : btn === 'C'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : ['÷', '×', '-', '+', '%'].includes(btn)
                        ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* POMODORO TIMER */}
          {currentTool === 'timer' && (
            <div className="text-center max-w-sm mx-auto space-y-6">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => { setTimerMode('work'); setTimerSeconds(25 * 60); setIsTimerRunning(false); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${timerMode === 'work' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                >
                  25m Study Session
                </button>
                <button
                  onClick={() => { setTimerMode('break'); setTimerSeconds(5 * 60); setIsTimerRunning(false); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${timerMode === 'break' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                >
                  5m Break
                </button>
              </div>

              <div className="w-56 h-56 rounded-full border-8 border-slate-800 bg-slate-950 flex flex-col items-center justify-center mx-auto shadow-2xl relative">
                <span className="text-4xl font-mono font-black text-white tracking-widest">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">
                  {timerMode === 'work' ? 'Deep Focus' : 'Short Break'}
                </span>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg"
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isTimerRunning ? 'Pause' : 'Start Timer'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(timerMode === 'work' ? 25 * 60 : 5 * 60);
                  }}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          )}

          {/* FLASHCARDS */}
          {currentTool === 'flashcards' && (
            <div className="max-w-md mx-auto space-y-6 text-center">
              <span className="text-xs font-bold text-slate-400">
                Card {currentCardIndex + 1} of {flashcards.length} (Click card to flip)
              </span>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="h-56 bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer shadow-2xl hover:border-cyan-500/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-3 right-4 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  {isFlipped ? 'Answer' : 'Question'}
                </div>
                <h3 className="text-xl font-bold text-white leading-relaxed">
                  {isFlipped ? flashcards[currentCardIndex].answer : flashcards[currentCardIndex].question}
                </h3>
                <p className="text-[11px] text-slate-500 mt-4 group-hover:text-slate-400 transition-colors">
                  Tap card to reveal {isFlipped ? 'question' : 'answer'}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
                >
                  Previous
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
                  }}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* QUICK NOTES */}
          {currentTool === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">Personal Quick Notes</h4>
                <button
                  onClick={() => {
                    localStorage.setItem('takeuup_quick_notes', notes);
                    alert('Notes saved locally!');
                  }}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-colors"
                >
                  Save Notes
                </button>
              </div>

              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={10}
                placeholder="Write your study notes, reminders, or formulas here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed custom-scrollbar font-mono"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
