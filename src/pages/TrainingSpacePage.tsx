import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { subjects } from "@/data/subjects";
import { exams } from "@/data/exams";
import ExamCard from "@/components/cards/ExamCard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, Calculator, FileText, Globe, FlaskConical, Leaf, TrendingUp, Target, Coins } from "lucide-react";

const icons = {
  book: Book,
  calculator: Calculator,
  file: FileText,
  globe: Globe,
  flask: FlaskConical,
  leaf: Leaf,
  languages: Globe,
  brain: Book,
};

const TrainingSpacePage = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [activityType, setActivityType] = useState<string>("all");

  // Récupérer tous les niveaux disponibles
  const allLevels = Array.from(
    new Set(subjects.flatMap(subject => subject.levels))
  ).sort();

  // Filtrer les épreuves
  const filteredExams = exams.filter(exam => {
    if (selectedSubject !== "all" && exam.subject !== selectedSubject) return false;
    if (level !== "all" && exam.level !== level) return false;
    if (activityType !== "all" && exam.type !== activityType) return false;
    return true;
  });

  // Compter les ressources par matière
  const getResourceCount = (subjectId: string) => {
    return exams.filter(exam => exam.subject === subjectId).length;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title="Espace d'Entraînement"
          subtitle="Choisis ta matière et ton niveau pour t'exercer, réviser et t'auto-évaluer."
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 py-12">
          {/* Barre d'action secondaire */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-end">
            <Button variant="outline" asChild className="gap-2">
              <Link to="/progression">
                <TrendingUp className="h-4 w-4" />
                Mes progrès
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/defi/amis">
                <Target className="h-4 w-4" />
                Mes défis
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/">
                <Coins className="h-4 w-4" />
                Recharger mes jetons
              </Link>
            </Button>
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {allLevels.map(lvl => (
                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les activités</SelectItem>
                  <SelectItem value="Exercice">Exercices</SelectItem>
                  <SelectItem value="TD">TD</SelectItem>
                  <SelectItem value="Épreuve">Épreuves</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="w-full">
            <TabsList className="mb-8 overflow-x-auto flex-wrap h-auto">
              <TabsTrigger value="all">Toutes les matières</TabsTrigger>
              {subjects.map(subject => (
                <TabsTrigger key={subject.id} value={subject.id}>
                  {subject.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Vue "Toutes les matières" - Affiche les cartes de matières */}
            <TabsContent value="all" className="mt-0">
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Choisis ta matière</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {subjects.map(subject => {
                    const Icon = icons[subject.icon as keyof typeof icons] || Book;
                    const resourceCount = getResourceCount(subject.id);
                    
                    return (
                      <Card 
                        key={subject.id}
                        className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer border-2 group"
                        onClick={() => setSelectedSubject(subject.id)}
                      >
                        <div className={`h-1 bg-${subject.color}`} />
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className={`p-4 rounded-xl bg-${subject.color}/10 mb-4 group-hover:bg-${subject.color}/20 transition-colors`}>
                            <Icon className={`h-7 w-7 text-${subject.color}`} />
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-foreground">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground font-medium mb-3">
                            {resourceCount} ressources disponibles
                          </p>
                          <Button 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Voir les activités
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            {/* Vue par matière - Affiche les ressources de cette matière */}
            {subjects.map(subject => (
              <TabsContent key={subject.id} value={subject.id} className="mt-0">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{subject.name}</h2>
                    <p className="text-muted-foreground">
                      {filteredExams.length} ressource{filteredExams.length > 1 ? 's' : ''} disponible{filteredExams.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedSubject("all")}
                  >
                    Voir toutes les matières
                  </Button>
                </div>
                
                {filteredExams.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      Aucune ressource disponible avec ces filtres.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setLevel("all");
                        setActivityType("all");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map(exam => (
                      <ExamCard key={exam.id} exam={exam} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrainingSpacePage;
