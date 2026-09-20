import React, { useState } from 'react';
import { 
  Bookmark, BrainCircuit, BarChart2, CheckCircle2, XCircle, RotateCcw, HelpCircle, 
  Sparkles, Filter, FileText, Calendar, Clock, Trophy, ArrowRight, Eye, Check, Trash2, Box
} from 'lucide-react';
import { StudentMistakeItem } from '../../../types/types';
import { useTheme } from '../../../context/ThemeContext';

interface StudentHistoryProps {
  mistakes: StudentMistakeItem[];
  onResolveMistake: (id: string) => void;
  onAddMistake?: (mistake: StudentMistakeItem) => void;
}

interface BookmarkedQuestion {
  id: string;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  savedDate: string;
}

interface CompletedExamRecord {
  id: string;
  examTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  timeSpentMinutes: number;
  dateCompleted: string;
}

const SUBJECT_PILLS = [
  'সকল বিষয়',
  'বাংলা',
  'English',
  'সাধারণ জ্ঞান',
  'পরিসংখ্যান',
  'পদার্থবিজ্ঞান',
  'কৃষিশিক্ষা',
  'রসায়ন',
  'গার্হস্থ্য বিজ্ঞান',
  'জীববিজ্ঞান',
  'উচ্চতর গণিত',
  'মনোবিজ্ঞান',
  'তথ্য ও যোগাযোগ প্রযুক্তি',
  'মানসিক দক্ষতা',
  'IBA'
];

const INITIAL_BOOKMARKS: BookmarkedQuestion[] = [
  {
    id: 'bm-1',
    subject: 'পদার্থবিজ্ঞান',
    questionText: 'ভেক্টর বিভাজন: যদি কোন ভেক্টর A = 3i + 4j হয়, তবে এর মান কত?',
    options: ['5', '7', '25', '12'],
    correctAnswerIndex: 0,
    explanation: 'ভেক্টরের মান |A| = √(3² + 4²) = √(9 + 16) = √25 = 5।',
    savedDate: '১ দিন আগে'
  },
  {
    id: 'bm-2',
    subject: 'রসায়ন',
    questionText: 'মিথেন (CH4) অণুতে কার্বন পরমাণুর সংকরায়ন (Hybridization) কোনটি?',
    options: ['sp', 'sp2', 'sp3', 'dsp2'],
    correctAnswerIndex: 2,
    explanation: 'মিথেন অণুতে কার্বনের ৪টি একক সমযোজী বন্ধন থাকে, ফলে sp3 সংকরায়ন ঘটে এবং চতুস্তলকীয় জ্যামিতি গঠন করে।',
    savedDate: '২ দিন আগে'
  }
];

const INITIAL_EXAM_HISTORY: CompletedExamRecord[] = [
  {
    id: 'ex-1',
    examTitle: 'পদার্থবিজ্ঞান ১ম পত্র মক টেস্ট - ১',
    subject: 'পদার্থবিজ্ঞান',
    score: 22,
    totalQuestions: 25,
    accuracyPercentage: 88,
    timeSpentMinutes: 18,
    dateCompleted: '২০২৪-০৫-২৪'
  },
  {
    id: 'ex-2',
    examTitle: 'মেডিকেল স্পেশাল জিকে অ্যান্ড ইংলিশ মডেল টেস্ট',
    subject: 'সাধারণ জ্ঞান',
    score: 45,
    totalQuestions: 50,
    accuracyPercentage: 90,
    timeSpentMinutes: 32,
    dateCompleted: '২০২৪-০৫-২২'
  }
];

