import React, { useState, useRef } from 'react';
import { Download, Sparkles, User, Briefcase, GraduationCap, PenTool, LayoutTemplate, Printer, ChevronRight, Plus, Trash2, Mail, Phone, MapPin, Linkedin, Github, Globe, Code, CalendarClock, Building2 } from 'lucide-react';
import { generateCVSummary, enhanceCVDescription } from '../../services/geminiService';

const TEMPLATES = [
    { id: 'modern', name: 'Modern Split', color: 'bg-slate-800' },
    { id: 'classic', name: 'Classic Serif', color: 'bg-white' },
    { id: 'creative', name: 'Creative Bold', color: 'bg-cyan-900' }
];

// Reusable Input Component with Icon
const InputWithIcon = ({ label, icon: Icon, value, onChange, placeholder }: any) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors">
                <Icon size={18} />
            </div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-600"
            />
        </div>
    </div>
);

export const CVBuilder = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [cvData, setCvData] = useState({
        fullName: 'Anika Tabassum',
        jobTitle: 'Junior Software Engineer',
        email: 'anika.t@example.com',
        phone: '+880 1712 345678',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/anika',
        portfolio: 'github.com/anika',
        summary: 'Motivated software engineering student with a passion for frontend development and UI/UX design. Eager to launch a career in building accessible web applications.',
        experience: [
            { id: 1, title: 'Frontend Intern', company: 'TechSolutions BD', start: '2023', end: 'Present', desc: 'Developed responsive UI components using React and Tailwind CSS.' }
        ],
        education: [
            { id: 1, degree: 'B.Sc. in Computer Science', school: 'North South University', year: '2024' }
        ],
        skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Figma', 'Node.js']
    });

    const printRef = useRef<HTMLDivElement>(null);

    // --- Sync CV on Mount ---
    React.useEffect(() => {
        const loadCV = async () => {
            try {
                const { fetchUserCV } = await import('../../services/api');
                const data = await fetchUserCV();
                if (data) {
                    setCvData({
                        fullName: data.fullName || '',
                        jobTitle: data.title || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        location: 'Dhaka, Bangladesh',
                        linkedin: '',
                        portfolio: '',
                        summary: data.summary || '',
                        experience: data.experienceJson ? JSON.parse(data.experienceJson) : [],
                        education: data.educationJson ? JSON.parse(data.educationJson) : [],
                        skills: data.skillsJson ? JSON.parse(data.skillsJson) : []
                    });
                }
            } catch(e) {
                console.warn("Failed to load CV from API, using defaults.");
            }
        };
        loadCV();
    }, []);

    const handleSaveCV = async () => {
        setIsSaving(true);
        try {
            const { saveUserCV } = await import('../../services/api');
            await saveUserCV(cvData);
            alert("Resume saved to your account successfully!");
        } catch(e) {
            console.error("Failed to save CV:", e);
            alert("Could not save resume to server. Saving locally instead.");
            localStorage.setItem('takeuup_cv', JSON.stringify(cvData));
        } finally {
            setIsSaving(false);
        }
    };

    // --- AI Handlers ---
    const handleAISummary = async () => {
        setIsGenerating(true);
        const title = cvData.jobTitle || 'Professional';
        const result = await generateCVSummary(title, cvData.skills.join(', '));
        setCvData(prev => ({ ...prev, summary: result }));
        setIsGenerating(false);
    };

    const handleAIEnhanceExp = async (id: number, text: string) => {
        if (!text) return;
        setIsGenerating(true);
        const result = await enhanceCVDescription(text);
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, desc: result } : exp)
        }));
        setIsGenerating(false);
    };

    // --- Form Handlers ---
    const updateField = (field: string, value: any) => {
        setCvData(prev => ({ ...prev, [field]: value }));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white font-sans flex flex-col lg:flex-row">
            
            {/* --- LEFT: EDITOR PANEL --- */}
            <div className="w-full lg:w-1/3 bg-white dark:bg-[#151921] border-r border-slate-200 dark:border-white/5 h-screen overflow-y-auto custom-scrollbar p-6 print:hidden flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <PenTool className="text-cyan-500 dark:text-cyan-400" /> CV Builder
                    </h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleSaveCV} 
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Resume"}
                        </button>
                        <button onClick={() => window.history.back()} className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Exit</button>
                    </div>
                </div>

                {/* Template Selector */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-3 block">Choose Template</label>
                    <div className="grid grid-cols-3 gap-2">
                        {TEMPLATES.map(t => (
                            <button 
                                key={t.id}
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`p-2 rounded-lg border text-xs font-medium transition-all ${selectedTemplate === t.id ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6 overflow-x-auto">
                    {['personal', 'edu', 'exp', 'skills'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-white dark:bg-cyan-600 text-cyan-700 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            {tab === 'personal' ? 'Identity' : tab === 'edu' ? 'Education' : tab === 'exp' ? 'Experience' : 'Skills'}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <div className="flex-1 space-y-6">
                    {/* Personal Tab */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Identity Section */}
                            <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1.5 bg-cyan-100 dark:bg-cyan-500/20 rounded-lg text-cyan-600 dark:text-cyan-400"><User size={16} /></div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Identity Details</h3>
                                </div>
                                <InputWithIcon 
                                    label="Full Name" 
                                    icon={User} 
                                    value={cvData.fullName} 
                                    onChange={(e: any) => updateField('fullName', e.target.value)} 
                                    placeholder="e.g. John Doe"
                                />
                                <InputWithIcon 
                                    label="Job Title" 
                                    icon={Briefcase} 
                                    value={cvData.jobTitle} 
                                    onChange={(e: any) => updateField('jobTitle', e.target.value)} 
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>

                            {/* Contact Section */}
                            <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400"><Phone size={16} /></div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Contact Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <InputWithIcon label="Email" icon={Mail} value={cvData.email} onChange={(e: any) => updateField('email', e.target.value)} placeholder="email@example.com" />
                                    </div>
                                    <InputWithIcon label="Phone" icon={Phone} value={cvData.phone} onChange={(e: any) => updateField('phone', e.target.value)} placeholder="+880 1..." />
                                    <InputWithIcon label="Location" icon={MapPin} value={cvData.location} onChange={(e: any) => updateField('location', e.target.value)} placeholder="City, Country" />
                                </div>
                            </div>

                            {/* Socials Section */}
                            <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"><Globe size={16} /></div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Social Links</h3>
                                </div>
                                <InputWithIcon label="LinkedIn" icon={Linkedin} value={cvData.linkedin} onChange={(e: any) => updateField('linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                                <InputWithIcon label="Portfolio / GitHub" icon={Github} value={cvData.portfolio} onChange={(e: any) => updateField('portfolio', e.target.value)} placeholder="github.com/username" />
                            </div>

                            {/* Summary Section with AI */}
                            <div className="bg-gradient-to-br from-purple-50 to-slate-50 dark:from-purple-900/10 dark:to-slate-800/30 p-5 rounded-2xl border border-purple-200 dark:border-purple-500/20 relative group">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400"><Sparkles size={16} /></div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Professional Summary</h3>
                                    </div>
                                    <button 
                                        onClick={handleAISummary}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-purple-900/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <Sparkles size={14} className={isGenerating ? "animate-spin" : ""} />
                                        {isGenerating ? 'Generating...' : 'Auto-Write with AI'}
                                    </button>
                                </div>
                                <textarea 
                                    rows={6} 
                                    value={cvData.summary} 
                                    onChange={e => updateField('summary', e.target.value)} 
                                    placeholder="Briefly describe your professional background and key achievements..."
                                    className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 outline-none leading-relaxed resize-none transition-all"
                                />
                                <p className="text-[10px] text-slate-500 mt-2 text-right">
                                    Tip: Fill in your job title and skills tab for better AI results.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Education Tab */}
                    {activeTab === 'edu' && (
                        <div className="space-y-4 animate-in fade-in">
                            {cvData.education.map((edu, idx) => (
                                <div key={edu.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative group">
                                    <button 
                                        onClick={() => setCvData({...cvData, education: cvData.education.filter(e => e.id !== edu.id)})}
                                        className="absolute top-2 right-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-1 gap-3">
                                        <InputWithIcon label="Degree" icon={GraduationCap} value={edu.degree} onChange={(e: any) => {
                                            const newEdu = [...cvData.education]; newEdu[idx].degree = e.target.value; setCvData({...cvData, education: newEdu});
                                        }} placeholder="B.Sc. in Computer Science" />
                                        <InputWithIcon label="Institution" icon={Building2} value={edu.school} onChange={(e: any) => {
                                            const newEdu = [...cvData.education]; newEdu[idx].school = e.target.value; setCvData({...cvData, education: newEdu});
                                        }} placeholder="University Name" />
                                        <InputWithIcon label="Year" icon={CalendarClock} value={edu.year} onChange={(e: any) => {
                                            const newEdu = [...cvData.education]; newEdu[idx].year = e.target.value; setCvData({...cvData, education: newEdu});
                                        }} placeholder="2020 - 2024" />
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => setCvData({...cvData, education: [...cvData.education, { id: Date.now(), degree: '', school: '', year: '' }]})}
                                className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-center gap-2 text-sm font-medium transition-all"
                            >
                                <Plus size={16} /> Add Education
                            </button>
                        </div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'exp' && (
                        <div className="space-y-4 animate-in fade-in">
                             {cvData.experience.map((exp, idx) => (
                                <div key={exp.id} className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 relative group">
                                    <button 
                                        onClick={() => setCvData({...cvData, experience: cvData.experience.filter(e => e.id !== exp.id)})}
                                        className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="col-span-2">
                                            <InputWithIcon label="Job Title" icon={Briefcase} value={exp.title} onChange={(e: any) => {
                                                const newExp = [...cvData.experience]; newExp[idx].title = e.target.value; setCvData({...cvData, experience: newExp});
                                            }} placeholder="Senior Developer" />
                                        </div>
                                        <div className="col-span-2">
                                            <InputWithIcon label="Company" icon={Building2} value={exp.company} onChange={(e: any) => {
                                                const newExp = [...cvData.experience]; newExp[idx].company = e.target.value; setCvData({...cvData, experience: newExp});
                                            }} placeholder="Tech Company Ltd." />
                                        </div>
                                        <InputWithIcon label="Start Date" icon={CalendarClock} value={exp.start} onChange={(e: any) => {
                                                const newExp = [...cvData.experience]; newExp[idx].start = e.target.value; setCvData({...cvData, experience: newExp});
                                            }} placeholder="Jan 2022" />
                                        <InputWithIcon label="End Date" icon={CalendarClock} value={exp.end} onChange={(e: any) => {
                                                const newExp = [...cvData.experience]; newExp[idx].end = e.target.value; setCvData({...cvData, experience: newExp});
                                            }} placeholder="Present" />
                                    </div>
                                    <div className="relative">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Description</label>
                                         <textarea 
                                            placeholder="Describe your responsibilities and achievements..." 
                                            rows={3}
                                            value={exp.desc} 
                                            onChange={e => {
                                                const newExp = [...cvData.experience]; newExp[idx].desc = e.target.value; setCvData({...cvData, experience: newExp});
                                            }} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 outline-none pr-10 resize-none"
                                        />
                                        <button 
                                            onClick={() => handleAIEnhanceExp(exp.id, exp.desc)}
                                            disabled={isGenerating}
                                            className="absolute bottom-3 right-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-purple-200 dark:border-purple-500/20"
                                            title="Polish with AI"
                                        >
                                            <Sparkles size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => setCvData({...cvData, experience: [...cvData.experience, { id: Date.now(), title: '', company: '', start: '', end: '', desc: '' }]})}
                                className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-center gap-2 text-sm font-medium transition-all"
                            >
                                <Plus size={16} /> Add Experience
                            </button>
                        </div>
                    )}

                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 block flex items-center gap-2">
                                    <Code size={16} className="text-cyan-600 dark:text-cyan-400" /> Technical Skills
                                </label>
                                <textarea 
                                    rows={4}
                                    value={cvData.skills.join(', ')}
                                    onChange={e => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 outline-none"
                                    placeholder="Enter skills separated by commas (e.g. React, Java, Leadership, Public Speaking)"
                                />
                                <p className="text-xs text-slate-500 mt-2">Separate each skill with a comma.</p>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Preview</h4>
                                <div className="flex flex-wrap gap-2">
                                    {cvData.skills.map((skill, i) => skill && (
                                        <span key={i} className="px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-xs font-bold rounded-lg border border-cyan-200 dark:border-cyan-500/20 flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                                            {skill}
                                        </span>
                                    ))}
                                    {cvData.skills.length === 0 || (cvData.skills.length === 1 && !cvData.skills[0]) && (
                                        <span className="text-slate-500 dark:text-slate-600 text-sm italic">No skills added yet.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- RIGHT: LIVE PREVIEW --- */}
            <div className="w-full lg:w-2/3 bg-slate-100 dark:bg-slate-900 p-8 flex flex-col items-center justify-center relative print:w-full print:p-0 print:absolute print:top-0 print:left-0 print:bg-white print:text-black">
                
                {/* Preview Toolbar */}
                <div className="absolute top-6 right-6 flex gap-3 print:hidden z-10">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all transform hover:-translate-y-1"
                    >
                        <Download size={20} /> Download PDF
                    </button>
                </div>

                {/* --- A4 Paper Container --- */}
                <div ref={printRef} className="bg-white text-slate-900 w-[210mm] min-h-[297mm] shadow-2xl origin-top transform scale-50 sm:scale-75 lg:scale-90 xl:scale-100 transition-transform duration-300 print:scale-100 print:shadow-none print:m-0">
                    
                    {/* --- TEMPLATE 1: MODERN SPLIT --- */}
                    {selectedTemplate === 'modern' && (
                        <div className="flex h-full min-h-[297mm]">
                            <div className="w-1/3 bg-slate-900 text-white p-8">
                                <div className="mb-8">
                                    <h1 className="text-2xl font-bold leading-tight mb-2 uppercase tracking-wide">{cvData.fullName.split(' ')[0]}<br/><span className="text-cyan-400">{cvData.fullName.split(' ').slice(1).join(' ')}</span></h1>
                                    <p className="text-sm text-slate-400 font-medium tracking-wide mt-2">{cvData.jobTitle}</p>
                                </div>
                                
                                <div className="space-y-8 text-sm text-slate-300">
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-2 mb-2">Contact</h3>
                                        <div className="flex items-center gap-3"><Mail size={14} className="text-cyan-400" /> {cvData.email}</div>
                                        <div className="flex items-center gap-3"><Phone size={14} className="text-cyan-400" /> {cvData.phone}</div>
                                        <div className="flex items-center gap-3"><MapPin size={14} className="text-cyan-400" /> {cvData.location}</div>
                                        {cvData.linkedin && <div className="flex items-center gap-3"><Linkedin size={14} className="text-cyan-400" /> <span className="truncate">{cvData.linkedin.replace('https://','')}</span></div>}
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-2 mb-4">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {cvData.skills.map((s, i) => (
                                                <span key={i} className="bg-slate-800 px-3 py-1.5 rounded text-xs font-medium border border-slate-700">{s}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-2 mb-4">Education</h3>
                                        {cvData.education.map((edu, i) => (
                                            <div key={i} className="mb-4">
                                                <div className="font-bold text-white mb-0.5">{edu.degree}</div>
                                                <div className="text-cyan-400 text-xs font-medium mb-0.5">{edu.school}</div>
                                                <div className="text-slate-500 text-xs">{edu.year}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-2/3 p-10 bg-white text-slate-800">
                                <div className="mb-10">
                                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-2 mb-4">Professional Profile</h2>
                                    <p className="text-sm leading-relaxed text-slate-600 text-justify">
                                        {cvData.summary}
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-2 mb-6">Work Experience</h2>
                                    <div className="space-y-8">
                                        {cvData.experience.map((exp, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-lg text-slate-800">{exp.title}</h3>
                                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-wide">{exp.start} - {exp.end}</span>
                                                </div>
                                                <div className="text-cyan-700 font-bold text-sm mb-3 flex items-center gap-2">
                                                    <Briefcase size={12} /> {exp.company}
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                                                    {exp.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TEMPLATE 2: CLASSIC SERIF --- */}
                    {selectedTemplate === 'classic' && (
                        <div className="p-16 font-serif text-slate-900">
                            <div className="text-center border-b-2 border-slate-800 pb-8 mb-10">
                                <h1 className="text-4xl font-bold mb-2 uppercase tracking-widest text-slate-900">{cvData.fullName}</h1>
                                <p className="text-lg text-slate-600 italic mb-4">{cvData.jobTitle}</p>
                                <div className="flex justify-center flex-wrap gap-4 text-sm text-slate-600 font-sans">
                                    <span className="flex items-center gap-1"><Mail size={12} /> {cvData.email}</span>
                                    <span>|</span>
                                    <span className="flex items-center gap-1"><Phone size={12} /> {cvData.phone}</span>
                                    <span>|</span>
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {cvData.location}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase border-b border-slate-300 mb-4 pb-1 tracking-widest">Professional Summary</h3>
                                <p className="text-sm leading-relaxed text-justify">{cvData.summary}</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase border-b border-slate-300 mb-6 pb-1 tracking-widest">Experience</h3>
                                {cvData.experience.map((exp, i) => (
                                    <div key={i} className="mb-6">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <div className="font-bold text-lg text-slate-800">{exp.title}</div>
                                            <div className="text-sm font-medium italic text-slate-600">{exp.start} – {exp.end}</div>
                                        </div>
                                        <div className="text-sm font-bold text-slate-700 mb-2">{exp.company}</div>
                                        <p className="text-sm text-slate-700 leading-relaxed text-justify">{exp.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase border-b border-slate-300 mb-4 pb-1 tracking-widest">Education</h3>
                                {cvData.education.map((edu, i) => (
                                    <div key={i} className="mb-3 flex justify-between text-sm">
                                        <div>
                                            <span className="font-bold block text-base">{edu.school}</span>
                                            <span className="text-slate-700">{edu.degree}</span>
                                        </div>
                                        <span className="font-medium text-slate-600">{edu.year}</span>
                                    </div>
                                ))}
                            </div>

                             <div>
                                <h3 className="text-sm font-bold uppercase border-b border-slate-300 mb-4 pb-1 tracking-widest">Core Competencies</h3>
                                <p className="text-sm leading-relaxed">{cvData.skills.join(' • ')}</p>
                            </div>
                        </div>
                    )}

                    {/* --- TEMPLATE 3: CREATIVE BOLD --- */}
                    {selectedTemplate === 'creative' && (
                         <div className="flex flex-col h-full min-h-[297mm]">
                             <div className="bg-cyan-950 text-white p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-800 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                                <div className="relative z-10">
                                    <h1 className="text-5xl font-black mb-2 tracking-tight">{cvData.fullName}</h1>
                                    <p className="text-cyan-400 text-xl font-medium tracking-wide">{cvData.jobTitle}</p>
                                </div>
                             </div>
                             
                             <div className="flex flex-1">
                                 <div className="w-2/3 p-12 pr-8">
                                    <div className="mb-10">
                                        <h3 className="text-cyan-950 font-black uppercase tracking-widest text-sm mb-4 border-b-4 border-cyan-400 inline-block pb-1">About Me</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed text-justify font-medium">{cvData.summary}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-cyan-950 font-black uppercase tracking-widest text-sm mb-8 border-b-4 border-cyan-400 inline-block pb-1">Work History</h3>
                                        <div className="space-y-10 border-l-2 border-slate-200 pl-8 ml-3">
                                            {cvData.experience.map((exp, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-[43px] top-1.5 w-5 h-5 rounded-full bg-cyan-950 border-4 border-white shadow-sm"></div>
                                                    <h4 className="font-bold text-lg text-slate-900">{exp.title}</h4>
                                                    <div className="text-cyan-700 text-sm font-bold mb-2 uppercase tracking-wide">{exp.company}</div>
                                                    <div className="text-slate-400 text-xs mb-3 font-mono bg-slate-100 inline-block px-2 py-1 rounded">{exp.start} - {exp.end}</div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{exp.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                 </div>
                                 <div className="w-1/3 bg-slate-50 p-12 pl-8 border-l border-slate-200">
                                     <div className="mb-10">
                                         <h3 className="font-black text-slate-900 mb-6 border-b-4 border-cyan-400 inline-block pb-1 text-sm uppercase tracking-widest">Contact</h3>
                                         <div className="text-sm space-y-4 text-slate-600 font-medium">
                                             <div className="break-all flex items-center gap-3"><Mail size={16} className="text-cyan-600" /> {cvData.email}</div>
                                             <div className="flex items-center gap-3"><Phone size={16} className="text-cyan-600" /> {cvData.phone}</div>
                                             <div className="flex items-center gap-3"><MapPin size={16} className="text-cyan-600" /> {cvData.location}</div>
                                             {cvData.linkedin && <div className="text-cyan-700 flex items-center gap-3"><Linkedin size={16} className="text-cyan-600" /> LinkedIn</div>}
                                         </div>
                                     </div>

                                     <div className="mb-10">
                                         <h3 className="font-black text-slate-900 mb-6 border-b-4 border-cyan-400 inline-block pb-1 text-sm uppercase tracking-widest">Education</h3>
                                         {cvData.education.map((edu, i) => (
                                             <div key={i} className="mb-6 text-sm">
                                                 <div className="font-bold text-slate-900 text-base mb-1">{edu.degree}</div>
                                                 <div className="text-cyan-700 font-bold mb-1">{edu.school}</div>
                                                 <div className="text-slate-400 text-xs font-mono bg-white inline-block px-2 py-0.5 rounded border border-slate-200">{edu.year}</div>
                                             </div>
                                         ))}
                                     </div>

                                     <div>
                                         <h3 className="font-black text-slate-900 mb-6 border-b-4 border-cyan-400 inline-block pb-1 text-sm uppercase tracking-widest">Skills</h3>
                                         <div className="flex flex-wrap gap-2">
                                             {cvData.skills.map((s, i) => (
                                                 <span key={i} className="bg-white border-2 border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm">{s}</span>
                                             ))}
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    )}

                </div>
            </div>

            {/* Print CSS Injection */}
            <style>{`
                /* Font imports could be added here or in index.html for specific templates */
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap');

                .font-serif { font-family: 'Merriweather', serif; }
                
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; }
                    .print\\:hidden { display: none !important; }
                    .print\\:w-full { width: 100% !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:absolute { position: absolute !important; }
                    .print\\:top-0 { top: 0 !important; }
                    .print\\:left-0 { left: 0 !important; }
                    .print\\:bg-white { background-color: white !important; }
                    .print\\:text-black { color: black !important; }
                    .print\\:scale-100 { transform: scale(1) !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:m-0 { margin: 0 !important; }
                }
            `}</style>
        </div>
    );
};