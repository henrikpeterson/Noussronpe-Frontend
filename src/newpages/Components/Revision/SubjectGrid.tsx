// src/newpages/Components/Revision/SubjectGrid.tsx - V2
// Plus de prop classe, plus de dropdown. Classe auto depuis User connecté.

import { useMatieres } from '@/hooks/useMatieres';
import SubjectCard from './SubjectCard';
import CourseHeader from './CourseHeader';

interface SubjectGridProps {
  onSelectSubject: (subjectSlug: string) => void;
}

const SubjectGrid = ({ onSelectSubject }: SubjectGridProps) => {
  const { matieres, isLoading, error, classeUser, isAuthenticated } = useMatieres();

  if (isLoading) {
    return (
      <div className="pt-3 pb-8">
        <CourseHeader title="Choisis ta matière" subtitle="Chargement..." />
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-3 pb-8">
        <CourseHeader title="Erreur" subtitle={error} />
      </div>
    );
  }

  const disponibles = matieres.filter(m => m.isAvailable);

  return (
    <div className="pt-3 pb-8">
      <CourseHeader
        title="Choisis ta matière"
        subtitle={
          isAuthenticated
            ? `Classe de ${classeUser} - ${disponibles.length} matières disponibles`
            : `Découvre nos matières (connecte-toi pour voir ta classe)`
        }
      />

      <div className="space-y-8">
        {matieres.map((subject, index) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            index={index}
            onSelect={onSelectSubject}
            disabled={!subject.isAvailable}
          />
        ))}
      </div>

      
    </div>
  );
};

export default SubjectGrid;
