import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChallengeQuestion as QuestionType } from "@/data/questions";

interface ChallengeQuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  answer: any;
  onAnswerChange: (answer: any) => void;
  onSubmit: () => void;
  isAnswered: boolean;
}

const ChallengeQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
  onSubmit,
  isAnswered
}: ChallengeQuestionProps) => {
  
  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={answer?.toString() || ""}
            onValueChange={(value) => onAnswerChange(parseInt(value))}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor="text-answer" className="text-base font-medium">Votre réponse :</Label>
            <Input
              id="text-answer"
              value={answer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Saisissez votre réponse..."
              className="text-base p-3"
            />
          </div>
        );

      case "numeric":
        return (
          <div className="space-y-2">
            <Label htmlFor="numeric-answer" className="text-base font-medium">Votre réponse :</Label>
            <Input
              id="numeric-answer"
              type="number"
              value={answer || ""}
              onChange={(e) => onAnswerChange(e.target.value ? parseFloat(e.target.value) : "")}
              placeholder="Saisissez un nombre..."
              className="text-base p-3"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            Question {questionNumber}/{totalQuestions}
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {question.points} {question.points > 1 ? 'points' : 'point'}
          </div>
        </div>
        <CardTitle className="text-xl leading-relaxed text-gray-800">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderQuestionContent()}
        
        <Button 
          onClick={onSubmit}
          disabled={!isAnswered}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          Soumettre la réponse
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChallengeQuestion;