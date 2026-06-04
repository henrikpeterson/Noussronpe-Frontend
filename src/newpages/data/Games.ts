import { 
  Puzzle, Brain, Map, Lightbulb, 
  Search, Beaker, Zap, GraduationCap,
  Calculator, Divide, BrainCircuit, Trophy,
  Languages, SpellCheck, BookOpen, MessageCircle
} from 'lucide-react';

export interface Skill {
  icon: any;
  label: string;
}

export interface Games {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  gradient: string;
  path:string;
  lightBg: string;
  skills: Skill[]; // Ajout des compétences clés
}

export const GAMES: Games[] = [
  {
    id: "Puzzle",
    name: "AfriPuzzle",
    description: "Découvre l'Afrique avec des puzzles et développe ta culture générale",
    image: "src/assets/Games/AfriPuzzle.webp",
    color: "#2563EB",
    gradient: "from-blue-600 to-indigo-600",
    path: "/Afri-Puzzle",
    lightBg: "bg-blue-50",
    skills: [
      { icon: Puzzle, label: "Résolution de problèmes" },
      { icon: Map, label: "Culture Generale" },
      { icon: Brain, label: "Capacités cognitives" },
      { icon: Lightbulb, label: "Réflexion" }
    ]
  },
  {
    id: "Mots",
    name: "Mots mêlés",
    description: "Améliore ta concentration et ta mémoire tout en solidifiant tes bases en Physique-Chimie",
    image: "src/assets/Games/Mots-Meles.webp",
    color: "#ed8b3a",
    gradient: "from-purple-600 to-violet-600",
    path: "/jeu-pct",
    lightBg: "bg-purple-50",
    skills: [
      { icon: Search, label: "Concentration" },
      { icon: Beaker, label: "Esprit Scientifique" },
      { icon: Zap, label: "Vivacité d'esprit" },
      { icon: GraduationCap, label: "Apprentissage" }
    ]
  },
  {
    id: "Maths",
    name: "MathPuzzle",
    description: "Améliore tes bases en mathématiques, tout en t'amusant",
    image: "src/assets/Games/Math-Puzzle.webp",
    color: "#059669",
    gradient: "from-green-600 to-emerald-600",
    path: "/math-Puzzle",
    lightBg: "bg-green-50",
    skills: [
      { icon: Calculator, label: "Calcul Mental" },
      { icon: Divide, label: "Logique" },
      { icon: BrainCircuit, label: "Analyse" },
      { icon: Trophy, label: "Maîtrise" }
    ]
  },
  {
    id: "Anglais",
    name: "Word-Link",
    description: "Développe ton vocabulaire, ta grammaire et apprends l'anglais pas à pas",
    image: "src/assets/Games/Word-Link.webp",
    color: "#1310b9",
    gradient: "from-emerald-600 to-teal-600",
    path: "/Link-Learn",
    lightBg: "bg-emerald-50",
    skills: [
      { icon: Languages, label: "Vocabulaire" },
      { icon: SpellCheck, label: "Grammaire" },
      { icon: BookOpen, label: "Lecture" },
      { icon: MessageCircle, label: "Communication" }
    ]
  },
];