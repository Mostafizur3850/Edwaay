import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Shield, AlertTriangle, Trash2, FileText, Image as ImageIcon,
  Video, Eye, Filter, Search, CheckCircle, Ban, Bell, Download, Lock, RefreshCw,
  User, Users, Flag, Clock, File, Plus, X, ArrowLeft, Send, Check
} from 'lucide-react';
import { ChatMessage, ChatAttachment } from '../../../types/types';

interface AuditMessage extends ChatMessage {
  groupOrPeerName?: string;
  type?: 'direct' | 'group';
}

interface ChatThread {
  id: string;
  title: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage: string;
  lastTimestamp: string;
  avatar: string;
  messages: AuditMessage[];
}

const DEFAULT_SPAM_KEYWORDS = [
  'adult', 'sex', 'bKash', 'Nagad', 'money', 'payment', 'phone', 'whatsapp',
  'telegram', '017', '018', '019', '013', '014', '015', '016', 'cash', 'nude',
  'scam', 'cheat', 'gambling', 'crypto', 'hack', 'password', 'login', 'id'
];

interface AdminMessageMonitoringProps {
  defaultTab?: 'chatbox' | 'alerts' | 'deleted' | 'spam_db' | 'attachments';
}

export const AdminMessageMonitoring: React.FC<AdminMessageMonitoringProps> = ({ defaultTab = 'chatbox' }) => {
  const [messages, setMessages] = useState<AuditMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Spam Database State
  const [spamKeywords, setSpamKeywords] = useState<string[]>(() => {
    const saved = localStorage.getItem('takeuup_forbidden_keywords');
    return saved ? JSON.parse(saved) : DEFAULT_SPAM_KEYWORDS;
  });
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Tab State: 'chatbox' | 'alerts' | 'deleted' | 'spam_db' | 'attachments'
  const [activeTab, setActiveTab] = useState<'chatbox' | 'alerts' | 'deleted' | 'spam_db' | 'attachments'>('chatbox');

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<AuditMessage | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<{
    attachment: ChatAttachment;
    senderName: string;
    timestamp: string;
    groupOrPeerName: string;
  } | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load All Student Messages & Build Real Interactive Chat Threads
  useEffect(() => {
    loadAllMessages();
  }, []);

  useEffect(() => {
    localStorage.setItem('takeuup_forbidden_keywords', JSON.stringify(spamKeywords));
  }, [spamKeywords]);

  const loadAllMessages = () => {
    const allLogs: AuditMessage[] = [];
    const threadMap: Record<string, ChatThread> = {};

    // 1. Direct Messages
    try {
      const directData = localStorage.getItem('takeuup_direct_messages');
      if (directData) {
        const parsed = JSON.parse(directData);
        Object.keys(parsed).forEach(peerId => {
          const threadMsgs: AuditMessage[] = [];
          parsed[peerId].forEach((msg: any) => {
            const auditMsg: AuditMessage = {
              id: msg.id || `dm-${Math.random()}`,
              senderId: msg.senderId || 'user-1',
              senderName: msg.senderName || 'Student',
              senderAvatar: msg.senderAvatar || `https://ui-avatars.com/api/?name=${msg.senderName || 'Student'}&background=random`,
              recipientId: peerId,
              groupOrPeerName: `1-on-1 Chat with ${msg.senderName || peerId}`,
              type: 'direct',
              text: msg.content || msg.text || '',
              timestamp: msg.timestamp || 'Today',
              attachment: msg.attachment,
              isDeleted: msg.isDeleted || false,
              deletedAt: msg.deletedAt,
              flaggedForReview: checkIsFlagged(msg.content || msg.text || ''),
              flagReason: getFlagReason(msg.content || msg.text || '')
            };
            allLogs.push(auditMsg);
            threadMsgs.push(auditMsg);
          });

          const lastMsg = threadMsgs[threadMsgs.length - 1];
          threadMap[`direct-${peerId}`] = {
            id: `direct-${peerId}`,
            title: `1-on-1 Chat (${peerId})`,
            type: 'direct',
            participants: [lastMsg?.senderName || 'Student', peerId],
            lastMessage: lastMsg?.text || 'Chat initialized',
            lastTimestamp: lastMsg?.timestamp || 'Today',
            avatar: lastMsg?.senderAvatar || `https://ui-avatars.com/api/?name=${peerId}&background=random`,
            messages: threadMsgs
          };
        });
      }
    } catch (e) {}

    // 2. Group Messages
    try {
      const groupData = localStorage.getItem('takeuup_study_messages');
      if (groupData) {
        const parsed = JSON.parse(groupData);
        Object.keys(parsed).forEach(grpId => {
          const threadMsgs: AuditMessage[] = [];
          parsed[grpId].forEach((msg: any) => {
            const auditMsg: AuditMessage = {
              id: msg.id || `grp-${Math.random()}`,
              senderId: msg.senderId || 'user-2',
              senderName: msg.senderName || 'Student',
              senderAvatar: msg.senderAvatar || `https://ui-avatars.com/api/?name=${msg.senderName || 'Student'}&background=random`,
              groupId: grpId,
              groupOrPeerName: `Group Circle (${grpId})`,
              type: 'group',
              text: msg.content || msg.text || '',
              timestamp: msg.timestamp || 'Today',
              attachment: msg.attachment,
              isDeleted: msg.isDeleted || false,
              deletedAt: msg.deletedAt,
              flaggedForReview: checkIsFlagged(msg.content || msg.text || ''),
              flagReason: getFlagReason(msg.content || msg.text || '')
            };
            allLogs.push(auditMsg);
            threadMsgs.push(auditMsg);
          });

          const lastMsg = threadMsgs[threadMsgs.length - 1];
          threadMap[`group-${grpId}`] = {
            id: `group-${grpId}`,
            title: `Study Circle (${grpId})`,
            type: 'group',
            participants: ['All Group Members'],
            lastMessage: lastMsg?.text || 'Group discussion',
            lastTimestamp: lastMsg?.timestamp || 'Today',
            avatar: '🎓',
            messages: threadMsgs
          };
        });
      }
    } catch (e) {}

    // Add Initial Seed Audit Logs & Threads if empty
    if (allLogs.length === 0) {
      const seedMsgs: AuditMessage[] = [
        {
          id: 'aud-1',
          senderId: 'usr-88',
          senderName: 'Samiul Islam',
          senderAvatar: 'https://picsum.photos/id/12/50',
          groupOrPeerName: '1-on-1 Chat with Nusrat Jahan',
          type: 'direct',
          text: 'Call me on 01788936890 or contact via Telegram for bKash money transfer.',
          timestamp: '10:14 AM',
          isDeleted: true,
          deletedAt: '10:16 AM',
          flaggedForReview: true,
          flagReason: 'Phone Number & Payment Request Detected'
        },
        {
          id: 'aud-2',
          senderId: 'usr-99',
          senderName: 'Tanvir Hossain',
          senderAvatar: 'https://picsum.photos/id/66/50',
          groupOrPeerName: 'BUET & Engineering Admission Circle',
          type: 'group',
          text: 'Here is the PDF notes for Physics Vector Calculus.',
          timestamp: '09:45 AM',
          attachment: {
            type: 'pdf',
            name: 'Physics_Vector_Calculus_Notes.pdf',
            url: '#',
            size: '2.4 MB'
          },
          isDeleted: false,
          flaggedForReview: false
        },
        {
          id: 'aud-3',
          senderId: 'usr-101',
          senderName: 'Anonymous Candidate',
          senderAvatar: 'https://picsum.photos/id/40/50',
          groupOrPeerName: '1-on-1 Chat with Dr. Zafar Ahmed',
          type: 'direct',
          text: 'Send me explicit adult material or money on bkash.',
          timestamp: '08:30 AM',
          isDeleted: true,
          deletedAt: '08:31 AM',
          flaggedForReview: true,
          flagReason: 'Adult Keyword & Extortion Detected'
        }
      ];

      allLogs.push(...seedMsgs);

      threadMap['thread-1'] = {
        id: 'thread-1',
        title: 'Samiul Islam ↔ Nusrat Jahan',
        type: 'direct',
        participants: ['Samiul Islam', 'Nusrat Jahan'],
        lastMessage: 'Call me on 01788936890 or contact via Telegram...',
        lastTimestamp: '10:14 AM',
        avatar: 'https://picsum.photos/id/12/50',
        messages: [seedMsgs[0]]
      };

      threadMap['thread-2'] = {
        id: 'thread-2',
        title: 'BUET & Engineering Circle',
        type: 'group',
        participants: ['Tanvir Hossain', 'Nusrat Jahan', 'Dr. Zafar Ahmed'],
        lastMessage: 'Here is the PDF notes for Physics Vector Calculus.',
        lastTimestamp: '09:45 AM',
        avatar: '🎓',
        messages: [seedMsgs[1]]
      };

      threadMap['thread-3'] = {
        id: 'thread-3',
        title: 'Anonymous Candidate ↔ Dr. Zafar Ahmed',
        type: 'direct',
        participants: ['Anonymous Candidate', 'Dr. Zafar Ahmed'],
        lastMessage: 'Send me explicit adult material or money on bkash.',
        lastTimestamp: '08:30 AM',
        avatar: 'https://picsum.photos/id/40/50',
        messages: [seedMsgs[2]]
      };
    }

    setMessages(allLogs);
    const threadList = Object.values(threadMap);
    setThreads(threadList);
    if (threadList.length > 0) {
      setActiveThreadId(threadList[0].id);
    }
  };

  const checkIsFlagged = (text: string) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return spamKeywords.some(kw => lower.includes(kw.toLowerCase()));
  };

  const getFlagReason = (text: string) => {
    if (!text) return '';
    const lower = text.toLowerCase();
    const matches = spamKeywords.filter(kw => lower.includes(kw.toLowerCase()));
    if (matches.length > 0) {
      return `Banned Keywords Detected: [${matches.join(', ')}]`;
    }
    return '';
  };

  // Add / Remove Spam Keywords
  const handleAddSpamKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;
    const kw = newKeywordInput.trim().toLowerCase();
    if (!spamKeywords.includes(kw)) {
      const updated = [...spamKeywords, kw];
      setSpamKeywords(updated);
      setActionNotice(`Added "${kw}" to Spam & Safety Database. Future student messages containing this word will be BLOCKED automatically.`);
      setTimeout(() => setActionNotice(null), 5000);
    }
    setNewKeywordInput('');
  };

  const handleRemoveSpamKeyword = (kw: string) => {
    const updated = spamKeywords.filter(k => k !== kw);
    setSpamKeywords(updated);
  };

  // Filter Computations
  const flaggedMessages = messages.filter(m => m.flaggedForReview || checkIsFlagged(m.text));
  const deletedMessages = messages.filter(m => m.isDeleted);
  const attachmentMessages = messages.filter(m => m.attachment);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleModerateUser = (action: string, msg: AuditMessage) => {
    setActionNotice(`Action Taken: "${action}" applied to user ${msg.senderName}. Notification logged.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'chatbox': return { title: 'Student Messages', desc: 'Audit and inspect real-time student chat threads.' };
      case 'alerts': return { title: 'Abuse & Flagged Alerts', desc: 'Monitor adult or abusive messages flagged for review.' };
      case 'deleted': return { title: 'Deleted Message Log', desc: 'Inspect chat messages unsent or deleted by students.' };
      case 'attachments': return { title: 'Media Attachments', desc: 'Audit files, images, and videos sent in chat.' };
      case 'spam_db': return { title: 'Anti-Spam Filter Keywords', desc: 'Configure forbidden keywords to automatically block spam.' };
      default: return { title: 'Message & Monitoring', desc: 'Audit student messages and spam database.' };
    }
  };

  const headerInfo = getHeaderTitle();

  return (
    <div className="space-y-6 text-xs text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{headerInfo.title}</h2>
          <p className="text-slate-400 text-xs mt-1">{headerInfo.desc}</p>
        </div>
        <button
          onClick={loadAllMessages}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={14} /> Refresh Stream
        </button>
      </div>

      {actionNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-emerald-400 font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle size={18} /> {actionNotice}
        </div>
      )}

      {/* VIEW 1: LIVE CHATBOX INTERFACE (REAL MESSENGER FEEL FOR ADMIN) */}
      {activeTab === 'chatbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[580px]">
          {/* Left Sidebar: Threads List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Student Conversation Threads ({threads.length})
              </h3>
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                {threads.map(thr => {
                  const isSelected = (activeThreadId === thr.id);
                  const hasFlagged = thr.messages.some(m => m.flaggedForReview || checkIsFlagged(m.text));
                  const hasDeleted = thr.messages.some(m => m.isDeleted);

                  return (
                    <div
                      key={thr.id}
                      onClick={() => setActiveThreadId(thr.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-cyan-500/50 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {thr.avatar.startsWith('http') ? (
                          <img src={thr.avatar} alt={thr.title} className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                            {thr.avatar}
                          </div>
                        )}
                        <div className="overflow-hidden flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-xs truncate">{thr.title}</h4>
                            <span className="text-[9px] text-slate-500">{thr.lastTimestamp}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{thr.lastMessage}</p>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            {hasFlagged && (
                              <span className="px-1.5 py-0.2 bg-red-500/20 text-red-400 text-[9px] rounded font-bold border border-red-500/30">
                                ⚠️ Suspicious
                              </span>
                            )}
                            {hasDeleted && (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 text-[9px] rounded font-bold border border-amber-500/30">
                                🚫 Has Unsent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Main Chatbox Thread (Real Messenger Interface) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeThread.avatar.startsWith('http') ? (
                      <img src={activeThread.avatar} alt={activeThread.title} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                        {activeThread.avatar}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-sm">{activeThread.title}</h3>
                      <p className="text-xs text-slate-400">Admin Live Monitoring Mode • {activeThread.participants.join(', ')}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time Feed
                  </span>
                </div>

                {/* Chat Messages Body (Speech Bubbles - User Messenger Feel) */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar max-h-[400px] bg-slate-950/40">
                  {activeThread.messages.map((msg, idx) => {
                    const isSenderA = idx % 2 === 0;
                    const isFlagged = checkIsFlagged(msg.text);

                    return (
                      <div key={msg.id} className={`flex items-start gap-3 ${isSenderA ? '' : 'flex-row-reverse'}`}>
                        <img
                          src={msg.senderAvatar || `https://ui-avatars.com/api/?name=${msg.senderName}&background=random`}
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-full border border-slate-700 shrink-0 object-cover"
                        />

                        <div className={`max-w-md ${isSenderA ? '' : 'text-right'}`}>
                          <div className="flex items-center gap-2 mb-1 justify-start">
                            <span className="text-[11px] font-bold text-slate-300">{msg.senderName}</span>
                            <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                            {msg.isDeleted && (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 text-[9px] font-bold rounded border border-amber-500/30">
                                🚫 UNSENT BY USER
                              </span>
                            )}
                          </div>

                          {/* Message Speech Bubble */}
                          <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 border ${
                            msg.isDeleted
                              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                              : isFlagged
                              ? 'bg-red-950/40 border-red-500/50 text-red-200'
                              : isSenderA
                              ? 'bg-slate-800 border-slate-700 text-slate-100 rounded-tl-none'
                              : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                          }`}>
                            <p>{msg.text}</p>

                            {/* Exposed Unsent Warning for Admin */}
                            {msg.isDeleted && (
                              <div className="text-[10px] text-amber-400 font-bold border-t border-amber-500/30 pt-1 mt-1">
                                🔒 Hidden from student UI, exposed here for Admin scam investigation. (Deleted: {msg.deletedAt || 'Recently'})
                              </div>
                            )}

                            {/* Flag Reason */}
                            {isFlagged && (
                              <div className="text-[10px] text-red-400 font-bold border-t border-red-500/30 pt-1 mt-1 flex items-center gap-1">
                                <AlertTriangle size={12} /> {getFlagReason(msg.text)}
                              </div>
                            )}

                            {/* Attachment with Inspector Click Trigger */}
                            {msg.attachment && (
                              <div
                                onClick={() => setPreviewAttachment({
                                  attachment: msg.attachment!,
                                  senderName: msg.senderName,
                                  timestamp: msg.timestamp,
                                  groupOrPeerName: activeThread.title
                                })}
                                className="bg-slate-950/80 hover:bg-slate-950 p-3 rounded-xl border border-slate-700/60 cursor-pointer space-y-1.5 mt-1 transition-all group/att"
                              >
                                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold">
                                  <span className="flex items-center gap-1">
                                    <Eye size={12} /> Click to Inspect Content
                                  </span>
                                  <span className="uppercase">{msg.attachment.type}</span>
                                </div>

                                {msg.attachment.type === 'image' && (
                                  <img src={msg.attachment.url} alt={msg.attachment.name} className="max-h-48 rounded-lg object-cover w-full group-hover/att:scale-[1.01] transition-transform" />
                                )}
                                {msg.attachment.type === 'video' && (
                                  <video src={msg.attachment.url} controls className="max-h-48 rounded-lg w-full" />
                                )}
                                {msg.attachment.type === 'pdf' && (
                                  <div className="flex items-center gap-2 text-cyan-300 font-bold py-2 px-1">
                                    <FileText size={20} className="text-cyan-400 shrink-0" />
                                    <div className="overflow-hidden">
                                      <div className="truncate text-xs">{msg.attachment.name}</div>
                                      <div className="text-[10px] text-slate-400">{msg.attachment.size || 'PDF Document'}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Admin Quick Action Footer */}
                <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Moderate Student Conversation:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModerateUser('Warned Both Students', activeThread.messages[0])}
                      className="px-3.5 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl font-bold"
                    >
                      <Flag size={14} className="inline mr-1" /> Warn Students
                    </button>
                    <button
                      onClick={() => handleModerateUser('Muted Thread', activeThread.messages[0])}
                      className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold"
                    >
                      <Ban size={14} className="inline mr-1" /> Block / Mute Thread
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                Select a thread to view Messenger chat logs.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: DYNAMIC SPAM & BANNED KEYWORD DATABASE MANAGER */}
      {activeTab === 'spam_db' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-white text-base">Spam & Forbidden Content Database</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add forbidden keywords, adult terms, phone patterns, or payment terms. Any student message containing these will be <strong>AUTOMATICALLY BLOCKED</strong> in real time.
                </p>
              </div>
            </div>

            {/* Add New Keyword Form */}
            <form onSubmit={handleAddSpamKeyword} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enter forbidden word or phrase (e.g. bkash money, adult_phrase, 017...)"
                value={newKeywordInput}
                onChange={e => setNewKeywordInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newKeywordInput.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2"
              >
                <Plus size={16} /> Add Banned Keyword
              </button>
            </form>

            {/* Active Banned Keywords Grid */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Active Banned Keywords ({spamKeywords.length})
              </h4>

              <div className="flex flex-wrap gap-2">
                {spamKeywords.map(kw => (
                  <span
                    key={kw}
                    className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold rounded-xl text-xs flex items-center gap-2"
                  >
                    <span>⛔ {kw}</span>
                    <button
                      onClick={() => handleRemoveSpamKeyword(kw)}
                      className="text-indigo-400 hover:text-white"
                      title="Remove Keyword"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3 & 4: ALERTS / DELETED / ATTACHMENTS TABLE VIEW */}
      {(activeTab === 'alerts' || activeTab === 'deleted' || activeTab === 'attachments') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Detailed Audit Logs</h3>
            <div className="relative w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search sender, text or file..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="p-3">Sender & Context</th>
                  <th className="p-3">Message Text / Attachment</th>
                  <th className="p-3">Audit Status</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {messages.filter(m => {
                  if (activeTab === 'alerts') return m.flaggedForReview || checkIsFlagged(m.text);
                  if (activeTab === 'deleted') return m.isDeleted;
                  if (activeTab === 'attachments') return m.attachment;
                  return true;
                }).map(msg => (
                  <tr key={msg.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={msg.senderAvatar || `https://ui-avatars.com/api/?name=${msg.senderName}&background=random`}
                          alt={msg.senderName}
                          className="w-9 h-9 rounded-xl border border-slate-700 object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-white">{msg.senderName}</h4>
                          <p className="text-[10px] text-slate-400">{msg.groupOrPeerName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 max-w-xs">
                      <p className="text-slate-200 line-clamp-2">{msg.text || '(No Text)'}</p>
                    </td>

                    <td className="p-3">
                      {msg.isDeleted ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                          🚫 Unsent / Deleted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-slate-400 text-[11px]">{msg.timestamp}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-bold border border-slate-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MEDIA & ATTACHMENT INSPECTOR MODAL */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setPreviewAttachment(null)} />

          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Media & Content Inspector</h3>
                  <p className="text-xs text-slate-400">
                    Sender: <strong className="text-white">{previewAttachment.senderName}</strong> • Context: {previewAttachment.groupOrPeerName}
                  </p>
                </div>
              </div>
              <button onClick={() => setPreviewAttachment(null)} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800">
                <X size={18} />
              </button>
            </div>

            {/* Media Content Body */}
            <div className="flex-1 overflow-y-auto bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
              {previewAttachment.attachment.type === 'image' && (
                <div className="space-y-4 text-center">
                  <img
                    src={previewAttachment.attachment.url}
                    alt={previewAttachment.attachment.name}
                    className="max-h-[60vh] rounded-2xl border border-slate-800 object-contain shadow-2xl mx-auto"
                  />
                  <div className="text-xs text-slate-300 font-bold">
                    File: {previewAttachment.attachment.name} ({previewAttachment.attachment.size || 'Image File'})
                  </div>
                </div>
              )}

              {previewAttachment.attachment.type === 'video' && (
                <div className="w-full max-w-2xl space-y-4 text-center">
                  <video
                    src={previewAttachment.attachment.url}
                    controls
                    autoPlay
                    className="max-h-[60vh] rounded-2xl border border-slate-800 w-full shadow-2xl"
                  />
                  <div className="text-xs text-slate-300 font-bold">
                    Video File: {previewAttachment.attachment.name} ({previewAttachment.attachment.size || 'Video Stream'})
                  </div>
                </div>
              )}

              {previewAttachment.attachment.type === 'pdf' && (
                <div className="w-full space-y-4 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto text-3xl">
                    <FileText size={40} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{previewAttachment.attachment.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">PDF Document Attachment • {previewAttachment.attachment.size || 'Document File'}</p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a
                      href={previewAttachment.attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2"
                    >
                      <Eye size={16} /> Open PDF Document Viewer ↗
                    </a>
                    <a
                      href={previewAttachment.attachment.url}
                      download={previewAttachment.attachment.name}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-2"
                    >
                      <Download size={16} /> Download PDF File
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Moderation Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Sent at: {previewAttachment.timestamp}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleModerateUser('Flagged Media Content', { senderName: previewAttachment.senderName } as any);
                    setPreviewAttachment(null);
                  }}
                  className="px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl font-bold"
                >
                  <Flag size={14} className="inline mr-1" /> Flag Media Content
                </button>
                <button
                  onClick={() => {
                    handleModerateUser('Warned User for Inappropriate Media', { senderName: previewAttachment.senderName } as any);
                    setPreviewAttachment(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold"
                >
                  Warn Sender
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
