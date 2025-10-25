
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { exams } from "@/data/exams";
import { subjects } from "@/data/subjects";
import ExamCard from "@/components/cards/ExamCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const ExamsPage = () => {
  const [level, setLevel] = useState<string>("all");
  const [activityType, setActivityType] = useState<string>("all");
  
  // Récupérer la liste de toutes les matières
  const subjectIds = subjects.map(s => s.id);
  
  // Récupérer tous les niveaux disponibles
  const allLevels = Array.from(
    new Set(exams.map(exam => exam.level))
  ).sort();
  
  // Filtrer les épreuves en fonction des filtres
  const filteredExams = exams.filter(exam => {
    if (level !== "all" && exam.level !== level) return false;
    if (activityType !== "all" && exam.type !== activityType) return false;
    return true;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title="Épreuves et exercices"
          subtitle="Entraînez-vous avec nos épreuves scolaires et améliorez vos compétences."
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue={subjectIds[0]} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <TabsList className="overflow-x-auto pb-1">
                <TabsTrigger value="all">Tout</TabsTrigger>
                {subjects.map(subject => (
                  <TabsTrigger key={subject.id} value={subject.id}>{subject.name}</TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex gap-2">
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {allLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="Exercice">Exercices</SelectItem>
                    <SelectItem value="TD">TD</SelectItem>
                    <SelectItem value="Épreuve">Épreuves</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map(exam => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </TabsContent>
            
            {subjects.map(subject => (
              <TabsContent key={subject.id} value={subject.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExams
                    .filter(exam => exam.subject === subject.id)
                    .map(exam => (
                      <ExamCard key={exam.id} exam={exam} />
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

export default ExamsPage;
