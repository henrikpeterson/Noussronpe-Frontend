import { useParams } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { chapters } from "@/data/chapters";
import { subjects } from "@/data/subjects";
import { exams } from "@/data/exams";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTokenConsumption } from "@/hooks/useTokenConsumption";
import TokenConsumptionModal from "@/components/tokens/TokenConsumptionModal";
import TokenPacksModal from "@/components/tokens/TokenPacksModal";
const ChapterDetailPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const chapter = chapters.find(c => c.id === id);
  const [activeTab, setActiveTab] = useState("contenu");
  const {
    tokens,
    showConsumptionModal,
    showPacksModal,
    pendingConsumption,
    requestTokenConsumption,
    confirmConsumption,
    cancelConsumption,
    closePacksModal,
  } = useTokenConsumption();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(chapter?.quizQuestions.length || 5);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<typeof chapter.quizQuestions>([]);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    total: number;
    answers: Record<string, {
      isCorrect: boolean;
      explanation: string;
    }>;
  } | null>(null);
  if (!chapter) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Chapitre non trouvé</h1>
            <p className="mb-6">Le chapitre que vous recherchez n'existe pas.</p>
            <Button asChild>
              <a href="/revision">Retour à la révision</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>;
  }
  const subject = subjects.find(s => s.id === chapter.subject);
  const relatedExamsList = exams.filter(e => chapter.relatedExams.includes(e.id));
  const handleAnswerChange = (questionId: string, answer: any) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  const startQuiz = () => {
    requestTokenConsumption(1, "Ce quiz", () => {
      // Sélectionner aléatoirement les questions selon le nombre choisi
      const shuffled = [...chapter.quizQuestions].sort(() => 0.5 - Math.random());
      const desiredCount = Math.min(selectedQuestionCount, chapter.quizQuestions.length);
      const selectedQuestions = shuffled.slice(0, desiredCount);
      setCurrentQuizQuestions(selectedQuestions);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResults(null);
    });
  };

  const handleQuizSubmit = () => {
    // Calcul des résultats
    const results: Record<string, {
      isCorrect: boolean;
      explanation: string;
    }> = {};
    let correctAnswers = 0;
    currentQuizQuestions.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      results[question.id] = {
        isCorrect,
        explanation: question.explanation
      };
      if (isCorrect) correctAnswers++;
    });
    setQuizResults({
      score: correctAnswers,
      total: currentQuizQuestions.length,
      answers: results
    });
    setQuizSubmitted(true);
  };
  const resetQuiz = () => {
    setCurrentQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  };

  // Fonction de rendu pour les questions du quiz
  const renderQuestion = (question: typeof chapter.quizQuestions[0], index: number) => {
    const isSubmitted = quizSubmitted;
    const userAnswer = quizAnswers[question.id];
    const result = quizResults?.answers[question.id];
    return <div key={question.id} className="mb-8">
        <div className="mb-2 flex items-start">
          <span className="bg-afrique-orange text-white rounded-full h-6 w-6 flex items-center justify-center text-sm mr-2">
            {index + 1}
          </span>
          <h3 className="text-lg font-medium">{question.question}</h3>
        </div>
        
        {question.type === "qcm" && <div className="ml-8">
            <RadioGroup value={userAnswer} onValueChange={value => handleAnswerChange(question.id, value)} disabled={isSubmitted}>
              {question.options?.map((option, idx) => <div key={idx} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={`${question.id}-${idx}`} />
                  <Label htmlFor={`${question.id}-${idx}`} className={isSubmitted ? option === question.correctAnswer ? "text-afrique-vert font-medium" : userAnswer === option ? "text-afrique-rouge" : "" : ""}>
                    {option}
                  </Label>
                </div>)}
            </RadioGroup>
          </div>}
        
        {question.type === "boolean" && <div className="ml-8">
            <RadioGroup value={userAnswer?.toString()} onValueChange={value => handleAnswerChange(question.id, value === "true")} disabled={isSubmitted}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="true" id={`${question.id}-true`} />
                <Label htmlFor={`${question.id}-true`} className={isSubmitted ? question.correctAnswer === true ? "text-afrique-vert font-medium" : userAnswer === true ? "text-afrique-rouge" : "" : ""}>
                  Vrai
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${question.id}-false`} />
                <Label htmlFor={`${question.id}-false`} className={isSubmitted ? question.correctAnswer === false ? "text-afrique-vert font-medium" : userAnswer === false ? "text-afrique-rouge" : "" : ""}>
                  Faux
                </Label>
              </div>
            </RadioGroup>
          </div>}
        
        {question.type === "text" && <div className="ml-8">
            <Input value={userAnswer || ""} onChange={e => handleAnswerChange(question.id, e.target.value)} disabled={isSubmitted} className="max-w-md" />
          </div>}
        
        {question.type === "number" && <div className="ml-8">
            <Input type="number" value={userAnswer || ""} onChange={e => handleAnswerChange(question.id, parseFloat(e.target.value))} disabled={isSubmitted} className="max-w-md" />
          </div>}
        
        {isSubmitted && <div className="ml-8 mt-3 p-3 rounded-md bg-gray-50 border">
            <div className="flex items-start">
              {result?.isCorrect ? <CheckCircle className="h-5 w-5 text-afrique-vert mr-2 mt-0.5" /> : <XCircle className="h-5 w-5 text-afrique-rouge mr-2 mt-0.5" />}
              <div>
                <p className={result?.isCorrect ? "text-afrique-vert font-medium" : "text-afrique-rouge font-medium"}>
                  {result?.isCorrect ? "Correct!" : "Incorrect"}
                </p>
                <p className="text-gray-700 mt-1">{result?.explanation}</p>
              </div>
            </div>
          </div>}
      </div>;
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-afrique-bleu hover:bg-afrique-bleu/80">{chapter.level}</Badge>
              {subject && <Badge variant="outline">{subject.name}</Badge>}
            </div>
            <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
            <p className="text-gray-600 max-w-3xl">{chapter.description}</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="contenu" className="flex-1">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Contenu du cours
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="flex-1">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Quiz
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="contenu" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          🔵 Ce contenu coûte <strong>1 jeton de savoir</strong> pour être consulté
                        </p>
                      </div>
                      <div className="prose prose-headings:text-afrique-terre prose-a:text-afrique-orange prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg max-w-none" dangerouslySetInnerHTML={{
                      __html: chapter.content.replace(/\n/g, '<br>')
                    }} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="quiz" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vérifiez vos connaissances</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {currentQuizQuestions.length === 0 ? (
                        <div className="space-y-6">
                          <div className="text-center">
                            <h3 className="text-lg font-medium mb-4">Configuration du quiz</h3>
                            <p className="text-gray-600 mb-6">
                              Ce chapitre contient {chapter.quizQuestions.length} questions. 
                              Choisissez combien de questions vous souhaitez pour votre quiz.
                            </p>
                          </div>
                          
                          <div className="max-w-sm mx-auto space-y-4">
                            <div>
                              <Label htmlFor="question-count">Nombre de questions</Label>
                              <Select 
                                value={selectedQuestionCount.toString()} 
                                onValueChange={(value) => setSelectedQuestionCount(parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez le nombre de questions" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[5, 10, 15, 20].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {`${num} questions`}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value={chapter.quizQuestions.length.toString()}>
                                    {`Toutes les questions (${chapter.quizQuestions.length})`}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <Button 
                              onClick={startQuiz} 
                              className="w-full bg-primary hover:bg-primary/90"
                            >
                              Commencer le quiz
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {quizSubmitted && quizResults && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                              <h3 className="text-lg font-medium mb-2">Résultat du quiz</h3>
                              <p className="text-xl font-bold mb-2">
                                Score: {quizResults.score}/{quizResults.total} 
                                ({Math.round(quizResults.score / quizResults.total * 100)}%)
                              </p>
                              {quizResults.score === quizResults.total ? (
                                <p className="text-green-600">Excellent ! Vous maîtrisez parfaitement ce chapitre.</p>
                              ) : quizResults.score >= quizResults.total * 0.7 ? (
                                <p className="text-orange-600">Bien ! Vous avez de bonnes connaissances, mais il y a encore place à l'amélioration.</p>
                              ) : (
                                <p className="text-red-600">Vous devriez réviser ce chapitre à nouveau.</p>
                              )}
                            </div>
                          )}
                          
                          <div className="space-y-4">
                            {currentQuizQuestions.map(renderQuestion)}
                          </div>
                        </>
                      )}
                    </CardContent>
                    <CardFooter>
                      {currentQuizQuestions.length > 0 && (
                        <>
                          {quizSubmitted ? (
                            <div className="flex gap-2">
                              <Button onClick={resetQuiz} variant="outline">
                                Nouveau quiz
                              </Button>
                              <Button onClick={() => {
                                setQuizAnswers({});
                                setQuizSubmitted(false);
                                setQuizResults(null);
                              }} className="bg-primary hover:bg-primary/90">
                                Réessayer
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              onClick={handleQuizSubmit} 
                              disabled={Object.keys(quizAnswers).length < currentQuizQuestions.length} 
                              className="bg-primary hover:bg-primary/90"
                            >
                              Vérifier mes réponses
                            </Button>
                          )}
                        </>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Épreuves liées</CardTitle>
                </CardHeader>
                <CardContent>
                  {relatedExamsList.length > 0 ? <div className="space-y-4">
                      {relatedExamsList.map(exam => <a key={exam.id} href={`/epreuves/${exam.id}`} className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-afrique-orange mt-0.5" />
                            <div>
                              <h4 className="font-medium line-clamp-2">{exam.title}</h4>
                              <div className="flex justify-between items-center mt-1 text-sm">
                                <Badge variant="outline">{exam.level}</Badge>
                                <span className="text-gray-500">{exam.duration} min</span>
                              </div>
                            </div>
                          </div>
                        </a>)}
                    </div> : <p className="text-gray-500">
                      Aucune épreuve liée à ce chapitre n'est disponible pour le moment.
                    </p>}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Autres chapitres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chapters.filter(c => c.subject === chapter.subject && c.id !== chapter.id).slice(0, 3).map(otherChapter => <a key={otherChapter.id} href={`/revision/${otherChapter.subject}/${otherChapter.id}`} className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-afrique-bleu mt-0.5" />
                            <div>
                              <h4 className="font-medium">{otherChapter.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{otherChapter.level}</p>
                            </div>
                          </div>
                        </a>)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Token Modals */}
      <TokenConsumptionModal
        isOpen={showConsumptionModal}
        onClose={cancelConsumption}
        onConfirm={confirmConsumption}
        cost={pendingConsumption?.cost || 0}
        description={pendingConsumption?.description || ""}
        currentBalance={tokens.balance}
      />
      
      <TokenPacksModal
        isOpen={showPacksModal}
        onClose={closePacksModal}
      />
    </div>;
};
export default ChapterDetailPage;