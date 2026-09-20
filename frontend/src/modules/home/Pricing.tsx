import React, { useState, useEffect } from 'react';
import { Check, X, Tag, CreditCard, User, Mail, Lock, ArrowRight, ChevronDown, Sparkles, Star, Zap, Shield, BookOpen } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { fetchGeneralSettings } from '../../services/api';

interface PricingProps {
    onLogin?: () => void;
    isAuthenticated?: boolean;
}

const EXAM_GOALS = [
    { id: 'HSC', label: 'HSC Academic' },
    { id: 'Admission', label: 'University Admission' },
    { id: 'Job', label: 'Job Preparation' },
    { id: 'BCS', label: 'BCS Preliminary' },
    { id: 'JobPostAccess', label: 'Job Post Full Access (Employers)' },
];

const SUBJECTS_BY_CLASS: Record<string, string[]> = {
    HSC: ['Physics', 'Chemistry', 'Math', 'Biology', 'ICT', 'English', 'Bangla'],
    Admission: ['Physics', 'Chemistry', 'Math', 'Biology', 'General Knowledge', 'English', 'Bangla'],
    Job: ['Bangla Language', 'English Literature', 'General Knowledge', 'Math', 'Mental Ability', 'International Affairs', 'Bangladesh Affairs'],
    BCS: ['Bangladesh Affairs', 'International Affairs', 'English Language', 'Bangla Literature', 'Mathematical Reasoning', 'Mental Ability', 'General Science', 'ICT'],
    JobPostAccess: ['Screening Tests', 'Unlimited Job Posts', 'Advanced Analytics', 'Candidate Filtering', 'Priority Support'],
};

