import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Brain, ChevronRight, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import type { SelectedSubject, SelectedChapter } from "./RevisionModule";
import { useMediaQuery } from "@/newpages/hooks/useMediaQuery";

/**
 * 📖 ÉTAPE C : MODE ÉTUDE - Split-Screen Résumé/Quiz
 * Desktop : Vue 50/50 côte à côte
 * Mobile : Switcher toggle entre les deux vues
 */

interface StudyViewProps {
  subject: SelectedSubject;
  chapter: SelectedChapter;
  onBack: () => void;
}

type MobileView = "resume" | "quiz";
type QuizState = "question" | "correct" | "incorrect" | "hint";

// Mock données résumé (Markdown simulé)
const MOCK_RESUME = `
# Les Équations du Premier Degré

## Introduction
Une équation du premier degré est une égalité contenant une inconnue (généralement **x**) élevée à la puissance 1.

## Forme générale
\`ax + b = 0\` où a ≠ 0

## Méthode de résolution
1. **Isoler l'inconnue** : Déplacer tous les termes avec x d'un côté
2. **Simplifier** : Regrouper les termes constants
3. **Diviser** : Pour obtenir x seul

### Exemple
Résoudre : 3x + 5 = 14

**Solution :**
- 3x = 14 - 5
- 3x = 9
- x = 3

## Points clés à retenir
✓ Toujours faire la même opération des deux côtés  
✓ Vérifier la solution en la remplaçant dans l'équation  
✓ Une équation du 1er degré a **une seule solution**
`;

// Mock quiz
const MOCK_QUIZ = {
  question: "Résous l'équation : 2x + 7 = 15",
  options: [
    { id: "a", text: "x = 4", isCorrect: true },
    { id: "b", text: "x = 11", isCorrect: false },
    { id: "c", text: "x = 8", isCorrect: false },
    { id: "d", text: "x = 3", isCorrect: false },
  ],
  hint: "💡 Commence par soustraire 7 des deux côtés de l'équation",
  explanation: "2x = 15 - 7 → 2x = 8 → x = 4",
};

