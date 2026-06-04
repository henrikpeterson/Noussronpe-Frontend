import { motion } from "framer-motion";
import type { Games } from "@/newpages/data/Games"; 
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Gamepad2 } from 'lucide-react';

interface GameCardProps {
  game: Games;
  index: number;
  onSelect: (gameId: string) => void;
}

const GamesCard = ({ game, index, onSelect }: GameCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="
        group
        max-w-2xl
        mx-auto
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-lg
        hover:shadow-2xl
        transition-shadow
        duration-300
        border-2
        border-slate-100
        hover:border-slate-200
      "
    >
      {/* ═══════════ IMAGE (60%) ═══════════ */}
      <div className="relative h-[250px] overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay gradient subtil */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div className="absolute top-4 right-4">
          <div 
            className={`
              px-4 py-2 
              rounded-full 
              backdrop-blur-md
              border-2 border-white/30
              font-bold text-sm text-white
              shadow-lg
            `}
            style={{ 
              background: `linear-gradient(135deg, ${game.color}E6, ${game.color}CC)`
            }}
          >
            {game.name}
          </div>
        </div>

      </div>
      

      {/* ═══════════ CONTENU (40%) ═══════════ */}
      <div className="p-6 flex flex-col justify-between min-h-[250px]">
        
        {/* En-tête */}
        <div>
          <h3 
            className="text-2xl font-black mb-2 font-fredoka"
            style={{ color: game.color }}
          >
            {game.name}
          </h3>

          <p className="text-slate-600 font-fredoka font-bold text-sm leading-relaxed mb-6">
            {game.description}
          </p>
        </div>

        {/* Footer avec les Skills Dynamiques */}
        <div>
          {/* Grille de compétences (max 4) */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6">
            {game.skills?.map((skill, idx) => {
              const IconComponent = skill.icon;
              return (
                <div key={idx} className="flex items-center gap-2 text-slate-500">
                  <div 
                    className="p-1.5 rounded-lg" 
                    style={{ backgroundColor: `${game.color}15` }} // Fond très léger avec la couleur du jeu
                  >
                    <IconComponent 
                      size={16} 
                      style={{ color: game.color }} 
                      strokeWidth={2.5} 
                    />
                  </div>
                  <span className="text-[11px] font-fredoka font-bold uppercase tracking-wider truncate">
                    {skill.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bouton COMMENCER */}
          <motion.button
            onClick={() => onSelect(game.id)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 4 }}
            className={`
                w-full
                h-12 
                bg-gradient-to-r ${game.gradient}
                text-white
                font-black
                text-sm
                rounded-xl
                relative
                group/button
                font-fredoka
                transition-all
                border-b-[4px] border-black/20 
                active:border-b-0
                overflow-hidden {/* Important pour l'effet de brillance */}
            `}
          >
            {/* Effet de brillance (Glow) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 z-0" />
            
            {/* Lien qui encapsule tout l'intérieur du bouton pour une zone cliquable maximale */}
            <Link 
              to={game.path} 
              className="w-full h-full flex items-center justify-center gap-2.5 relative z-10"
            >
              {/* ✅ AJOUT : Icône de manette avec styles */}
              <Gamepad2 
                className="w-5 h-5 text-white/90 group-hover/button:scale-110 transition-transform" 
                strokeWidth={2.5} 
              />
              
              <span className="relative">COMMENCER</span>
            </Link>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GamesCard;