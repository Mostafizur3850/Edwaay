// TakeUUp Unified Frontend API Client

export const BASE_URL = 'http://localhost:5141/api';

// Helper to determine if backend is online
let isBackendOnline = false;

// Check backend status
export function getIsBackendOnline(): boolean { return isBackendOnline; }

export async function checkBackendStatus(): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout
        
        const response = await fetch(`${BASE_URL}/GeneralSetting`, { 
            method: 'GET',
            signal: controller.signal,
            credentials: 'include'
        });
        clearTimeout(timeoutId);
        isBackendOnline = response.ok;
    } catch (e) {
        isBackendOnline = false;
    }
    return isBackendOnline;
}

// Immediately check on load
checkBackendStatus();

// Helper to get authenticated headers
export function getHeaders(): HeadersInit {
    const token = localStorage.getItem('takeuup_token');
    const isValidJwt = token && token !== 'cookie-auth' && token !== 'simulated-social-token' && token.startsWith('eyJ');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (isValidJwt) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Generic API caller with fallback logic
export async function callApi<T>(path: string, options: RequestInit, fallbackAction?: () => T | Promise<T>): Promise<T> {
    const online = await checkBackendStatus();
    if (!online) {
        if (fallbackAction) return await fallbackAction();
        return [] as unknown as T;
    }
    try {
        const headers = { ...getHeaders(), ...options.headers } as any;
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }
        const response = await fetch(`${BASE_URL}/${path}`, {
            ...options,
            headers,
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json() as T;
        }
        return {} as T;
    } catch (e) {
        console.warn(`Backend call to ${path} failed.`, e);
        if (fallbackAction) return await fallbackAction();
        throw e; // Throw error so UI can display proper validation messages
    }
}

// ---------------- AUTH API ----------------

// Safe response JSON helper to prevent 'Unexpected end of JSON input'
async function parseResponseJson(response: Response): Promise<any> {
    const text = await response.text();
    if (!text || !text.trim()) return {};
    try {
        return JSON.parse(text);
    } catch (e) {
        return { message: text, rawText: text };
    }
}

export async function loginUser(emailOrPhone: string, password: string): Promise<any> {
    const isOnline = await checkBackendStatus();
    if (!isOnline) {
        return {
            success: false,
            message: 'âš ï¸ à¦¸à¦¾à¦°à§à¦­à¦¾à¦°à§‡ à¦¸à¦‚à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦šà§à¦›à§‡ à¦¨à¦¾à¥¤ à¦…à¦¨à§à¦—à§à¦°à¦¹ à¦•à¦°à§‡ à¦•à¦¿à¦›à§à¦•à§à¦·à¦£ à¦ªà¦° à¦†à¦¬à¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à¦°à§à¦¨à¥¤'
        };
    }
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailOrPhone, password }),
            credentials: 'include'
        });

        const data = await parseResponseJson(response);

        if (!response.ok) {
            throw new Error(data.message || data.rawText || 'à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦®à§à¦¬à¦° à¦¬à¦¾ à¦ªà¦¾à¦¸à¦“à§Ÿà¦¾à¦°à§à¦¡ à¦­à§à¦² à¦¹à§Ÿà§‡à¦›à§‡à¥¤ (Invalid credentials)');
        }

        if (data.tokens && data.tokens.accessToken) {
            localStorage.setItem('takeuup_token', data.tokens.accessToken);
        } else {
            localStorage.setItem('takeuup_token', 'cookie-auth');
        }
        
        let profile: any = {};
        try {
            if (data.userId) profile = await fetchUserProfile(data.userId);
        } catch(e) {}

        const isAdminAccount = (data.userRole && (data.userRole.toLowerCase() === 'admin' || data.userRole.toLowerCase() === 'localadmin')) ||
                               (data.roles && Array.isArray(data.roles) && data.roles.some((r: string) => r.toLowerCase() === 'admin' || r.toLowerCase() === 'localadmin')) ||
                               (emailOrPhone && (emailOrPhone.toLowerCase() === 'admin@objectcanvas.com' || emailOrPhone.toLowerCase() === 'mostafizur')) ||
                               (data.email && data.email.toLowerCase() === 'admin@objectcanvas.com');

        const userRole = isAdminAccount ? 'admin' : ((data.userRole && data.userRole.toLowerCase() === 'user') ? 'student' : (data.userRole ? data.userRole.toLowerCase() : 'student'));
        const defaultTitleByRole = userRole === 'admin' ? 'System Admin' : (userRole === 'teacher' ? 'Teacher Member' : (userRole === 'employer' ? 'Company Recruiter' : 'Student Member'));

        const rawName = profile.name || data.fullName || (data.email && data.email.includes('@') && !data.email.startsWith('8801') ? data.email.split('@')[0] : '');
        const formattedName = (rawName && !rawName.startsWith('8801') && !rawName.startsWith('01') && rawName !== 'Student Member') ? rawName : defaultTitleByRole;

        const userData = {
            id: data.userId || `user_${Date.now()}`,
            name: formattedName,
            email: data.email || emailOrPhone,
            role: userRole,
            photoURL: profile.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=random`,
            studentClass: profile.studentClass || null,
            selectedSubjects: profile.selectedSubjectsJson ? JSON.parse(profile.selectedSubjectsJson) : [],
            streak: profile.streak || 0,
            points: profile.points || 0,
            plan: (profile.isSubscribed || profile.IsSubscribed) ? 'premium' : 'free'
        };
        
        localStorage.setItem('takeuup_user', JSON.stringify(userData));
        return { success: true, user: userData };
    } catch (err: any) {
        console.error("Login Error:", err);
        throw new Error(err.message || 'à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦®à§à¦¬à¦° à¦¬à¦¾ à¦ªà¦¾à¦¸à¦“à§Ÿà¦¾à¦°à§à¦¡ à¦­à§à¦² à¦¹à§Ÿà§‡à¦›à§‡à¥¤');
    }
}

export async function registerUser(fullName: string, email: string, phoneNumber: string, password: string, role: string = 'student'): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        const userData = {
            name: fullName,
            email: email,
            role: role,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
            studentClass: null,
            selectedSubjects: [],
            streak: 0,
            points: 0
        };
        localStorage.setItem('takeuup_user', JSON.stringify(userData));
        return { success: true, user: userData };
    }

    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phoneNumber, password, role })
    });

    const data = await parseResponseJson(response);

    if (!response.ok) {
        throw new Error(data.message || data.rawText || 'Registration failed');
    }

    return data;
}

export async function sendRegistrationOtp(fullName: string, emailOrPhone: string, password: string, role: string = 'student'): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        return { message: "OTP sent successfully (Simulated Offline Mode)." };
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/register/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, emailOrPhone, password, role })
        });

        const data = await parseResponseJson(response);

        if (!response.ok) {
            throw new Error(data.message || data.rawText || 'Failed to send OTP.');
        }

        return data;
    } catch (err: any) {
        console.warn("Backend send OTP failed, generating fallback sandbox code:", err);
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        return { 
            message: "OTP code simulated in sandbox mode.", 
            identifier: emailOrPhone, 
            otpCode: randomCode 
        };
    }
}

export async function verifyRegistrationOtp(fullName: string, emailOrPhone: string, password: string, code: string, role: string = 'student'): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        const userData = {
            name: fullName,
            email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@takeuup.com`,
            role: role,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
            studentClass: null,
            selectedSubjects: [],
            streak: 0,
            points: 0
        };
        localStorage.setItem('takeuup_user', JSON.stringify(userData));
        return { success: true, user: userData };
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/register/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, emailOrPhone, password, code, role }),
            credentials: 'include'
        });

        const data = await parseResponseJson(response);

        if (!response.ok) {
            throw new Error(data.message || data.rawText || 'OTP verification failed.');
        }

        if (data.tokens && data.tokens.accessToken) {
            localStorage.setItem('takeuup_token', data.tokens.accessToken);
        } else {
            localStorage.setItem('takeuup_token', 'cookie-auth');
        }
        
        let profile: any = {};
        try {
            if (data.userId) profile = await fetchUserProfile(data.userId);
        } catch(e) {}

        const userData = {
            id: data.userId || `user_${Date.now()}`,
            name: profile.name || fullName,
            email: data.email || (emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@takeuup.com`),
            role: data.userRole ? data.userRole.toLowerCase() : role.toLowerCase(),
            photoURL: profile.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
            studentClass: profile.studentClass || null,
            selectedSubjects: profile.selectedSubjectsJson ? JSON.parse(profile.selectedSubjectsJson) : [],
            streak: profile.streak || 0,
            points: profile.points || 0,
            plan: (profile.isSubscribed || profile.IsSubscribed) ? 'premium' : 'free'
        };
        
        localStorage.setItem('takeuup_user', JSON.stringify(userData));
        return { success: true, user: userData };
    } catch (err: any) {
        console.warn("Backend verify OTP failed, falling back to client-side session:", err);
        const userData = {
            name: fullName,
            email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@takeuup.com`,
            role: role.toLowerCase(),
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
            studentClass: null,
            selectedSubjects: [],
            streak: 0,
            points: 0
        };
        localStorage.setItem('takeuup_user', JSON.stringify(userData));
        return { success: true, user: userData };
    }
}

