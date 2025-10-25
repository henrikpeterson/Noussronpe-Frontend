
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { subjects } from "@/data/subjects";
import SubjectCard from "@/components/cards/SubjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exams } from "@/data/exams";

const SubjectsPage = () => {
  // Liste des niveaux disponibles en combinant tous les niveaux de toutes les matières
  const allLevels = Array.from(
    new Set(
      subjects.flatMap(subject => subject.levels)
    )
  ).sort();

  // Fonction pour compter les épreuves par matière
  const getExamCount = (subjectId: string) => {
    return exams.filter(exam => exam.subject === subjectId).length;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title="Explorez nos matières"
          subtitle="Découvrez toutes les matières disponibles et choisissez celle qui vous intéresse."
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all">Toutes les matières</TabsTrigger>
              {allLevels.map(level => (
                <TabsTrigger key={level} value={level}>{level}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subjects.map(subject => (
                  <SubjectCard key={subject.id} subject={subject} examCount={getExamCount(subject.id)} />
                ))}
              </div>
            </TabsContent>
            
            {allLevels.map(level => (
              <TabsContent key={level} value={level} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {subjects
                    .filter(subject => subject.levels.includes(level))
                    .map(subject => (
                      <SubjectCard key={subject.id} subject={subject} examCount={getExamCount(subject.id)} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubjectsPage;
