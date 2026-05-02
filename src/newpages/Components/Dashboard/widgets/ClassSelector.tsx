import { useState } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WIDGET SÉLECTEUR DE CLASSE
 */
const CLASSES = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"];

const ClassSelector = () => {
  const [selectedClass, setSelectedClass] = useState("3ème");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap className="w-4 h-4 text-blue-600" />
        <h4 className="text-sm font-bold text-slate-700">Ma Classe</h4>
      </div>

      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl px-4 py-3 flex items-center justify-between transition-all duration-300 hover:border-blue-400"
        >
          <span className="text-base font-black text-blue-700">{selectedClass}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-blue-600" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full bg-white border-2 border-slate-200 rounded-2xl shadow-xl z-10 overflow-hidden"
            >
              {CLASSES.map((classe, index) => (
                <motion.button
                  key={classe}
                  onClick={() => {
                    setSelectedClass(classe);
                    setIsOpen(false);
                  }}
                  whileHover={{ backgroundColor: "#EFF6FF" }}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 transition-colors border-b border-slate-100 last:border-b-0"
                >
                  {classe}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClassSelector;