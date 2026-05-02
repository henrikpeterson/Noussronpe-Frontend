/**
 * DONNÉES DE RÉVISION
 * Structure des matières et chapitres
 */

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  lightBg: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  status: "completed" | "current" | "locked";
  price: number;
  resume?: string;
  quiz?: Quiz;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  hint: string;
  explanation: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// ═══════════════════════════════════════════════════════════
// DONNÉES MOCK (à remplacer par tes vraies données)
// ═══════════════════════════════════════════════════════════

export const SUBJECTS: Subject[] = [
  {
    id: "mathematiques",
    name: "Mathématiques",
    icon: "Calculator",
    color: "#2563EB",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    chapters: [
      {
        id: "ch1",
        title: "Les nombres entiers",
        status: "completed",
        price: 0,
      },
      {
        id: "ch2",
        title: "Les fractions",
        status: "completed",
        price: 0,
      },
      {
        id: "ch3",
        title: "Les équations",
        status: "current",
        price: 50,
        resume: `
# Les Équations du Premier Degré

## Introduction
Une équation du premier degré est une égalité contenant une inconnue.

## Forme générale
\`ax + b = 0\` où a ≠ 0

## Méthode de résolution
1. Isoler l'inconnue
2. Simplifier
3. Diviser
        `,
        quiz: {
          question: "Résous l'équation : 2x + 7 = 15",
          options: [
            { id: "a", text: "x = 4", isCorrect: true },
            { id: "b", text: "x = 11", isCorrect: false },
            { id: "c", text: "x = 8", isCorrect: false },
            { id: "d", text: "x = 3", isCorrect: false },
          ],
          hint: "💡 Commence par soustraire 7 des deux côtés",
          explanation: "2x = 15 - 7 → 2x = 8 → x = 4",
        },
      },
      {
        id: "ch4",
        title: "Les fonctions linéaires",
        status: "locked",
        price: 100,
      },
    ],
  },
  {
    id: "francais",
    name: "Français",
    icon: "BookOpen",
    color: "#DC2626",
    gradient: "from-red-500 to-rose-600",
    lightBg: "bg-red-50",
    chapters: [
      {
        id: "ch1",
        title: "Les figures de style",
        status: "completed",
        price: 0,
      },
      {
        id: "ch2",
        title: "L'analyse de texte",
        status: "current",
        price: 50,
      },
    ],
  },
  // Ajoute les autres matières...
];

// Fonction helper pour récupérer une matière
export const getSubjectById = (id: string): Subject | undefined => {
  return SUBJECTS.find((subject) => subject.id === id);
};

// Fonction helper pour récupérer un chapitre
export const getChapterById = (
  subjectId: string,
  chapterId: string
): Chapter | undefined => {
  const subject = getSubjectById(subjectId);
  return subject?.chapters.find((chapter) => chapter.id === chapterId);
};