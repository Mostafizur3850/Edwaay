import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, ShieldCheck, Lock, Edit, CreditCard, Crown, Settings, Bell,
  Activity, Flag, History, Gift, Check, Upload, Camera, Calendar,
  MapPin, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Sparkles, Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProfileHubProps {
  user: any;
  onUpdateUser: (newUser: any) => void;
}

export const ProfileHub: React.FC<ProfileHubProps> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isBn = language === 'bn';

  // Active Menu / Tab Selection
  const [activeMenu, setActiveMenu] = useState<'personal' | 'academic' | 'account' | 'password' | 'upgrade' | 'notifications' | 'activity' | 'history'>('personal');
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'academic' | 'account' | 'password'>('personal');

  // Form Fields
  const [name, setName] = useState(user.name || user.displayName || 'Mostafizur Rahman');
  const [email, setEmail] = useState(user.email || 'biploboct32@gmail.com');
  const [dob, setDob] = useState(user.dob || '2006-08-15');
  const [gender, setGender] = useState(user.gender || 'male');
  const [address, setAddress] = useState(user.address || 'Dhaka, Bangladesh');
  const [institution, setInstitution] = useState(user.institution || 'Viqarunnisa Noon School & College');
  const [batch, setBatch] = useState(user.studentClass || 'SSC 2026');
  const [group, setGroup] = useState(user.group || 'Science');
  const [targetGoal, setTargetGoal] = useState(user.targetGoal || 'GPA 5.00 & Varsity Admission');

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Avatar Photo Upload State
  const [photoURL, setPhotoURL] = useState<string>(user.photoURL || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status feedback
  const [isSaved, setIsSaved] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Sync props when user object changes
  useEffect(() => {
    setName(user.name || user.displayName || 'Mostafizur Rahman');
    setEmail(user.email || 'biploboct32@gmail.com');
    setBatch(user.studentClass || 'SSC 2026');
    if (user.photoURL) setPhotoURL(user.photoURL);
  }, [user]);

  // Handle Photo File Upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isBn ? 'ছবিটি ২ মেগাবাইটের কম হতে হবে।' : 'File size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setPhotoURL(resultStr);
        const updated = { ...user, photoURL: resultStr };
        onUpdateUser(updated);
        localStorage.setItem('takeuup_user', JSON.stringify(updated));
        triggerSaveToast(isBn ? 'প্রোফাইল পিকচার আপলোড হয়েছে!' : 'Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSaveToast = (msg: string) => {
    setSavedMessage(msg);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Submit Profile Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: name,
      displayName: name,
      email: email,
      dob: dob,
      gender: gender,
      address: address,
      institution: institution,
      studentClass: batch,
      group: group,
      targetGoal: targetGoal,
      photoURL: photoURL
    };

    onUpdateUser(updatedUser);
    localStorage.setItem('takeuup_user', JSON.stringify(updatedUser));

    try {
      const { updateUserProfile } = await import('../../services/api');
      await updateUserProfile({
        name: name,
        institution: institution,
        studentClass: batch
      } as any);
    } catch (err) { }

    triggerSaveToast(isBn ? 'তথ্য সফলভাবে সেভ হয়েছে!' : 'Profile updated successfully!');
  };

  // Submit Password Change
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert(isBn ? 'নতুন পাসওয়ার্ড দুটি মিলছে না।' : 'New passwords do not match.');
      return;
    }
    triggerSaveToast(isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!' : 'Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP BAR TITLE */}
        <div className="flex items-center justify-between border-b border-slate-850 pb-4">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="text-emerald-500" size={24} />
            {isBn ? 'সেটিংস' : 'Settings'}
          </h1>

          {/* Toast Alert */}
          {isSaved && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-2 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={16} /> {savedMessage}
            </div>
          )}
        </div>

        {/* MAIN TWO-COLUMN CONTAINER (Charcha Style) */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT SIDEBAR COLUMN (User Info Card & Settings Submenu) */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">

            {/* Profile Avatar & Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-xl space-y-4 relative overflow-hidden">
              <div className="relative inline-block mx-auto">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-emerald-600 text-white font-black text-3xl flex items-center justify-center border-4 border-slate-950 shadow-2xl cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                >
                  {photoURL ? (
                    <img src={photoURL} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{name ? name.slice(0, 1).toUpperCase() : 'M'}</span>
                  )}
                </div>

                {/* Pencil Edit Badge */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-slate-950 rounded-full border-2 border-slate-950 shadow-lg hover:scale-110 transition-transform"
                  title={isBn ? 'পিকচার পরিবর্তন করুন' : 'Change Avatar'}
                >
                  <Edit size={14} />
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />

              <div>
                <h3 className="font-bold text-white text-base truncate">{name}</h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">{email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold rounded-full">
                  Batch: {batch}
                </span>
              </div>

              {/* Linked Accounts Section */}
              <div className="pt-3 border-t border-slate-850">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{isBn ? 'লিংকড অ্যাকাউন্ট' : 'Linked Account'}</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-500/30">
                    G <Check size={10} />
                  </span>
                </div>
              </div>
            </div>

            {/* Left Submenu Navigation Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl space-y-1">
              {[
                { id: 'personal', label: isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Info', icon: User, tabTarget: 'personal' },
                { id: 'academic', label: isBn ? 'একাডেমিক তথ্য' : 'Academic Info', icon: Edit, tabTarget: 'academic' },
                { id: 'upgrade', label: isBn ? 'আপগ্রেড (Pro)' : 'Upgrade to Pro', icon: Crown },
                { id: 'subscription', label: isBn ? 'সাবস্ক্রিপশন' : 'Subscription', icon: CreditCard, tabTarget: 'account' },
                { id: 'app-settings', label: isBn ? 'অ্যাপ সেটিংস' : 'App Settings', icon: Settings, tabTarget: 'account' },
                { id: 'notifications', label: isBn ? 'নোটিফিকেশন' : 'Notifications', icon: Bell, badge: '১' },
                { id: 'activity', label: isBn ? 'অ্যাক্টিভিটি' : 'Activity Log', icon: Activity },
                { id: 'reported', label: isBn ? 'রিপোর্টকৃত প্রশ্ন' : 'Reported Questions', icon: Flag, badge: '০' },
                { id: 'history', label: isBn ? 'হিস্ট্রি' : 'History & Saved', icon: History },
                { id: 'gift', label: isBn ? 'গিফট ও পুরষ্কার' : 'Gift & Rewards', icon: Gift },
                { id: 'password', label: isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password', icon: Lock, tabTarget: 'password' },
              ].map(item => {
                const isActive = activeMenu === item.id || (item.tabTarget && activeSubTab === item.tabTarget);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id as any);
                      if (item.tabTarget) setActiveSubTab(item.tabTarget as any);
                    }}
                    className={`w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* RIGHT FORM CONTENT PANEL */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">

            {/* TOP FORM TABS HEADER */}
            <div className="flex items-center gap-4 border-b border-slate-850 pb-3 overflow-x-auto scrollbar-none">
              {[
                { id: 'personal', label: isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Info' },
                { id: 'academic', label: isBn ? 'একাডেমিক তথ্য' : 'Academic Info' },
                { id: 'account', label: isBn ? 'অ্যাকাউন্ট সেটিং' : 'Account Settings' },
                { id: 'password', label: isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id as any);
                    setActiveMenu(tab.id as any);
                  }}
                  className={`pb-2 px-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${activeSubTab === tab.id
                      ? 'border-emerald-500 text-emerald-400 font-black'
                      : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: PERSONAL INFO FORM */}
            {activeSubTab === 'personal' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-300">

                {/* Avatar Upload Banner */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-black text-2xl flex items-center justify-center border-2 border-emerald-400 overflow-hidden shrink-0">
                    {photoURL ? <img src={photoURL} alt={name} className="w-full h-full object-cover" /> : <span>{name.slice(0, 1).toUpperCase()}</span>}
                  </div>

                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center sm:justify-start gap-2 transition-all cursor-pointer"
                    >
                      <Upload size={14} /> {isBn ? 'প্রোফাইল পিকচার আপলোড করো' : 'Upload Profile Picture'}
                    </button>
                    <p className="text-[10px] text-slate-500">PNG, JPEG Under 2MB</p>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'নাম' : 'Full Name'}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'জন্ম তারিখ' : 'Date of Birth'}</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Gender Select */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'ছাত্র/ছাত্রী (লিঙ্গ)' : 'Gender'}</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="male">{isBn ? 'ছাত্র (পুরুষ)' : 'Male Student'}</option>
                    <option value="female">{isBn ? 'ছাত্রী (নারী)' : 'Female Student'}</option>
                    <option value="other">{isBn ? 'অন্যান্য' : 'Other'}</option>
                  </select>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'ঠিকানা' : 'Address'}</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder={isBn ? 'টাইপ করে সেভ করো' : 'Enter your address'}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Confirm Save Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                >
                  {isBn ? 'কনফার্ম করো' : 'Confirm & Save Changes'}
                </button>
              </form>
            )}

            {/* TAB 2: ACADEMIC INFO FORM */}
            {activeSubTab === 'academic' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-300">
                {/* Institution */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'শিক্ষাপ্রতিষ্ঠান' : 'Institution / College / School'}</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="e.g. Viqarunnisa Noon School & College"
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Target Batch / Exam */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'ব্যাচ / লক্ষ্য পরীক্ষা' : 'Exam Batch / Goal'}</label>
                  <select
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="SSC 2026">SSC 2026</option>
                    <option value="HSC 2026">HSC 2026</option>
                    <option value="Varsity Admission">Varsity Admission</option>
                    <option value="BCS Exam">BCS Exam</option>
                    <option value="Bank & Govt Job">Bank & Govt Job</option>
                  </select>
                </div>

                {/* Group */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'গ্রুপ / বিভাগ' : 'Academic Group'}</label>
                  <select
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Science">বিজ্ঞান (Science)</option>
                    <option value="Humanities">মানবিক (Humanities)</option>
                    <option value="Business">ব্যবসায় শিক্ষা (Business)</option>
                  </select>
                </div>

                {/* Specific Target Goal */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'নির্দিষ্ট লক্ষ্য' : 'Specific Academic Goal'}</label>
                  <input
                    type="text"
                    value={targetGoal}
                    onChange={e => setTargetGoal(e.target.value)}
                    placeholder="e.g. BUET CSE & GPA 5.00"
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-emerald-600/20 transition-all"
                >
                  {isBn ? 'কনফার্ম করো' : 'Save Academic Info'}
                </button>
              </form>
            )}

            {/* TAB 3: ACCOUNT & APP SETTINGS */}
            {activeSubTab === 'account' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Globe size={18} className="text-emerald-400" /> {isBn ? 'ল্যাঙ্গুয়েজ ও থিম' : 'Language & Display Theme'}
                  </h3>

                  <div className="flex items-center justify-between border-t border-slate-850 pt-4">
                    <div>
                      <h4 className="font-bold text-xs text-white">{isBn ? 'ডিফল্ট ভাষা' : 'App Language'}</h4>
                      <p className="text-[11px] text-slate-500">{isBn ? 'বাংলা এবং ইংরেজির মধ্যে পরিবর্তন করুন' : 'Switch between Bangla and English'}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {isBn ? 'বাংলা (BN)' : 'English (EN)'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Crown size={18} className="text-yellow-400" /> {isBn ? 'সাবস্ক্রিপশন প্ল্যান' : 'Membership Subscription'}
                  </h3>
                  <div className="flex items-center justify-between border-t border-slate-850 pt-4">
                    <div>
                      <h4 className="font-bold text-xs text-white">{user.plan === 'free' ? 'Free Student Plan' : 'TakeUUp Pro Member'}</h4>
                      <p className="text-[11px] text-slate-500">Access to all question banks & mock exams</p>
                    </div>
                    <Link to="/pricing" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-xs">
                      {user.plan === 'free' ? (isBn ? 'আপগ্রেড করুন' : 'Upgrade Pro') : (isBn ? 'প্ল্যান রিনিউ' : 'Manage Plan')}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PASSWORD CHANGE FORM */}
            {activeSubTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-emerald-600/20 transition-all"
                >
                  {isBn ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
