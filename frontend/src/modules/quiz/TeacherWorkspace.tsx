import React, { useState, useEffect } from 'react';
import { typesetMath } from '../../utils/mathJax';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Save, Share2, CreditCard, CheckCircle2, 
  ShieldCheck, Clock, ListChecks, Link as LinkIcon, Info, 
  Search, Edit, Eye, UploadCloud, FileText, AlertTriangle, 
  Check, X, BookOpen, GraduationCap, Briefcase, Globe, Sparkles,
  BarChart3, Users, Zap, Shield, Crown, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, createQuestion, bulkUploadQuestions, updateQuestion, deleteQuestion } from '../../services/api';

interface TeacherQuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
}

const EXAM_CATEGORIES = [
    { id: 'HSC', label: 'HSC Academic' },
    { id: 'Admission', label: 'University Admission' },
    { id: 'Job', label: 'Job Preparation' },
    { id: 'BCS', label: 'BCS Preliminary' },
    { id: 'Medical', label: 'Medical Admission' },
    { id: 'Engineering', label: 'Engineering Admission' }
];

const SUBJECTS_BY_CATEGORY: Record<string, string[]> = {
    HSC: ['Physics', 'Chemistry', 'Math', 'Biology', 'ICT', 'English', 'Bangla'],
    Admission: ['Physics', 'Chemistry', 'Math', 'Biology', 'General Knowledge', 'English', 'Bangla'],
    Job: ['Bangla Language', 'English Literature', 'General Knowledge', 'Math', 'Mental Ability', 'International Affairs', 'Bangladesh Affairs'],
    BCS: ['Bangladesh Affairs', 'International Affairs', 'English Language', 'Bangla Literature', 'Mathematical Reasoning', 'Mental Ability', 'General Science', 'ICT'],
    Medical: ['Biology', 'Chemistry', 'Physics', 'English', 'General Knowledge'],
    Engineering: ['Higher Math', 'Physics', 'Chemistry', 'English']
};

