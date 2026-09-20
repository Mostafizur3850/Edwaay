import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav_home': { en: 'Home', bn: 'হোম' },
  'nav_dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'nav_quizzes': { en: 'Quizzes', bn: 'কুইজ' },
  'nav_mega_quiz': { en: 'Mega Quiz', bn: 'মেগা কুইজ' },
  'nav_jobs': { en: 'Jobs', bn: 'চাকরি' },
  'nav_store': { en: 'Store', bn: 'স্টোর' },
  'nav_products': { en: 'Products', bn: 'প্রোডাক্টস' },
  'nav_pricing': { en: 'Pricing', bn: 'প্ল্যান' },
  'nav_more': { en: 'More', bn: 'আরও' },
  'nav_login': { en: 'Login', bn: 'লগইন' },
  'nav_join': { en: 'Join Free', bn: 'ফ্রি জয়েন' },
  'nav_profile': { en: 'My Profile', bn: 'প্রোফাইল' },
  'nav_logout': { en: 'Logout', bn: 'লগআউট' },

  // Mega Menu
  'menu_leaderboard': { en: 'Leaderboard', bn: 'লিডারবোর্ড' },
  'menu_leaderboard_desc': { en: 'Check national rankings', bn: 'জাতীয় র‍্যাঙ্কিং দেখুন' },
  'menu_mentors': { en: 'Mentors', bn: 'মেন্টর' },
  'menu_mentors_desc': { en: 'Connect with experts', bn: 'এক্সপার্টদের সাথে কথা বলুন' },
  'menu_blog': { en: 'Blog', bn: 'ব্লগ' },
  'menu_blog_desc': { en: 'Study tips & news', bn: 'পড়াশোনার টিপস ও খবর' },
  'menu_careers': { en: 'Careers', bn: 'ক্যারিয়ার' },
  'menu_careers_desc': { en: 'Join the TakeUUp team', bn: 'আমাদের টিমে জয়েন করুন' },
  'menu_demo': { en: 'Live Demo', bn: 'লাইভ ডেমো' },
  'menu_demo_desc': { en: 'Try premium features', bn: 'প্রিমিয়াম ফিচার দেখুন' },
  'menu_about': { en: 'About Us', bn: 'আমাদের সম্পর্কে' },
  'menu_about_desc': { en: 'Our story & mission', bn: 'আমাদের গল্প ও লক্ষ্য' },

  // Landing Page Hero
  'hero_title_1': { en: 'Everything You Need to Learn, Practice & Succeed —', bn: 'শেখা, অনুশীলন এবং সাফল্যের জন্য যা কিছু প্রয়োজন —' },
  'hero_title_2': { en: 'In One Place.', bn: 'সব এক জায়গায়।' },
  'hero_subtitle': { en: 'The ultimate platform for school, college, and job preparation.', bn: 'স্কুল, কলেজ এবং চাকরির প্রস্তুতির জন্য সেরা প্ল্যাটফর্ম।' },
  'hero_scroll': { en: 'Scroll', bn: 'স্ক্রল করুন' },

  // Category Cards
  'cat_job_title': { en: 'JOB', bn: 'চাকরি' },
  'cat_job_label': { en: 'Job Prep', bn: 'জব প্রস্তুতি' },
  'cat_bcs_title': { en: 'BCS', bn: 'বিসিএস' },
  'cat_bcs_label': { en: 'BCS Exam', bn: 'বিসিএস এক্সাম' },
  'cat_hsc_title': { en: 'HSC', bn: 'এইচএসসি' },
  'cat_hsc_label': { en: 'HSC Academic', bn: 'এইচএসসি একাডেমিক' },
  'cat_adm_title': { en: 'ADMISSION', bn: 'এডমিশন' },
  'cat_adm_label': { en: 'Varsity Test', bn: 'ভার্সিটি ভর্তি' },
  'cat_btn_details': { en: 'View Details', bn: 'বিস্তারিত দেখুন' },

  // Sections
  'sec_one_plan': { en: 'One plan. Everything you need.', bn: 'এক প্ল্যানেই সবকিছু।' },
  'sec_free_title': { en: 'Free For All', bn: 'সবার জন্য ফ্রি' },
  'sec_free_desc': { en: 'Premium quality resources, completely free for every student. Start learning today.', bn: 'প্রিমিয়াম মানের রিসোর্স, সব ছাত্রছাত্রীর জন্য সম্পূর্ণ ফ্রি। আজই শেখা শুরু করুন।' },

  // Free Cards
  'card_quiz_title': { en: 'Free Quiz', bn: 'ফ্রি কুইজ' },
  'card_quiz_desc': { en: 'Test your skills daily', bn: 'প্রতিদিন নিজেকে যাচাই করুন' },
  'card_jobs_title': { en: 'Job Portal', bn: 'জব পোর্টাল' },
  'card_jobs_desc': { en: 'Find your dream career', bn: 'পছন্দের ক্যারিয়ার বেছে নিন' },
  'card_blog_title': { en: 'Blog', bn: 'ব্লগ' },
  'card_blog_desc': { en: 'Tips, tricks & news', bn: 'টিপস এবং খবর' },

  // Footer
  'footer_rights': { en: 'All rights reserved.', bn: 'সর্বস্বত্ব সংরক্ষিত।' },
  'footer_made': { en: 'Made with', bn: 'তৈরি হয়েছে' },
  'footer_in': { en: 'in Bangladesh', bn: 'বাংলাদেশে' },

  // Job Portal
  'job_hero_badge': { en: '#1 Job Platform for Students', bn: 'ছাত্রছাত্রীদের ১ নম্বর জব প্ল্যাটফর্ম' },
  'job_hero_title': { en: 'Launch Your Career', bn: 'আপনার ক্যারিয়ার শুরু করুন' },
  'job_hero_highlight': { en: 'Before Graduation', bn: 'গ্র্যাজুয়েশনের আগেই' },
  'job_hero_desc': { en: 'Connect with top companies for internships, part-time roles, and fresh graduate opportunities.', bn: 'ইন্টার্নশিপ এবং পার্ট-টাইম চাকরির জন্য শীর্ষ কোম্পানিগুলোর সাথে যুক্ত হোন।' },
  'job_search_ph': { en: "Search for 'Frontend Intern'...", bn: "'ফ্রন্টএন্ড ইন্টার্ন' খুঁজুন..." },
  'job_search_btn': { en: 'Search', bn: 'অনুসন্ধান' },
  'job_cat_engineering': { en: 'Engineering', bn: 'ইঞ্জিনিয়ারিং' },
  'job_cat_marketing': { en: 'Marketing', bn: 'মার্কেটিং' },
  'job_cat_design': { en: 'Design', bn: 'ডিজাইন' },
  'job_cat_finance': { en: 'Finance', bn: 'ফাইন্যান্স' },
  'job_cat_education': { en: 'Education', bn: 'শিক্ষা' },
  'job_cat_management': { en: 'Management', bn: 'ম্যানেজমেন্ট' },
  'job_card_dream': { en: 'Find Your Dream Job', bn: 'পছন্দের চাকরি খুঁজুন' },
  'job_card_post': { en: 'Post a Job', bn: 'চাকরি পোস্ট করুন' },
  'job_card_cv': { en: 'AI CV Builder', bn: 'এআই সিভি বিল্ডার' },
  'job_pop_cat': { en: 'Popular Categories', bn: 'জনপ্রিয় ক্যাটাগরি' },
  'job_view_all': { en: 'View All Categories', bn: 'সব ক্যাটাগরি দেখুন' },

  // Dashboard
  'dash_welcome': { en: 'Welcome back', bn: 'স্বাগতম' },
  'dash_streak': { en: 'Day Streak', bn: 'দিনের স্ট্রিক' },
  'dash_points': { en: 'Pts', bn: 'পয়েন্ট' },
  'dash_daily_goal': { en: 'Daily Goal', bn: 'দৈনিক লক্ষ্য' },
  'dash_quizzes_completed': { en: 'Quizzes Completed', bn: 'কুইজ সম্পন্ন' },
  'dash_ai_mentor': { en: 'AI Mentor Suggestion', bn: 'এআই মেন্টর পরামর্শ' },
  'dash_view_plan': { en: 'View Personalized Plan', bn: 'স্টাডি প্ল্যান দেখুন' },
  'dash_recent_activity': { en: 'Recent Activity', bn: 'সাম্প্রতিক কার্যকলাপ' },
  'dash_your_subjects': { en: 'Your Subjects', bn: 'আপনার বিষয়সমূহ' },
  'dash_daily_challenge': { en: 'Daily Challenge', bn: 'দৈনিক চ্যালেঞ্জ' },
  'dash_start_now': { en: 'Start Now', bn: 'শুরু করুন' },

  // Pricing
  'pricing_title': { en: 'Find the Perfect Plan to Ace Your Exams', bn: 'পরীক্ষায় সেরা ফলাফলের জন্য সেরা প্ল্যানটি বেছে নিন' },
  'pricing_subtitle': { en: 'Unlock Your Potential with TakeUUp.', bn: 'TakeUUp এর সাথে আপনার সম্ভাবনা বিকাশ করুন।' },
  'pricing_free_btn': { en: 'Get Started Free', bn: 'ফ্রি শুরু করুন' },
  'pricing_premium_btn': { en: 'Go Premium', bn: 'প্রিমিয়াম হোন' },
  'pricing_aio_btn': { en: 'Choose Plan', bn: 'প্ল্যান বেছে নিন' },
  'pricing_features_comp': { en: 'Compare All Features', bn: 'সব ফিচার তুলনা করুন' },

  // Quiz
  'quiz_daily_header': { en: 'Daily Challenge', bn: 'দৈনিক চ্যালেঞ্জ' },
  'quiz_mixed': { en: 'Mixed Subjects', bn: 'মিশ্র বিষয়' },
  'quiz_questions': { en: 'Questions', bn: 'টি প্রশ্ন' },
  'quiz_next': { en: 'Next Question', bn: 'পরবর্তী প্রশ্ন' },
  'quiz_results': { en: 'See Results', bn: 'ফলাফল দেখুন' },
  'quiz_retry': { en: 'Retry', bn: 'পুনরায় চেষ্টা করুন' },
  'quiz_dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'quiz_score': { en: 'Quiz Results', bn: 'কুইজ ফলাফল' },
  'quiz_completed': { en: 'Completed', bn: 'সম্পন্ন' },
  'quiz_excellent': { en: 'Excellent', bn: 'চমৎকার' },

  // Newsletter
  'news_title': { en: 'Stay Updated! Customize Your Newsletter', bn: 'আপডেট থাকুন! আপনার নিউজলেটার কাস্টমাইজ করুন' },
  'news_desc': { en: 'Get personalized news, tips, and updates delivered straight to your inbox. Select your interests below to get started.', bn: 'আপনার ইনবক্সে সরাসরি পড়াশোনা ও পরীক্ষার টিপস পেতে নিচের পছন্দের বিষয় নির্বাচন করুন।' },
  'news_email_label': { en: 'Email Address', bn: 'ইমেইল ঠিকানা' },
  'news_email_ph': { en: 'Enter your email address', bn: 'আপনার ইমেইল ঠিকানা লিখুন' },
  'news_customize_title': { en: 'Customize Your Feed', bn: 'পছন্দের বিষয় নির্বাচন করুন' },
  'news_tag_ssc': { en: 'SSC Updates', bn: 'এসএসসি আপডেট' },
  'news_tag_hsc': { en: 'HSC Admission News', bn: 'এইচএসসি এডমিশন নিউজ' },
  'news_tag_job': { en: 'Job Prep Tips', bn: 'জব প্রস্তুতি টিপস' },
  'news_tag_quiz': { en: 'New Quiz Alerts', bn: 'নতুন কুইজ এলার্ট' },
  'news_tag_ai': { en: 'AI Mentor Insights', bn: 'এআই মেন্টর টিপস' },
  'news_subscribe_btn': { en: 'Subscribe Now', bn: 'সাবস্ক্রাইব করুন' },

  // FAQ
  'faq_badge': { en: 'FAQ', bn: 'সাধারণ প্রশ্নাবলী' },
  'faq_title_1': { en: 'Frequently Asked', bn: 'সবচেয়ে বেশি জিজ্ঞাসিত' },
  'faq_title_2': { en: 'Questions', bn: 'প্রশ্ন ও উত্তর' },
  'faq_sub': { en: 'Find quick answers to common questions about our platform.', bn: 'আমাদের প্ল্যাটফর্ম সম্পর্কে সাধারণ প্রশ্নগুলির দ্রুত উত্তর খুঁজুন।' },

  // Features Section
  'feat_section_title': { en: 'Everything You Need to Succeed', bn: 'আপনার সাফল্যের জন্য যা কিছু প্রয়োজন' },
  'feat_section_subtitle': { en: 'Click on any feature below to explore how we help you master your exams.', bn: 'আপনার পরীক্ষার প্রস্তুতির জন্য নিচে যেকোনো ফিচারে ক্লিক করে বিস্তারিত জানুন।' },

  // Testimonials
  'test_title': { en: 'Student & Guardian Feedbacks', bn: 'শিক্ষার্থী ও অভিভাবকদের মতামত' },
  'test_subtitle': { en: 'What parents and students say about TakeUUp.', bn: 'TakeUUp সম্পর্কে অভিভাবক ও শিক্ষার্থীদের অভিজ্ঞতা।' },
  'test_share_btn': { en: 'Share Feedback', bn: 'মতামত দিন' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language') as Language;
    return (saved === 'bn' || saved === 'en') ? saved : 'bn';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'bn') {
      document.body.classList.add('bn-font');
    } else {
      document.body.classList.remove('bn-font');
    }
  }, [language]);

  const toggleLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};