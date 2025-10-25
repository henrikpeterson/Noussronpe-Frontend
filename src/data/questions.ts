export interface ChallengeQuestion {
  id: number;
  type: "multiple-choice" | "text" | "numeric";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
  explanation?: string;
}

// Questions d'exemple pour les défis
export const sampleQuestions: ChallengeQuestion[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Quelle est la capitale de la France ?",
    options: ["Paris", "Lyon", "Marseille", "Toulouse"],
    correctAnswer: 0,
    points: 1,
    explanation: "Paris est la capitale et la plus grande ville de France."
  },
  {
    id: 2,
    type: "multiple-choice", 
    question: "Combien font 7 × 8 ?",
    options: ["54", "56", "58", "60"],
    correctAnswer: 1,
    points: 1,
    explanation: "7 × 8 = 56"
  },
  {
    id: 3,
    type: "text",
    question: "Quel est le symbole chimique de l'or ?",
    correctAnswer: "Au",
    points: 2,
    explanation: "Le symbole chimique de l'or est Au, du latin 'aurum'."
  },
  {
    id: 4,
    type: "numeric",
    question: "Quelle est la racine carrée de 144 ?",
    correctAnswer: 12,
    points: 2,
    explanation: "√144 = 12 car 12 × 12 = 144"
  },
  {
    id: 5,
    type: "multiple-choice",
    question: "Qui a écrit 'Les Misérables' ?",
    options: ["Victor Hugo", "Émile Zola", "Gustave Flaubert", "Honoré de Balzac"],
    correctAnswer: 0,
    points: 1,
    explanation: "Victor Hugo a écrit 'Les Misérables' en 1862."
  },
  {
    id: 6,
    type: "multiple-choice",
    question: "Quelle est la formule de l'eau ?",
    options: ["H2O", "CO2", "NaCl", "CH4"],
    correctAnswer: 0,
    points: 1,
    explanation: "L'eau a pour formule chimique H2O : 2 atomes d'hydrogène et 1 atome d'oxygène."
  },
  {
    id: 7,
    type: "text",
    question: "Dans quelle ville se trouve la Tour Eiffel ?",
    correctAnswer: "Paris",
    points: 1,
    explanation: "La Tour Eiffel se trouve à Paris, en France."
  },
  {
    id: 8,
    type: "numeric",
    question: "Combien de côtés a un hexagone ?",
    correctAnswer: 6,
    points: 1,
    explanation: "Un hexagone est un polygone à 6 côtés."
  },
  {
    id: 9,
    type: "multiple-choice",
    question: "Quelle planète est la plus proche du Soleil ?",
    options: ["Vénus", "Mercure", "Mars", "Terre"],
    correctAnswer: 1,
    points: 1,
    explanation: "Mercure est la planète la plus proche du Soleil."
  },
  {
    id: 10,
    type: "multiple-choice",
    question: "Quelle est la langue officielle du Brésil ?",
    options: ["Espagnol", "Portugais", "Français", "Anglais"],
    correctAnswer: 1,
    points: 1,
    explanation: "Le portugais est la langue officielle du Brésil."
  }
];

export const getRandomQuestions = (count: number = 10): ChallengeQuestion[] => {
  const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, sampleQuestions.length));
};