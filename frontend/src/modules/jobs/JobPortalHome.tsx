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

export const JobPortalHome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

      {/* Bento Grid Navigation */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
              
              {/* Card 1: Find Jobs (Large) - Purple Contour Style */}
              <Link to="/jobs/search" className="md:col-span-2 md:row-span-2 group relative bg-white dark:bg-[#111111] rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:border-violet-500/30 transition-all duration-500 shadow-xl dark:shadow-2xl">
                  {/* Abstract Purple Wave Pattern */}
                  <div className="absolute inset-0 overflow-hidden opacity-60 group-hover:opacity-80 transition-opacity duration-700">
                      <svg className="absolute -bottom-20 -right-20 w-[120%] h-[120%]" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                          <path d="M350,500 Q450,300 500,150" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.3" />
                          <path d="M300,500 Q400,300 500,200" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" />
                          <path d="M250,500 Q350,300 500,250" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.5" />
                          <path d="M200,500 Q300,350 500,300" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
                          <path d="M150,500 Q250,400 500,350" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.3" />
                          <path d="M100,500 Q200,450 500,400" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.2" />
                      </svg>
                  </div>

                  <div className="relative h-full p-8 flex flex-col justify-between z-10">
                      <div className="flex justify-between items-start">
                          <div className="w-12 h-12 bg-[#8B5CF6] rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(139,92,246,0.6)] group-hover:scale-110 transition-transform duration-500">
                              <Search size={24} />
                          </div>
                          <div className="text-right">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date</p>
                              <p className="text-xs font-bold text-slate-800 dark:text-white">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                      </div>
                      
                      <div>
                          <div className="mb-2 text-[#8B5CF6] font-bold uppercase tracking-widest text-xs">Winner</div>
                          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-100 transition-colors whitespace-pre-line">
                              {t('job_card_dream').replace(' ', '\n')}
                          </h2>
                          <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm font-medium">
                              <span className="mr-2">Dhaka, Bangladesh</span>
                              <div className="h-1 w-1 bg-slate-400 dark:bg-slate-600 rounded-full mr-2"></div>
                              <span>Remote Available</span>
                          </div>
                      </div>
                  </div>
              </Link>

              {/* Card 2: Employers - Blue Dot Matrix Style */}
              <Link to="/jobs/create" className="group relative bg-white dark:bg-[#111111] rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-lg dark:shadow-none">
                  {/* Dot Matrix Pattern */}
                  <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 200 400" preserveAspectRatio="none">
                          <defs>
                              <pattern id="blue-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                  <circle cx="2" cy="2" r="1.5" className="fill-blue-500" />
                              </pattern>
                              <linearGradient id="fade-left" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="black" stopOpacity="1" />
                                  <stop offset="100%" stopColor="black" stopOpacity="0" />
                              </linearGradient>
                              <mask id="fade-mask">
                                  <rect x="0" y="0" width="100%" height="100%" fill="url(#fade-left)" mask="url(#fade-mask)" />
                              </mask>
                          </defs>
                          <rect x="0" y="0" width="100%" height="100%" fill="url(#blue-dots)" mask="url(#fade-mask)" />
                      </svg>
                      {/* Fluid shape overlaying dots */}
                      <div className="absolute top-1/2 right-0 w-32 h-64 bg-blue-500/20 blur-[60px] rounded-full transform -translate-y-1/2 translate-x-1/2" />
                  </div>

                  <div className="relative h-full p-6 flex flex-col justify-between z-10">
                      <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-300">
                          <Building2 size={20} />
                      </div>
                      
                      <div>
                          <div className="mb-1 text-blue-500 dark:text-blue-400 font-bold uppercase tracking-widest text-[10px]">Gold Partner</div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t('job_card_post')}</h3>
                          <p className="text-slate-500 text-[10px] uppercase tracking-wide">United States</p>
                      </div>
                  </div>
              </Link>

              {/* Card 3: CV Builder - Yellow Geometric Stripes Style */}
              <Link to="/jobs/create-cv" className="group relative bg-white dark:bg-[#111111] rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:border-yellow-500/30 transition-all duration-300 shadow-lg dark:shadow-none">
                  {/* Yellow Stripes Pattern */}
                  <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none">
                      <svg width="100%" height="100%" viewBox="0 0 200 200">
                          {[0, 20, 40, 60, 80, 100, 120].map((offset, i) => (
                              <line 
                                key={i}
                                x1={100 + offset} y1="200" 
                                x2="200" y2={100 + offset} 
                                stroke="#EAB308" 
                                strokeWidth="8" 
                                strokeLinecap="round"
                                className="group-hover:translate-x-[-5px] group-hover:translate-y-[-5px] transition-transform duration-500"
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                          ))}
                      </svg>
                  </div>

                  <div className="relative h-full p-6 flex flex-col justify-between z-10">
                      <div className="w-10 h-10 bg-yellow-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_25px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform duration-300">
                          <FileText size={20} />
                      </div>
                      
                      <div>
                          <div className="mb-1 text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-widest text-[10px]">Asia Pacific</div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t('job_card_cv')}</h3>
                          <p className="text-slate-500 text-[10px] uppercase tracking-wide">United Nations</p>
                      </div>
                  </div>
              </Link>

          </div>
      </section>

      {/* Explore Categories */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
          <div className="flex justify-between items-end mb-10">
              <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('job_pop_cat')}</h2>
                  <p className="text-slate-600 dark:text-slate-500">Explore opportunities by industry.</p>
              </div>
              <Link to="/jobs/search" className="text-slate-900 dark:text-white font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-2 text-sm border-b border-slate-300 dark:border-white/20 pb-1">
                  {t('job_view_all')}
              </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat, i) => (
                  <Link 
                    to="/jobs/search" 
                    key={i}
                    className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group shadow-sm hover:shadow-lg hover:-translate-y-1 border ${cat.bg} ${cat.border} dark:bg-opacity-10 dark:border-opacity-10`}
                  >
                      <div className={`mb-4 ${cat.text} group-hover:scale-110 duration-300 transform`}>
                          {cat.icon}
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{cat.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{cat.jobs} Jobs</p>
                  </Link>
              ))}
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