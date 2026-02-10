import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ConfigScreen } from './components/ConfigScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizInterface } from './components/QuizInterface';
import { ResultScreen } from './components/ResultScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { Navigation } from './components/Navigation';

import { generateQuiz } from './services/geminiService';
import { saveGeneratedQuiz, getApiKey } from './services/storageService'; 
import { checkAndTriggerNotification } from './services/notificationService';
import { QuizState, Question, QuizResult, ModelConfig, QuizMode, AppView } from './types';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>(AppView.GENERATOR);
  
  // Quiz Flow State
  const [quizState, setQuizState] = useState<QuizState>(QuizState.CONFIG);
  
  // Data State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  
  // UI Status State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>("Inisialisasi...");
  const [activeMode, setActiveMode] = useState<QuizMode>(QuizMode.STANDARD);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Initial Check for API Key & Notifications
  useEffect(() => {
    const key = getApiKey();
    if (!key) {
      setCurrentView(AppView.SETTINGS);
    }
    
    // Check for daily reminder on app open
    checkAndTriggerNotification();
  }, []);

  const startQuizGeneration = async (file: File | null, config: ModelConfig) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      alert("Harap masukkan API Key di menu Settings terlebih dahulu.");
      setCurrentView(AppView.SETTINGS);
      return;
    }

    setQuizState(QuizState.PROCESSING);
    setErrorMsg(null);
    setActiveMode(config.mode);
    setLoadingStatus(file ? "Membaca Dokumen..." : "Menganalisis Topik...");

    try {
      const generatedQuestions = await generateQuiz(
        apiKey,
        file,
        config.topic,
        config.modelId, 
        config.questionCount, 
        config.mode,
        config.examStyle,
        (status) => setLoadingStatus(status)
      );
      
      setQuestions(generatedQuestions);
      setOriginalQuestions(generatedQuestions);
      setQuizState(QuizState.QUIZ_ACTIVE);

      // Save History Locally
      saveGeneratedQuiz(file, config, generatedQuestions);

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Terjadi kesalahan. Periksa API Key atau koneksi.");
      setQuizState(QuizState.ERROR);
    }
  };

  const handleLoadHistory = (savedQuiz: any) => {
    setQuestions(savedQuiz.questions);
    setOriginalQuestions(savedQuiz.questions);
    setActiveMode(savedQuiz.mode);
    setErrorMsg(null);
    setResult(null);
    setQuizState(QuizState.QUIZ_ACTIVE);
    setCurrentView(AppView.GENERATOR); // Switch back to generator tab view to show quiz
  };

  const handleQuizComplete = (finalResult: QuizResult) => {
    setResult(finalResult);
    setQuizState(QuizState.RESULTS);
  };

  const handleRetryMistakes = () => {
    if (!result) return;
    const wrongQuestionIds = result.answers.filter(a => !a.isCorrect).map(a => a.questionId);
    const mistakesToRetry = originalQuestions.filter(q => wrongQuestionIds.includes(q.id));

    if (mistakesToRetry.length > 0) {
      setQuestions(mistakesToRetry);
      setResult(null);
      setQuizState(QuizState.QUIZ_ACTIVE);
    }
  };

  const resetApp = () => {
    setQuestions([]);
    setOriginalQuestions([]);
    setResult(null);
    setErrorMsg(null);
    setQuizState(QuizState.CONFIG);
  };

  // Main Render Logic
  const renderContent = () => {
    // If Quiz is Active or Processing, override Tab View
    if (quizState === QuizState.PROCESSING) {
      return <LoadingScreen status={loadingStatus} />;
    }
    if (quizState === QuizState.QUIZ_ACTIVE) {
      return <QuizInterface questions={questions} mode={activeMode} onComplete={handleQuizComplete} />;
    }
    if (quizState === QuizState.RESULTS && result) {
      return <ResultScreen result={result} questions={originalQuestions} onReset={resetApp} onRetryMistakes={handleRetryMistakes} />;
    }
    if (quizState === QuizState.ERROR) {
      return (
        <div className="text-center mt-20">
           <div className="bg-red-50/50 backdrop-blur-md border border-red-200 p-8 rounded-3xl inline-block max-w-md">
             <h3 className="text-red-800 text-xl font-medium mb-2">Oops!</h3>
             <p className="text-red-600 mb-6">{errorMsg}</p>
             <button onClick={resetApp} className="px-6 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200">Kembali</button>
           </div>
        </div>
      );
    }

    // Default: Show content based on active Tab
    switch (currentView) {
      case AppView.SETTINGS:
        return <SettingsScreen />;
      case AppView.HISTORY:
        return <HistoryScreen onLoadHistory={handleLoadHistory} />;
      case AppView.GENERATOR:
      default:
        return <ConfigScreen onStart={startQuizGeneration} />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative pb-24">
      {/* Analysis Info Button */}
      <button 
        onClick={() => setShowAnalysis(!showAnalysis)}
        className="fixed top-6 right-6 z-40 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-slate-600 hover:bg-white/40 shadow-sm"
      >
        <Info size={24} />
      </button>

      {/* Info Modal */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAnalysis(false)}
          >
            <div className="bg-white/90 backdrop-blur-xl max-w-lg w-full rounded-3xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Tentang Aplikasi</h2>
              <p className="text-sm text-slate-600 mb-4">
                Aplikasi ini 100% Client-Side. API Key Anda disimpan aman di browser.
                Tidak ada data soal atau key yang dikirim ke server kami.
              </p>
              <button onClick={() => setShowAnalysis(false)} className="w-full py-2 bg-indigo-600 text-white rounded-xl">Tutup</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto pt-8">
        <AnimatePresence mode='wait'>
          <motion.div 
            key={currentView + quizState} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Bar (Only show if not in active quiz mode to prevent accidental exit) */}
      {quizState === QuizState.CONFIG && (
        <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;