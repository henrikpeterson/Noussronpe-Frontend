import { useState } from "react";
import SubjectGrid from "./SubjectGrid";
import Roadmap from "./Roadmap";
import StudyView from "./StudyView";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 📚 MODULE RÉVISION - Gestion des 3 vues (A → B → C)
 */
export type RevisionStep = "subjects" | "roadmap" | "study";

export interface SelectedSubject {
  id: string;
  name: string;
  color: string;
}

export interface SelectedChapter {
  id: string;
  title: string;
  price: number;
}

const RevisionModule = () => {
  const [currentStep, setCurrentStep] = useState<RevisionStep>("subjects");
  const [selectedSubject, setSelectedSubject] = useState<SelectedSubject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<SelectedChapter | null>(null);

  // Handler : Sélection matière → Passe à Roadmap
  const handleSubjectSelect = (subject: SelectedSubject) => {
    setSelectedSubject(subject);
    setCurrentStep("roadmap");
  };

  // Handler : Sélection chapitre → Passe à Study View
  const handleChapterSelect = (chapter: SelectedChapter) => {
    setSelectedChapter(chapter);
    setCurrentStep("study");
  };

  // Handler : Retour arrière
  const handleBack = () => {
    if (currentStep === "study") {
      setCurrentStep("roadmap");
      setSelectedChapter(null);
    } else if (currentStep === "roadmap") {
      setCurrentStep("subjects");
      setSelectedSubject(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        
        {/* ═══════ ÉTAPE A : Grille Matières ═══════ */}
        {currentStep === "subjects" && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <SubjectGrid onSelectSubject={handleSubjectSelect} />
          </motion.div>
        )}

        {/* ═══════ ÉTAPE B : Roadmap Chapitres ═══════ */}
        {currentStep === "roadmap" && selectedSubject && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Roadmap 
              subject={selectedSubject}
              onSelectChapter={handleChapterSelect}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {/* ═══════ ÉTAPE C : Mode Étude (Split-Screen) ═══════ */}
        {currentStep === "study" && selectedChapter && selectedSubject && (
          <motion.div
            key="study"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <StudyView 
              subject={selectedSubject}
              chapter={selectedChapter}
              onBack={handleBack}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default RevisionModule;