import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, BookOpen, ChevronDown, ChevronLeft, Filter, Eye, EyeOff, FlaskConical, Atom, 
  Calculator, Dna, Globe, Briefcase, GraduationCap, Building2, Stethoscope, Menu, X, FileText, 
  Download, Play, Clock, CheckCircle2, RefreshCcw, AlertCircle, Check, XCircle, Award, Sparkles, 
  ArrowRight, Landmark, Layers, Zap, Heart, Bookmark, Upload, User, Trophy, ShieldCheck
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

// --- INSTITUTION DATA LIST ---
const INSTITUTION_CARDS = [
  {
    id: 'du',
    name: 'ঢাকা বিশ্ববিদ্যালয়',
    engName: 'Dhaka University (DU)',
    category: 'University',
    badge: 'বিজ্ঞান ও ক ইউনিট',
    years: '২০০৪ - ২০২৪ (২০ বছর)',
    questionsCount: 3500,
    gradient: 'from-blue-600/20 to-cyan-600/20',
    borderColor: 'border-blue-500/40 dark:border-blue-500/40',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    icon: GraduationCap
  },
  {
    id: 'buet',
    name: 'বুয়েট (BUET)',
    engName: 'Bangladesh Univ of Engineering & Tech',
    category: 'Engineering',
    badge: 'ইঞ্জিনিয়ারিং',
    years: '২০০৫ - ২০২৪ (১৯ বছর)',
    questionsCount: 2800,
    gradient: 'from-rose-600/20 to-red-600/20',
    borderColor: 'border-rose-500/40 dark:border-rose-500/40',
    textColor: 'text-rose-600 dark:text-rose-400',
    icon: Atom
  },
  {
    id: 'mbbs',
    name: 'মেডিকেল ও ডেন্টাল',
    engName: 'Medical & Dental (MBBS / BDS)',
    category: 'Medical',
    badge: 'মেডিকেল ভর্তি',
    years: '২০১০ - ২০২৪ (১৫ বছর)',
    questionsCount: 3200,
    gradient: 'from-emerald-600/20 to-teal-600/20',
    borderColor: 'border-emerald-500/40 dark:border-emerald-500/40',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    icon: Stethoscope
  },
  {
    id: 'ckruet',
    name: 'গুচ্ছ ইঞ্জিনিয়ারিং',
    engName: 'CKRUET (RUET, KUET, CUET)',
    category: 'Engineering',
    badge: 'কম্বাইন্ড ইঞ্জিঃ',
    years: '২০২০ - ২০২৪ (৫ বছর)',
    questionsCount: 2400,
    gradient: 'from-indigo-600/20 to-purple-600/20',
    borderColor: 'border-indigo-500/40 dark:border-indigo-500/40',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    icon: Building2
  },
  {
    id: 'ju',
    name: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়',
    engName: 'Jahangirnagar University (JU)',
    category: 'University',
    badge: 'A, D & H Unit',
    years: '২০১২ - ২০২৪ (১২ বছর)',
    questionsCount: 1900,
    gradient: 'from-amber-600/20 to-orange-600/20',
    borderColor: 'border-amber-500/40 dark:border-amber-500/40',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: Landmark
  },
  {
    id: 'bcs',
    name: 'বিসিএস প্রিলিমিনারি',
    engName: 'BCS Preliminary Exam',
    category: 'Job',
    badge: '১০ম - ৪৬তম বিসিএস',
    years: '৩৫টি প্রিলিমিনারি সেট',
    questionsCount: 7000,
    gradient: 'from-purple-600/20 to-pink-600/20',
    borderColor: 'border-purple-500/40 dark:border-purple-500/40',
    textColor: 'text-purple-600 dark:text-purple-400',
    icon: Briefcase
  }
];

// --- SUBJECT DATA LIST ---
const SUBJECT_CARDS = [
  {
    id: 'Bangla-1',
    name: 'HSC Bangla 1st Test Paper',
    engName: 'Bangla 1st Paper',
    category: 'Humanities & Gen',
    paper: '১ম পত্র',
    letter: 'অ',
    questionsCount: 1200,
    type: 'bangla',
    gradient: 'from-amber-600/20 to-yellow-600/20',
    borderColor: 'border-amber-500/40 dark:border-amber-500/40',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: BookOpen
  },
  {
    id: 'Bangla-2',
    name: 'HSC Bangla 2nd Test Paper',
    engName: 'Bangla 2nd Paper',
    category: 'Humanities & Gen',
    paper: '২য় পত্র',
    letter: 'আ',
    questionsCount: 1450,
    type: 'bangla',
    gradient: 'from-orange-600/20 to-amber-600/20',
    borderColor: 'border-orange-500/40 dark:border-orange-500/40',
    textColor: 'text-orange-600 dark:text-orange-400',
    icon: BookOpen
  },
  {
    id: 'English-1',
    name: 'HSC English 1st Test Paper',
    engName: 'English 1st Paper',
    category: 'Language',
    paper: '১ম পত্র',
    letter: 'A',
    questionsCount: 1600,
    type: 'english',
    gradient: 'from-rose-600/20 to-pink-600/20',
    borderColor: 'border-rose-500/40 dark:border-rose-500/40',
    textColor: 'text-rose-600 dark:text-rose-400',
    icon: Globe
  },
  {
    id: 'English-2',
    name: 'HSC English 2nd Test Paper',
    engName: 'English 2nd Paper',
    category: 'Language',
    paper: '২য় পত্র',
    letter: 'a',
    questionsCount: 1850,
    type: 'english',
    gradient: 'from-red-600/20 to-rose-600/20',
    borderColor: 'border-red-500/40 dark:border-red-500/40',
    textColor: 'text-red-600 dark:text-red-400',
    icon: Globe
  },
  {
    id: 'ICT',
    name: 'HSC ICT Test Paper',
    engName: 'Information & Comm Tech (ICT)',
    category: 'Science',
    paper: 'আবশ্যিক',
    letter: '💻',
    questionsCount: 1100,
    type: 'default',
    gradient: 'from-indigo-600/20 to-cyan-600/20',
    borderColor: 'border-indigo-500/40 dark:border-indigo-500/40',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    icon: Globe
  },
  {
    id: 'Physics-1',
    name: 'HSC Physics 1st Test Paper',
    engName: 'Physics 1st Paper',
    category: 'Science',
    paper: '১ম পত্র',
    letter: '⚛️',
    questionsCount: 2150,
    type: 'default',
    gradient: 'from-blue-600/20 to-cyan-600/20',
    borderColor: 'border-blue-500/40 dark:border-blue-500/40',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    icon: Atom
  }
];

