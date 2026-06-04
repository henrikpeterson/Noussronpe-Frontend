import { motion } from "framer-motion";

/**
 * COURSE HEADER SLIM - Style Duolingo
 */

interface GamesHeaderProps {
  title?: string;
  subtitle?: string;
  colorVariant?: "green" | "blue" | "purple";
}

const GamesHeader = ({ 
  title = "Apprends en t'amusant",
  subtitle = "Solidifie tes bases devellope ta concentration ainsi que ta culture generale avec nos jeux.",
  colorVariant = "green" // Par défaut bleu comme ta première capture
}: GamesHeaderProps) => {

  const themes = {
    green: "bg-[#58cc02] border-[#46a302]",
    blue: "bg-[#1cb0f6] border-[#1899d6]",
    purple: "bg-[#ce82ff] border-[#af69db]"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        ${themes[colorVariant]} 
        border-b-4 
        rounded-2xl 
        p-4 md:px-6 md:py-4
        mb-7
        text-white 
        font-fredoka 
        shadow-sm
        max-w-3xl
        mx-auto
      `}
    >
      <div className="flex flex-col gap-1">
        {/* Titre - Plus compact */}
        <h1 className="text-xl md:text-2xl font-black leading-none">
          {title}
        </h1>

        {/* Sous-titre - Taille réduite */}
        {subtitle && (
          <p className="text-white/100 text-xs md:text-sm font-medium opacity-90">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default GamesHeader;