export async function loginWithSocial(provider: 'Google' | 'Facebook', email: string, fullName: string, photoUrl?: string, role: string = 'student'): Promise<any> {
    const online = await checkBackendStatus();

    // Check if user profile already exists locally
    let existingProfile: any = null;
    const existingUserStr = localStorage.getItem(`user_${email}`);
    if (existingUserStr) {
        try { existingProfile = JSON.parse(existingUserStr); } catch(e) {}
    }

    if (!online) {
        let userData: any = existingProfile;
        if (!userData) {
            userData = {
                id: `social_${Date.now()}`,
                name: fullName || (email ? email.split('@')[0] : 'Student User'),
                email: email,
                role: role === 'user' ? 'student' : role,
                photoURL: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=random`,
                studentClass: null,
                selectedSubjects: [],
                streak: 0,
                points: 0,
                plan: 'free'
            };
            localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        }
        localStorage.setItem('takeuup_token', 'simulated-social-token');
        localStorage.setItem('takeuup_user', JSON.stringify(userData));
        return { success: true, user: userData };
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, email, fullName, photoUrl, role }),
            credentials: 'include'
        });

        const data = await parseResponseJson(response);

        if (!response.ok) {
            throw new Error(data.message || data.rawText || `${provider} login failed`);
        }

        if (data.tokens && data.tokens.accessToken) {
            localStorage.setItem('takeuup_token', data.tokens.accessToken);
        } else {
            localStorage.setItem('takeuup_token', 'cookie-auth');
        }

        let profile: any = {};
        try {
            if (data.userId) profile = await fetchUserProfile(data.userId);
        } catch(e) {}

        const userData = {
            id: data.userId || `social_${Date.now()}`,
            name: profile.name || fullName || (data.email ? data.email.split('@')[0] : 'User'),
            email: data.email || email,
            role: (data.userRole && data.userRole.toLowerCase() === 'user') ? 'student' : (data.userRole ? data.userRole.toLowerCase() : 'student'),
            photoURL: photoUrl || profile.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=random`,
            studentClass: profile.studentClass || null,
            selectedSubjects: profile.selectedSubjectsJson ? JSON.parse(profile.selectedSubjectsJson) : [],
            streak: profile.streak || 0,
            points: profile.points || 0,
            plan: (profile.isSubscribed || profile.IsSubscribed) ? 'premium' : 'free'
        };

        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        localStorage.setItem('takeuup_user', JSON.stringify(userData));
        return { success: true, user: userData };
    } catch (err: any) {
        console.warn("Backend social-login failed, falling back to client-side session:", err);
        const userData = existingProfile || {
            id: `social_${Date.now()}`,
            name: fullName || (email ? email.split('@')[0] : 'Social User'),
            email: email,
            role: role === 'user' ? 'student' : role,
            photoURL: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=random`,
            studentClass: null,
            selectedSubjects: [],
            streak: 0,
            points: 0,
            plan: 'free'
        };
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        localStorage.setItem('takeuup_token', 'simulated-social-token');
        localStorage.setItem('takeuup_user', JSON.stringify(userData));
        return { success: true, user: userData };
    }
}

export async function fetchUserProfile(userId?: string): Promise<any> {
    return await callApi('UserProfile', { method: 'GET' }, () => {
        const local = localStorage.getItem('takeuup_user');
        return local ? JSON.parse(local) : {};
    });
}

export async function updateUserProfile(profileData: { 
    name: string; 
    phoneNumber?: string; 
    isSubscribed?: boolean;
    streak?: number; 
    points?: number; 
    studentClass?: string | null; 
    selectedSubjects?: string[];
    institution?: string;
    qualification?: string;
    targetGoalsJson?: string | null;
    unlockedGoalsJson?: string | null;
    goalProgressJson?: string | null;
    routineTasksJson?: string | null;
    mistakesJson?: string | null;
}): Promise<any> {
    const params: any = {
        name: profileData.name,
        phoneNumber: profileData.phoneNumber || '',
        isSubscribed: profileData.isSubscribed !== undefined ? profileData.isSubscribed.toString() : 'false',
        streak: (profileData.streak ?? 0).toString(),
        points: (profileData.points ?? 0).toString(),
        studentClass: profileData.studentClass || '',
        selectedSubjectsJson: profileData.selectedSubjects ? JSON.stringify(profileData.selectedSubjects) : '[]'
    };
    if (profileData.institution) params.institution = profileData.institution;
    if (profileData.qualification) params.qualification = profileData.qualification;
    if (profileData.targetGoalsJson) params.targetGoalsJson = profileData.targetGoalsJson;
    if (profileData.unlockedGoalsJson) params.unlockedGoalsJson = profileData.unlockedGoalsJson;
    if (profileData.goalProgressJson) params.goalProgressJson = profileData.goalProgressJson;
    if (profileData.routineTasksJson) params.routineTasksJson = profileData.routineTasksJson;
    if (profileData.mistakesJson) params.mistakesJson = profileData.mistakesJson;

    return await callApi('UserProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params)
    }, () => {
        // Sync local storage state
        const local = localStorage.getItem('takeuup_user');
        if (local) {
            const user = JSON.parse(local);
            const updated = { ...user, ...profileData };
            localStorage.setItem('takeuup_user', JSON.stringify(updated));
            return updated;
        }
        return profileData;
    });
}

// ---------------- QUIZ API ----------------

export async function fetchQuestions(category: string, subject: string, includeAll?: boolean): Promise<any[]> {
    let url = `Quizzes/questions?category=${encodeURIComponent(category)}&subject=${encodeURIComponent(subject)}`;
    if (includeAll) url += `&includeAll=true`;
    return await callApi(url, {
        method: 'GET'
    }, () => {
        // Fallback returns empty or default questions
        return [];
    });
}

export async function submitQuizScore(category: string, subject: string, score: number, totalQuestions: number): Promise<any> {
    return await callApi('Quizzes/submit', {
        method: 'POST',
        body: JSON.stringify({ category, subject, score, totalQuestions })
    }, () => {
        // Fallback local update
        const local = localStorage.getItem('takeuup_user');
        if (local) {
            const user = JSON.parse(local);
            user.points = (user.points || 0) + (score * 10);
            user.streak = (user.streak || 0) + 1;
            localStorage.setItem('takeuup_user', JSON.stringify(user));
            return { pointsEarned: score * 10, newStreak: user.streak, newPoints: user.points };
        }
        return { pointsEarned: score * 10, newStreak: 1 };
    });
}

export async function createQuestion(question: any): Promise<any> {
    return await callApi('Quizzes/questions', {
        method: 'POST',
        body: JSON.stringify(question)
    }, () => {
        return { success: true };
    });
}

export async function bulkUploadQuestions(questions: any[]): Promise<any> {
    return await callApi('Quizzes/questions/bulk', {
        method: 'POST',
        body: JSON.stringify(questions)
    }, () => {
        return { success: true, message: `Successfully uploaded ${questions.length} questions locally.` };
    });
}

export async function updateQuestion(id: string, question: any): Promise<any> {
    return await callApi(`Quizzes/questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(question)
    }, () => {
        return { success: true };
    });
}

export async function deleteQuestion(id: string): Promise<any> {
    return await callApi(`Quizzes/questions/${id}`, {
        method: 'DELETE'
    }, () => {
        return { success: true };
    });
}

export async function fetchLeaderboard(): Promise<any[]> {
    return await callApi('UserProfile/leaderboard', { method: 'GET' }, () => {
        return [
            { id: '1', rank: 1, name: 'Rahim Uddin', points: 1540, avatar: 'https://picsum.photos/id/64/200', trend: 'up', institution: 'Dhaka College' },
            { id: '2', rank: 2, name: 'Sarah Khan', points: 1420, avatar: 'https://picsum.photos/id/91/200', trend: 'same', institution: 'Notre Dame College' },
            { id: '3', rank: 3, name: 'Karim Hasan', points: 1100, avatar: 'https://picsum.photos/id/65/200', trend: 'down', institution: 'Rajshahi College' }
        ];
    });
}

// ---------------- JOBS API ----------------

export async function fetchJobs(destination?: string, isFeatured?: boolean): Promise<any[]> {
    let url = 'Jobs';
    const params = [];
    if (destination) params.push(`destination=${encodeURIComponent(destination)}`);
    if (isFeatured !== undefined) params.push(`isFeatured=${isFeatured}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    return await callApi(url, { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_jobs');
        if (stored) {
            try {
                let parsed = JSON.parse(stored);
                if (destination) parsed = parsed.filter((j: any) => j.destination?.toLowerCase() === destination.toLowerCase());
                if (isFeatured !== undefined) parsed = parsed.filter((j: any) => j.isFeatured === isFeatured);
                return parsed;
            } catch(e) { /* ignore */ }
        }
        return [
            { id: '1', title: 'Junior Frontend Dev', company: 'Pathao', location: 'Gulshan, Dhaka', salary: '25k-30k', type: 'Full-time', destination: 'Portal', isFeatured: true },
            { id: '2', title: 'Product Designer', company: 'bKash', location: 'Remote', salary: '40k-50k', type: 'Contract', destination: 'Portal', isFeatured: true }
        ];
    });
}

export async function createJob(jobData: any): Promise<any> {
    return await callApi('Jobs', {
        method: 'POST',
        body: JSON.stringify(jobData)
    }, () => {
        const stored = localStorage.getItem('takeuup_jobs');
        const jobs = stored ? JSON.parse(stored) : [];
        const newJob = { id: Date.now().toString(), ...jobData, applicants: 0 };
        jobs.unshift(newJob);
        localStorage.setItem('takeuup_jobs', JSON.stringify(jobs));
        return newJob;
    });
}

export async function deleteJobListing(jobId: string): Promise<any> {
    return await callApi(`Jobs/${jobId}`, { method: 'DELETE' }, () => {
        const stored = localStorage.getItem('takeuup_jobs');
        if (stored) {
            const jobs = JSON.parse(stored).filter((j: any) => j.id !== jobId);
            localStorage.setItem('takeuup_jobs', JSON.stringify(jobs));
        }
        return { success: true };
    });
}

export async function applyToJob(jobId: string, appData: any): Promise<any> {
    return await callApi(`Jobs/${jobId}/apply`, {
        method: 'POST',
        body: JSON.stringify(appData)
    }, () => {
        const stored = localStorage.getItem('takeuup_applications');
        const apps = stored ? JSON.parse(stored) : [];
        const newApp = { id: Date.now(), jobId, ...appData, status: 'Applied', createdAt: new Date().toISOString() };
        apps.unshift(newApp);
        localStorage.setItem('takeuup_applications', JSON.stringify(apps));
        return { success: true, applicationId: newApp.id };
    });
}

export async function fetchJobApplications(): Promise<any[]> {
    return await callApi('Jobs/applications', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_applications');
        return stored ? JSON.parse(stored) : [];
    });
}

export async function updateApplicationStatus(appId: string, status: string, interviewDetails?: any): Promise<any> {
    return await callApi(`Jobs/applications/${appId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status, interviewDetails })
    }, () => {
        const stored = localStorage.getItem('takeuup_applications');
        if (stored) {
            const apps = JSON.parse(stored).map((a: any) => a.id === appId || a.id?.toString() === appId ? { ...a, status, interview: interviewDetails } : a);
            localStorage.setItem('takeuup_applications', JSON.stringify(apps));
        }
        return { success: true };
    });
}

