import { SUBJECTS } from "@/newpages/data/Subjects";
import SubjectCard from "./SubjectCard";
import CourseHeader from "./CourseHeader";

/**
 * SUBJECT GRID - Grille verticale des matières
 * Cartes centrées empilées verticalement
 */

interface SubjectGridProps {
  onSelectSubject: (subjectId: string) => void;
}

const SubjectGrid = ({ onSelectSubject }: SubjectGridProps) => {
  return (
    <div className="pt-3 pb-8">
      
      {/* Header gradient */}
      <CourseHeader 
        title="Choisis ta matière"
        subtitle="Sélectionne une matière pour commencer ton parcours de révision et progresser à ton rythme."
      />

      {/* Liste verticale des cartes */}
      <div className="space-y-8">
        {SUBJECTS.map((subject, index) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            index={index}
            onSelect={onSelectSubject}
          />
        ))}
      </div>

    </div>
  );
};

export default SubjectGrid;