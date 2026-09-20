import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronDown, Search, Check, Filter, X, Sparkles, Award, BookOpen, UserCheck } from 'lucide-react';
import { Mentor } from '../../types/types';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface ExtendedMentor extends Mentor {
    level: string;
    availability: string;
}

export const Mentors: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mentorsList, setMentorsList] = useState<ExtendedMentor[]>([]);
    const [filters, setFilters] = useState({
        subject: 'All',
        availability: 'All',
        rating: 'All',
        level: 'All'
    });

    const DEFAULT_MENTORS: ExtendedMentor[] = [
        {
            id: 'm1',
            name: isBn ? 'প্রকৌশলী তানভীর আহমেদ' : 'Engr. Tanvir Ahmed',
            role: isBn ? 'BUET CSE (18th Batch) | Physics & Math Expert' : 'BUET CSE (18th Batch) | Physics & Math Expert',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            subjects: [isBn ? 'পদার্থবিজ্ঞান' : 'Physics'],
            level: 'HSC & BUET',
            availability: isBn ? 'সপ্তাহান্ত (Weekend)' : 'Weekends'
        },
        {
            id: 'm2',
            name: isBn ? 'ডক্টর সামিয়া রহমান' : 'Dr. Samia Rahman',
            role: isBn ? 'DMC K-74 | Biology & Medical Admission Specialist' : 'DMC K-74 | Biology & Medical Admission Specialist',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            subjects: [isBn ? 'জীববিজ্ঞান' : 'Biology'],
            level: isBn ? 'মেডিকেল ভর্তি' : 'Medical Prep',
            availability: isBn ? 'প্রতিদিন' : 'Both'
        },
        {
            id: 'm3',
            name: isBn ? 'রাকিব হাসান (BCS Cadre)' : 'Rakib Hasan (BCS Cadre)',
            role: isBn ? '38th BCS General Education | Bangladesh & GK Mentor' : '38th BCS General Education | Bangladesh & GK Mentor',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
            subjects: [isBn ? 'সাধারণ জ্ঞান' : 'General Knowledge'],
            level: isBn ? 'বিসিএস ও প্রিলি' : 'BCS & Job',
            availability: isBn ? 'সাপ্তাহিক দিন' : 'Weekdays'
        },
        {
            id: 'm4',
            name: isBn ? 'মাহমুদা ইয়াসমিন' : 'Mahmuda Yasmin',
            role: isBn ? 'DU Chemistry Department | Organic Chemistry Specialist' : 'DU Chemistry Department | Organic Chemistry Specialist',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
            subjects: [isBn ? 'রসায়ন' : 'Chemistry'],
            level: isBn ? 'এইচএসসি' : 'HSC',
            availability: isBn ? 'প্রতিদিন' : 'Both'
        }
    ];

    useEffect(() => {
        const getMentorImageUrl = (url: string) => {
            if (!url) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
            if (url.startsWith('http://') || url.startsWith('https://')) return url;
            return `http://localhost:5141/${url.replace(/^\//, '')}`;
        };

        const loadMentors = async () => {
            try {
                const { fetchMentorsList } = await import('../../services/api');
                const list = await fetchMentorsList();
                if (list && list.length > 0) {
                    const mapped = list.map((m: any) => ({
                        id: m.id,
                        name: m.name,
                        role: m.title || 'Mentor',
                        rating: m.rating || 4.9,
                        image: getMentorImageUrl(m.imageUrl || m.ImageUrl || ''),
                        subjects: [m.subject || (isBn ? 'সাধারণ শিক্ষা' : 'General')],
                        level: 'HSC & Admission',
                        availability: isBn ? 'সপ্তাহান্ত' : 'Both'
                    }));
                    setMentorsList(mapped);
                } else {
                    setMentorsList(DEFAULT_MENTORS);
                }
            } catch(e) {
                setMentorsList(DEFAULT_MENTORS);
            }
        };
        loadMentors();
    }, [language]);

    const activeList = mentorsList.length > 0 ? mentorsList : DEFAULT_MENTORS;

    const filterOptions: Record<string, string[]> = {
        [isBn ? 'বিষয়' : 'Subject']: [
            isBn ? 'সব' : 'All', 
            isBn ? 'পদার্থবিজ্ঞান' : 'Physics', 
            isBn ? 'গণিত' : 'Math', 
            isBn ? 'রসায়ন' : 'Chemistry', 
            isBn ? 'জীববিজ্ঞান' : 'Biology', 
            isBn ? 'সাধারণ জ্ঞান' : 'General Knowledge'
        ],
        [isBn ? 'সময়' : 'Availability']: [
            isBn ? 'সব' : 'All', 
            isBn ? 'সাপ্তাহিক দিন' : 'Weekdays', 
            isBn ? 'সপ্তাহান্ত' : 'Weekends', 
            isBn ? 'প্রতিদিন' : 'Both'
        ],
        [isBn ? 'রেটিং' : 'Rating']: ['All', '4.5+', '4.8+', '5.0'],
        [isBn ? 'কোর্স লেভেল' : 'Level']: ['All', 'HSC', 'Admission', 'BCS']
    };

    const handleFilterSelect = (categoryLabel: string, value: string) => {
        let key = '';
        if (categoryLabel.includes('Subject') || categoryLabel.includes('বিষয়')) key = 'subject';
        else if (categoryLabel.includes('Availability') || categoryLabel.includes('সময়')) key = 'availability';
        else if (categoryLabel.includes('Rating') || categoryLabel.includes('রেটিং')) key = 'rating';
        else key = 'level';
        
        setFilters(prev => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
    };

    const getActiveValue = (categoryLabel: string) => {
        if (categoryLabel.includes('Subject') || categoryLabel.includes('বিষয়')) return filters.subject;
        if (categoryLabel.includes('Availability') || categoryLabel.includes('সময়')) return filters.availability;
        if (categoryLabel.includes('Rating') || categoryLabel.includes('রেটিং')) return filters.rating;
        return filters.level;
    };

    const filteredMentors = activeList.filter(mentor => {
        const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              mentor.subjects.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSubject = filters.subject === 'All' || filters.subject === 'সব' || mentor.subjects.includes(filters.subject);
        const matchesAvailability = filters.availability === 'All' || filters.availability === 'সব' || mentor.availability === filters.availability || mentor.availability === 'Both';
        
        let matchesRating = true;
        if (filters.rating === '4.5+') matchesRating = mentor.rating >= 4.5;
        if (filters.rating === '4.8+') matchesRating = mentor.rating >= 4.8;
        if (filters.rating === '5.0') matchesRating = mentor.rating === 5.0;

        const matchesLevel = filters.level === 'All' || mentor.level.includes(filters.level);

        return matchesSearch && matchesSubject && matchesAvailability && matchesRating && matchesLevel;
    });

    return (
        <div 
            className={isEmbedded ? "max-w-7xl mx-auto py-2 text-slate-900 dark:text-slate-100 transition-colors duration-500" : "max-w-7xl mx-auto px-4 py-16 min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 pt-24"} 
            onClick={() => setActiveDropdown(null)}
        >
            {!isEmbedded && (
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 text-sm font-bold mb-4 shadow-sm">
                        <Award size={16} /> {isBn ? 'শীর্ষ মেন্টর ও শিক্ষক প্যানেল' : 'Top Expert Mentors'}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        {isBn ? 'আপনার স্বপ্নের মেন্টর বেছে নিন 👨‍🏫' : 'Find Your Perfect Mentor 👨‍🏫'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed">
                        {isBn ? 'এইচএসসি, বুয়েট, মেডিকেল ও বিসিএস পরীক্ষার সেরা প্রস্তুতির জন্য বুয়েটিয়ান ও বিসিএস ক্যাডার মেন্টরদের সাথে সরাসরি যুক্ত হোন।' : 'Browse and connect with top BUET, Medical, and BCS mentors to guide your journey.'}
                    </p>
                </div>
            )}

            {/* Search & Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-12 relative z-30" onClick={(e) => e.stopPropagation()}>
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isBn ? 'নাম, বিষয় বা প্রতিষ্ঠান দিয়ে খুঁজুন...' : 'Search by name, subject, or institution...'} 
                        className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all shadow-sm"
                    />
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {Object.keys(filterOptions).map(label => {
                        const isActive = activeDropdown === label;
                        const currentValue = getActiveValue(label);
                        const isFiltered = currentValue !== 'All' && currentValue !== 'সব';

                        return (
                            <div key={label} className="relative">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdown(isActive ? null : label);
                                    }}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border transition-all shadow-sm font-medium ${
                                        isActive || isFiltered
                                        ? 'bg-cyan-600/10 border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span>{label}{isFiltered && `: ${currentValue}`}</span>
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                                </button>

                                {isActive && (
                                    <div 
                                        className="absolute top-full mt-2 left-0 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden p-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                            {filterOptions[label].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleFilterSelect(label, option)}
                                                    className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between rounded-xl transition-colors ${
                                                        currentValue === option 
                                                        ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 font-bold' 
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    {option}
                                                    {currentValue === option && <Check size={16} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
                {filteredMentors.length > 0 ? filteredMentors.map(mentor => (
                    <div key={mentor.id} className="rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md hover:border-cyan-500/50 transition-all group flex flex-col items-center text-center hover:-translate-y-2 shadow-lg dark:shadow-none">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-500 group-hover:scale-105 transition-transform duration-300">
                                <img src={mentor.image} alt={mentor.name} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900" />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-cyan-600 text-white rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-md">
                                {mentor.level}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{mentor.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 h-10 flex items-center justify-center leading-snug font-medium">{mentor.role}</p>
                        
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                             <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                {mentor.subjects[0]}
                             </span>
                             <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400">
                                {mentor.availability}
                             </span>
                        </div>

                        <div className="flex items-center space-x-1.5 text-yellow-500 mb-6 bg-amber-50 dark:bg-amber-400/10 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-400/20">
                            <Star size={14} fill="currentColor" />
                            <span className="font-bold text-sm text-amber-700 dark:text-amber-400">{mentor.rating}</span>
                        </div>

                        <Link 
                            to={`/mentors/${mentor.id}`}
                            className="w-full py-3 block text-center rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-md shadow-cyan-500/20"
                        >
                            {isBn ? 'প্রোফাইল দেখুন' : 'View Profile'}
                        </Link>
                    </div>
                )) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/40">
                        <Search size={48} className="mb-4 opacity-50 text-cyan-500" />
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">{isBn ? 'কোনো মেন্টর পাওয়া যায়নি' : 'No Mentors Found'}</h3>
                        <p className="text-slate-500">{isBn ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।' : 'Try adjusting your filters or search query.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
