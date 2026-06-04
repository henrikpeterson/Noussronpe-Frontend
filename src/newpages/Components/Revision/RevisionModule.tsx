/**
 * ====================================================
 * REVISIONMODULE - Simplifié (plus de step "study")
 * ====================================================
 */

import { useState } from "react";
import SubjectGrid from "./SubjectGrid";
import Roadmap from "./Roadmap";
import { motion, AnimatePresence } from "framer-motion";
import { SUBJECTS } from "@/newpages/data/Subjects";

// ====================================================
// MODIFICATION : Plus que 2 steps (subjects + roadmap)
// ===================================================

export type RevisionStep = "subjects" | "roadmap";

export interface SelectedSubject {
  id: string;
  name: string;
  color: string;
  gradient: string;
}

// SUPPRESSION : SelectedChapter plus nécessaire ici

const RevisionModule = () => {
  const [currentStep, setCurrentStep] = useState<RevisionStep>("subjects");
  const [selectedSubject, setSelectedSubject] = useState<SelectedSubject | null>(null);

  // ═══════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════
  
  const handleSubjectSelect = (subjectId: string) => {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (subject) {
      setSelectedSubject({
        id: subject.id,
        name: subject.name,
        color: subject.color,
        gradient: subject.gradient,
      });
      setCurrentStep("roadmap");
    }
  };

  const handleBack = () => {
    setCurrentStep("subjects");
    setSelectedSubject(null);
  };

  return (
    <div className="w-full min-h-screen">
      <AnimatePresence mode="wait">
        
        {/* ═══════ ÉTAPE A : Grille Matières ═══════ */}
        {currentStep === "subjects" && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
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
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Roadmap 
              subject={selectedSubject}
              onBack={handleBack}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default RevisionModule;