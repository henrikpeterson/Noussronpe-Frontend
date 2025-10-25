
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface Question {
  id: number;
  type: 'mcq' | 'boolean' | 'completion';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizDisplayProps {
  questions: Question[];
}

export default function QuizDisplay({ questions }: QuizDisplayProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    setScore(Math.round((correct / questions.length) * 100));
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Résultats du quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">{score}%</div>
              <p className="text-lg">
                {score >= 70 ? "Excellent travail !" : score >= 50 ? "Bon effort !" : "Continuez à réviser !"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {questions.filter(q => answers[q.id] === q.correctAnswer).length}
                </div>
                <div className="text-sm text-gray-500">Correctes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {questions.filter(q => answers[q.id] !== q.correctAnswer).length}
                </div>
                <div className="text-sm text-gray-500">Incorrectes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>

            <Button onClick={resetQuiz} className="bg-purple-600 hover:bg-purple-700">
              <RotateCcw className="h-4 w-4 mr-2" />
              Refaire le quiz
            </Button>
          </CardContent>
        </Card>

        {/* Détail des réponses */}
        <div className="space-y-4">
          {questions.map((question, index) => {
            const isCorrect = answers[question.id] === question.correctAnswer;
            return (
              <Card key={question.id} className="border-l-4 border-l-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Votre réponse: <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {answers[question.id]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-600 mb-2">
                          Bonne réponse: <span className="text-green-600">{question.correctAnswer}</span>
                        </p>
                      )}
                      <p className="text-sm text-blue-600">{question.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Quiz interactif
            </span>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} / {questions.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            
            {question.type === 'mcq' && question.options && (
              <RadioGroup 
                value={answers[question.id] || ""} 
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === 'boolean' && (
              <RadioGroup 
                value={answers[question.id] || ""} 
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Vrai" id="true" />
                  <label htmlFor="true" className="flex-1 cursor-pointer">Vrai</label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Faux" id="false" />
                  <label htmlFor="false" className="flex-1 cursor-pointer">Faux</label>
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Précédent
            </Button>
            <Button 
              onClick={nextQuestion}
              disabled={!answers[question.id]}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {currentQuestion === questions.length - 1 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