const StudyView = ({ subject, chapter, onBack }: StudyViewProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mobileView, setMobileView] = useState<MobileView>("resume");
  const [quizState, setQuizState] = useState<QuizState>("question");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Handler sélection réponse
  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    const isCorrect = MOCK_QUIZ.options.find(opt => opt.id === optionId)?.isCorrect;
    setQuizState(isCorrect ? "correct" : "incorrect");
  };

  // Reset quiz
  const handleContinue = () => {
    setQuizState("question");
    setSelectedAnswer(null);
    setShowHint(false);
  };

  return (
    <div className="space-y-6">
      
      {/* ═══ HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center hover:border-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </motion.button>

          <div>
            <p className="text-sm font-bold text-slate-500">{subject.name}</p>
            <h2 className="text-2xl font-black text-slate-900">
              {chapter.title}
            </h2>
          </div>
        </div>

        {/* Badge progression */}
        <div className="hidden md:block bg-white border-2 border-slate-100 rounded-2xl px-4 py-2">
          <p className="text-xs text-slate-600 font-semibold">Progression du chapitre</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: "35%" }} />
            </div>
            <span className="text-sm font-black text-blue-600">35%</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP : SPLIT-SCREEN 50/50 ═══════════════ */}
      {isDesktop ? (
        <div className="grid grid-cols-2 gap-6">
          
          {/* ═══ GAUCHE : RÉSUMÉ ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border-2 border-slate-100 p-8 overflow-y-auto max-h-[calc(100vh-16rem)] shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Résumé du cours</h3>
            </div>

            {/* Contenu Markdown stylisé */}
            <div className="prose prose-sm max-w-none">
              <div className="space-y-4 text-slate-700 leading-relaxed">
                {MOCK_RESUME.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-2xl font-black text-slate-900 mt-6 mb-3">{line.replace('# ', '')}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-bold text-slate-800 mt-5 mb-2">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-bold text-slate-700 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                  }
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={i} className="text-base">
                        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-black text-slate-900">{part}</strong> : part)}
                      </p>
                    );
                  }
                  if (line.includes('`')) {
                    const parts = line.split('`');
                    return (
                      <p key={i} className="text-base">
                        {parts.map((part, j) => j % 2 === 1 ? <code key={j} className="bg-slate-100 text-blue-700 px-2 py-1 rounded font-mono text-sm">{part}</code> : part)}
                      </p>
                    );
                  }
                  if (line.startsWith('✓')) {
                    return (
                      <div key={i} className="flex items-start gap-2 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-xl">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-sm font-medium text-green-900">{line.replace('✓ ', '')}</span>
                      </div>
                    );
                  }
                  if (line.trim().startsWith('-')) {
                    return <li key={i} className="text-base ml-4">{line.replace('-', '').trim()}</li>;
                  }
                  return line.trim() ? <p key={i} className="text-base">{line}</p> : null;
                })}
              </div>
            </div>
          </motion.div>

          {/* ═══ DROITE : QUIZ ═══ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-lg flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Quiz interactif</h3>
            </div>

            <QuizContent 
              quizState={quizState}
              selectedAnswer={selectedAnswer}
              showHint={showHint}
              onAnswerSelect={handleAnswerSelect}
              onShowHint={() => setShowHint(true)}
              onContinue={handleContinue}
            />
          </motion.div>

        </div>
      ) : (
        
        /* ═══════════════ MOBILE : SWITCHER TOGGLE ═══════════════ */
        <div className="space-y-4">
          
          {/* Toggle Switcher fixe */}
          <div className="sticky top-0 z-20 bg-white border-2 border-slate-200 rounded-3xl p-2 flex gap-2 shadow-lg">
            <button
              onClick={() => setMobileView("resume")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                mobileView === "resume"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Résumé
            </button>
            <button
              onClick={() => setMobileView("quiz")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                mobileView === "quiz"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Brain className="w-4 h-4" />
              Quiz
            </button>
          </div>

          {/* Contenu animé */}
          <AnimatePresence mode="wait">
            {mobileView === "resume" ? (
              <motion.div
                key="resume-mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-lg"
              >
                <div className="prose prose-sm max-w-none">
                  <div className="space-y-4 text-slate-700 leading-relaxed">
                    {MOCK_RESUME.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-black text-slate-900">{line.replace('# ', '')}</h1>;
                      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-slate-800">{line.replace('## ', '')}</h2>;
                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return <p key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-black">{p}</strong> : p)}</p>;
                      }
                      return line.trim() ? <p key={i} className="text-sm">{line}</p> : null;
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quiz-mobile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-lg"
              >
                <QuizContent 
                  quizState={quizState}
                  selectedAnswer={selectedAnswer}
                  showHint={showHint}
                  onAnswerSelect={handleAnswerSelect}
                  onShowHint={() => setShowHint(true)}
                  onContinue={handleContinue}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   COMPOSANT QUIZ (partagé Desktop/Mobile)
   ══════════════════════════════════════════════════════════ */
interface QuizContentProps {
  quizState: QuizState;
  selectedAnswer: string | null;
  showHint: boolean;
  onAnswerSelect: (id: string) => void;
  onShowHint: () => void;
  onContinue: () => void;
}

const QuizContent = ({ quizState, selectedAnswer, showHint, onAnswerSelect, onShowHint, onContinue }: QuizContentProps) => {
  return (
    <div className="flex-1 flex flex-col">
      
      {/* Question */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-5">
          <p className="text-base font-black text-slate-900">
            {MOCK_QUIZ.question}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6 flex-1">
        {MOCK_QUIZ.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const showCorrect = quizState !== "question" && option.isCorrect;
          const showIncorrect = quizState !== "question" && isSelected && !option.isCorrect;

          return (
            <motion.button
              key={option.id}
              onClick={() => quizState === "question" && onAnswerSelect(option.id)}
              disabled={quizState !== "question"}
              whileHover={quizState === "question" ? { scale: 1.02, x: 4 } : {}}
              whileTap={quizState === "question" ? { scale: 0.98 } : {}}
              className={`w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all duration-300 ${
                showCorrect
                  ? "bg-green-50 border-green-500 text-green-900"
                  : showIncorrect
                    ? "bg-red-50 border-red-500 text-red-900"
                    : isSelected && quizState === "question"
                      ? "bg-blue-50 border-blue-500 text-blue-900"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-sm">
                    {option.id.toUpperCase()}
                  </span>
                  {option.text}
                </span>
                {showCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                {showIncorrect && <XCircle className="w-6 h-6 text-red-600" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Indice */}
      {showHint && quizState === "question" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3"
        >
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-amber-900">{MOCK_QUIZ.hint}</p>
        </motion.div>
      )}

      {/* Feedback bandeau */}
      <AnimatePresence>
        {quizState === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-7 h-7" />
              <div>
                <h4 className="text-lg font-black">Bravo ! 🎉</h4>
                <p className="text-sm font-medium opacity-90">Excellente réponse</p>
              </div>
            </div>
            <p className="text-sm bg-white/20 rounded-xl p-3 mb-4">
              <strong>Explication :</strong> {MOCK_QUIZ.explanation}
            </p>
            <button
              onClick={onContinue}
              className="w-full bg-white text-green-700 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              Question suivante
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {quizState === "incorrect" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-5 text-white shadow-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <XCircle className="w-7 h-7" />
              <div>
                <h4 className="text-lg font-black">Pas tout à fait... 💪</h4>
                <p className="text-sm font-medium opacity-90">Réessaie !</p>
              </div>
            </div>
            <p className="text-sm bg-white/20 rounded-xl p-3 mb-4">
              La bonne réponse est : <strong>{MOCK_QUIZ.options.find(o => o.isCorrect)?.text}</strong>
              <br />
              <span className="opacity-90">{MOCK_QUIZ.explanation}</span>
            </p>
            <button
              onClick={onContinue}
              className="w-full bg-white text-red-700 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
            >
              Réessayer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton Indice (si pas encore affiché) */}
      {quizState === "question" && !showHint && (
        <button
          onClick={onShowHint}
          className="w-full bg-amber-100 text-amber-900 font-bold py-3 rounded-xl hover:bg-amber-200 transition-colors flex items-center justify-center gap-2 border-2 border-amber-300"
        >
          <Lightbulb className="w-5 h-5" />
          Besoin d'un indice ?
        </button>
      )}

    </div>
  );
};

export default StudyView;