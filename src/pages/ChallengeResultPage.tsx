import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChallengeQuestion } from "@/data/questions";
import { Friend } from "@/data/friends";
import { Trophy, Star, RotateCcw, ArrowLeft } from "lucide-react";

export default function ChallengeResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { questions, answers, opponent } = location.state as {
    questions: ChallengeQuestion[];
    answers: Record<number, any>;
    opponent: Friend;
  };

  if (!questions || !answers || !opponent) {
    return <div>Erreur : Données manquantes</div>;
  }

  // Calcul du score de l'utilisateur
  const calculateScore = () => {
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      totalPoints += question.points;
      
      let isCorrect = false;
      if (question.type === "multiple-choice") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "text") {
        isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim();
      } else if (question.type === "numeric") {
        isCorrect = parseFloat(userAnswer) === question.correctAnswer;
      }
      
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }
    });

    return {
      correctAnswers,
      totalQuestions: questions.length,
      earnedPoints,
      totalPoints,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };

  // Simule le score de l'adversaire (dans une vraie app, venant du backend)
  const generateOpponentScore = () => {
    const randomCorrect = Math.floor(Math.random() * questions.length) + Math.floor(questions.length * 0.3);
    const percentage = Math.round((randomCorrect / questions.length) * 100);
    const earnedPoints = questions.slice(0, randomCorrect).reduce((sum, q) => sum + q.points, 0);
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    
    return {
      correctAnswers: randomCorrect,
      totalQuestions: questions.length,
      earnedPoints,
      totalPoints,
      percentage
    };
  };

  const userScore = calculateScore();
  const opponentScore = generateOpponentScore();
  const userWins = userScore.correctAnswers > opponentScore.correctAnswers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/defi/amis")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux défis
        </Button>

        {/* Résultat principal */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${
            userWins 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
              : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
          }`}>
            {userWins ? (
              <>
                <Trophy className="h-8 w-8" />
                <div>
                  <h1 className="text-2xl font-bold">Félicitations ! Vous avez gagné !</h1>
                  <p className="text-lg opacity-90">
                    Tu as gagné avec {userScore.correctAnswers}/{userScore.totalQuestions} contre {opponentScore.correctAnswers}/{opponentScore.totalQuestions} !
                  </p>
                </div>
              </>
            ) : (
              <>
                <Star className="h-8 w-8" />
                <div>
                  <h1 className="text-2xl font-bold">Bien joué !</h1>
                  <p className="text-lg opacity-90">
                    {opponent.name} a gagné avec {opponentScore.correctAnswers}/{opponentScore.totalQuestions} contre {userScore.correctAnswers}/{userScore.totalQuestions}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Comparatif des scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Score utilisateur */}
          <Card className={`border-2 ${userWins ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {userWins && <Trophy className="h-5 w-5 text-green-600" />}
                Votre score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">
                {userScore.correctAnswers}/{userScore.totalQuestions}
              </div>
              <div className="text-xl text-gray-600">
                {userScore.percentage}%
              </div>
              <div className="text-sm text-gray-500">
                {userScore.earnedPoints}/{userScore.totalPoints} points
              </div>
            </CardContent>
          </Card>

          {/* Score adversaire */}
          <Card className={`border-2 ${!userWins ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {!userWins && <Trophy className="h-5 w-5 text-green-600" />}
                {opponent.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center mb-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                    {opponent.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-4xl font-bold text-primary">
                {opponentScore.correctAnswers}/{opponentScore.totalQuestions}
              </div>
              <div className="text-xl text-gray-600">
                {opponentScore.percentage}%
              </div>
              <div className="text-sm text-gray-500">
                {opponentScore.earnedPoints}/{opponentScore.totalPoints} points
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détail des réponses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Détail de vos réponses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                let isCorrect = false;
                
                if (question.type === "multiple-choice") {
                  isCorrect = userAnswer === question.correctAnswer;
                } else if (question.type === "text") {
                  isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim();
                } else if (question.type === "numeric") {
                  isCorrect = parseFloat(userAnswer) === question.correctAnswer;
                }

                return (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Badge variant={isCorrect ? "default" : "destructive"} className="mt-1">
                        {isCorrect ? "✓" : "✗"}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Votre réponse:</span>{" "}
                            {question.type === "multiple-choice" && question.options 
                              ? (userAnswer !== undefined ? question.options[userAnswer] : "Non répondu")
                              : userAnswer || "Non répondu"
                            }
                          </p>
                          <p>
                            <span className="font-medium">Bonne réponse:</span>{" "}
                            {question.type === "multiple-choice" && question.options
                              ? question.options[question.correctAnswer as number]
                              : question.correctAnswer
                            }
                          </p>
                          {question.explanation && (
                            <p className="text-blue-600 italic">
                              💡 {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center">
          <Button 
            onClick={() => navigate("/defi/amis")}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            size="lg"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Relancer un défi
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}