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
        <div className={`min-h-screen ${isDark ? 'bg-[#070b14] text-slate-100' : 'bg-[#f4f7fc] text-slate-900'
            } font-sans transition-colors duration-300 overflow-x-hidden`}>

            {/* HERO SECTION */}
            <section className="relative pt-28 pb-20 px-4 text-center overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10 space-y-6">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 font-bold text-xs uppercase tracking-wider shadow-md animate-pulse">
                        <Rocket size={14} className="text-cyan-500" />
                        <span>{isBn ? '🚀 আমাদের গল্প ও ভিশন' : '🚀 OUR STORY & VISION'}</span>
                    </div>

                    <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] ${isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                        {resolveBilingualText(
                            isBn ? (settings?.heroTitleBn || settings?.HeroTitleBn || settings?.heroTitle || settings?.HeroTitle) : (settings?.heroTitleEn || settings?.HeroTitleEn || settings?.heroTitle || settings?.HeroTitle),
                            isBn ? 'বাংলাদেশের প্রতিটি শিক্ষার্থীর জন্য সহজ ও নিশ্চিত মানের স্মার্ট শিক্ষা' : 'Democratizing Quality Smart Education For Every Student Across Bangladesh',
                            isBn ? 'বাংলাদেশের প্রতিটি শিক্ষার্থীর জন্য সহজ ও নিশ্চিত মানের স্মার্ট শিক্ষা' : 'Democratizing Quality Smart Education For Every Student Across Bangladesh',
                            isBn
                        )}
                    </h1>

                    <p className={`text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                        {resolveBilingualText(
                            isBn ? (settings?.heroSubtitleBn || settings?.HeroSubtitleBn || settings?.heroSubtitle || settings?.HeroSubtitle) : (settings?.heroSubtitleEn || settings?.HeroSubtitleEn || settings?.heroSubtitle || settings?.HeroSubtitle),
                            'এইচএসসি একাডেমিক থেকে বুয়েট, মেডিকেল ও বিসিএস প্রস্তুতি—টেকআপ প্ল্যাটফর্ম কৃত্রিম বুদ্ধিমত্তা ও বিশ্বমানের গাইডলাইনের সাহায্যে শিক্ষা পৌঁছে দিচ্ছে দেশের প্রতিটি প্রান্তে।',
                            'From HSC academics to BUET, Medical, and BCS exams—TakeUp bridges the gap with AI-driven learning and top-tier mentorship across Bangladesh.',
                            isBn
                        )}
                    </p>

                    <div className="pt-4">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xl inline-block">
                            <img src="/assets/takeuup_full_brand_logo.png" alt="TakeUp" className="h-12 w-auto object-contain" />
                        </div>
                    </div>

                </div>
            </section>

            {/* LIVE PLATFORM STATS */}
            <div className={`py-12 border-y ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { val: isBn ? '৫০,০০০+' : '50,000+', label: isBn ? 'সক্রিয় শিক্ষার্থী' : 'Active Students' },
                            { val: isBn ? '১,৫০,০০০+' : '150,000+', label: isBn ? 'প্রশ্ন ও সল্যুশন ব্যাংক' : 'Question Bank' },
                            { val: isBn ? '৯৫%' : '95%', label: isBn ? 'সফলতার হার' : 'Success Rate' },
                            { val: isBn ? '৳৮৫,০০০+' : '৳85,000+', label: isBn ? 'স্কলারশিপ প্রাইজমানি' : 'Scholarship Fund' }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="text-2xl sm:text-4xl font-black text-cyan-500">{stat.val}</div>
                                <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* OUR CORE VALUES */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                            {isBn ? 'আমাদের মূলনীতি' : 'OUR CORE VALUES'}
                        </span>
                        <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {isBn ? 'যে আদর্শে গড়া টেকআপ প্ল্যাটফর্ম' : 'The Pillars Behind TakeUp Platform'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((v, i) => (
                            <div key={i} className={`p-6 rounded-3xl border shadow-xl space-y-4 hover:-translate-y-1 transition-all ${isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                }`}>
                                <div className={`p-3 rounded-2xl border w-fit ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                    {v.icon}
                                </div>
                                <h3 className="text-lg font-black">{v.title[language]}</h3>
                                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {v.desc[language]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MENTORS & LEADERSHIP */}
            <section className={`py-20 px-4 border-t ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100/80 border-slate-200'
                }`}>
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                            {isBn ? 'আমাদের টিম ও মেন্টর প্যানেল' : 'OUR TEAM & MENTORS'}
                        </span>
                        <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {isBn ? 'অভিজ্ঞ শিক্ষাবিদ ও প্রকৌশলীদের মেলবন্ধন' : 'Led by Educators, Engineers & Doctors'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {DEFAULT_MEMBERS.map((m, i) => (
                            <div key={i} className={`p-6 rounded-3xl border shadow-xl space-y-4 ${isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                }`}>
                                <img src={m.image} alt="" className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md" />
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black">{m.name[language]}</h3>
                                    <p className="text-xs font-bold text-cyan-500">{m.role[language]}</p>
                                </div>
                                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {m.bio[language]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT & LOCATION SUMMARY */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white shadow-2xl space-y-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-black">
                        {isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch with Us'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium pt-2">
                        <div className="flex items-center justify-center gap-2 bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                            <Phone size={16} className="text-cyan-300" />
                            <span>+৮৮০ ৯৬১২-০০০১০০</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                            <Mail size={16} className="text-cyan-300" />
                            <span>support@takeuup.com</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                            <MapPin size={16} className="text-cyan-300" />
                            <span>আইসিটি টাওয়ার, ঢাকা</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
