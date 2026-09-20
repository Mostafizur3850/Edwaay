export interface User {
  uid: string;
  email: string | null;
  name?: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'admin' | 'employer' | 'teacher';
  plan: 'free' | 'premium' | 'all-in-one' | 'yearly';
  streak: number;
  points: number;
  studentClass?: string;
  selectedSubjects?: string[];
  bio?: string;
  institution?: string;
  targetGoal?: string;
  phone?: string;
  location?: string;
}

export interface ChatAttachment {
  type: 'image' | 'pdf' | 'video';
  url: string;
  name: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId?: string;
  groupId?: string;
  text: string;
  timestamp: string;
  attachment?: ChatAttachment;
  isDeleted?: boolean;
  deletedAt?: string;
  flaggedForReview?: boolean;
  flagReason?: string;
}

export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdBy?: string;
  createdAt?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: { questionId: string; selectedOptionId: string; isCorrect: boolean }[];
  isFinished: boolean;
  timeLeft: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  trend?: 'up' | 'down' | 'same';
  institution?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  readTime: string;
  category: string;
  imageUrl: string;
  content?: string;
  date?: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  rating: number;
  image: string;
  subjects: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

export interface StudyGroupMessage {
  id: string;
  groupId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  content: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf' | 'link';
}

export interface StudyGroup {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  membersCount: number;
  members: { name: string; avatar: string; role: string }[];
  isJoined?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface StudentCertificate {
  id: string;
  title: string;
  courseOrExamName: string;
  issueDate: string;
  scoreOrGrade: string;
  verificationCode: string;
  studentName: string;
  downloadUrl?: string;
}

export interface StudentMistakeItem {
  id: string;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  userAnswerIndex: number;
  explanation: string;
  resolved: boolean;
  dateAdded: string;
}

export interface StudentCourse {
  id: string;
  title: string;
  category: string;
  instructor: string;
  progressPercentage: number;
  totalModules: number;
  completedModules: number;
  thumbnail: string;
  modules: {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'pdf' | 'quiz';
    completed: boolean;
    videoUrl?: string;
  }[];
}