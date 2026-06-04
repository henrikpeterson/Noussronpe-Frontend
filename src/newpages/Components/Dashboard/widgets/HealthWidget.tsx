import { useState, useEffect } from "react";
import { Heart, Info, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

/**
 * 💊 HEALTH WIDGET - Style 3D Duolingo
 * Arrière-plan rouge avec effet neubrutaliste
 */

const HEALTH_MESSAGES = [
  { id: 1, icon: "🚭", title: "Tabac et santé", message: "Fumer une cigarette réduit votre espérance de vie de 11 minutes. Il n'est jamais trop tard pour arrêter." },
  { id: 2, icon: "💊", title: "Drogues et addiction", message: "Les drogues modifient le fonctionnement de ton cerveau et peuvent créer une dépendance rapide et destructrice." },
  { id: 3, icon: "🍎", title: "Nutrition équilibrée", message: "Manger 5 fruits et légumes par jour booste ton énergie et améliore tes performances scolaires de 30%." },
  { id: 4, icon: "🧼", title: "Hygiène quotidienne", message: "Se laver les mains pendant 30 secondes élimine 99% des microbes et prévient de nombreuses maladies." },
  { id: 5, icon: "💤", title: "Sommeil réparateur", message: "Dormir 8-10h par nuit améliore ta mémoire et ta concentration de 40%. Un bon sommeil, c'est la clé du succès." },
  { id: 6, icon: "🏃", title: "Activité physique", message: "30 minutes d'exercice par jour réduisent le stress, améliorent ton humeur et renforcent ton système immunitaire." },
  { id: 7, icon: "🧠", title: "Santé mentale", message: "Parler de tes émotions n'est pas une faiblesse. Prendre soin de ta santé mentale est aussi important que ta santé physique." },
];

const HealthWidget = () => {
  const [currentMessage, setCurrentMessage] = useState(
    HEALTH_MESSAGES[new Date().getDay() % HEALTH_MESSAGES.length]
  );

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setCurrentMessage(HEALTH_MESSAGES[dayOfYear % HEALTH_MESSAGES.length]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      /* ARRIÈRE-PLAN ROUGE + Effet 3D */
      className="bg-[#ff4b4b] rounded-3xl p-5 border-b-[6px] border-[#d33131] border-l-2 border-r-2 shadow-sm"
    >
      
      {/* Header - Texte blanc sur fond rouge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <h4 className="text-xs font-black text-white font-fredoka uppercase tracking-widest">
            SANTÉ ET HYGIÈNE
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-white/10 rounded-xl transition-colors">
            <Info className="w-4 h-4 text-white/80" />
          </button>
        </div>
      </div>

      {/* Conteneur Message 3D Blanc */}
      <div className="bg-white rounded-2xl p-1 border-b-[6px] border-slate-200 relative group transition-all">
        
        {/* Illustration Icone */}
        <div className="flex justify-center mb-2">
          <div className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">
            {currentMessage.icon}
          </div>
        </div>

        {/* Badge "Le saviez-vous ?" */}
        <div className="flex justify-center mb-3">
          <span className="bg-[#ff4b4b]/10 text-[#ff4b4b] text-[10px] font-black px-3 py-1 rounded-full uppercase">
            Le saviez-vous ?
          </span>
        </div>

        {/* Corps du message */}
        <p className="text-sm font-black text-slate-700 leading-relaxed text-center font-fredoka">
          « {currentMessage.message} »
        </p>

        {/* Petit triangle pour l'effet "bulle de texte" optionnel en haut */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l-2 border-t-2 border-slate-100 hidden md:block" />
      </div>

    </motion.div>
  );
};

export default HealthWidget;