export const StudentHistory: React.FC<StudentHistoryProps> = ({ mistakes, onResolveMistake }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Top Active Tab: 'bookmarks' (দাগানো প্রশ্ন) | 'mistakes' (পূর্বের ভুল) | 'exams' (পরীক্ষা)
  const [activeMainTab, setActiveMainTab] = useState<'bookmarks' | 'mistakes' | 'exams'>('bookmarks');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('সকল বিষয়');

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(INITIAL_BOOKMARKS);
  const [expandedBookmarkIds, setExpandedBookmarkIds] = useState<string[]>([]);

  // Practice Mode State for Mistakes
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Filter Bookmarks
  const filteredBookmarks = selectedSubjectFilter === 'সকল বিষয়'
    ? bookmarks
    : bookmarks.filter(b => b.subject.includes(selectedSubjectFilter) || selectedSubjectFilter.includes(b.subject));

  // Filter Mistakes
  const filteredMistakes = selectedSubjectFilter === 'সকল বিষয়' 
    ? mistakes 
    : mistakes.filter(m => m.subject.includes(selectedSubjectFilter) || selectedSubjectFilter.includes(m.subject));

  const unresolvedMistakes = filteredMistakes.filter(m => !m.resolved);

  // Filter Exams
  const filteredExams = selectedSubjectFilter === 'সকল বিষয়'
    ? INITIAL_EXAM_HISTORY
    : INITIAL_EXAM_HISTORY.filter(e => e.subject.includes(selectedSubjectFilter) || selectedSubjectFilter.includes(e.subject));

  const toggleBookmarkAnswer = (id: string) => {
    setExpandedBookmarkIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
    const activeItem = unresolvedMistakes[currentPracticeIndex];
    if (activeItem && selectedAnswer === activeItem.correctAnswerIndex) {
      onResolveMistake(activeItem.id);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentPracticeIndex + 1 < unresolvedMistakes.length) {
      setCurrentPracticeIndex(prev => prev + 1);
    } else {
      setPracticeMode(false);
      setCurrentPracticeIndex(0);
    }
  };

  const currentMistakeItem = unresolvedMistakes[currentPracticeIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP MAIN TAB SWITCHER */}
      <div className="flex items-center justify-center">
        <div className={`${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
        } border p-1.5 rounded-full inline-flex shadow-xl`}>
          
          <button
            onClick={() => { setActiveMainTab('bookmarks'); setPracticeMode(false); }}
            className={`px-6 sm:px-8 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeMainTab === 'bookmarks'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg scale-105'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark size={15} className={activeMainTab === 'bookmarks' ? 'text-slate-950 fill-slate-955' : ''} />
            <span>দাগানো প্রশ্ন</span>
            {bookmarks.length > 0 && (
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${
                activeMainTab === 'bookmarks' 
                  ? 'bg-slate-950 text-cyan-300 border-cyan-400/40' 
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
              }`}>
                {bookmarks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveMainTab('mistakes'); setPracticeMode(false); }}
            className={`px-6 sm:px-8 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeMainTab === 'mistakes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg scale-105'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BrainCircuit size={15} className={activeMainTab === 'mistakes' ? 'text-slate-950' : ''} />
            <span>পূর্বের ভুল</span>
            {unresolvedMistakes.length > 0 && (
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${
                activeMainTab === 'mistakes'
                  ? 'bg-slate-950 text-rose-300 border-rose-400/40'
                  : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
              }`}>
                {unresolvedMistakes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveMainTab('exams'); setPracticeMode(false); }}
            className={`px-6 sm:px-8 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeMainTab === 'exams'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg scale-105'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 size={15} className={activeMainTab === 'exams' ? 'text-slate-950' : ''} />
            <span>পরীক্ষা</span>
          </button>

        </div>
      </div>

      {/* 2. SUBJECT PILLS FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar justify-start lg:justify-center">
        {SUBJECT_PILLS.map(pill => {
          const isActive = selectedSubjectFilter === pill;
          return (
            <button
              key={pill}
              onClick={() => setSelectedSubjectFilter(pill)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                  : isDark
                  ? 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950 shadow-sm'
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: 🔖 দাগানো প্রশ্ন (BOOKMARKED QUESTIONS - SCREENSHOT 3 FIX) */}
      {activeMainTab === 'bookmarks' && (
        <div className="space-y-6">
          {filteredBookmarks.length === 0 ? (
            <div className={`${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            } border rounded-3xl p-12 text-center space-y-6 max-w-xl mx-auto shadow-xl`}>
              <div className="w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
                <Box size={56} className="text-amber-400 animate-bounce" />
              </div>

              <div className="space-y-2">
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-800'} font-bold text-sm lg:text-base`}>
                  যেসব প্রশ্নে <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 text-xs">🔖 ট্যাপ করবে</span> সেগুলো এখানে দেখতে পাবে
                </p>
                <p className="text-xs text-slate-500">
                  প্রশ্নব্যাংক বা মক টেস্ট অনুশীলনের সময় গুরুত্বপূর্ণ প্রশ্ন সেভ করে রাখলে এখানে পেয়ে যাবে।
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div className={`flex items-center justify-between border-b ${isDark ? 'border-slate-800' : 'border-slate-300'} pb-3`}>
                <h3 className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-base flex items-center gap-2`}>
                  <Bookmark size={18} className="text-amber-500 fill-amber-500" />
                  দাগানো প্রশ্নাবলী ({filteredBookmarks.length}টি)
                </h3>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>সহজেই সেভ করা প্রশ্ন রিভিশন করুন</span>
              </div>

              <div className="space-y-4">
                {filteredBookmarks.map((bm, idx) => {
                  const showAnswer = expandedBookmarkIds.includes(bm.id);

                  return (
                    <div key={bm.id} className={`${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-white' 
                        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                    } border rounded-3xl p-5 lg:p-6 shadow-xl space-y-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs px-3 py-1 rounded-xl border ${
                            isDark ? 'bg-slate-950 text-amber-400 border-slate-800' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            #{idx + 1} • {bm.subject}
                          </span>
                          <span className="text-[10px] text-slate-500">{bm.savedDate}</span>
                        </div>

                        <button 
                          onClick={() => removeBookmark(bm.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                          title="দাগানো তালিকা থেকে সরান"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-sm lg:text-base leading-relaxed`}>
                        {bm.questionText}
                      </h4>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {bm.options.map((opt, oIdx) => {
                          const isCorrect = oIdx === bm.correctAnswerIndex;
                          return (
                            <div 
                              key={oIdx}
                              className={`p-3 rounded-xl border flex items-center justify-between ${
                                showAnswer && isCorrect 
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold' 
                                  : isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {showAnswer && isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Toggle Answer & Explanation */}
                      <div className={`pt-2 border-t ${isDark ? 'border-slate-850' : 'border-slate-200'} flex items-center justify-between`}>
                        <button 
                          onClick={() => toggleBookmarkAnswer(bm.id)}
                          className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-bold flex items-center gap-1"
                        >
                          <Eye size={14} /> {showAnswer ? 'উত্তর ও ব্যাখ্যা লুকান' : 'সঠিক উত্তর ও ব্যাখ্যা দেখুন'}
                        </button>
                      </div>

                      {showAnswer && (
                        <div className={`${
                          isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-cyan-50/80 border-cyan-200 text-slate-800'
                        } p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in`}>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                            <Sparkles size={14} /> বিস্তারিত ব্যাখ্যা:
                          </span>
                          <p className="leading-relaxed">{bm.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: ❌ পূর্বের ভুল (MISTAKE BANK / PREVIOUS MISTAKES) */}
      {activeMainTab === 'mistakes' && (
        <div className="space-y-6">
          <div className={`${
            isDark 
              ? 'bg-gradient-to-r from-rose-955/60 via-slate-900 to-slate-950 border-rose-500/20' 
              : 'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white shadow-lg'
          } border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl`}>
            <div className="flex items-center gap-4 text-left">
              <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-white/20 text-white border-white/30'} border flex items-center justify-center shrink-0`}>
                <BrainCircuit size={28} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">পূর্বের ভুল উত্তরের ব্যাংক (Mistake Archive)</h3>
                  <span className={`${isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/20 text-white border-white/40'} text-xs px-2.5 py-0.5 rounded-full font-bold border`}>
                    {unresolvedMistakes.length}টি অসমাধানকৃত
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-rose-100'}`}>
                  পরীক্ষায় যেসকল প্রশ্ন ভুল হয়েছিল সেগুলো অটোমেটিক এখানে সংরক্ষিত আছে যাতে রিভিশন দিয়ে মাস্টার করতে পারো।
                </p>
              </div>
            </div>

            {unresolvedMistakes.length > 0 && !practiceMode && (
              <button
                onClick={() => {
                  setPracticeMode(true);
                  setCurrentPracticeIndex(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                }}
                className={`px-6 py-3 ${isDark ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' : 'bg-white text-rose-600 hover:bg-slate-100'} font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 shrink-0`}
              >
                <RotateCcw size={16} /> ভুল প্রশ্ন রি-টেক দিন ({unresolvedMistakes.length})
              </button>
            )}
          </div>

          {/* Interactive Practice Mode */}
          {practiceMode && currentMistakeItem ? (
            <div className={`${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
            } border rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6 text-left`}>
              <div className={`flex items-center justify-between border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-4`}>
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-bold px-3 py-1 rounded-xl border border-cyan-500/30">
                    প্রশ্ন {currentPracticeIndex + 1} / {unresolvedMistakes.length}
                  </span>
                  <span className="text-xs text-slate-500">• {currentMistakeItem.subject}</span>
                </div>
                <button
                  onClick={() => setPracticeMode(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
                >
                  প্র্যাকটিস মোড বন্ধ করুন
                </button>
              </div>

              <div className="space-y-4">
                <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'} leading-relaxed`}>
                  {currentMistakeItem.questionText}
                </h4>

                <div className="space-y-3 text-xs">
                  {currentMistakeItem.options.map((opt, idx) => {
                    let btnStyle = isDark ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300';
                    if (selectedAnswer === idx) {
                      btnStyle = 'bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-bold';
                    }
                    if (showResult) {
                      if (idx === currentMistakeItem.correctAnswerIndex) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                      } else if (selectedAnswer === idx) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showResult && idx === currentMistakeItem.correctAnswerIndex && (
                          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar */}
              <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-850' : 'border-slate-200'}`}>
                {!showResult ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleCheckAnswer}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs shadow-md"
                  >
                    উত্তর যাচাই করুন
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    পরবর্তী ভুল প্রশ্ন <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {/* Explanation Box */}
              {showResult && (
                <div className={`${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-cyan-50/80 border-cyan-200 text-slate-800'
                } p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in`}>
                  <div className="flex items-center gap-1.5 font-bold text-cyan-600 dark:text-cyan-400">
                    <Sparkles size={16} /> ব্যাখ্যা:
                  </div>
                  <p className="leading-relaxed">{currentMistakeItem.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            /* Unresolved Mistakes List */
            <div className="space-y-4 text-left">
              {filteredMistakes.length === 0 ? (
                <div className={`${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } border rounded-3xl p-10 text-center space-y-3`}>
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
                  <h4 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm`}>কোনো ভুল উত্তর নেই!</h4>
                  <p className="text-xs text-slate-500">সাবাশ! আপনার সকল ভুল উত্তর সমাধান করা হয়েছে।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMistakes.map(item => (
                    <div 
                      key={item.id} 
                      className={`${
                        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                      } border rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl transition-all ${
                        item.resolved ? 'opacity-60' : 'hover:border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
                          {item.subject}
                        </span>

                        {item.resolved ? (
                          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 size={14} /> সমাধান সম্পন্ন
                          </span>
                        ) : (
                          <button
                            onClick={() => onResolveMistake(item.id)}
                            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded-xl border border-rose-500/30 transition-colors"
                          >
                            ✓ চিহ্নিত সমাধান করুন
                          </button>
                        )}
                      </div>

                      <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-sm lg:text-base leading-relaxed`}>
                        {item.questionText}
                      </h4>

                      <div className={`${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      } p-3.5 rounded-2xl border space-y-1 text-xs`}>
                        <div className="text-rose-600 dark:text-rose-400 font-bold">
                          আপনার প্রদানকৃত ভুল উত্তর: {item.options[item.userAnswerIndex]}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                          সঠিক উত্তর: {item.options[item.correctAnswerIndex]}
                        </div>
                      </div>

                      <div className={`${
                        isDark ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-cyan-50/70 border-cyan-200 text-slate-800'
                      } p-3.5 rounded-2xl border text-xs space-y-1`}>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">ব্যাখ্যা:</span>
                        <p className="leading-relaxed">{item.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: 📊 পরীক্ষা (EXAM HISTORY & SCORECARDS) */}
      {activeMainTab === 'exams' && (
        <div className="space-y-6 text-left">
          <div className={`flex items-center justify-between border-b ${isDark ? 'border-slate-800' : 'border-slate-300'} pb-3`}>
            <h3 className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-base flex items-center gap-2`}>
              <BarChart2 size={18} className="text-cyan-600 dark:text-cyan-400" />
              সম্পন্নকৃত পরীক্ষার ইতিহাস ({filteredExams.length}টি)
            </h3>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>অংশগ্রহণকৃত পরীক্ষার স্কোরের স্কোরকার্ড</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredExams.map(exam => (
              <div 
                key={exam.id}
                className={`${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                } border hover:border-cyan-500/40 p-5 rounded-3xl space-y-4 shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    {exam.subject}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{exam.dateCompleted}</span>
                </div>

                <div>
                  <h4 className={`font-black ${isDark ? 'text-white' : 'text-slate-900'} text-base leading-snug`}>{exam.examTitle}</h4>
                  <p className="text-xs text-slate-500 mt-1">সময় লেগেছে: {exam.timeSpentMinutes} মিনিট</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} p-3 rounded-2xl border space-y-0.5`}>
                    <span className="text-[10px] text-slate-500 block font-bold">প্রাপ্ত নম্বর</span>
                    <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{exam.score} / {exam.totalQuestions}</span>
                  </div>

                  <div className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} p-3 rounded-2xl border space-y-0.5`}>
                    <span className="text-[10px] text-slate-500 block font-bold">একিউরেসি</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{exam.accuracyPercentage}%</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`"${exam.examTitle}" পরীক্ষার উত্তরপত্র প্রস্তুত করা হচ্ছে...`)}
                  className={`w-full py-2.5 ${
                    isDark ? 'bg-slate-950 text-cyan-300 border-slate-800' : 'bg-slate-100 text-cyan-700 border-slate-200'
                  } font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border transition-colors`}
                >
                  <FileText size={14} /> বিস্তারিত উত্তরপত্র দেখুন ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
