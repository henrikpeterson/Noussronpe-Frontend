
export interface OfficialExam {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  color: string;
  examCount: number;
}

export const officialExams: OfficialExam[] = [
  {
    id: "bac1-litteraire",
    name: "BAC1 Littéraire",
    description: "Épreuves du Baccalauréat première partie série littéraire",
    subjects: ["Français", "Histoire-Géographie", "Philosophie", "Anglais"],
    color: "afrique-rouge",
    examCount: 24
  },
  {
    id: "bac1-scientifique", 
    name: "BAC1 Scientifique",
    description: "Épreuves du Baccalauréat première partie série scientifique",
    subjects: ["Mathématiques", "Physique-Chimie", "SVT", "Français"],
    color: "afrique-bleu",
    examCount: 28
  },
  {
    id: "bac2-litteraire",
    name: "BAC2 Littéraire", 
    description: "Épreuves du Baccalauréat deuxième partie série littéraire",
    subjects: ["Français", "Histoire-Géographie", "Philosophie", "Anglais"],
    color: "afrique-violet",
    examCount: 18
  },
  {
    id: "bac2-scientifique",
    name: "BAC2 Scientifique",
    description: "Épreuves du Baccalauréat deuxième partie série scientifique", 
    subjects: ["Mathématiques", "Physique-Chimie", "SVT", "Philosophie"],
    color: "afrique-vert",
    examCount: 22
  },
  {
    id: "bepc",
    name: "BEPC",
    description: "Épreuves du Brevet d'Études du Premier Cycle",
    subjects: ["Français", "Mathématiques", "Histoire-Géographie", "SVT"],
    color: "afrique-orange",
    examCount: 16
  },
  {
    id: "cepd",
    name: "CEPD", 
    description: "Épreuves du Certificat d'Études Primaires et du Diplôme",
    subjects: ["Français", "Mathématiques", "Histoire-Géographie"],
    color: "afrique-jaune",
    examCount: 12
  }
];
