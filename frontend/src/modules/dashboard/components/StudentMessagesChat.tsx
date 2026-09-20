import React, { useState } from 'react';
import { 
  MessageSquare, Send, Bot, User, Image, Paperclip, CheckCheck, Sparkles, 
  HelpCircle, Clock, Search, ShieldCheck, ThumbsUp, MessageCircle
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface StudentMessagesChatProps {
  user?: any;
}

export const StudentMessagesChat: React.FC<StudentMessagesChatProps> = ({ user }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeChatTab, setActiveChatTab] = useState<'mentor' | 'ai_solver' | 'peers'>('mentor');

  // Chat Conversations List
  const MENTOR_CHATS = [
    {
      id: 'm1',
      name: 'ডঃ সাইফুর রহমান (পদার্থবিজ্ঞান শিক্ষক)',
      role: 'সিনিয়র মেন্টর',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'ভেক্টরের ডট গুণন ও ক্রস গুণনের পার্থক্যটি আবার রিভিশন দাও।',
      time: '১০:৪৫ AM',
      unread: 2,
      online: true,
    },
    {
      id: 'm2',
      name: 'তানভীর আহমেদ (রসায়ন মেন্টর)',
      role: 'BUET CSE Batch 21',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'জৈব রসায়নের বিক্রিয়াগুলোর পিডিএফ নোট পাঠিয়েছি।',
      time: 'গতকাল',
      unread: 0,
      online: false,
    }
  ];

  const [selectedContact, setSelectedContact] = useState<any>(MENTOR_CHATS[0]);
  const [inputText, setInputText] = useState('');
  
  // Messages History
  const [messagesHistory, setMessagesHistory] = useState<Record<string, Array<{ id: string; sender: 'me' | 'other' | 'bot'; text: string; time: string }>>>({
    m1: [
      { id: '1', sender: 'other', text: 'আসসালামু আলাইকুম! পদার্থবিজ্ঞান ১ম পত্রের কোন টপিকে সমস্যা আছে?', time: '১০:৪০ AM' },
      { id: '2', sender: 'me', text: 'স্যার, নিউটোনীয় বলবিদ্যার ব্যাংকিং কোণের ম্যাথগুলো নিয়ে একটু সংশয় ছিল।', time: '১০:৪২ AM' },
      { id: '3', sender: 'other', text: 'ভেক্টরের ডট গুণন ও ক্রস গুণনের পার্থক্যটি আবার রিভিশন দাও। v = √(rg tanθ) সূত্রটি সবসময় মনে রাখবে।', time: '১০:৪৫ AM' }
    ],
    ai_solver: [
      { id: 'ai1', sender: 'bot', text: 'হ্যালো! আমি টেকআপ AI ডাউট সলভার। তোমার গণিত, পদার্থ, রসায়ন বা যেকোনো জটিল প্রশ্নের ছবি বা টেক্সট লিখে পাঠাও, সাথে সাথে উত্তর বুঝিয়ে দেবো! 🚀', time: '১০:০০ AM' }
    ]
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const currentKey = activeChatTab === 'ai_solver' ? 'ai_solver' : selectedContact.id;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesHistory(prev => ({
      ...prev,
      [currentKey]: [...(prev[currentKey] || []), newMsg]
    }));

    const userQuery = inputText;
    setInputText('');

    // AI Instant Reply Logic
    if (activeChatTab === 'ai_solver') {
      setTimeout(() => {
        const botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot' as const,
          text: `ধন্যবাদ! তোমার প্রশ্ন: "${userQuery}"-এর সমাধান:\n\n১. সূত্র প্রয়োগ: F = ma\n২. মান বসানো: m = 5kg, a = 2m/s²\n৩. উত্তর: F = 10 N (নিউটন)।\n\nঅন্য কোনো প্রশ্ন থাকলে নির্দ্বিধায় জিজ্ঞাসা করো!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessagesHistory(prev => ({
          ...prev,
          ai_solver: [...(prev.ai_solver || []), botReply]
        }));
      }, 1000);
    }
  };

  const currentMessages = activeChatTab === 'ai_solver' 
    ? (messagesHistory['ai_solver'] || []) 
    : (messagesHistory[selectedContact?.id] || []);

  return (
    <div className={`${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'} border rounded-3xl p-4 lg:p-6 shadow-xl space-y-5 animate-in fade-in duration-300`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2.5">
            <MessageSquare className="text-cyan-500" /> মেসেজ ও ডাউট সলভার চ্যাট
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">মেন্টর, সহপাঠী ও টেকআপ AI-এর সাথে সরাসরি ডাউট সমাধান করো</p>
        </div>

        {/* Tab Switchers */}
        <div className={`p-1 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} inline-flex`}>
          <button
            onClick={() => setActiveChatTab('mentor')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeChatTab === 'mentor' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👨‍🏫 মেন্টর চ্যাট
          </button>
          <button
            onClick={() => setActiveChatTab('ai_solver')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeChatTab === 'ai_solver' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={14} /> AI ডাউট সলভার
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[520px]">
        
        {/* Left Column: Contact List (Hidden in AI mode) */}
        {activeChatTab !== 'ai_solver' && (
          <div className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3 flex flex-col justify-between space-y-3`}>
            
            {/* Search Contact */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="শিক্ষক বা সহপাঠী খুঁজুন..."
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                } focus:outline-none focus:border-cyan-500`}
              />
            </div>

            {/* List */}
            <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-1">
              {MENTOR_CHATS.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center gap-3 ${
                    selectedContact?.id === contact.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold'
                      : isDark ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-900' : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="relative">
                    <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    {contact.online && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 absolute right-0 bottom-0" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black truncate">{contact.name}</h4>
                      <span className="text-[10px] text-slate-400">{contact.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{contact.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center">
              <p className="text-[11px] text-cyan-600 dark:text-cyan-300 font-bold">💡 ক্লাসের যেকোনো সমস্যা শিক্ষককে সরাসরি মেসেজ করো</p>
            </div>
          </div>
        )}

        {/* Right Column: Active Conversation */}
        <div className={`${activeChatTab === 'ai_solver' ? 'lg:col-span-3' : 'lg:col-span-2'} ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        } border rounded-2xl flex flex-col overflow-hidden`}>
          
          {/* Active Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/50 dark:bg-slate-900/50">
            {activeChatTab === 'ai_solver' ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-cyan-400 flex items-center gap-1.5">
                    টেকআপ AI ইনস্ট্যান্ট ডাউট সলভার <Sparkles size={14} className="text-amber-400" />
                  </h3>
                  <p className="text-[10px] text-slate-400">২৪/৭ সরাসরি উত্তর ও গণিত/বিজ্ঞান সলিউশন</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img src={selectedContact?.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-cyan-500/30" />
                <div>
                  <h3 className="font-black text-sm">{selectedContact?.name}</h3>
                  <p className="text-[10px] text-emerald-400 font-bold">{selectedContact?.online ? '● অনলাইন আছেন' : '● অফলাইন'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar">
            {currentMessages.map((m) => (
              <div 
                key={m.id}
                className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs space-y-1 ${
                  m.sender === 'me'
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                    : m.sender === 'bot'
                    ? 'bg-gradient-to-br from-slate-900 to-indigo-950 text-slate-100 border border-cyan-500/30 rounded-tl-none shadow-lg'
                    : isDark ? 'bg-slate-900 border-slate-800 text-slate-100 rounded-tl-none' : 'bg-white border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
                }`}>
                  {m.sender === 'bot' && (
                    <div className="flex items-center gap-1.5 text-cyan-400 font-black text-[11px] mb-1">
                      <Bot size={14} /> টেকআপ AI সলিউশন:
                    </div>
                  )}
                  <p className="whitespace-pre-line font-medium leading-relaxed">{m.text}</p>
                  <span className="text-[9px] opacity-70 block text-right font-mono">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-cyan-500 rounded-xl transition-colors" title="ছবি আপলোড করুন">
              <Image size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-cyan-500 rounded-xl transition-colors" title="ফাইল যুক্ত করুন">
              <Paperclip size={18} />
            </button>

            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={activeChatTab === 'ai_solver' ? "যেকোনো প্রশ্নের সমাধান চান? এখানে লিখুন..." : "মেসেজ লিখুন..."}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs border ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              } focus:outline-none focus:border-cyan-500`}
            />

            <button 
              onClick={handleSendMessage}
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-md transition-all shrink-0"
            >
              <Send size={16} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
