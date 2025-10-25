
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { Exam } from "@/data/exams";
import QuestionCard from "./QuestionCard";
import TrainingNavigation from "./TrainingNavigation";
import ExamPreviewPane from "./ExamPreviewPane";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface ExamTrainingProps {
  exam: Exam;
  onExit: () => void;
}

interface Question {
  id: number;
  type: "multiple-choice" | "text" | "essay";
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

// Questions d'exemple pour la démonstration
const sampleQuestions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Quel est le théorème qui permet de calculer la longueur de l'hypoténuse d'un triangle rectangle ?",
    options: [
      "Théorème de Thalès",
      "Théorème de Pythagore", 
      "Théorème de la médiane",
      "Théorème des sinus"
    ],
    correctAnswer: 1,
    points: 4
  },
  {
    id: 2,
    type: "text",
    question: "Dans un triangle rectangle ABC rectangle en C, si AB = 5 cm et AC = 3 cm, calculez BC.",
    points: 6
  },
  {
    id: 3,
    type: "essay",
    question: "Expliquez en détail la démonstration du théorème de Pythagore en utilisant la méthode géométrique.",
    points: 10
  }
];

const ExamTraining = ({ exam, onExit }: ExamTrainingProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMobile = useIsMobile();

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Ici on pourrait traiter les réponses et calculer le score
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600 flex items-center justify-center gap-2">
                <Check className="h-8 w-8" />
                Épreuve terminée !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">Vous avez terminé l'épreuve d'entraînement.</p>
              <p className="text-gray-600">
                Questions répondues : {Object.keys(answers).length} / {sampleQuestions.length}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={onExit} variant="outline">
                  Retour à l'épreuve
                </Button>
                <Button onClick={() => {
                  setIsSubmitted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}>
                  Recommencer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white backdrop-blur-sm border-b border-blue-400/30 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExit}
              className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
              Quitter
            </Button>

            <div>
              <h1 className="font-semibold text-white text-lg">{exam.title}</h1>
              <p className="text-sm text-blue-100">Mode entraînement</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white">
              Question {currentQuestion + 1} sur {sampleQuestions.length}
            </div>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {isMobile ? (
          /* Mobile Layout: Stacked vertically */
          <div className="space-y-4">
            {/* Collapsible Preview */}
            <Collapsible open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <Card className="overflow-hidden border-border/40 shadow-md">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-500"
                  >
                    <span className="font-semibold">Aperçu de l'épreuve</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isPreviewOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 max-h-[400px] overflow-auto bg-white">
                    <ExamPreviewPane examTitle={exam.title} className="h-full" />
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Questions */}
            <div className="space-y-6">
              <QuestionCard
                question={sampleQuestions[currentQuestion]}
                answer={answers[sampleQuestions[currentQuestion].id]}
                onAnswerChange={(answer) => handleAnswerChange(sampleQuestions[currentQuestion].id, answer)}
              />

              <TrainingNavigation
                currentQuestion={currentQuestion}
                totalQuestions={sampleQuestions.length}
                hasAnswer={answers[sampleQuestions[currentQuestion].id] !== undefined}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        ) : (
          /* Desktop Layout: Two columns */
          <div className="grid grid-cols-5 gap-6 h-[calc(100vh-120px)]">
            {/* Left: Preview Pane (2/5) */}
            <div className="col-span-2 h-full">
              <ExamPreviewPane examTitle={exam.title} />
            </div>

            {/* Right: Interactive Zone (3/5) */}
            <div className="col-span-3 flex flex-col gap-6 overflow-auto pr-2">
              <QuestionCard
                question={sampleQuestions[currentQuestion]}
                answer={answers[sampleQuestions[currentQuestion].id]}
                onAnswerChange={(answer) => handleAnswerChange(sampleQuestions[currentQuestion].id, answer)}
              />

              <TrainingNavigation
                currentQuestion={currentQuestion}
                totalQuestions={sampleQuestions.length}
                hasAnswer={answers[sampleQuestions[currentQuestion].id] !== undefined}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTraining;
