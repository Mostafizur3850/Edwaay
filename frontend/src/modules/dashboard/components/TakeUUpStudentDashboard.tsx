import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare, Calculator, LayoutGrid, BookOpen, Zap, BrainCircuit, History, Trophy, TrendingUp,
  Crown, Flame, Star, Bell, Sun, Moon, Lock, ChevronDown, Award,
  ChevronRight, ChevronLeft, Users, Play, FileText, CheckCircle2, Info, User, Settings, Sparkles, ExternalLink,
  Target, Plus, Check, RotateCcw, Calendar, ArrowRight, ShieldCheck, Flame as FlameIcon, Sparkle,
  Clock, AlertCircle, HelpCircle, GraduationCap, Briefcase, Calculator as CalcIcon, X, Menu, Bookmark, BarChart3,
  Atom, FlaskConical, Ruler, Dna, Globe
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { StudentCourse, StudentMistakeItem, StudentCertificate } from '../../../types/types';
import { QuestionBank } from '../../quiz/QuestionBank';
import { MistakeBank } from './MistakeBank';
import { QuizInterface } from '../../quiz/QuizInterface';
import { MegaQuiz } from '../../quiz/MegaQuiz';
import { Leaderboard } from '../../leaderboard/Leaderboard';
import { StudentProfileEditModal } from './StudentProfileEditModal';
import { CourseViewerModal } from './CourseViewerModal';
import { CertificateModal } from './CertificateModal';
import { SmartLessons } from '../../learning/SmartLessons';
import { StudyRoutinePlanner } from './StudyRoutinePlanner';
import { TakeUUpAccountDrawer } from './TakeUUpAccountDrawer';
import { StudentMessagesChat } from './StudentMessagesChat';
import { StudentStudyGroups } from './StudentStudyGroups';
import { StudentAdmissionPredictor } from './StudentAdmissionPredictor';
import { FloatingMessengerWidget } from './FloatingMessengerWidget';
import { GoalChangeSettingsView } from './GoalChangeSettingsView';
import { TakeUUpPremiumPortal } from '../../payment/TakeUUpPremiumPortal';

interface TakeUUpStudentDashboardProps {
  user: any;
  onUpdateUser?: (updated: any) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  courses?: StudentCourse[];
  mistakes?: StudentMistakeItem[];
  certificates?: StudentCertificate[];
  routineTasks?: any[];
  onToggleTask?: (id: string) => void;
  onAddTask?: (taskText: string) => void;
  onResolveMistake?: (id: string) => void;
}

const GOAL_OPTIONS = [
  { id: 'HSC', name: 'HSC Academic', badge: 'HSC', color: 'from-purple-500 to-pink-500' },
  { id: 'Admission', name: 'Varsity & Engineering Admission', badge: 'Admission', color: 'from-blue-500 to-cyan-500' },
  { id: 'BCS', name: 'BCS Preliminary', badge: 'BCS', color: 'from-emerald-500 to-teal-500' },
  { id: 'Job', name: 'Govt Job & Bank Prep', badge: 'Job', color: 'from-amber-500 to-orange-500' }
];

const DEFAULT_SUBJECT_PROGRESS: Record<string, { name: string; progress: number; topic: string; totalQuestions: number }[]> = {
  HSC: [
    { name: 'Physics 1st & 2nd', progress: 75, topic: 'Vector & Thermodynamics', totalQuestions: 420 },
    { name: 'Chemistry', progress: 60, topic: 'Organic Chemistry & Periodic Trends', totalQuestions: 380 },
    { name: 'Higher Math', progress: 82, topic: 'Calculus & Matrix', totalQuestions: 510 },
    { name: 'Biology', progress: 45, topic: 'Cell Structure & Genetics', totalQuestions: 290 },
    { name: 'ICT & Computer', progress: 90, topic: 'HTML, C Programming & Logic Gates', totalQuestions: 340 }
  ],
  Admission: [
    { name: 'Physics', progress: 68, topic: 'Mechanics & Waves', totalQuestions: 600 },
    { name: 'Chemistry', progress: 55, topic: 'Chemical Equilibrium & Reactions', totalQuestions: 550 },
    { name: 'Mathematics', progress: 72, topic: 'Integration & Coordinate Geometry', totalQuestions: 620 },
    { name: 'Biology', progress: 50, topic: 'Human Physiology & Botany', totalQuestions: 480 },
    { name: 'English & GK', progress: 85, topic: 'Vocabulary & Current World', totalQuestions: 700 }
  ],
  BCS: [
    { name: 'Bangladesh Affairs', progress: 80, topic: 'Liberation War & Constitution', totalQuestions: 850 },
    { name: 'International Affairs', progress: 65, topic: 'Global Treaties & Geopolitics', totalQuestions: 620 },
    { name: 'Bangla Language & Lit', progress: 70, topic: 'Modern Poets & Grammar Rules', totalQuestions: 790 },
    { name: 'English Language & Lit', progress: 58, topic: 'Grammar Hacks & Classic Authors', totalQuestions: 730 },
    { name: 'General Science & ICT', progress: 88, topic: 'Daily Science & Networking', totalQuestions: 690 },
    { name: 'Mental Ability & Math', progress: 78, topic: 'Algebra, Geometry & Puzzles', totalQuestions: 810 }
  ],
  Job: [
    { name: 'Mathematical Reasoning', progress: 70, topic: 'Percentage, Profit-Loss & Interest', totalQuestions: 500 },
    { name: 'English Language', progress: 64, topic: 'Idioms, Prepositions & Correction', totalQuestions: 610 },
    { name: 'General Knowledge', progress: 76, topic: 'Recent Economy & Org Affairs', totalQuestions: 540 },
    { name: 'Computer & Banking', progress: 82, topic: 'Financial Literacy & Software', totalQuestions: 480 }
  ]
};

const LEADERBOARD_TOPPERS = [
  { rank: 1, name: 'Tanvir Hossain', points: '28,450', goal: 'BCS 46th', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60' },
  { rank: 2, name: 'Sumi Akhtar', points: '26,890', goal: 'BUET Admission', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60' },
  { rank: 3, name: 'Naimur Rahman', points: '25,120', goal: 'HSC Science', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60' }
];

export const TakeUUpStudentDashboard: React.FC<TakeUUpStudentDashboardProps> = ({
  user,
  onUpdateUser,
  activeTab: externalActiveTab,
  onSelectTab: externalOnSelectTab,
  courses = [],
  mistakes = [],
  certificates = [],
  routineTasks = [
    { id: 'r1', task: 'Solve 15 Physics vector numerical problems', done: true, time: '09:00 AM' },
    { id: 'r2', task: 'Review BCS Bangladesh Affairs 1971 notes', done: false, time: '11:30 AM' },
    { id: 'r3', task: 'Take Daily Mock Test on General Science', done: false, time: '04:00 PM' },
    { id: 'r4', task: 'Participate in TakeUUp Live Group Study', done: false, time: '08:00 PM' }
  ],
  onToggleTask,
  onAddTask,
  onResolveMistake
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [internalActiveTab, setInternalActiveTab] = useState<string>('dashboard');
  const [qbankResetKey, setQbankResetKey] = useState<number>(0);
  const currentTab = externalActiveTab || internalActiveTab;

  const [activeGoalId, setActiveGoalId] = useState<string>(user?.studentClass?.includes('BCS') ? 'BCS' : user?.studentClass?.includes('Admission') ? 'Admission' : 'HSC');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<StudentCertificate | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showAccountDrawer, setShowAccountDrawer] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);

  const activeGoalProgress = DEFAULT_SUBJECT_PROGRESS[activeGoalId] || DEFAULT_SUBJECT_PROGRESS['HSC'];
  const unresolvedMistakesCount = (mistakes || []).filter(m => !m.resolved).length;
  const [localRoutineTasks, setLocalRoutineTasks] = useState(routineTasks);

  const completedRoutineTasksCount = (localRoutineTasks || []).filter((t: any) => t.done).length;
  const routinePercentage = Math.round((completedRoutineTasksCount / ((localRoutineTasks || []).length || 1)) * 100);

  const handleTabClick = (tabId: string) => {
    setMobileMenuOpen(false);
    if (tabId === 'qbank' || tabId === 'question-bank') {
      setQbankResetKey(prev => prev + 1);
      window.dispatchEvent(new CustomEvent('takeuup_reset_qbank'));
    }
    if (tabId === 'messages') { setMessengerOpen(true); }
    if (externalOnSelectTab) {
      externalOnSelectTab(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    
    const newTask = {
      id: `rt-${Date.now()}`,
      task: newTaskInput.trim(),
      done: false,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    setLocalRoutineTasks([...localRoutineTasks, newTask]);
    
    if (onAddTask) {
      onAddTask(newTaskInput.trim());
    }
    setNewTaskInput('');
  };

  const handleToggleTask = (id: string) => {
    setLocalRoutineTasks(localRoutineTasks.map((t: any) => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
    if (onToggleTask) {
      onToggleTask(id);
    }
  };

  const MENU_ITEMS = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড (Dashboard)', icon: LayoutGrid },
    { id: 'qbank', label: 'প্রশ্নব্যাংক (Question Bank)', icon: FileText },
    { id: 'courses', label: 'স্মার্ট লেসনস (Lessons)', icon: BookOpen },
    { id: 'quizzes', label: 'মক এক্সাম (Quizzes)', icon: Zap },
    { id: 'messages', label: 'মেসেজ ও ডাউট চ্যাট', icon: MessageSquare },
    { id: 'study-groups', label: 'স্টাডি গ্রুপ ও লার্নিং ক্লাব', icon: Users },
    { id: 'admission-predictor', label: 'এডমিশন প্রেডিক্টর ও ক্যালকুলেটর', icon: Calculator },
    { id: 'mistakes', label: 'হিস্ট্রি ও বুকমার্কস', icon: Bookmark },
    { id: 'mega-quiz', label: 'Friday Mega Quiz', icon: Trophy, highlight: true },
    { id: 'leaderboard', label: 'লিডারবোর্ড (Leaderboard)', icon: Crown },
    { id: 'certificates', label: 'সার্টিফিকেট ও ব্যাজ', icon: Award },
    { id: 'routine', label: 'স্টাডি রুটিন ও প্ল্যানার', icon: Calendar },
    { id: 'settings_goal', label: 'গোল পরিবর্তন (Goal Change)', icon: Target }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#080d1a] text-slate-100' : 'bg-[#f4f7fc] text-slate-800'} flex flex-col lg:flex-row font-sans antialiased`}>

      {/* MOBILE TOPBAR NAV */}
      <div className="lg:hidden bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="bg-white p-1 rounded-xl shadow border border-slate-200"><img src="/assets/takeuup_full_brand_logo.png" alt="TakeUp" className="h-7 w-auto object-contain" /></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-500/30">
            <Flame size={14} fill="currentColor" /> {user?.streak || 7}d
          </div>
          <button onClick={toggleTheme} className="p-2 bg-slate-800 text-slate-300 rounded-xl">
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* UNIFIED LEFT SIDEBAR - ALWAYS VISIBLE ACROSS ALL TABS */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen ${theme === 'dark' ? 'bg-[#0e1628]/95 border-slate-800/80' : 'bg-white border-slate-100'
        } border-r ${sidebarCollapsed ? 'w-20 p-3' : 'w-64 p-5'} flex flex-col justify-between backdrop-blur-xl transition-all duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shrink-0`}>

        <div className="space-y-5 overflow-y-auto custom-scrollbar pr-0.5">
          {/* Logo Brand Header */}
          <div className={`flex ${sidebarCollapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'} pb-4 border-b border-slate-100 dark:border-slate-800`}>
            <Link to="/" className="flex items-center gap-2 group overflow-hidden" title="TakeUp Student Portal">
              {sidebarCollapsed ? (
                <img src="/assets/takeuup_emblem_logo.png" alt="TakeUp" className="w-11 h-11 rounded-2xl object-contain shrink-0 hover:scale-105 transition-transform" />
              ) : (
                <div className="flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
                  <img src="/assets/takeuup_full_brand_logo.png" alt="TakeUp" className="h-10 w-auto object-contain" />
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:flex ${sidebarCollapsed ? 'w-full justify-center py-1 bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700' : 'p-2 bg-slate-50 text-slate-400 hover:text-cyan-500 border border-slate-100'} rounded-xl transition-colors shrink-0`}
              title={sidebarCollapsed ? "সাইডবার বড় করুন (Expand)" : "সাইডবার ফোল্ড করুন (Collapse)"}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>



          {/* Vertical Menu Navigation */}
          <nav className="space-y-1">
            <h5 className={`text-[10px] font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'} uppercase tracking-widest px-2 mb-2 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              LEARNING NAVIGATION
            </h5>

            {MENU_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (currentTab === 'overview' && item.id === 'dashboard');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabClick(item.id);
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'} rounded-xl text-xs transition-all ${isActive
                    ? 'bg-cyan-50 text-cyan-600 font-bold'
                    : item.highlight
                      ? 'bg-amber-50 text-amber-600 font-bold border border-amber-100 mt-2'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-cyan-500' : item.highlight ? 'text-amber-500' : 'text-slate-400'} />
                    {!sidebarCollapsed && <span className={`truncate`}>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.highlight && (
                    <span className="text-[9px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase">Live</span>
                  )}
                  {!sidebarCollapsed && item.id === 'messages' && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Student Target Goal & Membership Upgrade Widget (Bottom Sidebar) */}
          {!sidebarCollapsed && (
            <div className={`p-3 rounded-2xl border ${theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-100 text-slate-900 shadow-sm'
              } space-y-2.5 my-3 mt-8`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {user?.plan === 'free' ? 'FREE PLAN' : 'PRO PLAN'}
                </span>
              </div>

              <div className="font-bold text-xs text-slate-800 mb-2 truncate">
                {user?.activeGoalName || user?.targetGoal || user?.studentClass || 'বিসিএস / জবস - বিসিএস প্রিলিমিনারি'}
              </div>

              {user?.plan === 'free' ? (
                <button
                  onClick={() => handleTabClick('premium')}
                  className="w-full py-2.5 px-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                >
                  প্রো মেম্বারশিপ পান <Zap size={14} className="fill-current" />
                </button>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-emerald-600 font-bold pt-1 border-t border-slate-100">
                  <span>✓ সকল ফিচার আনলকড</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Theme Toggle & Account Settings Pill */}
        <div className={`pt-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} space-y-3`}>
          {/* Quick Theme Switcher (Outside for 1-click access) */}
          <div className="flex items-center justify-between px-2">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
              {theme === 'dark' ? <Moon size={16} className="text-slate-400" /> : <Sun size={16} className="text-amber-500" />}
              {!sidebarCollapsed && <span>{theme === 'dark' ? 'নাইট মোড' : 'ডে মোড'}</span>}
            </span>
            {!sidebarCollapsed && (
              <button
                onClick={toggleTheme}
                className={`w-9 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-slate-700' : 'bg-cyan-500'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-0' : 'translate-x-4'}`}></div>
              </button>
            )}
          </div>

          {/* Profile & Settings Pill Button */}
          <button
            onClick={() => setShowAccountDrawer(true)}
            className={`w-full p-2 rounded-2xl ${theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-200'
              : 'bg-white border-transparent hover:bg-slate-50 text-slate-900'
              } transition-all flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'
              } group`}
            title="TakeUUp সেটিংস সেন্টার"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'MO'}
              </div>
              {!sidebarCollapsed && (
                <div className="text-left overflow-hidden">
                  <h4 className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-800'} truncate leading-tight`}>
                    {user?.name?.split(' ')[0] || 'Mostafiz'}
                  </h4>
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} block truncate`}>
                    {user?.studentClass || 'বিসিএস / জবস'}
                  </span>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <div className="text-slate-400 hover:text-slate-600">
                <Settings size={14} />
              </div>
            )}
          </button>
        </div>

      </aside>

      {/* DYNAMIC RIGHT MAIN WORKSPACE */}
      <main className="flex-1 min-w-0 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">

        {/* PREMIUM PRO MEMBERSHIP PORTAL */}
        {currentTab === 'premium' && (
          <TakeUUpPremiumPortal
            user={user}
            onBack={() => handleTabClick('dashboard')}
          />
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {(currentTab === 'dashboard' || currentTab === 'overview' || !currentTab) && (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* NEW TOP HEADER AREA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${theme === 'dark' ? 'bg-cyan-900/30 text-cyan-300' : 'bg-cyan-50 text-cyan-700'
                } text-xs font-semibold`}>
                <Sparkles size={14} className="text-cyan-500" />
                <span>TakeUp Smart Student Hub</span>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm border border-slate-100">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>
                <div
                  onClick={() => setShowAccountDrawer(true)}
                  className={`flex items-center gap-2.5 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'} pr-5 pl-1.5 py-1.5 rounded-full shadow-sm border cursor-pointer transition-all`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'MO'}
                  </div>
                  <div className="hidden sm:flex flex-col justify-center text-left">
                    <h4 className={`font-bold text-sm leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      {user?.name || user?.displayName || 'Mostafizur Rahman'}
                    </h4>
                    <span className={`text-[10px] font-medium leading-tight ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      1Boys International-B
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* HERO WELCOME BANNER & STATS */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">

              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  স্বাগতম, {user?.name?.split(' ')[0] || 'Mostafiz'}! 🚀
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} leading-relaxed font-medium max-w-xl`}>
                  তোমার <strong className="text-slate-700">{user?.targetGoal || 'BCS & Admission Preparation'}</strong> টার্গেটের আজকের সিলেবাস আপডেট প্রস্তুত। প্রস্তুতি যাচাই করতে মক টেস্ট অথবা মিস্টেক ব্যাংক রিভিশন শুরু করো।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex-1 lg:flex-initial min-w-[120px]">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Flame size={20} className="text-orange-500 fill-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800 leading-none">{user?.streak || 7} দিন</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">স্ট্রিক বজায়</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex-1 lg:flex-initial min-w-[120px]">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800 leading-none">{(user?.points || 23400).toLocaleString()}</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">মোট পয়েন্ট</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex-1 lg:flex-initial min-w-[120px]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Crown size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800 leading-none">#{user?.rank || 12}</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Top 1% অবস্থান</p>
                  </div>
                </div>
              </div>

            </div>

            {/* TWO BANNERS (TARGET & MEGA QUIZ) */}
            <div className="flex flex-col md:flex-row gap-4">

              {/* Target Goal Banner */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex-1 max-w-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full">
                    <Target size={14} className="text-rose-500" /> সক্রিয় প্রস্তুতি টার্গেট
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check size={12} /> রানিং গোল
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="text-lg font-black text-slate-800">
                    {user?.activeGoalName || user?.studentClass || 'বিসিএস / জবস - বিসিএস প্রিলিমিনারি'}
                  </h3>
                  <p className="text-[10px] text-slate-500">কাস্টম সিলেবাস প্ল্যানিং ও ডেইলি প্র্যাকটিস ট্র্যাক</p>
                </div>

                <button
                  onClick={() => handleTabClick('settings_goal')}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-bold flex items-center gap-1"
                >
                  গোল পরিবর্তন করতে সেটিংসে যান <ArrowRight size={14} />
                </button>
              </div>

              {/* Mega Quiz Banner */}
              <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-3xl p-6 shadow-sm flex-1 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <Trophy size={120} />
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold text-white border border-white/30">
                    <Trophy size={12} className="text-yellow-300" /> TAKEUP WEEKLY SHOWDOWN
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white">শুক্রবার রাত ৮:০০ টায় মেগা কুইজ!</h3>
                  <p className="text-xs text-teal-50 font-medium max-w-md">
                    ৫০টি বাছাইকৃত প্রশ্ন, সারা দেশের প্রতিযোগীদের সাথে লাইভ লড়াই ও মোট ৳৮৫,০০০ টাকার স্কলারশিপ প্রাইজ।
                  </p>
                </div>

                <button
                  onClick={() => handleTabClick('mega-quiz')}
                  className="px-5 py-2.5 bg-white text-cyan-700 font-black rounded-xl text-xs whitespace-nowrap shadow-md hover:scale-105 transition-transform relative z-10"
                >
                  এখনই রেজিস্ট্রেশন করুন ➔
                </button>
              </div>

            </div>

            {/* CORE LEARNING HUB (QUICK CARDS) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">

              <div
                onClick={() => handleTabClick('quizzes')}
                className="bg-white hover:bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all shadow-sm group"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-1">
                  <Zap size={20} className="fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">স্পিড কুইজ</h4>
                  <p className="text-[10px] text-slate-400">১০-প্রশ্নের ড্রিল</p>
                </div>
              </div>

              <div
                onClick={() => handleTabClick('mistakes')}
                className="bg-white hover:bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all shadow-sm group relative"
              >
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-1">
                  <X size={20} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Mistake Bank</h4>
                  <p className="text-[10px] text-rose-500 font-bold">{unresolvedMistakesCount || 2} ভুল উত্তর</p>
                </div>
              </div>

              <div
                onClick={() => handleTabClick('courses')}
                className="bg-white hover:bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all shadow-sm group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
                  <BookOpen size={20} className="fill-blue-500/20" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">স্মার্ট লেসনস</h4>
                  <p className="text-[10px] text-slate-400">রিভিশন ও শট</p>
                </div>
              </div>

              <div
                onClick={() => handleTabClick('qbank')}
                className="bg-white hover:bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all shadow-sm group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1">
                  <FileText size={20} className="fill-emerald-500/20" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">প্রশ্নব্যাংক</h4>
                  <p className="text-[10px] text-slate-400">আর্কাইভ ও সলভ</p>
                </div>
              </div>

              <div
                onClick={() => handleTabClick('mega-quiz')}
                className="bg-white hover:bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all shadow-sm group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-1">
                  <Trophy size={20} className="fill-purple-500/20" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">মেগা কুইজ</h4>
                  <p className="text-[10px] text-purple-500 font-bold">৳৫,০০০ প্রাইজ</p>
                </div>
              </div>

              <div
                onClick={() => handleTabClick('leaderboard')}
                className="bg-white hover:bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all shadow-sm group"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center mb-1">
                  <BarChart3 size={20} className="fill-cyan-500/20" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">লিডারবোর্ড</h4>
                  <p className="text-[10px] text-slate-400">শীর্ষ র‍্যাংকসমূহ</p>
                </div>
              </div>

            </div>

            {/* SUBJECT PREPARATION PROGRESS & ROUTINE PLANNER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 space-y-6">
                <div className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } border rounded-3xl p-6 shadow-xl space-y-5`}>
                  <div className={`flex items-center justify-between pb-3 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div>
                      <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <Target size={18} className="text-cyan-600 dark:text-cyan-400" />
                        বিষয়ভিত্তিক প্রস্তুতি ট্র্যাকার ({user?.activeGoalName || 'বিসিএস প্রিলিমিনারি'})
                      </h3>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>তোমার টার্গেটের অন্তর্গত প্রতিটি বিষয়ের রিভিশন এবং প্র্যাকটিস অগ্রগতি</p>
                    </div>
                    <button
                      onClick={() => handleTabClick('quizzes')}
                      className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      পরীক্ষা দাও <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activeGoalProgress.map((subject, idx) => {
                      const configs = [
                        { icon: <Atom size={24} className="text-purple-500" />, bg: "bg-purple-100 dark:bg-purple-500/20", barColor: "bg-purple-500 text-purple-600 dark:text-purple-400" },
                        { icon: <FlaskConical size={24} className="text-teal-500" />, bg: "bg-teal-100 dark:bg-teal-500/20", barColor: "bg-teal-500 text-teal-600 dark:text-teal-400" },
                        { icon: <Ruler size={24} className="text-amber-500" />, bg: "bg-amber-100 dark:bg-amber-500/20", barColor: "bg-amber-500 text-amber-600 dark:text-amber-400" },
                        { icon: <Dna size={24} className="text-emerald-500" />, bg: "bg-emerald-100 dark:bg-emerald-500/20", barColor: "bg-emerald-500 text-emerald-600 dark:text-emerald-400" },
                        { icon: <Globe size={24} className="text-indigo-500" />, bg: "bg-indigo-100 dark:bg-indigo-500/20", barColor: "bg-indigo-500 text-indigo-600 dark:text-indigo-400" },
                        { icon: <BookOpen size={24} className="text-pink-500" />, bg: "bg-pink-100 dark:bg-pink-500/20", barColor: "bg-pink-500 text-pink-600 dark:text-pink-400" }
                      ];
                      const config = configs[idx % configs.length];

                      return (
                        <div key={idx} className={`flex items-center gap-4 ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          } border p-4 rounded-2xl transition-colors`}>
                          {/* Column 1: Icon */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${config.bg}`}>
                            {config.icon}
                          </div>

                          {/* Column 2: Details */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{subject.name}</h4>
                              <span className={`text-[11px] font-bold ${config.barColor.split(' ')[1]}`}>Score: {subject.progress}%</span>
                            </div>
                            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} font-medium`}>রানিং টপিক: {subject.topic}</p>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{subject.totalQuestions} প্রশ্ন সমাধান</span>
                              <span className="text-slate-300 dark:text-slate-700">•</span>
                              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-500">
                                <Target size={10} />
                                {Math.round((subject.progress / 100) * subject.totalQuestions)} সঠিক উত্তর
                              </span>
                            </div>
                          </div>

                          {/* Column 3: Progress Bar */}
                          <div className="w-32 sm:w-40 shrink-0 mr-2 sm:mr-4">
                            <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden relative`}>
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${config.barColor.split(' ')[0]}`}
                                style={{ width: `${subject.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Column 4: Action Button */}
                          <div className="shrink-0">
                            <button
                              onClick={() => handleTabClick('quizzes')}
                              className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
                            >
                              <span className={config.barColor.split(' ')[1]}>অনুশীলন করুন</span> <ArrowRight size={14} className={config.barColor.split(' ')[1]} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              <div className="space-y-6">
                <div className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } border rounded-3xl p-6 shadow-xl space-y-4`}>
                  <div className={`flex items-center justify-between border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
                    <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                      <Calendar size={16} className="text-cyan-600 dark:text-cyan-400" />
                      আজকের স্টাডি রুটিন
                    </h3>
                    <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                      {routinePercentage}% সম্পন্ন
                    </span>
                  </div>

                  <div className={`w-full h-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300" style={{ width: `${routinePercentage}%` }}></div>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {localRoutineTasks.map((task: any) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${task.done
                          ? theme === 'dark' ? 'bg-emerald-955/20 border-emerald-800/40 text-slate-400 line-through' : 'bg-emerald-50 border-emerald-200 text-slate-500 line-through'
                          : theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-cyan-500/40' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-cyan-500/50'
                          }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${task.done ? 'bg-emerald-500 text-slate-950' : theme === 'dark' ? 'border border-slate-700' : 'border border-slate-300'
                            }`}>
                            {task.done && <Check size={14} />}
                          </div>
                          <span className="text-xs font-medium truncate">{task.task}</span>
                        </div>
                        <span className={`text-[9px] font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} shrink-0 whitespace-nowrap`}>
                          {task.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleCreateTask} className={`flex items-center gap-2 pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    <input
                      type="text"
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      placeholder="+ নতুন টাস্ক যোগ করুন"
                      className={`flex-1 bg-transparent border-none focus:ring-0 outline-none ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'
                        } text-xs`}
                    />
                    <button
                      type="submit"
                      disabled={!newTaskInput.trim()}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${newTaskInput.trim()
                        ? theme === 'dark' ? 'bg-cyan-500 text-slate-950' : 'bg-cyan-600 text-white'
                        : theme === 'dark' ? 'bg-slate-800 text-slate-600' : 'bg-slate-200 text-slate-400'
                        }`}
                    >
                      <Plus size={16} />
                    </button>
                  </form>
                </div>

                <div className={`${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } border rounded-3xl p-6 shadow-xl space-y-4`}>
                  <div className={`flex items-center justify-between border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
                    <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                      <Crown size={16} className="text-amber-500" />
                      সপ্তাহের শীর্ষ প্রতিযোগী
                    </h3>
                    <button
                      onClick={() => handleTabClick('leaderboard')}
                      className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                    >
                      সবগুলো দেখুন ➔
                    </button>
                  </div>

                  <div className="space-y-3">
                    {LEADERBOARD_TOPPERS.map((topper) => (
                      <div key={topper.rank} className={`flex items-center justify-between p-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                        } border`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${topper.rank === 1 ? 'bg-amber-400 text-slate-950' : topper.rank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                            }`}>
                            #{topper.rank}
                          </div>
                          <img src={topper.avatar} alt={topper.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                          <div>
                            <h4 className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{topper.name}</h4>
                            <span className="text-[10px] text-slate-500">{topper.goal}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-300">{topper.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: QUESTION BANK */}
        {currentTab === 'qbank' && (
          <div className="animate-in fade-in duration-300">
            <QuestionBank key={qbankResetKey} isEmbedded={true} />
          </div>
        )}

        {/* TAB 3: SMART LESSONS & LIVE CLASSROOMS */}
        {(currentTab === 'courses' || currentTab === 'smart-lessons') && (
          <div className="animate-in fade-in duration-300">
            <SmartLessons isEmbedded={true} user={user} />
          </div>
        )}

        {/* TAB 4: MOCK EXAMS / QUIZZES */}
        {(currentTab === 'quizzes' || currentTab === 'quiz') && (
          <div className="animate-in fade-in duration-300">
            <QuizInterface isEmbedded={true} />
          </div>
        )}

        {/* TAB 5: MISTAKE BANK */}
        {currentTab === 'mistakes' && (
          <div className="animate-in fade-in duration-300">
            <MistakeBank mistakes={mistakes} onResolveMistake={onResolveMistake || (() => { })} />
          </div>
        )}

        {/* TAB 6: FRIDAY MEGA QUIZ */}
        {currentTab === 'mega-quiz' && (
          <div className="animate-in fade-in duration-300">
            <MegaQuiz isEmbedded={true} />
          </div>
        )}

        {/* TAB 7: LEADERBOARD */}
        {currentTab === 'leaderboard' && (
          <div className="animate-in fade-in duration-300">
            <Leaderboard />
          </div>
        )}

        {/* TAB 8: CERTIFICATES - SCREENSHOT 1 FIX */}
        {currentTab === 'certificates' && (
          <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            } border rounded-3xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300`}>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <Award className="text-amber-500" /> Earned Course Certificates & Badges
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(certificates || []).map(cert => (
                <div key={cert.id} className={`${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  } border p-6 rounded-2xl space-y-4 flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Award className="text-amber-500" size={24} />
                      <span className="text-[10px] text-slate-500 font-mono">{cert.verificationCode}</span>
                    </div>
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-base`}>{cert.courseOrExamName}</h3>
                    <p className="text-xs text-slate-500">{cert.title} • Issued: {cert.issueDate}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCertificate(cert);
                      setShowCertModal(true);
                    }}
                    className={`w-full py-2.5 ${theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                      } font-bold border rounded-xl text-xs transition-colors flex items-center justify-center gap-2`}
                  >
                    View & Print Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: MESSAGES & DOUBT CHAT */}
        {currentTab === 'messages' && (
          <div className="animate-in fade-in duration-300">
            <StudentMessagesChat user={user} />
          </div>
        )}

        {/* TAB: STUDY GROUPS & LEARNING CLUBS */}
        {currentTab === 'study-groups' && (
          <div className="animate-in fade-in duration-300">
            <StudentStudyGroups user={user} />
          </div>
        )}

        {/* TAB: ADMISSION PREDICTOR & CALCULATOR */}
        {currentTab === 'admission-predictor' && (
          <div className="animate-in fade-in duration-300">
            <StudentAdmissionPredictor user={user} />
          </div>
        )}

        {/* TAB 9: ROUTINE PLANNER */}
        {currentTab === 'routine' && (
          <div className="animate-in fade-in duration-300">
            <StudyRoutinePlanner
              routineTasks={routineTasks}
              onToggleTask={onToggleTask}
              onAddTask={onAddTask}
            />
          </div>
        )}

        {/* TAB 10: GOAL CHANGE SETTINGS */}
        {currentTab === 'settings_goal' && (
          <GoalChangeSettingsView user={user} theme={theme} />
        )}

      </main>

      {/* MODALS */}
      <StudentProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        user={user}
        onUpdateUser={onUpdateUser || (() => { })}
      />

      {selectedCourse && (
        <CourseViewerModal
          isOpen={showCourseModal}
          onClose={() => setShowCourseModal(false)}
          course={selectedCourse}
          onToggleModule={() => { }}
        />
      )}

      {selectedCertificate && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          certificate={selectedCertificate}
        />
      )}

      <TakeUUpAccountDrawer
        isOpen={showAccountDrawer}
        onClose={() => setShowAccountDrawer(false)}
        user={user}
        onOpenProfileEdit={() => setShowProfileEditModal(true)}
        onSelectTab={handleTabClick}
      />

      {/* FLOATING GREEN CHAT BUBBLE WIDGET (Z-INDEX 9999) */}
      <FloatingMessengerWidget
        user={user}
        isOpenExternal={messengerOpen}
        onToggleExternal={() => setMessengerOpen(!messengerOpen)}
      />

    </div>
  );
};
