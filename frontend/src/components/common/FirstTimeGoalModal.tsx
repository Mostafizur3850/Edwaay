import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Sparkles, BookOpen, GraduationCap, BookMarked, Award, BookCheck, Briefcase, FlaskConical, Calculator, Globe, Atom, TrendingUp, Cpu, Stethoscope, Building2, CheckCircle2, Landmark, Users } from 'lucide-react';
import { fetchGoalCategoryTree, selectInitialGoal } from '../../services/api';

interface FirstTimeGoalModalProps {
  isOpen: boolean;
  user: any;
  onGoalSelected: (updatedUser: any) => void;
}

export const FirstTimeGoalModal: React.FC<FirstTimeGoalModalProps> = ({ isOpen, user, onGoalSelected }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTree();
    }
  }, [isOpen]);

  const loadTree = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const tree = await fetchGoalCategoryTree();
      if (Array.isArray(tree) && tree.length > 0) {
        setCategories(tree);
      } else {
        // Fallback default dynamic options
        setCategories(getDefaultFallbackTree());
      }
    } catch (e) {
      setCategories(getDefaultFallbackTree());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultFallbackTree = () => [
    {
      id: 'cat-68',
      title: 'ক্লাস ৬-৮',
      subtitle: 'মাধ্যমিক ৬ষ্ঠ থেকে ৮ম শ্রেণী',
      iconName: 'BookOpen',
      subCategories: [
        { id: 'sub-68-gen', title: 'সাধারণ বিভাগ', subtitle: 'General Group', iconName: 'BookOpen' }
      ]
    },
    {
      id: 'cat-ssc',
      title: 'এসএসসি (SSC)',
      subtitle: 'মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষা',
      iconName: 'GraduationCap',
      subCategories: [
        { id: 'sub-ssc-sc', title: 'বিজ্ঞান বিভাগ', subtitle: 'SSC Science Group', iconName: 'FlaskConical' },
        { id: 'sub-ssc-com', title: 'বাণিজ্য বিভাগ', subtitle: 'SSC Business Studies', iconName: 'Calculator' },
        { id: 'sub-ssc-arts', title: 'মানবিক বিভাগ', subtitle: 'SSC Humanities Group', iconName: 'Globe' }
      ]
    },
    {
      id: 'cat-hsc',
      title: 'এইচএসসি / এডমিশন',
      subtitle: 'উচ্চ মাধ্যমিক ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি',
      iconName: 'Award',
      subCategories: [
        { id: 'sub-hsc-sc', title: 'বিজ্ঞান বিভাগ', subtitle: 'HSC Science Group', iconName: 'Atom' },
        { id: 'sub-hsc-com', title: 'বাণিজ্য বিভাগ', subtitle: 'HSC Business Studies', iconName: 'TrendingUp' },
        { id: 'sub-hsc-eng', title: 'ইঞ্জিনিয়ারিং এডমিশন (BUET)', subtitle: 'বুয়েট ও প্রযুক্তি বিশ্ববিদ্যালয় ভর্তি', iconName: 'Cpu' },
        { id: 'sub-hsc-med', title: 'মেডিকেল এডমিশন (DMC)', subtitle: 'মেডিকেল ও ডেন্টাল ভর্তি প্রস্তুতি', iconName: 'Stethoscope' },
        { id: 'sub-hsc-du', title: 'ভার্সিটি ক-ইউনিট ও গুচ্ছ', subtitle: 'ঢাকা বিশ্ববিদ্যালয় ক-ইউনিট প্রস্তুতি', iconName: 'Building2' }
      ]
    },
    {
      id: 'cat-bcs',
      title: 'বিসিএস / জবস',
      subtitle: 'বিসিএস প্রিলি ও সরকারি চাকরি প্রস্তুতি',
      iconName: 'Briefcase',
      subCategories: [
        { id: 'sub-bcs-pre', title: 'বিসিএস প্রিলিমিনারি', subtitle: 'BCS Preliminary Exam', iconName: 'CheckCircle2' },
        { id: 'sub-bank-jobs', title: 'ব্যাংক জবস', subtitle: 'Bank Recruitment Exam', iconName: 'Landmark' },
        { id: 'sub-primary', title: 'প্রাথমিক শিক্ষক নিয়োগ', subtitle: 'Primary Assistant Teacher', iconName: 'Users' }
      ]
    }
  ];

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap size={22} className="text-amber-400" />;
      case 'BookOpen': return <BookOpen size={22} className="text-blue-400" />;
      case 'BookMarked': return <BookMarked size={22} className="text-emerald-400" />;
      case 'Award': return <Award size={22} className="text-purple-400" />;
      case 'BookCheck': return <BookCheck size={22} className="text-teal-400" />;
      case 'Briefcase': return <Briefcase size={22} className="text-rose-400" />;
      case 'FlaskConical': return <FlaskConical size={22} className="text-cyan-400" />;
      case 'Calculator': return <Calculator size={22} className="text-orange-400" />;
      case 'Globe': return <Globe size={22} className="text-emerald-400" />;
      case 'Atom': return <Atom size={22} className="text-sky-400" />;
      case 'TrendingUp': return <TrendingUp size={22} className="text-green-400" />;
      case 'Cpu': return <Cpu size={22} className="text-indigo-400" />;
      case 'Stethoscope': return <Stethoscope size={22} className="text-pink-400" />;
      case 'Building2': return <Building2 size={22} className="text-blue-400" />;
      case 'Landmark': return <Landmark size={22} className="text-amber-400" />;
      case 'Users': return <Users size={22} className="text-violet-400" />;
      default: return <GraduationCap size={22} className="text-cyan-400" />;
    }
  };

  const handleSelectParent = (cat: any) => {
    const subList = cat.subCategories || cat.SubCategories || [];
    if (subList.length > 0) {
      setSelectedParent(cat);
    } else {
      handleConfirmGoal(cat);
    }
  };

  const handleConfirmGoal = async (cat: any) => {
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const userIdToPass = user.id || user.email || user.name;

    try {
      const res = await selectInitialGoal(userIdToPass, cat.id);
      
      const local = localStorage.getItem('takeuup_user');
      let userDataToUpdate = local ? JSON.parse(local) : { ...user };

      userDataToUpdate.hasSelectedInitialGoal = true;
      userDataToUpdate.activeGoalCategoryId = cat.id;
      userDataToUpdate.activeGoalName = res.activeGoalName || (selectedParent ? `${selectedParent.title} - ${cat.title}` : cat.title);
      userDataToUpdate.studentClass = userDataToUpdate.activeGoalName;

      localStorage.setItem('takeuup_user', JSON.stringify(userDataToUpdate));
      onGoalSelected(userDataToUpdate);
    } catch (e: any) {
      console.error("Failed to save initial goal:", e);
      // Client-side fallback update if offline or server delay
      const local = localStorage.getItem('takeuup_user');
      let userDataToUpdate = local ? JSON.parse(local) : { ...user };

      userDataToUpdate.hasSelectedInitialGoal = true;
      userDataToUpdate.activeGoalCategoryId = cat.id;
      userDataToUpdate.activeGoalName = selectedParent ? `${selectedParent.title} - ${cat.title}` : cat.title;
      userDataToUpdate.studentClass = userDataToUpdate.activeGoalName;

      localStorage.setItem('takeuup_user', JSON.stringify(userDataToUpdate));
      onGoalSelected(userDataToUpdate);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-lg bg-[#0b101b] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center text-slate-100 flex flex-col items-center">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot & Speech Bubble Banner */}
        <div className="relative flex flex-col items-center mb-6 w-full">
          
          {/* Back Button if in sub-category step */}
          {selectedParent && (
            <button 
              onClick={() => setSelectedParent(null)}
              className="absolute left-0 top-0 p-2 text-slate-400 hover:text-white bg-slate-900/80 rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft size={16} /> পূর্ববর্তী
            </button>
          )}

          {/* Speech Bubble Above Mascot */}
          <div className="relative mb-2 px-5 py-2.5 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-lg text-sm font-black text-cyan-300 flex items-center justify-center gap-2 tracking-wide">
            <Sparkles size={16} className="text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{selectedParent ? `${selectedParent.title} - বিভাগ নির্বাচন করুন` : 'তুমি কোন লক্ষ্য নিয়ে নিজের প্রস্তুতি TakeUUp করতে চাও?'}</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900" />
          </div>

          {/* Cute Mascot Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/40 p-1 flex items-center justify-center shadow-xl shadow-cyan-950/40 relative group">
            <img 
              src="https://img.freepik.com/free-vector/cute-fox-reading-book-cartoon-vector-icon-illustration-animal-education-icon-concept-isolated_138676-5867.jpg" 
              alt="TakeUUp Learning Mascot" 
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-cyan-500 text-slate-950 font-extrabold rounded-full flex items-center justify-center text-xs shadow-md border border-white">
              AI
            </div>
          </div>
        </div>

        {/* Dynamic Category List */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-medium">ক্যাটাগরি লোড করা হচ্ছে...</p>
          </div>
        ) : (
          <div className="w-full space-y-3 max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {errorMsg && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl">
                {errorMsg}
              </div>
            )}

            {!selectedParent ? (
              // Step 1: Parent Goal Categories
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectParent(cat)}
                  disabled={isSubmitting}
                  className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex items-center justify-between gap-4 group text-left shadow-lg hover:shadow-cyan-950/30"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 group-hover:bg-cyan-500/10 flex items-center justify-center transition-colors border border-slate-750">
                      {getIcon(cat.iconName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {cat.title}
                      </h4>
                      {cat.subtitle && (
                        <p className="text-xs text-slate-400 font-medium line-clamp-1">
                          {cat.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-slate-500 group-hover:text-cyan-400 transition-colors font-bold text-xs">
                    নির্বাচন করুন &rarr;
                  </div>
                </button>
              ))
            ) : (
              // Step 2: Sub-categories / Streams
              (selectedParent.subCategories || selectedParent.SubCategories || []).map((sub: any) => (
                <button
                  key={sub.id}
                  onClick={() => handleConfirmGoal(sub)}
                  disabled={isSubmitting}
                  className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex items-center justify-between gap-4 group text-left shadow-lg hover:shadow-emerald-950/30"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors border border-slate-750">
                      {getIcon(sub.iconName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {sub.title}
                      </h4>
                      {sub.subtitle && (
                        <p className="text-xs text-slate-400 font-medium line-clamp-1">
                          {sub.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center transition-all font-bold">
                    <Check size={16} />
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Footer Subtext */}
        <p className="mt-5 text-[11px] text-slate-500 font-medium">
          * আপনার নির্বাচিত লক্ষ্য অনুযায়ী TakeUUp-এ পারসোনালাইজড পড়াশোনা ও কুইজ সাজানো হবে।
        </p>

      </div>
    </div>
  );
};
