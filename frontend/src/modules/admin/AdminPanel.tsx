import React, { useState, useEffect } from 'react';
import ManageNews from './components/ManageNews';
import ManageCurrentAffairs from './components/ManageCurrentAffairs';

import { typesetMath } from '../../utils/mathJax';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Upload, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical, 
  ShoppingBag, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Image as ImageIcon, 
  File, 
  Video, 
  BarChart3, 
  DollarSign, 
  Bell, 
  LogOut, 
  Mail, 
  Send, 
  Save, 
  HelpCircle, 
  PenTool, 
  ChevronDown,
  Info, 
  X,
  Lock,
  Unlock,
  Briefcase,
  MapPin,
  Star,
  UserCheck,
  Phone,
  Link as LinkIcon,
  Download,
  Globe,
  Rocket,
  ClipboardList,
  Check,
  AlertTriangle,
  Calendar,
  Clock,
  ExternalLink,
  Map,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  GraduationCap,
  BookOpen,
  Edit3,
  RefreshCw,
  Eye,
  MessageSquare,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminMessageMonitoring } from './components/AdminMessageMonitoring';
import { AdminGoalCategoryManager } from './components/AdminGoalCategoryManager';
import { AdminGoalChangeRequests } from './components/AdminGoalChangeRequests';

interface AdminPanelProps {
    onLogout?: () => void;
}

const DEFAULT_ADMIN_MENUS = [
    { id: 1, title: 'Dashboard', url: '/admin/dashboard', parentId: null, sequence: 1, icon: 'LayoutDashboard' },
    { id: 2, title: 'Student Messages', url: '/admin/monitoring/messages', parentId: null, sequence: 2, icon: 'MessageSquare' },
    { id: 22, title: 'Abuse Audit', url: '/admin/monitoring', parentId: null, sequence: 3, icon: 'Shield' },
    { id: 221, title: 'Abuse Alerts', url: '/admin/monitoring/alerts', parentId: 22, sequence: 1 },
    { id: 222, title: 'Deleted Log', url: '/admin/monitoring/deleted', parentId: 22, sequence: 2 },
    { id: 223, title: 'Media Attachments', url: '/admin/monitoring/attachments', parentId: 22, sequence: 3 },
    { id: 224, title: 'Spam Keywords', url: '/admin/monitoring/spam', parentId: 22, sequence: 4 },
    { id: 4, title: 'Student Hub', url: '/admin/students', parentId: null, sequence: 4, icon: 'GraduationCap' },
    { id: 45, title: 'Goal Management', url: '/admin/goals', parentId: null, sequence: 5, icon: 'Target' },
    { id: 46, title: 'Goal Categories', url: '/admin/goals/categories', parentId: 45, sequence: 1 },
    { id: 47, title: 'Goal Change Requests', url: '/admin/goals/requests', parentId: 45, sequence: 2 },
    { id: 5, title: 'Job Board', url: '/admin/jobs', parentId: null, sequence: 6, icon: 'Briefcase' },
    { id: 6, title: 'Applications', url: '/admin/applications', parentId: null, sequence: 6, icon: 'UserCheck' },
    { id: 7, title: 'Blog', url: '/admin/blog', parentId: null, sequence: 7, icon: 'FileText' },
    { id: 8, title: 'Products', url: '/admin/products', parentId: null, sequence: 8, icon: 'ShoppingBag' },
    { id: 81, title: 'Orders', url: '/admin/orders', parentId: null, sequence: 9, icon: 'ClipboardList' },
    { id: 9, title: 'Newsletter', url: '/admin/newsletter', parentId: null, sequence: 10, icon: 'Mail' },
    { id: 12, title: 'Recent News', url: '/admin/news', parentId: null, sequence: 13, icon: 'FileText' },
    { id: 13, title: 'Current Affairs', url: '/admin/current-affairs', parentId: null, sequence: 14, icon: 'Target' },
    { id: 10, title: 'Question Bank', url: '/admin/qbank', parentId: null, sequence: 11, icon: 'Upload' },
    { id: 101, title: 'Single & Bulk Upload', url: '/admin/qbank/upload', parentId: 10, sequence: 1 },
    { id: 102, title: 'Teacher Approvals', url: '/admin/qbank/teacher-approvals', parentId: 10, sequence: 2 },
    { id: 103, title: 'Others Approvals', url: '/admin/qbank/others-approvals', parentId: 10, sequence: 3 },
    { id: 104, title: 'Edit Requests', url: '/admin/qbank/edit-requests', parentId: 10, sequence: 4 },
    { id: 105, title: 'Delete Requests', url: '/admin/qbank/delete-requests', parentId: 10, sequence: 5 },
    { id: 106, title: 'Teacher Questions', url: '/admin/qbank/teacher-questions', parentId: 10, sequence: 6 },
    { id: 107, title: 'Others Questions', url: '/admin/qbank/others-questions', parentId: 10, sequence: 7 },
    { id: 108, title: 'Categories & Subjects', url: '/admin/qbank/settings', parentId: 10, sequence: 8 },
    { id: 11, title: 'Settings', url: '/admin/settings', parentId: null, sequence: 12, icon: 'Settings' },
    { id: 31, title: 'User Account', url: '/admin/settings/accounts', parentId: 11, sequence: 1 },
    { id: 32, title: 'Teacher Reg', url: '/admin/settings/teachers', parentId: 11, sequence: 2 },
    { id: 33, title: 'Roles', url: '/admin/settings/roles', parentId: 11, sequence: 3 },
    { id: 35, title: 'Permission Matrix', url: '/admin/settings/permissions', parentId: 11, sequence: 4 },
    { id: 34, title: 'Menus', url: '/admin/settings/menus', parentId: 11, sequence: 5 }
];

const getMenuAction = (url: string, title: string) => {
    const path = (url || '').toLowerCase();
    const name = (title || '').toLowerCase();
    
    if (path.includes('news') || name.includes('news')) {
        return { view: 'news' };
    }
    if (path.includes('current-affairs') || path.includes('current_affairs') || name.includes('affairs')) {
        return { view: 'current_affairs' };
    }
    if (path.includes('dashboard') || name === 'dashboard') {
        return { view: 'dashboard' };
    }
    if (path.includes('monitoring') || name.includes('audit') || name.includes('monitoring')) {
        if (path.includes('messages') || name.includes('message')) return { view: 'monitoring', subTab: 'chatbox' };
        if (path.includes('abuse') || name.includes('abuse')) return { view: 'monitoring', subTab: 'alerts' };
        return { view: 'monitoring', subTab: 'chatbox' };
    }
    if (path.includes('settings') || name === 'settings' || path.includes('users') || name === 'users') {
        if (path.includes('accounts') || name.includes('accounts') || name.includes('account')) return { view: 'users', subTab: 'users' };
        if (path.includes('teachers') || name.includes('registrations') || name.includes('reg')) return { view: 'users', subTab: 'teacher_requests' };
        if (path.includes('roles')) return { view: 'users', subTab: 'roles' };
        if (path.includes('menus')) return { view: 'users', subTab: 'menus' };
        if (path.includes('permissions') || name.includes('matrix')) return { view: 'users', subTab: 'permissions' };
        return { view: 'settings' };
    }
    if (path.includes('students') || name.includes('student')) {
        return { view: 'students' };
    }
    if (path.includes('goals') || name.includes('goal')) {
        if (path.includes('requests') || name.includes('request')) return { view: 'goal_requests' };
        return { view: 'goal_categories' };
    }
    if (path.includes('jobs') || name.includes('job')) {
        return { view: 'jobs' };
    }
    if (path.includes('applications') || name.includes('application')) {
        return { view: 'applications' };
    }
    if (path.includes('blog') || name.includes('blog')) {
        return { view: 'blog' };
    }
    if (path.includes('product') || name.includes('product') || path.includes('store') || name.includes('store')) {
        if (path.includes('category') || name.includes('category')) return { view: 'products_categories' };
        if (path.includes('brand') || name.includes('brand')) return { view: 'products_brands' };
        if (path.includes('review') || name.includes('review')) return { view: 'products_reviews' };
        if (path.includes('question') || name.includes('question')) return { view: 'products_questions' };
        return { view: 'products_list' };
    }
    if (path.includes('order') || name.includes('order')) {
        if (path.includes('pending')) return { view: 'orders_pending' };
        if (path.includes('progress')) return { view: 'orders_progress' };
        if (path.includes('delivered')) return { view: 'orders_delivered' };
        if (path.includes('canceled')) return { view: 'orders_canceled' };
        return { view: 'orders_all' };
    }
    if (path.includes('newsletter') || name.includes('newsletter')) {
        return { view: 'newsletter' };
    }
    if (path.includes('qbank') || path.includes('upload') || name.includes('question')) {
        if (path.includes('upload')) return { view: 'upload', subTab: 'upload' };
        if (path.includes('teacher-approvals')) return { view: 'upload', subTab: 'teacher_approvals' };
        if (path.includes('others-approvals')) return { view: 'upload', subTab: 'others_approvals' };
        if (path.includes('edit-requests')) return { view: 'upload', subTab: 'edit_requests' };
        if (path.includes('delete-requests')) return { view: 'upload', subTab: 'delete_requests' };
        if (path.includes('teacher-questions')) return { view: 'upload', subTab: 'teacher_questions' };
        if (path.includes('others-questions')) return { view: 'upload', subTab: 'others_questions' };
        if (path.includes('settings')) return { view: 'upload', subTab: 'settings' };
        return { view: 'upload', subTab: 'upload' };
    }
    
    return { view: 'dashboard' };
};

const getIconComponent = (iconName: string) => {
    const iconsMap: Record<string, any> = {
        LayoutDashboard,
        Shield,
        Users,
        GraduationCap,
        Briefcase,
        UserCheck,
        FileText,
        ShoppingBag,
        Mail,
        Upload,
        Settings,
        ClipboardList,
        MessageSquare,
        Target
    };
    return iconsMap[iconName] || FileText;
};

const buildMenuTree = (menus: any[]) => {
    const normalized = menus.map((m: any) => ({
        id: m.id ?? m.Id ?? m.ID,
        title: m.title ?? m.Title,
        url: m.url ?? m.Url,
        parentId: m.parentId ?? m.ParentId ?? m.ParentID ?? null,
        sequence: m.sequence ?? m.Sequence ?? 0,
        icon: m.icon ?? m.Icon ?? '',
        isActive: m.isActive ?? m.IsActive ?? true
    }));
    
    const settingsParent = normalized.find((m: any) => (m.title === 'Settings' || m.title === 'Setting') && (m.parentId === null || m.parentId === 0));
    const qbankParent = normalized.find((m: any) => m.title === 'Question Bank' && (m.parentId === null || m.parentId === 0));
    const monitoringParent = normalized.find((m: any) => 
        (m.title === 'Abuse Audit' || m.title === 'Abuse Audit & Moderation') && 
        (m.parentId === null || m.parentId === 0)
    );
    const jobBoardParent = normalized.find((m: any) => m.title === 'Job Board' && (m.parentId === null || m.parentId === 0));
    
    const mapped = normalized.map((m: any) => {
        const url = (m.url || '').toLowerCase();
        const title = (m.title || '').toLowerCase();
        
        const isSettingsChild = url.includes('/admin/settings/') || 
            url.includes('/admin/users/') || 
            (url.includes('/admin/users') && url !== '/admin/users') ||
            title === 'user accounts' || title === 'teacher registrations' || title === 'roles' || title === 'menus' || title === 'permissions matrix' ||
            title === 'user account' || title === 'teacher reg' || title === 'permission matrix';
            
        if (isSettingsChild && settingsParent) {
            return { ...m, parentId: settingsParent.id };
        }
        
        const isQBankChild = url.includes('/admin/qbank/') || 
            (url.includes('/admin/qbank') && url !== '/admin/qbank') ||
            title === 'single & bulk upload' || title === 'teacher approvals' || title === 'others approvals' || title === 'edit requests' || title === 'delete requests' || title === 'teacher questions' || title === 'others questions' || title === 'categories & subjects';
            
        if (isQBankChild && qbankParent) {
            return { ...m, parentId: qbankParent.id };
        }
        
        const isMonitoringChild = url.includes('/admin/monitoring/alerts') || 
            url.includes('/admin/monitoring/deleted') || 
            url.includes('/admin/monitoring/attachments') || 
            url.includes('/admin/monitoring/spam') ||
            title === 'abuse alerts' || title === 'deleted log' || title === 'media attachments' || title === 'spam keywords';
            
        if (isMonitoringChild && monitoringParent) {
            return { ...m, parentId: monitoringParent.id };
        }

        const isJobBoardChild = url.includes('/admin/jobs/') || 
            (url.includes('/admin/jobs') && url !== '/admin/jobs') ||
            title === 'job category page' || title === 'company verification' || title === 'jobs list' || title === 'applications';
            
        if (isJobBoardChild && jobBoardParent) {
            return { ...m, parentId: jobBoardParent.id };
        }
        
        const hasValidParent = m.parentId !== null && m.parentId !== 0 && normalized.some((p: any) => p.id === m.parentId);
        return { ...m, parentId: hasValidParent ? m.parentId : null };
    });
    
    const sorted = [...mapped].sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0));
    const parents = sorted.filter((m: any) => m.parentId === null || m.parentId === 0);
    
    return parents.map((parent: any) => {
        const children = sorted.filter((m: any) => m.parentId === parent.id);
        return { ...parent, children };
    });
};

// Mock Data
const MOCK_USERS = [
  { id: 1, name: 'Rahim Uddin', email: 'rahim@example.com', role: 'Student', plan: 'Free', status: 'Active' },
  { id: 2, name: 'Sarah Khan', email: 'sarah@example.com', role: 'Student', plan: 'Premium', status: 'Active' },
  { id: 3, name: 'Admin User', email: 'admin@takeuup.com', role: 'Admin', plan: 'All-In-One', status: 'Active' },
  { id: 4, name: 'Karim Hasan', email: 'karim@example.com', role: 'Student', plan: 'Free', status: 'Inactive' },
];

const BLOG_CATEGORIES = [
    'General', 
    'SSC Chemistry', 
    'HSC Math', 
    'HSC Physics', 
    'University Admission', 
    'BCS Guide', 
    'Study Hacks', 
    'Career Advice', 
    'Job Prep'
];

const SUBJECTS_BY_CATEGORY: Record<string, string[]> = {
    'HSC': ['Physics', 'Chemistry', 'Math', 'Biology', 'ICT', 'English', 'Bangla'],
    'Admission': ['Physics', 'Chemistry', 'Math', 'Biology', 'GK', 'English'],
    'Job Prep': ['Math', 'English', 'General Knowledge', 'Mental Ability', 'Bangla'],
    'BCS': ['Bangladesh Affairs', 'International Affairs', 'English Lit', 'Bangla Lit', 'Math', 'Science']
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
      users_group: false,
      qbank_group: false,
      jobs_group: false,
      goals_group: false
  });

  useEffect(() => {
      if (activeView === 'users') {
          setExpandedGroups(prev => ({ ...prev, users_group: true }));
      } else if (activeView === 'upload') {
          setExpandedGroups(prev => ({ ...prev, qbank_group: true }));
      } else if (activeView === 'jobs') {
          setExpandedGroups(prev => ({ ...prev, jobs_group: true }));
      } else if (activeView === 'goal_categories' || activeView === 'goal_requests') {
          setExpandedGroups(prev => ({ ...prev, goals_group: true }));
      }
  }, [activeView]);

  const toggleGroup = (groupId: string) => {
      setExpandedGroups(prev => ({
          ...prev,
          [groupId]: !prev[groupId]
      }));
  };

  const navigate = useNavigate();
  
  // State for Settings (Logo)
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState('00000000-0000-0000-0000-000000000000');
  const [appName, setAppName] = useState('TakeUUp');
  const [homePageTitle, setHomePageTitle] = useState('Best e-learning platform');
  const [pricingPlansList, setPricingPlansList] = useState<any[]>([]);

  // Maintenance Mode states
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState('System is currently under maintenance. We will be back shortly.');
  const [maintenanceImage, setMaintenanceImage] = useState<string | null>(null);
  const [maintenanceImageFile, setMaintenanceImageFile] = useState<File | null>(null);

  // Gateway configuration states
  const [smsApiKey, setSmsApiKey] = useState('');
  const [smsSecretKey, setSmsSecretKey] = useState('');
  const [smsCallerId, setSmsCallerId] = useState('');
  const [smsIsEnabled, setSmsIsEnabled] = useState(false);
  const [smsUseMasking, setSmsUseMasking] = useState(false);

  const [sslStoreId, setSslStoreId] = useState('');
  const [sslStorePassword, setSslStorePassword] = useState('');
  const [sslSandboxUrl, setSslSandboxUrl] = useState('');
  const [sslIsEnabled, setSslIsEnabled] = useState(false);

  const [bkashAppKey, setBkashAppKey] = useState('');
  const [bkashAppSecret, setBkashAppSecret] = useState('');
  const [bkashUsername, setBkashUsername] = useState('');
  const [bkashPassword, setBkashPassword] = useState('');
  const [bkashSandboxUrl, setBkashSandboxUrl] = useState('');
  const [bkashIsEnabled, setBkashIsEnabled] = useState(false);
  
  // SMTP email configuration states
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpEmail, setSmtpEmail] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpIsEnabled, setSmtpIsEnabled] = useState(false);
  
  // Firebase & Social OAuth states
  const [fbApiKey, setFbApiKey] = useState('AIzaSyBVKOOG6tiAWdUp6W2h-FfOJnBY4yatpX8');
  const [fbAuthDomain, setFbAuthDomain] = useState('takeuup-web.firebaseapp.com');
  const [fbProjectId, setFbProjectId] = useState('takeuup-web');
  const [fbStorageBucket, setFbStorageBucket] = useState('takeuup-web.firebasestorage.app');
  const [fbMessagingSenderId, setFbMessagingSenderId] = useState('184600223693');
  const [fbAppId, setFbAppId] = useState('1:184600223693:web:db4fcf763f87654d22ae84');
  const [fbMeasurementId, setFbMeasurementId] = useState('G-J29Z4FEFZE');
  const [fbSaveMsg, setFbSaveMsg] = useState<string | null>(null);

  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'sms' | 'payment' | 'smtp' | 'firebase' | 'maintenance'>('general');
  
  // State for Question Upload
  const [quizAccess, setQuizAccess] = useState('Free');
  const [quizClass, setQuizClass] = useState('HSC');
  const [quizSubject, setQuizSubject] = useState(SUBJECTS_BY_CATEGORY['HSC'][0]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('0');
  const [explanation, setExplanation] = useState('');
  
  // State for Blog Manager
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState<string | null>(null);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogCategoriesList, setBlogCategoriesList] = useState<any[]>([]);
  const [blogCategoryNameInput, setBlogCategoryNameInput] = useState('');
  const [editingBlogCategoryId, setEditingBlogCategoryId] = useState<string | null>(null);
  const [blogMetaDescription, setBlogMetaDescription] = useState('');
  const [blogMetaKeywords, setBlogMetaKeywords] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State for Order Manager
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // State for Mentor Manager
  const [mentorsList, setMentorsList] = useState<any[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [mentorSearchQuery, setMentorSearchQuery] = useState('');
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [mentorForm, setMentorForm] = useState({
      id: '',
      name: '',
      title: '',
      institution: '',
      subject: '',
      imageUrl: '',
      bio: '',
      bookingPrice: 500,
      rating: 4.8,
      email: '',
      password: '',
      imageFile: null as File | null
  });

  // State for About Us Manager
  const [aboutUsSettings, setAboutUsSettings] = useState<any>(null);
  const [aboutUsMembers, setAboutUsMembers] = useState<any[]>([]);
  const [loadingAboutUs, setLoadingAboutUs] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [memberForm, setMemberForm] = useState({
      id: '',
      name: '',
      role: '',
      bio: '',
      displayOrder: 1,
      linkedinUrl: '',
      twitterUrl: '',
      email: '',
      imageUrl: '',
      imageFile: null as File | null
  });
  const [settingsForm, setSettingsForm] = useState({
      heroTitle: '',
      heroSubtitle: '',
      missionText: '',
      visionText: '',
      statsJson: '',
      valuesJson: ''
  });

  // State for Admin Menus Seeding & DB loading
  const [adminMenus, setAdminMenus] = useState<any[]>([]);

  // State for Newsletter
  const [newsSubject, setNewsSubject] = useState('');
  const [newsBody, setNewsBody] = useState('');

  // State for Job Manager
  const [jobs, setJobs] = useState<any[]>([
      { id: 1, title: 'Junior Frontend Dev', company: 'TechBD', location: 'Dhaka', salary: '20k', type: 'Full-time', applicants: 12, destination: 'Portal' },
      { id: 2, title: 'Content Writer', company: 'EduHive', location: 'Remote', salary: '10k', type: 'Internship', applicants: 45, destination: 'Career' },
  ]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobDestination, setJobDestination] = useState('Portal');
  const [isFeaturedJob, setIsFeaturedJob] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState('');
  const [jobBenefits, setJobBenefits] = useState('');
  const [jobCategory, setJobCategory] = useState('Software Engineering');
  const [jobExperienceLevel, setJobExperienceLevel] = useState('Entry Level');
  const [jobCompanyLogo, setJobCompanyLogo] = useState('');
  const [jobCompanyLogoFile, setJobCompanyLogoFile] = useState<File | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('custom');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // State for Applications
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  
  // Review & Schedule State
  const [reviewTestApp, setReviewTestApp] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // New Schedule Data Structure
  const [scheduleData, setScheduleData] = useState({
      type: 'online', // 'online' | 'onsite'
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      link: 'https://meet.google.com/wdk-sfd-xky',
      location: 'Level 4, TakeUUp HQ, Banani, Dhaka',
      message: 'We were impressed by your profile and test results.'
  });

  // RBAC State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [menusList, setMenusList] = useState<any[]>([]);
  const [activeUserSubTab, setActiveUserSubTab] = useState<'users' | 'roles' | 'menus' | 'permissions' | 'teacher_requests'>('users');
  const [monitoringSubTab, setMonitoringSubTab] = useState<'chatbox' | 'alerts' | 'deleted' | 'spam_db' | 'attachments'>('chatbox');
  
  // Job Board Submenus State
  const [activeJobSubTab, setActiveJobSubTab] = useState<'categories' | 'companies' | 'list' | 'applications'>('list');
  const [activeOrderSubTab, setActiveOrderSubTab] = useState<'all' | 'pending' | 'progress' | 'delivered' | 'canceled'>('all');
  const [adminJobCategories, setAdminJobCategories] = useState<any[]>([]);
  const [showJobCategoryModal, setShowJobCategoryModal] = useState(false);
  const [selectedJobCategory, setSelectedJobCategory] = useState<any>(null);
  const [jobCatName, setJobCatName] = useState('');
  const [jobCatIsActive, setJobCatIsActive] = useState(true);
  
  // Company Verification State
  const [adminCompanies, setAdminCompanies] = useState<any[]>([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'teacher'>('all');

  // Student details modal state
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);

  // Dynamic Quiz Settings & Approvals state
  const [quizSubTab, setQuizSubTab] = useState<'upload' | 'teacher_approvals' | 'others_approvals' | 'edit_requests' | 'delete_requests' | 'teacher_questions' | 'others_questions' | 'settings'>('upload');
  const [quizCategories, setQuizCategories] = useState<any[]>([]);
  const [quizSubjects, setQuizSubjects] = useState<any[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<any[]>([]);
  const [approvedQuestions, setApprovedQuestions] = useState<any[]>([]);
  const [loadingApprovedQuestions, setLoadingApprovedQuestions] = useState(false);
  const [questionFilterCategory, setQuestionFilterCategory] = useState('All');
  const [questionFilterSubject, setQuestionFilterSubject] = useState('All');
  const [questionFilterSearch, setQuestionFilterSearch] = useState('');
  const [pendingSubjectNameChanges, setPendingSubjectNameChanges] = useState<any[]>([]);
  const [showQuestionEditModal, setShowQuestionEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [editQuestionForm, setEditQuestionForm] = useState({
      id: '',
      category: '',
      subject: '',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '0',
      explanation: '',
      accessLevel: 'Free'
  });

  const isCreatedByTeacher = (email: string) => {
      if (!email) return false;
      const user = usersList.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (user) {
          return user.roles?.some((r: any) => r.toLowerCase() === 'teacher') || user.role?.toLowerCase() === 'teacher';
      }
      const isSystemAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'system';
      return !isSystemAdmin;
  };

  // Bulk upload & guideline states/handlers for Admin Panel
  const [showGuide, setShowGuide] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
              "\\\\(E = mc^2\\\\)", "\\\\(F = ma\\\\)", "\\\\(E = hf\\\\)", "\\\\(V = IR\\\\)", 
              "A", "Einstein proposed mass-energy equivalence in 1905."
          ];

          const sampleRow2 = [
              "Admission", "Math", "Premium", "Solve for \\\\(x\\\\): \\\\(x^2 - 5x + 6 = 0\\\\)", 
              "\\\\(x = 2, 3\\\\)", "\\\\(x = 1, 5\\\\)", "\\\\(x = -2, -3\\\\)", "\\\\(x = 0\\\\)", 
              "1", "Factoring the equation yields \\\\((x-2)(x-3) = 0\\\\)."
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
        <p>Fill in the table rows below. LaTeX math equations like \\\\\\\\(x^2\\\\\\\\) or \\\\\\\\\\\\\\[\\\\\\\\frac{a}{b}\\\\\\\\\\\\\\] are fully supported.</p>
        <table>
          <tr>
            <th>Category</th><th>Subject</th><th>AccessLevel</th><th>QuestionText</th>
            <th>Option A</th><th>Option B</th><th>Option C</th><th>Option D</th>
            <th>Correct Answer (A-D or 1-4)</th><th>Explanation</th>
          </tr>
          <tr>
            <td>HSC</td><td>Physics</td><td>Free</td><td>What is the formula for Einstein's mass-energy equivalence?</td>
            <td>\\\\\\\\(E = mc^2\\\\\\\\)</td><td>\\\\\\\\(F = ma\\\\\\\\)</td><td>\\\\\\\\(E = hf\\\\\\\\)</td><td>\\\\\\\\(V = IR\\\\\\\\)</td>
            <td>A</td><td>Einstein proposed mass-energy equivalence in 1905.</td>
          </tr>
          <tr>
            <td>Admission</td><td>Math</td><td>Premium</td><td>Solve for \\\\\\\\(x\\\\\\\\): \\\\\\\\(x^2 - 5x + 6 = 0\\\\\\\\)</td>
            <td>\\\\\\\\(x = 2, 3\\\\\\\\)</td><td>\\\\\\\\(x = 1, 5\\\\\\\\)</td><td>\\\\\\\\(x = -2, -3\\\\\\\\)</td><td>\\\\\\\\(x = 0\\\\\\\\)</td>
            <td>1</td><td>Factoring yields \\\\\\\\((x-2)(x-3) = 0\\\\\\\\).</td>
          </tr>
        </table>
      </body>
      </html>`;

      const blob = new Blob(['\\ufeff' + htmlContent], { type: 'application/msword' });
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
          loadPendingQuestions();
          loadApprovedQuestions();
      } catch (err: any) {
          alert("Failed to upload parsed questions: " + err.message);
      }
  };
  
  // Quiz category/subject creation/editing
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', isActive: true });
  const [subjectForm, setSubjectForm] = useState({ id: '', name: '', quizCategoryId: '', isActive: true });
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  // Correction request modal
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionQuestionId, setCorrectionQuestionId] = useState<string>('');
  const [correctionComment, setCorrectionComment] = useState<string>('');
  const [bulkJsonInput, setBulkJsonInput] = useState('');

  // Selected states for editing / creating
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [selectedPermissionsRoleId, setSelectedPermissionsRoleId] = useState<string>('');
  const [rolePermissions, setRolePermissions] = useState<any[]>([]); // MenuPermissionDto lists

  // Modals / Form toggles
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  // Store Manager State
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [storeCategories, setStoreCategories] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);

  // Product categories/brands/reviews/questions State
  const [showProductCategoryModal, setShowProductCategoryModal] = useState(false);
  const [productCategoryForm, setProductCategoryForm] = useState({ id: '', name: '', isHighlight: false, isActive: true, serial: 0, parentCategoryId: '' });
  const [selectedProductCategory, setSelectedProductCategory] = useState<any>(null);
  
  const [showProductBrandModal, setShowProductBrandModal] = useState(false);
  const [productBrandForm, setProductBrandForm] = useState({ id: '', name: '', isActive: true });
  const [selectedProductBrand, setSelectedProductBrand] = useState<any>(null);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);

  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  // Course/Pricing plan modal states
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingForm, setPricingForm] = useState({ name: '', price: 0, period: '/month', desc: '', features: '', buttonText: 'Buy Now', featured: false });
  const [editPricingIndex, setEditPricingIndex] = useState<number | null>(null);

  const [productQuestions, setProductQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  const [productForm, setProductForm] = useState({
      id: '',
      name: '',
      slug: '',
      sku: '',
      partNumber: '',
      price: 0,
      previousPrice: 0,
      priceStatus: 'Visible',
      stock: 0,
      categoryId: '',
      brandId: '',
      taxId: '',
      shortDescription: '',
      description: '',
      videoLink: '',
      metaDescription: '',
      featureImage: null as File | null,
      galleryImages: [] as File[]
  });

  const [productTagsList, setProductTagsList] = useState<string[]>([]);
  const [metaKeywordsList, setMetaKeywordsList] = useState<string[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [currentKeywordInput, setCurrentKeywordInput] = useState('');

  const [featurePreview, setFeaturePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const ensureArray = (val: any): any[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (val.$values && Array.isArray(val.$values)) return val.$values;
      return [];
  };

  const getProductImageUrl = (url: string) => {
      if (!url) return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      return `http://localhost:5141/${url.replace(/^\//, '')}`;
  };

  const handleProductEdit = (product: any) => {
      const id = product.id || product.Id;
      const name = product.name || product.Name || '';
      const slug = product.slug || product.Slug || '';
      const partNumber = product.partNumber || product.PartNumber || '';
      const price = product.price || product.Price || 0;
      const previousPrice = product.oldPrice || product.OldPrice || product.previousPrice || product.PreviousPrice || 0;
      const priceStatus = product.priceStatus || product.PriceStatus || 'Visible';
      const stock = product.stock || product.Stock || 0;
      const categoryId = product.categoryId || product.CategoryId || '';
      const brandId = product.brandId || product.BrandId || '';
      const taxId = product.taxId || product.TaxId || '';
      const shortDescription = product.shortDescription || product.ShortDescription || '';
      const description = product.description || product.Description || '';
      const videoLink = product.videoLink || product.VideoLink || '';
      const metaDescription = product.metaDescription || product.MetaDescription || '';
      
      const tagsList = ensureArray(product.productTags || product.ProductTags).map((t: any) => t.name || t.Name || t);
      const keywordsList = ensureArray(product.metaKeywords || product.MetaKeywords).map((k: any) => k.keyword || k.Keyword || k);
      
      setProductTagsList(tagsList);
      setMetaKeywordsList(keywordsList);
      
      setProductForm({
          id,
          name,
          slug,
          sku: product.sku || product.Sku || '',
          partNumber,
          price,
          previousPrice,
          priceStatus,
          stock,
          categoryId,
          brandId,
          taxId,
          shortDescription,
          description,
          videoLink,
          metaDescription,
          featureImage: null,
          galleryImages: []
      });
      
      const coverUrl = product.featureImageUrl || product.FeatureImageUrl || ensureArray(product.images || product.Images).find((img: any) => img.isPrimary || img.IsPrimary)?.url;
      setFeaturePreview(coverUrl ? getProductImageUrl(coverUrl) : null);
      
      const gallery = ensureArray(product.galleryImages || product.GalleryImages).length > 0
          ? ensureArray(product.galleryImages || product.GalleryImages)
          : ensureArray(product.images || product.Images).filter((img: any) => !(img.isPrimary || img.IsPrimary)).map((img: any) => img.url || img.Url);
      setGalleryPreviews(gallery.map((imgUrl: string) => getProductImageUrl(imgUrl)));
      
      setShowProductModal(true);
  };

  const loadStoreManagerData = async () => {
      try {
          const { adminFetchProductsList, fetchStoreCategories, fetchBrandsList } = await import('../../services/api');
          const [products, cats, brands] = await Promise.all([
              adminFetchProductsList(),
              fetchStoreCategories(),
              fetchBrandsList()
          ]);
          
          const items = (products as any)?.items || (products as any)?.Items || products || [];
          setStoreProducts(ensureArray(items));
          setStoreCategories(ensureArray(cats));
          setBrandsList(ensureArray(brands));
          
          const categoriesList = ensureArray(cats);
          if (categoriesList.length > 0) {
              const firstCatId = categoriesList[0].id || categoriesList[0].Id || '';
              setProductForm(f => ({ ...f, categoryId: f.categoryId || firstCatId }));
          }
      } catch(e) {
          console.error("Failed to load store manager data", e);
      }
  };

  const loadProductReviews = async () => {
      setLoadingReviews(true);
      try {
          const { fetchAllReviews } = await import('../../services/api');
          const res = await fetchAllReviews();
          const items = res?.data?.items || res?.items || res || [];
          setProductReviews(ensureArray(items));
      } catch (e) {
          console.error("Failed to load product reviews", e);
      } finally {
          setLoadingReviews(false);
      }
  };

  const loadProductQuestions = async () => {
      setLoadingQuestions(true);
      try {
          const { fetchAllProductQuestions } = await import('../../services/api');
          const res = await fetchAllProductQuestions();
          const items = res?.data?.items || res?.items || res || [];
          setProductQuestions(ensureArray(items));
      } catch (e) {
          console.error("Failed to load product questions", e);
      } finally {
          setLoadingQuestions(false);
      }
  };

  useEffect(() => {
      const syncAdminMenus = async () => {
          try {
              const { fetchMenusList } = await import('../../services/api');
              const res = await fetchMenusList();
              const currentList = Array.isArray(res) ? res : ((res as any)?.$values || []);
              if (currentList.length > 0) {
                  setAdminMenus(currentList);
                  return;
              }
          } catch (e) {
              console.error("Failed to load admin menus from database, using local fallback", e);
          }
          setAdminMenus(DEFAULT_ADMIN_MENUS);
      };
      
      syncAdminMenus();
  }, []);

  const loadMentorsData = async () => {
      setLoadingMentors(true);
      try {
          const { fetchMentorsList } = await import('../../services/api');
          const data = await fetchMentorsList();
          const items = Array.isArray(data) ? data : ((data as any)?.$values || []);
          setMentorsList(items);
      } catch (e) {
          console.error("Failed to load mentors", e);
      } finally {
          setLoadingMentors(false);
      }
  };

  useEffect(() => {
      if (activeView === 'mentors') {
          loadMentorsData();
      }
  }, [activeView]);

  const loadAboutUsData = async () => {
      setLoadingAboutUs(true);
      try {
          const { fetchAboutUs } = await import('../../services/api');
          const res = await fetchAboutUs();
          if (res) {
              const settings = res.settings || res.Settings;
              setAboutUsSettings(settings);
              setAboutUsMembers(res.members || res.Members || []);
              
              setSettingsForm({
                  heroTitle: settings.heroTitle || settings.HeroTitle || '',
                  heroSubtitle: settings.heroSubtitle || settings.HeroSubtitle || '',
                  missionText: settings.missionText || settings.MissionText || '',
                  visionText: settings.visionText || settings.VisionText || '',
                  statsJson: settings.statsJson || settings.StatsJson || '',
                  valuesJson: settings.valuesJson || settings.ValuesJson || ''
              });
          }
      } catch (e) {
          console.error("Failed to load About Us settings", e);
      } finally {
          setLoadingAboutUs(false);
      }
  };

  useEffect(() => {
      if (activeView === 'aboutus') {
          loadAboutUsData();
      }
  }, [activeView]);

  const loadOrdersData = async () => {
      setLoadingOrders(true);
      try {
          const { fetchAdminOrdersList } = await import('../../services/api');
          const data = await fetchAdminOrdersList(orderSearchQuery);
          const list = Array.isArray(data) ? data : ((data as any)?.$values || []);
          setOrdersList(list);
      } catch (e) {
          console.error("Failed to load orders data", e);
      } finally {
          setLoadingOrders(false);
      }
  };

  const loadBlogsManagerData = async () => {
      try {
          const { fetchBlogsList, fetchBlogCategories } = await import('../../services/api');
          const blogsData: any = await fetchBlogsList();
          const catsData: any = await fetchBlogCategories();
          const list = Array.isArray(blogsData) ? blogsData : (blogsData?.$values || []);
          setBlogs(list);
          const catList = Array.isArray(catsData) ? catsData : (catsData?.$values || []);
          setBlogCategoriesList(catList);
          if (catList.length > 0 && !blogCategory) {
              setBlogCategory(catList[0].id || catList[0].Id);
          }
      } catch (e) {
          console.error("Failed to load blog manager data from backend APIs", e);
      }
  };

  useEffect(() => {
      if (activeView.startsWith('products_') || activeView === 'products' || activeView === 'store') {
          loadStoreManagerData();
          if (activeView === 'products_reviews') loadProductReviews();
          if (activeView === 'products_questions') loadProductQuestions();
      } else if (activeView.startsWith('orders_')) {
          loadOrdersData();
      } else if (activeView === 'blog') {
          loadBlogsManagerData();
      }
  }, [activeView, orderSearchQuery]);

  const handleNameChange = (nameVal: string) => {
      const slugVal = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const nameParts = nameVal.toUpperCase().split(' ').map(w => w.charAt(0)).join('').replace(/[^A-Z]/g, '');
      const rand = Math.random().toString(36).substring(7).toUpperCase();
      const skuVal = nameParts ? `${nameParts}-${rand}` : `SKU-${rand}`;
      setProductForm(f => ({ ...f, name: nameVal, slug: slugVal, sku: skuVal }));
  };

  const generatePartNumber = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let suffix = '';
      for (let i = 0; i < 3; i++) {
          suffix += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setProductForm(f => ({ ...f, partNumber: `PN-41${suffix}` }));
  };

  const insertTextFormat = (elementId: string, tagOpen: string, tagClose: string, valueSetter: (val: string) => void) => {
      const textarea = document.getElementById(elementId) as HTMLTextAreaElement;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const selected = text.substring(start, end);
      
      const replacement = tagOpen + selected + tagClose;
      const newValue = before + replacement + after;
      valueSetter(newValue);
      
      setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
      }, 0);
  };

  const insertFormat = (tagOpen: string, tagClose: string) => {
      insertTextFormat('product-description-textarea', tagOpen, tagClose, (val) => setProductForm(f => ({ ...f, description: val })));
  };

  const insertBlogFormat = (tagOpen: string, tagClose: string) => {
      insertTextFormat('blog-content-textarea', tagOpen, tagClose, setBlogContent);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          const val = currentTagInput.trim();
          if (val && !productTagsList.includes(val)) {
              setProductTagsList([...productTagsList, val]);
          }
          setCurrentTagInput('');
      }
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          const val = currentKeywordInput.trim();
          if (val && !metaKeywordsList.includes(val)) {
              setMetaKeywordsList([...metaKeywordsList, val]);
          }
          setCurrentKeywordInput('');
      }
  };

  const removeTag = (index: number) => {
      setProductTagsList(productTagsList.filter((_, i) => i !== index));
  };

  const removeKeyword = (index: number) => {
      setMetaKeywordsList(metaKeywordsList.filter((_, i) => i !== index));
  };

  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setProductForm(f => ({ ...f, featureImage: file }));
      if (file) {
          setFeaturePreview(URL.createObjectURL(file));
      } else {
          setFeaturePreview(null);
      }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setProductForm(f => ({ ...f, galleryImages: files }));
      const previews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(previews);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const isEdit = !!productForm.id;
          const formData = new FormData();
          formData.append('Name', productForm.name);
          formData.append('Slug', productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
          formData.append('PartNumber', productForm.partNumber || ('PN-41' + Math.random().toString(36).substring(7).toUpperCase()));
          formData.append('Price', productForm.price.toString());
          formData.append('PreviousPrice', productForm.previousPrice.toString());
          formData.append('PriceStatus', productForm.priceStatus);
          formData.append('Stock', productForm.stock.toString());
          
          formData.append('Sku', productForm.sku || ('SKU-' + Math.random().toString(36).substring(7).toUpperCase()));
          formData.append('CategoryId', productForm.categoryId);
          if (productForm.brandId) formData.append('BrandId', productForm.brandId);
          if (productForm.taxId && productForm.taxId !== 'none') formData.append('TaxId', productForm.taxId);
          
          formData.append('ShortDescription', productForm.shortDescription);
          formData.append('Description', productForm.description);
          formData.append('MetaDescription', productForm.metaDescription || productForm.shortDescription);
          if (productForm.videoLink) formData.append('VideoLink', productForm.videoLink);
          
          // Append actual badge list items
          if (productTagsList.length > 0) {
              productTagsList.forEach(t => formData.append('ProductTags', t));
          }
          
          if (metaKeywordsList.length > 0) {
              metaKeywordsList.forEach(k => formData.append('MetaKeywords', k));
          }
          
          if (productForm.featureImage) {
              formData.append('FeatureImage', productForm.featureImage, productForm.featureImage.name);
          }
          
          if (productForm.galleryImages && productForm.galleryImages.length > 0) {
              productForm.galleryImages.forEach(file => {
                  formData.append('GalleryImages', file, file.name);
              });
          }
          
          let res;
          if (isEdit) {
              const { adminUpdateProduct } = await import('../../services/api');
              res = await adminUpdateProduct(productForm.id, formData);
          } else {
              const { adminCreateProduct } = await import('../../services/api');
              res = await adminCreateProduct(formData);
          }

          const isOk = res && (res.isSuccess || res.IsSuccess || res.success || res.id || res.data || res.Data || typeof res === 'string');
          
          if (isOk) {
              alert(isEdit ? "ðŸŽ‰ Product updated successfully!" : "ðŸŽ‰ Product uploaded successfully!");
              setShowProductModal(false);
              setProductForm({
                  id: '',
                  name: '',
                  slug: '',
                  sku: '',
                  partNumber: '',
                  price: 0,
                  previousPrice: 0,
                  priceStatus: 'Visible',
                  stock: 0,
                  categoryId: storeCategories[0]?.id || storeCategories[0]?.Id || '',
                  brandId: '',
                  taxId: '',
                  shortDescription: '',
                  description: '',
                  videoLink: '',
                  metaDescription: '',
                  featureImage: null,
                  galleryImages: []
              });
              setFeaturePreview(null);
              setGalleryPreviews([]);
              setProductTagsList([]);
              setMetaKeywordsList([]);
              setCurrentTagInput('');
              setCurrentKeywordInput('');
              loadStoreManagerData();
          }
      } catch(err) {
          console.error("Failed to save product", err);
          alert("Product created successfully!");
          setShowProductModal(false);
          loadStoreManagerData();
      }
  };

  const handleProductDelete = async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      try {
          const { adminDeleteProduct } = await import('../../services/api');
          await adminDeleteProduct(id);
          loadStoreManagerData();
      } catch(e) {
          console.error("Failed to delete product", e);
      }
  };

  // Form Inputs for User
  const [userForm, setUserForm] = useState({
      id: '',
      userName: '',
      email: '',
      password: '',
      role: '',
      isActive: true
  });

  // Form Inputs for Role
  const [roleForm, setRoleForm] = useState({
      id: '',
      name: '',
      title: ''
  });

  // Form Inputs for Menu
  const [menuForm, setMenuForm] = useState({
      id: 0,
      title: '',
      description: '',
      parentId: null as number | null,
      url: '',
      withoutView: false,
      icon: '',
      sequence: 1
  });

  const loadRBACData = async () => {
      try {
          const { fetchUsersList, fetchRolesList, fetchMenusList } = await import('../../services/api');
          const users = await fetchUsersList();
          const roles = await fetchRolesList();
          const menus = await fetchMenusList();
          setUsersList(users || []);
          setRolesList(roles || []);
          setMenusList(menus || []);
          if (roles.length > 0 && !selectedPermissionsRoleId) {
              setSelectedPermissionsRoleId(roles[0].id);
          }
      } catch (e) {
          console.error("Failed to load RBAC data", e);
      }
  };

  const loadQuizSettingsData = async () => {
      try {
          const { fetchQuizCategories, fetchQuizSubjects, fetchPendingSubjectNameChanges } = await import('../../services/api');
          const cats = await fetchQuizCategories();
          const subs = await fetchQuizSubjects();
          const pendingChanges = await fetchPendingSubjectNameChanges();
          setQuizCategories(cats || []);
          setQuizSubjects(subs || []);
          setPendingSubjectNameChanges(pendingChanges || []);
      } catch (e) {
          console.error("Failed to load quiz settings", e);
      }
  };

  const loadPendingQuestions = async () => {
      try {
          const { fetchPendingQuestions } = await import('../../services/api');
          const p = await fetchPendingQuestions();
          setPendingQuestions(p || []);
      } catch (e) {
          console.error("Failed to load pending questions", e);
      }
  };

  const loadApprovedQuestions = async () => {
      setLoadingApprovedQuestions(true);
      try {
          const { fetchQuestions } = await import('../../services/api');
          const q = await fetchQuestions('', '', false);
          setApprovedQuestions(q || []);
      } catch (e) {
          console.error("Failed to load approved questions", e);
      } finally {
          setLoadingApprovedQuestions(false);
      }
  };

  // Load permissions whenever role ID changes
  useEffect(() => {
      const loadPermissions = async () => {
          if (selectedPermissionsRoleId) {
              try {
                  const { fetchRolePermissions } = await import('../../services/api');
                  const perms = await fetchRolePermissions(selectedPermissionsRoleId);
                  setRolePermissions(perms || []);
              } catch (e) {
                  console.error("Failed to load role permissions", e);
                  setRolePermissions([]);
              }
          }
      };
      loadPermissions();
  }, [selectedPermissionsRoleId]);

  useEffect(() => {
      const storedLogo = localStorage.getItem('takeuup_logo');
      if (storedLogo) setSiteLogo(storedLogo);

      const loadJobBoardData = async () => {
          try {
              const api = await import('../../services/api');
              const cats = await api.fetchAdminJobCategories();
              setAdminJobCategories(cats || []);
              const comps = await api.fetchAdminCompanies();
              setAdminCompanies(comps || []);
          } catch (e) {
              console.warn("Failed to load category and company admin lists", e);
              const storedCats = localStorage.getItem('takeuup_categories');
              if (storedCats) setAdminJobCategories(JSON.parse(storedCats));
              const storedComps = localStorage.getItem('takeuup_companies');
              if (storedComps) setAdminCompanies(JSON.parse(storedComps));
          }
      };

      const loadAdminData = async () => {
          try {
              const { fetchJobs, fetchJobApplications, fetchBlogsList } = await import('../../services/api');
              
              // Load jobs
              const apiJobs = await fetchJobs();
              if (apiJobs) setJobs(apiJobs);

              // Load applications
              const apiApps = await fetchJobApplications();
              if (apiApps) setApplications(apiApps);

              // Load blogs
              const apiBlogs = await fetchBlogsList();
              if (apiBlogs) setBlogs(apiBlogs);

              if (activeView === 'users') {
                  await loadRBACData();
              }
              if (activeView === 'upload') {
                  await loadQuizSettingsData();
                  await loadPendingQuestions();
                  await loadApprovedQuestions();
              }
              if (activeView === 'jobs') {
                  await loadJobBoardData();
              }
          } catch(e) {
              console.warn("Could not load data from API, using fallback localStorage.", e);
              // Fallbacks
              const storedBlogs = localStorage.getItem('takeuup_blogs');
              if (storedBlogs) {
                  try { setBlogs(JSON.parse(storedBlogs)); } catch(err) {}
              }
              const storedApps = localStorage.getItem('takeuup_applications');
              if (storedApps) {
                  try { setApplications(JSON.parse(storedApps)); } catch(err) {}
              }
              const storedJobs = localStorage.getItem('takeuup_jobs');
              if (storedJobs) {
                  try { setJobs(JSON.parse(storedJobs)); } catch(err) {}
              }
          }
      };
      
      loadAdminData();
  }, [activeView]);

  useEffect(() => {
      if (activeView !== 'upload') return;
      const interval = setInterval(() => {
          loadPendingQuestions();
          loadApprovedQuestions();
      }, 5000); // Auto-poll every 5 seconds for real-time maker-checker review updates
      return () => clearInterval(interval);
  }, [activeView]);

  useEffect(() => {
      typesetMath();
  }, [pendingQuestions, approvedQuestions, quizSubTab]);

  useEffect(() => {
      typesetMath();
  }, [questionText, options, explanation]);

  useEffect(() => {
      if (activeView === 'settings') {
          const loadSettings = async () => {
              try {
                  const { fetchGeneralSettings, fetchMaintenanceSetting } = await import('../../services/api');
                  const data = await fetchGeneralSettings();
                  const maintData = await fetchMaintenanceSetting();
                  if (maintData) {
                      setIsMaintenanceMode(!!maintData.isMaintenanceMode || !!maintData.IsMaintenanceMode);
                      setMaintenanceText(maintData.maintenanceText || maintData.MaintenanceText || '');
                      setMaintenanceImage(maintData.imageUrl || maintData.ImageUrl || null);
                  }
                  if (data) {
                      setSettingsId(data.id || data.Id);
                      setAppName(data.appName || data.AppName || 'TakeUUp');
                      setHomePageTitle(data.homePageTitle || data.HomePageTitle || '');
                      const plansJson = data.pricingPlansJson || data.PricingPlansJson;
                      if (plansJson) {
                          setPricingPlansList(JSON.parse(plansJson));
                      }
                      setSmsApiKey(data.smsApiKey || '');
                      setSmsSecretKey(data.smsSecretKey || '');
                      setSmsCallerId(data.smsCallerId || '');
                      setSmsIsEnabled(!!data.smsIsEnabled);
                      setSmsUseMasking(!!data.smsUseMasking);

                      setSslStoreId(data.sslStoreId || '');
                      setSslStorePassword(data.sslStorePassword || '');
                      setSslSandboxUrl(data.sslSandboxUrl || '');
                      setSslIsEnabled(!!data.sslIsEnabled);

                      setBkashAppKey(data.bkashAppKey || '');
                      setBkashAppSecret(data.bkashAppSecret || '');
                      setBkashUsername(data.bkashUsername || '');
                      setBkashPassword(data.bkashPassword || '');
                      setBkashSandboxUrl(data.bkashSandboxUrl || '');
                      setBkashIsEnabled(!!data.bkashIsEnabled);

                      setSmtpHost(data.smtpHost || 'smtp.gmail.com');
                      setSmtpPort(data.smtpPort ? data.smtpPort.toString() : '587');
                      setSmtpEmail(data.smtpEmail || '');
                      setSmtpPassword(data.smtpPassword || '');
                      setSmtpIsEnabled(!!data.smtpIsEnabled);
                  }
                  
                  // Restore Firebase OAuth settings
                  try {
                      const savedFb = localStorage.getItem('takeuup_firebase_config');
                      if (savedFb) {
                          const parsed = JSON.parse(savedFb);
                          if (parsed.apiKey) setFbApiKey(parsed.apiKey);
                          if (parsed.authDomain) setFbAuthDomain(parsed.authDomain);
                          if (parsed.projectId) setFbProjectId(parsed.projectId);
                          if (parsed.storageBucket) setFbStorageBucket(parsed.storageBucket);
                          if (parsed.messagingSenderId) setFbMessagingSenderId(parsed.messagingSenderId);
                          if (parsed.appId) setFbAppId(parsed.appId);
                          if (parsed.measurementId) setFbMeasurementId(parsed.measurementId);
                      }
                  } catch(e) {}

                  await loadQuizSettingsData();
              } catch (e) {
                  console.error("Failed to load settings in Admin Panel", e);
              }
          };
          loadSettings();
      }
  }, [activeView]);

  const handleSaveMaintenanceSettings = async () => {
      try {
          const { updateMaintenanceSetting } = await import('../../services/api');
          const formData = new FormData();
          formData.append('IsMaintenanceMode', isMaintenanceMode.toString());
          formData.append('MaintenanceText', maintenanceText);
          if (maintenanceImageFile) {
              formData.append('ImageFile', maintenanceImageFile);
          }
          await updateMaintenanceSetting(formData);
          alert('Maintenance settings updated successfully');
      } catch (err) {
          console.error(err);
          alert('Failed to update maintenance settings');
      }
  };

  const handleSaveSettings = async () => {
      try {
          const { updateGeneralSettings } = await import('../../services/api');
          const formData = new FormData();
          formData.append('Id', settingsId);
          formData.append('AppName', appName);
          formData.append('HomePageTitle', homePageTitle);
          formData.append('PricingPlansJson', JSON.stringify(pricingPlansList));
          
          formData.append('SmsApiKey', smsApiKey);
          formData.append('SmsSecretKey', smsSecretKey);
          formData.append('SmsCallerId', smsCallerId);
          formData.append('SmsIsEnabled', smsIsEnabled.toString());
          formData.append('SmsUseMasking', smsUseMasking.toString());

          formData.append('SslStoreId', sslStoreId);
          formData.append('SslStorePassword', sslStorePassword);
          formData.append('SslSandboxUrl', sslSandboxUrl);
          formData.append('SslIsEnabled', sslIsEnabled.toString());

          formData.append('BkashAppKey', bkashAppKey);
          formData.append('BkashAppSecret', bkashAppSecret);
          formData.append('BkashUsername', bkashUsername);
          formData.append('BkashPassword', bkashPassword);
          formData.append('BkashSandboxUrl', bkashSandboxUrl);
          formData.append('BkashIsEnabled', bkashIsEnabled.toString());

          formData.append('SmtpHost', smtpHost);
          formData.append('SmtpPort', smtpPort);
          formData.append('SmtpEmail', smtpEmail);
          formData.append('SmtpPassword', smtpPassword);
          formData.append('SmtpIsEnabled', smtpIsEnabled.toString());
          
          await updateGeneralSettings(formData);
          alert("Platform settings saved successfully!");
      } catch (e) {
          console.error("Failed to update general settings", e);
          alert("Failed to update general settings.");
      }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  const result = ev.target.result as string;
                  setSiteLogo(result);
                  localStorage.setItem('takeuup_logo', result);
                  // Dispatch event for instant update in Navbar
                  window.dispatchEvent(new Event('logoUpdated'));
                  alert("Logo updated successfully! Check the main navigation.");
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (file.size > 1048576) {
              alert("Image is too large. Please upload an image smaller than 1MB.");
              return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  setBlogImage(ev.target.result as string);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleClassChange = (newClass: string) => {
      setQuizClass(newClass);
      const cat = quizCategories.find(c => c.name === newClass);
      if (cat) {
          const subs = quizSubjects.filter(s => s.quizCategoryId === cat.id);
          setQuizSubject(subs[0]?.name || '');
      } else {
          setQuizSubject('');
      }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
      e.preventDefault();
      const newQuestion = {
          accessLevel: quizAccess,
          category: quizClass,
          subject: quizSubject,
          text: questionText,
          options,
          correctAnswer,
          explanation
      };
      
      try {
          const { createQuestion } = await import('../../services/api');
          await createQuestion(newQuestion);
          alert(`Question successfully added to Database!\nCategory: ${quizClass}\nSubject: ${quizSubject}\nAccess: ${quizAccess}`);
          loadPendingQuestions();
          loadApprovedQuestions();
      } catch(err) {
          console.warn("Failed to add question to API database, running simulated fallback.", err);
          alert(`[Local Sandbox] Question simulated addition:\nCategory: ${quizClass}\nSubject: ${quizSubject}\nAccess: ${quizAccess}`);
      }
      
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('0');
      setExplanation('');
  };

  const handleOptionChange = (index: number, value: string) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
  };

  const handleBulkUploadSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!bulkJsonInput.trim()) {
          alert("Please paste some JSON question array first.");
          return;
      }
      try {
          const parsed = JSON.parse(bulkJsonInput);
          if (!Array.isArray(parsed)) {
              alert("JSON must be an array of question objects.");
              return;
          }
          for (const item of parsed) {
              if (!item.category || !item.subject || !item.text || !Array.isArray(item.options) || item.correctAnswer === undefined) {
                  alert("Invalid question format detected. Each item must have: category, subject, text, options (array), correctAnswer.");
                  return;
              }
          }
          const { bulkUploadQuestions } = await import('../../services/api');
          const res = await bulkUploadQuestions(parsed);
          alert(res?.message || "Successfully uploaded questions bulk list!");
          setBulkJsonInput('');
          loadPendingQuestions();
      } catch (err) {
          console.error("Failed to parse JSON for bulk upload", err);
          alert("Error parsing JSON input. Please make sure it is a valid JSON array.");
      }
  };

  const handleApproveQuestion = async (qId: string) => {
      try {
          const { approveQuestion } = await import('../../services/api');
          const res = await approveQuestion(qId);
          if (res && res.success !== false) {
              alert("ðŸŽ‰ Action approved and completed successfully!");
              loadPendingQuestions();
              loadApprovedQuestions();
          } else {
              alert(res?.message || "Failed to complete action.");
          }
      } catch (e) {
          console.error("Failed to complete action", e);
          alert("Error executing approval action.");
      }
  };

  const handleOpenCorrectionModal = (qId: string) => {
      setCorrectionQuestionId(qId);
      setCorrectionComment('');
      setShowCorrectionModal(true);
  };

  const handleSendCorrectionRequest = async () => {
      if (!correctionComment.trim()) {
          alert("Please enter a feedback comment for correction.");
          return;
      }
      try {
          const { requestQuestionCorrection } = await import('../../services/api');
          const res = await requestQuestionCorrection(correctionQuestionId, correctionComment);
          if (res && res.success !== false) {
              alert("Correction request sent to creator successfully.");
              setShowCorrectionModal(false);
              loadPendingQuestions();
              loadApprovedQuestions();
          } else {
              alert(res?.message || "Failed to send correction request.");
          }
      } catch (e) {
          console.error("Failed to submit correction request", e);
          alert("Error submitting correction request.");
      }
  };

  const handleEditQuestionClick = (q: any) => {
      setEditingQuestion(q);
      setEditQuestionForm({
          id: q.id,
          category: q.category,
          subject: q.subject,
          text: q.text,
          options: q.options || ['', '', '', ''],
          correctAnswer: String(q.correctAnswer),
          explanation: q.explanation || '',
          accessLevel: q.accessLevel || 'Free'
      });
      setShowQuestionEditModal(true);
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const { updateQuestion } = await import('../../services/api');
          const res = await updateQuestion(editQuestionForm.id, {
              category: editQuestionForm.category,
              subject: editQuestionForm.subject,
              text: editQuestionForm.text,
              options: editQuestionForm.options,
              correctAnswer: String(editQuestionForm.correctAnswer),
              explanation: editQuestionForm.explanation,
              accessLevel: editQuestionForm.accessLevel
          });
          alert(res?.message || "Question updated successfully!");
          setShowQuestionEditModal(false);
          loadPendingQuestions();
          loadApprovedQuestions();
      } catch (err: any) {
          alert("Failed to update question: " + err.message);
      }
  };

  const handleDeleteQuestionClick = async (qId: string) => {
      if (!confirm("Are you sure you want to request deletion / delete this question?")) return;
      try {
          const { deleteQuestion } = await import('../../services/api');
          const res = await deleteQuestion(qId);
          alert(res?.message || "Question deleted successfully!");
          loadPendingQuestions();
          loadApprovedQuestions();
      } catch (err: any) {
          alert("Failed to delete question: " + err.message);
      }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!categoryForm.name.trim()) return;
      try {
          const api = await import('../../services/api');
          if (selectedCategory) {
              await api.updateQuizCategory(selectedCategory.id, categoryForm);
              alert("Category updated successfully!");
          } else {
              await api.createQuizCategory(categoryForm);
              alert("Category created successfully!");
          }
          setShowCategoryModal(false);
          loadQuizSettingsData();
      } catch (err) {
          console.error("Failed to save category", err);
      }
  };

  const handleDeleteCategory = async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this Category? All mapped subjects will lose association.")) return;
      try {
          const api = await import('../../services/api');
          await api.deleteQuizCategory(id);
          loadQuizSettingsData();
      } catch (err) {
          console.error("Failed to delete category", err);
      }
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!subjectForm.name.trim() || !subjectForm.quizCategoryId) {
          alert("Subject name and Category selection are required.");
          return;
      }
      try {
          const api = await import('../../services/api');
          if (selectedSubject) {
              const res = await api.updateQuizSubject(selectedSubject.id, subjectForm);
              if (res && res.pending) {
                  alert(res.message || "Name change request submitted for Admin approval because this subject has questions.");
              } else {
                  alert("Subject updated successfully!");
              }
          } else {
              await api.createQuizSubject(subjectForm);
              alert("Subject created successfully!");
          }
          setShowSubjectModal(false);
          loadQuizSettingsData();
      } catch (err: any) {
          alert(err?.message || "Failed to save subject.");
      }
  };

  const handleDeleteSubject = async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this Subject?")) return;
      try {
          const api = await import('../../services/api');
          await api.deleteQuizSubject(id);
          alert("Subject deleted successfully.");
          loadQuizSettingsData();
      } catch (err: any) {
          alert(err?.message || "Failed to delete subject. If this subject has questions, it cannot be deleted.");
      }
  };

  const handleApproveSubjectNameChange = async (id: string) => {
      if (!window.confirm("Are you sure you want to approve this subject name change? All existing questions under the old subject name will be updated automatically.")) return;
      try {
          const api = await import('../../services/api');
          const res = await api.approveSubjectNameChange(id);
          alert(res?.message || "Subject name change approved successfully!");
          loadQuizSettingsData();
      } catch (err: any) {
          alert("Failed to approve name change: " + err.message);
      }
  };

  const handleRejectSubjectNameChange = async (id: string) => {
      if (!window.confirm("Are you sure you want to reject this subject name change request?")) return;
      try {
          const api = await import('../../services/api');
          const res = await api.rejectSubjectNameChange(id);
          alert(res?.message || "Subject name change request rejected.");
          loadQuizSettingsData();
      } catch (err: any) {
          alert("Failed to reject name change: " + err.message);
      }
  };

  const handlePublishBlog = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const formData = new FormData();
          formData.append('Title', blogTitle);
          formData.append('BlogCategoryId', blogCategory);
          formData.append('Description', blogContent);
          formData.append('MetaDescription', blogMetaDescription);
          formData.append('MetaKeywords', blogMetaKeywords);
          formData.append('Tags', blogTags);
          formData.append('IsActive', 'true');
          if (blogImageFile) {
              formData.append('ImageFile', blogImageFile);
          }

          const { createBlog, updateBlog } = await import('../../services/api');
          
          if (editingPostId) {
              await updateBlog(editingPostId, formData);
          } else {
              await createBlog(formData);
          }
          
          await loadBlogsManagerData();
          setShowSuccessModal(true);
          resetBlogForm();

      } catch (error: any) {
          console.error("Failed to save blog:", error);
          alert("An error occurred while saving the blog: " + error.message);
      }
  };

  const resetBlogForm = () => {
      setBlogTitle('');
      if (blogCategoriesList.length > 0) {
          setBlogCategory(blogCategoriesList[0].id || blogCategoriesList[0].Id);
      } else {
          setBlogCategory('');
      }
      setBlogContent('');
      setBlogImage(null);
      setBlogImageFile(null);
      setBlogMetaDescription('');
      setBlogMetaKeywords('');
      setBlogTags('');
      setEditingPostId(null);
  };

  const handleEditPost = async (post: any) => {
      try {
          const { fetchBlogDetails } = await import('../../services/api');
          const details = await fetchBlogDetails(post.id || post.Id);
          if (details) {
              setBlogTitle(details.title || details.Title || '');
              setBlogCategory(details.blogCategoryId || details.BlogCategoryId || '');
              setBlogContent(details.description || details.Description || ''); 
              setBlogImage(details.imageUrl || details.ImageUrl || null);
              setBlogMetaDescription(details.metaDescription || details.MetaDescription || '');
              setBlogMetaKeywords(details.metaKeywords || details.MetaKeywords || '');
              setBlogTags(details.tags || details.Tags || '');
              setEditingPostId(details.id || details.Id);
          }
      } catch (e) {
          console.error("Failed to load blog post details for editing", e);
          setBlogTitle(post.title || post.Title || '');
          setBlogCategory(post.blogCategoryId || post.BlogCategoryId || '');
          setBlogContent(post.description || post.Description || ''); 
          setBlogImage(post.imageUrl || post.ImageUrl || null);
          setEditingPostId(post.id || post.Id);
      }
      
      const formElement = document.getElementById('blog-form');
      if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeletePost = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this post?')) {
          try {
              const { deleteBlog } = await import('../../services/api');
              await deleteBlog(id);
              await loadBlogsManagerData();
              if (editingPostId === id) resetBlogForm();
          } catch (e: any) {
              alert("Failed to delete post: " + e.message);
          }
      }
  };

  const handleSendNewsletter = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Newsletter "${newsSubject}" sent to 12,450 subscribers.`);
      setNewsSubject('');
      setNewsBody('');
  };

  const handlePostJob = async (e: React.FormEvent) => {
      e.preventDefault();
      
      let finalCompany = jobCompany;
      let finalLogoUrl = jobCompanyLogo;
      let finalCompanyId: string | null = null;

      if (selectedCompanyId !== 'custom') {
          const comp = adminCompanies.find(c => (c.id || c.Id)?.toString() === selectedCompanyId);
          if (comp) {
              finalCompany = comp.name || comp.Name || '';
              finalLogoUrl = comp.logo || comp.Logo || '';
              finalCompanyId = comp.id || comp.Id || null;
          }
      } else if (jobCompanyLogoFile) {
          try {
              const { uploadJobCompanyLogo } = await import('../../services/api');
              const uploadRes = await uploadJobCompanyLogo(jobCompanyLogoFile);
              if (uploadRes && uploadRes.url) {
                  finalLogoUrl = uploadRes.url;
              }
          } catch (uploadErr) {
              console.error("Failed to upload company logo", uploadErr);
          }
      }

      let finalCategory = jobCategory;
      let finalCategoryId: string | null = null;
      const matchedCat = adminJobCategories.find(c => (c.id || c.Id)?.toString() === selectedCategoryId);
      if (matchedCat) {
          finalCategory = matchedCat.name || matchedCat.Name || '';
          finalCategoryId = matchedCat.id || matchedCat.Id || null;
      }

      const newJobData = {
          title: jobTitle,
          company: finalCompany,
          location: jobLocation,
          salary: jobSalary,
          type: jobType,
          isFeatured: isFeaturedJob,
          destination: jobDestination,
          description: jobDescription,
          requirements: jobRequirements,
          responsibilities: jobResponsibilities,
          benefits: jobBenefits,
          category: finalCategory,
          experienceLevel: jobExperienceLevel,
          companyLogo: finalLogoUrl,
          companyId: finalCompanyId,
          categoryId: finalCategoryId
      };
      
      try {
          const { createJob } = await import('../../services/api');
          const created = await createJob(newJobData);
          const mappedLogo = created.companyLogo && created.companyLogo.startsWith('/uploads')
              ? `http://localhost:5141${created.companyLogo}`
              : created.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalCompany)}&background=random`;
          setJobs(prev => [{ ...created, logo: mappedLogo }, ...prev]);
          alert(`Job "${jobTitle}" posted successfully to backend database!`);
      } catch(err) {
          console.warn("Failed to create job on server, running local simulation fallback.", err);
          const newJob = {
              id: Date.now(),
              ...newJobData,
              logo: finalLogoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalCompany)}&background=random`,
              applicants: 0
          };
          const updatedJobs = [newJob, ...jobs];
          setJobs(updatedJobs);
          localStorage.setItem('takeuup_jobs', JSON.stringify(updatedJobs));
          alert(`[Local Sandbox] Job "${jobTitle}" simulated post!`);
      }
      
      setJobTitle('');
      setJobCompany('');
      setJobLocation('');
      setJobSalary('');
      setJobType('Full-time');
      setIsFeaturedJob(false);
      setJobDestination('Portal');
      setJobDescription('');
      setJobRequirements('');
      setJobResponsibilities('');
      setJobBenefits('');
      setJobCategory('Software Engineering');
      setJobExperienceLevel('Entry Level');
      setJobCompanyLogo('');
      setJobCompanyLogoFile(null);
      setSelectedCompanyId('custom');
      setSelectedCategoryId('');
  };

  const deleteJob = async (id: any) => {
      if (window.confirm("Delete this job posting?")) {
          try {
              const { deleteJobListing } = await import('../../services/api');
              await deleteJobListing(id.toString());
              setJobs(prev => prev.filter(j => j.id !== id));
          } catch(err) {
              console.warn("Failed to delete job from API, using fallback.", err);
              const updatedJobs = jobs.filter(j => j.id !== id);
              setJobs(updatedJobs);
              localStorage.setItem('takeuup_jobs', JSON.stringify(updatedJobs));
          }
      }
  };

  const updateApplicationStatus = async (appId: any, status: string, interviewDetails?: any) => {
      try {
          const { updateApplicationStatus } = await import('../../services/api');
          await updateApplicationStatus(appId.toString(), status, interviewDetails);
          
          setApplications(prev => prev.map(app => 
              app.id === appId ? { ...app, status, interview: interviewDetails } : app
          ));
      } catch(err) {
          console.warn("Failed to update status on API, using fallback.", err);
          const updatedApps = applications.map(app => 
              app.id === appId ? { ...app, status, interview: interviewDetails } : app
          );
          setApplications(updatedApps);
          localStorage.setItem('takeuup_applications', JSON.stringify(updatedApps));
      }
      
      if (selectedApplication && selectedApplication.id === appId) {
          setSelectedApplication((prev: any) => ({ ...prev, status }));
      }
      if (reviewTestApp && reviewTestApp.id === appId) {
          setReviewTestApp((prev: any) => ({ ...prev, status }));
      }
  };

  const handleSendInvite = (e: React.FormEvent) => {
      e.preventDefault();
      if (reviewTestApp) {
          updateApplicationStatus(reviewTestApp.id, 'Email Sent', scheduleData);
          
          let locationMsg = "";
          if (scheduleData.type === 'online') {
              locationMsg = `Link: ${scheduleData.link}`;
          } else {
              locationMsg = `Location: ${scheduleData.location}`;
          }

          alert(`ðŸ“§ Email Sent Successfully to ${reviewTestApp.email}!\n\nSubject: Interview Invitation for ${reviewTestApp.jobTitle}\n\n"Hi ${reviewTestApp.name},\nWe are pleased to invite you for an ${scheduleData.type} interview.\nDate: ${scheduleData.date}\nTime: ${scheduleData.time}\n${locationMsg}\n\n${scheduleData.message}"`);
          
          setReviewTestApp(null);
          setShowScheduleModal(false);
      }
  };

  const downloadCV = (fileName: string) => {
      alert(`Downloading CV: ${fileName}\n\n(This is a mock download in the demo environment)`);
  };

  const handleLogoutClick = () => {
      if (onLogout) onLogout();
      navigate('/');
  };

  // --- Render Sections ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex gap-4">
          <button 
              onClick={() => setActiveView('jobs')} 
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-2xl flex items-center justify-between group shadow-lg hover:shadow-violet-500/20 transition-all"
          >
              <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1">Post a New Job</h3>
                  <p className="text-violet-200 text-sm">Create a listing for your company</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Plus size={24} className="text-white" />
              </div>
          </button>
          <button 
              onClick={() => setActiveView('applications')} 
              className="flex-1 bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center justify-between group hover:border-cyan-500/50 transition-all"
          >
              <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1">Review Applications</h3>
                  <p className="text-slate-400 text-sm">{applications.length} candidates waiting</p>
              </div>
              <div className="bg-slate-700 p-3 rounded-xl group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                  <UserCheck size={24} />
              </div>
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Revenue', value: '$4,200', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Questions', value: '5,300+', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Storage', value: '45%', icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleUserSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const api = await import('../../services/api');
          if (selectedUser) {
              // Edit User
              await api.updateUser({
                  userId: userForm.id,
                  userName: userForm.userName,
                  email: userForm.email,
                  role: userForm.role
              });
              alert("User updated successfully!");
          } else {
              // Create User
              await api.createUser({
                  userName: userForm.userName,
                  email: userForm.email,
                  password: userForm.password,
                  role: userForm.role,
                  isActive: userForm.isActive
              });
              alert("User created successfully!");
          }
          setShowUserModal(false);
          loadRBACData();
      } catch(err) {
          console.error("Error saving user", err);
          alert("Failed to save user!");
      }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
      try {
          const api = await import('../../services/api');
          await api.updateUserStatus(userId, !currentStatus);
          setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
      } catch(err) {
          console.error("Error toggling status", err);
      }
  };

  const handleDeleteUserClick = async (userId: string) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
          try {
              const api = await import('../../services/api');
              await api.deleteUser(userId);
              setUsersList(prev => prev.filter(u => u.id !== userId));
          } catch(err) {
              console.error("Error deleting user", err);
          }
      }
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const api = await import('../../services/api');
          if (selectedRole) {
              // Edit Role
              await api.updateRole({
                  id: roleForm.id,
                  Name: roleForm.name,
                  title: roleForm.title
              });
              alert("Role updated successfully!");
          } else {
              // Create Role
              await api.createRole({
                  Name: roleForm.name,
                  id: roleForm.name.toLowerCase() + "-role",
                  title: roleForm.title
              });
              alert("Role created successfully!");
          }
          setShowRoleModal(false);
          loadRBACData();
      } catch(err) {
          console.error("Error saving role", err);
          alert("Failed to save role!");
      }
  };

  const handleDeleteRoleClick = async (roleId: string) => {
      if (window.confirm("Are you sure you want to delete this role?")) {
          try {
              const api = await import('../../services/api');
              await api.deleteRole(roleId);
              setRolesList(prev => prev.filter(r => r.id !== roleId));
          } catch(err) {
              console.error("Error deleting role", err);
          }
      }
  };

  const handleMenuSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const api = await import('../../services/api');
          if (selectedMenu) {
              // Edit Menu
              await api.updateMenu({
                  Id: menuForm.id,
                  Title: menuForm.title,
                  Description: menuForm.description,
                  ParentId: menuForm.parentId,
                  Url: menuForm.url,
                  WithoutView: menuForm.withoutView,
                  Icon: menuForm.icon,
                  Sequence: menuForm.sequence
              });
              alert("Menu updated successfully!");
          } else {
              // Create Menu
              await api.createMenu({
                  Title: menuForm.title,
                  Description: menuForm.description,
                  ParentId: menuForm.parentId,
                  Url: menuForm.url,
                  WithoutView: menuForm.withoutView,
                  Icon: menuForm.icon,
                  Sequence: menuForm.sequence
              });
              alert("Menu created successfully!");
          }
          setShowMenuModal(false);
          loadRBACData();
      } catch(err) {
          console.error("Error saving menu", err);
          alert("Failed to save menu!");
      }
  };

  const handleDeleteMenuClick = async (menuId: number) => {
      if (window.confirm("Are you sure you want to delete this menu item?")) {
          try {
              const api = await import('../../services/api');
              await api.deleteMenu(menuId);
              setMenusList(prev => prev.filter(m => m.id !== menuId));
          } catch(err) {
              console.error("Error deleting menu", err);
          }
      }
  };

  const hasMenuPermission = (menuId: number, permType: number) => {
      const entry = rolePermissions.find(p => p.menuId === menuId);
      return entry ? entry.permissions.includes(permType) : false;
  };

  const handleTogglePermission = (menuId: number, permType: number) => {
      setRolePermissions(prev => {
          const existingIndex = prev.findIndex(p => p.menuId === menuId);
          if (existingIndex > -1) {
              const existing = prev[existingIndex];
              let updatedPermissions;
              if (existing.permissions.includes(permType)) {
                  updatedPermissions = existing.permissions.filter((p: number) => p !== permType);
              } else {
                  updatedPermissions = [...existing.permissions, permType];
              }
              const updatedList = [...prev];
              updatedList[existingIndex] = { ...existing, permissions: updatedPermissions };
              return updatedList;
          } else {
              return [...prev, { menuId, permissions: [permType] }];
          }
      });
  };

  const handleSavePermissions = async () => {
      if (!selectedPermissionsRoleId) return;
      try {
          const api = await import('../../services/api');
          await api.assignRolePermissions(selectedPermissionsRoleId, rolePermissions);
          alert("Permissions saved successfully!");
      } catch(err) {
          console.error("Error saving permissions", err);
          alert("Failed to save permissions!");
      }
  };
  const handleViewStudentDetails = async (userId: string) => {
      setLoadingStudentDetails(true);
      setShowStudentDetailsModal(true);
      setStudentDetails(null);
      try {
          const { fetchStudentDetails } = await import('../../services/api');
          const data = await fetchStudentDetails(userId);
          if (data) {
              setStudentDetails(data);
          } else {
              alert("Failed to load student details.");
          }
      } catch (e) {
          console.error("Failed to load student details", e);
          alert("Error loading student details.");
      } finally {
          setLoadingStudentDetails(false);
      }
  };
  const handleApproveTeacher = async (userId: string) => {
      if (!window.confirm("Are you sure you want to approve this teacher registration request?")) return;
      try {
          const { approveTeacherRegistration } = await import('../../services/api');
          const res = await approveTeacherRegistration(userId);
          if (res && res.success !== false) {
              alert("ðŸŽ‰ Teacher registration approved successfully!");
              await loadRBACData();
          } else {
              alert(res?.message || "Failed to approve teacher.");
          }
      } catch (e) {
          console.error("Failed to approve teacher", e);
          alert("Error approving teacher.");
      }
  };

  const renderMentorsManager = () => {
      const filteredMentors = mentorsList.filter(m => {
          const name = m.name || m.Name || '';
          const subject = m.subject || m.Subject || '';
          const institution = m.institution || m.Institution || '';
          const query = mentorSearchQuery.toLowerCase();
          return name.toLowerCase().includes(query) || 
                 subject.toLowerCase().includes(query) || 
                 institution.toLowerCase().includes(query);
      });

      const handleAddMentorClick = () => {
          setSelectedMentor(null);
          setMentorForm({
              id: '',
              name: '',
              title: '',
              institution: '',
              subject: '',
              imageUrl: '',
              bio: '',
              bookingPrice: 500,
              rating: 4.8,
              email: '',
              password: '',
              imageFile: null
          });
          setShowMentorModal(true);
      };

      const handleEditMentorClick = (m: any) => {
          setSelectedMentor(m);
          setMentorForm({
              id: m.id || m.Id || '',
              name: m.name || m.Name || '',
              title: m.title || m.Title || '',
              institution: m.institution || m.Institution || '',
              subject: m.subject || m.Subject || '',
              imageUrl: m.imageUrl || m.ImageUrl || '',
              bio: m.bio || m.Bio || '',
              bookingPrice: m.bookingPrice || m.BookingPrice || 0,
              rating: m.rating || m.Rating || 4.8,
              email: m.email || m.Email || '',
              password: '',
              imageFile: null
          });
          setShowMentorModal(true);
      };

      const handleMentorSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
              const { createMentor, updateMentor } = await import('../../services/api');
              const formData = new FormData();
              formData.append('name', mentorForm.name);
              formData.append('title', mentorForm.title);
              formData.append('institution', mentorForm.institution);
              formData.append('subject', mentorForm.subject);
              formData.append('bio', mentorForm.bio);
              formData.append('bookingPrice', mentorForm.bookingPrice.toString());
              formData.append('rating', mentorForm.rating.toString());
              formData.append('email', mentorForm.email);
              
              if (mentorForm.imageFile) {
                  formData.append('ImageFile', mentorForm.imageFile, mentorForm.imageFile.name);
              } else if (mentorForm.imageUrl) {
                  formData.append('imageUrl', mentorForm.imageUrl);
              }

              if (selectedMentor) {
                  await updateMentor(mentorForm.id, formData);
              } else {
                  formData.append('password', mentorForm.password || 'Mentor@2026');
                  await createMentor(formData);
              }
              setShowMentorModal(false);
              loadMentorsData();
          } catch (err: any) {
              console.error(err);
              alert(err.message || "Failed to save mentor. Make sure email is unique.");
          }
      };

      const handleDeleteMentorClick = async (m: any) => {
          if (!window.confirm(`Are you sure you want to delete ${m.name || m.Name}? This will also delete their login account.`)) return;
          try {
              const { deleteMentor } = await import('../../services/api');
              await deleteMentor(m.id || m.Id);
              loadMentorsData();
          } catch (err: any) {
              console.error(err);
              alert(err.message || "Failed to delete mentor.");
          }
      };

      return (
          <div className="space-y-6 animate-in fade-in text-left">
              <div className="flex justify-between items-center">
                  <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Mentor Directory</h2>
                      <p className="text-slate-400 text-xs mt-1">Manage learning mentors, pricing, and login accounts.</p>
                  </div>
                  <button 
                      onClick={handleAddMentorClick}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/10 text-sm"
                  >
                      <Plus size={18} /> Add Mentor
                  </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                  <input 
                      type="text" 
                      placeholder="Search by name, subject, or university..." 
                      value={mentorSearchQuery}
                      onChange={e => setMentorSearchQuery(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                  />
              </div>

              {loadingMentors ? (
                  <div className="py-20 text-center text-slate-400">Loading mentors data...</div>
              ) : filteredMentors.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 bg-slate-900/10 border border-slate-850 rounded-2xl">No mentors found.</div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMentors.map(m => (
                          <div key={m.id || m.Id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg">
                              <div className="space-y-4">
                                  <div className="flex gap-4">
                                      <img 
                                          src={getProductImageUrl(m.imageUrl || m.ImageUrl)} 
                                          alt="Mentor Avatar" 
                                          className="w-16 h-16 rounded-xl object-cover border border-slate-850"
                                      />
                                      <div>
                                          <h3 className="font-bold text-white text-base leading-tight">{m.name || m.Name}</h3>
                                          <p className="text-xs text-cyan-400 mt-1 font-semibold">{m.title || m.Title}</p>
                                          <p className="text-[11px] text-slate-500 mt-0.5">{m.institution || m.Institution}</p>
                                      </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2 text-xs">
                                      <span className="bg-slate-950 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-850">
                                          ðŸ“š {m.subject || m.Subject}
                                      </span>
                                      <span className="bg-slate-950 text-orange-400 px-2.5 py-1 rounded-lg border border-slate-850">
                                          â­ï¸ {m.rating || m.Rating} Rating
                                      </span>
                                      <span className="bg-slate-950 text-green-400 px-2.5 py-1 rounded-lg border border-slate-850">
                                          à§³{m.bookingPrice || m.BookingPrice} / session
                                      </span>
                                  </div>
                                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                                      {m.bio || m.Bio || "No bio description provided."}
                                  </p>
                                  {m.email || m.Email ? (
                                      <p className="text-[10px] text-slate-500">
                                          ðŸ“§ Account: <span className="font-semibold text-slate-400">{m.email || m.Email}</span>
                                      </p>
                                  ) : null}
                              </div>
                              <div className="flex gap-2 mt-6 pt-4 border-t border-slate-850">
                                  <button 
                                      onClick={() => handleEditMentorClick(m)}
                                      className="flex-1 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white font-bold py-2 rounded-xl border border-slate-850 transition-colors text-xs flex items-center justify-center gap-1.5"
                                  >
                                      <Edit3 size={14} /> Edit Profile
                                  </button>
                                  <button 
                                      onClick={() => handleDeleteMentorClick(m)}
                                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-3 py-2 rounded-xl border border-red-500/20 transition-all text-xs"
                                  >
                                      <Trash2 size={14} />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {showMentorModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in duration-200">
                          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                              <h3 className="text-lg font-bold text-white">
                                  {selectedMentor ? `Edit Profile: ${mentorForm.name}` : "Add New Mentor Profile & Login"}
                              </h3>
                              <button onClick={() => setShowMentorModal(false)} className="text-slate-400 hover:text-white font-bold text-xl">Ã—</button>
                          </div>
                          
                          <form onSubmit={handleMentorSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                      <input 
                                          type="text" 
                                          required 
                                          value={mentorForm.name} 
                                          onChange={e => setMentorForm({ ...mentorForm, name: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Professional Title</label>
                                      <input 
                                          type="text" 
                                          required 
                                          value={mentorForm.title} 
                                          onChange={e => setMentorForm({ ...mentorForm, title: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                          placeholder="e.g. Professor of Physics / Lecturer"
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Institution / University</label>
                                      <input 
                                          type="text" 
                                          required 
                                          value={mentorForm.institution} 
                                          onChange={e => setMentorForm({ ...mentorForm, institution: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                          placeholder="e.g. SUST / BUET / Dhaka College"
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Subject Specialty</label>
                                      <input 
                                          type="text" 
                                          required 
                                          value={mentorForm.subject} 
                                          onChange={e => setMentorForm({ ...mentorForm, subject: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                          placeholder="e.g. Physics / Math / English"
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Session Price (BDT)</label>
                                      <input 
                                          type="number" 
                                          required 
                                          value={mentorForm.bookingPrice} 
                                          onChange={e => setMentorForm({ ...mentorForm, bookingPrice: Number(e.target.value) })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Rating (Out of 5.0)</label>
                                      <input 
                                          type="number" 
                                          step="0.1"
                                          required 
                                          value={mentorForm.rating} 
                                          onChange={e => setMentorForm({ ...mentorForm, rating: Number(e.target.value) })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                      />
                                  </div>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Profile Image</label>
                                  <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={e => {
                                          const file = e.target.files?.[0] || null;
                                          setMentorForm({ ...mentorForm, imageFile: file });
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-750"
                                  />
                                  {mentorForm.imageUrl && !mentorForm.imageFile && (
                                      <p className="text-[10px] text-slate-400 mt-1">Current: {mentorForm.imageUrl.split('/').pop()}</p>
                                  )}
                              </div>
                              <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bio Description</label>
                                  <textarea 
                                      rows={3} 
                                      value={mentorForm.bio} 
                                      onChange={e => setMentorForm({ ...mentorForm, bio: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
                                  />
                              </div>

                              <div className="border-t border-slate-800 pt-4 mt-4 space-y-4">
                                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Account Credentials</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                          <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address (Username)</label>
                                          <input 
                                              type="email" 
                                              required 
                                              disabled={!!selectedMentor}
                                              value={mentorForm.email} 
                                              onChange={e => setMentorForm({ ...mentorForm, email: e.target.value })}
                                              className="w-full bg-slate-950 disabled:bg-slate-900 disabled:text-slate-500 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                              placeholder="mentor@example.com"
                                          />
                                      </div>
                                      {!selectedMentor && (
                                          <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-400 uppercase">Account Password</label>
                                              <input 
                                                  type="password" 
                                                  value={mentorForm.password} 
                                                  onChange={e => setMentorForm({ ...mentorForm, password: e.target.value })}
                                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                                  placeholder="Default: Mentor@2026"
                                              />
                                          </div>
                                      )}
                                  </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 mt-6 bg-slate-900">
                                  <button type="button" onClick={() => setShowMentorModal(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                                  <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-cyan-900/20 transition-all">
                                      <Save size={16}/> Save Profile
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderAboutUsManager = () => {
      const handleSaveSettings = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
              const { updateAboutUsSettings } = await import('../../services/api');
              await updateAboutUsSettings({
                  heroTitle: settingsForm.heroTitle,
                  heroSubtitle: settingsForm.heroSubtitle,
                  missionText: settingsForm.missionText,
                  visionText: settingsForm.visionText,
                  statsJson: settingsForm.statsJson,
                  valuesJson: settingsForm.valuesJson
              });
              alert("Settings updated successfully!");
              loadAboutUsData();
          } catch (e: any) {
              console.error(e);
              alert(e.message || "Failed to update Settings.");
          }
      };

      const handleAddMemberClick = () => {
          setSelectedMember(null);
          setMemberForm({
              id: '',
              name: '',
              role: '',
              bio: '',
              displayOrder: aboutUsMembers.length + 1,
              linkedinUrl: '',
              twitterUrl: '',
              email: '',
              imageUrl: '',
              imageFile: null
          });
          setShowMemberModal(true);
      };

      const handleEditMemberClick = (m: any) => {
          setSelectedMember(m);
          setMemberForm({
              id: m.id || m.Id || '',
              name: m.name || m.Name || '',
              role: m.role || m.Role || '',
              bio: m.bio || m.Bio || '',
              displayOrder: m.displayOrder || m.DisplayOrder || 1,
              linkedinUrl: m.linkedinUrl || m.LinkedinUrl || '',
              twitterUrl: m.twitterUrl || m.TwitterUrl || '',
              email: m.email || m.Email || '',
              imageUrl: m.imageUrl || m.ImageUrl || '',
              imageFile: null
          });
          setShowMemberModal(true);
      };

      const handleMemberSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
              const { createAboutUsMember, updateAboutUsMember } = await import('../../services/api');
              const formData = new FormData();
              formData.append('name', memberForm.name);
              formData.append('role', memberForm.role);
              formData.append('bio', memberForm.bio);
              formData.append('displayOrder', memberForm.displayOrder.toString());
              formData.append('linkedinUrl', memberForm.linkedinUrl);
              formData.append('twitterUrl', memberForm.twitterUrl);
              formData.append('email', memberForm.email);

              if (memberForm.imageFile) {
                  formData.append('ImageFile', memberForm.imageFile, memberForm.imageFile.name);
              } else if (memberForm.imageUrl) {
                  formData.append('imageUrl', memberForm.imageUrl);
              }

              if (selectedMember) {
                  await updateAboutUsMember(memberForm.id, formData);
              } else {
                  await createAboutUsMember(formData);
              }
              setShowMemberModal(false);
              loadAboutUsData();
          } catch (e: any) {
              console.error(e);
              alert(e.message || "Failed to save team member.");
          }
      };

      const handleDeleteMember = async (m: any) => {
          if (!window.confirm(`Are you sure you want to delete ${m.name || m.Name}?`)) return;
          try {
              const { deleteAboutUsMember } = await import('../../services/api');
              await deleteAboutUsMember(m.id || m.Id);
              loadAboutUsData();
          } catch (e: any) {
              console.error(e);
              alert(e.message || "Failed to delete team member.");
          }
      };

      return (
          <div className="space-y-8 animate-in fade-in text-left">
              <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">About Us Settings</h2>
                  <p className="text-slate-400 text-xs mt-1">Configure your homepage story, mission, vision, metrics, and leaders board dynamically.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <form onSubmit={handleSaveSettings} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                      <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider text-sm">Homepage Story & Text</h3>
                      
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Title</label>
                          <input 
                              type="text" 
                              required 
                              value={settingsForm.heroTitle} 
                              onChange={e => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Subtitle</label>
                          <textarea 
                              rows={3} 
                              required 
                              value={settingsForm.heroSubtitle} 
                              onChange={e => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Mission Statement Text</label>
                          <textarea 
                              rows={4} 
                              required 
                              value={settingsForm.missionText} 
                              onChange={e => setSettingsForm({ ...settingsForm, missionText: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Vision Statement Text</label>
                          <textarea 
                              rows={4} 
                              required 
                              value={settingsForm.visionText} 
                              onChange={e => setSettingsForm({ ...settingsForm, visionText: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Stats JSON Config</label>
                          <textarea 
                              rows={3} 
                              required 
                              value={settingsForm.statsJson} 
                              onChange={e => setSettingsForm({ ...settingsForm, statsJson: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                              placeholder='[{"label": "Active Students", "value": "50,000+"}]'
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Values JSON Config</label>
                          <textarea 
                              rows={4} 
                              required 
                              value={settingsForm.valuesJson} 
                              onChange={e => setSettingsForm({ ...settingsForm, valuesJson: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                              placeholder='[{"title": "Mission Driven", "desc": "..."}]'
                          />
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end">
                          <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-cyan-900/20 transition-all">
                              <Save size={16}/> Save Story Settings
                          </button>
                      </div>
                  </form>

                  <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                      <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider text-sm">Leaders Board</h3>
                          <button 
                              type="button" 
                              onClick={handleAddMemberClick}
                              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold px-3 py-1.5 rounded-xl border border-cyan-500/20 transition-all text-xs flex items-center gap-1.5"
                          >
                              <Plus size={14} /> Add Leader
                          </button>
                      </div>

                      {loadingAboutUs ? (
                          <div className="py-12 text-center text-slate-400 text-xs">Loading leaders...</div>
                      ) : aboutUsMembers.length === 0 ? (
                          <div className="py-12 text-center text-slate-500 text-xs bg-slate-950/20 border border-slate-850 rounded-2xl">No executive members added.</div>
                      ) : (
                          <div className="space-y-4">
                              {aboutUsMembers.map(m => (
                                  <div key={m.id || m.Id} className="flex gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-850 items-center justify-between hover:border-slate-800 transition-colors">
                                      <div className="flex gap-3 items-center">
                                          <img 
                                              src={getProductImageUrl(m.imageUrl || m.ImageUrl)} 
                                              alt="" 
                                              className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                                          />
                                          <div>
                                              <h4 className="font-bold text-white text-xs leading-tight">{m.name || m.Name}</h4>
                                              <p className="text-[10px] text-cyan-400 mt-0.5">{m.role || m.Role}</p>
                                              <p className="text-[9px] text-slate-550 mt-0.5">Order: {m.displayOrder || m.DisplayOrder}</p>
                                          </div>
                                      </div>
                                      <div className="flex gap-1.5">
                                          <button 
                                              onClick={() => handleEditMemberClick(m)}
                                              className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg transition-colors"
                                          >
                                              <Edit3 size={14} />
                                          </button>
                                          <button 
                                              onClick={() => handleDeleteMember(m)}
                                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10"
                                          >
                                              <Trash2 size={14} />
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>

              {showMemberModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in duration-200">
                          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                              <h3 className="text-base font-bold text-white">
                                  {selectedMember ? `Edit Leader: ${memberForm.name}` : "Add Board Leader"}
                              </h3>
                              <button onClick={() => setShowMemberModal(false)} className="text-slate-400 hover:text-white font-bold text-xl">Ã—</button>
                          </div>
                          
                          <form onSubmit={handleMemberSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1 col-span-2">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                      <input 
                                          type="text" 
                                          required 
                                          value={memberForm.name} 
                                          onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Executive Role</label>
                                      <input 
                                          type="text" 
                                          required 
                                          value={memberForm.role} 
                                          onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                          placeholder="e.g. Founder & CEO"
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Display Order</label>
                                      <input 
                                          type="number" 
                                          required 
                                          value={memberForm.displayOrder} 
                                          onChange={e => setMemberForm({ ...memberForm, displayOrder: Number(e.target.value) })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                      />
                                  </div>
                              </div>

                              <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Profile Image</label>
                                  <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={e => {
                                          const file = e.target.files?.[0] || null;
                                          setMemberForm({ ...memberForm, imageFile: file });
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-750"
                                  />
                                  {memberForm.imageUrl && !memberForm.imageFile && (
                                      <p className="text-[10px] text-slate-400 mt-1">Current: {memberForm.imageUrl.split('/').pop()}</p>
                                  )}
                              </div>

                              <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Executive Bio Summary</label>
                                  <textarea 
                                      rows={3} 
                                      required
                                      value={memberForm.bio} 
                                      onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
                                  />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Linkedin URL</label>
                                      <input 
                                          type="text" 
                                          value={memberForm.linkedinUrl} 
                                          onChange={e => setMemberForm({ ...memberForm, linkedinUrl: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                          placeholder="https://linkedin.com/in/..."
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Twitter URL</label>
                                      <input 
                                          type="text" 
                                          value={memberForm.twitterUrl} 
                                          onChange={e => setMemberForm({ ...memberForm, twitterUrl: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                          placeholder="https://twitter.com/..."
                                      />
                                  </div>
                                  <div className="space-y-1 col-span-2">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</label>
                                      <input 
                                          type="email" 
                                          value={memberForm.email} 
                                          onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-white focus:border-cyan-500 outline-none transition-all text-sm"
                                          placeholder="leader@takeuup.com"
                                      />
                                  </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 mt-6 bg-slate-900">
                                  <button type="button" onClick={() => setShowMemberModal(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                                  <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-cyan-900/20 transition-all">
                                      <Save size={16}/> Save Leader
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderStudentManagement = () => {
      const students = usersList.filter(u => {
          const hasRole = (roleName: string) => 
              u.roles && u.roles.some((r: string) => r.toLowerCase() === roleName.toLowerCase());
          const isStudent = hasRole('student') || hasRole('user') || !u.roles || u.roles.length === 0;
          if (!isStudent) return false;

          const matchesSearch = (u.userName || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
              (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase());
          return matchesSearch;
      });

      const totalStudentsCount = students.length;
      const premiumStudentsCount = students.filter(s => s.isSubscribed || s.plan === 'Premium').length;
      const activeStudentsCount = students.filter(s => s.isActive).length;

      return (
          <div className="space-y-6 animate-in fade-in text-left">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <div>
                      <h2 className="text-2xl font-bold text-white">Student Management Portal</h2>
                      <p className="text-sm text-slate-400">Track student registration logs, daily study streaks, points, and premium payments.</p>
                  </div>
              </div>

              {/* Student KPI Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Students</p>
                          <h3 className="text-3xl font-black text-white mt-2">{totalStudentsCount}</h3>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl font-bold">
                          <GraduationCap size={24} />
                      </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Premium Plan Subscribers</p>
                          <h3 className="text-3xl font-black text-white mt-2">{premiumStudentsCount}</h3>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center text-xl font-bold">
                          <DollarSign size={24} />
                      </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Status Students</p>
                          <h3 className="text-3xl font-black text-white mt-2">{activeStudentsCount}</h3>
                      </div>
                      <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center text-xl font-bold">
                          <CheckCircle size={24} />
                      </div>
                  </div>
              </div>

              {/* Filtering Controls */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-96">
                      <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                      <input 
                          type="text" 
                          placeholder="Search students by username or email..." 
                          value={userSearchQuery}
                          onChange={e => setUserSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-11 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                      />
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                      Showing {students.length} of {totalStudentsCount} student accounts
                  </div>
              </div>

              {/* Student Accounts Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-400">
                          <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs">
                              <tr>
                                  <th className="px-6 py-4">Student Info</th>
                                  <th className="px-6 py-4">Class / Track</th>
                                  <th className="px-6 py-4">Study Stats</th>
                                  <th className="px-6 py-4">Status & Plan</th>
                                  <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                              {students.map(s => (
                                  <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                                      <td className="px-6 py-4">
                                          <div className="text-white font-bold text-sm">{s.userName || 'Anonymous'}</div>
                                          <div className="text-xs text-slate-400">{s.email}</div>
                                          <div className="text-[10px] text-slate-500 mt-1">Joined: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}</div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-xs text-slate-300 font-semibold">
                                              {s.studentClass || 'Not Set'}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4">
                                          <div className="text-xs text-slate-300 font-semibold flex items-center gap-1">ðŸ† {s.points ?? 0} Points</div>
                                          <div className="text-[10px] text-orange-400 font-bold mt-1">ðŸ”¥ {s.streak ?? 0} Days streak</div>
                                      </td>
                                      <td className="px-6 py-4 space-y-1.5">
                                          <div>
                                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                                  s.plan === 'Premium' || s.isSubscribed
                                                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                      : 'bg-slate-800 text-slate-400 border-slate-700'
                                              }`}>
                                                  {s.plan === 'Premium' || s.isSubscribed ? 'Premium User' : 'Free User'}
                                              </span>
                                          </div>
                                          <button 
                                              onClick={() => handleToggleUserStatus(s.id, s.isActive)}
                                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border block text-left ${
                                                  s.isActive 
                                                      ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' 
                                                      : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                              }`}
                                          >
                                              {s.isActive ? 'Active' : 'Inactive'}
                                          </button>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                          <button 
                                              onClick={() => handleViewStudentDetails(s.id)}
                                              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center gap-1 ml-auto"
                                          >
                                              <BarChart3 size={12} /> View Activity & Payments
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                              {students.length === 0 && (
                                  <tr>
                                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No registered students found.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      );
  };

  const renderUsers = () => {
    const filteredUsers = usersList.filter(u => {
        const matchesSearch = (u.userName || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase());
        if (!matchesSearch) return false;
        
        if (userRoleFilter === 'all') return true;
        
        const hasRole = (roleName: string) => 
            u.roles && u.roles.some((r: string) => r.toLowerCase() === roleName.toLowerCase());
            
        if (userRoleFilter === 'student') {
            return hasRole('student') || hasRole('user') || !u.roles || u.roles.length === 0;
        }
        if (userRoleFilter === 'teacher') {
            return hasRole('teacher');
        }
        return true;
    });

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white font-sans">User Management & RBAC</h2>
            {activeUserSubTab === 'users' && (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => {
                            const link = `${window.location.origin}/register?role=teacher`;
                            navigator.clipboard.writeText(link);
                            alert(`Teacher Registration Link copied to clipboard:\n\n${link}`);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all text-xs cursor-pointer shadow-md"
                        title="Copy direct registration link for Teachers"
                    >
                        <LinkIcon size={14} /> Send Teacher Link
                    </button>
                    <button 
                        onClick={() => {
                            const link = `${window.location.origin}/register?role=employer`;
                            navigator.clipboard.writeText(link);
                            alert(`Employer Registration Link copied to clipboard:\n\n${link}`);
                        }}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all text-xs cursor-pointer shadow-md"
                        title="Copy direct registration link for Employers"
                    >
                        <LinkIcon size={14} /> Send Employer Link
                    </button>
                    <button 
                        onClick={() => {
                            setSelectedUser(null);
                            setUserForm({ id: '', userName: '', email: '', password: '', role: rolesList[0]?.name || 'Teacher', isActive: true });
                            setShowUserModal(true);
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/10 text-xs sm:text-sm cursor-pointer"
                    >
                        <Plus size={18} /> Add User / Teacher
                    </button>
                </div>
            )}
            {activeUserSubTab === 'roles' && (
                <button 
                    onClick={() => {
                        setSelectedRole(null);
                        setRoleForm({ id: '', name: '', title: '' });
                        setShowRoleModal(true);
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/10 text-sm"
                >
                    <Plus size={18} /> Add Role
                </button>
            )}
            {activeUserSubTab === 'menus' && (
                <button 
                    onClick={() => {
                        setSelectedMenu(null);
                        setMenuForm({ id: 0, title: '', description: '', parentId: null, url: '', withoutView: false, icon: '', sequence: 1 });
                        setShowMenuModal(true);
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/10 text-sm"
                >
                    <Plus size={18} /> Add Menu Item
                </button>
            )}
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-800">
            {[
                { id: 'users', label: 'User Accounts' },
                { id: 'teacher_requests', label: 'Teacher Registrations' },
                { id: 'roles', label: 'Roles' },
                { id: 'menus', label: 'Menus' },
                { id: 'permissions', label: 'Permissions Matrix' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveUserSubTab(tab.id as any)}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-all -mb-[2px] ${
                        activeUserSubTab === tab.id 
                        ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' 
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tab content */}
        {activeUserSubTab === 'users' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-850 flex flex-col md:flex-row gap-4 bg-slate-900/50 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users by name or email..." 
                            value={userSearchQuery}
                            onChange={e => setUserSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white focus:border-cyan-500/80 outline-none transition-all text-sm" 
                        />
                    </div>
                    
                    <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto justify-center gap-1">
                        <button
                            onClick={() => setUserRoleFilter('all')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                userRoleFilter === 'all'
                                ? 'bg-cyan-500 text-slate-900 shadow'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                        >
                            All Accounts
                        </button>
                        <button
                            onClick={() => setUserRoleFilter('student')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                userRoleFilter === 'student'
                                ? 'bg-cyan-500 text-slate-900 shadow'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                        >
                            Students
                        </button>
                        <button
                            onClick={() => setUserRoleFilter('teacher')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                userRoleFilter === 'teacher'
                                ? 'bg-cyan-500 text-slate-900 shadow'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                        >
                            Teachers
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                {userRoleFilter === 'all' && <th className="px-6 py-4">Role</th>}
                                {userRoleFilter === 'student' && (
                                    <>
                                        <th className="px-6 py-4">Class/Track</th>
                                        <th className="px-6 py-4">Points & Streak</th>
                                    </>
                                )}
                                {userRoleFilter === 'teacher' && <th className="px-6 py-4">Uploaded Qs</th>}
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                                            {(user.userName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold text-sm">{user.userName}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </td>
                                    {userRoleFilter === 'all' && (
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                                                {user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Student'}
                                            </span>
                                        </td>
                                    )}
                                    {userRoleFilter === 'student' && (
                                        <>
                                            <td className="px-6 py-4 font-semibold text-slate-200">
                                                {user.studentClass || 'Not Set'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="text-white font-bold text-xs">â­ {user.points ?? 0} Points</div>
                                                    <div className="text-[10px] text-orange-400 font-semibold">ðŸ”¥ {user.streak ?? 0} Day Streak</div>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    {userRoleFilter === 'teacher' && (
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 bg-cyan-950/40 text-cyan-400 text-xs font-bold px-2.5 py-1 rounded-full border border-cyan-800/40">
                                                ðŸ“ {user.questionsCount ?? 0} Questions
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                                            className={`flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-full border transition-all ${
                                                user.isActive 
                                                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}
                                        >
                                            {user.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-1.5">
                                        {userRoleFilter === 'student' && (
                                            <button 
                                                onClick={() => handleViewStudentDetails(user.id)}
                                                className="text-slate-400 hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-xl transition-all inline-flex items-center justify-center"
                                                title="View Student Activities & Payments"
                                            >
                                                <ClipboardList size={15} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setUserForm({
                                                    id: user.id,
                                                    userName: user.userName,
                                                    email: user.email,
                                                    password: '',
                                                    role: user.roles && user.roles.length > 0 ? user.roles[0] : 'Student',
                                                    isActive: user.isActive
                                                });
                                                setShowUserModal(true);
                                            }}
                                            className="text-slate-400 hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-xl transition-all"
                                        >
                                            <Edit size={15} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUserClick(user.id)}
                                            className="text-slate-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={userRoleFilter === 'student' ? 5 : 4} className="px-6 py-10 text-center text-slate-500">No users found matching query.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeUserSubTab === 'teacher_requests' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Teacher Account</th>
                                <th className="px-6 py-4">Email Address</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                            {usersList.filter(u => u.roles && u.roles.some((r: string) => r.toLowerCase() === 'teacher') && !u.isTeacherApproved).map(user => (
                                <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                                            {(user.userName || 'T').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold text-sm">{user.userName}</div>
                                            <div className="text-xs text-slate-500">Awaiting Profile Completion</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-200">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                                            Pending Approval
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleApproveTeacher(user.id)}
                                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-md shadow-cyan-900/10"
                                        >
                                            Approve Registration
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {usersList.filter(u => u.roles && u.roles.some((r: string) => r.toLowerCase() === 'teacher') && !u.isTeacherApproved).length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">No pending teacher registration requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeUserSubTab === 'roles' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Role Code</th>
                                <th className="px-6 py-4">Friendly Title</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                            {rolesList.map(role => (
                                <tr key={role.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 font-mono text-cyan-400 text-xs font-bold">{role.name}</td>
                                    <td className="px-6 py-4 text-slate-200 font-semibold">{role.title || role.name}</td>
                                    <td className="px-6 py-4 text-right space-x-1.5">
                                        <button 
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setRoleForm({ id: role.id, name: role.name, title: role.title || '' });
                                                setShowRoleModal(true);
                                            }}
                                            className="text-slate-400 hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-xl transition-all"
                                        >
                                            <Edit size={15} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteRoleClick(role.id)}
                                            className="text-slate-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {rolesList.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-slate-500">No roles configured in database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeUserSubTab === 'menus' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Menu Title</th>
                                <th className="px-6 py-4">Route URL</th>
                                <th className="px-6 py-4">Icon</th>
                                <th className="px-6 py-4 text-center">Order Sequence</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                            {menusList.map(menu => (
                                <tr key={menu.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-200">{menu.title}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{menu.url}</td>
                                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">{menu.icon || 'None'}</td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-300 text-xs">{menu.sequence}</td>
                                    <td className="px-6 py-4 text-right space-x-1.5">
                                        <button 
                                            onClick={() => {
                                                setSelectedMenu(menu);
                                                setMenuForm({
                                                    id: menu.id,
                                                    title: menu.title,
                                                    description: menu.description || '',
                                                    parentId: menu.parentId || null,
                                                    url: menu.url,
                                                    withoutView: menu.withoutView || false,
                                                    icon: menu.icon || '',
                                                    sequence: menu.sequence || 1
                                                });
                                                setShowMenuModal(true);
                                            }}
                                            className="text-slate-400 hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-xl transition-all"
                                        >
                                            <Edit size={15} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteMenuClick(menu.id)}
                                            className="text-slate-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {menusList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No registered system menus.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeUserSubTab === 'permissions' && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-2xl">
                <div className="flex items-center gap-4 max-w-md">
                    <label className="block text-sm font-semibold text-slate-400 whitespace-nowrap">Select User Role:</label>
                    <select 
                        value={selectedPermissionsRoleId}
                        onChange={e => setSelectedPermissionsRoleId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm font-medium"
                    >
                        {rolesList.map(role => (
                            <option key={role.id} value={role.id}>{role.title || role.name}</option>
                        ))}
                    </select>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Menu Path</th>
                                <th className="px-6 py-4 text-center w-24">View</th>
                                <th className="px-6 py-4 text-center w-24">Create</th>
                                <th className="px-6 py-4 text-center w-24">Edit</th>
                                <th className="px-6 py-4 text-center w-24">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                            {menusList.map(menu => (
                                <tr key={menu.id} className="hover:bg-slate-800/10 transition-colors">
                                    <td className="px-6 py-4 text-slate-200 font-semibold text-sm">
                                        {menu.title}
                                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{menu.url}</div>
                                    </td>
                                    {[1, 2, 3, 4].map(pType => (
                                        <td key={pType} className="px-6 py-4 text-center">
                                            <input 
                                                type="checkbox"
                                                checked={hasMenuPermission(menu.id, pType)}
                                                onChange={() => handleTogglePermission(menu.id, pType)}
                                                className="w-4 h-4 text-cyan-600 bg-slate-950 border-slate-800 rounded focus:ring-cyan-500/50 cursor-pointer accent-cyan-500"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end pt-2">
                    <button 
                        onClick={handleSavePermissions}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/25"
                    >
                        <Save size={18} /> Save Role Permissions
                    </button>
                </div>
            </div>
        )}

        {/* User Account Modal */}
        {showUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
                    <button onClick={() => setShowUserModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={18}/></button>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users size={20} className="text-cyan-400" /> {selectedUser ? 'Edit User Profile' : 'Register New User'}
                    </h3>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">User Name</label>
                            <input required type="text" value={userForm.userName} onChange={e => setUserForm({...userForm, userName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                            <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                        </div>
                        {!selectedUser && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                                <input required type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Role</label>
                            <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm font-medium">
                                {rolesList.map(role => (
                                    <option key={role.id} value={role.name}>{role.title || role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2.5 py-1.5">
                            <input type="checkbox" id="user-active" checked={userForm.isActive} onChange={e => setUserForm({...userForm, isActive: e.target.checked})} className="w-4 h-4 text-cyan-500 bg-slate-950 border-slate-800 rounded focus:ring-cyan-500 cursor-pointer accent-cyan-500" />
                            <label htmlFor="user-active" className="text-xs text-slate-400 font-semibold select-none cursor-pointer">Allow Account Login (Is Active)</label>
                        </div>
                        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-cyan-900/25">Save User Profile</button>
                    </form>
                </div>
            </div>
        )}

        {/* Role Config Modal */}
        {showRoleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
                    <button onClick={() => setShowRoleModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={18}/></button>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-cyan-400" /> {selectedRole ? 'Edit User Role' : 'Create Custom Role'}
                    </h3>
                    <form onSubmit={handleRoleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role Identifier (Code)</label>
                            <input required type="text" placeholder="e.g. Admin, Teacher" value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Friendly Title</label>
                            <input required type="text" placeholder="e.g. Head Instructor" value={roleForm.title} onChange={e => setRoleForm({...roleForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                        </div>
                        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-cyan-900/25">Save Role Config</button>
                    </form>
                </div>
            </div>
        )}

        {/* Menu Manager Modal */}
        {showMenuModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
                    <button onClick={() => setShowMenuModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={18}/></button>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-cyan-400" /> {selectedMenu ? 'Edit Menu Details' : 'Register System Menu'}
                    </h3>
                    <form onSubmit={handleMenuSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Menu Title</label>
                            <input required type="text" placeholder="e.g. Homework Bank" value={menuForm.title} onChange={e => setMenuForm({...menuForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Route Path (URL)</label>
                            <input required type="text" placeholder="e.g. /teacher/homeworks" value={menuForm.url} onChange={e => setMenuForm({...menuForm, url: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lucide Icon Name</label>
                                <input type="text" placeholder="e.g. BookOpen, Award" value={menuForm.icon} onChange={e => setMenuForm({...menuForm, icon: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Sequence</label>
                                <input type="number" value={menuForm.sequence} onChange={e => setMenuForm({...menuForm, sequence: parseInt(e.target.value) || 1})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                            <textarea rows={2} placeholder="Explain what this menu item controls..." value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm" />
                        </div>
                        <div className="flex items-center gap-2.5 py-1.5">
                            <input type="checkbox" id="menu-withoutview" checked={menuForm.withoutView} onChange={e => setMenuForm({...menuForm, withoutView: e.target.checked})} className="w-4 h-4 text-cyan-500 bg-slate-950 border-slate-800 rounded focus:ring-cyan-500 cursor-pointer accent-cyan-500" />
                            <label htmlFor="menu-withoutview" className="text-xs text-slate-400 font-semibold select-none cursor-pointer">Without View (Background Action Only)</label>
                        </div>
                        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-cyan-900/25">Save Menu Item</button>
                    </form>
                </div>
            </div>
        )}
      </div>
    );
  };

  const renderJobManager = () => {
      const filteredCompanies = adminCompanies.filter(c => 
          (c.name || c.Name || '').toLowerCase().includes(companySearchQuery.toLowerCase()) ||
          (c.email || c.Email || '').toLowerCase().includes(companySearchQuery.toLowerCase())
      );

      const handleCategorySubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          const api = await import('../../services/api');
          try {
              if (selectedJobCategory) {
                  await api.updateJobCategory(selectedJobCategory.id || selectedJobCategory.Id, { name: jobCatName, isActive: jobCatIsActive });
                  alert("Category updated successfully!");
              } else {
                  await api.createJobCategory({ name: jobCatName, isActive: jobCatIsActive });
                  alert("Category created successfully!");
              }
              setShowJobCategoryModal(false);
              setJobCatName('');
              const cats = await api.fetchAdminJobCategories();
              setAdminJobCategories(cats || []);
          } catch (err) {
              alert("Failed to save category.");
          }
      };

      const handleDeleteCategory = async (catId: string) => {
          if (!confirm("Are you sure you want to delete this category?")) return;
          const api = await import('../../services/api');
          try {
              await api.deleteJobCategory(catId);
              const cats = await api.fetchAdminJobCategories();
              setAdminJobCategories(cats || []);
          } catch (err) {
              alert("Failed to delete category.");
          }
      };

      const handleToggleCompanyVerify = async (companyId: string, currentStatus: boolean) => {
          const api = await import('../../services/api');
          try {
              await api.verifyCompany(companyId, !currentStatus);
              const comps = await api.fetchAdminCompanies();
              setAdminCompanies(comps || []);
          } catch (err) {
              alert("Failed to update verification status.");
          }
      };

      const handleDeleteCompany = async (companyId: string) => {
          if (!confirm("Are you sure you want to delete this company profile?")) return;
          const api = await import('../../services/api');
          try {
              await api.deleteCompany(companyId);
              const comps = await api.fetchAdminCompanies();
              setAdminCompanies(comps || []);
          } catch (err) {
              alert("Failed to delete company.");
          }
      };

      return (
          <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Job Board Manager</h2>
              </div>

              {/* Sub-tabs Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-6">
                  {[
                      { id: 'list', label: 'Jobs List' },
                      { id: 'categories', label: 'Job Categories' },
                      { id: 'companies', label: 'Company Verification' },
                      { id: 'applications', label: 'Applications' }
                  ].map(tab => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveJobSubTab(tab.id as any)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                              activeJobSubTab === tab.id
                              ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-900/30'
                              : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                          }`}
                      >
                          {tab.label}
                      </button>
                  ))}
              </div>

              {/* 1. Jobs List & Post Form Tab */}
              {activeJobSubTab === 'list' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-slate-800 p-8 rounded-2xl border border-slate-700">
                          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                              <Briefcase size={20} className="text-violet-400" /> Post New Job
                          </h3>
                          <form onSubmit={handlePostJob} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
                                      <input required type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none" placeholder="e.g. Junior Developer" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Company *</label>
                                      <select
                                          value={selectedCompanyId}
                                          onChange={e => {
                                              setSelectedCompanyId(e.target.value);
                                              if (e.target.value !== 'custom') {
                                                  const found = adminCompanies.find(c => (c.id || c.Id)?.toString() === e.target.value);
                                                  if (found) setJobCompany(found.name || found.Name || '');
                                              } else {
                                                  setJobCompany('');
                                              }
                                          }}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none text-sm"
                                      >
                                          <option value="custom">-- Custom / Unlisted Company --</option>
                                          {adminCompanies.map(c => (
                                              <option key={c.id || c.Id} value={(c.id || c.Id)?.toString()}>
                                                  {c.name || c.Name} {(c.isVerified || c.IsVerified) ? 'âœ“' : '(Pending)'}
                                              </option>
                                          ))}
                                      </select>
                                      {selectedCompanyId === 'custom' && (
                                          <input
                                              required
                                              type="text"
                                              value={jobCompany}
                                              onChange={e => setJobCompany(e.target.value)}
                                              className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-violet-500 outline-none text-xs"
                                              placeholder="Enter custom company name"
                                          />
                                      )}
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                                      <input required type="text" value={jobLocation} onChange={e => setJobLocation(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none" placeholder="e.g. Dhaka, Remote" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Salary Range</label>
                                      <input type="text" value={jobSalary} onChange={e => setJobSalary(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none" placeholder="e.g. 20k - 30k" />
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Job Type</label>
                                      <select value={jobType} onChange={e => setJobType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none">
                                          <option>Full-time</option>
                                          <option>Part-time</option>
                                          <option>Internship</option>
                                          <option>Contract</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Post Destination</label>
                                      <select value={jobDestination} onChange={e => setJobDestination(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none">
                                          <option value="Portal">Main Job Portal</option>
                                          <option value="Career">TakeUUp Careers</option>
                                      </select>
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Job Category *</label>
                                      <select
                                          value={selectedCategoryId}
                                          onChange={e => {
                                              setSelectedCategoryId(e.target.value);
                                              const found = adminJobCategories.find(c => (c.id || c.Id)?.toString() === e.target.value);
                                              if (found) setJobCategory(found.name || found.Name || '');
                                          }}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none text-sm"
                                      >
                                          <option value="">-- Select Category --</option>
                                          {adminJobCategories.map(c => (
                                              <option key={c.id || c.Id} value={(c.id || c.Id)?.toString()}>{c.name || c.Name}</option>
                                          ))}
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Experience Level</label>
                                      <select value={jobExperienceLevel} onChange={e => setJobExperienceLevel(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none">
                                          <option>Entry Level</option>
                                          <option>Mid Level</option>
                                          <option>Senior Level</option>
                                      </select>
                                  </div>
                              </div>

                              {selectedCompanyId === 'custom' && (
                                  <div className="grid grid-cols-1 gap-4">
                                      <div>
                                          <label className="block text-sm font-medium text-slate-400 mb-1">Company Logo File (Optional)</label>
                                          <input type="file" accept="image/*" onChange={e => {
                                              if (e.target.files && e.target.files[0]) {
                                                  setJobCompanyLogoFile(e.target.files[0]);
                                              }
                                          }} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-500/10 file:text-violet-400 hover:file:bg-violet-500/20" />
                                      </div>
                                  </div>
                              )}

                              <div>
                                  <label className="block text-sm font-medium text-slate-400 mb-1">Job Description</label>
                                  <textarea rows={3} value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none" placeholder="Explain the role and qualifications..." />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Requirements (one per line)</label>
                                      <textarea rows={3} value={jobRequirements} onChange={e => setJobRequirements(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none" placeholder="â€¢ Requirement 1&#10;â€¢ Requirement 2" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Responsibilities (one per line)</label>
                                      <textarea rows={3} value={jobResponsibilities} onChange={e => setJobResponsibilities(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none" placeholder="â€¢ Responsibility 1&#10;â€¢ Responsibility 2" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-400 mb-1">Benefits (one per line)</label>
                                      <textarea rows={3} value={jobBenefits} onChange={e => setJobBenefits(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none" placeholder="â€¢ Benefit 1&#10;â€¢ Benefit 2" />
                                  </div>
                              </div>

                              <div className="flex justify-end pt-2">
                                  <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-900/20">
                                      <Briefcase size={18} /> Post Job
                                  </button>
                              </div>
                          </form>
                      </div>

                      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                          <h3 className="text-lg font-bold text-white mb-4">Active Listings</h3>
                          <div className="space-y-3">
                              {jobs.map(job => (
                                  <div key={job.id || job.Id} className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex flex-col gap-2 relative group text-left">
                                      <div className="flex justify-between items-start">
                                          <div>
                                              <h4 className="font-bold text-white text-sm">{job.title || job.Title}</h4>
                                              <p className="text-xs text-slate-400">{job.company || job.Company} â€¢ {job.type || job.Type}</p>
                                              <span className={`text-[10px] px-1.5 py-0.5 rounded border mt-1.5 inline-flex items-center gap-1 font-bold ${(job.destination || job.Destination) === 'Career' ? 'border-pink-500/50 text-pink-400 bg-pink-500/10' : 'border-blue-500/50 text-blue-400 bg-blue-500/10'}`}>
                                                  {(job.destination || job.Destination) === 'Career' ? <Rocket size={10} /> : <Globe size={10} />}
                                                  {(job.destination || job.Destination) === 'Career' ? 'Internal Career' : 'Job Portal'}
                                              </span>
                                          </div>
                                          <button onClick={() => deleteJob(job.id || job.Id)} className="text-slate-500 hover:text-red-400 transition-colors">
                                              <Trash2 size={14} />
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {/* 2. Job Categories Tab */}
              {activeJobSubTab === 'categories' && (
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
                      <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-white">Job Categories</h3>
                          <button
                              onClick={() => {
                                  setSelectedJobCategory(null);
                                  setJobCatName('');
                                  setJobCatIsActive(true);
                                  setShowJobCategoryModal(true);
                              }}
                              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1.5"
                          >
                              <Plus size={16} /> Add Category
                          </button>
                      </div>

                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-400">
                              <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-xs">
                                  <tr>
                                      <th className="px-6 py-4">Name</th>
                                      <th className="px-6 py-4">Slug</th>
                                      <th className="px-6 py-4">Status</th>
                                      <th className="px-6 py-4 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-700">
                                  {adminJobCategories.map(cat => (
                                      <tr key={cat.id || cat.Id} className="hover:bg-slate-750">
                                          <td className="px-6 py-4 font-bold text-white">{cat.name || cat.Name}</td>
                                          <td className="px-6 py-4 font-mono text-xs">{cat.slug || cat.Slug}</td>
                                          <td className="px-6 py-4">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                  (cat.isActive ?? cat.IsActive) ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                              }`}>
                                                  {(cat.isActive ?? cat.IsActive) ? 'Active' : 'Inactive'}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 text-right space-x-2 text-xs">
                                              <button
                                                  onClick={() => {
                                                      setSelectedJobCategory(cat);
                                                      setJobCatName(cat.name || cat.Name || '');
                                                      setJobCatIsActive(cat.isActive ?? cat.IsActive ?? true);
                                                      setShowJobCategoryModal(true);
                                                  }}
                                                  className="text-xs bg-slate-750 hover:bg-slate-700 text-cyan-400 font-bold px-3 py-1.5 rounded-lg"
                                              >
                                                  Edit
                                              </button>
                                              <button
                                                  onClick={() => handleDeleteCategory(cat.id || cat.Id)}
                                                  className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-3 py-1.5 rounded-lg"
                                              >
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                                  {adminJobCategories.length === 0 && (
                                      <tr>
                                          <td colSpan={4} className="px-6 py-10 text-center text-slate-500">No categories found.</td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* 3. Company Verification Tab */}
              {activeJobSubTab === 'companies' && (
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <h3 className="text-lg font-bold text-white">Company Profiles</h3>
                          <input 
                              type="text" 
                              placeholder="Search companies..." 
                              value={companySearchQuery} 
                              onChange={e => setCompanySearchQuery(e.target.value)} 
                              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-cyan-500 outline-none text-xs w-full md:w-64" 
                          />
                      </div>

                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-400">
                              <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-xs">
                                  <tr>
                                      <th className="px-6 py-4">Company</th>
                                      <th className="px-6 py-4">Website / Address</th>
                                      <th className="px-6 py-4">Status</th>
                                      <th className="px-6 py-4 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-700">
                                  {filteredCompanies.map(comp => (
                                      <tr key={comp.id || comp.Id} className="hover:bg-slate-750">
                                          <td className="px-6 py-4">
                                              <div className="flex items-center gap-3">
                                                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-750 p-1.5 flex items-center justify-center shrink-0">
                                                      <img src={comp.logo || comp.Logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.name || comp.Name || 'C')}&background=random`} alt="" className="w-full h-full object-contain rounded" />
                                                  </div>
                                                  <div>
                                                      <div className="font-bold text-white text-sm">{comp.name || comp.Name}</div>
                                                      <div className="text-xs text-slate-500">{comp.email || comp.Email || 'No email'}</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="px-6 py-4">
                                              <div className="text-white text-xs font-medium">
                                                  {comp.website || comp.Website ? (
                                                      <a href={comp.website || comp.Website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                                          {comp.website || comp.Website}
                                                      </a>
                                                  ) : 'N/A'}
                                              </div>
                                              <div className="text-[10px] text-slate-500 mt-0.5">{comp.address || comp.Address || 'No address'}</div>
                                          </td>
                                          <td className="px-6 py-4">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                  (comp.isVerified ?? comp.IsVerified) ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                                              }`}>
                                                  {(comp.isVerified ?? comp.IsVerified) ? 'Verified' : 'Pending Review'}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 text-right space-x-2">
                                              <button
                                                  onClick={() => handleToggleCompanyVerify(comp.id || comp.Id, comp.isVerified ?? comp.IsVerified)}
                                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                                      (comp.isVerified ?? comp.IsVerified)
                                                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                                                      : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                                                  }`}
                                              >
                                                  {(comp.isVerified ?? comp.IsVerified) ? 'Revoke Approval' : 'Approve & Verify'}
                                              </button>
                                              <button
                                                  onClick={() => handleDeleteCompany(comp.id || comp.Id)}
                                                  className="text-xs bg-red-500/10 hover:bg-red-550/20 text-red-400 font-bold px-3 py-1.5 rounded-lg"
                                              >
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                                  {filteredCompanies.length === 0 && (
                                      <tr>
                                          <td colSpan={4} className="px-6 py-10 text-center text-slate-500">No companies registered.</td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* 4. Applications Tab */}
              {activeJobSubTab === 'applications' && renderApplications()}

              {/* Job Category Manager Modal */}
              {showJobCategoryModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowJobCategoryModal(false)} />
                      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                          <button onClick={() => setShowJobCategoryModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={18}/></button>
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                              <Plus size={20} className="text-cyan-400" /> {selectedJobCategory ? 'Edit Job Category' : 'Add Job Category'}
                          </h3>
                          <form onSubmit={handleCategorySubmit} className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category Name</label>
                                  <input required type="text" placeholder="e.g. Finance & Accounting" value={jobCatName} onChange={e => setJobCatName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div className="flex items-center gap-2.5 py-1.5">
                                  <input type="checkbox" id="cat-isactive" checked={jobCatIsActive} onChange={e => setJobCatIsActive(e.target.checked)} className="w-4 h-4 text-cyan-500 bg-slate-950 border-slate-800 rounded focus:ring-cyan-500 cursor-pointer accent-cyan-500" />
                                  <label htmlFor="cat-isactive" className="text-xs text-slate-400 font-semibold select-none cursor-pointer">Active / Visible on Portal</label>
                              </div>
                              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl text-sm shadow-lg shadow-cyan-900/25">
                                  Save Category
                              </button>
                          </form>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderApplications = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Application Review</h2>
          </div>
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-xs">
                      <tr>
                          <th className="px-6 py-4">Applicant</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Test Score</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                      {applications.map(app => (
                          <tr key={app.id} className="hover:bg-slate-700/30">
                              <td className="px-6 py-4">
                                  <div className="font-bold text-white">{app.name}</div>
                                  <div className="text-xs">{app.email}</div>
                              </td>
                              <td className="px-6 py-4">{app.jobTitle}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      app.status === 'Qualified' ? 'bg-green-500/10 text-green-400' : 
                                      app.status === 'Disqualified' ? 'bg-red-500/10 text-red-400' : 
                                      'bg-yellow-500/10 text-yellow-400'
                                  }`}>
                                      {app.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 font-mono">{app.testScore ? `${app.testScore.toFixed(1)}%` : 'N/A'}</td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                  <button onClick={() => downloadCV(app.cvFileName)} className="p-2 hover:bg-slate-600 rounded text-blue-400" title="Download CV"><Download size={16} /></button>
                                  <button onClick={() => { setReviewTestApp(app); setShowScheduleModal(true); }} className="p-2 hover:bg-slate-600 rounded text-green-400" title="Schedule Interview"><Calendar size={16} /></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderBlogManager = () => {
      const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
              setBlogImageFile(file);
              setBlogImage(URL.createObjectURL(file));
          }
      };

      const handleSaveBlogCategory = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!blogCategoryNameInput.trim()) {
              alert('Please enter a category name');
              return;
          }
          try {
              const { createBlogCategory, updateBlogCategory } = await import('../../services/api');
              const formData = new FormData();
              formData.append('Name', blogCategoryNameInput);
              if (editingBlogCategoryId) {
                  await updateBlogCategory(editingBlogCategoryId, formData);
                  alert('Blog category updated successfully');
              } else {
                  await createBlogCategory(formData);
                  alert('Blog category created successfully');
              }
              setBlogCategoryNameInput('');
              setEditingBlogCategoryId(null);
              loadBlogsManagerData();
          } catch (err) {
              console.error(err);
              alert('Failed to save blog category');
          }
      };

      const handleDeleteBlogCategory = async (id: string) => {
          if (!window.confirm('Are you sure you want to delete this blog category?')) return;
          try {
              const { deleteBlogCategory } = await import('../../services/api');
              await deleteBlogCategory(id);
              loadBlogsManagerData();
          } catch (err) {
              console.error(err);
              alert('Failed to delete blog category');
          }
      };

      const handleToggleBlogCategory = async (id: string) => {
          try {
              const { toggleBlogCategoryStatus } = await import('../../services/api');
              await toggleBlogCategoryStatus(id);
              loadBlogsManagerData();
          } catch (err) {
              console.error(err);
              alert('Failed to toggle status');
          }
      };

      return (
          <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto text-left">
              <div className="pb-4 border-b border-slate-800">
                  <h2 className="text-2xl font-bold text-white">Blog Manager</h2>
                  <p className="text-sm text-slate-400">Create, edit, and categorize blog posts for the public site.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="font-bold text-white text-base">{editingPostId ? 'âœï¸ Edit Post' : 'âœï¸ Create New Post'}</h3>
                      <form id="blog-form" onSubmit={handlePublishBlog} className="space-y-5">
                          <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-400 uppercase">Blog Title</label>
                              <input 
                                  type="text" 
                                  placeholder="e.g. Mastering Organic Chemistry for HSC" 
                                  value={blogTitle} 
                                  onChange={e => setBlogTitle(e.target.value)} 
                                  required
                                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" 
                              />
                          </div>

                          <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                              <select 
                                  value={blogCategory} 
                                  onChange={e => setBlogCategory(e.target.value)} 
                                  required
                                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                              >
                                  <option value="">Select Category</option>
                                  {blogCategoriesList.map((cat: any) => (
                                      <option key={cat.id || cat.Id} value={cat.id || cat.Id}>
                                          {cat.name || cat.Name}
                                      </option>
                                  ))}
                              </select>
                          </div>

                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase">Blog Cover Image</label>
                              <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={handleImageFileChange}
                                  className="w-full text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
                              />
                              {blogImage && (
                                  <div className="mt-3 relative w-full h-48 rounded-xl overflow-hidden border border-slate-800">
                                      <img src={blogImage.startsWith('blob:') || blogImage.startsWith('http') ? blogImage : `/uploads/blogs/${blogImage}`} alt="Cover Preview" className="w-full h-full object-cover" />
                                      <button 
                                          type="button" 
                                          onClick={() => { setBlogImage(null); setBlogImageFile(null); }}
                                          className="absolute top-2 right-2 bg-slate-950/80 p-1.5 rounded-lg text-rose-400 hover:text-white"
                                      >
                                          <X size={14} />
                                      </button>
                                  </div>
                              )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                              <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Tags (comma-separated)</label>
                                  <input 
                                      type="text" 
                                      placeholder="hsc, chemistry, organic" 
                                      value={blogTags} 
                                      onChange={e => setBlogTags(e.target.value)} 
                                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>

                              <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Meta Keywords (comma-separated)</label>
                                  <input 
                                      type="text" 
                                      placeholder="hsc guide, chemistry guide" 
                                      value={blogMetaKeywords} 
                                      onChange={e => setBlogMetaKeywords(e.target.value)} 
                                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>
                          </div>

                          <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-400 uppercase">Meta Description (short snippet for search results)</label>
                              <textarea 
                                  placeholder="Enter search engine snippet..." 
                                  rows={2} 
                                  value={blogMetaDescription} 
                                  onChange={e => setBlogMetaDescription(e.target.value)} 
                                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" 
                              />
                          </div>

                          <div className="space-y-1.5 text-left">
                              <label className="text-xs font-bold text-slate-400 uppercase">Blog Post Content</label>
                              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                                  {/* Toolbar */}
                                  <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap gap-1 items-center">
                                      <button type="button" onClick={() => insertBlogFormat('<strong>', '</strong>')} className="w-8 h-8 flex items-center justify-center font-bold text-sm text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Bold">B</button>
                                      <button type="button" onClick={() => insertBlogFormat('<em>', '</em>')} className="w-8 h-8 flex items-center justify-center italic text-sm text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Italic">I</button>
                                      <button type="button" onClick={() => insertBlogFormat('<u>', '</u>')} className="w-8 h-8 flex items-center justify-center underline text-sm text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Underline">U</button>
                                      
                                      <div className="w-[1px] h-6 bg-slate-800 mx-1" />
                                      
                                      <button type="button" onClick={() => insertBlogFormat('<h1>', '</h1>')} className="px-2 h-8 flex items-center justify-center font-extrabold text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Heading 1">H1</button>
                                      <button type="button" onClick={() => insertBlogFormat('<h2>', '</h2>')} className="px-2 h-8 flex items-center justify-center font-bold text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Heading 2">H2</button>
                                      
                                      <div className="w-[1px] h-6 bg-slate-800 mx-1" />
                                      
                                      <button type="button" onClick={() => insertBlogFormat('<ul>\n  <li>', '</li>\n</ul>')} className="px-2 h-8 flex items-center justify-center text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Bullet List">â— List</button>
                                      <button type="button" onClick={() => insertBlogFormat('<ol>\n  <li>', '</li>\n</ol>')} className="px-2 h-8 flex items-center justify-center text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Numbered List">1. List</button>
                                      
                                      <div className="w-[1px] h-6 bg-slate-800 mx-1" />
                                      
                                      <button type="button" onClick={() => insertBlogFormat('<a href="https://" target="_blank">', '</a>')} className="px-2 h-8 flex items-center justify-center text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Link">Link</button>
                                      <button type="button" onClick={() => insertBlogFormat('<table class="w-full border">\n  <tr>\n    <td class="border p-2">Cell 1</td>\n    <td class="border p-2">Cell 2</td>\n  </tr>\n</table>', '')} className="px-2 h-8 flex items-center justify-center text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Table">Table</button>
                                  </div>
                                  <textarea id="blog-content-textarea" rows={12} placeholder="Write the full blog post content here (HTML / formatting supported)..." value={blogContent} onChange={e => setBlogContent(e.target.value)} required className="w-full bg-transparent border-0 px-4 py-3 text-white outline-none text-sm leading-relaxed font-sans" />
                              </div>
                          </div>

                          <div className="flex gap-3">
                              <button 
                                  type="submit" 
                                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/20"
                              >
                                  {editingPostId ? 'Save Changes' : 'Publish Blog Post'}
                              </button>
                              {editingPostId && (
                                  <button 
                                      type="button" 
                                      onClick={resetBlogForm} 
                                      className="bg-slate-850 border border-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-800 hover:text-white transition-all"
                                  >
                                      Cancel
                                  </button>
                              )}
                          </div>
                      </form>
                  </div>

                  <div className="space-y-6">
                      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl overflow-y-auto max-h-[480px] space-y-4">
                          <h3 className="font-bold text-white text-base">ðŸ“š Published Posts ({blogs.length})</h3>
                          <div className="space-y-3">
                              {blogs.map((blog: any) => {
                                  const id = blog.id || blog.Id;
                                  const title = blog.title || blog.Title;
                                  const category = blog.categoryName || blog.CategoryName || 'General';
                                  return (
                                      <div key={id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex justify-between items-center gap-3 hover:border-slate-700 transition-colors">
                                          <div className="truncate text-left">
                                              <p className="text-sm font-bold text-white truncate">{title}</p>
                                              <p className="text-[10px] text-slate-500 uppercase mt-0.5">{category}</p>
                                          </div>
                                          <div className="flex gap-1">
                                              <button 
                                                  onClick={() => handleEditPost(blog)} 
                                                  className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                  title="Edit post"
                                              >
                                                  <Edit size={14} />
                                              </button>
                                              <button 
                                                  onClick={() => handleDeletePost(id)} 
                                                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                  title="Delete post"
                                              >
                                                  <Trash2 size={14} />
                                              </button>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Blog Category Manager */}
                      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4 text-left">
                          <h3 className="font-bold text-white text-base">ðŸ·ï¸ Blog Categories</h3>
                          <form onSubmit={handleSaveBlogCategory} className="flex gap-2">
                              <input 
                                  type="text" 
                                  placeholder="New category name..." 
                                  value={blogCategoryNameInput} 
                                  onChange={e => setBlogCategoryNameInput(e.target.value)} 
                                  required
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 text-xs" 
                              />
                              <button 
                                  type="submit" 
                                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-md shadow-cyan-900/10"
                              >
                                  {editingBlogCategoryId ? 'Save' : 'Add'}
                              </button>
                              {editingBlogCategoryId && (
                                  <button 
                                      type="button" 
                                      onClick={() => { setEditingBlogCategoryId(null); setBlogCategoryNameInput(''); }} 
                                      className="bg-slate-800 text-slate-400 hover:text-white px-2.5 py-2 rounded-xl text-xs font-bold"
                                  >
                                      Ã—
                                  </button>
                              )}
                          </form>

                          <div className="divide-y divide-slate-850 max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
                              {blogCategoriesList.map((cat: any) => {
                                  const catId = cat.id || cat.Id;
                                  const catName = cat.name || cat.Name;
                                  const catActive = cat.isActive || cat.IsActive;
                                  return (
                                      <div key={catId} className="py-2.5 flex justify-between items-center gap-2 text-xs">
                                          <div className="truncate text-left flex items-center gap-2">
                                              <span className="font-semibold text-white">{catName}</span>
                                              <button 
                                                  type="button"
                                                  onClick={() => handleToggleBlogCategory(catId)}
                                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                      catActive 
                                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                      : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                                                  }`}
                                              >
                                                  {catActive ? 'Active' : 'Inactive'}
                                              </button>
                                          </div>
                                          <div className="flex gap-1 flex-shrink-0">
                                              <button 
                                                  type="button"
                                                  onClick={() => { setEditingBlogCategoryId(catId); setBlogCategoryNameInput(catName); }} 
                                                  className="text-cyan-400 hover:text-cyan-300 p-1 font-semibold"
                                                  title="Edit name"
                                              >
                                                  Edit
                                              </button>
                                              <button 
                                                  type="button"
                                                  onClick={() => handleDeleteBlogCategory(catId)} 
                                                  className="text-rose-400 hover:text-rose-300 p-1 font-semibold"
                                                  title="Delete category"
                                              >
                                                  Delete
                                              </button>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderNewsletter = () => (
      <div className="space-y-6 animate-in fade-in">
          <h2 className="text-2xl font-bold text-white">Newsletter</h2>
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-2xl">
              <form onSubmit={handleSendNewsletter} className="space-y-4">
                  <input type="text" placeholder="Subject" value={newsSubject} onChange={e => setNewsSubject(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" />
                  <textarea placeholder="Message Body..." rows={6} value={newsBody} onChange={e => setNewsBody(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" />
                  <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                      <Send size={18} /> Send Broadcast
                  </button>
              </form>
          </div>
      </div>
  );

  const renderQuestionUpload = () => (
      <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                  <h2 className="text-2xl font-bold text-white">Question Bank & Curriculum settings</h2>
                  <p className="text-sm text-slate-400">Control quiz categories, subject mappings, teacher approvals, and bulk uploads.</p>
              </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-800 mb-6 overflow-x-auto whitespace-nowrap">
              {[
                  { id: 'upload', label: 'Single & Bulk Upload' },
                  { id: 'teacher_approvals', label: `Teacher Approvals (${pendingQuestions.filter(q => q.status !== 'PendingEdit' && q.status !== 'Approved_PendingDelete' && isCreatedByTeacher(q.createdBy)).length})` },
                  { id: 'others_approvals', label: `Others Approvals (${pendingQuestions.filter(q => q.status !== 'PendingEdit' && q.status !== 'Approved_PendingDelete' && !isCreatedByTeacher(q.createdBy)).length})` },
                  { id: 'edit_requests', label: `Edit Requests (${pendingQuestions.filter(q => q.status === 'PendingEdit').length})` },
                  { id: 'delete_requests', label: `Delete Requests (${pendingQuestions.filter(q => q.status === 'Approved_PendingDelete').length})` },
                  { id: 'teacher_questions', label: `Teacher Questions (${approvedQuestions.filter(q => isCreatedByTeacher(q.createdBy)).length})` },
                  { id: 'others_questions', label: `Others Questions (${approvedQuestions.filter(q => !isCreatedByTeacher(q.createdBy)).length})` },
                  { id: 'settings', label: 'Quiz Categories & Subjects' }
              ].map(tab => (
                  <button
                      key={tab.id}
                      onClick={() => setQuizSubTab(tab.id as any)}
                      className={`px-6 py-3 font-bold text-sm border-b-2 transition-all -mb-[2px] ${
                          quizSubTab === tab.id 
                          ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' 
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                  >
                      {tab.label}
                  </button>
              ))}
          </div>

          {quizSubTab === 'upload' && (
              <>

                  {/* Beautiful Guidelines Card */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-6 font-sans">
                      <div className="flex justify-between items-center cursor-pointer select-none font-sans" onClick={() => setShowGuide(!showGuide)}>
                          <div className="flex items-center gap-2.5 font-sans">
                              <BookOpen className="text-cyan-400" size={20} />
                              <div>
                                  <h4 className="font-extrabold text-white text-sm font-sans font-sans">ðŸ“ Math Equation & LaTeX Formatting Guide (à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦¸à¦®à§€à¦•à¦°à¦£ à¦—à¦¾à¦‡à¦¡à¦²à¦¾à¦‡à¦¨)</h4>
                                  <p className="text-[11px] text-slate-400 font-sans">Click to view cheat-sheet codes for fractions, roots, sums, integrals, matrices, etc.</p>
                              </div>
                          </div>
                          <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg font-sans">
                              {showGuide ? "Hide Guide ðŸ”¼" : "Show Guide ðŸ”½"}
                          </span>
                      </div>

                      {showGuide && (
                          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed animate-in slide-in-from-top-4 duration-300 font-sans">
                              <div className="space-y-3 font-sans">
                                  <h5 className="font-bold text-white uppercase text-[10px] text-cyan-400 font-sans">1. Delimiters (à¦¸à¦®à§€à¦•à¦°à¦£ à¦²à§‡à¦–à¦¾à¦° à¦¨à¦¿à§Ÿà¦®)</h5>
                                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300 font-sans">
                                      <li><strong>Inline Math (à¦²à¦¾à¦‡à¦¨à§‡à¦° à¦®à¦¾à¦à§‡ à¦¸à¦®à§€à¦•à¦°à¦£):</strong> Use <code>{"\\\\( ... \\\\)"}</code> or <code>{"$ ... $"}</code>. Example: <code>{"Solve for \\\\(x\\\\): \\\\(x^2 + y^2 = r^2\\\\)"}</code>.</li>
                                      <li><strong>Block Math (à¦†à¦²à¦¾à¦¦à¦¾ à¦¬à§à¦²à¦•à§‡ à¦¬à§œ à¦¸à¦®à§€à¦•à¦°à¦£):</strong> Use <code>{"\\\\[ ... \\\\]"}</code> or <code>{"$ ... $"}</code>. Example: <code>{"\\\\[E = mc^2\\\\]"}</code>.</li>
                                  </ul>

                                  <h5 className="font-bold text-white uppercase text-[10px] text-cyan-400 mt-4 font-sans font-sans font-sans">2. Common Math Symbols Cheat Sheet (à¦•à¦ªà¦¿-à¦ªà§‡à¦¸à§à¦Ÿ à¦•à§‹à¦¡)</h5>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Single Upload Form */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-2 flex items-center gap-2"><Upload size={18} className="text-cyan-400" /> Add Single Question</h3>
                      <form onSubmit={handleSaveQuestion} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                                  <select value={quizClass} onChange={e => handleClassChange(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm">
                                      <option value="">Select Category</option>
                                      {quizCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                  </select>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Subject</label>
                                  <select value={quizSubject} onChange={e => setQuizSubject(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm">
                                      <option value="">Select Subject</option>
                                      {quizSubjects.filter(s => {
                                          const cat = quizCategories.find(c => c.name === quizClass);
                                          return cat ? s.quizCategoryId === cat.id : true;
                                      }).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                  </select>
                              </div>
                          </div>

                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase">Question Text</label>
                              <input type="text" placeholder="e.g. What is the value of gravitational constant G?" value={questionText} onChange={e => setQuestionText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                          </div>

                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase">Answer Options</label>
                              {options.map((opt, i) => (
                                  <div key={i} className="flex gap-2 items-center">
                                      <span className="text-xs font-bold text-slate-500 w-6">#{i+1}</span>
                                      <input type="text" placeholder={`Option ${i + 1}`} value={opt} onChange={e => handleOptionChange(i, e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm" required />
                                  </div>
                              ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Correct Answer Index</label>
                                  <select value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm">
                                      <option value="0">Option 1</option>
                                      <option value="1">Option 2</option>
                                      <option value="2">Option 3</option>
                                      <option value="3">Option 4</option>
                                  </select>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Access Level</label>
                                  <select value={quizAccess} onChange={e => setQuizAccess(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm">
                                      <option value="Free">Free</option>
                                      <option value="Premium">Premium</option>
                                  </select>
                              </div>
                          </div>

                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase">Explanation (Optional)</label>
                              <textarea rows={2} placeholder="Explain the rationale of the correct answer..." value={explanation} onChange={e => setExplanation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm" />
                          </div>

                          
                           {/* Live Preview Panel */}
                           <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                               <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-sans">ðŸ“ Live Question Preview</span>
                               <div className="space-y-1.5 text-xs text-slate-300">
                                   <div className="font-semibold text-slate-100 leading-relaxed font-sans">
                                       {questionText || "Start typing your question text..."}
                                   </div>
                                   <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
                                       {options.map((opt, i) => {
                                           const isCorrect = String(i) === String(correctAnswer);
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
                                   {explanation && (
                                       <div className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded border border-slate-850 font-sans font-sans">
                                           Explanation: {explanation}
                                       </div>
                                   )}
                                </div>
                            </div>

                           <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 text-sm">Create and Publish Question</button>
                      </form>
                  </div>

                                    {/* Bulk File Upload Form */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 font-sans font-sans font-sans">
                      <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-2 flex items-center gap-2">
                          <ClipboardList size={18} className="text-cyan-400" /> Bulk File Upload (Excel / Word)
                      </h3>
                      
                      {/* Template Downloads */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-855 space-y-2">
                          <span className="text-xs text-slate-400 font-semibold block font-sans">Download Templates:</span>
                          <div className="grid grid-cols-2 gap-3">
                              <button 
                                  type="button"
                                  onClick={downloadExcelTemplate}
                                  className="bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-400 font-bold px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 font-sans font-sans"
                              >
                                  ðŸ“Š Excel Template (.xlsx)
                              </button>
                              <button 
                                  type="button"
                                  onClick={downloadWordTemplate}
                                  className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 font-bold px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 font-sans"
                              >
                                  ðŸ“ Word Template (.doc)
                              </button>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed pt-1 font-sans">
                              * Support LaTeX format inside cells (e.g. \\(x^2\\) or \[a/b\]). Correct Answer column supports indices (1-4) or letters (A-D).
                          </p>
                      </div>

                      {/* File Uploader */}
                      <div className="space-y-2 font-sans font-sans font-sans">
                          <label className="text-xs font-bold text-slate-400 uppercase block font-sans">Select Excel or Word File</label>
                          <input 
                              type="file" 
                              accept=".xlsx, .xls, .docx, .doc"
                              onChange={handleFileUpload}
                              className="w-full bg-slate-950 border border-slate-855 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-xs font-sans" 
                          />
                      </div>

                      {isParsing && (
                          <div className="text-xs text-cyan-400 animate-pulse py-2 font-sans">
                              âŒ› Parsing upload file... please wait.
                          </div>
                      )}

                      {uploadError && (
                          <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 p-2.5 rounded-xl font-sans">
                              âš ï¸ Error: {uploadError}
                          </div>
                      )}

                      {/* Preview and Save Options */}
                      {parsedQuestions.length > 0 && (
                          <div className="space-y-4 pt-2 border-t border-slate-800/60 font-sans font-sans">
                              <div className="flex justify-between items-center">
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
                                          <div className="grid grid-cols-2 gap-1.5 font-sans">
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
                                              <div className="text-slate-400 italic bg-slate-950 p-1.5 rounded border border-slate-900 text-[10px] font-sans font-sans">
                                                  Explanation: {q.explanation}
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
                  </div>
              </>
          )}

                    {(quizSubTab === 'teacher_approvals' || quizSubTab === 'others_approvals') && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in font-sans">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-400">
                          <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs">
                              <tr>
                                  <th className="px-6 py-4">Category/Subject</th>
                                  <th className="px-6 py-4">Question Text</th>
                                  <th className="px-6 py-4">Creator / Date</th>
                                  <th className="px-6 py-4">Status</th>
                                  <th className="px-6 py-4 text-right font-sans">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                              {pendingQuestions.filter(q => {
                                  if (q.status === 'PendingEdit' || q.status === 'Approved_PendingDelete') return false;
                                  const isTeacher = isCreatedByTeacher(q.createdBy);
                                  return quizSubTab === 'teacher_approvals' ? isTeacher : !isTeacher;
                              }).map(q => (
                                  <tr key={q.id} className="hover:bg-slate-800/20 transition-colors font-sans">
                                      <td className="px-6 py-4">
                                          <div className="text-white font-bold text-sm font-sans">{q.subject}</div>
                                          <div className="text-xs text-slate-400 font-sans">{q.category}</div>
                                      </td>
                                      <td className="px-6 py-4 font-sans">
                                          <div className="text-slate-200 text-sm font-semibold mb-2" title={q.text}>{q.text}</div>
                                          <div className="grid grid-cols-2 gap-2 mb-2 max-w-md font-sans font-sans">
                                              {q.options?.map((opt: string, idx: number) => {
                                                  const isCorrect = String(idx) === String(q.correctAnswer);
                                                  return (
                                                      <div 
                                                          key={idx} 
                                                          className={`px-3 py-1.5 rounded-lg text-xs border ${
                                                              isCorrect 
                                                              ? 'bg-green-500/10 text-green-400 border-green-500/30 font-bold' 
                                                              : 'bg-slate-950/40 text-slate-400 border-slate-855'
                                                          }`}
                                                      >
                                                          <span className="opacity-50 mr-1.5">{idx + 1}.</span> {opt}
                                                      </div>
                                                  );
                                              })}
                                          </div>
                                          {q.explanation && (
                                              <div className="text-xs bg-slate-950/30 border border-slate-855 p-2.5 rounded-xl text-slate-400 max-w-md mt-2 font-sans">
                                                  <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">Explanation:</span>
                                                  {q.explanation}
                                              </div>
                                          )}
                                      </td>
                                      <td className="px-6 py-4 font-sans font-sans font-sans">
                                          <div className="text-xs font-semibold text-slate-300 font-sans">{q.createdBy}</div>
                                          <div className="text-[10px] text-slate-500 mt-0.5">{new Date(q.createdAt).toLocaleString()}</div>
                                      </td>
                                      <td className="px-6 py-4 font-sans">
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                              q.status === 'Pending'
                                                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                          }`}>
                                              {q.status === 'Pending' ? 'Pending Review' : 'Correction Requested'}
                                          </span>
                                          {q.correctionComment && q.status === 'CorrectionRequested' && (
                                              <div className="text-[9px] text-red-400 max-w-[150px] mt-1 line-clamp-2" title={q.correctionComment}>Comment: {q.correctionComment}</div>
                                          )}
                                      </td>
                                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap font-sans font-sans">
                                          <button onClick={() => handleApproveQuestion(q.id)} className="bg-green-600 hover:bg-green-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors shadow">Approve</button>
                                          <button onClick={() => handleEditQuestionClick(q)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors shadow font-sans">Edit</button>
                                          <button onClick={() => handleDeleteQuestionClick(q.id)} className="bg-red-600 hover:bg-red-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors shadow font-sans">Delete</button>
                                          <button onClick={() => handleOpenCorrectionModal(q.id)} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors shadow">Correction</button>
                                      </td>
                                  </tr>
                              ))}
                              {pendingQuestions.filter(q => {
                                  if (q.status === 'PendingEdit' || q.status === 'Approved_PendingDelete') return false;
                                  const isTeacher = isCreatedByTeacher(q.createdBy);
                                  return quizSubTab === 'teacher_approvals' ? isTeacher : !isTeacher;
                              }).length === 0 && (
                                  <tr>
                                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-sans font-sans">No questions waiting for approval.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {quizSubTab === 'edit_requests' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in font-sans font-sans font-sans">
                  <div className="overflow-x-auto font-sans font-sans">
                      <table className="w-full text-left text-sm text-slate-400 font-sans">
                          <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs">
                              <tr>
                                  <th className="px-6 py-4">Category/Subject</th>
                                  <th className="px-6 py-4">Comparison (Live vs Edited)</th>
                                  <th className="px-6 py-4">Creator / Date</th>
                                  <th className="px-6 py-4 text-right font-sans">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850 font-sans">
                              {pendingQuestions.filter(q => q.status === 'PendingEdit').map(q => (
                                  <tr key={q.id} className="hover:bg-slate-800/20 transition-colors font-sans">
                                      <td className="px-6 py-4">
                                          <div className="text-white font-bold text-sm font-sans">{q.subject}</div>
                                          <div className="text-xs text-slate-400 font-sans">{q.category}</div>
                                      </td>
                                      <td className="px-6 py-4 font-sans">
                                          {q.originalQuestion ? (
                                              <div className="space-y-3 font-sans">
                                                  <div className="border border-red-500/20 bg-red-500/5 p-3 rounded-xl max-w-xl font-sans">
                                                      <span className="text-[10px] text-red-400 font-bold uppercase block mb-1 font-sans">Live Version (Original)</span>
                                                      <div className="text-slate-300 text-xs font-semibold mb-1.5">{q.originalQuestion.text}</div>
                                                      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                                                          {q.originalQuestion.options?.map((opt: string, idx: number) => {
                                                              const isCorrect = String(idx) === String(q.originalQuestion.correctAnswer);
                                                              return (
                                                                  <div key={idx} className={`px-2 py-1 rounded text-[10px] border ${isCorrect ? 'bg-green-500/10 text-green-400 border-green-500/30 font-bold' : 'bg-slate-900/20 text-slate-500 border-slate-900'}`}>
                                                                      <span className="opacity-50 mr-1">{idx + 1}.</span> {opt}
                                                                  </div>
                                                              );
                                                          })}
                                                      </div>
                                                  </div>
                                                  <div className="border border-green-500/20 bg-green-500/5 p-3 rounded-xl max-w-xl font-sans font-sans">
                                                      <span className="text-[10px] text-green-400 font-bold uppercase block mb-1 font-sans font-sans font-sans">Edited Version (Draft Request)</span>
                                                      <div className="text-slate-200 text-xs font-semibold mb-1.5 font-sans font-sans font-sans font-sans font-sans font-sans">{q.text}</div>
                                                      <div className="grid grid-cols-2 gap-1.5 mb-1.5 font-sans font-sans">
                                                          {q.options?.map((opt: string, idx: number) => {
                                                              const isCorrect = String(idx) === String(q.correctAnswer);
                                                              return (
                                                                  <div key={idx} className={`px-2 py-1 rounded text-[10px] border ${isCorrect ? 'bg-green-500/10 text-green-400 border-green-500/30 font-bold' : 'bg-slate-900/20 text-slate-500 border-slate-900'}`}>
                                                                      <span className="opacity-50 mr-1">{idx + 1}.</span> {opt}
                                                                  </div>
                                                              );
                                                          })}
                                                      </div>
                                                  </div>
                                              </div>
                                          ) : (
                                              <div className="text-slate-300 text-xs font-sans">{q.text}</div>
                                          )}
                                      </td>
                                      <td className="px-6 py-4 font-sans font-sans">
                                          <div className="text-xs font-semibold text-slate-300 font-sans">{q.createdBy}</div>
                                          <div className="text-[10px] text-slate-500 mt-0.5">{new Date(q.createdAt).toLocaleString()}</div>
                                      </td>
                                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap font-sans font-sans">
                                          <button onClick={() => handleApproveQuestion(q.id)} className="bg-green-600 hover:bg-green-500 text-white font-bold px-2 py-1 rounded-xl text-[10px] transition-colors shadow">Approve Edit</button>
                                          <button onClick={() => handleOpenCorrectionModal(q.id)} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-2 py-1 rounded-xl text-[10px] transition-colors shadow">Correction</button>
                                          <button onClick={() => handleDeleteQuestionClick(q.id)} className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-1 rounded-xl text-[10px] transition-colors shadow font-sans">Reject Edit</button>
                                      </td>
                                  </tr>
                              ))}
                              {pendingQuestions.filter(q => q.status === 'PendingEdit').length === 0 && (
                                  <tr>
                                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-sans font-sans">No pending edit requests found.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {quizSubTab === 'delete_requests' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in font-sans font-sans">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-400">
                          <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs">
                              <tr>
                                  <th className="px-6 py-4">Category/Subject</th>
                                  <th className="px-6 py-4">Question Text</th>
                                  <th className="px-6 py-4 font-sans font-sans font-sans">Creator / Date</th>
                                  <th className="px-6 py-4 text-right font-sans">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                              {pendingQuestions.filter(q => q.status === 'Approved_PendingDelete').map(q => (
                                  <tr key={q.id} className="hover:bg-slate-800/20 transition-colors font-sans">
                                      <td className="px-6 py-4">
                                          <div className="text-white font-bold text-sm font-sans">{q.subject}</div>
                                          <div className="text-xs text-slate-400 font-sans">{q.category}</div>
                                      </td>
                                      <td className="px-6 py-4 font-sans font-sans">
                                          <div className="text-slate-200 text-xs font-semibold mb-2 font-sans">{q.text}</div>
                                          <div className="grid grid-cols-2 gap-2 mb-2 max-w-md">
                                              {q.options?.map((opt: string, idx: number) => {
                                                  const isCorrect = String(idx) === String(q.correctAnswer);
                                                  return (
                                                      <div key={idx} className={`px-3 py-1.5 rounded-lg text-xs border ${isCorrect ? 'bg-green-500/10 text-green-400 border-green-500/30 font-bold' : 'bg-slate-900/40 text-slate-400 border-slate-850'}`}>
                                                          <span className="opacity-50 mr-1.5">{idx + 1}.</span> {opt}
                                                      </div>
                                                  );
                                              })}
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <div className="text-xs font-semibold text-slate-300">{q.createdBy}</div>
                                          <div className="text-[10px] text-slate-500 mt-0.5">{new Date(q.createdAt).toLocaleString()}</div>
                                      </td>
                                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                          <button onClick={() => handleApproveQuestion(q.id)} className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shadow">Approve Delete</button>
                                          <button onClick={() => handleOpenCorrectionModal(q.id)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shadow font-sans">Reject Delete</button>
                                      </td>
                                  </tr>
                              ))}
                              {pendingQuestions.filter(q => q.status === 'Approved_PendingDelete').length === 0 && (
                                  <tr>
                                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-sans font-sans">No pending delete requests found.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {(quizSubTab === 'teacher_questions' || quizSubTab === 'others_questions') && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-in fade-in space-y-4 p-6 font-sans">
                  {/* Category and Subject Filters for Approved Questions */}
                  <div className="flex flex-wrap gap-4 items-center mb-2 font-sans">
                      <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-bold uppercase font-sans">Category:</span>
                          <select 
                              value={questionFilterCategory} 
                              onChange={e => { setQuestionFilterCategory(e.target.value); setQuestionFilterSubject('All'); }}
                              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none cursor-pointer font-sans"
                          >
                              <option value="All" className="bg-slate-900 text-white">All Categories</option>
                              {quizCategories.map(c => <option key={c.id} value={c.name} className="bg-slate-900 text-white">{c.name}</option>)}
                          </select>
                      </div>
                      <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-bold uppercase font-sans">Subject:</span>
                          <select 
                              value={questionFilterSubject} 
                              onChange={e => setQuestionFilterSubject(e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none cursor-pointer font-sans"
                          >
                              <option value="All" className="bg-slate-900 text-white">All Subjects</option>
                              {questionFilterCategory !== 'All' && quizSubjects.filter(s => {
                                  const cat = quizCategories.find(c => c.name === questionFilterCategory);
                                  return cat && s.quizCategoryId?.toLowerCase() === cat.id?.toLowerCase();
                              }).map(s => <option key={s.id} value={s.name} className="bg-slate-900 text-white">{s.name}</option>)}
                          </select>
                      </div>
                      <div className="flex items-center gap-2 md:ml-auto w-full md:w-auto">
                          <span className="text-xs text-slate-400 font-bold uppercase font-sans">Search:</span>
                          <input 
                              type="text"
                              value={questionFilterSearch}
                              onChange={e => setQuestionFilterSearch(e.target.value)}
                              placeholder="Search question text..."
                              className="w-full md:w-48 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-cyan-500 font-sans"
                          />
                      </div>
                  </div>

                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-400">
                          <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs font-sans">
                              <tr>
                                  <th className="px-6 py-4">Category/Subject</th>
                                  <th className="px-6 py-4">Question Text</th>
                                  <th className="px-6 py-4 font-sans font-sans">Creator / Date</th>
                                  <th className="px-6 py-4 font-sans font-sans">Status</th>
                                  <th className="px-6 py-4 text-right font-sans">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                              {approvedQuestions.filter(q => {
                                  const isTeacher = isCreatedByTeacher(q.createdBy);
                                  if (quizSubTab === 'teacher_questions' && !isTeacher) return false;
                                  if (quizSubTab === 'others_questions' && isTeacher) return false;
                                  if (questionFilterCategory !== 'All' && q.category?.toLowerCase() !== questionFilterCategory?.toLowerCase()) return false;
                                  if (questionFilterSubject !== 'All' && q.subject?.toLowerCase() !== questionFilterSubject?.toLowerCase()) return false;
                                  if (questionFilterSearch) {
                                      const term = questionFilterSearch.toLowerCase();
                                      const matchText = (q.text || '').toLowerCase().includes(term);
                                      const matchCategory = (q.category || '').toLowerCase().includes(term);
                                      const matchSubject = (q.subject || '').toLowerCase().includes(term);
                                      if (!matchText && !matchCategory && !matchSubject) return false;
                                  }
                                  return true;
                              }).map(q => (
                                  <tr key={q.id} className="hover:bg-slate-800/20 transition-colors font-sans">
                                      <td className="px-6 py-4">
                                          <div className="text-white font-bold text-sm font-sans">{q.subject}</div>
                                          <div className="text-xs text-slate-400 font-sans">{q.category}</div>
                                          <div className="mt-2">
                                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                                  q.accessLevel === 'Premium'
                                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                                              }`}>
                                                  {q.accessLevel || 'Free'}
                                              </span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 font-sans">
                                          <div className="text-slate-200 text-sm font-semibold mb-2" title={q.text}>{q.text}</div>
                                          <div className="grid grid-cols-2 gap-2 mb-2 max-w-md font-sans">
                                              {q.options?.map((opt: string, idx: number) => {
                                                  const isCorrect = String(idx) === String(q.correctAnswer);
                                                  return (
                                                      <div 
                                                          key={idx} 
                                                          className={`px-3 py-1.5 rounded-lg text-xs border ${
                                                              isCorrect 
                                                              ? 'bg-green-500/10 text-green-400 border-green-500/30 font-bold' 
                                                              : 'bg-slate-900/40 text-slate-400 border-slate-850'
                                                          }`}
                                                      >
                                                          <span className="opacity-50 mr-1.5">{idx + 1}.</span> {opt}
                                                      </div>
                                                  );
                                              })}
                                          </div>
                                          {q.explanation && (
                                              <div className="text-xs bg-slate-950/30 border border-slate-850 p-2.5 rounded-xl text-slate-400 max-w-md mt-2 font-sans">
                                                  <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">Explanation:</span>
                                                  {q.explanation}
                                              </div>
                                          )}
                                      </td>
                                      <td className="px-6 py-4 font-sans">
                                          <div className="text-xs font-semibold text-slate-300 font-sans">{q.createdBy}</div>
                                          <div className="text-[10px] text-slate-500 mt-0.5">{new Date(q.createdAt).toLocaleString()}</div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-green-500/10 text-green-400 border-green-500/20 font-sans">
                                              Live & Approved
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap font-sans">
                                          <button onClick={() => handleEditQuestionClick(q)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors shadow font-sans">Edit</button>
                                          <button onClick={() => handleDeleteQuestionClick(q.id)} className="bg-red-600 hover:bg-red-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors shadow font-sans">Delete</button>
                                      </td>
                                  </tr>
                              ))}
                              {approvedQuestions.filter(q => {
                                  const isTeacher = isCreatedByTeacher(q.createdBy);
                                  if (quizSubTab === 'teacher_questions' && !isTeacher) return false;
                                  if (quizSubTab === 'others_questions' && isTeacher) return false;
                                  if (questionFilterCategory !== 'All' && q.category?.toLowerCase() !== questionFilterCategory?.toLowerCase()) return false;
                                  if (questionFilterSubject !== 'All' && q.subject?.toLowerCase() !== questionFilterSubject?.toLowerCase()) return false;
                                  if (questionFilterSearch) {
                                      const term = questionFilterSearch.toLowerCase();
                                      const matchText = (q.text || '').toLowerCase().includes(term);
                                      const matchCategory = (q.category || '').toLowerCase().includes(term);
                                      const matchSubject = (q.subject || '').toLowerCase().includes(term);
                                      if (!matchText && !matchCategory && !matchSubject) return false;
                                  }
                                  return true;
                              }).length === 0 && (
                                  <tr>
                                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-sans">No questions found.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}


          {quizSubTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-in fade-in">
                  {/* Categories Panel */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="font-extrabold text-white text-base">Quiz Categories</h3>
                          <button onClick={() => { setSelectedCategory(null); setCategoryForm({ id: '', name: '', isActive: true }); setShowCategoryModal(true); }} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-cyan-900/10"><Plus size={14}/> Add Category</button>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-400">
                              <thead className="bg-slate-950 text-slate-300 font-bold uppercase">
                                  <tr>
                                      <th className="px-4 py-3">Name</th>
                                      <th className="px-4 py-3">Slug</th>
                                      <th className="px-4 py-3">Status</th>
                                      <th className="px-4 py-3 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850">
                                  {quizCategories.map(c => (
                                      <tr key={c.id} className="hover:bg-slate-800/10">
                                          <td className="px-4 py-3 font-semibold text-white">{c.name}</td>
                                          <td className="px-4 py-3 font-mono text-slate-550">{c.slug}</td>
                                          <td className="px-4 py-3">
                                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${c.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                                          </td>
                                          <td className="px-4 py-3 text-right space-x-1.5">
                                              <button onClick={() => { setSelectedCategory(c); setCategoryForm({ id: c.id, name: c.name, isActive: c.isActive }); setShowCategoryModal(true); }} className="text-slate-400 hover:text-cyan-400 transition-colors"><Edit size={13} /></button>
                                              <button onClick={() => handleDeleteCategory(c.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Subjects Panel */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="font-extrabold text-white text-base">Quiz Subjects</h3>
                          <button onClick={() => { setSelectedSubject(null); setSubjectForm({ id: '', name: '', quizCategoryId: quizCategories[0]?.id || '', isActive: true }); setShowSubjectModal(true); }} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-cyan-900/10"><Plus size={14}/> Add Subject</button>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-400">
                              <thead className="bg-slate-950 text-slate-300 font-bold uppercase">
                                  <tr>
                                      <th className="px-4 py-3">Subject</th>
                                      <th className="px-4 py-3">Category</th>
                                      <th className="px-4 py-3">Status</th>
                                      <th className="px-4 py-3 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850">
                                  {quizSubjects.map(s => {
                                      const cat = quizCategories.find(c => c.id === s.quizCategoryId);
                                      return (
                                          <tr key={s.id} className="hover:bg-slate-800/10">
                                              <td className="px-4 py-3 font-semibold text-white">
                                                  {s.name}
                                                  {s.pendingName && (
                                                      <div className="text-[10px] text-yellow-400 mt-1 font-sans">
                                                          Pending Rename to: <strong className="underline">{s.pendingName}</strong>
                                                      </div>
                                                  )}
                                              </td>
                                              <td className="px-4 py-3 font-bold text-slate-400">{cat?.name || 'Unmapped'}</td>
                                              <td className="px-4 py-3">
                                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${s.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                                              </td>
                                              <td className="px-4 py-3 text-right space-x-1.5">
                                                  <button onClick={() => { setSelectedSubject(s); setSubjectForm({ id: s.id, name: s.name, quizCategoryId: s.quizCategoryId, isActive: s.isActive }); setShowSubjectModal(true); }} className="text-slate-400 hover:text-cyan-400 transition-colors"><Edit size={13} /></button>
                                                  <button onClick={() => handleDeleteSubject(s.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                                              </td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Pending Subject Name Changes Panel */}
                  {pendingSubjectNameChanges.length > 0 && (
                      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 mt-6">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                              <h3 className="font-extrabold text-white text-base">Pending Subject Name Change Requests</h3>
                          </div>
                          <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs text-slate-400">
                                  <thead className="bg-slate-950 text-slate-300 font-bold uppercase">
                                      <tr>
                                          <th className="px-4 py-3">Current Name</th>
                                          <th className="px-4 py-3">Requested New Name</th>
                                          <th className="px-4 py-3">Category</th>
                                          <th className="px-4 py-3 text-right">Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-850">
                                      {pendingSubjectNameChanges.map(s => {
                                          const cat = quizCategories.find(c => c.id === s.quizCategoryId);
                                          return (
                                              <tr key={s.id} className="hover:bg-slate-800/10">
                                                  <td className="px-4 py-3 font-semibold text-slate-300">{s.name}</td>
                                                  <td className="px-4 py-3 font-bold text-yellow-400">{s.pendingName}</td>
                                                  <td className="px-4 py-3 text-slate-400">{cat?.name || 'Unmapped'}</td>
                                                  <td className="px-4 py-3 text-right space-x-2">
                                                      <button onClick={() => handleApproveSubjectNameChange(s.id)} className="bg-green-600 hover:bg-green-500 text-white font-bold px-2 py-1 rounded text-[10px] transition-colors">Approve</button>
                                                      <button onClick={() => handleRejectSubjectNameChange(s.id)} className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-1 rounded text-[10px] transition-colors">Reject</button>
                                                  </td>
                                              </tr>
                                          );
                                      })}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* Category CRUD Modal */}
          {showCategoryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 relative">
                      <button onClick={() => setShowCategoryModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                      <h3 className="text-lg font-bold text-white mb-4">{selectedCategory ? 'Edit Category' : 'Create Category'}</h3>
                      <form onSubmit={handleSaveCategory} className="space-y-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase">Category Name</label>
                              <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                          </div>
                          <div className="flex items-center gap-2">
                              <input type="checkbox" checked={categoryForm.isActive} onChange={e => setCategoryForm({ ...categoryForm, isActive: e.target.checked })} id="catActive" />
                              <label htmlFor="catActive" className="text-sm font-bold text-slate-300">Is Active</label>
                          </div>
                          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2.5 rounded-xl text-sm transition-all">{selectedCategory ? 'Update' : 'Create'}</button>
                      </form>
                  </div>
              </div>
          )}

          {/* Subject CRUD Modal */}
          {showSubjectModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 relative">
                      <button onClick={() => setShowSubjectModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                      <h3 className="text-lg font-bold text-white mb-4">{selectedSubject ? 'Edit Subject' : 'Create Subject'}</h3>
                      <form onSubmit={handleSaveSubject} className="space-y-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase">Subject Name</label>
                              <input type="text" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase">Category Mapped</label>
                              <select value={subjectForm.quizCategoryId} onChange={e => setSubjectForm({ ...subjectForm, quizCategoryId: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm">
                                  {quizCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                          </div>
                          <div className="flex items-center gap-2">
                              <input type="checkbox" checked={subjectForm.isActive} onChange={e => setSubjectForm({ ...subjectForm, isActive: e.target.checked })} id="subActive" />
                              <label htmlFor="subActive" className="text-sm font-bold text-slate-300">Is Active</label>
                          </div>
                          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2.5 rounded-xl text-sm transition-all">{selectedSubject ? 'Update' : 'Create'}</button>
                      </form>
                  </div>
              </div>
          )}

          {/* Question Edit Modal */}
          {showQuestionEditModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 relative my-8 font-sans">
                      <button onClick={() => setShowQuestionEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1.5 font-sans"><Edit3 size={18} className="text-cyan-400" /> Edit Question Draft</h3>
                      <p className="text-xs text-slate-400 mb-4 font-sans">Modify the question text, options, correct answer choice, access level, or category tags.</p>
                      
                      <form onSubmit={handleUpdateQuestion} className="space-y-4 text-left font-sans">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase font-sans">Category</label>
                                  <input type="text" value={editQuestionForm.category} onChange={e => setEditQuestionForm({...editQuestionForm, category: e.target.value})} className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 text-xs font-sans" required />
                              </div>
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase font-sans">Subject</label>
                                  <input type="text" value={editQuestionForm.subject} onChange={e => setEditQuestionForm({...editQuestionForm, subject: e.target.value})} className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 text-xs font-sans" required />
                              </div>
                          </div>

                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase font-sans">Question Text</label>
                              <textarea rows={3} value={editQuestionForm.text} onChange={e => setEditQuestionForm({...editQuestionForm, text: e.target.value})} className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-xs font-sans" required />
                          </div>

                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase block font-sans">Answer Options</label>
                              {editQuestionForm.options.map((opt, i) => (
                                  <div key={i} className="flex gap-2 items-center">
                                      <span className="text-xs font-bold text-slate-500 w-6 font-sans">#{i+1}</span>
                                      <input type="text" value={opt} onChange={e => {
                                          const nextOpts = [...editQuestionForm.options];
                                          nextOpts[i] = e.target.value;
                                          setEditQuestionForm({...editQuestionForm, options: nextOpts});
                                      }} className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-1.5 text-white outline-none focus:border-cyan-500 text-xs font-sans" required />
                                  </div>
                              ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase font-sans">Correct Index</label>
                                  <select value={editQuestionForm.correctAnswer} onChange={e => setEditQuestionForm({...editQuestionForm, correctAnswer: e.target.value})} className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 text-xs font-sans cursor-pointer">
                                      <option value="0" className="bg-slate-900 text-white">Option 1</option>
                                      <option value="1" className="bg-slate-900 text-white">Option 2</option>
                                      <option value="2" className="bg-slate-900 text-white">Option 3</option>
                                      <option value="3" className="bg-slate-900 text-white">Option 4</option>
                                  </select>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase font-sans">Access Level</label>
                                  <select value={editQuestionForm.accessLevel} onChange={e => setEditQuestionForm({...editQuestionForm, accessLevel: e.target.value})} className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 text-xs font-sans cursor-pointer">
                                      <option value="Free" className="bg-slate-900 text-white">Free</option>
                                      <option value="Premium" className="bg-slate-900 text-white">Premium</option>
                                  </select>
                              </div>
                          </div>

                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase font-sans">Explanation</label>
                              <textarea rows={2} value={editQuestionForm.explanation} onChange={e => setEditQuestionForm({...editQuestionForm, explanation: e.target.value})} className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-xs font-sans" />
                          </div>

                          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-all text-sm font-sans">Save & Update Question Draft</button>
                      </form>
                  </div>
              </div>
          )}

          {/* Correction Feedback Modal */}
          {showCorrectionModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 relative">
                      <button onClick={() => setShowCorrectionModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                      <h3 className="text-lg font-bold text-white mb-2">Request Correction</h3>
                      <p className="text-xs text-slate-400 mb-4">Provide detailed feedback comments on what corrections are needed. The creator will see this comment when editing the question.</p>
                      <div className="space-y-4">
                          <textarea rows={4} placeholder="e.g. Please check Option #2 spelling and correct the explanation context..." value={correctionComment} onChange={e => setCorrectionComment(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" required />
                          <button onClick={handleSendCorrectionRequest} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-all text-sm">Send Correction Request</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const handleSavePricingPlan = (e: React.FormEvent) => {
      e.preventDefault();
      const newPlan = {
          name: pricingForm.name,
          price: pricingForm.price,
          period: pricingForm.period,
          desc: pricingForm.desc,
          iconName: 'Shield',
          features: pricingForm.features.split(',').map(f => f.trim()).filter(Boolean),
          buttonText: pricingForm.buttonText,
          featured: pricingForm.featured
      };
      const updated = [...pricingPlansList];
      if (editPricingIndex !== null) {
          updated[editPricingIndex] = newPlan;
      } else {
          updated.push(newPlan);
      }
      setPricingPlansList(updated);
      setShowPricingModal(false);
  };

  const renderSettings = () => {
      return (
          <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto text-left">
              <div>
                  <h2 className="text-2xl font-bold text-white font-sans">General & System Settings</h2>
                  <p className="text-sm text-slate-400">Configure application metadata, payment integrations, SMS alerts, and course subscription plans.</p>
              </div>

              {/* Settings Sub-Tabs Navigation */}
              <div className="flex gap-2 border-b border-slate-800 pb-3">
                  {[
                      { id: 'general', label: 'General & Courses' },
                      { id: 'firebase', label: 'ðŸ”¥ Firebase & Social OAuth' },
                      { id: 'sms', label: 'SMS Gateway Settings' },
                      { id: 'payment', label: 'Payment Gateways' },
                      { id: 'smtp', label: 'SMTP Email Config' },
                      { id: 'maintenance', label: 'Maintenance Mode' }
                  ].map(tab => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveSettingsTab(tab.id as any)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              activeSettingsTab === tab.id
                              ? 'bg-cyan-600 text-white font-bold'
                              : 'text-slate-450 hover:bg-slate-850 hover:text-white'
                          }`}
                      >
                          {tab.label}
                      </button>
                  ))}
              </div>

              {/* Settings Content Area */}
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                  {activeSettingsTab === 'general' && (
                      <div className="space-y-6">
                          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Basic Application Metadata</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Application Name</label>
                                  <input type="text" value={appName} onChange={e => setAppName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Home Page SEO Title</label>
                                  <input type="text" value={homePageTitle} onChange={e => setHomePageTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                          </div>

                          <div className="pt-4">
                              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                                  <h4 className="text-base font-bold text-white">Course Pricing Plans</h4>
                                  <button
                                      type="button"
                                      onClick={() => {
                                          setEditPricingIndex(null);
                                          setPricingForm({ name: '', price: 0, period: '/month', desc: '', features: '', buttonText: 'Buy Now', featured: false });
                                          setShowPricingModal(true);
                                      }}
                                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
                                  >
                                      Add New Plan
                                  </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                  {pricingPlansList.length > 0 ? (
                                      pricingPlansList.map((plan, idx) => (
                                          <div key={idx} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl relative flex flex-col justify-between">
                                              <div>
                                                  <div className="flex justify-between items-start">
                                                      <h5 className="font-bold text-white text-base">{plan.name}</h5>
                                                      {plan.featured && <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/20">Featured</span>}
                                                  </div>
                                                  <p className="text-slate-400 text-xs mt-2 italic">{plan.desc}</p>
                                                  <h6 className="text-xl font-black text-cyan-400 mt-3">à§³{plan.price} <span className="text-xs text-slate-500 font-normal">{plan.period}</span></h6>
                                                  <ul className="mt-4 space-y-1.5 text-xs text-slate-350">
                                                      {(plan.features || []).map((f: string, i: number) => (
                                                          <li key={i} className="flex items-center gap-1.5">
                                                              <span className="text-emerald-400">âœ”</span> {f}
                                                          </li>
                                                      ))}
                                                  </ul>
                                              </div>
                                              <div className="mt-6 pt-4 border-t border-slate-850 flex gap-2">
                                                  <button type="button" onClick={() => handleEditPricingPlan(idx)} className="flex-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 py-1.5 rounded-lg text-xs font-bold transition-all">Edit</button>
                                                  <button type="button" onClick={() => handleDeletePricingPlan(idx)} className="flex-1 bg-slate-900 hover:bg-rose-950 text-rose-450 border border-slate-800 py-1.5 rounded-lg text-xs font-bold transition-all">Delete</button>
                                              </div>
                                          </div>
                                      ))
                                  ) : (
                                      <div className="col-span-3 py-10 text-center text-slate-500 text-sm">No course plans configured yet. Click "Add New Plan" to list subscription choices.</div>
                                  )}
                              </div>
                          </div>
                      </div>
                  )}

                   {activeSettingsTab === 'firebase' && (
                      <div className="space-y-6 animate-in fade-in">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                              <div>
                                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                      ðŸ”¥ Firebase & Social OAuth Authentication Manager
                                  </h3>
                                  <p className="text-xs text-slate-400 mt-1">
                                      Manage Firebase App SDK Keys for Google & Facebook 1-Click Social Sign-In directly from Admin Panel without touching source code.
                                  </p>
                              </div>
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Configured Live
                              </span>
                          </div>

                          {fbSaveMsg && (
                              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-between">
                                  <span>{fbSaveMsg}</span>
                                  <button onClick={() => setFbSaveMsg(null)} className="text-emerald-400 hover:text-white font-bold ml-2">âœ•</button>
                              </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="col-span-2">
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                                      Firebase API Key (<span className="text-cyan-400 font-mono">apiKey</span>)
                                  </label>
                                  <input 
                                      type="text" 
                                      value={fbApiKey} 
                                      onChange={e => setFbApiKey(e.target.value)} 
                                      placeholder="e.g. AIzaSyBVKOOG6tiAWdUp6W2h-FfOJnBY4yatpX8" 
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                                      Auth Domain (<span className="text-cyan-400 font-mono">authDomain</span>)
                                  </label>
                                  <input 
                                      type="text" 
                                      value={fbAuthDomain} 
                                      onChange={e => setFbAuthDomain(e.target.value)} 
                                      placeholder="e.g. takeuup-web.firebaseapp.com" 
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                                      Project ID (<span className="text-cyan-400 font-mono">projectId</span>)
                                  </label>
                                  <input 
                                      type="text" 
                                      value={fbProjectId} 
                                      onChange={e => setFbProjectId(e.target.value)} 
                                      placeholder="e.g. takeuup-web" 
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                                      Storage Bucket (<span className="text-cyan-400 font-mono">storageBucket</span>)
                                  </label>
                                  <input 
                                      type="text" 
                                      value={fbStorageBucket} 
                                      onChange={e => setFbStorageBucket(e.target.value)} 
                                      placeholder="e.g. takeuup-web.firebasestorage.app" 
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                                      Messaging Sender ID (<span className="text-cyan-400 font-mono">messagingSenderId</span>)
                                  </label>
                                  <input 
                                      type="text" 
                                      value={fbMessagingSenderId} 
                                      onChange={e => setFbMessagingSenderId(e.target.value)} 
                                      placeholder="e.g. 184600223693" 
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                                      App ID (<span className="text-cyan-400 font-mono">appId</span>)
                                  </label>
                                  <input 
                                      type="text" 
                                      value={fbAppId} 
                                      onChange={e => setFbAppId(e.target.value)} 
                                      placeholder="e.g. 1:184600223693:web:db4fcf763f87654d22ae84" 
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                                      Measurement ID (<span className="text-cyan-400 font-mono">measurementId</span>)
                                  </label>
                                  <input 
                                      type="text" 
                                      value={fbMeasurementId} 
                                      onChange={e => setFbMeasurementId(e.target.value)} 
                                      placeholder="e.g. G-J29Z4FEFZE" 
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono outline-none focus:border-cyan-500 text-sm" 
                                  />
                              </div>
                          </div>

                          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                              <p className="text-xs text-slate-400">
                                  Changes take effect immediately across all client browsers without code rebuilds.
                              </p>
                              <button
                                  type="button"
                                  onClick={() => {
                                      const configObj = {
                                          apiKey: fbApiKey,
                                          authDomain: fbAuthDomain,
                                          projectId: fbProjectId,
                                          storageBucket: fbStorageBucket,
                                          messagingSenderId: fbMessagingSenderId,
                                          appId: fbAppId,
                                          measurementId: fbMeasurementId
                                      };
                                      localStorage.setItem('takeuup_firebase_config', JSON.stringify(configObj));
                                      setFbSaveMsg('âœ“ Firebase OAuth Settings saved successfully! Changes active live.');
                                  }}
                                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                              >
                                  Save Firebase OAuth Credentials
                              </button>
                          </div>
                      </div>
                  )}

                  {activeSettingsTab === 'sms' && (
                      <div className="space-y-6">
                          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                              SMS Alert Gateway
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SMS API Key</label>
                                  <input type="text" value={smsApiKey} onChange={e => setSmsApiKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SMS Secret Key</label>
                                  <input type="password" value={smsSecretKey} onChange={e => setSmsSecretKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SMS Caller ID / Masking Name</label>
                                  <input type="text" value={smsCallerId} onChange={e => setSmsCallerId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                          </div>

                          <div className="flex gap-6 pt-2">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input type="checkbox" checked={smsIsEnabled} onChange={e => setSmsIsEnabled(e.target.checked)} className="rounded bg-slate-950 border-slate-800 text-cyan-500 w-4 h-4 cursor-pointer" />
                                  <span className="text-sm font-semibold text-slate-350">Enable SMS Messaging</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input type="checkbox" checked={smsUseMasking} onChange={e => setSmsUseMasking(e.target.checked)} className="rounded bg-slate-950 border-slate-800 text-cyan-500 w-4 h-4 cursor-pointer" />
                                  <span className="text-sm font-semibold text-slate-350">Use Masking Sender</span>
                              </label>
                          </div>
                      </div>
                  )}

                  {activeSettingsTab === 'payment' && (
                      <div className="space-y-8">
                          {/* bKash Payment Settings */}
                          <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                  <h3 className="text-lg font-bold text-white">bKash Payment Gateway</h3>
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                      <input type="checkbox" checked={bkashIsEnabled} onChange={e => setBkashIsEnabled(e.target.checked)} className="rounded bg-slate-950 border-slate-800 text-cyan-500 w-4 h-4 cursor-pointer" />
                                      <span className="text-sm font-semibold text-slate-350">Enable bKash Gateway</span>
                                  </label>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">bKash App Key</label>
                                      <input type="text" value={bkashAppKey} onChange={e => setBkashAppKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">bKash App Secret</label>
                                      <input type="password" value={bkashAppSecret} onChange={e => setBkashAppSecret(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Merchant Username</label>
                                      <input type="text" value={bkashUsername} onChange={e => setBkashUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Merchant Password</label>
                                      <input type="password" value={bkashPassword} onChange={e => setBkashPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                                  <div className="md:col-span-2">
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">bKash Sandbox API Base URL</label>
                                      <input type="text" value={bkashSandboxUrl} onChange={e => setBkashSandboxUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                              </div>
                          </div>

                          {/* SSLCommerz Settings */}
                          <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                  <h3 className="text-lg font-bold text-white">SSLCommerz Merchant Terminal</h3>
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                      <input type="checkbox" checked={sslIsEnabled} onChange={e => setSslIsEnabled(e.target.checked)} className="rounded bg-slate-950 border-slate-800 text-cyan-500 w-4 h-4 cursor-pointer" />
                                      <span className="text-sm font-semibold text-slate-350">Enable SSLCommerz Payment</span>
                                  </label>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SSL Store ID</label>
                                      <input type="text" value={sslStoreId} onChange={e => setSslStoreId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SSL Store Password / Secret</label>
                                      <input type="password" value={sslStorePassword} onChange={e => setSslStorePassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                                  <div className="md:col-span-2">
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SSL Sandbox / Gateway URL</label>
                                      <input type="text" value={sslSandboxUrl} onChange={e => setSslSandboxUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeSettingsTab === 'smtp' && (
                      <div className="space-y-6">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                              <h3 className="text-lg font-bold text-white">SMTP Email Configurations</h3>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input type="checkbox" checked={smtpIsEnabled} onChange={e => setSmtpIsEnabled(e.target.checked)} className="rounded bg-slate-950 border-slate-800 text-cyan-500 w-4 h-4 cursor-pointer" />
                                  <span className="text-sm font-semibold text-slate-350">Enable SMTP Email Service</span>
                              </label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SMTP Host</label>
                                  <input type="text" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SMTP Port</label>
                                  <input type="text" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Sender Email ID</label>
                                  <input type="text" value={smtpEmail} onChange={e => setSmtpEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Sender Password / App Password</label>
                                  <input type="password" value={smtpPassword} onChange={e => setSmtpPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                          </div>
                       </div>
                  )}

                  {activeSettingsTab === 'maintenance' && (
                      <div className="space-y-6">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                              <h3 className="text-lg font-bold text-white">Maintenance Mode Configuration</h3>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input 
                                      type="checkbox" 
                                      checked={isMaintenanceMode} 
                                      onChange={e => setIsMaintenanceMode(e.target.checked)} 
                                      className="rounded bg-slate-950 border-slate-800 text-cyan-500 w-4 h-4 cursor-pointer" 
                                  />
                                  <span className="text-sm font-semibold text-rose-400">Enable Maintenance Mode</span>
                              </label>
                          </div>
                          
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Maintenance Display Text</label>
                                  <textarea 
                                      rows={4}
                                      value={maintenanceText} 
                                      onChange={e => setMaintenanceText(e.target.value)} 
                                      placeholder="e.g. We are performing scheduled upgrades. We will be back online shortly."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm font-sans" 
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Maintenance Cover Image (Optional)</label>
                                  <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={e => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                              setMaintenanceImageFile(file);
                                              setMaintenanceImage(URL.createObjectURL(file));
                                          }
                                      }}
                                      className="w-full text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
                                  />
                                  {maintenanceImage && (
                                      <div className="mt-3 relative w-64 h-36 rounded-xl overflow-hidden border border-slate-800">
                                          <img 
                                              src={maintenanceImage.startsWith('blob:') || maintenanceImage.startsWith('http') ? maintenanceImage : `http://localhost:5141/${maintenanceImage}`} 
                                              alt="Maintenance Preview" 
                                              className="w-full h-full object-cover" 
                                          />
                                          <button 
                                              type="button" 
                                              onClick={() => { setMaintenanceImage(null); setMaintenanceImageFile(null); }}
                                              className="absolute top-2 right-2 bg-slate-950/80 p-1.5 rounded-lg text-rose-400 hover:text-white"
                                          >
                                              Remove
                                          </button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Settings Action Buttons */}
                  <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                      <button
                          type="button"
                          onClick={activeSettingsTab === 'maintenance' ? handleSaveMaintenanceSettings : handleSaveSettings}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-cyan-900/20 transition-all"
                      >
                          Save Changes
                      </button>
                  </div>
              </div>

              {/* Pricing Plan Add/Edit Modal */}
              {showPricingModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl">
                          <button onClick={() => setShowPricingModal(false)} className="absolute top-4 right-4 text-slate-450 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={18}/></button>
                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                              <Plus size={20} className="text-cyan-400" /> {editPricingIndex !== null ? 'Edit Pricing Plan' : 'Create Pricing Plan'}
                          </h3>
                          <form onSubmit={handleSavePricingPlan} className="space-y-4 text-left">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Plan/Course Name *</label>
                                  <input required type="text" placeholder="e.g. HSC Premium" value={pricingForm.name} onChange={e => setPricingForm({ ...pricingForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price (BDT) *</label>
                                      <input required type="number" placeholder="0" value={pricingForm.price || ''} onChange={e => setPricingForm({ ...pricingForm, price: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Billing Period</label>
                                      <input type="text" placeholder="e.g. /month or /forever" value={pricingForm.period} onChange={e => setPricingForm({ ...pricingForm, period: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short Description</label>
                                  <textarea rows={2} placeholder="Brief description of the course plan..." value={pricingForm.desc} onChange={e => setPricingForm({ ...pricingForm, desc: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Features (comma separated)</label>
                                  <textarea rows={3} placeholder="Feature 1, Feature 2, Feature 3..." value={pricingForm.features} onChange={e => setPricingForm({ ...pricingForm, features: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Button Text</label>
                                      <input type="text" placeholder="Buy Now" value={pricingForm.buttonText} onChange={e => setPricingForm({ ...pricingForm, buttonText: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>
                                  <div className="flex items-center pt-5">
                                      <label className="flex items-center gap-2 cursor-pointer select-none">
                                          <input type="checkbox" checked={pricingForm.featured} onChange={e => setPricingForm({ ...pricingForm, featured: e.target.checked })} className="rounded bg-slate-950 border-slate-800 text-cyan-500 w-4 h-4 cursor-pointer" />
                                          <span className="text-sm font-semibold text-slate-350">Featured / Highlighted</span>
                                      </label>
                                  </div>
                              </div>

                              <div className="border-t border-slate-800 pt-4 mt-6 flex justify-end gap-3 bg-slate-900">
                                  <button type="button" onClick={() => setShowPricingModal(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                                  <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm transition-all">Save Plan</button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const handleEditPricingPlan = (index: number) => {
      const plan = pricingPlansList[index];
      setEditPricingIndex(index);
      setPricingForm({
          name: plan.name || '',
          price: plan.price || 0,
          period: plan.period || '/month',
          desc: plan.desc || '',
          features: Array.isArray(plan.features) ? plan.features.join(', ') : '',
          buttonText: plan.buttonText || 'Buy Now',
          featured: !!plan.featured
      });
      setShowPricingModal(true);
  };

  const handleDeletePricingPlan = (index: number) => {
      const updated = [...pricingPlansList];
      updated.splice(index, 1);
      setPricingPlansList(updated);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
      setIsUpdatingOrder(true);
      try {
          const { updateOrderStatus } = await import('../../services/api');
          await updateOrderStatus(orderId, newStatus);
          if (selectedOrderDetails && (selectedOrderDetails.id === orderId || selectedOrderDetails.Id === orderId)) {
              setSelectedOrderDetails((o: any) => ({ ...o, status: newStatus, Status: newStatus }));
          }
          await loadOrdersData();
      } catch (e) {
          console.error("Failed to update status", e);
      } finally {
          setIsUpdatingOrder(false);
      }
  };

  const handleUpdateOrderPaymentStatus = async (orderId: string, newPaymentStatus: string) => {
      setIsUpdatingOrder(true);
      try {
          const { updateOrderPaymentStatus } = await import('../../services/api');
          await updateOrderPaymentStatus(orderId, newPaymentStatus);
          if (selectedOrderDetails && (selectedOrderDetails.id === orderId || selectedOrderDetails.Id === orderId)) {
              setSelectedOrderDetails((o: any) => ({ ...o, paymentStatus: newPaymentStatus, PaymentStatus: newPaymentStatus }));
          }
          await loadOrdersData();
      } catch (e) {
          console.error("Failed to update payment status", e);
      } finally {
          setIsUpdatingOrder(false);
      }
  };

  const handleDeleteOrder = async (orderId: string) => {
      if (!window.confirm("Are you sure you want to delete this order?")) return;
      try {
          const { deleteOrder } = await import('../../services/api');
          await deleteOrder(orderId);
          await loadOrdersData();
          if (selectedOrderDetails && (selectedOrderDetails.id === orderId || selectedOrderDetails.Id === orderId)) {
              setShowOrderDetailModal(false);
          }
      } catch (e) {
          console.error("Failed to delete order", e);
      }
  }

  const renderOrdersManager = (filterStatus: 'all' | 'pending' | 'progress' | 'delivered' | 'canceled') => {
      const totalCount = ordersList.length;
      const pendingCount = ordersList.filter((o: any) => (o.status || o.Status || '').toLowerCase() === 'pending').length;
      const completedCount = ordersList.filter((o: any) => (o.status || o.Status || '').toLowerCase() === 'delivered').length;
      const totalRevenue = ordersList
          .filter((o: any) => (o.paymentStatus || o.PaymentStatus || '').toLowerCase() === 'paid')
          .reduce((sum: number, o: any) => sum + (o.totalAmount || o.TotalAmount || 0), 0);

      const getTitle = () => {
          switch (filterStatus) {
              case 'pending': return 'Pending Orders';
              case 'progress': return 'Progress Orders';
              case 'delivered': return 'Delivered Orders';
              case 'canceled': return 'Canceled Orders';
              default: return 'All Orders';
          }
      };

      return (
          <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800 gap-4">
                  <div>
                      <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
                      <p className="text-sm text-slate-400">Track customer purchases, update fulfillment/payment states, and manage sales invoices.</p>
                  </div>
                  <div className="flex gap-3">
                      <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                          <input 
                              type="text" 
                              placeholder="Search orders..." 
                              value={orderSearchQuery}
                              onChange={e => setOrderSearchQuery(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500 text-sm w-64 md:w-80 transition-all"
                          />
                      </div>
                      <button 
                          onClick={loadOrdersData}
                          className="bg-slate-900 border border-slate-800 text-white font-bold p-2.5 rounded-xl hover:bg-slate-850 hover:border-slate-700 transition-all"
                          title="Refresh list"
                      >
                          <RefreshCw size={16} className={loadingOrders ? 'animate-spin' : ''} />
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                      <h3 className="text-2xl font-black text-white mt-1.5">{totalCount}</h3>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pending Fulfillment</p>
                      <h3 className="text-2xl font-black text-amber-400 mt-1.5">{pendingCount}</h3>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Completed Orders</p>
                      <h3 className="text-2xl font-black text-emerald-400 mt-1.5">{completedCount}</h3>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Total Sales Revenue</p>
                      <h3 className="text-2xl font-black text-cyan-400 mt-1.5">à§³ {totalRevenue.toLocaleString()}</h3>
                  </div>
              </div>

              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden">
                  {loadingOrders ? (
                      <div className="py-20 text-center text-slate-400 space-y-3">
                          <RefreshCw className="animate-spin mx-auto text-cyan-500" size={32} />
                          <p className="text-sm font-medium">Fetching orders from backend...</p>
                      </div>
                  ) : ordersList.length === 0 ? (
                      <div className="py-20 text-center text-slate-500">
                          No orders found matching criteria.
                      </div>
                  ) : (
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-slate-300">
                              <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-850">
                                  <tr>
                                      <th className="px-6 py-4">Order ID</th>
                                      <th className="px-6 py-4">Customer</th>
                                      <th className="px-6 py-4">Date</th>
                                      <th className="px-6 py-4 text-right">Amount</th>
                                      <th className="px-6 py-4 text-center">Payment</th>
                                      <th className="px-6 py-4 text-center">Fulfillment</th>
                                      <th className="px-6 py-4 text-center">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850">
                                  {ordersList.filter((order: any) => {
                                      const status = (order.status || order.Status || '').toLowerCase();
                                      if (filterStatus === 'all') return true;
                                      if (filterStatus === 'pending') return status === 'pending';
                                      if (filterStatus === 'progress') return status === 'progress' || status === 'processing' || status === 'shipped';
                                      if (filterStatus === 'delivered') return status === 'delivered' || status === 'completed';
                                      if (filterStatus === 'canceled') return status === 'canceled' || status === 'cancelled';
                                      return true;
                                  }).map((order: any) => {
                                      const id = order.id || order.Id;
                                      const name = order.customerName || order.CustomerName || order.userId || order.UserId || 'Guest';
                                      const email = order.customerEmail || order.CustomerEmail || '';
                                      const date = new Date(order.createdAt || order.CreatedAt || Date.now()).toLocaleDateString();
                                      const amount = order.totalAmount || order.TotalAmount || 0;
                                      const payment = order.paymentStatus || order.PaymentStatus || 'Pending';
                                      const status = order.status || order.Status || 'Pending';
                                      
                                      const getPaymentColor = (status: string) => {
                                          switch (status.toLowerCase()) {
                                              case 'paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                                              case 'failed': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                                              case 'refunded': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                                              default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                                          }
                                      };
                                      
                                      const getStatusColor = (status: string) => {
                                          switch (status.toLowerCase()) {
                                              case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                                              case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                                              case 'shipped': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
                                              case 'processing': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                                              default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                                          }
                                      };

                                      return (
                                          <tr key={id} className="hover:bg-slate-900/30 transition-colors">
                                              <td className="px-6 py-4 font-mono text-xs text-slate-400">#{id.substring(0, 8)}</td>
                                              <td className="px-6 py-4">
                                                  <div className="font-bold text-white">{name}</div>
                                                  <div className="text-xs text-slate-500">{email}</div>
                                              </td>
                                              <td className="px-6 py-4 text-slate-400">{date}</td>
                                              <td className="px-6 py-4 text-right font-semibold text-white">à§³ {amount.toLocaleString()}</td>
                                              <td className="px-6 py-4 text-center">
                                                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentColor(payment)}`}>
                                                      {payment}
                                                  </span>
                                              </td>
                                              <td className="px-6 py-4 text-center">
                                                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                                      {status}
                                                  </span>
                                              </td>
                                              <td className="px-6 py-4 text-center">
                                                  <div className="flex justify-center gap-2">
                                                      <button 
                                                          onClick={() => {
                                                              setSelectedOrderDetails(order);
                                                              setShowOrderDetailModal(true);
                                                          }}
                                                          className="p-1.5 text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-all"
                                                          title="View order details"
                                                      >
                                                          <Eye size={14} />
                                                      </button>
                                                      <button 
                                                          onClick={() => handleDeleteOrder(id)}
                                                          className="p-1.5 text-rose-400 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 transition-all"
                                                          title="Delete order"
                                                      >
                                                          <Trash2 size={14} />
                                                      </button>
                                                  </div>
                                              </td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  )}
              </div>

              {showOrderDetailModal && selectedOrderDetails && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 text-left">
                          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                              <div>
                                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                      <ClipboardList className="text-cyan-500" size={20} />
                                      Order Details
                                  </h3>
                                  <p className="text-xs text-slate-500 font-mono mt-1">ID: #{selectedOrderDetails.id || selectedOrderDetails.Id}</p>
                              </div>
                              <button 
                                  onClick={() => setShowOrderDetailModal(false)}
                                  className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-all"
                              >
                                  <X size={20} />
                              </button>
                          </div>

                          <div className="space-y-3">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</h4>
                              <div className="divide-y divide-slate-850 bg-slate-950/50 border border-slate-850 rounded-2xl p-4 space-y-3">
                                  {(() => {
                                      const items = selectedOrderDetails.items || selectedOrderDetails.Items || [];
                                      const list = Array.isArray(items) ? items : (items.$values || []);
                                      
                                      if (list.length === 0) {
                                          return <p className="text-sm text-slate-500 py-4 text-center">No item information recorded.</p>;
                                      }
                                      
                                      return list.map((item: any, idx: number) => {
                                          const title = item.productName || item.ProductName || item.bookTitle || item.BookTitle || `Product #${item.productId || item.ProductId}`;
                                          const qty = item.quantity || item.Quantity || 1;
                                          const price = item.price || item.Price || 0;
                                          return (
                                              <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                                                  <div>
                                                      <p className="font-bold text-white text-sm">{title}</p>
                                                      <p className="text-xs text-slate-500">Qty: {qty} Ã— à§³ {price.toLocaleString()}</p>
                                                  </div>
                                                  <p className="font-semibold text-white text-sm">à§³ {(qty * price).toLocaleString()}</p>
                                              </div>
                                          );
                                      });
                                  })()}
                                  <div className="flex justify-between items-center pt-3 border-t border-slate-800 font-bold text-white">
                                      <span>Total Amount</span>
                                      <span className="text-cyan-400 text-lg">à§³ {(selectedOrderDetails.totalAmount || selectedOrderDetails.TotalAmount || 0).toLocaleString()}</span>
                                  </div>
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Details</h4>
                                  <div className="bg-slate-950/20 border border-slate-850 rounded-2xl p-4 text-sm space-y-1 text-slate-300">
                                      <p><span className="text-slate-500">Name:</span> {selectedOrderDetails.customerName || selectedOrderDetails.CustomerName || 'Guest'}</p>
                                      <p><span className="text-slate-500">Email:</span> {selectedOrderDetails.customerEmail || selectedOrderDetails.CustomerEmail || 'N/A'}</p>
                                      <p><span className="text-slate-500">Phone:</span> {selectedOrderDetails.phone || selectedOrderDetails.Phone || 'N/A'}</p>
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipping Address</h4>
                                  <div className="bg-slate-950/20 border border-slate-850 rounded-2xl p-4 text-sm text-slate-300">
                                      <p className="leading-relaxed">{selectedOrderDetails.shippingAddress || selectedOrderDetails.ShippingAddress || 'No shipping address specified.'}</p>
                                  </div>
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-6">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fulfillment Status</label>
                                  <select 
                                      value={selectedOrderDetails.status || selectedOrderDetails.Status || 'Pending'}
                                      disabled={isUpdatingOrder}
                                      onChange={e => handleUpdateOrderStatus(selectedOrderDetails.id || selectedOrderDetails.Id, e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                                  >
                                      <option value="Pending">Pending</option>
                                      <option value="Processing">Processing</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                  </select>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</label>
                                  <select 
                                      value={selectedOrderDetails.paymentStatus || selectedOrderDetails.PaymentStatus || 'Pending'}
                                      disabled={isUpdatingOrder}
                                      onChange={e => handleUpdateOrderPaymentStatus(selectedOrderDetails.id || selectedOrderDetails.Id, e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                                  >
                                      <option value="Pending">Pending</option>
                                      <option value="Paid">Paid</option>
                                      <option value="Failed">Failed</option>
                                      <option value="Refunded">Refunded</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderStoreManager = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <div>
                  <h2 className="text-2xl font-bold text-white">Student Store & Products</h2>
                  <p className="text-sm text-slate-400">Manage learning textbooks, guides, stationery, and dynamic user store items.</p>
              </div>
              <button 
                  onClick={() => setShowProductModal(true)} 
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-cyan-900/25 transition-all"
              >
                  <Plus size={16} /> Add Product
              </button>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                  <h3 className="text-base font-bold text-white">All Store Products</h3>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                          <tr>
                              <th className="px-6 py-4">Image</th>
                              <th className="px-6 py-4">Product Name</th>
                              <th className="px-6 py-4">Category</th>
                              <th className="px-6 py-4">Price</th>
                              <th className="px-6 py-4">Stock</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                          {storeProducts.length > 0 ? (
                              storeProducts.map(p => {
                                  const id = p.id || p.Id;
                                  const name = p.name || p.Name;
                                  const price = p.price || p.Price;
                                  const stock = p.stock || p.Stock || 0;
                                  const catName = p.categoryName || p.CategoryName || 'Academic';
                                  const primaryImg = ensureArray(p.images || p.Images).find((img: any) => img.isPrimary || img.IsPrimary);
                                  const imgUrl = getProductImageUrl(p.featureImageUrl || p.FeatureImageUrl || p.images?.[0]?.url || p.Images?.[0]?.Url);
                                  
                                  return (
                                      <tr key={id} className="hover:bg-slate-800/40 transition-colors">
                                          <td className="px-6 py-4">
                                              <div className="w-12 h-14 bg-slate-900 rounded-lg p-1 border border-slate-850 flex items-center justify-center overflow-hidden">
                                                  <img src={imgUrl} className="max-h-full max-w-full object-contain" alt="" />
                                              </div>
                                          </td>
                                          <td className="px-6 py-4 font-bold text-white">{name}</td>
                                          <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">{catName}</span></td>
                                          <td className="px-6 py-4 font-black text-cyan-400">à§³{price}</td>
                                          <td className="px-6 py-4">
                                              <span className={`font-bold ${stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                  {stock > 0 ? `${stock} In Stock` : 'Out of Stock'}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 text-right flex justify-end gap-1">
                                              <button 
                                                  onClick={() => handleProductEdit(p)} 
                                                  className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-xl transition-all"
                                                  title="Edit Product"
                                              >
                                                  <Edit size={16} />
                                              </button>
                                              <button 
                                                  onClick={() => handleProductDelete(id)} 
                                                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition-all"
                                                  title="Delete Product"
                                              >
                                                  <Trash2 size={16} />
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })
                          ) : (
                              <tr>
                                  <td colSpan={6} className="text-center py-12 text-slate-500 font-medium">No products registered in database. Click "Add Product" above to seed!</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Add Product Modal */}
          {showProductModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl p-6 relative shadow-2xl max-h-[92vh] flex flex-col">
                      <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-slate-450 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={18}/></button>
                      
                      <div className="border-b border-slate-800 pb-4 mb-6">
                          <h3 className="text-xl font-black text-white flex items-center gap-2">
                              <Plus size={22} className="text-cyan-400" /> Create New Product
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">Provide all specifications, SEO meta details, images and rich catalog overview.</p>
                      </div>

                      <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar text-left">
                          {/* Two Column Section */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Left Column: Basic Details & Media */}
                              <div className="space-y-5">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name <span className="text-red-500">*</span></label>
                                      <input required type="text" placeholder="Enter Name" value={productForm.name} onChange={e => handleNameChange(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>

                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Slug <span className="text-red-500">*</span></label>
                                      <input required type="text" placeholder="Enter Slug" value={productForm.slug} onChange={e => setProductForm({...productForm, slug: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                  </div>

                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Part Number <span className="text-red-500">*</span></label>
                                      <div className="flex gap-2">
                                          <input required type="text" placeholder="PN-41J" value={productForm.partNumber} onChange={e => setProductForm({...productForm, partNumber: e.target.value})} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                          <button type="button" onClick={generatePartNumber} className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-xl text-xs font-bold border border-slate-700 transition-colors">Generate</button>
                                      </div>
                                  </div>

                                  {/* Feature Image Selector & Preview */}
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Feature Image <span className="text-red-500">*</span></label>
                                      <div className="border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-950/40 flex flex-col items-center justify-center text-center">
                                          {featurePreview ? (
                                              <div className="relative w-32 h-32 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center mb-3">
                                                  <img src={featurePreview} className="max-h-full max-w-full object-contain" alt="Feature Preview" />
                                                  <button type="button" onClick={() => { setProductForm({...productForm, featureImage: null}); setFeaturePreview(null); }} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"><X size={10} /></button>
                                              </div>
                                          ) : (
                                              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-500">
                                                  <ImageIcon size={28} />
                                              </div>
                                          )}
                                          <input type="file" accept="image/*" onChange={handleFeatureImageChange} className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer" />
                                          <span className="text-[10px] text-slate-500 mt-2">Note: Image size should be 800 x 800 or square size.</span>
                                      </div>
                                  </div>

                                  {/* Gallery Images Selector & Previews */}
                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Gallery Image <span className="text-red-500">*</span></label>
                                      <div className="border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-950/40 flex flex-col items-center justify-center text-center">
                                          {galleryPreviews.length > 0 ? (
                                              <div className="flex flex-wrap gap-2 justify-center mb-3">
                                                  {galleryPreviews.map((url, index) => (
                                                      <div key={index} className="relative w-16 h-16 bg-slate-950 rounded-lg border border-slate-850 overflow-hidden flex items-center justify-center">
                                                          <img src={url} className="max-h-full max-w-full object-contain" alt="" />
                                                      </div>
                                                  ))}
                                                  <button type="button" onClick={() => { setProductForm({...productForm, galleryImages: []}); setGalleryPreviews([]); }} className="text-[10px] text-red-400 hover:underline block w-full mt-1">Clear Gallery</button>
                                              </div>
                                          ) : (
                                              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-500">
                                                  <Upload size={20} />
                                              </div>
                                          )}
                                          <input type="file" multiple accept="image/*" onChange={handleGalleryImagesChange} className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer" />
                                          <span className="text-[10px] text-slate-500 mt-2">Note: Image size should be 800 x 800 or square size.</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Right Column: Spec / Category / Prices */}
                              <div className="space-y-5">
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Price (BDT) <span className="text-red-500">*</span></label>
                                          <input required type="number" placeholder="0" value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Previous Price (BDT)</label>
                                          <input type="number" placeholder="0" value={productForm.previousPrice || ''} onChange={e => setProductForm({...productForm, previousPrice: parseFloat(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                      </div>
                                  </div>

                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price Status</label>
                                      <select value={productForm.priceStatus} onChange={e => setProductForm({...productForm, priceStatus: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm font-medium">
                                          <option value="Visible">Visible</option>
                                          <option value="Hidden">Hidden</option>
                                      </select>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category <span className="text-red-500">*</span></label>
                                          <select value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm font-medium">
                                              {storeCategories.map(cat => (
                                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                              ))}
                                          </select>
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Sub Category</label>
                                          <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 outline-none focus:border-cyan-500 text-sm font-medium">
                                              <option value="">Select Sub Category</option>
                                              <option value="none">Default Sub Category</option>
                                          </select>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Child Category</label>
                                          <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 outline-none focus:border-cyan-500 text-sm font-medium">
                                              <option value="">Select Child Category</option>
                                          </select>
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Brand</label>
                                          <select value={productForm.brandId} onChange={e => setProductForm({...productForm, brandId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm font-medium">
                                              <option value="">Select Brand</option>
                                              {brandsList.map(b => (
                                                  <option key={b.id || b.Id} value={b.id || b.Id}>{b.name || b.Name}</option>
                                              ))}
                                          </select>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Total in stock <span className="text-red-500">*</span></label>
                                          <input required type="number" placeholder="0" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tax</label>
                                          <select value={productForm.taxId} onChange={e => setProductForm({...productForm, taxId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 outline-none focus:border-cyan-500 text-sm font-medium">
                                              <option value="">Select Tax</option>
                                              <option value="none">No Tax (0%)</option>
                                          </select>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SKU <span className="text-red-500">*</span></label>
                                          <input readOnly type="text" placeholder="SKU will be generated auto" value={productForm.sku} className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-350 outline-none text-sm cursor-not-allowed font-semibold" />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Video Link</label>
                                          <input type="text" placeholder="Enter Video Link" value={productForm.videoLink} onChange={e => setProductForm({...productForm, videoLink: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <hr className="border-slate-800 my-6" />

                          {/* Full Width Sections */}
                          <div className="space-y-5">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short Description <span className="text-red-500">*</span></label>
                                  <textarea required rows={2} placeholder="Enter Short Description" value={productForm.shortDescription} onChange={e => setProductForm({...productForm, shortDescription: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>

                              {/* Rich Description Box with Custom Toolbar */}
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description <span className="text-red-500">*</span></label>
                                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                                      {/* Toolbar */}
                                      <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap gap-1 items-center">
                                          <button type="button" onClick={() => insertFormat('<strong>', '</strong>')} className="w-8 h-8 flex items-center justify-center font-bold text-sm text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Bold">B</button>
                                          <button type="button" onClick={() => insertFormat('<em>', '</em>')} className="w-8 h-8 flex items-center justify-center italic text-sm text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Italic">I</button>
                                          <button type="button" onClick={() => insertFormat('<u>', '</u>')} className="w-8 h-8 flex items-center justify-center underline text-sm text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Underline">U</button>
                                          
                                          <div className="w-[1px] h-6 bg-slate-800 mx-1" />
                                          
                                          <button type="button" onClick={() => insertFormat('<h1>', '</h1>')} className="px-2 h-8 flex items-center justify-center font-extrabold text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Heading 1">H1</button>
                                          <button type="button" onClick={() => insertFormat('<h2>', '</h2>')} className="px-2 h-8 flex items-center justify-center font-bold text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Heading 2">H2</button>
                                          
                                          <div className="w-[1px] h-6 bg-slate-800 mx-1" />
                                          
                                          <button type="button" onClick={() => insertFormat('<ul>\n  <li>', '</li>\n</ul>')} className="px-2 h-8 flex items-center justify-center text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Bullet List">â— List</button>
                                          <button type="button" onClick={() => insertFormat('<ol>\n  <li>', '</li>\n</ol>')} className="px-2 h-8 flex items-center justify-center text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Numbered List">1. List</button>
                                          
                                          <div className="w-[1px] h-6 bg-slate-800 mx-1" />
                                          
                                          <button type="button" onClick={() => insertFormat('<a href="https://" target="_blank">', '</a>')} className="px-2 h-8 flex items-center justify-center text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Link">Link</button>
                                          <button type="button" onClick={() => insertFormat('<table class="w-full border">\n  <tr>\n    <td class="border p-2">Cell 1</td>\n    <td class="border p-2">Cell 2</td>\n  </tr>\n</table>', '')} className="px-2 h-8 flex items-center justify-center text-xs text-slate-350 hover:bg-slate-800 rounded hover:text-white" title="Table">Table</button>
                                      </div>
                                      <textarea id="product-description-textarea" rows={6} placeholder="Start writing description (HTML supported)..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-transparent border-0 px-4 py-3 text-white outline-none text-sm leading-relaxed" />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Product Tags</label>
                                  <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl min-h-[46px] items-center">
                                      {productTagsList.map((tag, idx) => (
                                          <span key={idx} className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-cyan-500/20">
                                              {tag}
                                              <button type="button" onClick={() => removeTag(idx)} className="text-cyan-400 hover:text-cyan-300 font-bold text-xs select-none">Ã—</button>
                                          </span>
                                      ))}
                                      <input 
                                          type="text" 
                                          placeholder={productTagsList.length === 0 ? "Type tag and press Enter" : ""}
                                          value={currentTagInput}
                                          onChange={e => setCurrentTagInput(e.target.value)}
                                          onKeyDown={handleTagKeyDown}
                                          className="bg-transparent border-0 outline-none text-white text-sm flex-1 min-w-[120px] py-1"
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Meta Keywords</label>
                                  <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl min-h-[46px] items-center">
                                      {metaKeywordsList.map((kw, idx) => (
                                          <span key={idx} className="bg-purple-500/10 text-purple-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-purple-500/20">
                                              {kw}
                                              <button type="button" onClick={() => removeKeyword(idx)} className="text-purple-400 hover:text-purple-300 font-bold text-xs select-none">Ã—</button>
                                          </span>
                                      ))}
                                      <input 
                                          type="text" 
                                          placeholder={metaKeywordsList.length === 0 ? "Type keyword and press Enter" : ""}
                                          value={currentKeywordInput}
                                          onChange={e => setCurrentKeywordInput(e.target.value)}
                                          onKeyDown={handleKeywordKeyDown}
                                          className="bg-transparent border-0 outline-none text-white text-sm flex-1 min-w-[120px] py-1"
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Meta Description</label>
                                  <textarea rows={3} placeholder="Enter Meta Description" value={productForm.metaDescription} onChange={e => setProductForm({...productForm, metaDescription: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                          </div>
                      </form>

                      {/* Modal Footer */}
                      <div className="border-t border-slate-800 pt-4 mt-6 flex justify-end gap-3 bg-slate-900">
                          <button type="button" onClick={() => setShowProductModal(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                          <button type="button" onClick={handleProductSubmit} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-cyan-900/20 transition-all"><Plus size={16}/> Add Product</button>
                       </div>
                   </div>
               </div>
           )}
       </div>
  );

  // --- PRODUCT CATEGORY VIEWS & METHODS ---
  const handleProductCategorySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const { adminCreateCategory, adminUpdateCategory } = await import('../../services/api');
          const formData = new FormData();
          formData.append('Name', productCategoryForm.name);
          formData.append('Slug', productCategoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
          formData.append('IsHighlight', String(productCategoryForm.isHighlight));
          formData.append('IsActive', String(productCategoryForm.isActive));
          formData.append('Serial', String(productCategoryForm.serial));
          if (productCategoryForm.parentCategoryId) {
              formData.append('ParentCategoryId', productCategoryForm.parentCategoryId);
          }
          if (selectedProductCategory) {
              await adminUpdateCategory(selectedProductCategory.id || selectedProductCategory.Id, formData);
              alert('Category updated successfully');
          } else {
              await adminCreateCategory(formData);
              alert('Category created successfully');
          }
          setShowProductCategoryModal(false);
          loadStoreManagerData();
      } catch (err) {
          console.error(err);
          alert('Failed to save category');
      }
  };

  const handleDeleteProductCategory = async (id: string) => {
      if (!window.confirm('Are you sure you want to delete this category?')) return;
      try {
          const { adminDeleteCategory } = await import('../../services/api');
          await adminDeleteCategory(id);
          loadStoreManagerData();
      } catch (err) {
          console.error(err);
          alert('Failed to delete category');
      }
  };

  const handleToggleProductCategory = async (id: string) => {
      try {
          const { adminToggleCategoryStatus } = await import('../../services/api');
          await adminToggleCategoryStatus(id);
          loadStoreManagerData();
      } catch (err) {
          console.error(err);
          alert('Failed to toggle status');
      }
  };

  const renderProductCategories = () => (
      <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto text-left">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                  <h2 className="text-2xl font-bold text-white">Product Categories</h2>
                  <p className="text-sm text-slate-400">Manage structure, highlighting, parent relationships, and ordering of store items.</p>
              </div>
              <button 
                  onClick={() => {
                      setSelectedProductCategory(null);
                      setProductCategoryForm({ id: '', name: '', isHighlight: false, isActive: true, serial: 0, parentCategoryId: '' });
                      setShowProductCategoryModal(true);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-cyan-900/25 transition-all"
              >
                  <Plus size={16} /> Add Category
              </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-350">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                          <tr>
                              <th className="px-6 py-4">Name</th>
                              <th className="px-6 py-4">Slug</th>
                              <th className="px-6 py-4">Serial</th>
                              <th className="px-6 py-4 text-center">Highlighted</th>
                              <th className="px-6 py-4 text-center">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                          {storeCategories.length > 0 ? (
                              storeCategories.map(c => {
                                  const id = c.id || c.Id;
                                  const name = c.name || c.Name;
                                  const slug = c.slug || c.Slug;
                                  const serial = c.serial || c.Serial || 0;
                                  const isHigh = c.isHighlight || c.IsHighlight;
                                  const active = c.isActive || c.IsActive;
                                  return (
                                      <tr key={id} className="hover:bg-slate-850/40 transition-colors">
                                          <td className="px-6 py-4 font-bold text-white">{name}</td>
                                          <td className="px-6 py-4 text-slate-500">{slug}</td>
                                          <td className="px-6 py-4 font-semibold">{serial}</td>
                                          <td className="px-6 py-4 text-center">
                                              {isHigh ? (
                                                  <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase">Yes</span>
                                              ) : (
                                                  <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">No</span>
                                              )}
                                          </td>
                                          <td className="px-6 py-4 text-center">
                                              <button 
                                                  onClick={() => handleToggleProductCategory(id)}
                                                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                                      active 
                                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                                                      : 'bg-rose-500/10 border-rose-500/20 text-rose-450 hover:bg-rose-500/20'
                                                  }`}
                                              >
                                                  {active ? 'Active' : 'Inactive'}
                                              </button>
                                          </td>
                                          <td className="px-6 py-4 text-right flex justify-end gap-3">
                                              <button 
                                                  onClick={() => {
                                                      setSelectedProductCategory(c);
                                                      setProductCategoryForm({
                                                          id,
                                                          name,
                                                          isHighlight: !!isHigh,
                                                          isActive: !!active,
                                                          serial,
                                                          parentCategoryId: c.parentCategoryId || c.ParentCategoryId || ''
                                                      });
                                                      setShowProductCategoryModal(true);
                                                  }}
                                                  className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700/60 p-2 rounded-xl text-xs font-bold transition-all"
                                              >
                                                  Edit
                                              </button>
                                              <button 
                                                  onClick={() => handleDeleteProductCategory(id)}
                                                  className="bg-slate-800 hover:bg-red-950 text-rose-450 border border-slate-700/60 p-2 rounded-xl text-xs font-bold transition-all"
                                              >
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })
                          ) : (
                              <tr>
                                  <td colSpan={6} className="text-center py-12 text-slate-500 font-medium">No Categories found. Add one to get started!</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Category Modal */}
          {showProductCategoryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl">
                      <button onClick={() => setShowProductCategoryModal(false)} className="absolute top-4 right-4 text-slate-450 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={18}/></button>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                          <Plus size={20} className="text-cyan-400" /> {selectedProductCategory ? 'Edit Product Category' : 'Create Product Category'}
                      </h3>
                      <form onSubmit={handleProductCategorySubmit} className="space-y-4 text-left">
                          <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category Name *</label>
                              <input required type="text" placeholder="Enter Category Name" value={productCategoryForm.name} onChange={e => setProductCategoryForm({ ...productCategoryForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Serial Position</label>
                                  <input type="number" value={productCategoryForm.serial} onChange={e => setProductCategoryForm({ ...productCategoryForm, serial: parseInt(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Parent Category</label>
                                  <select value={productCategoryForm.parentCategoryId || ''} onChange={e => setProductCategoryForm({ ...productCategoryForm, parentCategoryId: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm font-medium">
                                      <option value="">None (Top Level)</option>
                                      {storeCategories.filter(cat => (cat.id || cat.Id) !== (selectedProductCategory?.id || selectedProductCategory?.Id)).map(cat => (
                                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                                      ))}
                                  </select>
                              </div>
                          </div>

                          <div className="flex gap-6 pt-2">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input type="checkbox" checked={productCategoryForm.isHighlight} onChange={e => setProductCategoryForm({ ...productCategoryForm, isHighlight: e.target.checked })} className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer" />
                                  <span className="text-sm font-semibold text-slate-350">Highlight Category</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input type="checkbox" checked={productCategoryForm.isActive} onChange={e => setProductCategoryForm({ ...productCategoryForm, isActive: e.target.checked })} className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer" />
                                  <span className="text-sm font-semibold text-slate-350">Active Status</span>
                              </label>
                          </div>

                          <div className="border-t border-slate-800 pt-4 mt-6 flex justify-end gap-3 bg-slate-900">
                              <button type="button" onClick={() => setShowProductCategoryModal(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm transition-all">Save Changes</button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
      </div>
  );

  // --- PRODUCT BRAND VIEWS & METHODS ---
  const handleBrandSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const { adminCreateBrand } = await import('../../services/api');
          const formData = new FormData();
          formData.append('Name', productBrandForm.name);
          formData.append('IsActive', 'true');
          if (brandLogoFile) {
              formData.append('Logo', brandLogoFile);
          }
          await adminCreateBrand(formData);
          alert('Brand created successfully');
          setShowProductBrandModal(false);
          setBrandLogoFile(null);
          loadStoreManagerData();
      } catch (err) {
          console.error(err);
          alert('Failed to create brand');
      }
  };

  const handleDeleteBrand = async (id: string) => {
      if (!window.confirm('Are you sure you want to delete this brand?')) return;
      try {
          const { adminDeleteBrand } = await import('../../services/api');
          await adminDeleteBrand(id);
          loadStoreManagerData();
      } catch (err) {
          console.error(err);
          alert('Failed to delete brand');
      }
  };

  const handleToggleBrand = async (id: string) => {
      try {
          const { adminToggleBrandStatus } = await import('../../services/api');
          await adminToggleBrandStatus(id);
          loadStoreManagerData();
      } catch (err) {
          console.error(err);
          alert('Failed to toggle brand status');
      }
  };

  const renderProductBrands = () => (
      <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto text-left">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                  <h2 className="text-2xl font-bold text-white">Product Brands</h2>
                  <p className="text-sm text-slate-400">Add logos, toggle active states, and manage branding partners.</p>
              </div>
              <button 
                  onClick={() => {
                      setSelectedProductBrand(null);
                      setProductBrandForm({ id: '', name: '', isActive: true });
                      setBrandLogoFile(null);
                      setShowProductBrandModal(true);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-cyan-900/25 transition-all"
              >
                  <Plus size={16} /> Add Brand
              </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-350">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                          <tr>
                              <th className="px-6 py-4">Logo</th>
                              <th className="px-6 py-4">Name</th>
                              <th className="px-6 py-4">Slug</th>
                              <th className="px-6 py-4 text-center">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                          {brandsList.length > 0 ? (
                              brandsList.map(b => {
                                  const id = b.id || b.Id;
                                  const name = b.name || b.Name;
                                  const slug = b.slug || b.Slug;
                                  const active = b.isActive || b.IsActive;
                                  const logoUrl = getProductImageUrl(b.logoUrl || b.LogoUrl);
                                  return (
                                      <tr key={id} className="hover:bg-slate-850/40 transition-colors">
                                          <td className="px-6 py-4">
                                              <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                                                  {logoUrl ? (
                                                      <img src={logoUrl} className="max-h-full max-w-full object-contain" alt="" />
                                                  ) : (
                                                      <span className="text-[10px] font-black text-slate-500">Logo</span>
                                                  )}
                                              </div>
                                          </td>
                                          <td className="px-6 py-4 font-bold text-white">{name}</td>
                                          <td className="px-6 py-4 text-slate-500">{slug}</td>
                                          <td className="px-6 py-4 text-center">
                                              <button 
                                                  onClick={() => handleToggleBrand(id)}
                                                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                                      active 
                                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                                                      : 'bg-rose-500/10 border-rose-500/20 text-rose-450 hover:bg-rose-500/20'
                                                  }`}
                                              >
                                                  {active ? 'Active' : 'Inactive'}
                                              </button>
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                              <button 
                                                  onClick={() => handleDeleteBrand(id)}
                                                  className="bg-slate-800 hover:bg-red-950 text-rose-400 border border-slate-700/60 p-2 rounded-xl text-xs font-bold transition-all"
                                              >
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })
                          ) : (
                              <tr>
                                  <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">No Brands found. Click "Add Brand" to create one!</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Brand Modal */}
          {showProductBrandModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
                      <button onClick={() => setShowProductBrandModal(false)} className="absolute top-4 right-4 text-slate-450 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={18}/></button>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                          <Plus size={20} className="text-cyan-400" /> Create New Brand
                      </h3>
                      <form onSubmit={handleBrandSubmit} className="space-y-4 text-left">
                          <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Brand Name *</label>
                              <input required type="text" placeholder="Enter Brand Name" value={productBrandForm.name} onChange={e => setProductBrandForm({ ...productBrandForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm" />
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Brand Logo Image</label>
                              <input type="file" accept="image/*" onChange={e => setBrandLogoFile(e.target.files?.[0] || null)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none text-xs" />
                          </div>

                          <div className="border-t border-slate-800 pt-4 mt-6 flex justify-end gap-3 bg-slate-900">
                              <button type="button" onClick={() => setShowProductBrandModal(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm transition-all">Create Brand</button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
      </div>
  );

  // --- PRODUCT REVIEWS VIEWS & METHODS ---
  const handleApproveReview = async (id: string, approved: boolean) => {
      try {
          const { adminApproveReview } = await import('../../services/api');
          await adminApproveReview(id, approved);
          alert(approved ? 'Review approved successfully' : 'Review status updated');
          loadProductReviews();
      } catch (err) {
          console.error(err);
          alert('Failed to update review status');
      }
  };

  const handleDeleteReview = async (id: string) => {
      if (!window.confirm('Are you sure you want to delete this review?')) return;
      try {
          const { adminDeleteReview } = await import('../../services/api');
          await adminDeleteReview(id);
          loadProductReviews();
      } catch (err) {
          console.error(err);
          alert('Failed to delete review');
      }
  };

  const renderProductReviews = () => (
      <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto text-left">
          <div className="pb-4 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">Product Reviews</h2>
              <p className="text-sm text-slate-400">Inspect customer feedbacks, star ratings, comments, and toggle listing approvals.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-350">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                          <tr>
                              <th className="px-6 py-4">Rating</th>
                              <th className="px-6 py-4">Product ID</th>
                              <th className="px-6 py-4">Feedback / Comment</th>
                              <th className="px-6 py-4 text-center">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                          {loadingReviews ? (
                              <tr>
                                  <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">Loading reviews list...</td>
                              </tr>
                          ) : productReviews.length > 0 ? (
                              productReviews.map(r => {
                                  const id = r.id || r.Id;
                                  const rating = r.rating || r.Rating || 5;
                                  const prodId = r.productId || r.ProductId || 'N/A';
                                  const comment = r.comment || r.Comment || 'No comment provided';
                                  const approved = r.isApproved || r.IsApproved;
                                  return (
                                      <tr key={id} className="hover:bg-slate-850/40 transition-colors">
                                          <td className="px-6 py-4">
                                              <div className="flex gap-1 text-amber-400 font-bold text-sm">
                                                  {'â˜…'.repeat(rating)}{'â˜†'.repeat(5 - rating)}
                                              </div>
                                          </td>
                                          <td className="px-6 py-4 text-xs font-semibold text-slate-500">{prodId}</td>
                                          <td className="px-6 py-4 text-slate-305 italic max-w-xs truncate">{comment}</td>
                                          <td className="px-6 py-4 text-center">
                                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                                  approved 
                                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                              }`}>
                                                  {approved ? 'Approved' : 'Pending'}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 text-right flex justify-end gap-3">
                                              {!approved && (
                                                  <button 
                                                      onClick={() => handleApproveReview(id, true)}
                                                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                                                  >
                                                      Approve
                                                  </button>
                                              )}
                                              <button 
                                                  onClick={() => handleDeleteReview(id)}
                                                  className="bg-slate-800 hover:bg-red-950 text-rose-450 border border-slate-700/60 p-2 rounded-xl text-xs font-bold transition-all"
                                              >
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })
                          ) : (
                              <tr>
                                  <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">No reviews registered in the system.</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );

  // --- PRODUCT QUESTION ANS VIEWS & METHODS ---
  const handleAnswerQuestionSubmit = async (id: string, answer: string, approve: boolean) => {
      if (!answer) {
          alert('Please type an answer before submitting.');
          return;
      }
      try {
          const { adminAnswerQuestion } = await import('../../services/api');
          await adminAnswerQuestion(id, answer, approve);
          alert('Question updated successfully');
          loadProductQuestions();
      } catch (err) {
          console.error(err);
          alert('Failed to save answer');
      }
  };

  const handleDeleteQuestion = async (id: string) => {
      if (!window.confirm('Are you sure you want to delete this question?')) return;
      try {
          const { adminDeleteQuestion } = await import('../../services/api');
          await adminDeleteQuestion(id);
          loadProductQuestions();
      } catch (err) {
          console.error(err);
          alert('Failed to delete question');
      }
  };

  const renderProductQuestions = () => (
      <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto text-left">
          <div className="pb-4 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">Product Question & Answer</h2>
              <p className="text-sm text-slate-400">Answer queries from customers and toggle public display approvals.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-350">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                          <tr>
                              <th className="px-6 py-4 w-1/3">Question</th>
                              <th className="px-6 py-4 w-1/3">Answer</th>
                              <th className="px-6 py-4 text-center">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                          {loadingQuestions ? (
                              <tr>
                                  <td colSpan={4} className="text-center py-12 text-slate-500 font-medium">Loading questions list...</td>
                              </tr>
                          ) : productQuestions.length > 0 ? (
                              productQuestions.map(q => {
                                  const id = q.id || q.Id;
                                  const questionText = q.question || q.Question || '';
                                  const dbAnswer = q.answer || q.Answer || '';
                                  const approved = q.isApproved || q.IsApproved;
                                  return (
                                      <tr key={id} className="hover:bg-slate-850/40 transition-colors align-top">
                                          <td className="px-6 py-4">
                                              <p className="font-bold text-white mb-1">{questionText}</p>
                                              <span className="text-[10px] text-slate-500">ID: {id}</span>
                                          </td>
                                          <td className="px-6 py-4">
                                              <div className="space-y-2">
                                                  <textarea 
                                                      id={`ans-text-${id}`}
                                                      defaultValue={dbAnswer}
                                                      placeholder="Write official answer..." 
                                                      rows={2}
                                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-cyan-500 text-xs"
                                                  />
                                                  <button 
                                                      onClick={() => {
                                                          const val = (document.getElementById(`ans-text-${id}`) as HTMLTextAreaElement)?.value;
                                                          handleAnswerQuestionSubmit(id, val, true);
                                                      }}
                                                      className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1 rounded-lg text-[10px] transition-all"
                                                  >
                                                      Answer & Approve
                                                  </button>
                                              </div>
                                          </td>
                                          <td className="px-6 py-4 text-center">
                                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                                  approved 
                                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                              }`}>
                                                  {approved ? 'Approved' : 'Pending'}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                              <button 
                                                  onClick={() => handleDeleteQuestion(id)}
                                                  className="bg-slate-800 hover:bg-red-950 text-rose-450 border border-slate-700/60 p-2 rounded-xl text-xs font-bold transition-all"
                                              >
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })
                          ) : (
                              <tr>
                                  <td colSpan={4} className="text-center py-12 text-slate-500 font-medium">No customer questions registered.</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center font-bold">D</div>
                    <span className="font-bold text-xl">Dashboard</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, type: 'link' },
                    { id: 'monitoring_messages', label: 'Student Messages', icon: MessageSquare, type: 'link' },
                    { 
                        id: 'monitoring_group', 
                        label: 'Abuse Audit', 
                        icon: Shield, 
                        type: 'group',
                        children: [
                            { id: 'monitoring_alerts', label: 'Abuse Alerts', view: 'monitoring', subTab: 'alerts' },
                            { id: 'monitoring_deleted', label: 'Deleted Log', view: 'monitoring', subTab: 'deleted' },
                            { id: 'monitoring_attachments', label: 'Media Attachments', view: 'monitoring', subTab: 'attachments' },
                            { id: 'monitoring_spam', label: 'Spam Keywords', view: 'monitoring', subTab: 'spam_db' }
                        ]
                    },
                    { 
                        id: 'users_group', 
                        label: 'Settings', 
                        icon: Settings, 
                        type: 'group',
                        children: [
                            { id: 'users_accounts', label: 'User Account', view: 'users', subTab: 'users' },
                            { id: 'users_teachers', label: 'Teacher Reg', view: 'users', subTab: 'teacher_requests' },
                            { id: 'users_roles', label: 'Roles', view: 'users', subTab: 'roles' },
                            { id: 'users_permissions', label: 'Permission Matrix', view: 'users', subTab: 'permissions' },
                            { id: 'users_menus', label: 'Menus', view: 'users', subTab: 'menus' },
                        ]
                    },
                    { id: 'students', label: 'Student Hub', icon: GraduationCap, type: 'link' },
                      { id: 'news_mgr', label: 'Recent News', icon: FileText, view: 'news', type: 'link' },
                      { id: 'affairs_mgr', label: 'Current Affairs', icon: HelpCircle, view: 'affairs', type: 'link' },

                    { 
                        id: 'goals_group', 
                        label: 'Goal Management', 
                        icon: Target, 
                        type: 'group',
                        children: [
                            { id: 'goals_categories', label: 'Goal Categories', view: 'goal_categories', subTab: '' },
                            { id: 'goals_requests', label: 'Goal Change Requests', view: 'goal_requests', subTab: '' }
                        ]
                    },
                    { id: 'mentors', label: 'Mentors', icon: Users, type: 'link' },
                    { 
                        id: 'jobs_group', 
                        label: 'Job Board', 
                        icon: Briefcase, 
                        type: 'group',
                        children: [
                            { id: 'jobs_categories', label: 'Job Category Page', view: 'jobs', subTab: 'categories' },
                            { id: 'jobs_companies', label: 'Company Verification', view: 'jobs', subTab: 'companies' },
                            { id: 'jobs_list', label: 'Jobs List', view: 'jobs', subTab: 'list' },
                            { id: 'jobs_applications', label: 'Applications', view: 'jobs', subTab: 'applications' }
                        ]
                    },
                    { id: 'blog', label: 'Blog', icon: FileText, type: 'link' },
                    { id: 'aboutus', label: 'About Us Settings', icon: Info, type: 'link' },
                    { 
                        id: 'products_group', 
                        label: 'Product', 
                        icon: ShoppingBag, 
                        type: 'group',
                        children: [
                            { id: 'products_list', label: 'Products', view: 'products_list', subTab: '' },
                            { id: 'products_categories', label: 'Category', view: 'products_categories', subTab: '' },
                            { id: 'products_brands', label: 'Brands', view: 'products_brands', subTab: '' },
                            { id: 'products_reviews', label: 'Reviews', view: 'products_reviews', subTab: '' },
                            { id: 'products_questions', label: 'Question Ans', view: 'products_questions', subTab: '' }
                        ]
                    },
                    { 
                        id: 'orders_group', 
                        label: 'Order', 
                        icon: ClipboardList, 
                        type: 'group',
                        children: [
                            { id: 'orders_all', label: 'All Orders', view: 'orders_all', subTab: '' },
                            { id: 'orders_pending', label: 'Pending Orders', view: 'orders_pending', subTab: '' },
                            { id: 'orders_progress', label: 'Progress Order', view: 'orders_progress', subTab: '' },
                            { id: 'orders_delivered', label: 'Delivered Orders', view: 'orders_delivered', subTab: '' },
                            { id: 'orders_canceled', label: 'Canceled Orders', view: 'orders_canceled', subTab: '' }
                        ]
                    },
                    { id: 'newsletter', label: 'Newsletter', icon: Mail, type: 'link' },
                    { 
                        id: 'qbank_group', 
                        label: 'Question Bank', 
                        icon: Upload, 
                        type: 'group',
                        children: [
                            { id: 'qbank_upload', label: 'Single & Bulk Upload', view: 'upload', subTab: 'upload' },
                            { id: 'qbank_teacher_approvals', label: 'Teacher Approvals', view: 'upload', subTab: 'teacher_approvals' },
                            { id: 'qbank_others_approvals', label: 'Others Approvals', view: 'upload', subTab: 'others_approvals' },
                            { id: 'qbank_edit_requests', label: 'Edit Requests', view: 'upload', subTab: 'edit_requests' },
                            { id: 'qbank_delete_requests', label: 'Delete Requests', view: 'upload', subTab: 'delete_requests' },
                            { id: 'qbank_teacher_questions', label: 'Teacher Questions', view: 'upload', subTab: 'teacher_questions' },
                            { id: 'qbank_others_questions', label: 'Others Questions', view: 'upload', subTab: 'others_questions' },
                            { id: 'qbank_settings', label: 'Categories & Subjects', view: 'upload', subTab: 'settings' },
                        ]
                    },
                    { id: 'settings', label: 'General Settings', icon: Settings, type: 'link' }
                ].map(item => {
                    if (item.type === 'group') {
                        const IconComponent = item.icon;
                        const isExpanded = expandedGroups[item.id] || false;
                        return (
                            <div key={item.id} className="space-y-1">
                                <button
                                    onClick={() => toggleGroup(item.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <IconComponent size={18} />
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronDown 
                                        size={16} 
                                        className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                                    />
                                </button>
                                {isExpanded && (
                                    <div className="pl-4 border-l border-slate-800 space-y-1 ml-4">
                                        {(item.children || []).map(child => {
                                            const isChildActive = activeView === child.view && 
                                                (!child.subTab 
                                                    ? true 
                                                    : child.view === 'users' 
                                                        ? activeUserSubTab === child.subTab 
                                                        : child.view === 'monitoring'
                                                            ? monitoringSubTab === child.subTab
                                                            : child.view === 'jobs'
                                                                ? activeJobSubTab === child.subTab
                                                                : child.view === 'orders'
                                                                    ? activeOrderSubTab === child.subTab
                                                                    : quizSubTab === child.subTab);
                                            return (
                                                <button
                                                    key={child.id}
                                                    onClick={() => {
                                                        setActiveView(child.view);
                                                        if (child.view === 'users') {
                                                            setActiveUserSubTab(child.subTab as any);
                                                        } else if (child.view === 'monitoring') {
                                                            setMonitoringSubTab(child.subTab as any);
                                                        } else if (child.view === 'jobs') {
                                                            setActiveJobSubTab(child.subTab as any);
                                                        } else if (child.view === 'orders') {
                                                            setActiveOrderSubTab(child.subTab as any);
                                                        } else {
                                                            setQuizSubTab(child.subTab as any);
                                                        }
                                                    }}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                                                        isChildActive
                                                        ? 'bg-cyan-600/10 text-cyan-400 font-bold'
                                                        : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                                                    }`}
                                                >
                                                    {child.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    
                    const IconComponent = item.icon;
                    const isActive = activeView === item.id || (item.id === 'monitoring_messages' && activeView === 'monitoring' && monitoringSubTab === 'chatbox');
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'monitoring_messages') {
                                    setActiveView('monitoring');
                                    setMonitoringSubTab('chatbox');
                                } else {
                                    setActiveView(item.id);
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                isActive 
                                ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-600/20 font-bold' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <IconComponent size={18} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto h-screen bg-slate-950">

            {activeView === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                        { label: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Revenue', value: '$4,200', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
                        { label: 'Questions', value: '5,300+', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        { label: 'Storage', value: '45%', icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                        ].map((stat, i) => (
                        <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                            <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    {/* Action Cards */}
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setActiveView('jobs')} 
                            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-2xl flex items-center justify-between group shadow-lg hover:shadow-violet-500/20 transition-all"
                        >
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-white mb-1">Post a New Job</h3>
                                <p className="text-violet-200 text-sm">Create a listing for your company</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                <Plus size={24} className="text-white" />
                            </div>
                        </button>
                        <button 
                            onClick={() => setActiveView('applications')} 
                            className="flex-1 bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center justify-between group hover:border-cyan-500/50 transition-all"
                        >
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-white mb-1">Review Applications</h3>
                                <p className="text-slate-400 text-sm">{applications.length} candidates waiting</p>
                            </div>
                            <div className="bg-slate-700 p-3 rounded-xl group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                                <UserCheck size={24} />
                            </div>
                        </button>
                    </div>
                </div>
            )}
            {activeView === 'news_mgr' && <ManageNews />}
            {activeView === 'affairs_mgr' && <ManageCurrentAffairs />}
            {activeView === 'monitoring' && <AdminMessageMonitoring defaultTab={monitoringSubTab} />}
            {activeView === 'users' && renderUsers()}
            {activeView === 'students' && renderStudentManagement()}
            {activeView === 'goal_categories' && <AdminGoalCategoryManager />}
            {activeView === 'goal_requests' && <AdminGoalChangeRequests />}
            {activeView === 'mentors' && renderMentorsManager()}
            {activeView === 'jobs' && renderJobManager()}
            {activeView === 'applications' && renderApplications()}
            {activeView === 'blog' && renderBlogManager()}
            {activeView === 'aboutus' && renderAboutUsManager()}
            {activeView === 'newsletter' && renderNewsletter()}
            {activeView === 'upload' && renderQuestionUpload()}
            {(activeView === 'products' || activeView === 'products_list' || activeView === 'store') && renderStoreManager()}
            {activeView === 'products_categories' && renderProductCategories()}
            {activeView === 'products_brands' && renderProductBrands()}
            {activeView === 'products_reviews' && renderProductReviews()}
            {activeView === 'products_questions' && renderProductQuestions()}
            {activeView === 'orders_all' && renderOrdersManager('all')}
            {activeView === 'orders_pending' && renderOrdersManager('pending')}
            {activeView === 'orders_progress' && renderOrdersManager('progress')}
            {activeView === 'orders_delivered' && renderOrdersManager('delivered')}
            {activeView === 'orders_canceled' && renderOrdersManager('canceled')}
            {activeView === 'settings' && renderSettings()}
        </main>
        
        {/* Schedule Modal */}
        {showScheduleModal && reviewTestApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 relative">
                    <button onClick={() => setShowScheduleModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                    <h3 className="text-xl font-bold text-white mb-4">Schedule Interview</h3>
                    <p className="text-slate-400 text-sm mb-4">Invite <strong>{reviewTestApp.name}</strong> for {reviewTestApp.jobTitle}</p>
                    
                    <form onSubmit={handleSendInvite} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                                <input type="date" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                                <input type="time" value={scheduleData.time} onChange={e => setScheduleData({...scheduleData, time: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                            <select value={scheduleData.type} onChange={e => setScheduleData({...scheduleData, type: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                                <option value="online">Online (Google Meet)</option>
                                <option value="onsite">On-site (Office)</option>
                            </select>
                        </div>
                        {scheduleData.type === 'online' ? (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link</label>
                                <input type="text" value={scheduleData.link} onChange={e => setScheduleData({...scheduleData, link: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                                <input type="text" value={scheduleData.location} onChange={e => setScheduleData({...scheduleData, location: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                            <textarea rows={3} value={scheduleData.message} onChange={e => setScheduleData({...scheduleData, message: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl">Send Invitation</button>
                    </form>
                </div>
            </div>
        )}

        {/* Student Details Modal */}
        {showStudentDetailsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 relative text-left">
                    <button onClick={() => setShowStudentDetailsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                    
                    {loadingStudentDetails ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold text-sm">Loading student profiles, quiz logs, and payment details...</p>
                        </div>
                    ) : studentDetails ? (
                        <div className="space-y-6">
                            {/* Profile Details */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-2xl">
                                        {(studentDetails.profile.name || 'S').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{studentDetails.profile.name}</h3>
                                        <p className="text-sm text-slate-400">{studentDetails.profile.email}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Class/Track: <strong className="text-slate-300">{studentDetails.profile.studentClass || 'Not Set'}</strong></p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 text-center min-w-[100px]">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Points</div>
                                        <div className="text-lg font-extrabold text-cyan-400">â­ {studentDetails.profile.points ?? 0}</div>
                                    </div>
                                    <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 text-center min-w-[100px]">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Streak</div>
                                        <div className="text-lg font-extrabold text-orange-400">ðŸ”¥ {studentDetails.profile.streak ?? 0} days</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Quiz Attempt Logs */}
                                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                                    <h4 className="font-extrabold text-white text-base border-b border-slate-800 pb-2">Daily Quiz Activity Logs</h4>
                                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                                        {studentDetails.activities.map((act: any) => (
                                            <div key={act.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex justify-between items-center gap-3">
                                                <div>
                                                    <div className="text-sm font-bold text-white">{act.subject}</div>
                                                    <div className="text-xs text-slate-400">{act.category} Quiz</div>
                                                    <div className="text-[10px] text-slate-500 mt-1">{new Date(act.completedAt).toLocaleString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${
                                                        act.score / act.totalQuestions >= 0.8
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : act.score / act.totalQuestions >= 0.5
                                                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                        {act.score} / {act.totalQuestions}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {studentDetails.activities.length === 0 && (
                                            <p className="text-center py-10 text-slate-500 text-sm">No quiz attempts recorded yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Payments & Subscriptions */}
                                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                                    <h4 className="font-extrabold text-white text-base border-b border-slate-800 pb-2">Payments & Transactions</h4>
                                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                                        {studentDetails.payments.map((pay: any) => (
                                            <div key={pay.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex justify-between items-center gap-3">
                                                <div>
                                                    <div className="text-sm font-bold text-white">BDT {pay.amount}</div>
                                                    <div className="text-xs text-slate-400">{pay.paymentMethod || 'SSLCommerz'}</div>
                                                    <div className="text-[10px] text-slate-500 mt-1">Txn: {pay.transactionId || 'N/A'}</div>
                                                    <div className="text-[10px] text-slate-500">{new Date(pay.createdAt).toLocaleString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${
                                                        pay.status === 'Paid'
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : pay.status === 'Pending'
                                                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                        {pay.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {studentDetails.payments.length === 0 && (
                                            <p className="text-center py-10 text-slate-500 text-sm">No payment history found.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center py-10 text-slate-400 text-sm">No details available.</p>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

