
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  levels: string[];
}

export const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathématiques",
    icon: "calculator",
    color: "afrique-bleu",
    levels: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"]
  },
  {
    id: "physics",
    name: "Physique-Chimie",
    icon: "flask",
    color: "afrique-vert",
    levels: ["4ème", "3ème", "2nde", "1ère", "Terminale"]
  },
  {
    id: "french",
    name: "Français",
    icon: "book",
    color: "afrique-rouge",
    levels: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"]
  },
  {
    id: "history",
    name: "Histoire-Géographie",
    icon: "globe",
    color: "afrique-terre",
    levels: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"]
  },
  {
    id: "english",
    name: "Anglais",
    icon: "languages",
    color: "afrique-violet",
    levels: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"]
  },
  {
    id: "svt",
    name: "SVT",
    icon: "leaf",
    color: "afrique-vert",
    levels: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"]
  },
  {
    id: "philosophy",
    name: "Philosophie",
    icon: "brain",
    color: "afrique-violet",
    levels: ["Terminale"]
  },
  {
    id: "spanish",
    name: "Espagnol",
    icon: "languages",
    color: "afrique-orange",
    levels: ["4ème", "3ème", "2nde", "1ère", "Terminale"]
  }
];
