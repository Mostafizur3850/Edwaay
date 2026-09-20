import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { StudentPortal } from './StudentPortal';

export const Dashboard = ({ isDemoView = false }: { isDemoView?: boolean }) => {
  const [user, setUser] = useState(() => {
    const isDemo = isDemoView || window.location.hash.includes('/demo') || window.location.pathname.includes('/demo');
    if (isDemo) {
      return {
        name: "Gazi Salahuddin",
        displayName: "Gazi Salahuddin",
        streak: 45,
        points: 23400,
        dailyGoalCurrent: 3,
        dailyGoalTotal: 5,
        rank: 12,
        studentClass: "BCS",
        institution: "Dhaka University",
        targetGoal: "46th BCS Administration Cadre",
        bio: "Dedicated BCS aspirant & web technology enthusiast.",
        role: 'student',
        plan: 'premium',
        selectedSubjects: ['Bangladesh Affairs', 'International Affairs', 'English Language', 'Bangla Literature', 'Mathematical Reasoning', 'Mental Ability', 'General Science', 'ICT']
      };
    }
    const storedUser = localStorage.getItem('takeuup_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return {
          name: parsed.name || parsed.displayName || "Student",
          displayName: parsed.displayName || parsed.name || "Student",
          streak: parsed.streak || 0,
          points: parsed.points || 0,
          studentClass: parsed.activeGoalName || parsed.studentClass || "HSC & Admission",
          activeGoalName: parsed.activeGoalName || parsed.studentClass || "HSC & Admission",
          institution: parsed.institution || "",
          targetGoal: parsed.targetGoal || "",
          bio: parsed.bio || "",
          role: parsed.role || 'student',
          plan: parsed.plan || 'free',
          selectedSubjects: parsed.selectedSubjects || []
        };
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: "Student",
      displayName: "Student",
      streak: 5,
      points: 1200,
      studentClass: "HSC & Varsity Admission",
      activeGoalName: "HSC & Varsity Admission",
      institution: "Notre Dame College",
      targetGoal: "BUET CSE & GPA 5.00",
      bio: "Passionate science student aiming for top engineering & varsity admission.",
      role: 'student',
      plan: 'free',
      selectedSubjects: []
    };
  });

  const storedUserRaw = localStorage.getItem('takeuup_user');
  if (storedUserRaw && !isDemoView && !window.location.hash.includes('/demo')) {
    try {
      const parsed = JSON.parse(storedUserRaw);
      const roleLower = (parsed.role || '').toLowerCase();
      const emailLower = (parsed.email || '').toLowerCase();
      const nameLower = (parsed.name || parsed.userName || '').toLowerCase();
      if (roleLower === 'admin' || roleLower === 'localadmin' || emailLower === 'admin@objectcanvas.com' || nameLower === 'mostafizur') {
        return <Navigate to="/admin" replace />;
      }
      if (roleLower === 'employer') {
        return <Navigate to="/employer-dashboard" replace />;
      }
      if (roleLower === 'teacher') {
        return <Navigate to="/teacher/workspace" replace />;
      }
    } catch (e) { }
  }

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const { fetchUserProfile, getCurrentGoal } = await import('../../services/api');

        const stored = localStorage.getItem('takeuup_user');
        let activeUserId = '';
        if (stored) {
          try {
            const u = JSON.parse(stored);
            activeUserId = u.id || u.email;
          } catch (e) { }
        }

        const [profile, goalRes] = await Promise.all([
          fetchUserProfile().catch(() => null),
          activeUserId ? getCurrentGoal(activeUserId).catch(() => null) : Promise.resolve(null)
        ]);

        const latestGoalName = goalRes?.activeGoalName || profile?.activeGoalName || profile?.studentClass;

        setUser((prev: any) => {
          const updated = {
            ...prev,
            name: profile?.name || prev.name,
            displayName: profile?.name || prev.displayName,
            streak: profile?.streak || prev.streak,
            points: profile?.points || prev.points,
            studentClass: latestGoalName || prev.studentClass,
            activeGoalName: latestGoalName || prev.activeGoalName,
            institution: profile?.institution || prev.institution,
            bio: profile?.bio || prev.bio,
            plan: (profile?.isSubscribed || profile?.IsSubscribed) ? 'premium' : prev.plan,
            targetGoalsJson: profile?.targetGoalsJson || (prev as any).targetGoalsJson,
            unlockedGoalsJson: profile?.unlockedGoalsJson || (prev as any).unlockedGoalsJson,
            goalProgressJson: profile?.goalProgressJson || (prev as any).goalProgressJson,
            routineTasksJson: profile?.routineTasksJson || (prev as any).routineTasksJson,
            mistakesJson: profile?.mistakesJson || (prev as any).mistakesJson
          };

          // Sync local storage state
          const local = localStorage.getItem('takeuup_user');
          if (local) {
            try {
              const parsed = JSON.parse(local);
              parsed.plan = updated.plan;
              parsed.name = updated.name;
              parsed.streak = updated.streak;
              parsed.points = updated.points;
              parsed.studentClass = updated.studentClass;
              parsed.activeGoalName = updated.activeGoalName;
              localStorage.setItem('takeuup_user', JSON.stringify(parsed));
            } catch (err) { }
          }
          return updated;
        });
      } catch (e) {
        // API sync fallback
      }
    };

    syncProfile();

    window.addEventListener('storage', syncProfile);
    window.addEventListener('focus', syncProfile);
    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('focus', syncProfile);
    };
  }, []);

  return <StudentPortal user={user} onUpdateUser={setUser} />;
};