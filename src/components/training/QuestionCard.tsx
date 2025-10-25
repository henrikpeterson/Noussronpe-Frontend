
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: number;
  type: "multiple-choice" | "text" | "essay";
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

interface QuestionCardProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

const QuestionCard = ({ question, answer, onAnswerChange }: QuestionCardProps) => {
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
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor="text-answer">Votre réponse :</Label>
            <Input
              id="text-answer"
              value={answer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Saisissez votre réponse..."
              className="w-full"
            />
          </div>
        );

      case "essay":
        return (
          <div className="space-y-2">
            <Label htmlFor="essay-answer">Votre réponse détaillée :</Label>
            <Textarea
              id="essay-answer"
              value={answer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Rédigez votre réponse complète..."
              className="w-full min-h-[120px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Question {question.id}</CardTitle>
          <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {question.points} points
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-gray-800 leading-relaxed">
          {question.question}
        </div>
        {renderQuestionContent()}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
