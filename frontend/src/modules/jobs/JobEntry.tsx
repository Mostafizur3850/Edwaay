import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, ArrowRight, Building2, Users, GraduationCap, Code, PenTool, Globe, BookOpen, Lightbulb, Rocket, Monitor } from 'lucide-react';

// Floating Icon Component
const FloatingIcon = ({ icon: Icon, delay, duration, top, left, size, color }: any) => (
    <div 
        className="absolute opacity-20 animate-float"
        style={{
            top: top,
            left: left,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
        }}
    >
        <Icon size={size} className={color} />
    </div>
);

export const JobEntry = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden perspective-1000">
      
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] z-0" />
      
      {/* Stars / Particles */}
      <div className="absolute inset-0 z-0">
          {[...Array(50)].map((_, i) => (
            <div 
                key={i}
                className="absolute bg-white rounded-full opacity-30 animate-pulse"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`
                }}
            />
          ))}
      </div>

      {/* Nebula Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[10s]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[8s]" />

      {/* Dynamic Floating Icons Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <FloatingIcon icon={GraduationCap} top="15%" left="10%" size={48} color="text-pink-500" delay={0} duration={12} />
          <FloatingIcon icon={Code} top="25%" left="85%" size={40} color="text-cyan-500" delay={2} duration={15} />
          <FloatingIcon icon={Briefcase} top="65%" left="5%" size={56} color="text-violet-500" delay={1} duration={18} />
          <FloatingIcon icon={Globe} top="75%" left="80%" size={64} color="text-blue-500" delay={3} duration={20} />
          <FloatingIcon icon={PenTool} top="10%" left="60%" size={32} color="text-orange-500" delay={0.5} duration={14} />
          <FloatingIcon icon={BookOpen} top="85%" left="30%" size={48} color="text-emerald-500" delay={4} duration={16} />
          <FloatingIcon icon={Lightbulb} top="40%" left="90%" size={36} color="text-yellow-500" delay={2.5} duration={13} />
          <FloatingIcon icon={Rocket} top="50%" left="15%" size={50} color="text-red-500" delay={1.5} duration={17} />
          <FloatingIcon icon={Monitor} top="5%" left="40%" size={42} color="text-indigo-400" delay={3.5} duration={19} />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Find Job Card */}
        <Link to="/jobs/search" className="group relative bg-[#151921]/80 backdrop-blur-xl rounded-[2.5rem] p-12 border border-white/10 hover:border-violet-500/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(139,92,246,0.25)] hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center">
            {/* Inner Glow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Animated Icon Container */}
            <div className="w-32 h-32 bg-[#1E2330] rounded-3xl flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-transform duration-500 group-hover:border-violet-500/50 shadow-2xl relative">
                <div className="absolute inset-0 bg-violet-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Search size={56} className="text-violet-400 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 group-hover:text-violet-400 transition-colors tracking-tight">Find a Job</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-sm leading-relaxed font-light">
                Discover thousands of internships and entry-level opportunities tailored for students.
            </p>
            
            <span className="flex items-center gap-3 text-violet-400 font-bold group-hover:gap-5 transition-all text-lg bg-[#1E2330] px-10 py-4 rounded-full border border-white/10 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-500 shadow-xl group-hover:shadow-violet-600/40">
                I'm a Candidate <ArrowRight size={20} />
            </span>
        </Link>

        {/* Post Job Card */}
        <Link to="/jobs/create" className="group relative bg-[#151921]/80 backdrop-blur-xl rounded-[2.5rem] p-12 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(6,182,212,0.25)] hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center">
            {/* Inner Glow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Animated Icon Container */}
            <div className="w-32 h-32 bg-[#1E2330] rounded-3xl flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-transform duration-500 group-hover:border-cyan-500/50 shadow-2xl relative">
                <div className="absolute inset-0 bg-cyan-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Briefcase size={56} className="text-cyan-400 relative z-10 group-hover:-rotate-12 transition-transform duration-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 group-hover:text-cyan-400 transition-colors tracking-tight">Post a Job</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-sm leading-relaxed font-light">
                Hire the best talent from top universities. Post internships and entry-level jobs easily.
            </p>
            
            <span className="flex items-center gap-3 text-cyan-400 font-bold group-hover:gap-5 transition-all text-lg bg-[#1E2330] px-10 py-4 rounded-full border border-white/10 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-500 shadow-xl group-hover:shadow-cyan-600/40">
                I'm an Employer <ArrowRight size={20} />
            </span>
        </Link>

      </div>
      
      <div className="absolute bottom-10 text-slate-500 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
          Select your role to continue
      </div>

      <style>{`
        @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(15px, -25px) rotate(5deg); }
            66% { transform: translate(-10px, 15px) rotate(-5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-float {
            animation: float 10s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};