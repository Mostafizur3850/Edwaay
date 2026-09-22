import React, { useState, useEffect } from 'react';
import { Target, TrendingDown, TrendingUp, AlertTriangle, PlayCircle, BookOpen, Activity, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { StudentMistakeItem } from '../../../types/types';
import { generateWeaknessReport } from '../../../services/geminiService';

interface MyWeaknessProps {
  mistakes?: StudentMistakeItem[];
  onStartPractice?: () => void;
}

export const MyWeakness: React.FC<MyWeaknessProps> = ({ mistakes = [], onStartPractice }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
        setIsLoading(true);
        const data = await generateWeaknessReport(mistakes);
        if (data) {
            setReportData(data);
        } else {
            // Fallback mock data if AI fails
            setReportData({
                weakestSubject: "Math",
                scoreLoss: 23,
                insightMessage: "Math is costing you 23% of your potential score.",
                topicsToFix: ["Percentage", "Profit & Loss", "Ratio", "Algebra", "Geometry"]
            });
        }
        setIsLoading(false);
    };

    fetchReport();
  }, [mistakes]);

  // Fallback data if still loading
  const displayData = reportData || {
      weakestSubject: "Math",
      scoreLoss: 23,
      insightMessage: "Math is costing you 23% of your potential score.",
      topicsToFix: ["Percentage", "Profit & Loss", "Ratio", "Algebra", "Geometry"]
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto rounded-3xl ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-500">
            <Target size={28} />
        </div>
        <div>
            <h1 className="text-2xl font-black">আমার দুর্বলতা অ্যানালাইসিস</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                তোমার কোন সাবজেক্টে সমস্যা এবং কীভাবে উন্নতি করবে তার ডেটা-ড্রিভেন রিপোর্ট
            </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          {/* Column 1: Preparation Breakdown */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity size={18} className="text-cyan-500"/> Your Preparation</h3>
              
              <div className="space-y-4">
                  {/* Bangladesh Affairs */}
                  <div>
                      <div className="flex justify-between text-sm font-bold mb-1">
                          <span>Bangladesh Affairs</span>
                          <span className="text-green-500">82%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                  </div>
                  {/* English */}
                  <div>
                      <div className="flex justify-between text-sm font-bold mb-1">
                          <span>English</span>
                          <span className="text-amber-500">61%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '61%' }}></div>
                      </div>
                  </div>
                  {/* Weakest Subject */}
                  <div>
                      <div className="flex justify-between text-sm font-bold mb-1">
                          <span className="flex items-center gap-1">{displayData.weakestSubject} <TrendingDown size={14} className="text-red-500"/></span>
                          <span className="text-red-500">{100 - displayData.scoreLoss - 20}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${100 - displayData.scoreLoss - 20}%` }}></div>
                      </div>
                  </div>
                  {/* Science */}
                  <div>
                      <div className="flex justify-between text-sm font-bold mb-1">
                          <span>Science</span>
                          <span className="text-blue-500">76%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Column 2: Actionable Insight */}
          <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 relative overflow-hidden">
                  {isLoading && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <div className="flex items-center gap-2 text-red-500 font-bold">
                              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                              AI is analyzing your weaknesses...
                          </div>
                      </div>
                  )}

                  <h3 className="font-bold text-red-600 dark:text-red-400 flex items-start gap-2 text-lg relative z-0">
                      <AlertTriangle className="shrink-0 mt-1" size={20} />
                      <span>{displayData.insightMessage}</span>
                  </h3>
                  <div className="mt-4 pl-7 relative z-0">
                      <p className={`text-sm font-bold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Fix these {displayData.topicsToFix.length} topics to boost your score:</p>
                      <ul className="space-y-2">
                          {displayData.topicsToFix.map((topic: string, i: number) => (
                              <li key={i} className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-500 flex items-center justify-center text-[10px] font-black">{i+1}</span>
                                  {topic}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* Action Button */}
              <button onClick={onStartPractice} className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/20 transition-all">
                  <PlayCircle size={22} />
                  Fix My Weakness &rarr; Start Practice
              </button>
          </div>
      </div>
    </div>
  );
};
