import React, { useState, useEffect } from 'react';
import { Trophy, Star, Crown, TrendingUp, TrendingDown, Minus, Medal, Shield, Lock } from 'lucide-react';
import { LeaderboardEntry } from '../../types/types';
import { Link } from 'react-router-dom';
import { fetchLeaderboard } from '../../services/api';

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Daily');
  const [userPlan, setUserPlan] = useState('free');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      const userStr = localStorage.getItem('takeuup_user');
      if (userStr) {
          const u = JSON.parse(userStr);
          if (['monthly', 'yearly', 'premium', 'all-in-one'].includes(u.plan || u.Plan)) {
              setUserPlan('premium');
          } else {
              setUserPlan('free');
          }
      }
  }, []);

  useEffect(() => {
      const loadData = async () => {
          try {
              const data = await fetchLeaderboard();
              const list = Array.isArray(data) ? data : (data as any)?.$values || [];
              setLeaderboardData(list);
          } catch (e) {
              console.error("Failed to load leaderboard data", e);
          } finally {
              setLoading(false);
          }
      };
      loadData();
  }, [activeTab]);

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
      );
  }

  const activeList = leaderboardData;

  const topThree = activeList.slice(0, 3);
  
  // Free users only see up to rank 5 in the list
  const listData = userPlan === 'free' ? activeList.slice(3, 5) : activeList.slice(3);

  // Visual order for podium: 2nd, 1st, 3rd
  const visualTopThree = [];
  if (topThree[1]) visualTopThree.push(topThree[1]);
  if (topThree[0]) visualTopThree.push(topThree[0]);
  if (topThree[2]) visualTopThree.push(topThree[2]);

  return (
    <div className="relative bg-transparent pb-20 overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
            
            {/* Header */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                    Leaderboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-500">Legends</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">See who's leading the race to academic excellence.</p>
            </div>

            {/* Futuristic Tabs */}
            <div className="flex justify-center mb-16 animate-in fade-in zoom-in duration-500 delay-100">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex shadow-xl shadow-slate-200/50 dark:shadow-none">
                    {['Daily', 'Weekly', 'National'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                                activeTab === tab 
                                ? 'text-white shadow-lg scale-105' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            {activeTab === tab && (
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>

            {activeList.length > 0 ? (
                <>
                    {/* 3D Podium Section */}
                    <div className="flex items-end justify-center gap-4 md:gap-8 mt-12 mb-16 relative perspective-1000 h-[420px]">
                        {visualTopThree.map((user, index) => {
                            const isFirst = user.rank === 1;
                            const isSecond = user.rank === 2;
                            const isThird = user.rank === 3;
                            
                            return (
                                <div 
                                    key={user.id} 
                                    className={`flex flex-col items-center relative transition-transform duration-500 hover:scale-105 cursor-pointer group ${
                                        isFirst ? 'z-20 -mb-4' : 'z-10'
                                    }`}
                                >
                                    {/* Avatar Container */}
                                    <div className={`relative mb-4 ${isFirst ? 'animate-bounce-slow' : ''}`}>
                                        {isFirst && (
                                            <Crown 
                                                size={40} 
                                                className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] animate-pulse" 
                                                fill="currentColor" 
                                            />
                                        )}
                                        <div className={`p-1 rounded-full ${
                                            isFirst ? 'bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.4)]' : 
                                            isSecond ? 'bg-gradient-to-b from-slate-300 to-slate-500' : 
                                            'bg-gradient-to-b from-orange-400 to-orange-700'
                                        }`}>
                                            <img 
                                                src={user.avatar || 'https://picsum.photos/id/64/200'} 
                                                alt={user.name} 
                                                className={`rounded-full object-cover border-4 border-white dark:border-slate-900 ${
                                                    isFirst ? 'w-24 h-24 md:w-32 md:h-32' : 'w-20 h-20 md:w-24 md:h-24'
                                                }`} 
                                            />
                                        </div>
                                        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 border-white dark:border-slate-900 shadow-lg text-white ${
                                             isFirst ? 'bg-yellow-500' : isSecond ? 'bg-slate-500' : 'bg-orange-600'
                                        }`}>
                                            {user.rank}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="text-center mb-2">
                                        <h3 className={`font-bold truncate max-w-[120px] text-slate-900 dark:text-white ${isFirst ? 'text-lg' : 'text-sm'}`}>{user.name}</h3>
                                        <div className="flex items-center justify-center gap-1 text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-500/20 mt-1">
                                            <Trophy size={10} /> {user.points.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* 3D Pillar - Adaptive Gradient to Bottom */}
                                    <div className={`w-24 md:w-32 lg:w-40 rounded-t-2xl relative overflow-hidden backdrop-blur-sm border-t border-white/50 dark:border-white/20 shadow-2xl ${
                                        isFirst 
                                        ? 'h-48 bg-gradient-to-b from-yellow-200/80 to-slate-50 dark:from-yellow-900/40 dark:to-slate-900' 
                                        : isSecond 
                                        ? 'h-36 bg-gradient-to-b from-slate-200/80 to-slate-50 dark:from-slate-800/60 dark:to-slate-900' 
                                        : 'h-28 bg-gradient-to-b from-orange-200/80 to-slate-50 dark:from-orange-900/40 dark:to-slate-900'
                                    }`}>
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* List Section */}
                    <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 p-2 md:p-6 shadow-xl dark:shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-2">
                            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                            <div className="col-span-6 md:col-span-7">Student</div>
                            <div className="col-span-4 md:col-span-4 text-right pr-4">Points</div>
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 relative">
                            {listData.map((user) => (
                                <div 
                                    key={user.id} 
                                    className={`grid grid-cols-12 gap-4 items-center p-3 rounded-2xl transition-all duration-300 group hover:scale-[1.01] ${
                                        user.name === 'You' 
                                        ? 'bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                        : 'bg-slate-50 dark:bg-slate-800/20 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                                >
                                    {/* Rank */}
                                    <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center">
                                        <span className={`font-bold text-lg ${user.name === 'You' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400'}`}>#{user.rank}</span>
                                        <div className="flex items-center justify-center mt-1">
                                            {user.trend === 'up' && <TrendingUp size={12} className="text-green-500 dark:text-green-400" />}
                                            {user.trend === 'down' && <TrendingDown size={12} className="text-red-500 dark:text-red-400" />}
                                            {user.trend === 'same' && <Minus size={12} className="text-slate-400 dark:text-slate-500" />}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="col-span-6 md:col-span-7 flex items-center gap-4">
                                        <div className="relative">
                                            <img src={user.avatar || 'https://picsum.photos/id/64/200'} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-650 group-hover:border-slate-300 dark:group-hover:border-slate-550 transition-colors" />
                                            {user.name === 'You' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white dark:border-slate-900" />}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-sm md:text-base ${user.name === 'You' ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                                {user.name} {user.name === 'You' && '(You)'}
                                            </h4>
                                            <p className="text-xs text-slate-500">{user.institution || 'Dhaka College'}</p>
                                        </div>
                                    </div>

                                    {/* Points */}
                                    <div className="col-span-4 md:col-span-4 text-right pr-4">
                                        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-550 transition-colors">
                                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{user.points.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Free User Blur Overlay */}
                            {userPlan === 'free' && (
                                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent flex items-end justify-center pb-8 z-10">
                                    <Link to="/pricing" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2">
                                        <Lock size={16} /> Unlock Full Leaderboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/40">
                    <Trophy size={48} className="mb-4 opacity-50 text-cyan-500" />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No Entries Found</h3>
                    <p className="text-slate-500">There are no student points submitted in the database yet.</p>
                </div>
            )}
        </div>
        
        <style>{`
            @keyframes bounce-slow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .animate-bounce-slow {
                animation: bounce-slow 3s infinite ease-in-out;
            }
        `}</style>
    </div>
  );
};