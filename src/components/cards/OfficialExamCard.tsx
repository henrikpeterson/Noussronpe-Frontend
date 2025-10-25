
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users } from "lucide-react";
import { OfficialExam } from "@/data/officialExams";

interface OfficialExamCardProps {
  exam: OfficialExam;
}

export default function OfficialExamCard({ exam }: OfficialExamCardProps) {
  return (
    <Link to={`/examens-officiels/${exam.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className={`h-2 bg-gradient-to-r from-professional-blue to-professional-blue-dark`} />
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <Badge className={`bg-gradient-to-r from-professional-blue to-professional-blue-dark hover:bg-${exam.color}/80 text-white`}>
              {exam.name}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="h-4 w-4 mr-1" />
              <span>{exam.examCount}</span>
            </div>
          </div>
          
          <h3 className="font-bold text-lg mb-3">{exam.name}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {exam.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              <span>Matières principales :</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {exam.subjects.slice(0, 3).map((subject, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {subject}
                </Badge>
              ))}
              {exam.subjects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{exam.subjects.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