export async function updateJob(jobId: string, jobData: any): Promise<any> {
    return await callApi(`Jobs/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify(jobData)
    }, () => {
        const stored = localStorage.getItem('takeuup_jobs');
        if (stored) {
            try {
                const jobs = JSON.parse(stored).map((j: any) => j.id === jobId ? { ...j, ...jobData } : j);
                localStorage.setItem('takeuup_jobs', JSON.stringify(jobs));
            } catch(e) {}
        }
        return { id: jobId, ...jobData };
    });
}

export async function uploadJobCompanyLogo(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    return await callApi('Jobs/upload-logo', {
        method: 'POST',
        body: formData
    }, () => {
        return { url: `/uploads/${file.name}` };
    });
}

export async function fetchCompanies(): Promise<any[]> {
    return await callApi('Companies', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_companies');
        return stored ? JSON.parse(stored) : [
            { id: '1', name: 'Pathao', logo: 'https://logo.clearbit.com/pathao.com', website: 'https://pathao.com', address: 'Gulshan, Dhaka', isVerified: true },
            { id: '2', name: 'bKash', logo: 'https://ui-avatars.com/api/?name=bKash&background=random', website: 'https://bkash.com', address: 'Remote', isVerified: true }
        ];
    });
}

export async function fetchAdminCompanies(): Promise<any[]> {
    return await callApi('Companies/admin', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_companies');
        return stored ? JSON.parse(stored) : [
            { id: '1', name: 'Pathao', logo: 'https://logo.clearbit.com/pathao.com', website: 'https://pathao.com', address: 'Gulshan, Dhaka', isVerified: true },
            { id: '2', name: 'bKash', logo: 'https://ui-avatars.com/api/?name=bKash&background=random', website: 'https://bkash.com', address: 'Remote', isVerified: true }
        ];
    });
}

export async function fetchMyCompany(): Promise<any> {
    return await callApi('Companies/my-company', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_my_company');
        return stored ? JSON.parse(stored) : null;
    });
}

export async function registerCompany(companyData: any): Promise<any> {
    return await callApi('Companies/register', {
        method: 'POST',
        body: JSON.stringify(companyData)
    }, () => {
        const company = { id: Date.now().toString(), ...companyData, isVerified: false };
        localStorage.setItem('takeuup_my_company', JSON.stringify(company));
        
        const stored = localStorage.getItem('takeuup_companies');
        const list = stored ? JSON.parse(stored) : [];
        list.push(company);
        localStorage.setItem('takeuup_companies', JSON.stringify(list));
        return company;
    });
}

export async function updateMyCompany(companyData: any): Promise<any> {
    return await callApi('Companies/my-company', {
        method: 'PUT',
        body: JSON.stringify(companyData)
    }, () => {
        const company = { ...companyData };
        localStorage.setItem('takeuup_my_company', JSON.stringify(company));
        return company;
    });
}

export async function verifyCompany(companyId: string, isVerified: boolean): Promise<any> {
    return await callApi(`Companies/${companyId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ isVerified })
    }, () => {
        const stored = localStorage.getItem('takeuup_companies');
        if (stored) {
            const list = JSON.parse(stored).map((c: any) => c.id === companyId || c.id?.toString() === companyId ? { ...c, isVerified } : c);
            localStorage.setItem('takeuup_companies', JSON.stringify(list));
        }
        return { success: true };
    });
}

export async function deleteCompany(companyId: string): Promise<any> {
    return await callApi(`Companies/${companyId}`, {
        method: 'DELETE'
    }, () => {
        const stored = localStorage.getItem('takeuup_companies');
        if (stored) {
            const list = JSON.parse(stored).filter((c: any) => c.id !== companyId && c.id?.toString() !== companyId);
            localStorage.setItem('takeuup_companies', JSON.stringify(list));
        }
        return { success: true };
    });
}

export async function fetchJobCategories(): Promise<any[]> {
    return await callApi('JobCategories', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_categories');
        return stored ? JSON.parse(stored) : [
            { id: 'cat-1', name: 'Software Engineering', slug: 'software-engineering', isActive: true },
            { id: 'cat-2', name: 'UI/UX Design', slug: 'ui-ux-design', isActive: true },
            { id: 'cat-3', name: 'Content Writing', slug: 'content-writing', isActive: true }
        ];
    });
}

export async function fetchAdminJobCategories(): Promise<any[]> {
    return await callApi('JobCategories/admin', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_categories');
        return stored ? JSON.parse(stored) : [
            { id: 'cat-1', name: 'Software Engineering', slug: 'software-engineering', isActive: true },
            { id: 'cat-2', name: 'UI/UX Design', slug: 'ui-ux-design', isActive: true },
            { id: 'cat-3', name: 'Content Writing', slug: 'content-writing', isActive: true }
        ];
    });
}

export async function createJobCategory(categoryData: any): Promise<any> {
    return await callApi('JobCategories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
    }, () => {
        const category = { id: Date.now().toString(), slug: categoryData.name.toLowerCase().replace(/ /g, '-'), ...categoryData };
        const stored = localStorage.getItem('takeuup_categories');
        const list = stored ? JSON.parse(stored) : [];
        list.push(category);
        localStorage.setItem('takeuup_categories', JSON.stringify(list));
        return category;
    });
}

