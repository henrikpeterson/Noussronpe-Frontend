
import { useParams } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { chapters } from "@/data/chapters";
import { subjects } from "@/data/subjects";
import ChapterCard from "@/components/cards/ChapterCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userProgress } from "@/data/user";

const ClassChaptersPage = () => {
  const { level } = useParams<{ level: string }>();
  
  if (!level) {
    return <div>Niveau non trouvé</div>;
  }
  
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
  
  // Filtrer les chapitres selon le niveau sélectionné
  const levelChapters = chapters.filter(chapter => chapter.level === level);
  
  // Grouper les chapitres par matière
  const chaptersBySubject = subjects.reduce((acc, subject) => {
    const subjectChapters = levelChapters.filter(chapter => chapter.subject === subject.id);
    if (subjectChapters.length > 0) {
      acc[subject.id] = {
        subject,
        chapters: subjectChapters
      };
    }
    return acc;
  }, {} as Record<string, { subject: any; chapters: any[] }>);
  
  const availableSubjects = Object.values(chaptersBySubject);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title={`Chapitres de ${level}`}
          subtitle={`Révisez tous les chapitres de ${level} organisés par matière`}
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 py-12">
          {availableSubjects.length > 0 ? (
            <Tabs defaultValue={availableSubjects[0].subject.id} className="w-full">
              <TabsList className="mb-8 overflow-x-auto pb-1">
                {availableSubjects.map(({ subject }) => (
                  <TabsTrigger key={subject.id} value={subject.id}>
                    {subject.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {availableSubjects.map(({ subject, chapters: subjectChapters }) => (
                <TabsContent key={subject.id} value={subject.id} className="mt-0">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{subject.name} - {level}</h3>
                    <p className="text-gray-600">
                      {subjectChapters.length} chapitre{subjectChapters.length > 1 ? 's' : ''} disponible{subjectChapters.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjectChapters.map(chapter => (
                      <ChapterCard 
                        key={chapter.id} 
                        chapter={chapter} 
                        completed={isChapterCompleted(chapter.id)}
                        progress={getChapterProgress(chapter.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold mb-4">Aucun chapitre disponible</h3>
              <p className="text-gray-600">
                Il n'y a pas encore de chapitres disponibles pour la classe de {level}.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClassChaptersPage;
