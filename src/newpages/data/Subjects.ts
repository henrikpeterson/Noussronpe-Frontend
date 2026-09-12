/**
 *CONFIGURATION DES MATIÈRES
 * 7 matières avec images, couleurs et descriptions
 */

export interface Subject {
  id: string;
  name: string;
  description: string;
  image: string;
  chapters: number;
  exercises: number;
  color: string;
  gradient: string;
  lightBg: string;
}

export const SUBJECTS: Subject[] = [
  
  {
    id: "svt",
    name: "SVT",
    description: "Découvre le vivant, l'évolution et l'environnement.",
    image: "src/assets/Subjects/SVT.webp",
    chapters: 14,
    exercises: 42,
    color: "#1310b9",
    gradient: "from-emerald-600 to-teal-600",
    lightBg: "bg-emerald-50",
  },
  {
    id: "Ang",
    name: "Anglais",
    description: "Perfectionne ta grammaire et ton vocabulaire.",
    image: "src/assets/Subjects/Anglais.webp",
    chapters: 8,
    exercises: 35,
    color: "#DC2626",
    gradient: "from-red-600 to-rose-600",
    lightBg: "bg-red-50",
  },
  {
    id: "Histo",
    name: "Histoire",
    description: "Voyage à travers les époques et civilisations.",
    image: "src/assets/Subjects/Histoire.webp",
    chapters: 11,
    exercises: 40,
    color: "#d4ff15",
    gradient: "from-amber-600 to-orange-600",
    lightBg: "bg-amber-50",
  },
  {
    id: "Geo",
    name: "Géographie",
    description: "Explore les territoires, climats et populations.",
    image: "src/assets/Subjects/Geographie.webp",
    chapters: 9,
    exercises: 30,
    color: "#0891B2",
    gradient: "from-cyan-600 to-blue-600",
    lightBg: "bg-cyan-50",
  },
  {
    id: "mathematiques",
    name: "Mathématiques",
    description: "Maîtrise les nombres, équations et géométrie.",
    image: "src/assets/Subjects/Mathematique.webp",
    chapters: 15,
    exercises: 52,
    color: "#2563EB",
    gradient: "from-blue-600 to-indigo-600",
    lightBg: "bg-blue-50",
  },
  {
    id: "PCT",
    name: "Physique Chimie",
    description: "Comprends les lois de la nature et de l'énergie.",
    image: "src/assets/Subjects/Physique.webp",
    chapters: 12,
    exercises: 45,
    color: "#ed8b3a",
    gradient: "from-purple-600 to-violet-600",
    lightBg: "bg-purple-50",
  },
];