// --- SUB CATEGORIES FOR DRILL-DOWN ---
const SUB_CATEGORIES_BY_SUBJECT: Record<string, Array<{ id: string; name: string; tag: string; bg: string; iconType: string; description: string }>> = {
  bangla: [
    { id: 'mcq', name: 'MCQ Arena', tag: 'বহুনির্বাচনী প্রশ্ন ড্রিল', bg: 'from-amber-500 via-orange-500 to-amber-600', iconType: 'tablet', description: '১,২০০+ বিষয়ভিত্তিক MCQ' },
    { id: 'cq', name: 'CQ Mastery', tag: 'সৃজনশীল প্রশ্ন ও সমাধান', bg: 'from-rose-500 via-red-600 to-rose-700', iconType: 'paper', description: 'বোর্ড স্ট্যান্ডার্ড সৃজনশীল সেট' },
    { id: 'k_bhandar', name: 'জ্ঞান ভান্ডার', tag: 'ক-প্রশ্ন ও সঠিক উত্তর', bg: 'from-cyan-600 via-blue-600 to-indigo-700', iconType: 'books', description: '১০০% কমন জ্ঞানমূলক প্রশ্ন' },
    { id: 'kh_bhandar', name: 'অনুধাবন হাব', tag: 'খ-প্রশ্ন ব্যাখ্যামূলক উত্তর', bg: 'from-emerald-500 via-teal-600 to-green-700', iconType: 'green_books', description: 'বোর্ড টপিকভিত্তিক ব্যাখ্যা' }
  ],
  english: [
    { id: 'academic', name: 'Grammar & Textual', tag: 'Academic Practice', bg: 'from-amber-500 via-orange-500 to-amber-600', iconType: 'calc_books', description: 'গ্রামার রুলস ও শট ড্রিল' },
    { id: 'passage', name: 'Passage Insights', tag: 'Comprehension Hub', bg: 'from-rose-500 via-red-600 to-rose-700', iconType: 'passage', description: 'সিন ও আনসিন প্যাসেজ সলভ' },
    { id: 'poem', name: 'Poetic Archive', tag: 'Stanza & Summary', bg: 'from-indigo-600 via-purple-600 to-indigo-700', iconType: 'poem', description: 'পয়েট্রি সামারি ও মূলভাব' }
  ],
  default: [
    { id: 'mcq', name: 'MCQ Speed Drill', tag: 'বহুনির্বাচনী ব্যাংক', bg: 'from-amber-500 via-orange-500 to-amber-600', iconType: 'tablet', description: 'টাইমারভিত্তিক MCQ প্র্যাকটিস' },
    { id: 'cq', name: 'CQ Creative Bank', tag: 'সৃজনশীল সমাধান', bg: 'from-rose-500 via-red-600 to-rose-700', iconType: 'paper', description: 'অধ্যায়ভিত্তিক CQ আর্কাইভ' },
    { id: 'k_bhandar', name: 'জ্ঞানমূল ভান্ডার', tag: 'ক-প্রশ্ন সংকলন', bg: 'from-cyan-600 via-blue-600 to-indigo-700', iconType: 'books', description: 'সংজ্ঞা ও তথ্যভিত্তিক ক-প্রশ্ন' },
    { id: 'kh_bhandar', name: 'অনুধাবন ব্যাংক', tag: 'খ-প্রশ্ন সংকলন', bg: 'from-emerald-500 via-teal-600 to-green-700', iconType: 'green_books', description: 'ব্যাখ্যামূলক উত্তরমালা' }
  ]
};

// --- DUMMY BOARD EXAMS LIST ---
const DUMMY_BOARD_EXAMS = [
  { id: 'all-2026', title: 'সকল বোর্ড ২০২৬', time: '৩০ মিনিট', questionsCount: 30, category: 'board', attempts: [{ name: 'প্রচেষ্টা ১', time: '5:30 PM 20 August 2026', score: 10 }] },
  { id: 'all-2026-cq', title: 'সকল বোর্ড ২০২৬ (সৃজনশীল)', time: '২ ঘণ্টা ৩০ মিনিট', questionsCount: 11, category: 'board', attempts: [] },
  { id: 'ctg-mad-2026', title: 'মাদ্রাসা বোর্ড ২০২৬ (চট্টগ্রাম)', time: '৩০ মিনিট', questionsCount: 25, category: 'madrasa', attempts: [] },
  { id: 'ctg-2026', title: 'চট্টগ্রাম বোর্ড ২০২৬', time: '৩০ মিনিট', questionsCount: 25, category: 'board', attempts: [] },
  { id: 'dhaka-2025', title: 'ঢাকা বোর্ড ২০২৫', time: '৩০ মিনিট', questionsCount: 25, category: 'board', attempts: [] },
  { id: 'rajshahi-2025', title: 'রাজশাহী বোর্ড ২০২৫', time: '৩০ মিনিট', questionsCount: 25, category: 'board', attempts: [] }
];

// --- DUMMY LEADERBOARD DATA (Screenshot 1 Match) ---
const EXAM_LEADERBOARD = [
  { rank: 1, name: 'Surovi Rani', college: 'Sundorgonj Mohila Degree College', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'MD. Roni Islam', college: 'Dularhat Model College', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Lamiya Akter Tinni', college: 'Begum Bodrunnessa College', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Ninja Haturi', college: 'Chowmuni SA College', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Samir', college: 'Govt Kodom Rosul College', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' }
];

