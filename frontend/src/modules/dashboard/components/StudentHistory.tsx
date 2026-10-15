import React, { useState, useEffect } from 'react';
import { 
  Bookmark, BrainCircuit, BarChart2, CheckCircle2, XCircle, RotateCcw, HelpCircle, 
  Sparkles, Filter, FileText, Calendar, Clock, Trophy, ArrowRight, Eye, Check, Trash2, Box, Target, X
} from 'lucide-react';
import { StudentMistakeItem } from '../../../types/types';
import { useTheme } from '../../../context/ThemeContext';
import { BASE_URL, getHeaders } from '../../../services/api';

export interface StudentHistoryProps {
  mistakes?: StudentMistakeItem[];
  onResolveMistake?: (id: string) => void;
  onAddMistake?: (mistake: StudentMistakeItem) => void;
  user?: any;
  subjects?: string[];
  goal?: string;
}

export interface BookmarkedQuestion {
  id: string;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  savedDate: string;
}

export interface ExamQuestionDetail {
  id?: string | number;
  questionText: string;
  options: string[];
  userAnswer?: string | null;
  userAnswerIndex?: number | null;
  correctAnswer: string;
  correctAnswerIndex?: number;
  isCorrect: boolean;
  explanation?: string;
}

export interface CompletedExamRecord {
  id: string;
  examTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  timeSpentMinutes: number;
  dateCompleted: string;
  details?: ExamQuestionDetail[];
}

// --- STANDARD GOAL SUBJECTS PRESETS ---
const BCS_SUBJECTS = [
  'সকল বিষয়',
  'বাংলা ভাষা ও সাহিত্য',
  'ইংরেজি ভাষা ও সাহিত্য',
  'বাংলাদেশ বিষয়াবলি',
  'আন্তর্জাতিক বিষয়াবলি',
  'ভূগোল ও পরিবেশ',
  'সাধারণ বিজ্ঞান',
  'কম্পিউটার ও তথ্যপ্রযুক্তি',
  'গাণিতিক যুক্তি',
  'মানসিক দক্ষতা',
  'নৈতিকতা ও সুশাসন'
];

const HSC_SUBJECTS = [
  'সকল বিষয়',
  'পদার্থবিজ্ঞান',
  'রসায়ন',
  'উচ্চতর গণিত',
  'জীববিজ্ঞান',
  'বাংলা',
  'English',
  'তথ্য ও যোগাযোগ প্রযুক্তি',
  'কৃষিশিক্ষা',
  'পরিসংখ্যান',
  'মনোবিজ্ঞান'
];

const ADMISSION_SUBJECTS = [
  'সকল বিষয়',
  'পদার্থবিজ্ঞান',
  'রসায়ন',
  'উচ্চতর গণিত',
  'জীববিজ্ঞান',
  'সাধারণ জ্ঞান',
  'English',
  'বাংলা',
  'IBA'
];

const JOB_SUBJECTS = [
  'সকল বিষয়',
  'বাংলা',
  'English',
  'সাধারণ জ্ঞান',
  'গাণিতিক যুক্তি',
  'মানসিক দক্ষতা',
  'কম্পিউটার ও আইসিটি',
  'বাংলাদেশ বিষয়াবলি',
  'আন্তর্জাতিক বিষয়াবলি'
];

const DEFAULT_SUBJECTS = [
  'সকল বিষয়',
  'বাংলা',
  'English',
  'সাধারণ জ্ঞান',
  'তথ্য ও যোগাযোগ প্রযুক্তি',
  'গণিত',
  'বিজ্ঞান'
];

// --- SAMPLE DATA FOR BCS ---
const BCS_SAMPLE_BOOKMARKS: BookmarkedQuestion[] = [
  {
    id: 'bm-bcs-1',
    subject: 'বাংলাদেশ বিষয়াবলি',
    questionText: 'ঐতিহাসিক ৬ দফা দাবি কত সালে কোথায় আনুষ্ঠানিকভাবে উত্থাপন করা হয়?',
    options: ['১৯৬৬ সালের ২৩ মার্চ, লাহোরে', '১৯৬৬ সালের ৫ ফেব্রুয়ারি, করাচিতে', '১৯৬৯ সালের ২১ ফেব্রুয়ারি, ঢাকায়', '১৯৭০ সালের ৭ ডিসেম্বর, লাহোরে'],
    correctAnswerIndex: 0,
    explanation: '১৯৬৬ সালের ২৩ মার্চ লাহোরে অনুষ্ঠিত বিরোধী দলীয় সম্মেলনে জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমান আনুষ্ঠানিকভাবে ঐতিহাসিক ৬ দফা পেশ করেন। এর আগে ৫-৬ ফেব্রুয়ারি লাহোর সম্মেলনের বিষয় নির্ধারণী কমিটিতে এটি প্রথম উত্থাপিত হয়েছিল।',
    savedDate: '১ দিন আগে'
  },
  {
    id: 'bm-bcs-2',
    subject: 'বাংলা ভাষা ও সাহিত্য',
    questionText: 'চর্যাপদের সবচেয়ে বেশি পদ কে রচনা করেছেন?',
    options: ['লুইপা', 'কাহ্নপা', 'ভুসুকুপা', 'শবরপা'],
    correctAnswerIndex: 1,
    explanation: 'চর্যাপদের মোট ৫০টি পদের মধ্যে কাহ্নপা সর্বোচ্চ ১৩টি পদ রচনা করেছেন। দ্বিতীয় সর্বোচ্চ ৮টি পদ রচনা করেছেন ভুসুকুপা। লুইপা রচনা করেছেন ২টি পদ।',
    savedDate: '২ দিন আগে'
  },
  {
    id: 'bm-bcs-3',
    subject: 'আন্তর্জাতিক বিষয়াবলি',
    questionText: 'জাতিসংঘের বর্তমান মহাসচিব আন্তোনিও গুতেরেস কোন দেশের নাগরিক?',
    options: ['পর্তুগাল', 'ব্রাজিল', 'স্পেন', 'ইতালি'],
    correctAnswerIndex: 0,
    explanation: 'আন্তোনিও গুতেরেস পর্তুগালের সাবেক প্রধানমন্ত্রী এবং ২০১৭ সালের ১ জানুয়ারি তিনি জাতিসংঘের ৯ম মহাসচিব হিসেবে দায়িত্ব গ্রহণ করেন।',
    savedDate: '৩ দিন আগে'
  },
  {
    id: 'bm-bcs-4',
    subject: 'মানসিক দক্ষতা',
    questionText: 'যদি FRIEND কে কোড করা হয় HUMJTK হিসেবে, তবে CANDLE এর কোড কী হবে?',
    options: ['EDRIRL', 'DCQHQK', 'ESJFME', 'DEQJQM'],
    correctAnswerIndex: 0,
    explanation: 'এখানে প্রতিটি বর্ণ যথাক্রমে +2, +3, +4, +5, +6, +7 নিয়মে পরিবর্তিত হয়েছে। C(+2)=E, A(+3)=D, N(+4)=R, D(+5)=I, L(+6)=R, E(+7)=L => EDRIRL।',
    savedDate: '৪ দিন আগে'
  },
  {
    id: 'bm-bcs-5',
    subject: 'কম্পিউটার ও তথ্যপ্রযুক্তি',
    questionText: 'কম্পিউটারের প্রধান মেমরি (Primary Memory) কোনটি?',
    options: ['RAM ও ROM', 'হার্ডডিস্ক ও এসএসডি', 'পেনড্রাইভ', 'সিডি রম'],
    correctAnswerIndex: 0,
    explanation: 'RAM এবং ROM হলো কম্পিউটারের প্রধান বা প্রাইমারি মেমরি যা সিপিইউ সরাসরি অ্যাক্সেস করতে পারে।',
    savedDate: '৫ দিন আগে'
  }
];

const BCS_SAMPLE_EXAMS: CompletedExamRecord[] = [
  {
    id: 'ex-bcs-1',
    examTitle: '৪৬তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট - ০১',
    subject: 'বাংলাদেশ বিষয়াবলি',
    score: 84,
    totalQuestions: 100,
    accuracyPercentage: 84,
    timeSpentMinutes: 52,
    dateCompleted: '২০২৪-০৯-২৮',
    details: [
      {
        id: 1,
        questionText: 'বাংলাদেশের সংবিধান কত তারিখে গণপরিষদে গৃহীত হয়?',
        options: ['৪ নভেম্বর ১৯৭২', '১৬ ডিসেম্বর ১৯৭২', '১২ অক্টোবর ১৯৭২', '২৬ মার্চ ১৯৭২'],
        userAnswer: '৪ নভেম্বর ১৯৭২',
        userAnswerIndex: 0,
        correctAnswer: '৪ নভেম্বর ১৯৭২',
        correctAnswerIndex: 0,
        isCorrect: true,
        explanation: '৪ নভেম্বর ১৯৭২ সালে সংবিধান গণপরিষদে গৃহীত হয় এবং ১৬ ডিসেম্বর ১৯৭২ থেকে তা কার্যকর হয়।'
      },
      {
        id: 2,
        questionText: 'বাংলাদেশের প্রথম অস্থায়ী প্রেসিডেন্ট কে ছিলেন?',
        options: ['সৈয়দ নজরুল ইসলাম', 'বঙ্গবন্ধু শেখ মুজিবুর রহমান', 'তাজউদ্দীন আহমদ', 'এ এইচ এম কামারুজ্জামান'],
        userAnswer: 'সৈয়দ নজরুল ইসলাম',
        userAnswerIndex: 0,
        correctAnswer: 'সৈয়দ নজরুল ইসলাম',
        correctAnswerIndex: 0,
        isCorrect: true,
        explanation: 'মুজিবনগর সরকারের উপ-রাষ্ট্রপতি ও অস্থায়ী রাষ্ট্রপতি ছিলেন সৈয়দ নজরুল ইসলাম।'
      }
    ]
  },
  {
    id: 'ex-bcs-2',
    examTitle: 'বিসিএস প্রিলি বাংলা ভাষা ও সাহিত্য স্পেশাল টেস্ট',
    subject: 'বাংলা ভাষা ও সাহিত্য',
    score: 31,
    totalQuestions: 35,
    accuracyPercentage: 88,
    timeSpentMinutes: 20,
    dateCompleted: '২০২৪-০৯-২৫',
    details: [
      {
        id: 1,
        questionText: '‘কবর’ নাটকটির রচয়িতা কে?',
        options: ['মুনীর চৌধুরী', 'জসীমউদ্দীন', 'শামসুর রাহমান', 'সেলিম আল দীন'],
        userAnswer: 'মুনীর চৌধুরী',
        userAnswerIndex: 0,
        correctAnswer: 'মুনীর চৌধুরী',
        correctAnswerIndex: 0,
        isCorrect: true,
        explanation: '‘কবর’ নাটকটি রচনা করেছেন শহীদ বুদ্ধিজীবী মুনীর চৌধুরী।'
      }
    ]
  },
  {
    id: 'ex-bcs-3',
    examTitle: 'আন্তর্জাতিক বিষয়াবলি ও সমসাময়িক বিশ্ব মক টেস্ট',
    subject: 'আন্তর্জাতিক বিষয়াবলি',
    score: 18,
    totalQuestions: 20,
    accuracyPercentage: 90,
    timeSpentMinutes: 12,
    dateCompleted: '২০২৪-০৯-২০',
    details: [
      {
        id: 1,
        questionText: 'জাতিসংঘের বর্তমান মহাসচিব আন্তোনিও গুতেরেস কোন দেশের নাগরিক?',
        options: ['পর্তুগাল', 'স্পেন', 'ব্রাজিল', 'ইতালি'],
        userAnswer: 'পর্তুগাল',
        userAnswerIndex: 0,
        correctAnswer: 'পর্তুগাল',
        correctAnswerIndex: 0,
        isCorrect: true,
        explanation: 'আন্তোনিও গুতেরেস পর্তুগালের সাবেক প্রধানমন্ত্রী এবং ২০১৭ সাল থেকে জাতিসংঘের মহাসচিব হিসেবে দায়িত্ব পালন করছেন।'
      },
      {
        id: 2,
        questionText: 'বিশ্বের সবচেয়ে গভীরতম মহাসাগর কোনটি?',
        options: ['প্রশান্ত মহাসাগর', 'আটলান্টিক মহাসাগর', 'ভারত মহাসাগর', 'উত্তর মহাসাগর'],
        userAnswer: 'প্রশান্ত মহাসাগর',
        userAnswerIndex: 0,
        correctAnswer: 'প্রশান্ত মহাসাগর',
        correctAnswerIndex: 0,
        isCorrect: true,
        explanation: 'প্রশান্ত মহাসাগরের মারিয়ানা খাত পৃথিবীর গভীরতম স্থান (গভীরতা প্রায় ১১,০২২ মিটার)।'
      },
      {
        id: 3,
        questionText: 'কপ-২৮ (COP28) জলবায়ু সম্মেলন কোন দেশে অনুষ্ঠিত হয়েছিল?',
        options: ['সংযুক্ত আরব আমিরাত (দুবাই)', 'ফ্রান্স (প্যারিস)', 'যুক্তরাজ্য (গ্লাসগো)', 'মিশর (শার্ম আল শেখ)'],
        userAnswer: 'সংযুক্ত আরব আমিরাত (দুবাই)',
        userAnswerIndex: 0,
        correctAnswer: 'সংযুক্ত আরব আমিরাত (দুবাই)',
        correctAnswerIndex: 0,
        isCorrect: true,
        explanation: '২০২৩ সালের ৩০ নভেম্বর থেকে ১২ ডিসেম্বর পর্যন্ত দুবাইতে COP28 জলবায়ু শীর্ষ সম্মেলন অনুষ্ঠিত হয়।'
      },
      {
        id: 4,
        questionText: 'আন্তর্জাতিক রেড ক্রস কমিটির (ICRC) সদর দপ্তর কোথায় অবস্থিত?',
        options: ['জেনেভা, সুইজারল্যান্ড', 'নিউইয়র্ক, যুক্তরাষ্ট্র', 'লন্ডন, যুক্তরাজ্য', 'হেগ, নেদারল্যান্ডস'],
        userAnswer: 'নিউইয়র্ক, যুক্তরাষ্ট্র',
        userAnswerIndex: 1,
        correctAnswer: 'জেনেভা, সুইজারল্যান্ড',
        correctAnswerIndex: 0,
        isCorrect: false,
        explanation: '১৮৬৩ সালে হেনরি ডুনান্ট কর্তৃক প্রতিষ্ঠিত আন্তর্জাতিক রেড ক্রস কমিটির সদর দপ্তর সুইজারল্যান্ডের জেনেভায় অবস্থিত।'
      },
      {
        id: 5,
        questionText: 'আন্তর্জাতিক আদালত (ICJ) এর বিচারকের সংখ্যা কতজন?',
        options: ['১৫ জন', '৯ জন', '২১ জন', '১২ জন'],
        userAnswer: '১৫ জন',
        userAnswerIndex: 0,
        correctAnswer: '১৫ জন',
        correctAnswerIndex: 0,
        isCorrect: true,
        explanation: 'আন্তর্জাতিক আদালত (ICJ) মোট ১৫ জন বিচারক নিয়ে গঠিত, যাদের মেয়াদ ৯ বছর।'
      }
    ]
  },
  {
    id: 'ex-bcs-4',
    examTitle: 'গাণিতিক যুক্তি ও মানসিক দক্ষতা স্পেশাল টেস্ট',
    subject: 'মানসিক দক্ষতা',
    score: 25,
    totalQuestions: 30,
    accuracyPercentage: 83,
    timeSpentMinutes: 25,
    dateCompleted: '২০২৪-০৯-১৮',
    details: [
      {
        id: 1,
        questionText: 'যদি ১, ৪, ৯, ১৬, ২৫ হয়, তবে পরবর্তী সংখ্যাটি কত?',
        options: ['৩৬', '৪৯', '৩৪', '৩২'],
        userAnswer: '৩৬',
        userAnswerIndex: 0,
        correctAnswer: '৩৬',
        correctAnswerIndex: 0,
        isCorrect: true,
        explanation: 'ধারার পদগুলো হলো ১², ২², ৩², ৪², ৫², সুতরাং পরবর্তী পদ ৬² = ৩৬।'
      }
    ]
  }
];

