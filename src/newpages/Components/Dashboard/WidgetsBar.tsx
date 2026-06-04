import HeaderStats from "./widgets/HeaderStats";
import ProfileWidget from "./widgets/ProfileWidget";
import ClassSelector from "./widgets/ClassSelector";
import HealthWidget from "./widgets/HealthWidget";
import WidgetFooter from "./widgets/WidgetFooter";
import { X } from "lucide-react";

/**
 * 📊 WIDGETBAR - Colonne droite du Dashboard
 * Gestion correcte de la hauteur sur tous écrans
 */

interface WidgetBarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const WidgetBar = ({ onClose, isMobile = false }: WidgetBarProps) => {
  return (
    <aside 
      className={`
        ${isMobile ? 'w-full' : 'w-[20vw] min-w-[260px] max-w-[320px]'} 
        bg-[#F9FAFB] 
        border-l border-slate-200 
        
        flex flex-col
        h-screen
        overflow-hidden
        
      `}
    >
      
      {/* ═══════════ HEADER MOBILE (bouton fermer) ═══════════ */}
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Tableau de bord</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      )}

      {/* ═══════════ HEADER STATS (sticky top) ═══════════ */}
      <div className="flex-shrink-0">
        <HeaderStats />
      </div>

      {/* ═══════════ WIDGETS (scrollable) ═══════════ */}
      <div className="flex-1 overflow-y-auto pl-4 pr-6 py-4">
        <div className="w-full space-y-4">
          <ProfileWidget />
          <ClassSelector />
          <HealthWidget />
        </div>
      </div>

      {/* ═══════════ FOOTER (pas sticky, scroll naturel) ═══════════ */}
      <div className="flex-shrink-0">
        <WidgetFooter />
      </div>

    </aside>
  );
};

export default WidgetBar;