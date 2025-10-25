
import { userProgress } from "@/data/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, Clock, Award } from "lucide-react";

export default function ProgressStats() {
  const { statistics, badges } = userProgress;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Book className="h-4 w-4 text-afrique-orange" />
              Épreuves terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalExamsCompleted}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-afrique-jaune" />
              Temps total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalTimeSpent} min</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-afrique-bleu" />
              Score moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageScore}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Progression par matière</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statistics.subjectStats.map((stat) => (
              <div key={stat.subject} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    {stat.subject === "math" ? "Mathématiques" : 
                     stat.subject === "french" ? "Français" : 
                     stat.subject === "svt" ? "SVT" : stat.subject}
                  </span>
                  <span className="text-sm text-gray-500">
                    {stat.averageScore}%
                  </span>
                </div>
                <Progress value={stat.averageScore} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Badges obtenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-afrique-orange/20 flex items-center justify-center text-afrique-orange mb-2">
                  <Award className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">{badge.name}</span>
                <span className="text-xs text-gray-500">{badge.dateEarned}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