const BCS_SAMPLE_MISTAKES: StudentMistakeItem[] = [
  {
    id: 'mst-bcs-1',
    subject: 'বাংলাদেশ বিষয়াবলি',
    questionText: 'বাংলাদেশের সংবিধান কত তারিখে গণপরিষদে গৃহীত হয়?',
    options: ['৪ নভেম্বর ১৯৭২', '১৬ ডিসেম্বর ১৯৭২', '১২ অক্টোবর ১৯৭২', '২৬ মার্চ ১৯৭২'],
    userAnswerIndex: 1,
    correctAnswerIndex: 0,
    explanation: '৪ নভেম্বর ১৯৭২ সালে সংবিধান গণপরিষদে গৃহীত হয় এবং ১৬ ডিসেম্বর ১৯৭২ থেকে তা কার্যকর হয়।',
    resolved: false,
    dateAdded: '২০২৪-০৯-২০'
  },
  {
    id: 'mst-bcs-2',
    subject: 'বাংলা ভাষা ও সাহিত্য',
    questionText: '‘কবর’ নাটকটির রচয়িতা কে?',
    options: ['মুনীর চৌধুরী', 'জসীমউদ্দীন', 'শামসুর রাহমান', 'সেলিম আল দীন'],
    userAnswerIndex: 1,
    correctAnswerIndex: 0,
    explanation: '‘কবর’ নাটকটি রচনা করেছেন শহীদ বুদ্ধিজীবী মুনীর চৌধুরী (১৯৫৩)। আর ‘কবর’ কবিতা রচনা করেছেন পল্লীকবি জসীমউদ্দীন।',
    resolved: false,
    dateAdded: '২০২৪-০৯-২২'
  },
  {
    id: 'mst-bcs-3',
    subject: 'কম্পিউটার ও তথ্যপ্রযুক্তি',
    questionText: '১ গিগাবাইট (1 GB) সমান কত মেগাবাইট?',
    options: ['১০২৪ MB', '১০০০ MB', '৫১২ MB', '২০৪৮ MB'],
    userAnswerIndex: 1,
    correctAnswerIndex: 0,
    explanation: '১ GB = ১০২৪ MB (Megabytes) = ১০২৪ × ১০২৪ KB।',
    resolved: false,
    dateAdded: '২০২৪-০৯-২৫'
  }
];

// --- SAMPLE DATA FOR HSC & OTHERS ---
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

// Helper function to resolve active goal from user object or storage
const detectGoalFromUser = (user: any, propGoal?: string): string => {
  if (propGoal && propGoal.trim()) return propGoal;
  if (user?.activeGoalName) return user.activeGoalName;
  if (user?.studentClass) return user.studentClass;
  if (user?.targetGoal) return user.targetGoal;
  try {
    const raw = localStorage.getItem('takeuup_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u.activeGoalName) return u.activeGoalName;
      if (u.studentClass) return u.studentClass;
      if (u.targetGoal) return u.targetGoal;
    }
    const act = localStorage.getItem('takeuup_active_goal');
    if (act) return act;
  } catch (e) {}
  return 'BCS';
};

