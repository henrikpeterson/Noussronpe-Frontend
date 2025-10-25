import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, School } from "lucide-react";
import { Exam } from "@/data/exams";
interface ExamCardProps {
  exam: Exam;
}
export default function ExamCard({
  exam
}: ExamCardProps) {
  return <Link to={`/epreuves/${exam.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="h-32 bg-cover bg-center" style={{
        backgroundImage: exam.imageUrl ? `url(${exam.imageUrl})` : "url(https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)"
      }} />
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <Badge className="bg-afrique-jaune hover:bg-afrique-jaune/80 bg-sky-500">{exam.level}</Badge>
            <Badge variant="outline">{exam.type}</Badge>
          </div>
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{exam.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Clock className="h-4 w-4 mr-1" />
            <span>{exam.duration} min</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <School className="h-4 w-4 mr-1" />
            <span className="truncate">{exam.school}</span>
          </div>
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{exam.description}</p>
        </CardContent>
      </Card>
    </Link>;
}