/**
 * MOCK DATA - Contenu des chapitres
 * 3 chapitres complets pour tests
 */

import type { ChapterContent } from '@/newpages/Components/Revision/study/types';

export const STUDY_CONTENT: Record<string, ChapterContent> = {
  
  // ═══════════════════════════════════════════════════════════
  // CHAPITRE 1 : Les nombres entiers
  // ═══════════════════════════════════════════════════════════
  
  ch1: {
    theory: {
      title: "Les nombres entiers",
      subtitle: "Comprendre les entiers naturels et relatifs",
      sections: [
        {
          type: 'paragraph',
          content: "Les nombres entiers sont la base des mathématiques. Ils représentent des quantités exactes, sans partie décimale."
        },
        {
          type: 'important',
          variant: 'blue',
          content: "💡 Un nombre entier naturel est un nombre positif ou nul : 0, 1, 2, 3, 4..."
        },
        {
          type: 'paragraph',
          content: "Les entiers relatifs incluent aussi les nombres négatifs. Ils permettent de représenter des situations comme des températures négatives ou des dettes."
        },
        {
          type: 'example',
          variant: 'green',
          content: "Exemples d'entiers relatifs : -5, -2, 0, 3, 10"
        },
        {
          type: 'quote',
          content: "Les mathématiques sont l'alphabet avec lequel Dieu a écrit l'univers. - Galilée"
        },
        {
          type: 'formula',
          content: "ℤ = {..., -3, -2, -1, 0, 1, 2, 3, ...}"
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 'q1_1',
          question: "Quel nombre n'est PAS un entier naturel ?",
          options: ["0", "5", "-3", "12"],
          correctAnswer: 2,
          explanation: "Les entiers naturels sont uniquement positifs ou nuls. -3 est un entier relatif négatif."
        },
        {
          id: 'q1_2',
          question: "Combien y a-t-il d'entiers entre -2 et 3 (bornes incluses) ?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 2,
          explanation: "Les entiers sont : -2, -1, 0, 1, 2, 3. Soit 6 nombres."
        },
        {
          id: 'q1_3',
          question: "Quelle notation représente l'ensemble des entiers relatifs ?",
          options: ["ℕ", "ℤ", "ℚ", "ℝ"],
          correctAnswer: 1,
          explanation: "ℤ (de l'allemand Zahl = nombre) désigne les entiers relatifs."
        },
        {
          id: 'q1_4',
          question: "Quel est le résultat de : -5 + 8 ?",
          options: ["-13", "-3", "3", "13"],
          correctAnswer: 2,
          explanation: "On part de -5 et on avance de 8 vers la droite : -5 + 8 = 3"
        },
        {
          id: 'q1_5',
          question: "Le nombre 0 est-il un entier naturel ?",
          options: ["Oui", "Non", "Parfois", "Ça dépend"],
          correctAnswer: 0,
          explanation: "Oui, 0 fait partie des entiers naturels (ℕ)."
        },
        {
          id: 'q1_6',
          question: "Quel est l'opposé de -7 ?",
          options: ["-7", "0", "7", "14"],
          correctAnswer: 2,
          explanation: "L'opposé d'un nombre change son signe. L'opposé de -7 est +7."
        },
        {
          id: 'q1_7',
          question: "Quelle température est la plus froide ?",
          options: ["-10°C", "-5°C", "0°C", "5°C"],
          correctAnswer: 0,
          explanation: "Plus le nombre est négatif et grand en valeur absolue, plus il est petit : -10 < -5."
        },
        {
          id: 'q1_8',
          question: "Combien font : (-3) × (-2) ?",
          options: ["-6", "-5", "5", "6"],
          correctAnswer: 3,
          explanation: "Le produit de deux nombres négatifs est positif : (-3) × (-2) = 6"
        },
        {
          id: 'q1_9',
          question: "Quel nombre est entre -4 et -2 ?",
          options: ["-5", "-3", "-1", "0"],
          correctAnswer: 1,
          explanation: "-3 est compris entre -4 et -2 sur la droite numérique."
        },
        {
          id: 'q1_10',
          question: "Le nombre 2.5 est-il un entier ?",
          options: ["Oui, c'est un entier naturel", "Oui, c'est un entier relatif", "Non", "Parfois"],
          correctAnswer: 2,
          explanation: "Non, 2.5 a une partie décimale. Ce n'est pas un entier."
        }
      ]
    },
    flashcards: {
      cards: [
        {
          id: 'f1_1',
          question: "Qu'est-ce qu'un entier naturel ?",
          answer: "Un nombre positif ou nul, sans partie décimale : 0, 1, 2, 3...",
          hint: "Pense aux nombres qu'on utilise pour compter."
        },
        {
          id: 'f1_2',
          question: "Quelle est la notation de l'ensemble des entiers relatifs ?",
          answer: "ℤ (du mot allemand Zahl qui signifie nombre)",
          hint: "C'est une lettre gothique."
        },
        {
          id: 'f1_3',
          question: "Qu'est-ce que l'opposé d'un nombre ?",
          answer: "Le nombre de signe contraire. L'opposé de 5 est -5.",
          hint: "Il suffit de changer le signe."
        },
        {
          id: 'f1_4',
          question: "Quel signe a le produit de deux nombres négatifs ?",
          answer: "Positif. Exemple : (-2) × (-3) = 6",
          hint: "Négatif × Négatif = ?"
        },
        {
          id: 'f1_5',
          question: "Le nombre 0 est-il positif ou négatif ?",
          answer: "Ni l'un ni l'autre. 0 est neutre.",
          hint: "C'est le seul nombre qui ne change pas de signe."
        }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // CHAPITRE 2 : Les fractions
  // ═══════════════════════════════════════════════════════════
  
  ch2: {
    theory: {
      title: "Les fractions",
      subtitle: "Numérateur, dénominateur et opérations",
      sections: [
        {
          type: 'paragraph',
          content: "Une fraction représente une partie d'un tout. Elle s'écrit sous la forme a/b où a est le numérateur et b le dénominateur."
        },
        {
          type: 'important',
          variant: 'blue',
          content: "💡 Le dénominateur ne peut JAMAIS être égal à zéro (division par zéro impossible)."
        },
        {
          type: 'formula',
          content: "a/b avec b ≠ 0"
        },
        {
          type: 'paragraph',
          content: "Pour additionner deux fractions, il faut d'abord les mettre au même dénominateur."
        },
        {
          type: 'example',
          variant: 'green',
          content: "1/2 + 1/3 = 3/6 + 2/6 = 5/6"
        },
        {
          type: 'important',
          variant: 'amber',
          content: "⚠️ Attention : On ne peut pas additionner directement des fractions de dénominateurs différents !"
        },
        {
          type: 'quote',
          content: "La simplicité est la sophistication suprême. - Léonard de Vinci"
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 'q2_1',
          question: "Dans la fraction 3/4, quel est le numérateur ?",
          options: ["3", "4", "7", "12"],
          correctAnswer: 0,
          explanation: "Le numérateur est le nombre du haut : 3."
        },
        {
          id: 'q2_2',
          question: "Quelle fraction est égale à 1/2 ?",
          options: ["1/4", "2/3", "2/4", "3/4"],
          correctAnswer: 2,
          explanation: "2/4 = 1/2 (on simplifie en divisant par 2)."
        },
        {
          id: 'q2_3',
          question: "Combien font 1/4 + 1/4 ?",
          options: ["1/8", "2/8", "1/2", "2/4"],
          correctAnswer: 2,
          explanation: "1/4 + 1/4 = 2/4 = 1/2"
        },
        {
          id: 'q2_4',
          question: "Peut-on écrire une fraction avec un dénominateur de 0 ?",
          options: ["Oui", "Non", "Parfois", "Seulement si le numérateur est 0"],
          correctAnswer: 1,
          explanation: "Non, la division par zéro est impossible en mathématiques."
        },
        {
          id: 'q2_5',
          question: "Quelle est la forme simplifiée de 6/8 ?",
          options: ["2/3", "3/4", "4/6", "6/8"],
          correctAnswer: 1,
          explanation: "6/8 = 3/4 (on divise numérateur et dénominateur par 2)."
        },
        {
          id: 'q2_6',
          question: "Combien font 1/2 + 1/3 ?",
          codeExample: "1/2 + 1/3 = ?",
          options: ["2/5", "3/6", "5/6", "1/6"],
          correctAnswer: 2,
          explanation: "1/2 = 3/6 et 1/3 = 2/6, donc 3/6 + 2/6 = 5/6"
        },
        {
          id: 'q2_7',
          question: "Quelle fraction représente 50% ?",
          options: ["1/4", "1/3", "1/2", "2/3"],
          correctAnswer: 2,
          explanation: "50% = 50/100 = 1/2"
        },
        {
          id: 'q2_8',
          question: "Combien font 3/5 × 2 ?",
          options: ["5/5", "6/5", "3/10", "6/10"],
          correctAnswer: 1,
          explanation: "3/5 × 2 = 3/5 × 2/1 = 6/5"
        },
        {
          id: 'q2_9',
          question: "Quelle fraction est la plus grande : 2/3 ou 3/4 ?",
          options: ["2/3", "3/4", "Elles sont égales", "Impossible à dire"],
          correctAnswer: 1,
          explanation: "2/3 = 8/12 et 3/4 = 9/12. Donc 3/4 > 2/3"
        },
        {
          id: 'q2_10',
          question: "L'inverse de 2/5 est :",
          options: ["5/2", "2/5", "-2/5", "10"],
          correctAnswer: 0,
          explanation: "L'inverse d'une fraction s'obtient en échangeant numérateur et dénominateur."
        }
      ]
    },
    flashcards: {
      cards: [
        {
          id: 'f2_1',
          question: "Qu'est-ce qu'une fraction ?",
          answer: "Une partie d'un tout, écrite sous la forme a/b",
          hint: "Pense à une pizza coupée en parts."
        },
        {
          id: 'f2_2',
          question: "Comment s'appelle le nombre du haut ?",
          answer: "Le numérateur",
          hint: "C'est celui qui 'numère', qui compte."
        },
        {
          id: 'f2_3',
          question: "Comment s'appelle le nombre du bas ?",
          answer: "Le dénominateur",
          hint: "Il 'dénomme' le nombre de parts."
        },
        {
          id: 'f2_4',
          question: "Quelle est la règle pour additionner des fractions ?",
          answer: "Les mettre au même dénominateur d'abord",
          hint: "On ne peut pas additionner des 1/2 et des 1/3 directement."
        },
        {
          id: 'f2_5',
          question: "Comment simplifier une fraction ?",
          answer: "Diviser le numérateur et le dénominateur par leur PGCD",
          hint: "Cherche un diviseur commun."
        }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // CHAPITRE 3 : Les équations
  // ═══════════════════════════════════════════════════════════
  
  ch3: {
    theory: {
      title: "Les équations du premier degré",
      subtitle: "Résoudre une équation avec une inconnue",
      sections: [
        {
          type: 'paragraph',
          content: "Une équation est une égalité contenant une inconnue (généralement notée x). Résoudre l'équation, c'est trouver la valeur de x qui rend l'égalité vraie."
        },
        {
          type: 'important',
          variant: 'blue',
          content: "💡 Règle d'or : Ce qu'on fait d'un côté de l'égalité, on doit le faire de l'autre !"
        },
        {
          type: 'example',
          variant: 'green',
          content: "Exemple : x + 5 = 12\nOn soustrait 5 de chaque côté :\nx + 5 - 5 = 12 - 5\nx = 7"
        },
        {
          type: 'formula',
          content: "ax + b = c  ⟹  x = (c - b) / a"
        },
        {
          type: 'paragraph',
          content: "Les opérations inverses sont essentielles : l'addition s'annule avec la soustraction, la multiplication avec la division."
        },
        {
          type: 'important',
          variant: 'purple',
          content: "🎯 Astuce : Toujours isoler l'inconnue d'un côté de l'égalité."
        },
        {
          type: 'quote',
          content: "En mathématiques, on ne comprend pas les choses, on s'y habitue. - John von Neumann"
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 'q3_1',
          question: "Quelle est la solution de : x + 3 = 10 ?",
          codeExample: "x + 3 = 10",
          options: ["x = 3", "x = 7", "x = 10", "x = 13"],
          correctAnswer: 1,
          explanation: "On soustrait 3 des deux côtés : x = 10 - 3 = 7"
        },
        {
          id: 'q3_2',
          question: "Quelle est la solution de : 2x = 12 ?",
          codeExample: "2x = 12",
          options: ["x = 2", "x = 6", "x = 10", "x = 24"],
          correctAnswer: 1,
          explanation: "On divise par 2 : x = 12 / 2 = 6"
        },
        {
          id: 'q3_3',
          question: "Quelle est la première étape pour résoudre : x - 5 = 8 ?",
          options: ["Multiplier par 5", "Diviser par 5", "Ajouter 5", "Soustraire 8"],
          correctAnswer: 2,
          explanation: "On ajoute 5 des deux côtés pour isoler x."
        },
        {
          id: 'q3_4',
          question: "Quelle est la solution de : x/4 = 3 ?",
          codeExample: "x/4 = 3",
          options: ["x = 0.75", "x = 3", "x = 7", "x = 12"],
          correctAnswer: 3,
          explanation: "On multiplie par 4 : x = 3 × 4 = 12"
        },
        {
          id: 'q3_5',
          question: "Si x + 7 = 15, combien vaut 2x ?",
          options: ["8", "14", "16", "22"],
          correctAnswer: 2,
          explanation: "x = 15 - 7 = 8, donc 2x = 16"
        },
        {
          id: 'q3_6',
          question: "Quelle équation a pour solution x = 5 ?",
          options: ["x + 2 = 3", "2x = 5", "x - 1 = 4", "x/5 = 1"],
          correctAnswer: 2,
          explanation: "x - 1 = 4 donne x = 5"
        },
        {
          id: 'q3_7',
          question: "Résoudre : 3x + 2 = 11",
          codeExample: "3x + 2 = 11",
          options: ["x = 2", "x = 3", "x = 4", "x = 9"],
          correctAnswer: 1,
          explanation: "3x = 11 - 2 = 9, donc x = 9/3 = 3"
        },
        {
          id: 'q3_8',
          question: "Quelle opération annule une multiplication par 5 ?",
          options: ["Addition de 5", "Soustraction de 5", "Division par 5", "Multiplication par 5"],
          correctAnswer: 2,
          explanation: "L'opération inverse de la multiplication est la division."
        },
        {
          id: 'q3_9',
          question: "Résoudre : 10 - x = 3",
          codeExample: "10 - x = 3",
          options: ["x = -7", "x = 3", "x = 7", "x = 13"],
          correctAnswer: 2,
          explanation: "-x = 3 - 10 = -7, donc x = 7"
        },
        {
          id: 'q3_10',
          question: "Si 2x + 5 = 15, quelle est la première étape ?",
          options: ["Diviser par 2", "Soustraire 5", "Ajouter 5", "Multiplier par 2"],
          correctAnswer: 1,
          explanation: "On soustrait d'abord 5 pour isoler le terme en x."
        }
      ]
    },
    flashcards: {
      cards: [
        {
          id: 'f3_1',
          question: "Qu'est-ce qu'une équation ?",
          answer: "Une égalité contenant une inconnue à trouver",
          hint: "Pense à x + 3 = 7"
        },
        {
          id: 'f3_2',
          question: "Quelle est la règle d'or pour résoudre une équation ?",
          answer: "Ce qu'on fait d'un côté, on le fait de l'autre",
          hint: "L'équilibre doit être maintenu."
        },
        {
          id: 'f3_3',
          question: "Quelle est l'opération inverse de l'addition ?",
          answer: "La soustraction",
          hint: "+3 s'annule avec -3"
        },
        {
          id: 'f3_4',
          question: "Quelle est l'opération inverse de la multiplication ?",
          answer: "La division",
          hint: "×5 s'annule avec ÷5"
        },
        {
          id: 'f3_5',
          question: "Comment résoudre : 2x = 10 ?",
          answer: "Diviser les deux côtés par 2 : x = 5",
          hint: "On isole x."
        }
      ]
    }
  }
};

// Helper function pour récupérer le contenu d'un chapitre
export function getChapterContent(chapterId: string): ChapterContent | null {
  return STUDY_CONTENT[chapterId] || null;
}