import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, BarChart3, ArrowRight, Star, Zap, Users } from "lucide-react";
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

const BENEFITS = [
  {
    img: "reading.png",
    icon: BookOpen,
    label: "Cours & Exercices",
    desc: "Contenus interactifs",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    img: "trophy.png",
    icon: Trophy,
    label: "Défis & Récompenses",
    desc: "Progresse et gagne",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    img: "barchart.png",
    icon: BarChart3,
    label: "Statistiques",
    desc: "Suis ta progression",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

const FLOATING_STATS = [
  {
    icon: Users,
    value: "2 400+",
    label: "Élèves actifs",
    color: "text-blue-600",
    bg: "bg-white",
    position: "top-6 right-4 lg:right-12",
    delay: 0,
  },
  {
    icon: Trophy,
    value: "98%",
    label: "Taux de satisfaction",
    color: "text-amber-500",
    bg: "bg-white",
    position: "bottom-10 left-2 lg:left-6",
    delay: 0.3,
  },
  {
    icon: Zap,
    value: "5 min",
    label: "Par session",
    color: "text-emerald-500",
    bg: "bg-white",
    position: "top-1/2 -right-2 lg:right-0",
    delay: 0.6,
  },
];

export default function NewHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">

      {/* ── Fond enrichi ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grand blob bleu droit */}
        <div className="absolute top-[-15%] right-[-8%] w-[580px] h-[580px] rounded-full bg-gradient-to-br from-blue-100 to-blue-50 blur-3xl opacity-70" />
        {/* Blob indigo bas-gauche */}
        <div className="absolute bottom-[-10%] left-[-6%] w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 blur-3xl opacity-60" />
        {/* Petites formes géométriques décoratives */}
        <div className="absolute top-20 left-[10%] w-3 h-3 rounded-full bg-blue-300 opacity-40" />
        <div className="absolute top-40 left-[18%] w-2 h-2 rounded-full bg-indigo-400 opacity-30" />
        <div className="absolute bottom-24 right-[15%] w-4 h-4 rounded-full bg-blue-200 opacity-50" />
        <div className="absolute top-1/3 left-[5%] w-2 h-2 rotate-45 bg-blue-300 opacity-30" />
        {/* Ligne décorative diagonale subtile */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative mx-auto px-6 grid grid-cols-1 lg:grid-cols-[48%_52%] gap-10 lg:gap-6 items-center">

        {/* ══════════ GAUCHE ══════════ */}
        <div className="z-10 text-center lg:text-left">

          {/* Badge confiance */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm"
          >
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            <span>Plateforme n°1 pour la réussite scolaire au Togo</span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.2rem] font-black text-slate-900 leading-[1.08] mb-5 tracking-tight"
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
              {/* Soulignement animé */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-400 to-blue-600 origin-left"
              />
            </span>
            ,{" "}
            <br className="hidden sm:block" />
            Réussis.
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl text-slate-500 font-normal mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Une plateforme éducative interactive pour réviser, t'exercer,
            relever des défis et suivre ta progression en temps réel.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-14"
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link to="/dashboard" className="no-underline"> 
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-lg font-bold rounded-xl shadow-lg shadow-blue-200 transition-colors"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 h-14 text-lg font-semibold rounded-xl transition-colors"
              >
                Voir les fonctionnalités
              </Button>
            </motion.div>
          </motion.div>

          {/* Bénéfices — mini cartes */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {BENEFITS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${item.border} ${item.bg} transition-all duration-200 cursor-default`}
                >
                  <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ══════════ DROITE ══════════ */}
        <div className="relative flex justify-center items-center w-full min-h-[380px] lg:min-h-[480px]">

          {/* Blob de fond derrière l'illustration */}
          <div
            className="absolute w-[85%] h-[85%] rounded-full"
            style={{
              background: "radial-gradient(ellipse at 60% 40%, #dbeafe 0%, #eff6ff 55%, transparent 80%)",
            }}
          />

          {/* Cercle décoratif pointillé */}
          <svg
            className="absolute w-[90%] h-[90%] opacity-20 animate-spin"
            style={{ animationDuration: "30s" }}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Illustration principale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative z-10 w-full max-w-[520px]"
          >
            <img
              src="src/assets/Revision.png"
              alt="Étudiant qui révise"
              className="w-full h-auto drop-shadow-[0_24px_48px_rgba(37,99,235,0.15)]"
              loading="eager"
            />
          </motion.div>

          {/* ── Cartes stats flottantes ── */}
          {FLOATING_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + stat.delay, duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.06, y: -2 }}
                className={`absolute ${stat.position} z-20 hidden md:flex items-center gap-3 ${stat.bg} rounded-2xl px-4 py-3 shadow-xl border border-slate-100`}
                style={{
                  boxShadow: "0 8px 32px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div className={`p-2 rounded-xl ${stat.bg === "bg-white" ? "bg-blue-50" : ""}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-base font-black ${stat.color} leading-none`}>{stat.value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Petits dots décoratifs autour de l'illustration */}
          <div className="absolute top-8 left-8 w-2.5 h-2.5 rounded-full bg-blue-400 opacity-40 animate-pulse" />
          <div className="absolute bottom-16 right-8 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-4 w-2 h-2 rounded-full bg-blue-300 opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
      </div>
    </section>
  );
}