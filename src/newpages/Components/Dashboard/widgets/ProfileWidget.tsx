import { Coins } from "lucide-react";
import { motion } from "framer-motion";

/**
 * WIDGET PROFIL - Avatar + Jetons de savoir
 */
const ProfileWidget = () => {
  const userName = "Alex Martin";
  const tokens = 1250;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 border-2 border-blue-100"
    >
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
          AM
        </div>

        {/* Nom */}
        <div>
          <p className="text-sm text-slate-600 font-medium">Bienvenue,</p>
          <h3 className="text-lg font-black text-slate-900">{userName}</h3>
        </div>
      </div>

      {/* Jetons de Savoir */}
      <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-600 font-medium">Jetons de Savoir</p>
            <p className="text-xl font-black text-slate-900">{tokens.toLocaleString()}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
        >
          + Gagner
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfileWidget;