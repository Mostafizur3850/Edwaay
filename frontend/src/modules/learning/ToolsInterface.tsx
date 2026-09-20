import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, FileType, Table, Image, Layers, ArrowLeft, Upload, CheckCircle2, Download, X, Loader2, File, AlertCircle, Sparkles, RefreshCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Tool Configuration
const TOOLS_CONFIG: Record<string, any> = {
    'pdf-to-word': {
        title: 'PDF to Word Converter',
        desc: 'Convert your PDF documents to editable Word files instantly.',
        accept: '.pdf',
        icon: FileText,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        resultExt: '.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    'word-to-pdf': {
        title: 'Word to PDF Converter',
        desc: 'Transform your DOCX files into professional, read-only PDFs.',
        accept: '.doc,.docx',
        icon: FileType,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        resultExt: '.pdf',
        mimeType: 'application/pdf'
    },
    'pdf-to-excel': {
        title: 'PDF to Excel Converter',
        desc: 'Extract tables from PDFs into editable Excel spreadsheets.',
        accept: '.pdf',
        icon: Table,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        resultExt: '.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    'img-to-pdf': {
        title: 'Image to PDF',
        desc: 'Convert JPG, PNG images into a single PDF document.',
        accept: 'image/*',
        icon: Image,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        resultExt: '.pdf',
        mimeType: 'application/pdf'
    },
    'merge-pdf': {
        title: 'Merge PDF',
        desc: 'Combine multiple PDF files into one organized document.',
        accept: '.pdf',
        icon: Layers,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        resultExt: '.pdf',
        multiple: true,
        mimeType: 'application/pdf'
    }
};

export const ToolsInterface = () => {
    const { toolId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const config = toolId ? TOOLS_CONFIG[toolId] : null;

    useEffect(() => {
        if (!config) {
            navigate('/all-tools');
        }
    }, [config, navigate]);

    if (!config) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const startConversion = () => {
        setIsConverting(true);
        setProgress(0);

        // Simulate conversion progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsConverting(false);
                    setIsDone(true);
                    return 100;
                }
                // Random increment to look natural
                return prev + Math.random() * 15;
            });
        }, 300);
    };

    const handleDownload = () => {
        if (file) {
            const fileName = file.name.split('.')[0] + config.resultExt;
            const blob = new Blob(['Mock converted content'], { type: config.mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };

    const resetTool = () => {
        setFile(null);
        setIsConverting(false);
        setProgress(0);
        setIsDone(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />

            <button 
                onClick={() => navigate('/all-tools')} 
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full transition-all backdrop-blur-md border bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:hover:text-white dark:border-white/5"
            >
                <ArrowLeft size={18} /> <span className="text-sm font-medium">Back</span>
            </button>

            <div className="w-full max-w-xl relative z-10">
                {/* Header */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className={`inline-flex p-4 rounded-3xl ${config.bg} ${config.color} mb-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] ring-1 ring-white/10`}>
                        <config.icon size={40} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                        {config.title}
                    </h1>
                    <p className="text-lg max-w-md mx-auto leading-relaxed text-slate-600 dark:text-slate-400">
                        {config.desc}
                    </p>
                </div>

                {/* Main Interaction Card */}
                <div className="backdrop-blur-xl border rounded-[2.5rem] p-2 shadow-2xl relative overflow-hidden group bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-700/50">
                    <div className="absolute inset-0 bg-gradient-to-br pointer-events-none rounded-[2.5rem] from-slate-100/50 to-transparent dark:from-white/5 dark:to-transparent" />
                    
                    <div className="rounded-[2rem] p-8 md:p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-center items-center border bg-slate-50/50 border-slate-100 dark:bg-slate-950/50 dark:border-slate-800/50">
                        
                        {/* STATE: IDLE / DRAGGING */}
                        {!file && (
                            <div 
                                className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 group-hover:border-slate-600 ${
                                    isDragging 
                                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.2)]' 
                                    : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900/50'
                                }`}>
                                    <div className={`p-5 rounded-full mb-6 transition-all duration-500 ${isDragging ? 'bg-cyan-500 text-white scale-110' : 'bg-slate-100 text-slate-500 group-hover:scale-110 group-hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-white'}`}>
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Drag & Drop file here</h3>
                                    <p className="text-slate-500 text-sm mb-6">or click to browse</p>
                                    
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        className="hidden" 
                                        accept={config.accept}
                                        multiple={config.multiple}
                                        onChange={handleFileSelect}
                                    />
                                    
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-8 py-3 font-bold rounded-xl transition-all transform hover:-translate-y-1 shadow-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900"
                                    >
                                        Browse Files
                                    </button>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-widest">
                                    <AlertCircle size={14} /> Supports: {config.accept.replace(/\./g, '').toUpperCase()}
                                </div>
                            </div>
                        )}

                        {/* STATE: FILE SELECTED / CONVERTING */}
                        {file && !isDone && (
                            <div className="w-full animate-in fade-in zoom-in duration-300">
                                <div className="rounded-2xl p-6 border mb-8 relative group/file bg-white border-slate-200 shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
                                    <button 
                                        onClick={() => !isConverting && setFile(null)}
                                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-slate-100 text-slate-500 hover:text-slate-900 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white ${isConverting ? 'hidden' : ''}`}
                                    >
                                        <X size={18} />
                                    </button>
                                    
                                    <div className="flex items-center gap-5">
                                        <div className={`w-16 h-16 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center shadow-lg`}>
                                            <FileText size={32} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold truncate text-slate-900 dark:text-white">{file.name}</h4>
                                            <p className="text-sm font-mono mt-1 text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                </div>

                                {isConverting ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                                            <span>Converting...</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-4 rounded-full overflow-hidden p-1 border bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-300 relative overflow-hidden ${config.bg.replace('/10', '')}`}
                                                style={{ width: `${progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite]" />
                                            </div>
                                        </div>
                                        <div className="text-center text-slate-500 text-xs animate-pulse">
                                            Please wait while we process your document
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={startConversion}
                                        className={`w-full py-5 rounded-2xl font-bold text-white text-lg shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${config.bg.replace('/10', '')} flex items-center justify-center gap-3`}
                                    >
                                        <Sparkles size={20} className="animate-pulse" />
                                        Convert to {config.resultExt.replace('.', '').toUpperCase()}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* STATE: DONE */}
                        {isDone && (
                            <div className="text-center w-full animate-in slide-in-from-bottom-8 duration-500">
                                <div className="w-28 h-28 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)] relative">
                                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20" />
                                    <CheckCircle2 size={56} className="text-white drop-shadow-md" />
                                </div>
                                <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Ready to Download!</h2>
                                <p className="mb-10 text-slate-600 dark:text-slate-400">Your file has been converted successfully.</p>
                                
                                <div className="space-y-4">
                                    <button 
                                        onClick={handleDownload}
                                        className="w-full py-4 font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 transform hover:-translate-y-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900"
                                    >
                                        <Download size={22} /> Download {config.resultExt.toUpperCase()}
                                    </button>
                                    
                                    <button 
                                        onClick={resetTool}
                                        className="text-sm font-bold flex items-center justify-center gap-2 py-2 transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        <RefreshCcw size={14} /> Convert Another File
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};