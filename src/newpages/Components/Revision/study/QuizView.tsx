import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import type { QuestionApi } from '@/newpages/data/revision';

interface QuizViewProps {
  questions: QuestionApi[];
  currentIndex: number;
  onValidate: (optionIndex: number) => Promise<{ est_correcte: boolean; explication: string; bonne_option_ordre: number }>;
  onNext: () => void;
  onComplete: () => void;
}

const QuizView = ({ questions, currentIndex, onValidate, onNext, onComplete }: QuizViewProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explication, setExplication] = useState('');
  const [bonneOption, setBonneOption] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setExplication('');
    setBonneOption(null);
  }, [currentIndex]);

  // Écoute event next depuis PracticePanel
  useEffect(() => {
    const handler = () => {
      setSelectedAnswer(null);
      setShowFeedback(false);
    };
    window.addEventListener('quiz-next', handler as any);
    return () => window.removeEventListener('quiz-next', handler as any);
  }, []);

  const handleValidate = async () => {
    if (selectedAnswer === null) return;
    setIsValidating(true);
    try {
      const result = await onValidate(selectedAnswer);
      setIsCorrect(result.est_correcte);
      setExplication(result.explication);
      setBonneOption(result.bonne_option_ordre);
      setShowFeedback(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  if (!currentQuestion) return <div>Plus de questions</div>;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight text-center">
          {currentQuestion.texte_question}
        </h3>
        {currentQuestion.code_example && (
          <div className="mt-4 bg-[#1E1E1E] text-white rounded-lg p-4 text-center font-mono">
            {currentQuestion.code_example}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 mb-7">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectPath = bonneOption === index;
          const isWrongPath = isSelected && !isCorrect && showFeedback;

          let colors = "bg-white border-slate-200 border-b-slate-300 text-slate-700 hover:bg-slate-50";
          if (isSelected && !showFeedback) colors = "bg-blue-50 border-blue-500 border-b-blue-700 text-blue-700";
          if (showFeedback) {
            if (isCorrectPath) colors = "bg-green-50 border-green-500 border-b-green-700 text-green-700";
            else if (isWrongPath) colors = "bg-red-50 border-red-500 border-b-red-700 text-red-700";
            else colors = "bg-transparent border-slate-100 border-b-slate-200 text-slate-300 opacity-50";
          }

          return (
            <button
              key={option.id}
              onClick={() => !showFeedback && setSelectedAnswer(index)}
              disabled={showFeedback}
              className={`w-full max-w-md mx-auto p-3 rounded-2xl text-left font-bold text-lg transition-all border-2 border-b-[6px] flex items-center gap-4 ${colors}`}
            >
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black border-2 ${isSelected ? 'bg-current text-white border-transparent' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option.texte_option}</span>
              {showFeedback && isCorrectPath && <div className="bg-green-500 p-1 rounded-full"><Check className="w-4 h-4 text-white" /></div>}
              {showFeedback && isWrongPath && <div className="bg-red-500 p-1 rounded-full"><X className="w-4 h-4 text-white" /></div>}
            </button>
          );
        })}
      </div>

      <div className="mt-auto space-y-4">
        <AnimatePresence mode="wait">
          {showFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-2xl border-2 border-b-4 flex gap-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex-1">
                <p className={`font-black text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>{isCorrect ? 'Bien joué !' : 'Pas tout à fait ça'}</p>
                <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{explication}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showFeedback ? (
          <button
            disabled={selectedAnswer === null || isValidating}
            onClick={handleValidate}
            className={`w-full max-w-md mx-auto p-3 rounded-2xl font-bold text-lg border-2 border-b-[6px] flex items-center justify-center gap-2 ${selectedAnswer !== null ? 'bg-blue-600 text-white border-blue-800 hover:bg-blue-500' : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'}`}
          >
            {isValidating ? 'Vérification...' : 'VÉRIFIER'}
          </button>
        ) : (
          <button
            onClick={currentIndex >= questions.length - 1 ? onComplete : onNext}
            className={`w-full h-16 rounded-2xl font-black text-xl text-white border-b-[8px] flex items-center justify-center gap-3 ${isCorrect ? 'bg-green-600 border-green-800' : 'bg-red-600 border-red-800'}`}
          >
            {currentIndex >= questions.length - 1 ? 'TERMINER' : 'CONTINUER'} <ArrowRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView ;
