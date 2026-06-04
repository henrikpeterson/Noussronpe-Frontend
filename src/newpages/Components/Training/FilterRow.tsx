interface FilterRowProps {
  icone: string;
  label: string;
  valeurSelectionnee: string | null;
  onClick: () => void;
  onReset: () => void;
  disabled?: boolean;
  bgColor: string; // La couleur de fond dynamique
}

const FilterRow = ({
  icone,
  label,
  valeurSelectionnee,
  onClick,
  onReset,
  disabled = false,
  bgColor,
}: FilterRowProps) => {

  const estRempli = valeurSelectionnee !== null;

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        group relative flex items-center gap-4 p-4 transition-all duration-100
        border-2 rounded-2xl border-white/20 border-b-4
        ${bgColor}
        ${disabled 
          ? 'opacity-50 border-b-2 cursor-not-allowed' 
          : 'cursor-pointer active:border-b-0 active:translate-y-1'
        }
      `}
    >
      {/* ICÔNE TUILE */}
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center text-lg
        bg-white/10 border-2 border-white/10 text-white
      `}>
        {icone}
      </div>

      {/* TEXTES (EN BLANC) */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-0.5 text-white/70">
          {label}
        </p>

        <p className="text-sm font-black text-white truncate font-fredoka uppercase">
          {valeurSelectionnee || "Non défini"}
        </p>
      </div>

      {/* ACTIONS */}
       <div className="flex items-center">
        {!disabled && (
          estRempli ? (
            /* BOUTON RESET (×) */
            <button
              onClick={(e) => { e.stopPropagation(); onReset(); }}
              className="w-8 h-8 flex items-center justify-center bg-white/20 text-white rounded-lg font-black text-lg border-2 border-white/10 border-b-4 hover:bg-white/30 active:border-b-0 active:translate-y-1 transition-all"
            >
              ×
            </button>
          ) : (
            /* NOUVEAU BOUTON "CHOISIR" ASPECT 3D */
            <div className="
              px-3 py-1.5 
              bg-white 
              text-black text-[10px] font-fredoka font-bold uppercase tracking-widest 
              rounded-xl 
              border-2 border-gray/20 border-b-4
              group-hover:bg-white/40 group-hover:border-white/20
              transition-all duration-200
            ">
              Choisir
            </div>
          )
        )}
        
        {/* CADENAS SI DÉSACTIVÉ */}
        {disabled && (
          <div className="w-8 h-8 flex items-center justify-center bg-black/10 rounded-lg">
            <span className="text-white text-sm">🔒</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterRow;