import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Clock, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Zap, 
  Wallet, ShieldCheck, Heart, Info, ArrowLeft, ArrowRight, Star, RefreshCcw,
  Check, Play, Award, Timer, Loader2, Users, Flame, Landmark, BookOpen
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface Question {
  id: number;
  q: string;
  opts: string[];
  correct: number;
  subject: string;
  explanation: string;
}

// 20 high-fidelity mixed syllabus questions (BCS, Job, Admission style)
const MEGA_QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    subject: "Bangladesh Affairs",
    q: "The Mujibnagar Government was formally organized at Baidyanathtala. In which current district is it located?",
    opts: ["Meherpur", "Chuadanga", "Kushtia", "Jessore"],
    correct: 0,
    explanation: "On April 17, 1971, the Mujibnagar Government took its formal oath at Baidyanathtala, Mango Grove in Meherpur district."
  },
  {
    id: 2,
    subject: "International Affairs",
    q: "Which strategic waterway connects the Red Sea to the Mediterranean Sea directly?",
    opts: ["Panama Canal", "Suez Canal", "Strait of Malacca", "Bosporus Strait"],
    correct: 1,
    explanation: "The Suez Canal is a major artificial sea-level waterway in Egypt, connecting the Mediterranean Sea to the Red Sea."
  },
  {
    id: 3,
    subject: "Mathematics",
    q: "If x + y = 12 and xy = 35, what is the value of x² + y²?",
    opts: ["74", "84", "64", "94"],
    correct: 0,
    explanation: "x² + y² = (x + y)² - 2xy = (12)² - 2(35) = 144 - 70 = 74."
  },
  {
    id: 4,
    subject: "Bangla Literature",
    q: "Who is considered the pioneer of modern Bengali sonnets?",
    opts: ["Rabindranath Tagore", "Michael Madhusudan Dutt", "Kazi Nazrul Islam", "Jibanananda Das"],
    correct: 1,
    explanation: "Michael Madhusudan Dutt introduced sonnets (Amitrakshar Chhanda) to Bengali literature."
  },
  {
    id: 5,
    subject: "English Language",
    q: "What is the synonym of the word 'Epitome'?",
    opts: ["Contrast", "Exemplar", "Expansion", "Clump"],
    correct: 1,
    explanation: "'Epitome' means a perfect example or representative representation of a specific quality or class (Exemplar)."
  },
  {
    id: 6,
    subject: "General Science",
    q: "Which gas is primarily responsible for the greenhouse effect on Earth?",
    opts: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correct: 1,
    explanation: "Carbon Dioxide (CO2) is a primary greenhouse gas that traps thermal energy in Earth's atmosphere."
  },
  {
    id: 7,
    subject: "ICT",
    q: "What does the abbreviation 'BIOS' stand for in computer systems?",
    opts: ["Basic Input Output System", "Binary Input Output Service", "Broad Integration Operating Schema", "Basic Intel Octal Suite"],
    correct: 0,
    explanation: "BIOS stands for Basic Input Output System, responsible for hardware initialization during booting."
  },
  {
    id: 8,
    subject: "Bangladesh Affairs",
    q: "How many amendments have been made to the Constitution of Bangladesh to date?",
    opts: ["15", "16", "17", "18"],
    correct: 2,
    explanation: "The 17th Amendment is the latest amendment, passed in 2018 regarding reserved women seats extension."
  },
  {
    id: 9,
    subject: "International Affairs",
    q: "Where is the headquarters of the World Health Organization (WHO) situated?",
    opts: ["Vienna", "Geneva", "Paris", "New York"],
    correct: 1,
    explanation: "The WHO is headquartered in Geneva, Switzerland, managing global public health policies."
  },
  {
    id: 10,
    subject: "Mathematics",
    q: "What is the probability of physical dice throwing a prime number?",
    opts: ["1/6", "1/2", "1/3", "2/3"],
    correct: 1,
    explanation: "Prime numbers on a dice are 2, 3, and 5 (3 outcomes). Total outcomes are 6. Probability = 3/6 = 1/2."
  }
];

