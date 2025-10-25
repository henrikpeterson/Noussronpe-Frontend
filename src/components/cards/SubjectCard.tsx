
import { Link } from "react-router-dom";
import { Book, Calculator, FileText, Globe, FlaskConical, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Subject } from "@/data/subjects";

const icons = {
  book: Book,
  calculator: Calculator,
  file: FileText,
  globe: Globe,
  flask: FlaskConical,
  leaf: Leaf,
  languages: Globe,
};

interface SubjectCardProps {
  subject: Subject;
  examCount: number;
}

export default function SubjectCard({ subject, examCount }: SubjectCardProps) {
  const Icon = icons[subject.icon as keyof typeof icons] || Book;
  
  return (
    <Link to={`/matieres/${subject.id}/epreuves`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden h-full border border-professional-neutral group">
        <div className="h-1 bg-gradient-to-r from-professional-blue to-professional-blue-dark" />
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="p-4 rounded-xl bg-professional-blue/10 mb-4 group-hover:bg-professional-blue/15 transition-colors">
            <Icon className="h-7 w-7 text-professional-blue" />
          </div>
          <h3 className="font-semibold text-lg mb-2 text-professional-navy">{subject.name}</h3>
          <p className="text-sm text-professional-slate font-medium">
            {examCount} épreuves disponibles
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
