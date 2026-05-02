import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════
// ✅ IMPORTS DE TES SVG (à ajuster selon le chemin)
// ═══════════════════════════════════════════════════════════

// Option A : Si tes SVG sont dans src/assets/
import RevisionSVG from "@/assets/Revision.svg?react";
import EntrainementSVG from "@/assets/entrainement.svg?react";
import JeuxSVG from "@/assets/jeux.svg?react";
import AssistanceSVG from "@/assets/AssistanceEducative.svg?react";

// OU Option B : Si dans src/assets/icons/
// import RevisionSVG from "@/assets/icons/Revision.svg?react";
// import EntrainementSVG from "@/assets/icons/entrainement.svg?react";
// import JeuxSVG from "@/assets/icons/jeux.svg?react";
// import AssistanceSVG from "@/assets/icons/AssitanceEducative.svg?react";

/**
 * 📍 SIDEBAR DESKTOP - Navigation principale style Coddy
 * Avec icônes SVG custom
 */

interface SidebarProps {
  activeModule: "revision" | "entrainement" | "jeux" | "assistance";
  onModuleChange: (module: "revision" | "entrainement" | "jeux" | "assistance") => void;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES ITEMS DE NAVIGATION (avec tes SVG)
// ═══════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { 
    id: "revision" as const,
    icon: RevisionSVG,
    label: "Révision",
  },
  { 
    id: "entrainement" as const,
    icon: EntrainementSVG,
    label: "Entraînement",
  },
  { 
    id: "jeux" as const,
    icon: JeuxSVG,
    label: "Jeux",
  },
  { 
    id: "assistance" as const,
    icon: AssistanceSVG,
    label: "Assistance",
  },
];

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════
const Sidebar = ({ activeModule, onModuleChange }: SidebarProps) => {
  return (
    <aside 
      className="
        hidden lg:flex
        w-[200px] 
        flex-col 
        bg-white 
        border-r border-slate-200
        h-screen
      "
    >
      
      {/* ═══════════ LOGO REVIZ+ ═══════════ */}
      <div className="px-5 pt-6 pb-4">
        <h1 
          className="text-2xl font-black tracking-tight cursor-pointer font-fredoka"
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          onClick={() => onModuleChange("revision")}
        >
          Reviz+
        </h1>
      </div>

      {/* ═══════════ NAVIGATION ITEMS ═══════════ */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeModule === item.id;
            const IconComponent = item.icon;

            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <motion.button
                  onClick={() => onModuleChange(item.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full
                    relative
                    flex items-center gap-3
                    px-3.5 py-2.5
                    rounded-xl
                    transition-all duration-200
                    group
                    ${
                      isActive
                        ? "bg-slate-100"
                        : "hover:bg-slate-50"
                    }
                  `}
                >
                  {/* SVG Icon */}
                  <div className="flex-shrink-0 w-5 h-5 transition-transform duration-200 group-hover:scale-110">
                    <IconComponent 
                      className={`
                        w-full h-full
                        transition-all duration-200
                        ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}
                      `}
                      style={{
                        // Permet de coloriser le SVG si fill="currentColor" dans le SVG
                        color: isActive ? "#2563EB" : "#64748B",
                      }}
                    />
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={`
                        text-[15px] font-semibold leading-tight truncate
                        font-fredoka
                        transition-colors duration-200
                        ${
                          isActive
                            ? "text-slate-900"
                            : "text-slate-600 group-hover:text-slate-900"
                        }
                      `}
                    >
                      {item.label}
                    </p>
                  </div>

                  {/* Indicateur actif (petit point) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-1.5 h-1.5 bg-blue-600 rounded-full"
                      transition={{ 
                        type: "spring", 
                        stiffness: 380, 
                        damping: 30 
                      }}
                    />
                  )}
                </motion.button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* ═══════════ FOOTER (optionnel) ═══════════ */}
      <div className="px-5 py-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center font-medium">
          Version 2.0
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;