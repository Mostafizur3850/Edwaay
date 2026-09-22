import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, User, Menu, X, LogOut, Sparkles, UserCircle, Briefcase, ChevronDown, FileText, Users, ShoppingBag, Rocket, Moon, Sun, Info, Facebook, Twitter, Instagram, Linkedin, Heart, ArrowRight, ShieldCheck, BookOpen, Bot, Target, Phone, Mail, MapPin, Youtube } from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children?: React.ReactNode;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: { isAuthenticated: boolean; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // User State
  const [userData, setUserData] = useState<any>(null);
  // Branding State
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  const [cartCount, setCartCount] = useState(0);
  const [dynamicMenus, setDynamicMenus] = useState<any[]>([]);

  useEffect(() => {
    const defaultPublicMenus = [
      { title: t('nav_home'), url: '/' },
      { title: t('menu_about') || 'আমাদের সম্পর্কে', url: '/about' },
      { title: t('nav_pricing') || 'প্যাকেজ ও ফি', url: '/pricing' },
      { title: t('nav_products') || 'বই ও স্টোর', url: '/products' },
      { title: t('nav_jobs') || 'জবস ও ক্যারিয়ার', url: '/jobs' }
    ];
    setDynamicMenus(defaultPublicMenus);
  }, [language]);

  const getSessionId = () => {
    let sid = localStorage.getItem('takeuup_session_id');
    if (!sid) {
      sid = 'sess-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('takeuup_session_id', sid);
    }
    return sid;
  };

  const loadCartCount = async () => {
    const sid = getSessionId();
    try {
      const { getCart } = await import('../../services/api');
      const data = await getCart(sid);
      const items = data?.items || data?.Items || [];
      const list = Array.isArray(items) ? items : (items.$values || []);
      const count = list.reduce((acc: number, item: any) => acc + (item.quantity || item.Quantity || 0), 0);
      setCartCount(count);
    } catch (e) {
      console.error("Failed to load cart count in Layout", e);
    }
  };

  useEffect(() => {
    loadCartCount();
    window.addEventListener('cartUpdated', loadCartCount);
    return () => window.removeEventListener('cartUpdated', loadCartCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const savedLogo = localStorage.getItem('takeuup_logo');
    if (savedLogo) setCustomLogo(savedLogo);

    const handleStorageChange = () => {
      const updatedLogo = localStorage.getItem('takeuup_logo');
      setCustomLogo(updatedLogo);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logoUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logoUpdated', handleStorageChange);
    };
  }, []);

  // Load user data whenever auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem('takeuup_user');
      if (stored) {
        setUserData(JSON.parse(stored));
      } else {
        setUserData({ name: 'Student', photoURL: 'https://picsum.photos/id/64/200' });
      }
    }
  }, [isAuthenticated]);

  const handleUpdateUser = (updatedData: any) => {
    setUserData(updatedData);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navLinkClass = (path: string) => `relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 group ${location.pathname === path
      ? 'bg-teal-100 text-teal-700 dark:bg-teal-400/10 dark:text-teal-400 shadow-sm border border-teal-200 dark:border-teal-800/50'
      : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-400/5'
    }`;

  // Determine Logo Link based on role
  const logoLink = isAuthenticated && userData?.role === 'employer' ? '/employer-dashboard'
    : isAuthenticated && userData?.role === 'admin' ? '/admin'
      : '/';

  const getFullImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) return path;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `http://localhost:5141${cleanPath}`;
  };

  const isJobActive = location.pathname.startsWith('/jobs')
    ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)] border border-violet-500/20'
    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5';

  const MEGA_MENU_ITEMS = [
    {
      name: t('menu_mentors') || 'মেন্টরস',
      path: '/mentors',
      icon: <Users size={18} />,
      desc: t('menu_mentors_desc') || 'এক্সপার্টদের সাথে কানেক্ট করুন',
      color: 'text-teal-500 dark:text-teal-400',
      bg: 'bg-teal-100 dark:bg-teal-400/10'
    },
    {
      name: t('menu_blog') || 'ব্লগ ও আর্টিকেল',
      path: '/blog',
      icon: <FileText size={18} />,
      desc: t('menu_blog_desc') || 'নতুন টেকনোলজি সম্পর্কে জানুন',
      color: 'text-teal-500 dark:text-teal-400',
      bg: 'bg-teal-100 dark:bg-teal-400/10'
    },
    {
      name: t('menu_careers') || 'ক্যারিয়ার গাইডলাইন',
      path: '/career',
      icon: <Rocket size={18} />,
      desc: t('menu_careers_desc') || 'ক্যারিয়ার প্ল্যানিং ও গাইডলাইন',
      color: 'text-teal-500 dark:text-teal-400',
      bg: 'bg-teal-100 dark:bg-teal-400/10'
    },
    {
      name: t('menu_resources') || 'স্টাডি রিসোর্স',
      path: '/resources',
      icon: <BookOpen size={18} />,
      desc: t('menu_resources_desc') || 'বই, চিটশিট ও অন্যান্য',
      color: 'text-teal-500 dark:text-teal-400',
      bg: 'bg-teal-100 dark:bg-teal-400/10'
    }
  ];

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${scrolled
          ? 'bg-white/80 dark:bg-[#030712]/80 backdrop-blur-xl border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/50'
          : 'bg-white/60 dark:bg-[#030712]/60 backdrop-blur-md border-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to={logoLink} className="flex items-center gap-2 group">
                <div className="bg-white/95 p-1.5 rounded-2xl border border-slate-200 shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                  <img src="/assets/takeuup_full_brand_logo.png" alt="TakeUp" className="h-9 sm:h-10 w-auto object-contain" />
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1.5 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-sm">
              {isAuthenticated && userData?.role === 'employer' ? (
                <>
                  <Link to="/employer-dashboard" className={navLinkClass('/employer-dashboard')}>Dashboard</Link>
                  <Link to="/jobs" className={navLinkClass('/jobs')}>Job Portal</Link>
                </>
              ) : (
                // Student / Unified View / Admin View
                <>
                  {isAuthenticated && userData?.role === 'admin' && (
                    <Link to="/admin" className={navLinkClass('/admin')}>Dashboard</Link>
                  )}
                  {dynamicMenus.map((menu: any) => {
                    const url = menu.url || menu.Url;
                    const title = menu.title || menu.Title;
                    const isMegaQuiz = title.toLowerCase().includes('mega quiz');
                    const isJobs = url.includes('/jobs');

                    if (isMegaQuiz) {
                      return (
                        <Link key={url} to={url} className={`${navLinkClass(url)} relative overflow-hidden group`}>
                          {title}
                          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                        </Link>
                      );
                    }

                    if (isJobs) {
                      return (
                        <Link key={url} to={url} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isJobActive}`}>
                          {title}
                        </Link>
                      );
                    }

                    return (
                      <Link key={url} to={url} className={navLinkClass(url)}>
                        {title}
                      </Link>
                    );
                  })}

                  {/* Mega Menu Dropdown */}
                  <div className="relative group">
                    <button className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-400/5 transition-all flex items-center gap-1">
                      {t('nav_more')} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                    </button>

                    {/* Dropdown Content */}
                    <div className="absolute top-full right-0 mt-4 w-72 bg-white dark:bg-[#0F131D]/95 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 overflow-hidden z-50">
                      <div className="p-2 grid gap-1">
                        {MEGA_MENU_ITEMS.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group/item"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg} ${item.color} group-hover/item:scale-110 transition-transform shadow-inner`}>
                              {item.icon}
                            </div>
                            <div>
                              <div className="text-slate-900 dark:text-white font-bold text-sm group-hover/item:text-teal-600 dark:group-hover/item:text-teal-400 transition-colors">{item.name}</div>
                              <div className="text-slate-500 text-xs font-medium">{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Side: Language & User */}
            <div className="hidden lg:flex items-center space-x-3">

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-colors text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                <span className={language === 'en' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}>EN</span>
                <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-600"></div>
                <span className={language === 'bn' ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}>BN</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:border-slate-355 dark:hover:border-slate-500 transition-all text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-600" />}
              </button>

              {/* Desktop Shopping Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-500 transition-all text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0"
                title="View Shopping Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-[#030712]">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center space-x-3 pl-2">
                {isAuthenticated && userData ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/30 hover:bg-white dark:hover:bg-white/10 transition-all group backdrop-blur-sm"
                    >
                      <div className="w-9 h-9 rounded-full border-2 border-cyan-500/50 overflow-hidden relative shadow-lg">
                        {userData.photoURL ? (
                          <img src={getFullImageUrl(userData.photoURL)} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle className="w-full h-full text-slate-400" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {(() => {
                          if (userData.name && !userData.name.startsWith('8801') && !userData.name.startsWith('01') && userData.name !== 'Student Member') {
                            return userData.name;
                          }
                          if (userData.role === 'admin') return 'System Admin';
                          if (userData.role === 'teacher') return 'Teacher Member';
                          if (userData.role === 'employer') return 'Company Recruiter';
                          return 'Student Member';
                        })()}
                      </span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 transition-all"
                      title={t('nav_logout')}
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">{t('nav_login')}</Link>
                    <Link to="/register" className="group relative px-6 py-2.5 rounded-full text-sm font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 transition-all duration-300 group-hover:scale-110"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative flex items-center gap-2">{t('nav_join')} <Sparkles size={14} /></span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex lg:hidden items-center gap-3">

              {/* Mobile Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300"
              >
                <span className={language === 'en' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}>EN</span>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className={language === 'bn' ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}>BN</span>
              </button>

              {/* Mobile Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-slate-600" />}
              </button>

              {/* Mobile Shopping Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0"
                title="View Shopping Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-[#030712]">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-[#030712]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 animate-in slide-in-from-top-2 z-40 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="px-4 pt-6 pb-8 space-y-2">

              {isAuthenticated && userData?.role === 'employer' ? (
                <>
                  <Link to="/employer-dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl border border-cyan-100 dark:border-cyan-500/20">Dashboard</Link>
                  <Link to="/jobs" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-colors">Job Portal</Link>
                </>
              ) : (
                <>
                  {isAuthenticated && userData?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 mb-2">Dashboard</Link>
                  )}
                  {dynamicMenus.map((menu: any) => {
                    const url = menu.url || menu.Url;
                    const title = menu.title || menu.Title;
                    const isMegaQuiz = title.toLowerCase().includes('mega quiz');
                    const isJobs = url.includes('/jobs');
                    const isStore = url.includes('/products') || url.includes('/store');

                    if (isMegaQuiz) {
                      return (
                        <Link key={url} to={url} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 transition-colors flex items-center justify-between">
                          <span>🏆 {title} (Friday 8 PM)</span>
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                        </Link>
                      );
                    }

                    if (isJobs) {
                      return (
                        <Link key={url} to={url} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-2xl transition-colors flex items-center gap-2">
                          <Briefcase size={18} /> {title}
                        </Link>
                      );
                    }

                    if (isStore) {
                      return (
                        <Link key={url} to={url} onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-colors flex items-center gap-2">
                          <ShoppingBag size={18} /> {title}
                        </Link>
                      );
                    }

                    const isHomeOrDashboard = url === '/' || url === '/dashboard';
                    const textColor = isHomeOrDashboard ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300';

                    return (
                      <Link key={url} to={url} onClick={() => setIsOpen(false)} className={`block px-4 py-3 text-base font-bold ${textColor} hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-colors`}>
                        {title}
                      </Link>
                    );
                  })}
                </>
              )}

              {/* Mobile "More" Section - Hide for Employers */}
              {userData?.role !== 'employer' && (
                <div className="pt-2 border-t border-slate-200 dark:border-white/5 mt-2">
                  <button
                    onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-colors"
                  >
                    <span>{t('nav_more')}</span>
                    <ChevronDown size={16} className={`transition-transform ${mobileMoreOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileMoreOpen && (
                    <div className="space-y-1 pl-2 mt-1">
                      {MEGA_MENU_ITEMS.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-colors"
                        >
                          <div className={`${item.color}`}>{item.icon}</div>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Auth */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/10 mt-4">
                {!isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 transition-colors">{t('nav_login')}</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl shadow-lg shadow-cyan-900/20">{t('nav_join')}</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button onClick={() => { navigate('/dashboard'); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl flex items-center gap-3">
                      <User size={20} /> {t('nav_profile')}
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-base font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl flex items-center gap-3">
                      <LogOut size={20} /> {t('nav_logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Profile Modal - Only kept for direct triggering via Settings if needed later, but removed from Nav User Click */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userData={userData}
        onUpdateUser={handleUpdateUser}
      />
    </>
  );
};

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <footer className={`border-t pt-16 pb-12 transition-colors duration-300 ${isDark ? 'bg-[#04070f] border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: Brand Info & Socials */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-md flex items-center justify-center">
                <img src="/assets/takeuup_full_brand_logo.png" alt="TakeUp" className="h-10 w-auto object-contain" />
              </div>
            </div>

            <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isBn
                ? 'বাংলাদেশের ১ম AI-পাওয়ার্ড সমন্বিত স্মার্ট শিক্ষা পোর্টাল। এইচএসসি, বুয়েট, মেডিকেল ও বিসিএস পরীক্ষার নিশ্চিত জয়ের নির্ভুল প্রস্তুতি হাব।'
                : "Bangladesh's #1 AI-powered integrated smart education portal for HSC, BUET, Medical & BCS exam prep."}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={`p-2.5 rounded-xl transition-colors shadow-sm ${isDark ? 'bg-slate-800/80 hover:bg-cyan-600 hover:text-white text-slate-300' : 'bg-white border border-slate-200 hover:bg-cyan-600 hover:text-white text-slate-600 hover:border-cyan-600'}`} title="Facebook Page">
                <Facebook size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={`p-2.5 rounded-xl transition-colors shadow-sm ${isDark ? 'bg-slate-800/80 hover:bg-rose-600 hover:text-white text-slate-300' : 'bg-white border border-slate-200 hover:bg-rose-600 hover:text-white text-slate-600 hover:border-rose-600'}`} title="YouTube Channel">
                <Youtube size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`p-2.5 rounded-xl transition-colors shadow-sm ${isDark ? 'bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300' : 'bg-white border border-slate-200 hover:bg-blue-600 hover:text-white text-slate-600 hover:border-blue-600'}`} title="LinkedIn Community">
                <Linkedin size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={`p-2.5 rounded-xl transition-colors shadow-sm ${isDark ? 'bg-slate-800/80 hover:bg-pink-600 hover:text-white text-slate-300' : 'bg-white border border-slate-200 hover:bg-pink-600 hover:text-white text-slate-600 hover:border-pink-600'}`} title="Instagram">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Preparation Tracks */}
          <div className="space-y-4">
            <h4 className={`font-black text-sm uppercase tracking-wider border-l-4 border-cyan-500 pl-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {isBn ? 'প্রস্তুতি ট্র্যাকসমূহ' : 'PREPARATION TRACKS'}
            </h4>
            <ul className={`space-y-2.5 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors">{isBn ? '🎓 এইচএসসি বোর্ড পরীক্ষা (HSC 2026/27)' : '🎓 HSC Board Exam (2026/27)'}</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors">{isBn ? '⚡ বুয়েট ও ইঞ্জিনিয়ারিং প্রস্তুতি (BUET/CKET)' : '⚡ BUET & Engineering Prep'}</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors">{isBn ? '🩺 মেডিকেল ও ডেন্টাল অ্যাডমিশন (DMC)' : '🩺 Medical & Dental Prep'}</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors">{isBn ? '🏛️ ঢাবি ক-ইউনিট ও গুচ্ছ সায়েন্স' : '🏛️ DU KA Unit & Cluster Science'}</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors">{isBn ? '💼 বিসিএস ও ক্যাডার প্রস্তুতি (BCS Prelim)' : '💼 BCS Prelim & Cadre Prep'}</Link></li>
            </ul>
          </div>

          {/* Column 3: Smart Tools & Services */}
          <div className="space-y-4">
            <h4 className={`font-black text-sm uppercase tracking-wider border-l-4 border-indigo-500 pl-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {isBn ? 'স্মার্ট টুলস ও ফিচার' : 'SMART TOOLS & FEATURES'}
            </h4>
            <ul className={`space-y-2.5 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors flex items-center gap-1.5"><Bot size={13} className="text-cyan-500" /> {isBn ? '২৪/৭ AI ডাউট সলভার' : '24/7 AI Doubt Solver'}</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors flex items-center gap-1.5"><BookOpen size={13} className="text-indigo-500" /> {isBn ? 'অধ্যায়ভিত্তিক স্মার্ট প্রশ্নব্যাংক' : 'Smart Solved Question Bank'}</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors flex items-center gap-1.5"><Trophy size={13} className="text-amber-500" /> {isBn ? 'সাপ্তাহিক লাইভ মেগা কুইজ' : 'Weekly Live Mega Quiz'}</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors flex items-center gap-1.5"><Users size={13} className="text-emerald-500" /> {isBn ? 'ক্যাটাগরি স্টাডি গ্রুপ ও মেসেঞ্জার' : 'Category Study Groups & Chat'}</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-500 transition-colors flex items-center gap-1.5"><Target size={13} className="text-rose-500" /> {isBn ? 'বিশ্ববিদ্যালয় অ্যাডমিশন প্রেডিক্টর' : 'Varsity Eligibility Predictor'}</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Hotline Support */}
          <div className="space-y-4">
            <h4 className={`font-black text-sm uppercase tracking-wider border-l-4 border-emerald-500 pl-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {isBn ? 'যোগাযোগ ও সহায়তা' : 'CONTACT & SUPPORT'}
            </h4>

            <div className={`space-y-3 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-cyan-500 shrink-0" />
                <span>{isBn ? 'হেল্পলাইন: +৮৮০ ৯৬১২-০০০১০০ (সকাল ৯টা - রাত ১০টা)' : 'Helpline: +880 9612-000100 (9 AM - 10 PM)'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-cyan-500 shrink-0" />
                <span>{isBn ? 'ইমেইল: support@takeuup.com' : 'Email: support@takeuup.com'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-cyan-500 shrink-0 mt-0.5" />
                <span>{isBn ? 'কার্যালয়: লেভেল ৫, আইসিটি টাওয়ার, আগারগাঁও, ঢাকা-১২০৭' : 'Address: Level 5, ICT Tower, Agargaon, Dhaka-1207'}</span>
              </div>
            </div>

            {/* Security & App Badge */}
            <div className={`pt-2 flex items-center gap-2 text-[10px] font-bold p-2.5 rounded-xl border ${isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
              <ShieldCheck size={16} />
              <span>{isBn ? 'SSL 256-Bit সিকিউরড প্ল্যাটফর্ম' : 'SSL 256-Bit Secured Platform'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
          <p>{isBn ? '© ২০২৬ টেকআপ (TAKEUUP) শিক্ষা পোর্টাল। সর্বস্বত্ব সংরক্ষিত।' : '© 2026 TakeUp Educational Portal. All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-cyan-500 transition-colors">{isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}</a>
            <span>•</span>
            <a href="#terms" className="hover:text-cyan-500 transition-colors">{isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}</a>
            <span>•</span>
            <a href="#refund" className="hover:text-cyan-500 transition-colors">{isBn ? 'রিফান্ড পলিসি' : 'Refund Policy'}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, onLogout }) => {
  const location = useLocation();
  const hash = window.location.hash || '';

  const isDashboardRoute = (
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/my-weakness') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/question-bank') ||
    location.pathname.startsWith('/qbank') ||
    location.pathname.startsWith('/smart-lessons') ||
    location.pathname.startsWith('/courses') ||
    location.pathname.startsWith('/quizzes') ||
    location.pathname.startsWith('/quiz') ||
    location.pathname.startsWith('/mistakes') ||
    location.pathname.startsWith('/history') ||
    location.pathname.startsWith('/routine') ||
    location.pathname.startsWith('/certificates') ||
    location.pathname.startsWith('/messages') ||
    location.pathname.startsWith('/study-groups') ||
    location.pathname.startsWith('/admission-predictor') ||
    location.pathname.startsWith('/reading-room') ||
    location.pathname.startsWith('/mega-quiz') ||
    location.pathname.startsWith('/leaderboard') ||
    location.pathname.startsWith('/premium') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/mentor/dashboard') ||
    location.pathname.startsWith('/employer-dashboard') ||
    location.pathname.startsWith('/teacher/workspace') ||
    hash.includes('/dashboard') ||
    hash.includes('/my-weakness') ||
    hash.includes('/profile') ||
    hash.includes('/qbank') ||
    hash.includes('/question-bank') ||
    hash.includes('/smart-lessons') ||
    hash.includes('/courses') ||
    hash.includes('/quizzes') ||
    hash.includes('/quiz') ||
    hash.includes('/mistakes') ||
    hash.includes('/history') ||
    hash.includes('/routine') ||
    hash.includes('/certificates') ||
    hash.includes('/messages') ||
    hash.includes('/study-groups') ||
    hash.includes('/admission-predictor') ||
    hash.includes('/reading-room') ||
    hash.includes('/mega-quiz') ||
    hash.includes('/leaderboard') ||
    hash.includes('/premium') ||
    hash.includes('/admin') ||
    hash.includes('/mentor/dashboard') ||
    hash.includes('/employer-dashboard') ||
    hash.includes('/teacher/workspace') ||
    hash.includes('/demo')
  );

  if (isDashboardRoute) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};