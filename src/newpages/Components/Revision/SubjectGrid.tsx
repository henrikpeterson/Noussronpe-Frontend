import { motion } from "framer-motion";
import { BookOpen, Calculator, Leaf, Globe, Languages, History } from "lucide-react";
import type { SelectedSubject } from "./RevisionModule";

/**
 * 📚 ÉTAPE A : GRILLE DE SÉLECTION DES MATIÈRES
 * Cartes cliquables pour choisir une matière
 */

interface SubjectGridProps {
  onSelectSubject: (subject: SelectedSubject) => void;
}

// Configuration des matières avec leurs couleurs et icônes
const SUBJECTS = [
  { 
    id: "mathematiques", 
    name: "Mathématiques", 
    icon: Calculator, 
    color: "#2563EB",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    chapters: 12,
  },
  { 
    id: "francais", 
    name: "Français", 
    icon: BookOpen, 
    color: "#DC2626",
    gradient: "from-red-500 to-rose-600",
    lightBg: "bg-red-50",
    chapters: 10,
  },
  { 
    id: "sciences", 
    name: "Sciences", 
    icon: Leaf, 
    color: "#059669",
    gradient: "from-emerald-500 to-green-600",
    lightBg: "bg-emerald-50",
    chapters: 8,
  },
  { 
    id: "histoire", 
    name: "Histoire-Géo", 
    icon: Globe, 
    color: "#D97706",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    chapters: 15,
  },
  { 
    id: "anglais", 
    name: "Anglais", 
    icon: Languages, 
    color: "#7C3AED",
    gradient: "from-purple-500 to-violet-600",
    lightBg: "bg-purple-50",
    chapters: 9,
  },
  { 
    id: "philosophie", 
    name: "Philosophie", 
    icon: History, 
    color: "#0891B2",
    gradient: "from-cyan-500 to-blue-600",
    lightBg: "bg-cyan-50",
    chapters: 11,
  },
];

const SubjectGrid = ({ onSelectSubject }: SubjectGridProps) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-fredoka text-slate-900 mb-2">
          Choisis ta matière 
        </h2>
        <p className="text-slate-600 text-base font-fredoka">
          Sélectionne une matière pour accéder à son parcours de révision
        </p>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((subject, index) => {
          const Icon = subject.icon;

          return (
            <motion.button
              key={subject.id}
              onClick={() => onSelectSubject({
                id: subject.id,
                name: subject.name,
                color: subject.color,
              })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white rounded-3xl p-6 border-2 border-slate-100 hover:border-transparent transition-all duration-300 text-left overflow-hidden"
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              {/* Gradient de fond au survol */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Contenu */}
              <div className="relative z-10">
                
                {/* Badge nombre de chapitres */}
                <div className="absolute top-0 right-0">
                  <span className={`${subject.lightBg} text-xs font-fredoka px-3 py-1 rounded-full text-slate-700 group-hover:bg-white/30 group-hover:text-white transition-colors`}>
                    {subject.chapters} chapitres
                  </span>
                </div>

                {/* Icône */}
                <div 
                  className={`w-16 h-16 ${subject.lightBg} rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors`}
                >
                  <Icon 
                    className="w-8 h-8 group-hover:text-white transition-colors" 
                    style={{ color: subject.color }}
                  />
                </div>

                {/* Titre */}
                <h3 className="text-xl font-fredoka text-slate-900 mb-2 group-hover:text-white transition-colors">
                  {subject.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 font-medium group-hover:text-white/90 transition-colors">
                  Accède au parcours complet de révision
                </p>

                {/* Flèche indicateur */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-fredoka group-hover:text-white transition-colors" style={{ color: subject.color }}>
                    Commencer
                  </span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <svg className="w-4 h-4 group-hover:text-white transition-colors" style={{ color: subject.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>

              </div>

              {/* Effet brillant au survol */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-700" />
              </div>

            </motion.button>
          );
        })}
      </div>

    </div>
  );
};

export default SubjectGrid;