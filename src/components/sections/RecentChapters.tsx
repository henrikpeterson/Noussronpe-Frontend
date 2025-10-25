
import { chapters } from "@/data/chapters";
import ChapterCard from "@/components/cards/ChapterCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function RecentChapters() {
  // Limiter à 3 chapitres seulement
  const recentChapters = chapters.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Chapitres récents</h2>
        <Button variant="link" asChild className="text-afrique-orange">
          <a href="/revision" className="flex items-center gap-1">
            Voir tout <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentChapters.map((chapter) => (
          <ChapterCard 
            key={chapter.id} 
            chapter={chapter} 
            completed={Math.random() > 0.5}
            progress={Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0}
          />
        ))}
      </div>
    </div>
  );
}
