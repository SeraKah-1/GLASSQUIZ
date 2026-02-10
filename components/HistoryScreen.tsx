import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Trash2, ArrowRight, Clock, Box } from 'lucide-react';
import { getSavedQuizzes, clearHistory } from '../services/storageService';

interface HistoryScreenProps {
  onLoadHistory: (quiz: any) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onLoadHistory }) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setHistory(getSavedQuizzes());
  }, []);

  const handleClear = () => {
    if (confirm("Hapus semua riwayat?")) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-24 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <History className="mr-3 text-indigo-600" /> Riwayat Belajar
        </h2>
        {history.length > 0 && (
          <button onClick={handleClear} className="text-sm text-rose-500 hover:text-rose-700 flex items-center bg-rose-50 px-3 py-1.5 rounded-lg">
            <Trash2 size={14} className="mr-2" /> Hapus Semua
          </button>
        )}
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/30 backdrop-blur-md rounded-3xl border border-white/50"
          >
            <Box size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Belum ada quiz yang tersimpan.</p>
          </motion.div>
        ) : (
          history.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onLoadHistory(item)}
              className="bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-indigo-500/10 group relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="flex justify-between items-start">
                 <div>
                   <div className="flex items-center space-x-2 mb-2">
                     <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                       {item.mode}
                     </span>
                     <span className="text-xs text-slate-400 flex items-center">
                       <Clock size={12} className="mr-1" />
                       {new Date(item.date).toLocaleDateString()}
                     </span>
                   </div>
                   <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                     {item.fileName}
                   </h3>
                   <p className="text-sm text-slate-500">
                     {item.questionCount} Soal • Topik: {item.topicSummary}
                   </p>
                 </div>
                 
                 <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                   <ArrowRight size={20} />
                 </div>
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};