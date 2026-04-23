import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { 
  Gamepad2, 
  Brain, 
  Calculator, 
  Globe2, 
  Beaker, 
  BookText, 
  ArrowLeft, 
  Play, 
  Sparkles 
} from "lucide-react";

/* ─── Liste des Jeux ─── */
const GAMES = [
  {
    id: "quiz-rapide",
    title: "Z-Quiz Togo",
    path: "/Z-Quiz",
    description: "Révise en t'amusant ! Tape les bonnes réponses avant qu'elles ne touchent le sol.",
    icon: Brain,
    color: "#3b82f6", // Blue
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    difficulty: "Moyen",
    players: "Solo"
  },
  {
    id: "math-attack",
    title: "Afri-Puzzle",
    path: "/Afri-Puzzle",
    description: "Résous des équations et des calculs mentaux pour repousser les ennemis.",
    icon: Calculator,
    color: "#10b981", // Emerald
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    difficulty: "Difficile",
    players: "Solo"
  },
  {
    id: "geo-explorer",
    title: "Word-Link",
    path: "/Link-Learn",
    description: "Relie les mots, ameliore ton anglais !",
    icon: Globe2,
    color: "#f59e0b", // Amber
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    difficulty: "Facile",
    players: "Solo"
  },
  {
    id: "labo-mystere",
    title: "Math-Puzzle",
    path: "/math-Puzzle",
    description: "Glisse la bonne opération sur le résultat",
    icon: Beaker,
    color: "#8b5cf6", // Violet
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    difficulty: "Moyen",
    players: "Solo"
  },
  {
    id: "ortho-hero",
    title: "Ortho-Héros",
    path: "/jeu-pct",
    description: "Deviens un champion de l'orthographe et de la grammaire française.",
    icon: BookText,
    color: "#ec4899", // Pink
    bgLight: "bg-pink-50",
    border: "border-pink-200",
    difficulty: "Facile",
    players: "1-2 Joueurs"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const MesJeux = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow">
        {/* ─── Hero Section ─── */}
        <section className="relative py-8 md:py-12 overflow-hidden bg-white"> 
          {/* py-8 au lieu de py-12 réduit l'espace en haut et en bas */}
          
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
          
          <div className="container mx-auto px-4 relative flex flex-col items-center text-center">
            <div className="max-w-2xl"> {/* Réduit un peu la largeur max pour un meilleur rendu centré */}
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                Apprendre en <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">s'amusant</span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                Relève des défis, bats tes records et gagne des points d'expérience 
                en explorant nos jeux éducatifs conçus pour renforcer tes connaissances.
              </p>
              
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour à l'accueil
            </Link>
          </div>
        </section>

        {/* ─── Grille de Jeux ─── */}
        <section className="py-12 container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {GAMES.map((game) => {
              const Icon = game.icon;
              const isHovered = hoveredId === game.id;

              return (
                <motion.div
                  key={game.id}
                  variants={cardVariants}
                  onMouseEnter={() => setHoveredId(game.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative group rounded-3xl p-6 bg-white border-2 transition-all duration-300 shadow-sm hover:shadow-xl ${game.border}`}
                  style={{
                    transform: isHovered ? "translateY(-8px)" : "translateY(0)"
                  }}
                >
                  {/* Badge Difficulté */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                      {game.difficulty}
                    </span>
                  </div>

                  {/* Icon Box */}
                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${game.bgLight}`}
                    style={{ backgroundColor: isHovered ? game.color : undefined }}
                  >
                    <Icon 
                      className="w-8 h-8 transition-colors duration-300" 
                      style={{ color: isHovered ? "white" : game.color }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">{game.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {game.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      {game.players}
                    </div>
                    
                    <Button 
                      asChild
                      className="rounded-xl font-bold transition-all"
                      style={{ 
                        backgroundColor: game.color,
                        boxShadow: isHovered ? `0 8px 20px ${game.color}44` : 'none'
                      }}
                    >
                      <Link to={game.path}>
                      <Button 
                        className="rounded-xl font-bold transition-all px-6"
                        style={{ 
                          backgroundColor: game.color,
                          boxShadow: isHovered ? `0 8px 20px ${game.color}44` : 'none'
                        }}
                      >
                        Jouer
                        <Play className="ml-2 w-3.5 h-3.5 fill-current" />
                      </Button>
                    </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MesJeux;