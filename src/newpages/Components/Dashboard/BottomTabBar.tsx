import { motion } from "framer-motion";
import { BookOpen, Dumbbell, Gamepad2, Users } from "lucide-react";

/**
 * 📱 BOTTOM TAB BAR - Navigation Mobile
 */
interface BottomTabBarProps {
  activeModule: string;
  onModuleChange: (module: "revision" | "entrainement" | "jeux" | "assistance") => void;
}

const TABS = [
  { id: "revision", icon: BookOpen, label: "Révision", color: "#2563EB" },
  { id: "entrainement", icon: Dumbbell, label: "Entraînement", color: "#7C3AED" },
  { id: "jeux", icon: Gamepad2, label: "Jeux", color: "#059669" },
  { id: "assistance", icon: Users, label: "Aide", color: "#DC2626" },
];

const BottomTabBar = ({ activeModule, onModuleChange }: BottomTabBarProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-30 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;

          return (
            <motion.button
              key={tab.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => onModuleChange(tab.id as any)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <div
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: isActive ? `${tab.color}15` : "transparent",
                }}
              >
                <Icon 
                  className="w-5 h-5 transition-colors" 
                  style={{ color: isActive ? tab.color : "#94A3B8" }}
                />

                {/* Indicateur actif */}
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute -top-1 w-8 h-1 rounded-full"
                    style={{ background: tab.color }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}
              </div>

              <span 
                className="text-xs font-semibold transition-colors"
                style={{ color: isActive ? tab.color : "#94A3B8" }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;