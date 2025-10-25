
import { useParams } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { exams } from "@/data/exams";
import { subjects } from "@/data/subjects";
import ExamCard from "@/components/cards/ExamCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const SubjectExamsPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [level, setLevel] = useState<string>("all");
  const [activityType, setActivityType] = useState<string>("all");
  
  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Matière non trouvée</h1>
            <p className="mb-6">La matière que vous recherchez n'existe pas.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Filtrer les épreuves pour cette matière
  const subjectExams = exams.filter(exam => exam.subject === subject.id);
  
  // Appliquer les filtres
  const filteredExams = subjectExams.filter(exam => {
    if (level !== "all" && exam.level !== level) return false;
    if (activityType !== "all" && exam.type !== activityType) return false;
    return true;
  });
  
  // Récupérer tous les niveaux disponibles pour cette matière
  const availableLevels = Array.from(
    new Set(subjectExams.map(exam => exam.level))
  ).sort();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title={`Épreuves de ${subject.name}`}
          subtitle={`Découvrez toutes les épreuves de ${subject.name} du collège au lycée.`}
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {filteredExams.length} épreuve{filteredExams.length > 1 ? 's' : ''} disponible{filteredExams.length > 1 ? 's' : ''}
              </h2>
              <p className="text-gray-600">
                Du collège au lycée, toutes les épreuves de {subject.name}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {availableLevels.map(level => (
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
          
          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Aucune épreuve trouvée pour ces critères.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubjectExamsPage;