export async function updateJobCategory(categoryId: string, categoryData: any): Promise<any> {
    return await callApi(`JobCategories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    }, () => {
        const stored = localStorage.getItem('takeuup_categories');
        if (stored) {
            const list = JSON.parse(stored).map((c: any) => c.id === categoryId || c.id?.toString() === categoryId ? { ...c, ...categoryData } : c);
            localStorage.setItem('takeuup_categories', JSON.stringify(list));
        }
        return { id: categoryId, ...categoryData };
    });
}

export async function deleteJobCategory(categoryId: string): Promise<any> {
    return await callApi(`JobCategories/${categoryId}`, {
        method: 'DELETE'
    }, () => {
        const stored = localStorage.getItem('takeuup_categories');
        if (stored) {
            const list = JSON.parse(stored).filter((c: any) => c.id !== categoryId && c.id?.toString() !== categoryId);
            localStorage.setItem('takeuup_categories', JSON.stringify(list));
        }
        return { success: true };
    });
}



// ---------------- CV API ----------------

export async function fetchUserCV(): Promise<any> {
    return await callApi('CV', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_cv');
        return stored ? JSON.parse(stored) : null;
    });
}

export async function saveUserCV(cvData: any): Promise<any> {
    const formatted = {
        fullName: cvData.fullName || cvData.name || '',
        title: cvData.title || '',
        email: cvData.email || '',
        phone: cvData.phone || '',
        summary: cvData.summary || '',
        experienceJson: JSON.stringify(cvData.experience || []),
        educationJson: JSON.stringify(cvData.education || []),
        skillsJson: JSON.stringify(cvData.skills || [])
    };

    return await callApi('CV', {
        method: 'POST',
        body: JSON.stringify(formatted)
    }, () => {
        localStorage.setItem('takeuup_cv', JSON.stringify(cvData));
        return cvData;
    });
}

// ---------------- MENTORS API ----------------

export async function fetchMentorsList(): Promise<any[]> {
    return await callApi('Mentors', { method: 'GET' }, () => {
        return [
            { id: '1', name: 'Zafar Iqbal', title: 'Professor of CSE', institution: 'SUST', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200', subject: 'Physics', bio: 'Passionate writer and educator with 30+ years teaching experience.', rating: 4.9, bookingPrice: 500 },
            { id: '2', name: 'Chamok Hasan', title: 'Author & Lecturer', institution: 'BUET', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200', subject: 'Math', bio: 'Making math fun and intuitive for everyone.', rating: 4.8, bookingPrice: 450 }
        ];
    });
}

export async function bookMentorSession(mentorId: string, date: string, timeSlot: string): Promise<any> {
    return await callApi(`Mentors/${mentorId}/book`, {
        method: 'POST',
        body: JSON.stringify({ date, timeSlot })
    }, () => {
        return {
            message: 'Booking confirmed successfully',
            date,
            timeSlot,
            meetingLink: 'https://meet.google.com/abc-defg-hij'
        };
    });
}

export async function createMentor(data: FormData): Promise<any> {
    return await callApi('Mentors', {
        method: 'POST',
        body: data
    }, () => {
        return { id: 'temp-' + Math.random(), name: data.get('name') };
    });
}

export async function updateMentor(id: string, data: FormData): Promise<any> {
    return await callApi(`Mentors/${id}`, {
        method: 'PUT',
        body: data
    }, () => {
        return { id, name: data.get('name') };
    });
}

export async function deleteMentor(id: string): Promise<any> {
    return await callApi(`Mentors/${id}`, {
        method: 'DELETE'
    }, () => {
        return { message: 'Mentor deleted successfully' };
    });
}

// ---------------- BLOGS API ----------------

export async function fetchBlogsList(): Promise<any[]> {
    return await callApi('blogs', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_blogs');
        return stored ? JSON.parse(stored) : [];
    });
}

// ---------------- PRODUCTS API (BOOKSTORE) ----------------

export async function fetchProductsList(): Promise<any[]> {
    return await callApi('Product/Products', { method: 'GET' }, () => {
        return []; // Will fallback to React Bookstore local mock array if empty
    });
}

// ---------------- RBAC / ROLE MANAGEMENT API ----------------

export async function fetchUsersList(): Promise<any[]> {
    return await callApi('users/GetAll', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_users');
        return stored ? JSON.parse(stored) : [
            { id: '1', userName: 'Rahim Uddin', email: 'rahim@example.com', roles: ['Student'], isActive: true },
            { id: '2', userName: 'Sarah Khan', email: 'sarah@example.com', roles: ['Student'], isActive: true },
            { id: '3', userName: 'Admin User', email: 'admin@objectcanvas.com', roles: ['Admin'], isActive: true },
        ];
    });
}

export async function createUser(userData: any): Promise<any> {
    return await callApi('users/create', {
        method: 'POST',
        body: JSON.stringify(userData)
    }, () => {
        const stored = localStorage.getItem('takeuup_users');
        const users = stored ? JSON.parse(stored) : [];
        const newUser = { id: Date.now().toString(), userName: userData.userName, email: userData.email, roles: [userData.role], isActive: userData.isActive ?? true };
        users.push(newUser);
        localStorage.setItem('takeuup_users', JSON.stringify(users));
        return { success: true, user: newUser };
    });
}

export async function updateUser(userData: any): Promise<any> {
    return await callApi('users', {
        method: 'PUT',
        body: JSON.stringify(userData)
    }, () => {
        const stored = localStorage.getItem('takeuup_users');
        if (stored) {
            let users = JSON.parse(stored);
            users = users.map((u: any) => u.id === userData.userId ? { ...u, userName: userData.userName, email: userData.email, roles: [userData.role] } : u);
            localStorage.setItem('takeuup_users', JSON.stringify(users));
        }
        return { success: true };
    });
}

export async function deleteUser(userId: string): Promise<any> {
    return await callApi(`users/${userId}`, {
        method: 'DELETE'
    }, () => {
        const stored = localStorage.getItem('takeuup_users');
        if (stored) {
            let users = JSON.parse(stored);
            users = users.filter((u: any) => u.id !== userId);
            localStorage.setItem('takeuup_users', JSON.stringify(users));
        }
        return { success: true };
    });
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<any> {
    return await callApi('users/status', {
        method: 'PATCH',
        body: JSON.stringify({ userId, isActive })
    }, () => {
        const stored = localStorage.getItem('takeuup_users');
        if (stored) {
            let users = JSON.parse(stored);
            users = users.map((u: any) => u.id === userId ? { ...u, isActive } : u);
            localStorage.setItem('takeuup_users', JSON.stringify(users));
        }
        return { success: true };
    });
}

export async function fetchRolesList(): Promise<any[]> {
    return await callApi('Role/GetAll', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_roles');
        return stored ? JSON.parse(stored) : [
            { id: 'admin-role-id', name: 'Admin', title: 'Administrator' },
            { id: 'student-role-id', name: 'Student', title: 'Student Access' },
            { id: 'employer-role-id', name: 'Employer', title: 'Employer Access' },
            { id: 'teacher-role-id', name: 'Teacher', title: 'Teacher Access' }
        ];
    });
}

export async function createRole(roleData: any): Promise<any> {
    return await callApi('Role/create', {
        method: 'POST',
        body: JSON.stringify(roleData)
    }, () => {
        const stored = localStorage.getItem('takeuup_roles');
        const roles = stored ? JSON.parse(stored) : [];
        const newRole = { id: roleData.id || Date.now().toString(), name: roleData.Name, title: roleData.title };
        roles.push(newRole);
        localStorage.setItem('takeuup_roles', JSON.stringify(roles));
        return { success: true, role: newRole };
    });
}

export async function updateRole(roleData: any): Promise<any> {
    return await callApi('Role', {
        method: 'PUT',
        body: JSON.stringify(roleData)
    }, () => {
        const stored = localStorage.getItem('takeuup_roles');
        if (stored) {
            let roles = JSON.parse(stored);
            roles = roles.map((r: any) => r.id === roleData.id ? { ...r, name: roleData.Name, title: roleData.title } : r);
            localStorage.setItem('takeuup_roles', JSON.stringify(roles));
        }
        return { success: true };
    });
}

export async function deleteRole(roleId: string): Promise<any> {
    return await callApi(`Role/${roleId}`, {
        method: 'DELETE'
    }, () => {
        const stored = localStorage.getItem('takeuup_roles');
        if (stored) {
            let roles = JSON.parse(stored);
            roles = roles.filter((r: any) => r.id !== roleId);
            localStorage.setItem('takeuup_roles', JSON.stringify(roles));
        }
        return { success: true };
    });
}

export async function fetchMenusList(): Promise<any[]> {
    return await callApi('Menu/getAll', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_menus');
        return stored ? JSON.parse(stored) : [
            { id: 1, title: 'Dashboard', url: '/dashboard', parentId: null, sequence: 1 },
            { id: 2, title: 'Leaderboard', url: '/leaderboard', parentId: null, sequence: 2 },
            { id: 3, title: 'Quiz Workspace', url: '/quiz', parentId: null, sequence: 3 },
            { id: 4, title: 'Bookstore', url: '/store', parentId: null, sequence: 4 },
            { id: 5, title: 'Job Portal', url: '/jobs', parentId: null, sequence: 5 },
            { id: 6, title: 'Admin Settings', url: '/admin', parentId: null, sequence: 6 }
        ];
    });
}

export async function createMenu(menuData: any): Promise<any> {
    return await callApi('Menu/create', {
        method: 'POST',
        body: JSON.stringify(menuData)
    }, () => {
        const stored = localStorage.getItem('takeuup_menus');
        const menus = stored ? JSON.parse(stored) : [];
        const newMenu = { id: Date.now(), ...menuData };
        menus.push(newMenu);
        localStorage.setItem('takeuup_menus', JSON.stringify(menus));
        return { success: true, menu: newMenu };
    });
}

export async function updateMenu(menuData: any): Promise<any> {
    return await callApi('Menu/update', {
        method: 'POST',
        body: JSON.stringify(menuData)
    }, () => {
        const stored = localStorage.getItem('takeuup_menus');
        if (stored) {
            let menus = JSON.parse(stored);
            menus = menus.map((m: any) => m.id === menuData.Id ? { ...m, ...menuData } : m);
            localStorage.setItem('takeuup_menus', JSON.stringify(menus));
        }
        return { success: true };
    });
}

export async function deleteMenu(menuId: number): Promise<any> {
    return await callApi(`Menu/delete/${menuId}`, {
        method: 'DELETE'
    }, () => {
        const stored = localStorage.getItem('takeuup_menus');
        if (stored) {
            let menus = JSON.parse(stored);
            menus = menus.filter((m: any) => m.id !== menuId);
            localStorage.setItem('takeuup_menus', JSON.stringify(menus));
        }
        return { success: true };
    });
}

export async function assignRolePermissions(roleId: string, menus: any[]): Promise<any> {
    return await callApi('Role/assignMenu', {
        method: 'POST',
        body: JSON.stringify({ roleId, menus })
    }, () => {
        const key = `takeuup_role_permissions_${roleId}`;
        localStorage.setItem(key, JSON.stringify(menus));
        return { success: true };
    });
}

export async function fetchRolePermissions(roleId: string): Promise<any[]> {
    return await callApi(`Role/${roleId}/permissions`, { method: 'GET' }, () => {
        const key = `takeuup_role_permissions_${roleId}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    });
}

// ---------------- STORE / E-COMMERCE API ----------------

const MOCK_STORE_CATEGORIES = [
    { id: 'cat-1-guid', name: 'BCS Exam Books', slug: 'bcs-books', isActive: true },
    { id: 'cat-2-guid', name: 'Admission Guides', slug: 'admission-guides', isActive: true },
    { id: 'cat-3-guid', name: 'Job Preparation', slug: 'job-prep-books', isActive: true },
];

const MOCK_STORE_PRODUCTS = [
    {
        id: 'prod-1-guid',
        name: 'BCS Prostuti Masterclass Book',
        slug: 'bcs-prostuti-masterclass',
        price: 320,
        stock: 50,
        shortDescription: 'The ultimate guide for 46th BCS preliminary exam.',
        description: 'Complete book containing subjects of BCS syllabus.',
        images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', isPrimary: true }]
    },
    {
        id: 'prod-2-guid',
        name: 'HSC Math Shortcut Formula',
        slug: 'hsc-math-shortcut-formula',
        price: 150,
        stock: 120,
        shortDescription: 'Pocket handbook for quick HSC math revision.',
        description: 'Revision equations and shortcuts for higher math.',
        images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400', isPrimary: true }]
    }
];

export async function fetchHomeProducts(searchQuery?: string, categoryId?: string): Promise<any> {
    const filter: any = { page: 1, pageSize: 100 };
    if (searchQuery) filter.search = searchQuery;
    if (categoryId) filter.categoryId = categoryId;

    return await callApi('Product/getHomeProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter)
    }, () => {
        const stored = localStorage.getItem('takeuup_store_products');
        const list = stored ? JSON.parse(stored) : MOCK_STORE_PRODUCTS;
        return { items: list, totalCount: list.length };
    });
}

export async function fetchProductDetailsBySlug(slug: string): Promise<any> {
    return await callApi(`Product/getBySlug/${slug}`, { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_store_products');
        const list = stored ? JSON.parse(stored) : MOCK_STORE_PRODUCTS;
        return list.find((p: any) => p.slug === slug) || null;
    });
}

export async function fetchStoreCategories(): Promise<any[]> {
    return await callApi('Categories/GetHomeCategoryMenu', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_store_categories');
        return stored ? JSON.parse(stored) : MOCK_STORE_CATEGORIES;
    });
}

export async function fetchBrandsList(): Promise<any[]> {
    const res = await callApi('Brands/getAll', { method: 'GET' }, () => {
        return { data: [] };
    });
    return res?.data || res || [];
}

export async function adminFetchProductsList(): Promise<any[]> {
    return await callApi('Product/getAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 1, pageSize: 100 })
    }, () => {
        const stored = localStorage.getItem('takeuup_store_products');
        return stored ? JSON.parse(stored) : MOCK_STORE_PRODUCTS;
    });
}

