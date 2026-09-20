import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, FileText, Video, Download } from 'lucide-react';

export const ResourcesPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resources = [
    {
      id: 1,
      title: 'HSC Biology Full Note',
      category: 'PDF Note',
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      downloads: '1.2k',
    },
    {
      id: 2,
      title: 'Chemistry Question Bank 2023',
      category: 'Question Bank',
      icon: <BookOpen className="w-8 h-8 text-emerald-500" />,
      downloads: '850',
    },
    {
      id: 3,
      title: 'Physics Formula Sheet',
      category: 'Cheat Sheet',
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      downloads: '2.5k',
    },
    {
      id: 4,
      title: 'BUET Admission Strategy',
      category: 'Video Guide',
      icon: <Video className="w-8 h-8 text-red-500" />,
      downloads: '5.1k',
    },
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">Free Study Resources</h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Download free notes, cheat sheets, and question banks to boost your preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              className={`p-6 rounded-2xl border transition-all hover:shadow-xl group ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 hover:border-cyan-500/50' 
                  : 'bg-white border-slate-200 hover:border-cyan-500/50'
              }`}
            >
              <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {resource.icon}
              </div>
              <div className={`text-sm font-semibold mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                {resource.category}
              </div>
              <h3 className="font-bold text-xl mb-4 line-clamp-2">
                {resource.title}
              </h3>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {resource.downloads} downloads
                </span>
                <button className={`p-2 rounded-full transition-colors ${
                  isDark ? 'bg-slate-700 hover:bg-cyan-500 hover:text-white' : 'bg-slate-100 hover:bg-cyan-500 hover:text-white'
                }`}>
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