// --- MOCK CQ QUESTIONS LIST (Screenshot 2 Match) ---
const MOCK_CQ_QUESTIONS = [
  {
    id: 1,
    stem: "উচ্চ শিক্ষিত যুবক শফিক তার পরিবারের সিদ্ধান্তের বাইরে একটি শব্দও বলে না। তার বিয়ের আসরে বরপক্ষ হঠাৎ অতিরিক্ত নগদ টাকার দাবি করে। কনের বাবা আসাদ সাহেব এই ঘটনায় অত্যন্ত ব্যথিত হন। তিনি বুঝতে পারেন, যারা অর্থের লোভে এমন আচরণ করে, তাদের পরিবারে তার মেয়ে নিরাপদ নয়। তিনি লোকভয় তুচ্ছ করে এ বিয়ে ভেঙে দেন। এতকিছুর পরেও শফিক নির্বিকার হয়ে বসে থাকে। কনে রাবেয়া বাবার এই সাহসিকতা সমর্থন করে নিজেকে সমাজসেবা ও ব্রতচারী হিসেবে গড়ে তোলে।",
    marks: 10,
    subQuestions: [
      { letter: "ক", text: "“সুপুরুষ বটে!” — কে?", mark: 1 },
      { letter: "খ", text: "“আমার ভাগ্যে প্রজাপতির সঙ্গে পঞ্চশরের কোনো বিরোধ নাই।” — তাৎপর্য ব্যাখ্যা কর।", mark: 2 },
      { letter: "গ", text: "উদ্দীপকের শফিকের সাথে ‘অপরিচিতা’ গল্পের কোন চরিত্রের সাদৃশ্য রয়েছে? কীভাবে?", mark: 3 },
      { letter: "ঘ", text: "“আসাদ সাহেবের বলিষ্ঠ প্রত্যাখ্যান এবং রাবেয়ার ব্যক্তিত্বের স্ফুরণই পুরুষতান্ত্রিক মানসিকতার বিরুদ্ধে প্রকৃত প্রতিবাদ।” — উদ্দীপক ও ‘অপরিচিতা’ গল্পের আলোকে মন্তব্যের যথার্থ মূল্যায়ন কর।", mark: 4 }
    ]
  },
  {
    id: 2,
    stem: "“খাঁচার পাখি ছিল সোনার খাঁচায় বন্দি চিরকাল\nদানার শক্তি ভুলেছে সে আজ, ভুলিয়াছে নভে নীল\nবাহিরের আলো দেখেনি সে কভু, জানেনা কি তার তেজ\nপিঞ্জরে বসে সাজায় সে আজ মিছে গহনার রেশ।\nমুক্তি যদি না লভে বিহগী আকাশ রহিবে শূন্য\nডানায় ডানা মেলা ছাড়া কি হয় জীবনের গান ধন্য?”",
    marks: 10,
    subQuestions: [
      { letter: "ক", text: "‘নজরুম-উল-এলামা’ এর অর্থ কী?", mark: 1 },
      { letter: "খ", text: "“নারী শিক্ষা আবশ্যক” — পঙ্‌ক্তিটির তাৎপর্য ব্যাখ্যা কর।", mark: 2 },
      { letter: "গ", text: "উদ্দীপকের খাঁচার পাখির মানসিকতার সঙ্গে কোন গল্পের সাদৃশ্য রয়েছে?", mark: 3 },
      { letter: "ঘ", text: "“স্বাধীনতাই জীবনের পরম সত্য” — উদ্দীপক ও রচনার আলোকে বক্তব্যটির মূল্যায়ন কর।", mark: 4 }
    ]
  }
];

// --- MOCK MCQ EXAM QUESTIONS LIST (Screenshot 3 Match) ---
const MOCK_EXAM_MCQS = [
  {
    id: 201,
    question: "‘তাই শিক্ষাক্ষেত্রে তাদের এত মূল্য’ বলতে ‘জীবন ও বৃক্ষ’ প্রবন্ধে কোনটির গুরুত্বকে বোঝানো হয়েছে?",
    marks: 1,
    options: ["মনুষ্যত্বের", "সাহিত্যের", "বিশ্বজিজ্ঞাসার", "চর্মচক্ষুর"],
    answer: "মনুষ্যত্বের"
  },
  {
    id: 202,
    question: "সংলাপ ও গল্প বলার ছন্দে রচিত কোনটি?",
    marks: 1,
    options: ["প্রত্যাবর্তনের লজ্জা", "সুচেতনা", "সোনার তরী", "তাহারেই পড়ে মনে"],
    answer: "তাহারেই পড়ে মনে"
  },
  {
    id: 203,
    stem: "উদ্দীপক পড়ে প্রশ্নের উত্তর দাও :\nরহমত আলী জিনের ভয় দেখিয়ে গ্রামের সহজ-সরল মানুষের কাছ থেকে টাকা হাতিয়ে নেন। গ্রামের স্কুল শিক্ষক এর প্রতিবাদ করলে রহমত আলী তাকে ‘নাস্তিক’ আখ্যা দিয়ে গ্রামছাড়া করার হুমকি দেন।",
    question: "উদ্দীপকের রহমত আলী ‘লালসালু’ উপন্যাসের মজিদের সঙ্গে সাদৃশ্যপূর্ণ, কারণ—",
    marks: 1,
    options: [
      "ধর্মের দোহাই দিয়ে সাধারণ মানুষকে শোষণ করে",
      "সত্যের আশ্রয় নিয়ে নিজের প্রভাব বিস্তার করে",
      "শিক্ষার প্রসারে নিরলসভাবে কাজ করে",
      "নিঃস্বার্থভাবে সাধারণ মানুষের উপকার করে"
    ],
    answer: "ধর্মের দোহাই দিয়ে সাধারণ মানুষকে শোষণ করে"
  }
];