export const TeacherWorkspace = () => {
    const getFullImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('blob:')) return path;
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        return `http://localhost:5141${cleanPath}`;
    };

    const navigate = useNavigate();
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'single' | 'bulk' | 'manage' | 'secure' | 'collaboration' | 'profile_settings'>('overview');


    // States for general loading/refreshing
    const [loading, setLoading] = useState(false);
    const [myQuestions, setMyQuestions] = useState<any[]>([]);
    
    // --- Overview Stats ---
    const [stats, setStats] = useState({
        totalQuestions: 0,
        freeQuestions: 0,
        premiumQuestions: 0,
        recentAttempts: 0
    });

    // --- Single Upload Form ---
    const [singleForm, setSingleForm] = useState({
        text: '',
        category: 'HSC',
        subject: 'Physics',
        accessLevel: 'Free',
        correctAnswer: '0',
        explanation: '',
        options: ['', '', '', '']
    });

    // --- Bulk Upload States ---
    const [bulkText, setBulkText] = useState('');
    const [bulkParsed, setBulkParsed] = useState<any[]>([]);
    const [bulkCategory, setBulkCategory] = useState('HSC');
    const [bulkSubject, setBulkSubject] = useState('Physics');
    const [bulkAccessLevel, setBulkAccessLevel] = useState('Free');
    const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showGuide, setShowGuide] = useState(false);

    const downloadExcelTemplate = async () => {
        try {
            const XLSX = await import('xlsx');
            const headers = [
                "Category", "Subject", "AccessLevel", "QuestionText", 
                "Option A", "Option B", "Option C", "Option D", 
                "Correct Answer", "Explanation"
            ];
            
            const sampleRow1 = [
                "HSC", "Physics", "Free", "What is the formula for Einstein's mass-energy equivalence?", 
                "\\(E = mc^2\\)", "\\(F = ma\\)", "\\(E = hf\\)", "\\(V = IR\\)", 
                "A", "Einstein proposed mass-energy equivalence in 1905."
            ];

            const sampleRow2 = [
                "Admission", "Math", "Premium", "Solve for \\(x\\): \\(x^2 - 5x + 6 = 0\\)", 
                "\\(x = 2, 3\\)", "\\(x = 1, 5\\)", "\\(x = -2, -3\\)", "\\(x = 0\\)", 
                "1", "Factoring the equation yields \\((x-2)(x-3) = 0\\)."
            ];

            const data = [headers, sampleRow1, sampleRow2];
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Questions Template");
            XLSX.writeFile(wb, "Question_Bulk_Template.xlsx");
        } catch (err: any) {
            alert("Failed to download Excel template: " + err.message);
        }
    };

    const downloadWordTemplate = () => {
        const htmlContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>Question Template</title>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 11pt; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; }
        </style>
        </head>
        <body>
          <h2>TakeUUp Question Upload Template</h2>
          <p>Fill in the table rows below. LaTeX math equations like \\\\(x^2\\\\) or \\\\\\[\\\\frac{a}{b}\\\\\\] are fully supported.</p>
          <table>
            <tr>
              <th>Category</th><th>Subject</th><th>AccessLevel</th><th>QuestionText</th>
              <th>Option A</th><th>Option B</th><th>Option C</th><th>Option D</th>
              <th>Correct Answer (A-D or 1-4)</th><th>Explanation</th>
            </tr>
            <tr>
              <td>HSC</td><td>Physics</td><td>Free</td><td>What is the formula for Einstein's mass-energy equivalence?</td>
              <td>\\\\(E = mc^2\\\\)</td><td>\\\\(F = ma\\\\)</td><td>\\\\(E = hf\\\\)</td><td>\\\\(V = IR\\\\)</td>
              <td>A</td><td>Einstein proposed mass-energy equivalence in 1905.</td>
            </tr>
            <tr>
              <td>Admission</td><td>Math</td><td>Premium</td><td>Solve for \\\\(x\\\\): \\\\(x^2 - 5x + 6 = 0\\\\)</td>
              <td>\\\\(x = 2, 3\\\\)</td><td>\\\\(x = 1, 5\\\\)</td><td>\\\\(x = -2, -3\\\\)</td><td>\\\\(x = 0\\\\)</td>
              <td>1</td><td>Factoring yields \\\\((x-2)(x-3) = 0\\\\).</td>
            </tr>
          </table>
        </body>
        </html>`;

        const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Question_Bulk_Template.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsParsing(true);
        setUploadError(null);
        setParsedQuestions([]);

        try {
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension === 'xlsx' || extension === 'xls') {
                const XLSX = await import('xlsx');
                const reader = new FileReader();
                reader.onload = (evt) => {
                    try {
                        const bstr = evt.target?.result;
                        const wb = XLSX.read(bstr, { type: 'binary' });
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
                        
                        if (data.length < 2) {
                            throw new Error("Template must contain at least one question row.");
                        }
                        
                        const list: any[] = [];
                        for (let i = 1; i < data.length; i++) {
                            const row = data[i];
                            if (!row || row.length === 0) continue;
                            
                            const category = String(row[0] || '').trim();
                            const subject = String(row[1] || '').trim();
                            const accessLevel = String(row[2] || 'Free').trim();
                            const text = String(row[3] || '').trim();
                            const opt1 = String(row[4] || '').trim();
                            const opt2 = String(row[5] || '').trim();
                            const opt3 = String(row[6] || '').trim();
                            const opt4 = String(row[7] || '').trim();
                            const ansRaw = String(row[8] || '').trim();
                            const exp = String(row[9] || '').trim();
                            
                            if (!category || !subject || !text || !opt1 || !opt2 || !ansRaw) continue;
                            
                            let correctAnswer = '0';
                            const normalizedAns = ansRaw.toUpperCase();
                            if (normalizedAns === 'A' || normalizedAns === '1') correctAnswer = '0';
                            else if (normalizedAns === 'B' || normalizedAns === '2') correctAnswer = '1';
                            else if (normalizedAns === 'C' || normalizedAns === '3') correctAnswer = '2';
                            else if (normalizedAns === 'D' || normalizedAns === '4') correctAnswer = '3';
                            
                            list.push({
                                category,
                                subject,
                                accessLevel,
                                text,
                                options: [opt1, opt2, opt3, opt4].filter(Boolean),
                                correctAnswer,
                                explanation: exp
                            });
                        }
                        
                        if (list.length === 0) {
                            throw new Error("No valid questions parsed from file.");
                        }
                        setParsedQuestions(list);
                        setTimeout(() => {
                            typesetMath();
                        }, 200);
                    } catch (err: any) {
                        setUploadError(err.message || "Failed to parse Excel file.");
                    } finally {
                        setIsParsing(false);
                    }
                };
                reader.readAsBinaryString(file);
            } 
            else if (extension === 'docx' || extension === 'doc') {
                const mammoth = (await import('mammoth')).default;
                const reader = new FileReader();
                reader.onload = async (evt) => {
                    try {
                        const arrayBuffer = evt.target?.result as ArrayBuffer;
                        const result = await mammoth.convertToHtml({ arrayBuffer });
                        const html = result.value;
                        
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const rows = doc.querySelectorAll('tr');
                        
                        if (rows.length < 2) {
                            throw new Error("Template must contain a table with at least one question row.");
                        }
                        
                        const list: any[] = [];
                        for (let i = 1; i < rows.length; i++) {
                            const cols = rows[i].querySelectorAll('td');
                            if (cols.length < 9) continue;
                            
                            const category = cols[0].textContent?.trim() || '';
                            const subject = cols[1].textContent?.trim() || '';
                            const accessLevel = cols[2].textContent?.trim() || 'Free';
                            const text = cols[3].textContent?.trim() || '';
                            const opt1 = cols[4].textContent?.trim() || '';
                            const opt2 = cols[5].textContent?.trim() || '';
                            const opt3 = cols[6].textContent?.trim() || '';
                            const opt4 = cols[7].textContent?.trim() || '';
                            const ansRaw = cols[8].textContent?.trim() || '';
                            const exp = cols[9]?.textContent?.trim() || '';
                            
                            if (!category || !subject || !text || !opt1 || !opt2 || !ansRaw) continue;
                            
                            let correctAnswer = '0';
                            const normalizedAns = ansRaw.toUpperCase();
                            if (normalizedAns === 'A' || normalizedAns === '1') correctAnswer = '0';
                            else if (normalizedAns === 'B' || normalizedAns === '2') correctAnswer = '1';
                            else if (normalizedAns === 'C' || normalizedAns === '3') correctAnswer = '2';
                            else if (normalizedAns === 'D' || normalizedAns === '4') correctAnswer = '3';
                            
                            list.push({
                                category,
                                subject,
                                accessLevel,
                                text,
                                options: [opt1, opt2, opt3, opt4].filter(Boolean),
                                correctAnswer,
                                explanation: exp
                            });
                        }
                        
                        if (list.length === 0) {
                            throw new Error("No valid questions parsed from Word file table.");
                        }
                        setParsedQuestions(list);
                        setTimeout(() => {
                            typesetMath();
                        }, 200);
                    } catch (err: any) {
                        setUploadError(err.message || "Failed to parse Word file table.");
                    } finally {
                        setIsParsing(false);
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                throw new Error("Invalid file format. Please upload .xlsx or .docx/.doc file.");
            }
        } catch (err: any) {
            setUploadError(err.message);
            setIsParsing(false);
        }
    };

    const handleBulkUploadSave = async () => {
        if (parsedQuestions.length === 0) return;
        try {
            const { bulkUploadQuestions } = await import('../../services/api');
            await bulkUploadQuestions(parsedQuestions);
            alert(`Successfully uploaded ${parsedQuestions.length} questions in bulk!`);
            setParsedQuestions([]);
            window.location.reload();
        } catch (err: any) {
            alert("Failed to upload parsed questions: " + err.message);
        }
    };

    // --- Manage Tab Filtering / Pagination / Edit Modal ---
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterSubject, setFilterSubject] = useState('All');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);

    useEffect(() => {
        typesetMath();
    }, [myQuestions, activeTab]);

    useEffect(() => {
        typesetMath();
    }, [singleForm]);

    // --- Secure Quiz Creator States (Original feature) ---
    const [secureTitle, setSecureTitle] = useState('');
    const [secureTimeLimit, setSecureTimeLimit] = useState(10);
    const [secureQuestions, setSecureQuestions] = useState<TeacherQuizQuestion[]>([
        { id: '1', text: '', options: ['', '', '', ''], correctIndex: 0 }
    ]);
    const [showPayment, setShowPayment] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    const [profile, setProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [wizardForm, setWizardForm] = useState({
        name: '',
        phoneNumber: '',
        institution: '',
        qualification: '',
        bio: ''
    });

    const loadProfile = async () => {
        setLoadingProfile(true);
        try {
            const { fetchUserProfile } = await import('../../services/api');
            const data = await fetchUserProfile();
            if (data) {
                setProfile(data);
                setTeacherName(data.name || '');
                setWizardForm({
                    name: data.name || '',
                    phoneNumber: data.phoneNumber || '',
                    institution: data.institution || '',
                    qualification: data.qualification || '',
                    bio: data.bio || ''
                });
                setProfileForm({
                    name: data.name || '',
                    phoneNumber: data.phoneNumber || '',
                    institution: data.institution || '',
                    qualification: data.qualification || '',
                    bio: data.bio || '',
                    profileImageFile: null,
                    profileImageUrl: data.profileImageUrl || ''
                });
            }
        } catch (e) {
            console.error("Failed to load profile", e);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleCompleteProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wizardForm.name.trim() || !wizardForm.phoneNumber.trim() || !wizardForm.institution.trim() || !wizardForm.qualification.trim() || !wizardForm.bio.trim()) {
            alert("All fields are required to complete your profile.");
            return;
        }
        try {
            const { updateUserProfile } = await import('../../services/api');
            await updateUserProfile(wizardForm);
            alert("🎉 Profile completed successfully! Welcome to the Teacher Dashboard.");
            await loadProfile();
        } catch (err) {
            console.error("Failed to complete profile", err);
            alert("Error updating profile details.");
        }
    };

    // Collaboration network states
    const [invitations, setInvitations] = useState<any[]>([]);
    const [connections, setConnections] = useState<any[]>([]);
    const [searchQueryTeacher, setSearchQueryTeacher] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    
    // Profile settings states (separate from wizard)
    const [profileForm, setProfileForm] = useState({
        name: '',
        phoneNumber: '',
        institution: '',
        qualification: '',
        bio: '',
        profileImageFile: null as File | null,
        profileImageUrl: ''
    });

    const loadCollaborationData = async () => {
        try {
            const { fetchReceivedInvitations, fetchConnections } = await import('../../services/api');
            const [invites, conns] = await Promise.all([
                fetchReceivedInvitations(),
                fetchConnections()
            ]);
            setInvitations(invites || []);
            setConnections(conns || []);
        } catch (e) {
            console.error("Failed to load collaboration data", e);
        }
    };

    const handleSearchTeachers = async () => {
        if (!searchQueryTeacher.trim()) return;
        try {
            const { searchTeachers } = await import('../../services/api');
            const list = await searchTeachers(searchQueryTeacher);
            setSearchResults(list || []);
        } catch (e) {
            console.error("Failed to search teachers", e);
        }
    };

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        try {
            const { inviteTeacher } = await import('../../services/api');
            const res = await inviteTeacher(inviteEmail);
            alert(res?.message || "Invitation sent successfully.");
            setInviteEmail('');
            loadCollaborationData();
        } catch (err) {
            alert("Error sending invitation.");
        }
    };

    const handleRespondToInvitation = async (id: string, status: 'Accepted' | 'Rejected') => {
        try {
            const { respondToInvitation } = await import('../../services/api');
            await respondToInvitation(id, status);
            alert(`Invitation ${status.toLowerCase()} successfully.`);
            loadCollaborationData();
        } catch (err) {
            alert("Error responding to invitation.");
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { updateUserProfile } = await import('../../services/api');
            
            const body: any = {
                name: profileForm.name,
                phoneNumber: profileForm.phoneNumber,
                institution: profileForm.institution,
                qualification: profileForm.qualification,
                bio: profileForm.bio
            };
            
            if (profileForm.profileImageFile) {
                const formData = new FormData();
                formData.append("Name", profileForm.name);
                formData.append("PhoneNumber", profileForm.phoneNumber);
                formData.append("Institution", profileForm.institution);
                formData.append("Qualification", profileForm.qualification);
                formData.append("Bio", profileForm.bio);
                formData.append("ProfileImage", profileForm.profileImageFile, profileForm.profileImageFile.name);
                
                const token = localStorage.getItem('takeuup_token');
                const res = await fetch('http://localhost:5141/api/UserProfile', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                if (res.ok) {
                    alert("Profile settings & photo updated successfully!");
                } else {
                    alert("Failed to save profile changes.");
                }
            } else {
                await updateUserProfile(body);
                alert("Profile settings updated successfully!");
            }
            loadProfile();
        } catch (err) {
            console.error("Failed to update profile settings", err);
            alert("Error saving profile changes.");
        }
    };

    useEffect(() => {
        const local = localStorage.getItem('takeuup_user');
        if (local) {
            const u = JSON.parse(local);
            setTeacherEmail(u.email || 'teacher@takeuup.com');
        }
        loadProfile();
        loadTeacherQuestions();
        loadCollaborationData();
    }, []);

    // Load teacher questions and compute stats
    const loadTeacherQuestions = async () => {
        setLoading(true);
        try {
            // Fetch all questions from database
            const allQs = await fetchQuestions('', '');
            const local = localStorage.getItem('takeuup_user');
            const email = local ? JSON.parse(local).email : 'teacher@takeuup.com';

            // Filter for questions created by this teacher
            const mine = allQs.filter((q: any) => q.createdBy === email);
            setMyQuestions(mine);

            const free = mine.filter((q: any) => q.accessLevel === 'Free').length;
            const premium = mine.filter((q: any) => q.accessLevel === 'Premium').length;

            setStats({
                totalQuestions: mine.length,
                freeQuestions: free,
                premiumQuestions: premium,
                recentAttempts: mine.length * 15 + Math.floor(Math.random() * 20) // Mock engagement stat
            });
        } catch (e) {
            console.error("Failed to load teacher questions", e);
        }
        setLoading(false);
    };

    // Single Question Submit
    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!singleForm.text.trim() || singleForm.options.some(o => !o.trim())) {
            alert("Please fill in the question text and all options.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                AccessLevel: singleForm.accessLevel,
                Category: singleForm.category,
                Subject: singleForm.subject,
                Text: singleForm.text,
                Options: singleForm.options,
                CorrectAnswer: singleForm.correctAnswer,
                Explanation: singleForm.explanation
            };

            await createQuestion(payload);
            alert("Question uploaded successfully to the database!");
            
            // Reset form
            setSingleForm({
                text: '',
                category: singleForm.category,
                subject: singleForm.subject,
                accessLevel: singleForm.accessLevel,
                correctAnswer: '0',
                explanation: '',
                options: ['', '', '', '']
            });

            loadTeacherQuestions();
        } catch (e) {
            console.error(e);
            alert("Failed to upload question.");
        }
        setLoading(false);
    };

    // Parse friendly text format
    const handleParseBulkText = () => {
        if (!bulkText.trim()) return;

        try {
            const parsedList: any[] = [];
            // Split by double newlines to separate questions
            const blocks = bulkText.split(/\n\s*\n/);

            blocks.forEach(block => {
                const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
                if (lines.length < 5) return; // Must have at least Q + 4 options

                let text = '';
                const options: string[] = [];
                let correctAnswer = '0';
                let explanation = '';

                lines.forEach(line => {
                    if (line.toLowerCase().startsWith('q:')) {
                        text = line.substring(2).trim();
                    } else if (line.match(/^[A-D]\)/i) || line.match(/^[A-D]\./i)) {
                        options.push(line.substring(2).trim());
                    } else if (line.toLowerCase().startsWith('correct:')) {
                        const ansChar = line.substring(8).trim().toUpperCase();
                        correctAnswer = String(ansChar.charCodeAt(0) - 65); // A->0, B->1
                    } else if (line.toLowerCase().startsWith('explanation:')) {
                        explanation = line.substring(12).trim();
                    } else {
                        // Fallback text if Q: prefix is omitted
                        if (!text) text = line;
                        else if (options.length < 4) options.push(line);
                    }
                });

                if (text && options.length === 4) {
                    parsedList.push({
                        text,
                        options,
                        correctAnswer: ['0', '1', '2', '3'].includes(correctAnswer) ? correctAnswer : '0',
                        explanation
                    });
                }
            });

            setBulkParsed(parsedList);
            if (parsedList.length === 0) {
                alert("Could not parse any questions. Check format guidelines!");
            }
        } catch (err) {
            alert("Failed to parse. Please check your text structure.");
        }
    };

    // Bulk Question Submit
    const handleBulkSubmit = async () => {
        if (bulkParsed.length === 0) return;

        setLoading(true);
        try {
            const payload = bulkParsed.map(q => ({
                AccessLevel: bulkAccessLevel,
                Category: bulkCategory,
                Subject: bulkSubject,
                Text: q.text,
                Options: q.options,
                CorrectAnswer: q.correctAnswer,
                Explanation: q.explanation || "No explanation provided."
            }));

            await bulkUploadQuestions(payload);
            alert(`Successfully uploaded ${payload.length} questions in bulk!`);
            setBulkText('');
            setBulkParsed([]);
            loadTeacherQuestions();
        } catch (e) {
            console.error(e);
            alert("Failed to upload bulk questions.");
        }
        setLoading(false);
    };

    // Edit Question Modal Save
    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingQuestion) return;

        setLoading(true);
        try {
            const payload = {
                AccessLevel: editingQuestion.accessLevel,
                Category: editingQuestion.category,
                Subject: editingQuestion.subject,
                Text: editingQuestion.text,
                Options: editingQuestion.options,
                CorrectAnswer: editingQuestion.correctAnswer,
                Explanation: editingQuestion.explanation
            };

            await updateQuestion(editingQuestion.id, payload);
            alert("Question updated successfully!");
            setShowEditModal(false);
            setEditingQuestion(null);
            loadTeacherQuestions();
        } catch (e) {
            console.error(e);
            alert("Failed to update question.");
        }
        setLoading(false);
    };

    // Delete Question
    const handleDeleteQuestion = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question? This action is irreversible.")) return;

        setLoading(true);
        try {
            await deleteQuestion(id);
            alert("Question deleted successfully.");
            loadTeacherQuestions();
        } catch (e) {
            console.error(e);
            alert("Failed to delete question.");
        }
        setLoading(false);
    };

    // --- SECURE QUIZ GENERATOR HELPERS ---
    const addSecureQuestion = () => {
        setSecureQuestions([...secureQuestions, { 
            id: Date.now().toString(), 
            text: '', 
            options: ['', '', '', ''], 
            correctIndex: 0 
        }]);
    };

    const removeSecureQuestion = (id: string) => {
        if (secureQuestions.length > 1) {
            setSecureQuestions(secureQuestions.filter(q => q.id !== id));
        }
    };

    const updateSecureQuestion = (id: string, field: keyof TeacherQuizQuestion, value: any) => {
        setSecureQuestions(secureQuestions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const updateSecureOption = (qId: string, optIndex: number, value: string) => {
        setSecureQuestions(secureQuestions.map(q => {
            if (q.id === qId) {
                const newOptions = [...q.options];
                newOptions[optIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const handlePublishSecureQuiz = () => {
        if (!secureTitle.trim() || secureQuestions.some(q => !q.text.trim() || q.options.some(o => !o.trim()))) {
            alert('Please fill in the quiz title and all questions/options.');
            return;
        }
        setShowPayment(true);
    };

    const simulatePayment = () => {
        setTimeout(() => {
            setIsPaid(true);
            const quizData = {
                title: secureTitle,
                timeLimit: secureTimeLimit,
                questions: secureQuestions
            };
            const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(quizData))));
            const url = `${window.location.origin}/#/quiz/v/${encoded}`;
            setShareUrl(url);
            setShowPayment(false);
        }, 1500);
    };

    // Filtered Questions
    const filteredQuestions = myQuestions.filter(q => {
        const textStr = q.text || '';
        const matchesSearch = textStr.toLowerCase().includes((searchQuery || '').toLowerCase());
        const matchesCategory = filterCategory === 'All' || q.category === filterCategory;
        const matchesSubject = filterSubject === 'All' || q.subject === filterSubject;
        return matchesSearch && matchesCategory && matchesSubject;
    });

    if (loadingProfile) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold text-sm mt-4">Loading your teacher workspace profile...</p>
            </div>
        );
    }

    if (profile && !profile.isTeacherApproved) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
                    <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto text-3xl">⚠️</div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Registration Request Pending</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Your registration request as a teacher is currently pending review by the administrator. Once approved, you can complete your profile and start creating quizzes.
                    </p>
                    <div className="pt-2">
                        <button onClick={() => navigate('/')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors border border-slate-700">Back to Home</button>
                    </div>
                </div>
            </div>
        );
    }

    if (profile && !profile.isProfileCompleted) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden text-left">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="text-center">
                        <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold mb-4">📝</div>
                        <h2 className="text-2xl font-black text-white tracking-tight text-center">Complete Your Profile</h2>
                        <p className="text-xs text-slate-400 mt-1 text-center">Please provide your institutional background details to enable dashboard activities.</p>
                    </div>
                    
                    <form onSubmit={handleCompleteProfileSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                            <input type="text" value={wizardForm.name} onChange={e => setWizardForm({ ...wizardForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                            <input type="text" value={wizardForm.phoneNumber} onChange={e => setWizardForm({ ...wizardForm, phoneNumber: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Institution Name</label>
                            <input type="text" placeholder="e.g. Dhaka University" value={wizardForm.institution} onChange={e => setWizardForm({ ...wizardForm, institution: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Highest Qualification</label>
                            <input type="text" placeholder="e.g. BSc in Physics, MSc" value={wizardForm.qualification} onChange={e => setWizardForm({ ...wizardForm, qualification: e.target.value })} className="w-full bg-[#090d1f] border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Short Bio / About Me</label>
                            <textarea rows={3} placeholder="Tell students about your academic experience, subjects you teach..." value={wizardForm.bio} onChange={e => setWizardForm({ ...wizardForm, bio: e.target.value })} className="w-full bg-[#090d1f] border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                        </div>
                        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 text-sm">Save & Enter Workspace</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans pt-20 pb-16 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px]" />
            
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold mb-3">
                            <Sparkles size={12} /> Teacher Workspace
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{teacherName}</span>
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Manage educational quizzes, questions bank, and secured student exams.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {profile?.profileImageUrl && (
                            <img src={getFullImageUrl(profile.profileImageUrl)} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0" />
                        )}
                        <span className="text-xs bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-400 font-bold">
                            Logged as: <strong className="text-white">{teacherEmail}</strong>
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Navigation Sidebar */}
                    <div className="lg:col-span-1 space-y-3 text-left">
                        {[
                            { id: 'overview', label: 'Overview & Stats', icon: <BarChart3 size={18} /> },
                            { id: 'single', label: 'Upload Question', icon: <Plus size={18} /> },
                            { id: 'bulk', label: 'Bulk Question Uploader', icon: <UploadCloud size={18} /> },
                            { id: 'manage', label: 'Manage Questions Bank', icon: <ListChecks size={18} /> },
                            { id: 'secure', label: 'Create Secured Quiz', icon: <ShieldCheck size={18} /> },
                            { id: 'collaboration', label: 'Collaboration Network', icon: <Users size={18} /> },
                            { id: 'profile_settings', label: 'Profile Settings', icon: <GraduationCap size={18} /> }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === t.id 
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/25' 
                                    : 'bg-slate-900/40 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Right Workspace Content Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {/* TAB 1: OVERVIEW & STATS */}
                            {activeTab === 'overview' && (
                                <motion.div 
                                    key="overview"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-8 text-left"
                                >
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Total Uploaded', val: stats.totalQuestions, icon: <HelpCircle size={22} className="text-cyan-400" />, desc: 'Educational questions' },
                                            { label: 'Free Tier Qs', val: stats.freeQuestions, icon: <Zap size={22} className="text-yellow-400" />, desc: 'Available to all' },
                                            { label: 'Premium Qs', val: stats.premiumQuestions, icon: <Crown size={22} className="text-purple-400" />, desc: 'Subscription locked' },
                                            { label: 'Recent Engagement', val: stats.recentAttempts, icon: <Users size={22} className="text-emerald-400" />, desc: 'Student quiz attempts' }
                                        ].map((card, i) => (
                                            <div key={i} className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full translate-x-4 -translate-y-4" />
                                                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center mb-4 border border-slate-800">
                                                    {card.icon}
                                                </div>
                                                <div className="text-3xl font-black text-white group-hover:scale-105 transition-transform duration-300 origin-left">{card.val}</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-2">{card.label}</div>
                                                <div className="text-[10px] text-slate-500 mt-1">{card.desc}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Info/Guide banner */}
                                    <div className="bg-gradient-to-r from-blue-950/40 to-cyan-950/40 border border-blue-900/40 p-6 rounded-2xl flex items-start gap-4">
                                        <Info className="text-cyan-400 shrink-0 mt-1" size={24} />
                                        <div>
                                            <h3 className="font-bold text-white text-base">Portal Upload Guidelines</h3>
                                            <p className="text-sm text-slate-350 mt-1.5 leading-relaxed">
                                                All questions uploaded here will be dynamically synced with the main **Quiz Room** and **Practice Category cards** on the home page. Make sure to supply detailed explanations to support student self-review.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 2: SINGLE QUESTION UPLOADER */}
                            {activeTab === 'single' && (
                                <motion.div 
                                    key="single"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-900/40 border border-slate-850 p-8 rounded-3xl space-y-6 text-left"
                                >
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Plus className="text-cyan-400" /> Upload Single Question</h2>
                                        <p className="text-xs text-slate-400 mt-1">Submit quiz questions with customized answers and visual tags.</p>
                                    </div>


                  {/* Beautiful Guidelines Card */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-6 font-sans">
                      <div className="flex justify-between items-center cursor-pointer select-none font-sans" onClick={() => setShowGuide(!showGuide)}>
                          <div className="flex items-center gap-2.5 font-sans">
                              <BookOpen className="text-cyan-400" size={20} />
                              <div>
                                  <h4 className="font-extrabold text-white text-sm font-sans font-sans">📐 Math Equation & LaTeX Formatting Guide (গাণিতিক সমীকরণ গাইডলাইন)</h4>
                                  <p className="text-[11px] text-slate-400 font-sans">Click to view cheat-sheet codes for fractions, roots, sums, integrals, matrices, etc.</p>
                              </div>
                          </div>
                          <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg font-sans">
                              {showGuide ? "Hide Guide 🔼" : "Show Guide 🔽"}
                          </span>
                      </div>

                      {showGuide && (
                          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed animate-in slide-in-from-top-4 duration-300 font-sans">
                              <div className="space-y-3 font-sans">
                                  <h5 className="font-bold text-white uppercase text-[10px] text-cyan-400 font-sans">1. Delimiters (সমীকরণ লেখার নিয়ম)</h5>
                                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300 font-sans">
                                      <li><strong>Inline Math (লাইনের মাঝে সমীকরণ):</strong> Use <code>{"\\\\( ... \\\\)"}</code> or <code>{"$ ... $"}</code>. Example: <code>{"Solve for \\\\(x\\\\): \\\\(x^2 + y^2 = r^2\\\\)"}</code>.</li>
                                      <li><strong>Block Math (আলাদা ব্লকে বড় সমীকরণ):</strong> Use <code>{"\\\\[ ... \\\\]"}</code> or <code>{"$ ... $"}</code>. Example: <code>{"\\\\[E = mc^2\\\\]"}</code>.</li>
                                  </ul>

                                  <h5 className="font-bold text-white uppercase text-[10px] text-cyan-400 mt-4 font-sans font-sans font-sans">2. Common Math Symbols Cheat Sheet (কপি-পেস্ট কোড)</h5>
                                  <div className="overflow-x-auto bg-slate-950 p-2.5 rounded-xl border border-slate-855">
                                      <table className="w-full text-left text-[11px] text-slate-400 font-sans">
                                          <thead>
                                              <tr className="border-b border-slate-800 text-slate-300 font-bold font-sans">
                                                  <th className="py-1">Topic</th>
                                                  <th className="py-1">LaTeX Code</th>
                                                  <th className="py-1 text-right font-sans">Renders As</th>
                                              </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-900 font-sans">
                                              <tr>
                                                  <td className="py-1.5 font-semibold text-slate-200 font-sans">Square Root</td>
                                                  <td className="py-1.5 font-mono"><code>{"\\\\sqrt{a^2 + b^2}"}</code></td>
                                                  <td className="py-1.5 text-right font-bold text-cyan-400">{"\\\\( \\\\sqrt{a^2 + b^2} \\\\)"}</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-1.5 font-semibold text-slate-200 font-sans font-sans">Fractions</td>
                                                  <td className="py-1.5 font-mono"><code>{"\\\\frac{a}{b}"}</code></td>
                                                  <td className="py-1.5 text-right font-bold text-cyan-400 font-sans">{"\\\\( \\\\frac{a}{b} \\\\)"}</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-1.5 font-semibold text-slate-200 font-sans font-sans font-sans font-sans">Quadratic Formula</td>
                                                  <td className="py-1.5 font-mono"><code>{"x = \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a}"}</code></td>
                                                  <td className="py-1.5 text-right font-bold text-cyan-400 font-sans font-sans font-sans font-sans">{"\\\\( x = \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a} \\\\)"}</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-1.5 font-semibold text-slate-200 font-sans font-sans">Binomial Theorem</td>
                                                  <td className="py-1.5 font-mono"><code>{"(x+a)^n = \\\\sum_{k=0}^{n} \\\\binom{n}{k} x^k a^{n-k}"}</code></td>
                                                  <td className="py-1.5 text-right font-bold text-cyan-400">{"\\\\( (x+a)^n = \\\\sum_{k=0}^{n} \\\\binom{n}{k} x^k a^{n-k} \\\\)"}</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-1.5 font-semibold text-slate-200 font-sans">Fourier Series</td>
                                                  <td className="py-1.5 font-mono"><code>{"f(x) = a_0 + \\\\sum_{n=1}^{\\\\infty} (a_n \\\\cos \\\\frac{n\\\\pi x}{L} + b_n \\\\sin \\\\frac{n\\\\pi x}{L})"}</code></td>
                                                  <td className="py-1.5 text-right font-bold text-cyan-400">{"\\\\( f(x) = a_0 + \\\\sum_{n=1}^{\\\\infty} \\\\left(a_n \\\\cos \\\\frac{n\\\\pi x}{L} + b_n \\\\sin \\\\frac{n\\\\pi x}{L}\\\\right) \\\\)"}</td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </div>
                              </div>

                              <div className="space-y-3 font-sans">
                                  <h5 className="font-bold text-white uppercase text-[10px] text-cyan-400">3. MS Word / Excel Equation Entry Steps</h5>
                                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                                      <li><strong>For Word Upload:</strong> Click <i>Insert &gt; Equation</i> in Microsoft Word, select or type any built-in equation (e.g. Fourier Series or Area of Circle), and copy-paste or write them inside the table template cells!</li>
                                      <li><strong>For Excel Upload:</strong> Type the LaTeX formulas (e.g. <code>{"\\\\(\\\\sqrt{a^2+b} = \\\\pi r^2\\\\)"}</code>) directly inside the Excel table cells under Question, Options, and Explanation!</li>
                                      <li><strong>Real-time Preview Check:</strong> When uploading the file, the portal automatically parses the cells and shows you the rendering. Double-check your equations before saving!</li>
                                  </ul>
                              </div>
                          </div>
                      )}
                  </div>


                                    <form onSubmit={handleSingleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Preparation Category</label>
                                                <select 
                                                    value={singleForm.category}
                                                    onChange={e => setSingleForm({ ...singleForm, category: e.target.value, subject: SUBJECTS_BY_CATEGORY[e.target.value][0] })}
                                                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm cursor-pointer"
                                                >
                                                    {EXAM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Subject Topic</label>
                                                <select 
                                                    value={singleForm.subject}
                                                    onChange={e => setSingleForm({ ...singleForm, subject: e.target.value })}
                                                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm cursor-pointer"
                                                >
                                                    {SUBJECTS_BY_CATEGORY[singleForm.category]?.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Access Level</label>
                                                <select 
                                                    value={singleForm.accessLevel}
                                                    onChange={e => setSingleForm({ ...singleForm, accessLevel: e.target.value })}
                                                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm cursor-pointer"
                                                >
                                                    <option value="Free">Free Tier</option>
                                                    <option value="Premium">Premium Subscribers</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Question Text</label>
                                            <textarea 
                                                rows={3}
                                                required
                                                placeholder="e.g. Which of the following is a unit of frequency?"
                                                value={singleForm.text}
                                                onChange={e => setSingleForm({ ...singleForm, text: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                                            />
                                        </div>

                                        {/* Options Grid */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Answer Options & Correct Option</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {singleForm.options.map((opt, idx) => (
                                                    <div key={idx} className="relative flex items-center">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setSingleForm({ ...singleForm, correctAnswer: String(idx) })}
                                                            className={`absolute left-3 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                                                                singleForm.correctAnswer === String(idx) 
                                                                ? 'bg-green-500 border-green-500 text-slate-950 font-bold' 
                                                                : 'border-slate-800 text-slate-600 hover:border-slate-700'
                                                            }`}
                                                        >
                                                            {singleForm.correctAnswer === String(idx) ? <Check size={12} strokeWidth={4} /> : String.fromCharCode(65 + idx)}
                                                        </button>
                                                        <input 
                                                            required
                                                            type="text" 
                                                            placeholder={`Enter Option ${String.fromCharCode(65 + idx)}`}
                                                            value={opt}
                                                            onChange={e => {
                                                                const updated = [...singleForm.options];
                                                                updated[idx] = e.target.value;
                                                                setSingleForm({ ...singleForm, options: updated });
                                                            }}
                                                            className="w-full bg-slate-950 border border-slate-850 pl-12 pr-4 py-2.5 rounded-xl text-white outline-none focus:border-cyan-500 text-sm"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Step-by-Step Explanation</label>
                                            <textarea 
                                                rows={2}
                                                placeholder="Provide scientific reasoning, calculations, or grammar reference context..."
                                                value={singleForm.explanation}
                                                onChange={e => setSingleForm({ ...singleForm, explanation: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                                            />
                                        </div>


                                         {/* Live Preview Panel */}
                                         <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-xs text-slate-300 font-sans">
                                             <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-sans">📝 Live Question Preview</span>
                                             <div className="font-semibold text-slate-100 leading-relaxed font-sans font-sans">
                                                 {singleForm.text || "Start typing your question text..."}
                                             </div>
                                             <div className="grid grid-cols-2 gap-2 pt-1 font-sans font-sans">
                                                 {singleForm.options.map((opt, i) => {
                                                     const isCorrect = String(i) === String(singleForm.correctAnswer);
                                                     return (
                                                         <div key={i} className={`p-2 rounded border text-[11px] ${
                                                             isCorrect 
                                                             ? 'bg-green-500/10 text-green-400 border-green-500/20 font-bold' 
                                                             : 'bg-slate-900 text-slate-400 border-slate-850'
                                                         }`}>
                                                             {i + 1}. {opt || `Option ${i + 1}`}
                                                         </div>
                                                     );
                                                 })}
                                             </div>
                                             {singleForm.explanation && (
                                                 <div className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded border border-slate-855 font-sans font-sans font-sans">
                                                     Explanation: {singleForm.explanation}
                                                 </div>
                                             )}
                                         </div>

                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-900/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                                        >
                                            <Save size={16} /> Save Question to Portal
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* TAB 3: BULK QUESTION UPLOADER */}
                            {activeTab === 'bulk' && (
                                <motion.div 
                                    key="bulk"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6 text-left animate-in fade-in"
                                >
                                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 font-sans">
                                        <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-2 flex items-center gap-2">
                                            <UploadCloud size={18} className="text-cyan-400" /> Bulk File Upload (Excel / Word)
                                        </h3>
                                        
                                        {/* Template Downloads */}
                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-855 space-y-2">
                                            <span className="text-xs text-slate-400 font-semibold block font-sans">Download Templates:</span>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={downloadExcelTemplate}
                                                    className="bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-400 font-bold px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 font-sans"
                                                >
                                                    📊 Excel Template (.xlsx)
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={downloadWordTemplate}
                                                    className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 font-bold px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 font-sans"
                                                >
                                                    📝 Word Template (.doc)
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-slate-500 leading-relaxed pt-1 font-sans">
                                                * Support LaTeX format inside cells (e.g. \\(x^2\\) or \[a/b\]). Correct Answer column supports indices (1-4) or letters (A-D).
                                            </p>
                                        </div>

                                        {/* File Uploader */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase block font-sans">Select Excel or Word File</label>
                                            <input 
                                                type="file" 
                                                accept=".xlsx, .xls, .docx, .doc"
                                                onChange={handleFileUpload}
                                                className="w-full bg-slate-950 border border-slate-855 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-555 text-xs font-sans" 
                                            />
                                        </div>

                                        {isParsing && (
                                            <div className="text-xs text-cyan-400 animate-pulse py-2 font-sans font-sans font-sans">
                                                ⌛ Parsing upload file... please wait.
                                            </div>
                                        )}

                                        {uploadError && (
                                            <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 p-2.5 rounded-xl font-sans">
                                                ⚠️ Error: {uploadError}
                                            </div>
                                        )}

                                        {/* Preview and Save Options */}
                                        {parsedQuestions.length > 0 && (
                                            <div className="space-y-4 pt-2 border-t border-slate-800/60 font-sans">
                                                <div className="flex justify-between items-center font-sans">
                                                    <span className="text-xs font-bold text-green-400 font-sans">
                                                        Parsed {parsedQuestions.length} Questions successfully.
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setParsedQuestions([])}
                                                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans"
                                                        >
                                                            Clear
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={handleBulkUploadSave}
                                                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md shadow-green-900/20 font-sans"
                                                        >
                                                            Save All to Pending
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Preview list */}
                                                <div className="max-h-[300px] overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-855 bg-slate-950/40">
                                                    {parsedQuestions.map((q, idx) => (
                                                        <div key={idx} className="p-3 text-[11px] space-y-1.5 font-sans">
                                                            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase font-sans">
                                                                <span>Q #{idx + 1} ({q.accessLevel})</span>
                                                                <span>{q.category} - {q.subject}</span>
                                                            </div>
                                                            <div className="text-slate-200 font-semibold leading-relaxed font-sans">{q.text}</div>
                                                            
                                                            {/* Options rendering */}
                                                            <div className="grid grid-cols-2 gap-1.5 font-sans font-sans">
                                                                {q.options?.map((opt: string, oIdx: number) => {
                                                                    const isCorrect = String(oIdx) === String(q.correctAnswer);
                                                                    return (
                                                                        <div 
                                                                            key={oIdx} 
                                                                            className={`px-2 py-1 rounded border ${
                                                                                isCorrect 
                                                                                ? 'bg-green-500/10 text-green-400 border-green-500/20 font-bold' 
                                                                                : 'bg-slate-900/40 text-slate-400 border-slate-855'
                                                                            }`}
                                                                        >
                                                                            {oIdx + 1}. {opt}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            {q.explanation && (
                                                                <div className="text-slate-400 italic bg-slate-950/20 p-1.5 rounded border border-slate-900 text-[10px] font-sans font-sans">
                                                                    Explanation: {q.explanation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                            {/* TAB 4: MANAGE QUESTIONS BANK */}
                            {activeTab === 'manage' && (
                                <motion.div 
                                    key="manage"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl space-y-6 text-left"
                                >
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Questions Bank</h2>
                                        <p className="text-xs text-slate-400 mt-1">Review, filter, edit, or delete all educational questions uploaded by you.</p>
                                    </div>

                                    {/* Filtering / Search */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="Search question text..."
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2 text-white outline-none focus:border-cyan-500 text-xs"
                                            />
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                        </div>
                                        <select 
                                            value={filterCategory}
                                            onChange={e => {
                                                setFilterCategory(e.target.value);
                                                setFilterSubject('All');
                                            }}
                                            className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-white outline-none text-xs cursor-pointer"
                                        >
                                            <option value="All">All Categories</option>
                                            {EXAM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                        <select 
                                            value={filterSubject}
                                            onChange={e => setFilterSubject(e.target.value)}
                                            className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-white outline-none text-xs cursor-pointer"
                                        >
                                            <option value="All">All Subjects</option>
                                            {filterCategory !== 'All' && SUBJECTS_BY_CATEGORY[filterCategory]?.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Table / List */}
                                    <div className="overflow-x-auto border border-slate-850 rounded-xl">
                                        <table className="w-full text-left text-xs text-slate-300">
                                            <thead className="bg-slate-950 text-slate-400 uppercase text-[9px] tracking-wider font-bold border-b border-slate-850">
                                                <tr>
                                                    <th className="px-5 py-3">Category</th>
                                                    <th className="px-5 py-3">Subject</th>
                                                    <th className="px-5 py-3">Question Text</th>
                                                    <th className="px-5 py-3">Type</th>
                                                    <th className="px-5 py-3">Status</th>
                                                    <th className="px-5 py-3 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-850 bg-slate-950/20">
                                                {filteredQuestions.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-5 py-8 text-center text-slate-500">No questions found matching the search criteria.</td>
                                                    </tr>
                                                ) : (
                                                    filteredQuestions.map((q) => (
                                                        <tr key={q.id} className="hover:bg-slate-900/30 transition-colors">
                                                            <td className="px-5 py-3 font-bold text-white">{q.category}</td>
                                                            <td className="px-5 py-3"><span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">{q.subject}</span></td>
                                                            <td className="px-5 py-3 max-w-xs">
                                                                <div className="truncate font-semibold text-slate-200" title={q.text}>{q.text}</div>
                                                                {q.status === 'CorrectionRequested' && q.correctionComment && (
                                                                    <div className="text-[10px] text-amber-400 font-semibold mt-1.5 bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg leading-relaxed">
                                                                        ⚠️ Correction feedback: {q.correctionComment}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                    q.accessLevel === 'Premium' 
                                                                    ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' 
                                                                    : 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                                                                }`}>
                                                                    {q.accessLevel}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                                                                    q.status === 'Approved'
                                                                    ? 'bg-green-950/40 text-green-400 border-green-800/40'
                                                                    : q.status === 'CorrectionRequested'
                                                                    ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                                                                    : 'bg-slate-900/40 text-slate-400 border-slate-800'
                                                                }`}>
                                                                    {q.status || 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button 
                                                                        onClick={() => {
                                                                            setEditingQuestion({
                                                                                id: q.id,
                                                                                category: q.category,
                                                                                subject: q.subject,
                                                                                accessLevel: q.accessLevel,
                                                                                text: q.text,
                                                                                options: q.options || ['', '', '', ''],
                                                                                correctAnswer: q.correctAnswer || '0',
                                                                                explanation: q.explanation || ''
                                                                            });
                                                                            setShowEditModal(true);
                                                                        }}
                                                                        className="p-1 hover:bg-slate-800 rounded text-cyan-400 hover:text-cyan-300 transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit size={14} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteQuestion(q.id)}
                                                                        className="p-1 hover:bg-slate-800 rounded text-red-400 hover:text-red-300 transition-colors"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 5: CREATE SECURED PROCTORED QUIZ (Original Workspace Feature) */}
                            {activeTab === 'secure' && (
                                <motion.div 
                                    key="secure"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6 text-left"
                                >
                                    {isPaid ? (
                                        <div className="bg-slate-900/40 border border-slate-850 p-8 rounded-3xl shadow-xl text-center">
                                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Secured Quiz Published!</h2>
                                            <p className="text-slate-400 mb-6">Proctored sharing is active. Copy the link below to send to students.</p>

                                            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center gap-3 mb-6 font-mono text-xs break-all text-slate-350">
                                                <LinkIcon size={16} className="shrink-0 text-cyan-400" />
                                                <span className="flex-1 text-left">{shareUrl}</span>
                                                <button 
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(shareUrl);
                                                        alert('Secure link copied to clipboard!');
                                                    }}
                                                    className="bg-slate-900 p-2 rounded-lg border border-slate-800 hover:bg-slate-850 transition-colors text-white"
                                                >
                                                    <Share2 size={14} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/30">
                                                    <h3 className="font-bold text-cyan-400 flex items-center gap-2 mb-1">
                                                        <ShieldCheck size={16} /> Anti-Cheat Shield
                                                    </h3>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed">Students cannot switch browser tabs, capture screens, or copy questions. Tab swaps terminate the quiz instantly.</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30">
                                                    <h3 className="font-bold text-amber-400 flex items-center gap-2 mb-1">
                                                        <Info size={16} /> Self-Contained URL
                                                    </h3>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed">Questions are fully encrypted inside the URL parameters. Safe, clean, and requires no registration database entries.</p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => { setIsPaid(false); setSecureTitle(''); setSecureQuestions([{ id: '1', text: '', options: ['', '', '', ''], correctIndex: 0 }]); }}
                                                className="mt-8 text-cyan-400 hover:underline text-xs font-bold"
                                            >
                                                Create Another Proctored Quiz
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Meta data section */}
                                            <section className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-400 uppercase">Quiz Exam Title</label>
                                                        <input 
                                                            type="text" 
                                                            value={secureTitle}
                                                            onChange={(e) => setSecureTitle(e.target.value)}
                                                            placeholder="e.g. Physics Midterm - Thermodynamics"
                                                            className="w-full bg-slate-950 border border-slate-850 rounded-xl p-4 focus:border-cyan-500 outline-none text-sm dark:text-white"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                                            <Clock size={14} /> Duration Limit (Minutes)
                                                        </label>
                                                        <input 
                                                            type="number" 
                                                            value={secureTimeLimit}
                                                            onChange={(e) => setSecureTimeLimit(parseInt(e.target.value) || 0)}
                                                            min="1"
                                                            className="w-full bg-slate-950 border border-slate-850 rounded-xl p-4 focus:border-cyan-500 outline-none text-sm dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Questions Builder list */}
                                            <div className="space-y-4">
                                                {secureQuestions.map((q, idx) => (
                                                    <div 
                                                        key={q.id}
                                                        className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl relative group"
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="bg-slate-950 border border-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                                Question {idx + 1}
                                                            </span>
                                                            <button 
                                                                onClick={() => removeSecureQuestion(q.id)}
                                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>

                                                        <input 
                                                            type="text" 
                                                            value={q.text}
                                                            onChange={(e) => updateSecureQuestion(q.id, 'text', e.target.value)}
                                                            placeholder="Enter proctored exam question..."
                                                            className="w-full bg-transparent border-b-2 border-slate-850 p-2 mb-6 text-base font-bold focus:border-cyan-500 outline-none transition-all text-white"
                                                        />

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {q.options.map((opt, optIdx) => (
                                                                <div key={optIdx} className="relative flex items-center">
                                                                    <button
                                                                        onClick={() => updateSecureQuestion(q.id, 'correctIndex', optIdx)}
                                                                        className={`absolute left-4 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                                                                            q.correctIndex === optIdx 
                                                                            ? 'bg-green-500 border-green-500 text-slate-950 font-bold' 
                                                                            : 'border-slate-800 text-slate-600 hover:border-slate-700'
                                                                        }`}
                                                                    >
                                                                        {q.correctIndex === optIdx ? <Check size={12} strokeWidth={4} /> : String.fromCharCode(65 + optIdx)}
                                                                    </button>
                                                                    <input 
                                                                        type="text"
                                                                        value={opt}
                                                                        onChange={(e) => updateSecureOption(q.id, optIdx, e.target.value)}
                                                                        placeholder={`Option ${optIdx + 1}`}
                                                                        className={`w-full bg-slate-950 border border-slate-850 pl-14 p-3 rounded-xl text-white outline-none focus:border-cyan-500 text-xs ${
                                                                            q.correctIndex === optIdx ? 'border-green-500/50' : ''
                                                                        }`}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <button 
                                                    onClick={addSecureQuestion}
                                                    className="flex-1 py-3.5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-bold"
                                                >
                                                    <Plus size={16} /> Add Secure Question
                                                </button>
                                                <button 
                                                    onClick={handlePublishSecureQuiz}
                                                    className="flex-1 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-900/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                                                >
                                                    <Save size={16} /> Publish Secured Quiz
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* TAB 6: COLLABORATION NETWORK */}
                            {activeTab === 'collaboration' && (
                                <motion.div
                                    key="collaboration"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6 text-left"
                                >
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Collaboration Network</h2>
                                            <p className="text-xs text-slate-400">Connect with other educators to share insights and collaborate on student quizzes.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Left Side: Actions and Invites */}
                                        <div className="md:col-span-1 space-y-6">
                                            {/* Send Invite Form */}
                                            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                                                <h3 className="text-sm font-bold text-white mb-3">Invite Teacher</h3>
                                                <form onSubmit={handleSendInvite} className="space-y-3">
                                                    <input
                                                        type="email"
                                                        placeholder="Enter teacher's registered email..."
                                                        value={inviteEmail}
                                                        onChange={e => setInviteEmail(e.target.value)}
                                                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-xs"
                                                        required
                                                    />
                                                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition-all text-xs shadow">
                                                        Send Network Invite
                                                    </button>
                                                </form>
                                            </div>

                                            {/* Received Invites Queue */}
                                            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                                                <h3 className="text-sm font-bold text-white mb-3">Pending Invitations ({invitations.length})</h3>
                                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                                    {invitations.map(inv => (
                                                        <div key={inv.id} className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-2 text-xs">
                                                            <div>
                                                                <div className="font-bold text-white">{inv.senderName}</div>
                                                                <div className="text-[10px] text-slate-500">{inv.senderEmail}</div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleRespondToInvitation(inv.id, 'Accepted')}
                                                                    className="flex-1 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-500/20 py-1.5 rounded-lg font-bold"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRespondToInvitation(inv.id, 'Rejected')}
                                                                    className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 py-1.5 rounded-lg font-bold"
                                                                >
                                                                    Ignore
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {invitations.length === 0 && (
                                                        <p className="text-[11px] text-slate-500 text-center py-4">No pending invitations.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Connections and Directory Search */}
                                        <div className="md:col-span-2 space-y-6">
                                            {/* Connected Network */}
                                            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                                                <h3 className="text-sm font-bold text-white mb-3">Your Connections ({connections.length})</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {connections.map(conn => (
                                                        <div key={conn.userId} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex gap-3 text-xs">
                                                            <div className="w-10 h-10 bg-cyan-600/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-sm font-bold text-cyan-400 shrink-0 overflow-hidden">
                                                                {conn.profileImageUrl ? (
                                                                    <img src={getFullImageUrl(conn.profileImageUrl)} alt={conn.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    (conn.name || '?')[0].toUpperCase()
                                                                )}
                                                            </div>
                                                            <div className="space-y-1 min-w-0 text-left">
                                                                <div className="font-bold text-white truncate">{conn.name}</div>
                                                                <div className="text-[10px] text-slate-500 truncate">{conn.email}</div>
                                                                <div className="text-[9px] text-slate-400 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-md inline-block max-w-full truncate">
                                                                    🏫 {conn.institution || 'N/A'}
                                                                </div>
                                                                {conn.bio && (
                                                                    <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 italic">"{conn.bio}"</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {connections.length === 0 && (
                                                        <p className="col-span-2 text-[11px] text-slate-500 text-center py-8">You haven't added any teacher connections yet.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Teacher Directory Search */}
                                            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                                                <h3 className="text-sm font-bold text-white mb-3">Search Teacher Directory</h3>
                                                <div className="flex gap-2 mb-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Search teachers by name, email, or institution..."
                                                        value={searchQueryTeacher}
                                                        onChange={e => setSearchQueryTeacher(e.target.value)}
                                                        className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
                                                    />
                                                    <button onClick={handleSearchTeachers} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 rounded-xl text-xs transition-colors shadow">
                                                        Search
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    {searchResults.map(peer => (
                                                        <div key={peer.email} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between text-xs gap-3">
                                                            <div className="flex gap-3 items-center min-w-0">
                                                                <div className="w-10 h-10 bg-purple-600/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-sm font-bold text-purple-400 shrink-0 overflow-hidden">
                                                                    {peer.profileImageUrl ? (
                                                                        <img src={getFullImageUrl(peer.profileImageUrl)} alt={peer.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        (peer.name || '?')[0].toUpperCase()
                                                                    )}
                                                                </div>
                                                                <div className="text-left min-w-0">
                                                                    <div className="font-bold text-white truncate">{peer.name}</div>
                                                                    <div className="text-[10px] text-slate-500 truncate">{peer.email}</div>
                                                                    <div className="text-[10px] text-slate-400 mt-0.5">🏫 {peer.institution} | 🎓 {peer.qualification}</div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const { inviteTeacher } = await import('../../services/api');
                                                                        const res = await inviteTeacher(peer.email);
                                                                        alert(res?.message || "Invitation sent successfully.");
                                                                    } catch (err) {
                                                                        alert("Error sending invitation.");
                                                                    }
                                                                }}
                                                                className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] shrink-0"
                                                            >
                                                                Invite
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {searchResults.length === 0 && searchQueryTeacher && (
                                                        <p className="text-[11px] text-slate-500 text-center py-4">No matching teachers found.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 7: PROFILE SETTINGS */}
                            {activeTab === 'profile_settings' && (
                                <motion.div
                                    key="profile_settings"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6 text-left"
                                >
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                                            <p className="text-xs text-slate-400">Update your teacher credentials, institutional background, and biography details.</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                                            {/* Photo Upload Segment */}
                                            <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-slate-800">
                                                <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center text-3xl overflow-hidden shrink-0">
                                                    {profileForm.profileImageUrl ? (
                                                        <img src={getFullImageUrl(profileForm.profileImageUrl)} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (profileForm.name || '?')[0].toUpperCase()
                                                    )}
                                                </div>
                                                <div className="space-y-2 text-center sm:text-left">
                                                    <h4 className="text-sm font-bold text-white">Profile Photo</h4>
                                                    <p className="text-[10px] text-slate-500">Upload a professional photo to present to your students.</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setProfileForm({
                                                                    ...profileForm,
                                                                    profileImageFile: file,
                                                                    profileImageUrl: URL.createObjectURL(file)
                                                                });
                                                            }
                                                        }}
                                                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={profileForm.name}
                                                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-xs"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        value={profileForm.phoneNumber}
                                                        onChange={e => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-xs"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Institution</label>
                                                    <input
                                                        type="text"
                                                        value={profileForm.institution}
                                                        onChange={e => setProfileForm({ ...profileForm, institution: e.target.value })}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-xs"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Qualification</label>
                                                    <input
                                                        type="text"
                                                        value={profileForm.qualification}
                                                        onChange={e => setProfileForm({ ...profileForm, qualification: e.target.value })}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-xs"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Short Bio / Biography</label>
                                                <textarea
                                                    rows={4}
                                                    value={profileForm.bio}
                                                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-xs"
                                                    placeholder="Tell students about your qualifications, teaching methodology, subjects..."
                                                    required
                                                />
                                            </div>

                                            <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow text-xs">
                                                Save Profile Settings
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* EDIT QUESTION MODAL */}
            <AnimatePresence>
                {showEditModal && editingQuestion && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 relative shadow-2xl text-left"
                        >
                            <button 
                                onClick={() => { setShowEditModal(false); setEditingQuestion(null); }}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <X size={18} />
                            </button>

                            <div className="border-b border-slate-800 pb-3 mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Edit size={20} className="text-cyan-400" /> Edit Question Details
                                </h3>
                            </div>

                            <form onSubmit={handleEditSave} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                                        <select 
                                            value={editingQuestion.category}
                                            onChange={e => setEditingQuestion({ ...editingQuestion, category: e.target.value, subject: SUBJECTS_BY_CATEGORY[e.target.value][0] })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white text-xs outline-none cursor-pointer"
                                        >
                                            {EXAM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                                        <select 
                                            value={editingQuestion.subject}
                                            onChange={e => setEditingQuestion({ ...editingQuestion, subject: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white text-xs outline-none cursor-pointer"
                                        >
                                            {SUBJECTS_BY_CATEGORY[editingQuestion.category]?.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Access Level</label>
                                        <select 
                                            value={editingQuestion.accessLevel}
                                            onChange={e => setEditingQuestion({ ...editingQuestion, accessLevel: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white text-xs outline-none cursor-pointer"
                                        >
                                            <option value="Free">Free Tier</option>
                                            <option value="Premium">Premium</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Question Text</label>
                                    <textarea 
                                        rows={3}
                                        required
                                        value={editingQuestion.text}
                                        onChange={e => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-xs outline-none focus:border-cyan-500"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Options</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {editingQuestion.options.map((opt: string, idx: number) => (
                                            <div key={idx} className="relative flex items-center">
                                                <button 
                                                    type="button"
                                                    onClick={() => setEditingQuestion({ ...editingQuestion, correctAnswer: String(idx) })}
                                                    className={`absolute left-3 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors ${
                                                        editingQuestion.correctAnswer === String(idx) 
                                                        ? 'bg-green-500 border-green-500 text-slate-950' 
                                                        : 'border-slate-800 text-slate-600'
                                                    }`}
                                                >
                                                    {editingQuestion.correctAnswer === String(idx) ? <Check size={10} strokeWidth={4} /> : String.fromCharCode(65 + idx)}
                                                </button>
                                                <input 
                                                    required
                                                    type="text" 
                                                    value={opt}
                                                    onChange={e => {
                                                        const updated = [...editingQuestion.options];
                                                        updated[idx] = e.target.value;
                                                        setEditingQuestion({ ...editingQuestion, options: updated });
                                                    }}
                                                    className="w-full bg-slate-950 border border-slate-800 pl-10 pr-3 py-1.5 rounded-lg text-white text-xs outline-none focus:border-cyan-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Explanation</label>
                                    <textarea 
                                        rows={2}
                                        value={editingQuestion.explanation}
                                        onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-xs outline-none focus:border-cyan-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                                    <button 
                                        type="button" 
                                        onClick={() => { setShowEditModal(false); setEditingQuestion(null); }}
                                        className="bg-slate-800 hover:bg-slate-750 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1"
                                    >
                                        <Save size={12} /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PAYMENT MODAL (Secured Quiz) */}
            <AnimatePresence>
                {showPayment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl text-left"
                        >
                            <button 
                                onClick={() => setShowPayment(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <X size={18} />
                            </button>
                            
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <CreditCard className="text-cyan-400" /> Unlock Public Link
                            </h3>
                            <p className="text-xs text-slate-400 mb-6">Pay a small proctor hosting fee to publish your encrypted exam link.</p>

                            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-slate-500 uppercase font-bold">Hosting Charge</span>
                                    <span className="text-base font-mono font-bold text-white">৳50.00</span>
                                </div>
                                <div className="border-t border-slate-850 my-2 pt-2 text-[10px] text-slate-400 space-y-1">
                                    <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> Unlimited student attempts</div>
                                    <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> Anti-tab swap detection active</div>
                                    <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> Self-contained URL encryption</div>
                                </div>
                            </div>

                            <button 
                                onClick={simulatePayment}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                Confirm & Pay ৳50.00
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
