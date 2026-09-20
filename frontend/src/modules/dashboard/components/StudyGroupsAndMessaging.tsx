import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, MessageSquare, Plus, Send, Search, CheckCircle2, Crown, Lock, Sparkles,
  User, Circle, Shield, UserCheck, MessageCircle, ArrowRight, UserPlus, X, Clock,
  Flame, Trophy, Check, UserX, Eye, Filter, AlertCircle, Paperclip, Image as ImageIcon,
  FileText, Video, Trash2
} from 'lucide-react';
import { StudyGroup, StudyGroupMessage } from '../../../types/types';

interface StudyGroupsAndMessagingProps {
  currentUser: any;
}

export interface PeerStudent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  institution: string;
  targetGoal: string;
  bio: string;
  isOnline: boolean;
  lastActive: string;
  streak: number;
  rank: number;
}

export interface PeerConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderGoal: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

const INITIAL_PEER_STUDENTS: PeerStudent[] = [
  {
    id: 'peer-1',
    name: 'Nusrat Jahan',
    avatar: 'https://picsum.photos/id/65/50',
    role: 'Top Contributor',
    institution: 'Holy Cross College',
    targetGoal: 'BUET CSE & HSC GPA 5.00',
    bio: 'Passionate about Higher Math integration & Physics numericals. Let\'s solve BUET questions together!',
    isOnline: true,
    lastActive: 'Online now',
    streak: 24,
    rank: 8
  },
  {
    id: 'peer-2',
    name: 'Tanvir Hossain',
    avatar: 'https://picsum.photos/id/66/50',
    role: 'BCS Aspirant',
    institution: 'Dhaka University',
    targetGoal: '46th BCS Administration Cadre',
    bio: 'Focusing on Bangladesh Affairs, International Affairs and General Knowledge timeline revision.',
    isOnline: true,
    lastActive: 'Online now',
    streak: 18,
    rank: 14
  },
  {
    id: 'peer-3',
    name: 'Dr. Zafar Ahmed',
    avatar: 'https://picsum.photos/id/10/50',
    role: 'Physics Mentor',
    institution: 'BUET (Alumni)',
    targetGoal: 'Senior Lecturer & Research',
    bio: 'Providing 1-on-1 guidance for physics vector calculus, electromagnetism and thermodynamics.',
    isOnline: true,
    lastActive: 'Online now',
    streak: 50,
    rank: 1
  },
  {
    id: 'peer-4',
    name: 'Samiul Islam',
    avatar: 'https://picsum.photos/id/12/50',
    role: 'Medical Aspirant',
    institution: 'Notre Dame College',
    targetGoal: 'Dhaka Medical College (DMC)',
    bio: 'Biology botany & zoology memorization tricks enthusiast. Study partner welcome!',
    isOnline: false,
    lastActive: 'Active 15m ago',
    streak: 9,
    rank: 29
  },
  {
    id: 'peer-5',
    name: 'Rahat Chowdhury',
    avatar: 'https://picsum.photos/id/30/50',
    role: 'Bank Job Candidate',
    institution: 'Jahangirnagar University',
    targetGoal: 'Senior Officer, Bangladesh Bank',
    bio: 'Focusing on analytical puzzle solving & English grammar rules for bank recruitment.',
    isOnline: false,
    lastActive: 'Active 2h ago',
    streak: 12,
    rank: 35
  }
];

const DEFAULT_GROUPS: StudyGroup[] = [
  {
    id: 'grp-1',
    name: 'BCS Preliminary Squad 2026',
    category: 'BCS',
    description: 'Group study room for 46th & 47th BCS exam preparation, general knowledge discussions & daily quizzes.',
    icon: '🇧🇩',
    membersCount: 1420,
    isJoined: true,
    lastMessage: 'Tajuddin Ahmad was appointed PM on April 17, 1971.',
    lastMessageTime: '10:45 AM',
    members: [
      { name: 'Gazi Salahuddin', avatar: 'https://picsum.photos/id/64/50', role: 'Group Leader' },
      { name: 'Nusrat Jahan', avatar: 'https://picsum.photos/id/65/50', role: 'Contributor' },
      { name: 'Tanvir Hossain', avatar: 'https://picsum.photos/id/66/50', role: 'Member' }
    ]
  },
  {
    id: 'grp-2',
    name: 'HSC Physics & Higher Math Circle',
    category: 'HSC',
    description: 'Solve physics numericals, vector calculus problems, and integration techniques together.',
    icon: '⚡',
    membersCount: 890,
    isJoined: true,
    lastMessage: 'Does anyone have the formula sheet for Electromagnetic Induction?',
    lastMessageTime: '11:15 AM',
    members: [
      { name: 'Dr. Zafar', avatar: 'https://picsum.photos/id/10/50', role: 'Teacher Mentor' },
      { name: 'Samiul Islam', avatar: 'https://picsum.photos/id/12/50', role: 'Member' }
    ]
  }
];

const DEFAULT_GROUP_MESSAGES: Record<string, StudyGroupMessage[]> = {
  'grp-1': [
    {
      id: 'm1',
      groupId: 'grp-1',
      senderName: 'Nusrat Jahan',
      senderAvatar: 'https://picsum.photos/id/65/50',
      senderRole: 'Student',
      content: 'Guys, can someone clarify the main difference between 6-point demand and 11-point movement?',
      timestamp: '10:30 AM'
    },
    {
      id: 'm2',
      groupId: 'grp-1',
      senderName: 'Gazi Salahuddin',
      senderAvatar: 'https://picsum.photos/id/64/50',
      senderRole: 'Group Leader',
      content: 'Sure! 6-Point Movement was declared by Bangabandhu in 1966 focusing on autonomy, whereas the 11-Point Movement was initiated by All Party Student Action Committee in 1969.',
      timestamp: '10:35 AM'
    }
  ]
};

const INITIAL_REQUESTS: PeerConnectionRequest[] = [
  {
    id: 'req-1',
    senderId: 'peer-2',
    senderName: 'Tanvir Hossain',
    senderAvatar: 'https://picsum.photos/id/66/50',
    senderGoal: '46th BCS Administration Cadre',
    recipientId: 'user-current',
    status: 'pending',
    timestamp: '10:15 AM'
  }
];

const INITIAL_ACCEPTED_CONNECTIONS = ['peer-1']; // Nusrat Jahan is connected by default

export const StudyGroupsAndMessaging: React.FC<StudyGroupsAndMessagingProps> = ({ currentUser }) => {
  const isFreePlan = currentUser?.plan === 'free';

  // Active Main Sub-Tab
  const [activeTab, setActiveTab] = useState<'groups' | 'direct' | 'search' | 'requests'>('groups');

  // Peer Students & Connections State
  const [peerStudents] = useState<PeerStudent[]>(INITIAL_PEER_STUDENTS);

  // Accepted Connections List
  const [connectedPeerIds, setConnectedPeerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('takeuup_connected_peers');
    return saved ? JSON.parse(saved) : INITIAL_ACCEPTED_CONNECTIONS;
  });

  // Requests State
  const [connectionRequests, setConnectionRequests] = useState<PeerConnectionRequest[]>(() => {
    const saved = localStorage.getItem('takeuup_peer_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Groups & Chat State
  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('takeuup_study_groups');
    return saved ? JSON.parse(saved) : DEFAULT_GROUPS;
  });

  const [activeGroupId, setActiveGroupId] = useState<string>('grp-1');
  const [selectedPeer, setSelectedPeer] = useState<PeerStudent | null>(INITIAL_PEER_STUDENTS[0]);

  // Profile Preview Modal
  const [viewingProfilePeer, setViewingProfilePeer] = useState<PeerStudent | null>(null);

  // Chat Messages
  const [groupMessages, setGroupMessages] = useState<Record<string, StudyGroupMessage[]>>(() => {
    const saved = localStorage.getItem('takeuup_study_messages');
    return saved ? JSON.parse(saved) : DEFAULT_GROUP_MESSAGES;
  });

  const [directMessages, setDirectMessages] = useState<Record<string, StudyGroupMessage[]>>({
    'peer-1': [
      {
        id: 'dm1',
        groupId: 'peer-1',
        senderName: 'Nusrat Jahan',
        senderAvatar: 'https://picsum.photos/id/65/50',
        senderRole: 'Student',
        content: 'Hi! I accepted your study partner request. Let\'s prepare for BUET CSE and HSC math together!',
        timestamp: '10:00 AM'
      }
    ]
  });

  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<{ type: 'image' | 'pdf' | 'video'; url: string; name: string; size?: string } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      let type: 'image' | 'pdf' | 'video' = 'image';
      if (file.type.includes('pdf')) type = 'pdf';
      else if (file.type.includes('video')) type = 'video';

      const url = URL.createObjectURL(file);
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      setPendingAttachment({
        type,
        url,
        name: file.name,
        size: sizeStr
      });
    }
  };

  const handleUnsendMessage = (msgId: string, isDirect: boolean, targetId: string) => {
    if (isDirect) {
      setDirectMessages(prev => {
        const list = prev[targetId] || [];
        const updated = list.map(m => m.id === msgId ? { ...m, isDeleted: true, deletedAt: new Date().toLocaleTimeString() } : m);
        const next = { ...prev, [targetId]: updated };
        localStorage.setItem('takeuup_direct_messages', JSON.stringify(next));
        return next;
      });
    } else {
      setGroupMessages(prev => {
        const list = prev[targetId] || [];
        const updated = list.map(m => m.id === msgId ? { ...m, isDeleted: true, deletedAt: new Date().toLocaleTimeString() } : m);
        const next = { ...prev, [targetId]: updated };
        localStorage.setItem('takeuup_study_messages', JSON.stringify(next));
        return next;
      });
    }
  };

  // New Group State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('HSC');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // FREE PLAN LOCK BANNER
  if (isFreePlan) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8 md:p-12 text-center shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center mx-auto shadow-xl">
          <Lock size={38} />
        </div>

        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-xs font-bold uppercase tracking-wider">
            <Crown size={14} fill="currentColor" /> Pro Member Exclusive
          </div>
          <h2 className="text-3xl font-extrabold text-white">Study Circles, Peer Requests & Messaging</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Search student profiles, send Facebook-style <strong className="text-cyan-400">Study Partner Requests</strong>, see who is <strong className="text-emerald-400">Online Now</strong>, and chat 1-on-1 once accepted!
          </p>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 max-w-lg mx-auto text-left text-xs text-slate-300 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles size={16} className="text-yellow-400" /> Premium Social Study Features:
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Search & Visit student profiles across Bangladesh.
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Facebook-style Message Requests (Accept to unlock 1-on-1 chat).
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Real-time Online Active Status indicator.
          </div>
        </div>

        <div className="pt-2">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-yellow-900/30 transition-transform hover:scale-105 text-sm"
          >
            <Crown size={18} fill="currentColor" /> Upgrade to Pro to Unlock <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // CONNECTION / REQUEST HANDLERS
  const getRequestStatus = (peerId: string) => {
    if (connectedPeerIds.includes(peerId)) return 'connected';
    const sentReq = connectionRequests.find(r => r.recipientId === peerId && r.status === 'pending');
    if (sentReq) return 'sent';
    const receivedReq = connectionRequests.find(r => r.senderId === peerId && r.status === 'pending');
    if (receivedReq) return 'received';
    return 'none';
  };

  const handleSendRequest = (peer: PeerStudent) => {
    const newReq: PeerConnectionRequest = {
      id: `req-${Date.now()}`,
      senderId: 'user-current',
      senderName: currentUser?.name || 'You',
      senderAvatar: currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=random`,
      senderGoal: currentUser?.targetGoal || 'HSC & Admission',
      recipientId: peer.id,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newReq, ...connectionRequests];
    setConnectionRequests(updated);
    localStorage.setItem('takeuup_peer_requests', JSON.stringify(updated));
  };

  const handleAcceptRequest = (reqId: string, senderId: string) => {
    const updatedReqs = connectionRequests.map(r => r.id === reqId ? { ...r, status: 'accepted' as const } : r);
    setConnectionRequests(updatedReqs);
    localStorage.setItem('takeuup_peer_requests', JSON.stringify(updatedReqs));

    const updatedConnections = [...connectedPeerIds, senderId];
    setConnectedPeerIds(updatedConnections);
    localStorage.setItem('takeuup_connected_peers', JSON.stringify(updatedConnections));
  };

  const handleDeclineRequest = (reqId: string) => {
    const updatedReqs = connectionRequests.filter(r => r.id !== reqId);
    setConnectionRequests(updatedReqs);
    localStorage.setItem('takeuup_peer_requests', JSON.stringify(updatedReqs));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() && !pendingAttachment) return;

    // Dynamic Anti-Spam Keyword Enforcement against takeuup_forbidden_keywords
    const savedForbidden = localStorage.getItem('takeuup_forbidden_keywords');
    const forbiddenKeywords: string[] = savedForbidden ? JSON.parse(savedForbidden) : [
      'adult', 'sex', 'bKash', 'Nagad', 'money', 'payment', 'phone', 'whatsapp',
      'telegram', '017', '018', '019', '013', '014', '015', '016', 'cash', 'nude',
      'scam', 'cheat', 'gambling', 'crypto', 'hack', 'password', 'login', 'id'
    ];

    const lower = newMessageText.toLowerCase();
    const matchedSpam = forbiddenKeywords.find(kw => lower.includes(kw.toLowerCase()));

    if (matchedSpam) {
      alert(`🚫 Message Blocked!\n\nYour message contains restricted content or a word banned by TakeUUp Community Standards: "${matchedSpam}".\n\nPlease remove it before sending.`);

      // Log blocked attempt into Admin Audit Store
      const auditLog = {
        id: `blocked-${Date.now()}`,
        senderName: currentUser?.name || 'You',
        senderAvatar: currentUser?.photoURL || '',
        text: `[BLOCKED SPAM ATTEMPT]: ${newMessageText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        flaggedForReview: true,
        flagReason: `Blocked Keyword Attempt: "${matchedSpam}"`,
        isDeleted: false
      };

      try {
        const directData = localStorage.getItem('takeuup_direct_messages') || '{}';
        const parsed = JSON.parse(directData);
        const targetId = activeTab === 'groups' ? activeGroupId : selectedPeer?.id || 'audit';
        parsed[targetId] = [...(parsed[targetId] || []), auditLog];
        localStorage.setItem('takeuup_direct_messages', JSON.stringify(parsed));
      } catch (err) {}

      return;
    }

    if (activeTab === 'groups') {
      const newMsg: any = {
        id: `msg-${Date.now()}`,
        groupId: activeGroupId,
        senderName: currentUser?.name || 'You',
        senderAvatar: currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=random`,
        senderRole: 'Student',
        content: newMessageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachment: pendingAttachment ? { ...pendingAttachment } : undefined
      };

      const updated = {
        ...groupMessages,
        [activeGroupId]: [...(groupMessages[activeGroupId] || []), newMsg]
      };

      setGroupMessages(updated);
      localStorage.setItem('takeuup_study_messages', JSON.stringify(updated));
    } else if (activeTab === 'direct' && selectedPeer) {
      const newMsg: any = {
        id: `dm-${Date.now()}`,
        groupId: selectedPeer.id,
        senderName: currentUser?.name || 'You',
        senderAvatar: currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=random`,
        senderRole: 'Student',
        content: newMessageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachment: pendingAttachment ? { ...pendingAttachment } : undefined
      };

      const updated = {
        ...directMessages,
        [selectedPeer.id]: [...(directMessages[selectedPeer.id] || []), newMsg]
      };

      setDirectMessages(updated);
      localStorage.setItem('takeuup_direct_messages', JSON.stringify(updated));
    }

    setNewMessageText('');
    setPendingAttachment(null);
  };

  const pendingIncomingRequests = connectionRequests.filter(r => r.recipientId === 'user-current' && r.status === 'pending');
  const connectedPeers = peerStudents.filter(p => connectedPeerIds.includes(p.id));
  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];

  const filteredSearchPeers = peerStudents.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.targetGoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGrp: StudyGroup = {
      id: `grp-${Date.now()}`,
      name: newGroupName,
      category: newGroupCategory,
      description: newGroupDesc || 'Custom student study group.',
      icon: '🎓',
      membersCount: 1,
      isJoined: true,
      lastMessage: 'Group created.',
      lastMessageTime: 'Just now',
      members: [{ name: currentUser?.name || 'You', avatar: currentUser?.photoURL || '', role: 'Group Leader' }]
    };

    const updatedGroups = [newGrp, ...groups];
    setGroups(updatedGroups);
    localStorage.setItem('takeuup_study_groups', JSON.stringify(updatedGroups));
    setActiveGroupId(newGrp.id);
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Sub-Nav Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-white">Study Circles & Peer Requests</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {peerStudents.filter(p => p.isOnline).length} Students Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Search student profiles across Bangladesh, send study partner requests, and message once accepted!
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 text-xs font-bold">
          {[
            { id: 'groups', label: 'Study Circles', icon: Users },
            { id: 'direct', label: `Connected Peers (${connectedPeers.length})`, icon: MessageCircle },
            { id: 'search', label: 'Search Profiles', icon: Search },
            { id: 'requests', label: 'Study Requests', icon: UserPlus, badge: pendingIncomingRequests.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] rounded-full font-black animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: STUDY CIRCLES (GROUPS) */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[580px]">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Study Circles ({groups.length})
              </h3>
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                {groups.map(grp => (
                  <div
                    key={grp.id}
                    onClick={() => setActiveGroupId(grp.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      activeGroupId === grp.id
                        ? 'bg-slate-800 border-purple-500/50 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                        {grp.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{grp.name}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{grp.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeGroup?.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm">{activeGroup?.name}</h3>
                  <p className="text-xs text-slate-400">{activeGroup?.membersCount} Members • {activeGroup?.description}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar max-h-[380px]">
              {(groupMessages[activeGroupId] || []).map((msg: any) => {
                const isMe = msg.senderName === (currentUser?.name || 'You');
                return (
                  <div key={msg.id} className={`flex items-start gap-3 group/msg ${isMe ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full border border-slate-700 shrink-0" />
                    <div className={`max-w-md ${isMe ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1 justify-start">
                        <span className="text-[11px] font-bold text-slate-300">{msg.senderName}</span>
                        <span className="text-[9px] text-slate-500 ml-auto">{msg.timestamp}</span>
                        {isMe && !msg.isDeleted && (
                          <button
                            onClick={() => handleUnsendMessage(msg.id, false, activeGroupId)}
                            className="opacity-0 group-hover/msg:opacity-100 transition-opacity text-[10px] text-red-400 hover:text-red-300 font-bold ml-2 flex items-center gap-1"
                            title="Unsend Message"
                          >
                            <Trash2 size={11} /> Unsend
                          </button>
                        )}
                      </div>

                      {msg.isDeleted ? (
                        <div className="p-3 rounded-2xl text-xs italic bg-slate-900 border border-slate-800 text-slate-500">
                          🚫 This message was unsent
                        </div>
                      ) : (
                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                          isMe ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                        }`}>
                          {msg.content && <p>{msg.content}</p>}

                          {msg.attachment && (
                            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-700/50 space-y-1.5 mt-1">
                              {msg.attachment.type === 'image' && (
                                <img src={msg.attachment.url} alt={msg.attachment.name} className="max-h-40 rounded-lg object-cover" />
                              )}
                              {msg.attachment.type === 'video' && (
                                <video src={msg.attachment.url} controls className="max-h-40 rounded-lg w-full" />
                              )}
                              {msg.attachment.type === 'pdf' && (
                                <a href={msg.attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-purple-300 text-xs font-bold hover:underline">
                                  <FileText size={16} /> {msg.attachment.name} ({msg.attachment.size}) ↗
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar with Attachment File Selector */}
            <form onSubmit={handleSendMessage} className="bg-slate-950 p-4 border-t border-slate-800 space-y-2">
              {pendingAttachment && (
                <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs text-purple-300">
                  <span className="flex items-center gap-2 font-bold truncate">
                    {pendingAttachment.type === 'image' && <ImageIcon size={14} />}
                    {pendingAttachment.type === 'pdf' && <FileText size={14} />}
                    {pendingAttachment.type === 'video' && <Video size={14} />}
                    {pendingAttachment.name} ({pendingAttachment.size})
                  </span>
                  <button type="button" onClick={() => setPendingAttachment(null)} className="text-purple-400 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 cursor-pointer transition-colors" title="Attach Image, PDF, or Video">
                  <Paperclip size={16} />
                  <input
                    type="file"
                    accept="image/*,application/pdf,video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>

                <input
                  type="text"
                  placeholder="Type study question..."
                  value={newMessageText}
                  onChange={e => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />

                <button
                  type="submit"
                  disabled={!newMessageText.trim() && !pendingAttachment}
                  className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5"
                >
                  <Send size={14} /> Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CONNECTED PEERS (DIRECT CHAT - ONLY ACCEPTED FRIENDS) */}
      {activeTab === 'direct' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[580px]">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Accepted Study Partners ({connectedPeers.length})
              </h3>

              {connectedPeers.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs space-y-2">
                  <UserX size={32} className="mx-auto text-slate-600" />
                  <p>No connected study partners yet.</p>
                  <button onClick={() => setActiveTab('search')} className="text-purple-400 font-bold underline">
                    Search Student Profiles
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[440px] overflow-y-auto custom-scrollbar pr-1">
                  {connectedPeers.map(peer => {
                    const isSelected = (selectedPeer?.id === peer.id);
                    return (
                      <div
                        key={peer.id}
                        onClick={() => setSelectedPeer(peer)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-slate-800 border-purple-500/50 shadow-lg' : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={peer.avatar} alt={peer.name} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                              peer.isOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{peer.name}</h4>
                            <span className="text-[10px] text-slate-400 block">{peer.institution}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingProfilePeer(peer);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700"
                          title="View Student Profile"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            {selectedPeer && connectedPeerIds.includes(selectedPeer.id) ? (
              <>
                <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative cursor-pointer" onClick={() => setViewingProfilePeer(selectedPeer)}>
                      <img src={selectedPeer.avatar} alt={selectedPeer.name} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 ${
                        selectedPeer.isOnline ? 'bg-emerald-400' : 'bg-slate-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm cursor-pointer hover:text-purple-400 transition-colors" onClick={() => setViewingProfilePeer(selectedPeer)}>
                          {selectedPeer.name}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          selectedPeer.isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {selectedPeer.isOnline ? '● Online Now' : 'Offline'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{selectedPeer.institution} • Target: {selectedPeer.targetGoal}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewingProfilePeer(selectedPeer)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                  >
                    <User size={14} /> View Profile
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar max-h-[380px]">
                  {(directMessages[selectedPeer.id] || []).map((msg: any) => {
                    const isMe = msg.senderName === (currentUser?.name || 'You');
                    return (
                      <div key={msg.id} className={`flex items-start gap-3 group/msg ${isMe ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full border border-slate-700 shrink-0" />
                        <div className={`max-w-md ${isMe ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1 justify-start">
                            <span className="text-[11px] font-bold text-slate-300">{msg.senderName}</span>
                            <span className="text-[9px] text-slate-500 ml-auto">{msg.timestamp}</span>
                            {isMe && !msg.isDeleted && (
                              <button
                                onClick={() => handleUnsendMessage(msg.id, true, selectedPeer.id)}
                                className="opacity-0 group-hover/msg:opacity-100 transition-opacity text-[10px] text-red-400 hover:text-red-300 font-bold ml-2 flex items-center gap-1"
                                title="Unsend Message"
                              >
                                <Trash2 size={11} /> Unsend
                              </button>
                            )}
                          </div>

                          {msg.isDeleted ? (
                            <div className="p-3 rounded-2xl text-xs italic bg-slate-900 border border-slate-800 text-slate-500">
                              🚫 This message was unsent
                            </div>
                          ) : (
                            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                              isMe ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                            }`}>
                              {msg.content && <p>{msg.content}</p>}

                              {msg.attachment && (
                                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-700/50 space-y-1.5 mt-1">
                                  {msg.attachment.type === 'image' && (
                                    <img src={msg.attachment.url} alt={msg.attachment.name} className="max-h-40 rounded-lg object-cover" />
                                  )}
                                  {msg.attachment.type === 'video' && (
                                    <video src={msg.attachment.url} controls className="max-h-40 rounded-lg w-full" />
                                  )}
                                  {msg.attachment.type === 'pdf' && (
                                    <a href={msg.attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-purple-300 text-xs font-bold hover:underline">
                                      <FileText size={16} /> {msg.attachment.name} ({msg.attachment.size}) ↗
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Direct Chat Input Bar with Attachment File Selector */}
                <form onSubmit={handleSendMessage} className="bg-slate-950 p-4 border-t border-slate-800 space-y-2">
                  {pendingAttachment && (
                    <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs text-purple-300">
                      <span className="flex items-center gap-2 font-bold truncate">
                        {pendingAttachment.type === 'image' && <ImageIcon size={14} />}
                        {pendingAttachment.type === 'pdf' && <FileText size={14} />}
                        {pendingAttachment.type === 'video' && <Video size={14} />}
                        {pendingAttachment.name} ({pendingAttachment.size})
                      </span>
                      <button type="button" onClick={() => setPendingAttachment(null)} className="text-purple-400 hover:text-white">
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 cursor-pointer transition-colors" title="Attach Image, PDF, or Video">
                      <Paperclip size={16} />
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>

                    <input
                      type="text"
                      placeholder={`Message ${selectedPeer.name}...`}
                      value={newMessageText}
                      onChange={e => setNewMessageText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                    />

                    <button
                      type="submit"
                      disabled={!newMessageText.trim() && !pendingAttachment}
                      className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5"
                    >
                      <Send size={14} /> Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                <Lock size={40} className="text-slate-600" />
                <h4 className="font-bold text-white text-base">Direct Messaging Protected</h4>
                <p className="text-xs max-w-md">
                  Just like Facebook, you can only send direct messages once a student accepts your Study Partner Request. Search profiles and send requests to connect!
                </p>
                <button onClick={() => setActiveTab('search')} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg">
                  Search & Connect Students
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SEARCH & VISIT STUDENT PROFILES */}
      {activeTab === 'search' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">Discover & Search Student Profiles</h3>
              <p className="text-xs text-slate-400">Search by student name, college, university, or target exam.</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search Notre Dame, BUET, BCS..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSearchPeers.map(peer => {
              const reqStatus = getRequestStatus(peer.id);
              return (
                <div key={peer.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="relative">
                        <img src={peer.avatar} alt={peer.name} className="w-16 h-16 rounded-2xl border-2 border-purple-500/40 object-cover" />
                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-950 ${
                          peer.isOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'
                        }`} />
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        peer.isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        {peer.isOnline ? 'Online Now' : 'Offline'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base mb-0.5">{peer.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mb-2">{peer.institution}</p>

                    <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-850 text-xs text-slate-300 space-y-1 mb-3">
                      <div><strong className="text-slate-500">Target: </strong><span className="text-purple-300 font-bold">{peer.targetGoal}</span></div>
                      <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-800">
                        <span className="text-emerald-400 font-bold">🔥 {peer.streak} Days Streak</span>
                        <span className="text-yellow-400 font-bold">🏆 Rank #{peer.rank}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => setViewingProfilePeer(peer)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <Eye size={14} /> Visit Profile
                    </button>

                    {reqStatus === 'connected' ? (
                      <button
                        onClick={() => { setSelectedPeer(peer); setActiveTab('direct'); }}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <MessageSquare size={14} /> Send Message
                      </button>
                    ) : reqStatus === 'sent' ? (
                      <span className="flex-1 py-2.5 bg-slate-900 text-slate-400 font-bold rounded-xl text-xs text-center border border-slate-800">
                        ⏳ Request Pending
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(peer)}
                        className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <UserPlus size={14} /> Send Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INCOMING / OUTGOING REQUESTS HUB */}
      {activeTab === 'requests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <UserPlus className="text-purple-400" /> Pending Study Partner Requests ({pendingIncomingRequests.length})
          </h3>

          {pendingIncomingRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 size={40} className="mx-auto text-emerald-400/60" />
              <h4 className="text-white font-bold text-base">No Pending Requests</h4>
              <p className="text-xs">You have accepted or cleared all incoming study partner requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingIncomingRequests.map(req => (
                <div key={req.id} className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={req.senderAvatar} alt={req.senderName} className="w-12 h-12 rounded-full border border-purple-500/40 object-cover shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{req.senderName}</h4>
                      <p className="text-xs text-slate-400">{req.senderGoal}</p>
                      <span className="text-[10px] text-slate-500">{req.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAcceptRequest(req.id, req.senderId)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg flex items-center gap-1"
                    >
                      <Check size={14} /> Accept
                    </button>

                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STUDENT PROFILE VISITOR MODAL */}
      {viewingProfilePeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={() => setViewingProfilePeer(null)} />

          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 space-y-6">
            <button
              onClick={() => setViewingProfilePeer(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-5 border-b border-slate-800 pb-6">
              <div className="relative shrink-0">
                <img src={viewingProfilePeer.avatar} alt={viewingProfilePeer.name} className="w-20 h-20 rounded-2xl border-2 border-purple-500/50 object-cover" />
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  viewingProfilePeer.isOnline ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-slate-600'
                }`} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-white">{viewingProfilePeer.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    viewingProfilePeer.isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {viewingProfilePeer.isOnline ? '● Online Now' : 'Offline'}
                  </span>
                </div>

                <p className="text-xs text-purple-300 font-bold">{viewingProfilePeer.role}</p>
                <p className="text-xs text-slate-400">{viewingProfilePeer.institution}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <span className="font-bold text-white text-sm block">{viewingProfilePeer.streak} Days</span>
                  <span className="text-[10px] text-slate-500">Study Streak</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <span className="font-bold text-white text-sm block">Rank #{viewingProfilePeer.rank}</span>
                  <span className="text-[10px] text-slate-500">Leaderboard</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-slate-500 block">Target Exam Goal</strong>
                <p className="text-white font-bold text-sm">{viewingProfilePeer.targetGoal}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-slate-500 block">Student Bio & Interests</strong>
                <p className="text-slate-300 leading-relaxed">{viewingProfilePeer.bio}</p>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-2">
              {getRequestStatus(viewingProfilePeer.id) === 'connected' ? (
                <button
                  onClick={() => {
                    setSelectedPeer(viewingProfilePeer);
                    setViewingProfilePeer(null);
                    setActiveTab('direct');
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare size={16} /> Open Direct Chat
                </button>
              ) : getRequestStatus(viewingProfilePeer.id) === 'sent' ? (
                <button disabled className="w-full py-3 bg-slate-800 text-slate-400 font-bold rounded-2xl text-xs border border-slate-700 text-center">
                  ⏳ Study Partner Request Pending
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleSendRequest(viewingProfilePeer);
                    setViewingProfilePeer(null);
                  }}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <UserPlus size={16} /> Send Study Partner Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-4">Create New Study Circle</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HSC Physics Numerical Squad"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-400 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
