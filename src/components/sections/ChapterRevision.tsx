import { subjects } from "@/data/subjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, Calculator, FlaskConical, Brain, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
export default function ChapterRevision() {
  // Récupérer tous les niveaux disponibles et les organiser
  const allLevels = Array.from(new Set(subjects.flatMap(subject => subject.levels))).sort();

  // Fonction pour obtenir l'icône appropriée selon la classe
  const getClassIcon = (level: string) => {
    if (level.includes('6ème') || level.includes('5ème')) return BookOpen;
    if (level.includes('4ème') || level.includes('3ème')) return Users;
    if (level.includes('2nde') || level.includes('1ère')) return Calculator;
    if (level.includes('Terminale')) return Brain;
    return Palette; // icône par défaut
  };
  return <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Réviser un chapitre</h2>
          <p className="text-gray-600">Choisissez votre classe puis révisez efficacement</p>
        </div>
        <Button variant="link" asChild className="text-afrique-orange">
          <Link to="/revision" className="flex items-center gap-1">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="relative">
        <Carousel className="w-full max-w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
             {allLevels.map(level => {
            const IconComponent = getClassIcon(level);
            return <CarouselItem key={level} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                   <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full border-2 border-primary/20 hover:border-primary/40 cursor-pointer group">
                     <Link to={`/revision/classe/${level}`}>
                       <CardContent className="p-6">
                         <div className="flex flex-col items-center text-center">
                           <div className="p-5 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                             <IconComponent className="h-10 w-10 text-primary" />
                           </div>
                           
                           <Badge className="bg-primary hover:bg-primary-hover mb-3 text-primary-foreground">
                             {level}
                           </Badge>
                           
                           <h3 className="font-bold text-lg mb-2 text-foreground">Classe de {level}</h3>
                           
                           <p className="text-sm text-muted-foreground mb-4">
                             Accédez à tous les chapitres de {level} organisés par matière
                           </p>
                           
                           <div className="p-3 rounded-lg w-full bg-blue-100">
                             <p className="text-xs font-bold text-center text-zinc-500">
                               Mathématiques, Physique-Chimie, Français et plus...
                             </p>
                           </div>
                         </div>
                       </CardContent>
                     </Link>
                   </Card>
                 </CarouselItem>;
          })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>;
}