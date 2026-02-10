import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Download, RotateCcw, Share2, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizResult, Question } from '../types';
import { GlassButton } from './GlassButton';
import { useGameSound } from '../hooks/useGameSound';

interface ResultScreenProps {
  result: QuizResult;
  questions: Question[]; // Need full questions for export/review
  onReset: () => void;
  onRetryMistakes: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, questions, onReset, onRetryMistakes }) => {
  const percentage = Math.round((result.correctCount / result.totalQuestions) * 100);
  const { playFanfare, playClick } = useGameSound();
  
  let gradeColor = "text-indigo-600";
  let gradeMessage = "Luar Biasa";
  
  if (percentage < 60) {
    gradeColor = "text-amber-600";
    gradeMessage = "Perlu Latihan Lagi";
  } else if (percentage < 80) {
    gradeColor = "text-emerald-600";
    gradeMessage = "Bagus";
  }

  const wrongAnswersCount = result.totalQuestions - result.correctCount;

  useEffect(() => {
    // Play sound if score is good
    if (percentage >= 60) {
      playFanfare();
    }

    // Trigger Confetti (Optimized: Single burst instead of interval loop)
    if (percentage >= 70) {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
      confetti({
        ...defaults,
        particleCount: 50, // Reduced count
        origin: { y: 0.6 }
      });

      // Small secondary burst after 300ms
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 30,
          origin: { y: 0.6 }
        });
      }, 300);
    }
  }, [percentage, playFanfare]);

  const handleDownload = () => {
    playClick();
    const content = questions.map((q, i) => {
      const answer = result.answers.find(a => a.questionId === q.id);
      const isCorrect = answer?.isCorrect;
      return `
[NO. ${i + 1}] ${isCorrect ? "✅ BENAR" : "❌ SALAH"}
Q: ${q.text}
A: ${q.options[q.correctIndex]}
Info: ${q.explanation}
-----------------------------------`;
    }).join('\n');

    const header = `HASIL GLASSQUIZ AI\nSkor: ${percentage}%\nBenar: ${result.correctCount}/${result.totalQuestions}\n\n`;
    const blob = new Blob([header + content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GlassQuiz-Result-${Date.now()}.txt`;
    a.click();
  };

  const handleShare = () => {
    playClick();
    const text = `Saya baru saja mendapatkan skor ${percentage}% di GlassQuiz AI! 🧠✨`;
    navigator.clipboard.writeText(text);
    alert("Teks disalin ke clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto text-center px-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/30 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/10 mb-8"
      >
        <h2 className="text-slate-500 font-medium mb-8 tracking-wide uppercase text-sm">Hasil Akhir</h2>
        
        <div className="relative inline-block mb-8">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              className="text-white/40"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r="88"
              cx="96"
              cy="96"
            />
            <motion.circle
              className={percentage < 60 ? "text-amber-400" : percentage < 80 ? "text-emerald-400" : "text-indigo-400"}
              strokeWidth="12"
              strokeDasharray={552}
              strokeDashoffset={552 - (552 * percentage) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="88"
              cx="96"
              cy="96"
              initial={{ strokeDashoffset: 552 }}
              animate={{ strokeDashoffset: 552 - (552 * percentage) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="text-5xl font-light text-slate-800">{percentage}%</span>
          </div>
        </div>

        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
          <h3 className={`text-2xl font-medium ${gradeColor} mb-2`}>{gradeMessage}</h3>
          <p className="text-slate-500 mb-8">
            Kamu menjawab <span className="font-bold text-slate-700">{result.correctCount}</span> benar dari <span className="font-bold text-slate-700">{result.totalQuestions}</span> soal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            {/* Review Mistakes Button (Only if there are mistakes) */}
            {wrongAnswersCount > 0 && (
              <GlassButton 
                onClick={() => { playClick(); onRetryMistakes(); }} 
                variant="danger" 
                className="flex items-center justify-center col-span-1 md:col-span-2"
              >
                <RotateCcw size={18} className="mr-2" />
                Perbaiki {wrongAnswersCount} Kesalahan
              </GlassButton>
            )}

            <GlassButton 
              onClick={() => { playClick(); onReset(); }} 
              variant="primary" 
              className="flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" />
              Quiz Baru
            </GlassButton>

             <GlassButton 
              onClick={handleDownload} 
              variant="secondary" 
              className="flex items-center justify-center"
            >
              <Download size={18} className="mr-2" />
              Simpan Soal
            </GlassButton>
          </div>

          <div className="mt-6 flex justify-center">
             <button onClick={handleShare} className="text-slate-400 hover:text-indigo-500 text-xs flex items-center transition-colors">
               <Share2 size={12} className="mr-1" /> Bagikan Skor
             </button>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};