import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import ChallengeQuestion from "@/components/challenge/ChallengeQuestion";
import OpponentInfo from "@/components/challenge/OpponentInfo";
import { getRandomQuestions, ChallengeQuestion as QuestionType } from "@/data/questions";
import { friends } from "@/data/friends";
import { ArrowLeft, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ActiveChallengePage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questions] = useState<QuestionType[]>(() => getRandomQuestions(10));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [opponentStatus, setOpponentStatus] = useState<"thinking" | "completed" | "waiting">("thinking");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes en secondes

  // Simule un adversaire (dans une vraie app, ce serait géré par le backend)
  const opponent = friends[0]; // Pour l'exemple

  // Timer pour le défi
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Temps écoulé - fin automatique du défi
          navigate(`/defi/resultat/${challengeId}`, {
            state: {
              questions,
              answers,
              opponent,
              timeExpired: true
            }
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, challengeId, questions, answers, opponent]);

  useEffect(() => {
    // Simule le statut de l'adversaire qui change
    const timer = setTimeout(() => {
      if (Math.random() > 0.5) {
        setOpponentStatus("completed");
      }
    }, Math.random() * 10000 + 5000); // Entre 5 et 15 secondes

    return () => clearTimeout(timer);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Formatage du temps
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return "text-red-600"; // Rouge si moins d'1 minute
    if (timeLeft <= 180) return "text-orange-600"; // Orange si moins de 3 minutes
    return "text-green-600"; // Vert sinon
  };
  
  const handleAnswerChange = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "multiple-choice") {
      return answer !== undefined && answer !== null;
    }
    return answer !== undefined && answer !== null && answer !== "";
  };

  const handleSubmitAnswer = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      toast({
        title: "Réponse enregistrée !",
        description: "Passez à la question suivante.",
      });
    } else {
      // Fin du défi - rediriger vers les résultats
      navigate(`/defi/resultat/${challengeId}`, {
        state: {
          questions,
          answers,
          opponent
        }
      });
    }
  };

  if (!currentQuestion) {
    return <div>Erreur : Question non trouvée</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/defi/amis")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quitter le défi
        </Button>

        {/* Timer et info adversaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <OpponentInfo opponent={opponent} status={opponentStatus} />
          
          {/* Timer */}
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Temps restant</p>
                <p className={`text-2xl font-bold ${getTimerColor()}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-8 bg-white rounded-lg border shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progression</span>
            <span className="text-sm font-medium text-primary">
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Début</span>
            <span>Fin</span>
          </div>
        </div>

        {/* Question actuelle */}
        <div className="mb-8">
          <ChallengeQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            answer={answers[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmitAnswer}
            isAnswered={isCurrentQuestionAnswered()}
          />
        </div>

        {/* Message d'encouragement */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            {currentQuestionIndex < questions.length - 1 
              ? "Bonne chance ! Prenez votre temps pour réfléchir." 
              : "Dernière question ! Vous y êtes presque !"
            }
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}