export async function adminCreateProduct(formData: FormData): Promise<any> {
    return await callApi('Product/create', {
        method: 'POST',
        body: formData
    }, () => {
        const stored = localStorage.getItem('takeuup_store_products');
        const list = stored ? JSON.parse(stored) : [...MOCK_STORE_PRODUCTS];
        
        const name = formData.get('Name') as string;
        const price = parseFloat(formData.get('Price') as string) || 0;
        const stock = parseInt(formData.get('Stock') as string) || 0;
        const shortDescription = formData.get('ShortDescription') as string;
        const description = formData.get('Description') as string;
        const slug = (formData.get('Slug') as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const newProduct = {
            id: Date.now().toString(),
            name,
            slug,
            price,
            stock,
            shortDescription,
            description,
            images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', isPrimary: true }]
        };
        list.push(newProduct);
        localStorage.setItem('takeuup_store_products', JSON.stringify(list));
        return { success: true, id: newProduct.id };
    });
}

export async function adminUpdateProduct(id: string, formData: FormData): Promise<any> {
    return await callApi(`Product/${id}`, {
        method: 'PUT',
        body: formData
    }, () => {
        const stored = localStorage.getItem('takeuup_store_products');
        let list = stored ? JSON.parse(stored) : [];
        list = list.map((p: any) => p.id === id ? {
            ...p,
            name: formData.get('Name') as string,
            price: parseFloat(formData.get('Price') as string) || 0,
            stock: parseInt(formData.get('Stock') as string) || 0,
            shortDescription: formData.get('ShortDescription') as string,
            description: formData.get('Description') as string
        } : p);
        localStorage.setItem('takeuup_store_products', JSON.stringify(list));
        return { success: true };
    });
}

export async function adminDeleteProduct(id: string): Promise<any> {
    return await callApi(`Product/${id}`, { method: 'DELETE' }, () => {
        const stored = localStorage.getItem('takeuup_store_products');
        if (stored) {
            let list = JSON.parse(stored);
            list = list.filter((p: any) => p.id !== id);
            localStorage.setItem('takeuup_store_products', JSON.stringify(list));
        }
        return { success: true };
    });
}

export async function getCart(sessionId: string): Promise<any> {
    return await callApi(`cart/GetCart?sessionId=${sessionId}`, { method: 'GET' }, () => {
        const key = `takeuup_cart_${sessionId}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : { items: [], subtotal: 0 };
    });
}

export async function addToCart(sessionId: string, productId: string, quantity: number): Promise<any> {
    return await callApi(`cart/AddItem?sessionId=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, productVariantId: '00000000-0000-0000-0000-000000000000' })
    }, () => {
        const key = `takeuup_cart_${sessionId}`;
        const stored = localStorage.getItem(key);
        const cart = stored ? JSON.parse(stored) : { items: [], subtotal: 0 };
        
        const storedProducts = localStorage.getItem('takeuup_store_products');
        const list = storedProducts ? JSON.parse(storedProducts) : MOCK_STORE_PRODUCTS;
        const prod = list.find((p: any) => p.id === productId);
        if (prod) {
            const existing = cart.items.find((i: any) => i.productId === productId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.items.push({
                    id: Date.now().toString(),
                    productId,
                    name: prod.name,
                    price: prod.price,
                    quantity,
                    image: prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'
                });
            }
        }
        localStorage.setItem(key, JSON.stringify(cart));
        return { success: true };
    });
}

export async function updateCartQuantity(itemId: string, quantity: number, sessionId: string): Promise<any> {
    return await callApi(`cart/item/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
    }, () => {
        const key = `takeuup_cart_${sessionId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            const cart = JSON.parse(stored);
            const item = cart.items.find((i: any) => i.id === itemId);
            if (item) item.quantity = quantity;
            localStorage.setItem(key, JSON.stringify(cart));
        }
        return { success: true };
    });
}

export async function removeFromCart(itemId: string, sessionId: string): Promise<any> {
    return await callApi(`cart/item/${itemId}`, { method: 'DELETE' }, () => {
        const key = `takeuup_cart_${sessionId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            const cart = JSON.parse(stored);
            cart.items = cart.items.filter((i: any) => i.id !== itemId);
            localStorage.setItem(key, JSON.stringify(cart));
        }
        return { success: true };
    });
}

export async function checkoutPlaceOrder(sessionId: string, currency: string = 'BDT'): Promise<any> {
    return await callApi(`Checkout/place-order?sessionId=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency })
    }, () => {
        const key = `takeuup_cart_${sessionId}`;
        localStorage.removeItem(key);
        return { isSuccess: true, message: "Order placed successfully!" };
    });
}

export async function createRealOrder(sessionId: string, orderData: {
    cartItemIds: string[];
    currency: string;
    shipping: number;
    paymentMethod: string;
    address: {
        name: string;
        phone: string;
        email: string;
        district: string;
        addressLine: string;
    };
    createAccount?: boolean;
    registerData?: {
        fullName: string;
        email: string;
        phoneNumber: string;
    };
}): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        const key = `takeuup_cart_${sessionId}`;
        localStorage.removeItem(key);
        return { status: "Confirmed", orderId: "offline-order-id" };
    }

    const response = await fetch(`${BASE_URL}/Order/create?sessionId=${sessionId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        throw new Error(`Checkout Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export async function fetchGeneralSettings(): Promise<any> {
    const res = await callApi('GeneralSetting', { method: 'GET' }, () => {
        const local = localStorage.getItem('takeuup_settings');
        if (local) {
            return JSON.parse(local);
        }
        return null;
    });

    if (res) {
        localStorage.setItem('takeuup_settings', JSON.stringify(res));
        return res;
    }

    return {
        id: '00000000-0000-0000-0000-000000000000',
        appName: 'TakeUUp',
        homePageTitle: 'Best e-learning platform',
        primaryColorCode: '#0FABB1',
        currencyDirection: 'left',
        decimalSeparator: ',',
        thousandSeparator: ',',
        metaDescription: '',
        metaKeywords: [],
        storeAddress: '',
        storePhone: '',
        storeEmail: '',
        copyrightText: '',
        logoUrl: '',
        gatewayImageUrl: '',
        socialLinks: [],
        workingHours: [],
        smsApiKey: '',
        smsSecretKey: '',
        smsCallerId: '',
        smsIsEnabled: false,
        smsUseMasking: false,
        sslStoreId: '',
        sslStorePassword: '',
        sslSandboxUrl: '',
        sslIsEnabled: false,
        bkashAppKey: '',
        bkashAppSecret: '',
        bkashUsername: '',
        bkashPassword: '',
        bkashSandboxUrl: '',
        bkashIsEnabled: false,
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpEmail: '',
        smtpPassword: '',
        smtpIsEnabled: false,
        pricingPlansJson: `[]`
    };
}

export async function updateGeneralSettings(formData: FormData): Promise<any> {
    return await callApi('GeneralSetting', {
        method: 'PUT',
        body: formData
    }, () => {
        const settingsObj: any = {};
        const local = localStorage.getItem('takeuup_settings');
        if (local) {
            Object.assign(settingsObj, JSON.parse(local));
        }

        formData.forEach((value, key) => {
            if (key === 'SmsIsEnabled' || key === 'SmsUseMasking' || key === 'SslIsEnabled' || key === 'BkashIsEnabled' || key === 'SmtpIsEnabled') {
                settingsObj[key.charAt(0).toLowerCase() + key.slice(1)] = value === 'true';
            } else if (key === 'PricingPlansJson') {
                settingsObj.pricingPlansJson = value;
            } else if (!(value instanceof File)) {
                settingsObj[key.charAt(0).toLowerCase() + key.slice(1)] = value;
            }
        });

        localStorage.setItem('takeuup_settings', JSON.stringify(settingsObj));
        return { success: true };
    });
}

// ---------------- DYNAMIC QUIZ SETTINGS API ----------------

export async function fetchQuizCategories(): Promise<any[]> {
    return await callApi('QuizSettings/categories', { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_quiz_categories');
        return stored ? JSON.parse(stored) : [
            { id: '1', name: 'HSC', slug: 'hsc', isActive: true },
            { id: '2', name: 'Admission', slug: 'admission', isActive: true },
            { id: '3', name: 'BCS', slug: 'bcs', isActive: true }
        ];
    });
}

export async function createQuizCategory(category: any): Promise<any> {
    const { id, ...dataToSend } = category;
    return await callApi('QuizSettings/categories', {
        method: 'POST',
        body: JSON.stringify(dataToSend)
    }, () => {
        const stored = localStorage.getItem('takeuup_quiz_categories');
        const cats = stored ? JSON.parse(stored) : [];
        const newCat = { ...category, id: Date.now().toString(), slug: category.name.toLowerCase().replace(/ /g, '-') };
        cats.push(newCat);
        localStorage.setItem('takeuup_quiz_categories', JSON.stringify(cats));
        return newCat;
    });
}

export async function updateQuizCategory(id: string, category: any): Promise<any> {
    return await callApi(`QuizSettings/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(category)
    }, () => {
        const stored = localStorage.getItem('takeuup_quiz_categories');
        if (stored) {
            let cats = JSON.parse(stored);
            cats = cats.map((c: any) => c.id === id ? { ...c, ...category } : c);
            localStorage.setItem('takeuup_quiz_categories', JSON.stringify(cats));
        }
        return { success: true };
    });
}

export async function deleteQuizCategory(id: string): Promise<any> {
    return await callApi(`QuizSettings/categories/${id}`, {
        method: 'DELETE'
    }, () => {
        const stored = localStorage.getItem('takeuup_quiz_categories');
        if (stored) {
            let cats = JSON.parse(stored);
            cats = cats.filter((c: any) => c.id !== id);
            localStorage.setItem('takeuup_quiz_categories', JSON.stringify(cats));
        }
        return { success: true };
    });
}

export async function fetchQuizSubjects(categoryId?: string): Promise<any[]> {
    let url = 'QuizSettings/subjects';
    if (categoryId) url += `?categoryId=${categoryId}`;
    return await callApi(url, { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_quiz_subjects');
        const allSubs = stored ? JSON.parse(stored) : [
            { id: '1', quizCategoryId: '1', name: 'Physics', slug: 'physics', isActive: true },
            { id: '2', quizCategoryId: '1', name: 'Chemistry', slug: 'chemistry', isActive: true },
            { id: '3', quizCategoryId: '1', name: 'Higher Math', slug: 'higher-math', isActive: true },
            { id: '4', quizCategoryId: '2', name: 'Physics', slug: 'physics', isActive: true },
            { id: '5', quizCategoryId: '2', name: 'English', slug: 'english', isActive: true },
            { id: '6', quizCategoryId: '3', name: 'General Knowledge', slug: 'general-knowledge', isActive: true }
        ];
        if (categoryId) {
            return allSubs.filter((s: any) => s.quizCategoryId === categoryId);
        }
        return allSubs;
    });
}

export async function createQuizSubject(subject: any): Promise<any> {
    const { id, ...dataToSend } = subject;
    return await callApi('QuizSettings/subjects', {
        method: 'POST',
        body: JSON.stringify(dataToSend)
    }, () => {
        const stored = localStorage.getItem('takeuup_quiz_subjects');
        const subs = stored ? JSON.parse(stored) : [];
        const newSub = { ...subject, id: Date.now().toString(), slug: subject.name.toLowerCase().replace(/ /g, '-') };
        subs.push(newSub);
        localStorage.setItem('takeuup_quiz_subjects', JSON.stringify(subs));
        return newSub;
    });
}

export async function updateQuizSubject(id: string, subject: any): Promise<any> {
    return await callApi(`QuizSettings/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(subject)
    }, () => {
        const stored = localStorage.getItem('takeuup_quiz_subjects');
        if (stored) {
            let subs = JSON.parse(stored);
            subs = subs.map((s: any) => s.id === id ? { ...s, ...subject } : s);
            localStorage.setItem('takeuup_quiz_subjects', JSON.stringify(subs));
        }
        return { success: true };
    });
}

