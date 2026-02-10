export enum QuizState {
  CONFIG = 'CONFIG',
  PROCESSING = 'PROCESSING',
  QUIZ_ACTIVE = 'QUIZ_ACTIVE',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export enum AppView {
  GENERATOR = 'GENERATOR',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export enum QuizMode {
  STANDARD = 'STANDARD',
  SCAFFOLDING = 'SCAFFOLDING', // Easy -> Hard (Guided)
  TIME_RUSH = 'TIME_RUSH',     // Timer per question
  SURVIVAL = 'SURVIVAL'        // 3 Lives only
}

export enum ExamStyle {
  CONCEPTUAL = 'CONCEPTUAL',   // Hafalan, Definisi (C1-C2)
  ANALYTICAL = 'ANALYTICAL',   // Logika, Sebab-Akibat (C4-C5)
  CASE_STUDY = 'CASE_STUDY',   // Penerapan Situasi (C3)
  COMPETITIVE = 'COMPETITIVE'  // Detail, Jebakan, Hard (Olympiad style)
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keyPoint: string; 
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizResult {
  correctCount: number;
  totalQuestions: number;
  score: number;
  mode: QuizMode;
  answers: { questionId: number; selectedIndex: number; isCorrect: boolean }[];
}

export interface ModelConfig {
  modelId: string;
  questionCount: number;
  mode: QuizMode;
  examStyle: ExamStyle;
  topic?: string; // New: Optional topic string
}

export const AVAILABLE_MODELS = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Standard - Recommended)" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite (Super Cepat)" },
  { id: "gemini-3-flash-preview", label: "Gemini 3 Flash (Experimental - High IQ)" },
  { id: "gemma-3-27b-it", label: "Gemma 3 27B (Deep Reasoning)" },
  { id: "gemma-3-12b-it", label: "Gemma 3 12B (Balanced)" },
  { id: "gemma-3-4b-it", label: "Gemma 3 4B (Mobile Friendly)" },
  { id: "gemma-3-1b-it", label: "Gemma 3 1B (Ultra Light)" },
];