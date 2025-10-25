import motifBackground from "@/assets/Motifs_Examen.png";
import { officialExams } from "@/data/officialExams";
import OfficialExamCard from "@/components/cards/OfficialExamCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function OfficialExamsPreparation() {
  return (
    <section className="relative py-8 bg-blue-50 overflow-hidden">
      {/* 🖼️ Fond décoratif */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${motifBackground})`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      {/* 📦 Contenu */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Préparation aux examens officiels
            </h2>
            <p className="text-gray-600 mt-2">
              Préparez-vous efficacement aux examens officiels avec nos épreuves types
            </p>
          </div>
          <Button variant="link" asChild className="text-afrique-orange">
            <a href="/examens-officiels" className="flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officialExams.map((exam) => (
            <OfficialExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>
    </section>
  );
}
