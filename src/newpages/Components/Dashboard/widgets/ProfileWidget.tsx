import { Coins } from "lucide-react";
import { motion } from "framer-motion";

/**
 * PROFILE WIDGET - Style 3D Gamifié
 * Application du style "Neubrutalisme doux"
 */

const ProfileWidget = () => {
  const user = {
    name: "ALEX MARTIN",
    initials: "AM",
    level: 12,
    tokens: 50,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#44C942] rounded-3xl p-3 border-b-[6px] border-[#007D0A] border-l-2 border-r-2 shadow-sm text-white "
    >
      
      {/* Section Profil */}
      <div className="flex flex-col items-center mb-6">
        
        {/* Avatar 3D */}
        <div className="relative mb-3 group cursor-pointer">
          <div className="w-20 h-20 rounded-full bg-[#1cb0f6] border-b-[6px] border-[#1899d6] flex items-center justify-center text-white font-black text-2xl transition-all active:border-b-0 active:translate-y-[4px]">
            {user.initials}
          </div>
          
          {/* Badge Level 3D */}
          <div className="absolute -bottom-1 -right-1 bg-[#ffc800] rounded-xl px-3 py-1 border-b-4 border-[#e5a500] shadow-sm">
            <span className="text-[10px] font-black text-[#af7e00] uppercase tracking-wider">
              Niv {user.level}
            </span>
          </div>
        </div>

        {/* Nom utilisateur */}
        <h3 className="text-lg font-black text-slate-800 font-fredoka uppercase tracking-wide">
          {user.name}
        </h3>
      </div>

      {/* Card Jetons 3D */}
      <div className="relative group">
        <div className="bg-[#fff4e5] border-2 border-[#ffc800] border-b-[6px] rounded-2xl p-4 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            {/* Icône Jeton Style Duo */}
            <div className="w-12 h-12 bg-[#ffc800] border-b-4 border-[#e5a500] rounded-2xl flex items-center justify-center shadow-inner">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-[#af7e00] font-black uppercase tracking-tighter">Jetons de Savoir</p>
              <p className="text-2xl font-black text-[#af7e00] leading-none">{user.tokens.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default ProfileWidget;