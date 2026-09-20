import React, { useState } from 'react';
import { X, User, GraduationCap, Target, Phone, MapPin, Sparkles, Check, Trash2 } from 'lucide-react';
import { User as UserType } from '../../../types/types';
import { useTheme } from '../../../context/ThemeContext';

interface StudentProfileEditModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (newUser: UserType) => void;
}

export const StudentProfileEditModal: React.FC<StudentProfileEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [displayName, setDisplayName] = useState(user.displayName || user.name || '');
  const [studentClass, setStudentClass] = useState(user.studentClass || 'HSC');
  const [institution, setInstitution] = useState(user.institution || '');
  const [targetGoal, setTargetGoal] = useState(user.targetGoal || 'BUET Admission & HSC 5.00');
  const [bio, setBio] = useState(user.bio || 'Passionate learner aiming for top academic & career goals.');
  const [phone, setPhone] = useState(user.phone || '');
  const [location, setLocation] = useState(user.location || 'Dhaka, Bangladesh');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: any = {
      ...user,
      name: displayName,
      displayName: displayName,
      studentClass,
      institution,
      targetGoal,
      bio,
      phone,
      location,
      photoURL: photoURL || user.photoURL
    };

    localStorage.setItem('takeuup_user', JSON.stringify(updatedUser));
    onUpdateUser(updatedUser);
    onClose();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে অ্যাকাউন্ট ডিলিট করতে চান? এই প্রক্রিয়াটি আর ফিরিয়ে আনা যাবে না!')) {
      localStorage.removeItem('takeuup_user');
      window.location.href = '/register';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className={`relative w-full max-w-xl ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
      } border rounded-3xl p-6 lg:p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-left`}>
        
        <div className={`flex items-center justify-between border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-4 mb-6`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Personal Student Profile</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your academic bio, target goal & personal details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'} rounded-full transition-colors`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-1 custom-scrollbar">
          {/* Profile Picture Upload & Avatar Preview */}
          <div className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} p-4 rounded-2xl border flex items-center gap-4`}>
            <img
              src={photoURL || `https://ui-avatars.com/api/?name=${displayName || 'Student'}&background=random`}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-2xl border-2 border-cyan-500/40 object-cover shrink-0"
            />
            <div className="space-y-1.5 flex-1">
              <label className={`block ${isDark ? 'text-slate-300' : 'text-slate-700'} font-bold text-xs`}>Profile Picture</label>
              <div className="flex items-center gap-2">
                <label className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition-all shadow-md">
                  Upload New Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          if (uploadEvent.target?.result) {
                            setPhotoURL(uploadEvent.target.result as string);
                          }
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </label>

                {photoURL && (
                  <button
                    type="button"
                    onClick={() => setPhotoURL('')}
                    className={`px-3 py-2 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700 hover:text-slate-900'} rounded-xl text-xs`}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-500">Supports JPG, PNG or WEBP image files.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'} font-bold mb-1`}>Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
              />
            </div>

            <div>
              <label className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'} font-bold mb-1`}>Category / Exam Target</label>
              <input
                type="text"
                required
                value={targetGoal}
                onChange={e => setTargetGoal(e.target.value)}
                className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
              />
            </div>

            <div>
              <label className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'} font-bold mb-1`}>Class / Batch</label>
              <input
                type="text"
                value={studentClass}
                onChange={e => setStudentClass(e.target.value)}
                className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
              />
            </div>

            <div>
              <label className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'} font-bold mb-1`}>College / School</label>
              <input
                type="text"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
              />
            </div>

            <div>
              <label className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'} font-bold mb-1`}>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
              />
            </div>

            <div>
              <label className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'} font-bold mb-1`}>City / Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
              />
            </div>
          </div>

          <div>
            <label className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'} font-bold mb-1`}>Short Academic Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl p-3 focus:outline-none focus:border-cyan-500`}
            />
          </div>

          {/* DANGER ZONE: Delete Account Option */}
          <div className="pt-4 border-t border-rose-500/20 space-y-2">
            <h4 className="font-bold text-rose-500 text-xs uppercase tracking-wider">Danger Zone</h4>
            <div className={`p-3 rounded-2xl ${isDark ? 'bg-rose-955/20 border-rose-500/30' : 'bg-rose-50 border-rose-200'} border flex items-center justify-between`}>
              <div>
                <p className="font-bold text-rose-500 text-xs">অ্যাকাউন্ট ডিলিট করুন</p>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>আপনার সকল ডাটা টেকইউআপ থেকে চিরতরে মুছে যাবে</p>
              </div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shrink-0"
              >
                <Trash2 size={14} /> ডিলিট করুন
              </button>
            </div>
          </div>

          <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} rounded-xl font-bold hover:opacity-90 transition-opacity`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl shadow-lg transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
