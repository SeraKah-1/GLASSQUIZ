/**
 * ==========================================
 * STORAGE SERVICE (LOCAL STORAGE)
 * ==========================================
 */

import { Question, ModelConfig } from "../types";

const HISTORY_KEY = 'glassquiz_history';
const API_KEY_STORAGE = 'glassquiz_api_key';

// --- API KEY MANAGEMENT ---
export const saveApiKey = (key: string) => {
  localStorage.setItem(API_KEY_STORAGE, key);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE);
};

export const removeApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE);
};

// --- QUIZ HISTORY MANAGEMENT ---
export const saveGeneratedQuiz = async (
  file: File | null, // Allow null file
  config: ModelConfig,
  questions: Question[]
) => {
  try {
    const rawHistory = localStorage.getItem(HISTORY_KEY);
    const history = rawHistory ? JSON.parse(rawHistory) : [];

    const newEntry = {
      id: Date.now(),
      fileName: file ? file.name : (config.topic || "Topik Manual"), // Fallback name
      modelId: config.modelId,
      mode: config.mode,
      date: new Date().toISOString(),
      questionCount: questions.length,
      topicSummary: questions.length > 0 ? questions[0].keyPoint : "General",
      questions: questions 
    };

    history.unshift(newEntry);

    if (history.length > 20) {
      history.pop();
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
  } catch (err) {
    console.error("Failed to save to LocalStorage:", err);
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
       localStorage.removeItem(HISTORY_KEY);
    }
  }
};

export const getSavedQuizzes = (): any[] => {
  try {
    const rawHistory = localStorage.getItem(HISTORY_KEY);
    return rawHistory ? JSON.parse(rawHistory) : [];
  } catch (e) {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};