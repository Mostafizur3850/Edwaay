import React from 'react';
import { 
  User, Crown, CreditCard, Settings, Bell, Activity, Flag, Bookmark, Gift, 
  BookOpen, Info, Shield, Lock, LogOut, ChevronRight, X, CheckCircle2, Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

interface TakeUUpAccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onOpenProfileEdit: () => void;
  onSelectTab: (tabId: string) => void;
}

export const TakeUUpAccountDrawer: React.FC<TakeUUpAccountDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onOpenProfileEdit,
  onSelectTab
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleLogout = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে অ্যাকাউন্ট থেকে লগআউট করতে চান?')) {
      localStorage.removeItem('takeuup_user');
      window.location.href = '/login';
    }
  };

  const userName = user?.name || user?.displayName || 'Mostafizur Rahman';
  const userEmail = user?.email || 'fb.mostafizur.rahman536@gmail.com';
  const userBatch = user?.studentClass || 'এইচএসসি ২০২৭';
  const userAvatar = userName.charAt(0).toUpperCase();

  // Settings menu items matching reference screenshot style with colored icon boxes & badges
  const menuList = [
    {
      id: 'profile',
      label: 'ব্যক্তিগত তথ্য',
      icon: User,
      bgColor: 'bg-rose-500',
      action: () => { onClose(); onOpenProfileEdit(); }
    },
    {
      id: 'upgrade',
      label: 'আপগ্রেড',
      icon: Crown,
      bgColor: 'bg-amber-500',
      action: () => { onClose(); navigate('/pricing'); }
    },
    {
      id: 'subscription',
      label: 'সাবস্ক্রিপশন সংক্রান্ত তথ্য',
      icon: CreditCard,
      bgColor: 'bg-indigo-600',
      action: () => { onClose(); navigate('/pricing'); }
    },
    {
      id: 'routine',
      label: 'স্টাডি রুটিন ও প্ল্যানার',
      icon: Settings,
      bgColor: 'bg-cyan-500',
      action: () => { onClose(); onSelectTab('routine'); }
    },
    {
      id: 'notifications',
      label: 'নোটিফিকেশন ও অ্যালার্ট',
      icon: Bell,
      bgColor: 'bg-rose-600',
      badge: 3,
      action: () => { onClose(); alert('আপনার ৩টি নতুন পড়ার নোটিফিকেশন আছে।'); }
    },
    {
      id: 'activity',
      label: 'একটিভিটি লগ',
      icon: Activity,
      bgColor: 'bg-blue-600',
      action: () => { onClose(); onSelectTab('mistakes'); }
    },
    {
      id: 'report',
      label: 'রিপোর্ট',
      icon: Flag,
      bgColor: 'bg-rose-500',
      action: () => { onClose(); alert('সমস্যা বা ফিডব্যাক পাঠাতে আপনার মতামত জানান।'); }
    },
    {
      id: 'saved',
      label: 'বুকমার্ক ও ইতিহাস',
      icon: Bookmark,
      bgColor: 'bg-teal-500',
      action: () => { onClose(); onSelectTab('mistakes'); }
    },
    {
      id: 'gift',
      label: 'গিফট ও রিওয়ার্ড',
      icon: Gift,
      bgColor: 'bg-orange-500',
      action: () => { onClose(); alert('বন্ধুদের সাথে TakeUUp শেয়ার করে প্রিমিয়াম পয়েন্ট অর্জন করুন!'); }
    },
    {
      id: 'blog',
      label: 'টেকইউআপ স্টাডি ব্লগ',
      icon: BookOpen,
      bgColor: 'bg-purple-600',
      action: () => { onClose(); navigate('/blog'); }
    },
    {
      id: 'about',
      label: 'আমাদের সম্পর্কে',
      icon: Info,
      bgColor: 'bg-emerald-600',
      action: () => { onClose(); navigate('/about'); }
    },
    {
      id: 'privacy',
      label: 'গোপনীয়তার নীতি',
      icon: Shield,
      bgColor: 'bg-indigo-500',
      action: () => { onClose(); alert('TakeUUp পলিসি অনুযায়ী আপনার সকল তথ্য সুরক্ষিত।'); }
    },
    {
      id: 'security',
      label: 'সিকিউরিটি ও ডাটা প্রাইভেসী',
      icon: Lock,
      bgColor: 'bg-cyan-600',
      action: () => { onClose(); alert('আপনার ডাটা টেকইউআপে সম্পূর্ণ সুরক্ষিত।'); }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide / Card Container matching screenshot style */}
      <div className={`relative w-full max-w-md ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
      } border rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[88vh]`}>
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar text-left h-full w-full">
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>সেটিংস ও অ্যাকাউন্ট সংস্থান</h2>
          <button 
            onClick={onClose}
            className={`p-1.5 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'} rounded-xl transition-colors`}
          >
            <X size={18} />
          </button>
        </div>

        {/* TOP STUDENT PROFILE HEADER CARD (Matches Screenshot 1 & 2) */}
        <div className={`${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        } border rounded-2xl p-5 text-center space-y-3 relative shadow-inner`}>
          <div className="relative inline-block mx-auto">
            <div className={`w-20 h-20 rounded-full bg-cyan-600 text-white font-black text-3xl flex items-center justify-center border-4 ${
              isDark ? 'border-slate-900' : 'border-white'
            } shadow-lg`}>
              {userAvatar}
            </div>
            <button
              onClick={() => { onClose(); onOpenProfileEdit(); }}
              className={`absolute bottom-0 right-0 p-1.5 bg-emerald-500 text-slate-950 rounded-full border-2 ${
                isDark ? 'border-slate-900' : 'border-white'
              } shadow hover:scale-110 transition-transform`}
              title="এডিট প্রোফাইল"
            >
              <Edit3 size={14} />
            </button>
          </div>

          <div>
            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-base tracking-tight`}>{userName}</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} font-mono mt-0.5`}>{userEmail}</p>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold">
              Batch : {userBatch}
            </div>
          </div>

          {/* Linked Account Status */}
          <div className={`pt-2 border-t ${isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-200 text-slate-700'} flex items-center justify-between text-xs px-2`}>
            <span>লিংক অ্যাকাউন্ট</span>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
            } border text-emerald-600 dark:text-emerald-400 font-bold`}>
              <span className="font-black text-rose-500">G</span>
              <CheckCircle2 size={14} className="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* MENU LIST ITEMS (Identical structured look to screenshot) */}
        <div className={`space-y-1 ${
          isDark ? 'bg-slate-950/60 border-slate-800/80 divide-slate-850' : 'bg-slate-50/80 border-slate-200 divide-slate-200'
        } border rounded-2xl p-1.5 divide-y`}>
          {menuList.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full p-3 flex items-center justify-between text-left ${
                  isDark ? 'hover:bg-slate-850/60' : 'hover:bg-white'
                } transition-colors group rounded-xl`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${item.bgColor} text-white flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950'} transition-colors`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge !== undefined && (
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40 text-[10px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight size={16} className={`${isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-700'} group-hover:translate-x-0.5 transition-transform`} />
                </div>
              </button>
            );
          })}

          {/* LOG OUT BUTTON AT BOTTOM (Red styled matching screenshot) */}
          <button
            onClick={handleLogout}
            className={`w-full p-3 flex items-center justify-between text-left ${
              isDark ? 'hover:bg-rose-955/20' : 'hover:bg-rose-50'
            } transition-colors group rounded-xl pt-3`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-md">
                <LogOut size={18} />
              </div>
              <span className="text-xs font-bold text-rose-500 group-hover:text-rose-600 transition-colors">
                লগ আউট
              </span>
            </div>
            <ChevronRight size={16} className="text-rose-500/60 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        </div>
      </div>
    </div>
  );
};
