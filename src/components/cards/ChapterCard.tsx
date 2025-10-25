import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle } from "lucide-react";
import { Chapter } from "@/data/chapters";
interface ChapterCardProps {
  chapter: Chapter;
  completed?: boolean;
  progress?: number;
}
export default function ChapterCard({
  chapter,
  completed = false,
  progress = 0
}: ChapterCardProps) {
  return <Link to={`/revision/${chapter.subject}/${chapter.id}`}>
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow h-full border-l-4 ${completed ? 'border-l-afrique-vert' : 'border-l-afrique-orange'}`}>
        <CardContent className="p-5 rounded-md">
          <div className="flex justify-between items-start mb-3 rounded-sm">
            <Badge className="bg-afrique-bleu hover:bg-afrique-bleu/80 bg-blue-500">{chapter.level}</Badge>
            {completed && <CheckCircle className="h-5 w-5 text-afrique-vert" />}
          </div>
          <h3 className="font-bold text-lg mb-2">{chapter.title}</h3>
          
          {progress > 0 && <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className="bg-afrique-orange h-2 rounded-full" style={{
            width: `${progress}%`
          }}></div>
            </div>}
          
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>Chapitre complet avec quiz</span>
          </div>
          
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{chapter.description}</p>
        </CardContent>
      </Card>
    </Link>;
}