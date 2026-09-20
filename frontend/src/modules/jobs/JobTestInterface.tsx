import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, Building2, Briefcase, XCircle, FileText, Quote, Sparkles, X } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Success doesn’t just find you. You have to go out and get it.", author: "Unknown" }
];

export const JobTestInterface = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
    const [resultStatus, setResultStatus] = useState<'pass' | 'fail' | 'review'>('review');
    const [score, setScore] = useState(0);
    
    // Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

    // Anti-Cheat: Prevent context menu
    useEffect(() => {
        const handleContextMenu = (e: Event) => e.preventDefault();
        const handleCopy = (e: ClipboardEvent) => { e.preventDefault(); return false; };
        const handleCut = (e: ClipboardEvent) => { e.preventDefault(); return false; };
        const handlePaste = (e: ClipboardEvent) => { e.preventDefault(); return false; };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('cut', handleCut);
        document.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('cut', handleCut);
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    useEffect(() => {
        // Fetch job from localStorage
        const storedJobs = localStorage.getItem('takeuup_jobs');
        if (storedJobs) {
            const jobs = JSON.parse(storedJobs);
            const foundJob = jobs.find((j: any) => j.id.toString() === jobId);
            if (foundJob) {
                setJob(foundJob);
            } else {
                alert("Job not found.");
                navigate('/jobs/search');
            }
        }
    }, [jobId, navigate]);

    useEffect(() => {
        if (timeLeft > 0 && !submitted) {
            const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !submitted) {
            handleSubmit();
        }
    }, [timeLeft, submitted]);

    const handleInput = (questionId: number, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = () => {
        if (!job) return;
        
        let correctCount = 0;
        let hasDescriptive = false;

        job.testConfig.questions.forEach((q: any) => {
            if (q.type === 'descriptive') {
                hasDescriptive = true;
            } else {
                if (answers[q.id] === q.correct) {
                    correctCount++;
                }
            }
        });

        let status = 'Under Review';
        let finalScore = 0;

        if (hasDescriptive) {
            setResultStatus('review');
            status = 'Under Review';
        } else {
            finalScore = (correctCount / job.testConfig.questions.length) * 100;
            setScore(finalScore);
            if (finalScore >= job.testConfig.passingScore) {
                setResultStatus('pass');
                status = 'Qualified';
            } else {
                setResultStatus('fail');
                status = 'Disqualified';
            }
        }
        
        // --- UPDATE APPLICATION IN STORAGE FOR ADMIN ---
        const storedApps = localStorage.getItem('takeuup_applications');
        if (storedApps) {
            const apps = JSON.parse(storedApps);
            const appIndex = apps.findIndex((a: any) => a.jobId.toString() === jobId && a.status === 'Pending Test');
            
            if (appIndex !== -1) {
                apps[appIndex].status = status;
                apps[appIndex].testScore = finalScore;
                apps[appIndex].testAnswers = answers;
                apps[appIndex].testResult = resultStatus;
                localStorage.setItem('takeuup_applications', JSON.stringify(apps));
            }
        }

        // Set Random Quote
        setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
        setSubmitted(true);
        setShowSuccessModal(true);
    };

    if (!job) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading...</div>;

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white font-sans py-10 px-4 select-none relative">
            
            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-8 shadow-2xl text-center overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] border border-green-500/30">
                                <CheckCircle2 size={40} />
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Application Submitted!</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-6">
                                Status: In Review
                            </div>

                            <p className="text-slate-300 mb-8 leading-relaxed">
                                Thank you for completing the assessment. Your application and test results have been securely recorded. Our team will review your profile and get back to you shortly.
                            </p>

                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 relative mb-8">
                                <Quote size={24} className="text-cyan-500 absolute top-4 left-4 opacity-50" />
                                <p className="text-white italic font-medium relative z-10 px-4">
                                    "{quote.text}"
                                </p>
                                <p className="text-slate-500 text-xs font-bold mt-3 uppercase tracking-widest text-right">
                                    — {quote.author}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Link to="/jobs/search" className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">
                                    Browse More Jobs
                                </Link>
                                <Link to="/dashboard" className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20">
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-[#151921] border border-white/5 rounded-3xl p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Screening Test</h1>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                            <Briefcase size={14} /> {job.title} at <span className="text-cyan-400">{job.company}</span>
                        </p>
                    </div>
                    {!submitted && (
                        <div className={`px-4 py-2 rounded-xl font-mono font-bold text-xl flex items-center gap-2 ${timeLeft < 60 ? 'bg-red-500/10 text-red-400 border border-red-500/50' : 'bg-slate-800 text-white border border-slate-700'}`}>
                            <Clock size={20} /> {formatTime(timeLeft)}
                        </div>
                    )}
                </div>

                {/* Result View (Background) */}
                {submitted ? (
                    <div className="bg-[#151921] border border-white/5 rounded-3xl p-12 text-center opacity-50 blur-sm pointer-events-none select-none">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                            resultStatus === 'pass' ? 'bg-green-500/20 text-green-400' : 
                            resultStatus === 'review' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                            {resultStatus === 'pass' && <CheckCircle2 size={48} />}
                            {resultStatus === 'review' && <FileText size={48} />}
                            {resultStatus === 'fail' && <XCircle size={48} />}
                        </div>
                        
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {resultStatus === 'pass' ? 'Congratulations!' : resultStatus === 'review' ? 'Submitted for Review' : 'Test Failed'}
                        </h2>
                        
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Processing results...
                        </p>
                    </div>
                ) : (
                    /* Questions View */
                    <div className="space-y-6">
                        {job.testConfig.questions.map((q: any, idx: number) => (
                            <div key={q.id} className="bg-[#1E2330] rounded-2xl p-6 border border-white/5">
                                <div className="mb-4 flex gap-3">
                                    <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs font-bold h-fit mt-0.5">Q{idx + 1}</span>
                                    <h3 className="text-lg font-medium text-slate-200">{q.text}</h3>
                                </div>
                                <div className="pl-0 md:pl-10">
                                    {q.type === 'descriptive' ? (
                                        <textarea 
                                            rows={4}
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleInput(q.id, e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:border-cyan-500 outline-none resize-none"
                                            placeholder="Type your answer here..."
                                        />
                                    ) : (
                                        <div className="space-y-3">
                                            {q.options.map((opt: string, optIdx: number) => (
                                                <label 
                                                    key={optIdx} 
                                                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                                        answers[q.id] === optIdx 
                                                        ? 'bg-cyan-500/10 border-cyan-500 text-white' 
                                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[q.id] === optIdx ? 'border-cyan-500' : 'border-slate-500'}`}>
                                                        {answers[q.id] === optIdx && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />}
                                                    </div>
                                                    <input 
                                                        type="radio" 
                                                        name={`q-${q.id}`} 
                                                        className="hidden" 
                                                        checked={answers[q.id] === optIdx}
                                                        onChange={() => handleInput(q.id, optIdx)}
                                                    />
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end pt-6">
                            <button 
                                onClick={handleSubmit}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                            >
                                Submit Test <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};