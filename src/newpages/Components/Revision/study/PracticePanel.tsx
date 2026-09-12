// src/.../PracticePanel.tsx - FIX CONTINUER bloqué
import { ArrowLeft } from 'lucide-react';
import ModeSelector from './ModeSelector';
import QuizView from './QuizView';
import FlashcardView from './FlashcardView';
import type { StudyMode } from '@/hooks/useLeconStudy';
import type { LeconDetailApi, QuestionApi } from '@/newpages/data/revision';
import type { FlashCard } from './types';

interface Props {
  subject: { id: string; color: string };
  lecon: LeconDetailApi;
  mode: StudyMode;
  questions: QuestionApi[];
  flashcards: FlashCard[];
  currentIndex: number;
  totalQuestions: number;
  progress: number;
  error: string | null;
  onBack: () => void;
  onModeSelect: (mode: 'quiz' | 'flashcard') => void;
  onValidateQuiz: (optionIndex: number) => Promise<any>;
  onNextQuestion: () => void; // NEW - pour Quiz
  onNextFlashcard: () => void; // pour Flashcards
  onComplete: () => void;
}

const PracticePanel = ({
  subject, mode, questions, flashcards,
  currentIndex, totalQuestions, progress, error,
  onBack, onModeSelect, onValidateQuiz, onNextQuestion, onNextFlashcard, onComplete
}: Props) => {
  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {mode && totalQuestions > 0 && (
            <div className="flex-1">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-600">
                  {mode === 'quiz' ? `Question ${currentIndex + 1} / ${totalQuestions}` : `Carte ${currentIndex + 1} / ${totalQuestions}`}
                </span>
                <span className="text-xs font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: subject.color }} />
              </div>
            </div>
          )}
        </div>
        {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">{error}</div>}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
          {!mode && <ModeSelector onSelect={onModeSelect} />}
          
          {mode === 'quiz' && (
            <QuizView
              questions={questions}
              currentIndex={currentIndex}
              onValidate={onValidateQuiz}
              // FIX : on incrémente vraiment l'index dans le hook parent
              onNext={() => {
                console.log('[PracticePanel] Quiz CONTINUER cliqué');
                if (currentIndex + 1 >= totalQuestions) {
                  onComplete();
                } else {
                  onNextQuestion(); // <-- FIX : avance à la question suivante
                }
              }}
              onComplete={onComplete}
            />
          )}

          {mode === 'flashcard' && (
            <FlashcardView
              cards={flashcards}
              currentIndex={currentIndex}
              onNext={() => {
                if (currentIndex + 1 >= totalQuestions) onComplete();
                else onNextFlashcard();
              }}
              onComplete={onComplete}
              subjectColor={subject.color}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticePanel;
