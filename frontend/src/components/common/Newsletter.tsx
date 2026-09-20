import React, { useState } from 'react';
import { Check, Mail, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Newsletter = () => {
    const { t, language } = useLanguage();
    const isBn = language === 'bn';

    const [email, setEmail] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>(['SSC Updates', 'New Quiz Alerts']);
    const [subscribed, setSubscribed] = useState(false);

    const interests = [
        { label: 'SSC Updates', bnLabel: 'এসএসসি আপডেট', colorClass: 'from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' },
        { label: 'HSC Admission News', bnLabel: 'এইচএসসি এডমিশন নিউজ', colorClass: 'from-purple-500 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' },
        { label: 'Job Prep Tips', bnLabel: 'জব প্রস্তুতি টিপস', colorClass: 'from-orange-500 to-amber-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' },
        { label: 'New Quiz Alerts', bnLabel: 'নতুন কুইজ এলার্ট', colorClass: 'from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' },
        { label: 'AI Mentor Insights', bnLabel: 'এআই মেন্টর টিপস', colorClass: 'from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(52,211,153,0.5)]' }
    ];

    const toggleInterest = (label: string) => {
        if (selectedInterests.includes(label)) {
            setSelectedInterests(selectedInterests.filter(i => i !== label));
        } else {
            setSelectedInterests([...selectedInterests, label]);
        }
    };

    const handleSubscribe = () => {
        if(email) {
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 5000);
            setEmail('');
        }
    };

    return (
        <section className="relative z-10 py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500">
            {/* Background Glows for section */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-100 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
            
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 md:p-16 text-center mb-8 relative overflow-hidden shadow-xl dark:shadow-none transition-all">
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-800/20 pointer-events-none" />
                     
                     <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight relative z-10">
                        {isBn ? 'আপডেট থাকুন! আপনার নিউজলেটার' : 'Stay Updated! Customize Your'} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-400 dark:from-white dark:to-slate-400">
                           {isBn ? 'কাস্টমাইজ করুন' : 'Newsletter'}
                        </span>
                     </h2>
                     <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed relative z-10">
                        {isBn 
                          ? 'আপনার ইনবক্সে সরাসরি পড়াশোনা ও পরীক্ষার টিপস পেতে নিচের পছন্দের বিষয় নির্বাচন করুন।' 
                          : 'Get personalized news, tips, and updates delivered straight to your inbox. Select your interests below to get started.'}
                     </p>
                </div>

                {/* Form Card with Cosmic Background */}
                <div className="relative rounded-[2.5rem] p-8 md:p-14 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 group bg-white dark:bg-transparent transition-colors">
                    
                    {/* The Cosmic Background Layer */}
                    <CosmicBackground />

                    <div className="max-w-2xl mx-auto relative z-10">
                        {subscribed ? (
                            <div className="text-center py-10 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                                    <Check size={40} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {isBn ? 'সফলভাবে সাবস্ক্রাইব হয়েছে!' : 'Subscribed Successfully!'}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    {isBn ? 'আপনার ইমেইল ইনবক্স চেক করে আপডেট থাকুন।' : 'Keep an eye on your inbox for the latest updates.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Email Input */}
                                <div className="mb-12">
                                    <label className="block text-center text-slate-700 dark:text-slate-300 font-medium mb-4">
                                        {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <Mail className="h-6 w-6 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                                        </div>
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={isBn ? 'আপনার ইমেইল ঠিকানা লিখুন' : 'Enter your email address'} 
                                            className="block w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-950/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-lg shadow-inner"
                                        />
                                    </div>
                                </div>

                                {/* Interests Selection */}
                                <div className="mb-12 text-center">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
                                        {isBn ? 'পছন্দের বিষয় নির্বাচন করুন' : 'Customize Your Feed'}
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {interests.map((interest) => {
                                            const isSelected = selectedInterests.includes(interest.label);
                                            return (
                                                <button 
                                                    key={interest.label}
                                                    onClick={() => toggleInterest(interest.label)}
                                                    className={`group relative px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 flex items-center gap-2 border ${
                                                        isSelected 
                                                        ? 'border-transparent text-white transform scale-105' 
                                                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-400 hover:text-slate-900 dark:hover:text-slate-200 backdrop-blur-sm'
                                                    }`}
                                                >
                                                    {/* Gradient Background for Selected State */}
                                                    {isSelected && (
                                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${interest.colorClass} opacity-100 -z-10`} />
                                                    )}
                                                    
                                                    {isSelected && <Check size={18} className="text-white animate-in zoom-in duration-200" />}
                                                    {isBn ? interest.bnLabel : interest.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Subscribe Button */}
                                <button onClick={handleSubscribe} className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold rounded-2xl text-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-1 active:scale-[0.99] flex items-center justify-center gap-3">
                                    {isBn ? 'সাবস্ক্রাইব করুন' : 'Subscribe Now'} <Sparkles size={24} className="animate-pulse" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};

const CosmicBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none select-none">
    {/* Deep Space Gradient Base for Dark Mode, Light Gradient for Light Mode */}
    <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#0f172a] transition-colors duration-500" />
    
    {/* Animated Stars - Only visible in dark mode */}
    <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
        {[...Array(40)].map((_, i) => (
            <div
                key={i}
                className="absolute bg-white rounded-full shadow-[0_0_3px_#fff]"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    opacity: Math.random() * 0.7 + 0.3,
                    animation: `twinkle ${Math.random() * 4 + 2}s infinite ease-in-out ${Math.random() * 2}s`
                }}
            />
        ))}
    </div>

    {/* Dynamic Nebula Effects - Adjusted visibility for light mode */}
    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-10 dark:opacity-20 animate-pulse bg-cyan-400 dark:bg-cyan-600 mix-blend-multiply dark:mix-blend-screen" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-5 dark:opacity-10 bg-purple-400 dark:bg-purple-600 mix-blend-multiply dark:mix-blend-screen" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-[80px] opacity-10 dark:opacity-20 animate-pulse delay-1000 bg-blue-400 dark:bg-blue-600 mix-blend-multiply dark:mix-blend-screen" />

    {/* Subtle Grid Overlay */}
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />

    {/* Keyframes Injection for Twinkle Animation */}
    <style>{`
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 8px rgba(255,255,255,0.8); }
        }
    `}</style>
  </div>
);