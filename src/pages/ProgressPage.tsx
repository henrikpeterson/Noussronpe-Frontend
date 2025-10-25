
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProgressStats from "@/components/features/ProgressStats";
import { userProgress } from "@/data/user";
import { exams } from "@/data/exams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Trophy } from "lucide-react";
import { getTotalChallengesCompleted } from "@/data/challenges-rewards";

const ProgressPage = () => {
  const { examHistory } = userProgress;
  const totalChallengesCompleted = getTotalChallengesCompleted();
  
  // Trier les examens par date (du plus récent au plus ancien)
  const sortedExams = [...examHistory].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title="Mon carnet de progression"
          subtitle="Suivez vos progrès, analysez vos résultats et améliorez-vous continuellement."
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="statistiques" className="w-full">
            <TabsList className="w-full mb-8">
              <TabsTrigger value="statistiques" className="flex-1">Statistiques</TabsTrigger>
              <TabsTrigger value="historique" className="flex-1">Historique</TabsTrigger>
              <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="statistiques" className="mt-0">
              {/* Compteur de challenges */}
              <Card className="mb-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full">
                      <Trophy className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-amber-900">Challenges complétés</CardTitle>
                      <p className="text-sm text-amber-700">
                        Total d'objectifs atteints
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-amber-600 mb-2">
                      {totalChallengesCompleted}
                    </p>
                    <p className="text-amber-700 text-sm">
                      {totalChallengesCompleted === 0 
                        ? "Commence ton premier challenge !" 
                        : totalChallengesCompleted === 1
                        ? "Continue sur cette lancée ! 🎯"
                        : "Incroyable progression ! 🔥"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <ProgressStats />
            </TabsContent>
            
            <TabsContent value="historique" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des épreuves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedExams.length > 0 ? (
                      sortedExams.map(item => {
                        const exam = exams.find(e => e.id === item.examId);
                        if (!exam) return null;
                        
                        return (
                          <div key={item.examId} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{exam.title}</h3>
                              <Badge 
                                className={
                                  item.score >= 80 ? "bg-afrique-vert" :
                                  item.score >= 60 ? "bg-afrique-jaune" :
                                  "bg-afrique-rouge"
                                }
                              >
                                {item.score}%
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(item.date).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="mx-2">•</span>
                              <span>Durée: {item.timeSpent} min</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{exam.level}</Badge>
                              <Badge variant="outline">{exam.subject === "math" ? "Mathématiques" :
                                exam.subject === "french" ? "Français" : 
                                exam.subject === "physics" ? "Physique-Chimie" :
                                exam.subject === "history" ? "Histoire-Géo" :
                                exam.subject === "svt" ? "SVT" :
                                exam.subject === "english" ? "Anglais" : exam.subject}
                              </Badge>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Vous n'avez pas encore réalisé d'épreuves.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="badges" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Mes badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {userProgress.badges.map(badge => (
                      <div key={badge.id} className="flex flex-col items-center text-center p-4 border rounded-lg">
                        <div className="w-20 h-20 rounded-full bg-afrique-orange/20 flex items-center justify-center text-afrique-orange mb-3">
                          {badge.id === "first-quiz" ? (
                            <BookOpen className="h-8 w-8" />
                          ) : (
                            <Calendar className="h-8 w-8" />
                          )}
                        </div>
                        <h3 className="font-bold mb-1">{badge.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{badge.description}</p>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          Obtenu le {new Date(badge.dateEarned).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProgressPage;
