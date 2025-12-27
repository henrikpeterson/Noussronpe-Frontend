import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Smartphone, Brain, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import smartphoneStudyImage from "@/assets/Revision.png";
import interactiveQuizImage from "@/assets/Defis1vs1.png";
import friendsChallengeImage from "@/assets/RevisionEnGroupe .png";

const slides = [
  {
    id: 1,
    title: "Révisez facilement sur votre smartphone",
    subtitle: "Emportez vos cours partout et révisez en toute simplicité",
    cta: "Commencer à réviser",
    link: "/revision",
    icon: Smartphone,
    image: smartphoneStudyImage,
    position: "bottom-left",
  },
  {
    id: 2,
    title: "Révision interactive avec quiz",
    subtitle: "Testez vos connaissances avec nos quiz intelligents et adaptatifs",
    cta: "Faire un quiz",
    link: "/quiz",
    icon: Brain,
    image: interactiveQuizImage,
    position: "top-right",
  },
  {
    id: 3,
    title: "Défis 1 contre 1 pour apprendre en jouant",
    subtitle: "Challengez vos amis et progressez ensemble de manière ludique",
    cta: "Lancer un défi",
    link: "/defi/amis",
    icon: Users,
    image: friendsChallengeImage,
    position: "bottom-right",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[75vh] min-h-[500px] overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-b-3xl">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          const isActive = index === currentSlide;
          const positionClasses = {
            "top-left": "top-12 left-12",
            "top-right": "top-12 right-12",
            "bottom-left": "bottom-12 left-12",
            "bottom-right": "bottom-12 right-12",
          };

          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-in-out",
                isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              )}
            >
              {/* Image de fond */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay de fondu */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

              {/* Carte décorative */}
              <div
                className={cn(
                  "absolute max-w-lg p-6 rounded-2xl backdrop-blur-md bg-white/80 shadow-lg border border-white/40 transition-all duration-700",
                  positionClasses[slide.position as keyof typeof positionClasses]
                )}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-blue-100 mr-3">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                    {slide.title}
                  </h1>
                </div>

                <p className="text-gray-700 text-base md:text-lg mb-5 leading-relaxed">
                  {slide.subtitle}
                </p>

                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-md font-semibold"
                >
                  <a href={slide.link}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flèches navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-blue-600/20 backdrop-blur-sm text-blue-700 hover:bg-blue-600/30 transition-all duration-200"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-blue-600/20 backdrop-blur-sm text-blue-700 hover:bg-blue-600/30 transition-all duration-200"
        aria-label="Slide suivant"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots de pagination */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-blue-600 scale-125 shadow-md"
                : "bg-blue-400/50 hover:bg-blue-500/70"
            )}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