// --- 3D SVG VECTOR ILLUSTRATIONS ---
const SubCategoryCardSvg: React.FC<{ iconType: string }> = ({ iconType }) => {
  if (iconType === 'tablet') {
    return (
      <svg viewBox="0 0 160 160" className="w-28 h-28 drop-shadow-xl transition-transform group-hover:scale-105">
        <ellipse cx="80" cy="140" rx="50" ry="10" fill="rgba(0,0,0,0.18)" />
        <rect x="35" y="25" width="80" height="105" rx="12" fill="#38bdf8" transform="rotate(-6 75 75)" />
        <rect x="40" y="30" width="70" height="95" rx="8" fill="#1e293b" transform="rotate(-6 75 75)" />
        <rect x="46" y="38" width="58" height="78" rx="4" fill="#f8fafc" transform="rotate(-6 75 75)" />
        <rect x="52" y="46" width="30" height="6" rx="2" fill="#3b82f6" transform="rotate(-6 75 75)" />
        <circle cx="92" cy="49" r="6" fill="#fbbf24" transform="rotate(-6 75 75)" />
        <text x="90" y="52" fontSize="9" fontWeight="bold" fill="#78350f" textAnchor="middle" transform="rotate(-6 75 75)">?</text>
        <rect x="52" y="60" width="46" height="4" rx="2" fill="#cbd5e1" transform="rotate(-6 75 75)" />
        <rect x="52" y="70" width="46" height="4" rx="2" fill="#cbd5e1" transform="rotate(-6 75 75)" />
        <rect x="52" y="80" width="46" height="4" rx="2" fill="#cbd5e1" transform="rotate(-6 75 75)" />
        <rect x="52" y="92" width="46" height="6" rx="3" fill="#a855f7" transform="rotate(-6 75 75)" />
      </svg>
    );
  }
  if (iconType === 'paper') {
    return (
      <svg viewBox="0 0 160 160" className="w-28 h-28 drop-shadow-xl transition-transform group-hover:scale-105">
        <ellipse cx="80" cy="140" rx="50" ry="10" fill="rgba(0,0,0,0.18)" />
        <rect x="42" y="25" width="70" height="100" rx="4" fill="#e2e8f0" transform="rotate(-8 77 75)" />
        <rect x="45" y="28" width="70" height="100" rx="4" fill="#ffffff" transform="rotate(3 80 78)" />
        <rect x="68" y="22" width="24" height="14" rx="3" fill="#94a3b8" transform="rotate(3 80 78)" />
        <line x1="58" y1="48" x2="100" y2="48" stroke="#f87171" strokeWidth="3" strokeLinecap="round" transform="rotate(3 80 78)" />
        <line x1="58" y1="58" x2="105" y2="58" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" transform="rotate(3 80 78)" />
        <line x1="58" y1="68" x2="100" y2="68" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" transform="rotate(3 80 78)" />
        <line x1="58" y1="78" x2="105" y2="78" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" transform="rotate(3 80 78)" />
        <line x1="58" y1="88" x2="95" y2="88" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" transform="rotate(3 80 78)" />
        <line x1="58" y1="98" x2="102" y2="98" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" transform="rotate(3 80 78)" />
      </svg>
    );
  }
  if (iconType === 'books') {
    return (
      <svg viewBox="0 0 160 160" className="w-28 h-28 drop-shadow-xl transition-transform group-hover:scale-105">
        <ellipse cx="80" cy="140" rx="55" ry="10" fill="rgba(0,0,0,0.18)" />
        <path d="M 35 110 L 115 110 L 125 125 L 45 125 Z" fill="#d97706" />
        <rect x="35" y="98" width="80" height="15" rx="3" fill="#fbbf24" />
        <rect x="42" y="102" width="70" height="11" rx="2" fill="#fff" />
        <path d="M 40 85 L 115 85 L 123 98 L 48 98 Z" fill="#475569" />
        <rect x="40" y="74" width="75" height="14" rx="3" fill="#64748b" />
        <rect x="47" y="78" width="65" height="10" rx="2" fill="#f8fafc" />
        <path d="M 45 60 L 110 60 L 117 72 L 52 72 Z" fill="#1e293b" />
        <rect x="45" y="50" width="65" height="12" rx="3" fill="#334155" />
        <rect x="50" y="53" width="57" height="9" rx="2" fill="#e2e8f0" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 160" className="w-28 h-28 drop-shadow-xl transition-transform group-hover:scale-105">
      <ellipse cx="80" cy="140" rx="55" ry="10" fill="rgba(0,0,0,0.18)" />
      <rect x="35" y="105" width="85" height="18" rx="4" fill="#ea580c" />
      <rect x="42" y="109" width="75" height="12" rx="2" fill="#fff" />
      <rect x="95" y="115" width="12" height="15" fill="#ef4444" />
      <rect x="42" y="85" width="78" height="16" rx="4" fill="#22c55e" />
      <rect x="48" y="89" width="68" height="10" rx="2" fill="#f8fafc" />
      <rect x="50" y="65" width="68" height="16" rx="4" fill="#f59e0b" />
      <rect x="55" y="68" width="60" height="10" rx="2" fill="#ffffff" />
    </svg>
  );
};

// --- DUMMY SHORT QA REPOSITORY LIST (Screenshot Match) ---
const SHORT_QA_REPOSITORY = [
  {
    id: 1,
    question: "“সুপুরুষ বটে!” — কে?",
    category: "prose",
    boardTag: "All B 26",
    answer: "অনুপমের মামা।",
    explanation: "‘অপরিচিতা’ গল্পে অনুপমের পিতা মারা যাওয়ার পর মামাই পরিবারের সর্বময় অভিভাবক ছিলেন।"
  },
  {
    id: 2,
    question: "‘নজম-উল-ওলামা’ এর অর্থ কী?",
    category: "prose",
    boardTag: "All B 26",
    answer: "আলেমদের নক্ষত্র বা শ্রেষ্ঠ বিজ্ঞ ব্যক্তি।",
    explanation: "জ্ঞানীদের মণি-মাণিক্য বা পরম শ্রদ্ধেয় ব্যক্তি হিসেবে এই পদবি নির্দেশ করা হয়।"
  },
  {
    id: 3,
    question: "‘যৌবনের গান’ প্রবন্ধে শতশত তরুণ মিলে কী ফুটিয়ে তুলেছে?",
    category: "prose",
    boardTag: "All B 26",
    answer: "তারুণ্যের অপরাজিত শক্তি ও নতুন সামাজিক রূপান্তর।",
    explanation: "কাজী নজরুলের 'যৌবনের গান' প্রবন্ধে তরুণ সমাজের অদম্য উদ্দীপনা ফুটিয়ে তোলা হয়েছে।"
  },
  {
    id: 4,
    question: "‘বর্ষাকালেই তো জুৎ!’ — কে বলেছিল?",
    category: "novel",
    boardTag: "All B 26",
    answer: "হাসু।",
    explanation: "উক্ত উক্তিটি বর্ষাকালীন রণকৌশলের উপযুক্ত সময় বোঝাতে করা হয়েছিল।"
  },
  {
    id: 5,
    question: "অনুপমের আসল অভিভাবক কে ছিলেন?",
    category: "prose",
    boardTag: "Dhaka B 25",
    answer: "তার মামা।",
    explanation: "অনুপমের মামা তার চেয়ে বয়সে বেশি বড় না হলেও অভিভাবকত্ব গ্রহণ করেছিলেন।"
  }
];

export const QuestionBank: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 1. ALL REACT HOOK STATES AT TOP (PREVENTS BLANK SCREEN BUG)
  const [activeMainTab, setActiveMainTab] = useState<'subject' | 'institution' | 'all'>('subject');

  const [selectedInstId, setSelectedInstId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedSubjectObj, setSelectedSubjectObj] = useState<any | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any | null>(null);
  const [selectedExamPaper, setSelectedExamPaper] = useState<any | null>(null);

  const [examCategoryFilter, setExamCategoryFilter] = useState<'all' | 'board' | 'college' | 'madrasa'>('all');
  const [examSearchQuery, setExamSearchQuery] = useState('');
  const [examMode, setExamMode] = useState<'practice' | 'topic'>('practice');

  // PERSISTENT TIMED EXAM SESSION STATE
  const [examStarted, setExamStarted] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState<number>(1800);
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, string>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Record<number, boolean>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [viewMode, setViewMode] = useState<'browse' | 'study' | 'test'>('browse');

  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [dbQuestions, setDbQuestions] = useState<any[]>([]);

  // 2. LISTEN FOR SIDEBAR RESET SIGNAL
  useEffect(() => {
    const handleResetSignal = () => {
      setSelectedInstId(null);
      setSelectedSubjectId(null);
      setSelectedSubjectObj(null);
      setSelectedSubCategory(null);
      setSelectedExamPaper(null);
      setExamStarted(false);
      setTestSubmitted(false);
      setViewMode('browse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('takeuup_reset_qbank', handleResetSignal);
    return () => window.removeEventListener('takeuup_reset_qbank', handleResetSignal);
  }, []);

  // 3. HASHROUTER-SAFE SYNC FROM URL QUERY PARAMETERS
  useEffect(() => {
    const hash = window.location.hash || '';
    const qIndex = hash.indexOf('?');
    const queryString = qIndex !== -1 ? hash.slice(qIndex) : location.search;
    const searchParams = new URLSearchParams(queryString);

    const subjId = searchParams.get('subject');
    const subCatId = searchParams.get('sub');
    const paperId = searchParams.get('paper');
    const instId = searchParams.get('inst');

    if (subjId) {
      const foundSubj = SUBJECT_CARDS.find(s => s.id === subjId) || {
        id: subjId,
        name: subjId.replace('-', ' '),
        engName: subjId,
        paper: '১ম পত্র',
        type: 'default'
      };
      setSelectedSubjectId(subjId);
      setSelectedSubjectObj(foundSubj);
    }

    if (subCatId) {
      const allSubCats = [...SUB_CATEGORIES_BY_SUBJECT.bangla, ...SUB_CATEGORIES_BY_SUBJECT.english, ...SUB_CATEGORIES_BY_SUBJECT.default];
      const foundSubCat = allSubCats.find(c => c.id === subCatId) || { 
        id: subCatId, 
        name: subCatId.toUpperCase(),
        tag: 'Practice',
        bg: 'from-amber-500 via-orange-500 to-amber-600',
        iconType: 'tablet',
        description: 'Practice'
      };
      setSelectedSubCategory(foundSubCat);
    }

    if (paperId) {
      const foundExam = DUMMY_BOARD_EXAMS.find(e => e.id === paperId) || {
        id: paperId,
        title: paperId.replace('-', ' ').toUpperCase(),
        time: '৩০ মিনিট',
        questionsCount: 25
      };
      setSelectedExamPaper(foundExam);
    }

    if (instId) {
      setSelectedInstId(instId);
    }
  }, [location.search, location.hash]);

  // 4. RESTORE PERSISTENT EXAM STATE FROM LOCALSTORAGE
  useEffect(() => {
    if (!selectedExamPaper) return;

    const activeExamKey = `takeuup_active_exam_${selectedExamPaper.id}`;
    const savedExam = localStorage.getItem(activeExamKey);

    if (savedExam) {
      try {
        const { startTime, durationSeconds, submitted, savedAnswers, savedFiles } = JSON.parse(savedExam);
        if (!submitted) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const remaining = durationSeconds - elapsed;
          if (remaining > 0) {
            setExamStarted(true);
            setExamTimeLeft(remaining);
            if (savedAnswers) setTestAnswers(savedAnswers);
            if (savedFiles) setUploadedFiles(savedFiles);
          } else {
            setTestSubmitted(true);
            setExamStarted(false);
            setExamTimeLeft(0);
          }
        } else {
          setTestSubmitted(true);
          setExamStarted(false);
        }
      } catch (e) {}
    } else {
      setExamStarted(false);
      setTestSubmitted(false);
    }
  }, [selectedExamPaper]);

  // 5. PERSISTENT COUNTDOWN TIMER INTERVAL
  useEffect(() => {
    let interval: any;
    if (selectedExamPaper && examStarted && !testSubmitted) {
      interval = setInterval(() => {
        const activeExamKey = `takeuup_active_exam_${selectedExamPaper.id}`;
        const savedExam = localStorage.getItem(activeExamKey);
        if (savedExam) {
          try {
            const { startTime, durationSeconds } = JSON.parse(savedExam);
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = Math.max(0, durationSeconds - elapsed);
            setExamTimeLeft(remaining);

            if (remaining <= 0) {
              setTestSubmitted(true);
              setExamStarted(false);
              const updated = JSON.parse(savedExam);
              updated.submitted = true;
              localStorage.setItem(activeExamKey, JSON.stringify(updated));
            }
          } catch (e) {}
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedExamPaper, examStarted, testSubmitted]);

  // 6. FETCH DATABASE QUESTIONS
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions('', '', false);
        if (data && Array.isArray(data)) {
          const mapped = data.map(q => {
            let optionsArray: string[] = [];
            try {
              optionsArray = Array.isArray(q.options) 
                ? q.options 
                : typeof q.options === 'string' 
                ? JSON.parse(q.options) 
                : (q.optionsJson ? (typeof q.optionsJson === 'string' ? JSON.parse(q.optionsJson) : q.optionsJson) : []);
            } catch (e) {
              optionsArray = [];
            }

            let correctText = q.correctAnswer;
            const correctIdx = parseInt(q.correctAnswer);
            if (!isNaN(correctIdx) && correctIdx >= 0 && correctIdx < optionsArray.length) {
              correctText = optionsArray[correctIdx];
            }

            return {
              id: q.id,
              subject: q.subject || "Physics",
              paper: q.paper || "১ম পত্র",
              topic: q.topic || "সাধারণ অধ্যায়",
              question: q.text || "",
              options: optionsArray,
              answer: correctText || "",
              explanation: q.explanation || "বিস্তারিত সমাধান শীঘ্রই যুক্ত হচ্ছে।",
              exam: q.exam || "ভর্তি পরীক্ষা",
              institutionId: q.institutionId || "du",
              difficulty: q.difficulty || "Medium",
              accessLevel: q.accessLevel || "Free"
            };
          });
          setDbQuestions(mapped);
        }
      } catch (err) {
        console.error("Failed to load questions from database:", err);
      }
    };
    loadQuestions();
  }, []);

  const handleStartExamSession = () => {
    if (!selectedExamPaper) return;
    const duration = selectedExamPaper.time.includes('২ ঘণ্টা') ? 9000 : 1800; // 2h 30m or 30m
    const activeExamKey = `takeuup_active_exam_${selectedExamPaper.id}`;
    const examData = {
      examId: selectedExamPaper.id,
      startTime: Date.now(),
      durationSeconds: duration,
      submitted: false,
      savedAnswers: {},
      savedFiles: {}
    };
    localStorage.setItem(activeExamKey, JSON.stringify(examData));
    setExamTimeLeft(duration);
    setTestAnswers({});
    setUploadedFiles({});
    setTestSubmitted(false);
    setExamStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOptionSelect = (qId: number, option: string) => {
    if (!selectedExamPaper || testSubmitted) return;
    const newAnswers = { ...testAnswers, [qId]: option };
    setTestAnswers(newAnswers);

    const activeExamKey = `takeuup_active_exam_${selectedExamPaper.id}`;
    const savedExam = localStorage.getItem(activeExamKey);
    if (savedExam) {
      try {
        const parsed = JSON.parse(savedExam);
        parsed.savedAnswers = newAnswers;
        localStorage.setItem(activeExamKey, JSON.stringify(parsed));
      } catch (e) {}
    }
  };

  const handleSubmitExamSession = () => {
    if (!selectedExamPaper) return;
    setTestSubmitted(true);
    setExamStarted(false);
    const activeExamKey = `takeuup_active_exam_${selectedExamPaper.id}`;
    const savedExam = localStorage.getItem(activeExamKey);
    if (savedExam) {
      try {
        const parsed = JSON.parse(savedExam);
        parsed.submitted = true;
        localStorage.setItem(activeExamKey, JSON.stringify(parsed));
      } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatExamTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectSubject = (subjId: string) => {
    navigate(`/question-bank?subject=${subjId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectInstitution = (instId: string) => {
    navigate(`/question-bank?inst=${instId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSubCategories = (subjObj: any) => {
    if (!subjObj) return SUB_CATEGORIES_BY_SUBJECT.default;
    const nameLower = subjObj.name.toLowerCase();
    if (subjObj.type === 'english' || nameLower.includes('english') || nameLower.includes('ইংরেজি')) {
      return SUB_CATEGORIES_BY_SUBJECT.english;
    }
    if (subjObj.type === 'bangla' || nameLower.includes('bangla') || nameLower.includes('বাংলা')) {
      return SUB_CATEGORIES_BY_SUBJECT.bangla;
    }
    return SUB_CATEGORIES_BY_SUBJECT.default;
  };

  const resetAllDrilldown = () => {
    setSelectedInstId(null);
    setSelectedSubjectId(null);
    setSelectedSubjectObj(null);
    setSelectedSubCategory(null);
    setSelectedExamPaper(null);
    setExamStarted(false);
    setTestSubmitted(false);
    setViewMode('browse');
    navigate('/question-bank');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCQMode = selectedSubCategory?.id === 'cq' || selectedExamPaper?.title.includes('সৃজনশীল');

  return (
    <div className={isEmbedded ? "max-w-7xl mx-auto py-2 text-slate-900 dark:text-slate-100" : "max-w-7xl mx-auto px-4 py-6 min-h-screen pb-24 text-slate-900 dark:text-slate-100"}>
      
      {/* 1. TOP BRAND HEADER (HIDE IN ACTIVE TIMED EXAM MODE FOR FULL FOCUS) */}
      {!examStarted && (
        <div className={`relative rounded-3xl p-6 lg:p-8 shadow-2xl mb-8 overflow-hidden border ${
          isDark 
            ? 'bg-gradient-to-r from-slate-900 via-blue-955 to-indigo-955 border-cyan-500/30 text-white shadow-2xl' 
            : 'bg-gradient-to-r from-cyan-500/10 via-blue-50 to-indigo-50 border-cyan-200 text-slate-900 shadow-xl'
        }`}>
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                <Sparkles size={14} className="text-cyan-500" />
                <span>TakeUUp Verified Question Bank</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {selectedExamPaper ? selectedExamPaper.title : selectedSubjectObj ? selectedSubjectObj.name : 'TakeUUp প্রশ্নব্যাংক আর্কাইভ'}
              </h1>

              <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                বিগত বছরের সকল বিশ্ববিদ্যালয়ের ভর্তি পরীক্ষা, মেডিকেল, ইঞ্জিনিয়ারিং, বিসিএস ও বোর্ডের নির্ভুল উত্তরমালা ও লাইভ টাইমার পরীক্ষা।
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
              <input
                type="text"
                placeholder="প্রশ্ন, বিষয় বা বিশ্ববিদ্যালয় খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border rounded-2xl py-3 pl-11 pr-4 text-xs font-bold placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-sm ${
                  isDark ? 'bg-slate-950/90 border-cyan-500/40 text-white' : 'bg-white border-cyan-300 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN BROWSE GRID */}
      {!selectedInstId && !selectedSubjectObj && !selectedExamPaper && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="text-cyan-500" size={20} />
                  বিষয় ভিত্তিক প্রশ্নব্যাংক (Subject Wise)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">সকল বিষয়ের অধ্যায় ও পত্র ভিত্তিক সেরা প্রশ্ন আর্কাইভ</p>
              </div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                {SUBJECT_CARDS.length}টি বিষয়
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUBJECT_CARDS.map(subj => (
                <div
                  key={subj.id}
                  onClick={() => handleSelectSubject(subj.id)}
                  className={`${
                    isDark ? 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-md'
                  } border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden flex flex-col justify-between h-44`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black">{subj.letter}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      isDark 
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' 
                        : 'bg-cyan-50 text-cyan-800 border-cyan-200 shadow-sm'
                    }`}>
                      {subj.paper}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                      {subj.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{subj.engName}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-500 font-semibold">{subj.questionsCount.toLocaleString()}+ প্রশ্ন</span>
                    <span className="text-cyan-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      খুলুন <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. STEP 1 DRILLDOWN: SUB-CATEGORY OPTION CARDS */}
      {selectedSubjectObj && !selectedSubCategory && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <button 
              onClick={resetAllDrilldown}
              className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white hover:text-cyan-600 transition-colors"
            >
              <ChevronLeft size={24} />
              <span>{selectedSubjectObj.name}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {getSubCategories(selectedSubjectObj).map((subCat: any) => (
              <div
                key={subCat.id}
                onClick={() => {
                  const subjId = selectedSubjectObj?.id || 'all';
                  navigate(`/question-bank?subject=${subjId}&sub=${subCat.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`bg-gradient-to-br ${subCat.bg} rounded-3xl p-6 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group flex flex-col justify-between items-center text-center h-72 border border-white/30 relative overflow-hidden`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/90 bg-black/25 px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                    <Sparkles size={10} className="text-amber-300" /> TakeUUp Hub
                  </span>
                  <span className="text-[10px] font-extrabold text-white/80">{subCat.tag}</span>
                </div>

                <div className="my-auto py-2">
                  <SubCategoryCardSvg iconType={subCat.iconType} />
                </div>

                <div className="w-full space-y-1 text-center">
                  <h3 className="text-xl font-black text-white tracking-tight">{subCat.name}</h3>
                  <span className="text-[11px] font-bold text-white/90 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm inline-block">
                    {subCat.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {/* 4.5. SHORT QUESTION & ANSWER REPOSITORY (SCREENSHOT MATCH - NO TIMER, PREMIUM UNLOCK BANNER) */}
      {selectedSubjectObj && selectedSubCategory && (selectedSubCategory.id === 'k_bhandar' || selectedSubCategory.id === 'kh_bhandar' || selectedSubCategory.id === 'academic' || selectedSubCategory.id === 'passage' || selectedSubCategory.id === 'poem') && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedSubCategory(null)}
              className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white hover:text-cyan-600 transition-colors"
            >
              <ChevronLeft size={24} />
              <span>{selectedSubCategory.name} ({selectedSubjectObj.name})</span>
            </button>

            {/* Pro Status Toggle for Demo */}
            <button
              onClick={() => setTestSubmitted(prev => !prev)}
              className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold"
            >
              {testSubmitted ? "👑 প্রো মোড অন" : "🔒 ফ্রি মেম্বার মোড (আপগ্রেড ব্যানার)"}
            </button>
          </div>

          {/* Category Filter Pills (গদ্য, পদ্য, উপন্যাস ও নাটক) */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>গদ্য</span>
              <span className="text-[10px] bg-slate-300 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">536</span>
            </button>

            <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5">
              <span>পদ্য</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">413</span>
            </button>

            <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5">
              <span>উপন্যাস ও নাটক</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">536</span>
            </button>
          </div>

          {/* Short Q&A Cards List (Exact Screenshot Match) */}
          <div className="space-y-4">
            {SHORT_QA_REPOSITORY.map((item, idx) => (
              <div
                key={item.id}
                className={`${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } border rounded-2xl p-6 space-y-4 shadow-sm`}
              >
                {/* Top Question Row */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                    {idx + 1}. {item.question}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-[11px]">
                      {item.boardTag}
                    </span>
                    <button className="text-slate-400 hover:text-rose-500"><AlertCircle size={15} /></button>
                    <button className="text-slate-400 hover:text-amber-500"><Bookmark size={15} /></button>
                  </div>
                </div>

                {/* Solution Section (Free Mode = Pro Upgrade Banner, Pro Mode = Answer) */}
                {!testSubmitted ? (
                  <div 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>আনলিমিটেড ব্যাখ্যা পেতে প্রিমিয়াম এ আপগ্রেড করো</span>
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                    isDark ? 'bg-emerald-955/60 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <p className="font-black text-emerald-700 dark:text-emerald-300">উত্তর: {item.answer}</p>
                    <p className="font-medium text-slate-600 dark:text-slate-300">{item.explanation}</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

{/* 4. STEP 2 DRILLDOWN: BOARD EXAM LIST */}
      {selectedSubjectObj && selectedSubCategory && !selectedExamPaper && selectedSubCategory.id !== 'k_bhandar' && selectedSubCategory.id !== 'kh_bhandar' && selectedSubCategory.id !== 'academic' && selectedSubCategory.id !== 'passage' && selectedSubCategory.id !== 'poem' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button 
              onClick={() => setSelectedSubCategory(null)}
              className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white hover:text-cyan-600 transition-colors"
            >
              <ChevronLeft size={24} />
              <span>{selectedSubjectObj.name} ({selectedSubCategory.name})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DUMMY_BOARD_EXAMS.map((exam) => (
              <div
                key={exam.id}
                onClick={() => {
                  const subjId = selectedSubjectObj?.id || 'all';
                  const subId = selectedSubCategory?.id || 'all';
                  navigate(`/question-bank?subject=${subjId}&sub=${subId}&paper=${exam.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`${
                  isDark ? 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-sm'
                } border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg space-y-3 group`}
              >
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                  {exam.title}
                </h4>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Clock size={13} /> {exam.time}</span>
                  <span className="flex items-center gap-1"><FileText size={13} /> {exam.questionsCount} টি প্রশ্ন</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SCREEN 1 MATCH: EXAM INDEX / PRE-START DASHBOARD (SCREENSHOT 1 MATCH) */}
      {selectedExamPaper && !examStarted && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedExamPaper(null)}
            className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white hover:text-emerald-700 transition-colors"
          >
            <ChevronLeft size={24} />
            <span>{selectedExamPaper.title}</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Card: Start Test & Attempt History */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Start Test Box */}
              <div className={`${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              } border rounded-3xl p-6 space-y-5`}>
                
                <div className="flex items-center gap-4 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 p-4 rounded-2xl w-fit">
                  <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <Clock size={18} /> {selectedExamPaper.time}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <FileText size={18} /> {selectedExamPaper.questionsCount} প্রশ্ন
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleStartExamSession}
                    className="w-full py-4 bg-[#047857] hover:bg-[#065f46] text-white font-black text-sm rounded-2xl shadow-lg transition-all transform hover:scale-[1.01]"
                  >
                    {testSubmitted ? "পুনরায় পরীক্ষা দাও" : "পরীক্ষা শুরু করো"}
                  </button>

                  <button
                    onClick={() => {
                      setExamStarted(false);
                      setTestSubmitted(true);
                    }}
                    className="w-full py-3.5 bg-transparent border-2 border-[#047857] text-[#047857] dark:text-emerald-400 font-bold text-xs rounded-2xl hover:bg-emerald-500/10 transition-all"
                  >
                    প্রশ্ন দেখো
                  </button>
                </div>
              </div>

              {/* Previous Attempts */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">পূর্বের প্রচেষ্টাসমূহ</h3>
                <div className={`${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } border rounded-2xl p-4 flex items-center justify-between`}>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">প্রচেষ্টা ১</h4>
                    <p className="text-[10px] text-slate-400 font-medium">5:30 PM 20 August 2026</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-[#047857] dark:text-emerald-400 text-xs font-black flex items-center justify-center border border-emerald-500/30">
                    10
                  </span>
                </div>
              </div>

            </div>

            {/* Right Card: Leaderboard Widget (Screenshot 1 Match) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">লিডারবোর্ড</h3>
                <button className="w-9 h-9 rounded-full bg-[#047857] text-white flex items-center justify-center hover:bg-[#065f46] transition-colors shadow-md">
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {EXAM_LEADERBOARD.map((user) => (
                  <div
                    key={user.rank}
                    className={`${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    } border rounded-2xl p-3 flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{user.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{user.college}</p>
                      </div>
                    </div>
                    <span className="font-black text-xs text-slate-600 dark:text-slate-300">
                      #{user.rank}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. SCREEN 2 & 3 MATCH: ACTIVE EXAM INTERFACE (MCQ / CQ WITH PERSISTENT BOTTOM BAR) */}
      {selectedExamPaper && (examStarted || testSubmitted) && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
          
          {/* Exam Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedExamPaper.title}</h2>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">সময়ঃ {selectedExamPaper.time}</p>
          </div>

          {/* QUESTION LIST: CQ MODE (SCREENSHOT 2 MATCH) */}
          {isCQMode ? (
            <div className="space-y-6">
              {MOCK_CQ_QUESTIONS.map((cq, cqIdx) => (
                <div
                  key={cq.id}
                  className={`${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } border rounded-3xl p-6 space-y-5 shadow-sm`}
                >
                  <div className="space-y-3">
                    <p className="text-xs lg:text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {cqIdx + 1}. {cq.stem}
                    </p>
                    
                    <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800">{cq.marks}</span>
                      <button className="p-1 text-slate-400 hover:text-amber-500"><Bookmark size={16} /></button>
                    </div>
                  </div>

                  {/* Sub Questions (ক, খ, গ, ঘ) */}
                  <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                    {cq.subQuestions.map((sq, sqIdx) => (
                      <div key={sqIdx} className="text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1">
                        <p>{sq.letter}. {sq.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* File Upload Box */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-[#047857] dark:text-emerald-400 border border-emerald-300 rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-colors">
                      <Upload size={14} />
                      <span>Choose Files</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedFiles(prev => ({ ...prev, [cq.id]: e.target.files![0].name }));
                          }
                        }} 
                      />
                    </label>
                    <span className="text-xs text-slate-400 ml-3">
                      {uploadedFiles[cq.id] ? uploadedFiles[cq.id] : "No file chosen"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* QUESTION LIST: MCQ MODE (SCREENSHOT 3 MATCH) */
            <div className="space-y-6">
              {MOCK_EXAM_MCQS.map((mcq, mcqIdx) => (
                <div
                  key={mcq.id}
                  className={`${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } border rounded-3xl p-6 space-y-4 shadow-sm`}
                >
                  {mcq.stem && (
                    <p className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100">
                      {mcq.stem}
                    </p>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                      {mcqIdx + 1}. {mcq.question}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">{mcq.marks}</span>
                      <button className="hover:text-amber-500"><Bookmark size={15} /></button>
                    </div>
                  </div>

                  {/* Options 2x2 Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {mcq.options.map((opt, optIdx) => {
                      const letter = optIdx === 0 ? 'ক' : optIdx === 1 ? 'খ' : optIdx === 2 ? 'গ' : 'ঘ';
                      const isSelected = testAnswers[mcq.id] === opt;
                      const isCorrect = opt === mcq.answer;

                      let btnBg = isDark ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-500';

                      if (testSubmitted) {
                        if (isCorrect) btnBg = 'bg-emerald-500/20 border-emerald-500 text-emerald-600 font-bold';
                        else if (isSelected) btnBg = 'bg-rose-500/20 border-rose-500 text-rose-600 font-bold';
                      } else if (isSelected) {
                        btnBg = 'bg-[#047857]/15 border-[#047857] text-[#047857] dark:text-emerald-400 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={testSubmitted}
                          onClick={() => handleOptionSelect(mcq.id, opt)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center gap-3 ${btnBg}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[11px] font-bold shrink-0">
                            {letter}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STICKY BOTTOM BAR FOR LIVE COUNTDOWN & SUBMIT (EXACT MATCH FOR SCREENSHOT 2 & 3) */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#047857] text-white py-3.5 px-6 shadow-2xl flex items-center justify-between border-t border-emerald-600/30">
            <div className="font-mono text-base font-black tracking-wider text-emerald-100 flex items-center gap-2">
              <Clock size={18} className="animate-pulse text-amber-300" />
              <span>{formatExamTimer(examTimeLeft)}</span>
            </div>

            {!testSubmitted ? (
              <button
                onClick={handleSubmitExamSession}
                className="px-8 py-2.5 bg-white hover:bg-slate-100 text-[#047857] font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all transform hover:scale-105"
              >
                সাবমিট
              </button>
            ) : (
              <span className="text-xs font-black text-amber-300 bg-black/20 px-4 py-1.5 rounded-xl border border-white/20">
                পরীক্ষা জমা হয়েছে
              </span>
            )}

            <div className="text-xs font-bold text-emerald-100">
              {Object.keys(testAnswers).length + Object.keys(uploadedFiles).length} / {isCQMode ? MOCK_CQ_QUESTIONS.length : MOCK_EXAM_MCQS.length}
            </div>
          </div>

        </div>
      )}

    
      {/* PREMIUM UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative space-y-5 ${
            isDark ? 'bg-slate-900 border-amber-500/30 text-white' : 'bg-white border-amber-400 text-slate-900'
          }`}>
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/40 shrink-0">
                <Trophy size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">TakeUUp Premium</span>
                <h3 className="text-lg font-black tracking-tight">প্রিমিয়াম মেম্বারশিপে আপগ্রেড করুন!</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              ক ও খ ভান্ডারের সকল প্রশ্ন, সঠিক উত্তর ও আনলিমিটেড ব্যাখ্যা সম্পূর্ণ আনলক করতে টেকইউআপ প্রিমিয়ামে যোগ দিন।
            </p>

            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
                <span>সকল বিষয়ের ক ও খ ভান্ডারের ১০০% ব্যাখ্যা</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
                <span>বিগত ২০ বছরের বিশ্ববিদ্যালয় ও বোর্ড প্রশ্নব্যাংক</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
                <span>প্রতি শুক্রবারের মেগা কুইজে ফ্রি এন্ট্রি</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
                <span>স্মার্ট লেসন ও এআই সলিউশন এক্সেস</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  window.location.href = '#/pricing';
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105"
              >
                এখনই প্রিমিয়াম পান (৳৩৪৯ / ২ মাস) ➔
              </button>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                পরে করবো
              </button>
            </div>
          </div>
        </div>
      )}

</div>
  );
};
