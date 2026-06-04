import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import type { QuizViewProps } from '@/newpages/Components/Revision/study/types';

const QuizView = ({ 
  questions, 
  currentIndex, 
  onAnswer, 
  onNext, 
  onComplete,
  subjectColor 
}: QuizViewProps) => {
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [currentIndex]);

  const handleValidate = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(selectedAnswer, correct);
  };

  return (
    <div className="flex flex-col h-full w-full font-fredoka">
      
      {/* ═══ QUESTION ═══ */}
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-fredoka text-slate-800 leading-tight text-center">
          {currentQuestion.question}
        </h3>
      </div>
      {/* ═══ LISTE DES RÉPONSES (Boutons 3D directs) ═══ */}
      <div className="flex-1 space-y-3 mb-7">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectPath = index === currentQuestion.correctAnswer;
          const isWrongPath = isSelected && !isCorrect;

          // Couleurs dynamiques style 3D
          let colors = "bg-white border-slate-200 border-b-slate-300 text-slate-700 hover:bg-slate-50";
          
          if (isSelected && !showFeedback) {
            colors = "bg-blue-50 border-blue-500 border-b-blue-700 text-blue-700";
          }
          if (showFeedback) {
            if (isCorrectPath) colors = "bg-green-50 border-green-500 border-b-green-700 text-green-700";
            else if (isWrongPath) colors = "bg-red-50 border-red-500 border-b-red-700 text-red-700";
            else colors = "bg-transparent border-slate-100 border-b-slate-200 text-slate-300 opacity-50";
          }

          return (
            <button
              key={index}
              onClick={() => !showFeedback && setSelectedAnswer(index)}
              disabled={showFeedback}
              className={`
                w-full max-w-md mx-auto p-3 rounded-2xl text-left font-bold text-lg transition-all border-2 border-b-[6px] 
                flex items-center gap-4 group
                active:translate-y-[2px] active:border-b-[2px] disabled:active:translate-y-0
                ${colors}
              `}
            >
              {/* Badge Lettre (A, B, C...) */}
              <span className={`
                w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-colors
                ${isSelected ? 'bg-current text-white border-transparent' : 'bg-slate-100 border-slate-200 text-slate-500'}
              `}>
                {String.fromCharCode(65 + index)}
              </span>

              <span className="flex-1">{option}</span>

              {/* Icônes de fin */}
              {showFeedback && isCorrectPath && <div className="bg-green-500 p-1 rounded-full"><Check className="w-4 h-4 text-white" /></div>}
              {showFeedback && isWrongPath && <div className="bg-red-500 p-1 rounded-full"><X className="w-4 h-4 text-white" /></div>}
            </button>
          );
        })}
      </div>

      {/* ═══ SECTION ACTION (Bas du composant) ═══ */}
      <div className="mt-auto space-y-4">
        <AnimatePresence mode="wait">
          {showFeedback && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border-2 border-b-4 flex gap-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
               <div className="flex-1">
                <p className={`font-black text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Bien joué !' : 'Ce n\'est pas tout à fait ça'}
                </p>
                <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {currentQuestion.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showFeedback ? (
          <button
            disabled={selectedAnswer === null}
            onClick={handleValidate}
            className={`
               w-full max-w-md mx-auto p-3 rounded-2xl text-left font-bold text-lg transition-all border-2 border-b-[6px] 
               flex items-center gap-4 group
              ${selectedAnswer !== null 
                ? 'bg-blue-600 text-white border-blue-800 hover:bg-blue-500 active:border-b-0 active:translate-y-[4px]' 
                : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'}
            `}
          >
            VÉRIFIER
          </button>
        ) : (
          <button
            onClick={currentIndex >= questions.length - 1 ? onComplete : onNext}
            className={`
              w-full h-16 rounded-2xl font-black text-xl text-white transition-all border-b-[8px] flex items-center justify-center gap-3
              active:border-b-0 active:translate-y-[4px]
              ${isCorrect ? 'bg-green-600 border-green-800 hover:bg-green-500' : 'bg-red-600 border-red-800 hover:bg-red-500'}
            `}
          >
            {currentIndex >= questions.length - 1 ? 'TERMINER' : 'CONTINUER'}
            <ArrowRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;