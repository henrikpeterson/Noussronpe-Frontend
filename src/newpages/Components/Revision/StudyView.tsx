/**
 * ════════════════════════════════════════════════════════════════════════
 * STUDYVIEW - Container avec resizable panels
 * ════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useMediaQuery, BREAKPOINTS } from '@/newpages/hooks/useMediaQuery';
import { getChapterContent } from '@/newpages/data/studyData';
import StudyLayout from '@/newpages/Components/Revision/study/StudyLayout';
import TheoryCard from '@/newpages/Components/Revision/study/TheoryCard';
import PracticePanel from '@/newpages/Components/Revision/study/PracticePanel';
import MobileSwitcher from '@/newpages/Components/Revision/study/MobileSwitcher';
import CompletionModal from '@/newpages/Components/Revision/study/CompletionModal';
import SidebarMini from '@/newpages/Components/Revision/study/SidebarMini';
import type { 
  StudyViewProps, 
  StudyState, 
  Answer,
  ChapterContent 
} from '@/newpages/Components/Revision/study/types';

const StudyView = ({ subject, chapter, onBack }: StudyViewProps) => {
  
  // ═══════════════════════════════════════════════════════════
  // RESPONSIVE
  // ═══════════════════════════════════════════════════════════
  
  const isDesktop = useMediaQuery(BREAKPOINTS.desktop);
  const [activePanel, setActivePanel] = useState<'theory' | 'practice'>('theory');

  // ═══════════════════════════════════════════════════════════
  // DONNÉES DU CHAPITRE
  // ═══════════════════════════════════════════════════════════
  
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);

  useEffect(() => {
    const content = getChapterContent(chapter.id);
    
    if (!content) {
      console.error(`Chapitre ${chapter.id} non trouvé dans studyData.ts`);
    }
    
    setChapterContent(content);
  }, [chapter.id]);

  // ═══════════════════════════════════════════════════════════
  // ÉTAT DE L'ÉTUDE
  // ═══════════════════════════════════════════════════════════
  
  const initialState: StudyState = {
    selectedMode: null,
    isModeLocked: false,
    currentQuestionIndex: 0,
    totalQuestions: 0,
    answers: [],
    isCompleted: false,
    lastUpdated: Date.now()
  };

  const [studyState, setStudyState] = useState<StudyState>(initialState);

  // ═══════════════════════════════════════════════════════════
  // PERSISTENCE - LOCALSTORAGE
  // ═══════════════════════════════════════════════════════════
  
  const STORAGE_KEY = `study_progress_${subject.id}_${chapter.id}`;

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: StudyState = JSON.parse(savedData);
        
        if (parsed.selectedMode && chapterContent) {
          const expectedTotal = parsed.selectedMode === 'quiz'
            ? chapterContent.quiz.questions.length
            : chapterContent.flashcards.cards.length;
          
          if (parsed.totalQuestions !== expectedTotal) {
            console.warn('Nombre de questions changé, reset progress');
            localStorage.removeItem(STORAGE_KEY);
            return;
          }
        }
        
        setStudyState(parsed);
      } catch (error) {
        console.error('Error loading saved progress:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [STORAGE_KEY, chapterContent]);

  const saveProgress = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studyState));
  }, [STORAGE_KEY, studyState]);

  useEffect(() => {
    if (studyState.selectedMode !== null) {
      saveProgress();
    }
  }, [studyState, saveProgress]);

  useEffect(() => {
    return () => {
      if (studyState.selectedMode !== null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(studyState));
      }
    };
  }, [STORAGE_KEY, studyState]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (studyState.selectedMode !== null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(studyState));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [STORAGE_KEY, studyState]);

  // ═══════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════
  
  const handleModeSelect = (mode: 'quiz' | 'flashcard') => {
    if (studyState.isModeLocked) return;

    const totalQuestions = mode === 'quiz' 
      ? (chapterContent?.quiz.questions.length || 0)
      : (chapterContent?.flashcards.cards.length || 0);

    setStudyState({
      ...studyState,
      selectedMode: mode,
      isModeLocked: true,
      totalQuestions,
      currentQuestionIndex: 0,
      answers: [],
      lastUpdated: Date.now()
    });

    if (!isDesktop) {
      setActivePanel('practice');
    }
  };

  const handleAnswer = (answer: number | string, isCorrect: boolean) => {
    const questionId = studyState.selectedMode === 'quiz'
      ? chapterContent?.quiz.questions[studyState.currentQuestionIndex]?.id || ''
      : chapterContent?.flashcards.cards[studyState.currentQuestionIndex]?.id || '';

    const newAnswer: Answer = {
      questionId,
      userAnswer: answer,
      isCorrect,
      timestamp: Date.now()
    };

    setStudyState(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
      lastUpdated: Date.now()
    }));
  };

  const handleNext = () => {
    const nextIndex = studyState.currentQuestionIndex + 1;

    if (nextIndex >= studyState.totalQuestions) {
      const correctAnswers = studyState.answers.filter(a => a.isCorrect).length;
      const score = Math.round((correctAnswers / studyState.totalQuestions) * 100);

      setStudyState(prev => ({
        ...prev,
        isCompleted: true,
        score,
        completedAt: Date.now(),
        lastUpdated: Date.now()
      }));
    } else {
      setStudyState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        lastUpdated: Date.now()
      }));
    }
  };

  const handleComplete = () => {
    const correctAnswers = studyState.answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / studyState.totalQuestions) * 100);

    setStudyState(prev => ({
      ...prev,
      isCompleted: true,
      score,
      completedAt: Date.now(),
      lastUpdated: Date.now()
    }));
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudyState({
      ...initialState,
      lastUpdated: Date.now()
    });
  };

  const handleBackWithConfirmation = () => {
    if (!studyState.selectedMode || studyState.isCompleted) {
      onBack();
      return;
    }

    if (studyState.currentQuestionIndex > 0 || studyState.answers.length > 0) {
      const confirmed = window.confirm(
        'Tu as une progression en cours. Veux-tu vraiment quitter ? Ta progression sera sauvegardée.'
      );
      
      if (confirmed) {
        saveProgress();
        onBack();
      }
    } else {
      onBack();
    }
  };

  const handleGoToQuiz = () => {
    setActivePanel('practice');
  };

  // ═══════════════════════════════════════════════════════════
  // PROGRESSION
  // ═══════════════════════════════════════════════════════════
  
  const progress = studyState.totalQuestions > 0
    ? Math.round((studyState.currentQuestionIndex / studyState.totalQuestions) * 100)
    : 0;

  // ═══════════════════════════════════════════════════════════
  // RENDER - LOADING/ERROR
  // ═══════════════════════════════════════════════════════════
  
  if (!chapterContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-slate-600 font-medium">Chargement du contenu...</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-slate-200 hover:bg-slate-300 
                       rounded-xl font-medium text-slate-700 transition-colors"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════════════════════════
  
  return (
    <>
      <StudyLayout>
        
        {/* ═══════════════════════════════════════════════ */}
        {/* DESKTOP : Resizable Split Panels */}
        {/* ═══════════════════════════════════════════════ */}
        {isDesktop ? (
          <div className="relative h-screen">
            
            {/* Sidebar mini (fixed left) */}
            <SidebarMini />

            {/* Resizable panels */}
            <div className="h-full pl-14"> {/* Offset pour sidebar */}
              <PanelGroup direction="horizontal">
                
                {/* Panel THEORY (gauche) */}
                <Panel defaultSize={50} minSize={30} maxSize={70}>
                  <TheoryCard 
                    data={chapterContent.theory}
                    chapterTitle={chapter.title}
                  />
                </Panel>

                {/* Resize Handle (séparateur draggable) */}
                <PanelResizeHandle className="w-[1px] bg-slate-200 hover:bg-blue-500 
                                              transition-colors cursor-col-resize" />

                {/* Panel PRACTICE (droite) */}
                <Panel defaultSize={50} minSize={30} maxSize={70}>
                  <PracticePanel
                    subject={subject}
                    chapter={chapter}
                    mode={studyState.selectedMode}
                    currentIndex={studyState.currentQuestionIndex}
                    totalQuestions={studyState.totalQuestions}
                    answers={studyState.answers}
                    progress={progress}
                    onBack={handleBackWithConfirmation}
                    onModeSelect={handleModeSelect}
                    onAnswer={handleAnswer}
                    onNext={handleNext}
                    onComplete={handleComplete}
                  />
                </Panel>

              </PanelGroup>
            </div>
          </div>

        ) : (

          /* ═══════════════════════════════════════════════ */
          /* MOBILE : Active panel only */
          /* ═══════════════════════════════════════════════ */
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, x: activePanel === 'theory' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activePanel === 'theory' ? 20 : -20 }}
                transition={{ duration: 0.2 }}
                className="h-screen"
              >
                {activePanel === 'theory' ? (
                  <TheoryCard 
                    data={chapterContent.theory}
                    chapterTitle={chapter.title}
                    onGoToQuiz={handleGoToQuiz}
                  />
                ) : (
                  <PracticePanel
                    subject={subject}
                    chapter={chapter}
                    mode={studyState.selectedMode}
                    currentIndex={studyState.currentQuestionIndex}
                    totalQuestions={studyState.totalQuestions}
                    answers={studyState.answers}
                    progress={progress}
                    onBack={handleBackWithConfirmation}
                    onModeSelect={handleModeSelect}
                    onAnswer={handleAnswer}
                    onNext={handleNext}
                    onComplete={handleComplete}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Switcher mobile bottom */}
            <MobileSwitcher
              activePanel={activePanel}
              onSwitch={setActivePanel}
              isPracticeLocked={false}
            />
          </>
        )}

      </StudyLayout>

      {/* Modal de complétion */}
      <CompletionModal
        isOpen={studyState.isCompleted}
        score={studyState.score || 0}
        totalQuestions={studyState.totalQuestions}
        onClose={() => setStudyState(prev => ({ ...prev, isCompleted: false }))}
        onRestart={handleRestart}
        onBackToDashboard={onBack}
      />
    </>
  );
};

export default StudyView;