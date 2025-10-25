
import { exams } from "@/data/exams";
import ExamCard from "@/components/cards/ExamCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FeaturedExams() {
  // Sélectionner seulement les 3 premiers examens pour la vue "featured"
  const featuredExams = exams.slice(0, 3);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Épreuves populaires</h2>
        <Button variant="link" asChild className="text-afrique-orange">
          <a href="/epreuves" className="flex items-center gap-1">
            Voir tout <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}
