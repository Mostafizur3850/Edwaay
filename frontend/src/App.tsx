import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/common/Layout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { LandingPage } from './modules/home/LandingPage';
import { QuizInterface } from './modules/quiz/QuizInterface';
import { Leaderboard } from './modules/leaderboard/Leaderboard';
import { Blog } from './modules/blog/Blog';
import { Pricing } from './modules/home/Pricing';
import { Mentors } from './modules/mentors/Mentors';
import { MentorProfile } from './modules/mentors/MentorProfile';
import { Newsletter } from './components/common/Newsletter';
import { AdminPanel } from './modules/admin/AdminPanel';
import { EmployerDashboard } from './modules/employer/EmployerDashboard';
import { MentorDashboard } from './modules/mentor/MentorDashboard';
import { Dashboard } from './modules/dashboard/Dashboard';
import { Login } from './modules/auth/Login';
import { RecruiterRegister } from './modules/auth/RecruiterRegister';
import { PremiumDemo } from './modules/home/PremiumDemo';
import { JobPortalHome } from './modules/jobs/JobPortalHome';
import { JobSearch } from './modules/jobs/JobSearch';
import { ResourcesPage } from './modules/resources/ResourcesPage';
import { JobPost } from './modules/jobs/JobPost';
import { JobTestInterface } from './modules/jobs/JobTestInterface';
import { CVBuilder } from './modules/jobs/CVBuilder';
import { CategoryDetails } from './modules/learning/CategoryDetails';
import { BookStore } from './modules/bookstore/BookStore';
import { CartPage } from './modules/bookstore/CartPage';
import { CheckoutPage } from './modules/bookstore/CheckoutPage';
import { CareerPage } from './modules/jobs/CareerPage';
import { QuestionBank } from './modules/quiz/QuestionBank';
import { AboutUs } from './modules/home/AboutUs';
import { ToolsInterface } from './modules/learning/ToolsInterface';
import { AllToolsPage } from './modules/learning/AllToolsPage';
import { TeacherWorkspace } from './modules/quiz/TeacherWorkspace';
import { StudentQuiz } from './modules/quiz/StudentQuiz';
import { ReadingRoom } from './modules/learning/ReadingRoom';
import { MegaQuiz } from './modules/quiz/MegaQuiz';
import { BkashSandbox } from './modules/payment/BkashSandbox';
import { PaymentSuccess } from './modules/payment/PaymentSuccess';
import { PaymentFailed } from './modules/payment/PaymentFailed';
import { FirstTimeGoalModal } from './components/common/FirstTimeGoalModal';
import { getCurrentGoal } from './services/api';

