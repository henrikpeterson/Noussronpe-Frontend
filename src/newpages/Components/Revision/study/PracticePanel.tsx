/**
 * ════════════════════════════════════════════════════════════════════════
 * PRACTICEPANEL - Panel droit avec header sticky interne
 * ════════════════════════════════════════════════════════════════════════
 * 
 * CHANGEMENTS MAJEURS :
 * - Plus de card wrapper
 * - bg-slate-50 (fond gris léger)
 * - Header sticky INTERNE avec progress bar
 * - Bouton retour DANS le panel
 * - h-screen overflow-y-auto
 * 
 * ════════════════════════════════════════════════════════════════════════
 */

import { ArrowLeft } from 'lucide-react';
import { getChapterContent } from '@/newpages/data/studyData';
import ModeSelector from './ModeSelector';
import QuizView from './QuizView';
import FlashcardView from './FlashcardView';
import type { StudyMode, Answer, SelectedSubject, SelectedChapter } from '@/newpages/Components/Revision/study/types';

interface PracticePanelProps {
  subject: SelectedSubject;
  chapter: SelectedChapter;
  mode: StudyMode;
  currentIndex: number;
  totalQuestions: number;
  answers: Answer[];
  progress: number;
  onBack: () => void;
  onModeSelect: (mode: 'quiz' | 'flashcard') => void;
  onAnswer: (answer: number | string, isCorrect: boolean) => void;
  onNext: () => void;
  onComplete: () => void;
}

const PracticePanel = ({ 
  subject,
  chapter,
  mode, 
  currentIndex, 
  totalQuestions,
  answers, 
  progress,
  onBack,
  onModeSelect, 
  onAnswer, 
  onNext, 
  onComplete,
}: PracticePanelProps) => {
  
  /**
   * ═══════════════════════════════════════════════════════════
   * RÉCUPÉRATION DES DONNÉES
   * ═══════════════════════════════════════════════════════════
   */
  const chapterContent = getChapterContent(chapter.id);

  if (!chapterContent) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Contenu non disponible</p>
      </div>
    );
  }

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════════════
   */
  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HEADER STICKY INTERNE */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-white px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 
                      flex-shrink-0 sticky top-0 z-10">
        
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Bouton retour */}
          <button
            onClick={onBack}
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center
                       text-slate-600 hover:bg-slate-100 rounded-lg
                       transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Progress bar */}
          {mode && totalQuestions > 0 && (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-600">
                  Question {currentIndex + 1} / {totalQuestions}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: subject.color 
                  }}
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CONTENU SCROLLABLE */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-6 py-6 md:py-8">
          
          {/* Mode non sélectionné → ModeSelector */}
          {!mode && (
            <ModeSelector onSelect={onModeSelect} />
          )}

          {/* Mode Quiz */}
          {mode === 'quiz' && (
            <QuizView
              questions={chapterContent.quiz.questions}
              currentIndex={currentIndex}
              answers={answers}
              onAnswer={onAnswer}
              onNext={onNext}
              onComplete={onComplete}
              subjectColor={subject.color}
            />
          )}

          {/* Mode Flashcard */}
          {mode === 'flashcard' && (
            <FlashcardView
              cards={chapterContent.flashcards.cards}
              currentIndex={currentIndex}
              onNext={onNext}
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