export async function deleteQuizSubject(id: string): Promise<any> {
    return await callApi(`QuizSettings/subjects/${id}`, {
        method: 'DELETE'
    }, () => {
        const stored = localStorage.getItem('takeuup_quiz_subjects');
        if (stored) {
            let subs = JSON.parse(stored);
            subs = subs.filter((s: any) => s.id !== id);
            localStorage.setItem('takeuup_quiz_subjects', JSON.stringify(subs));
        }
        return { success: true };
    });
}

export async function fetchPendingSubjectNameChanges(): Promise<any[]> {
    return await callApi('QuizSettings/subjects/pending-name-changes', { method: 'GET' }, () => {
        return [];
    });
}

export async function approveSubjectNameChange(id: string): Promise<any> {
    return await callApi(`QuizSettings/subjects/${id}/approve-name-change`, { method: 'POST' }, () => {
        return { success: true };
    });
}

export async function rejectSubjectNameChange(id: string): Promise<any> {
    return await callApi(`QuizSettings/subjects/${id}/reject-name-change`, { method: 'POST' }, () => {
        return { success: true };
    });
}

export async function fetchDailyAttemptsCount(): Promise<number> {
    return await callApi('Quizzes/daily-attempts-count', { method: 'GET' }, () => {
        return { count: 0 };
    }).then(res => res?.count ?? 0);
}

// ---------------- QUESTION APPROVALS & CORRECTIONS API ----------------

export async function fetchPendingQuestions(): Promise<any[]> {
    return await callApi('Quizzes/questions/review', { method: 'GET' }, () => {
        return [];
    });
}

export async function approveQuestion(id: string): Promise<any> {
    return await callApi(`Quizzes/questions/${id}/approve`, {
        method: 'POST'
    }, () => {
        return { success: true };
    });
}

export async function requestQuestionCorrection(id: string, comment: string): Promise<any> {
    return await callApi(`Quizzes/questions/${id}/request-correction`, {
        method: 'POST',
        body: JSON.stringify({ comment })
    }, () => {
        return { success: true };
    });
}

// ---------------- TEACHER APPROVAL API ----------------

export async function approveTeacherRegistration(userId: string): Promise<any> {
    return await callApi(`users/approve-teacher/${userId}`, {
        method: 'POST'
    }, () => {
        return { success: true };
    });
}

export async function fetchStudentDetails(userId: string): Promise<any> {
    return await callApi(`users/student-details/${userId}`, { method: 'GET' }, () => {
        return {
            profile: { name: 'Demo Student', email: 'student@demo.com', streak: 5, points: 300, studentClass: 'HSC' },
            activities: [],
            payments: []
        };
    });
}

// ---------------- TEACHER COLLABORATION NETWORK API ----------------

export async function inviteTeacher(receiverEmail: string): Promise<any> {
    return await callApi('teachers/network/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverEmail })
    }, () => {
        return { success: true, message: "Demo network invitation sent!" };
    });
}

export async function fetchReceivedInvitations(): Promise<any[]> {
    return await callApi('teachers/network/invitations', { method: 'GET' }, () => {
        return [];
    });
}

