import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import QuestionCard from "./QuestionCard";
import { Exercice, Question, Option } from '../api'; 

interface ExerciceBlocProps {
  exercice: Exercice;
  exerciceNumber: number;
  totalExercices: number;
  answers: Record<number, any>;
  onAnswerChange: (questionId: number, answer: any) => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  colorScheme: string;
  showExplanations?: boolean;
}

const ExerciceBloc = ({
  exercice,
  exerciceNumber,
  totalExercices,
  answers,
  onAnswerChange,
  onNext,
  onSubmit,
  isSubmitting = false,
  colorScheme,
  showExplanations = false
}: ExerciceBlocProps) => {
  const isLastExercice = exerciceNumber === totalExercices;
  const [isEnonceOpen, setIsEnonceOpen] = useState(false);
  
  // Vérifier si toutes les questions de l'exercice ont une réponse
  const allQuestionsAnswered = exercice.questions.every(
    q => answers[q.id] !== undefined && answers[q.id] !== ""
  );

  return (
    <div 
      className="animate-fade-in"
      style={{ 
        animation: "fade-in 0.5s ease-out, scale-in 0.4s ease-out"
      }}
    >
      {/* Bloc principal unifié avec en-tête intégré */}
      <div className={`${colorScheme} rounded-xl p-3 md:p-4 shadow-lg border border-border/20`}>
        {/* En-tête de l'exercice intégré */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Exercice {exerciceNumber} 
            </h2>
            <Badge variant="secondary" className="text-xs px-3 py-1">
              {exerciceNumber} / {totalExercices}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
              🎯 {exercice.competence}
            </Badge>
          </div>
        </div>
        {/* Énoncé de l'exercice - Accordion en haut */}
        {exercice.enonce && (
          <div className="mb-4">
            <Collapsible open={isEnonceOpen} onOpenChange={setIsEnonceOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm font-semibold h-auto py-2"
                >
                  📝 Afficher l'énoncé
                  {isEnonceOpen ? (
                    <ChevronUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Card className="bg-muted/30 border-border/40 shadow-sm">
                  <CardContent className="pt-3 pb-3 px-3">
                    <div
                      className="prose max-w-none text-foreground
                          text-[0.95rem] leading-relaxed tracking-normal
                          prose-p:my-2 prose-headings:my-3
                          prose-ul:my-2 prose-ol:my-2
                          prose-table:text-[0.9rem] prose-table:my-2
                          prose-th:py-1 prose-td:py-0.5"
                      dangerouslySetInnerHTML={{ __html: exercice.enonce }}
                    />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Questions de l'exercice */}
        <div className="space-y-3 mb-4">
          {exercice.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onAnswerChange={(answer) => onAnswerChange(question.id, answer)}
              isFirstQuestion={index === 0}
              showExplanations={showExplanations}
            />
          ))}
        </div>

        {/* Bouton de navigation */}
        <div className="flex justify-end pt-3">
          {!isLastExercice ? (
            <Button
              onClick={onNext}
              disabled={!allQuestionsAnswered}
              size="lg"
              className="gap-2 hover:scale-105 transition-all duration-200 shadow-md text-sm"
            >
              Exercice suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={!allQuestionsAnswered}
              size="lg"
              className="gap-2 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200 shadow-md text-sm"
            >
              <Send className="h-4 w-4" />
              Soumettre l'épreuve
            </Button>
          )}
        </div>

        {!allQuestionsAnswered && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            ⚠️ Veuillez répondre à toutes les questions avant de continuer
          </p>
        )}
      </div>
    </div>
  );
};

export default ExerciceBloc;
