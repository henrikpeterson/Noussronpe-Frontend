import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Target } from "lucide-react";
import type { Subject } from "@/newpages/data/Subjects";

/**
 * SUBJECT CARD - Carte matière (60% image / 40% contenu)
 * Design ultra-stylé avec bouton gradient
 */

interface SubjectCardProps {
  subject: Subject;
  index: number;
  onSelect: (subjectId: string) => void;
}

const SubjectCard = ({ subject, index, onSelect }: SubjectCardProps) => {
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
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={subject.image}
          alt={subject.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay gradient subtil */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Badge couleur matière */}
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
              background: `linear-gradient(135deg, ${subject.color}E6, ${subject.color}CC)`
            }}
          >
            {subject.chapters} chapitres
          </div>
        </div>
      </div>

      {/* ═══════════ CONTENU (40%) ═══════════ */}
      <div className="p-6 flex flex-col justify-between h-[200px]">
        
        {/* En-tête */}
        <div>
          {/* Titre */}
          <h3 
            className="text-2xl font-black mb-2 font-fredoka"
            style={{ color: subject.color }}
          >
            {subject.name}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {subject.description}
          </p>
        </div>

        {/* Footer */}
        <div>
          {/* Mini stats */}
          <div className="flex items-center gap-4 mb-4 text-slate-500">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold">{subject.chapters} chapitres</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span className="text-xs font-semibold">{subject.exercises} exercices</span>
            </div>
          </div>

          {/* Bouton COMMENCER (ultra-stylé) */}
          <motion.button
        onClick={() => onSelect(subject.id)}
        /* Au survol, le bouton monte légèrement */
        whileHover={{ y: -2 }}
        /* Au clic, le bouton descend pour simuler l'enfoncement physique */
        whileTap={{ y: 4 }}
        className={`
            w-full
            h-14
            bg-gradient-to-r ${subject.gradient}
            text-white
            font-black
            text-base
            rounded-2xl
            flex items-center justify-center gap-2
            relative
            group/button
            font-fredoka
            transition-all
            
            /* ASPECT 3D : On crée la base solide du bouton */
            /* border-black/20 assombrit automatiquement ton dégradé en bas */
            border-b-[6px] border-black/20
            
            /* On retire la bordure au clic pour l'effet "écrasé" */
            active:border-b-0
        `}
        >
        {/* Effet brillant au survol (conservé) */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 z-0" />
        
        {/* Texte et Icône */}
        <span className="relative z-10">COMMENCER</span>
        <ArrowRight className="relative z-10 w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectCard;