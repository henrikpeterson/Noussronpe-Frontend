import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSlider from "@/components/sections/HeroSlider";
import SubjectsGrid from "@/components/sections/SubjectsGrid";
import ChapterRevision from "@/components/sections/ChapterRevision";
import OfficialExamsPreparation from "@/components/sections/OfficialExamsPreparation";
import TeacherLoginModal from "@/components/assistance/TeacherLoginModal";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Users, Trophy, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getSelectedChallenge } from "@/data/challenges-rewards";
const Index = () => {
  const selectedChallenge = getSelectedChallenge();
  const [teacherLoginOpen, setTeacherLoginOpen] = useState(false);
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSlider />
        
        {/* Section des fonctionnalités principales */}
        <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            Nos outils pour t'aider à réussir
          </h2>
          <p className="text-blue-500 text-lg">
            Découvre nos fonctionnalités pensées pour optimiser tes révisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/*Carte : Espace d'entraînement */}
          <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg border border-blue-500 transition-all duration-300">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg bg-white/20">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Espace d'entraînement</h3>
            <p className="mb-4 text-sm opacity-100">
              Accédez à une large collection d'épreuves scolaires, Travaux dirigés et exercices classés par matière, niveau et établissement. Entraînez-vous avec nos exercices interactifs.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm" className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 hover:border-white transition-all">
              <Link to="/epreuves">Voir les ressources</Link>
            </Button>
          </div>

          {/*Carte : Révision par Chapitre */}
          <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg border border-blue-500 transition-all duration-300">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg bg-white/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Révision par Chapitre</h3>
            <p className="mb-4 text-sm opacity-100">
              Révisez efficacement grâce à nos fiches pédagogiques synthétiques et validez vos acquis avec des quiz interactifs par chapitre.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 hover:border-white transition-all"
            >
              <Link to="/revision">Commencer à réviser</Link>
            </Button>
          </div>

          {/*Carte : Assistance éducative */}
          <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg border border-blue-500 transition-all duration-300">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg bg-white/20">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Assistance Éducative</h3>
            <p className="mb-4 text-sm opacity-100">
              Pose tes questions à des enseignants qualifiés et obtiens de l'aide personnalisée sur tes cours et exercices.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 hover:border-white transition-all"
            >
              <Link to="/assistance-educative">Poser une question</Link>
            </Button>
          </div>
        </div>
        </div>
        </section>

        
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <SubjectsGrid />
        </div>
        
        <div className="bg-white py-16">
          <ChapterRevision />
        </div>
        
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <OfficialExamsPreparation />
        </div>

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
      </main>
      
      <TeacherLoginModal open={teacherLoginOpen} onOpenChange={setTeacherLoginOpen} />
      <Footer />
    </div>;
};
export default Index;