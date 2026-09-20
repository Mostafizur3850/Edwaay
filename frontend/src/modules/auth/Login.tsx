import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, ArrowRight, User, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, LogIn, UserPlus, KeyRound, Smartphone, Mail } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../../services/firebase';
import { loginUser, sendRegistrationOtp, verifyRegistrationOtp, loginWithSocial } from '../../services/api';

import { useLanguage } from '../../context/LanguageContext';

interface LoginProps {
  onLogin: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 mr-2 shrink-0 fill-white" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  useEffect(() => {
    const checkOfflineParam = async () => {
      const searchParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
      const isOfflineRedirect = searchParams.get('offline') === 'true';
      const { checkBackendStatus } = await import('../../services/api');
      const online = await checkBackendStatus();

      if (isOfflineRedirect || !online) {
        setErrorMsg('⚠️ সার্ভারে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
      }
    };
    checkOfflineParam();
  }, []);
  const location = useLocation();
  const navigate = useNavigate();

  const { language } = useLanguage();
  const lang = language;

  // Check URL query parameters for special admin invite links (e.g. ?role=teacher or ?role=employer)
  const searchParams = new URLSearchParams(location.search);
  const invitedRole = searchParams.get('role'); // 'teacher' | 'employer' | null

  const [isRegistering, setIsRegistering] = useState(location.pathname === '/register');
  const [loginTab, setLoginTab] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [phoneInput, setPhoneInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Status & Logic
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(60);

  // Rate-limiting security state (Prevent brute-force spamming)
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Success Screen State
  const [showSuccess, setShowSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');

  // Translations Object
  const t = {
    bn: {
      login: 'লগইন',
      register: 'রেজিস্টার',
      step: (s: number, total: number) => `ধাপ ${s}/${total}`,
      freeAccountTitle: 'ফ্রি অ্যাকাউন্ট খুলুন',
      loginTitle: 'লগইন করুন',
      freeAccountSub: 'এক মিনিটে ফ্রি অ্যাকাউন্ট খুলে শুরু করুন।',
      loginSub: 'আপনার অ্যাকাউন্টে অ্যাক্সেস করতে প্রবেশ করুন।',
      orWithMobile: 'অথবা মোবাইল / ইমেইল দিয়ে প্রবেশ করুন',
      mobileLabel: 'মোবাইল নম্বর বা ইমেইল ঠিকানা',
      mobilePlaceholder: '017... অথবা yourname@gmail.com লিখুন',
      passwordLabel: 'পাসওয়ার্ড',
      forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
      loginWithPasswordTab: 'পাসওয়ার্ড দিয়ে লগইন',
      loginWithOtpTab: 'OTP দিয়ে লগইন',
      sendOtpBtn: 'OTP পাঠান',
      loginBtn: 'লগইন করুন',
      proceedBtn: 'এগিয়ে যান',
      verifyBtn: 'ভেরিফাই ও সম্পন্ন করুন',
      enterOtpLabel: '৬-ডিজিটের OTP কোড',
      otpCodePlaceholder: '000000',
      fullNameLabel: 'আপনার পুরো নাম',
      fullNamePlaceholder: 'আপনার নাম লিখুন',
      setPasswordLabel: 'একটি নতুন পাসওয়ার্ড সেট করুন',
      codeSentTo: 'কোড পাঠানো হয়েছে',
      resend: 'পুনরায় পাঠান',
      changeNumber: 'তথ্য পরিবর্তন করুন',
      termsNotice: 'এগিয়ে গেলে আপনি টার্মস ও প্রাইভেসি মেনে নিচ্ছেন।',
      terms: 'টার্মস',
      privacy: 'প্রাইভেসি',
      welcome: 'স্বাগতম',
      regSuccess: 'আপনার অ্যাকাউন্ট ভেরিফাই ও তৈরি হয়েছে।',
      loginSuccess: 'সফলভাবে লগইন হয়েছে।',
      redirecting: 'ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...',
      adminTeacherInvite: 'অ্যাডমিন আমন্ত্রণে শিক্ষক রেজিস্ট্রেশন',
      adminEmployerInvite: 'অ্যাডমিন আমন্ত্রণে কোম্পানি/এমপ্লয়ার রেজিস্ট্রেশন',
      processing: 'প্রসেসিং হচ্ছে...',
      verifying: 'যাচাই করা হচ্ছে...',
      invalidPhoneMsg: 'অনুগ্রহ করে আপনার সঠিক মোবাইল নম্বর বা ইমেইল লিখুন।',
      otpFailMsg: 'OTP পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
      otpCodeErr: 'OTP কোড সঠিক নয়। সঠিক কোড দিন।',
      loginCredErr: 'মোবাইল নম্বর বা পাসওয়ার্ড ভুল হয়েছে।'
    },
    en: {
      login: 'Log In',
      register: 'Register',
      step: (s: number, total: number) => `Step ${s}/${total}`,
      freeAccountTitle: 'Create Free Account',
      loginTitle: 'Welcome Back',
      freeAccountSub: 'Create a free account in just one minute.',
      loginSub: 'Enter your credentials to access your account.',
      orWithMobile: 'Or continue with Mobile Number or Email',
      mobileLabel: 'Mobile Number or Email',
      mobilePlaceholder: 'Enter mobile (017...) or email',
      passwordLabel: 'Password',
      forgotPassword: 'Forgot password?',
      loginWithPasswordTab: 'Login with Password',
      loginWithOtpTab: 'Login with OTP',
      sendOtpBtn: 'Send OTP',
      loginBtn: 'Log In',
      proceedBtn: 'Proceed',
      verifyBtn: 'Verify & Complete',
      enterOtpLabel: 'Enter 6-Digit OTP Code',
      otpCodePlaceholder: '000000',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      setPasswordLabel: 'Set a new Password',
      codeSentTo: 'Code sent to',
      resend: 'Resend OTP',
      changeNumber: 'Change Input Details',
      termsNotice: 'By continuing, you agree to our Terms & Privacy policy.',
      terms: 'Terms',
      privacy: 'Privacy',
      welcome: 'Welcome',
      regSuccess: 'Your account has been verified and created.',
      loginSuccess: 'Login successful.',
      redirecting: 'Redirecting to Dashboard...',
      adminTeacherInvite: 'Teacher Registration via Admin Invitation',
      adminEmployerInvite: 'Company/Employer Registration via Admin Invitation',
      processing: 'Processing...',
      verifying: 'Verifying...',
      invalidPhoneMsg: 'Please enter a valid mobile number or email address.',
      otpFailMsg: 'Failed to send OTP. Please try again.',
      otpCodeErr: 'Invalid OTP code. Please enter the correct code.',
      loginCredErr: 'Invalid mobile number or password.'
    }
  };

  const text = t[lang];

  useEffect(() => {
    const isReg = location.pathname === '/register';
    setIsRegistering(isReg);
    setStep(1);
    setErrorMsg(null);
    setSimulatedOtp(null);
  }, [location.pathname]);

  // Timer for OTP countdown
  useEffect(() => {
    let interval: any;
    if (step === 2 && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  // Input Normalizer and Sanitizer
  const getFullIdentifier = () => {
    let raw = phoneInput.trim();
    if (!raw) return '';

    // Security Input Sanitization (Remove HTML tags / dangerous scripts)
    raw = raw.replace(/<[^>]*>?/gm, '');

    // Check if input is Email
    if (raw.includes('@')) {
      return raw.toLowerCase();
    }

    // Phone Number Normalization
    if (raw.startsWith('+88')) return raw.substring(1);
    if (raw.startsWith('8801')) return raw;
    if (raw.startsWith('01')) return `88${raw}`;
    return raw;
  };

  const isEmailInput = phoneInput.trim().includes('@');

  const handleRedirectAfterAuth = (userObj: any) => {
    onLogin();
    const state = location.state as { returnTo?: string } | null;
    if (state?.returnTo) {
      navigate(state.returnTo, { replace: true });
      return;
    }

    const localUser = localStorage.getItem('takeuup_user');
    const user = localUser ? JSON.parse(localUser) : userObj;
    const roleLower = (user?.role || '').toLowerCase();
    const emailLower = (user?.email || '').toLowerCase();
    const nameLower = (user?.name || user?.userName || '').toLowerCase();

    if (roleLower === 'admin' || roleLower === 'localadmin' || emailLower === 'admin@objectcanvas.com' || nameLower === 'mostafizur') {
      navigate('/admin', { replace: true });
    } else if (roleLower === 'employer') {
      navigate('/employer-dashboard', { replace: true });
    } else if (roleLower === 'teacher') {
      navigate('/teacher/workspace', { replace: true });
    } else {
      navigate('/dashboard', { replace: true }); 
    }
  };

  // Live Google / Facebook OAuth Trigger
  const handleSocialLogin = async (provider: 'Google' | 'Facebook') => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const authProvider = provider === 'Google' ? googleProvider : facebookProvider;
      
      const res = await signInWithPopup(auth, authProvider);

      if (res && res.user && res.user.email) {
        const socialEmail = res.user.email;
        const socialName = res.user.displayName || socialEmail.split('@')[0];
        const socialPhoto = res.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(socialName)}&background=0D8ABC&color=fff`;

        const roleToAssign = invitedRole ? invitedRole : 'student';
        const apiRes = await loginWithSocial(provider, socialEmail, socialName, socialPhoto, roleToAssign);

        const cleanName = (apiRes.user.name && !apiRes.user.name.startsWith('8801') && !apiRes.user.name.startsWith('01'))
          ? apiRes.user.name
          : (socialName && !socialName.startsWith('8801') ? socialName : 'Student Member');

        setSuccessName(cleanName);
        setIsLoading(false);
        setShowSuccess(true);

        setTimeout(() => handleRedirectAfterAuth(apiRes.user), 1500);
      } else {
        throw new Error(`${provider} authentication returned no user email.`);
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error(`Firebase ${provider} OAuth error:`, err);

      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('লগইন পপ-আপটি বন্ধ করা হয়েছে। আবার চেষ্টা করুন।');
      } else if (err.code === 'auth/configuration-not-found') {
        setErrorMsg('Firebase Configuration Notice: Firebase Console > Authentication > Sign-in method সেকশনে Google / Facebook প্রোভাইডার ইনেবল (Enable) করা নেই।');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg(`Domain Authorization Error: Current domain (${window.location.hostname}) is not added in Firebase Console > Authentication > Settings > Authorized Domains.`);
      } else if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid') {
        setErrorMsg(`Firebase API Key Error: Please verify Firebase API Key in Admin Panel > Settings.`);
      } else {
        setErrorMsg(err.message || `${provider} OAuth login failed.`);
      }
    }
  };

  // Step 1 Submission: Password Login or Send OTP
  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isLockedOut) {
      setErrorMsg('অনেকবার ভুল চেষ্টা করা হয়েছে। নিরাপত্তার কারণে ৩০ সেকেন্ড পর আবার চেষ্টা করুন। (Rate Limit Protection)');
      return;
    }

    const identifier = getFullIdentifier();
    if (!identifier) {
      setErrorMsg(text.invalidPhoneMsg);
      return;
    }

    setIsLoading(true);

    if (isRegistering) {
      // Registration Step 1 -> Send OTP
      try {
        const roleToAssign = invitedRole ? invitedRole : 'student';
        const res = await sendRegistrationOtp('Student Member', identifier, 'TempPass123!', roleToAssign);
        setIsLoading(false);
        setStep(2);
        setOtpTimer(60);
        if (res && res.otpCode) setSimulatedOtp(res.otpCode);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMsg(err.message || text.otpFailMsg);
      }
    } else {
      // Login Flow
      if (loginTab === 'password') {
        // Direct Password Login
        try {
          const res = await loginUser(identifier, password);
          
          const cleanName = (res.user.name && !res.user.name.startsWith('8801') && !res.user.name.startsWith('01')) 
            ? res.user.name 
            : 'Student Member';

          setSuccessName(cleanName);
          setIsLoading(false);
          setShowSuccess(true);
          setAttemptsCount(0);
          setTimeout(() => handleRedirectAfterAuth(res.user), 1500);
        } catch (err: any) {
          setIsLoading(false);
          setAttemptsCount(prev => {
            const next = prev + 1;
            if (next >= 5) {
              setIsLockedOut(true);
              setTimeout(() => setIsLockedOut(false), 30000); // 30 sec lockout
            }
            return next;
          });
          setErrorMsg(err.message || text.loginCredErr);
        }
      } else {
        // OTP Login Request
        try {
          const roleToAssign = invitedRole ? invitedRole : 'student';
          const res = await sendRegistrationOtp('Existing User', identifier, 'TempPass123!', roleToAssign);
          setIsLoading(false);
          setStep(2);
          setOtpTimer(60);
          if (res && res.otpCode) setSimulatedOtp(res.otpCode);
        } catch (err: any) {
          setIsLoading(false);
          setErrorMsg(err.message || text.otpFailMsg);
        }
      }
    }
  };

  // Step 2 Submission: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const identifier = getFullIdentifier();
    try {
      const roleToAssign = invitedRole ? invitedRole : 'student';
      const userFullName = fullName.trim() || (invitedRole === 'teacher' ? 'Teacher Member' : (invitedRole === 'employer' ? 'Company Recruiter' : 'Student Member'));
      const finalPassword = password.trim() || 'TakeUp@2026';

      const res = await verifyRegistrationOtp(
        userFullName,
        identifier,
        finalPassword,
        otpCode,
        roleToAssign
      );

      const cleanName = (res.user.name && !res.user.name.startsWith('8801') && !res.user.name.startsWith('01')) 
        ? res.user.name 
        : userFullName;

      setSuccessName(cleanName);
      setIsLoading(false);
      setShowSuccess(true);

      setTimeout(() => handleRedirectAfterAuth(res.user), 1500);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || text.otpCodeErr);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-[#faf9f6] dark:bg-slate-950 transition-colors duration-500 relative">
      
      {/* Top Floating Pill Toggle (Login vs Register) */}
      {!showSuccess && (
        <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-slate-200/80 dark:border-slate-800 flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setStep(1);
                setErrorMsg(null);
                navigate('/login');
              }}
              className={`px-7 py-2.5 rounded-full text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                !isRegistering
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn size={15} /> {text.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setStep(1);
                setErrorMsg(null);
                navigate('/register');
              }}
              className={`px-7 py-2.5 rounded-full text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                isRegistering
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus size={15} /> {text.register}
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full max-w-[450px] bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 relative transition-all duration-300">
        
        {/* Success Screen Overlay */}
        {showSuccess ? (
          <div className="text-center animate-in fade-in zoom-in duration-500 py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 size={44} className="text-green-500 animate-bounce" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {text.welcome}, {successName}!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isRegistering ? text.regSuccess : text.loginSuccess}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              {text.redirecting}
            </div>
          </div>
        ) : (
          <>
            {/* Special Role Banner for Admin Invited Links */}
            {invitedRole && (
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl text-xs text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500 shrink-0" />
                <span>
                  {invitedRole === 'teacher' ? text.adminTeacherInvite : text.adminEmployerInvite}
                </span>
              </div>
            )}

            {/* Header Badge & Titles */}
            <div className="mb-3">
              <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full tracking-wide">
                {isRegistering ? text.step(step, 3) : text.step(step, 2)}
              </span>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1.5">
                {isRegistering ? text.freeAccountTitle : text.loginTitle}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                {isRegistering ? text.freeAccountSub : text.loginSub}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center font-medium">
                {errorMsg}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                
                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <GoogleIcon /> Google
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialLogin('Facebook')}
                    className="flex items-center justify-center py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-blue-600 text-white font-extrabold text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <FacebookIcon /> Facebook
                  </button>
                </div>

                {/* Divider Line */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-white dark:bg-slate-900 text-slate-400 text-xs font-medium">
                    {text.orWithMobile}
                  </span>
                </div>

                {/* Dual Sub-Tabs for Login Mode (Password vs OTP) */}
                {!isRegistering && (
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 mb-2">
                    <button
                      type="button"
                      onClick={() => { setLoginTab('password'); setErrorMsg(null); }}
                      className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        loginTab === 'password'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <KeyRound size={14} /> {text.loginWithPasswordTab}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLoginTab('otp'); setErrorMsg(null); }}
                      className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        loginTab === 'otp'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Smartphone size={14} /> {text.loginWithOtpTab}
                    </button>
                  </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmitStep1} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {text.mobileLabel}
                    </label>
                    <div className="flex rounded-2xl border border-indigo-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                      {isEmailInput ? (
                        <div className="bg-indigo-50/80 dark:bg-slate-800 px-3.5 py-3 text-slate-800 dark:text-slate-200 font-extrabold text-sm border-r border-indigo-100 dark:border-slate-700 flex items-center shrink-0">
                          <Mail size={16} className="text-indigo-500" />
                        </div>
                      ) : (
                        <div className="bg-indigo-50/80 dark:bg-slate-800 px-3.5 py-3 text-slate-800 dark:text-slate-200 font-extrabold text-sm border-r border-indigo-100 dark:border-slate-700 flex items-center shrink-0">
                          +88
                        </div>
                      )}
                      <input
                        type="text"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm font-medium"
                        placeholder={text.mobilePlaceholder}
                      />
                    </div>
                  </div>

                  {/* Password Input (only shown when in Password Login tab during Login) */}
                  {!isRegistering && loginTab === 'password' && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          {text.passwordLabel}
                        </label>
                        <a href="#" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">
                          {text.forgotPassword}
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isLoading || isLockedOut}
                    className="w-full py-3.5 rounded-2xl bg-[#3b42f6] hover:bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-60 mt-2"
                  >
                    {isLoading ? text.processing : (
                      isRegistering ? text.proceedBtn : (loginTab === 'password' ? text.loginBtn : text.sendOtpBtn)
                    )} <ArrowRight size={18} />
                  </button>
                </form>

              </div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in slide-in-from-right duration-300">
                {simulatedOtp && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl text-xs flex flex-col gap-1">
                    <span className="font-bold flex items-center gap-1">
                      <ShieldCheck size={14} /> Test Verification Code:
                    </span>
                    <span className="text-base font-mono font-bold tracking-widest text-emerald-800 dark:text-emerald-200">{simulatedOtp}</span>
                  </div>
                )}

                {isRegistering && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{text.fullNameLabel}</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={text.fullNamePlaceholder}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{text.enterOtpLabel}</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-center tracking-[0.5em] font-mono text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={text.otpCodePlaceholder}
                  />
                </div>

                {isRegistering && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{text.setPasswordLabel}</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{text.codeSentTo} {phoneInput}</span>
                  {otpTimer > 0 ? (
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{otpTimer}s</span>
                  ) : (
                    <button type="button" onClick={handleSubmitStep1} className="font-bold text-indigo-600 hover:underline">{text.resend}</button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#3b42f6] hover:bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? text.verifying : text.verifyBtn} <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors pt-2"
                >
                  <ArrowLeft size={12} className="inline mr-1" /> {text.changeNumber}
                </button>
              </form>
            )}

            {/* Terms Footer */}
            <p className="text-center text-[11px] text-slate-400 mt-6 leading-relaxed">
              {text.termsNotice}
            </p>

            <div className="mt-4 text-center">
              <Link to="/admin" className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Admin Portal Access</Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};