import { useState } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CLASS SELECTOR - Style 3D Duolingo
 * Arrière-plan orange avec effet neubrutaliste
 */

const CLASSES = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"];

const ClassSelector = () => {
  const [selectedClass, setSelectedClass] = useState("3ème");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`
      /* Arrière-plan Orange + Bordure 3D */
      bg-[#ff9600] 
      rounded-3xl 
      p-4 
      border-b-[6px] border-[#e68a00] 
      border-l-2 border-r-2 
      shadow-sm
    `}>
      
      {/* Header - Texte blanc pour contraster avec l'orange */}
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-white" />
        <h4 className="text-sm font-black text-white/90 font-fredoka uppercase tracking-wider">
          MA CLASSE
        </h4>
      </div>

      {/* Dropdown / Sélecteur */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ y: -2 }}
          whileTap={{ y: 4 }}
          className={`
            w-full 
            bg-white 
            border-2 border-slate-200 
            border-b-[6px] 
            rounded-2xl 
            px-4 py-2 
            flex items-center justify-between 
            transition-all 
            active:border-b-0
          `}
        >
          <span className="text-lg font-black text-slate-700 font-fredoka">
            {selectedClass}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-[#ff9600] stroke-[3px]" />
          </motion.div>
        </motion.button>

        {/* Options dropdown 3D */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 5 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 border-b-[6px] rounded-2xl shadow-xl z-20 overflow-hidden"
            >
              {CLASSES.map((classe) => (
                <button
                  key={classe}
                  onClick={() => {
                    setSelectedClass(classe);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-base font-black text-slate-600 font-fredoka hover:bg-orange-50 hover:text-[#ff9600] transition-colors border-b border-slate-100 last:border-b-0"
                >
                  {classe}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClassSelector;