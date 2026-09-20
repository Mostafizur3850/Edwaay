import React, { useState } from 'react';
import { 
  Calculator, Target, GraduationCap, CheckCircle2, XCircle, Award, 
  HelpCircle, Clock, FileText, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface StudentAdmissionPredictorProps {
  user?: any;
}

export const StudentAdmissionPredictor: React.FC<StudentAdmissionPredictorProps> = ({ user }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calculator inputs
  const [sscGpa, setSscGpa] = useState<string>('5.00');
  const [hscGpa, setHscGpa] = useState<string>('5.00');
  const [phyMarks, setPhyMarks] = useState<string>('90');
  const [chemMarks, setChemMarks] = useState<string>('92');
  const [mathMarks, setMathMarks] = useState<string>('95');
  const [bioMarks, setBioMarks] = useState<string>('88');
  const [engMarks, setEngMarks] = useState<string>('85');

  const [activeSubTab, setActiveSubTab] = useState<'eligibility' | 'marks' | 'hall_strategy'>('eligibility');

  const sscVal = parseFloat(sscGpa) || 0;
  const hscVal = parseFloat(hscGpa) || 0;
  const phyVal = parseFloat(phyMarks) || 0;
  const chemVal = parseFloat(chemMarks) || 0;
  const mathVal = parseFloat(mathMarks) || 0;
  const totalPhyChemMath = phyVal + chemVal + mathVal;

  // Admission Universities Criteria Database
  const UNIVERSITIES = [
    {
      name: 'BUET (বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়)',
      symbol: 'BUET',
      minSscGpa: 4.0,
      minHscGpa: 5.0,
      minPhyChemMath: 270, // 270/300
      isEligible: sscVal >= 4.0 && hscVal >= 5.0 && totalPhyChemMath >= 270,
      requirementsText: 'এসএসসি জিপিএ ৪.০০, এইচএসসি জিপিএ ৫.০০ এবং পদার্থ, রসায়ন ও গণিতে মোট ২৭০+ মার্কস আবশ্যক।'
    },
    {
      name: 'ঢাকা বিশ্ববিদ্যালয় (ক ইউনিট)',
      symbol: 'DU KA',
      minSscGpa: 3.5,
      minHscGpa: 3.5,
      minCombinedGpa: 8.0,
      isEligible: (sscVal + hscVal) >= 8.0 && sscVal >= 3.5 && hscVal >= 3.5,
      requirementsText: 'এসএসসি ও এইচএসসি মিলে মোট জিপিএ ৮.০০ এবং প্রতিটিতে আলাদাভাবে ৩.৫০ আবশ্যক।'
    },
    {
      name: 'মেডিকেল ও ডেন্টাল (MBBS / BDS)',
      symbol: 'Medical',
      minSscGpa: 4.0,
      minHscGpa: 4.0,
      minCombinedGpa: 9.0,
      isEligible: (sscVal + hscVal) >= 9.0 && bioValGpaOk(),
      requirementsText: 'এসএসসি ও এইচএসসি মিলে মোট জিপিএ ৯.০০ (উপকূলীয়/নন-কোটা) এবং জীববিজ্ঞানে ন্যূনতম জিপিএ ৪.০০।'
    },
    {
      name: 'CKRUET (চুয়েট, রুয়েট, কুয়েট গুচ্ছ)',
      symbol: 'CKRUET',
      minSscGpa: 4.0,
      minHscGpa: 5.0,
      minPhyChemMath: 260,
      isEligible: sscVal >= 4.0 && hscVal >= 5.0 && totalPhyChemMath >= 260,
      requirementsText: 'এইচএসসি জিপিএ ৫.০০ এবং পদার্থ, রসায়ন ও গণিতে ২৬০+ মার্কস।'
    },
    {
      name: 'কৃষি গুচ্ছ (Agriculture Cluster - ৮ বিশ্ববিদ্যালয়)',
      symbol: 'Agri',
      minSscGpa: 3.5,
      minHscGpa: 3.5,
      minCombinedGpa: 8.5,
      isEligible: (sscVal + hscVal) >= 8.5,
      requirementsText: 'এসএসসি ও এইচএসসি মিলে মোট জিপিএ ৮.৫০ এবং বিজ্ঞান বিভাগ আবশ্যক।'
    }
  ];

  function bioValGpaOk() {
    return (parseFloat(bioMarks) || 0) >= 70; // 70+ in Bio
  }

  return (
    <div className={`${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'} border rounded-3xl p-4 lg:p-6 shadow-xl space-y-6 animate-in fade-in duration-300`}>
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2.5">
            <Calculator className="text-cyan-500" /> এডমিশন এলিজিবিলিটি ও মার্কস প্রেডিক্টর
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">তোমার এসএসসি/এইচএসসি মার্কস দিয়ে বুয়েট, ঢাকা বিশ্ববিদ্যালয় ও মেডিকেল যোগ্যতা যাচাই করো</p>
        </div>

        {/* Sub Tabs */}
        <div className={`p-1 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} inline-flex`}>
          <button
            onClick={() => setActiveSubTab('eligibility')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'eligibility' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🎓 বিশ্ববিদ্যালয় এলিজিবিলিটি
          </button>
          <button
            onClick={() => setActiveSubTab('hall_strategy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'hall_strategy' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⏱️ পরীক্ষা হলের স্ট্র্যাটেজি ও ওএমআর
          </button>
        </div>
      </div>

      {activeSubTab === 'eligibility' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Input Form */}
          <div className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} border p-5 rounded-2xl space-y-4`}>
            <h3 className="text-sm font-black flex items-center gap-2 text-cyan-400">
              <FileText size={16} /> তোমার এসএসসি ও এইচএসসি মার্কস দাও
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">এসএসসি জিপিএ</label>
                <input 
                  type="text" 
                  value={sscGpa} 
                  onChange={(e) => setSscGpa(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-black border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  } focus:outline-none focus:border-cyan-500`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">এইচএসসি জিপিএ</label>
                <input 
                  type="text" 
                  value={hscGpa} 
                  onChange={(e) => setHscGpa(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-black border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  } focus:outline-none focus:border-cyan-500`}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-black text-slate-400 block">এইচএসসি সাবজেক্টভিত্তিক মার্কস (১০০-এর মধ্যে)</span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block">পদার্থবিজ্ঞান</label>
                  <input type="text" value={phyMarks} onChange={(e) => setPhyMarks(e.target.value)} className={`w-full p-2 rounded-xl text-xs font-bold border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block">রসায়ন</label>
                  <input type="text" value={chemMarks} onChange={(e) => setChemMarks(e.target.value)} className={`w-full p-2 rounded-xl text-xs font-bold border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block">উচ্চতর গণিত</label>
                  <input type="text" value={mathMarks} onChange={(e) => setMathMarks(e.target.value)} className={`w-full p-2 rounded-xl text-xs font-bold border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block">জীববিজ্ঞান</label>
                  <input type="text" value={bioMarks} onChange={(e) => setBioMarks(e.target.value)} className={`w-full p-2 rounded-xl text-xs font-bold border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block">English</label>
                  <input type="text" value={engMarks} onChange={(e) => setEngMarks(e.target.value)} className={`w-full p-2 rounded-xl text-xs font-bold border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`} />
                </div>
              </div>
            </div>

            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <span className="text-[11px] font-black text-cyan-300 block">📊 PCM মোট নম্বর: {totalPhyChemMath} / ৩০০</span>
              <p className="text-[10px] text-slate-400">পদার্থ + রসায়ন + গণিতে বুয়েট সিলেকশনের জন্য সাধারণত ২৭০+ মার্কস প্রয়োজন হয়।</p>
            </div>
          </div>

          {/* Right Column: Universities Eligibility Results */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap size={18} className="text-amber-500" /> বিশ্ববিদ্যালযভিত্তিক আবেদন ফিটনেস ও স্ট্যাটাস
            </h3>

            <div className="space-y-3">
              {UNIVERSITIES.map((uni, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    uni.isEligible
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border ${
                        uni.isEligible ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'
                      }`}>
                        {uni.symbol}
                      </span>
                      <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">{uni.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{uni.requirementsText}</p>
                      </div>
                    </div>

                    <div>
                      {uni.isEligible ? (
                        <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-full flex items-center gap-1 shadow">
                          <CheckCircle2 size={14} /> আবেদন উপযুক্ত
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-rose-500 text-white text-xs font-black rounded-full flex items-center gap-1 shadow">
                          <XCircle size={14} /> মার্কস অপূর্ণ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Hall Strategy Tab */}
      {activeSubTab === 'hall_strategy' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-3`}>
              <span className="text-2xl">📝</span>
              <h4 className="font-black text-sm text-cyan-400">১. ওএমআর (OMR) পূরণ কৌশল</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                পরীক্ষার শুরুর প্রথম ৩ মিনিটেই নাম, রোল ও রেজিস্ট্রেশন নম্বর সতর্কতার সাথে পূরণ করো। দাগানোর সময় ব্ল্যাক বলপেন ব্যবহার করবে।
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-3`}>
              <span className="text-2xl">⚡</span>
              <h4 className="font-black text-sm text-amber-400">২. নেগেটিভ মার্কিং নিয়ন্ত্রণ</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                ভুল উত্তরে ০.২৫ মার্কস কাটা যাবে। যে প্রশ্নগুলোতে ৫০-৫০ কনফিউশন আছে, সেগুলো ২য় রাউন্ডে ভাববে। কোনোভাবেই আন্দাজে দাগাবে না।
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-3`}>
              <span className="text-2xl">⏱️</span>
              <h4 className="font-black text-sm text-emerald-400">৩. ৬০ মিনিটের সময় ভাগ</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                প্রথম ২০ মিনিটে সহজ থিওরি প্রশ্ন দাগাও। পরবর্তী ২৫ মিনিট ম্যাথমেটিক্যাল ক্যালকুলেশন ও বাকি ১৫ মিনিট কনফিউজিং অপশন রিভিশন।
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
