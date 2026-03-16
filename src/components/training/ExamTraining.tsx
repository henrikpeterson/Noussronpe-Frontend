import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Trophy, RotateCcw, Loader2 } from "lucide-react";
import ExerciceBloc from "./ExerciceBloc";
import { useQuiz } from "@/hooks/useQuiz";
import confetti from 'canvas-confetti';

interface ExamTrainingProps {
  epreuveId: number;
  onExit: () => void;
}

// Couleurs thématiques pour chaque exercice
const exerciceColors = [
  "bg-green-100",
  "bg-blue-100"
];

const ExamTraining = ({ epreuveId, onExit }: ExamTrainingProps) => {
  const {
    epreuve,
    exercices,
    currentExercice,
    reponses,
    loading,
    error,
    resultat,
    handleReponseChange,
    soumettreEpreuve,
    exerciceSuivant,
    progression,
  } = useQuiz(epreuveId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Déclencher les confettis au succès de l'épreuve
  useEffect(() => {
    if (resultat) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [resultat]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await soumettreEpreuve();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading && exercices.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg font-bold text-slate-600 tracking-tight">CHARGEMENT DE L'ÉPREUVE...</p>
        </div>
      </div>
    );
  }

  if (error && exercices.length === 0) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 border-2 border-red-200 shadow-xl">
          <CardContent className="space-y-4">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-lg font-bold text-red-600">{error}</p>
            <Button onClick={onExit} variant="outline" className="w-full">
              Retour aux épreuves
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Écran de résultat style "Gamer / Dark Mode"
  if(resultat){
    const { resultat: detailsResultats, total_questions } = resultat;

    return (
      <div className="min-h-screen bg-slate-950 p-4 flex items-center justify-center overflow-hidden">
        <div className="max-w-2xl w-full animate-in zoom-in duration-500">
          <Card className="text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] border-none bg-slate-900 text-white overflow-hidden">
            <CardHeader className="pb-8 pt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent" />
              <div className="flex justify-center mb-6 relative">
                <div className="bg-green-500 rounded-full p-6 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
              </div>
              <CardTitle className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
                {detailsResultats.pourcentage >= 50 ? "Incroyable ! 🔥" : "Bien joué ! ⚡"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-4 pb-12 px-8">
              <p className="text-xl font-bold text-slate-300">
                {detailsResultats.commentaire}
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex justify-between items-center group">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Score</span>
                  <span className="text-4xl font-black text-green-400">
                    {detailsResultats.score_total} pts
                  </span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Précision</span>
                  <span className="text-3xl font-black text-blue-400">
                    {detailsResultats.pourcentage}%
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 pt-6">
                <Button 
                  onClick={() => window.location.reload()}
                  size="lg"
                  className="h-16 text-xl font-black bg-green-500 hover:bg-green-400 text-slate-950 rounded-2xl shadow-[0_6px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all"
                >
                  <RotateCcw className="mr-2 h-6 w-6" />
                  REJOUER
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={onExit}
                  className="text-slate-500 font-bold hover:text-white hover:bg-transparent uppercase tracking-widest text-xs"
                >
                  Quitter le lobby
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header moderne avec barre de progression stylisée */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onExit}
            className="font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-tight"
          >
            <X className="h-5 w-5 mr-1" />
            Abandonner
          </Button>

          {/* Barre de progression centrale "Style Gamer" */}
          <div className="flex flex-col gap-1.5 flex-1 max-w-md">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Niveau {currentExercice + 1}</span>
              <span>{Math.round(progression)}%</span>
            </div>
            <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-700 ease-out"
                style={{ width: `${progression}%` }}
              />
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20" /> {/* Reflet */}
            </div>
          </div>

          <div className="hidden md:block text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Exercice</p>
             <p className="text-xl font-black text-primary leading-none">{currentExercice + 1}/{exercices.length}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-full lg:max-w-[90%] 2xl:max-w-[1600px] mx-auto px-0 md:px-6 lg:px-8 py-4 md:py-8">
        {exercices.length > 0 && (
          <ExerciceBloc
            exercice={exercices[currentExercice]}
            exerciceNumber={currentExercice + 1}
            totalExercices={exercices.length}
            answers={reponses}
            onAnswerChange={handleReponseChange}
            onNext={exerciceSuivant}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showExplanations={false}
            colorScheme={exerciceColors[currentExercice % exerciceColors.length]}
          />
        )}
      </div>
    </div>
  );
};

export default ExamTraining;