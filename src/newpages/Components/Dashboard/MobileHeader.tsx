import { Menu } from "lucide-react";
import { motion } from "framer-motion";

/**
 * 📱 HEADER MOBILE avec bouton Drawer
 */
interface MobileHeaderProps {
  activeModule: string;
  drawerOpen: boolean;
  onDrawerToggle: () => void;
}

const MODULE_TITLES = {
  revision: "📚 Révision",
  entrainement: "💪 Entraînement",
  jeux: "🎮 Jeux Éducatifs",
  assistance: "👨‍🏫 Assistance",
};

const MobileHeader = ({ activeModule, drawerOpen, onDrawerToggle }: MobileHeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-20">
      
      {/* Logo + Titre */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
          <span className="text-white font-black">R+</span>
        </div>
        <h1 className="text-lg font-black text-slate-900">
          {MODULE_TITLES[activeModule as keyof typeof MODULE_TITLES]}
        </h1>
      </div>

      {/* Bouton Menu */}
      <motion.button
        onClick={onDrawerToggle}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </motion.button>
    </header>
  );
};

export default MobileHeader;