const App = () => {
  const [isServerOnline, setIsServerOnline] = useState<boolean>(true);
  const [checkingServer, setCheckingServer] = useState<boolean>(false);

  const verifyServerConnection = async () => {
    setCheckingServer(true);
    try {
      const { checkBackendStatus } = await import('./services/api');
      const online = await checkBackendStatus();
      setIsServerOnline(online);
    } catch (e) {
      setIsServerOnline(false);
    } finally {
      setCheckingServer(false);
    }
  };

  useEffect(() => {
    verifyServerConnection();
  }, []);
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
      const user = localStorage.getItem('takeuup_user');
      if (!user) return false;
      try {
        const u = JSON.parse(user);
        return !!(u && (u.id || u.email || u.name));
      } catch (e) {
        return false;
      }
  });

  const [maintenanceState, setMaintenanceState] = useState<{ isMaintenanceMode: boolean; maintenanceText: string; imageUrl?: string | null } | null>(null);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const sanitizeUrl = () => {
      setCurrentHash(window.location.hash);
      // Strip out /login or subpaths from base pathname when HashRouter is active
      if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        const hash = window.location.hash || '#/';
        window.history.replaceState(null, '', '/' + hash);
      }
    };
    sanitizeUrl();
    window.addEventListener('hashchange', sanitizeUrl);
    return () => window.removeEventListener('hashchange', sanitizeUrl);
  }, []);

  useEffect(() => {
    const handleAutoLogout = () => {
      handleLogout();
    };
    window.addEventListener('takeuup_logout', handleAutoLogout);
    return () => window.removeEventListener('takeuup_logout', handleAutoLogout);
  }, []);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const { fetchMaintenanceSetting } = await import('./services/api');
        const data = await fetchMaintenanceSetting();
        if (data) {
          setMaintenanceState({
            isMaintenanceMode: !!data.isMaintenanceMode || !!data.IsMaintenanceMode,
            maintenanceText: data.maintenanceText || data.MaintenanceText || 'System is currently under maintenance.',
            imageUrl: data.imageUrl || data.ImageUrl || null
          });
        }
      } catch (err) {
        console.error('Failed to fetch maintenance setting', err);
      } finally {
        setLoadingMaintenance(false);
      }
    };
    checkMaintenance();
  }, []);

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const raw = localStorage.getItem('takeuup_user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  });
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.role !== 'admin' && currentUser.role !== 'employer' && currentUser.role !== 'teacher') {
      getCurrentGoal(currentUser.id || currentUser.email).then(res => {
        if (res) {
          if (res.hasSelectedInitialGoal === false) {
            setShowGoalModal(true);
          } else if (res.activeGoalName && (res.activeGoalName !== currentUser.activeGoalName || res.activeGoalName !== currentUser.studentClass)) {
            const updated = { 
              ...currentUser, 
              hasSelectedInitialGoal: true, 
              activeGoalName: res.activeGoalName, 
              studentClass: res.activeGoalName,
              activeGoalCategoryId: res.activeGoalCategoryId 
            };
            localStorage.setItem('takeuup_user', JSON.stringify(updated));
            setCurrentUser(updated);
          }
        }
      }).catch(() => {
        if (!currentUser.hasSelectedInitialGoal) {
          setShowGoalModal(true);
        }
      });
    }
  }, [isAuthenticated, currentUser?.id]);

  const handleGoalSelected = (updatedUser: any) => {
    setShowGoalModal(false);
    const updated = { ...currentUser, ...updatedUser, hasSelectedInitialGoal: true };
    localStorage.setItem('takeuup_user', JSON.stringify(updated));
    setCurrentUser(updated);
  };

  const getIsAdmin = () => {
    const local = localStorage.getItem('takeuup_user');
    if (!local) return false;
    try {
      const u = JSON.parse(local);
      const r = (u.role || '').toLowerCase();
      const e = (u.email || '').toLowerCase();
      const n = (u.name || u.userName || '').toLowerCase();
      return r === 'admin' || r === 'localadmin' || e === 'admin@objectcanvas.com' || n === 'mostafizur';
    } catch (e) {
      return false;
    }
  };

  const getIsEmployer = () => {
    const local = localStorage.getItem('takeuup_user');
    if (!local) return false;
    try {
      const r = (JSON.parse(local).role || '').toLowerCase();
      return r === 'employer';
    } catch (e) {
      return false;
    }
  };

  const getIsTeacher = () => {
    const local = localStorage.getItem('takeuup_user');
    if (!local) return false;
    try {
      const r = (JSON.parse(local).role || '').toLowerCase();
      return r === 'teacher';
    } catch (e) {
      return false;
    }
  };

  const getIsMentor = () => {
    const local = localStorage.getItem('takeuup_user');
    if (!local) return false;
    try {
      const r = (JSON.parse(local).role || '').toLowerCase();
      return r === 'mentor';
    } catch (e) {
      return false;
    }
  };

  const getTargetDashboardPath = () => {
    if (getIsAdmin()) return '/admin';
    if (getIsEmployer()) return '/employer-dashboard';
    if (getIsTeacher()) return '/teacher/workspace';
    if (getIsMentor()) return '/mentor/dashboard';
    return '/dashboard';
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    const local = localStorage.getItem('takeuup_user');
    if (local) {
      try {
        const u = JSON.parse(local);
        setCurrentUser(u);
      } catch (e) {}
    }
    const targetPath = getTargetDashboardPath();
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      window.history.replaceState(null, '', `/#${targetPath}`);
    }
    window.location.hash = `#${targetPath}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('takeuup_user');
    localStorage.removeItem('takeuup_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowGoalModal(false);
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      window.history.replaceState(null, '', '/#/');
    }
    window.location.hash = '#/';
  };

  if (!loadingMaintenance && maintenanceState?.isMaintenanceMode && !getIsAdmin() && !currentHash.includes('/login') && !currentHash.includes('/admin')) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="max-w-xl space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-950/50 animate-pulse">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl font-extrabold text-white tracking-tight">System Under Maintenance</h1>
              
              <p className="text-slate-400 text-base leading-relaxed">
                {maintenanceState.maintenanceText}
              </p>

              {maintenanceState.imageUrl && (
                <div className="mt-6 flex justify-center">
                  <img 
                    src={maintenanceState.imageUrl.startsWith('http') ? maintenanceState.imageUrl : `http://localhost:5141/${maintenanceState.imageUrl}`} 
                    alt="Maintenance illustration" 
                    className="max-h-64 rounded-2xl border border-slate-800 object-cover shadow-2xl"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-center gap-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-4 py-2 rounded-full border border-slate-850">
                  We'll be back shortly
                </div>
              </div>
            </div>
          </div>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <ScrollToTop />
          <FirstTimeGoalModal
            isOpen={showGoalModal}
            user={currentUser}
            onGoalSelected={handleGoalSelected}
          />
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              
              {/* Student Portal Dashboard Routes */}
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/profile" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/smart-lessons" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/my-weakness" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/courses" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/quizzes" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/messages" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/study-groups" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/admission-predictor" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/quiz" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/mistakes" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/history" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/routine" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/certificates" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/qbank" element={isAuthenticated ? <Dashboard /> : <QuestionBank />} />
              <Route path="/question-bank" element={isAuthenticated ? <Dashboard /> : <QuestionBank />} />
              <Route path="/mega-quiz" element={isAuthenticated ? <Dashboard /> : <MegaQuiz />} />
              <Route path="/leaderboard" element={isAuthenticated ? <Dashboard /> : <Leaderboard />} />
              <Route path="/premium" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              {/* Public & Auth Routes */}
              <Route path="/login" element={isAuthenticated ? <Navigate to={getTargetDashboardPath()} replace /> : <Login onLogin={handleLogin} />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to={getTargetDashboardPath()} replace /> : <Login onLogin={handleLogin} />} />
              <Route path="/employer/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RecruiterRegister onLogin={handleLogin} />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/demo" element={<PremiumDemo />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/pricing" element={<Pricing onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/mentors/:id" element={<MentorProfile />} />
              <Route path="/products" element={<BookStore />} />
              <Route path="/career" element={<CareerPage />} />

              {/* Admin & Portal Dashboards */}
              <Route path="/admin" element={isAuthenticated && getIsAdmin() ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
              <Route path="/mentor/dashboard" element={isAuthenticated && (getIsMentor() || getIsAdmin()) ? <MentorDashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
              <Route path="/employer-dashboard" element={isAuthenticated && getIsEmployer() ? <EmployerDashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
              
              {/* Teacher & Shared Quiz Routes */}
              <Route 
                path="/teacher/workspace" 
                element={isAuthenticated && (getIsTeacher() || getIsAdmin()) ? <TeacherWorkspace /> : <Navigate to="/login" replace />} 
              />
              <Route path="/quiz/v/:quizData" element={<StudentQuiz />} />
              <Route path="/reading-room/:subjectName" element={isAuthenticated ? <ReadingRoom /> : <Navigate to="/login" replace />} />
              
              {/* Job Portal Routes */}
              <Route path="/jobs" element={<JobPortalHome />} />
              <Route path="/jobs/search" element={<JobSearch />} />
              
              {/* Protected Route: Create Job */}
              <Route 
                path="/jobs/create" 
                element={isAuthenticated ? <JobPost /> : <Navigate to="/login" state={{ returnTo: '/jobs/create' }} replace />} 
              />
              
              <Route path="/jobs/create-cv" element={<CVBuilder />} />
              <Route path="/jobs/test/:jobId" element={<JobTestInterface />} />
              
              {/* Utility Tools Route */}
              <Route path="/tools/:toolId" element={<ToolsInterface />} />
              <Route path="/all-tools" element={<AllToolsPage />} />
              
              <Route path="/payment/bkash-sandbox" element={<BkashSandbox />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failed" element={<PaymentFailed />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;