import motifBackground from "@/assets/Motifs_Educatif.png";
import { subjects } from "@/data/subjects";
import SubjectCard from "@/components/cards/SubjectCard";
import { exams } from "@/data/exams";

export default function SubjectsGrid() {
  const getExamCount = (subjectId: string) => {
    return exams.filter((exam) => exam.subject === subjectId).length;
  };

  return (
    <section className="relative py-10 bg-blue-50 overflow-hidden">
      {/* 🖼️ Fond décoratif */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${motifBackground})`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      {/* Contenu */}
      <div className="relative container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          Épreuves disponibles par matières
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              examCount={getExamCount(subject.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
