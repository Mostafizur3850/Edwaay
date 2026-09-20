import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Flame, Trophy, Target, Zap, BookOpen, Clock, ChevronRight, BrainCircuit, Atom,
  Calculator as CalcIcon, FlaskConical, Globe, Dna, CheckCircle2, TrendingUp,
  Briefcase, GraduationCap, Shield, X, Loader2, Sparkles, Calendar as CalendarIcon,
  FileText, Search, UserCheck, LayoutGrid, Database, Users, Video, Download,
  ArrowRight, PlayCircle, BarChart3, Star, Crown, Lock, PenTool, Layers,
  Settings, Bell, Timer, Languages, StickyNote, Gift, Rocket, Plus, User, Award,
  Check, Filter, RotateCcw, AlertCircle, MessageSquare, ChevronLeft, Menu, LogOut
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CourseViewerModal } from './components/CourseViewerModal';
import { CertificateModal } from './components/CertificateModal';
import { MistakeBank } from './components/MistakeBank';
import { StudyToolsModal } from './components/StudyToolsModal';
import { StudyGroupsAndMessaging } from './components/StudyGroupsAndMessaging';
import { StudentProfileEditModal } from './components/StudentProfileEditModal';
import { StudentUtilityTools } from './components/StudentUtilityTools';
import { TakeUUpStudentDashboard } from './components/TakeUUpStudentDashboard';
import { ProfileHub } from './ProfileHub';
import { QuizInterface } from '../quiz/QuizInterface';
import { MegaQuiz } from '../quiz/MegaQuiz';
import { QuestionBank } from '../quiz/QuestionBank';
import { Mentors } from '../mentors/Mentors';
import { Leaderboard } from '../leaderboard/Leaderboard';
import { createFeedback } from '../../services/api';
import { StudentCourse, StudentCertificate, StudentMistakeItem, User as UserType } from '../../types/types';

const SUBJECTS_BY_GOAL: Record<string, string[]> = {
  HSC: ['Physics', 'Chemistry', 'Higher Math', 'Biology', 'English', 'ICT', 'Bangla'],
  Admission: ['Physics', 'Chemistry', 'Math', 'Biology', 'English', 'General Knowledge'],
  BCS: ['Bangla Language & Lit', 'English Language & Lit', 'Bangladesh Affairs', 'International Affairs', 'General Science', 'Computer & ICT', 'Mathematical Reasoning', 'Mental Ability'],
  Job: ['Mathematical Reasoning', 'English Language', 'General Science', 'Computer & ICT', 'General Knowledge'],
  NTRCA: ['Bangla', 'English', 'Mathematics', 'General Knowledge']
};

const SUBJECT_ICONS: Record<string, any> = {
  'Physics': Atom,
  'Chemistry': FlaskConical,
  'Higher Math': CalcIcon,
  'Math': CalcIcon,
  'Mathematical Reasoning': CalcIcon,
  'Mental Ability': BrainCircuit,
  'Biology': Dna,
  'English': BookOpen,
  'English Language': BookOpen,
  'English Language & Lit': BookOpen,
  'Bangla': MessageSquare,
  'Bangla Language & Lit': MessageSquare,
  'General Knowledge': Globe,
  'Bangladesh Affairs': Award,
  'International Affairs': Globe,
  'General Science': Atom,
  'Computer & ICT': Globe,
  'ICT': Globe,
  'Mathematics': CalcIcon
};

const INITIAL_GOAL_PROGRESS: Record<string, Record<string, number>> = {
  HSC: {
    'Physics': 65,
    'Chemistry': 42,
    'Higher Math': 78,
    'Biology': 35,
    'English': 85,
    'ICT': 50,
    'Bangla': 90
  },
  Admission: {
    'Physics': 48,
    'Chemistry': 36,
    'Math': 55,
    'Biology': 30,
    'English': 72,
    'General Knowledge': 60
  },
  BCS: {
    'Bangla Language & Lit': 60,
    'English Language & Lit': 50,
    'Bangladesh Affairs': 75,
    'International Affairs': 40,
    'General Science': 65,
    'Computer & ICT': 55,
    'Mathematical Reasoning': 70,
    'Mental Ability': 80
  },
  Job: {
    'Mathematical Reasoning': 55,
    'English Language': 62,
    'General Science': 40,
    'Computer & ICT': 50,
    'General Knowledge': 68
  },
  NTRCA: {
    'Bangla': 70,
    'English': 58,
    'Mathematics': 65,
    'General Knowledge': 60
  }
};

interface StudentPortalProps {
  user: any;
  onUpdateUser: (newUser: any) => void;
}

const DEFAULT_COURSES: StudentCourse[] = [
  {
    id: 'course-1',
    title: 'Physics 1st Paper Complete Mastery',
    category: 'HSC',
    instructor: 'Dr. Zafar Ahmed',
    progressPercentage: 65,
    totalModules: 10,
    completedModules: 6,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60',
    modules: [
      { id: 'm-1', title: 'Vector Analysis & Calculus Basics', duration: '25 mins', type: 'video', completed: true },
      { id: 'm-2', title: 'Newtonian Mechanics Laws', duration: '30 mins', type: 'video', completed: true },
      { id: 'm-3', title: 'Work, Energy & Power Theorem', duration: '20 mins', type: 'video', completed: true },
      { id: 'm-4', title: 'Gravitation & Kepler Laws Sheet', duration: '15 mins', type: 'pdf', completed: true },
      { id: 'm-5', title: 'Structural Properties of Matter', duration: '35 mins', type: 'video', completed: true },
      { id: 'm-6', title: 'Periodic Motion & Oscillations', duration: '40 mins', type: 'video', completed: true },
      { id: 'm-7', title: 'Wave Optics & Interference', duration: '30 mins', type: 'video', completed: false },
      { id: 'm-8', title: 'Ideal Gas & Thermodynamics', duration: '25 mins', type: 'video', completed: false },
      { id: 'm-9', title: 'Formula Cheat Sheet PDF', duration: '10 mins', type: 'pdf', completed: false },
      { id: 'm-10', title: 'Final Chapter Master Quiz', duration: '20 mins', type: 'quiz', completed: false }
    ]
  },
  {
    id: 'course-2',
    title: 'BCS Preliminary General Knowledge Masterclass',
    category: 'BCS',
    instructor: 'Sakib Bin Rashid',
    progressPercentage: 40,
    totalModules: 8,
    completedModules: 3,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60',
    modules: [
      { id: 'b-1', title: 'Bangladesh Affairs: Liberation War 1971', duration: '45 mins', type: 'video', completed: true },
      { id: 'b-2', title: 'Constitution & Amendments Sheet', duration: '20 mins', type: 'pdf', completed: true },
      { id: 'b-3', title: 'International Organizations & UN', duration: '35 mins', type: 'video', completed: true },
      { id: 'b-4', title: 'Geography & Environment of Bangladesh', duration: '30 mins', type: 'video', completed: false },
      { id: 'b-5', title: 'Bangla Literature Pioneers', duration: '40 mins', type: 'video', completed: false },
      { id: 'b-6', title: 'English Grammar & Vocabulary Hacks', duration: '25 mins', type: 'video', completed: false },
      { id: 'b-7', title: 'Mental Ability & Analytical Math', duration: '30 mins', type: 'video', completed: false },
      { id: 'b-8', title: 'Full Length Model Test', duration: '60 mins', type: 'quiz', completed: false }
    ]
  }
];

const DEFAULT_MISTAKES_DATA: StudentMistakeItem[] = [
  {
    id: 'mst-1',
    subject: 'Math',
    questionText: 'Solve for x if 3x - 7 = 5x + 9.',
    options: ['x = 8', 'x = -8', 'x = 1', 'x = -1'],
    correctAnswerIndex: 1,
    userAnswerIndex: 0,
    explanation: 'Subtract 3x from both sides: -7 = 2x + 9. Subtract 9: -16 = 2x. Thus x = -8.',
    resolved: false,
    dateAdded: '2026-05-20'
  },
  {
    id: 'mst-2',
    subject: 'Bangladesh Affairs',
    questionText: 'Who was the first Prime Minister of Bangladesh?',
    options: ['Sheikh Mujibur Rahman', 'Tajuddin Ahmad', 'Syed Nazrul Islam', 'Captain M. Mansur Ali'],
    correctAnswerIndex: 1,
    userAnswerIndex: 0,
    explanation: 'Tajuddin Ahmad was appointed the first Prime Minister of Bangladesh on April 17, 1971.',
    resolved: false,
    dateAdded: '2026-05-21'
  },
  {
    id: 'mst-3',
    subject: 'Physics',
    questionText: 'What is the dimension of Planck\'s constant (h)?',
    options: ['[ML²T⁻¹]', '[MLT⁻²]', '[ML²T⁻²]', '[MLT⁻¹]'],
    correctAnswerIndex: 0,
    userAnswerIndex: 2,
    explanation: 'Planck\'s constant unit is J·s. Dimensionally: [ML²T⁻²] * [T] = [ML²T⁻¹].',
    resolved: true,
    dateAdded: '2026-05-18'
  }
];

const DEFAULT_CERTIFICATES: StudentCertificate[] = [
  {
    id: 'cert-1',
    title: 'Certificate of Course Mastery',
    courseOrExamName: 'Physics 1st Paper Fundamentals',
    issueDate: 'May 15, 2026',
    scoreOrGrade: '95% (Grade A+)',
    verificationCode: 'TKU-2026-PHYS-9841',
    studentName: 'Gazi Salahuddin'
  },
  {
    id: 'cert-2',
    title: 'Weekly Mega Quiz Topper Certificate',
    courseOrExamName: 'General Knowledge & Science Showdown',
    issueDate: 'May 18, 2026',
    scoreOrGrade: 'Rank #1 Overall',
    verificationCode: 'TKU-2026-QUIZ-4120',
    studentName: 'Gazi Salahuddin'
  }
];

const EXPLORE_CATEGORIES = [
  {
    id: 'hsc',
    title: 'HSC Academic',
    desc: 'Complete academic syllabus prep with chapter-wise quizzes and dynamic solutions.',
    icon: <BookOpen size={24} />,
    color: 'from-purple-500 to-pink-600',
    textColor: 'text-purple-400',
    badge: 'Academic'
  },
  {
    id: 'admission',
    title: 'University Admission',
    desc: 'Specialized programs for Engineering, Medical, and Guccho admission prep.',
    icon: <GraduationCap size={24} />,
    color: 'from-orange-500 to-red-600',
    textColor: 'text-orange-400',
    badge: 'Admission'
  },
  {
    id: 'bcs',
    title: 'BCS Preparation',
    desc: 'The ultimate guide to BCS Prelims with subject-wise mocks and study logs.',
    icon: <FileText size={24} />,
    color: 'from-green-500 to-emerald-600',
    textColor: 'text-green-400',
    badge: 'BCS'
  },
  {
    id: 'job-prep',
    title: 'Job Preparation',
    desc: 'Crack NTRCA, Primary, Bank Jobs and other competitive recruitment exams.',
    icon: <Briefcase size={24} />,
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-400',
    badge: 'Job Prep'
  }
];

export const StudentPortal: React.FC<StudentPortalProps> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Sidebar Menu State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper function to resolve active menu tab from URL hash/pathname
  const getTabFromUrl = () => {
    const hash = window.location.hash || location.pathname || '';
    if (hash.includes('/premium') || hash.includes('/pricing')) return 'premium';
    if (hash.includes('/dashboard') || hash.includes('/overview') || hash === '#/' || hash === '') return 'dashboard';
    if (hash.includes('/qbank') || hash.includes('/question-bank')) return 'qbank';
    if (hash.includes('/courses') || hash.includes('/smart-lessons') || hash.includes('/lessons')) return 'courses';
    if (hash.includes('/quizzes') || hash.includes('/quiz')) return 'quizzes';
    if (hash.includes('/messages')) return 'messages';
    if (hash.includes('/study-groups')) return 'study-groups';
    if (hash.includes('/admission-predictor')) return 'admission-predictor';
    if (hash.includes('/mega-quiz')) return 'mega-quiz';
    if (hash.includes('/leaderboard')) return 'leaderboard';
    if (hash.includes('/mistakes') || hash.includes('/history')) return 'mistakes';
    if (hash.includes('/certificates')) return 'certificates';
    if (hash.includes('/routine')) return 'routine';
    if (hash.includes('/profile')) return 'profile';
    return 'overview';
  };

  // Active Menu Navigation State
  const [activeMenu, setActiveMenu] = useState<any>(getTabFromUrl);

  useEffect(() => {
    const tab = getTabFromUrl();
    setActiveMenu(tab as any);
  }, [location.pathname, location.hash]);

  // Target Goals & Subject Progress States
  const [targetGoals, setTargetGoals] = useState<string[]>(() => {
    if (user.targetGoalsJson) {
      try {
        return JSON.parse(user.targetGoalsJson);
      } catch (e) {}
    }
    const saved = localStorage.getItem('takeuup_student_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [user.studentClass || 'HSC'];
  });

  const [activeGoal, setActiveGoal] = useState<string>(() => {
    const saved = localStorage.getItem('takeuup_active_goal');
    if (saved && ['HSC', 'Admission', 'BCS', 'Job', 'NTRCA'].includes(saved)) {
      return saved;
    }
    return user.studentClass || 'HSC';
  });

  const [goalProgress, setGoalProgress] = useState<Record<string, Record<string, number>>>(() => {
    if (user.goalProgressJson) {
      try {
        return JSON.parse(user.goalProgressJson);
      } catch (e) {}
    }
    const saved = localStorage.getItem('takeuup_student_goal_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_GOAL_PROGRESS;
  });

  const [showAddGoalDropdown, setShowAddGoalDropdown] = useState(false);

  // Load categories and subjects dynamically from the API on mount
  useEffect(() => {
    const loadCategoriesAndSubjects = async () => {
      try {
        const { fetchQuizCategories, fetchQuizSubjects } = await import('../../services/api');
        const cats = await fetchQuizCategories();
        if (cats && cats.length > 0) {
          setDynamicCategories(cats);
          
          const subjectsMap: Record<string, string[]> = {};
          for (const cat of cats) {
            const subs = await fetchQuizSubjects(cat.id);
            const mappedSubs = subs && subs.length > 0 
              ? subs.map((s: any) => s.name) 
              : (SUBJECTS_BY_GOAL[cat.name] || SUBJECTS_BY_GOAL[cat.slug] || ['General']);
            subjectsMap[cat.name] = mappedSubs;
          }
          setDynamicSubjects(subjectsMap);
        } else {
          setDynamicCategories([
            { id: '1', name: 'HSC', slug: 'hsc' },
            { id: '2', name: 'Admission', slug: 'admission' },
            { id: '3', name: 'BCS', slug: 'bcs' },
            { id: '4', name: 'Job', slug: 'job' },
            { id: '5', name: 'NTRCA', slug: 'ntrca' }
          ]);
          setDynamicSubjects(SUBJECTS_BY_GOAL);
        }
      } catch (e) {
        console.error("Failed to load categories/subjects dynamically, using fallback", e);
        setDynamicCategories([
          { id: '1', name: 'HSC', slug: 'hsc' },
          { id: '2', name: 'Admission', slug: 'admission' },
          { id: '3', name: 'BCS', slug: 'bcs' },
          { id: '4', name: 'Job', slug: 'job' },
          { id: '5', name: 'NTRCA', slug: 'ntrca' }
        ]);
        setDynamicSubjects(SUBJECTS_BY_GOAL);
      }
    };
    loadCategoriesAndSubjects();
  }, []);

  // Synchronize when user.studentClass changes in profile modal
  useEffect(() => {
    if (user.studentClass && !targetGoals.includes(user.studentClass)) {
      const updated = [...targetGoals, user.studentClass];
      setTargetGoals(updated);
      localStorage.setItem('takeuup_student_goals', JSON.stringify(updated));
      setActiveGoal(user.studentClass);
      localStorage.setItem('takeuup_active_goal', user.studentClass);
      
      if (!unlockedGoals.includes(user.studentClass)) {
        const updatedUnlocked = [...unlockedGoals, user.studentClass];
        setUnlockedGoals(updatedUnlocked);
        localStorage.setItem('takeuup_unlocked_goals', JSON.stringify(updatedUnlocked));
      }
    }
  }, [user.studentClass]);

  const handleAddGoal = (goal: string) => {
    setShowAddGoalDropdown(false);
    if (targetGoals.includes(goal)) return;

    if (unlockedGoals.includes(goal)) {
      const updated = [...targetGoals, goal];
      setTargetGoals(updated);
      localStorage.setItem('takeuup_student_goals', JSON.stringify(updated));
      setActiveGoal(goal);
      localStorage.setItem('takeuup_active_goal', goal);
    } else {
      setPurchasingGoal(goal);
      setPaymentPhase('package');
      setSelectedPackage('monthly');
      setPaymentPhone('');
      setPaymentOTP('');
      setPaymentPIN('');
      setIsProcessingPayment(false);
    }
  };

  const handleRemoveGoal = (goal: string) => {
    const updated = targetGoals.filter(g => g !== goal);
    if (updated.length > 0) {
      setTargetGoals(updated);
      localStorage.setItem('takeuup_student_goals', JSON.stringify(updated));
      if (activeGoal === goal) {
        setActiveGoal(updated[0]);
        localStorage.setItem('takeuup_active_goal', updated[0]);
      }
    }
  };

  const handleUpdateProgress = (goal: string, subject: string, percent: number) => {
    setGoalProgress(prev => {
      const updated = {
        ...prev,
        [goal]: {
          ...(prev[goal] || {}),
          [subject]: percent
        }
      };
      localStorage.setItem('takeuup_student_goal_progress', JSON.stringify(updated));
      return updated;
    });
  };

  // Courses State
  const [courses, setCourses] = useState<StudentCourse[]>(() => {
    const saved = localStorage.getItem('takeuup_student_courses');
    return saved ? JSON.parse(saved) : DEFAULT_COURSES;
  });

  // Selected Course Viewer Modal
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Mistakes State
  const [mistakes, setMistakes] = useState<StudentMistakeItem[]>(() => {
    if (user.mistakesJson) {
      try {
        return JSON.parse(user.mistakesJson);
      } catch (e) {}
    }
    const saved = localStorage.getItem('takeuup_student_mistakes');
    return saved ? JSON.parse(saved) : DEFAULT_MISTAKES_DATA;
  });

  // Certificates State
  const [certificates, setCertificates] = useState<StudentCertificate[]>(() => {
    const saved = localStorage.getItem('takeuup_student_certificates');
    return saved ? JSON.parse(saved) : DEFAULT_CERTIFICATES;
  });
  const [selectedCertificate, setSelectedCertificate] = useState<StudentCertificate | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  // Tools Modal State
  const [activeTool, setActiveTool] = useState<'calculator' | 'timer' | 'flashcards' | 'notes' | null>(null);

  // Profile Edit Modal State
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // Routine Checklist State
  const [routineTasks, setRoutineTasks] = useState<any[]>(() => {
    if (user.routineTasksJson) {
      try {
        return JSON.parse(user.routineTasksJson);
      } catch (e) {}
    }
    const saved = localStorage.getItem('takeuup_student_routine');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 'r1', task: 'Solve 15 Physics vector numerical problems', done: true, time: '09:00 AM' },
      { id: 'r2', task: 'Review BCS Bangladesh Affairs 1971 notes', done: false, time: '11:30 AM' },
      { id: 'r3', task: 'Take Daily Mock Test on General Science', done: false, time: '04:00 PM' },
      { id: 'r4', task: 'Participate in Group Study discussion', done: false, time: '08:00 PM' }
    ];
  });
  const [newTaskInput, setNewTaskInput] = useState('');

  // Reminders Schedule State
  const [reminders, setReminders] = useState([
    { id: 'rem-1', title: 'Friday Weekly Mega Quiz Showdown', date: '2026-05-29', time: '8:00 PM', type: 'quiz' },
    { id: 'rem-2', title: 'Physics Formula Live Revision', date: '2026-05-26', time: '10:00 AM', type: 'class' },
    { id: 'rem-3', title: 'Math Mock Exam Practice', date: '2026-05-27', time: '04:00 PM', type: 'revision' }
  ]);
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemDate, setNewRemDate] = useState('');

  // Dynamic categories list loaded from API
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [dynamicSubjects, setDynamicSubjects] = useState<Record<string, string[]>>({});
  const [unlockedGoals, setUnlockedGoals] = useState<string[]>(() => {
    if (user.unlockedGoalsJson) {
      try {
        return JSON.parse(user.unlockedGoalsJson);
      } catch (e) {}
    }
    const saved = localStorage.getItem('takeuup_unlocked_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [user.studentClass || 'HSC'];
  });

  // Modal active states
  const [activeSubjectDetails, setActiveSubjectDetails] = useState<{ goal: string; subject: string } | null>(null);
  const [purchasingGoal, setPurchasingGoal] = useState<string | null>(null);
  const [paymentPhase, setPaymentPhase] = useState<'package' | 'number' | 'otp' | 'pin' | 'success'>('package');
  const [selectedPackage, setSelectedPackage] = useState<string>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentOTP, setPaymentOTP] = useState('');
  const [paymentPIN, setPaymentPIN] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Sync local storage backups
  useEffect(() => {
    localStorage.setItem('takeuup_student_goals', JSON.stringify(targetGoals));
  }, [targetGoals]);

  useEffect(() => {
    localStorage.setItem('takeuup_unlocked_goals', JSON.stringify(unlockedGoals));
  }, [unlockedGoals]);

  useEffect(() => {
    localStorage.setItem('takeuup_student_goal_progress', JSON.stringify(goalProgress));
  }, [goalProgress]);

  useEffect(() => {
    localStorage.setItem('takeuup_student_routine', JSON.stringify(routineTasks));
  }, [routineTasks]);

  useEffect(() => {
    localStorage.setItem('takeuup_student_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  // Sync state changes back to backend database profile
  useEffect(() => {
    if (!user || user.name === 'Demo Student' || user.name === 'Gazi Salahuddin') return;

    const syncToBackend = async () => {
      try {
        const { updateUserProfile } = await import('../../services/api');
        await updateUserProfile({
          name: user.name || user.displayName || 'Student',
          targetGoalsJson: JSON.stringify(targetGoals),
          unlockedGoalsJson: JSON.stringify(unlockedGoals),
          goalProgressJson: JSON.stringify(goalProgress),
          routineTasksJson: JSON.stringify(routineTasks),
          mistakesJson: JSON.stringify(mistakes)
        });
      } catch (e) {
        console.error("Failed to sync student data to backend", e);
      }
    };
    
    const timer = setTimeout(syncToBackend, 1500);
    return () => clearTimeout(timer);
  }, [targetGoals, unlockedGoals, goalProgress, routineTasks, mistakes, user]);

  const handleToggleModule = (courseId: string, moduleId: string) => {
    const updatedCourses = courses.map(c => {
      if (c.id === courseId) {
        const updatedModules = c.modules.map(m => m.id === moduleId ? { ...m, completed: !m.completed } : m);
        const completedCount = updatedModules.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedModules.length) * 100);
        return {
          ...c,
          modules: updatedModules,
          completedModules: completedCount,
          progressPercentage: progress
        };
      }
      return c;
    });

    setCourses(updatedCourses);
    localStorage.setItem('takeuup_student_courses', JSON.stringify(updatedCourses));
    if (selectedCourse?.id === courseId) {
      setSelectedCourse(updatedCourses.find(c => c.id === courseId) || null);
    }
  };

  const handleResolveMistake = (id: string) => {
    const updated = mistakes.map(m => m.id === id ? { ...m, resolved: true } : m);
    setMistakes(updated);
    localStorage.setItem('takeuup_student_mistakes', JSON.stringify(updated));
  };

  const handleToggleTask = (id: string) => {
    setRoutineTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setRoutineTasks(prev => [
      ...prev,
      { id: `r-${Date.now()}`, task: newTaskInput, done: false, time: 'Today' }
    ]);
    setNewTaskInput('');
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim() || !newRemDate) return;
    setReminders(prev => [
      ...prev,
      { id: `rem-${Date.now()}`, title: newRemTitle, date: newRemDate, time: '08:00 PM', type: 'quiz' }
    ]);
    setNewRemTitle('');
    setNewRemDate('');
  };

  const completedRoutineTasks = routineTasks.filter(t => t.done).length;
  const routineProgress = Math.round((completedRoutineTasks / (routineTasks.length || 1)) * 100);

  const MENU_ITEMS = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutGrid },
    { id: 'courses', label: 'Offered Courses & Lessons', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes & Mock Exams', icon: Zap },
    { id: 'mega-quiz', label: 'Friday Mega Quiz (8 PM)', icon: Trophy, highlight: true },
    { id: 'leaderboard', label: 'Leaderboard Legends', icon: Crown },
    { id: 'qbank', label: 'Question Bank Archive', icon: Database },
    { id: 'mistakes', label: 'Mistake Bank (ভুল উত্তর)', icon: BrainCircuit },
    { id: 'groups', label: 'Study Circles & Messaging', icon: Users, proLocked: user.plan === 'free' },
    { id: 'tools', label: 'Digital Study Tools', icon: CalcIcon },
    { id: 'mentors', label: 'Find a Mentor', icon: UserCheck },
    { id: 'routine', label: 'Routine & Schedule', icon: CalendarIcon },
    { id: 'certificates', label: 'Certificates & Badges', icon: Award },
    { id: 'career', label: 'Career & Job Center', icon: Briefcase },
    { id: 'profile', label: 'My Profile & Settings', icon: User },
    { id: 'feedback', label: 'Give Feedback (মতামত)', icon: MessageSquare },
  ];

  return (
    <TakeUUpStudentDashboard
      user={user}
      onUpdateUser={onUpdateUser}
      activeTab={activeMenu}
      onSelectTab={(tab) => {
        if (tab === 'qbank') {
          window.dispatchEvent(new CustomEvent('takeuup_reset_qbank'));
        }
        setActiveMenu(tab as any);
        const routeMap: Record<string, string> = {
          'overview': '/dashboard',
          'dashboard': '/dashboard',
          'premium': '/premium',
          'qbank': '/question-bank',
          'courses': '/smart-lessons',
          'quizzes': '/quizzes',
          'messages': '/messages',
          'study-groups': '/study-groups',
          'admission-predictor': '/admission-predictor',
          'mistakes': '/mistakes',
          'mega-quiz': '/mega-quiz',
          'leaderboard': '/leaderboard',
          'certificates': '/certificates',
          'routine': '/routine',
          'profile': '/profile'
        };
        const targetRoute = routeMap[tab] || '/dashboard';
        navigate(targetRoute);
      }}
      courses={courses}
      mistakes={mistakes}
      certificates={certificates}
      routineTasks={routineTasks}
      onToggleTask={handleToggleTask}
      onAddTask={(taskText) => {
        setRoutineTasks(prev => [
          ...prev,
          { id: `r-${Date.now()}`, task: taskText, done: false, time: 'Today' }
        ]);
      }}
      onResolveMistake={handleResolveMistake}
    />
  );
};
