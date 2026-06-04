import { motion } from "framer-motion";
import { BookOpen, Dumbbell, Gamepad2, Users } from "lucide-react";
import logo from "src/assets/RevizNew.webp";

interface SidebarProps {
  activeModule: "revision" | "entrainement" | "jeux" | "assistance";
  onModuleChange: (module: "revision" | "entrainement" | "jeux" | "assistance") => void;
}

const NAV_ITEMS = [
  { id: "revision" as const, icon: BookOpen, label: "FICHES DE REVISIONS", color: "#1cb0f6" },
  { id: "entrainement" as const, icon: Dumbbell, label: "ESPACE ENTRAINEMENT", color: "#f39223" },
  { id: "jeux" as const, icon: Gamepad2, label: "JEUX EDUCATIFS", color: "#58cc02" },
  { id: "assistance" as const, icon: Users, label: "ASSISTANCE EDUCATIVE", color: "#ff4b4b" },
];

const Sidebar = ({ activeModule, onModuleChange }: SidebarProps) => {
  return (
    <aside className="hidden lg:flex w-[18vw] min-w-[220px] max-w-[290px] flex-col bg-[#F2FCFF] border-r-2 border-slate-200 h-screen">
      
      {/* LOGO */}
      <div className="px-5 pt-6 pb-4">
        <h1 
          className="text-3xl font-black tracking-tight cursor-pointer font-fredoka text-[#1cb0f6]"
          onClick={() => onModuleChange("revision")}
        >
          Reviz+
        </h1>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-4">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeModule === item.id;
            const Icon = item.icon;

            return (
              <motion.li key={item.id}>
                <motion.button
                  onClick={() => onModuleChange(item.id)}
                  /* EFFET 3D AU CLIC : Le bouton descend physiquement */
                  whileTap={{ y: 3 }}
                  className={`
                    w-full
                    flex items-center gap-4
                    px-4 py-3
                    rounded-2xl
                    transition-all duration-100
                    font-fredoka
                    group
                    relative
                    border-2
                    ${
                      isActive
                        ? "bg-[#ddf4ff] border-[#1cb0f6] border-b-4 text-[#1cb0f6]" 
                        : "bg-white border-transparent hover:bg-slate-50 text-slate-500"
                    }
                  `}
                >
                  {/* Icône */}
                  <Icon 
                    className={`w-6 h-6 flex-shrink-0 transition-transform group-hover:scale-110`}
                    style={{ color: isActive ? "#1cb0f6" : "#afafaf" }}
                  />

                  {/* Label - Texte plus gras (font-black) */}
                  <span className={`text-[clamp(11px,1vw,14px)] font-black tracking-wide uppercase`}>
                    {item.label}
                  </span>

                  {/* Simulation de l'épaisseur 3D quand il est inactif (optionnel) */}
                  {!isActive && (
                    <div className="absolute inset-0 border-b-4 border-transparent group-active:border-b-0" />
                  )}
                </motion.button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* FOOTER 3D */}
      <div className="m-4 bg-[#1cb0f6] p-3 border-b-[6px] border-[#1899d6] border-l-2 border-r-2 rounded-2xl shadow-md">
        <p className="text-[12px] text-white text-center font-black font-fredoka uppercase tracking-wider">
          © 2026 Tech4Ed Tout droits reserve.
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;