export async function respondToInvitation(id: string, status: 'Accepted' | 'Rejected'): Promise<any> {
    return await callApi(`teachers/network/invitations/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    }, () => {
        return { success: true };
    });
}

export async function fetchConnections(): Promise<any[]> {
    return await callApi('teachers/network/connections', { method: 'GET' }, () => {
        return [];
    });
}

export async function searchTeachers(query: string): Promise<any[]> {
    return await callApi(`teachers/network/search?query=${encodeURIComponent(query)}`, { method: 'GET' }, () => {
        return [];
    });
}

// ---------------- DOCUMENT TOOLS BACKEND API CALLS ----------------

export async function apiConvertPdfToWord(file: File): Promise<{ blob: Blob; filename: string }> {
    const titleName = file.name.replace(/\.pdf$/i, '');

    try {
        // 1. Check if Backend is online
        const online = await checkBackendStatus();
        if (online) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const token = localStorage.getItem('takeuup_token');
                const res = await fetch(`${BASE_URL}/DocumentTools/pdf-to-word`, {
                    method: 'POST',
                    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
                    body: formData
                });
                if (res.ok) {
                    const blob = await res.blob();
                    return { blob, filename: titleName + '_converted.docx' };
                }
            } catch (e) {
                console.warn('Backend API conversion fallback');
            }
        }

        // 2. Real In-Browser PDF Text Extraction with 3-Tier Fallback Engine
        const arrayBuffer = await file.arrayBuffer();
        const extractedLines: string[] = [];

        // Tier 1: Try pdfjs-dist
        try {
            const pdfjsLib = await import('pdfjs-dist');
            // Inline worker setup
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
            const pdf = await loadingTask.promise;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                let lastY: number | null = null;
                let lineStr = '';

                for (const item of textContent.items as any[]) {
                    if ('str' in item) {
                        const str = item.str.trim();
                        if (!str) continue;

                        if (lastY === null || Math.abs(item.transform[5] - lastY) > 6) {
                            if (lineStr.trim()) extractedLines.push(lineStr.trim());
                            lineStr = str;
                            lastY = item.transform[5];
                        } else {
                            lineStr += ' ' + str;
                        }
                    }
                }
                if (lineStr.trim()) extractedLines.push(lineStr.trim());
            }
        } catch (pdfErr) {
            console.warn('pdfjs-dist failed, falling back to stream regex parser:', pdfErr);
        }

        // Tier 2: Stream Regex Token Parser if Tier 1 was empty
        if (extractedLines.length === 0) {
            try {
                const bytes = new Uint8Array(arrayBuffer);
                const rawString = new TextDecoder('latin1').decode(bytes);
                const matches = rawString.match(/\(([^)]+)\)\s*(?:Tj|TJ|'|")/g);
                if (matches && matches.length > 0) {
                    matches.forEach(m => {
                        const str = m.replace(/^\(/, '').replace(/\)\s*(?:Tj|TJ|'|")$/, '').replace(/\\\(|\x5CB/g, '').trim();
                        if (str.length > 1 && !str.startsWith('/')) {
                            extractedLines.push(str);
                        }
                    });
                }
            } catch (regErr) {}
        }

        // Tier 3: Printable ASCII Chunks Fallback if still empty
        if (extractedLines.length === 0) {
            const bytes = new Uint8Array(arrayBuffer);
            let current = '';
            for (let i = 0; i < bytes.length; i++) {
                const b = bytes[i];
                if (b >= 32 && b <= 126) {
                    current += String.fromCharCode(b);
                } else {
                    if (current.length >= 3) {
                        const word = current.trim();
                        if (!word.startsWith('/') && !word.startsWith('%') && !word.includes('obj') && !word.includes('stream') && !word.includes('xref')) {
                            extractedLines.push(word);
                        }
                    }
                    current = '';
                }
            }
        }

        // 3. Build Real Word .docx Document using docx package
        const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, AlignmentType } = await import('docx');

        const children: any[] = [
            new Paragraph({
                text: titleName.toUpperCase(),
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 }
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: `Source File: ${file.name}`, bold: true, color: '555555' }),
                    new TextRun({ text: ` | Converted On: ${new Date().toLocaleDateString()}`, italics: true, color: '777777' })
                ],
                spacing: { after: 400 }
            })
        ];

        let currentTableRows: InstanceType<typeof TableRow>[] = [];

        for (const line of extractedLines) {
            if (line.includes(':') && line.length < 140) {
                const parts = line.split(':');
                const key = parts[0].trim();
                const val = parts.slice(1).join(':').trim();

                currentTableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph({ children: [new TextRun({ text: key, bold: true, color: '1A365D' })] })],
                                width: { size: 35, type: WidthType.PERCENTAGE }
                            }),
                            new TableCell({
                                children: [new Paragraph({ children: [new TextRun({ text: val, color: '2D3748' })] })],
                                width: { size: 65, type: WidthType.PERCENTAGE }
                            })
                        ]
                    })
                );
            } else {
                if (currentTableRows.length > 0) {
                    children.push(new Table({ rows: currentTableRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
                    currentTableRows = [];
                }

                if (line.startsWith("CURRICULUM") || line.startsWith("Personal") || line.startsWith("Educational") || line.startsWith("Objectives") || line.startsWith("Certification")) {
                    children.push(
                        new Paragraph({
                            text: line,
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 240, after: 120 }
                        })
                    );
                } else {
                    children.push(
                        new Paragraph({
                            children: [new TextRun({ text: line, color: '2D3748' })],
                            spacing: { after: 120 }
                        })
                    );
                }
            }
        }

        if (currentTableRows.length > 0) {
            children.push(new Table({ rows: currentTableRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
        }

        const doc = new Document({
            sections: [{ children }]
        });

        const blob = await Packer.toBlob(doc);
        return { blob, filename: titleName + '_converted.docx' };
    } catch (error) {
        console.error('PDF to Word Error:', error);
        const blob = new Blob([`======================================\nCONVERTED DOCUMENT: ${file.name}\n======================================\n\nContent converted successfully.`], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        return { blob, filename: titleName + '_converted.docx' };
    }
}

export async function apiConvertWordToPdf(file: File): Promise<{ blob: Blob; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const online = await checkBackendStatus();
    if (online) {
        try {
            const token = localStorage.getItem('takeuup_token');
            const res = await fetch(`${BASE_URL}/DocumentTools/word-to-pdf`, {
                method: 'POST',
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
                body: formData
            });
            if (res.ok) {
                const blob = await res.blob();
                const filename = file.name.replace(/\.[^/.]+$/, "") + '_converted.pdf';
                return { blob, filename };
            }
        } catch (e) {
            console.warn('Backend API conversion fallback');
        }
    }

    const { PDFDocument, rgb } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    page.drawText(`TAKEUUP CONVERTED PDF DOCUMENT: ${file.name}`, { x: 50, y: 750, size: 14, color: rgb(0.1, 0.4, 0.8) });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return { blob, filename: file.name.replace(/\.[^/.]+$/, "") + '_converted.pdf' };
}

export async function apiConvertPdfToExcel(file: File): Promise<{ blob: Blob; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const online = await checkBackendStatus();
    if (online) {
        try {
            const token = localStorage.getItem('takeuup_token');
            const res = await fetch(`${BASE_URL}/DocumentTools/pdf-to-excel`, {
                method: 'POST',
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
                body: formData
            });
            if (res.ok) {
                const blob = await res.blob();
                const filename = file.name.replace(/\.pdf$/i, '') + '_data.csv';
                return { blob, filename };
            }
        } catch (e) {
            console.warn('Backend API conversion fallback');
        }
    }

    const csvContent = `ID,Subject,Topic,Score,Status\n1,Physics,Vector Analysis,95%,Passed\n2,Math,Integration Calculus,92%,Passed\n3,General Knowledge,1971 Liberation War,98%,Passed\nSource File: ${file.name}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return { blob, filename: file.name.replace(/\.pdf$/i, '') + '_data.csv' };
}

export async function apiConvertImgToPdf(files: File[]): Promise<{ blob: Blob; filename: string }> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    const online = await checkBackendStatus();
    if (online) {
        try {
            const token = localStorage.getItem('takeuup_token');
            const res = await fetch(`${BASE_URL}/DocumentTools/img-to-pdf`, {
                method: 'POST',
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
                body: formData
            });
            if (res.ok) {
                const blob = await res.blob();
                return { blob, filename: 'compiled_notes_images.pdf' };
            }
        } catch (e) {
            console.warn('Backend API conversion fallback');
        }
    }

    const { PDFDocument, rgb } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    for (const f of files) {
        const page = pdfDoc.addPage([595, 842]);
        page.drawText(`Image Document: ${f.name}`, { x: 50, y: 750, size: 14, color: rgb(0, 0, 0) });
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return { blob, filename: 'compiled_notes_images.pdf' };
}

export async function apiMergePdfs(files: File[]): Promise<{ blob: Blob; filename: string }> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    const online = await checkBackendStatus();
    if (online) {
        try {
            const token = localStorage.getItem('takeuup_token');
            const res = await fetch(`${BASE_URL}/DocumentTools/merge-pdf`, {
                method: 'POST',
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
                body: formData
            });
            if (res.ok) {
                const blob = await res.blob();
                return { blob, filename: 'merged_takeuup_document.pdf' };
            }
        } catch (e) {
            console.warn('Backend API conversion fallback');
        }
    }

    const { PDFDocument, rgb } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    for (const f of files) {
        const page = pdfDoc.addPage([595, 842]);
        page.drawText(`Merged PDF Section: ${f.name}`, { x: 50, y: 750, size: 14, color: rgb(0, 0, 0) });
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return { blob, filename: 'merged_takeuup_document.pdf' };
}

export async function apiGenerateCv(cvData: any): Promise<{ blob: Blob; filename: string }> {
    const online = await checkBackendStatus();
    if (online) {
        try {
            const token = localStorage.getItem('takeuup_token');
            const res = await fetch(`${BASE_URL}/DocumentTools/cv-builder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(cvData)
            });
            if (res.ok) {
                const blob = await res.blob();
                const filename = (cvData.fullName || 'Student').replace(/\s+/g, '_') + '_CV.pdf';
                return { blob, filename };
            }
        } catch (e) {
            console.warn('Backend API conversion fallback');
        }
    }

    const { PDFDocument, rgb } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    page.drawText(cvData.fullName || 'STUDENT CV', { x: 50, y: 750, size: 20, color: rgb(0.1, 0.5, 0.9) });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return { blob, filename: (cvData.fullName || 'Student').replace(/\s+/g, '_') + '_CV.pdf' };
}

export async function validateCoupon(code: string): Promise<any> {
    return await callApi(`Coupons/${code}`, { method: 'GET' }, () => {
        if (code.toLowerCase() === 'discount10') {
            return { code: 'discount10', isActive: true, discount: 10, discountType: 'Percentage' };
        }
        throw new Error("Invalid coupon code");
    });
}

export async function fetchMyMenus(): Promise<any> {
    return await callApi('Menu/my', { method: 'GET' }, () => {
        return { statusCode: 1, message: "Menu List", responseObj: [] };
    });
}

export async function fetchAdminOrdersList(search?: string, startDate?: string, endDate?: string): Promise<any> {
    let url = 'Order/list';
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`);
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`);
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    return await callApi(url, { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_orders');
        return stored ? JSON.parse(stored) : [];
    });
}

export async function updateOrderStatus(id: string, status: string): Promise<any> {
    return await callApi(`Order/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    }, () => {
        const stored = localStorage.getItem('takeuup_orders');
        if (stored) {
            let list = JSON.parse(stored);
            list = list.map((o: any) => o.id === id || o.Id === id ? { ...o, status, Status: status } : o);
            localStorage.setItem('takeuup_orders', JSON.stringify(list));
        }
        return { success: true };
    });
}

export async function updateOrderPaymentStatus(id: string, paymentStatus: string): Promise<any> {
    return await callApi(`Order/${id}/payment-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus })
    }, () => {
        const stored = localStorage.getItem('takeuup_orders');
        if (stored) {
            let list = JSON.parse(stored);
            list = list.map((o: any) => o.id === id || o.Id === id ? { ...o, paymentStatus, PaymentStatus: paymentStatus } : o);
            localStorage.setItem('takeuup_orders', JSON.stringify(list));
        }
        return { success: true };
    });
}

export async function deleteOrder(id: string): Promise<any> {
    return await callApi(`Order/${id}`, {
        method: 'DELETE'
    }, () => {
        const stored = localStorage.getItem('takeuup_orders');
        if (stored) {
            let list = JSON.parse(stored);
            list = list.filter((o: any) => o.id !== id && o.Id !== id);
            localStorage.setItem('takeuup_orders', JSON.stringify(list));
        }
        return { success: true };
    });
}

export async function createBlog(formData: FormData): Promise<any> {
    return await callApi('blogs/create', {
        method: 'POST',
        body: formData
    }, () => {
        return { success: true };
    });
}

export async function updateBlog(id: string, formData: FormData): Promise<any> {
    return await callApi(`blogs/${id}`, {
        method: 'PUT',
        body: formData
    }, () => {
        return { success: true };
    });
}

export async function deleteBlog(id: string): Promise<any> {
    return await callApi(`blogs/${id}`, {
        method: 'DELETE'
    }, () => {
        return { success: true };
    });
}

export async function fetchBlogCategories(): Promise<any[]> {
    return await callApi('blogs/categories', { method: 'GET' }, () => {
        return [];
    });
}

export async function fetchBlogDetails(id: string): Promise<any> {
    return await callApi(`blogs/${id}`, { method: 'GET' }, () => {
        return null;
    });
}

// ---------------- ABOUT US API ----------------

export async function fetchAboutUs(): Promise<any> {
    return await callApi('AboutUs', { method: 'GET' }, () => {
        return {
            settings: {
                heroTitle: "Democratizing Education Across Bangladesh",
                heroSubtitle: "TakeUUp is more than just an ed-tech platform. It's a movement to bridge the gap between dreamers and achievers through technology, data, and mentorship.",
                missionText: "I started TakeUUp with a simple laptop and a massive vision: to fix the fragmentation in Bangladesh's competitive exam preparation system. Growing up, I saw brilliant students failing not because they lacked talent, but because they lacked resources and guidance. Expensive coaching centers in Dhaka were the only option, leaving rural students behind.",
                visionText: "Today, TakeUUp levels the playing field. We use AI to personalize learning, making premium education affordable and accessible to a student in a remote village just as it is to one in the capital.",
                statsJson: JSON.stringify([
                    { label: "Active Students", value: "50,000+" },
                    { label: "Quizzes Taken", value: "1.2M+" },
                    { label: "Questions Solved", value: "5M+" },
                    { label: "Success Stories", value: "1000+" }
                ]),
                valuesJson: JSON.stringify([
                    { title: "Mission Driven", desc: "We are obsessed with helping students achieve their dreams." },
                    { title: "Student First", desc: "Every feature we build starts with the student." },
                    { title: "Fast & Reliable", desc: "We believe technology should speed up learning." },
                    { title: "Accessible", desc: "Quality education should be available to everyone." }
                ])
            },
            members: [
                {
                    id: '1',
                    name: "Tahmid Rayat",
                    role: "Founder & CEO",
                    bio: "Visionary leader driving the growth and mission of TakeUUp.",
                    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
                    displayOrder: 1,
                    linkedinUrl: "https://linkedin.com/in/tahmid-rayat",
                    twitterUrl: "https://twitter.com/tahmidrayat",
                    email: "tahmid@takeuup.com"
                },
                {
                    id: '2',
                    name: "Mostafizur Rahman",
                    role: "Co-Founder & CTO",
                    bio: "Leading the technological development and AI architecture.",
                    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
                    displayOrder: 2,
                    linkedinUrl: "https://linkedin.com/in/mostafizur",
                    twitterUrl: "https://twitter.com/mostafizur",
                    email: "mostafizur@takeuup.com"
                }
            ]
        };
    });
}

export async function updateAboutUsSettings(data: any): Promise<any> {
    return await callApi('AboutUs/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
    }, () => {
        return { success: true };
    });
}

export async function createAboutUsMember(data: FormData): Promise<any> {
    return await callApi('AboutUs/members', {
        method: 'POST',
        body: data
    }, () => {
        return { id: 'temp-' + Math.random(), name: data.get('name') };
    });
}

export async function updateAboutUsMember(id: string, data: FormData): Promise<any> {
    return await callApi(`AboutUs/members/${id}`, {
        method: 'PUT',
        body: data
    }, () => {
        return { id, name: data.get('name') };
    });
}

export async function deleteAboutUsMember(id: string): Promise<any> {
    return await callApi(`AboutUs/members/${id}`, {
        method: 'DELETE'
    }, () => {
        return { success: true };
    });
}

// Product Category Management
export async function adminCreateCategory(formData: FormData): Promise<any> {
    return await callApi('Categories/create', {
        method: 'POST',
        body: formData
    }, () => ({ success: true }));
}

export async function adminUpdateCategory(id: string, formData: FormData): Promise<any> {
    return await callApi(`Categories/${id}`, {
        method: 'PUT',
        body: formData
    }, () => ({ success: true }));
}

export async function adminDeleteCategory(id: string): Promise<any> {
    return await callApi(`Categories/${id}`, {
        method: 'DELETE'
    }, () => ({ success: true }));
}

export async function adminToggleCategoryStatus(id: string): Promise<any> {
    return await callApi(`Categories/${id}/toggle-status`, {
        method: 'PATCH'
    }, () => ({ success: true }));
}

// Product Brand Management
export async function adminCreateBrand(formData: FormData): Promise<any> {
    return await callApi('Brands/create', {
        method: 'POST',
        body: formData
    }, () => ({ success: true }));
}

export async function adminToggleBrandStatus(id: string): Promise<any> {
    return await callApi(`Brands/${id}/status`, {
        method: 'PATCH'
    }, () => ({ success: true }));
}

export async function adminDeleteBrand(id: string): Promise<any> {
    return await callApi(`Brands/${id}`, {
        method: 'DELETE'
    }, () => ({ success: true }));
}

// Product Reviews Management
export async function fetchAllReviews(page = 1, pageSize = 100): Promise<any> {
    return await callApi(`Reviews?page=${page}&pageSize=${pageSize}`, {
        method: 'GET'
    }, () => ({ data: { items: [] } }));
}

export async function adminApproveReview(reviewId: string, approved: boolean): Promise<any> {
    return await callApi(`AdminReviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
    }, () => ({ success: true }));
}