export const MegaQuiz: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Navigation track
  const [user, setUser] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Quiz Execution States
  const [gameMode, setGameMode] = useState<'lobby' | 'pay' | 'exam' | 'submitted'>('lobby');
  const [paymentGateway, setPaymentGateway] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentOTP, setPaymentOTP] = useState('');
  const [paymentPIN, setPaymentPIN] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Live Exam Simulation States
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [quizTimerActive, setQuizTimerActive] = useState(false);
  const [activeCompetitors, setActiveCompetitors] = useState(4201);

  // Leaderboard mock
  const [finalScore, setFinalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [nationalPercentile, setNationalPercentile] = useState(0);

  // Simulation mode
  const [isSimulatedLive, setIsSimulatedLive] = useState(false);

  // Load User details
  const loadUser = () => {
    const stored = localStorage.getItem('takeuup_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      
      // Determine subscription status
      const hasPlan = u.plan && !['free', 'starter'].includes(u.plan.toLowerCase());
      setIsSubscribed(!!hasPlan);

      // Check registered state for next Friday
      const regKey = `mega_reg_user_${u.email || 'guest'}`;
      setIsRegistered(localStorage.getItem(regKey) === 'true' || !!hasPlan);
    } else {
      setIsSubscribed(false);
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Countdown timer to Next Friday 8:00 PM
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Calculate target Friday 8 PM (20:00:00)
      let targetFriday = new Date();
      
      // Find Friday (day index 5)
      const dayDiff = (5 - now.getDay() + 7) % 7;
      targetFriday.setDate(now.getDate() + dayDiff);
      targetFriday.setHours(20, 0, 0, 0);

      // If already past Friday 8 PM this week, move to next week's Friday
      if (now.getTime() >= targetFriday.getTime()) {
        targetFriday.setDate(targetFriday.getDate() + 7);
      }

      const diff = targetFriday.getTime() - now.getTime();
      
      const secs = Math.floor(diff / 1000) % 60;
      const mins = Math.floor(diff / (1000 * 60)) % 60;
      const hrs = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const daysCount = Math.floor(diff / (1000 * 60 * 60 * 24));

      setCountdown({ days: daysCount, hours: hrs, minutes: mins, seconds: secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if it's currently Friday 8:00 PM - 8:30 PM
  const isTimeForMegaQuiz = () => {
    if (isSimulatedLive) return true;
    const now = new Date();
    // Friday is day 5. Check if it's Friday and time is between 20:00 (8 PM) and 20:30 (8:30 PM)
    return now.getDay() === 5 && now.getHours() === 20 && now.getMinutes() < 30;
  };

  // Live Competitors Pulse simulation
  useEffect(() => {
    let interval: any;
    if (gameMode === 'exam') {
      interval = setInterval(() => {
        setActiveCompetitors(prev => {
          const delta = Math.floor(Math.random() * 9) - 4; // fluctuates slightly
          return Math.max(1200, prev + delta);
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gameMode]);

  // Question ticking timer
  useEffect(() => {
    let tick: any;
    if (gameMode === 'exam' && quizTimerActive && timeLeft > 0) {
      tick = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Out of time for this question, auto-proceed
            handleNextQuestion();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(tick);
  }, [gameMode, quizTimerActive, timeLeft, currentIdx]);

  const handleNextQuestion = () => {
    if (currentIdx < MEGA_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(30);
    } else {
      // Finished all questions! Calculate immediate results
      calculateAndSubmitResults();
    }
  };

  const calculateAndSubmitResults = () => {
    setQuizTimerActive(false);
    
    let correct = 0;
    let penalty = 0;
    let empty = 0;

    MEGA_QUIZ_QUESTIONS.forEach(q => {
      const selected = selectedAnswers[q.id];
      if (selected === undefined) {
        empty += 1;
      } else if (selected === q.correct) {
        correct += 1;
      } else {
        penalty += 1;
      }
    });

    // Score calculations: Positive marking = 5 points per question, Negative = -1.25 penalty
    const rawScore = (correct * 5.0) - (penalty * 1.25);
    const roundedScore = Math.max(0, parseFloat(rawScore.toFixed(2)));

    setCorrectCount(correct);
    setPenaltyCount(penalty);
    setUnansweredCount(empty);
    setFinalScore(roundedScore);

    // Calculate simulated percentile
    const maxPossible = MEGA_QUIZ_QUESTIONS.length * 5;
    const performanceRatio = roundedScore / maxPossible;
    const percentile = Math.min(99.6, Math.max(12.4, performanceRatio * 100 + (Math.random() * 8 - 4)));
    setNationalPercentile(parseFloat(percentile.toFixed(1)));

    setGameMode('submitted');
  };

  // Confirm Mega Quiz Registration for Paid Mode
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentPhone || paymentPhone.length < 11) {
      setPaymentError('Please enter a valid 11-digit mobile number');
      return;
    }
    if (!paymentOTP || paymentOTP.length < 4) {
      setPaymentError('Please enter the 4-digit verification code you received');
      return;
    }
    if (!paymentPIN || paymentPIN.length < 4) {
      setPaymentError('Please enter your secure payment account PIN');
      return;
    }

    setPaymentError('');
    setIsPaying(true);

    // Mock processing payment
    setTimeout(() => {
      setIsPaying(false);
      setIsRegistered(true);
      setGameMode('lobby');

      // Persist locally
      if (user) {
        const regKey = `mega_reg_user_${user.email || 'guest'}`;
        localStorage.setItem(regKey, 'true');
      }
    }, 2000);
  };

  const handleStartExam = () => {
    // Start live quiz timer
    setCurrentIdx(0);
    setSelectedAnswers({});
    setTimeLeft(30);
    setQuizTimerActive(true);
    setGameMode('exam');
  };

  const handleFreeRegistration = () => {
    if (!user) {
      // Must be logged in
      navigate('/login');
      return;
    }
    setIsRegistered(true);
    const regKey = `mega_reg_user_${user.email || 'guest'}`;
    localStorage.setItem(regKey, 'true');
  };

  const getWeekText = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    const date = new Date();
    // Target Friday
    const dayDiff = (5 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + dayDiff);
    return `Friday, ${date.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className={isEmbedded ? "w-full py-6 transition-colors duration-300 text-slate-100" : "min-h-screen bg-slate-950 text-slate-100 py-12 px-4 transition-colors duration-300"}>
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb / Top Row */}
        <div className="flex items-center justify-between mb-8">
          {!isEmbedded ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={16} /> Back to Hub
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Live Mega Contest</span>
            </div>
          )}
                <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-widest ${
              isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
            } px-3 py-1.5 rounded-full border`}>
              ⚡ লাইভ মাল্টি-ট্র্যাক কুইজ প্রতিযোগিতা
            </span>
            <button 
              onClick={() => setIsSimulatedLive(!isSimulatedLive)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                isSimulatedLive 
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 animate-pulse' 
                : isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              🛠️ {isSimulatedLive ? 'সিমুলেশন টেস্ট চালু (পরীক্ষা শুরু করা যাবে)' : 'লাইভ কুইজ টেস্ট মোড'}
            </button>
          </div>
        </div>

        {/* LOBBY / PRE-REGISTRATION STATE */}
        {gameMode === 'lobby' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            
            {/* Main Details and Live Banner Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className={`relative overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-br from-[#0f172a] via-[#0f2744] to-[#0f172a] border-cyan-900/40' 
                  : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 border-cyan-500/20 text-white shadow-xl'
              } rounded-[2.5rem] border p-8 md:p-12 shadow-2xl relative`}>
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
                
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'bg-cyan-500/10 border-cyan-400/20 text-cyan-300' : 'bg-white/20 border-white/30 text-white'
                } border mb-6`}>
                  <Flame size={14} className="text-orange-400 animate-pulse" /> সাপ্তাহিক মেগা চ্যালেঞ্জ
                </span>
                
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  শুক্রবার নাইট <span className={isDark ? 'bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-300' : 'text-yellow-300'}>লাইভ মেগা কুইজ</span> প্রতিযোগিতা 🏆
                </h1>
                
                <p className={`text-sm md:text-base ${isDark ? 'text-slate-300' : 'text-cyan-50'} mb-8 max-w-xl leading-relaxed font-medium`}>
                  প্রতি শুক্রবার রাত ৮:০০ টায় দেশের হাজার হাজার সেরা শিক্ষার্থীদের সাথে সরাসরি প্রতিযোগিতায় অংশ নাও। নিশ্চিত গতি, সঠিক উত্তর, নেগেটিভ মার্কিং হিসাব ও সরাসরি স্কলারশিপ ট্রফি!
                </p>

                {/* Subtitle / Spec Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 mb-8 border-b ${isDark ? 'border-cyan-950/50' : 'border-white/20'}`}>
                  <div className={`${isDark ? 'bg-slate-950/45 border-cyan-950' : 'bg-white/15 border-white/25'} p-4 rounded-2xl border`}>
                    <span className={`block ${isDark ? 'text-slate-400' : 'text-cyan-100'} font-bold text-[10px] uppercase tracking-wider mb-1`}>সময়সূচী</span>
                    <span className="block font-black text-rose-300 dark:text-rose-400 text-sm">প্রতি শুক্র রাত ৮:০০</span>
                  </div>
                  <div className={`${isDark ? 'bg-slate-950/45 border-cyan-950' : 'bg-white/15 border-white/25'} p-4 rounded-2xl border`}>
                    <span className={`block ${isDark ? 'text-slate-400' : 'text-cyan-100'} font-bold text-[10px] uppercase tracking-wider mb-1`}>সিলেবাস</span>
                    <span className="block font-black text-cyan-200 dark:text-cyan-400 text-sm">অল-ইন-ওয়ান ট্র্যাক</span>
                  </div>
                  <div className={`${isDark ? 'bg-slate-950/45 border-cyan-950' : 'bg-white/15 border-white/25'} p-4 rounded-2xl border`}>
                    <span className={`block ${isDark ? 'text-slate-400' : 'text-cyan-100'} font-bold text-[10px] uppercase tracking-wider mb-1`}>মোট প্রশ্ন</span>
                    <span className="block font-black text-amber-200 dark:text-cyan-300 text-sm">২০টি বাছাইকৃত MCQ</span>
                  </div>
                  <div className={`${isDark ? 'bg-slate-950/45 border-cyan-950' : 'bg-white/15 border-white/25'} p-4 rounded-2xl border`}>
                    <span className={`block ${isDark ? 'text-slate-400' : 'text-cyan-100'} font-bold text-[10px] uppercase tracking-wider mb-1`}>নেগেটিভ মার্কিং</span>
                    <span className="block font-black text-orange-300 dark:text-orange-400 text-sm">-০.২৫ নীতি</span>
                  </div>
                </div>

                {/* Main Action Interface */}
                <div>
                  {!user ? (
                    <div className={`${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white/20 border-white/30'} p-6 rounded-2xl border border-dashed text-center`}>
                      <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-white'}`}>সাপ্তাহিক মেগা কুইজে অংশ নিতে এবং লাইভ ট্রফি জিততে লগইন করুন</p>
                      <button 
                        onClick={() => navigate('/login')}
                        className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-lg text-xs uppercase tracking-wider"
                      >
                        লগইন ও ফ্রি সিট বুকিং করুন
                      </button>
                    </div>
                  ) : isRegistered ? (
                    <div>
                      {isTimeForMegaQuiz() ? (
                        <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                          <div>
                            <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 animate-pulse mb-2">🔴 লাইভ শুরু হয়েছে</span>
                            <h3 className="text-xl font-bold text-white">মেগা কুইজ এখন ওপেন!</h3>
                            <p className="text-sm text-slate-300">মেধা প্রদর্শন এবং আকর্ষণীয় পুরস্কার ও ব্যাজ অর্জনে দ্রুত প্রবেশ করুন।</p>
                          </div>
                          <button
                            onClick={handleStartExam}
                            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl transition-all text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                          >
                            পরীক্ষায় প্রবেশ করুন <Play size={16} fill="currentColor" />
                          </button>
                        </div>
                      ) : (
                        <div className={`p-6 ${isDark ? 'bg-indigo-955/40 border-indigo-500/30' : 'bg-white/20 border-white/30'} border rounded-2xl flex items-center gap-4`}>
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <ShieldCheck size={26} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">আপনি সফলভাবে সিট বুক করেছেন!</h3>
                            <p className={`text-xs md:text-sm ${isDark ? 'text-slate-300' : 'text-indigo-50'}`}>অভিনন্দন! আগামী <span className="font-bold underline">{getWeekText()} রাত ৮:০০ টায়</span> কুইজ শুরু হবে। সময়মতো পুশ নোটিফিকেশন দেওয়া হবে।</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {isSubscribed ? (
                        <div className={`p-6 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white/20 border-white/30'} border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6`}>
                          <div>
                            <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-cyan-600 text-white mb-2">প্রিমিয়াম মেম্বারশিপ সুবিধা</span>
                            <h3 className="text-lg font-bold text-white">ফ্রি প্রিমিয়াম সিট বুক করুন</h3>
                            <p className="text-xs text-slate-200">আপনার সাবস্ক্রিপশন প্ল্যানে মেগা কুইজের সকল এডমিশন ফি সম্পূর্ণ ফ্রি।</p>
                          </div>
                          <button
                            onClick={handleFreeRegistration}
                            className="w-full md:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg"
                          >
                            ফ্রি সিট নিশ্চিত করুন ➔
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Option 1: Just Pay 99TK */}
                          <div className={`${
                            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/20 border-white/30'
                          } border p-6 rounded-2xl flex flex-col justify-between h-48 transition-all`}>
                            <div>
                              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest block mb-1">এককালীন মেগা কুইজ পাস</span>
                              <h4 className="text-lg font-bold text-white">শুধুমাত্র এই সপ্তাহের জন্য</h4>
                              <p className="text-xs text-slate-200 mt-2">এই শুক্রবার রাত ৮:০০ টার কুইজ অংশ নিন এবং জাতীয় র‍্যাঙ্কিং এ নিজের অবস্থান জানুন।</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-2xl font-black text-rose-300">৳৯৯ <span className="text-[10px] font-medium text-slate-300">মাত্র</span></span>
                              <button
                                onClick={() => setGameMode('pay')}
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all text-xs uppercase tracking-wider"
                              >
                                সিট বুক করুন
                              </button>
                            </div>
                          </div>

                          {/* Option 2: Go Premium */}
                          <div className={`${
                            isDark ? 'bg-gradient-to-br from-cyan-950/80 to-slate-955 border-cyan-500/20' : 'bg-white/20 border-white/30'
                          } border p-6 rounded-2xl flex flex-col justify-between h-48 transition-all relative`}>
                            <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              সেরা মূল্য
                            </div>
                            <div>
                              <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest block mb-1">অল-ইন-ওয়ান এক্সেস</span>
                              <h4 className="text-lg font-bold text-white">প্রিমিয়াম প্যাকেজ সাবস্ক্রাইব করুন</h4>
                              <p className="text-xs text-slate-200 mt-2">সকল সিলেবাস কোর্সের সাথে সাথে প্রতি শুক্রবারের মেগা কুইজ সম্পূর্ণ ফ্রি!</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-xl font-black text-cyan-300">৳৩৪৯ <span className="text-[10px] font-medium text-slate-300">/ ২ মাস</span></span>
                              <button
                                onClick={() => navigate('/pricing')}
                                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition-all text-xs uppercase tracking-wider"
                              >
                                প্রিমিয়ামে যান
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Perks & Awards Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } p-6 rounded-3xl border`}>
                  <div className="w-10 h-10 bg-indigo-600/10 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
                    <Trophy size={20} />
                  </div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>স্কলারশিপ ও গ্যাজেট ক্যাশব্যাক</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">প্রতি শুক্রবারের প্রথম ৩ জন বিজয়ী পাবেন টেক পুরষ্কার, স্টাডি বুকস এবং ইনস্ট্যান্ট ক্যাশব্যাক স্কলারশিপ।</p>
                </div>

                <div className={`${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } p-6 rounded-3xl border`}>
                  <div className="w-10 h-10 bg-cyan-600/10 text-cyan-600 rounded-xl flex items-center justify-center mb-4">
                    <Users size={20} />
                  </div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>জাতীয় স্তরের রিয়েল র‍্যাঙ্কিং</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">সারাদেশের হাজার হাজার শিক্ষার্থীর সাথে নিখুঁত পেন্টাইল গ্রেড এবং সময়ভিত্তিক পারফরম্যান্স পরীক্ষা করার সুযোগ।</p>
                </div>

                <div className={`${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } p-6 rounded-3xl border`}>
                  <div className="w-10 h-10 bg-purple-600/10 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <BookOpen size={20} />
                  </div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>মাল্টি-ট্র্যাক কমন প্রশ্ন</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">বিসিএস প্রিলিমিনারি, ব্যাংক জবস এবং বিশ্ববিদ্যালয়ের ভর্তি পরীক্ষার জন্য অত্যন্ত মানসম্মত প্রশ্ন তৈরি করা হয়।</p>
                </div>
              </div>

            </div>

            {/* Countdown and Live Registration Stats Widget */}
            <div className="space-y-6">
              
              {/* Countdown Board */}
              <div className={`${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              } border rounded-[2rem] p-6 text-center`}>
                <span className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-4">পরবর্তী মেগা কুইজ বাকি আছে</span>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className={`${isDark ? 'bg-[#0b0c15] border-slate-800' : 'bg-slate-100 border-slate-200'} p-3 rounded-xl border`}>
                    <span className={`block text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{String(countdown.days).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500">দিন</span>
                  </div>
                  <div className={`${isDark ? 'bg-[#0b0c15] border-slate-800' : 'bg-slate-100 border-slate-200'} p-3 rounded-xl border`}>
                    <span className={`block text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{String(countdown.hours).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500">ঘণ্টা</span>
                  </div>
                  <div className={`${isDark ? 'bg-[#0b0c15] border-slate-800' : 'bg-slate-100 border-slate-200'} p-3 rounded-xl border`}>
                    <span className={`block text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{String(countdown.minutes).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500">মিঃ</span>
                  </div>
                  <div className={`${isDark ? 'bg-[#0b0c15] border-slate-800' : 'bg-slate-100 border-slate-200'} p-3 rounded-xl border`}>
                    <span className={`block text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{String(countdown.seconds).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500">সেঃ</span>
                  </div>
                </div>

                <div className={`p-3 ${isDark ? 'bg-indigo-950/20 border-indigo-900/30' : 'bg-indigo-50 border-indigo-200'} border rounded-xl mt-4`}>
                  <span className={`text-xs ${isDark ? 'text-indigo-300' : 'text-indigo-900'} font-bold`}>
                    📅 সময়: {getWeekText()} রাত ৮:০০ টা (২০:০০)
                  </span>
                </div>
              </div>

              {/* Simulated Attending Counter */}
              <div className={`${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              } border rounded-[2rem] p-6 space-y-4`}>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-sm uppercase tracking-wider border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-3`}>রেজিস্টার্ড পরীক্ষার্থী</h3>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Student" />
                    <img className="w-8 h-8 rounded-full border border-slate-900 object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" alt="Student" />
                    <img className="w-8 h-8 rounded-full border border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Student" />
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} font-bold`}>রিফাত, তানজিম সহ ৩,৮৯২+ জন যুক্ত হয়েছেন</span>
                </div>
                
                <div className={`text-xs ${isDark ? 'text-slate-400 bg-slate-950/50 border-slate-800' : 'text-slate-600 bg-slate-50 border-slate-200'} p-4 rounded-xl border leading-relaxed`}>
                  📢 <span className="font-bold text-cyan-600 dark:text-cyan-400">পরামর্শ:</span> আপনার রিডিং রুমের প্রস্তুতি আগেভাগেই শেষ রাখুন! সাপ্তাহিক মেগা কুইজে সাধারণ জ্ঞান ও গণিত ট্র্যাক থেকে সরাসরি প্রশ্ন থাকে।
                </div>
              </div>

              {/* Last Week Winners */}
              <div className={`${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              } border rounded-[2rem] p-6`}>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-4">🏆 গত সপ্তাহের মেগা বিজয়ীগণ</span>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-2.5 ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-xl border`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-amber-500">১ম</span>
                      <div>
                        <span className={`block text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>আনিকা রহমান</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">বিসিএস ক্যাডার ক্যান্ডিডেট</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">স্কোর: ৯২.৫০</span>
                  </div>

                  <div className={`flex items-center justify-between p-2.5 ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-xl border`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-400">২য়</span>
                      <div>
                        <span className={`block text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>কাজী মাহমুদ</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">ভার্সিটি এডমিশন ট্র্যাক</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">স্কোর: ৮৮.৭৫</span>
                  </div>

                  <div className={`flex items-center justify-between p-2.5 ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-xl border`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-amber-600">৩য়</span>
                      <div>
                        <span className={`block text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>তারিকুল ইসলাম</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">ব্যাংক জবস প্রিপারেশন</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">স্কোর: ৮৬.২৫</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* PAYMENT / REGISTER MODAL SIMULATION */}
        {gameMode === 'pay' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-200">
            {/* Header branding */}
            <div className="p-6 bg-gradient-to-r from-red-600 to-indigo-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">Mega Quiz Entrance Fee</h3>
                <p className="text-xs text-white/80">Secure Multi-payment Network Gate</p>
              </div>
              <button 
                onClick={() => setGameMode('lobby')}
                className="text-white hover:text-red-100 font-semibold text-xs uppercase"
              >
                Cancel
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <span className="text-sm font-semibold text-slate-400">Amount to pay:</span>
                <span className="text-2xl font-black text-rose-400">৳99.00 <span className="text-[10px] font-normal text-slate-500">BDT</span></span>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setPaymentGateway('bkash'); setPaymentError(''); }}
                  className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
                    paymentGateway === 'bkash' 
                    ? 'bg-pink-600/10 border-pink-500 text-pink-400 shadow-lg' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-705'
                  }`}
                >
                  <Landmark size={20} />
                  <span className="text-xs font-bold">bKash</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentGateway('nagad'); setPaymentError(''); }}
                  className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
                    paymentGateway === 'nagad' 
                    ? 'bg-orange-600/10 border-orange-500 text-orange-400 shadow-lg' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-705'
                  }`}
                >
                  <Wallet size={20} />
                  <span className="text-xs font-bold">Nagad</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentGateway('rocket'); setPaymentError(''); }}
                  className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
                    paymentGateway === 'rocket' 
                    ? 'bg-purple-600/10 border-purple-500 text-purple-400 shadow-lg' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-750'
                  }`}
                >
                  <Landmark size={20} />
                  <span className="text-xs font-bold">Rocket</span>
                </button>
              </div>

              {/* Input Form Fields */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">{paymentGateway.toUpperCase()} Wallet Number</label>
                  <input 
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-white font-bold placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Verification OTP</label>
                    <input 
                      type="password"
                      required
                      placeholder="Received SMS"
                      value={paymentOTP}
                      onChange={(e) => setPaymentOTP(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-white font-bold text-center placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Account PIN</label>
                    <input 
                      type="password"
                      required
                      placeholder="Wallet PIN"
                      value={paymentPIN}
                      onChange={(e) => setPaymentPIN(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-white font-bold text-center placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500"
                      maxLength={5}
                    />
                  </div>
                </div>

                {paymentError && (
                  <p className="text-rose-400 text-xs font-bold mt-2 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 flex items-center gap-2">
                    <AlertCircle size={14} /> {paymentError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full mt-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/55"
                >
                  {isPaying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Verifying Credentials...
                    </>
                  ) : (
                    <>
                      Confirm Payment of ৳99
                    </>
                  )}
                </button>
              </form>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                By clicking pay, you authorize a test secure BDT connection. Real money is NOT deducted from your mobile banking in this mock sandboxed layout.
              </p>
            </div>
          </div>
        )}

        {/* LIVE EXAM RUNTIME STATE */}
        {gameMode === 'exam' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Status Head & Live Competitors indicator */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-850 p-4 rounded-3xl">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">LIVE MCQ ARENA</span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <Users size={14} className="text-cyan-400" /> {activeCompetitors.toLocaleString()} competing candidates online
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 uppercase font-black">
                  Progress: {currentIdx + 1}/{MEGA_QUIZ_QUESTIONS.length}
                </span>
                
                {/* Visual Radial Ticking Timer */}
                <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-850">
                  <Timer size={16} className={timeLeft <= 8 ? 'text-rose-500 animate-bounce' : 'text-cyan-400'} />
                  <span className={`font-mono text-lg font-extrabold ${timeLeft <= 8 ? 'text-rose-500 text-xl' : 'text-white'}`}>
                    00:{String(timeLeft).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions Core Panel */}
            <div className="bg-slate-900 border border-slate-850 rounded-[2.5rem] p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-cyan-500 to-indigo-500" style={{ width: `${((currentIdx + 1) / MEGA_QUIZ_QUESTIONS.length) * 100}%` }} />
              
              {/* Subject Tag */}
              <span className="inline-block px-3 py-1 bg-cyan-600/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider rounded-md mb-4">
                {MEGA_QUIZ_QUESTIONS[currentIdx].subject}
              </span>

              {/* Question Text */}
              <h2 className="text-2xl font-bold text-white mb-8 leading-snug">
                Q{currentIdx + 1}: {MEGA_QUIZ_QUESTIONS[currentIdx].q}
              </h2>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {MEGA_QUIZ_QUESTIONS[currentIdx].opts.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[MEGA_QUIZ_QUESTIONS[currentIdx].id] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [MEGA_QUIZ_QUESTIONS[currentIdx].id]: oIdx }))}
                      className={`text-left p-5 rounded-2xl border transition-all flex items-center justify-between text-sm font-bold ${
                        isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xl shadow-indigo-950/40 scale-[1.01]' 
                        : 'bg-[#0a0c16] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected 
                        ? 'bg-indigo-500 border-indigo-400 text-slate-950' 
                        : 'border-slate-800'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Buttons Row */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-850">
                <span className="text-xs text-rose-400 font-semibold animate-pulse">
                  ⚠️ -0.25 penalty applies for choosing wrong choice
                </span>
                
                <div className="flex items-center gap-3">
                  {currentIdx < MEGA_QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all text-sm uppercase tracking-wider flex items-center gap-2"
                    >
                      Next Question <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={calculateAndSubmitResults}
                      className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-black rounded-xl transition-all text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-950/50"
                    >
                      Submit Exam <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Quick Helper Banner */}
            <div className="text-center">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to exit the exam? Your progress will not be saved.")) {
                    setGameMode('lobby');
                  }
                }}
                className="text-slate-500 hover:text-rose-400 text-xs uppercase tracking-wider font-bold transition-colors"
              >
                Quit Live Contest
              </button>
            </div>

          </div>
        )}

        {/* RESULTS SCREEN / GAMIFIED SHOWDOWN */}
        {gameMode === 'submitted' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Success Score panel */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#020617] via-[#111827] to-[#020617] rounded-[2.5rem] border border-slate-800 p-8 md:p-12 text-center shadow-2xl relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              
              <div className="w-16 h-16 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-yellow-500/20">
                <Award size={32} />
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Performance Statement</h1>
              <p className="text-slate-400 text-sm mb-8 uppercase tracking-widest font-semibold">Bangladesh Merit Index Checklist</p>

              {/* Main Score Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
                <div className="bg-[#0b0d19] p-5 rounded-2xl border border-indigo-950/40 text-center">
                  <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Raw Marks</span>
                  <span className="block text-3xl font-black text-cyan-400">{finalScore.toFixed(2)}</span>
                  <span className="block text-[8px] text-slate-600 mt-1 uppercase font-semibold">Out of 50.0</span>
                </div>

                <div className="bg-[#0b0d19] p-5 rounded-2xl border border-indigo-950/40 text-center">
                  <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">National Percentile</span>
                  <span className="block text-3xl font-black text-indigo-400">Top {nationalPercentile}%</span>
                  <span className="block text-[8px] text-slate-600 mt-1 uppercase font-semibold">Among 14,028 students</span>
                </div>

                <div className="bg-[#0b0d19] p-5 rounded-2xl border border-indigo-950/40 text-center">
                  <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Accuracy</span>
                  <span className="block text-3xl font-black text-emerald-400">
                    {MEGA_QUIZ_QUESTIONS.length - unansweredCount > 0 
                      ? Math.round((correctCount / (MEGA_QUIZ_QUESTIONS.length - unansweredCount)) * 100) 
                      : 0}%
                  </span>
                  <span className="block text-[8px] text-slate-600 mt-1 uppercase font-semibold">On attempted</span>
                </div>

                <div className="bg-[#0b0d19] p-5 rounded-2xl border border-indigo-950/40 text-center">
                  <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Answer Profile</span>
                  <span className="block text-xs font-black text-white mt-2 space-x-1.5">
                    <span className="text-emerald-400">{correctCount} ✔</span>
                    <span className="text-[#a4a5be]">/</span>
                    <span className="text-rose-400">{penaltyCount} ❌</span>
                    <span className="text-[#a4a5be]">/</span>
                    <span className="text-slate-400">{unansweredCount} ⚪</span>
                  </span>
                  <span className="block text-[8px] text-slate-600 mt-2 uppercase font-semibold">Correct / Wrong / Empty</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setGameMode('lobby')}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={16} /> Try Friday Lobby Again
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-820 text-slate-300 font-extrabold rounded-xl transition-all border border-slate-800 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Trophy size={16} /> View All-time Boards
                </button>
              </div>

            </div>

            {/* Answer Solutions and Custom BCS Explanations Panel */}
            <div className="bg-slate-900 border border-slate-850 rounded-[2rem] p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen size={18} className="text-cyan-400" /> Subject-specific Solutions &amp; Explanations
              </h3>

              <div className="space-y-4">
                {MEGA_QUIZ_QUESTIONS.map((q, idx) => {
                  const selected = selectedAnswers[q.id];
                  const isCorrect = selected === q.correct;
                  const isUnanswered = selected === undefined;
                  
                  return (
                    <div 
                      key={q.id}
                      className="p-5 rounded-2xl bg-[#0b0c15] border border-slate-850/80 hover:border-slate-800 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          Question {idx + 1} • <span className="text-cyan-400">{q.subject}</span>
                        </span>
                        
                        <div className="flex items-center gap-2 text-xs font-bold">
                          {isUnanswered ? (
                            <span className="text-slate-500 bg-slate-950 px-2.5 py-1 rounded">Unanswered</span>
                          ) : isCorrect ? (
                            <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">✔ Correct (Score +5)</span>
                          ) : (
                            <span className="text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded">❌ Wrong (Penalty -1.25)</span>
                          )}
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-base leading-snug">{q.q}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        {q.opts.map((opt, oIdx) => {
                          const iChosen = selected === oIdx;
                          const iCorrect = q.correct === oIdx;
                          return (
                            <div 
                              key={oIdx} 
                              className={`p-2 rounded-lg border leading-tight ${
                                iCorrect 
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 font-semibold' 
                                : iChosen 
                                ? 'bg-rose-950/20 border-rose-500/30 text-rose-300 font-semibold' 
                                : 'bg-slate-900 border-transparent text-slate-400'
                              }`}
                            >
                              {oIdx + 1}. {opt} {iCorrect && ' (Correct choice)'} {iChosen && ' (Your choice)'}
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t border-slate-850/50 flex gap-2 items-start text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-xl mt-2">
                        <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-300">Explanation:</span> {q.explanation}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
