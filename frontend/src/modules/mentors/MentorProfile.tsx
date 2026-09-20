import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, MapPin, BookOpen, Clock, Award, Users, Mail, Phone, Calendar, Video, CheckCircle2, UserCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const MentorProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { language } = useLanguage();
    const isBn = language === 'bn';

    const [mentor, setMentor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const FALLBACK_MENTOR = {
        id: id || 'm1',
        name: isBn ? 'প্রকৌশলী তানভীর আহমেদ' : 'Engr. Tanvir Ahmed',
        role: 'BUET CSE (18th Batch) | Physics & Math Expert',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        subjects: ['Physics', 'Mathematics'],
        level: 'HSC & BUET',
        availability: 'Weekends',
        students: '127',
        price: '৳500',
        about: isBn 
            ? 'আমি তানভীর আহমেদ, বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট) থেকে সিএসই সম্পন্ন করেছি। আমি গত ৫ বছর ধরে পদার্থবিজ্ঞান এবং গণিত পড়াচ্ছি। আমার লক্ষ্য শিক্ষার্থীদের বুয়েট ভর্তি পরীক্ষার জন্য প্রস্তুত করা।' 
            : 'I am Tanvir Ahmed, completed CSE from Bangladesh University of Engineering and Technology (BUET). I have been teaching Physics and Mathematics for the last 5 years. My goal is to prepare students for the BUET admission test.',
        education: [
            { degree: 'B.Sc. in Computer Science and Engineering', institution: 'BUET', year: '2018 - 2023' },
            { degree: 'HSC', institution: 'Notre Dame College', year: '2015 - 2017' }
        ],
        reviews: [
            { id: 1, user: 'Rahat', comment: 'Excellent teaching style!', rating: 5 },
            { id: 2, user: 'Sumaiya', comment: 'Very helpful and clear explanations.', rating: 5 }
        ]
    };

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                // Try fetching from global API
                const { fetchMentorsList } = await import('../../services/api');
                const list = await fetchMentorsList();
                if (list && list.length > 0) {
                    const found = list.find((m: any) => m.id === id || m.id === Number(id));
                    if (found) {
                        const getMentorImageUrl = (url: string) => {
                            if (!url) return FALLBACK_MENTOR.image;
                            if (url.startsWith('http://') || url.startsWith('https://')) return url;
                            return `http://localhost:5141/${url.replace(/^\//, '')}`;
                        };
                        setMentor({
                            id: found.id,
                            name: found.name,
                            role: found.title || found.subject || 'Mentor',
                            rating: found.rating || 4.9,
                            image: getMentorImageUrl(found.imageUrl || found.ImageUrl),
                            subjects: [found.subject || (isBn ? 'সাধারণ শিক্ষা' : 'General')],
                            level: 'HSC & Admission',
                            availability: isBn ? 'সপ্তাহান্ত' : 'Both',
                            students: '100+',
                            price: '৳500',
                            about: found.description || found.about || FALLBACK_MENTOR.about,
                            education: FALLBACK_MENTOR.education,
                            reviews: FALLBACK_MENTOR.reviews
                        });
                        setLoading(false);
                        return;
                    }
                }
            } catch (e) {
                console.error(e);
            }
            // Fallback
            setMentor(FALLBACK_MENTOR);
            setLoading(false);
        };
        fetchMentor();
    }, [id, isBn]);

    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex items-center justify-center`}>
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin mb-4"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col items-center justify-center`}>
                <h2 className="text-2xl font-bold mb-4">Mentor Not Found</h2>
                <button onClick={() => navigate('/mentors')} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                    Back to Mentors
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'} pb-24 font-sans`}>
            {/* Header/Cover Section */}
            <div className={`w-full h-48 md:h-64 ${isDark ? 'bg-slate-900' : 'bg-blue-600'} relative`}>
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 relative z-10">
                <div className={`rounded-3xl shadow-xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                    {/* Top Profile Section */}
                    <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-end border-b border-slate-200 dark:border-slate-800">
                        <div className="relative">
                            <img 
                                src={mentor.image} 
                                alt={mentor.name} 
                                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                            />
                            <div className="absolute -bottom-3 -right-3 bg-green-500 text-white p-2 rounded-full border-4 border-white" title="Verified Mentor">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {mentor.name}
                            </h1>
                            <p className={`text-lg font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                {mentor.role}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{mentor.rating}</span>
                                    <span className="text-slate-500">({mentor.reviews.length} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500">
                                    <Users className="w-5 h-5" />
                                    <span>{mentor.students} students</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500">
                                    <Clock className="w-5 h-5" />
                                    <span>{mentor.availability}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-3 shrink-0 pt-4 md:pt-0">
                            <button className={`w-full md:w-auto px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg hover:shadow-xl ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                Book Session
                            </button>
                            <p className="text-center text-sm font-semibold">{mentor.price} <span className="text-slate-500 font-normal">/ hr</span></p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
                        {/* Main Content (Left) */}
                        <div className="lg:col-span-2 p-6 md:p-10 space-y-10">
                            <section>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <UserCheck className="w-6 h-6 text-blue-500" />
                                    About Me
                                </h3>
                                <p className="leading-relaxed">
                                    {mentor.about}
                                </p>
                            </section>

                            <section>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <BookOpen className="w-6 h-6 text-blue-500" />
                                    Subjects & Expertise
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.subjects.map((sub: string, i: number) => (
                                        <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-slate-800 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                                            {sub}
                                        </span>
                                    ))}
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-slate-800 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>
                                        Level: {mentor.level}
                                    </span>
                                </div>
                            </section>

                            <section>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <Award className="w-6 h-6 text-blue-500" />
                                    Education & Qualifications
                                </h3>
                                <div className="space-y-4">
                                    {mentor.education.map((edu: any, i: number) => (
                                        <div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'} flex items-start gap-4`}>
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{edu.degree}</h4>
                                                <p className="text-sm mt-1">{edu.institution}</p>
                                                <p className="text-xs text-slate-400 mt-1">{edu.year}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (Right) */}
                        <div className="p-6 md:p-10 space-y-8 bg-slate-50 dark:bg-slate-900/50">
                            <div className="space-y-4">
                                <h3 className={`font-bold uppercase text-xs tracking-wider text-slate-500`}>Contact Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                        <span>mentor{mentor.id}@takeuup.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Video className="w-5 h-5 text-slate-400" />
                                        <span>Available on Zoom / Google Meet</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <span>{mentor.availability}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className={`font-bold uppercase text-xs tracking-wider text-slate-500`}>Top Reviews</h3>
                                <div className="space-y-4">
                                    {mentor.reviews.map((rev: any, i: number) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{rev.user}</span>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm italic opacity-80">"{rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
