import { X } from "lucide-react";
import ProfileWidget from "./widgets/ProfileWidget";
import ClassSelector from "./widgets/ClassSelector";
import DailyGoals from "./widgets/DailyGoals";
import { motion } from "framer-motion";

/**
 * 📊 WIDGET BAR - Colonne droite persistante (Desktop) ou Drawer (Mobile)
 */
interface WidgetBarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const WidgetBar = ({ onClose, isMobile = false }: WidgetBarProps) => {
  return (
    <aside className={`${isMobile ? 'w-full' : 'w-80'} bg-white border-l border-slate-200 p-6 overflow-y-auto`}>
      
      {/* Header Mobile (bouton fermer) */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900">Mes Infos</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      )}

      {/* Stack de Widgets */}
      <div className="space-y-6">
        <ProfileWidget />
        <ClassSelector />
        <DailyGoals />
      </div>
    </aside>
  );
};

export default WidgetBar;