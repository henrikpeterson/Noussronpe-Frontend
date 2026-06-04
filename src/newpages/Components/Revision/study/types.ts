/**
 * TYPES PARTAGÉS - StudyView
 * Toutes les interfaces nécessaires
 */


export interface SelectedSubject {
  id: string;
  name: string;
  color: string;
  gradient: string;
}

export interface SelectedChapter {
  id: string;
  title: string;
  price: number;
}
// ═══════════════════════════════════════════════════════════
// PROPS DES COMPOSANTS
// ═══════════════════════════════════════════════════════════

export interface StudyViewProps {
  subject: SelectedSubject;
  chapter: SelectedChapter;
  onBack: () => void;
}

export interface StudyLayoutProps {
  subject: SelectedSubject;
  chapter: SelectedChapter;
  onBack: () => void;
  progress: number;
  children: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════
// DONNÉES THÉORIE
// ═══════════════════════════════════════════════════════════

export type TheorySectionType = 
  | 'paragraph' 
  | 'important' 
  | 'quote' 
  | 'formula'
  | 'example';

export interface TheorySection {
  type: TheorySectionType;
  content: string;
  variant?: 'blue' | 'green' | 'amber' | 'purple';
}

export interface TheoryData {
  title: string;
  subtitle: string;
  sections: TheorySection[];
}

// ═══════════════════════════════════════════════════════════
// DONNÉES QUIZ
// ═══════════════════════════════════════════════════════════

export interface QuizQuestion {
  id: string;
  question: string;
  codeExample?: string;  // Bloc code optionnel
  options: string[];
  correctAnswer: number;  // Index de la bonne réponse (0-3)
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

// ═══════════════════════════════════════════════════════════
// DONNÉES FLASHCARDS
// ═══════════════════════════════════════════════════════════

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  hint?: string;
}

export interface FlashcardData {
  cards: FlashCard[];
}

// ═══════════════════════════════════════════════════════════
// CONTENU COMPLET D'UN CHAPITRE
// ═══════════════════════════════════════════════════════════

export interface ChapterContent {
  theory: TheoryData;
  quiz: QuizData;
  flashcards: FlashcardData;
}

// ═══════════════════════════════════════════════════════════
// ÉTAT DE L'ÉTUDE
// ═══════════════════════════════════════════════════════════

export type StudyMode = 'quiz' | 'flashcard' | null;

export interface Answer {
  questionId: string;
  userAnswer: number | string;
  isCorrect: boolean;
  timestamp: number;
}

export interface StudyState {
  selectedMode: StudyMode;
  isModeLocked: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Answer[];
  isCompleted: boolean;
  score?: number;
  completedAt?: number;
  lastUpdated: number;
}

// ═══════════════════════════════════════════════════════════
// STATS (pour header badges)
// ═══════════════════════════════════════════════════════════

export interface StudyStats {
  stars: number;    // ⭐ Points
  streak: number;   // 🔥 Jours consécutifs
  coins: number;    // 🪙 Jetons
}

// ═══════════════════════════════════════════════════════════
// PROPS COMPOSANTS PRACTICE
// ═══════════════════════════════════════════════════════════

export interface PracticePanelProps {
  mode: StudyMode;
  currentIndex: number;
  answers: Answer[];
  onModeSelect: (mode: 'quiz' | 'flashcard') => void;
  onAnswer: (answer: number | string, isCorrect: boolean) => void;
  onNext: () => void;
  onComplete: () => void;
  chapterId: string;      // ← AJOUTER
  subjectColor: string;   // ← AJOUTER
}

export interface QuizViewProps {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Answer[];
  onAnswer: (answer: number, isCorrect: boolean) => void;
  onNext: () => void;
  onComplete: () => void;
  subjectColor: string;
}

export interface FlashcardViewProps {
  cards: FlashCard[];
  currentIndex: number;
  onNext: () => void;
  onComplete: () => void;
  subjectColor: string;
}

export interface ModeSelectorProps {
  onSelect: (mode: 'quiz' | 'flashcard') => void;
}

export interface CompletionModalProps {
  isOpen: boolean;
  score: number;
  totalQuestions: number;
  onClose: () => void;
  onRestart: () => void;
  onBackToDashboard: () => void;
}

export interface MobileSwitcherProps {
  activePanel: 'theory' | 'practice';
  onSwitch: (panel: 'theory' | 'practice') => void;
  isPracticeLocked?: boolean;
}