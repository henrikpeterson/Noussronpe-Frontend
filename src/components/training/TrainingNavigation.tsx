import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface TrainingNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  hasAnswer: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const TrainingNavigation = ({
  currentQuestion,
  totalQuestions,
  hasAnswer,
  onPrevious,
  onNext,
  onSubmit
}: TrainingNavigationProps) => {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="flex justify-between items-center">
      {/* Bouton précédent en bleu outline */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Précédent
      </Button>

      <div className="flex items-center gap-2">
        {!isLastQuestion ? (
          <Button
            onClick={onNext}
            disabled={!hasAnswer}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!hasAnswer}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Soumettre l'épreuve
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrainingNavigation;
