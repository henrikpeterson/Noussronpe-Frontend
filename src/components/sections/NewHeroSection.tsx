import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, BarChart3, ArrowRight, Star } from "lucide-react";

export default function NewHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      {/* Éléments de fond pour remplir le "vide" */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-60" />

      </div>

      <div className="container relative mx-auto px-6 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="z-10 text-center lg:text-left">
          {/* Badge de confiance optionnel */}
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-blue-600" />
            <span>La plateforme n°1 pour la réussite scolaire et l'education sanitaire</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Révise, <span className="text-blue-600">Progresse</span>, Réussis.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Une plateforme éducative interactive pour réviser, t’exercer,
            relever des défis et suivre ta progression en temps réel.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-16">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-lg shadow-lg shadow-blue-200 transition-all hover:-translate-y-1">
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button size="lg" variant="outline" className="border-slate-200 text-blue-700 px-8 h-14 text-lg">
              Voir les fonctionnalités
            </Button>
          </div>

          {/* BENEFITS - Plus aérés avec des cartes discrètes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { img: "reading.png", label: "Cours & Exercices" },
              { img: "trophy.png", label: "Défis & récompenses" },
              { img: "barchart.png", label: "Statistiques" }

            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <img src={`src/assets/icons/${item.img}`} alt={item.label} className="w-6 h-6 object-contain" />
                </div>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="relative flex justify-center items-center w-full">
          {/* Cercles décoratifs animés */}
          <div className="absolute w-[100%] h-[100%] bg-blue-600/5 rounded-full animate-pulse" />

          {/* Icônes flottantes (Lucide) */}
          <div className="absolute top-0 right-10 p-4 bg-white rounded-2xl shadow-xl animate-bounce duration-[3000ms] z-20 hidden md:block">
            <BookOpen className="text-blue-600 w-10 h-10" />
          </div>
          <div className="absolute -bottom-5 left-10 p-4 bg-white rounded-2xl shadow-xl animate-bounce duration-[2000ms] z-20 hidden md:block">
            <Trophy className="text-yellow-500 w-10 h-10" />
          </div>
          {/* Illustration principale - Correction du style */}
          <div className="relative z-10 w-full max-w-[800px] lg:scale-110 transform transition-all">
             <img
              src="src/assets/Revision.png"
              alt="Étudiant qui révise"
              className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}