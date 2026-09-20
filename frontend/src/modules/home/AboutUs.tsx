import React, { useState, useEffect } from 'react';
import { Target, Heart, Zap, Globe, Users, Award, Rocket, BookOpen, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { resolveBilingualText } from '../../utils/languageResolver';

export const AboutUs = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { language } = useLanguage();
    const isBn = language === 'bn';

    const [settings, setSettings] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const { fetchAboutUs } = await import('../../services/api');
                const data = await fetchAboutUs();
                if (data) {
                    setSettings(data.settings);
                    setMembers(data.members || []);
                }
            } catch (e) {
                console.error("Failed to load About Us content", e);
            }
        };
        loadContent();
    }, []);

    const DEFAULT_MEMBERS = [
        {
            name: { bn: "প্রকৌশলী তানভীর আহমেদ", en: "Engr. Tanvir Ahmed" },
            role: { bn: "প্রতিষ্ঠাতা ও সিইও (BUET CSE '18)", en: "Founder & CEO (BUET CSE '18)" },
            bio: { bn: "শিক্ষা প্রযুক্তিতে কৃত্রিম বুদ্ধিমত্তা ব্যবহারের মাধ্যমে বাংলাদেশের শিক্ষাব্যবস্থায় বৈপ্লবিক পরিবর্তনের লক্ষ্যে কাজ করছেন।", en: "Pioneering AI in education to revolutionize exam prep for students across Bangladesh." },
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: { bn: "ডাক্তার তাসনিম ফারহানা", en: "Dr. Tasnim Farhana" },
            role: { bn: "হেড অব মেডিকেল অ্যাডমিশন (DMC)", en: "Head of Medical Admission (DMC)" },
            bio: { bn: "বিগত ৬ বছর ধরে হাজারো শিক্ষার্থীকে ঢাকা মেডিকেল কলেজসহ দেশের শীর্ষ সরকারি মেডিকেলে ভর্তিতে গাইড করেছেন।", en: "Mentored thousands of medical aspirants over 6+ years for DMC and public medical colleges." },
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: { bn: "রেজাউল করিম (বিসিএস)", en: "Rezaul Karim (BCS)" },
            role: { bn: "হেড অব বিসিএস ও ক্যারিয়ার হাব", en: "Head of BCS & Career Hub" },
            bio: { bn: "৪৪তম বিসিএস প্রশাসন ক্যাডার। বিসিএস প্রিলিমিনারি ও লিখিত পরীক্ষার টেকনিক্যাল গাইড প্রস্তুতকারক।", en: "44th BCS Admin Cadre. Lead strategist for BCS preliminary & written test preparation." },
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const VALUES = [
        {
            icon: <Target className="w-8 h-8 text-cyan-500" />,
            title: { bn: "সকলের জন্য উন্মুক্ত শিক্ষা", en: "Education For Everyone" },
            desc: {
                bn: "মানের ক্ষেত্রে কোনো আপোষ না করে বাংলাদেশের প্রতিটি প্রত্যন্ত অঞ্চলের শিক্ষার্থীদের জন্য বিনামূল্যে মানসম্মত কন্টেন্ট নিশ্চিতকরণ।",
                en: "Ensuring top-quality learning content, question banks, and quizzes free of cost for every student."
            }
        },
        {
            icon: <Zap className="w-8 h-8 text-indigo-500" />,
            title: { bn: "২৪/৭ AI প্রযুক্তি সাপোর্ট", en: "24/7 AI-Powered Learning" },
            desc: {
                bn: "কৃত্রিম বুদ্ধিমত্তা ব্যবহারের মাধ্যমে যেকোনো কঠিন প্রশ্নের তাৎক্ষণিক ব্যাখ্যা ও ব্যক্তিগত ভুল চিহ্নিতকরণ।",
                en: "Leveraging state-of-the-art AI to offer instant step-by-step problem explanations and mistake analysis."
            }
        },
        {
            icon: <Award className="w-8 h-8 text-amber-500" />,
            title: { bn: "মেধাবীদের স্কলারশিপ সম্মাননা", en: "Merit Scholarship Rewards" },
            desc: {
                bn: "প্রতি সপ্তাহে লাইভ মেগা কুইজের মাধ্যমে সেরা শিক্ষার্থীদের পড়াশোনায় উৎসাহিত করতে নগদ স্কলারশিপ প্রাইজ প্রদান।",
                en: "Rewarding hard-working students with weekly live contest prizes sent directly to their accounts."
            }
        },
        {
            icon: <Users className="w-8 h-8 text-emerald-500" />,
            title: { bn: "সহপাঠী ও মেন্টর চ্যাট", en: "1-on-1 Peer & Mentor Chat" },
            desc: {
                bn: "একই বিষয় ও টার্গেটের সহপাঠীদের সাথে যোগাযোগ ও অভিজ্ঞ মেন্টরদের পরামর্শ নেয়ার স্মার্ট মেসেঞ্জার সুযোগ।",
                en: "Enable direct 1-on-1 messaging with verified mentors and category peers for collaborative study."
            }
        }
    ];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#070b14] text-slate-100' : 'bg-white text-slate-900'} font-sans transition-colors duration-300 overflow-x-hidden`}>
            
            {/* HERO SECTION */}
            <section className={`relative pt-20 pb-20 lg:pt-32 lg:pb-32 px-4 overflow-hidden text-center z-0 ${isDark ? 'bg-[#0b1120]' : 'bg-[#faf9f6]'}`}>
                {/* Animated Background Glowing Orbs */}
                <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isDark ? 'bg-gradient-to-tr from-cyan-900/20 via-blue-900/10 to-indigo-900/20' : 'bg-gradient-to-tr from-[#e5f0f9]/80 via-[#f0f4f8]/60 to-[#e8f2f9]/70'} rounded-full blur-[140px] pointer-events-none animate-pulse`} />
                
                <div className="max-w-4xl mx-auto relative z-10 space-y-6">
                    {/* Top Pill Badge */}
                    <div className={`inline-block mb-2 text-sm font-semibold tracking-wide ${isDark ? 'text-blue-400' : 'text-[#44709d]'}`}>
                        {isBn ? 'আমাদের গল্প ও ভিশন' : 'OUR STORY & VISION'}
                    </div>

                    <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-[#1d232a]'} font-['Inter']`}>
                        {resolveBilingualText(
                            isBn ? (settings?.heroTitleBn || settings?.HeroTitleBn || settings?.heroTitle || settings?.HeroTitle) : (settings?.heroTitleEn || settings?.HeroTitleEn || settings?.heroTitle || settings?.HeroTitle),
                            isBn ? 'আপনার স্বপ্ন পূরণের নির্ভরযোগ্য সঙ্গী' : 'Empowering Your Educational Journey',
                            isBn ? 'আপনার স্বপ্ন পূরণের নির্ভরযোগ্য সঙ্গী' : 'Empowering Your Educational Journey',
                            isBn
                        )}
                    </h1>

                    <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium mt-6 ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
                        {resolveBilingualText(
                            isBn ? (settings?.heroSubtitleBn || settings?.HeroSubtitleBn || settings?.heroSubtitle || settings?.HeroSubtitle) : (settings?.heroSubtitleEn || settings?.HeroSubtitleEn || settings?.heroSubtitle || settings?.HeroSubtitle),
                            'টেকআপ শুধুমাত্র একটি প্ল্যাটফর্ম নয়, এটি প্রযুক্তি ও সঠিক গাইডলাইনের মাধ্যমে প্রতিটি শিক্ষার্থীর লক্ষ্য অর্জনের একটি সুন্দর যাত্রা।',
                            'TakeUUp is more than just a platform. It\'s a supportive journey that combines technology and expert guidance to help every student achieve their goals.',
                            isBn
                        )}
                    </p>

                </div>
            </section>

            {/* LIVE PLATFORM STATS */}
            <section className={`py-12 border-y ${isDark ? 'bg-[#0f172a] border-slate-800/80' : 'bg-white border-slate-200/60'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center flex flex-col items-center justify-center">
                        {[
                            { val: isBn ? '৫০,০০০+' : '50,000+', label: isBn ? 'সক্রিয় শিক্ষার্থী' : 'Active Students' },
                            { val: isBn ? '১,৫০,০০০+' : '150,000+', label: isBn ? 'প্রশ্ন ও সল্যুশন ব্যাংক' : 'Practice Questions' },
                            { val: isBn ? '৯৫%' : '95%', suffix: <span className="text-[#d93838] ml-1 text-xl leading-none">★</span>, label: isBn ? 'সফলতার হার' : 'Success Rate' },
                            { val: isBn ? '৳৮৫,০০০+' : '৳85,000+', prefix: <span className="w-2.5 h-2.5 rounded-full bg-[#75aadb] mr-2 inline-block shadow-[0_0_8px_rgba(117,170,219,0.8)] border border-blue-200"></span>, label: isBn ? 'স্কলারশিপ ফান্ড' : 'Scholarship Fund' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center flex flex-col items-center justify-center">
                                <h3 className={`text-2xl sm:text-3xl font-bold flex items-center justify-center ${isDark ? 'text-white' : 'text-[#1d232a]'}`}>
                                    {stat.prefix}{stat.val}{stat.suffix}
                                </h3>
                                <p className={`text-[10px] sm:text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-[#6b7280]'}`}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* OUR CORE VALUES */}
            <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-[#fcfaf6]'} border-b ${isDark ? 'border-slate-800' : 'border-[#e5e1d8]'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <span className="text-sm font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
                            {isBn ? 'আমাদের মূলনীতি' : 'OUR CORE VALUES'}
                        </span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} font-['Inter']`}>
                            {isBn ? 'যে আদর্শে গড়া টেকআপ প্ল্যাটফর্ম' : 'The Pillars Behind TakeUp Platform'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {VALUES.map((v, i) => (
                            <div key={i} className={`p-8 rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isDark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-slate-800/80 border border-slate-700' : 'bg-slate-50 border border-slate-100'}`}>
                                    {v.icon}
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{v.title[language]}</h3>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {v.desc[language]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MENTORS & LEADERSHIP */}
            <section className={`py-24 ${isDark ? 'bg-[#0f172a]' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <span className="text-sm font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
                            {isBn ? 'আমাদের টিম ও মেন্টর প্যানেল' : 'OUR TEAM & MENTORS'}
                        </span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} font-['Inter']`}>
                            {isBn ? 'অভিজ্ঞ শিক্ষাবিদ ও প্রকৌশলীদের মেলবন্ধন' : 'Led by Educators, Engineers & Doctors'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {DEFAULT_MEMBERS.map((m, i) => (
                            <div key={i} className={`group p-8 rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-[#fcfaf6] border-slate-200 text-slate-900'}`}>
                                <div className="flex flex-col items-center text-center space-y-5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl scale-110 group-hover:bg-cyan-500/30 transition-colors" />
                                        <img src={m.image} alt={m.name[language]} className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.name[language]}</h3>
                                        <p className="text-sm font-bold text-cyan-500">{m.role[language]}</p>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {m.bio[language]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT & LOCATION SUMMARY */}
            <section className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-[#fcfaf6]'}`}>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="p-8 sm:p-12 rounded-3xl bg-[#1ab9c4] text-white shadow-2xl space-y-8 text-center relative overflow-hidden" style={{ backgroundColor: '#1ab9c4' }}>
                        {/* Decorative background shapes */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                        
                        <h2 className="text-3xl sm:text-4xl font-black font-['Inter'] relative z-10">
                            {isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch with Us'}
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-medium pt-4 relative z-10">
                            <div className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                <Phone size={20} className="text-cyan-300" />
                                <span>+৮৮০ ৯৬১২-০০০১০০</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                <Mail size={20} className="text-cyan-300" />
                                <span>support@takeuup.com</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                <MapPin size={20} className="text-cyan-300" />
                                <span>আইসিটি টাওয়ার, ঢাকা</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
