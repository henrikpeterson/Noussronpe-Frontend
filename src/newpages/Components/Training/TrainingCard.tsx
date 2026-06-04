import FilterRow from './FilterRow';
import { motion } from 'framer-motion';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface TrainingCardProps {
  icone: string;
  titre: string;
  description: string;
  badge?: string;
  disabled?: boolean;
  couleur: 'jaune' | 'vert' | 'bleu'; // Prop cruciale pour le thème
  labelMatiere: string | null;
  labelClasse: string | null;
  labelType: string | null;
  onOuvrirModaleMatiere: () => void;
  onOuvrirModaleClasse: () => void;
  onOuvrirModaleType: () => void;
  onResetMatiere: () => void;
  onResetClasse: () => void;
  onResetType: () => void;
  peutContinuer: boolean;
  onContinuer: () => void;
}

const TrainingCard = ({
  icone,
  titre,
  description,
  badge,
  disabled = false,
  couleur,
  labelMatiere,
  labelClasse,
  labelType,
  onOuvrirModaleMatiere,
  onOuvrirModaleClasse,
  onOuvrirModaleType,
  onResetMatiere,
  onResetClasse,
  onResetType,
  peutContinuer,
  onContinuer,
}: TrainingCardProps) => {

  // Configuration des thèmes de couleurs vibrantes
  const themes = {
    jaune: {
      bg: 'bg-[#FFB600]',        // Jaune vif
      border: 'border-[#CC9A12]', // Bordure 3D
      socle: 'bg-[#CC9A12]',
      filterBg: 'bg-[#FCEC14]'    // Couleur des briques de filtres
    },
    vert: {
      bg: 'bg-[#58CC02]',        // Vert Coddy/Duolingo
      border: 'border-[#46A302]',
      socle: 'bg-[#46A302]',
      filterBg: 'bg-[#4EB502]'
    },
    bleu: {
      bg: 'bg-[#1CB0F6]',
      border: 'border-[#1899D6]',
      socle: 'bg-[#1899D6]',
      filterBg: 'bg-[#1A9FD6]'
    }
  };

  const theme = themes[couleur];

  return (
    <div className={`relative w-full transition-all duration-200 ${disabled ? 'opacity-60 grayscale-[0.2]' : 'hover:-translate-y-1'}`}>
      
      {/* ── LE SOCLE (L'épaisseur 3D) ── */}
      <div className={`absolute inset-0 translate-y-2 rounded-[32px] ${disabled ? 'bg-slate-300' : theme.socle}`} />

      {/* ── LE CORPS DE LA CARTE ── */}
      <div className={`
        relative border-2 rounded-[32px] p-6 transition-colors
        ${disabled ? `${theme.bg} ${theme.border}` : `${theme.bg} ${theme.border}`}
      `}>
        
        {/* EN-TÊTE (Texte blanc) */}
        <div className="flex items-center gap-5 mb-8">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
            border-2 border-b-[6px]
            ${disabled 
              ? 'bg-white/20 border-white/30 text-white' 
              : 'bg-white/20 border-white/30 text-white'
            }
          `}>
            {icone}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-black font-fredoka uppercase tracking-tight ${disabled ? 'text-white' : 'text-white'}`}>
                {titre}
              </h2>
              {badge && (
                <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-b-2 border-white/10 uppercase">
                  {badge}
                </span>
              )}
            </div>
            <p className={`text-sm font-bold font-fredoka ${disabled ? 'text-white' : 'text-white'}`}>
              {description}
            </p>
          </div>
        </div>

        {/* ── ZONE DES FILTRES (ESPACÉS COMME DES BRIQUES) ── */}
        <div className="flex flex-col gap-3 mb-8">
          <FilterRow
            icone="📚" label="Matière"
            valeurSelectionnee={labelMatiere}
            onClick={onOuvrirModaleMatiere} onReset={onResetMatiere}
            disabled={disabled}
            bgColor={theme.filterBg}
          />
          <FilterRow
            icone="🎓" label="Niveau"
            valeurSelectionnee={labelClasse}
            onClick={onOuvrirModaleClasse} onReset={onResetClasse}
            disabled={disabled}
            bgColor={theme.filterBg}
          />
          <FilterRow
            icone="📋" label="Type"
            valeurSelectionnee={labelType}
            onClick={onOuvrirModaleType} onReset={onResetType}
            disabled={disabled}
            bgColor={theme.filterBg}
          />
        </div>

        {/* BOUTON D'ACTION (Blanc pour trancher) */}
        <button
          onClick={!disabled && peutContinuer ? onContinuer : undefined}
          disabled={disabled || !peutContinuer}
          className={`
            w-full h-14 rounded-2xl font-black text-sm tracking-widest transition-all duration-150
            flex items-center justify-center gap-3 border-b-[6px]
            ${disabled 
              ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
              : peutContinuer
                ? 'bg-white text-slate-800 border-slate-200 active:border-b-0 active:translate-y-1 hover:bg-slate-50 shadow-lg'
                : 'bg-black/10 text-white/50 border-black/10 cursor-not-allowed'
            }
          `}
        >
          {disabled ? (
            <><span>🔒</span> INDISPONIBLE</>
          ) : peutContinuer ? (
            <><span>C'EST PARTI</span> <span className="text-xl">🚀</span></>
          ) : (
            <><span>SÉLECTIONNE TES FILTRES</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default TrainingCard;