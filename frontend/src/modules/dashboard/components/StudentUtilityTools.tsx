import React, { useState, useRef } from 'react';
import {
  FileText, FileCode, Table, Image as ImageIcon, Layers, File, Upload, Download,
  CheckCircle2, Sparkles, AlertCircle, RefreshCw, X, Eye, Calculator as CalcIcon,
  Timer, StickyNote, BookOpen, Settings, Play, Pause, Plus, Trash2, ArrowRight
} from 'lucide-react';
import {
  apiConvertPdfToWord, apiConvertWordToPdf, apiConvertPdfToExcel,
  apiConvertImgToPdf, apiMergePdfs, apiGenerateCv
} from '../../../services/api';

export interface StudentUtilityToolsProps {
  currentUser?: any;
}

export const StudentUtilityTools: React.FC<StudentUtilityToolsProps> = ({ currentUser }) => {
  // Main Selected Tool State
  const [selectedTool, setSelectedTool] = useState<
    'pdf-to-word' | 'word-to-pdf' | 'pdf-to-excel' | 'img-to-pdf' | 'merge-pdf' | 'cv-builder' | 'calculator' | 'timer' | 'flashcards' | 'notes'
  >('pdf-to-word');

  // File Upload & Processing State
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [convertedResult, setConvertedResult] = useState<{ name: string; blob: Blob; url: string; type: string } | null>(null);

  // CV Builder Form State
  const [cvData, setCvData] = useState({
    fullName: currentUser?.name || 'Gazi Salahuddin',
    email: 'salahuddin@example.com',
    phone: '+880 1700-000000',
    location: 'Dhaka, Bangladesh',
    institution: currentUser?.institution || 'Dhaka University',
    targetGoal: currentUser?.targetGoal || '46th BCS Admin Cadre & Software Engineer',
    summary: 'Dedicated and result-oriented student with strong analytical skills, problem solving abilities and passion for excellence.',
    skills: 'JavaScript, React, Python, Data Analysis, Physics Vector Calculus, General Knowledge',
    education: 'B.Sc in Computer Science & Engineering (2022 - Present)\nHSC Science (GPA 5.00)',
    projects: '• TakeUUp Educational Platform Module\n• Physics Simulator Web Utility',
  });

  // Pomodoro State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. FILE ULECTION & HANDLERS
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles(files);
      setConvertedResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(files);
      setConvertedResult(null);
    }
  };

  // 2. PROCESS & CONVERT FILES (100% REAL WORKING CONVERSIONS)
  const handleProcessFile = async () => {
    if (uploadedFiles.length === 0 && selectedTool !== 'cv-builder') return;
    setIsProcessing(true);
    setProcessProgress(30);

    try {
      let res: { blob: Blob; filename: string };

      if (selectedTool === 'pdf-to-word') {
        setProcessProgress(60);
        res = await apiConvertPdfToWord(uploadedFiles[0]);
      } else if (selectedTool === 'word-to-pdf') {
        setProcessProgress(60);
        res = await apiConvertWordToPdf(uploadedFiles[0]);
      } else if (selectedTool === 'pdf-to-excel') {
        setProcessProgress(60);
        res = await apiConvertPdfToExcel(uploadedFiles[0]);
      } else if (selectedTool === 'img-to-pdf') {
        setProcessProgress(60);
        res = await apiConvertImgToPdf(uploadedFiles);
      } else if (selectedTool === 'merge-pdf') {
        setProcessProgress(60);
        res = await apiMergePdfs(uploadedFiles);
      } else {
        setProcessProgress(60);
        res = await apiGenerateCv(cvData);
      }

      setProcessProgress(100);
      const url = URL.createObjectURL(res.blob);
      setConvertedResult({
        name: res.filename,
        blob: res.blob,
        url,
        type: res.filename.split('.').pop() || 'doc'
      });
    } catch (e) {
      console.error('File process error:', e);
      alert('Error converting document. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculator button handler
  const handleCalcClick = (val: string) => {
    if (val === 'C') setCalcDisplay('0');
    else if (val === '=') {
      try {
        const res = Function(`"use strict"; return (${calcDisplay.replace(/×/g, '*').replace(/÷/g, '/')})`)();
        setCalcDisplay(String(res));
      } catch (e) {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay(prev => prev === '0' || prev === 'Error' ? val : prev + val);
    }
  };

  const TOOLS_LIST = [
    { id: 'pdf-to-word', label: 'PDF to Word', icon: FileText, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'word-to-pdf', label: 'Word to PDF', icon: FileCode, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { id: 'pdf-to-excel', label: 'PDF to Excel', icon: Table, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'img-to-pdf', label: 'Img to PDF', icon: ImageIcon, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 'merge-pdf', label: 'Merge PDF', icon: Layers, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    { id: 'cv-builder', label: 'CV Builder', icon: File, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* 🌟 STUDENT UTILITY TOOLS FREE CONTAINER (MATCHING USER SCREENSHOT EXACTLY) */}
      <div className="bg-[#0c101a] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center">
            <Settings size={20} />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-wide flex items-center gap-2.5">
            Student Utility Tools
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded font-black border border-emerald-500/30 uppercase tracking-widest">
              FREE
            </span>
          </h2>
        </div>

        {/* 6 TOOL BUTTON CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {TOOLS_LIST.map(tool => {
            const isSelected = (selectedTool === tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id as any);
                  setUploadedFiles([]);
                  setConvertedResult(null);
                }}
                className={`p-5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 group relative ${
                  isSelected
                    ? 'bg-slate-850 border-cyan-500/60 shadow-xl shadow-cyan-500/10 scale-105'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className={`p-3 rounded-xl border ${tool.color} transition-transform group-hover:scale-110`}>
                  <tool.icon size={22} />
                </div>
                <span className={`text-xs font-bold text-center ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🛠️ ACTIVE CONVERTER & FILE WORKSPACE (100% REAL FUNCTIONAL WORKING) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        
        {/* Tool Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="text-cyan-400" size={18} />
              {TOOLS_LIST.find(t => t.id === selectedTool)?.label || 'Document Utility'}
            </h3>
            <p className="text-xs text-slate-400">
              {selectedTool === 'pdf-to-word' && 'Convert PDF lectures into editable Word (.docx) documents.'}
              {selectedTool === 'word-to-pdf' && 'Convert Word (.docx/.txt) notes into printable PDF files.'}
              {selectedTool === 'pdf-to-excel' && 'Extract tabular data from PDF into downloadable Excel (.csv) sheets.'}
              {selectedTool === 'img-to-pdf' && 'Compile multiple handwritten notes images into a single PDF.'}
              {selectedTool === 'merge-pdf' && 'Combine multiple PDF files into one single PDF file.'}
              {selectedTool === 'cv-builder' && 'Build and download your professional student CV in PDF format.'}
            </p>
          </div>

          <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-mono border border-slate-700">
            Client-Side Engine Active
          </span>
        </div>

        {/* 1. DOCUMENT FILE CONVERTERS WORKSPACE */}
        {selectedTool !== 'cv-builder' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            
            {/* File Drag & Drop Upload Zone */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-3xl p-8 text-center bg-slate-950/60 cursor-pointer transition-all space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={selectedTool === 'img-to-pdf' || selectedTool === 'merge-pdf'}
                accept={
                  selectedTool === 'pdf-to-word' || selectedTool === 'pdf-to-excel' || selectedTool === 'merge-pdf'
                    ? '.pdf'
                    : selectedTool === 'word-to-pdf'
                    ? '.doc,.docx,.txt'
                    : selectedTool === 'img-to-pdf'
                    ? 'image/*'
                    : '*'
                }
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {uploadedFiles.length > 0
                    ? `${uploadedFiles.length} file(s) selected: ${uploadedFiles.map(f => f.name).join(', ')}`
                    : 'Click or Drag & Drop File Here'}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedTool === 'img-to-pdf' ? 'Supports JPG, PNG, WEBP images' : 'Supports PDF, Word, TXT files'}
                </p>
              </div>
            </div>

            {/* Selected File Details & Actions */}
            {uploadedFiles.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Files Ready to Convert:</span>
                  <button onClick={() => { setUploadedFiles([]); setConvertedResult(null); }} className="text-red-400 hover:underline font-bold">
                    Remove
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="font-mono truncate max-w-xs">📄 {f.name}</span>
                      <span className="text-[10px] text-slate-500">{(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleProcessFile}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {isProcessing ? `Processing Document (${processProgress}%)...` : `Convert & Process ${TOOLS_LIST.find(t => t.id === selectedTool)?.label}`}
                </button>
              </div>
            )}

            {/* REAL CONVERTED DOWNLOAD RESULT */}
            {convertedResult && (
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/30 p-6 rounded-3xl text-center space-y-4 shadow-2xl animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">Conversion Completed Successfully!</h4>
                  <p className="text-xs text-slate-400 mt-1">File Name: <span className="text-emerald-300 font-mono font-bold">{convertedResult.name}</span></p>
                </div>

                <a
                  href={convertedResult.url}
                  download={convertedResult.name}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-xl transition-transform hover:scale-105"
                >
                  <Download size={18} /> Download Converted File ({convertedResult.name.split('.').pop()?.toUpperCase()})
                </a>
              </div>
            )}
          </div>
        )}

        {/* 2. REAL INTERACTIVE CV BUILDER WORKSPACE */}
        {selectedTool === 'cv-builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form inputs */}
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Student CV Details</h4>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={cvData.fullName}
                  onChange={e => setCvData({ ...cvData, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Email</label>
                  <input
                    type="text"
                    value={cvData.email}
                    onChange={e => setCvData({ ...cvData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={cvData.phone}
                    onChange={e => setCvData({ ...cvData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Target Role / Career Goal</label>
                <input
                  type="text"
                  value={cvData.targetGoal}
                  onChange={e => setCvData({ ...cvData, targetGoal: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Executive Summary</label>
                <textarea
                  rows={2}
                  value={cvData.summary}
                  onChange={e => setCvData({ ...cvData, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Skills & Key Qualifications</label>
                <input
                  type="text"
                  value={cvData.skills}
                  onChange={e => setCvData({ ...cvData, skills: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Education Background</label>
                <textarea
                  rows={2}
                  value={cvData.education}
                  onChange={e => setCvData({ ...cvData, education: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleProcessFile}
                disabled={isProcessing}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
                Generate & Download Printable PDF CV
              </button>
            </div>

            {/* Live CV Document Preview */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-4 font-sans text-xs border border-slate-300">
              <div className="border-b-2 border-cyan-600 pb-3">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">{cvData.fullName}</h2>
                <p className="text-cyan-700 font-bold text-xs">{cvData.targetGoal}</p>
                <p className="text-[10px] text-slate-500 mt-1">{cvData.email} | {cvData.phone} | {cvData.location}</p>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-cyan-800">Executive Summary</h3>
                <p className="text-slate-700 leading-relaxed">{cvData.summary}</p>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-cyan-800">Education & Institution</h3>
                <p className="text-slate-700 font-semibold">{cvData.institution}</p>
                <p className="text-slate-600 whitespace-pre-line">{cvData.education}</p>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-cyan-800">Key Skills</h3>
                <p className="text-slate-700">{cvData.skills}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
