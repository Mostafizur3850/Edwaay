import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    User, 
    Calendar, 
    DollarSign, 
    Award, 
    Users, 
    LogOut, 
    Plus, 
    Trash2, 
    Edit3, 
    Save, 
    Clock, 
    ExternalLink, 
    CheckCircle,
    Star,
    Video,
    BookOpen
} from 'lucide-react';

interface MentorDashboardProps {
    onLogout: () => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const getMentorImageUrl = (url: string) => {
        if (!url) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `http://localhost:5141/${url.replace(/^\//, '')}`;
    };
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mentorProfile, setMentorProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Profile form state
    const [formName, setFormName] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formInstitution, setFormInstitution] = useState('');
    const [formSubject, setFormSubject] = useState('');
    const [formBio, setFormBio] = useState('');
    const [formBookingPrice, setFormBookingPrice] = useState(0);
    const [formImageUrl, setFormImageUrl] = useState('');
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    // Mock Booking slots state
    const [bookings, setBookings] = useState<any[]>([
        { id: 'b1', studentName: 'Mostafizur Rahman', email: 'mostafizur@test.com', subject: 'Physics - Class 12', date: '2026-07-30', timeSlot: '4:00 PM - 5:00 PM', meetLink: 'https://meet.google.com/abc-defg-hij', status: 'Upcoming' },
        { id: 'b2', studentName: 'Motiur Rahman', email: 'motiur@test.com', subject: 'Math - HSC Preparation', date: '2026-08-01', timeSlot: '10:00 AM - 11:00 AM', meetLink: 'https://meet.google.com/abc-defg-hij', status: 'Upcoming' },
        { id: 'b3', studentName: 'Afrin Sultana', email: 'afrin@test.com', subject: 'English Grammar', date: '2026-07-25', timeSlot: '2:00 PM - 3:00 PM', meetLink: 'https://meet.google.com/abc-defg-hij', status: 'Completed' }
    ]);

    // Mock Availability Slots state
    const [availability, setAvailability] = useState<any[]>([
        { id: 'a1', day: 'Monday', time: '4:00 PM - 5:00 PM', active: true },
        { id: 'a2', day: 'Wednesday', time: '4:00 PM - 5:00 PM', active: true },
        { id: 'a3', day: 'Friday', time: '10:00 AM - 11:00 AM', active: false },
        { id: 'a4', day: 'Saturday', time: '2:00 PM - 3:00 PM', active: true }
    ]);

    // Mock Student feedback/reviews
    const reviews = [
        { id: 'r1', studentName: 'Mostafizur Rahman', rating: 5, comment: 'The session was incredibly helpful. Uncle explained all the complex physics concepts very easily!' },
        { id: 'r2', studentName: 'Afrin Sultana', rating: 5, comment: 'Excellent mentor! Helped me structure my exam preparation roadmap perfectly.' }
    ];

    // Local user info
    const getLoggedUser = () => {
        try {
            return JSON.parse(localStorage.getItem('takeuup_user') || '{}');
        } catch (e) {
            return {};
        }
    };

    const user = getLoggedUser();

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                const { fetchMentorsList } = await import('../../services/api');
                const list = await fetchMentorsList();
                const array = Array.isArray(list) ? list : ((list as any)?.$values || []);
                
                // Find mentor profile that matches logged in user's email
                const match = array.find((m: any) => (m.email || m.Email || '').toLowerCase() === (user.email || '').toLowerCase());
                
                if (match) {
                    setMentorProfile(match);
                    setFormName(match.name || match.Name || '');
                    setFormTitle(match.title || match.Title || '');
                    setFormInstitution(match.institution || match.Institution || '');
                    setFormSubject(match.subject || match.Subject || '');
                    setFormBio(match.bio || match.Bio || '');
                    setFormBookingPrice(match.bookingPrice || match.BookingPrice || 0);
                    setFormImageUrl(match.imageUrl || match.ImageUrl || '');
                } else {
                    setError("No mentor profile matches your logged-in email. Please contact the administrator.");
                }
            } catch (e) {
                console.error("Failed to load mentor profile", e);
                setError("Error loading mentor profile from API.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user.email]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mentorProfile) return;
        setSaving(true);
        try {
            const { updateMentor } = await import('../../services/api');
            const id = mentorProfile.id || mentorProfile.Id;
            const formData = new FormData();
            formData.append('name', formName);
            formData.append('title', formTitle);
            formData.append('institution', formInstitution);
            formData.append('subject', formSubject);
            formData.append('bio', formBio);
            formData.append('bookingPrice', formBookingPrice.toString());
            formData.append('email', user.email || '');
            formData.append('rating', (mentorProfile.rating || mentorProfile.Rating || 4.8).toString());

            if (formImageFile) {
                formData.append('ImageFile', formImageFile, formImageFile.name);
            } else if (formImageUrl) {
                formData.append('imageUrl', formImageUrl);
            }

            const updated = await updateMentor(id, formData);
            setMentorProfile(updated);
            setFormImageUrl(updated.imageUrl || updated.ImageUrl || '');
            setFormImageFile(null);
            alert("Profile updated successfully!");
        } catch (e) {
            console.error("Failed to save profile", e);
            alert("Failed to save profile changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleAvailability = (id: string) => {
        setAvailability(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    };

    const handleMarkSessionCompleted = (id: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Completed' } : b));
    };

    const handleCancelSession = (id: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium">Loading Professional Mentor Workspace...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-6">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                    <Award className="mx-auto text-red-500" size={60} />
                    <h2 className="text-2xl font-bold">Mentor Profile Not Found</h2>
                    <p className="text-slate-400 text-sm">{error}</p>
                    <button 
                        onClick={handleLogoutClick} 
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3 rounded-2xl border border-red-500/20 transition-all text-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center font-bold">M</div>
                        <span className="font-bold text-xl">Mentor Workspace</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'profile', label: 'My Profile', icon: User },
                        { id: 'availability', label: 'My Availability', icon: Calendar },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                activeTab === item.id 
                                ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-600/20' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto h-screen bg-slate-950">
                
                {/* Header Profile Section */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-900">
                    <div>
                        <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Welcome back</span>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">{mentorProfile?.name || mentorProfile?.Name}</h1>
                        <p className="text-slate-400 text-sm mt-1">{mentorProfile?.title || mentorProfile?.Title} at {mentorProfile?.institution || mentorProfile?.Institution}</p>
                    </div>
                    <img 
                        src={getMentorImageUrl(mentorProfile?.imageUrl || mentorProfile?.ImageUrl)} 
                        alt="Mentor Profile" 
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/20 shadow-lg"
                    />
                </div>

                {/* Tab: Dashboard Overview */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-in fade-in duration-200">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Sessions', value: bookings.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                { label: 'Total Earnings', value: `${bookings.filter(b => b.status === 'Completed').length * (mentorProfile?.bookingPrice || mentorProfile?.BookingPrice || 500)} BDT`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
                                { label: 'Active Students', value: bookings.filter(b => b.status === 'Upcoming').length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                                { label: 'Average Rating', value: `${mentorProfile?.rating || mentorProfile?.Rating || 4.8} / 5.0`, icon: Star, color: 'text-orange-400', bg: 'bg-orange-500/10' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-white mt-2">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Middle Section: Upcoming bookings and student feedback */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            
                            {/* Bookings List */}
                            <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Clock className="text-cyan-400" size={20} />
                                        Upcoming Mentoring Sessions
                                    </h3>
                                    <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold">
                                        {bookings.filter(b => b.status === 'Upcoming').length} Pending
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {bookings.map(booking => (
                                        <div key={booking.id} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-800 transition-colors">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-white text-sm">{booking.studentName}</h4>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        booking.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                                                        booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                                                        'bg-cyan-500/10 text-cyan-400'
                                                    }`}>{booking.status}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                                    <BookOpen size={12} /> {booking.subject}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    📅 {booking.date} | ⏰ {booking.timeSlot}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                {booking.status === 'Upcoming' ? (
                                                    <>
                                                        <a 
                                                            href={booking.meetLink} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="flex-1 md:flex-none bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/10"
                                                        >
                                                            <Video size={14} /> Join Session
                                                        </a>
                                                        <button 
                                                            onClick={() => handleMarkSessionCompleted(booking.id)}
                                                            className="bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold px-3 py-2 rounded-xl border border-green-500/20 transition-all text-xs"
                                                            title="Mark as Completed"
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleCancelSession(booking.id)}
                                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-3 py-2 rounded-xl border border-red-500/20 transition-all text-xs"
                                                            title="Cancel Session"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-500 font-semibold italic">Session Finished</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Student Reviews */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Star className="text-orange-400" size={20} />
                                    Student Feedback
                                </h3>
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-xs text-white">{review.studentName}</h4>
                                                <div className="flex gap-0.5 text-orange-400">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} size={10} fill="currentColor" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed italic">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Tab: Profile Edit */}
                {activeTab === 'profile' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-3xl shadow-2xl animate-in fade-in duration-200">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="text-cyan-400" size={22} />
                            Professional Profile Settings
                        </h3>
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={formName} 
                                        onChange={e => setFormName(e.target.value)}
                                        required 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Professional Title</label>
                                    <input 
                                        type="text" 
                                        value={formTitle} 
                                        onChange={e => setFormTitle(e.target.value)}
                                        required 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                        placeholder="e.g. Professor of Physics / Lecturer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Institution</label>
                                    <input 
                                        type="text" 
                                        value={formInstitution} 
                                        onChange={e => setFormInstitution(e.target.value)}
                                        required 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                        placeholder="e.g. SUST / BUET / Dhaka College"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Subject Specialty</label>
                                    <input 
                                        type="text" 
                                        value={formSubject} 
                                        onChange={e => setFormSubject(e.target.value)}
                                        required 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                        placeholder="e.g. Math, Physics, Chemistry"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Session Price (BDT)</label>
                                    <input 
                                        type="number" 
                                        value={formBookingPrice} 
                                        onChange={e => setFormBookingPrice(Number(e.target.value))}
                                        required 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Profile Image</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setFormImageFile(file);
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-350 hover:file:bg-slate-700"
                                    />
                                    {formImageUrl && !formImageFile && (
                                        <p className="text-[10px] text-slate-400 mt-1">Current: {formImageUrl.split('/').pop()}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Short Professional Bio</label>
                                <textarea 
                                    value={formBio} 
                                    onChange={e => setFormBio(e.target.value)}
                                    rows={4}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-800 text-slate-900 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/10 text-sm"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} /> Save Profile Details
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tab: Availability Slots */}
                {activeTab === 'availability' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-3xl shadow-2xl animate-in fade-in duration-200 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calendar className="text-cyan-400" size={22} />
                                Weekly Booking Availability
                            </h3>
                            <p className="text-slate-400 text-xs mt-1">Students will be able to book sessions during these active weekly time slots.</p>
                        </div>
                        <div className="space-y-4">
                            {availability.map(slot => (
                                <div key={slot.id} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-cyan-400" size={16} />
                                        <div>
                                            <h4 className="font-bold text-sm text-white">{slot.day}</h4>
                                            <p className="text-xs text-slate-500">{slot.time}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleToggleAvailability(slot.id)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                            slot.active 
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                            : 'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}
                                    >
                                        {slot.active ? 'Active / Bookable' : 'Unavailable'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};
