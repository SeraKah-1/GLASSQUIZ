import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Zap, Calendar, Star, Lock } from 'lucide-react';
import { getSavedQuizzes } from '../services/storageService';

// --- RELATIONSHIP DATA ---
// Leveling logic: 0 quizzes (Stranger) -> 3 (Acquaintance) -> 7 (Friend) -> 15 (Bestie) -> 30 (Soulmate)

const RELATIONSHIP_STAGES = [
  {
    minXp: 0,
    title: "AI Assistant",
    color: "text-slate-500",
    bg: "bg-slate-100",
    faces: ["( . _ . )", "( ? _ ? )", "( o _ o )"],
    dialogues: [
      "Halo. Saya siap memproses data.",
      "Silakan upload dokumen untuk memulai.",
      "Sistem berjalan normal. Menunggu input..."
    ]
  },
  {
    minXp: 3,
    title: "Teman Belajar",
    color: "text-indigo-500",
    bg: "bg-indigo-100",
    faces: ["( ◕ ‿ ◕ )", "( ^ _ ^ )", "( ｡ • ̀ᴗ-)"],
    dialogues: [
      "Senang melihatmu kembali!",
      "Ayo belajar lagi, aku bantu ya!",
      "Kamu mulai rajin nih, keren."
    ]
  },
  {
    minXp: 8,
    title: "Sahabat Dekat",
    color: "text-pink-500",
    bg: "bg-pink-100",
    faces: ["( ✧ ▽ ✧ )", "( ´ ▽ ` )ﾉ", "٩( ◕ ᗜ ◕ )و"],
    dialogues: [
      "Yey! Akhirnya kamu datang juga!",
      "Aku udah siapin soal seru buat kamu!",
      "Jangan lupa istirahat ya bestie, tapi kerjain 1 kuis dulu hehe."
    ]
  },
  {
    minXp: 20,
    title: "Soulmate Akademik",
    color: "text-rose-600",
    bg: "bg-rose-100",
    faces: ["(づ ◕ ᗜ ◕ )づ", "( ♥ ◡ ♥ )", "( ˘ ³˘)♥"],
    dialogues: [
      "Aku kangen banget! Seharian nungguin kamu lho...",
      "Kamu pintar banget sih, aku bangga jadi AI kamu!",
      "Dunia butuh orang pintar kayak kamu. Semangat sayang! <3"
    ]
  }
];

export const DashboardMascot: React.FC<{ onOpenScheduler: () => void }> = ({ onOpenScheduler }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [face, setFace] = useState("( . _ . )");
  const [message, setMessage] = useState("Loading...");
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ totalQuizzes: 0, nextLevelGap: 1 });

  // 1. Calculate Friendship Level
  useEffect(() => {
    const history = getSavedQuizzes();
    const totalQuizzes = history.length;
    
    // Find current stage
    let currentStageIdx = 0;
    RELATIONSHIP_STAGES.forEach((stage, idx) => {
      if (totalQuizzes >= stage.minXp) {
        currentStageIdx = idx;
      }
    });

    setStageIndex(currentStageIdx);
    setStats(prev => ({ ...prev, totalQuizzes }));

    // Pick random face & dialogue for this stage
    const stageData = RELATIONSHIP_STAGES[currentStageIdx];
    const randomFace = stageData.faces[Math.floor(Math.random() * stageData.faces.length)];
    const randomMsg = stageData.dialogues[Math.floor(Math.random() * stageData.dialogues.length)];
    
    setFace(randomFace);
    setMessage(randomMsg);

    // Calculate Progress Bar to Next Level
    const nextStage = RELATIONSHIP_STAGES[currentStageIdx + 1];
    if (nextStage) {
      const currentLevelStart = stageData.minXp;
      const nextLevelStart = nextStage.minXp;
      const range = nextLevelStart - currentLevelStart;
      const currentPos = totalQuizzes - currentLevelStart;
      const percent = Math.min(100, Math.max(5, (currentPos / range) * 100));
      setProgress(percent);
    } else {
      setProgress(100); // Max level
    }

  }, []);

  // 2. Animate Face (Blinking/Looking)
  useEffect(() => {
    const stageData = RELATIONSHIP_STAGES[stageIndex];
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const randomFace = stageData.faces[Math.floor(Math.random() * stageData.faces.length)];
        setFace(randomFace);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [stageIndex]);

  const currentStage = RELATIONSHIP_STAGES[stageIndex];
  const nextStage = RELATIONSHIP_STAGES[stageIndex + 1];

  return (
    <div className="relative w-full mb-8">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center shadow-xl shadow-indigo-500/5 relative overflow-hidden"
      >
        {/* Background Aura based on affinity */}
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-40 transition-colors duration-1000 ${currentStage.bg.replace('bg-', 'bg-')}`} />

        {/* --- LEFT: AVATAR --- */}
        <div className="flex flex-col items-center justify-center md:mr-8 mb-6 md:mb-0 shrink-0 z-10">
          <motion.div
            key={face}
            animate={{ 
              y: [0, -4, 0],
              rotate: stageIndex > 2 ? [0, 3, -3, 0] : 0 // Only wiggle if close friend
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`
              text-4xl md:text-5xl font-black tracking-widest bg-white/60 
              w-24 h-24 flex items-center justify-center rounded-full 
              shadow-inner border border-white/80 transition-colors duration-500
              ${currentStage.color}
            `}
          >
            <div className="whitespace-nowrap scale-110">{face}</div>
          </motion.div>
          
          {/* Rank Badge */}
          <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border border-white/50 ${currentStage.bg} ${currentStage.color}`}>
             {currentStage.title}
          </div>
        </div>

        {/* --- RIGHT: DIALOGUE & PROGRESS --- */}
        <div className="flex-1 w-full z-10">
           {/* Dialogue Bubble */}
           <div className="bg-white/70 rounded-2xl rounded-tl-sm p-5 shadow-sm border border-white/60 relative mb-4">
             <p className="text-slate-700 font-medium leading-relaxed italic">
               "{message}"
             </p>
           </div>

           {/* Progress / Heart Bar */}
           <div className="space-y-2">
             <div className="flex justify-between items-end px-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center">
                 <Heart size={12} className={`mr-1 ${stageIndex >= 3 ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-300'}`} />
                 Kedekatan
               </span>
               <span className="text-xs font-bold text-indigo-400">
                 {stats.totalQuizzes} <span className="text-slate-300 font-normal">Sesi</span>
               </span>
             </div>

             <div className="h-3 w-full bg-slate-200/50 rounded-full overflow-hidden relative border border-white/50">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className={`h-full rounded-full ${stageIndex >= 3 ? 'bg-gradient-to-r from-rose-400 to-pink-500' : 'bg-gradient-to-r from-indigo-300 to-indigo-500'}`}
               />
               
               {/* Shine effect */}
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
             </div>

             <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>Lv.{stageIndex}</span>
                {nextStage ? (
                   <span className="flex items-center opacity-70">
                     Next: {nextStage.title} <Lock size={8} className="ml-1" />
                   </span>
                ) : (
                  <span className="flex items-center text-rose-500 font-bold">
                    Max Level! <Sparkles size={8} className="ml-1" />
                  </span>
                )}
             </div>
           </div>

           {/* Action Buttons */}
           <div className="mt-5 flex gap-3">
             <button 
                onClick={onOpenScheduler}
                className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm"
             >
               <Calendar size={14} className="mr-2" />
               Janji Temu (Jadwal)
             </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};