export const StudentHistory: React.FC<StudentHistoryProps> = ({ 
  mistakes, 
  onResolveMistake, 
  user,
  subjects: propSubjects,
  goal: propGoal
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 1. Resolve Active Goal & Type
  const currentGoal = detectGoalFromUser(user, propGoal);
  const goalLower = currentGoal.toLowerCase();
  const isBcs = goalLower.includes('bcs') || goalLower.includes('বিসিএস') || goalLower.includes('job') || goalLower.includes('জব');
  const isHsc = goalLower.includes('hsc') || goalLower.includes('এইচএসসি');
  const isAdmission = goalLower.includes('admission') || goalLower.includes('এডমিশন') || goalLower.includes('ভার্সিটি') || goalLower.includes('মেডিকেল') || goalLower.includes('buet');

  // Top Active Tab: 'bookmarks' (দাগানো প্রশ্ন) | 'mistakes' (পূর্বের ভুল) | 'exams' (পরীক্ষা)
  const [activeMainTab, setActiveMainTab] = useState<'bookmarks' | 'mistakes' | 'exams'>('bookmarks');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('সকল বিষয়');

  // 2. Dynamic Subject Pills State
  const [subjectPills, setSubjectPills] = useState<string[]>(() => {
    if (propSubjects && propSubjects.length > 0) {
      return ['সকল বিষয়', ...Array.from(new Set(propSubjects))];
    }
    if (isBcs) return BCS_SUBJECTS;
    if (isAdmission) return ADMISSION_SUBJECTS;
    if (isHsc) return HSC_SUBJECTS;
    return DEFAULT_SUBJECTS;
  });

  // Fetch or update Dynamic Subject Pills
  useEffect(() => {
    if (propSubjects && propSubjects.length > 0) {
      setSubjectPills(['সকল বিষয়', ...Array.from(new Set(propSubjects))]);
      return;
    }

    let isMounted = true;
    const fetchGoalSubjects = async () => {
      try {
        const res = await fetch(`${BASE_URL}/Dashboard/student-tracker?goal=${encodeURIComponent(currentGoal)}`, {
          credentials: 'include',
          headers: getHeaders(),
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.subjects) && data.subjects.length > 0) {
            const apiNames = data.subjects.map((s: any) => s.name);
            if (isMounted) {
              setSubjectPills(['সকল বিষয়', ...Array.from(new Set(apiNames))] as string[]);
              return;
            }
          }
        }
      } catch (err) {}

      // Fallback preset if API fails or empty
      if (isMounted) {
        if (isBcs) setSubjectPills(BCS_SUBJECTS);
        else if (isAdmission) setSubjectPills(ADMISSION_SUBJECTS);
        else if (isHsc) setSubjectPills(HSC_SUBJECTS);
        else setSubjectPills(DEFAULT_SUBJECTS);
      }
    };

    fetchGoalSubjects();

    const handleGoalChanged = () => {
      fetchGoalSubjects();
    };

    window.addEventListener('takeuup_goal_updated', handleGoalChanged);
    window.addEventListener('storage', handleGoalChanged);
    return () => {
      isMounted = false;
      window.removeEventListener('takeuup_goal_updated', handleGoalChanged);
      window.removeEventListener('storage', handleGoalChanged);
    };
  }, [currentGoal, propSubjects, isBcs, isAdmission, isHsc]);

  // Reset selected subject filter if no longer available in pills
  useEffect(() => {
    if (selectedSubjectFilter !== 'সকল বিষয়' && !subjectPills.includes(selectedSubjectFilter)) {
      setSelectedSubjectFilter('সকল বিষয়');
    }
  }, [subjectPills]);

  // 3. Bookmarks State (Sync with LocalStorage & Events)
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(() => {
    try {
      const stored = localStorage.getItem('takeuup_bookmarks');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return isBcs ? BCS_SAMPLE_BOOKMARKS : INITIAL_BOOKMARKS;
  });

  const [expandedBookmarkIds, setExpandedBookmarkIds] = useState<string[]>([]);

  useEffect(() => {
    const syncBookmarks = () => {
      try {
        const stored = localStorage.getItem('takeuup_bookmarks');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBookmarks(parsed);
            return;
          }
        }
      } catch (e) {}
      setBookmarks(isBcs ? BCS_SAMPLE_BOOKMARKS : INITIAL_BOOKMARKS);
    };

    syncBookmarks();
    window.addEventListener('takeuup_bookmarks_updated', syncBookmarks);
    return () => window.removeEventListener('takeuup_bookmarks_updated', syncBookmarks);
  }, [isBcs]);

  // 4. Mistakes State (Sync with Props & LocalStorage)
  const [internalMistakes, setInternalMistakes] = useState<StudentMistakeItem[]>(() => {
    if (mistakes && mistakes.length > 0) return mistakes;
    try {
      const stored = localStorage.getItem('takeuup_mistakes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return isBcs ? BCS_SAMPLE_MISTAKES : [];
  });

  useEffect(() => {
    const syncMistakes = () => {
      try {
        const stored = localStorage.getItem('takeuup_mistakes');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInternalMistakes(parsed);
            return;
          }
        }
      } catch (e) {}
      setInternalMistakes(isBcs ? BCS_SAMPLE_MISTAKES : []);
    };

    if (mistakes && mistakes.length > 0) {
      setInternalMistakes(mistakes);
    } else {
      syncMistakes();
    }

    window.addEventListener('takeuup_mistakes_updated', syncMistakes);
    return () => window.removeEventListener('takeuup_mistakes_updated', syncMistakes);
  }, [mistakes, isBcs]);

  // Practice Mode State for Mistakes
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  // 5. Exam History State (Sync with Backend / LocalStorage)
  const [examHistory, setExamHistory] = useState<CompletedExamRecord[]>(() => {
    try {
      const stored = localStorage.getItem('takeuup_exam_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return isBcs ? BCS_SAMPLE_EXAMS : INITIAL_EXAM_HISTORY;
  });

  // Exam Review Modal State
  const [selectedExamForReview, setSelectedExamForReview] = useState<CompletedExamRecord | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  useEffect(() => {
    const fetchExams = async () => {
      let localExams: CompletedExamRecord[] = [];
      try {
        const stored = localStorage.getItem('takeuup_exam_history');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localExams = parsed;
          }
        }
      } catch (e) {}

      // Try fetching user quiz results from backend
      try {
        const res = await fetch(`${BASE_URL}/Quizzes/my-results`, {
          credentials: 'include',
          headers: getHeaders(),
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const serverExams: CompletedExamRecord[] = data.map((item: any, idx: number) => {
              let parsedDetails: any = undefined;
              if (item.detailsJson) {
                try {
                  parsedDetails = typeof item.detailsJson === 'string' ? JSON.parse(item.detailsJson) : item.detailsJson;
                } catch(e) {}
              }
              return {
                id: item.id || `res-${idx}`,
                examTitle: item.examTitle || `${item.subject || 'কুইজ'} মডেল টেস্ট`,
                subject: item.subject || 'সাধারণ',
                score: item.score || 0,
                totalQuestions: item.totalQuestions || 10,
                accuracyPercentage: item.totalQuestions > 0 ? Math.round((item.score * 100) / item.totalQuestions) : 0,
                timeSpentMinutes: item.timeSpentMinutes || 15,
                dateCompleted: (item.completedAt || item.createdAt || '').split('T')[0] || new Date().toISOString().split('T')[0],
                details: parsedDetails
              };
            });

            const combinedMap = new Map<string, CompletedExamRecord>();
            serverExams.forEach(e => combinedMap.set(e.id, e));
            localExams.forEach(e => combinedMap.set(e.id, { ...combinedMap.get(e.id), ...e }));
            const merged = Array.from(combinedMap.values());
            if (merged.length > 0) {
              setExamHistory(merged);
              localStorage.setItem('takeuup_exam_history', JSON.stringify(merged));
              return;
            }
          }
        }
      } catch (e) {}

      if (localExams.length > 0) {
        setExamHistory(localExams);
      } else {
        setExamHistory(isBcs ? BCS_SAMPLE_EXAMS : INITIAL_EXAM_HISTORY);
      }
    };

    fetchExams();
    window.addEventListener('takeuup_exam_history_updated', fetchExams);
    return () => window.removeEventListener('takeuup_exam_history_updated', fetchExams);
  }, [isBcs]);

  // Helper function to match subjects fuzzy / aliases
  const subjectMatches = (itemSubject: string, filter: string) => {
    if (!filter || filter === 'সকল বিষয়') return true;
    if (!itemSubject) return false;
    const s = itemSubject.toLowerCase().trim();
    const f = filter.toLowerCase().trim();
    if (s === f || s.includes(f) || f.includes(s)) return true;
    
    // Bangla aliases
    if (f.includes('বাংলা') && s.includes('বাংলা')) return true;
    // English aliases
    if ((f.includes('english') || f.includes('ইংরেজি')) && (s.includes('english') || s.includes('ইংরেজি'))) return true;
    // Bangladesh Affairs
    if (f.includes('বাংলাদেশ') && (s.includes('বাংলাদেশ') || s.includes('affairs') || s.includes('gk') || s.includes('জ্ঞান'))) return true;
    // International Affairs
    if (f.includes('আন্তর্জাতিক') && (s.includes('আন্তর্জাতিক') || s.includes('international') || s.includes('gk') || s.includes('জ্ঞান'))) return true;
    // General Science
    if (f.includes('বিজ্ঞান') && (s.includes('বিজ্ঞান') || s.includes('science'))) return true;
    // ICT & Computer
    if ((f.includes('তথ্য') || f.includes('কম্পিউটার') || f.includes('ict')) && (s.includes('ict') || s.includes('তথ্য') || s.includes('কম্পিউটার'))) return true;
    // Math & Reasoning
    if ((f.includes('গণিত') || f.includes('যুক্তি')) && (s.includes('গণিত') || s.includes('math') || s.includes('যুক্তি'))) return true;
    // Mental Ability
    if (f.includes('মানসিক') && (s.includes('মানসিক') || s.includes('mental'))) return true;
    // Geography
    if (f.includes('ভূগোল') && (s.includes('ভূগোল') || s.includes('পরিবেশ'))) return true;
    // Ethics
    if (f.includes('নৈতিকতা') && (s.includes('নৈতিকতা') || s.includes('সুশাসন'))) return true;

    return false;
  };

  // Filter Bookmarks
  const filteredBookmarks = selectedSubjectFilter === 'সকল বিষয়'
    ? bookmarks
    : bookmarks.filter(b => subjectMatches(b.subject, selectedSubjectFilter));

  // Filter Mistakes
  const filteredMistakes = selectedSubjectFilter === 'সকল বিষয়' 
    ? internalMistakes 
    : internalMistakes.filter(m => subjectMatches(m.subject, selectedSubjectFilter));

  const unresolvedMistakes = filteredMistakes.filter(m => !m.resolved);

  // Filter Exams
  const filteredExams = selectedSubjectFilter === 'সকল বিষয়'
    ? examHistory
    : examHistory.filter(e => subjectMatches(e.subject, selectedSubjectFilter));

  const toggleBookmarkAnswer = (id: string) => {
    setExpandedBookmarkIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => {
      const updated = prev.filter(b => b.id !== id);
      try {
        localStorage.setItem('takeuup_bookmarks', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('takeuup_bookmarks_updated'));
      } catch (e) {}
      return updated;
    });
  };

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
    const activeItem = unresolvedMistakes[currentPracticeIndex];
    if (activeItem && selectedAnswer === activeItem.correctAnswerIndex) {
      handleResolveInternalMistake(activeItem.id);
    }
  };

  const handleResolveInternalMistake = (id: string) => {
    if (onResolveMistake) {
      onResolveMistake(id);
    }
    setInternalMistakes(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, resolved: true } : m);
      try {
        localStorage.setItem('takeuup_mistakes', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('takeuup_mistakes_updated'));
      } catch (e) {}
      return updated;
    });
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Goal Indicator Pill */}
        <div className="flex items-center gap-2">
          <div className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border ${
            isDark 
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <Target size={14} className="text-emerald-500" />
            <span>টার্গেট গোল: {currentGoal}</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className={`${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
        } border p-1.5 rounded-full inline-flex shadow-xl`}>
          
          <button
            onClick={() => { setActiveMainTab('bookmarks'); setPracticeMode(false); }}
            className={`px-5 sm:px-7 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeMainTab === 'bookmarks'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg scale-105'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark size={15} className={activeMainTab === 'bookmarks' ? 'text-slate-950 fill-slate-950' : ''} />
            <span>দাগানো প্রশ্ন</span>
            {bookmarks.length > 0 && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
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
            className={`px-5 sm:px-7 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeMainTab === 'mistakes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg scale-105'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BrainCircuit size={15} className={activeMainTab === 'mistakes' ? 'text-slate-950' : ''} />
            <span>পূর্বের ভুল</span>
            {unresolvedMistakes.length > 0 && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
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
            className={`px-5 sm:px-7 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
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

      {/* 2. DYNAMIC SUBJECT PILLS FILTER BAR (TAILORED TO BCS / ACTIVE GOAL) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar justify-start">
        {subjectPills.map(pill => {
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

      {/* 3. TAB 1: 🔖 দাগানো প্রশ্ন (BOOKMARKED QUESTIONS) */}
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
                  {selectedSubjectFilter !== 'সকল বিষয়' 
                    ? `"${selectedSubjectFilter}" বিষয়ে কোনো দাগানো প্রশ্ন নেই।` 
                    : 'প্রশ্নব্যাংক বা মক টেস্ট অনুশীলনের সময় গুরুত্বপূর্ণ প্রশ্ন সেভ করে রাখলে এখানে পেয়ে যাবে।'}
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
                      <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} flex items-center justify-between`}>
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
              ? 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-950 border-rose-500/20' 
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
              <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
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
                  <p className="text-xs text-slate-500">
                    {selectedSubjectFilter !== 'সকল বিষয়' 
                      ? `"${selectedSubjectFilter}" বিষয়ে কোনো ভুল প্রশ্নের রেকর্ড নেই।` 
                      : 'সাবাশ! আপনার সকল ভুল উত্তর সমাধান করা হয়েছে।'}
                  </p>
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
                            onClick={() => handleResolveInternalMistake(item.id)}
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
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-cyan-50/70 border-cyan-200 text-slate-800'
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

          {filteredExams.length === 0 ? (
            <div className={`${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            } border rounded-3xl p-10 text-center space-y-3`}>
              <BarChart2 size={40} className="text-slate-400 mx-auto" />
              <h4 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm`}>কোনো পরীক্ষার রেকর্ড নেই</h4>
              <p className="text-xs text-slate-500">
                {selectedSubjectFilter !== 'সকল বিষয়' 
                  ? `"${selectedSubjectFilter}" বিষয়ে এখনো কোনো পরীক্ষায় অংশগ্রহণ করেননি।` 
                  : 'মক টেস্ট বা কুইজে অংশগ্রহণ করলে আপনার পরীক্ষার ফলাফল এখানে দেখতে পাবেন।'}
              </p>
            </div>
          ) : (
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
                    onClick={() => {
                      setSelectedExamForReview(exam);
                      setReviewFilter('all');
                    }}
                    className={`w-full py-2.5 ${
                      isDark ? 'bg-slate-950 text-cyan-300 hover:bg-cyan-600 hover:text-white border-slate-800' : 'bg-slate-100 text-cyan-700 hover:bg-cyan-600 hover:text-white border-slate-200'
                    } font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border transition-all shadow-sm`}
                  >
                    <FileText size={14} /> বিস্তারিত উত্তরপত্র দেখুন ➔
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. DETAILED ANSWER SHEET MODAL (বিস্তারিত উত্তরপত্র ও প্রশ্নভিত্তিক সমাধান) */}
      {selectedExamForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-5 sm:p-6 border-b flex items-start justify-between gap-4 ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/70'
            }`}>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    {selectedExamForReview.subject}
                  </span>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Calendar size={12} /> {selectedExamForReview.dateCompleted}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> সময়: {selectedExamForReview.timeSpentMinutes} মিনিট
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                  {selectedExamForReview.examTitle} - উত্তরপত্র
                </h3>
              </div>

              <button
                onClick={() => setSelectedExamForReview(null)}
                className={`p-2 rounded-2xl transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                }`}
                title="বন্ধ করুন"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scorecard Summary Bar */}
            <div className={`p-4 sm:p-5 border-b grid grid-cols-2 sm:grid-cols-4 gap-3 text-center ${
              isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-white'
            }`}>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] font-bold text-slate-500 block">মোট প্রশ্ন</span>
                <span className="text-base sm:text-lg font-black text-cyan-600 dark:text-cyan-400">
                  {selectedExamForReview.totalQuestions} টি
                </span>
              </div>

              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] font-bold text-emerald-500 block">সঠিক উত্তর</span>
                <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {selectedExamForReview.score} টি
                </span>
              </div>

              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] font-bold text-rose-500 block">ভুল উত্তর</span>
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
                  {Math.max(0, selectedExamForReview.totalQuestions - selectedExamForReview.score)} টি
                </span>
              </div>

              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] font-bold text-cyan-500 block">এক্যুরেসি</span>
                <span className="text-base sm:text-lg font-black text-cyan-600 dark:text-cyan-400">
                  {selectedExamForReview.accuracyPercentage}%
                </span>
              </div>
            </div>

            {/* Filter Pills Inside Modal */}
            <div className={`px-5 py-3 border-b flex items-center justify-between gap-2 overflow-x-auto ${
              isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'
            }`}>
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">প্রশ্ন ফিল্টার:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    reviewFilter === 'all'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  সকল প্রশ্ন ({selectedExamForReview.details?.length || selectedExamForReview.totalQuestions})
                </button>
                <button
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    reviewFilter === 'correct'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  ✓ সঠিক ({selectedExamForReview.details ? selectedExamForReview.details.filter(d => d.isCorrect).length : selectedExamForReview.score})
                </button>
                <button
                  onClick={() => setReviewFilter('wrong')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    reviewFilter === 'wrong'
                      ? 'bg-rose-600 text-white shadow-md'
                      : isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  ✗ ভুল ({selectedExamForReview.details ? selectedExamForReview.details.filter(d => !d.isCorrect).length : Math.max(0, selectedExamForReview.totalQuestions - selectedExamForReview.score)})
                </button>
              </div>
            </div>

            {/* Questions List (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-left flex-1">
              {(() => {
                const detailsList = selectedExamForReview.details && selectedExamForReview.details.length > 0 
                  ? selectedExamForReview.details 
                  : [
                      {
                        id: 1,
                        questionText: `${selectedExamForReview.subject} সম্পর্কিত আদর্শ সিলেবাস প্রশ্ন`,
                        options: ['অপশন ক', 'অপশন খ', 'অপশন গ', 'অপশন ঘ'],
                        userAnswer: 'অপশন ক',
                        userAnswerIndex: 0,
                        correctAnswer: 'অপশন ক',
                        correctAnswerIndex: 0,
                        isCorrect: true,
                        explanation: 'প্রশ্নের সঠিক উত্তরের বিশ্লেষণ ও প্রাসঙ্গিক তথ্য।'
                      }
                    ];

                const filteredQuestions = detailsList.filter(qd => {
                  if (reviewFilter === 'correct') return qd.isCorrect;
                  if (reviewFilter === 'wrong') return !qd.isCorrect;
                  return true;
                });

                if (filteredQuestions.length === 0) {
                  return (
                    <div className="py-12 text-center text-slate-400 space-y-2">
                      <HelpCircle size={32} className="mx-auto text-slate-400" />
                      <p className="text-xs">এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি।</p>
                    </div>
                  );
                }

                return filteredQuestions.map((qItem, idx) => (
                  <div
                    key={qItem.id || idx}
                    className={`p-5 rounded-3xl border space-y-4 shadow-sm transition-all ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    {/* Question Header & Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/20">
                          {idx + 1}
                        </span>
                        <h4 className={`font-bold text-sm sm:text-base leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {qItem.questionText}
                        </h4>
                      </div>

                      <div className="shrink-0">
                        {qItem.isCorrect ? (
                          <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 size={13} /> সঠিক
                          </span>
                        ) : qItem.userAnswer ? (
                          <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <XCircle size={13} /> ভুল
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            উত্তর দেননি
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {qItem.options.map((opt, optIdx) => {
                        const optLabel = ['ক', 'খ', 'গ', 'ঘ'][optIdx];
                        const isUserAnswer = qItem.userAnswer === opt || (qItem.userAnswerIndex !== undefined && qItem.userAnswerIndex === optIdx);
                        const isCorrectAnswer = qItem.correctAnswer === opt || (qItem.correctAnswerIndex !== undefined && qItem.correctAnswerIndex === optIdx);

                        let optClasses = isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700';

                        if (isCorrectAnswer) {
                          optClasses = 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isUserAnswer && !qItem.isCorrect) {
                          optClasses = 'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 ${optClasses}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                                isCorrectAnswer ? 'bg-emerald-600 text-white' : isUserAnswer ? 'bg-rose-600 text-white' : isDark ? 'bg-slate-800' : 'bg-slate-100'
                              }`}>
                                {optLabel}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {isCorrectAnswer && (
                              <span className="text-[10px] text-emerald-600 font-bold shrink-0 flex items-center gap-0.5">
                                <Check size={13} /> সঠিক
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-[10px] text-rose-600 font-bold shrink-0 flex items-center gap-0.5">
                                <X size={13} /> আপনার উত্তর
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {qItem.explanation && (
                      <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                        isDark ? 'bg-slate-900 border-cyan-500/20 text-slate-300' : 'bg-cyan-50/70 border-cyan-200 text-slate-800'
                      }`}>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                          <Sparkles size={13} /> ব্যাখ্যা:
                        </span>
                        <p className="leading-relaxed">{qItem.explanation}</p>
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-end ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
            }`}>
              <button
                onClick={() => setSelectedExamForReview(null)}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black rounded-xl shadow-lg transition-all"
              >
                ঠিক আছে
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
