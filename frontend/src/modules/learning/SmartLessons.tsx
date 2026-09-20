import React, { useState } from 'react';
import { 
  Play, Video, Calendar, Clock, BookOpen, CheckCircle2, Sparkles, ArrowRight, Search,
  FileText, Download, HelpCircle, Send, X, Flame, Zap, ChevronRight, ChevronDown, Bell,
  Users, Check, Radio, Award, Filter, RefreshCw, Eye, ListVideo, Layers, SkipBack, SkipForward,
  CheckCircle, Circle, Bookmark, Lock, ExternalLink, CalendarDays, Share2, Printer
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SmartLessonsProps {
  isEmbedded?: boolean;
  user?: any;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  totalVideos: number;
}

interface TopicLesson {
  id: string;
  lectureNo: number;
  title: string;
  topicName: string;
  duration: string;
  instructor: string;
  videoUrl: string;
  pdfUrl?: string;
  isWatched?: boolean;
  views: number;
  thumbnail: string;
  chapterId: string;
  chapterTitle: string;
  subjectName: string;
}

interface ChapterPlaylist {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterDesc: string;
  totalLectures: number;
  completedLectures: number;
  lectures: TopicLesson[];
}

interface LiveClass {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  instructor: string;
  instructorTitle: string;
  instructorAvatar: string;
  startTime: string;
  isLiveNow: boolean;
  viewersCount: number;
  bannerImg: string;
}

interface RoutineEvent {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  subject: string;
  chapter: string;
  instructor: string;
  type: 'live' | 'exam' | 'mega-quiz';
  isLiveNow?: boolean;
}

const SUBJECTS_LIST: SubjectItem[] = [
  { id: 'all', name: 'সকল বিষয়', code: 'ALL', icon: '📚', color: 'from-cyan-500 to-blue-600', totalVideos: 48 },
  { id: 'chem2', name: 'রসায়ন ২য় পত্র', code: 'CHEM2', icon: '🧪', color: 'from-purple-500 to-indigo-600', totalVideos: 12 },
  { id: 'phy1', name: 'পদার্থবিজ্ঞান ১ম পত্র', code: 'PHY1', icon: '⚡', color: 'from-blue-500 to-cyan-500', totalVideos: 10 },
  { id: 'eng', name: 'ইংরেজি Grammar & Lit', code: 'ENG', icon: '🔤', color: 'from-rose-500 to-pink-600', totalVideos: 8 },
  { id: 'ban', name: 'বাংলা ১ম ও ২য় পত্র', code: 'BAN', icon: '✍️', color: 'from-amber-500 to-orange-500', totalVideos: 6 },
  { id: 'math1', name: 'উচ্চতর গণিত ১ম পত্র', code: 'MATH1', icon: '📐', color: 'from-emerald-500 to-teal-600', totalVideos: 7 },
  { id: 'bio2', name: 'জীববিজ্ঞান ২য় পত্র', code: 'BIO2', icon: '🧬', color: 'from-green-500 to-emerald-600', totalVideos: 5 },
  { id: 'ict', name: 'আইসিটি (ICT & C Prog)', code: 'ICT', icon: '💡', color: 'from-cyan-400 to-blue-500', totalVideos: 8 }
];

const LIVE_CLASSES_DATA: LiveClass[] = [
  {
    id: 'live-1',
    title: 'পদার্থবিজ্ঞান ২য় পত্র: চল তড়িৎ ও কার্শফের সূত্রের গাণিতিক সলভ',
    subject: 'পদার্থবিজ্ঞান ২য় পত্র',
    chapter: 'অধ্যায় ৩: চল তড়িৎ',
    instructor: 'Tanvir Ahmed',
    instructorTitle: 'Physics Mentor, BUET CSE',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    startTime: 'এখন লাইভ চলছে',
    isLiveNow: true,
    viewersCount: 1420,
    bannerImg: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'live-2',
    title: 'রসায়ন ২য় পত্র: পরিবেশ রসায়ন (বয়েলের সূত্র ও ডাল্টনের আংশিক চাপ)',
    subject: 'রসায়ন ২য় পত্র',
    chapter: 'অধ্যায় ১: পরিবেশ রসায়ন',
    instructor: 'Dr. Yeamin Abir',
    instructorTitle: 'Chemistry Specialist, DMC',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    startTime: 'আজ রাত ৮:০০ টা',
    isLiveNow: false,
    viewersCount: 0,
    bannerImg: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'live-3',
    title: 'উচ্চতর গণিত ১ম পত্র: ক্যালকুলাস ও ডিফারেন্সিয়েশন মাস্টারক্লাস',
    subject: 'উচ্চতর গণিত ১ম পত্র',
    chapter: 'অধ্যায় ৯: অন্তরীকরণ',
    instructor: 'Naimur Rahman',
    instructorTitle: 'Math Faculty, BUET EEE',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    startTime: 'আগামীকাল সকাল ১০:০০ টা',
    isLiveNow: false,
    viewersCount: 0,
    bannerImg: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=60'
  }
];

const FULL_CALENDAR_ROUTINE: RoutineEvent[] = [
  {
    id: 'ev-1',
    day: 'শনিবার',
    date: 'আজ',
    time: 'রাত ৮:০০ টা',
    title: 'রসায়ন ২য় পত্র: পরিবেশ রসায়ন (বয়েলের সূত্র ও ডাল্টনের আংশিক চাপ)',
    subject: 'রসায়ন ২য় পত্র',
    chapter: 'অধ্যায় ১: পরিবেশ রসায়ন',
    instructor: 'Dr. Yeamin Abir',
    type: 'live',
    isLiveNow: true
  },
  {
    id: 'ev-2',
    day: 'রবিবার',
    date: 'আগামীকাল',
    time: 'সকাল ১০:০০ টা',
    title: 'পদার্থবিজ্ঞান ১ম পত্র: ভেক্টর লব্ধি ও নদী-নৌকা কাস্টম মক টেস্ট',
    subject: 'পদার্থবিজ্ঞান ১ম পত্র',
    chapter: 'অধ্যায় ২: ভেক্টর',
    instructor: 'Tanvir Ahmed',
    type: 'exam'
  },
  {
    id: 'ev-3',
    day: 'রবিবার',
    date: 'আগামীকাল',
    time: 'রাত ৯:০০ টা',
    title: 'উচ্চতর গণিত ১ম পত্র: ক্যালকুলাস ও L\'Hopital Rule লাইভ সলভ',
    subject: 'উচ্চতর গণিত ১ম পত্র',
    chapter: 'অধ্যায় ৯: অন্তরীকরণ',
    instructor: 'Naimur Rahman',
    type: 'live'
  },
  {
    id: 'ev-4',
    day: 'সোমবার',
    date: 'পরশু',
    time: 'বিকাল ৪:০০ টা',
    title: 'English Grammar: Right Forms of Verbs Rules & Practice',
    subject: 'ইংরেজি Grammar',
    chapter: 'Grammar Section',
    instructor: 'Sumi Akhtar',
    type: 'live'
  },
  {
    id: 'ev-5',
    day: 'মঙ্গলবার',
    date: '৩ দিন পর',
    time: 'রাত ৮:০০ টা',
    title: 'রসায়ন ২য় পত্র: জৈব রসায়ন IUPAC নামকরণের সুপার সেশন',
    subject: 'রসায়ন ২য় পত্র',
    chapter: 'অধ্যায় ২: জৈব রসায়ন',
    instructor: 'Dr. Yeamin Abir',
    type: 'live'
  },
  {
    id: 'ev-6',
    day: 'বুধবার',
    date: '৪ দিন পর',
    time: 'সকাল ১০:০০ টা',
    title: 'আইসিটি অধ্যায় ৩: লজিক গেট ও ট্রুথ টেবিল লাইভ ক্লাস',
    subject: 'আইসিটি (ICT)',
    chapter: 'অধ্যায় ৩: সংখ্যা পদ্ধতি',
    instructor: 'Yeamin Abir',
    type: 'live'
  },
  {
    id: 'ev-7',
    day: 'শুক্রবার',
    date: '৬ দিন পর',
    time: 'সন্ধ্যা ৭:০০ টা',
    title: 'TakeUUp Friday Mega Quiz & Weekly Leaderboard Challenge',
    subject: 'অল সাবজেক্ট মেগা কুইজ',
    chapter: 'সাপ্তাহিক রিভিশন',
    instructor: 'TakeUUp Mentor Team',
    type: 'mega-quiz'
  }
];

const CHAPTER_PLAYLISTS: ChapterPlaylist[] = [
  {
    id: 'ch-chem-1',
    subjectId: 'chem2',
    subjectName: 'রসায়ন ২য় পত্র',
    chapterNumber: 1,
    chapterTitle: 'অধ্যায় ১: পরিবেশ রসায়ন (Environmental Chemistry)',
    chapterDesc: 'বয়েলের সূত্র, চার্লসের সূত্র, ডাল্টনের আংশিক চাপ সূত্র ও গ্রাফ সম্বলিত লেকচার সিরিজ।',
    totalLectures: 4,
    completedLectures: 2,
    lectures: [
      {
        id: 'lec-c1-1',
        lectureNo: 1,
        title: 'বয়েল ও চার্লসের সূত্র: সমীকরণ প্রতিপাদন ও গাণিতিক সমস্যা সমাধান',
        topicName: 'গ্যাসের সূত্রাবলী',
        duration: '৫০:১৫',
        instructor: 'Dr. Yeamin Abir',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-chem1',
        isWatched: true,
        views: 4520,
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-chem-1',
        chapterTitle: 'অধ্যায় ১: পরিবেশ রসায়ন',
        subjectName: 'রসায়ন ২য় পত্র'
      },
      {
        id: 'lec-c1-2',
        lectureNo: 2,
        title: 'ডাল্টনের আংশিক চাপ সূত্র ও জলীয় বাষ্পচাপের হিসাব গাণিতিক সমাধান',
        topicName: 'আংশিক চাপ সূত্র ও বাষ্পচাপ',
        duration: '৪২:১০',
        instructor: 'Dr. Yeamin Abir',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-chem2',
        isWatched: true,
        views: 3890,
        thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-chem-1',
        chapterTitle: 'অধ্যায় ১: পরিবেশ রসায়ন',
        subjectName: 'রসায়ন ২য় পত্র'
      },
      {
        id: 'lec-c1-3',
        lectureNo: 3,
        title: 'গ্রাহামের ব্যাপন সূত্র ও গ্যাসের ঘনত্বের সম্পর্কের গাণিতিক শর্টকাট',
        topicName: 'ব্যাপন সূত্র ও আণবিক ভর',
        duration: '৩৮:১৫',
        instructor: 'Dr. Yeamin Abir',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-chem3',
        isWatched: false,
        views: 2940,
        thumbnail: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-chem-1',
        chapterTitle: 'অধ্যায় ১: পরিবেশ রসায়ন',
        subjectName: 'রসায়ন ২য় পত্র'
      },
      {
        id: 'lec-c1-4',
        lectureNo: 4,
        title: 'আদর্শ গ্যাস ও বাস্তব গ্যাস: ভ্যান ডার ওয়ালস সমীকরণ বিশ্লেষণ',
        topicName: 'ভ্যান ডার ওয়ালস সমীকরণ',
        duration: '৪৫:০০',
        instructor: 'Dr. Yeamin Abir',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-chem4',
        isWatched: false,
        views: 3100,
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-chem-1',
        chapterTitle: 'অধ্যায় ১: পরিবেশ রসায়ন',
        subjectName: 'রসায়ন ২য় পত্র'
      }
    ]
  },
  {
    id: 'ch-chem-2',
    subjectId: 'chem2',
    subjectName: 'রসায়ন ২য় পত্র',
    chapterNumber: 2,
    chapterTitle: 'অধ্যায় ২: জৈব রসায়ন (Organic Chemistry)',
    chapterDesc: 'জৈব যৌগের নামকরণের IUPAC নিয়মাবলী, সমগোত্রীয় শ্রেণী, হাইড্রোকার্বন ও অ্যারোমেটিসিটি।',
    totalLectures: 4,
    completedLectures: 1,
    lectures: [
      {
        id: 'lec-c2-1',
        lectureNo: 1,
        title: 'জৈব যৌগের সাধারণ পরিচিতি ও কার্বনের ক্যাটিনেশন ধর্ম ব্যাখ্যা',
        topicName: 'জৈব যৌগের সূচনা',
        duration: '৪৭:৩০',
        instructor: 'Dr. Yeamin Abir',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-org1',
        isWatched: true,
        views: 5120,
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-chem-2',
        chapterTitle: 'অধ্যায় ২: জৈব রসায়ন',
        subjectName: 'রসায়ন ২য় পত্র'
      },
      {
        id: 'lec-c2-2',
        lectureNo: 2,
        title: 'IUPAC নামকরণের অ্যালকেন, অ্যালকিন ও অ্যালকাইন নামকরণ সুপার ট্রিকস',
        topicName: 'IUPAC Nomenclature',
        duration: '৫৫:০০',
        instructor: 'Dr. Yeamin Abir',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-org2',
        isWatched: false,
        views: 4890,
        thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-chem-2',
        chapterTitle: 'অধ্যায় ২: জৈব রসায়ন',
        subjectName: 'রসায়ন ২য় পত্র'
      }
    ]
  },
  {
    id: 'ch-phy-2',
    subjectId: 'phy1',
    subjectName: 'পদার্থবিজ্ঞান ১ম পত্র',
    chapterNumber: 2,
    chapterTitle: 'অধ্যায় ২: ভেক্টর (Vector Analysis)',
    chapterDesc: 'ভেক্টর সামান্তরিক সূত্র, ডট ও ক্রস গুণন, ভেক্টর ক্যালকুলাস ও নদী-নৌকার নদী পারাপার প্রবলেম।',
    totalLectures: 3,
    completedLectures: 3,
    lectures: [
      {
        id: 'lec-p2-1',
        lectureNo: 1,
        title: 'ভেক্টর সামান্তরিক সূত্র: লব্ধির মান ও দিক নির্ণয় গাণিতিক প্রবলেম সলভ',
        topicName: 'সামান্তরিক সূত্র',
        duration: '৪৮:২০',
        instructor: 'Tanvir Ahmed',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-vec1',
        isWatched: true,
        views: 6100,
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-phy-2',
        chapterTitle: 'অধ্যায় ২: ভেক্টর',
        subjectName: 'পদার্থবিজ্ঞান ১ম পত্র'
      },
      {
        id: 'lec-p2-2',
        lectureNo: 2,
        title: 'নদী-নৌকার সর্বনিম্ন দূরত্বের ও সর্বনিম্ন সময়ের নদী পারাপার ম্যাথ সলভিং',
        topicName: 'নদী-নৌকার ম্যাথ',
        duration: '৫২:১৫',
        instructor: 'Tanvir Ahmed',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-vec2',
        isWatched: true,
        views: 7420,
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-phy-2',
        chapterTitle: 'অধ্যায় ২: ভেক্টর',
        subjectName: 'পদার্থবিজ্ঞান ১ম পত্র'
      }
    ]
  },
  {
    id: 'ch-math-9',
    subjectId: 'math1',
    subjectName: 'উচ্চতর গণিত ১ম পত্র',
    chapterNumber: 9,
    chapterTitle: 'অধ্যায় ৯: অন্তরীকরণ (Differentiation & Calculus)',
    chapterDesc: 'লিমিট, প্রথম মূলের সাহায্যে অন্তরক সহগ নির্ণয়, পর্যায়ক্রমিক অন্তরীকরণ ও L\'Hopital Rule।',
    totalLectures: 3,
    completedLectures: 1,
    lectures: [
      {
        id: 'lec-m9-1',
        lectureNo: 1,
        title: 'ক্যালকুলাস সূচনা ও সীমাস্থ মান (Limit) সংক্রান্ত সকল শর্টকাট টেকনিক',
        topicName: 'লিমিটের গাণিতিক সলভ',
        duration: '৫০:০০',
        instructor: 'Naimur Rahman',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-diff1',
        isWatched: true,
        views: 4120,
        thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-math-9',
        chapterTitle: 'অধ্যায় ৯: অন্তরীকরণ',
        subjectName: 'উচ্চতর গণিত ১ম পত্র'
      },
      {
        id: 'lec-m9-2',
        lectureNo: 2,
        title: 'প্রথম মূলের সাহায্যে sin(x), e^x ও ln(x) এর অন্তরক সহগ নির্ণয়',
        topicName: 'প্রথম মূলের নিয়ম',
        duration: '৪২:০০',
        instructor: 'Naimur Rahman',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-diff2',
        isWatched: false,
        views: 3500,
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-math-9',
        chapterTitle: 'অধ্যায় ৯: অন্তরীকরণ',
        subjectName: 'উচ্চতর গণিত ১ম পত্র'
      },
      {
        id: 'lec-m9-3',
        lectureNo: 3,
        title: 'পর্যায়ক্রমিক অন্তরীকরণ ও স্পর্শক-অভিলম্ব সমীকরণ সলভ',
        topicName: 'স্পর্শক ও অভিলম্ব',
        duration: '৪৫:১০',
        instructor: 'Naimur Rahman',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        pdfUrl: '#pdf-diff3',
        isWatched: false,
        views: 3900,
        thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60',
        chapterId: 'ch-math-9',
        chapterTitle: 'অধ্যায় ৯: অন্তরীকরণ',
        subjectName: 'উচ্চতর গণিত ১ম পত্র'
      }
    ]
  }
];

export const SmartLessons: React.FC<SmartLessonsProps> = ({ isEmbedded, user }) => {
  const { theme } = useTheme();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapterIds, setExpandedChapterIds] = useState<string[]>(['ch-chem-1', 'ch-phy-2']);
  
  // Modals & Active State
  const [activeLessonPlayer, setActiveLessonPlayer] = useState<{
    lesson: TopicLesson;
    playlist: TopicLesson[];
    chapterTitle: string;
  } | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [calendarViewTab, setCalendarViewTab] = useState<'weekly' | 'today'>('weekly');
  const [calendarFilterSubject, setCalendarFilterSubject] = useState<string>('all');
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1.0x');
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [doubtText, setDoubtText] = useState<string>('');
  const [doubtSubmitted, setDoubtSubmitted] = useState<boolean>(false);

  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapterIds(prev => 
      prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
    );
  };

  const filteredPlaylists = CHAPTER_PLAYLISTS.filter(cp => {
    if (selectedSubjectId !== 'all' && cp.subjectId !== selectedSubjectId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return cp.chapterTitle.toLowerCase().includes(q) || cp.subjectName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSetReminder = (title: string) => {
    setReminderToast(`ক্যালেন্ডারে রিমাইন্ডার সেট করা হয়েছে: "${title}"`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const handleSendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    setDoubtSubmitted(true);
    setTimeout(() => {
      setDoubtText('');
      setDoubtSubmitted(false);
    }, 3000);
  };

  const openPlaylistPlayer = (lesson: TopicLesson, chapter: ChapterPlaylist) => {
    setActiveLessonPlayer({
      lesson,
      playlist: chapter.lectures,
      chapterTitle: chapter.chapterTitle
    });
  };

  const handleNavigateEpisode = (direction: 'next' | 'prev') => {
    if (!activeLessonPlayer) return;
    const currentIndex = activeLessonPlayer.playlist.findIndex((l: TopicLesson) => l.id === activeLessonPlayer.lesson.id);
    if (currentIndex === -1) return;

    if (direction === 'next' && currentIndex < activeLessonPlayer.playlist.length - 1) {
      setActiveLessonPlayer({
        ...activeLessonPlayer,
        lesson: activeLessonPlayer.playlist[currentIndex + 1]
      });
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveLessonPlayer({
        ...activeLessonPlayer,
        lesson: activeLessonPlayer.playlist[currentIndex - 1]
      });
    }
  };

  const filteredCalendarEvents = FULL_CALENDAR_ROUTINE.filter(ev => {
    if (calendarViewTab === 'today') return ev.date === 'আজ' || ev.date.includes('আজ');
    if (calendarFilterSubject === 'all') return true;
    return ev.subject.includes(calendarFilterSubject);
  });

  const isDark = theme === 'dark';

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER & ANNOUNCEMENT BANNER */}
      <div className="space-y-4">
        
        {/* Toast Alert Notification */}
        {reminderToast && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-emerald-400 animate-bounce" />
              <span>{reminderToast}</span>
            </div>
            <button 
              onClick={() => setReminderToast(null)}
              className="text-emerald-400 hover:text-emerald-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Hero Banner Box (Theme Adaptive) */}
        <div className={`relative rounded-3xl overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-955 via-slate-900 to-indigo-955 border-slate-800 text-white' 
            : 'bg-gradient-to-r from-cyan-500/10 via-blue-50 to-indigo-50 border-cyan-200/80 text-slate-900 shadow-xl'
        } border p-6 lg:p-8 shadow-2xl`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                <Sparkles size={14} />
                <span>TakeUUp Smart Video Lessons</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                স্মার্ট <span className="bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">লেসনস ও লাইভ ক্লাসরুম</span> 🚀
              </h1>

              <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                পরের ক্লাসগুলো আগে থেকেই জেনে নাও, লাইভ ক্লাসে অংশ নিয়ে শিক্ষককে সরাসরি প্রশ্ন করো অথবা অধ্যায় ও টপিক অনুযায়ী সাজানো প্লেলিস্ট দেখে রিভিশন সম্পন্ন করো।
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button 
                  onClick={() => setSelectedSubjectId('all')}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
                >
                  <ListVideo size={16} /> 📚 চ্যাপ্টার ও টপিক প্লেলিস্ট
                </button>

                <button 
                  onClick={() => setShowCalendarModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5"
                >
                  <Calendar size={14} /> 📅 পরের ক্লাসগুলোর ক্যালেন্ডার রুটিন দেখুন →
                </button>
              </div>
            </div>

            {/* Quick Search Widget */}
            <div className={`${
              isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-900 shadow-xl'
            } border p-4 rounded-2xl shrink-0 md:w-80 space-y-3`}>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Search size={14} className="text-cyan-500" /> অধ্যায় ও টপিক সার্চ
              </span>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="টপিক বা অধ্যায়ের নাম লিখুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  } border rounded-xl py-2 pl-9 pr-3 text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500`}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                <span>ফিল্টারকৃত অধ্যায়: {filteredPlaylists.length}টি</span>
                <button 
                  onClick={() => setShowCalendarModal(true)}
                  className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                >
                  ক্যালেন্ডার রুটিন
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 2. 🔴 FULL LIVE CLASS HUB GRID */}
      <div className={`${
        isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'
      } border rounded-3xl p-6 lg:p-8 shadow-xl space-y-6`}>
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg lg:text-xl font-black flex items-center gap-2.5">
              <Radio className="text-rose-500 animate-pulse" size={22} />
              লাইভ ক্লাস হাব (TakeUUp Live Classrooms)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">সরাসরি শিক্ষকের সাথে যুক্ত হয়ে প্রশ্ন উত্তর সেশন এবং গুরুত্বপূর্ণ লাইভ লেকচারে অংশ নাও</p>
          </div>

          <button 
            onClick={() => setShowCalendarModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20 transition-colors"
          >
            <CalendarDays size={14} />
            ফুল ক্যালেন্ডার রুটিন দেখুন →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LIVE_CLASSES_DATA.map((liveClass) => (
            <div 
              key={liveClass.id}
              className={`${
                isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              } border rounded-2xl p-4 space-y-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between group`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${
                  liveClass.isLiveNow
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
                }`}>
                  {liveClass.isLiveNow ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      🔴 লাইভ চলছে
                    </>
                  ) : (
                    <>
                      <Clock size={12} /> {liveClass.startTime}
                    </>
                  )}
                </span>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-slate-200 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-800">
                  {liveClass.subject}
                </span>
              </div>

              {/* Banner Thumbnail Preview */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 group">
                <img src={liveClass.bannerImg} alt={liveClass.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-955/40 to-transparent" />
                
                {liveClass.isLiveNow && (
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-rose-500/30 text-rose-400 text-[10px] font-bold flex items-center gap-1.5">
                    <Users size={12} /> {liveClass.viewersCount.toLocaleString()} জন যুক্ত
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => openPlaylistPlayer(CHAPTER_PLAYLISTS[0].lectures[0], CHAPTER_PLAYLISTS[0])}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-xl ${
                      liveClass.isLiveNow ? 'bg-rose-500 text-white' : 'bg-cyan-500 text-slate-950'
                    }`}
                  >
                    <Play size={22} className="ml-1 fill-current" />
                  </button>
                </div>
              </div>

              {/* Class Details */}
              <div className="space-y-2">
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">{liveClass.chapter}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">{liveClass.title}</h3>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <img src={liveClass.instructorAvatar} alt={liveClass.instructor} className="w-8 h-8 rounded-full object-cover border border-cyan-500/40 shrink-0" />
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{liveClass.instructor}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{liveClass.instructorTitle}</p>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              {liveClass.isLiveNow ? (
                <button 
                  onClick={() => openPlaylistPlayer(CHAPTER_PLAYLISTS[0].lectures[0], CHAPTER_PLAYLISTS[0])}
                  className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all"
                >
                  <Radio size={16} className="animate-pulse" /> কন্টিনিউ লাইভ ক্লাসরুম ➤
                </button>
              ) : (
                <button 
                  onClick={() => handleSetReminder(liveClass.title)}
                  className="w-full py-2.5 bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-800 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Bell size={14} className="text-amber-500" /> রিমাইন্ডার সেট করুন
                </button>
              )}

            </div>
          ))}

        </div>
      </div>

      {/* 3. 🎯 SUBJECT SELECTOR PILLS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Filter size={18} className="text-cyan-500" />
            রেকর্ডকৃত ক্লাসের প্লেলিস্ট (Select Subject)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">বিষয় নির্বাচন করে চ্যাপ্টার ও লেকচার ১, ২, ৩ দেখুন</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
          {SUBJECTS_LIST.map(subject => {
            const isActive = selectedSubjectId === subject.id;
            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/25 scale-105'
                    : isDark 
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                } border`}
              >
                <span className="text-sm">{subject.icon}</span>
                <span>{subject.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 📂 CHAPTER & TOPIC PLAYLIST ACCORDION SYSTEM */}
      <div className="space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={18} className="text-purple-500" />
            অধ্যায় ও টপিক লেকচার প্লেলিস্ট ({filteredPlaylists.length}টি অধ্যায়)
          </h3>

          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> সার্চ রিসেট
            </button>
          )}
        </div>

        {filteredPlaylists.length === 0 ? (
          <div className={`${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          } border rounded-3xl p-10 text-center space-y-3`}>
            <BookOpen size={36} className="text-slate-400 mx-auto" />
            <h4 className="text-slate-900 dark:text-white font-bold text-sm">কোনো অধ্যায় বা লেকচার পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">অন্য বিষয় নির্বাচন করুন অথবা ভিন্ন কীওয়ার্ড দিয়ে সার্চ করুন।</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPlaylists.map(chapter => {
              const isExpanded = expandedChapterIds.includes(chapter.id);
              const progressPercentage = Math.round((chapter.completedLectures / chapter.totalLectures) * 100);

              return (
                <div 
                  key={chapter.id}
                  className={`${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                  } border rounded-3xl overflow-hidden shadow-xl transition-all`}
                >
                  {/* CHAPTER ACCORDION HEADER */}
                  <div 
                    onClick={() => toggleChapterExpand(chapter.id)}
                    className={`p-5 lg:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${
                      isDark ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-955 border-slate-800/80 hover:bg-slate-850' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    } transition-colors group`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                          {chapter.subjectName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {chapter.completedLectures}/{chapter.totalLectures} লেকচার সম্পন্ন ({progressPercentage}%)
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 dark:text-white text-base lg:text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        {chapter.chapterTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{chapter.chapterDesc}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Chapter Progress Meter */}
                      <div className="w-32 space-y-1 hidden sm:block">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                          <span>প্রোগ্রেস</span>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">{progressPercentage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                      </div>

                      <button className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* LECTURES PLAYLIST EPISODES LIST */}
                  {isExpanded && (
                    <div className={`p-4 lg:p-6 ${
                      isDark ? 'bg-slate-950/60 divide-slate-800/60' : 'bg-white divide-slate-100'
                    } divide-y animate-in fade-in duration-200`}>
                      {chapter.lectures.map(lecture => (
                        <div 
                          key={lecture.id}
                          className={`py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'
                          } p-3 rounded-2xl transition-colors group`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Lecture Episode Badge & Thumbnail */}
                            <div 
                              onClick={() => openPlaylistPlayer(lecture, chapter)}
                              className="relative w-28 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800 cursor-pointer group/thumb shadow-md"
                            >
                              <img src={lecture.thumbnail} alt={lecture.title} className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                                <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md">
                                  <Play size={14} className="ml-0.5 fill-current" />
                                </div>
                              </div>
                              <span className="absolute bottom-1 right-1 bg-slate-950/90 text-white text-[9px] font-mono px-1 rounded">
                                {lecture.duration}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.2 rounded border border-cyan-500/20">
                                  লেকচার #{lecture.lectureNo}
                                </span>
                                {lecture.isWatched ? (
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle size={12} /> দেখা হয়েছে
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <Circle size={10} /> বাকি আছে
                                  </span>
                                )}
                              </div>

                              <h4 
                                onClick={() => openPlaylistPlayer(lecture, chapter)}
                                className="font-bold text-xs lg:text-sm text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer transition-colors leading-snug"
                              >
                                {lecture.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">টপিক: {lecture.topicName} • ইন্সট্রাক্টর: {lecture.instructor}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <button
                              onClick={() => openPlaylistPlayer(lecture, chapter)}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                            >
                              <Play size={14} className="fill-current" /> প্লে করুন
                            </button>

                            <a
                              href={lecture.pdfUrl || '#'}
                              onClick={(e) => {
                                if (!lecture.pdfUrl) {
                                  e.preventDefault();
                                  alert('লেকচার PDF নোটটি দ্রুত যুক্ত করা হবে!');
                                }
                              }}
                              className="p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-cyan-600 dark:text-cyan-400 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                              title="লেকচার শিট (PDF) ডাউনলোড"
                            >
                              <FileText size={16} />
                            </a>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 5. 📅 LIVE CLASS FULL CALENDAR ROUTINE MODAL */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
            onClick={() => setShowCalendarModal(false)} 
          />

          <div className={`relative w-full max-w-4xl ${
            isDark ? 'bg-[#090d18] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          } border rounded-[2.5rem] p-6 lg:p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <CalendarDays size={24} />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-black">লাইভ ক্লাস ও এক্সাম ক্যালেন্ডার রুটিন</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">এইচএসসি ও এডমিশন প্রস্তুতির আগামী ক্লাসগুলোর পূর্ণাঙ্গ সূচী</p>
                </div>
              </div>

              <button 
                onClick={() => setShowCalendarModal(false)}
                className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Tabs Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-850 shrink-0">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setCalendarViewTab('weekly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    calendarViewTab === 'weekly' 
                      ? 'bg-cyan-500 text-white font-black shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  এই সপ্তাহের রুটিন
                </button>
                <button
                  onClick={() => setCalendarViewTab('today')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    calendarViewTab === 'today' 
                      ? 'bg-rose-500 text-white font-black shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  আজকের ইভেন্ট (Today)
                </button>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-bold">বিষয়:</span>
                <select
                  value={calendarFilterSubject}
                  onChange={(e) => setCalendarFilterSubject(e.target.value)}
                  className={`bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs ${
                    isDark ? 'text-white' : 'text-slate-900'
                  } focus:outline-none focus:border-cyan-500 font-bold`}
                >
                  <option value="all">সকল বিষয়</option>
                  <option value="রসায়ন">রসায়ন</option>
                  <option value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান</option>
                  <option value="গণিত">উচ্চতর গণিত</option>
                  <option value="ইংরেজি">ইংরেজি</option>
                  <option value="আইসিটি">আইসিটি</option>
                </select>
              </div>
            </div>

            {/* Calendar Events List */}
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar my-4 pr-1">
              {filteredCalendarEvents.map(event => (
                <div 
                  key={event.id}
                  className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    event.isLiveNow 
                      ? 'bg-gradient-to-r from-rose-500/10 via-slate-900/40 to-slate-955 border-rose-500/50 shadow-lg' 
                      : isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Day/Date Badge */}
                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                      event.isLiveNow
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-950 text-cyan-600 dark:text-cyan-400 border-slate-200 dark:border-slate-800'
                    }`}>
                      <span className="text-[10px] font-black uppercase">{event.day}</span>
                      <span className="text-xs font-bold">{event.time}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          event.type === 'live'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                            : event.type === 'exam'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30'
                        }`}>
                          {event.type === 'live' ? '🔴 লাইভ ক্লাস' : event.type === 'exam' ? '⚡ মক এক্সাম' : '🏆 মেগা কুইজ'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                          {event.subject}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{event.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{event.chapter} • ইন্সট্রাক্টর: {event.instructor}</p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {event.isLiveNow ? (
                      <button 
                        onClick={() => {
                          setShowCalendarModal(false);
                          openPlaylistPlayer(CHAPTER_PLAYLISTS[0].lectures[0], CHAPTER_PLAYLISTS[0]);
                        }}
                        className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs shadow-lg shadow-rose-500/25 flex items-center gap-1.5 transition-all"
                      >
                        <Radio size={14} className="animate-pulse" /> এখন জয়েন করুন ➤
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSetReminder(event.title)}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Bell size={14} className="text-amber-500" /> রিমাইন্ডার সেট
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert('গুগল ক্যালেন্ডারে রুটিন যুক্ত করা হয়েছে!')}
                  className="px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Calendar size={14} /> গুগল ক্যালেন্ডারে যুক্ত করুন
                </button>
                <button 
                  onClick={() => alert('রুটিন PDF ডাউনলোড শুরু হয়েছে!')}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={14} /> রুটিন PDF ডাউনলোড
                </button>
              </div>

              <button 
                onClick={() => setShowCalendarModal(false)}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. 🎥 INTERACTIVE PLAYLIST PLAYER SCREEN MODAL */}
      {activeLessonPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6">
          <div 
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-lg transition-opacity" 
            onClick={() => setActiveLessonPlayer(null)} 
          />

          <div className={`relative w-full max-w-6xl ${
            isDark ? 'bg-[#080d1a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          } border rounded-[2.5rem] p-4 lg:p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] overflow-hidden`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3 shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <ListVideo size={20} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-cyan-500 dark:text-cyan-400 font-bold uppercase tracking-wider truncate block">
                    {activeLessonPlayer.chapterTitle}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm lg:text-base leading-tight truncate">
                    লেকচার #{activeLessonPlayer.lesson.lectureNo}: {activeLessonPlayer.lesson.title}
                  </h3>
                </div>
              </div>

              <button 
                onClick={() => setActiveLessonPlayer(null)}
                className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Video & Playlist Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
              
              {/* LEFT 70%: Video Player & Controls */}
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
                  <iframe 
                    src={`${activeLessonPlayer.lesson.videoUrl}?autoplay=1`}
                    title={activeLessonPlayer.lesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Controls Bar */}
                <div className={`${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                } border p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs`}>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleNavigateEpisode('prev')}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <SkipBack size={14} /> পূর্ববর্তী লেকচার
                    </button>

                    <button 
                      onClick={() => handleNavigateEpisode('next')}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl flex items-center gap-1 transition-colors shadow-md"
                    >
                      পরবর্তী লেকচার <SkipForward size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">গতি:</span>
                    {['1.0x', '1.25x', '1.5x'].map(speed => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                          playbackSpeed === speed 
                            ? 'bg-cyan-500 text-white font-black' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lecture Notes Download Box */}
                <div className={`${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                } border p-4 rounded-2xl space-y-3`}>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <FileText size={16} className="text-cyan-500" />
                      লেকচার নোটস ও টেক্সটবুক শর্টকাট
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Verified Sheet</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    ইন্সট্রাক্টর {activeLessonPlayer.lesson.instructor}-এর প্রস্তুতকৃত টাইপ ভিত্তিক নোটস এবং ভর্তি পরীক্ষার শর্টকাট টেকনিকস সংবলিত ফাইল।
                  </p>

                  <button 
                    onClick={() => alert('লেকচার নোটস (PDF) ডাউনলোড শুরু হয়েছে!')}
                    className="w-full py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/30 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={14} /> লেকচার নোটস (PDF Download)
                  </button>
                </div>
              </div>

              {/* RIGHT 30%: CHAPTER PLAYLIST SIDEBAR */}
              <div className="space-y-4 flex flex-col">
                
                <div className={`${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                } border p-4 rounded-2xl space-y-3 flex-1 flex flex-col`}>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ListVideo size={16} className="text-purple-500" />
                      অধ্যায়ের সবকটি লেকচার ({activeLessonPlayer.playlist.length}টি)
                    </h4>
                  </div>

                  <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 max-h-72 lg:max-h-none pr-1">
                    {activeLessonPlayer.playlist.map((item: TopicLesson) => {
                      const isCurrent = item.id === activeLessonPlayer.lesson.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() => setActiveLessonPlayer({ ...activeLessonPlayer, lesson: item })}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isCurrent
                              ? 'bg-cyan-500/10 border-cyan-500 text-slate-900 dark:text-white shadow-md'
                              : isDark ? 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                              isCurrent ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              #{item.lectureNo}
                            </div>
                            <div className="overflow-hidden">
                              <h5 className={`font-bold text-xs truncate ${isCurrent ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-900 dark:text-white'}`}>
                                {item.title}
                              </h5>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.duration}</span>
                            </div>
                          </div>

                          {isCurrent && (
                            <span className="text-cyan-500 animate-pulse text-[10px] font-bold shrink-0">
                              ▶ বাজছে
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Doubt Asking Box */}
                <div className={`${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                } border p-4 rounded-2xl space-y-3`}>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <HelpCircle size={16} className="text-rose-500" />
                    শিক্ষককে প্রশ্ন করুন (Doubt Box)
                  </h4>

                  {doubtSubmitted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center text-xs text-emerald-600 dark:text-emerald-300 font-bold">
                      ✓ প্রশ্নটি শিক্ষকের কাছে পাঠানো হয়েছে!
                    </div>
                  ) : (
                    <form onSubmit={handleSendDoubt} className="space-y-2">
                      <input
                        type="text"
                        placeholder="আপনার কোনো ডাউট থাকলে লিখুন..."
                        value={doubtText}
                        onChange={(e) => setDoubtText(e.target.value)}
                        className={`w-full ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        } border rounded-xl p-2.5 text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500`}
                      />
                      <button 
                        type="submit"
                        className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <Send size={12} /> জমা দিন
                      </button>
                    </form>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default SmartLessons;
