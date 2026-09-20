import React, { useState } from 'react';
import { 
  Users, Flame, MessageCircle, FileText, CheckCircle2, Award, Plus, 
  Search, ShieldCheck, ArrowRight, Share2, Sparkles, Clock, Target, ThumbsUp
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface StudentStudyGroupsProps {
  user?: any;
}

export const StudentStudyGroups: React.FC<StudentStudyGroupsProps> = ({ user }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const STUDY_GROUPS = [
    {
      id: 'g1',
      title: '🎯 BUET & Engineering Mission 2026',
      category: 'ইঞ্জিনিয়ারিং প্রস্তুতি',
      membersCount: 1420,
      activeMembersToday: 184,
      bannerColor: 'from-blue-600 to-indigo-700',
      description: 'বুয়েট, কুয়েট, রুয়েট ও বুটেক্স ভর্তিচ্ছু শিক্ষার্থীদের যৌথ চর্চা গ্রুপ। প্রতিদিনের ফিজিক্স ও হায়ার ম্যাথ প্রবলেম সলভিং!',
      joined: true,
      dailyChallenge: 'পদার্থবিজ্ঞান ২য় পত্র — তড়িৎ প্রবাহের তাপীয় ফল থেকে ৫টি গাণিতিক সমাধান পোস্ট করো।',
      recentPosts: [
        { id: 'p1', author: 'রাফসান সাব্বির (BUET 24)', text: 'ম্যাগনেটিজমের এই ম্যাথটা কেউ সংক্ষেপে বুঝিয়ে দিতে পারবে?', replies: 12, time: '১৫ মিনিট আগে' },
        { id: 'p2', author: 'মেহেদী হাসান', text: 'আজকের স্টাডি গ্রুপের ৩ ঘণ্টার লাইভ টাইমার কমপ্লিট করলাম! 🔥', replies: 8, time: '১ ঘণ্টা আগে' }
      ]
    },
    {
      id: 'g2',
      title: '🩺 Medical & Dental Target Batch 2026',
      category: 'মেডিকেল প্রস্তুতি',
      membersCount: 2150,
      activeMembersToday: 340,
      bannerColor: 'from-emerald-600 to-teal-700',
      description: 'মেডিকেল ভর্তি পরীক্ষার জিকে, বায়োলজি এবং কেমিস্ট্রি শর্ট ট্রিক্স গ্রুপ। প্রতি রাতে ১০টা জিকে ক্লাসিক কুইজ!',
      joined: true,
      dailyChallenge: 'উদ্ভিদবিজ্ঞান ১ম অধ্যায়: কোষের অঙ্গাণুসমূহের কাজ থেকে ১০টি পয়েন্ট লিখে গ্রপ ফিডে শেয়ার করো।',
      recentPosts: [
        { id: 'p3', author: 'ডাঃ সানজিদা আক্তার (MENTOR)', text: 'আজকের বায়োলজি মডেল টেস্টের সলিউশন শিট যুক্ত করা হয়েছে।', replies: 24, time: '৩০ মিনিট আগে' }
      ]
    },
    {
      id: 'g3',
      title: '🏛️ Dhaka University "KA" Unit Achievers',
      category: 'ভার্সিটি ক ইউনিট',
      membersCount: 1890,
      activeMembersToday: 210,
      bannerColor: 'from-amber-600 to-orange-700',
      description: 'ঢাবি ক ইউনিট, জাবি এ ইউনিট ও রাবি সি ইউনিটের ভর্তি যোদ্ধাদের গ্রুপ। নিয়মিত মডেল টেস্ট আলোচনার হাব।',
      joined: false,
      dailyChallenge: 'রসায়ন ১ম পত্র — পরমাণুর গঠন থেকে ৩টি কনসেপচুয়াল প্রশ্ন উত্তরসহ লেখো।',
      recentPosts: []
    },
    {
      id: 'g4',
      title: '📚 HSC 2026 Board Examination Toppers Club',
      category: 'এইচএসসি একাডেমি',
      membersCount: 3100,
      activeMembersToday: 512,
      bannerColor: 'from-purple-600 to-pink-700',
      description: 'ঢাকা, চট্টগ্রাম, রাজশাহীসহ সকল বোর্ডের এইচএসসি শিক্ষার্থীদের জন্য বোর্ড প্রশ্ন এনালাইসিস গ্রুপ।',
      joined: false,
      dailyChallenge: 'বাংলা ২য় পত্র — সমাসের সেরা ২০টি উদাহরণ নোট ডাউন করো।',
      recentPosts: []
    }
  ];

  const [activeGroup, setActiveGroup] = useState<any>(STUDY_GROUPS[0]);
  const [newPostInput, setNewPostInput] = useState('');

  return (
    <div className={`${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'} border rounded-3xl p-4 lg:p-6 shadow-xl space-y-6 animate-in fade-in duration-300`}>
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2.5">
            <Users className="text-cyan-500" /> স্টাডি গ্রুপ ও লার্নিং ক্লাব
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">সহপাঠীদের সাথে টার্গেটভিত্তিক গ্রুপ স্টাডি ও ডেইলি চ্যালেঞ্জ জয় করো</p>
        </div>

        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 self-start md:self-auto">
          <Plus size={16} /> নতুন স্টাডি গ্রুপ খুলুন
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Group Cards List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-black text-slate-400 tracking-wider">তোমার স্টাডি গ্রুপসমূহ</h3>
          
          <div className="space-y-3">
            {STUDY_GROUPS.map((group) => (
              <div 
                key={group.id}
                onClick={() => setActiveGroup(group)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all space-y-2 ${
                  activeGroup?.id === group.id
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-lg ring-1 ring-cyan-500/30'
                    : isDark ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    {group.category}
                  </span>
                  {group.joined && (
                    <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> যুক্ত আছো
                    </span>
                  )}
                </div>

                <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">{group.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{group.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
                  <span>👥 {group.membersCount.toLocaleString()} জন সদস্য</span>
                  <span className="text-amber-400">🔥 আজ {group.activeMembersToday} জন একটিভ</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Group Active View */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Group Banner */}
          <div className={`p-6 rounded-3xl bg-gradient-to-r ${activeGroup.bannerColor} text-white shadow-xl space-y-3 relative overflow-hidden`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
                {activeGroup.category}
              </span>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Share2 size={16} />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black leading-tight">{activeGroup.title}</h3>
              <p className="text-xs text-white/80 font-medium mt-1">{activeGroup.description}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold pt-2 border-t border-white/20">
              <div className="flex items-center gap-1.5">
                <Users size={15} /> {activeGroup.membersCount.toLocaleString()} জন মেম্বার
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Flame size={15} fill="currentColor" /> {activeGroup.activeMembersToday} জন আজ পড়াশোনায় একটিভ
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <Sparkles size={16} /> আজকের ডেইলি গ্রুপ চ্যালেঞ্জ (Daily Task)
              </span>
              <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                +৫০ পয়েন্ট
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeGroup.dailyChallenge}</p>
            <button className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition-colors">
              চ্যালেঞ্জ জমা দিন 🚀
            </button>
          </div>

          {/* Group Discussion Feed */}
          <div className="space-y-4">
            <h4 className="text-sm font-black flex items-center gap-2">
              <MessageCircle size={16} className="text-cyan-500" /> গ্রুপ ডিসকাশন ও পোস্ট ফিড
            </h4>

            {/* Create Post */}
            <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2`}>
              <textarea 
                value={newPostInput}
                onChange={(e) => setNewPostInput(e.target.value)}
                placeholder="গ্রুপে কোনো প্রশ্ন বা পড়ার সমস্যা পোস্ট করুন..."
                rows={2}
                className={`w-full p-3 text-xs rounded-xl border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                } focus:outline-none focus:border-cyan-500 resize-none`}
              />
              <div className="flex justify-end">
                <button 
                  onClick={() => setNewPostInput('')}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl shadow transition-all"
                >
                  পোস্ট করুন ➔
                </button>
              </div>
            </div>

            {/* Feed List */}
            <div className="space-y-3">
              {activeGroup.recentPosts.map((post: any) => (
                <div key={post.id} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-cyan-400">{post.author}</span>
                    <span className="text-[10px] text-slate-500">{post.time}</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{post.text}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-bold pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button className="hover:text-cyan-400 flex items-center gap-1">
                      <ThumbsUp size={14} /> পছন্দ (১৫)
                    </button>
                    <button className="hover:text-cyan-400 flex items-center gap-1">
                      <MessageCircle size={14} /> উত্তর ({post.replies})
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
