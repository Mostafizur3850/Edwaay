import React, { useState } from 'react';
import { X, PlayCircle, FileText, CheckCircle2, Circle, Download, Sparkles, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { StudentCourse } from '../../../types/types';

interface CourseViewerModalProps {
  course: StudentCourse | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleModule: (courseId: string, moduleId: string) => void;
}

export const CourseViewerModal: React.FC<CourseViewerModalProps> = ({
  course,
  isOpen,
  onClose,
  onToggleModule
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  if (!isOpen || !course) return null;

  const currentModule = course.modules.find(m => m.id === activeModuleId) || course.modules[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{course.title}</h2>
              <p className="text-xs text-slate-400">{course.instructor} • {course.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          {/* Main Video / Content Area */}
          <div className="lg:col-span-2 p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
            <div>
              {/* Simulator Screen */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {currentModule?.type === 'video' ? (
                  <div className="text-center p-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform cursor-pointer">
                      <PlayCircle size={36} fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{currentModule.title}</h3>
                    <p className="text-xs text-slate-400">Duration: {currentModule.duration}</p>
                  </div>
                ) : (
                  <div className="text-center p-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                      <FileText size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{currentModule?.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">Interactive PDF Lecture Sheet</p>
                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto transition-colors shadow-lg shadow-indigo-900/20">
                      <Download size={16} /> Download PDF Lecture Note
                    </button>
                  </div>
                )}
              </div>

              {/* Module Description & Actions */}
              <div className="flex items-center justify-between bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 mb-4">
                <div>
                  <h4 className="font-bold text-white text-sm">{currentModule?.title}</h4>
                  <p className="text-xs text-slate-400">Mark module completed when finished studying.</p>
                </div>
                <button
                  onClick={() => currentModule && onToggleModule(course.id, currentModule.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    currentModule?.completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  {currentModule?.completed ? (
                    <>
                      <CheckCircle2 size={16} /> Completed
                    </>
                  ) : (
                    <>
                      <Circle size={16} /> Mark as Complete
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span>Course Progress</span>
                <span className="text-cyan-400">{course.progressPercentage}% Complete ({course.completedModules}/{course.totalModules} modules)</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${course.progressPercentage}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Module List Sidebar */}
          <div className="p-6 bg-slate-950/50 overflow-y-auto space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={14} /> Course Curriculum ({course.modules.length} Modules)
            </h3>

            {course.modules.map((mod, index) => {
              const isActive = (currentModule?.id === mod.id);
              return (
                <div
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-slate-800 border-cyan-500/50 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleModule(course.id, mod.id);
                      }}
                      className="text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      {mod.completed ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>
                    <div>
                      <h5 className={`text-xs font-bold ${isActive ? 'text-cyan-400' : 'text-slate-200'}`}>
                        {index + 1}. {mod.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 capitalize">{mod.type} • {mod.duration}</span>
                    </div>
                  </div>

                  <ChevronRight size={16} className={isActive ? 'text-cyan-400' : 'text-slate-600'} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
