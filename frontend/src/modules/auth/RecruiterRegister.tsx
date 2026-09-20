import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Mail, Lock, User, Briefcase, Phone, Globe, MapPin, AlignLeft, ShieldCheck } from 'lucide-react';

interface RecruiterRegisterProps {
  onLogin: () => void;
}

export const RecruiterRegister: React.FC<RecruiterRegisterProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Recruiter Personal Details
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterDesignation, setRecruiterDesignation] = useState('');
  const [recruiterPassword, setRecruiterPassword] = useState('');
  const [recruiterConfirmPassword, setRecruiterConfirmPassword] = useState('');

  // 2. Company Details
  const [companyName, setCompanyName] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('Software & IT');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);

  // 3. OTP States
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isOtpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, otpTimer]);

  const validateStep1 = () => {
    if (!recruiterName || !recruiterDesignation || !recruiterPassword || !recruiterConfirmPassword) {
      setErrorMsg("Please fill in all recruiter details.");
      return false;
    }
    if (recruiterPassword !== recruiterConfirmPassword) {
      setErrorMsg("Passwords do not match.");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep2 = () => {
    if (!companyName || !companyEmail || !companyPhone || !companyAddress) {
      setErrorMsg("Please fill in all required company fields (*).");
      return false;
    }
    if (!companyEmail.trim().toLowerCase().endsWith('@gmail.com') && !companyEmail.includes('.')) {
      setErrorMsg("Please enter a valid corporate email address.");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { sendRegistrationOtp } = await import('../../services/api');
      // Register with the email of the recruiter
      const res = await sendRegistrationOtp(
        recruiterName,
        companyEmail,
        recruiterPassword,
        'Employer'
      );
      setIsLoading(false);
      setIsOtpSent(true);
      setOtpTimer(60);
      if (res && res.otpCode) {
        setSimulatedOtp(res.otpCode);
      } else {
        setSimulatedOtp(null);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to send OTP code. Please try again.');
    }
  };

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { verifyRegistrationOtp, registerCompany, uploadJobCompanyLogo } = await import('../../services/api');
      
      // 1. Verify User OTP and create account
      const regRes = await verifyRegistrationOtp(
        recruiterName,
        companyEmail,
        recruiterPassword,
        otpCode,
        'Employer'
      );

      // 2. Upload Logo if selected
      let logoUrl = '';
      if (companyLogoFile) {
        try {
          const uploadRes = await uploadJobCompanyLogo(companyLogoFile);
          if (uploadRes && uploadRes.url) {
            logoUrl = uploadRes.url;
          }
        } catch (uploadErr) {
          console.error("Failed to upload company logo during signup", uploadErr);
        }
      }

      // 3. Register Company profile linked to Employer
      const companyPayload = {
        name: companyName,
        website: companyWebsite,
        email: companyEmail,
        phone: companyPhone,
        address: companyAddress,
        description: `${recruiterName} (${recruiterDesignation}) - ${companyDesc}`,
        logo: logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`
      };

      try {
        const companyRes = await registerCompany(companyPayload);
        localStorage.setItem('takeuup_my_company', JSON.stringify(companyRes));
      } catch (companyErr) {
        console.warn("API company registration failed, setting simulated profile", companyErr);
        const mockCompany = { id: Date.now().toString(), ...companyPayload, isVerified: false };
        localStorage.setItem('takeuup_my_company', JSON.stringify(mockCompany));
      }

      setIsLoading(false);
      alert("Registration completed successfully! Your recruiter account is ready. Admin will verify your company profile.");
      onLogin(); // Trigger app state update
      navigate('/jobs/search');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Verification failed. Please check OTP code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D1A] text-slate-900 dark:text-white font-sans py-12 px-4 transition-colors duration-350 flex items-center justify-center text-left">
      <div className="w-full max-w-2xl">
        <button onClick={() => navigate('/jobs')} className="inline-flex items-center text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors border-0 bg-transparent cursor-pointer">
          <ArrowLeft size={18} className="mr-1.5" /> Back to Job Portal
        </button>

        <div className="bg-white dark:bg-[#131926] border border-slate-200 dark:border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-300">
          {/* Progress Indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-500" style={{ width: isOtpSent ? '100%' : `${(step / 2) * 100}%` }} />
          </div>

          <div className="mb-6 flex justify-between items-end border-b border-slate-150 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Building className="text-cyan-500" size={24} /> Recruiter Registration Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Join over 10,000+ corporate partners posting jobs.</p>
            </div>
            <div className="text-xs font-bold text-slate-400">Step {isOtpSent ? 'OTP' : step} of 2</div>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 p-4 rounded-xl text-xs font-medium mb-5 animate-in fade-in zoom-in-95 duration-200">
              {errorMsg}
            </div>
          )}

          {!isOtpSent ? (
            <div>
              {/* STEP 1: RECRUITER INFORMATION */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recruiter / Contact Person Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="text" placeholder="e.g. Anisur Rahman" value={recruiterName} onChange={e => setRecruiterName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Designation *</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="text" placeholder="e.g. HR Executive" value={recruiterDesignation} onChange={e => setRecruiterDesignation(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="password" placeholder="••••••••" value={recruiterPassword} onChange={e => setRecruiterPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="password" placeholder="••••••••" value={recruiterConfirmPassword} onChange={e => setRecruiterConfirmPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="button" onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-550 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-md shadow-cyan-900/25 cursor-pointer">
                      Next: Company Information
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: COMPANY INFORMATION */}
              {step === 2 && (
                <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Company Name *</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="text" placeholder="e.g. Brain Station 23" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Industry Sector *</label>
                      <select value={companyIndustry} onChange={e => setCompanyIndustry(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm appearance-none cursor-pointer">
                        <option>Software & IT</option>
                        <option>Banking & Finance</option>
                        <option>Education & E-Learning</option>
                        <option>Healthcare & Biotech</option>
                        <option>Garments & Textile</option>
                        <option>Marketing & Media</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Corporate Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="email" placeholder="hr@company.com" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Website URL</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="url" placeholder="https://company.com" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Corporate Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="tel" placeholder="+8801700000000" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="text" placeholder="e.g. Banani, Dhaka" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">About Company (Brief Description)</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-3 top-3 text-slate-400" size={16} />
                      <textarea rows={3} placeholder="Tell candidates about your company services, core values, or focus..." value={companyDesc} onChange={e => setCompanyDesc(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm resize-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Company Logo File</label>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files && e.target.files[0]) setCompanyLogoFile(e.target.files[0]); }} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20" />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-150 dark:border-slate-800">
                    <button type="button" onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-4 py-2 font-semibold transition-colors border-0 bg-transparent cursor-pointer">
                      Back
                    </button>
                    <button type="submit" disabled={isLoading} className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-555 hover:to-indigo-555 text-white font-bold py-2.5 px-8 rounded-xl text-sm shadow-lg shadow-cyan-900/20 flex items-center gap-1 cursor-pointer">
                      {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* OTP VERIFICATION STEP */
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2 py-4">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-lg font-bold text-white">Verify Corporate Email</h3>
                <p className="text-xs text-slate-400">
                  We have sent a verification code to <strong className="text-white">{companyEmail}</strong>.
                </p>
                {simulatedOtp && (
                  <div className="mt-2.5 inline-block bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-cyan-400">
                    [Sandbox OTP]: {simulatedOtp}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Verification Code *</label>
                <input required type="text" placeholder="Enter 6-digit OTP code" value={otpCode} onChange={e => setOtpCode(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1E2533] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-sm text-center font-mono tracking-widest text-lg" />
              </div>

              <div className="flex justify-between items-center text-xs py-1.5">
                <button type="button" onClick={() => setIsOtpSent(false)} className="text-slate-400 hover:text-white font-semibold transition-colors border-0 bg-transparent cursor-pointer">
                  Edit Registration Info
                </button>
                <button type="button" disabled={otpTimer > 0} onClick={handleSendOtp} className="text-cyan-400 hover:underline disabled:text-slate-500 disabled:no-underline font-semibold cursor-pointer border-0 bg-transparent">
                  {otpTimer > 0 ? `Resend code in ${otpTimer}s` : 'Resend Code'}
                </button>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-555 hover:to-indigo-555 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-cyan-900/20 transition-all flex justify-center items-center gap-1.5 cursor-pointer">
                {isLoading ? 'Verifying...' : 'Complete Recruiter Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
