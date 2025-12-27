import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Aminata Diallo",
    role: "Élève en Troisieme",
    content:
      "Grâce à cette plateforme, j'ai pu réviser efficacement pour mon bac. Les quiz interactifs et les défis avec mes amis ont rendu l'apprentissage vraiment motivant !",
    rating: 5,
    initials: "AD",
  },
  {
    id: 2,
    name: "Moussa Konaté",
    role: "Étudiant en Première A4",
    content:
      "L'assistance éducative m'a beaucoup aidé. Les enseignants répondent rapidement et les explications sont claires. Je me sens plus confiant dans mes révisions.",
    rating: 5,
    initials: "MK",
  },
  {
    id: 3,
    name: "Fatoumata Traoré",
    role: "Élève en Sixeme",
    content:
      "J'adore les challenges et récompenses ! Ça me pousse à réviser régulièrement. L'interface est belle et facile à utiliser, même sur mon téléphone.",
    rating: 5,
    initials: "FT",
  },
  {
    id: 4,
    name: "Ibrahim Sow",
    role: "Élève en Terminale D",
    content:
      "Les épreuves d'entraînement sont très complètes. J'ai retrouvé exactement le type d'exercices qu'on a en classe. La progression par chapitre est vraiment bien pensée.",
    rating: 5,
    initials: "IS",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            CE QUE DISENT LES ÉLÈVES
          </h2>
          <p className="text-blue-500 text-lg">
            ⭐⭐⭐⭐⭐ (4.8/5) – Basé sur les retours des élèves testeurs
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => {
                // 🎨 Alternance bleu / blanc
                const isBlue = index % 2 === 1;

                return (
                  <CarouselItem
                    key={testimonial.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-2">
                      <Card
                        className={`h-full transition-all duration-300 border-primary/20 group hover:scale-[1.02]
                          ${isBlue ? "bg-primary text-primary-foreground" : "bg-white text-primary"}
                        `}
                      >
                        <CardContent className="p-6 flex flex-col h-full">
                          
                          <Quote
                            className={`h-10 w-10 mb-4 transition-colors
                            ${isBlue ? "text-primary-foreground/40" : "text-primary/40"}
                            `}
                          />

                          <p
                            className={`text-sm mb-6 flex-grow leading-relaxed
                            ${isBlue ? "text-primary-foreground" : "text-primary"}
                            `}
                          >
                            {testimonial.content}
                          </p>

                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  isBlue
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-amber-400 text-amber-400"
                                }`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-3">
                            <Avatar
                              className={`h-12 w-12 border-2 ${
                                isBlue
                                  ? "border-white/40"
                                  : "border-primary/20"
                              }`}
                            >
                              <AvatarFallback
                                className={`font-semibold
                                ${
                                  isBlue
                                    ? "bg-white/20 text-white"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {testimonial.initials}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <p
                                className={`font-semibold ${
                                  isBlue
                                    ? "text-primary-foreground"
                                    : "text-primary"
                                }`}
                              >
                                {testimonial.name}
                              </p>
                              <p
                                className={`text-xs ${
                                  isBlue
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className="hidden md:flex -left-12 border-primary/20 hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="hidden md:flex -right-12 border-primary/20 hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
