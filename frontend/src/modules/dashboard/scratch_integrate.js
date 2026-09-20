const fs = require('fs');

const dashPath = 'e:/Source/takeuup/takeuupfront/trunk/src/modules/dashboard/components/TakeUUpStudentDashboard.tsx';
const portalPath = 'e:/Source/takeuup/takeuupfront/trunk/src/modules/dashboard/StudentPortal.tsx';
const appPath = 'e:/Source/takeuup/takeuupfront/trunk/src/App.tsx';

// 1. Update TakeUUpStudentDashboard.tsx
let dashContent = fs.readFileSync(dashPath, 'utf8');

// Imports
if (!dashContent.includes('StudentMessagesChat')) {
  dashContent = dashContent.replace(
    `import { TakeUUpAccountDrawer } from './TakeUUpAccountDrawer';`,
    `import { TakeUUpAccountDrawer } from './TakeUUpAccountDrawer';\nimport { StudentMessagesChat } from './StudentMessagesChat';\nimport { StudentStudyGroups } from './StudentStudyGroups';\nimport { StudentAdmissionPredictor } from './StudentAdmissionPredictor';`
  );
}

if (!dashContent.includes('MessageSquare,')) {
  dashContent = dashContent.replace(
    `import {`,
    `import {\n  MessageSquare, Calculator,`
  );
}

// MENU_ITEMS
const oldMenuItems = `  const MENU_ITEMS = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড (Dashboard)', icon: LayoutGrid },
    { id: 'qbank', label: 'প্রশ্নব্যাংক (Question Bank)', icon: FileText },
    { id: 'courses', label: 'স্মার্ট লেসনস (Lessons)', icon: BookOpen },
    { id: 'quizzes', label: 'মক এক্সাম (Quizzes)', icon: Zap },
    { id: 'mistakes', label: 'হিস্ট্রি ও বুকমার্কস', icon: Bookmark },
    { id: 'mega-quiz', label: 'Friday Mega Quiz', icon: Trophy, highlight: true },
    { id: 'leaderboard', label: 'লিডারবোর্ড (Leaderboard)', icon: Crown },
    { id: 'certificates', label: 'সার্টিফিকেট ও ব্যাজ', icon: Award },
    { id: 'routine', label: 'স্টাডি রুটিন ও প্ল্যানার', icon: Calendar }
  ];`;

const newMenuItems = `  const MENU_ITEMS = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড (Dashboard)', icon: LayoutGrid },
    { id: 'qbank', label: 'প্রশ্নব্যাংক (Question Bank)', icon: FileText },
    { id: 'courses', label: 'স্মার্ট লেসনস (Lessons)', icon: BookOpen },
    { id: 'quizzes', label: 'মক এক্সাম (Quizzes)', icon: Zap },
    { id: 'messages', label: 'মেসেজ ও ডাউট চ্যাট', icon: MessageSquare },
    { id: 'study-groups', label: 'স্টাডি গ্রুপ ও লার্নিং ক্লাব', icon: Users },
    { id: 'admission-predictor', label: 'এডমিশন প্রেডিক্টর ও ক্যালকুলেটর', icon: Calculator },
    { id: 'mistakes', label: 'হিস্ট্রি ও বুকমার্কস', icon: Bookmark },
    { id: 'mega-quiz', label: 'Friday Mega Quiz', icon: Trophy, highlight: true },
    { id: 'leaderboard', label: 'লিডারবোর্ড (Leaderboard)', icon: Crown },
    { id: 'certificates', label: 'সার্টিফিকেট ও ব্যাজ', icon: Award },
    { id: 'routine', label: 'স্টাডি রুটিন ও প্ল্যানার', icon: Calendar }
  ];`;

dashContent = dashContent.replace(oldMenuItems, newMenuItems);

