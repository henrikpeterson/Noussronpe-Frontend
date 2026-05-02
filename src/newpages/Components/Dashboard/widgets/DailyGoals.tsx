import { Target, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * WIDGET OBJECTIFS QUOTIDIENS
 */
const DailyGoals = () => {
  const completed = 3;
  const total = 5;
  const percentage = (completed / total) * 100;

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-emerald-600" />
        <h4 className="text-sm font-bold text-slate-700">Objectif du jour</h4>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">Quiz complétés</span>
          <span className="text-sm font-black text-emerald-600">{completed}/{total}</span>
        </div>

        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full relative"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow" />
          </motion.div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-2">
        {[
          { label: "Réviser le chapitre 3", done: true },
          { label: "Faire 2 quiz de maths", done: true },
          { label: "Terminer un défi", done: true },
          { label: "Réviser français", done: false },
          { label: "Quiz de sciences", done: false },
        ].map((task, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${task.done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <span className={`text-xs font-medium ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {task.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyGoals;