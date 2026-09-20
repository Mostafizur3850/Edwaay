import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, Plus, Trash2, 
  Sun, Moon, Sunset, Check
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface RoutineTask {
  id: string;
  task: string;
  subject: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  timeDisplay: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
  day: string;
}

interface StudyRoutinePlannerProps {
  routineTasks?: any[];
  onToggleTask?: (id: string) => void;
  onAddTask?: (taskText: string) => void;
}

const WEEK_DAYS = [
  { id: 'Saturday', label: 'শনিবার' },
  { id: 'Sunday', label: 'রবিবার' },
  { id: 'Monday', label: 'সোমবার' },
  { id: 'Tuesday', label: 'মঙ্গলবার' },
  { id: 'Wednesday', label: 'বুধবার' },
  { id: 'Thursday', label: 'বৃহস্পতিবার' },
  { id: 'Friday', label: 'শুক্রবার' }
];

const INITIAL_ROUTINE_TASKS: RoutineTask[] = [
  {
    id: 'rt-1',
    task: 'পদার্থবিজ্ঞান ১ম পত্র: ভেক্টর গাণিতিক সমস্যার ১৫টি সমাধান',
    subject: 'পদার্থবিজ্ঞান',
    timeSlot: 'morning',
    timeDisplay: '০৮:০০ AM - ১০:০০ AM',
    done: true,
    priority: 'high',
    day: 'Saturday'
  },
  {
    id: 'rt-2',
    task: 'রসায়ন ২য় পত্র: পরিবেশ রসায়ন অধ্যায়ের শর্ট নোট রিভিশন',
    subject: 'রসায়ন',
    timeSlot: 'morning',
    timeDisplay: '১০:৩০ AM - ১২:০০ PM',
    done: false,
    priority: 'medium',
    day: 'Saturday'
  },
  {
    id: 'rt-3',
    task: 'উচ্চতর গণিত: ম্যাট্রিক্স ও নির্ণায়ক ৫০টি MCQ সলভ',
    subject: 'উচ্চতর গণিত',
    timeSlot: 'afternoon',
    timeDisplay: '০২:৩০ PM - ০৪:৩০ PM',
    done: false,
    priority: 'high',
    day: 'Saturday'
  },
  {
    id: 'rt-4',
    task: 'জীববিজ্ঞান: মানব শারীরতত্ত্ব লাইভ ক্লাস লাইব্রেরি দেখা',
    subject: 'জীববিজ্ঞান',
    timeSlot: 'evening',
    timeDisplay: '০৭:৩০ PM - ০৯:০০ PM',
    done: false,
    priority: 'medium',
    day: 'Saturday'
  },
  {
    id: 'rt-5',
    task: 'English Grammar: Rules of Right Forms of Verbs ৫০টি MCQ',
    subject: 'English',
    timeSlot: 'evening',
    timeDisplay: '০৯:৩০ PM - ১১:০০ PM',
    done: false,
    priority: 'low',
    day: 'Saturday'
  }
];

export const StudyRoutinePlanner: React.FC<StudyRoutinePlannerProps> = () => {
  const { theme } = useTheme();
  const [selectedDay, setSelectedDay] = useState<string>('Saturday');
  const [tasks, setTasks] = useState<RoutineTask[]>(INITIAL_ROUTINE_TASKS);
  
  // New Task Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newSubject, setNewSubject] = useState('পদার্থবিজ্ঞান');
  const [newTimeSlot, setNewTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newTimeDisplay, setNewTimeDisplay] = useState('০৯:০০ AM');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const toggleTaskDone = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTaskItem: RoutineTask = {
      id: `rt-${Date.now()}`,
      task: newTaskTitle.trim(),
      subject: newSubject,
      timeSlot: newTimeSlot,
      timeDisplay: newTimeDisplay.trim() || '০৯:০০ AM',
      done: false,
      priority: newPriority,
      day: selectedDay
    };

    setTasks(prev => [...prev, newTaskItem]);
    setNewTaskTitle('');
    setShowAddForm(false);
  };

  const dayTasks = tasks.filter(t => t.day === selectedDay || !t.day);
  const completedDayTasks = dayTasks.filter(t => t.done).length;
  const dayProgressPercentage = dayTasks.length > 0 ? Math.round((completedDayTasks / dayTasks.length) * 100) : 0;

  const morningTasks = dayTasks.filter(t => t.timeSlot === 'morning');
  const afternoonTasks = dayTasks.filter(t => t.timeSlot === 'afternoon');
  const eveningTasks = dayTasks.filter(t => t.timeSlot === 'evening');

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* 1. HEADER BANNER */}
      <div className={`relative overflow-hidden rounded-3xl ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-955 to-slate-950 border-cyan-500/30' 
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 border-blue-500/20 shadow-xl'
      } border p-6 lg:p-8 shadow-2xl`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
              isDark ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-white/20 text-white border-white/30'
            } text-xs font-bold border`}>
              <CalendarIcon size={14} className={isDark ? 'text-cyan-400' : 'text-white'} />
              <span>TakeUUp Smart Daily Planner & Checklist</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              স্মার্ট <span className={isDark ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent' : 'text-cyan-200'}>স্টাডি রুটিন ও প্ল্যানার 📅</span>
            </h1>

            <p className={`text-xs lg:text-sm ${isDark ? 'text-slate-200' : 'text-blue-50'} leading-relaxed font-medium`}>
              আপনার পড়া সময়সূচী সাজান, দৈনন্দিন লক্ষ্য ট্র্যাক করুন এবং ধারাবাহিক স্টাডি ট্র্যাকিং বজায় রাখুন।
            </p>
          </div>

          {/* Routine Progress Widget */}
          <div className={`${isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 backdrop-blur-md border-white/50 text-slate-900 shadow-xl'} border p-5 rounded-3xl space-y-3 shrink-0 w-full lg:w-72`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase`}>আজকের অগ্রগতি</span>
              <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">{dayProgressPercentage}%</span>
            </div>

            <div className={`w-full h-3 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} rounded-full overflow-hidden border p-0.5`}>
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${dayProgressPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} p-2 rounded-xl border`}>
                <span className="text-[10px] text-slate-500 font-bold block">সম্পন্ন</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{completedDayTasks}টি টাস্ক</span>
              </div>
              <div className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} p-2 rounded-xl border`}>
                <span className="text-[10px] text-slate-500 font-bold block">বাকি</span>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400">{dayTasks.length - completedDayTasks}টি টাস্ক</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WEEKDAY SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar justify-start lg:justify-center">
        {WEEK_DAYS.map(day => {
          const isActive = selectedDay === day.id;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/25 scale-105'
                  : isDark 
                  ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <CalendarIcon size={14} /> {day.label}
            </button>
          );
        })}
      </div>

      {/* 3. TIME SLOT SECTIONS */}
      <div className="space-y-6">
        
        {/* Action Header */}
        <div className={`flex items-center justify-between border-b ${isDark ? 'border-slate-800' : 'border-slate-300'} pb-3`}>
          <h2 className={`text-base lg:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
            <Clock size={20} className="text-cyan-600 dark:text-cyan-400" />
            {WEEK_DAYS.find(d => d.id === selectedDay)?.label} এর পড়া সূচি
          </h2>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus size={16} /> নতুন টাস্ক যোগ করুন
          </button>
        </div>

        {/* Add Task Form Modal / Collapse */}
        {showAddForm && (
          <form onSubmit={handleAddNewTask} className={`${
            isDark ? 'bg-slate-900 border-cyan-500/40' : 'bg-white border-cyan-400 shadow-xl'
          } border p-5 lg:p-6 rounded-3xl shadow-2xl space-y-4 animate-in fade-in`}>
            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-sm flex items-center gap-2`}>
              <Plus size={16} className="text-cyan-500" /> নতুন পড়া টাস্ক যুক্ত করুন
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="md:col-span-2 space-y-1">
                <label className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-bold`}>টাস্ক এর বিবরণ</label>
                <input
                  type="text"
                  placeholder="যেমন: পদার্থবিজ্ঞান ৩টি গাণিতিক সমস্যা সমাধান..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-bold`}>বিষয়</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500 font-bold`}
                >
                  {['পদার্থবিজ্ঞান', 'রসায়ন', 'উচ্চতর গণিত', 'জীববিজ্ঞান', 'বাংলা', 'English', 'আইসিটি', 'সাধারণ জ্ঞান'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-bold`}>সময় স্লট (Time Slot)</label>
                <select
                  value={newTimeSlot}
                  onChange={e => setNewTimeSlot(e.target.value as any)}
                  className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500 font-bold`}
                >
                  <option value="morning">🌅 সকাল (Morning Slot)</option>
                  <option value="afternoon">☀️ দুপুর (Afternoon Slot)</option>
                  <option value="evening">🌙 রাত (Evening Slot)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-bold`}>সময়সীমা টেক্সট</label>
                <input
                  type="text"
                  placeholder="যেমন: ০৯:০০ AM - ১১:০০ AM"
                  value={newTimeDisplay}
                  onChange={e => setNewTimeDisplay(e.target.value)}
                  className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
                />
              </div>

              <div className="space-y-1">
                <label className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-bold`}>অগ্রাধিকার (Priority)</label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as any)}
                  className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500 font-bold`}
                >
                  <option value="high">🔥 জরুরী (High Priority)</option>
                  <option value="medium">⚡ সাধারণ (Medium)</option>
                  <option value="low">🟢 সুবিধাজনক (Low)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`px-4 py-2 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} rounded-xl text-xs font-bold`}
              >
                বাতিল
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black"
              >
                টাস্ক সেভ করুন
              </button>
            </div>
          </form>
        )}

        {/* TIME BLOCKS LIST */}
        <div className="space-y-6">
          
          {/* SLOT 1: 🌅 MORNING */}
          <div className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} border rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl`}>
            <div className={`flex items-center gap-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
              <Sun size={20} className="text-amber-500" />
              <h3 className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-base`}>সকালের স্লট (Morning Slot • 07:00 AM - 12:00 PM)</h3>
            </div>

            {morningTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">সকালের স্লটে কোনো টাস্ক সেট করা নেই</p>
            ) : (
              <div className="space-y-3">
                {morningTasks.map(t => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      t.done 
                        ? isDark ? 'bg-emerald-955/30 border-emerald-800/40 text-slate-400 line-through' : 'bg-emerald-50 border-emerald-200 text-slate-500 line-through' 
                        : isDark ? 'bg-slate-950 border-slate-800 text-white hover:border-cyan-500/40' : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <button
                        onClick={() => toggleTaskDone(t.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          t.done ? 'bg-emerald-500 text-slate-950' : isDark ? 'border border-slate-700 hover:border-cyan-400' : 'border border-slate-300 hover:border-cyan-600'
                        }`}
                      >
                        {t.done && <Check size={14} className="stroke-[3]" />}
                      </button>

                      <div>
                        <h4 className="font-bold text-xs lg:text-sm">{t.task}</h4>
                        <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">{t.subject}</span>
                          <span>•</span>
                          <span>{t.timeDisplay}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SLOT 2: ☀️ AFTERNOON */}
          <div className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} border rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl`}>
            <div className={`flex items-center gap-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
              <Sunset size={20} className="text-orange-500" />
              <h3 className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-base`}>দুপুরের স্লট (Afternoon Slot • 02:00 PM - 05:00 PM)</h3>
            </div>

            {afternoonTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">দুপুরের স্লটে কোনো টাস্ক সেট করা নেই</p>
            ) : (
              <div className="space-y-3">
                {afternoonTasks.map(t => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      t.done 
                        ? isDark ? 'bg-emerald-955/30 border-emerald-800/40 text-slate-400 line-through' : 'bg-emerald-50 border-emerald-200 text-slate-500 line-through' 
                        : isDark ? 'bg-slate-950 border-slate-800 text-white hover:border-cyan-500/40' : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <button
                        onClick={() => toggleTaskDone(t.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          t.done ? 'bg-emerald-500 text-slate-950' : isDark ? 'border border-slate-700 hover:border-cyan-400' : 'border border-slate-300 hover:border-cyan-600'
                        }`}
                      >
                        {t.done && <Check size={14} className="stroke-[3]" />}
                      </button>

                      <div>
                        <h4 className="font-bold text-xs lg:text-sm">{t.task}</h4>
                        <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">{t.subject}</span>
                          <span>•</span>
                          <span>{t.timeDisplay}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SLOT 3: 🌙 EVENING & NIGHT */}
          <div className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} border rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl`}>
            <div className={`flex items-center gap-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
              <Moon size={20} className="text-indigo-500" />
              <h3 className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-base`}>রাতের স্লট (Evening/Night Slot • 07:00 PM - 11:00 PM)</h3>
            </div>

            {eveningTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">রাতের স্লটে কোনো টাস্ক সেট করা নেই</p>
            ) : (
              <div className="space-y-3">
                {eveningTasks.map(t => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      t.done 
                        ? isDark ? 'bg-emerald-955/30 border-emerald-800/40 text-slate-400 line-through' : 'bg-emerald-50 border-emerald-200 text-slate-500 line-through' 
                        : isDark ? 'bg-slate-950 border-slate-800 text-white hover:border-cyan-500/40' : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <button
                        onClick={() => toggleTaskDone(t.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          t.done ? 'bg-emerald-500 text-slate-950' : isDark ? 'border border-slate-700 hover:border-cyan-400' : 'border border-slate-300 hover:border-cyan-600'
                        }`}
                      >
                        {t.done && <Check size={14} className="stroke-[3]" />}
                      </button>

                      <div>
                        <h4 className="font-bold text-xs lg:text-sm">{t.task}</h4>
                        <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">{t.subject}</span>
                          <span>•</span>
                          <span>{t.timeDisplay}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
