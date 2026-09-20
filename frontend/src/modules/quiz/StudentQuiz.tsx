import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, LogOut, CheckCircle2, Timer, Eye, AlertTriangle, Play, ChevronRight, Hash, Clock, ListChecks } from 'lucide-react';

interface QuizData {
    title: string;
    timeLimit: number; // minutes
    questions: {
        id: string;
        text: string;
        options: string[];
        correctIndex: number;
    }[];
}

export const StudentQuiz = () => {
    const { quizData: encodedData } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [status, setStatus] = useState<'valid' | 'barred' | 'loading'>('loading');
    const [barredReason, setBarredReason] = useState('');

    // --- PROCTORING LOGIC ---
    useEffect(() => {
        if (!isStarted || isFinished) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                barUser('Violation: Tab switching detected. You have been barred from the test.');
            }
        };

        const handleBlur = () => {
            barUser('Violation: Window focus lost. You might have opened a new tab or switched windows.');
        };

        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();
            // Optional: just ignore paste or bar user
            // barUser('Violation: Paste attempt detected.');
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [isStarted, isFinished]);

    const barUser = (reason: string) => {
        setIsFinished(true);
        setStatus('barred');
        setBarredReason(reason);
        sessionStorage.setItem(`barred_${encodedData}`, reason);
    };

    // --- INITIALIZATION ---
    useEffect(() => {
        try {
            if (encodedData) {
                const barred = sessionStorage.getItem(`barred_${encodedData}`);
                if (barred) {
                    setStatus('barred');
                    setBarredReason(barred);
                    return;
                }

                const decoded = JSON.parse(decodeURIComponent(escape(atob(encodedData))));
                setQuiz(decoded);
                setTimeLeft(decoded.timeLimit * 60);
                setStatus('valid');
            }
        } catch (e) {
            setStatus('barred');
            setBarredReason('Invalid quiz link.');
        }
    }, [encodedData]);

    // --- TIMER ---
    useEffect(() => {
        if (!isStarted || isFinished || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isStarted, isFinished, timeLeft]);

    const handleAnswer = (optionIdx: number) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = optionIdx;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentIndex < quiz!.questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Hash className="text-cyan-500" size={40} />
                </motion.div>
            </div>
        );
    }

    if (status === 'barred') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 p-10 rounded-[3rem] border border-white/10 max-w-md text-center"
                >
                    <ShieldAlert className="text-red-500 mx-auto mb-6" size={64} />
                    <h2 className="text-3xl font-black text-white mb-4 italic uppercase">Access Barred</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">{barredReason}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-colors"
                    >
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!isStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Eye size={160} />
                    </div>
                    
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                        {quiz?.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 mb-10">
                        <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                            <Clock size={18} /> {quiz?.timeLimit} Minutes
                        </span>
                        <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                            <ListChecks size={18} /> {quiz?.questions.length} Questions
                        </span>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30 mb-10">
                        <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-2 uppercase text-xs tracking-widest">
                            <ShieldAlert size={16} /> Important Security Rules
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'Do not switch tabs or minimize the window.',
                                'Closing this window will terminate the test.',
                                'Right-click and copy-paste are disabled.',
                                'The system tracks your focus state in real-time.'
                            ].map((rule, i) => (
                                <li key={i} className="text-sm text-red-600/80 dark:text-red-400/70 flex items-start gap-2">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button 
                        onClick={() => setIsStarted(true)}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-5 rounded-[2rem] text-xl shadow-xl shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        Begin Examination <Play fill="currentColor" size={20} />
                    </button>
                </motion.div>
            </div>
        );
    }

    if (isFinished) {
        const correctCount = answers.reduce((acc, ans, idx) => {
            return ans === quiz?.questions[idx].correctIndex ? acc + 1 : acc;
        }, 0);
        const percentage = Math.round((correctCount / quiz!.questions.length) * 100);

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] p-12 border border-slate-200 dark:border-white/10 shadow-2xl text-center"
                >
                    <CheckCircle2 className="text-green-500 mx-auto mb-6" size={80} />
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase italic">Test Completed</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your response has been successfully recorded.</p>
                    
                    <div className="flex justify-center gap-12 mb-10">
                        <div className="text-center">
                            <span className="block text-4xl font-extrabold text-cyan-600">{correctCount}/{quiz?.questions.length}</span>
                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Score</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-4xl font-extrabold text-cyan-600">{percentage}%</span>
                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Accuracy</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold py-4 rounded-2xl transition-all hover:scale-105"
                    >
                        Finish & Close
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = quiz!.questions[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header Info */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/5 shadow-sm text-cyan-500 font-bold">
                            {currentIndex + 1}
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Progress</p>
                            <div className="flex gap-1 mt-1">
                                {quiz?.questions.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1 rounded-full transition-all ${
                                            i === currentIndex ? 'w-6 bg-cyan-500' : 
                                            i < currentIndex ? 'w-2 bg-green-500' : 'w-2 bg-slate-300 dark:bg-slate-800'
                                        }`} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`px-5 py-2.5 rounded-2xl font-mono text-lg font-bold flex items-center gap-2 border ${
                        timeLeft < 60 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 animate-pulse' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white'
                    }`}>
                        <Timer size={18} /> {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Question Area */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentIndex}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl"
                    >
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-10 leading-snug">
                            {currentQuestion.text}
                        </h3>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full text-left p-6 rounded-[1.5rem] border-2 font-bold transition-all flex items-center justify-between group ${
                                        answers[currentIndex] === idx 
                                        ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                                        : 'bg-slate-50/50 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                                    }`}
                                >
                                    <span>{option}</span>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        answers[currentIndex] === idx 
                                        ? 'bg-cyan-500 border-cyan-500 text-white' 
                                        : 'border-slate-300 dark:border-slate-600 group-hover:border-cyan-500'
                                    }`}>
                                        {answers[currentIndex] === idx && <CheckCircle2 size={14} />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-end">
                            <button 
                                disabled={answers[currentIndex] === undefined}
                                onClick={nextQuestion}
                                className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                            >
                                {currentIndex === quiz!.questions.length - 1 ? 'Submit Test' : 'Next Question'}
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
