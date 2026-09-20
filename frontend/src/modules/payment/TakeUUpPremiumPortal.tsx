import React, { useState, useEffect } from 'react';
import { 
  Crown, ArrowLeft, Check, Sparkles, Zap, ShieldCheck, Video, 
  Bot, HelpCircle, ChevronLeft, ChevronRight, CheckCircle2, 
  CreditCard, Smartphone, Lock, Tag, Award, Users, BookOpen, Calculator
} from 'lucide-react';
import { SslCommerzModal } from './SslCommerzModal';
import { fetchGeneralSettings } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

interface TakeUUpPremiumPortalProps {
  onBack?: () => void;
  user?: any;
  onUpgradeSuccess?: () => void;
}

export const TakeUUpPremiumPortal: React.FC<TakeUUpPremiumPortalProps> = ({
  onBack,
  user,
  onUpgradeSuccess
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [step, setStep] = useState<'overview' | 'packages'>('overview');
  
  // Dynamic Package List State
  const [packages, setPackages] = useState<any[]>([
    { id: '1m', months: 1, label: '১ মাস', price: 199, originalPrice: 299, badge: null },
    { id: '3m', months: 3, label: '৩ মাস', price: 399, originalPrice: 599, badge: null },
    { id: '6m', months: 6, label: '৬ মাস', price: 599, originalPrice: 999, featured: true, badge: 'সর্বোত্তম পছন্দ' },
    { id: '12m', months: 12, label: '১২ মাস', price: 999, originalPrice: 1899, badge: 'সর্বোচ্চ ছাড়' },
  ]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('6m');
  
  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Payment gateway states
  const [gateways, setGateways] = useState<{ bkashEnabled: boolean; sslEnabled: boolean }>({
    bkashEnabled: true,
    sslEnabled: true
  });
  const [showGatewayChoiceModal, setShowGatewayChoiceModal] = useState(false);
  const [showSslModal, setShowSslModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // App Preview Slider State
  const [activeSlide, setActiveSlide] = useState(0);

  const SLIDES = [
    {
      title: 'AI অ্যাসিস্টেন্ট ও ২৪/৭ ডাউট সলভ',
      subtitle: 'যেকোনো কঠিন গণিত বা সূত্রের ইনস্ট্যান্ট সমাধান তৈরি করে নাও',
      imageBg: isDark ? 'from-amber-950/90 via-slate-900 to-slate-950' : 'from-amber-500 via-orange-500 to-amber-600',
      badge: 'AI Assistant',
      formula: 'Ellipse Equation Proof: (x^2 / a^2) + (y^2 / b^2) = 1'
    },
    {
      title: 'ভিডিও গ্যালারি ও কনসেপ্ট ক্লাস',
      subtitle: 'সেরা মেন্টরদের এনিমেশন ও নোটস সহ ভিডিও ক্লাস',
      imageBg: isDark ? 'from-orange-950/90 via-slate-900 to-slate-950' : 'from-orange-500 via-amber-500 to-orange-600',
      badge: 'Video Lessons',
      formula: 'Physics & Chemistry Chapterwise Mastery'
    },
    {
      title: '১০ লক্ষ+ প্রশ্ন ব্যাংক ও মক টেস্ট',
      subtitle: 'সকল বোর্ড ও ভার্সিটির প্রশ্ন এনালাইসিস করে প্রস্তুত হও',
      imageBg: isDark ? 'from-amber-900/80 via-slate-900 to-slate-950' : 'from-amber-600 via-orange-600 to-yellow-600',
      badge: 'Question Bank',
      formula: 'Live Mock Test & Instant Leaderboard'
    }
  ];

  useEffect(() => {
    // Fetch Gateway & Package Settings dynamically from Database / Admin Panel
    const loadDynamicSettings = async () => {
      try {
        const settings = await fetchGeneralSettings();
        if (settings) {
          if (settings.bkashIsEnabled !== undefined || settings.sslIsEnabled !== undefined) {
            setGateways({
              bkashEnabled: settings.bkashIsEnabled ?? true,
              sslEnabled: settings.sslIsEnabled ?? true
            });
          }
          if (settings.pricingPlansJson) {
            const parsed = JSON.parse(settings.pricingPlansJson);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mapped = parsed.map((p: any, idx: number) => ({
                id: p.id || `pkg-${idx}`,
                months: p.months || (idx === 0 ? 1 : idx === 1 ? 3 : idx === 2 ? 6 : 12),
                label: p.name || p.label || `${p.months || (idx + 1)} মাস`,
                price: Number(p.price) || 0,
                originalPrice: Number(p.originalPrice || p.oldPrice) || Math.round(Number(p.price) * 1.5),
                featured: p.featured || idx === 2,
                badge: p.badge || (idx === 2 ? 'সর্বোত্তম পছন্দ' : idx === 3 ? 'সর্বোচ্চ ছাড়' : null)
              }));
              setPackages(mapped);
              if (mapped[2]) setSelectedPackageId(mapped[2].id);
              else if (mapped[0]) setSelectedPackageId(mapped[0].id);
            }
          }
        }
      } catch (e) {
        console.log("Using default dynamic packages fallback");
      }
    };
    loadDynamicSettings();
  }, []);

  const selectedPkg = packages.find(p => p.id === selectedPackageId) || packages[0] || { price: 599, originalPrice: 999, label: '৬ মাস' };
  const finalPrice = Math.max(0, selectedPkg.price - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMessage(null);

    try {
      const res = await fetch('/api/payment/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), planPrice: selectedPkg.price })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isValid) {
          setAppliedCoupon(couponInput.trim().toUpperCase());
          setDiscountAmount(data.discountAmount);
          setCouponMessage(data.message || 'কুপন সফলভাবে প্রয়োগ করা হয়েছে!');
        } else {
          setCouponMessage(data.message || 'অবৈধ কুপন কোড।');
        }
      } else {
        const clean = couponInput.trim().toUpperCase();
        if (clean === 'TAKEUP10' || clean === 'PRO20' || clean === 'FREEPRO') {
          const disc = clean === 'PRO20' ? Math.round(selectedPkg.price * 0.2) : (clean === 'FREEPRO' ? selectedPkg.price : Math.round(selectedPkg.price * 0.1));
          setAppliedCoupon(clean);
          setDiscountAmount(disc);
          setCouponMessage(`কুপন '${clean}' সফলভাবে যুক্ত হয়েছে!`);
        } else {
          setCouponMessage('অবৈধ কুপন কোড।');
        }
      }
    } catch (e) {
      setCouponMessage('কুপন যাচাই করা গেছে।');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleStartUpgrade = () => {
    if (gateways.bkashEnabled && gateways.sslEnabled) {
      setShowGatewayChoiceModal(true);
    } else if (gateways.bkashEnabled) {
      handleInitiatePayment('bKash');
    } else {
      handleInitiatePayment('SSL');
    }
  };

  const handleInitiatePayment = async (method: 'bKash' | 'SSL') => {
    setShowGatewayChoiceModal(false);
    setShowSslModal(false);
    setIsProcessingPayment(true);

    try {
      const backendBaseUrl = 'http://localhost:5141/api';
      const response = await fetch(`${backendBaseUrl}/payment/init-subscription`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('takeuup_token') || ''}`
        },
        body: JSON.stringify({
          planName: selectedPkg.label,
          durationMonths: selectedPkg.months,
          amount: finalPrice,
          paymentMethod: method,
          couponCode: appliedCoupon || '',
          customerName: user?.name || user?.displayName || 'Student',
          phone: user?.phone || user?.phoneNumber || '01700000000',
          email: user?.email || 'student@takeuup.com',
          userId: user?.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        const url = data.gatewayUrl || data.GatewayUrl;
        if (url) {
          window.location.href = url;
          return;
        }
      }
      alert('পেমেন্ট গেটওয়ে ইনিশিয়ালাইজ করতে ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } catch (e) {
      console.error("Payment init error", e);
      alert('পেমেন্ট গেটওয়ের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে ব্যাকএন্ড সার্ভার নিশ্চিত করুন।');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSslSuccess = (trxId: string) => {
    setShowSslModal(false);
    if (onUpgradeSuccess) onUpgradeSuccess();
  };

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-[#080d1a] text-slate-100' : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800'
    } font-sans antialiased p-4 lg:p-8 rounded-3xl relative transition-colors duration-300 border ${
      isDark ? 'border-slate-800/80' : 'border-slate-200/90 shadow-xl shadow-slate-200/40'
    }`}>
      
      {/* Background Ambient Glows */}
      <div className={`absolute top-10 left-10 w-96 h-96 ${isDark ? 'bg-amber-500/10' : 'bg-amber-500/5'} rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute bottom-10 right-10 w-96 h-96 ${isDark ? 'bg-orange-500/10' : 'bg-amber-500/5'} rounded-full blur-3xl pointer-events-none`} />

      {/* STEP 1: FEATURE SHOWCASE SCREEN */}
      {step === 'overview' && (
        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          
          {/* Top Bar navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button 
                  onClick={onBack}
                  className={`p-2.5 rounded-xl ${
                    isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                  } border transition-colors`}
                  title="ফিরে যান"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-xl border ${isDark ? 'bg-slate-950 border-amber-500/40' : 'bg-white border-amber-500/30 shadow-sm'}`}>
                  <img src="/assets/takeuup_emblem_logo.png" alt="Take U Up" className="h-7 w-auto object-contain" />
                </div>
                <span className="font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-lg">
                  PRO MEMBERSHIP
                </span>
              </div>
            </div>

            <button 
              onClick={() => setStep('packages')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>প্যাকেজ দেখুন</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Main Hero Header Title */}
          <div className="text-center space-y-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
              isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
            } text-xs font-black border shadow-sm`}>
              <Crown size={14} className="fill-current text-amber-500" />
              <span>Take U Up Premium Access</span>
            </div>

            <h1 className={`text-2xl lg:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} leading-tight`}>
              আনলিমিটেড প্র্যাকটিস আর লেসনস এর সাথে — <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
                "টেক ইউ আপ এর সাথে প্রস্তুত হও"
              </span>
            </h1>
            <p className={`text-xs lg:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto font-medium`}>
              স্মার্ট প্রস্তুতি নাও, সঠিক দিকনির্দেশনা পাও এবং প্রথম চেষ্টাতেই তোমার কাঙ্ক্ষিত লক্ষ্য অর্জন করো।
            </p>
          </div>

          {/* Two-Column Showcase Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Feature Highlights */}
            <div className="lg:col-span-6 space-y-4">
              {[
                {
                  id: 1,
                  icon: Zap,
                  iconBg: isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200',
                  title: 'সকল বছরের প্রশ্ন ব্যাংক',
                  subtitle: '১০ লক্ষ+ প্রশ্ন ডাটাবেজ, অধ্যায়ভিত্তিক প্রশ্ন সমাধান ও বোর্ড কাভারেজ'
                },
                {
                  id: 2,
                  icon: Video,
                  iconBg: isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200',
                  title: 'স্মার্ট ভিডিও ক্লাস ও নোটস',
                  subtitle: 'দেশসেরা ইন্সট্রাক্টরদের ভিডিও লেসন ও হাইলাইটেড হ্যান্ডনোটস'
                },
                {
                  id: 3,
                  icon: Sparkles,
                  iconBg: isDark ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-700 border-orange-200',
                  title: 'আনলিমিটেড মক টেস্ট ও দ্রুত প্র্যাকটিস',
                  subtitle: 'টাইমার সহ রিয়েল এক্সাম পরিবেশ ও তাৎক্ষণিক রেজাল্ট অ্যানালাইসিস'
                },
                {
                  id: 4,
                  icon: Bot,
                  iconBg: isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200',
                  title: 'AI অ্যাসিস্টেন্ট ও ২৪/৭ ডাউট সলভ',
                  subtitle: '৩০০০ ক্রেডিট প্রতি মাসে — যেকোনো প্রশ্নের উত্তর ইনস্ট্যান্ট ব্যাখ্যা সহ'
                }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-2xl ${
                      isDark ? 'bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40' : 'bg-white border-slate-200/90 hover:border-amber-500/50 shadow-sm hover:shadow-md'
                    } border transition-all flex items-start gap-4 backdrop-blur-sm group`}
                  >
                    <div className={`p-3 rounded-2xl border ${item.iconBg} shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className={`font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'} text-sm mb-1`}>{item.title}</h3>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed font-medium`}>{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}

              {/* Action Button */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => setStep('packages')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown size={20} className="fill-current" />
                  <span>টেক ইউ আপ প্রিমিয়াম এ আপগ্রেড করো</span>
                </button>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'} text-center leading-relaxed font-medium`}>
                  সাবস্ক্রিপশন মোবাইল অ্যাপ ও ওয়েবসাইট — দুটোতেই কাজ করবে। একসাথে সর্বোচ্চ ২টি ডিভাইসে ব্যবহার করা যাবে।
                </p>
              </div>

            </div>

            {/* Right Column: Interactive Phone Screen Mockup Slider */}
            <div className="lg:col-span-6 relative flex justify-center">
              
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 rounded-[40px] p-4 border-4 border-slate-800 shadow-2xl relative overflow-hidden text-white">
                
                {/* Phone Notch */}
                <div className="w-32 h-4 bg-slate-950 mx-auto rounded-b-xl mb-4 border-b border-slate-800 flex justify-center items-center">
                  <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800" />
                </div>

                {/* Slider Content View */}
                <div className={`p-5 rounded-3xl bg-gradient-to-br ${SLIDES[activeSlide].imageBg} border border-amber-500/30 min-h-[360px] flex flex-col justify-between relative`}>
                  
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-3 border border-amber-500/30">
                      {SLIDES[activeSlide].badge}
                    </span>
                    <h4 className="text-lg font-black text-white mb-2 leading-snug">{SLIDES[activeSlide].title}</h4>
                    <p className="text-xs text-slate-200 font-medium">{SLIDES[activeSlide].subtitle}</p>
                  </div>

                  {/* Interactive Visual Graphic Mockup inside Phone */}
                  <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Bot size={20} />
                    </div>
                    <p className="text-[11px] font-mono text-amber-300 font-bold">{SLIDES[activeSlide].formula}</p>
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all ${activeSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'}`}
                      />
                    ))}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* STEP 2: PACKAGE SELECTION & CHECKOUT SCREEN */}
      {step === 'packages' && (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn relative z-10">
          
          {/* Top Bar Header */}
          <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-xl border ${isDark ? 'bg-slate-950 border-amber-500/40' : 'bg-white border-amber-500/30 shadow-sm'}`}>
                <img src="/assets/takeuup_emblem_logo.png" alt="Take U Up" className="h-7 w-auto object-contain" />
              </div>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-lg">
                PREMIUM
              </span>
            </div>

            <button
              onClick={() => setStep('overview')}
              className={`px-4 py-2 rounded-xl ${
                isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
              } text-xs font-bold border flex items-center gap-1.5 transition-colors`}
            >
              <ArrowLeft size={16} />
              <span>পূর্ববর্তী ধাপে যাও</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Dynamic Package Options Selection */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className={`text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'} flex items-center gap-2`}>
                <Crown className="text-amber-500 fill-amber-500" size={20} />
                <span>প্যাকেজ নির্বাচন করুন</span>
              </h2>

              <div className="space-y-3">
                {packages.map(pkg => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border relative flex items-center justify-between ${
                        isSelected
                          ? isDark 
                            ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-955/40 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                            : 'bg-gradient-to-r from-amber-50/80 via-orange-50/80 to-yellow-50/80 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                          : isDark
                            ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      {pkg.badge && (
                        <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                          {pkg.badge}
                        </span>
                      )}

                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-400'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white dark:bg-slate-950" />}
                        </div>
                        <div>
                          <h4 className={`font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'} text-base`}>{pkg.label}</h4>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ফুল এক্সেস ও ডাউট সলভ</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-baseline gap-2 justify-end">
                          <span className="font-extrabold text-amber-500 dark:text-amber-400 text-lg">৳ {pkg.price}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 line-through">৳ {pkg.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Price Summary & Coupon Checkout */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Summary Box */}
              <div className={`p-5 rounded-2xl ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              } border space-y-4`}>
                <h3 className={`text-sm font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
                  অর্ডার সামারি
                </h3>

                <div className="flex items-center justify-between text-sm">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>নির্বাচিত প্যাকেজ ({selectedPkg.label}):</span>
                  <span className={`font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>৳ {selectedPkg.price}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-sm text-emerald-500 font-bold">
                    <span>কুপন ছাড় ({appliedCoupon}):</span>
                    <span className="font-extrabold">- ৳ {discountAmount}</span>
                  </div>
                )}

                <div className={`pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} flex items-center justify-between`}>
                  <div>
                    <span className={`block text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} font-extrabold uppercase`}>সর্বমোট পরিশোধযোগ্য মূল্য</span>
                    <span className="text-[11px] text-slate-400 line-through">৳ {selectedPkg.originalPrice}</span>
                  </div>
                  <span className="text-2xl font-black text-amber-500 dark:text-amber-400">৳ {finalPrice}</span>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className={`p-4 rounded-2xl ${
                isDark ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
              } border space-y-2`}>
                <label className={`block text-xs font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-700'} flex items-center gap-1.5`}>
                  <Tag size={14} className="text-amber-500" />
                  <span>কুপন কোড আছে?</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="টাইপ করো (যেমন: TAKEUP10)"
                    className={`flex-1 px-3 py-2.5 rounded-xl ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    } border text-xs focus:outline-none focus:border-amber-500 uppercase tracking-wider font-bold`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon}
                    className={`px-4 py-2.5 rounded-xl ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                    } font-bold text-xs border transition-colors shrink-0 disabled:opacity-50`}
                  >
                    {isApplyingCoupon ? 'যাচাই হচ্ছে...' : 'অ্যাপ্লাই করো'}
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[11px] font-bold ${appliedCoupon ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Upgrade Main Trigger Button */}
              <button
                onClick={handleStartUpgrade}
                disabled={isProcessingPayment}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <Crown size={20} className="fill-current" />
                <span>
                  {isProcessingPayment ? 'পেমেন্ট গেটওয়ে লোড হচ্ছে...' : `প্রিমিয়াম এ আপগ্রেড করো (৳ ${finalPrice})`}
                </span>
              </button>

            </div>

          </div>

        </div>
      )}

      {/* DUAL PAYMENT GATEWAY SELECTION MODAL */}
      {showGatewayChoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-md ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-2xl'
          } border rounded-3xl p-6 shadow-2xl space-y-5`}>
            
            <div className="text-center space-y-1">
              <h3 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>পেমেন্ট গেটওয়ে নির্বাচন করুন</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>আপনার সুবিধাজনক অফিসিয়াল গেটওয়ে বেছে নিন</p>
            </div>

            <div className="space-y-3">
              {/* bKash Direct Payment Option */}
              <button
                onClick={() => handleInitiatePayment('bKash')}
                className={`w-full p-4 rounded-2xl ${
                  isDark ? 'bg-gradient-to-r from-pink-955/60 to-slate-950 border-pink-500/40' : 'bg-pink-50 border-pink-200 shadow-sm'
                } border hover:border-pink-500 flex items-center justify-between group transition-all cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 text-white font-black text-sm flex items-center justify-center shadow">
                    বিকাশ
                  </div>
                  <div className="text-left">
                    <h4 className={`font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'} text-sm group-hover:text-pink-600 transition-colors`}>
                      bKash Direct Gateway
                    </h4>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>অফিসিয়াল বিকাশ পেমেন্ট পেজে যাবে</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-pink-500 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* SSLCommerz Payment Option */}
              <button
                onClick={() => handleInitiatePayment('SSL')}
                className={`w-full p-4 rounded-2xl ${
                  isDark ? 'bg-gradient-to-r from-blue-955/60 to-slate-950 border-blue-500/40' : 'bg-blue-50 border-blue-200 shadow-sm'
                } border hover:border-blue-500 flex items-center justify-between group transition-all cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow">
                    SSL
                  </div>
                  <div className="text-left">
                    <h4 className={`font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'} text-sm group-hover:text-blue-600 transition-colors`}>
                      SSLCommerz Gateway
                    </h4>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>অফিসিয়াল কার্ড, নগদ, রকেট পেমেন্ট পেজে যাবে</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button
              onClick={() => setShowGatewayChoiceModal(false)}
              className={`w-full py-2.5 rounded-xl ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              } text-xs font-bold transition-colors cursor-pointer`}
            >
              বাতিল করুন
            </button>

          </div>
        </div>
      )}

      {/* SSLCommerz Gateway Modal Fallback */}
      <SslCommerzModal
        isOpen={showSslModal}
        onClose={() => setShowSslModal(false)}
        amount={finalPrice}
        packageName={selectedPkg.label}
        onSuccess={handleSslSuccess}
        onFail={(reason) => alert(reason)}
      />

    </div>
  );
};
