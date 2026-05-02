import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import TeacherLoginModal from "@/components/assistance/TeacherLoginModal";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Trophy, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Gamepad2, 
  BarChart3, 
  Target,
  Map,
  Rocket,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { getSelectedChallenge } from "@/data/challenges-rewards";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewHeroSection from "@/components/sections/NewHeroSection";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   CONFIGURATION DES NIVEAUX SCOLAIRES
   ══════════════════════════════════════════════════════════ */
const SCHOOL_LEVELS = [
  { id: "6eme", label: "6ème", color: "#3b82f6" },
  { id: "5eme", label: "5ème", color: "#3b82f6" },
  { id: "4eme", label: "4ème", color: "#2563eb" },
  { id: "3eme", label: "3ème", color: "#2563eb" },
  { id: "seconde", label: "2nde", color: "#1d4ed8" },
  { id: "premiere", label: "1ère", color: "#1d4ed8" },
  { id: "terminale", label: "Tle", color: "#1e40af" },
];

/* ═══════════════════════════════════════════════════════════
   VARIANTS D'ANIMATION FRAMER MOTION
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.1, 0.25, 1] as const, 
      delay: i * 0.15 
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
  },
};

/* ═══════════════════════════════════════════════════════════
   COMPOSANT : SÉLECTEUR DE CLASSE (ÉTAPE 1)
   Pills interactives pour choisir son niveau scolaire
   ══════════════════════════════════════════════════════════ */
function ClassSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {SCHOOL_LEVELS.map((level) => (
        <motion.button
          key={level.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelected(level.id)}
          className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2"
          style={{
            background: selected === level.id ? level.color : "white",
            color: selected === level.id ? "white" : level.color,
            borderColor: level.color,
            boxShadow: selected === level.id 
              ? `0 4px 16px ${level.color}40` 
              : "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {level.label}
        </motion.button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANT : ROADMAP VISUELLE (ÉTAPE 2)
   Chemin de progression vertical avec étapes à cocher
   ══════════════════════════════════════════════════════════ */
function ProgressRoadmap() {
  const steps = [
    { label: "Chapitre 1", done: true },
    { label: "Chapitre 2", done: true },
    { label: "Chapitre 3", done: false },
    { label: "Chapitre 4", done: false },
  ];

  return (
    <div className="relative flex items-center gap-4 max-w-md mx-auto">
      {/* Barre de progression de fond */}
      <div className="flex flex-col gap-3 relative">
        {/* Ligne verticale de connexion */}
        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-slate-200" />
        
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-center gap-3 relative z-10"
          >
            {/* Cercle avec icône */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.done 
                  ? "bg-blue-600 shadow-lg shadow-blue-600/40" 
                  : "bg-white border-2 border-slate-300"
              }`}
            >
              {step.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            
            {/* Label */}
            <span
              className={`text-sm font-semibold transition-colors ${
                step.done ? "text-blue-700" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Barre de progression pourcentage */}
      <div className="flex-1 ml-4">
        <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "50%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          />
        </div>
        <p className="text-xs text-blue-600 font-bold mt-1.5 text-right">50% complété</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANT : ASSISTANCE + JEUX (ÉTAPE 3)
   Combinaison bulle chat + manette de jeu
   ══════════════════════════════════════════════════════════ */
function AssistanceGamesVisual() {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Bulle de chat assistance */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: -3 }}
        className="relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl px-6 py-4 shadow-lg"
      >
        <MessageCircle className="w-8 h-8 text-blue-600 mb-1" />
        <p className="text-xs font-bold text-blue-700">Besoin d'aide ?</p>
        {/* Triangle de bulle */}
        <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-blue-300" />
      </motion.div>

      {/* Icône manette de jeu */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: 3 }}
        className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-2xl p-5 shadow-lg"
      >
        <Gamepad2 className="w-10 h-10 text-emerald-600" />
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION PRINCIPALE : TON PARCOURS EN 3 ÉTAPES
   Remplace l'ancienne grille de fonctionnalités
   ══════════════════════════════════════════════════════════ */
function JourneySection() {
  return (
    <section 
      className="py-24 relative overflow-hidden"
      style={{ 
        background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 50%, #EFF6FF 100%)" 
      }}
    >
      {/* ─── Fond décoratif minimaliste ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grille subtile */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="journey-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#2563eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#journey-grid)" />
        </svg>
        
        {/* Blobs lumineux */}
        <div className="absolute top-[-8%] right-[-5%] w-96 h-96 rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/60 blur-3xl" />
        <div className="absolute bottom-[-8%] left-[-5%] w-80 h-80 rounded-full bg-gradient-to-tr from-blue-50/70 to-sky-100/70 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        
        {/* ─── EN-TÊTE SECTION ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-center mb-16"
        >
          {/* Badge décoratif */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-5">
            <Rocket className="w-4 h-4 fill-blue-600" />
            Simple et Efficace
          </div>

          {/* Titre principal */}
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            Ton parcours vers la réussite{" "}
            <span className="relative inline-block">
              <span
                style={{
                  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                en 3 étapes
              </span>
              {/* Soulignement décoratif */}
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                <path d="M2 5C50 2 150 2 198 5" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Un chemin clair et motivant pour atteindre tes objectifs scolaires 🎯
          </p>
        </motion.div>

        {/* ─── GRILLE DES 3 ÉTAPES ─── */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          
          {/* ════════ ÉTAPE 1 : PRÉPARE TA MISSION ════════ */}
          <motion.div
            custom={0}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-white rounded-3xl p-8 border-2 border-blue-100 hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2"
          >
            {/* Barre d'accent supérieure */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-3xl" />
            
            {/* Badge numéro étape */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-lg">1</span>
            </div>

            {/* Icône principale */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Target className="w-8 h-8 text-blue-600" />
            </div>

            {/* Titre */}
            <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Prépare ta mission
            </h3>

            {/* Description */}
            <p className="text-base font-semibold text-slate-500 leading-relaxed mb-6">
              Choisis ta classe et ton chapitre pour lancer ton programme personnalisé.
            </p>

            {/* Élément UI : Sélecteur de classe */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-5 border border-blue-100">
              <p className="text-xs font-bold text-blue-700 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Sélectionne ton niveau
              </p>
              <ClassSelector />
            </div>
          </motion.div>

          {/* ════════ ÉTAPE 2 : APPRENDS ET PRATIQUE ════════ */}
          <motion.div
            custom={1}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-white rounded-3xl p-8 border-2 border-orange-100 hover:border-orange-400 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2"
          >
            {/* Barre d'accent supérieure */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-t-3xl" />
            
            {/* Badge numéro étape */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-lg">2</span>
            </div>

            {/* Icône principale */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Map className="w-8 h-8 text-orange-600" />
            </div>

            {/* Titre */}
            <h3 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              Apprends et Pratique
            </h3>

            {/* Description */}
            <p className="text-base font-semibold text-slate-500 leading-relaxed mb-6">
              Suis ton chemin de révision par chapitre et valide tes connaissances avec l'Espace d'entraînement.
            </p>

            {/* Élément UI : Roadmap visuelle */}
            <div className="bg-gradient-to-br from-slate-50 to-orange-50/50 rounded-2xl p-5 border border-orange-100">
              <p className="text-xs font-bold text-orange-700 mb-4 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Ta progression
              </p>
              <ProgressRoadmap />
            </div>
          </motion.div>

          {/* ════════ ÉTAPE 3 : PROGRESSE SANS LIMITE ════════ */}
          <motion.div
            custom={2}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-white rounded-3xl p-8 border-2 border-emerald-100 hover:border-emerald-400 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2"
          >
            {/* Barre d'accent supérieure */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-t-3xl" />
            
            {/* Badge numéro étape */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-lg">3</span>
            </div>

            {/* Icône principale */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Sparkles className="w-8 h-8 text-emerald-600" />
            </div>

            {/* Titre */}
            <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
              Progresse sans limite
            </h3>

            {/* Description */}
            <p className="text-base font-semibold text-slate-500 leading-relaxed mb-6">
              Utilise l'Assistance Éducative dès que tu bloques et détends-toi avec nos Jeux Éducatifs.
            </p>

            {/* Élément UI : Assistance + Jeux */}
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-700 mb-4 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Outils d'accompagnement
              </p>
              <AssistanceGamesVisual />
            </div>

            {/* Bouton CTA vers outils */}
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
              >
                Commencez votre parcours
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

        </div>

        {/* ─── SECTION BONUS : BIENTÔT DISPONIBLE ─── */}
        <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-16"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-[2px] shadow-2xl shadow-purple-500/30">
            {/* Fond blanc intérieur */}
            <div className="bg-white rounded-3xl px-8 py-6 relative overflow-hidden">
              
              {/* Pattern de fond animé */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 bg-purple-600 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Partie gauche : Texte */}
                <div className="flex items-center gap-4">
                  {/* Badge animé "Coming Soon" */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-md opacity-60 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-lg">
                      BIENTÔT
                    </div>
                  </div>

                  {/* Texte principal */}
                  <div>
                    <p className="text-lg font-bold text-slate-800 mb-1">
                      Nouvelles fonctionnalités en préparation
                    </p>
                    <p className="text-sm text-slate-600">
                      On prépare des trucs de fou pour toi ! 
                    </p>
                  </div>
                </div>

                {/* Partie droite : Features à venir */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                  {/* Badge 1 : Challenges entre amis */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-orange-700">Challenges entre amis</span>
                  </motion.div>

                  {/* Badge 2 : Santé & Hygiène */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                    <span className="text-sm font-bold text-rose-700">Conseils Santé</span>
                  </motion.div>
                </div>

              </div>

              {/* Ligne de progression fictive */}
              <div className="mt-5 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "68%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full relative"
                >
                  {/* Point lumineux qui se déplace */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-pink-500/50" />
                </motion.div>
              </div>
              <p className="text-xs text-slate-500 text-right mt-1.5 font-semibold">Développement : 68%</p>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE PRINCIPALE INDEX
   ══════════════════════════════════════════════════════════ */
const Index = () => {
  const selectedChallenge = getSelectedChallenge();
  const [teacherLoginOpen, setTeacherLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Section Hero */}
        <NewHeroSection />

        {/* ══════════ NOUVELLE SECTION : PARCOURS EN 3 ÉTAPES ══════════ */}
        <JourneySection />

        {/* ══════════ SECTION : ACTIONS RAPIDES ══════════ */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Actions rapides</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

              {/* Carte Challenges & Récompenses */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/20 group">
                <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600 mb-6" />
                <div className="text-center">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:from-amber-200 group-hover:to-yellow-200 transition-colors">
                    <Trophy className="h-7 w-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Challenges & Récompenses</h3>
                  <p className="text-muted-foreground mb-6">
                    Fixe-toi des objectifs, relève des défis et gagne des récompenses motivantes !
                  </p>
                  {selectedChallenge && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-700 mb-1">Objectif actif</p>
                      <p className="text-sm font-semibold text-amber-900">{selectedChallenge.title}</p>
                      <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all"
                          style={{ width: `${Math.min(selectedChallenge.current / selectedChallenge.target * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        {selectedChallenge.current} / {selectedChallenge.target}
                      </p>
                    </div>
                  )}
                  <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                    <Link to="/challenges-recompenses">
                      {selectedChallenge ? 'Voir mes défis' : 'Relever un défi'}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Carte Défi 1 contre 1 */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/20 group">
                <div className="h-1 bg-gradient-to-r from-primary to-primary/80 mb-6" />
                <div className="text-center">
                  <div className="p-4 rounded-xl bg-primary/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Défi 1 contre 1</h3>
                  <p className="text-muted-foreground mb-6">Défiez vos amis dans des quiz interactifs et amusez-vous en apprenant.</p>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link to="/defi/amis">Défier un ami</Link>
                  </Button>
                </div>
              </div>

              {/* Carte Espace Enseignant */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/20 group">
                <div className="h-1 bg-gradient-to-r from-primary to-primary/80 mb-6" />
                <div className="text-center">
                  <div className="p-4 rounded-xl bg-primary/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Espace Enseignant 👨‍🏫</h3>
                  <p className="text-muted-foreground mb-6">Accédez à votre espace pour gérer les demandes d'assistance des élèves.</p>
                  <Button onClick={() => setTeacherLoginOpen(true)} className="bg-primary hover:bg-primary/90">
                    Se connecter
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section Témoignages */}
        <TestimonialsSection />
      </main>

      {/* Modale connexion enseignant */}
      <TeacherLoginModal open={teacherLoginOpen} onOpenChange={setTeacherLoginOpen} />
      
      <Footer />
    </div>
  );
};

export default Index;