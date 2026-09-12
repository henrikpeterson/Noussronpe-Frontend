// src/.../StudyView.tsx - FIX pour nextQuestion
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useMediaQuery, BREAKPOINTS } from '@/newpages/hooks/useMediaQuery';
import { useLeconStudy } from '@/hooks/useLeconStudy';
import { getChapterContent } from '@/newpages/data/studyData';
import StudyLayout from '@/newpages/Components/Revision/study/StudyLayout';
import TheoryCard from '@/newpages/Components/Revision/study/TheoryCard';
import PracticePanel from '@/newpages/Components/Revision/study/PracticePanel';
import MobileSwitcher from '@/newpages/Components/Revision/study/MobileSwitcher';
import CompletionModal from '@/newpages/Components/Revision/study/CompletionModal';
import SidebarMini from '@/newpages/Components/Revision/study/SidebarMini';
import type { SelectedSubject } from './RevisionModule';

interface Props {
  subject: SelectedSubject;
  leconId: number;
  onBack: () => void;
}

const StudyView = ({ subject, leconId, onBack }: Props) => {
  const isDesktop = useMediaQuery(BREAKPOINTS.desktop);
  const [activePanel, setActivePanel] = useState<'theory' | 'practice'>('theory');

  const {
    lecon, questions, flashcards, selectedMode, isModeLocked,
    currentIndex, totalQuestions, answers, isCompleted, finalResult,
    isLoading, error, progress,
    selectMode, validateQuizAnswer, nextQuestion, nextCard, finaliser, restart
  } = useLeconStudy(leconId);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">📚 Chargement...</div>;
  }

  if (!lecon) return <div>Leçon introuvable</div>;

  const theoryData = {
    title: lecon.titre,
    subtitle: lecon.description,
    sections: lecon.contenu_sections,
  };

  return (
    <>
      <StudyLayout>
        {isDesktop ? (
          <div className="relative h-screen">
            <SidebarMini />
            <div className="h-full pl-14">
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50} minSize={30} maxSize={70}>
                  <TheoryCard data={theoryData} chapterTitle={lecon.titre} />
                </Panel>
                <PanelResizeHandle className="w-[1px] bg-slate-200 hover:bg-blue-500 cursor-col-resize" />
                <Panel defaultSize={50} minSize={30} maxSize={70}>
                  <PracticePanel
                    subject={subject}
                    lecon={lecon}
                    mode={selectedMode}
                    questions={questions}
                    flashcards={flashcards as any}
                    currentIndex={currentIndex}
                    totalQuestions={totalQuestions}
                    progress={progress}
                    error={error}
                    onBack={onBack}
                    onModeSelect={selectMode}
                    onValidateQuiz={validateQuizAnswer}
                    onNextQuestion={nextQuestion}
                    onNextFlashcard={nextCard}
                    onComplete={finaliser}
                  />
                </Panel>
              </PanelGroup>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div key={activePanel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen">
                {activePanel === 'theory' ? (
                  <TheoryCard data={theoryData} chapterTitle={lecon.titre} onGoToQuiz={() => setActivePanel('practice')} />
                ) : (
                  <PracticePanel
                    subject={subject}
                    lecon={lecon}
                    mode={selectedMode}
                    questions={questions}
                    flashcards={flashcards as any}
                    currentIndex={currentIndex}
                    totalQuestions={totalQuestions}
                    progress={progress}
                    error={error}
                    onBack={onBack}
                    onModeSelect={selectMode}
                    onValidateQuiz={validateQuizAnswer}
                    onNextQuestion={nextQuestion}
                    onNextFlashcard={nextCard}
                    onComplete={finaliser}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <MobileSwitcher activePanel={activePanel} onSwitch={setActivePanel} />
          </>
        )}
      </StudyLayout>

      <CompletionModal
        isOpen={isCompleted}
        score={finalResult?.score || 0}
        totalQuestions={finalResult?.total_questions || totalQuestions}
        bonnesReponses={finalResult?.bonnes_reponses || 0}
        progression={finalResult?.progression}
        onClose={() => {}}
        onRestart={restart}
        onBackToDashboard={onBack}
      />
    </>
  );
};

export default StudyView;