// Render Tab Contents
const oldRoutineTabRender = `{/* TAB 9: ROUTINE PLANNER */}
        {currentTab === 'routine' && (
          <div className="animate-in fade-in duration-300">
            <StudyRoutinePlanner 
              routineTasks={routineTasks}
              onToggleTask={onToggleTask}
              onAddTask={onAddTask}
            />
          </div>
        )}`;

const newTabsRender = `{/* TAB: MESSAGES & DOUBT CHAT */}
        {currentTab === 'messages' && (
          <div className="animate-in fade-in duration-300">
            <StudentMessagesChat user={user} />
          </div>
        )}

        {/* TAB: STUDY GROUPS & LEARNING CLUBS */}
        {currentTab === 'study-groups' && (
          <div className="animate-in fade-in duration-300">
            <StudentStudyGroups user={user} />
          </div>
        )}

        {/* TAB: ADMISSION PREDICTOR & CALCULATOR */}
        {currentTab === 'admission-predictor' && (
          <div className="animate-in fade-in duration-300">
            <StudentAdmissionPredictor user={user} />
          </div>
        )}

        {/* TAB 9: ROUTINE PLANNER */}
        {currentTab === 'routine' && (
          <div className="animate-in fade-in duration-300">
            <StudyRoutinePlanner 
              routineTasks={routineTasks}
              onToggleTask={onToggleTask}
              onAddTask={onAddTask}
            />
          </div>
        )}`;

dashContent = dashContent.replace(oldRoutineTabRender, newTabsRender);
fs.writeFileSync(dashPath, dashContent, 'utf8');
console.log('TakeUUpStudentDashboard.tsx updated with new tabs!');

// 2. Update StudentPortal.tsx
let portalContent = fs.readFileSync(portalPath, 'utf8');

const oldRouteMap = `        const routeMap: Record<string, string> = {
          'overview': '/dashboard',
          'dashboard': '/dashboard',
          'qbank': '/question-bank',
          'courses': '/smart-lessons',
          'quizzes': '/quizzes',
          'mistakes': '/mistakes',
          'mega-quiz': '/mega-quiz',
          'leaderboard': '/leaderboard',
          'certificates': '/certificates',
          'routine': '/routine',
          'profile': '/profile'
        };`;

const newRouteMap = `        const routeMap: Record<string, string> = {
          'overview': '/dashboard',
          'dashboard': '/dashboard',
          'qbank': '/question-bank',
          'courses': '/smart-lessons',
          'quizzes': '/quizzes',
          'messages': '/messages',
          'study-groups': '/study-groups',
          'admission-predictor': '/admission-predictor',
          'mistakes': '/mistakes',
          'mega-quiz': '/mega-quiz',
          'leaderboard': '/leaderboard',
          'certificates': '/certificates',
          'routine': '/routine',
          'profile': '/profile'
        };`;

portalContent = portalContent.replace(oldRouteMap, newRouteMap);

// Also update getTabFromUrl in StudentPortal.tsx
if (!portalContent.includes("hash.includes('/messages')")) {
  portalContent = portalContent.replace(
    `if (hash.includes('/quizzes') || hash.includes('/quiz')) return 'quizzes';`,
    `if (hash.includes('/quizzes') || hash.includes('/quiz')) return 'quizzes';\n    if (hash.includes('/messages')) return 'messages';\n    if (hash.includes('/study-groups')) return 'study-groups';\n    if (hash.includes('/admission-predictor')) return 'admission-predictor';`
  );
}

fs.writeFileSync(portalPath, portalContent, 'utf8');
console.log('StudentPortal.tsx routeMap updated!');

// 3. Update App.tsx
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('path="/messages"')) {
  appContent = appContent.replace(
    `<Route path="/quizzes" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />`,
    `<Route path="/quizzes" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />\n              <Route path="/messages" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />\n              <Route path="/study-groups" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />\n              <Route path="/admission-predictor" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />`
  );
  fs.writeFileSync(appPath, appContent, 'utf8');
  console.log('App.tsx routes updated!');
}
