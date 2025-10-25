
export interface Exam {
  id: string;
  title: string;
  subject: string;
  level: string;
  duration: number; // En minutes
  school: string;
  year: number;
  description: string;
  type: "Exercice" | "TD" | "Épreuve";
  tags: string[];
  imageUrl?: string;
}

export const exams: Exam[] = [
  {
    id: "math-3eme-devoir1",
    title: "Devoir de Mathématiques - Théorème de Pythagore",
    subject: "math",
    level: "3ème",
    duration: 60,
    school: "Lycée d'Excellence de Dakar",
    year: 2024,
    description: "Ce devoir porte sur l'application du théorème de Pythagore et les notions de géométrie dans le plan.",
    type: "TD",
    tags: ["géométrie", "pythagore", "triangles"],
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
  },
  {
    id: "physics-1ere-devoir1",
    title: "Composition de Physique-Chimie - Forces et Mouvement",
    subject: "physics",
    level: "1ère",
    duration: 120,
    school: "Lycée Scientifique de Bamako",
    year: 2023,
    description: "Cette composition porte sur les forces, le mouvement et les lois de Newton.",
    type: "Épreuve",
    tags: ["forces", "cinématique", "dynamique"],
    imageUrl: "https://images.unsplash.com/photo-1576086476234-8f12b3c304a6"
  },
  {
    id: "french-5eme-devoir1",
    title: "Contrôle de Français - La poésie africaine",
    subject: "french",
    level: "5ème",
    duration: 90,
    school: "Collège International d'Abidjan",
    year: 2024,
    description: "Ce contrôle porte sur l'étude de poèmes d'auteurs africains et les figures de style.",
    type: "Exercice",
    tags: ["poésie", "littérature africaine", "figures de style"],
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a"
  },
  {
    id: "history-terminale-devoir1",
    title: "Bac Blanc Histoire-Géographie - Géopolitique africaine",
    subject: "history",
    level: "Terminale",
    duration: 240,
    school: "Lycée d'État de Kinshasa",
    year: 2024,
    description: "Ce bac blanc évalue les connaissances sur la géopolitique africaine post-indépendance.",
    type: "Épreuve",
    tags: ["géopolitique", "post-indépendance", "ressources"],
    imageUrl: "https://images.unsplash.com/photo-1557683311-eac922347aa1"
  },
  {
    id: "svt-4eme-devoir1",
    title: "Évaluation de SVT - Écosystèmes locaux",
    subject: "svt",
    level: "4ème",
    duration: 60,
    school: "Collège Moderne de Lomé",
    year: 2023,
    description: "Cette évaluation porte sur les écosystèmes d'Afrique de l'Ouest et la biodiversité.",
    type: "TD",
    tags: ["écosystème", "biodiversité", "environnement"],
    imageUrl: "https://images.unsplash.com/photo-1617393992386-ab41d7644188"
  },
  {
    id: "english-2nde-devoir1",
    title: "Test d'Anglais - Compréhension écrite",
    subject: "english",
    level: "2nde",
    duration: 90,
    school: "Lycée Bilingue de Yaoundé",
    year: 2024,
    description: "Ce test évalue la compréhension de textes en anglais sur des thèmes contemporains.",
    type: "Exercice",
    tags: ["compréhension", "vocabulaire", "grammaire"],
    imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721"
  }
];
