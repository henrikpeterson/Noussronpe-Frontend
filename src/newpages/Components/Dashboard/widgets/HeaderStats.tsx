import { Flame, Coins, Zap } from "lucide-react";

/**
 * HEADER STATS - Badges Streak, Jetons, Level
 * Style : Inspiré de Coddy 
 */

const HeaderStats = () => {
  // Données fictives (à remplacer par les vraies données utilisateur)
  const stats = {
    streak: 7,    // Jours consécutifs
    tokens: 50, // Jetons de savoir
    level: 12,    // Niveau utilisateur
  };

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-[#F9FAFB] px-4 py-3">
      <div className="flex items-center gap-9">
        
        {/* Logo (optionnel - remplace "JS" de Coddy) */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">R+</span>
        </div>

        {/* Badge Streak */}
        <div className="flex items-center gap-1.5">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span className="text-base font-bold text-orange-600">{stats.streak}</span>
        </div>

        {/* Badge Jetons */}
        <div className="flex items-center gap-1.5">
          <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-base font-bold text-amber-600">{stats.tokens}</span>
        </div>

        {/* Badge Level */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-5 h-5 text-purple-500 fill-purple-500" />
          <span className="text-base font-bold text-purple-600">{stats.level}</span>
        </div>

      </div>
    </div>
  );
};

export default HeaderStats;