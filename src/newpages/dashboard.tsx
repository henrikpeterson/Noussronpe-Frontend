import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/newpages/hooks/useMediaQuery";
import Sidebar from "@/newpages/Components/Dashboard/Sidebar";
import BottomTabBar from "@/newpages/Components/Dashboard/BottomTabBar";
import WidgetBar from "@/newpages/Components/Dashboard/WidgetsBar";
import MobileHeader from "@/newpages/Components/Dashboard/MobileHeader";
import RevisionModule from "@/newpages/Components/Revision/RevisionModule";
import TrainingModule from "@/newpages/Components/Training/TrainingModule";
import GamesGrid from "./Components/Revision/GamesGrid";
import { useNavigate } from "react-router-dom";
import { GAMES } from "@/newpages/data/Games";

// STYLE CAHIER D'ÉCOLE (GRILLE SANS MARGE)
const notebookGridStyle = {
  backgroundColor: "#fcfcfc",
  backgroundImage: `
    linear-gradient(to right, #e2e8f0 1px, transparent 1px),
    linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
  `,
  backgroundSize: "35px 35px", // Taille des carreaux pour un look équilibré
};

const Dashboard = () => {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const [activeModule, setActiveModule] = useState<"revision" | "entrainement" | "jeux" | "assistance">("revision");
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const navigate = useNavigate(); // Initialise le hook
  // 1. Mise à jour de la fonction pour utiliser le chemin (path)
  const handleSelectGame = (gameId: string) => {
    // On cherche le jeu correspondant dans la liste via son ID
    const selectedGame = GAMES.find(game => game.id === gameId);
    
    // Si le jeu existe et possède un chemin, on navigue vers celui-ci
    if (selectedGame && selectedGame.path) {
      navigate(selectedGame.path);
    }
  };


  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      
      {/* ═══════════════ DESKTOP LAYOUT (3 COLONNES) ═══════════════ */}
      {isDesktop ? (
        <div className="flex h-screen overflow-hidden">
          
          <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />

          {/* COLONNE CENTRE : Appliqué le style cahier ici */}
          <main 
            style={notebookGridStyle}
            className="flex-1 overflow-y-auto border-r border-slate-200"
          >
            <div className="w-full px-4 lg:px-6 py-6 lg:py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeModule === "revision" && <RevisionModule />}
                  {activeModule === "entrainement" && <TrainingModule />}
                  {activeModule === "jeux" && <GamesGrid onSelectSubject={handleSelectGame}/>}
                  {activeModule === "assistance" && (
                    <div className="py-8">
                      <h2 className="text-2xl font-black font-fredoka">Module Assistance</h2>
                      <p className="text-slate-600 mt-2 font-medium">À venir prochainement...</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <WidgetBar />
        </div>
      ) : (
        
        /* ═══════════════ MOBILE LAYOUT ═══════════════ */
        <div className="flex flex-col min-h-screen pb-20 bg-white">
          <MobileHeader 
            activeModule={activeModule}
            onMenuClick={() => setDrawerOpen(true)}
          />

          {/* Contenu principal Mobile avec grille */}
          <main 
            style={notebookGridStyle}
            className="flex-1 overflow-y-auto"
          >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeModule === "revision" && <RevisionModule />}
                  {activeModule === "entrainement" && <TrainingModule />}
                  {activeModule === "jeux" && <GamesGrid onSelectSubject={handleSelectGame}/>}
                  {activeModule === "assistance" && (
                    <div className="py-6">
                      <h2 className="text-2xl font-black font-fredoka">Module Assistance</h2>
                      <p className="text-slate-600 mt-2 font-medium">À venir prochainement...</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <BottomTabBar activeModule={activeModule} onModuleChange={setActiveModule} />

          {/* DRAWER WIDGETBAR */}
          <AnimatePresence>
            {drawerOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setDrawerOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 w-80 h-full z-50 lg:hidden"
                >
                  <WidgetBar onClose={() => setDrawerOpen(false)} isMobile={true} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Dashboard;