import React, { useState } from 'react';
import { 
  MessageSquare, X, Minus, Send, Bot, Sparkles, Image, Paperclip, 
  Search, CheckCircle2, ChevronRight, User, Phone, Video, ArrowLeft, UserCheck, Edit3
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface FloatingMessengerWidgetProps {
  user?: any;
  isOpenExternal?: boolean;
  onToggleExternal?: () => void;
}

export const FloatingMessengerWidget: React.FC<FloatingMessengerWidgetProps> = ({ 
  user,
  isOpenExternal,
  onToggleExternal
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalIsOpen;

  const toggleOpen = () => {
    if (onToggleExternal) {
      onToggleExternal();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const MENTORS = [
    {
      id: 'm1',
      name: 'ডঃ সাইফুর রহমান',
      category: 'পদার্থবিজ্ঞান মেন্টর',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'Physics Senior Faculty'
    },
    {
      id: 'm2',
      name: 'তানভীর আহমেদ',
      category: 'রসায়ন শিক্ষক (BUET)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'BUET CSE'
    }
  ];

  const CATEGORY_PEERS = [
    {
      id: 'p1',
      name: 'সাকিব আল হাসান',
      category: '🎯 BUET Target Batch',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'নটর ডেম কলেজ • HSC 26'
    },
    {
      id: 'p2',
      name: 'নুসরাত জাহান',
      category: '🩺 Medical Target Batch',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'হোলি ক্রস কলেজ • HSC 26'
    },
    {
      id: 'p3',
      name: 'মাহমুদুল হাসান',
      category: '🏛️ DU KA Unit Target',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'রাজশাহী কলেজ • HSC 26'
    }
  ];

  // All contacts lookup
  const ALL_CONTACTS = [
    { id: 'ai_solver', name: 'টেকআপ AI ডাউট সলভার', category: 'AI Solver', avatar: 'bot', online: true, role: '২৪/৭ ইনস্ট্যান্ট বোট' },
    ...MENTORS,
    ...CATEGORY_PEERS
  ];

  // Multi-Chat Heads State (Facebook Desktop Style)
  const [openChatIds, setOpenChatIds] = useState<string[]>(['ai_solver', 'p1', 'm1']);
  const [focusedChatId, setFocusedChatId] = useState<string>('p1');
  
  const [activeTab, setActiveTab] = useState<'ai_solver' | 'mentor' | 'peers'>('peers');
  const [viewMode, setViewMode] = useState<'chat' | 'list'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  
  // Chat History State
  const [messages, setMessages] = useState<Record<string, Array<{ id: string; sender: 'me' | 'other' | 'bot'; text: string; time: string }>>>({
    ai_solver: [
      { id: 'ai1', sender: 'bot', text: 'আসসালামু আলাইকুম! আমি টেকআপ AI ডাউট সলভার। তোমার গণিত, ফিজিক্স বা রসায়নের যেকোনো কঠিন প্রশ্নের ফটো বা প্রশ্ন পাঠাও, সাথে সাথে বুঝিয়ে দিচ্ছি! 🚀', time: '১০:০০ AM' }
    ],
    m1: [
      { id: 'm1_1', sender: 'other', text: 'পদার্থবিজ্ঞান ১ম পত্রের ভেক্টর অধ্যায়ে কোনো সমস্যা আছে?', time: '১০:৩০ AM' }
    ],
    p1: [
      { id: 'p1_1', sender: 'other', text: 'দোস্ত বুয়েট ভেক্টর প্র্যাকটিস শিটের ৩ নম্বর অংকটা পারছো? উত্তরটা মিলতেছে না!', time: '১০:৪৫ AM' }
    ]
  });

  // Get active conversation contact
  const activeContact = ALL_CONTACTS.find(c => c.id === focusedChatId) || ALL_CONTACTS[0];

  const handleOpenChatHead = (contactId: string) => {
    if (!openChatIds.includes(contactId)) {
      setOpenChatIds(prev => [...prev, contactId]);
    }
    setFocusedChatId(contactId);
    setViewMode('chat');
    if (!isOpen) toggleOpen();
  };

  const handleCloseChatHead = (contactId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const remaining = openChatIds.filter(id => id !== contactId);
    setOpenChatIds(remaining);
    if (focusedChatId === contactId) {
      if (remaining.length > 0) {
        setFocusedChatId(remaining[remaining.length - 1]);
      } else {
        if (isOpen) toggleOpen();
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const currentKey = focusedChatId;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [currentKey]: [...(prev[currentKey] || []), newMsg]
    }));

    const userText = inputText;
    setInputText('');

    if (currentKey === 'ai_solver') {
      setTimeout(() => {
        const botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot' as const,
          text: `ধন্যবাদ! তোমার প্রশ্ন: "${userText}"-এর সঠিক সমাধান:

১. সূত্র: v² = u² + 2as
২. মান বসিয়ে s = 25m

অন্য কোনো সংশয় থাকলে বলো!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({
          ...prev,
          ai_solver: [...(prev.ai_solver || []), botReply]
        }));
      }, 1000);
    }
  };

  const activeMessages = messages[focusedChatId] || [];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* ACTIVE FOCUSED FACEBOOK MESSENGER CHAT WINDOW */}
      {isOpen && (
        <div className={`fixed bottom-6 right-20 sm:right-24 w-80 sm:w-96 h-[520px] ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        } border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 z-[9999]`}>
          
          {/* Header Bar */}
          <div className="p-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button 
                onClick={() => setViewMode(viewMode === 'list' ? 'chat' : 'list')} 
                className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0" 
                title="সহপাঠী ও মেন্টর লিস্ট">
                {viewMode === 'list' ? <MessageSquare size={16} /> : <ArrowLeft size={16} />}
              </button>

              {activeContact.id === 'ai_solver' ? (
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <Bot size={18} />
                </div>
              ) : (
                <div className="relative shrink-0">
                  <img src={activeContact.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/40" />
                  {activeContact.online && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 absolute right-0 bottom-0" />}
                </div>
              )}

              <div className="truncate">
                <h4 className="font-black text-xs truncate">
                  {viewMode === 'list' ? 'সহপাঠী ও মেন্টর ডিরেক্টরি' : activeContact.name}
                </h4>
                <p className="text-[10px] text-white/80 font-bold truncate">
                  {viewMode === 'list' ? '🔍 নাম বা কলেজ লিখে খুঁজুন' : (activeContact.online ? '● একটিভ আছেন' : '● অফলাইন')}
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button onClick={toggleOpen} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" title="মিনিমাইজ">
                <Minus size={16} />
              </button>
              <button onClick={() => handleCloseChatHead(focusedChatId)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" title="চ্যাট বন্ধ করুন">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className={`p-1 border-b ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} flex text-[10px] shrink-0`}>
            <button
              onClick={() => { setActiveTab('ai_solver'); handleOpenChatHead('ai_solver'); setViewMode('chat'); }}
              className={`flex-1 py-1.5 rounded-xl font-black transition-all flex items-center justify-center gap-1 ${
                focusedChatId === 'ai_solver' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles size={11} /> AI ডাউট
            </button>
            <button
              onClick={() => { setActiveTab('mentor'); setViewMode('list'); }}
              className={`flex-1 py-1.5 rounded-xl font-black transition-all flex items-center justify-center gap-1 ${
                activeTab === 'mentor' && viewMode === 'list' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              👨‍🏫 মেন্টর
            </button>
            <button
              onClick={() => { setActiveTab('peers'); setViewMode('list'); }}
              className={`flex-1 py-1.5 rounded-xl font-black transition-all flex items-center justify-center gap-1 ${
                activeTab === 'peers' && viewMode === 'list' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              👥 সহপাঠী
            </button>
          </div>

          {/* Real-time Search Input Bar */}
          <div className={`p-2 border-b ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} flex items-center gap-2 shrink-0`}>
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setViewMode('list'); }}
                placeholder={activeTab === 'mentor' ? "মেন্টরের নাম বা বিষয় লিখে খুঁজুন..." : "সহপাঠী বা কলেজের নাম লিখে খুঁজুন..."}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                } focus:outline-none focus:border-cyan-500` }
              />
            </div>
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'chat' : 'list')}
              className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs hover:bg-cyan-500/20 shrink-0 flex items-center gap-1"
              title={viewMode === 'list' ? "চ্যাট রুম" : "কন্ট্যাক্ট ডিরেক্টরি"}
            >
              {viewMode === 'list' ? <MessageSquare size={14} /> : <UserCheck size={14} />}
            </button>
          </div>

          {/* Main Body: Either Directory Search OR Active Conversation */}
          {viewMode === 'list' ? (
            <div className="flex-1 p-3 overflow-y-auto space-y-2 custom-scrollbar">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                {activeTab === 'mentor' ? 'উপলব্ধ মেন্টরবৃন্দ' : 'আপনার ক্যাটাগরির সক্রিয় সহপাঠী'}
              </p>

              {(activeTab === 'mentor' ? MENTORS : CATEGORY_PEERS)
                .filter(c => 
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.role.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((contact) => (
                  <div 
                    key={contact.id}
                    onClick={() => handleOpenChatHead(contact.id)}
                    className={`p-2.5 rounded-2xl cursor-pointer border flex items-center justify-between transition-all ${
                      focusedChatId === contact.id
                        ? (isDark ? 'bg-cyan-500/15 border-cyan-500/40' : 'bg-cyan-50 border-cyan-300')
                        : (isDark ? 'bg-slate-950/60 hover:bg-slate-800 border-slate-800' : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm')
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        <img src={contact.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-cyan-500/30" />
                        {contact.online && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 absolute right-0 bottom-0" />}
                      </div>
                      <div>
                        <h4 className={`font-black text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{contact.name}</h4>
                        <p className="text-[10px] text-cyan-500 font-bold">{contact.category}</p>
                        <p className="text-[9px] text-slate-400">{contact.role}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-bold shadow-sm">
                      চ্যাট ➔
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
              {activeMessages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[82%] p-3 rounded-2xl text-xs space-y-1 ${
                    m.sender === 'me'
                      ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                      : m.sender === 'bot'
                      ? 'bg-slate-800 text-slate-100 border border-cyan-500/30 rounded-tl-none shadow-md'
                      : isDark ? 'bg-slate-800 text-slate-100 rounded-tl-none' : 'bg-slate-100 text-slate-900 rounded-tl-none'
                  }`}>
                    {m.sender === 'bot' && (
                      <span className="text-[10px] font-black text-cyan-400 block mb-0.5">🤖 AI সলিউশন:</span>
                    )}
                    <p className="whitespace-pre-line font-medium leading-relaxed">{m.text}</p>
                    <span className="text-[9px] opacity-70 block text-right font-mono">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Input Bar */}
          <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-1.5 shrink-0">
            <button className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-lg transition-colors" title="ছবি আপলোড">
              <Image size={16} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-lg transition-colors" title="ফাইল আপলোড">
              <Paperclip size={16} />
            </button>

            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="মেসেজ লিখুন..."
              className={`flex-1 px-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:border-cyan-500`}
            />

            <button 
              onClick={handleSend}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow transition-all shrink-0"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}

      {/* FACEBOOK DESKTOP STYLE STACKED CHAT HEADS (VERTICAL AVATARS) */}
      <div className="fixed bottom-24 right-6 z-[9999] flex flex-col-reverse items-end gap-3">
        {openChatIds.map((chatId) => {
          const contact = ALL_CONTACTS.find(c => c.id === chatId);
          if (!contact) return null;
          const isFocused = isOpen && focusedChatId === chatId;

          return (
            <div key={chatId} className="group relative flex items-center">
              {/* Tooltip on Hover */}
              <span className="absolute right-14 whitespace-nowrap bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-xl border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {contact.name}
              </span>

              {/* Chat Head Circular Avatar */}
              <div 
                onClick={() => handleOpenChatHead(chatId)}
                className={`w-12 h-12 shrink-0 rounded-full cursor-pointer relative transition-all duration-300 transform hover:scale-110 shadow-xl flex items-center justify-center ${
                  isFocused 
                    ? 'ring-4 ring-cyan-500 border-2 border-white dark:border-slate-900 scale-105' 
                    : 'border-2 border-white dark:border-slate-800 hover:ring-2 hover:ring-cyan-400'
                }`}
              >
                {contact.id === 'ai_solver' ? (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Bot size={22} />
                  </div>
                ) : (
                  <img src={contact.avatar} alt="" className="w-12 h-12 rounded-full object-cover shrink-0 shadow-inner" />
                )}

                {/* Online Dot Indicator */}
                {contact.online && (
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 absolute right-0 bottom-0 shadow-sm" />
                )}

                {/* Individual Close Button on Hover (X button to close individual chat head) */}
                <button
                  onClick={(e) => handleCloseChatHead(chatId, e)}
                  className="w-5 h-5 rounded-full bg-slate-900/90 text-white hover:bg-rose-600 border border-white/40 flex items-center justify-center absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                  title="এই চ্যাট বন্ধ করুন"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FLOATING GREEN EDIT PENCIL BUTTON (FACEBOOK EDIT BUTTON) */}
      <button
        onClick={() => {
          setViewMode('list');
          if (!isOpen) toggleOpen();
        }}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 rounded-[22px] shadow-[0_8px_30px_rgb(37,211,102,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-400/50 relative shrink-0 z-[9999]"
        title="নতুন চ্যাট শুরু করুন (Facebook Style Messenger)"
      >
        <Edit3 size={24} className="text-slate-950 fill-slate-955 stroke-[2.5]" />
      </button>

    </div>
  );
};