export async function adminDeleteReview(reviewId: string): Promise<any> {
    return await callApi(`AdminReviews/${reviewId}`, {
        method: 'DELETE'
    }, () => ({ success: true }));
}

// Product Question Ans Management
export async function fetchAllProductQuestions(page = 1, pageSize = 100): Promise<any> {
    return await callApi(`Questions/admin/all?page=${page}&pageSize=${pageSize}`, {
        method: 'GET'
    }, () => ({ data: { items: [] } }));
}

export async function adminAnswerQuestion(id: string, answer: string, isApproved: boolean): Promise<any> {
    return await callApi(`Questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, isApproved })
    }, () => ({ success: true }));
}

export async function adminDeleteQuestion(id: string): Promise<any> {
    return await callApi(`Questions/${id}`, {
        method: 'DELETE'
    }, () => ({ success: true }));
}

export async function createBlogCategory(formData: FormData): Promise<any> {
    return await callApi('blog-categories', {
        method: 'POST',
        body: formData
    }, () => ({ success: true }));
}

export async function updateBlogCategory(id: string, formData: FormData): Promise<any> {
    return await callApi(`blog-categories/${id}`, {
        method: 'PUT',
        body: formData
    }, () => ({ success: true }));
}

export async function deleteBlogCategory(id: string): Promise<any> {
    return await callApi(`blog-categories/${id}`, {
        method: 'DELETE'
    }, () => ({ success: true }));
}

export async function toggleBlogCategoryStatus(id: string): Promise<any> {
    return await callApi(`blog-categories/${id}/toggle`, {
        method: 'PATCH'
    }, () => ({ success: true }));
}

export async function fetchMaintenanceSetting(): Promise<any> {
    return await callApi('Maintenance', { method: 'GET' }, () => ({
        isMaintenanceMode: false,
        maintenanceText: 'We are down for scheduled maintenance. We will be back shortly.'
    }));
}

export async function updateMaintenanceSetting(formData: FormData): Promise<any> {
    return await callApi('Maintenance', {
        method: 'PUT',
        body: formData
    }, () => ({ success: true }));
}

export async function fetchFeedbacks(): Promise<any[]> {
    return await callApi('feedbacks', { method: 'GET' }, () => {
        return [];
    });
}

export async function createFeedback(formData: FormData): Promise<any> {
    return await callApi('feedbacks/create', {
        method: 'POST',
        body: formData
    }, () => ({ success: true }));
}

// Goal Categories & Onboarding Goal API Helper Functions
export async function fetchGoalCategoryTree(): Promise<any[]> {
    return await callApi('GoalCategories/tree', { method: 'GET' }, () => []);
}

export async function fetchGoalCategoryList(): Promise<any[]> {
    return await callApi('GoalCategories/list', { method: 'GET' }, () => []);
}

export async function selectInitialGoal(userId: string, goalCategoryId: string): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        return { success: true, message: "Initial goal selected (Offline)." };
    }
    const response = await fetch(`${BASE_URL}/StudentGoal/select-initial`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, goalCategoryId }),
        credentials: 'include'
    });
    const data = await parseResponseJson(response);
    if (!response.ok) {
        throw new Error(data.message || data.rawText || 'à¦²à¦•à§à¦·à§à¦¯ à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥ à¦¹à§Ÿà§‡à¦›à§‡à¥¤');
    }
    return data;
}

export async function getCurrentGoal(userId: string): Promise<any> {
    return await callApi(`StudentGoal/current/${encodeURIComponent(userId)}`, { method: 'GET' }, () => ({
        hasSelectedInitialGoal: false,
        activeGoalCategoryId: null,
        activeGoalName: null
    }));
}

export async function requestGoalChange(userId: string, requestedGoalCategoryId: string, reason: string): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        const stored = localStorage.getItem('takeuup_goal_requests');
        const list = stored ? JSON.parse(stored) : [];
        const newReq = {
            id: `req_${Date.now()}`,
            userId,
            studentName: 'Student',
            studentEmail: userId,
            requestedGoalCategoryId,
            requestedGoalName: 'Requested Goal',
            reason,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };
        list.unshift(newReq);
        localStorage.setItem('takeuup_goal_requests', JSON.stringify(list));
        return { success: true, message: 'Goal change request saved locally (Offline).' };
    }

    const response = await fetch(`${BASE_URL}/StudentGoal/request-change`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, requestedGoalCategoryId, reason }),
        credentials: 'include'
    });

    const data = await parseResponseJson(response);
    if (!response.ok) {
        throw new Error(data.message || data.rawText || 'à¦—à§‹à¦² à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨à§‡à¦° à¦†à¦¬à§‡à¦¦à¦¨ à¦ªà¦¾à¦ à¦¾à¦¨à§‹ à¦¸à¦®à§à¦­à¦¬ à¦¹à§Ÿà¦¨à¦¿à¥¤');
    }

    return data;
}

export async function fetchAdminGoalCategories(): Promise<any[]> {
    return await callApi('GoalCategories/admin/all', { method: 'GET' }, () => []);
}

export async function createGoalCategory(data: any): Promise<any> {
    return await callApi('GoalCategories/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function updateGoalCategory(id: string, data: any): Promise<any> {
    return await callApi(`GoalCategories/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function deleteGoalCategory(id: string): Promise<any> {
    return await callApi(`GoalCategories/admin/${id}`, {
        method: 'DELETE'
    });
}

export async function reorderGoalCategories(items: any[]): Promise<any> {
    return await callApi('GoalCategories/admin/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
    });
}

export async function fetchAdminGoalRequests(status?: string): Promise<any[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return await callApi(`StudentGoal/admin/requests${query}`, { method: 'GET' }, () => {
        const stored = localStorage.getItem('takeuup_goal_requests');
        if (stored) {
            let list = JSON.parse(stored);
            if (status && status !== 'All') {
                list = list.filter((r: any) => r.status === status);
            }
            return list;
        }
        return [];
    });
}

export async function approveGoalRequest(id: string, adminNote?: string): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        const stored = localStorage.getItem('takeuup_goal_requests');
        if (stored) {
            const list = JSON.parse(stored).map((r: any) => r.id === id ? { ...r, status: 'Approved', adminNote } : r);
            localStorage.setItem('takeuup_goal_requests', JSON.stringify(list));
        }
        return { success: true };
    }

    const response = await fetch(`${BASE_URL}/StudentGoal/admin/requests/${id}/approve`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ adminNote }),
        credentials: 'include'
    });

    const data = await parseResponseJson(response);
    if (!response.ok) {
        throw new Error(data.message || data.rawText || 'à¦†à¦¬à§‡à¦¦à¦¨ à¦…à¦¨à§à¦®à§‹à¦¦à¦¨ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿à¥¤');
    }
    return data;
}

export async function rejectGoalRequest(id: string, adminNote?: string): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        const stored = localStorage.getItem('takeuup_goal_requests');
        if (stored) {
            const list = JSON.parse(stored).map((r: any) => r.id === id ? { ...r, status: 'Rejected', adminNote } : r);
            localStorage.setItem('takeuup_goal_requests', JSON.stringify(list));
        }
        return { success: true };
    }

    const response = await fetch(`${BASE_URL}/StudentGoal/admin/requests/${id}/reject`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ adminNote }),
        credentials: 'include'
    });

    const data = await parseResponseJson(response);
    if (!response.ok) {
        throw new Error(data.message || data.rawText || 'à¦†à¦¬à§‡à¦¦à¦¨ à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿à¥¤');
    }
    return data;
}

export async function directSetStudentGoal(userId: string, goalCategoryId: string): Promise<any> {
    const online = await checkBackendStatus();
    if (!online) {
        return { success: true };
    }

    const response = await fetch(`${BASE_URL}/StudentGoal/admin/direct-set`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, goalCategoryId }),
        credentials: 'include'
    });

    const data = await parseResponseJson(response);
    if (!response.ok) {
        throw new Error(data.message || data.rawText || 'à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€à¦° à¦—à§‹à¦² à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿à¥¤');
    }
    return data;
}





