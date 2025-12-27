import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, Trophy, RotateCcw, Loader2 } from "lucide-react";
import { Exam } from "@/data/exams";
import ExerciceBloc from "./ExerciceBloc";
import { useQuiz } from "@/hooks/useQuiz";

interface ExamTrainingProps {
  epreuveId: number;
  onExit: () => void;
}

// Couleurs pour chaque exercice
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
    exercicePrecedent,
    progression,
    tousExercicesComplets,
    totalQuestions,
    questionsRepondues
  } = useQuiz(epreuveId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  //const [currentExercice, setCurrentExercice] = useState(0);
  //const [answers, setAnswers] = useState<Record<number, any>>({});
  //const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await soumettreEpreuve();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Écran de chargement
  if (loading && exercices.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-lg font-semibold">Chargement de l'épreuve...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Écran d'erreur
  if (error && exercices.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="text-center p-8 border-red-200">
          <CardContent className="space-y-4">
            <X className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-lg font-semibold text-red-600">{error}</p>
            <Button onClick={onExit} variant="outline">
              Retour aux épreuves
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  if(resultat){
    const { resultat: detailsResultats1, total_questions} = resultat;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full animate-scale-in">
          <Card className="text-center shadow-2xl border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white pb-8 pt-8">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4">
                  <Trophy className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold">
                🎉 Épreuve terminée !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-8 pb-8">
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-semibold text-foreground">
                  {detailsResultats1.commentaire}
                </p>
                <div className="bg-blue-50 rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium">Score :</span>
                    <span className="font-bold text-primary text-2xl">
                      {detailsResultats1.score_total} points
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium">Pourcentage :</span>
                    <span className="font-bold text-green-600 text-2xl">
                      {detailsResultats1.pourcentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium">Bonnes réponses :</span>
                    <span className="font-bold text-primary text-2xl">
                      {detailsResultats1.bonnes_reponses} / {total_questions}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  onClick={onExit} 
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <X className="h-5 w-5" />
                  Retour aux épreuves
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-primary-hover hover:opacity-90"
                >
                  <RotateCcw className="h-5 w-5" />
                  Recommencer
                </Button>
              </div>
            </CardContent>
          </Card>

           {/*
             <div className="space-y-6">
            {exercices.map((exercice, index) => (
              <ExerciceBloc
                key={exercice.id}
                exercice={exercice}
                exerciceNumber={index + 1}
                totalExercices={exercices.length}
                answers={reponses}
                onAnswerChange={() => {}}
                onNext={() => {}}
                onSubmit={() => {}}
                showExplanations={true}   // ← AVEC explications
                colorScheme={exerciceColors[index % exerciceColors.length]}
              />
            ))}
          </div>
           */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50">
      {/* Header moderne et sticky */}
      <div className="bg-white/90 backdrop-blur-md border-b border-border/60 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onExit}
                className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
                Quitter
              </Button>
              <div className="border-l border-border pl-3">
                <h1 className="font-bold text-lg text-foreground">{epreuve.titre}</h1>
                <p className="text-sm text-muted-foreground">Mode entraînement interactif</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Progression</p>
                <p className="text-sm font-bold text-primary">
                  Exercice {currentExercice + 1} / {exercices.length}
                </p>
              </div>
              <div className="w-32 sm:w-40">
                <Progress value={progression} className="h-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 py-8">
        {exercices.length > 0 && (
          <ExerciceBloc
            exercice={exercices[currentExercice]}
            exerciceNumber={currentExercice + 1}
            totalExercices={exercices.length}
            answers={reponses}
            onAnswerChange={handleReponseChange}
            onNext={exerciceSuivant}
            onSubmit={soumettreEpreuve}
            showExplanations={false}    // ← SANS explications
            colorScheme={exerciceColors[currentExercice % exerciceColors.length]}
          />
        )}
      </div>
    </div>
  );
};

export default ExamTraining;
