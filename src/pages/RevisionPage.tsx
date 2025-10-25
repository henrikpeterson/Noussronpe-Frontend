import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { chapters } from "@/data/chapters";
import { subjects } from "@/data/subjects";
import ChapterCard from "@/components/cards/ChapterCard";
import { userProgress } from "@/data/user";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
const RevisionPage = () => {
  // Extraire tous les niveaux uniques
  const allLevels = Array.from(
    new Set(subjects.flatMap(s => s.levels))
  ).sort((a, b) => {
    const order = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"];
    return order.indexOf(a) - order.indexOf(b);
  });
  
  // État pour le niveau sélectionné
  const [selectedLevel, setSelectedLevel] = useState<string>(allLevels[0]);
  
  // État pour la matière sélectionnée
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  
  // Récupérer la liste de toutes les matières
  const subjectIds = subjects.map(s => s.id);
  
  // Récupérer les informations sur la progression de l'utilisateur
  const { chapterProgress } = userProgress;
  
  // Fonction pour vérifier si un chapitre est complété
  const isChapterCompleted = (chapterId: string) => {
    const progress = chapterProgress.find(p => p.chapterId === chapterId);
    return progress?.completed || false;
  };
  
  // Fonction pour obtenir le score d'un chapitre
  const getChapterProgress = (chapterId: string) => {
    const progress = chapterProgress.find(p => p.chapterId === chapterId);
    return progress?.quizScore || 0;
  };
  
  // Filtrer les chapitres par niveau et matière
  const filteredChapters = chapters.filter(chapter => {
    const levelMatch = chapter.level === selectedLevel;
    const subjectMatch = selectedSubject === "all" || chapter.subject === selectedSubject;
    return levelMatch && subjectMatch;
  });
  
  // Filtrer les matières disponibles pour le niveau sélectionné
  const availableSubjects = subjects.filter(subject => subject.levels.includes(selectedLevel));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title="Révision par chapitres"
          subtitle="Révisez efficacement avec nos fiches de cours synthétiques et validez vos acquis avec des quiz."
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Filtres */}
          <div className="mb-8 flex flex-col sm:flex-row gap-6">
            {/* Sélecteur de niveau scolaire */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Choisissez votre classe</h2>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between min-w-[200px]">
                    {selectedLevel}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {allLevels.map(level => (
                    <DropdownMenuItem 
                      key={level} 
                      onClick={() => setSelectedLevel(level)}
                      className={selectedLevel === level ? "bg-accent" : ""}
                    >
                      {level}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Sélecteur de matière */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Choisissez une matière</h2>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between min-w-[200px]">
                    {selectedSubject === "all" ? "Toutes les matières" : subjects.find(s => s.id === selectedSubject)?.name}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuItem 
                    onClick={() => setSelectedSubject("all")}
                    className={selectedSubject === "all" ? "bg-accent" : ""}
                  >
                    Toutes les matières
                  </DropdownMenuItem>
                  {availableSubjects.map(subject => (
                    <DropdownMenuItem 
                      key={subject.id} 
                      onClick={() => setSelectedSubject(subject.id)}
                      className={selectedSubject === subject.id ? "bg-accent" : ""}
                    >
                      {subject.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Liste des chapitres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredChapters.length > 0 ? (
              filteredChapters.map(chapter => (
                <ChapterCard 
                  key={chapter.id} 
                  chapter={chapter} 
                  completed={isChapterCompleted(chapter.id)}
                  progress={getChapterProgress(chapter.id)}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                Aucun chapitre disponible pour cette sélection.
              </p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RevisionPage;
