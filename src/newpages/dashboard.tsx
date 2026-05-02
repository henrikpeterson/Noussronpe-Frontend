import { useState } from "react";
import { useMediaQuery } from "@/newpages/hooks/useMediaQuery";
import Sidebar from "@/newpages/Components/Dashboard/Sidebar";
import BottomTabBar from "@/newpages/Components/Dashboard/BottomTabBar";
import WidgetBar from "@/newpages/Components/Dashboard/WidgetsBar";
import MobileHeader from "@/newpages/Components/Dashboard/MobileHeader";
import RevisionModule from "@/newpages/Components/Revision/RevisionModule";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 🏠 DASHBOARD PRINCIPAL - LAYOUT 3 COLONNES
 * Architecture adaptative Desktop (3 cols) / Mobile (Bottom Tab)
 */
const Dashboard = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeModule, setActiveModule] = useState<"revision" | "entrainement" | "jeux" | "assistance">("revision");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      
      {/* ═══════════════ DESKTOP LAYOUT (3 COLONNES) ═══════════════ */}
      {isDesktop ? (
        <div className="flex h-screen overflow-hidden">
          
          {/* COLONNE GAUCHE : Navigation */}
          <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />

          {/* COLONNE CENTRE : Contenu dynamique */}
          <main className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeModule === "revision" && <RevisionModule />}
                {activeModule === "entrainement" && <div>Module Entraînement (À venir)</div>}
                {activeModule === "jeux" && <div>Module Jeux (À venir)</div>}
                {activeModule === "assistance" && <div>Module Assistance (À venir)</div>}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* COLONNE DROITE : Widgets persistants */}
          <WidgetBar />
        </div>
      ) : (
        
        /* ═══════════════ MOBILE LAYOUT ═══════════════ */
        <div className="flex flex-col h-screen">
          
          {/* Header Mobile avec Drawer */}
          <MobileHeader 
            activeModule={activeModule} 
            drawerOpen={drawerOpen}
            onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
          />

          {/* Contenu principal */}
          <main className="flex-1 overflow-y-auto px-4 py-6 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeModule === "revision" && <RevisionModule />}
                {activeModule === "entrainement" && <div>Module Entraînement</div>}
                {activeModule === "jeux" && <div>Module Jeux</div>}
                {activeModule === "assistance" && <div>Module Assistance</div>}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Bottom Tab Bar */}
          <BottomTabBar activeModule={activeModule} onModuleChange={setActiveModule} />

          {/* Drawer Widgets Mobile */}
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 overflow-y-auto"
              >
                <WidgetBar onClose={() => setDrawerOpen(false)} isMobile />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay Drawer */}
          {drawerOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setDrawerOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;