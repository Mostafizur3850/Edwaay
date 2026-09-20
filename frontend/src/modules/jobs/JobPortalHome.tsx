import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Building2, Code, Megaphone, Palette, LineChart, CheckCircle2, GraduationCap, Rocket, ArrowRight, Briefcase, UserCheck, FileText, Sparkles, BookOpen, Globe, Lightbulb, Monitor, PenTool, Zap, TrendingUp, MapPin, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const COMPANIES = [
  { name: 'bKash', logo: 'https://logo.clearbit.com/bkash.com' },
  { name: 'Daraz', logo: 'https://logo.clearbit.com/daraz.com.bd' },
  { name: 'Grameenphone', logo: 'https://logo.clearbit.com/grameenphone.com' },
  { name: 'Robi', logo: 'https://logo.clearbit.com/robi.com.bd' },
  { name: 'Pathao', logo: 'https://logo.clearbit.com/pathao.com' },
  { name: 'Foodpanda', logo: 'https://logo.clearbit.com/foodpanda.com' },
  { name: 'Banglalink', logo: 'https://logo.clearbit.com/banglalink.net' },
];

const JobHeroBackground = () => {
    const colors = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
            <div 
                className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    color: 'inherit'
                }}
            />
            
            {[...Array(40)].map((_, i) => {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 4 + 2; 
                
                return (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: color,
                            boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`, 
                            opacity: Math.random() * 0.6 + 0.2,
                            animation: `twinkle ${Math.random() * 4 + 2}s infinite ease-in-out ${Math.random() * 2}s`
                        }}
                    />
                );
            })}

            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-violet-300/20 dark:bg-violet-600/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-300/20 dark:bg-cyan-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen" />
        </div>
    );
};

const SIDEBAR_CATEGORIES = [
    {
        title: { en: 'Latest Updates', bn: 'সর্বশেষ আপডেট' },
        items: [
            { id: 'new_circular', label: { en: 'New Circular', bn: 'নতুন সার্কুলার' } }
        ]
    },
    {
        title: { en: 'Job Category', bn: 'জব ক্যাটাগরি' },
        items: [
            { id: 'govt', label: { en: 'Govt Jobs', bn: 'সরকারি চাকরি' } },
            { id: 'bank', label: { en: 'Bank Jobs', bn: 'ব্যাংক জবস' } },
            { id: 'ngo', label: { en: 'NGO Jobs', bn: 'এনজিও জবস' } },
            { id: 'teacher', label: { en: 'Teacher Recruitment', bn: 'শিক্ষক নিয়োগ' } },
            { id: 'sales', label: { en: 'Sales/Marketing', bn: 'সেলস/মার্কেটিং' } },
            { id: 'railway', label: { en: 'Railway Jobs', bn: 'রেলওয়ে জবস' } },
            { id: 'defense', label: { en: 'Defense Jobs', bn: 'ডিফেন্স জবস' } },
            { id: 'health', label: { en: 'Health/Medical', bn: 'হেলথ/মেডিক্যাল' } },
            { id: 'newspaper', label: { en: 'Job Newspaper', bn: 'চাকরির পত্রিকা' } },
            { id: 'private', label: { en: 'Private Jobs', bn: 'বেসরকারি চাকরি' } },
        ]
    },
    {
        title: { en: 'Special Job Category', bn: 'স্পেশাল জব ক্যাটাগরি' },
        items: []
    }
];

export const JobPortalHome = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const DUMMY_JOBS = [
      { id: 1, title: language === 'bn' ? 'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার' : 'Senior Software Engineer', company: 'bKash', location: language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh', type: 'Full-time', salary: '৳ 80k - 120k', categoryId: 'govt' },
      { id: 2, title: language === 'bn' ? 'প্রোডাক্ট ম্যানেজার' : 'Product Manager', company: 'Daraz', location: language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh', type: 'Full-time', salary: '৳ 60k - 90k', categoryId: 'bank' },
      { id: 3, title: language === 'bn' ? 'ডিজিটাল মার্কেটিং স্পেশালিস্ট' : 'Digital Marketing Specialist', company: 'Pathao', location: 'Remote', type: 'Contract', salary: '৳ 40k - 70k', categoryId: 'sales' },
      { id: 4, title: language === 'bn' ? 'ইউএক্স ডিজাইনার' : 'UX Designer', company: 'Foodpanda', location: language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh', type: 'Full-time', salary: '৳ 50k - 80k', categoryId: 'private' },
      { id: 5, title: language === 'bn' ? 'অ্যাসিস্ট্যান্ট টিচার' : 'Assistant Teacher', company: 'Govt. School', location: language === 'bn' ? 'চট্টগ্রাম, বাংলাদেশ' : 'Chittagong, Bangladesh', type: 'Full-time', salary: '৳ 20k - 35k', categoryId: 'teacher' },
      { id: 6, title: language === 'bn' ? 'মেডিকেল অফিসার' : 'Medical Officer', company: 'Square Hospital', location: language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh', type: 'Full-time', salary: '৳ 50k - 80k', categoryId: 'health' },
  ];

  const filteredJobs = selectedCategory 
      ? DUMMY_JOBS.filter(job => job.categoryId === selectedCategory)
      : DUMMY_JOBS;

  const CATEGORIES = [
    { name: t('job_cat_engineering'), icon: <Code size={24} />, jobs: '120+', bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/30' },
    { name: t('job_cat_marketing'), icon: <Megaphone size={24} />, jobs: '85+', bg: 'bg-pink-50 dark:bg-pink-900/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-900/30' },
    { name: t('job_cat_design'), icon: <Palette size={24} />, jobs: '40+', bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/30' },
    { name: t('job_cat_finance'), icon: <LineChart size={24} />, jobs: '32+', bg: 'bg-emerald-50 dark:bg-emerald-900/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/30' },
    { name: t('job_cat_education'), icon: <GraduationCap size={24} />, jobs: '55+', bg: 'bg-yellow-50 dark:bg-yellow-900/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-100 dark:border-yellow-900/30' },
    { name: t('job_cat_management'), icon: <Briefcase size={24} />, jobs: '20+', bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-900/30' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/jobs/search');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-violet-500 selection:text-white transition-colors duration-500">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <JobHeroBackground />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in zoom-in duration-500 shadow-xl dark:shadow-2xl">
                <Sparkles size={12} className="text-yellow-500 dark:text-yellow-400 animate-pulse" /> {t('job_hero_badge')}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1] drop-shadow-sm dark:drop-shadow-2xl">
                {t('job_hero_title')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 dark:from-violet-200 dark:via-white dark:to-cyan-200 animate-gradient-x">
                    {t('job_hero_highlight')}
                </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                {t('job_hero_desc')}
            </p>

            {/* Floating Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group z-20">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-blue-600/30 to-cyan-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full p-2 pl-6 shadow-xl dark:shadow-2xl transition-all group-hover:border-violet-500/50 dark:group-hover:border-white/20 ring-1 ring-slate-200 dark:ring-white/5">
                    <Search className="text-slate-400 mr-3" size={24} />
                    <input 
                        type="text" 
                        placeholder={t('job_search_ph')}
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-500 text-lg outline-none font-medium"
                    />
                    <button 
                        type="submit"
                        className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        {t('job_search_btn')}
                    </button>
                </div>
            </form>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="w-full overflow-hidden bg-white dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/[0.05] py-8 mb-20 relative backdrop-blur-sm">
          <div className="flex w-[200%] animate-marquee items-center">
              {[...COMPANIES, ...COMPANIES, ...COMPANIES].map((company, i) => (
                  <div key={i} className="flex items-center justify-center min-w-[200px] px-8 group/logo">
                      <div className="h-12 w-32 relative flex items-center justify-center grayscale opacity-40 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-300 transform group-hover/logo:scale-110">
                          <img 
                            src={company.logo} 
                            alt={company.name} 
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerText = company.name;
                            }} 
                          />
                      </div>
                  </div>
              ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-[#050505] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-[#050505] to-transparent z-10" />
      </div>
      {/* Small Category Grid */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'জনপ্রিয় ক্যাটাগরি' : 'Popular Categories'}
              </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((category, idx) => (
                  <div key={idx} className={`group ${category.bg} border ${category.border} hover:border-violet-500/30 rounded-xl p-4 transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col items-center text-center`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/50 dark:bg-black/20 ${category.text} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                          {React.cloneElement(category.icon as React.ReactElement, { size: 20 })}
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{category.name}</h3>
                      <span className={`text-xs font-medium ${category.text}`}>{category.jobs} {language === 'bn' ? 'চাকরি' : 'Jobs'}</span>
                  </div>
              ))}
          </div>
      </section>

      {/* AI CV Builder Banner */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="relative z-10 text-white max-w-xl text-center md:text-left mb-6 md:mb-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-4">
                      <Sparkles size={16} className="text-yellow-300" />
                      {language === 'bn' ? 'এআই ফিচার' : 'AI Feature'}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      {language === 'bn' ? 'প্রফেশনাল সিভী তৈরি করুন এআই দিয়ে' : 'Build Your Professional CV with AI'}
                  </h2>
                  <p className="text-violet-100 text-lg">
                      {language === 'bn' 
                          ? 'মাত্র ৫ মিনিটে একটি আকর্ষণীয় ও প্রফেশনাল সিভী তৈরি করুন আমাদের স্মার্ট এআই সিভী বিল্ডার ব্যবহার করে।' 
                          : 'Create an attractive and professional CV in just 5 minutes using our smart AI CV builder.'}
                  </p>
              </div>

              <div className="relative z-10 flex-shrink-0">
                  <Link 
                      to="/jobs/create-cv"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-700 font-bold rounded-full hover:bg-slate-50 transition-all hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                      {language === 'bn' ? 'সিভী তৈরি করুন' : 'Create CV Now'}
                      <ArrowRight size={20} />
                  </Link>
              </div>
          </div>
      </section>

      {/* Main Content Layout with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
          <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="w-full lg:w-72 flex-shrink-0">
                  <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm sticky top-24">
                      {SIDEBAR_CATEGORIES.map((section, idx) => (
                          <div key={idx} className="mb-6 last:mb-0">
                              <h3 className="text-slate-900 dark:text-white font-bold mb-3 px-2 border-l-2 border-violet-500">
                                  {language === 'bn' ? section.title.bn : section.title.en}
                              </h3>
                              <ul className="space-y-1">
                                  {section.items.map((item) => {
                                      const isSelected = selectedCategory === item.id;
                                      return (
                                      <li key={item.id}>
                                          <button 
                                              onClick={() => setSelectedCategory(isSelected ? null : item.id)}
                                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group
                                                  ${isSelected 
                                                      ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 font-medium' 
                                                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-violet-600 dark:hover:text-violet-400'
                                                  }`}
                                          >
                                              <span>{language === 'bn' ? item.label.bn : item.label.en}</span>
                                              <ArrowRight size={14} className={`transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                          </button>
                                      </li>
                                      )
                                  })}
                                  {section.items.length === 0 && (
                                      <p className="text-xs text-slate-400 dark:text-slate-600 px-3 italic">
                                          {language === 'bn' ? 'শীঘ্রই আসছে...' : 'Coming soon...'}
                                      </p>
                                  )}
                              </ul>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Main Job Listing Area */}
              <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedCategory 
                              ? (language === 'bn' ? 'বাছাইকৃত চাকরি' : 'Filtered Jobs') 
                              : (language === 'bn' ? 'সব সার্কুলার' : 'All Circulars')}
                      </h2>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">{filteredJobs.length} {language === 'bn' ? 'টি চাকরি পাওয়া গেছে' : 'jobs found'}</span>
                  </div>

                  {filteredJobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredJobs.map(job => (
                              <Link 
                                  key={job.id} 
                                  to={`/jobs/search`} 
                                  className="group bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 hover:border-violet-500/30 dark:hover:border-violet-500/30 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
                              >
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">{job.title}</h3>
                                          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{job.company}</p>
                                      </div>
                                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400 group-hover:text-violet-500 transition-colors">
                                          <Building2 size={20} />
                                      </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 mb-4">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium">
                                          <MapPin size={12} /> {job.location}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium">
                                          <Briefcase size={12} /> {job.type}
                                      </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                      <span className="font-bold text-slate-900 dark:text-white">{job.salary}</span>
                                      <span className="text-violet-600 dark:text-violet-400 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                          {language === 'bn' ? 'বিস্তারিত' : 'Apply'} <ArrowRight size={14} />
                                      </span>
                                  </div>
                              </Link>
                          ))}
                      </div>
                  ) : (
                      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400 mb-6">
                              <Search size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                              {language === 'bn' ? 'কোন চাকরি পাওয়া যায়নি' : 'No jobs found'}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 max-w-md">
                              {language === 'bn' 
                                  ? 'এই ক্যাটাগরিতে বর্তমানে কোন সার্কুলার নেই। অন্য ক্যাটাগরি চেষ্টা করুন।' 
                                  : 'There are no circulars in this category right now. Please try another category.'}
                          </p>
                      </div>
                  )}
              </div>
          </div>
      </section>

      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-marquee {
            animation: marquee 30s linear infinite;
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};