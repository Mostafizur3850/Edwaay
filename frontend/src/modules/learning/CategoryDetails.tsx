import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Briefcase, GraduationCap, CheckCircle2, Star, Users, ArrowRight, Sparkles, ScrollText, Shield, Globe, Monitor, MessageSquare } from 'lucide-react';

const CATEGORY_DATA: any = {
    'job-prep': {
        title: 'Job Preparation',
        subtitle: 'Secure your dream government or private job.',
        description: 'Comprehensive preparation for Bank Jobs, NTRCA, Primary, and other government recruitments. Get access to model tests, previous year questions, and expert guidelines.',
        features: ['Bank Job Solutions', 'BCS Preliminary', 'NTRCA Prep', 'Primary Teacher Exam'],
        stats: { students: '25k+', rating: '4.8', courses: '15+' },
        icon: <Briefcase size={40} />,
        gradient: 'from-blue-600 to-indigo-600',
        color: 'text-blue-500'
    },
    'bcs': {
        title: 'BCS Preparation',
        subtitle: 'The ultimate guide to cracking the toughest exam.',
        description: 'A dedicated module for BCS Preliminary and Written exams. Master Bangladesh Affairs, International Affairs, Math, and English with our proven curriculum.',
        features: ['Topic-wise Tests', 'Live Classes', 'Digest PDF', 'Viva Guide'],
        stats: { students: '12k+', rating: '4.9', courses: '8+' },
        icon: <ScrollText size={40} />,
        gradient: 'from-green-600 to-emerald-600',
        color: 'text-green-500'
    },
    'hsc': {
        title: 'HSC Academic',
        subtitle: 'Ace your board exams with confidence.',
        description: 'Complete syllabus coverage for Science, Commerce, and Arts. Interactive video lessons and chapter-wise quizzes to ensure A+ in every subject.',
        features: ['Physics & Chemistry', 'Higher Math', 'Biology', 'ICT & English'],
        stats: { students: '40k+', rating: '4.7', courses: '20+' },
        icon: <BookOpen size={40} />,
        gradient: 'from-purple-600 to-pink-600',
        color: 'text-purple-500'
    },
    'admission': {
        title: 'University Admission',
        subtitle: 'Your gateway to DU, BUET, and Medical.',
        description: 'Specialized programs for Engineering, Medical, and University admission tests. Compete with thousands of students in real-time model tests.',
        features: ['Engineering (BUET/CKRUET)', 'Medical (MBBS)', 'University (DU/JU/RU)', 'Guccho Admission'],
        stats: { students: '18k+', rating: '4.9', courses: '12+' },
        icon: <GraduationCap size={40} />,
        gradient: 'from-orange-500 to-red-600',
        color: 'text-orange-500'
    }
};

export const CategoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (id && CATEGORY_DATA[id]) {
            setData(CATEGORY_DATA[id]);
        } else {
            navigate('/');
        }
        window.scrollTo(0, 0);
    }, [id, navigate]);

    if (!data) return null;

    const handleEnroll = () => {
        const user = localStorage.getItem('takeuup_user');
        if (user) {
            navigate('/pricing', { state: { selectedGoalId: id } });
        } else {
            navigate('/register', { state: { returnTo: '/pricing', selectedGoalId: id } });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b ${data.gradient} opacity-10 dark:opacity-20 pointer-events-none`} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={20} /> Back
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${data.gradient} flex items-center justify-center text-white shadow-xl mb-6`}>
                                {data.icon}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
                                {data.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light mb-8">
                                {data.subtitle}
                            </p>
                            
                            <div className="flex flex-wrap gap-6 mb-10">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{data.stats.students}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Students</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-yellow-500">
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{data.stats.rating}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Rating</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{data.stats.courses}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Modules</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={handleEnroll} className={`px-8 py-4 bg-gradient-to-r ${data.gradient} text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2`}>
                                    Start Learning <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
                            <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} rounded-[2rem] blur-3xl opacity-20`} />
                            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">What's Included?</h3>
                                <div className="space-y-4">
                                    {data.features.map((feature: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                            <div className={`p-2 rounded-full ${data.color.replace('text-', 'bg-')}/10 ${data.color}`}>
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <span className="font-medium text-lg">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-8 text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-6xl mx-auto px-4 mb-24">
                <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0B0F19] border border-slate-800 shadow-2xl group">
                    
                    {/* Animated Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none" />

                    {/* Glowing Orbs */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

                    <div className="relative z-10 py-20 px-6 md:px-12 text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-700">
                            <Sparkles size={12} className="animate-pulse" /> Unlock Your Potential
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                            Ready to start <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">your journey?</span>
                        </h2>
                        
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                            Join thousands of students who have achieved their goals with TakeUUp's premium curriculum.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button 
                                onClick={handleEnroll}
                                className="group relative px-10 py-4 bg-white text-slate-900 font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
                            >
                                <span className="relative z-10">Get Full Access</span>
                                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            
                            <button 
                                onClick={() => navigate('/demo')}
                                className="px-10 py-4 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Try Free Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};