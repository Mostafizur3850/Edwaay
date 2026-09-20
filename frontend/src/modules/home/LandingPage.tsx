import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, BarChart3, Trophy, Target, BookOpen,
  Users, HelpCircle, ChevronRight, PlayCircle, Bot, ArrowRight,
  Phone, Mail, MapPin, Facebook, Youtube, Linkedin, Instagram, ShieldCheck,
  FileText, FileType, Table, Image, Layers, File, X, CheckCircle2,
  Smartphone, GraduationCap, Briefcase, ChevronDown, Building
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'hsc' | 'engineering' | 'medical' | 'varsity' | 'bcs'>('hsc');
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState('Today');
  
  const leaderboardData: Record<string, any[]> = {
    Today: [
      { rank: 1, name: 'Tanvir Hasan', score: '98.4%' },
      { rank: 2, name: 'Farzana Akter', score: '97.8%' },
      { rank: 3, name: 'Shakib Islam', score: '97.2%' },
      { rank: 4, name: 'Mim Rahman', score: '96.9%' },
      { rank: 5, name: 'Arafat Khan', score: '96.5%' }
    ],
    Weekly: [
      { rank: 1, name: 'Mehedi Hasan', score: '99.1%' },
      { rank: 2, name: 'Tanvir Hasan', score: '98.5%' },
      { rank: 3, name: 'Sadia Islam', score: '97.9%' },
      { rank: 4, name: 'Rakib Hossain', score: '97.4%' },
      { rank: 5, name: 'Jannatul Ferdous', score: '97.0%' }
    ],
    Monthly: [
      { rank: 1, name: 'Farzana Akter', score: '99.5%' },
      { rank: 2, name: 'Mehedi Hasan', score: '99.2%' },
      { rank: 3, name: 'Tanvir Hasan', score: '98.8%' },
      { rank: 4, name: 'Arafat Khan', score: '98.1%' },
      { rank: 5, name: 'Sajid Islam', score: '97.7%' }
    ],
    Exam: [
      { rank: 1, name: 'Shakib Islam', score: '100%' },
      { rank: 2, name: 'Mim Rahman', score: '99.0%' },
      { rank: 3, name: 'Farzana Akter', score: '98.5%' },
      { rank: 4, name: 'Tanvir Hasan', score: '98.0%' },
      { rank: 5, name: 'Mehedi Hasan', score: '97.5%' }
    ],
    Subject: [
      { rank: 1, name: 'Sajid Islam', score: '99.8%' },
      { rank: 2, name: 'Arafat Khan', score: '99.4%' },
      { rank: 3, name: 'Jannatul Ferdous', score: '98.9%' },
      { rank: 4, name: 'Rakib Hossain', score: '98.3%' },
      { rank: 5, name: 'Sadia Islam', score: '97.8%' }
    ]
  };

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setNewsletterEmail('');
      }, 1000);
    }
  };
  
  const [homeMentors, setHomeMentors] = useState<any[]>([
    {
      id: 'm1',
      initials: 'RA',
      avatarBg: 'bg-[#e0f2fe]',
      avatarText: 'text-[#0369a1]',
      name: 'Rafiul Ahmed',
      role: 'Physics Mentor',
      rating: '4.9',
      students: '127',
      price: '৳500'
    },
    {
      id: 'm2',
      initials: 'NS',
      avatarBg: 'bg-[#fef3c7]',
      avatarText: 'text-[#92400e]',
      name: 'Nusrat Sultana',
      role: 'Admission & Math Mentor',
      rating: '4.8',
      students: '96',
      price: '৳450'
    },
    {
      id: 'm3',
      initials: 'MH',
      avatarBg: 'bg-[#ffe4e6]',
      avatarText: 'text-[#be123c]',
      name: 'Mahfuz Hasan',
      role: 'BCS Mentor',
      rating: '5.0',
      students: '210',
      price: '৳600'
    }
  ]);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const { fetchMentorsList } = await import('../../services/api');
        const list = await fetchMentorsList();
        if (list && list.length > 0) {
          const mapped = list.slice(0, 3).map((m: any, index: number) => {
            const safeName = m.name || 'Mentor';
            const nameParts = safeName.split(' ').filter((p: string) => p.length > 0);
            let initials = 'M';
            if (nameParts.length > 1) {
              initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
            } else if (nameParts.length === 1) {
              initials = nameParts[0].substring(0, 2).toUpperCase();
            }
            const colorThemes = [
              { bg: 'bg-[#e0f2fe]', text: 'text-[#0369a1]' },
              { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
              { bg: 'bg-[#ffe4e6]', text: 'text-[#be123c]' }
            ];
            const theme = colorThemes[index % colorThemes.length];
            return {
              id: m.id || `m${index+1}`,
              initials,
              avatarBg: theme.bg,
              avatarText: theme.text,
              name: m.name || 'Mentor',
              role: m.title || m.subject || (isBn ? 'সাধারণ শিক্ষা' : 'General'),
              rating: m.rating || '4.9',
              students: '100+',
              price: '৳500'
            };
          });
          setHomeMentors(mapped);
        }
      } catch (e) {}
    };
    loadMentors();
  }, [isBn]);

  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [studyTasks, setStudyTasks] = useState([
        { id: 1, text: "Chapter Revision", done: true },
        { id: 2, text: "30 MCQ Practice", done: true },
        { id: 3, text: "Take Mock Test", done: false },
        { id: 4, text: "Review MistakeBank", done: false }
      ]);
    
      const toggleStudyTask = (id: number) => {
        setStudyTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
      };
    
  const [selectedDuration, setSelectedDuration] = useState('7 Days');
  const [selectedGoal, setSelectedGoal] = useState('Complete HSC Physics');
  const [generatedPlan, setGeneratedPlan] = useState<{id: string, title: string}[]>([
    { id: '01', title: 'Chapter 1: Vectors' },
    { id: '02', title: 'Chapter 1 Practice Set' },
    { id: '03', title: 'Chapter 2: Motion' },
    { id: '04', title: 'Chapter 2 Practice Set' },
    { id: '05', title: 'Chapter 3: Force & Laws of Motion' },
    { id: '06', title: 'Chapter 3 Practice Set' },
    { id: '07', title: 'Mixed Quiz: Ch 1-3' },
  ]);
  const [planTitleDuration, setPlanTitleDuration] = useState('7 Days');
  const [selectedStage, setSelectedStage] = useState<'HSC' | 'Admission' | 'Job Preparation' | 'BCS' | null>(null);

  const handleGeneratePlan = () => {
    const days = parseInt(selectedDuration.split(' ')[0]) || 7;
    const newPlan = [];
    
    let topics = ['Introduction', 'Basics', 'Core Concepts', 'Advanced Topics', 'Practice', 'Mock Test'];
    if (selectedGoal.includes('Physics')) {
      topics = ['Vectors', 'Motion', 'Force', 'Work & Energy', 'Gravitation', 'Thermodynamics'];
    } else if (selectedGoal.includes('Math')) {
      topics = ['Algebra', 'Geometry', 'Calculus', 'Trigonometry', 'Probability', 'Statistics'];
    } else if (selectedGoal.includes('BCS')) {
      topics = ['Bangla', 'English', 'Bangladesh Affairs', 'International Affairs', 'Math', 'Science'];
    } else if (selectedGoal.includes('Bank')) {
      topics = ['Math', 'English', 'General Knowledge', 'Computer', 'Analytical Ability', 'Essay'];
    }

    for (let i = 1; i <= days; i++) {
      const topicIndex = Math.floor((i - 1) / 2) % topics.length;
      const topicName = topics[topicIndex];
      let title = '';
      if (i % 7 === 0) {
        title = isBn ? `সাপ্তাহিক রিভিশন ও কুইজ` : `Weekly Revision & Quiz`;
      } else if (i % 2 === 0) {
        title = isBn ? `দিন ${i}: ${topicName} (প্র্যাকটিস)` : `Day ${i}: ${topicName} (Practice)`;
      } else {
        title = isBn ? `দিন ${i}: ${topicName} (কনসেপ্ট)` : `Day ${i}: ${topicName} (Concept)`;
      }
      
      newPlan.push({
        id: i.toString().padStart(2, '0'),
        title
      });
    }

    setGeneratedPlan(newPlan);
    setPlanTitleDuration(selectedDuration);
  };
  const TRACKS = [
    {
      id: 'hsc',
      title: { bn: '🎓 এইচএসসি বোর্ড পরীক্ষা', en: '🎓 HSC Board Exam' },
      subtitle: { bn: 'পদার্থ, রসায়ন, উচ্চতর গণিত ও জীববিজ্ঞানের এ+ প্রস্তুতি', en: 'A+ Preparation for Physics, Chemistry, Math & Biology' },
      tag: { bn: 'HSC 2026 / 2027', en: 'HSC 2026 / 2027' },
      desc: {
        bn: '২০+ বছরের সকল শিক্ষা বোর্ডের সৃজনশীল ও বহুনির্বাচনী প্রশ্ন ব্যাখ্যাসহ অনুশীলনের সুযোগ।',
        en: 'Chapter-wise CQ & MCQ practice from 20+ years of all education board question banks.'
      }
    },
    {
      id: 'engineering',
      title: { bn: '⚡ বুয়েট ও ইঞ্জিনিয়ারিং', en: '⚡ BUET & Engineering' },
      subtitle: { bn: 'BUET, CKET ও প্রযুক্তি বিশ্ববিদ্যালয় প্রস্তুতি', en: 'BUET, CKET & Technology University Admission' },
      tag: { bn: 'Engineering Prep', en: 'Engineering Prep' },
      desc: {
        bn: 'কঠিন গাণিতিক সমস্যার শর্টকাট সমাধান ও বুয়েট মানের মক টেস্ট।',
        en: 'Advanced math problem shortcuts, physics concept drills, and BUET standard mock exams.'
      }
    },
    {
      id: 'medical',
      title: { bn: '🩺 মেডিকেল ও ডেন্টাল', en: '🩺 Medical & Dental' },
      subtitle: { bn: 'DMC, SSMC ও সরকারি মেডিকেল কলেজ ভর্তি', en: 'DMC, SSMC & Public Medical College Admission' },
      tag: { bn: 'Medical Aspirants', en: 'Medical Aspirants' },
      desc: {
        bn: 'বায়োলজি তথ্য ব্যাংক, কেমিস্ট্রি রিঅ্যাকশন কুইজ ও নেগেটিভ মার্কিং ট্র্যাকার।',
        en: 'Comprehensive biology data bank, chemistry reaction practice, and negative marking trackers.'
      }
    },
    {
      id: 'varsity',
      title: { bn: '🏛️ ঢাবি ক-ইউনিট ও সায়েন্স', en: '🏛️ DU KA Unit & Cluster' },
      subtitle: { bn: 'ঢাকা বিশ্ববিদ্যালয় ও গুচ্ছ বিশ্ববিদ্যালয় ক-ইউনিট', en: 'Dhaka University & Cluster Science Admission' },
      tag: { bn: 'DU KA & Cluster', en: 'DU KA & Cluster' },
      desc: {
        bn: 'ঢাকা বিশ্ববিদ্যালয়ের ১৫ বছরের প্রশ্নব্যাংক সলভ ও স্ট্যান্ডার্ড কুইজ।',
        en: '15 years of DU KA unit question paper solutions and speed test mock exams.'
      }
    },
    {
      id: 'bcs',
      title: { bn: '💼 বিসিএস ও ক্যাডার প্রস্তুতি', en: '💼 BCS & Cadre Exam' },
      subtitle: { bn: '৪৬তম ও ৪৭তম বিসিএস প্রিলিমিনারি হাব', en: '46th & 47th BCS Preliminary Exam Hub' },
      tag: { bn: 'BCS Aspirants', en: 'BCS Aspirants' },
      desc: {
        bn: 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী, গাণিতিক যুক্তি ও মানসিক দক্ষতার সিলেবাস ট্র্যাকার।',
        en: 'Syllabus tracker and daily practice tests for Bangladesh affairs, math logic & mental ability.'
      }
    }
  ];

  const FEATURES = [
    {
      id: 'ai-solver',
      icon: <Bot className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      title: { bn: "২৪/৭ AI ডাউট সলভার", en: "24/7 AI Doubt Solver" },
      shortDesc: {
        bn: "পদার্থ, কেমিস্ট্রি বা গণিতের যেকোনো কঠিন প্রশ্ন ছবি তুলে পাঠাও, সাথে সাথে বুঝে নাও।",
        en: "Upload or type any complex question from Physics, Chemistry, or Math to get instant step-by-step AI solutions."
      },
      fullDesc: {
        bn: "স্মার্ট AI মডেলের সাহায্যে জটিল গাণিতিক ও থিওরিটিক্যাল প্রশ্নের নির্ভুল বাংলা ব্যাখ্যা। তোমার যেকোনো ভুলের কারণ চিহ্নিত করে শুধরে দেয়।",
        en: "Get instant step-by-step AI explanations for complex math and physics questions in both Bangla and English."
      },
      benefits: [
        { bn: "যেকোনো প্রশ্নের ছবি বা টেক্সট আপলোড সল্যুশন", en: "Snap image or type text to solve" },
        { bn: "ধাপভিত্তিক বাংলা ও ইংরেজি ব্যাখ্যা", en: "Step-by-step detailed explanations" },
        { bn: "২৪ ঘণ্টা আনলিমিটেড ডাউট ক্লিয়ারিং", en: "24/7 Unlimited doubt resolution" }
      ],
      badge: { bn: "AI Powered", en: "AI Powered" },
      bgClass: isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-xl"
    },
    {
      id: 'qbank',
      icon: <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      title: { bn: "স্মার্ট প্রশ্নব্যাংক ও আর্কাইভ", en: "Smart Question Bank" },
      shortDesc: {
        bn: "এইচএসসি বোর্ড ও সেরা বিশ্ববিদ্যালয়সমূহের বিগত ২০ বছরের প্রশ্ন অধ্যায়ভিত্তিক ব্যাখ্যাসহ।",
        en: "Access 20+ years of chapter-wise solved questions for HSC boards and top public universities."
      },
      fullDesc: {
        bn: "বিগত ২০ বছরের বুয়েট, ঢাবি, মেডিকেল ও সকল বোর্ড পরীক্ষার প্রশ্নাবলী অধ্যায়ভিত্তিক সাজানো সল্যুশন।",
        en: "Filter solved board and university admission questions by chapter, topic, and difficulty."
      },
      benefits: [
        { bn: "২০+ বছরের অধ্যায়ভিত্তিক প্রশ্ন ব্যাংক", en: "20+ years chapter-wise archive" },
        { bn: "সঠিক উত্তরের সাথে ব্যাখ্যা টিপস", en: "Shortcuts & explanation tips" },
        { bn: "টাইমার সহ অনলাইন কুইজ প্র্যাকটিস", en: "Timed speed test practice" }
      ],
      badge: { bn: "Question Archive", en: "Question Archive" },
      bgClass: isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-xl"
    },
    {
      id: 'mega-quiz',
      icon: <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      title: { bn: "সাপ্তাহিক মেগা কুইজ ও স্কলারশিপ", en: "Weekly Mega Quiz" },
      shortDesc: {
        bn: "প্রতি শুক্রবার রাত ৮টায় সারাদেশে লাইভ প্রতিযোগিতা ও নগদ প্রাইজমানি জেতার সুযোগ।",
        en: "Compete live every Friday at 8 PM nationwide to win direct scholarship prizes via bKash/Nagad."
      },
      fullDesc: {
        bn: "সারা দেশের শিক্ষার্থীদের সাথে লাইভ টেস্টে অংশ নিয়ে বিকাশ বা নগদ-এ নগদ অর্থ পুরষ্কার জিতার সুযোগ।",
        en: "Participate in real-time nationwide competitive quizzes and win scholarship cash prizes."
      },
      benefits: [
        { bn: "প্রতি শুক্রবার রাত ৮টায় লাইভ কুইজ", en: "Every Friday 8 PM live contest" },
        { bn: "বিকাশ/নগদ-এ সরাসরি ক্যাশ রিওয়ার্ড", en: "Direct bKash/Nagad cash payouts" },
        { bn: "লাইভ মেধা অবস্থান ও লিডারবোর্ড", en: "Real-time rank leaderboard" }
      ],
      badge: { bn: "৳৮৫,০০০ স্কলারশিপ", en: "৳85,000 Fund" },
      bgClass: isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-xl"
    },
    {
      id: 'peer-chat',
      icon: <Users className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      title: { bn: "স্টাডি ক্লাব ও ক্যাটাগরি পিয়ার্স", en: "Peer Study Groups" },
      shortDesc: {
        bn: "BUET, Medical ও HSC সমমনা পরীক্ষার্থীদের সাথে গ্রুপ তৈরি করে একসাথে প্রস্তুতি।",
        en: "Connect and chat 1-on-1 with fellow HSC, BUET, or Medical aspirants in real-time."
      },
      fullDesc: {
        bn: "ফেসবুক মেসেঞ্জারের মতো ভাসমান চ্যাট হেডে সহপাঠী ও মেন্টরদের সাথে সরাসরি নোট ও আইডিয়া শেয়ারিং।",
        en: "Chat 1-on-1 with peers and mentors using Facebook Desktop style floating multi-chat windows."
      },
      benefits: [
        { bn: "একই ক্যাটাগরির সহপাঠী খোঁজার ফিল্টার", en: "Filter and find category peers" },
        { bn: "১-অন-১ লাইভ মেসেঞ্জার ইন্টারফেস", en: "1-on-1 Facebook style messenger" },
        { bn: "মেন্টরদের থেকে সরাসরি টিপস", en: "Direct guidance from top mentors" }
      ],
      badge: { bn: "Peer Community", en: "Peer Community" },
      bgClass: isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-xl"
    },
    {
      id: 'leaderboard',
      icon: <BarChart3 className="w-5 h-5 text-purple-500 dark:text-purple-400" />,
      title: { bn: "জাতীয় লিডারবোর্ড ও র‍্যাংকিং", en: "National Leaderboard" },
      shortDesc: {
        bn: "দেশসেরা পরীক্ষার্থীদের সাথে নিজের মেধা যাচাই করো এবং সাপ্তাহিক র‍্যাংক উন্নত করো।",
        en: "Measure your rank against top students across Bangladesh and climb the weekly leaderboard."
      },
      fullDesc: {
        bn: "মেধা তালিকার শীর্ষ পরীক্ষার্থীদের প্রস্তুতি কৌশল এবং নিজের অবস্থান বিশ্লেষণের বিশেষ গ্রাফ।",
        en: "Visualize your preparation rank trends against top rankers from Notre Dame, Holy Cross, and Cadet Colleges."
      },
      benefits: [
        { bn: "জাতীয় ও কলেজ ভিত্তিক র‍্যাংক", en: "National & college level ranking" },
        { bn: "পারফরম্যান্স ও গতি এনালাইসিস", en: "Speed & accuracy performance analytics" },
        { bn: "সাপ্তাহিক ও মাসিক লিডারবোর্ড ব্যাজ", en: "Weekly & monthly badges" }
      ],
      badge: { bn: "National Rank", en: "National Rank" },
      bgClass: isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-xl"
    },
    {
      id: 'predictor',
      icon: <Target className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
      title: { bn: "বিশ্ববিদ্যালয় অ্যাডমিশন প্রেডিক্টর", en: "Admission Predictor" },
      shortDesc: {
        bn: "তোমার এসএসসি ও এইচএসসি রেজাল্ট দিয়ে বুয়েট, ঢাবি বা মেডিকেলের যোগ্যতা হিসাব করো।",
        en: "Calculate your eligibility and predicted merit rank for BUET, DU, or DMC using your GPA."
      },
      fullDesc: {
        bn: "এসএসসি ও এইচএসসির জিপিএ ও সাবজেক্ট মার্কস ইনপুট দিয়ে বুয়েট, ঢাবি ও মেডিকেলের অটোমেটিক যোগ্যতা হিসাব।",
        en: "Automatic eligibility and cutoff calculation for BUET, DU, DMC, and engineering clusters based on GPA."
      },
      benefits: [
        { bn: "সকল বিশ্ববিদালয়ের যোগ্যতা ক্যালকুলেটর", en: "All university eligibility calculator" },
        { bn: "বিগত বছরের কাট অফ মার্কস ডেটা", en: "Past years cutoff score archive" },
        { bn: "ব্যক্তিগত পছন্দক্রম নির্দেশিকা", en: "Personalized subject preference guide" }
      ],
      badge: { bn: "Eligibility Calc", en: "Eligibility Calc" },
      bgClass: isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-xl"
    }
  ];

  const UTILITY_TOOLS = [
    { name: 'PDF to Word', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', link: '/tools/pdf-to-word' },
    { name: 'Word to PDF', icon: FileType, color: 'text-indigo-500', bg: 'bg-indigo-500/10', link: '/tools/word-to-pdf' },
    { name: 'PDF to Excel', icon: Table, color: 'text-green-500', bg: 'bg-green-500/10', link: '/tools/pdf-to-excel' },
    { name: 'Img to PDF', icon: Image, color: 'text-purple-500', bg: 'bg-purple-500/10', link: '/tools/img-to-pdf' },
    { name: 'Merge PDF', icon: Layers, color: 'text-red-500', bg: 'bg-red-500/10', link: '/tools/merge-pdf' },
    { name: 'CV Builder', icon: File, color: 'text-cyan-500', bg: 'bg-cyan-500/10', link: '/jobs/create-cv' }
  ];

  const TESTIMONIALS = [
    {
      name: { bn: "সাকিব আল হাসান", en: "Sakib Al Hasan" },
      role: { bn: "BUET CSE (১ম স্থান মেধা তালিকা)", en: "BUET CSE (1st Merit Rank)" },
      college: { bn: "নটর ডেম কলেজ, ঢাকা", en: "Notre Dame College, Dhaka" },
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      quote: {
        bn: "টেকআপের AI ডাউট সলভার ও ভেক্টর কুইজ আমার বুয়েট ফিজিক্স প্রস্তুতিতে সবচেয়ে বড় ভূমিকা রেখেছে। যেকোনো সমস্যায় সাথে সাথে টিউটরের মত সমাধান পেয়েছি।",
        en: "TakeUp's AI Doubt Solver and Vector quizzes played a crucial role in my BUET physics preparation. Instant teacher-like explanations saved me hours!"
      }
    },
    {
      name: { bn: "নুসরাত জাহান", en: "Nusrat Jahan" },
      role: { bn: "ঢাকা মেডিকেল কলেজ (DMC ৩য় স্থান)", en: "Dhaka Medical College (DMC Rank 3)" },
      college: { bn: "হোলি ক্রস কলেজ, ঢাকা", en: "Holy Cross College, Dhaka" },
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      quote: {
        bn: "মেডিকেল ভর্তি পরীক্ষায় ভুলের সংখ্যা কমানোই আসল খেলা। টেকআপের মিস্টেক ব্যাংক ও ডাউট চ্যাট আমাকে ১০০% কনফিডেন্ট করেছে।",
        en: "Minimizing negative marks is the secret to Medical admission. TakeUp's mistake bank and doubt chat gave me 100% confidence."
      }
    },
    {
      name: { bn: "গাজী সালাহউদ্দিন", en: "Gazi Salahuddin" },
      role: { bn: "৪৫তম বিসিএস (প্রশাসন ক্যাডার - র‍্যাংক ১২)", en: "45th BCS Admin Cadre (Rank 12)" },
      college: { bn: "ঢাকা বিশ্ববিদ্যালয়", en: "Dhaka University" },
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      quote: {
        bn: "বিসিএস প্রিলির রিভিশনের জন্য টেকআপের ডেইলি কুইজ ও সিলেবাস ট্র্যাকার একদম অসাধারণ। প্রতিদিন ১০ মিনিট কুইজ দিলেই প্রস্তুতি ঝালাই হয়ে যায়।",
        en: "TakeUp's daily quizzes and syllabus tracker are unbeatable for BCS prelim revision. 10 minutes a day keeps your prep sharp."
      }
    }
  ];

  const FAQS = [
    {
      q: { bn: "টেকআপ প্ল্যাটফর্ম ব্যবহারের জন্য কি টাকা দিতে হয়?", en: "Is TakeUp free to use for students?" },
      a: {
        bn: "না! টেকআপের সকল বেসিক ফিচার যেমন—ডেইলি কুইজ, মক টেস্ট, প্রশ্নব্যাংক ও মেসেঞ্জার ডাউট সলভার শিক্ষার্থীদের জন্য বিনামূল্যে উন্মুক্ত।",
        en: "No! All core features including daily quizzes, mock tests, question banks, and messenger doubt solving are completely free for students."
      }
    },
    {
      q: { bn: "AI ডাউট সলভার কীভাবে কাজ করে?", en: "How does the 24/7 AI Doubt Solver work?" },
      a: {
        bn: "আমাদের AI ডাউট সলভার ২৪ ঘণ্টা অ্যাক্টিভ থাকে। পদার্থবিজ্ঞান, রসায়ন বা গণিতের যেকোনো কঠিন প্রশ্নের টেক্সট বা ছবি পাঠালেই AI স্টেপ-বাই-স্টেপ সঠিক ব্যাখ্যা তৈরি করে দেয়।",
        en: "Our AI Doubt Solver is active 24/7. Snap a picture or type any problem from Physics, Chemistry, or Math, and get instant step-by-step solutions."
      }
    },
    {
      q: { bn: "মেগা কুইজের প্রাইজমানি কীভাবে দেওয়া হয়?", en: "How are Mega Quiz scholarship rewards sent?" },
      a: {
        bn: "প্রতিশুক্রবার রাত ৮টায় আয়োজিত মেগা কুইজে শীর্ষ স্থানে অর্জনকারী পরীক্ষার্থীদের বিকাশ/নগদ এর মাধ্যমে সরাসরি স্কলারশিপ প্রাইজমানি পাঠিয়ে দেওয়া হয়।",
        en: "Top rankers in our Friday 8 PM Mega Quiz receive direct scholarship money sent straight to their bKash/Nagad accounts."
      }
    },
    {
      q: { bn: "সহপাঠী বা মেন্টরদের সাথে কীভাবে চ্যাট করব?", en: "How do I chat with mentors or fellow peers?" },
      a: {
        bn: "ড্যাশবোর্ডের ডানদিকের নিচে ভাসমান সবুজ মেসেঞ্জার বাটনে বা মেসেজ মেনুতে ক্লিক করলেই সরাসরি যেকোনো মেন্টর বা সহপাঠীকে সার্চ করে ফেসবুক মেসেঞ্জারের মত ১-অন-১ চ্যাট করা যাবে।",
        en: "Click the floating green messenger button at the bottom-right of your dashboard to search and 1-on-1 chat with mentors or peers like Facebook Messenger."
      }
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#070b14] text-slate-100' : 'bg-[#f4f7fc] text-slate-900'
      } font-sans selection:bg-cyan-500 selection:text-white transition-colors duration-300 overflow-x-hidden`}>

      {/* 1. HERO SECTION WITH COSMIC ORBS */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Animated Background Glowing Orbs */}
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] ${isDark ? 'bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-purple-600/10' : 'bg-gradient-to-tr from-blue-300/30 via-indigo-300/30 to-cyan-300/20'
          } rounded-full blur-[140px] pointer-events-none animate-pulse`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">

            {/* Top Pill Badge */}
            <div className={`inline-block mb-4 text-sm font-semibold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#44709d]'}`}>
              {isBn ? "প্রস্তুতি থেকে ক্যারিয়ার পর্যন্ত একটি যাত্রা" : "A journey from preparation to career"}
            </div>

            {/* Main Headline */}
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>
              {isBn ? (
                <>তোমার লক্ষ্য.<br />তোমার পরিকল্পনা.<br />তোমার যাত্রা.</>
              ) : (
                <>Your Goal.<br />Your Plan.<br />Your Journey.</>
              )}
            </h1>

            {/* Subtitle */}
            <p className={`text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium mt-6 ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
              {isBn
                ? 'স্মার্ট প্রস্তুতি নাও, উদ্দেশ্য নিয়ে অনুশীলন করো, তোমার অগ্রগতি ট্র্যাক করো এবং ভবিষ্যৎ গড়ো — সবকিছু এক প্ল্যাটফর্মে।'
                : 'Prepare smarter, practice with purpose, track your progress, and build your future — all in one place.'
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3 bg-[#d93838] hover:bg-[#b92a2a] text-white font-bold text-sm rounded-full transition-all shadow-md"
              >
                {isBn ? 'তোমার যাত্রা শুরু করো' : 'Start Your Journey'}
              </Link>

              <Link
                to="/resources"
                className={`w-full sm:w-auto px-8 py-3 ${isDark ? 'bg-slate-900/50 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-200 text-[#1d232a]'
                  } border flex items-center justify-center font-bold text-sm rounded-full transition-all`}
              >
                {isBn ? 'ফ্রি রিসোর্স এক্সপ্লোর করো' : 'Explore Free Resources'}
              </Link>
            </div>

            {/* Avatars / Joined by section */}
            <style>{`
              @keyframes avatar-float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-4px) rotate(-3deg); }
                50% { transform: translateY(-6px) rotate(0deg); }
                75% { transform: translateY(-4px) rotate(3deg); }
              }
              .avatar-anim {
                animation: avatar-float 4s ease-in-out infinite;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
              .avatar-anim:hover {
                animation-play-state: paused;
                transform: translateY(-8px) scale(1.15) !important;
                z-index: 60 !important;
                box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
              }
            `}</style>
            <div className="pt-10 flex flex-col items-center justify-center space-y-4">
              <div className="flex -space-x-4 group/avatars">
                <div className="avatar-anim relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#7aadc9] border-[3px] border-white flex items-center justify-center text-white text-base sm:text-lg font-black shadow-md z-10 cursor-pointer" style={{ animationDelay: '0s' }}>
                  RA
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 z-20">
                    <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2e1065]" />
                  </div>
                </div>
                <div className="avatar-anim relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d63333] border-[3px] border-white flex items-center justify-center text-white text-base sm:text-lg font-black shadow-md z-20 cursor-pointer" style={{ animationDelay: '0.4s' }}>
                  MH
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 z-30">
                    <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3b82f6]" fill="#bfdbfe" />
                  </div>
                </div>
                <div className="avatar-anim relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1b222c] border-[3px] border-white flex items-center justify-center text-white text-base sm:text-lg font-black shadow-md z-30 cursor-pointer" style={{ animationDelay: '0.8s' }}>
                  NS
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 z-40">
                    <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#7c2d12]" fill="#fbcfe8" />
                  </div>
                </div>
                <div className="avatar-anim relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#e3d7b8] border-[3px] border-white flex items-center justify-center text-[#2d3748] text-base sm:text-lg font-black shadow-md z-40 cursor-pointer" style={{ animationDelay: '1.2s' }}>
                  FA
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 z-50">
                    <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#334155]" fill="#cbd5e1" />
                  </div>
                </div>
                <div className="avatar-anim relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#e4eff9] border-[3px] border-white flex items-center justify-center text-[#5586b5] text-sm sm:text-base font-black shadow-md z-50 cursor-pointer" style={{ animationDelay: '1.6s' }}>
                  +50K
                </div>
              </div>
              <p className={`text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
                {isBn ? (
                  <>এইচএসসি, এডমিশন, জব ও বিসিএস প্রস্তুতিতে যুক্ত হয়েছেন <span className="font-bold text-[#1d232a] dark:text-slate-300">৫০,০০০+ শিক্ষার্থী</span></>
                ) : (
                  <>Joined by <span className="font-bold text-[#1d232a] dark:text-slate-300">50,000+ students</span> preparing for HSC, Admission, Job & BCS</>
                )}
              </p>
            </div>

            {/* Simple Text Stats line at the bottom */}
            <div className={`mt-12 pt-8 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200/60'} grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto`}>
              {[
                { val: isBn ? '৫০,০০০+' : '50,000+', label: isBn ? 'শিক্ষার্থী অধ্যয়নরত' : 'Students learning' },
                { val: isBn ? '২৫,০০০+' : '25,000+', label: isBn ? 'প্র্যাকটিস প্রশ্ন' : 'Practice questions' },
                { val: isBn ? '৪.৮' : '4.8', suffix: <span className="text-[#d93838] ml-1 text-xl leading-none">★</span>, label: isBn ? 'গড় রেটিং' : 'Average student rating' },
                { val: isBn ? '৪৭৫' : '475', prefix: <span className="w-2.5 h-2.5 rounded-full bg-[#75aadb] mr-2 inline-block shadow-[0_0_8px_rgba(117,170,219,0.8)] border border-blue-200"></span>, label: isBn ? 'আজকে যুক্ত হয়েছে' : 'Joined today' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center flex flex-col items-center justify-center">
                  <h3 className={`text-2xl sm:text-3xl font-bold flex items-center justify-center ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>
                    {stat.prefix}{stat.val}{stat.suffix}
                  </h3>
                  <p className={`text-[10px] sm:text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>{stat.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* CURRENT AFFAIRS & RECENT NEWS SECTION */}
      <section className={`py-6 ${isDark ? 'bg-[#030712]' : 'bg-[#fffcf0]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
            
            {/* Left Side: Current Affairs Quiz */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-red-50 shadow-sm'}`}>
              <div className="flex justify-center border-b border-transparent relative">
                <div className={`absolute top-0 w-full h-8 ${isDark ? 'bg-red-900/10' : 'bg-[#faebe8]'}`}></div>
                <div className={`relative px-4 py-1 mt-0.5 rounded-t-lg font-bold text-sm ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-[#f4e6e3] text-[#8b3a33]'}`}>
                  {isBn ? 'কারেন্ট অ্যাফেয়ার্স' : 'Current Affairs'}
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className={`text-base md:text-lg font-bold mb-3 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isBn ? 'বাংলা ভাষায় প্রকাশিত প্রথম সংবাদপত্র কোনটি?' : 'Which was the first newspaper published in the Bengali language?'}
                </h3>
                <div className="space-y-2">
                  {(isBn ? ['দিগদর্শন', 'তত্ত্ববোধিনী', 'সংবাদ প্রভাকর', 'বঙ্গদর্শন'] : ['Digdarshan', 'Tattwabodhini', 'Sambad Prabhakar', 'Bangadarshan']).map((option, idx) => (
                    <div key={idx} className={`p-2 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-colors ${isDark ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center border text-sm font-medium ${isDark ? 'border-slate-600 bg-slate-800 text-slate-300' : 'border-slate-300 bg-white text-slate-600 shadow-sm'}`}>
                        {isBn ? ['ক', 'খ', 'গ', 'ঘ'][idx] : ['A', 'B', 'C', 'D'][idx]}
                      </div>
                      <span className={`text-base font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Recent News */}
            <div className="flex flex-col h-full">
              <h3 className={`text-base md:text-lg font-bold mb-3 pl-2 border-l-4 ${isDark ? 'border-blue-500 text-white' : 'border-blue-600 text-slate-900'}`}>
                {isBn ? 'সাম্প্রতিক নিউজ' : 'Recent News'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow">
                {/* News Card 1 */}
                <div className={`rounded-xl border overflow-hidden flex flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <img src="https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop" alt="News 1" className="w-full h-24 sm:h-32 object-cover" />
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <h4 className={`font-bold text-sm md:text-base mb-1.5 leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isBn ? 'তীব্বতের গুরুত্বপূর্ণ খনিজ আহরণে জো...' : 'Focus on extracting important minerals in Tibet...'}
                    </h4>
                    <p className={`text-[10px] md:text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>New • 5m read</p>
                  </div>
                </div>
                {/* News Card 2 */}
                <div className={`rounded-xl border overflow-hidden flex flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop" alt="News 2" className="w-full h-24 sm:h-32 object-cover" />
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <h4 className={`font-bold text-sm md:text-base mb-1.5 leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isBn ? 'জাতীয় বেতন স্কেলের গেজেট প্রকাশ...' : 'Gazette issued for National Pay...'}
                    </h4>
                    <p className={`text-[10px] md:text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>New • 5m read</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.5. EVERY STAGE SECTION */}
      <section className={`py-16 relative ${isDark ? 'bg-[#070b14]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="space-y-4 pl-2">
            <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-[#44709d]'}`}>
              {isBn ? 'এক প্ল্যাটফর্ম. প্রতিটি পর্যায়.' : 'One platform. Every stage.'}
            </span>
            <h2 className={`text-3xl md:text-4xl font-medium leading-tight max-w-2xl ${isDark ? 'text-white' : 'text-[#1d232a]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
              {isBn ? 'আপনি যেখান থেকেই শুরু করুন না কেন, TakeUUp আপনার সাথেই আছে।' : 'Wherever you\'re starting from, TakeUUp meets you there.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

            {/* Card 1 */}
            <div role="button" tabIndex={0} onClick={() => setSelectedStage('HSC')} className={`relative overflow-hidden group p-8 rounded-xl border flex flex-col justify-between h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#d93838] before:scale-y-0 group-hover:before:scale-y-100 before:transition-transform before:duration-300 before:origin-bottom ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-[#e6f0fa] text-[#44709d]'}`}>
                  <Smartphone size={20} />
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>HSC</h3>
                <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-[#6b7280]'}`}>
                  {isBn ? 'সাজানো প্র্যাকটিস, মক টেস্ট এবং পারফরম্যান্স ইনসাইট দিয়ে আপনার সিলেবাস আয়ত্ত করুন।' : 'Master your syllabus with structured practice, mock tests and performance insights.'}
                </p>
                <p className={`text-xs pt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Physics · Chemistry · Biology · Math</p>
              </div>
              <div className="mt-8 relative pb-2">
                <span className={`text-sm font-bold ${isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-[#44709d] group-hover:text-[#2d4b69]'}`}>
                  {isBn ? 'HSC এক্সপ্লোর করুন' : 'Explore HSC'}
                </span>
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#d93838] transition-all duration-300"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div role="button" tabIndex={0} onClick={() => setSelectedStage('Admission')} className={`relative overflow-hidden group p-8 rounded-xl border flex flex-col justify-between h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#d93838] before:scale-y-0 group-hover:before:scale-y-100 before:transition-transform before:duration-300 before:origin-bottom ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-[#e6f0fa] text-[#44709d]'}`}>
                  <GraduationCap size={20} />
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>Admission</h3>
                <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-[#6b7280]'}`}>
                  {isBn ? 'ফোকাসড, ইউনিট-ভিত্তিক অনুশীলনের সাথে বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য প্রস্তুতি নিন।' : 'Prepare for university admission tests with focused, unit-wise practice.'}
                </p>
                <p className={`text-xs pt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Engineering · Medical · Public Uni</p>
              </div>
              <div className="mt-8 relative pb-2">
                <span className={`text-sm font-bold ${isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-[#44709d] group-hover:text-[#2d4b69]'}`}>
                  {isBn ? 'অ্যাডমিশন এক্সপ্লোর করুন' : 'Explore Admission'}
                </span>
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#d93838] transition-all duration-300"></div>
              </div>
            </div>

            {/* Card 3 */}
            <div role="button" tabIndex={0} onClick={() => setSelectedStage('Job Preparation')} className={`relative overflow-hidden group p-8 rounded-xl border flex flex-col justify-between h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#d93838] before:scale-y-0 group-hover:before:scale-y-100 before:transition-transform before:duration-300 before:origin-bottom ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-[#e6f0fa] text-[#44709d]'}`}>
                  <Briefcase size={20} />
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>Job Preparation</h3>
                <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-[#6b7280]'}`}>
                  {isBn ? 'প্রতিযোগিতামূলক চাকরির পরীক্ষায় উত্তীর্ণ হওয়ার জন্য দক্ষতা এবং আত্মবিশ্বাস তৈরি করুন।' : 'Build the skills and confidence to clear competitive job exams.'}
                </p>
                <p className={`text-xs pt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Bank Jobs · Corporate · Govt Exams</p>
              </div>
              <div className="mt-8 relative pb-2">
                <span className={`text-sm font-bold ${isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-[#44709d] group-hover:text-[#2d4b69]'}`}>
                  {isBn ? 'জব প্রিপারেশন এক্সপ্লোর করুন' : 'Explore Job Prep'}
                </span>
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#d93838] transition-all duration-300"></div>
              </div>
            </div>

            {/* Card 4 */}
            <div role="button" tabIndex={0} onClick={() => setSelectedStage('BCS')} className={`relative overflow-hidden group p-8 rounded-xl border flex flex-col justify-between h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#d93838] before:scale-y-0 group-hover:before:scale-y-100 before:transition-transform before:duration-300 before:origin-bottom ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-[#e6f0fa] text-[#44709d]'}`}>
                  <MapPin size={20} />
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>BCS</h3>
                <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-[#6b7280]'}`}>
                  {isBn ? 'একটি দৈনিক প্ল্যানে বিভক্ত সিলেবাসের মাধ্যমে বিসিএস এর জন্য কৌশলগত প্রস্তুতি নিন।' : 'Prepare strategically for BCS with a syllabus broken into a daily plan.'}
                </p>
                <p className={`text-xs pt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Preliminary · Written · Viva</p>
              </div>
              <div className="mt-8 relative pb-2">
                <span className={`text-sm font-bold ${isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-[#44709d] group-hover:text-[#2d4b69]'}`}>
                  {isBn ? 'BCS এক্সপ্লোর করুন' : 'Explore BCS'}
                </span>
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#d93838] transition-all duration-300"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STUDY ROOM SECTION */}
      <section className={`py-16 ${isDark ? 'bg-[#0f1523]' : 'bg-[#fdfbf2]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left side text */}
            <div className="flex-1 space-y-6">
              <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-[#44709d]'}`}>
                {isBn ? 'স্টাডি' : 'Study'}
              </span>
              <h2 className={`text-3xl md:text-4xl font-medium leading-tight ${isDark ? 'text-white' : 'text-[#1d232a]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                {isBn ? 'আপনার নিজস্ব ব্যক্তিগত স্টাডি রুম' : 'Your own personalized study room'}
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#6b7280]'} max-w-lg`}>
                {isBn
                  ? 'আপনি শুধু কন্টেন্ট পাচ্ছেন না — আপনি এমন একটি ব্যক্তিগত স্পেস পাচ্ছেন যা আপনার প্রস্তুতি গুছিয়ে রাখে: আপনার টাস্ক, স্ট্রিক, গোলস, সবকিছু এক জায়গায়, প্রতিদিন।'
                  : 'You don\'t just get content — you get a personal space that organizes your preparation: your tasks, your streak, your goals, all in one place, every day.'}
              </p>

              <div className="pt-2">
                <Link 
                  to="/routine" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-block px-6 py-3 bg-[#1d232a] text-white font-bold text-sm rounded-full hover:bg-[#d93838] hover:shadow-[0_8px_20px_rgba(217,56,56,0.3)] transition-all duration-300"
                >
                  {isBn ? 'আমার স্টাডি রুমে প্রবেশ করুন' : 'Enter My Study Room'}
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 max-w-md">
                <div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>7</div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
                    {isBn ? 'দিনের স্ট্রিক' : 'Day streak'}
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>64%</div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
                    {isBn ? 'লক্ষ্য অগ্রগতি' : 'Goal progress'}
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>30</div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
                    {isBn ? 'ট্র্যাক করা বিষয়' : 'Subjects tracked'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side card */}
            <div className="flex-1 w-full max-w-lg relative">
              <div className={`rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'} p-8`}>

                <div className="space-y-1 mb-6">
                  <div className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>Good morning 👋</div>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>Today's progress: <span className="text-[#44709d]">72%</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3">
                    <div className="bg-[#75aadb] h-2.5 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`text-[10px] font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-[#6b7280]'}`}>TODAY'S TASKS</div>

                  <div className="space-y-3">
                    {/* Task 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#75aadb] flex items-center justify-center text-white">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>Chapter Revision</span>
                    </div>
                    {/* Task 2 */}
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#75aadb] flex items-center justify-center text-white">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>30 MCQ Practice</span>
                    </div>
                    {/* Task 3 */}
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}></div>
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-[#1d232a]'}`}>Take Mock Test</span>
                    </div>
                    {/* Task 4 */}
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}></div>
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-[#1d232a]'}`}>Review MistakeBank</span>
                    </div>
                  </div>
                </div>

                <div className={`mt-8 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'} flex items-center justify-between`}>
                  <div className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
                    🔥 Study streak
                  </div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>
                    7 days
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CUSTOM STUDY PLAN SECTION */}
      <section className={`py-16 ${isDark ? 'bg-[#070b14]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12">
            <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-[#44709d]'}`}>
              {isBn ? 'কাস্টম স্টাডি প্ল্যান' : 'Custom study plan'}
            </span>
            <h2 className={`text-3xl md:text-4xl font-medium leading-tight mt-2 ${isDark ? 'text-white' : 'text-[#1d232a]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
              {isBn ? 'আপনার লক্ষ্য বলুন। আমরা আপনার প্ল্যান তৈরি করব।' : 'Tell us your goal. We\'ll build your plan.'}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left Form Card */}
            <div className={`flex-1 rounded-2xl p-8 border ${isDark ? 'bg-[#0f1523] border-slate-700' : 'bg-[#fdfbf2] border-[#f4f1db]'}`}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-xs font-bold tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>GOAL</label>
                  <div className="relative">
                    <select 
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className={`w-full appearance-none rounded-xl border p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-[#1d232a]'}`}
                    >
                      <option value="Complete HSC Physics">Complete HSC Physics</option>
                      <option value="Complete Admission Math">Complete Admission Math</option>
                      <option value="Clear BCS Preliminary">Clear BCS Preliminary</option>
                      <option value="Prepare for Bank Job Exam">Prepare for Bank Job Exam</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={16} className={`${isDark ? 'text-slate-400' : 'text-[#1d232a]'}`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>DURATION</label>
                  <div className="flex flex-wrap gap-3">
                    {['7 Days', '15 Days', '30 Days', '60 Days'].map((days) => (
                      <button
                        key={days}
                        onClick={() => setSelectedDuration(days)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${days === selectedDuration ? 'bg-[#1d232a] text-white border-[#1d232a]' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-[#1d232a] hover:bg-slate-50'}`}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleGeneratePlan}
                    className="w-full py-4 rounded-full bg-[#d93838] hover:bg-[#b92a2a] text-white font-bold text-sm shadow-md transition-colors"
                  >
                    {isBn ? 'আমার স্টাডি প্ল্যান তৈরি করুন' : 'Create My Study Plan'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Plan List Card */}
            <div className={`flex-1 lg:flex-[1.2] rounded-2xl p-8 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-8">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>
                  {isBn ? 'আপনার প্ল্যান' : 'Your plan'} - {planTitleDuration}
                </h3>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#e6f0fa] text-[#44709d]">
                  {isBn ? 'অটো-জেনারেটেড' : 'Auto-generated'}
                </span>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {generatedPlan.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#e6f0fa] text-[#44709d] flex items-center justify-center text-xs font-bold shrink-0">
                      {item.id}
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-[#6b7280]'}`}>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK UTILITY TOOLS STRIP */}
      <section className={`py-8 ${isDark ? 'bg-slate-950/60 border-y border-slate-800/80' : 'bg-white border-y border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className={`text-xs font-black uppercase tracking-wider shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              ⚡ {isBn ? 'কুইক ইউটিলিটি টুলস' : 'QUICK UTILITY TOOLS'}:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 w-full">
              {UTILITY_TOOLS.map((tool, i) => (
                <Link
                  to={tool.link}
                  key={i}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all group ${isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl ${tool.bg} ${tool.color} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                    <tool.icon size={18} />
                  </div>
                  <span className={`text-[11px] font-bold text-center leading-tight ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE SECTION */}
      <section className={`py-16 ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="space-y-4">
            <span className={`text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
              Practice
            </span>
            <h2 className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
              Practice. Learn. Fix. Repeat.
            </h2>
          </div>

          {/* Workflow Steps */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            {['Quiz', 'Mistake', 'MistakeBank', 'Analytics', 'AI Feedback', 'Targeted Practice'].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className={`px-5 py-2 rounded-full border transition-colors cursor-pointer ${isDark ? 'border-slate-700 text-white bg-slate-900/50 hover:bg-slate-800' : 'border-slate-300 text-slate-800 bg-white hover:bg-slate-100 shadow-sm'}`}>
                  {step}
                </div>
                <ArrowRight size={14} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
              </React.Fragment>
            ))}
            <div className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors cursor-pointer border border-red-500/50">
              Improvement
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Mega Quiz',
                desc: 'Large-scale competitive quizzes against thousands of students.'
              },
              {
                title: 'Free Mock Tests',
                desc: 'Practice realistic, timed exam experiences.'
              },
              {
                title: 'MistakeBank',
                desc: 'Automatically saves and resurfaces questions you got wrong.'
              },
              {
                title: 'Question Bank',
                desc: 'Practice topic-wise and subject-wise, at your own pace.'
              }
            ].map((card, i) => (
              <div key={i} className={`p-6 rounded-md border transition-all cursor-pointer ${isDark ? 'border-slate-700 bg-[#0f172a] hover:bg-slate-800/80 hover:border-slate-600' : 'border-slate-300 bg-white hover:bg-slate-50 shadow-sm hover:shadow-md'}`}>
                <h3 className={`text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* IMPROVE SECTION */}
      <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="space-y-4">
            <span
              className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#3b82f6]'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Improve
            </span>
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} max-w-2xl leading-[1.1]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Know your score. Understand your performance.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: Stats & Topic Performance */}
            <div className={`p-8 rounded-[1.5rem] border ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>

              <div className="grid grid-cols-4 gap-4 mb-10">
                <div>
                  <div className={`text-[28px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>91%</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Accuracy</div>
                </div>
                <div>
                  <div className={`text-[28px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>84</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg. score</div>
                </div>
                <div>
                  <div className={`text-[28px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>1,240</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Attempted</div>
                </div>
                <div>
                  <div className={`text-[28px] font-bold ${isDark ? 'text-blue-400' : 'text-[#3b82f6]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>#127</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>National rank</div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  TOPIC PERFORMANCE
                </h4>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[13px] font-medium">
                      <span className={isDark ? 'text-slate-300' : 'text-[#111827]'}>Optics</span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>92%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div className="h-full rounded-full bg-[#759ebb] w-[92%]"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[13px] font-medium">
                      <span className={isDark ? 'text-slate-300' : 'text-[#111827]'}>Electricity</span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>78%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div className="h-full rounded-full bg-[#759ebb] w-[78%]"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[13px] font-medium">
                      <span className={isDark ? 'text-slate-300' : 'text-[#111827]'}>Motion & Force</span>
                      <span className="text-[#dc2626]">46%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div className="h-full rounded-full bg-[#dc2626] w-[46%]"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: AI Feedback & CTA */}
            <div className="flex flex-col gap-4">
              <div className={`flex-grow p-8 rounded-[1.25rem] ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-[#1a1f2b] text-white shadow-lg'}`}>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-5">
                  AI FEEDBACK
                </h4>
                <p className="text-[15px] leading-[1.6] text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                  "Your accuracy in Physics has improved this week. You are still struggling with numerical problems. Focus on Motion & Force next."
                </p>
              </div>

              <button className={`w-full py-[1.125rem] rounded-full text-[15px] font-bold transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' : 'bg-[#f8fafc] hover:bg-slate-100 text-[#111827] border border-slate-200 shadow-sm'}`}>
                View My Analytics
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* COMPETE SECTION */}
      <section className={`py-20 ${isDark ? 'bg-slate-955/50' : 'bg-[#fcfaf2]'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span
                className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#3b82f6]'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Compete
              </span>
              <h2
                className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} leading-[1.1]`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                See where you stand.
              </h2>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {['Today', 'Weekly', 'Monthly', 'Exam', 'Subject'].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLeaderboardTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all ${activeLeaderboardTab === tab
                      ? (isDark ? 'bg-white text-slate-900' : 'bg-[#111827] text-white')
                      : (isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-transparent border-slate-200 text-slate-700 hover:bg-white')
                    } border`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className={`rounded-[1.25rem] border overflow-hidden ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white shadow-sm'}`}>

            {/* List Items */}
            <div className="flex flex-col">
              {leaderboardData[activeLeaderboardTab]?.map((user, i) => {
                const colors = [
                  isDark ? 'bg-red-500/20 text-red-400' : 'bg-[#dc2626] text-white',
                  isDark ? 'bg-[#fef3c7]/20 text-[#fef3c7]' : 'bg-[#fef3c7] text-[#92400e]',
                  isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-[#e0f2fe] text-[#0369a1]',
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600',
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                ];
                const color = colors[i] || colors[4];
                return (
                <div key={i} className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold ${color}`}>
                      {user.rank}
                    </div>
                    <span className={`text-[15px] font-medium ${isDark ? 'text-slate-200' : 'text-[#111827]'}`}>
                      {user.name}
                    </span>
                  </div>
                  <div className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                    {user.score}
                  </div>
                </div>
                );
              })}
            </div>

            {/* Current User Footer */}
            <div className={`flex items-center justify-between px-6 py-5 ${isDark ? 'bg-slate-800/50' : 'bg-[#f6f3e6]'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold ${isDark ? 'bg-red-500 text-white' : 'bg-[#dc2626] text-white'}`}>
                  You
                </div>
                <span className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                  Your rank
                </span>
              </div>
              <div className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                #127
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FREE LEARNING ZONE SECTION */}
      <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="space-y-4">
            <span
              className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Free learning zone
            </span>
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} max-w-2xl leading-[1.1]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Learn more. Pay less. Start free.
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Free Classes',
                desc: 'Live and recorded lessons across core subjects.'
              },
              {
                title: 'Free Mock Tests',
                desc: 'Exam-style practice with instant results.'
              },
              {
                title: 'Free Study Materials',
                desc: 'Notes, sheets and guides ready to download.'
              },
              {
                title: 'Free Study Tools',
                desc: 'Timers, trackers and planners, always free.'
              }
            ].map((card, i) => (
              <div key={i} className={`p-6 rounded-md border transition-all cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'}`}>
                <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-[#111827]'}`}>{card.title}</h3>
                <p className={`text-[13px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button className={`text-sm font-bold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-[#477fa8] hover:text-[#3b6f95]'}`}>
              Explore Free Learning
            </button>
          </div>

        </div>
      </section>

      {/* FREE STUDY TOOLS SECTION */}
      <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-[#fefcf2]'} border-b ${isDark ? 'border-slate-800' : 'border-[#fefce8]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="space-y-4">
            <span
              className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Free study tools
            </span>
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} max-w-2xl leading-[1.1]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Powerful study tools.<br />Completely free.
            </h2>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {[
              'Study Timer',
              'Calculator',
              'Dictionary',
              'Unit Converter',
              'Notes',
              'Flashcards',
              'To-Do Tracker',
              'Goal Tracker',
              'PDF Tools',
              'Study Planner'
            ].map((tool, i) => (
              <Link
                to="/all-tools"
                key={i}
                className={`flex items-center justify-center py-4 px-4 rounded-md border transition-all cursor-pointer text-sm font-medium ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-transparent border-[#e5e7eb] hover:bg-white hover:border-[#d1d5db] text-[#374151]'}`}
              >
                {tool}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link to="/all-tools" className={`inline-block text-sm font-bold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-[#477fa8] hover:text-[#3b6f95]'}`}>
              Explore All Tools
            </Link>
          </div>

        </div>
      </section>

      {/* CONNECT MENTOR SECTION */}
      <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="space-y-4">
            <span
              className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Connect
            </span>
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} max-w-2xl leading-[1.1]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Need help? Find the right<br />mentor.
            </h2>
            <p className={`text-[15px] ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
              Search by subject, exam, experience, rating, availability and price.
            </p>
          </div>

          {/* Mentor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeMentors.map((mentor, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1]'}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${mentor.avatarBg} ${mentor.avatarText}`}>
                    {mentor.initials}
                  </div>
                  <div>
                    <h3 className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-[#111827]'}`}>{mentor.name}</h3>
                    <p className={`text-[13px] ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>{mentor.role}</p>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <div className="flex items-center gap-1.5 text-[13px]">
                    <span className="text-[#dc2626]">★</span>
                    <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>{mentor.rating}</span>
                    <span className={`${isDark ? 'text-slate-400' : 'text-[#94a3b8]'}`}>· {mentor.students} students helped</span>
                  </div>
                  <div className={`text-[13px] ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    {mentor.price} / session
                  </div>
                </div>

                <Link to={`/mentors/${mentor.id || 'm1'}`} className={`text-[13px] font-bold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-[#477fa8] hover:text-[#3b6f95]'}`}>
                  View profile
                </Link>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link to="/mentors" className={`inline-block px-6 py-3 rounded-full text-sm font-bold transition-colors ${isDark ? 'bg-white text-slate-900 hover:bg-gray-100' : 'bg-[#111827] text-white hover:bg-gray-800'}`}>
              Find a Mentor
            </Link>
          </div>

        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className={`py-24 ${isDark ? 'bg-slate-950' : 'bg-[#fefcf2]'} border-b ${isDark ? 'border-slate-800' : 'border-[#fefce8]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Column: Text */}
            <div className="space-y-6">
              <span
                className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Community
              </span>
              <h2
                className={`text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} leading-[1.1] whitespace-nowrap`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Study together. Grow together.
              </h2>
              <p className={`text-[15px] leading-relaxed max-w-md ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
                Join subject and exam-based groups — HSC, Admission, BCS, Job Prep — for discussions, peer support and mentor Q&A.
              </p>
              <div className="pt-2">
                <button className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-colors ${isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-[#d1d5db] text-[#111827] hover:bg-white hover:border-[#9ca3af]'}`}>
                  Join the Community
                </button>
              </div>
            </div>

            {/* Right Column: Community Mockup */}
            <div className={`p-6 md:p-8 rounded-2xl shadow-xl border ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/50' : 'bg-white border-[#f1f5f9] shadow-slate-200/50'}`}>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-[#e0f2fe] text-[#0369a1]'}`}>
                  HSC Physics
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-amber-900/50 text-amber-300' : 'bg-[#fae8d4] text-[#854d0e]'}`}>
                  BCS Prelims
                </span>
              </div>

              <div className="space-y-4">
                {/* Card 1 */}
                <div className={`p-5 rounded-xl border ${isDark ? 'border-slate-700' : 'border-[#e2e8f0]'}`}>
                  <div className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Tasnim · Admission group
                  </div>
                  <p className={`text-[15px] font-medium mb-3 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                    Can someone explain the Doppler effect with an example? 🙏
                  </p>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    14 replies · 2 mentors answered
                  </div>
                </div>

                {/* Card 2 */}
                <div className={`p-5 rounded-xl border ${isDark ? 'border-slate-700' : 'border-[#e2e8f0]'}`}>
                  <div className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Study Group · BCS Prelims
                  </div>
                  <p className={`text-[15px] font-medium mb-3 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                    Starting a 30-day BCS sprint together — 42 joined so far.
                  </p>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    42 members · Active now
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CAREER SECTION */}
      <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="space-y-4">
            <span
              className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-red-400' : 'text-[#dc2626]'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Career
            </span>
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} max-w-2xl leading-[1.1]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Prepare today. Build your<br />career tomorrow.
            </h2>

            <div className={`text-[13px] font-medium flex flex-wrap items-center gap-2 ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
              <span>Learn</span>
              <span className="text-[10px]">→</span>
              <span>Practice</span>
              <span className="text-[10px]">→</span>
              <span>Improve</span>
              <span className="text-[10px]">→</span>
              <span>Build your CV</span>
              <span className="text-[10px]">→</span>
              <span className={`${isDark ? 'text-red-400' : 'text-[#dc2626]'}`}>Find opportunities</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1]'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
              </div>
              <h3 className={`font-bold text-[17px] mb-3 ${isDark ? 'text-white' : 'text-[#111827]'}`}>CV Builder</h3>
              <p className={`text-[13px] leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
                Build a professional CV in minutes, from a template that recruiters trust.
              </p>
              <Link to="/jobs/create-cv" className={`inline-block text-[13px] font-bold transition-colors ${isDark ? 'text-red-400 hover:text-red-300' : 'text-[#dc2626] hover:text-[#b91c1c]'}`}>
                Build my CV
              </Link>
            </div>

            {/* Card 2 */}
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1]'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              </div>
              <h3 className={`font-bold text-[17px] mb-3 ${isDark ? 'text-white' : 'text-[#111827]'}`}>Job Portal</h3>
              <p className={`text-[13px] leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
                Discover jobs, internships and career opportunities matched to your prep.
              </p>
              <Link to="/jobs" className={`inline-block text-[13px] font-bold transition-colors ${isDark ? 'text-red-400 hover:text-red-300' : 'text-[#dc2626] hover:text-[#b91c1c]'}`}>
                Browse jobs
              </Link>
            </div>

            {/* Card 3 */}
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1]'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
              </div>
              <h3 className={`font-bold text-[17px] mb-3 ${isDark ? 'text-white' : 'text-[#111827]'}`}>Career Resources</h3>
              <p className={`text-[13px] leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
                Guides, interview tips and preparation materials for your first job.
              </p>
              <Link to="/resources" className={`inline-block text-[13px] font-bold transition-colors ${isDark ? 'text-red-400 hover:text-red-300' : 'text-[#dc2626] hover:text-[#b91c1c]'}`}>
                Read guides
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/jobs" className={`inline-block px-6 py-3 rounded-full text-sm font-bold transition-colors ${isDark ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'}`}>
              Explore Career Hub
            </Link>
          </div>

        </div>
      </section>

      {/* STUDY STORE SECTION */}
      <section className={`py-8 sm:py-10 ${isDark ? 'bg-[#151a24]' : 'bg-[#fcfaf6]'} border-b ${isDark ? 'border-slate-800' : 'border-[#e5e1d8]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-slate-400' : 'text-[#64748b]'} mb-1.5 block`} style={{ fontFamily: "'Inter', sans-serif" }}>
              Study store
            </span>
            <h2 className={`text-[22px] font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
              Everything you need to study &mdash; books, stationery and materials.
            </h2>
          </div>
          <Link to="/products" className={`shrink-0 px-6 py-2.5 rounded-full text-[14px] font-bold border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDark
              ? 'border-slate-600 text-white hover:bg-slate-800 hover:border-slate-400'
              : 'border-[#d1d5db] text-[#111827] hover:bg-gray-50 bg-transparent hover:border-gray-400 shadow-sm'
            }`} style={{ fontFamily: "'Inter', sans-serif" }}>
            Visit Study Store
          </Link>
        </div>
      </section>

      {/* JOURNAL SECTION */}
      <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="space-y-3">
            <span
              className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Stay ahead. Stay informed.
            </span>
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} leading-[1.1]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              From the TakeUUp journal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Column 1 */}
            <div className="space-y-4">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}>
                BLOG
              </span>
              <h3 className={`font-bold text-[17px] leading-snug ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                5 ways to structure a 30-day HSC revision plan
              </h3>
              <p className={`text-[13px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
                Study tips, admission guides and career advice from the TakeUUp team.
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}>
                EXAM UPDATES
              </span>
              <h3 className={`font-bold text-[17px] leading-snug ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                BCS 2027 preliminary schedule: what's changed
              </h3>
              <p className={`text-[13px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
                Important academic and examination updates, tracked for you.
              </p>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}>
                NEWSLETTER
              </span>
              <h3 className={`font-bold text-[17px] leading-snug ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                Get useful updates in your inbox
              </h3>
              <p className={`text-[13px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748b]'}`}>
                A short, useful email &mdash; no spam, unsubscribe anytime.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-3 max-w-md">
            {isSubscribed ? (
              <div className={`flex-1 px-5 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <CheckCircle2 size={18} />
                Successfully Subscribed!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`flex-1 px-5 py-3 rounded-full text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                />
                <button onClick={handleSubscribe} className={`px-6 py-3 rounded-full text-sm font-bold transition-colors ${isDark
                    ? 'bg-white text-slate-900 hover:bg-[#d32f2f] hover:text-white'
                    : 'bg-[#111827] text-white hover:bg-[#d32f2f]'
                  }`}>
                  Subscribe
                </button>
              </>
            )}
          </div>

        </div>
      </section>

      {/* WHY WE'RE DIFFERENT SECTION */}
      <section className={`py-20 ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-[#fcfaf6] border-slate-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="space-y-3">
            <span
              className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-200' : 'text-[#477fa8]'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Why we're different
            </span>
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} leading-[1.1]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Six reasons students choose<br />TakeUUp.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-6">

            {/* Item 1 */}
            <div className={`p-8 border-b ${isDark ? 'border-slate-800 hover:bg-slate-800/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]' : 'border-slate-200 hover:bg-white hover:shadow-2xl'} lg:border-r lg:border-b space-y-3 relative transition-all duration-300 hover:-translate-y-1 hover:z-10 hover:rounded-2xl`}>
              <h3 className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Personalized</h3>
              <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9ca3af]' : 'text-[#64748b]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Your preparation is built around your goal, not a generic syllabus.</p>
            </div>

            {/* Item 2 */}
            <div className={`p-8 border-b ${isDark ? 'border-slate-800 hover:bg-slate-800/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]' : 'border-slate-200 hover:bg-white hover:shadow-2xl'} lg:border-r lg:border-b space-y-3 relative transition-all duration-300 hover:-translate-y-1 hover:z-10 hover:rounded-2xl`}>
              <h3 className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Structured</h3>
              <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9ca3af]' : 'text-[#64748b]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>A large syllabus becomes a series of manageable daily tasks.</p>
            </div>

            {/* Item 3 */}
            <div className={`p-8 border-b ${isDark ? 'border-slate-800 hover:bg-slate-800/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]' : 'border-slate-200 hover:bg-white hover:shadow-2xl'} lg:border-b space-y-3 relative transition-all duration-300 hover:-translate-y-1 hover:z-10 hover:rounded-2xl`}>
              <h3 className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Data driven</h3>
              <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9ca3af]' : 'text-[#64748b]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Understand exactly where you stand, subject by subject.</p>
            </div>

            {/* Item 4 */}
            <div className={`p-8 border-b md:border-b-0 ${isDark ? 'border-slate-800 hover:bg-slate-800/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]' : 'border-slate-200 hover:bg-white hover:shadow-2xl'} lg:border-r space-y-3 relative transition-all duration-300 hover:-translate-y-1 hover:z-10 hover:rounded-2xl`}>
              <h3 className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>AI powered</h3>
              <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9ca3af]' : 'text-[#64748b]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Actionable feedback based on your real performance, not guesses.</p>
            </div>

            {/* Item 5 */}
            <div className={`p-8 border-b md:border-b-0 ${isDark ? 'border-slate-800 hover:bg-slate-800/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]' : 'border-slate-200 hover:bg-white hover:shadow-2xl'} lg:border-r space-y-3 relative transition-all duration-300 hover:-translate-y-1 hover:z-10 hover:rounded-2xl`}>
              <h3 className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Community driven</h3>
              <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9ca3af]' : 'text-[#64748b]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Learn alongside peers and mentors who've been where you are.</p>
            </div>

            {/* Item 6 */}
            <div className={`p-8 space-y-3 relative transition-all duration-300 hover:-translate-y-1 hover:z-10 hover:rounded-2xl ${isDark ? 'hover:bg-slate-800/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]' : 'hover:bg-white hover:shadow-2xl'}`}>
              <h3 className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Study to career</h3>
              <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9ca3af]' : 'text-[#64748b]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>Move from preparation to real career opportunities, on one platform.</p>
            </div>

          </div>

        </div>
      </section>

      {/* THE FULL PICTURE SECTION */}
      <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <style>{`
          @keyframes float-dot {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="space-y-3">
            <span
              className={`text-[13px] font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#477fa8]'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              The full picture
            </span>
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'} leading-[1.1]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              From preparation to<br />possibility.
            </h2>
          </div>

          <div className="relative pt-6 overflow-x-auto pb-4 scrollbar-hide">
            <div className="min-w-[900px] flex items-start relative px-2">
              {/* Steps */}
              {[
                { num: '01', label: 'Discover' },
                { num: '02', label: 'Set Your Goal' },
                { num: '03', label: 'Create Your Plan' },
                { num: '04', label: 'Study' },
                { num: '05', label: 'Practice' },
                { num: '06', label: 'Find Mistakes' },
                { num: '07', label: 'Get AI Feedback' },
                { num: '08', label: 'Improve' }
              ].map((step, i, arr) => (
                <React.Fragment key={i}>
                  <div className="relative flex flex-col items-center z-10 w-28">
                    <div className={`text-[11px] font-bold mb-2 ${isDark ? 'text-slate-500' : 'text-[#8da5b8]'}`}>{step.num}</div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full z-10 ${isDark ? 'bg-blue-400 ring-4 ring-slate-950' : 'bg-[#7ba9cd] ring-4 ring-white'}`}
                      style={{ animation: `float-dot ${2 + (i % 4) * 0.5}s ease-in-out infinite` }}
                    ></div>
                    <div className={`text-[12px] font-bold text-center mt-4 ${isDark ? 'text-slate-300' : 'text-[#111827]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>{step.label}</div>
                  </div>
                  {/* Short dashed line between steps */}
                  {i < arr.length - 1 && (
                    <div className="flex-1 flex items-center justify-center mt-[31px]">
                      <div className={`w-8 h-[2px] rounded-full ${isDark ? 'bg-slate-700' : 'bg-[#c6d7e6]'}`}></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className={`py-32 relative overflow-hidden border-b ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#fcfbf9] border-slate-200'}`}>
        {/* Background Gradients */}
        {!isDark && (
          <>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#f7f2dc] rounded-full mix-blend-multiply filter blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#eef3f6] rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-1/3 w-[800px] h-[800px] bg-[#fdfaf0] rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/3"></div>
          </>
        )}
        {isDark && (
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 translate-y-1/2"></div>
          </>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          <h2
            className={`text-4xl md:text-5xl font-medium tracking-tight text-center ${isDark ? 'text-white' : 'text-[#111827]'} leading-[1.2]`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Your future doesn't need more<br className="hidden md:block" /> random practice.<br className="hidden md:block" /> It needs a plan.
          </h2>

          <p
            className={`mt-6 text-[17px] text-center max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Start with your goal. TakeUUp will help you build the<br className="hidden sm:block" /> journey.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link to="/dashboard" className="px-8 py-3.5 rounded-full bg-[#d32f2f] text-white text-[15px] flex items-center justify-center font-medium hover:bg-[#b71c1c] transition-colors w-full sm:w-auto">
              Start Your Journey
            </Link>
            <Link to="/resources" className={`px-8 py-3.5 rounded-full border text-[15px] flex items-center justify-center font-medium transition-colors w-full sm:w-auto ${isDark
                ? 'border-slate-700 text-white hover:bg-slate-800'
                : 'border-slate-300 text-[#111827] hover:bg-slate-50 bg-white/50'
              }`}>
              Explore Free Resources
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CORE EDUCATIONAL FEATURES GRID */}
      <section id="features" className={`py-20 relative border-t ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className={`text-sm font-bold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#44709d]'}`}>
              {isBn ? 'স্মার্ট পোর্টাল ফিচারসমূহ' : 'SMART PORTAL FEATURES'}
            </span>
            <h2 className={`text-3xl md:text-4xl font-medium tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#1d232a]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
              {isBn ? 'যে ফিচারগুলো তোমাকে সবার থেকে এগিয়ে রাখবে' : 'Features Built to Keep You Ahead of Everyone'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFeature(f)}
                className={`p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all group cursor-pointer ${f.bgClass}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl border group-hover:scale-110 transition-transform ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                      }`}>
                      {f.icon}
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                      {f.badge[language]}
                    </span>
                  </div>

                  <h3 className="text-lg font-black tracking-tight">{f.title[language]}</h3>
                  <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {f.shortDesc[language]}
                  </p>
                </div>

                <div className="text-xs font-black text-cyan-500 dark:text-cyan-400 flex items-center gap-1 pt-2">
                  {isBn ? 'বিস্তারিত দেখুন' : 'View Details'} <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURE DETAIL MODAL POPUP */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300" onClick={() => setSelectedFeature(null)} />

          <div className={`relative w-full max-w-2xl rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X size={22} />
            </button>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                  {selectedFeature.icon}
                </div>
                <h2 className="text-2xl font-black">{selectedFeature.title[language]}</h2>
              </div>

              <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selectedFeature.fullDesc[language]}
              </p>

              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-xs font-black uppercase tracking-wider mb-3 text-cyan-500">
                  {isBn ? 'মূল সুবিধা সমুহ (Key Benefits)' : 'Key Benefits'}
                </h3>
                <ul className="space-y-2.5">
                  {selectedFeature.benefits.map((b: any, index: number) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs font-medium">
                      <CheckCircle2 size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                      <span>{b[language]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setSelectedFeature(null)}
                className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isBn ? 'স্টুডেন্ট পোর্টালে ড্যাশবোর্ডে যান ➔' : 'Go to Student Dashboard ➔'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. PROFESSIONAL BANNER CTA */}
      <section className={`py-12 relative border-t border-b ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-yellow-50 border-yellow-100'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl relative overflow-hidden text-center space-y-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className={`text-3xl sm:text-4xl font-medium tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#1d232a]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                {isBn ? 'আজই শুরু হোক তোমার কাঙ্ক্ষিত বিশ্ববিদ্যালয় ও বিসিএস প্রস্তুতি!' : 'Start Your Dream University & BCS Preparation Today!'}
              </h2>
              <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
                {isBn
                  ? 'কোনো ক্রেডিট কার্ড বা ফি ছাড়াই ৫ সেকেন্ডে ফ্রী অ্যাকাউন্ট খুলে প্রস্তুতি যাচাই করো।'
                  : 'Create a free account in 5 seconds with zero fees to test your knowledge.'}
              </p>

              <div className="pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#d93838] hover:bg-[#b92a2a] text-white font-bold text-sm rounded-full transition-all shadow-md inline-flex items-center justify-center gap-2 hover:scale-105"
                >
                  {isBn ? 'স্টুডент পোর্টালে যান ➔' : 'Go to Student Portal ➔'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* STAGE DETAILS MODAL */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStage(null)}></div>
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
            {/* Modal Header */}
            <div className={`px-6 py-4 flex items-center justify-between border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {selectedStage === 'HSC' && <Smartphone className="text-blue-500" />}
                {selectedStage === 'Admission' && <GraduationCap className="text-emerald-500" />}
                {selectedStage === 'Job Preparation' && <Briefcase className="text-purple-500" />}
                {selectedStage === 'BCS' && <MapPin className="text-rose-500" />}
                {selectedStage} {isBn ? 'বিস্তারিত' : 'Details'}
              </h3>
              <button 
                onClick={() => setSelectedStage(null)}
                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              {selectedStage === 'HSC' && (
                <div className="space-y-4">
                  <p className={`text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {isBn 
                      ? 'এইচএসসি পরীক্ষার জন্য বিজ্ঞান বিভাগের প্রতিটি বিষয়ের (ফিজিক্স, কেমিস্ট্রি, ম্যাথ, বায়োলজি) সম্পূর্ণ প্রস্তুতি। এখানে আপনি পাবেন চ্যাপ্টার-ভিত্তিক নোটস, শর্টকাট টেকনিক, এবং বিগত বছরের প্রশ্নাবলি।'
                      : 'Complete preparation for HSC Science subjects (Physics, Chemistry, Math, Biology). Here you will find chapter-wise notes, shortcut techniques, and previous years question banks.'}
                  </p>
                  <ul className="space-y-3 mt-4">
                    {['20+ years of board questions', 'Chapter-wise mock tests', 'Performance analytics'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedStage === 'Admission' && (
                <div className="space-y-4">
                  <p className={`text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {isBn 
                      ? 'ইঞ্জিনিয়ারিং, মেডিকেল, এবং পাবলিক বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য সেরা গাইডলাইন। আমাদের প্ল্যাটফর্মটি আপনাকে নির্দিষ্ট লক্ষ্য পূরণে সাহায্য করবে।'
                      : 'Top guidelines for Engineering, Medical, and Public University admission tests. Our platform helps you achieve your specific goals with focused materials.'}
                  </p>
                  <ul className="space-y-3 mt-4">
                    {['BUET & Engineering question banks', 'Medical targeted preparation', 'Live classes and doubt solving'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedStage === 'Job Preparation' && (
                <div className="space-y-4">
                  <p className={`text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {isBn 
                      ? 'ব্যাংক জব, কর্পোরেট এবং অন্যান্য সরকারি চাকরির জন্য সম্পূর্ণ প্রস্তুতি। সঠিক গাইডলাইন এবং প্র্যাকটিসের মাধ্যমে নিজের স্বপ্ন পূরণ করুন।'
                      : 'Complete preparation for Bank Jobs, Corporate, and other Govt jobs. Fulfill your dreams through proper guidelines and practice.'}
                  </p>
                  <ul className="space-y-3 mt-4">
                    {['Daily vocabulary & current affairs', 'Math & mental ability tricks', 'Interview tips'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedStage === 'BCS' && (
                <div className="space-y-4">
                  <p className={`text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {isBn 
                      ? 'বিসিএস প্রিলিমিনারি, রিটেন এবং ভাইভা পরীক্ষার জন্য গোছানো সিলেবাস এবং মডেল টেস্ট। আপনার প্রস্তুতিকে এক ধাপ এগিয়ে রাখুন।'
                      : 'Organized syllabus and model tests for BCS Preliminary, Written, and Viva exams. Keep your preparation one step ahead.'}
                  </p>
                  <ul className="space-y-3 mt-4">
                    {['Syllabus broken down into daily plans', 'Weekly assessment tests', 'Previous 10th-45th BCS solutions'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className={`p-6 border-t flex justify-end gap-3 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
              <button 
                onClick={() => setSelectedStage(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
              <Link 
                to="/dashboard"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
              >
                {isBn ? 'ড্যাশবোর্ডে যান' : 'Go to Dashboard'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
