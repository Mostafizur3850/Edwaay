import React, { useState, useEffect } from 'react';
import { 
  Clock, ArrowRight, CheckCircle2, XCircle, RefreshCcw, Trophy, Target, Zap, 
  GraduationCap, ChevronLeft, ChevronDown, ChevronUp, Lock, Crown, Play, Sparkles, 
  Check, X, Layers, BookOpen, FileText, Settings, ShieldCheck, Flame
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Question } from '../../types/types';
import { useTheme } from '../../context/ThemeContext';

interface QuizInterfaceProps {
  isEmbedded?: boolean;
}

// --- STEP 0: SUBJECTS LIST DATA (Screenshot 4 Match) ---
const QUIZ_SUBJECTS = [
  { id: 'bangla', name: 'বাংলা', engName: 'Bangla', symbol: 'অ', color: 'bg-red-50 text-rose-600 border-rose-200 dark:bg-rose-955/30 dark:text-rose-400' },
  { id: 'english', name: 'English', engName: 'English', symbol: 'Aa', color: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-955/30 dark:text-indigo-400' },
  { id: 'gk', name: 'সাধারণ জ্ঞান', engName: 'General Knowledge', symbol: '🧠', color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-955/30 dark:text-blue-400' },
  { id: 'statistics', name: 'পরিসংখ্যান', engName: 'Statistics', symbol: '📊', color: 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-955/30 dark:text-sky-400' },
  { id: 'physics', name: 'পদার্থবিজ্ঞান', engName: 'Physics', symbol: '🧪', color: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-955/30 dark:text-emerald-400' },
  { id: 'agri', name: 'কৃষিশিক্ষা', engName: 'Agriculture', symbol: '🌱', color: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-955/30 dark:text-green-400' },
  { id: 'chemistry', name: 'রসায়ন', engName: 'Chemistry', symbol: '⚗️', color: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-955/30 dark:text-amber-400' },
  { id: 'home_econ', name: 'গার্হস্থ্য বিজ্ঞান', engName: 'Home Economics', symbol: '🏠', color: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-955/30 dark:text-pink-400' },
  { id: 'biology', name: 'জীববিজ্ঞান', engName: 'Biology', symbol: '🧬', color: 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-955/30 dark:text-teal-400' },
  { id: 'higher_math', name: 'উচ্চতর গণিত', engName: 'Higher Math', symbol: 'π', color: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-955/30 dark:text-orange-400' },
  { id: 'psychology', name: 'মনোবিজ্ঞান', engName: 'Psychology', symbol: '💜', color: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-955/30 dark:text-purple-400' },
  { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি', engName: 'ICT', symbol: '🌐', color: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-955/30 dark:text-cyan-400' },
  { id: 'mental_ability', name: 'মানসিক দক্ষতা', engName: 'Mental Ability', symbol: '🧠', color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-955/30 dark:text-fuchsia-400' },
  { id: 'iba', name: 'IBA', engName: 'IBA Aptitude', symbol: 'IBA', color: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-955/30 dark:text-rose-400' }
];

// --- PRESET EXAMS LIST (Screenshot 4 Match) ---
const PRESET_EXAMS_PILLS = [
  'IUT', "ঢাবি 'ক'", "CoU 'A'", 'SUST A', "ঢাবি 'খ'", 'জাবি এ', 'BUP FSSS/FASS',
  'RU A', 'কৃষি গুচ্ছ', 'IBA', 'BUP FBS', 'মেডিকেল+ডেন্টাল', "জগন্নাথ 'ক'",
  'KU A', 'চবি বিজ্ঞান', 'রাবি গ (বিজ্ঞান)', 'BUP FST', 'গুচ্ছ ক (বিজ্ঞান)', 'জাবি ডি',
  'HSTU A', 'KU B', 'HSTU B'
];

// --- STEP 1: TOPIC SELECTION TREE DATA (Screenshot 2 & 3 Match) ---
const BANGLA_TOPICS_TREE = {
  paper1: {
    id: 'bangla_1',
    title: 'বাংলা প্রথম পত্র',
    countText: '১০/৮৫৩ টি প্রশ্ন',
    sections: [
      {
        id: 'goddo',
        title: 'গদ্য',
        countText: '৫/৩৯১২',
        items: [
          { id: 't1', title: 'সাহিত্যে খেলা', count: '০/২১০' },
          { id: 't2', title: 'কপিলদাস মুর্মুর শেষ কাজ', count: '১/১৩২' },
          { id: 't3', title: 'যৌবনের গান', count: '০/২৪১' },
          { id: 't4', title: 'অর্ধাঙ্গী', count: '০/২৪২' },
          { id: 't5', title: 'গন্তব্য কাবুল', count: '০/২৪০' },
          { id: 't6', title: 'কারবালার-প্রান্তর', count: '০/৪২' },
          { id: 't7', title: 'বাংলার নব্য লেখকদের প্রতি নিবেদন', count: '০/১৯২' },
          { id: 't8', title: 'অপরিচিতা', count: '১/৭৪৮' },
          { id: 't9', title: 'বিলাসী', count: '০/৩৬৮' },
          { id: 't10', title: 'জীবন ও বৃক্ষ', count: '১/১২০' },
          { id: 't11', title: 'মাসি-পিসি', count: '০/৩৭৭' },
          { id: 't12', title: 'রেইনকোট', count: '১/৩৯১' }
        ]
      },
      {
        id: 'poddo',
        title: 'পদ্য',
        countText: '৪/২৯২৬',
        items: [
          { id: 'p1', title: 'বিভিষণের প্রতি মেঘনাদ', count: '১/২৪০' },
          { id: 'p2', title: 'সোনার তরী', count: '০/৩৮০' },
          { id: 'p3', title: 'বিদ্রোহী', count: '১/৫২০' },
          { id: 'p4', title: 'প্রতিদান', count: '০/১৮০' }
        ]
      },
      {
        id: 'novel',
        title: 'উপন্যাস ও নাটক',
        countText: '১/১৫৮৯',
        items: [
          { id: 'n1', title: 'লালসালু (উপন্যাস)', count: '১/৮৫০' },
          { id: 'n2', title: 'সিরাজউদ্দৌলা (নাটক)', count: '০/৭৩৯' }
        ]
      }
    ]
  },
  paper2: {
    id: 'bangla_2',
    title: 'বাংলা ২য় পত্র',
    countText: '০/৮৪৯৩ টি প্রশ্ন',
    items: [
      { id: 'b1', title: '১. বাংলা উচ্চারণের নিয়ম(৫)', count: '০/৭৮' },
      { id: 'b2', title: 'ব্যাকরণ অংশ ( এডমিশন )', count: '০/৬৭৮২', hasExpand: true },
      { id: 'b3', title: '২. বাংলা বানানের নিয়ম(৫)', count: '০/৬৪' },
      { id: 'b4', title: '৩. বাংলা ভাষার ব্যাকরণিক শব্দশ্রেণি(৫)', count: '০/৮৬' },
      { id: 'b5', title: '৪ . বাংলা শব্দের গঠন ( উপসর্গ ও সমাস )', count: '০/৪৮' },
      { id: 'b6', title: '৫ । বাক্যতত্ত্ব', count: '০/১০১' },
      { id: 'b7', title: '৬ বাংলা ভাষার অপপ্রয়োগ ও শুদ্ধ প্রয়োগ', count: '০/৮৮' },
      { id: 'b8', title: '৭. পারিভাষিক শব্দ/অনুবাদ-১০', count: '০/৮৯' },
      { id: 'b9', title: '৮. দিনলিপি/প্রতিবেদন-১০', count: '০/১৭০' },
      { id: 'b10', title: '৯ বৈদ্যুতিক চিঠি / আবেদন পত্র', count: '০/১৬৫' },
      { id: 'b11', title: '১০ সারাংশ / ভাবসম্প্রসারণ', count: '০/১৪৫' },
      { id: 'b12', title: '১১ সংলাপ / খুদেগল্প', count: '০/১৬৯' },
      { id: 'b13', title: '১২ প্রবন্ধ- নিবন্ধ রচনা', count: '০/৪২০' }
    ]
  }
};

// --- MOCK QUESTIONS DATABASE FOR LIVE EXAM SESSION ---
const MOCK_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "‘সাহিত্যে খেলা’ প্রবন্ধে প্রমথ চৌধুরীর মতে সাহিত্যের মূল উদ্দেশ্য কী?",
    options: ["আনন্দ দান", "শিক্ষা দান", "নীতি শিক্ষা", "টাকা উপার্জন"],
    answer: "আনন্দ দান",
    explanation: "প্রমথ চৌধুরীর মতে সাহিত্য চর্চার প্রধান উদ্দেশ্য আনন্দ লাভ।"
  },
  {
    id: 2,
    question: "‘অপরিচিতা’ গল্পে অনুপমের আসল অভিভাবক কে ছিলেন?",
    options: ["মামা", "বাবা", "মা", "হরিমোহন"],
    answer: "মামা",
    explanation: "অনুপমের মামা ছিলেন তার সংসারের আসল অভিভাবক।"
  },
  {
    id: 3,
    question: "‘রেইনকোট’ গল্পের কথক কে?",
    options: ["নুরুল হুদা", "আসফাক হোসেন", "আকবর সাজিদ", "ইসহাক মিয়া"],
    answer: "নুরুল হুদা",
    explanation: "মুক্তিযুদ্ধভিত্তিক এই গল্পটির মূল কথক কলেজ শিক্ষক নুরুল হুদা।"
  }
];

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // WIZARD STEP STATE (0: Subject List, 1: Topic Select, 2: Standard Select, 3: Confirm, 4: Live Exam)
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [mainTabToggle, setMainTabToggle] = useState<'mock' | 'quick'>('mock');

  // STEP CONFIGURATIONS STATE
  const [selectedSubject, setSelectedSubject] = useState<any>(QUIZ_SUBJECTS[0]);
  const [selectedTopicsMap, setSelectedTopicsMap] = useState<Record<string, boolean>>({ 't1': true }); // default selected
  const [expandedSectionsMap, setExpandedSectionsMap] = useState<Record<string, boolean>>({ 'goddo': true });
  const [totalQuestionsCount, setTotalQuestionsCount] = useState<number>(25);
  const [selectedStandardsMap, setSelectedStandardsMap] = useState<Record<string, boolean>>({
    varsity: true,
    academic: false,
    medical: false,
    engineering: false
  });

  const toggleStandard = (id: string) => {
    setSelectedStandardsMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const [questionTypeMode, setQuestionTypeMode] = useState<'mcq' | 'cq'>('mcq');
  const [selectedTopicsPreviewOpen, setSelectedTopicsPreviewOpen] = useState<boolean>(true);
  const [totalExamTimeMins, setTotalExamTimeMins] = useState<number>(25);
  const [isNegativeMarking, setIsNegativeMarking] = useState<boolean>(true);

  // LIVE EXAM SESSION STATE
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examTimeLeftSeconds, setExamTimeLeftSeconds] = useState<number>(1500);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<Record<number, string>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);

  // Toggle Topic Selection
  const toggleTopic = (id: string) => {
    setSelectedTopicsMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Section Collapse
  const toggleSectionExpand = (id: string) => {
    setExpandedSectionsMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Live Timer Interval
  useEffect(() => {
    let timer: any;
    if (examStarted && !examSubmitted) {
      timer = setInterval(() => {
        setExamTimeLeftSeconds(prev => {
          if (prev <= 1) {
            setExamSubmitted(true);
            setExamStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted]);

  // Format Timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
  };

  // Reset Wizard
  const handleResetToHome = () => {
    setWizardStep(0);
    setExamStarted(false);
    setExamSubmitted(false);
  };

  if (wizardStep < 0 || wizardStep > 4) setWizardStep(0);

  return (
    <div className={isEmbedded ? "max-w-4xl mx-auto py-2 text-slate-900 dark:text-slate-100" : "max-w-4xl mx-auto px-4 py-6 min-h-screen pb-24 text-slate-900 dark:text-slate-100"}>
      
      {/* STEP 0: MAIN MOCK EXAM & PRESET SELECTION SCREEN */}
      {wizardStep === 0 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Top Segmented Tab Switch */}
          <div className="flex justify-center">
            <div className={'p-1 rounded-full border ' + (isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-300') + ' inline-flex'}>
              <button
                onClick={() => setMainTabToggle('mock')}
                className={'px-8 py-2 rounded-full text-xs font-black transition-all ' + (
                  mainTabToggle === 'mock'
                    ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                মক পরীক্ষা
              </button>
              <button
                onClick={() => setMainTabToggle('quick')}
                className={'px-8 py-2 rounded-full text-xs font-black transition-all ' + (
                  mainTabToggle === 'quick'
                    ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                দ্রুত প্র্যাকটিস
              </button>
            </div>
          </div>

          {/* Section Heading */}
          <div className="text-left space-y-1">
            <h2 className="text-base lg:text-lg font-black text-slate-900 dark:text-white">
              টপিক সিলেক্ট করো
            </h2>
          </div>

          {/* Grid of 14 Subjects */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
            {QUIZ_SUBJECTS.map((subj) => (
              <div
                key={subj.id}
                onClick={() => {
                  setSelectedSubject(subj);
                  setWizardStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={(
                  isDark ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                ) + ' border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group'}
              >
                <div className="flex items-center gap-3">
                  <div className={'w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ' + subj.color}>
                    {subj.symbol}
                  </div>
                  <span className="font-extrabold text-xs lg:text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {subj.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Preset Exams Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white text-center">
              প্রিসেট পরীক্ষা
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {PRESET_EXAMS_PILLS.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSubject({ id: 'preset', name: pill });
                    setWizardStep(1);
                  }}
                  className={(
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' : 'bg-white border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
                  ) + ' border px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all hover:scale-105'}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}


      {/* STEP 1: TOPIC SELECTION TREE (1/3 STEPS) */}
      {wizardStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300 pb-20">
          
          {/* Top Navigation & Step Indicator */}
          <div className="space-y-4">
            <button
              onClick={() => setWizardStep(0)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition-colors"
            >
              <ChevronLeft size={16} /> {selectedSubject.name}
            </button>

            <div className="flex items-center justify-between">
              <h2 className="text-base lg:text-lg font-black text-slate-900 dark:text-white">
                টপিক সিলেক্ট করো
              </h2>

              <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-955/60 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-300/40">
                ১/৩ স্টেপস
              </span>
            </div>

            {/* 3-Segment Progress Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className="h-1.5 rounded-full bg-emerald-600"></div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            </div>
          </div>

          {/* Tree Grid: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* COLUMN 1: বাংলা প্রথম পত্র */}
            <div className="space-y-3">
              <div className={(isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200') + ' border p-3 rounded-2xl flex items-center justify-between shadow-sm'}>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-slate-900 dark:text-white">
                  <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 accent-emerald-600" defaultChecked />
                  <span>{BANGLA_TOPICS_TREE.paper1.title}</span>
                </label>
                <span className="text-[10px] text-slate-400 font-bold">{BANGLA_TOPICS_TREE.paper1.countText}</span>
              </div>

              {BANGLA_TOPICS_TREE.paper1.sections.map((sec) => (
                <div key={sec.id} className="space-y-2 pl-4">
                  <div className={(isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200') + ' border p-2.5 rounded-2xl flex items-center justify-between shadow-sm'}>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                      <input type="checkbox" className="w-4 h-4 rounded accent-emerald-600" defaultChecked />
                      <span>{sec.title}</span>
                    </label>
                    <button 
                      onClick={() => toggleSectionExpand(sec.id)}
                      className="flex items-center gap-1 text-[10px] text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <span>{sec.countText}</span>
                      {expandedSectionsMap[sec.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {expandedSectionsMap[sec.id] && (
                    <div className="space-y-1.5 pl-4">
                      {sec.items.map((item) => (
                        <div key={item.id} className={(isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/80') + ' border p-2 rounded-xl flex items-center justify-between text-xs'}>
                          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                            <input 
                              type="checkbox" 
                              checked={!!selectedTopicsMap[item.id]} 
                              onChange={() => toggleTopic(item.id)}
                              className="w-3.5 h-3.5 rounded accent-emerald-600" 
                            />
                            <span>{item.title}</span>
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* COLUMN 2: বাংলা ২য় পত্র */}
            <div className="space-y-3">
              <div className={(isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200') + ' border p-3 rounded-2xl flex items-center justify-between shadow-sm'}>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-slate-900 dark:text-white">
                  <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 accent-emerald-600" />
                  <span>{BANGLA_TOPICS_TREE.paper2.title}</span>
                </label>
                <span className="text-[10px] text-slate-400 font-bold">{BANGLA_TOPICS_TREE.paper2.countText}</span>
              </div>

              <div className="space-y-1.5 pl-4">
                {BANGLA_TOPICS_TREE.paper2.items.map((item) => (
                  <div key={item.id} className={(isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200') + ' border p-2.5 rounded-2xl flex items-center justify-between text-xs shadow-sm'}>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200 font-bold">
                      <input 
                        type="checkbox" 
                        checked={!!selectedTopicsMap[item.id]} 
                        onChange={() => toggleTopic(item.id)}
                        className="w-4 h-4 rounded accent-emerald-600" 
                      />
                      <span>{item.title}</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      {item.count} {item.hasExpand && <ChevronDown size={12} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Bottom Toolbar */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 hidden sm:inline">প্রশ্ন সংখ্যা</span>
                <input 
                  type="number" 
                  value={totalQuestionsCount}
                  onChange={(e) => setTotalQuestionsCount(Number(e.target.value))}
                  className="w-14 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-2 py-1.5 text-xs text-center font-black focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setWizardStep(0)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  + আরেকটি বিষয়
                </button>

                <button 
                  onClick={() => {
                    setWizardStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-700/20 transition-all"
                >
                  এগিয়ে যাও ➔
                </button>
              </div>
            </div>
          </div>

        </div>
      )}


      {/* STEP 2: QUESTION STANDARD SELECTION (MULTI-SELECT SUPPORTED) */}
      {wizardStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300 pb-20">
          
          {/* Top Navigation & Step Indicator */}
          <div className="space-y-4">
            <button
              onClick={() => setWizardStep(1)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition-colors"
            >
              <ChevronLeft size={16} /> {selectedSubject?.name || 'বাংলা'}
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base lg:text-lg font-black text-slate-900 dark:text-white">
                  প্রশ্নের স্ট্যান্ডার্ড
                </h2>
              </div>

              <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-955/60 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-300/40">
                ২/৩ স্টেপস
              </span>
            </div>

            {/* 3-Segment Progress Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className="h-1.5 rounded-full bg-emerald-600"></div>
              <div className="h-1.5 rounded-full bg-emerald-600"></div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            </div>
          </div>

          {/* Standard Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {[
              { id: 'varsity', title: 'Varsity', desc: 'ঢাকা বিশ্ববিদ্যালয় ও সকল বিশ্ববিদ্যালয় মান' },
              { id: 'academic', title: 'Academic', desc: 'এইচএসসি ও বোর্ড সিলেবাস মান' }
            ].map(std => {
              const isChecked = !!selectedStandardsMap[std.id];
              return (
                <div 
                  key={std.id}
                  onClick={() => toggleStandard(std.id)}
                  className={(
                    isChecked 
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20' 
                      : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  ) + ' border-2 rounded-2xl p-6 cursor-pointer flex items-center justify-between transition-all duration-200'}
                >
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                    />
                    <div>
                      <h4 className="font-black text-sm lg:text-base text-slate-900 dark:text-white">
                        {std.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{std.desc}</p>
                    </div>
                  </div>

                  {isChecked && (
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-955/60 px-2.5 py-1 rounded-full border border-emerald-300/40">
                      ✓ Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setWizardStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-700/20 transition-all"
              >
                এগিয়ে যাও ➔
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: FINAL CONFIRMATION & EXAM CONFIG (3/3 STEPS) */}
      {wizardStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300 pb-24 max-w-2xl mx-auto">
          
          {/* Top Navigation & Step Indicator */}
          <div className="space-y-4">
            <button
              onClick={() => setWizardStep(2)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition-colors"
            >
              <ChevronLeft size={16} /> {selectedSubject.name}
            </button>

            <div className="flex items-center justify-between">
              <h2 className="text-base lg:text-lg font-black text-slate-900 dark:text-white">
                নিশ্চিত করো
              </h2>

              <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-955/60 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-300/40">
                ৩/৩ স্টেপস
              </span>
            </div>

            {/* 3-Segment Progress Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className="h-1.5 rounded-full bg-emerald-600"></div>
              <div className="h-1.5 rounded-full bg-emerald-600"></div>
              <div className="h-1.5 rounded-full bg-emerald-600"></div>
            </div>
          </div>

          {/* Question Type Toggle (MCQ / CQ) */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">প্রশ্নের ধরন</span>
            <div className="p-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex">
              <button
                onClick={() => setQuestionTypeMode('mcq')}
                className={'flex-1 py-2.5 rounded-xl font-black text-xs transition-all ' + (
                  questionTypeMode === 'mcq'
                    ? 'bg-[#80335e] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                )}
              >
                MCQ
              </button>
              <button
                onClick={() => setQuestionTypeMode('cq')}
                className={'flex-1 py-2.5 rounded-xl font-black text-xs transition-all ' + (
                  questionTypeMode === 'cq'
                    ? 'bg-[#80335e] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                )}
              >
                CQ
              </button>
            </div>
          </div>

          {/* Total Questions Display Input */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">মোট প্রশ্ন সংখ্যা</span>
            <div className={(isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200') + ' border rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-sm'}>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalQuestionsCount}</span>
              <span className="text-slate-400 font-medium">টি প্রশ্ন</span>
            </div>
          </div>

          {/* Selected Topics Accordion Preview */}
          <div className={(isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200') + ' border rounded-2xl p-3.5 shadow-sm space-y-3'}>
            <button
              onClick={() => setSelectedTopicsPreviewOpen(!selectedTopicsPreviewOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <span>সিলেক্টেড টপিকস দেখতে এখানে ট্যাপ করো</span>
              {selectedTopicsPreviewOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {selectedTopicsPreviewOpen && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1 text-emerald-800 dark:text-emerald-300 font-bold pl-2">
                <p>বাংলা</p>
                <p className="pl-3">বাংলা প্রথম পত্র</p>
                <p className="pl-6">গদ্য</p>
                <p className="pl-9 text-slate-600 dark:text-slate-400 font-medium">সাহিত্যে খেলা</p>
              </div>
            )}
          </div>

          {/* Fixed Sticky Bottom Toolbar */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">মোট সময়</span>
                <input 
                  type="number" 
                  value={totalExamTimeMins}
                  onChange={(e) => setTotalExamTimeMins(Number(e.target.value))}
                  className="w-12 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-2 py-1 text-xs text-center font-black focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs font-bold text-slate-500">মিনিট</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span>নেগেটিভ</span>
                  <input 
                    type="checkbox" 
                    checked={isNegativeMarking}
                    onChange={(e) => setIsNegativeMarking(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-600 rounded"
                  />
                  <span className="text-rose-600 dark:text-rose-400 font-black">০.২৫ মার্ক কাটা</span>
                </label>

                <button 
                  onClick={() => {
                    setWizardStep(4);
                    setExamStarted(true);
                    setExamTimeLeftSeconds(totalExamTimeMins * 60);
                    setUserSelectedAnswers({});
                    setExamSubmitted(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-[#047857] hover:bg-[#036247] text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-700/20 transition-all"
                >
                  পরীক্ষা শুরু করো
                </button>
              </div>
            </div>
          </div>

        </div>
      )}


      {/* STEP 4: LIVE TIMED EXAM SESSION */}
      {wizardStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300 pb-24 max-w-3xl mx-auto">
          
          {/* Header Bar */}
          <div className={(isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900') + ' border rounded-3xl p-5 shadow-xl flex items-center justify-between sticky top-4 z-20'}>
            <div>
              <h3 className="font-black text-sm">{selectedSubject.name} — {questionTypeMode.toUpperCase()} পরীক্ষা</h3>
              <p className="text-[11px] text-slate-500 font-bold">{totalQuestionsCount} টি প্রশ্ন • {Object.keys(selectedStandardsMap).filter(k => selectedStandardsMap[k]).join(', ').toUpperCase() || 'VARSITY'} স্ট্যান্ডার্ড</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 rounded-2xl border border-emerald-500/30 text-xs font-black">
                <Clock size={15} /> {formatTime(examTimeLeftSeconds)}
              </div>

              <button 
                onClick={handleResetToHome}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Exam Questions List */}
          <div className="space-y-6">
            {MOCK_QUIZ_QUESTIONS.map((q, qIdx) => (
              <div key={q.id} className={(isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm') + ' border rounded-3xl p-6 space-y-4'}>
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                    {qIdx + 1}. {q.question}
                  </h4>
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full shrink-0">
                    ১ মার্ক
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const optLabel = ['ক', 'খ', 'গ', 'ঘ'][optIdx];
                    const isSelected = userSelectedAnswers[q.id] === opt;
                    const isCorrect = q.answer === opt;

                    return (
                      <button
                        key={optIdx}
                        disabled={examSubmitted}
                        onClick={() => setUserSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                        className={'w-full p-3 rounded-2xl text-left text-xs font-bold transition-all border flex items-center justify-between ' + (
                          examSubmitted
                            ? isCorrect
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                              : isSelected
                              ? 'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300'
                              : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'
                            : isSelected
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-md'
                            : isDark ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={'w-6 h-6 rounded-xl flex items-center justify-center font-black text-[11px] ' + (
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          )}>
                            {optLabel}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {examSubmitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {examSubmitted && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1 text-slate-800 dark:text-slate-200 font-medium">
                    <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles size={13} /> বিস্তারিত ব্যাখ্যা:
                    </span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#047857] text-white p-3 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              <span className="text-xs font-black">
                উত্তর দেওয়া হয়েছে: {Object.keys(userSelectedAnswers).length} / {MOCK_QUIZ_QUESTIONS.length}
              </span>

              {!examSubmitted ? (
                <button
                  onClick={() => {
                    setExamSubmitted(true);
                    setExamStarted(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-2 bg-white text-[#047857] font-black text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all"
                >
                  সাবমিট করো
                </button>
              ) : (
                <button
                  onClick={handleResetToHome}
                  className="px-8 py-2 bg-white text-[#047857] font-black text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all"
                >
                  নতুন পরীক্ষা শুরু ➔
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
