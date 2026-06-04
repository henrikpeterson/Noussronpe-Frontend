import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const, delay: i * 0.12 },
  }),
};

const SUBJECTS = [
  { label: "Mathématiques", emoji: "📐" },
  { label: "Français",      emoji: "📝" },
  { label: "Anglais",       emoji: "🌍" },
  { label: "SVT",           emoji: "🌿" },
  { label: "Physique",      emoji: "⚡" },
  { label: "Chimie",        emoji: "🧪" },
  { label: "Histoire",      emoji: "🏛️" },
  { label: "Géographie",    emoji: "🗺️" },
];

// Duplicated 4× for a seamless infinite scroll
const TICKER = [...SUBJECTS, ...SUBJECTS, ...SUBJECTS, ...SUBJECTS];

export default function NewHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">

      {/* ── Grid background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7dd3fc" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.45" />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="relative container mx-auto px-6 pt-16 pb-10 lg:pt-24 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-0 items-center">

          {/* ══ ILLUSTRATION — top on mobile, left on desktop ══ */}
           <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              /* Ajout de 'relative' pour positionner le glow derrière */
              className="order-first flex justify-center items-center w-full relative"
            >
              {/* --- EFFET GLOW D'ARRIÈRE-PLAN --- */}
              {/* Premier cercle : Large, très flou et très doux (Bleu ciel) */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[120%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" 
                aria-hidden="true"
              />
              
              {/* Deuxième cercle : Plus petit, un peu plus saturé (Bleu Reviz+) */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-600/15 rounded-full blur-[60px] animate-pulse pointer-events-none" 
                style={{ animationDuration: '4s' }}
                aria-hidden="true"
              />

              {/* --- L'IMAGE --- */}
              <img
                src="src/assets/Students4.png"
                alt="Étudiant qui révise"
                /* On s'assure que l'image est au-dessus du glow avec relative z-10 */
                className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] h-auto drop-shadow-[0_20px_50px_rgba(37,99,235,0.25)]"
                loading="eager"
              />
           </motion.div>

          {/* ══ TEXT CONTENT — bottom on mobile, right on desktop ══ */}
          <div className="z-10 text-center order-2 flex flex-col items-center mt-7">

              {/* 1. Titre principal ÉNORME et Centré */}
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-[5rem] font-black text-slate-900 leading-[1.1] mb-6 tracking-tight font-fredoka max-w-4xl"
              >
                Révise,{" "}
                <span
                  className="relative inline-block"
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 60%, #60a5fa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Progresse
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
                    className="absolute -bottom-2 left-0 right-0 h-2 rounded-full bg-blue-500/20 origin-left"
                  />
                </span>
                , Réussis.
              </motion.h1>

              {/* 2. Sous-titre centré */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-lg md:text-2xl text-slate-600 font-medium mb-4 max-w-2xl leading-relaxed font-fredoka"
              >
                Une plateforme éducative, interactive pour maîtriser tes cours et reussir tes examens !
              </motion.p>


              {/* 4. Boutons CTA avec effet 3D */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="flex flex-col gap-4 w-full max-w-sm mb-10"
              >
                {/* BOUTON PRIMAIRE 3D */}
                <motion.div whileTap={{ y: 4 }}>
                  <Link to="/dashboard" className="w-full">
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white h-16 text-xl font-black rounded-2xl border-b-[6px] border-blue-800 active:border-b-0 transition-all shadow-lg font-fredoka"
                    >
                      C'EST PARTI !
                    </Button>
                  </Link>
                </motion.div>

                {/* BOUTON SECONDAIRE 3D */}
                <motion.div whileTap={{ y: 2 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-slate-200 border-b-[4px] active:border-b-0 text-slate-600 hover:bg-slate-50 h-14 text-lg font-bold rounded-2xl transition-all font-fredoka"
                  >
                    J'AI DÉJÀ UN COMPTE
                  </Button>
                </motion.div>
              </motion.div>

              {/* 5. Stats/Badges en bas (Style App Store/Google Play) */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={5}
                className="flex flex-wrap items-center justify-center gap-4 -mt-4"
              >
                {/* Badge Satisfaction */}
                <div className="flex items-center gap-2 bg-white border-2 border-slate-100 px-2 py-2 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-sm font-black text-slate-800">4.9</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <span className="text-[11px] font-bold font-fredoka uppercase tracking-wider text-slate-800">
                    Taux de satisfaction
                  </span>
                </div>
              </motion.div>
          </div>
        </div>
      </div>

      {/* ── Subjects ticker strip ── */}
      <div className="relative w-full bg-blue-600 py-4 overflow-hidden mt-1 shadow-inner">
      {/* Masques de dégradé (ajustés pour le nouveau bleu) */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-blue-600 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-blue-600 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-ticker">
        {/* On double souvent la liste pour un scroll infini fluide */}
        {[...TICKER, ...TICKER].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 mx-4 bg-white border-2 border-transparent border-b-[4px] border-b-blue-800/20 hover:border-b-0 hover:translate-y-[2px] transition-all rounded-2xl px-3 py-1.5 cursor-pointer whitespace-nowrap shadow-md group"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform">{s.emoji}</span>
            <span className="text-slate-800 font-black text-sm tracking-tight font-fredoka uppercase">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @keyframes ticker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-ticker {
        animation: ticker 120s linear infinite;
      }
      .animate-ticker:hover {
        animation-play-state: paused;
      }
    `}</style>
    </section>
  );
}