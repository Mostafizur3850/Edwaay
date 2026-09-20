import React, { useState } from 'react';
import { 
  Search, MoreHorizontal, Edit3, MessageSquare, X, Minus, Send, Bot, 
  Sparkles, Image, Paperclip, CheckCircle2, User, ChevronDown
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface FacebookRightMessengerSidebarProps {
  user?: any;
}

export const FacebookRightMessengerSidebar: React.FC<FacebookRightMessengerSidebarProps> = ({ user }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatContact, setActiveChatContact] = useState<any | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mentor' | 'ai_solver'>('mentor');
  const [inputText, setInputText] = useState('');

  // Online Contacts List matching Facebook Sidebar
  const CONTACTS = [
    {
      id: 'c1',
      name: 'ডঃ সাইফুর রহমান',
      subject: 'পদার্থবিজ্ঞান মেন্টর',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'Physics Senior Mentor',
    },
    {
      id: 'c2',
      name: 'তানভীর আহমেদ',
      subject: 'রসায়ন শিক্ষক (BUET)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'Chemistry Lead',
    },
    {
      id: 'c3',
      name: 'ফারহানা ইসলাম',
      subject: 'উচ্চতর গণিত শিক্ষিকা',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'Math Expert',
    },
    {
      id: 'c4',
      name: 'ডাঃ সানজিদা আক্তার',
      subject: 'বায়োলজি মেন্টর (DMC)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'Medical Faculty',
    },
    {
      id: 'c5',
      name: 'মেহেদী হাসান (সহপাঠী)',
      subject: 'HSC 2026 Batch',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      online: true,
      role: 'Student Peer',
    }
  ];

  // Chat History
  const [messages, setMessages] = useState<Record<string, Array<{ id: string; sender: 'me' | 'other' | 'bot'; text: string; time: string }>>>({
    c1: [
      { id: '1', sender: 'other', text: 'আসসালামু আলাইকুম! ফিজিক্সের কোনো ম্যাথে কি সমস্যা পাচ্ছো?', time: '১০:৩০ AM' },
      { id: '2', sender: 'me', text: 'স্যার, নিউটোনীয় বলবিদ্যার ব্যাংকিং কোণের ম্যাথটা বুঝতে সাহায্য দরকার ছিল।', time: '১০:৩২ AM' }
    ],
    ai_solver: [
      { id: 'ai1', sender: 'bot', text: 'আসসালামু আলাইকুম! আমি টেকআপ AI ডাউট সলভার। তোমার গণিত, ফিজিক্স বা কেমিস্ট্রির যেকোনো প্রশ্ন বা ফটো পাঠাও, সাথে সাথে উত্তর পেয়ে যাবে! 🚀', time: '১০:০০ AM' }
    ]
  });

  const handleOpenChat = (contact: any) => {
    setActiveChatContact(contact);
    setIsChatOpen(true);
    setActiveTab('mentor');
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const currentKey = activeTab === 'ai_solver' ? 'ai_solver' : (activeChatContact?.id || 'c1');
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

    const query = inputText;
    setInputText('');

    if (activeTab === 'ai_solver') {
      setTimeout(() => {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot' as const,
          text: `ধন্যবাদ! তোমার প্রশ্ন: "${query}"-এর সমাধান:\n\n১. সূত্র: v² = u² + 2as\n২. হিসাব: a = 2m/s², s = 25m\n\nঅন্য প্রশ্ন থাকলে নির্দ্বিধায় পাঠাও!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({
          ...prev,
          ai_solver: [...(prev.ai_solver || []), botMsg]
        }));
      }, 1000);
    }
  };

  const filteredContacts = CONTACTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessagesList = activeTab === 'ai_solver'
    ? (messages['ai_solver'] || [])
    : (messages[activeChatContact?.id || 'c1'] || []);

  return (
    <>
      {/* 1. RIGHT SIDEBAR MATCHING FACEBOOK MESSENGER CONTACTS */}
      <aside className={`fixed right-0 top-0 h-screen w-72 border-l ${
        isDark ? 'bg-[#0e1628] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      } flex flex-col justify-between z-40 backdrop-blur-xl transition-all duration-300 hidden xl:flex shrink-0`}>
        
        <div className="p-3.5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Header Bar matching Screenshot */}
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xs hidden lg:block tracking-wide text-slate-800 dark:text-slate-200">
              মেসেজিং ও মেন্টর (Contacts)
            </h3>
            <div className="flex items-center gap-1 mx-auto lg:mx-0 text-slate-500">
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="সার্চ করুন">
                <Search size={16} />
              </button>
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="অপশন">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Search Box (Expanded on Large Screen) */}
          <div className="relative hidden lg:block">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিক্ষক বা সহপাঠী খুঁজুন..."
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
              } focus:outline-none focus:border-cyan-500`}
            />
          </div>

          {/* AI Solver Quick Launcher Card */}
          <div 
            onClick={() => {
              setActiveChatContact(null);
              setActiveTab('ai_solver');
              setIsChatOpen(true);
            }}
            className={`p-2.5 rounded-2xl cursor-pointer border transition-all flex items-center gap-3 ${
              isDark ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20' : 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow">
              <Bot size={18} />
            </div>
            <div className="hidden lg:block min-w-0">
              <h4 className="font-black text-xs text-cyan-500 dark:text-cyan-400 flex items-center gap-1">
                টেকআপ AI ডাউট <Sparkles size={12} className="text-amber-400" />
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate">২৪/৭ প্রশ্ন সমাধান</p>
            </div>
          </div>

          {/* Contacts Avatar List matching Screenshot */}
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:block px-1 mb-2">
              অনলাইন মেন্টর ও সহপাঠী ({filteredContacts.length})
            </span>

            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleOpenChat(contact)}
                className={`p-2 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${
                  activeChatContact?.id === contact.id && isChatOpen
                    ? 'bg-cyan-500/15 text-cyan-400 font-bold'
                    : isDark ? 'hover:bg-slate-800/80' : 'hover:bg-slate-100'
                }`}
              >
                {/* Circular Avatar with Green Dot matching Screenshot */}
                <div className="relative shrink-0 mx-auto lg:mx-0">
                  <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm" />
                  {contact.online && (
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute right-0 bottom-0" />
                  )}
                </div>

                <div className="hidden lg:block min-w-0">
                  <h4 className="font-bold text-xs leading-tight truncate text-slate-800 dark:text-slate-200">
                    {contact.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{contact.subject}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Floating Circular Edit/Pencil Chat Button matching Screenshot at bottom-right */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => {
              if (!activeChatContact) setActiveChatContact(CONTACTS[0]);
              setIsChatOpen(!isChatOpen);
            }}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95 mx-auto lg:mx-0"
            title="নতুন মেসেজ লিখুন"
          >
            <Edit3 size={18} />
          </button>
        </div>

      </aside>

      {/* 2. FACEBOOK MESSENGER POPUP CHAT BOX */}
      {isChatOpen && (
        <div className={`fixed bottom-4 right-4 sm:right-80 z-50 w-80 sm:w-88 h-[480px] ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        } border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`}>
          
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-2.5 min-w-0">
              {activeTab === 'ai_solver' ? (
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <Bot size={18} />
                </div>
              ) : (
                <div className="relative shrink-0">
                  <img src={activeChatContact?.avatar || CONTACTS[0].avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 absolute right-0 bottom-0" />
                </div>
              )}

              <div className="truncate">
                <h4 className="font-black text-xs truncate">
                  {activeTab === 'ai_solver' ? 'টেকআপ AI ডাউট সলভার' : (activeChatContact?.name || CONTACTS[0].name)}
                </h4>
                <p className="text-[10px] text-white/80 font-bold truncate">
                  {activeTab === 'ai_solver' ? '⚡ ইনস্ট্যান্ট ২৪/৭ সমাধান' : '● অনলাইন আছেন'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <Minus size={16} />
              </button>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className={`p-1 border-b ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} flex`}>
            <button
              onClick={() => setActiveTab('mentor')}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                activeTab === 'mentor' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              👨‍🏫 মেন্টর চ্যাট
            </button>
            <button
              onClick={() => setActiveTab('ai_solver')}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1 ${
                activeTab === 'ai_solver' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles size={12} /> AI সলভার
            </button>
          </div>

          {/* Message Bubbles */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
            {activeMessagesList.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[84%] p-3 rounded-2xl text-xs space-y-1 ${
                  m.sender === 'me'
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                    : m.sender === 'bot'
                    ? 'bg-slate-800 text-slate-100 border border-cyan-500/30 rounded-tl-none'
                    : isDark ? 'bg-slate-800 text-slate-100 rounded-tl-none' : 'bg-slate-100 text-slate-900 rounded-tl-none'
                }`}>
                  {m.sender === 'bot' && <span className="text-[10px] font-black text-cyan-400 block mb-0.5">🤖 AI সমাধান:</span>}
                  <p className="whitespace-pre-line font-medium leading-relaxed">{m.text}</p>
                  <span className="text-[9px] opacity-70 block text-right font-mono">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Input */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-1.5">
            <button className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-lg transition-colors">
              <Image size={16} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-lg transition-colors">
              <Paperclip size={16} />
            </button>

            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="মেসেজ লিখুন..."
              className={`flex-1 px-3 py-1.5 rounded-xl text-xs border ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:border-cyan-500`}
            />

            <button 
              onClick={handleSend}
              className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow transition-all shrink-0"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