export const Pricing: React.FC<PricingProps> = ({ onLogin, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const isBn = language === 'bn';
  
  // Modal States
  const [showModal, setShowModal] = useState(false); // Payment Modal
  const [showSignUp, setShowSignUp] = useState(false); // Sign Up Modal
  
  // Payment States
  const [couponCode, setCouponCode] = useState('');
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('HSC'); // Default goal

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '' });

  const DEFAULT_PLANS = [
    {
        name: 'Starter',
        price: 0,
        period: '/forever',
        desc: 'Essential tools to get you started.',
        iconName: 'Shield',
        features: ['Daily Quizzes (Limited)', 'Basic Analytics', 'Community Access', 'Ad-Supported'],
        buttonText: 'Start Free',
        featured: false
    },
    {
        name: '2 Months',
        price: 349,
        period: '/2 months',
        desc: 'Perfect for quick exam revisions.',
        iconName: 'Zap',
        features: ['Unlimited Quizzes', 'Full Analytics Report', 'Job & Admission Prep', 'Ad-Free Experience'],
        buttonText: 'Choose 2 Months',
        featured: false
    },
    {
        name: '4 Months',
        price: 599,
        period: '/4 months',
        desc: 'Our most popular choice for students.',
        iconName: 'Sparkles',
        features: ['Everything in 2 Months', 'Exclusive Live Classes', 'Priority Support', 'Offline Download'],
        buttonText: 'Get 4 Months',
        featured: true
    },
    {
        name: '6 Months',
        price: 799,
        period: '/6 months',
        desc: 'Complete coverage for your goals.',
        iconName: 'Zap',
        features: ['Full Access Pass', 'Mentor 1-on-1 Access', 'Premium Resources', 'No Restrictions'],
        buttonText: 'Choose 6 Months',
        featured: false
    }
  ];

  const [plans, setPlans] = useState<any[]>([]);
  const [plansDict, setPlansDict] = useState<Record<string, number>>({});

  // Payment Simulation States
  const [paymentStep, setPaymentStep] = useState<'details' | 'bkash_phone' | 'bkash_otp' | 'bkash_pin' | 'ssl_portal' | 'ssl_card' | 'processing'>('details');
  const [paymentGateway, setPaymentGateway] = useState<'bkash' | 'ssl'>('bkash');
  const [bkashPhone, setBkashPhone] = useState('');
  const [bkashOtp, setBkashOtp] = useState('');
  const [bkashPin, setBkashPin] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
      if (location.state?.selectedGoalId) {
          let goalId = location.state.selectedGoalId;
          // Normalize IDs coming from URL params (e.g., job-prep -> Job)
          if (goalId === 'job-prep') goalId = 'Job';
          if (goalId === 'bcs') goalId = 'BCS';
          if (goalId === 'hsc') goalId = 'HSC';
          if (goalId === 'admission') goalId = 'Admission';
          
          // Verify if the normalized ID exists in our options, otherwise fallback to HSC
          const exists = EXAM_GOALS.some(g => g.id === goalId);
          if (exists) {
              setSelectedGoal(goalId);
          }
      }
      
      if (location.state?.returnTo === '/jobs/create') {
          setSelectedGoal('JobPostAccess');
      }
  }, [location.state]);

  useEffect(() => {
      const loadPricingPlans = async () => {
          try {
              const settings = await fetchGeneralSettings();
              if (settings && settings.pricingPlansJson) {
                  const parsedPlans = JSON.parse(settings.pricingPlansJson);
                  setPlans(parsedPlans);
                  const dict: Record<string, number> = {};
                  parsedPlans.forEach((p: any) => {
                      dict[p.name] = p.price;
                  });
                  setPlansDict(dict);
              }
          } catch (e) {
              console.error("Failed to load pricing plans", e);
          }
      };
      loadPricingPlans();
  }, []);

  const getIcon = (name: string) => {
      switch (name) {
          case 'Shield': return <Shield className="text-slate-500 dark:text-slate-400" size={24} />;
          case 'Zap': return <Zap className="text-purple-500 dark:text-purple-400" size={24} />;
          case 'Sparkles': return <Sparkles className="text-cyan-600 dark:text-cyan-400" size={24} />;
          default: return <Zap className="text-purple-500 dark:text-purple-400" size={24} />;
      }
  };

  const getBtnColor = (name: string, featured: boolean) => {
      if (featured) {
          return 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25';
      }
      if (name === 'Starter' || name.toLowerCase().includes('free')) {
          return 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700';
      }
      if (name.includes('2') || name.toLowerCase().includes('two')) {
          return 'bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
      }
      return 'bg-orange-100 dark:bg-orange-900/20 hover:bg-orange-200 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800';
  };

  const openPaymentModal = (plan: string) => {
      setSelectedPlan(plan);
      setCouponCode('');
      setIsDiscountApplied(false);
      setPaymentStep('details');
      setPaymentGateway('bkash');
      setBkashPhone('');
      setBkashOtp('');
      setBkashPin('');
      setCardNo('');
      setCardHolder('');
      setCardExpiry('');
      setCardCvv('');
      
      if (isAuthenticated || plan === 'Starter') {
          setShowModal(true);
      } else {
          setShowSignUp(true);
      }
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newUser = {
          name: signUpForm.name || 'New Student',
          email: signUpForm.email,
          role: selectedGoal === 'JobPostAccess' ? 'employer' : 'student',
          plan: 'free',
          streak: 0,
          points: 0,
          studentClass: selectedGoal, 
          selectedSubjects: SUBJECTS_BY_CLASS[selectedGoal]
      };
      
      localStorage.setItem('takeuup_user', JSON.stringify(newUser));
      
      if (onLogin) onLogin();
      
      setShowSignUp(false);
      setPaymentStep('details');
      setPaymentGateway('bkash');
      setShowModal(true);
  };

  const handleApplyCoupon = () => {
      if (couponCode.toLowerCase().trim() === 'free') {
          setIsDiscountApplied(true);
      } else {
          alert("Invalid coupon code. Try 'free'.");
          setCouponCode('');
          setIsDiscountApplied(false);
      }
  };

  const performSubscribedUpgrade = async () => {
      const userStr = localStorage.getItem('takeuup_user');
      if (userStr) {
          const user = JSON.parse(userStr);
          
          let planId = 'free';
          if (selectedPlan === '2 Months') planId = '2_months';
          if (selectedPlan === '4 Months') planId = '4_months';
          if (selectedPlan === '6 Months') planId = '6_months';
          if (selectedPlan === 'Starter') planId = 'starter';

          user.plan = planId;
          user.studentClass = selectedGoal;
          user.selectedSubjects = SUBJECTS_BY_CLASS[selectedGoal];
          
          if (selectedGoal === 'JobPostAccess') {
              user.role = 'employer';
          }

          localStorage.setItem('takeuup_user', JSON.stringify(user));

          // Persist the premium subscription status in the backend database
          try {
              const { updateUserProfile } = await import('../../services/api');
              await updateUserProfile({
                  name: user.name || 'User',
                  phoneNumber: user.phoneNumber || '',
                  isSubscribed: planId !== 'free',
                  studentClass: selectedGoal,
                  selectedSubjects: SUBJECTS_BY_CLASS[selectedGoal]
              });
          } catch (e) {
              console.error("Failed to persist premium upgrade in the database", e);
          }
      }

      const state = location.state as { returnTo?: string } | null;
      const returnPath = state?.returnTo || (selectedGoal === 'JobPostAccess' ? '/jobs/create' : '/dashboard');
      
      setShowModal(false);
      navigate(returnPath);
  };

  const handleProceedToPayment = () => {
      if (selectedPlan === 'Starter' || isDiscountApplied) {
          performSubscribedUpgrade();
      } else {
          if (paymentGateway === 'bkash') {
              setPaymentStep('bkash_phone');
          } else {
              setPaymentStep('ssl_portal');
          }
      }
  };

  const handleBkashPhoneSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bkashPhone || bkashPhone.length < 11) {
          alert("Please enter a valid bKash wallet number (11 digits)");
          return;
      }
      setPaymentStep('bkash_otp');
  };

  const handleBkashOtpSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bkashOtp || bkashOtp.length < 6) {
          alert("Please enter the 6-digit verification code");
          return;
      }
      setPaymentStep('bkash_pin');
  };

  const handleBkashPinSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bkashPin || bkashPin.length < 4) {
          alert("Please enter your PIN");
          return;
      }
      setPaymentStep('processing');
      setTimeout(() => {
          performSubscribedUpgrade();
      }, 2000);
  };

  const handleSslPortalSelect = (portal: string) => {
      if (portal === 'card') {
          setPaymentStep('ssl_card');
      } else {
          setPaymentStep('processing');
          setTimeout(() => {
              performSubscribedUpgrade();
          }, 2000);
      }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!cardNo || cardNo.length < 16) {
          alert("Please enter a valid 16-digit card number");
          return;
      }
      if (!cardExpiry) {
          alert("Please enter card expiry date");
          return;
      }
      if (!cardCvv || cardCvv.length < 3) {
          alert("Please enter valid CVV");
          return;
      }
      setPaymentStep('processing');
      setTimeout(() => {
          performSubscribedUpgrade();
      }, 2000);
  };

  const rawPlans = plans.length > 0 ? plans : DEFAULT_PLANS;

  const translatePlan = (p: any) => {
    if (!isBn) return p;
    const n = (p.name || '').toLowerCase();
    let name = p.name;
    let desc = p.desc;
    let period = p.period;
    let buttonText = p.buttonText;
    let features = Array.isArray(p.features) ? p.features : [];

    if (n.includes('starter') || n.includes('free')) {
      name = 'ফ্রি স্টার্টার';
      desc = 'শেখা শুরু করার জন্য প্রয়োজনীয় সকল বেসিক টুলস।';
      period = '/আজীবন';
      buttonText = 'ফ্রি শুরু করুন';
      features = ['দৈনিক কুইজ ও প্র্যাকটিস', 'বেসিক পারফরম্যান্স এনালাইসিস', 'কমিউনিটি ও স্টাডি গ্রুপ এক্সেস', 'বিনামূল্যে ব্যবহার উপযোগী'];
    } else if (n.includes('2') || n.includes('two')) {
      name = '২ মাসের কোর্স';
      desc = 'দ্রুত পরীক্ষার রিভিশন ও সল্যুশন ব্যাংকের জন্য পারফেক্ট।';
      period = '/২ মাস';
      buttonText = '২ মাসের প্ল্যান বেছে নিন';
      features = ['আনলিমিটেড মক কুইজ', 'সম্পূর্ণ পারফরম্যান্স রিপোর্ট', 'জব ও অ্যাডমিশন ফুল প্রিপারেশন', 'বিজ্ঞাপন মুক্ত এক্সপেরিয়েন্স'];
    } else if (n.includes('4') || n.includes('four')) {
      name = '৪ মাসের মাস্টার কোর্স';
      desc = 'পরীক্ষার্থীদের মধ্যে সবচেয়ে জনপ্রিয় ও সেরা পছন্দ।';
      period = '/৪ মাস';
      buttonText = '৪ মাসের মাস্টার কোর্স নিন';
      features = ['২ মাসের প্ল্যানের সব ফিচার', 'এক্সক্লুসিভ লাইভ ও AI ক্লাসেস', 'প্রাইওরিটি সাপোর্ট ও সল্যুশন', 'অফলাইন কন্টেন্ট ডাউনলোড'];
    } else if (n.includes('6') || n.includes('six')) {
      name = '৬ মাসের কমপ্লিট পাস';
      desc = 'এইচএসসি ও ভর্তি পরীক্ষার সম্পূর্ণ এ-টু-জেড পাস।';
      period = '/৬ মাস';
      buttonText = '৬ মাসের কমপ্লিট পাস নিন';
      features = ['অল-ইন-ওয়ান ফুল এক্সেস পাস', '১-অন-১ মেন্টর কনেক্টিভিটি', 'প্রিমিয়াম রিসোর্স ও ফাইলস', 'কোনো লিমিটেশন নেই'];
    }

    return { ...p, name, desc, period, buttonText, features };
  };

  const displayPlans = rawPlans.map(translatePlan);
  const PLAN_DETAILS = displayPlans.map(p => ({
      name: p.name,
      price: p.price,
      period: p.period,
      desc: p.desc,
      icon: getIcon(p.iconName),
      features: p.features || [],
      buttonText: p.name === 'Starter' ? t('pricing_free_btn') : p.buttonText || `Choose ${p.name}`,
      featured: p.featured,
      btnColor: getBtnColor(p.name, p.featured)
  }));

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-cyan-500/30 overflow-hidden pt-20 transition-colors duration-500">
        
        {/* Background Glows */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-200/40 dark:bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-cyan-200/40 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 py-16">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 text-sm font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 shadow-sm backdrop-blur-md">
                    <Sparkles size={14} /> {isBn ? '🚀 আপনার ভবিষ্যৎ প্রস্তুতিতে সেরা বিনিয়োগ' : 'Investing in your future'}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight drop-shadow-sm">
                    {isBn ? 'স্বচ্ছ সাবস্ক্রিপশন ফি,' : 'Simple Pricing,'} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500">
                        {isBn ? 'অসীম সম্ভাবনা ও নিশ্চিত সফলতা 🚀' : 'Unlimited Potential.'}
                    </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-xl font-light leading-relaxed">
                    {isBn ? 'এইচএসসি, বুয়েট, মেডিকেল ও বিসিএস পরীক্ষার নিশ্চিত প্রস্তুতির জন্য তোমার মানানসই সেরা প্ল্যানটি বেছে নাও।' : 'Choose the perfect plan for your HSC, BUET, Medical, or BCS exam preparation.'}
                </p>
            </div>

            {/* Pricing Cards */}
            {(plans.length > 0 ? plans : DEFAULT_PLANS).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto mb-32">
                    {PLAN_DETAILS.map((plan, idx) => (
                        <div 
                            key={idx} 
                            className={`relative flex flex-col bg-white dark:bg-slate-900/40 backdrop-blur-md border rounded-[2.5rem] p-8 transition-all duration-300 group hover:-translate-y-2 shadow-xl dark:shadow-none ${
                                plan.featured 
                                ? 'border-2 border-cyan-500 lg:scale-105 z-10 bg-slate-50/50 dark:bg-slate-900 shadow-cyan-500/10' 
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                        >
                            {plan.featured && (
                                <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-bl-2xl text-[10px] font-bold text-white shadow-lg uppercase tracking-wider">
                                    {isBn ? 'সেরা পছন্দ' : 'Recommended'}
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                                    plan.featured ? 'bg-cyan-100 dark:bg-cyan-900/30' : 'bg-slate-100 dark:bg-slate-800'
                                }`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm h-10 leading-snug">{plan.desc}</p>
                            </div>
                            
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">৳{plan.price}</span>
                                <span className="text-slate-500 font-medium text-sm">{plan.period}</span>
                            </div>

                            <button 
                                onClick={() => openPaymentModal(plan.name)}
                                className={`w-full py-4 rounded-2xl font-bold transition-all mb-8 shadow-sm ${plan.btnColor}`}
                            >
                                {plan.buttonText}
                            </button>

                            <ul className="space-y-4 flex-1">
                                {plan.features.map((feat: any, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                        <Check size={16} className={`${plan.featured ? 'text-cyan-500' : 'text-slate-400'} shrink-0 mt-0.5`} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="max-w-xl mx-auto py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/40 mb-32">
                    <Sparkles size={48} className="mb-4 opacity-50 text-cyan-500" />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No Plans Configured</h3>
                    <p className="text-slate-500">There are no active pricing plans configured in general settings.</p>
                </div>
            )}

            {/* Feature Comparison */}
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{isBn ? 'বিস্তারিত ফিচার তুলনা' : 'Detailed Comparison'}</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
                </div>
                
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl dark:shadow-none">
                    {/* Header Row */}
                    <div className="grid grid-cols-3 p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                        <div className="col-span-1 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{isBn ? 'ফিচার বিবরণ' : 'FEATURE'}</div>
                        <div className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{isBn ? 'ফ্রি প্ল্যান' : 'FREE'}</div>
                        <div className="text-center text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{isBn ? 'প্রো প্ল্যান' : 'PRO'}</div>
                    </div>

                    {/* Rows */
                    [
                        { name: isBn ? 'বিষয়ভিত্তিক কুইজ ও প্র্যাকটিস' : 'Subject-wise Quizzes', free: true, pro: true },
                        { name: isBn ? 'প্রশ্নব্যাংকের বিস্তারিত সমাধান' : 'Detailed Explanations', free: true, pro: true },
                        { name: isBn ? 'পারফরম্যান্স এনালাইসিস' : 'Performance Analytics', free: isBn ? 'বেসিক' : 'Basic', pro: isBn ? 'অ্যাডভান্সড AI' : 'Advanced AI' },
                        { name: isBn ? 'জব ও অ্যাডমিশন প্রিপারেশন মডিউল' : 'Job & Admission Modules', free: false, pro: true },
                        { name: isBn ? 'এমপ্লয়ার ও টিচার ফিল্টারিং টুলস' : 'Employer Tools (Screening)', free: false, pro: true },
                        { name: isBn ? '১-অন-১ মেন্টর চ্যাট এক্সেস' : 'Mentor Chat Access', free: false, pro: true },
                        { name: isBn ? 'বিজ্ঞাপন মুক্ত ব্যবহার' : 'Ad-Free Experience', free: false, pro: true },
                        { name: isBn ? 'অফলাইন কন্টেন্ট ডাউনলোড' : 'Offline Downloads', free: false, pro: true },
                    ].map((row, idx) => (
                        <div key={idx} className={`grid grid-cols-3 p-5 text-sm items-center transition-colors ${idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-white/[0.02]' : 'bg-white dark:bg-transparent'} hover:bg-slate-50 dark:hover:bg-white/[0.05]`}>
                            <div className="col-span-1 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                {row.name}
                                {!row.free && <Lock size={12} className="text-slate-400 dark:text-slate-600" />}
                            </div>
                            <div className="text-center flex justify-center">
                                {row.free === true 
                                    ? <Check size={18} className="text-slate-400" /> 
                                    : row.free === false 
                                    ? <X size={18} className="text-slate-300 dark:text-slate-700" /> 
                                    : <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">{row.free}</span>
                                }
                            </div>
                            <div className="text-center flex justify-center">
                                {row.pro === true 
                                    ? <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20"><Check size={14} className="text-white" strokeWidth={3} /></div> 
                                    : <span className="text-cyan-600 dark:text-cyan-400 font-bold">{row.pro}</span>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* --- MODALS --- */}

        {/* Sign Up Modal */}
        {showSignUp && selectedPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                    <button onClick={() => setShowSignUp(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <X size={20} />
                    </button>
                    
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-200 dark:border-cyan-500/20">
                            <User size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Sign up to unlock your {selectedPlan} subscription.</p>
                    </div>

                    <form onSubmit={handleSignUpSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Full Name</label>
                            <input 
                                type="text"
                                name="name"
                                required
                                value={signUpForm.name}
                                onChange={handleSignUpChange}
                                placeholder="John Doe" 
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Email Address</label>
                            <input 
                                type="email"
                                name="email"
                                required
                                value={signUpForm.email}
                                onChange={handleSignUpChange}
                                placeholder="you@example.com" 
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Password</label>
                            <input 
                                type="password"
                                name="password"
                                required
                                value={signUpForm.password}
                                onChange={handleSignUpChange}
                                placeholder="••••••••" 
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>

                        {/* Goal Selection in Signup */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Select Goal / Class</label>
                            <div className="relative">
                                <select
                                    value={selectedGoal}
                                    onChange={(e) => setSelectedGoal(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 text-slate-900 dark:text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer font-medium transition-all hover:border-slate-400 dark:hover:border-slate-600"
                                >
                                    {EXAM_GOALS.map(goal => (
                                        <option key={goal.id} value={goal.id}>{goal.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-3.5 mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                        >
                            Create Account & Continue <ArrowRight size={18} />
                        </button>
                    </form>
                    
                    <p className="text-center text-xs text-slate-500 mt-6">
                        Already have an account? <Link to="/login" className="text-cyan-600 dark:text-cyan-400 hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        )}

        {/* Payment / Goal Selection Modal */}
        {showModal && selectedPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                    
                    {/* Header bar / Close button (only visible when not in bkash payment screens to match native bkash app looks) */}
                    {paymentStep === 'details' && (
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full z-10">
                            <X size={20} />
                        </button>
                    )}

                    {/* Step 1: Details and Payment Selection */}
                    {paymentStep === 'details' && (
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                {selectedPlan === 'Starter' ? 'Activate Free Plan' : `Subscribe to ${selectedPlan}`}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                {selectedPlan === 'Starter' ? 'Get started with essential features.' : 'Unlock unlimited access today.'}
                            </p>

                            {selectedPlan !== 'Starter' && (
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mb-6 border border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-500 dark:text-slate-400 text-sm">Subtotal</span>
                                        <span className="text-slate-900 dark:text-white font-mono">৳{plansDict[selectedPlan] ?? 0}</span>
                                    </div>
                                    {isDiscountApplied && (
                                        <div className="flex justify-between items-center mb-2 text-green-600 dark:text-green-400 text-sm animate-in slide-in-from-left-2">
                                            <span className="flex items-center gap-1"><Tag size={12} /> Coupon (FREE)</span>
                                            <span className="font-mono">-৳{plansDict[selectedPlan] ?? 0}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2 flex justify-between items-center font-bold text-lg">
                                        <span className="text-slate-900 dark:text-white">Total</span>
                                        <span className={isDiscountApplied ? "text-green-600 dark:text-green-400" : "text-cyan-600 dark:text-cyan-400"}>
                                            ৳{isDiscountApplied ? 0 : (plansDict[selectedPlan] ?? 0)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-6 space-y-5">
                                {/* Exam Goal Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Select Your Goal / Exam</label>
                                    <div className="relative">
                                        <select
                                            value={selectedGoal}
                                            onChange={(e) => setSelectedGoal(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 text-slate-900 dark:text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer font-medium transition-all hover:border-slate-400 dark:hover:border-slate-600"
                                        >
                                            {EXAM_GOALS.map(goal => (
                                                <option key={goal.id} value={goal.id}>{goal.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                    </div>
                                    
                                    {/* Visual Feedback for Subjects */}
                                    <div className="mt-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                        <span className="text-xs font-bold text-slate-500 uppercase block mb-2 flex items-center gap-1">
                                            <BookOpen size={12} /> Subjects Included:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {SUBJECTS_BY_CLASS[selectedGoal]?.map(sub => (
                                                <span key={sub} className="text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-medium">
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Coupon Section (Only for Paid Plans) */}
                                {selectedPlan !== 'Starter' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Have a coupon?</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Enter code" 
                                                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:border-cyan-500 outline-none uppercase placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                                            />
                                            <button 
                                                onClick={handleApplyCoupon}
                                                disabled={isDiscountApplied}
                                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {isDiscountApplied && <p className="text-green-600 dark:text-green-400 text-xs mt-2 flex items-center gap-1 font-bold ml-1 animate-in fade-in"><Check size={12} /> Coupon applied successfully!</p>}
                                    </div>
                                )}

                                {/* Payment Method Selection */}
                                {selectedPlan !== 'Starter' && !isDiscountApplied && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Select Payment Gateway</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => setPaymentGateway('bkash')}
                                                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all hover:scale-102 ${
                                                    paymentGateway === 'bkash' 
                                                    ? 'border-[#D12053] bg-[#D12053]/5 dark:bg-[#D12053]/10 text-[#D12053] font-bold shadow-md' 
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="h-6 flex items-center justify-center font-bold text-lg text-[#D12053]">bKash</div>
                                                <span className="text-[10px] uppercase font-bold tracking-wider">Mobile wallet</span>
                                            </button>
                                            <button 
                                                onClick={() => setPaymentGateway('ssl')}
                                                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all hover:scale-102 ${
                                                    paymentGateway === 'ssl' 
                                                    ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold shadow-md' 
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="h-6 flex items-center justify-center font-black tracking-tighter text-cyan-600 dark:text-cyan-400">SSLCommerz</div>
                                                <span className="text-[10px] uppercase font-bold tracking-wider">Cards / Net Banking</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleProceedToPayment}
                                className={`w-full py-3.5 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 active:scale-[0.98] ${
                                    selectedPlan === 'Starter' || isDiscountApplied
                                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/20'
                                }`}
                            >
                                {selectedPlan === 'Starter' || isDiscountApplied ? (
                                    <>Activate Plan <ArrowRight size={18} /></>
                                ) : (
                                    <><CreditCard size={18} /> Proceed to Pay</>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step 2: bKash Mobile Wallet Number Screen */}
                    {paymentStep === 'bkash_phone' && (
                        <div className="bg-[#D12053] text-white flex flex-col items-center p-6 animate-in slide-in-from-right duration-250">
                            {/* Logo */}
                            <div className="w-full flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                                <span className="font-extrabold text-2xl tracking-wide">bKash Checkout</span>
                                <button onClick={() => setPaymentStep('details')} className="text-white/60 hover:text-white text-xs px-2.5 py-1 border border-white/30 rounded-lg transition-all">Back</button>
                            </div>

                            <div className="w-full text-center mb-6">
                                <p className="text-xs uppercase tracking-wide text-white/80 font-bold mb-1">Merchant: TakeUUp Portal</p>
                                <p className="text-2xl font-black">৳{isDiscountApplied ? 0 : (plansDict[selectedPlan] ?? 0)}</p>
                            </div>

                            <form onSubmit={handleBkashPhoneSubmit} className="w-full space-y-5 bg-white/10 p-5 rounded-2xl border border-white/15">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/95 mb-2">Your bKash Account Number</label>
                                    <input 
                                        type="tel"
                                        maxLength={11}
                                        placeholder="e.g. 01XXXXXXXXX"
                                        value={bkashPhone}
                                        onChange={(e) => setBkashPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-white text-slate-900 border border-white/20 rounded-xl px-4 py-3 text-lg font-bold text-center outline-none focus:ring-4 focus:ring-white/20 placeholder-slate-400"
                                        required
                                    />
                                </div>

                                <div className="text-[10px] text-white/70 text-center leading-relaxed">
                                    By clicking Confirm, you agree to our Terms and Conditions. Your wallet information is encrypted.
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="w-full py-3 bg-black/25 hover:bg-black/35 text-white font-bold rounded-xl text-sm transition-all"
                                    >
                                        Close
                                    </button>
                                    <button 
                                        type="submit"
                                        className="w-full py-3 bg-white text-[#D12053] hover:bg-slate-100 font-extrabold rounded-xl text-sm transition-all shadow-md active:scale-98"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Step 3: bKash OTP Verification Screen */}
                    {paymentStep === 'bkash_otp' && (
                        <div className="bg-[#D12053] text-white flex flex-col items-center p-6 animate-in slide-in-from-right duration-250">
                            <div className="w-full flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                                <span className="font-extrabold text-2xl tracking-wide">bKash Verification</span>
                                <button onClick={() => setPaymentStep('bkash_phone')} className="text-white/60 hover:text-white text-xs px-2.5 py-1 border border-white/30 rounded-lg transition-all">Back</button>
                            </div>

                            <div className="w-full text-center mb-6">
                                <p className="text-xs uppercase tracking-wide text-white/80 font-bold mb-1">Enter 6-Digit Code sent to</p>
                                <p className="text-sm font-bold tracking-widest text-white">{bkashPhone.replace(/(\d{3})\d{5}(\d{3})/, '$1*****$2')}</p>
                            </div>

                            <form onSubmit={handleBkashOtpSubmit} className="w-full space-y-5 bg-white/10 p-5 rounded-2xl border border-white/15">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/95 mb-2">Verification Code (OTP)</label>
                                    <input 
                                        type="text"
                                        maxLength={6}
                                        placeholder="Enter 6-digit OTP"
                                        value={bkashOtp}
                                        onChange={(e) => setBkashOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-white text-slate-900 border border-white/20 rounded-xl px-4 py-3 text-lg font-bold text-center tracking-widest outline-none focus:ring-4 focus:ring-white/20 placeholder-slate-400"
                                        required
                                    />
                                    <div className="text-right mt-1.5">
                                        <button type="button" onClick={() => alert("Simulated OTP sent again!")} className="text-[10px] text-white/80 hover:text-white underline">Resend Code</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="w-full py-3 bg-black/25 hover:bg-black/35 text-white font-bold rounded-xl text-sm transition-all"
                                    >
                                        Close
                                    </button>
                                    <button 
                                        type="submit"
                                        className="w-full py-3 bg-white text-[#D12053] hover:bg-slate-100 font-extrabold rounded-xl text-sm transition-all shadow-md active:scale-98"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Step 4: bKash PIN Verification Screen */}
                    {paymentStep === 'bkash_pin' && (
                        <div className="bg-[#D12053] text-white flex flex-col items-center p-6 animate-in slide-in-from-right duration-250">
                            <div className="w-full flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                                <span className="font-extrabold text-2xl tracking-wide">Enter PIN</span>
                                <button onClick={() => setPaymentStep('bkash_otp')} className="text-white/60 hover:text-white text-xs px-2.5 py-1 border border-white/30 rounded-lg transition-all">Back</button>
                            </div>

                            <div className="w-full text-center mb-6">
                                <p className="text-xs uppercase tracking-wide text-white/80 font-bold mb-1">Enter your 5-digit bKash PIN</p>
                                <p className="text-xs text-white/60">This connection is secured & encrypted.</p>
                            </div>

                            <form onSubmit={handleBkashPinSubmit} className="w-full space-y-5 bg-white/10 p-5 rounded-2xl border border-white/15">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/95 mb-2">bKash PIN</label>
                                    <input 
                                        type="password"
                                        maxLength={5}
                                        placeholder="•••••"
                                        value={bkashPin}
                                        onChange={(e) => setBkashPin(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-white text-slate-900 border border-white/20 rounded-xl px-4 py-3 text-2xl font-bold text-center tracking-widest outline-none focus:ring-4 focus:ring-white/20"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="w-full py-3 bg-black/25 hover:bg-black/35 text-white font-bold rounded-xl text-sm transition-all"
                                    >
                                        Close
                                    </button>
                                    <button 
                                        type="submit"
                                        className="w-full py-3 bg-white text-[#D12053] hover:bg-slate-100 font-extrabold rounded-xl text-sm transition-all shadow-md active:scale-98"
                                    >
                                        Confirm Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Step 5: SSLCommerz Payment Gateway Portal Screen */}
                    {paymentStep === 'ssl_portal' && (
                        <div className="p-6 animate-in slide-in-from-right duration-250">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <h3 className="font-extrabold text-xl text-slate-950 dark:text-white">SSLCommerz Checkout</h3>
                                    <p className="text-xs text-slate-500">Secure Gateway</p>
                                </div>
                                <button onClick={() => setPaymentStep('details')} className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg transition-all">Back</button>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl mb-6 text-center border border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Subscription total</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">৳{isDiscountApplied ? 0 : (plansDict[selectedPlan] ?? 0)}</span>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => handleSslPortalSelect('card')}
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 flex items-center justify-between transition-all group hover:scale-[1.01] hover:bg-cyan-500/[0.02]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"><CreditCard size={20} /></div>
                                        <div className="text-left">
                                            <span className="font-bold text-sm block text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">Cards</span>
                                            <span className="text-[10px] text-slate-500">Visa, MasterCard, DBBL, Amex</span>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-all" />
                                </button>

                                <button 
                                    onClick={() => handleSslPortalSelect('rocket')}
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 flex items-center justify-between transition-all group hover:scale-[1.01] hover:bg-cyan-500/[0.02]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center text-purple-600 font-bold">R</div>
                                        <div className="text-left">
                                            <span className="font-bold text-sm block text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">Rocket / Nagad</span>
                                            <span className="text-[10px] text-slate-500">Fast Mobile Banking API</span>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 6: SSLCommerz Card Details Entry Screen */}
                    {paymentStep === 'ssl_card' && (
                        <div className="p-6 animate-in slide-in-from-right duration-250">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <h3 className="font-extrabold text-xl text-slate-950 dark:text-white">Card Details</h3>
                                    <p className="text-xs text-slate-500">Visa / Mastercard / Amex</p>
                                </div>
                                <button onClick={() => setPaymentStep('ssl_portal')} className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg transition-all">Back</button>
                            </div>

                            <form onSubmit={handleCardSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Card Number</label>
                                    <input 
                                        type="text"
                                        maxLength={16}
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        value={cardNo}
                                        onChange={(e) => setCardNo(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 font-mono text-slate-900 dark:text-white placeholder-slate-400"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Expiry Date</label>
                                        <input 
                                            type="text"
                                            maxLength={5}
                                            placeholder="MM/YY"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 font-mono text-center text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CVV</label>
                                        <input 
                                            type="password"
                                            maxLength={3}
                                            placeholder="•••"
                                            value={cardCvv}
                                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 font-mono text-center text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                                >
                                    Pay ৳{plansDict[selectedPlan] ?? 0}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 7: Processing Loading Screen */}
                    {paymentStep === 'processing' && (
                        <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
                            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2">Verifying Payment</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                                Please do not close this window, refresh the page, or click back. We are validating your transaction securely with the gateway.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};