import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertCircle, RefreshCw, Send, ShieldCheck, Info } from 'lucide-react';
import { fetchGoalCategoryTree, requestGoalChange, getCurrentGoal } from '../../../services/api';

interface GoalChangeSettingsViewProps {
  user: any;
  theme?: string;
}

export const GoalChangeSettingsView: React.FC<GoalChangeSettingsViewProps> = ({ user, theme = 'dark' }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [activeGoalName, setActiveGoalName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const activeUser = user || (() => {
        try {
          const l = localStorage.getItem('takeuup_user');
          return l ? JSON.parse(l) : null;
        } catch(e) { return null; }
      })();

      const [tree, goalRes] = await Promise.all([
        fetchGoalCategoryTree(),
        activeUser ? getCurrentGoal(activeUser.id || activeUser.email) : Promise.resolve(null)
      ]);

      setCategories(Array.isArray(tree) ? tree : []);
      if (goalRes && goalRes.activeGoalName) {
        setActiveGoalName(goalRes.activeGoalName);
        if (activeUser && activeUser.activeGoalName !== goalRes.activeGoalName) {
          const updated = { ...activeUser, activeGoalName: goalRes.activeGoalName, studentClass: goalRes.activeGoalName };
          localStorage.setItem('takeuup_user', JSON.stringify(updated));
        }
      } else {
        setActiveGoalName(user?.activeGoalName || user?.studentClass || 'সাধারণ শিক্ষা');
      }
    } catch (e) {
      console.error("Failed to load goal data", e);
      setActiveGoalName(user?.activeGoalName || user?.studentClass || 'সাধারণ শিক্ষা');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    // Resolve user ID or email reliably
    const localUserStr = localStorage.getItem('takeuup_user');
    let localUser: any = null;
    try { if (localUserStr) localUser = JSON.parse(localUserStr); } catch (e) {}

    const activeUser = user || localUser;
    const userId = activeUser?.id || activeUser?.email || activeUser?.name || localUser?.id || localUser?.email || 'student';

    try {
      await requestGoalChange(userId, selectedCategoryId, reason);
      setSuccessMsg("আপনার গোল পরিবর্তনের আবেদন সফলভাবে এডমিনের কাছে পাঠানো হয়েছে। এডমিন অনুমোদন দিলে আপনার নতুন রানিং গোল আপডেট হয়ে যাবে।");
      setReason('');
      setSelectedCategoryId('');
    } catch (err: any) {
      setErrorMsg(err.message || "আবেদন পাঠাতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header Card */}
      <div className={`p-6 rounded-3xl border ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
            <Target size={26} />
          </div>
          <div>
            <h2 className="text-xl font-bold">গোল পরিবর্তন সেটিং (Goal Change Settings)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              রেজিস্ট্রেশনের সময় নির্বাচিত গোলটি অপরিবর্তনীয়। পরিবর্তন করতে হলে এডমিনের অনুমোদনের জন্য আবেদন করুন।
            </p>
          </div>
        </div>
      </div>

      {/* Current Active Goal Banner */}
      <div className={`p-6 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-emerald-955/60 via-slate-900 to-emerald-955/40 border-emerald-500/30 text-white' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-slate-900 shadow-sm'
      } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1">
            <CheckCircle2 size={13} /> বর্তমান সক্রিয় প্রস্তুতি টার্গেট (Active Running Goal)
          </span>
          <h3 className="text-xl font-black text-white dark:text-white">
            🎯 {activeGoalName || user?.activeGoalName || user?.studentClass || 'সাধারণ শিক্ষা'}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            রেজিস্ট্রেশন বা প্রথম লগইনের সময় আপনার সেট করা প্রধান শিক্ষা বিষয়।
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl text-xs font-bold shrink-0">
          সক্রিয় (Active)
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-200">✕</button>
        </div>
      )}

      {/* Change Goal Request Form */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      } space-y-6`}>
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Send size={18} className="text-cyan-400" /> নতুন গোল পরিবর্তনের আবেদন ফরম
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            আপনি বর্তমানে যে বিষয় নিয়ে পড়াশোনা করছেন তা থেকে অন্য কোনো বিভাগে বা নতুন লক্ষ্যে সুইচ করতে চাইলে নিচে নির্বাচন করুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              ১. বর্তমান লক্ষ্য (Present Goal)
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={activeGoalName || user?.activeGoalName || user?.studentClass || 'সাধারণ শিক্ষা'}
              className={`w-full p-3.5 rounded-2xl border text-xs font-bold cursor-not-allowed ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              ২. নতুন কাঙ্ক্ষিত গোল ক্যাটাগরি নির্বাচন করুন (Requested New Goal) *
            </label>
            {isLoading ? (
              <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-cyan-400" /> ক্যাটাগরি লোড হচ্ছে...
              </div>
            ) : (
              <select
                required
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className={`w-full p-3.5 rounded-2xl border text-xs font-bold outline-none focus:border-cyan-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="">নতুন লক্ষ্য সিলেক্ট করুন...</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.title}>
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      cat.subCategories.map((sub: any) => (
                        <option key={sub.id} value={sub.id}>
                          {cat.title} ➔ {sub.title}
                        </option>
                      ))
                    ) : (
                      <option value={cat.id}>{cat.title}</option>
                    )}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              ৩. গোল পরিবর্তনের কারণ (Reason) *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="কেন গোল পরিবর্তন করতে চান তা সংক্ষেপে উল্লেখ করুন..."
              className={`w-full p-3.5 rounded-2xl border text-xs outline-none focus:border-cyan-500 transition-all ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-start gap-3 text-xs text-cyan-300">
            <Info size={18} className="shrink-0 text-cyan-400 mt-0.5" />
            <span>
              আপনার আবেদন পাঠানোর পর এডমিন রিভিউ করবেন। এডমিন অনুমোদন দিলে ড্যাশবোর্ডের বিষয়বস্তু ও কুইজ নতুন গোল অনুযায়ী নিজে থেকে কনফিগার হয়ে যাবে।
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedCategoryId}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> আবেদন জমা হচ্ছে...
              </>
            ) : (
              <>
                <Send size={18} /> গোল পরিবর্তনের আবেদন জমা দিন ➔
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};
