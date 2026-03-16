import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSlider from "@/components/sections/HeroSlider";
import HeroSection from "@/components/sections/HeroSection";
import SubjectsGrid from "@/components/sections/SubjectsGrid";
import ChapterRevision from "@/components/sections/ChapterRevision";
import OfficialExamsPreparation from "@/components/sections/OfficialExamsPreparation";
import TeacherLoginModal from "@/components/assistance/TeacherLoginModal";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Users, Trophy, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getSelectedChallenge } from "@/data/challenges-rewards";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewHeroSection from "@/components/sections/NewHeroSection";
const Index = () => {
  const selectedChallenge = getSelectedChallenge();
  const [teacherLoginOpen, setTeacherLoginOpen] = useState(false);
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <NewHeroSection />
        {/* Section des fonctionnalités principales */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-700 mb-4">
                NOS OUTILS POUR T’AIDER A REUSSIR 
              </h2>
              <p className="text-blue-500 text-lg">
                Découvre nos fonctionnalités pensées pour optimiser tes révisions
              </p>
            </div>

            {/* Grille 6 cartes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">

              {/* CARD COMPONENT MODEL */}
              {[
                {
                  img: "src/assets/AssitanceEducative.png",
                  title: "ESPACE D'ENTRAINEMENT",
                  text: "Exerce-toi avec nos ressources interactives.",
                  btn: "VOIR PLUS",
                  link: "/espace-entrainement"
                },
                {
                  img: "src/assets/Medicine-bro.png",
                  title: "SANTE & HYGIENE",
                  text: "Apprends à prendre soin de toi.",
                  btn: "DECOUVRIR",
                  link: "/health"
                },
                {
                  img: "src/assets/Revision.png",
                  title: "REVISION PAR CHAPITRE",
                  text: "Révise chaque leçon facilement.",
                  btn: "COMMENCER",
                  link: "/revision"
                },
                {
                  img: "src/assets/Winners-cuate.png",
                  title: "CHALLENGES & RECOMPENSE",
                  text: "Gagne des points et des recompenses physique.",
                  btn: "VOIR LES CHALLENGES",
                  link: "/challenges-recompenses"
                },
                {
                  img: "src/assets/Winners-bro.png",
                  title: "DEFIS 1 VS 1",
                  text: "Défie tes amis sur n'importe quelle sujet.",
                  btn: "LANCER UN DEFI",
                  link: "/MesJeux"
                },
                {
                  img: "src/assets/Teacher student-cuate1.png",
                  title: "ASSISTANCE EDUCATIVE",
                  text: "Suis tes progrès et ameliore toi.",
                  btn: "VOIR MES STATS",
                  link: "/assistance-educative"
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl shadow-md bg-white overflow-hidden border border-blue-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Haut : illustration */}
                  <div className="h-48 flex items-center justify-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-200 object-contain"
                    />
                  </div>

                  {/* Bas : fond bleu + texte + bouton */}
                  <div className="bg-blue-500 py-6 px-4 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-white text-sm mb-4 px-2">
                      {item.text}
                    </p>

                    <Button
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
                    >
                      <Link to={item.link}>{item.btn}</Link>
                    </Button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>


        {/*
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <SubjectsGrid />
        </div>
        
        <div className="bg-white py-16">
          <ChapterRevision />
        </div>
        
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <OfficialExamsPreparation />
        </div>
        */}
        

        {/* Actions rapides */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Actions rapides</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/20 group">
                <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600 mb-6" />
                <div className="text-center">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:from-amber-200 group-hover:to-yellow-200 transition-colors">
                    <Trophy className="h-7 w-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Challenges & Récompenses</h3>
                  <p className="text-muted-foreground mb-6">
                    Fixe-toi des objectifs, relève des défis et gagne des récompenses motivantes !
                  </p>
                  
                  {selectedChallenge && <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-700 mb-1">Objectif actif</p>
                      <p className="text-sm font-semibold text-amber-900">{selectedChallenge.title}</p>
                      <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all" style={{
                      width: `${Math.min(selectedChallenge.current / selectedChallenge.target * 100, 100)}%`
                    }} />
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        {selectedChallenge.current} / {selectedChallenge.target}
                      </p>
                    </div>}
                  
                  <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                    <Link to="/challenges-recompenses">
                      {selectedChallenge ? 'Voir mes défis' : 'Relever un défi'}
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/20 group">
                <div className="h-1 bg-gradient-to-r from-primary to-primary/80 mb-6" />
                <div className="text-center">
                  <div className="p-4 rounded-xl bg-primary/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Défi 1 contre 1</h3>
                  <p className="text-muted-foreground mb-6">Défiez vos amis dans des quiz interactifs et amusez-vous en apprenant.</p>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link to="/defi/amis">Défier un ami</Link>
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/20 group">
                <div className="h-1 bg-gradient-to-r from-primary to-primary/80 mb-6" />
                <div className="text-center">
                  <div className="p-4 rounded-xl bg-primary/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Espace Enseignant 👨‍🏫</h3>
                  <p className="text-muted-foreground mb-6">Accédez à votre espace pour gérer les demandes d'assistance des élèves.</p>
                  <Button onClick={() => setTeacherLoginOpen(true)} className="bg-primary hover:bg-primary/90">
                    Se connecter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />
      </main>
      
      <TeacherLoginModal open={teacherLoginOpen} onOpenChange={setTeacherLoginOpen} />
      <Footer />
    </div>;
};
export default Index;